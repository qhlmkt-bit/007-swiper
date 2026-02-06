import { Resend } from 'resend';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Configuração do Firebase
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
};

// Inicializa o Firebase apenas se não estiver inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

const db = getFirestore();

// Função para gerar ID do Agente
const generateAgentId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AGENTE-${randomNum}`;
};

export default async function handler(req, res) {
  // Inicializa o Resend DENTRO da função para garantir que leia a variável atualizada
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.error("ERRO CRÍTICO: A chave RESEND_API_KEY não foi encontrada nas variáveis de ambiente.");
    return res.status(500).json({ error: 'Internal Server Configuration Error: Missing Resend Key' });
  }

  const resend = new Resend(resendApiKey);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    console.log("Recebendo Webhook Hotmart:", data);

    // Lógica para pegar o e-mail (Hotmart manda em locais diferentes dependendo da versão)
    const email = data.email || data.buyer?.email || (data.data && data.data.buyer && data.data.buyer.email);

    if (!email) {
      console.warn("E-mail não encontrado no payload da Hotmart.");
      // Retornamos 200 para a Hotmart parar de tentar enviar, já que não tem e-mail
      return res.status(200).send("No email found, skipping.");
    }

    // Verifica se usuário já existe
    const agentsRef = db.collection('agentes');
    const snapshot = await agentsRef.where('email', '==', email).get();

    if (!snapshot.empty) {
      console.log(`Usuário já existe: ${email}`);
      return res.status(200).send("User already exists");
    }

    // Cria novo Agente
    const newAgentId = generateAgentId();
    const now = new Date().toISOString();

    await agentsRef.doc(newAgentId).set({
      id: newAgentId,
      email: email,
      data_ativacao: now,
      ativo: true,
      origem: 'hotmart'
    });

    console.log(`Agente criado: ${newAgentId} para ${email}`);

    // Envia o E-mail com Resend
    await resend.emails.send({
      from: '007 Swiper <naoresponder@007swiper.com>',
      to: email,
      subject: '🕵️‍♂️ MISSÃO INICIADA: Sua Credencial de Acesso',
      html: `
        <div style="font-family: courier, monospace; background-color: #000; color: #fff; padding: 40px;">
          <h1 style="color: #D4AF37;">MISSÃO INICIADA</h1>
          <p>Agente, sua identidade operacional foi criada.</p>
          <div style="border: 1px solid #D4AF37; padding: 20px; margin: 20px 0;">
            <p><strong>ID DE ACESSO:</strong> <span style="font-size: 24px; color: #D4AF37;">${newAgentId}</span></p>
            <p><strong>LINK DE ACESSO:</strong> <a href="https://www.007swiper.com" style="color: #fff;">www.007swiper.com</a></p>
          </div>
          <p>Apague esta mensagem após a memorização.</p>
          <p style="color: #555; font-size: 10px;">QG 007 SWIPER INTELLIGENCE</p>
        </div>
      `
    });

    console.log("E-mail de credenciais enviado.");
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Erro no processamento:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
