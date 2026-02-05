import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// 1. Configura o Resend (lê a chave RESEND_API_KEY da Vercel)
const resend = new Resend(process.env.RESEND_API_KEY);

// 2. Configura o Firebase (lê as variáveis de ambiente da Vercel)
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Corrige as quebras de linha da chave privada (Crucial para Vercel)
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  };

  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  // Apenas aceita requisições POST (Padrão Kiwify)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    const orderStatus = data.order_status; // paid, refunded, chargedback
    
    // Extrai dados do Cliente
    const email = data.Customer ? data.Customer.email : null;
    const nome = data.Customer ? data.Customer.full_name : 'Agente';
    
    if (!email) {
      return res.status(400).json({ message: 'Email não encontrado' });
    }

    const emailFormatado = email.trim().toLowerCase();

    // === 1. VENDA APROVADA (CRIAR ACESSO) ===
    if (orderStatus === 'paid') {
      // Gera senha aleatória
      const agentId = `AGENTE-${Math.floor(10000 + Math.random() * 90000)}`;

      // Salva no Banco de Dados
      await db.collection('agentes').doc(agentId).set({
        id: agentId,
        email: emailFormatado,
        nome: nome,
        ativo: true,
        origem: 'Kiwify',
        data_ativacao: new Date().toISOString(),
        kiwify_order_id: data.order_id || ''
      });

      // Envia E-mail de Acesso
      await resend.emails.send({
        from: '007 Swiper <agente@007swiper.com>',
        to: emailFormatado,
        subject: '🕵️‍♂️ ACESSO CONFIDENCIAL: Sua Credencial 007 Chegou',
        html: `
          <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center;">
            <h1 style="color: #D4AF37;">ACESSO LIBERADO</h1>
            <p>Bem-vindo à central de inteligência, Agente <strong>${nome}</strong>.</p>
            <div style="background: #111; border: 1px solid #D4AF37; padding: 20px; margin: 30px auto; width: fit-content; border-radius: 10px;">
              <p style="margin:0; font-size:12px; color: #666; text-transform: uppercase;">Sua Credencial de Acesso</p>
              <h2 style="margin: 5px 0 0 0; letter-spacing: 2px; color: #fff;">${agentId}</h2>
            </div>
            <p>Clique abaixo para iniciar a operação:</p>
            <a href="https://www.007swiper.com" style="background: #D4AF37; color: #000; padding: 15px 30px; text-decoration: none; font-weight: 900; border-radius: 5px; display: inline-block;">ACESSAR PLATAFORMA</a>
          </div>
        `
      });

      return res.status(200).json({ status: 'Acesso Criado e Email Enviado' });
    }

    // === 2. REEMBOLSO / CANCELAMENTO (BLOQUEAR ACESSO) ===
    if (orderStatus === 'refunded' || orderStatus === 'chargedback') {
      // Busca o usuário pelo e-mail
      const snapshot = await db.collection('agentes').where('email', '==', emailFormatado).get();

      if (snapshot.empty) {
        return res.status(200).json({ status: 'Nenhum agente encontrado para bloquear' });
      }

      // Bloqueia o acesso
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { ativo: false, motivo_bloqueio: orderStatus });
      });
      await batch.commit();

      return res.status(200).json({ status: 'Acesso Bloqueado com Sucesso' });
    }

    return res.status(200).json({ status: 'Evento ignorado' });

  } catch (error) {
    console.error('Erro no Webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
