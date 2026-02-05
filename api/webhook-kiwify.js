// /api/webhook-kiwify.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// --- CONFIGURAÇÕES SECRETAS (Você deve configurar na Vercel em Settings > Environment Variables) ---
// FIREBASE_SERVICE_ACCOUNT: O JSON da sua conta de serviço do Firebase (não é a config pública!)
// RESEND_API_KEY: Sua chave da Resend

const resend = new Resend(process.env.RESEND_API_KEY);

// Inicializa Firebase Admin (Backend)
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const data = req.body;
  const { order_status, Customer, subscription_id } = data;
  const email = Customer.email.trim().toLowerCase();
  const nome = Customer.full_name;

  try {
    // === CENÁRIO 1: COMPRA APROVADA ===
    if (order_status === 'paid') {
      // 1. Gerar ID do Agente
      const agentId = `AGENTE-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // 2. Salvar no Firebase
      await db.collection('agentes').doc(agentId).set({
        id: agentId,
        email: email,
        nome: nome,
        ativo: true, // LIBERA O ACESSO
        origem: 'Kiwify',
        data_ativacao: new Date().toISOString(),
        subscription_id: subscription_id || 'venda_unica'
      });

      // 3. Enviar E-mail (Resend)
      await resend.emails.send({
        from: '007 Swiper <agente@007swiper.com>', // Seu remetente verificado
        to: email,
        subject: '🕵️‍♂️ MISSÃO INICIADA: Sua Credencial de Elite Chegou!',
        html: `
          <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center;">
            <h1 style="color: #D4AF37;">ACESSO LIBERADO!</h1>
            <p>Olá, Agente <strong>${nome}</strong>.</p>
            <p>Sua inteligência de mercado foi aprovada. Use sua credencial única:</p>
            <div style="background: #111; border: 1px solid #D4AF37; padding: 20px; margin: 30px auto; width: fit-content; border-radius: 10px;">
              <h2 style="margin: 0; letter-spacing: 2px;">${agentId}</h2>
            </div>
            <p>Acesse a central agora:</p>
            <a href="https://www.007swiper.com" style="background: #D4AF37; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px;">ACESSAR PLATAFORMA</a>
          </div>
        `
      });

      return res.status(200).json({ status: 'Acesso Criado e Email Enviado' });
    }

    // === CENÁRIO 2: REEMBOLSO OU CANCELAMENTO ===
    if (order_status === 'refunded' || order_status === 'chargedback') {
      // Procura o usuário pelo e-mail
      const snapshot = await db.collection('agentes').where('email', '==', email).get();
      
      if (snapshot.empty) {
        return res.status(200).json({ status: 'Usuário não encontrado para bloquear' });
      }

      // Bloqueia todos os agentes com esse e-mail (caso tenha duplicado)
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { ativo: false, status_pagamento: order_status });
      });
      await batch.commit();

      console.log(`🚫 Agente bloqueado por reembolso: ${email}`);
      return res.status(200).json({ status: 'Acesso Bloqueado com Sucesso' });
    }

    return res.status(200).json({ status: 'Evento ignorado' });

  } catch (error) {
    console.error('Erro no Webhook:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
