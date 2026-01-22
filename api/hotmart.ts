import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';

// Inicializa o Firebase Admin se ainda não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // A Hotmart envia via POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const data = req.body;
  const event = data.event; // Evento da Hotmart (ex: PURCHASE_APPROVED)
  const email = data.data?.buyer?.email;
  const status = data.data?.purchase?.status;

  console.log(`Evento recebido: ${event} para o email: ${email}`);

  // 1. LÓGICA PARA NOVA VENDA APROVADA
  if (event === 'PURCHASE_APPROVED' || status === 'APPROVED') {
    try {
      // Gera um ID aleatório padrão 007
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const agenteId = `AGENTE-${randomNum}`;

      // Salva no Firestore
      await db.collection('agentes').doc(agenteId).set({
        email: email,
        ativo: true,
        data_criacao: admin.firestore.FieldValue.serverTimestamp(),
        origem: 'hotmart'
      });

      return res.status(200).send('Agente criado com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar no Firebase:', error);
      return res.status(500).send('Erro interno.');
    }
  }

  // 2. LÓGICA PARA CANCELAMENTO OU REEMBOLSO
  if (event === 'PURCHASE_CANCELED' || event === 'PURCHASE_REFUNDED') {
     // Aqui precisaríamos buscar o ID pelo email para desativar. 
     // Por enquanto, vamos focar na criação para você começar a vender.
     return res.status(200).send('Evento de cancelamento recebido.');
  }

  return res.status(200).send('Evento ignorado.');
}
