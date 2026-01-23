import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE OFICIAL ---
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

// --- COMPONENTE RECUPERAR ID ---
const RecuperarID = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const buscarID = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(''); setResultado(null);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const snap = await getDocs(q);
      if (snap.empty) setErro('E-mail não localizado na base.');
      else setResultado(snap.docs[0].id);
    } catch (err) { setErro('Erro de conexão.'); }
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-in fade-in duration-500">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs hover:scale-105 transition-all"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-[#D4AF37] italic uppercase mb-2 text-center">Recuperar Credencial</h2>
        <form onSubmit={buscarID} className="space-y-4 mt-6">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-[#D4AF37] outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-bold p-4 rounded-xl hover:bg-white transition-all uppercase italic">Consultar</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-zinc-900 border border-[#D4AF37] rounded-2xl text-center animate-bounce"><p className="text-xs text-zinc-500 uppercase mb-2">Sua Credencial:</p><p className="text-3xl font-mono font-black text-white">{resultado}</p></div>}
        {erro && <p className="mt-4 text-red-500 text-center text-sm font-medium">{erro}</p>}
      </div>
    </div>
  );
};

// --- COMPONENTE ADMIN ---
const PainelAdmin = ({ onBack }: { onBack: () => void }) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const buscar = async () => {
      try {
        const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
        const snap = await getDocs(q);
        setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }; buscar();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white p-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="mb-8 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Sair</button>
      <h1 className="text-3xl font-black mb-10 italic uppercase tracking-tighter text-center">CENTRAL DE <span className="text-[#D4AF37]">CONTROLE</span></h1>
      {loading ? <p className="text-center animate-pulse text-[#D4AF37]">Acessando registros...</p> : (
        <div className="max-w-5xl mx-auto overflow-x-auto border border-zinc-800 rounded-3xl bg-zinc-950 shadow-2xl">
          <table className="w-full text-left"><thead className="bg-zinc-900 text-[10px] uppercase text-zinc-500 tracking-widest"><tr><th className="p-6">ID Agente</th><th className="p-6">E-mail</th><th className="p-6">Status</th></tr></thead>
            <tbody className="text-sm font-bold italic">{agentes.map(a => <tr key={a.id} className="border-b border-zinc-900"><td className="p-6 font-mono text-[#D4AF37]">{a.id}</td><td className="p-6">{a.email}</td><td className="p-6 text-green-500">ATIVO</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/** * TYPES & CONSTANTS */
export interface Offer { id: string; title: string; niche: string; language: string; trafficSource: string[]; productType: string; description: string; vslLinks: {label:string; url:string}[]; vslDownloadUrl: string; trend: string; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; status: string; addedDate: string; }
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const KIWIFY_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const KIWIFY_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; }
 body { font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; overflow-x: hidden; }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

const getEmbedUrl = (url: string) => {
 if (!url) return '';
 const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
 if (ytId) return `https://www.youtube.com/embed/${ytId[1]}`;
 return url;
};

const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black italic">{label}</span></button>
);

const LandingPage = ({ onLogin, onRecuperar, isSuccess, agentId, onDismissSuccess }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  {isSuccess && (
   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500"><div className="w-full max-w-2xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-8 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)] relative overflow-hidden"><div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#D4AF37]/30"><ShieldCheck size={48} className="text-black" /></div><h2 className="text-[#D4AF37] font-black uppercase text-2xl italic mb-4">ACESSO LIBERADO!</h2><div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-12"><p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">SUA CREDENCIAL ÚNICA</p><div className="text-white text-3xl font-black italic">{agentId}</div></div><button onClick={onDismissSuccess} className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase italic animate-btn-pulse shadow-2xl">[ACESSAR AGORA]</button></div></div>
  )}
  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center z-50 mx-auto">
   <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl"><Eye className="text-black" size={28} /></div><span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
   <div className="flex items-center gap-6">
    <button onClick={onRecuperar} className="text-gray-500 hover:text-[#D4AF37] text-[10px] font-black uppercase italic tracking-widest transition-all">Recuperar ID</button>
    <button onClick={() => onLogin()} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs italic font-bold tracking-tighter"><Lock size={14} className="inline mr-2" /> Entrar</button>
   </div>
  </nav>
  <main className="w-full max-w-7xl px-8 flex flex-col items-center text-center mt-12 mb-32 mx-auto">
   <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] italic">Inteligência de Mercado em Tempo Real</div>
   {/* FRASE CORRIGIDA BASEADA NO PRINT ORIGINAL */}
   <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic max-w-6xl">
      ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span>
   </h1>
   <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed text-center px-4">
      Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões em YouTube Ads, Facebook Ads e TikTok Ads. O fim do "achismo" na sua escala digital.
   </p>
   
   {/* VÍDEO RESTAURADO */}
   <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 shadow-2xl relative flex flex-col items-center justify-center mb-32 group cursor-pointer transition-all hover:border-[#D4AF37]/30">
      <div className="bg-[#D4AF37] p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform mb-6 shadow-2xl"><Play size={40} fill="black" className="text-black ml-1" /></div>
      <p className="text-white font-black uppercase text-[10px] md:text-xs tracking-[0.25em] italic">Descubra como rastreamos ofertas escaladas em tempo real</p>
   </section>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-40 text-left italic">
    <div className="bg-[#121212] border border-white/5 rounded-[40px] p-12 flex flex-col shadow-2xl"><h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1">PLANO MENSAL</h3><p className="text-5xl font-black text-white mb-10">R$ 197 <span className="text-sm font-normal text-zinc-500">/mês</span></p><button onClick={() => window.open(KIWIFY_MENSAL)} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-xl uppercase">QUERO ACESSO MENSAL</button></div>
    <div className="bg-white text-black rounded-[40px] p-12 flex flex-col scale-105 border-t-8 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20"><h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1">PLANO TRIMESTRAL</h3><p className="text-5xl font-black mb-10">R$ 497 <span className="text-sm font-normal text-gray-400">/tri</span></p><button onClick={() => window.open(KIWIFY_TRIMESTRAL)} className="w-full py-5 bg-black text-[#D4AF37] font-black text-xl rounded-2xl animate-btn-pulse uppercase">ASSINAR TRIMESTRAL</button></div>
   </div>

   {/* GARANTIA RESTAURADA */}
   <div className="w-full max-w-5xl mx-auto mb-40 border border-[#D4AF37]/30 rounded-[40px] p-16 flex flex-col md:flex-row items-center gap-12 text-left bg-zinc-950 shadow-2xl">
      <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-6xl md:text-8xl font-black italic text-[#D4AF37] shadow-2xl shadow-[#D4AF37]/10">7</div>
      <div className="space-y-4 flex-1">
        <h2 className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter">GARANTIA INCONDICIONAL DE <span className="text-[#D4AF37]">7 DIAS</span></h2>
        <p className="text-gray-400 text-lg md:text-xl font-medium italic leading-relaxed">Se em até 7 dias você não sentir que a plataforma é para você, devolvemos 100% do seu investimento. Sem perguntas. Risco zero para sua operação.</p>
      </div>
   </div>

   <footer className="w-full pt-12 pb-20 border-t border-white/5 text-center"><p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic">© 2026 007 SWIPER Intelligence Group. Todos os direitos reservados.</p><div onDoubleClick={() => onLogin('admin')} className="h-10 w-full opacity-0 cursor-default">.</div></footer>
  </main>
 </div>
);

/** * APP CORE */
const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');

 useEffect(() => {
  const savedId = localStorage.getItem('agente_token');
  if (savedId) checkLogin(savedId, true);
  
  const fetchOffers = async () => {
   try {
    setLoading(true);
    const res = await fetch(CSV_URL);
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const parsed: Offer[] = lines.slice(2).map((l, i) => {
     const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').trim());
     if (!v[1]) return null;
     return { id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: v[6] || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').filter(Boolean), status: (v[19] || '').toUpperCase() } as Offer;
    }).filter((o): o is Offer => o !== null);
    setOffers(parsed.filter(o => o.status === 'ATIVO').reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
  }; fetchOffers();
 }, []);

 const checkLogin = async (id: string, silencioso = false) => {
  const cleanId = id.toUpperCase().trim();
  if (!cleanId || cleanId.length < 10) return;
  try {
   const docRef = doc(db, "agentes", cleanId);
   const docSnap = await getDoc(docRef);
   if (docSnap.exists() && docSnap.data().ativo === true) {
    setAgentId(cleanId);
    setIsLoggedIn(true);
    localStorage.setItem('agente_token', cleanId);
   } else {
    if (!silencioso) alert('ACESSO NEGADO ❌\nAssinatura inválida ou inativa.');
    handleLogout();
   }
  } catch (e) { console.error(e); }
 };

 const handleLogin = async (type = 'user') => {
  if (type === 'admin') { setShowAdmin(true); return; }
  const inputId = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE:");
  if (inputId) checkLogin(inputId);
 };

 const handleLogout = () => { setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); };
 
 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 const renderContent = () => {
  if (loading) return <div className="py-40 text-center animate-pulse text-[#D4AF37] font-black uppercase italic tracking-widest">Infiltrando servidores...</div>;
  
  if (selectedOffer) return (
   <div className="space-y-12 animate-in fade-in duration-500 italic">
    <button onClick={() => setSelectedOffer(null)} className="flex items-center text-zinc-600 hover:text-[#D4AF37] font-black uppercase text-xs tracking-widest"><ArrowLeft size={16} className="mr-3"/> Voltar</button>
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
     <div className="w-full lg:w-[65%] space-y-6">
      <div className="bg-[#121212] p-6 rounded-[40px] border border-white/5 shadow-2xl h-full flex flex-col">
       <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-[#D4AF37]/5"><iframe className="w-full h-full" src={getEmbedUrl(selectedOffer.vslLinks[0]?.url)} frameBorder="0" allowFullScreen></iframe></div>
       <div className="mt-8 p-10 bg-[#1a1a1a] rounded-[40px] border border-white/5"><h3 className="text-[#D4AF37] font-black uppercase text-[10px] mb-6 tracking-[0.2em] italic border-l-2 border-[#D4AF37] pl-4">Dossiê de Campo</h3><p className="text-zinc-400 font-medium italic leading-relaxed text-lg break-words">{selectedOffer.description || "Análise detalhada em processamento..."}</p></div>
      </div>
     </div>
     <div className="w-full lg:w-[35%] space-y-6">
      <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5 h-full space-y-10 shadow-2xl">
       <h3 className="text-zinc-700 font-black uppercase text-[10px] tracking-[0.3em] border-l-2 border-zinc-800 pl-4 italic">Dossiê da Operação</h3>
       {[{icon: Tag, label: 'Nicho', value: selectedOffer.niche}, {icon: Lock, label: 'Estrutura', value: selectedOffer.productType}, {icon: Globe, label: 'Idioma', value: selectedOffer.language}].map((item, i) => (
        <div key={i} className="flex flex-col gap-2 border-b border-white/5 pb-6"><div className="flex items-center gap-3 text-zinc-800 uppercase text-[9px] font-black"><item.icon size={14}/> {item.label}</div><p className="text-white font-black italic uppercase text-base">{item.value}</p></div>
       ))}
       <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 btn-elite rounded-2xl text-center text-sm font-black shadow-2xl">VISUALIZAR PÁGINA</a>
       <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full py-5 bg-[#1a1a1a] border border-white/10 rounded-2xl text-center text-xs font-black text-zinc-600 hover:text-white transition-all italic">ADS LIBRARY</a>
      </div>
     </div>
    </div>
    <div className="space-y-8 pt-10 px-2">
       <h3 className="text-white font-black uppercase italic text-2xl flex items-center gap-4"><ImageIcon className="text-[#D4AF37]" size={28}/> Criativos Infiltrados</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {selectedOffer.creativeEmbedUrls.map((url, i) => (
          <div key={i} className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-5 shadow-2xl hover:border-[#D4AF37]/30 transition-all">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"><iframe className="w-full h-full" src={getEmbedUrl(url)} frameBorder="0" allowFullScreen></iframe></div>
            <a href={selectedOffer.creativeDownloadUrls[i]} target="_blank" className="block w-full py-4 bg-[#1a1a1a] border border-[#D4AF37]/20 text-[#D4AF37] rounded-2xl text-center font-black text-[10px] uppercase hover:bg-[#D4AF37] hover:text-black transition-all italic shadow-inner">Baixar Criativo VIP</a>
          </div>
        ))}
       </div>
    </div>
   </div>
  );

  const filtered = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-in fade-in duration-700">
    {(currentPage === 'home' ? filtered : filtered.filter(o => favorites.includes(o.id))).map((o) => (
     <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e:any) => { e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id]) }} onClick={() => { setSelectedOffer(o); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    ))}
   </div>
  );
 };

 return (
  <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <div className="flex">
     <aside className="w-80 bg-[#121212] border-r border-white/5 h-screen sticky top-0 p-10 flex flex-col shadow-2xl">
      <div className="flex items-center space-x-4 mb-16 cursor-pointer group" onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}}>
        <div className="bg-[#D4AF37] p-2.5 rounded-2xl shadow-xl shadow-[#D4AF37]/10 group-hover:scale-110 transition-transform shadow-2xl"><Eye className="text-black" size={26} /></div>
        <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">007 SWIPER</span>
      </div>
      <nav className="space-y-4 flex-1">
       <SidebarItem icon={HomeIcon} label="Home Radar" active={currentPage === 'home'} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
       <SidebarItem icon={Star} label="Dossiês Salvos" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setSelectedOffer(null)}} />
       <SidebarItem icon={Tag} label="Banco de Dados" active={currentPage === 'offers'} onClick={() => {setCurrentPage('offers'); setSelectedOffer(null)}} />
      </nav>
      <div className="pt-10 border-t border-white/5">
        <div className="bg-[#1a1a1a] p-5 rounded-2xl mb-8 border border-white/5 shadow-inner"><p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1 italic">Operador Identificado</p><p className="text-[#D4AF37] font-mono text-[10px] font-black truncate uppercase">{agentId}</p></div>
        <SidebarItem icon={LogOut} label="Encerrar Missão" active={false} onClick={handleLogout} variant="danger" />
      </div>
     </aside>
     <main className="flex-1 p-16 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent">
      <header className="flex justify-between items-center mb-20 italic">
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Radar de <span className="text-[#D4AF37]">Inteligência</span></h1>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-hover:text-[#D4AF37] transition-colors" size={18}/>
          <input type="text" placeholder="RASTREAR OFERTA..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#121212] border border-white/5 pl-14 pr-6 py-5 rounded-2xl w-[400px] font-black text-xs italic focus:border-[#D4AF37] outline-none transition-all shadow-inner placeholder:text-zinc-800" />
        </div>
      </header>
      {renderContent()}
     </main>
    </div>
   ) : (
    <LandingPage 
      onLogin={handleLogin} 
      onRecuperar={() => setShowRecuperar(true)} 
      isSuccess={false} 
      agentId={agentId} 
      onDismissSuccess={() => {}} 
    />
   )}
  </div>
 );
};

export default App;
