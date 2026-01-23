import React, { useState, useEffect } from 'react';
import { 
 Home as HomeIcon, Star, Tag, Search, LogOut, Monitor, Eye, Lock, Download, Zap, ShieldCheck, CheckCircle, Play, Facebook, ImageIcon, Layout, Globe, ArrowLeft, Loader2, Copy
} from 'lucide-react';

// --- FIREBASE OFICIAL ---
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyAF94806dAwkSvPJSVHglfYMm9vE1Rnei4",
 authDomain: "swiper-db-21c6f.firebaseapp.com",
 projectId: "swiper-db-21c6f",
 storageBucket: "swiper-db-21c6f.firebasestorage.app",
 messagingSenderId: "235296129520",
 appId: "1:235296129520:web:612a9c5444064ce5b11d35",
 measurementId: "G-SGQY0W9CWC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- ESTILOS ---
const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; }
 body { font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; overflow-x: hidden; }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; }
 .btn-elite:hover { transform: scale(1.02); filter: brightness(1.1); }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-pulse-gold { animation: btnPulse 2s infinite; }
`;

// --- COMPONENTE RECUPERAR ID ---
const RecuperarID = ({ onBack }: any) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const buscar = async (e: any) => {
    e.preventDefault(); setErro(''); setResultado(null);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const snap = await getDocs(q);
      if (snap.empty) setErro('E-mail não encontrado.');
      else setResultado(snap.docs[0].id);
    } catch { setErro('Erro na conexão.'); }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 animate-in fade-in">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] font-black uppercase italic text-xs flex items-center gap-2"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-10 rounded-[40px] shadow-2xl">
        <h2 className="text-2xl font-black text-[#D4AF37] italic uppercase mb-8 text-center">Resgatar Credencial</h2>
        <form onSubmit={buscar} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl outline-none focus:border-[#D4AF37]" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-black p-5 rounded-2xl uppercase italic">Consultar</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-zinc-900 border border-[#D4AF37] rounded-3xl text-center"><p className="text-xs text-zinc-500 uppercase mb-2">Seu ID:</p><p className="text-3xl font-black">{resultado}</p></div>}
        {erro && <p className="mt-4 text-red-500 text-center font-bold">{erro}</p>}
      </div>
    </div>
  );
};

// --- COMPONENTE ADMIN ---
const PainelAdmin = ({ onBack }: any) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  useEffect(() => {
    getDocs(query(collection(db, "agentes"), orderBy("data_ativacao", "desc")))
      .then(snap => setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);
  return (
    <div className="min-h-screen bg-black text-white p-10 animate-in fade-in">
      <button onClick={onBack} className="mb-10 text-[#D4AF37] font-black uppercase text-xs flex items-center gap-2"><ArrowLeft size={16}/> Sair</button>
      <h1 className="text-3xl font-black mb-10 italic uppercase">Central <span className="text-[#D4AF37]">Comando</span></h1>
      <div className="border border-white/5 rounded-3xl overflow-hidden bg-[#121212] shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] text-zinc-500 uppercase tracking-widest"><tr><th className="p-6">ID AGENTE</th><th className="p-6">E-MAIL</th></tr></thead>
          <tbody>{agentes.map(a => <tr key={a.id} className="border-b border-white/5"><td className="p-6 font-mono text-[#D4AF37]">{a.id}</td><td className="p-6 font-bold">{a.email}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [showRecuperar, setShowRecuperar] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';

  useEffect(() => {
    const saved = localStorage.getItem('agente_token');
    if (saved) { setAgentId(saved); setIsLoggedIn(true); }
    
    fetch(CSV_URL).then(r => r.text()).then(text => {
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      const parsed = lines.slice(2).map((l, i) => {
        const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
        if (!v[1]) return null;
        return { id: v[0] || String(i), title: v[1], niche: v[2], productType: v[3], description: v[4], coverImage: v[5], vslUrl: v[8], pageUrl: v[14], fbUrl: v[13], status: v[19]?.toUpperCase() };
      }).filter(o => o && o.status === 'ATIVO');
      setOffers(parsed.reverse());
      setLoading(false);
    });
  }, []);

  const handleLogin = async (type = 'user') => {
    if (type === 'admin') { setShowAdmin(true); return; }
    const id = window.prompt("DIGITE SEU ID:");
    if (!id || id.length < 5) return;
    
    const docRef = doc(db, "agentes", id.toUpperCase().trim());
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().ativo) {
      setAgentId(id.toUpperCase().trim());
      setIsLoggedIn(true);
      localStorage.setItem('agente_token', id.toUpperCase().trim());
    } else {
      alert("ACESSO NEGADO ❌");
    }
  };

  const getEmbed = (url: string) => {
    if (!url) return '';
    const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return ytId ? `https://www.youtube.com/embed/${ytId[1]}` : url;
  };

  if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
  if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

  if (!isLoggedIn) return (
    <div className="w-full bg-[#0a0a0a]">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <nav className="max-w-7xl px-8 py-10 flex justify-between items-center mx-auto">
        <div className="flex items-center gap-3"><Eye className="text-[#D4AF37]" size={28} /><span className="text-2xl font-black italic">007 SWIPER</span></div>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowRecuperar(true)} className="text-zinc-500 font-black text-[10px] uppercase hover:text-[#D4AF37]">Recuperar ID</button>
          <button onClick={() => handleLogin()} className="px-8 py-3 bg-[#D4AF37] text-black font-black rounded-full text-xs italic"><Lock size={14} className="inline mr-2" /> Entrar</button>
        </div>
      </nav>
      <main className="max-w-7xl px-8 py-20 text-center mx-auto italic">
        <h1 className="text-5xl md:text-8xl font-black mb-10 leading-none">ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
        <p className="text-zinc-500 text-xl max-w-4xl mx-auto mb-20">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões. O fim do "achismo" na sua escala digital.</p>
        <section className="max-w-4xl mx-auto aspect-video bg-[#121212] rounded-[40px] border border-white/10 flex items-center justify-center mb-32 relative overflow-hidden group">
          <Play size={64} className="text-[#D4AF37] animate-pulse-gold z-10" fill="currentColor"/>
          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-all" />
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-32 text-left">
          <div className="bg-[#121212] p-12 rounded-[40px] border border-white/5 shadow-2xl">
            <h3 className="text-[#D4AF37] font-black uppercase text-xl mb-4 italic">Plano Mensal</h3>
            <p className="text-5xl font-black mb-10">R$ 197 <span className="text-sm font-normal">/mês</span></p>
            <button onClick={() => window.open('https://pay.hotmart.com/H104019113G?bid=1769103375372')} className="w-full py-5 bg-white text-black font-black rounded-2xl italic">Quero Acesso</button>
          </div>
          <div className="bg-white text-black p-12 rounded-[40px] border-t-8 border-[#D4AF37] scale-105 shadow-2xl">
            <h3 className="text-[#D4AF37] font-black uppercase text-xl mb-4 italic">Plano Trimestral</h3>
            <p className="text-5xl font-black mb-10">R$ 497 <span className="text-sm font-normal">/tri</span></p>
            <button onClick={() => window.open('https://pay.hotmart.com/H104019113G?off=fc7oudim')} className="w-full py-5 bg-black text-[#D4AF37] font-black rounded-2xl animate-pulse-gold italic">Assinar Agora</button>
          </div>
        </div>
        <div className="bg-[#050505] border border-[#D4AF37]/30 rounded-[40px] p-16 flex items-center gap-12 text-left mb-40 shadow-2xl">
          <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-6xl font-black text-[#D4AF37]">7</div>
          <div className="flex-1"><h2 className="text-3xl font-black mb-2 uppercase">Garantia de 7 Dias</h2><p className="text-zinc-500 text-lg">Risco zero para sua operação. Se não gostar, devolvemos 100%.</p></div>
        </div>
        <footer className="pt-20 border-t border-white/5"><p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">© 2026 007 SWIPER Intelligence Group</p><div onDoubleClick={() => handleLogin('admin')} className="h-10 opacity-0 cursor-default">.</div></footer>
      </main>
    </div>
  );

  const filtered = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-black">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <aside className="w-72 bg-[#121212] border-r border-white/5 p-10 h-screen sticky top-0 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-16"><Eye className="text-[#D4AF37]" size={24} /><span className="font-black italic">007 SWIPER</span></div>
        <nav className="space-y-6 flex-1 italic font-black uppercase text-xs">
          <div onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} className={`cursor-pointer ${currentPage === 'home' ? 'text-[#D4AF37]' : 'text-zinc-500 hover:text-white'}`}>Dashboard</div>
          <div onClick={() => setCurrentPage('favs')} className={`cursor-pointer ${currentPage === 'favs' ? 'text-[#D4AF37]' : 'text-zinc-500 hover:text-white'}`}>Favoritos</div>
        </nav>
        <button onClick={() => {localStorage.removeItem('agente_token'); setIsLoggedIn(false)}} className="mt-auto text-red-500 font-black text-xs uppercase italic flex items-center gap-2"><LogOut size={16}/> Sair</button>
      </aside>
      <main className="flex-1 p-12">
        <header className="flex justify-between items-center mb-16 italic font-black">
          <h1 className="text-3xl uppercase tracking-tighter">Radar <span className="text-[#D4AF37]">Operacional</span></h1>
          <input type="text" placeholder="RASTREAR..." className="bg-[#121212] border border-white/5 p-4 rounded-2xl w-80 text-xs outline-none focus:border-[#D4AF37]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </header>
        {loading ? (
          <div className="animate-pulse text-[#D4AF37] font-black uppercase text-center py-20 tracking-widest">Interceptando pacotes de dados...</div>
        ) : selectedOffer ? (
          <div className="animate-in fade-in space-y-12">
            <button onClick={() => setSelectedOffer(null)} className="text-zinc-500 font-black uppercase text-xs flex items-center gap-2"><ArrowLeft size={16}/> Voltar</button>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-[65%] space-y-8">
                <div className="aspect-video bg-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl shadow-[#D4AF37]/5"><iframe className="w-full h-full" src={getEmbed(selectedOffer.vslUrl)} frameBorder="0" allowFullScreen></iframe></div>
                <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5 shadow-2xl"><h3 className="text-[#D4AF37] font-black uppercase text-xs italic mb-4">Dossiê Técnico</h3><p className="text-zinc-400 leading-relaxed italic">{selectedOffer.description || "Descrição em análise..."}</p></div>
              </div>
              <div className="lg:w-[35%] bg-[#121212] p-10 rounded-[40px] border border-white/5 h-fit space-y-8 shadow-2xl italic">
                <h3 className="text-zinc-700 font-black uppercase text-[10px] tracking-widest italic">Dossiê da Operação</h3>
                <div className="border-b border-white/5 pb-4"><p className="text-zinc-800 text-[9px] font-black uppercase">NICHO</p><p className="text-white font-black">{selectedOffer.niche}</p></div>
                <div className="border-b border-white/5 pb-4"><p className="text-zinc-800 text-[9px] font-black uppercase">ESTRUTURA</p><p className="text-white font-black">{selectedOffer.productType}</p></div>
                <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl text-center shadow-xl">VISUALIZAR PÁGINA</a>
                <a href={selectedOffer.fbUrl} target="_blank" className="block w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-center hover:bg-white hover:text-black transition-all">ADS LIBRARY</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(currentPage === 'home' ? filtered : filtered.filter(o => favorites.includes(o.id))).map(o => (
              <div key={o.id} onClick={() => setSelectedOffer(o)} className="bg-[#121212] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/50 transition-all cursor-pointer group">
                <div className="aspect-video relative overflow-hidden"><img src={o.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /><div className="absolute top-4 right-4"><button onClick={(e) => {e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id])}} className={`p-2 rounded-xl ${favorites.includes(o.id) ? 'bg-[#D4AF37] text-black' : 'bg-black/50 text-white'}`}><Star size={16} fill={favorites.includes(o.id) ? "currentColor" : "none"}/></button></div></div>
                <div className="p-6 font-black italic uppercase"><h3 className="text-white truncate mb-2">{o.title}</h3><p className="text-[#D4AF37] text-[10px]">{o.niche}</p></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
