import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// 1. Configura o Resend (Pega a chave segura da Vercel)
const resend = new Resend(process.env.RESEND_API_KEY);

// 2. Configura o Firebase (Usa as mesmas variáveis da Kiwify)
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  };

  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  // Hotmart também envia via POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Chave de segurança (Opcional: Hotmart Token) - Por enquanto deixamos aberto para facilitar
  const token = req.headers['x-hotmart-hottok']; 
  
  try {
    const payload = req.body;
    const evento = payload.event; // Ex: PURCHASE_APPROVED, PURCHASE_REFUNDED
    
    // Proteção contra payload vazio
    if (!payload.data || !payload.data.buyer) {
      return res.status(200).json({ message: 'Ping ou teste ignorado' });
    }

    const email = payload.data.buyer.email.trim().toLowerCase();
    const nome = payload.data.buyer.name || 'Agente';

    console.log(`Evento Hotmart: ${evento} para ${email}`);

    // === CENÁRIO 1: VENDA APROVADA (LIBERA ACESSO) ===
    if (evento === 'PURCHASE_APPROVED' || evento === 'PURCHASE_COMPLETE') {
      
      const agentId = `AGENTE-${Math.floor(10000 + Math.random() * 90000)}`;

      // Salva no Firebase
      await db.collection('agentes').doc(agentId).set({
        id: agentId,
        email: email,
        nome: nome,
        ativo: true,
        origem: 'Hotmart',
        data_ativacao: new Date().toISOString(),
        hotmart_transaction: payload.id || ''
      });

      // Envia E-mail
      await resend.emails.send({
        from: '007 Swiper <agente@007swiper.com>',
        to: email,
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

      return res.status(200).json({ success: true, message: 'Acesso Criado' });
    }

    // === CENÁRIO 2: CANCELAMENTO / REEMBOLSO (BLOQUEIA ACESSO) ===
    // Eventos: Reembolso, Chargeback, Cancelamento de Assinatura, Expiração
    const eventosBloqueio = [
        'PURCHASE_REFUNDED', 
        'PURCHASE_CHARGEBACK_COMPLETED', 
        'SUBSCRIPTION_CANCELLATION',
        'SUBSCRIPTION_CANCELED_BY_PRODUCER'
    ];

    if (eventosBloqueio.includes(evento)) {
      // Busca o agente pelo e-mail
      const snapshot = await db.collection('agentes').where('email', '==', email).get();

      if (snapshot.empty) {
        return res.status(200).json({ message: 'Agente não encontrado para bloqueio' });
      }

      // Bloqueia
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { ativo: false, motivo_bloqueio: evento });
      });
      await batch.commit();

      console.log(`🚫 Agente bloqueado (Hotmart): ${email}`);
      return res.status(200).json({ success: true, message: 'Acesso Bloqueado' });
    }

    return res.status(200).json({ message: 'Evento ignorado' });

  } catch (error) {
    console.error("ERRO WEBHOOK HOTMART:", error);
    return res.status(500).json({ error: error.message });
  }
}
