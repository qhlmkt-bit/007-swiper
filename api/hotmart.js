import { Resend } from 'resend';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const resend = new Resend('re_PyaW24wC_3rcrXYBC1UPzjpyziR1ukS7K');

const firebaseConfig = {
  apiKey: "AIzaSyAF94806dAwkSvPJSVHglfYMm9vE1Rnei4",
  authDomain: "swiper-db-21c6f.firebaseapp.com",
  projectId: "swiper-db-21c6f",
  storageBucket: "swiper-db-21c6f.firebasestorage.app",
  messagingSenderId: "235296129520",
  appId: "1:235296129520:web:612a9c5444064ce5b11d35"
};

// Inicializa o Firebase apenas uma vez
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  // Log para depuração no painel da Vercel
  console.log("Recebendo dados da Hotmart...");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload = req.body;

    // Verificamos os eventos de aprovação da Hotmart
    if (payload.event === 'PURCHASE_APPROVED' || payload.event === 'PURCHASE_COMPLETE') {
      const emailCliente = payload.data.buyer.email;
      const nomeCliente = payload.data.buyer.name || 'Agente';
      
      // Gerar ID do Agente
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const idAgente = `AGENTE-${randomNum}`;

      // 1. Salvar no Firebase Firestore
      await setDoc(doc(db, "agentes", idAgente), {
        email: emailCliente,
        nome: nomeCliente,
        ativo: true,
        data_ativacao: new Date().toISOString(),
        origem: "Automação Hotmart"
      });

      // 2. Enviar E-mail via Resend
      await resend.emails.send({
        from: '007 Swiper <onboarding@resend.dev>',
        to: emailCliente,
        subject: '🕵️ MISSÃO INICIADA: Sua Credencial de Elite Chegou!',
        html: `
          <div style="background-color: #0a0a0a; color: #ffffff; padding: 40px; font-family: sans-serif; border: 1px solid #D4AF37; border-radius: 20px; max-width: 500px; margin: auto;">
            <h1 style="color: #D4AF37; text-transform: uppercase; font-style: italic;">Acesso Liberado!</h1>
            <p>Olá, Agente. Sua inteligência de mercado foi aprovada. Use sua credencial única:</p>
            <div style="background-color: #121212; border: 1px solid #333; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
              <span style="font-size: 32px; font-weight: bold; font-family: monospace;">${idAgente}</span>
            </div>
            <p style="text-align: center;">
              <a href="https://007swiper.com" style="background-color: #D4AF37; color: #000; padding: 15px 25px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">[ACESSAR AGORA]</a>
            </p>
          </div>
        `
      });

      console.log(`Sucesso! ${idAgente} gerado para ${emailCliente}`);
      return res.status(200).json({ success: true, message: `Agente ${idAgente} ativado.` });
    }

    return res.status(200).json({ message: 'Evento recebido e ignorado.' });

  } catch (error) {
    console.error("ERRO NO WEBHOOK:", error.message);
    // Retornamos o erro para a Hotmart saber que precisa tentar de novo se for o caso
    return res.status(500).json({ error: error.message });
  }
}
