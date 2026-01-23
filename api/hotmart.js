import { Resend } from 'resend';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// CONFIGURAÇÕES DE ELITE
const resend = new Resend('re_PyaW24wC_3rcrXYBC1UPzjpyziR1ukS7'); 

const firebaseConfig = {
  apiKey: "AIzaSyAF94806dAwkSvPJSVHglfYMm9vE1Rnei4",
  authDomain: "swiper-db-21c6f.firebaseapp.com",
  projectId: "swiper-db-21c6f",
  storageBucket: "swiper-db-21c6f.firebasestorage.app",
  messagingSenderId: "235296129520",
  appId: "1:235296129520:web:612a9c5444064ce5b11d35"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Apenas método POST permitido' });
  }

  const payload = req.body;

  // Verificamos se a compra foi aprovada ou completa
  if (payload.event === 'PURCHASE_APPROVED' || payload.event === 'PURCHASE_COMPLETE') {
    const emailCliente = payload.data.buyer.email;
    const nomeCliente = payload.data.buyer.name || 'Agente';
    
    // Gerar ID do Agente (Ex: AGENTE-74839)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const idAgente = `AGENTE-${randomNum}`;

    try {
      // 1. Criar o login no Firebase
      await setDoc(doc(db, "agentes", idAgente), {
        email: emailCliente,
        nome: nomeCliente,
        ativo: true,
        data_ativacao: new Date().toISOString(),
        origem: "Hotmart Automático"
      });

      // 2. Enviar o E-mail de Boas-vindas (Design Preto e Dourado)
      await resend.emails.send({
        from: '007 Swiper <onboarding@resend.dev>',
        to: emailCliente,
        subject: '🕵️ MISSÃO INICIADA: Sua Credencial de Elite Chegou!',
        html: `
          <div style="background-color: #0a0a0a; color: #ffffff; padding: 50px; font-family: sans-serif; border: 1px solid #D4AF37; border-radius: 24px; max-width: 600px; margin: auto;">
            <h1 style="color: #D4AF37; font-style: italic; text-transform: uppercase;">Acesso Liberado, Agente!</h1>
            <p style="font-size: 16px; color: #a0a0a0;">Sua inteligência de mercado foi aprovada. Você já pode acessar o arsenal completo da 007 Swiper.</p>
            
            <div style="background-color: #121212; border: 1px solid #222; padding: 30px; border-radius: 16px; text-align: center; margin: 40px 0;">
              <p style="text-transform: uppercase; font-size: 10px; color: #555; margin-bottom: 10px;">Sua Credencial Única e Privada</p>
              <span style="font-size: 36px; font-weight: bold; color: #ffffff; font-family: monospace;">${idAgente}</span>
            </div>

            <p style="text-align: center;">
              <a href="https://007swiper.com" style="background-color: #D4AF37; color: #000; padding: 18px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase; display: inline-block;">[ACESSAR ARSENAL AGORA]</a>
            </p>

            <hr style="border: 0; border-top: 1px solid #222; margin: 40px 0;">
            <p style="font-size: 11px; color: #444; text-align: center;">ID Operacional para: ${emailCliente}.<br>Esta mensagem é confidencial.</p>
          </div>
        `
      });

      return res.status(200).json({ success: true, agent: idAgente });

    } catch (error) {
      console.error('Erro:', error);
      return res.status(500).json({ error: 'Erro interno na Central' });
    }
  }

  return res.status(200).json({ message: 'Evento recebido.' });
}
