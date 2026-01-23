import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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

export default function RecuperarID() {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  const buscarID = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);

    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setErro('Nenhuma credencial encontrada para este e-mail.');
      } else {
        const dados = querySnapshot.docs[0].id;
        setResultado(dados);
      }
    } catch (err) {
      setErro('Erro na conexão com a central.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-[#D4AF37] italic uppercase mb-2">Recuperar Credencial</h2>
        <p className="text-zinc-500 text-sm mb-6">Insira o e-mail usado na compra para resgatar seu ID de Agente.</p>
        
        <form onSubmit={buscarID} className="space-y-4">
          <input 
            type="email" 
            placeholder="seu@email.com"
            className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-[#D4AF37] outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-[#D4AF37] text-black font-bold p-4 rounded-xl hover:bg-white transition-all uppercase tracking-widest">
            Consultar Base de Dados
          </button>
        </form>

        {resultado && (
          <div className="mt-8 p-6 bg-zinc-900 border border-[#D4AF37] rounded-2xl text-center">
            <p className="text-xs text-zinc-500 uppercase mb-2">Sua Credencial é:</p>
            <p className="text-3xl font-mono font-black text-white">{resultado}</p>
          </div>
        )}

        {erro && <p className="mt-4 text-red-500 text-center text-sm font-medium">{erro}</p>}
      </div>
    </div>
  );
}
