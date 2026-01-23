import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';

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

export default function PainelAdmin() {
  const [agentes, setAgentes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarAgentes = async () => {
      try {
        const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAgentes(lista);
      } catch (err) {
        console.error("Erro ao carregar base de dados", err);
      } finally {
        setCarregando(false);
      }
    };
    buscarAgentes();
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              Central de <span className="text-[#D4AF37]">Controle</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Acesso Restrito - Nível 007</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{agentes.length}</p>
            <p className="text-[10px] uppercase text-zinc-600">Agentes Ativos</p>
          </div>
        </header>

        {carregando ? (
          <p className="text-center py-20 animate-pulse text-[#D4AF37]">Acedendo aos servidores seguros...</p>
        ) : (
          <div className="overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-950">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-[10px] uppercase tracking-widest text-zinc-500">
                  <th className="p-4 border-b border-zinc-800">Agente (ID)</th>
                  <th className="p-4 border-b border-zinc-800">E-mail do Operador</th>
                  <th className="p-4 border-b border-zinc-800">Ativação</th>
                  <th className="p-4 border-b border-zinc-800">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {agentes.map((agente) => (
                  <tr key={agente.id} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#D4AF37]">{agente.id}</td>
                    <td className="p-4 text-white">{agente.email}</td>
                    <td className="p-4 text-zinc-500">
                      {agente.data_ativacao ? new Date(agente.data_ativacao).toLocaleDateString('pt-BR') : '---'}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-900/20 text-green-500 text-[10px] font-bold rounded-full uppercase border border-green-900/30">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
