import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE OFICIAL (SEGURANÇA MÁXIMA) ---
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
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-[#D4AF37] italic uppercase mb-2 text-center">Recuperar Credencial</h2>
        <form onSubmit={buscarID} className="space-y-4 mt-6">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-[#D4AF37] outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-bold p-4 rounded-xl hover:bg-white transition-all uppercase italic">Consultar</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-zinc-900 border border-[#D4AF37] rounded-2xl text-center"><p className="text-xs text-zinc-500 uppercase mb-2">Seu ID:</p><p className="text-3xl font-mono font-black text-white">{resultado}</p></div>}
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
            <tbody className="text-sm">{agentes.map(a => <tr key={a.id} className="border-b border-zinc-900"><td className="p-6 font-mono text-[#D4AF37] font-bold">{a.id}</td><td className="p-6">{a.email}</td><td className="p-6 text-green-500 font-bold">ATIVO</td></tr>)}</tbody>
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
 const vId = url.match(/vimeo\.com\/([0-9]+)/);
 if (vId) return `https://player.vimeo.com/video/${vId[1]}?title=0&byline=0&portrait=0`;
 const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
 if (ytId) return `https://www.youtube.com/embed/${ytId[1]}`;
 return url;
};

/** * COMPONENTS */
const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black">{label}</span></button>
);

const VideoPlayer = ({ url }: any) => {
 const embed = getEmbedUrl(url);
 if (!embed) return <div className="w-full h-full flex items-center justify-center text-gray-700 bg-[#1a1a1a] rounded-2xl border border-dashed border-white/10 uppercase italic text-xs">Visualização indisponível</div>;
 return <iframe className="w-full h-full" src={embed} frameBorder="0" allowFullScreen></iframe>;
};

const OfferCard = ({ offer, isFavorite, onToggleFavorite, onClick }: any) => (
 <div onClick={onClick} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all shadow-xl">
  <div className="relative aspect-video overflow-hidden"><img src={offer.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-[#D4AF37] text-[10px] font-black rounded uppercase">007 VIP</div><div className="absolute top-3 right-3"><button onClick={onToggleFavorite} className={`p-2 rounded-xl ${isFavorite ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-white'}`}><Star size={18} fill={isFavorite ? "currentColor" : "none"} /></button></div><div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase">{offer.niche}</div></div>
  <div className="p-5"><h3 className="font-black text-white mb-4 line-clamp-1 text-lg uppercase group-hover:text-[#D4AF37] italic">{offer.title}</h3><div className="flex items-center justify-between border-t border-white/5 pt-4 text-[9px] font-bold text-gray-500 uppercase"><span>{offer.productType}</span><span>{offer.trafficSource[0]}</span></div></div>
 </div>
);

const LandingPage = ({ onLogin, onRecuperar, isSuccess, agentId, onDismissSuccess }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  {isSuccess && (
   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500"><div className="w-full max-w-2xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-8 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)]"><div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"><ShieldCheck size={48} className="text-black" /></div><h2 className="text-[#D4AF37] font-black uppercase text-2xl italic mb-4">ACESSO LIBERADO!</h2><div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-12"><p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">SUA CREDENCIAL ÚNICA</p><div className="text-white text-3xl font-black italic">{agentId}</div></div><button onClick={onDismissSuccess} className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase italic animate-btn-pulse">[ACESSAR AGORA]</button></div></div>
  )}
  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center mx-auto z-50">
   <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3"><Eye className="text-black" size={28} /></div><span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
   <div className="flex items-center gap-6">
    <button onClick={onRecuperar} className="text-gray-500 hover:text-[#D4AF37] text-[10px] font-black uppercase italic tracking-widest">Recuperar ID</button>
    <button onClick={() => onLogin()} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs italic"><Lock size={14} className="inline mr-2" /> Entrar</button>
   </div>
  </nav>
  <main className="w-full max-w-7xl px-8 flex flex-col items-center text-center mt-12 mb-32 mx-auto italic">
   <h1 className="text-4xl md:text-8xl font-black text-white mb-10 leading-none uppercase">ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
   <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões. O fim do "achismo" na sua escala digital.</p>
   <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 shadow-2xl relative flex flex-col items-center justify-center mb-32"><div className="bg-[#D4AF37] p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] mb-6"><Play size={40} fill="black" className="text-black ml-1" /></div><p className="text-white font-black uppercase text-xs">Descubra como rastreamos ofertas em tempo real</p></section>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-40 text-left">
    <div className="bg-[#121212] border border-white/5 rounded-[40px] p-12 flex flex-col shadow-2xl"><h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1">PLANO MENSAL</h3><p className="text-5xl font-black text-white mb-10 italic">R$ 197 <span className="text-sm font-normal">/mês</span></p><button onClick={() => window.open(KIWIFY_MENSAL)} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all italic">QUERO ACESSO MENSAL</button></div>
    <div className="bg-white text-black rounded-[40px] p-12 flex flex-col scale-105 border-t-8 border-[#D4AF37] shadow-2xl"><h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1">PLANO TRIMESTRAL</h3><p className="text-5xl font-black mb-10 italic">R$ 497 <span className="text-sm font-normal">/tri</span></p><button onClick={() => window.open(KIWIFY_TRIMESTRAL)} className="w-full py-5 bg-black text-[#D4AF37] font-black text-xl rounded-2xl animate-btn-pulse italic">ASSINAR TRIMESTRAL</button></div>
   </div>
   <div className="w-full max-w-5xl mx-auto mb-40 border border-[#D4AF37]/30 rounded-[40px] p-16 flex items-center gap-12 text-left bg-zinc-950 shadow-2xl"><div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-6xl font-black text-[#D4AF37]">7</div><div className="space-y-4 flex-1"><h2 className="text-white text-4xl font-black uppercase">GARANTIA DE 7 DIAS</h2><p className="text-gray-400 text-xl italic leading-relaxed">Se em até 7 dias você não sentir que a plataforma é para você, devolvemos 100% do seu investimento. Risco zero.</p></div></div>
   <footer className="w-full pt-12 border-t border-white/5 text-center"><p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic">© 2026 007 SWIPER Intelligence Group</p><div onDoubleClick={() => onLogin('admin')} className="h-10 opacity-0 cursor-default">.</div></footer>
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

 // --- FUNÇÃO DE LOGIN BLINDADA ---
 const checkLogin = async (id: string, silencioso = false) => {
  const cleanId = id.toUpperCase().trim();
  if (!cleanId || cleanId === 'AGENTE-') return;
  try {
   const docRef = doc(db, "agentes", cleanId);
   const docSnap = await getDoc(docRef);
   
   // SÓ ENTRA SE O DOCUMENTO EXISTIR E ESTIVER ATIVO
   if (docSnap.exists() && docSnap.data().ativo === true) {
    setAgentId(cleanId);
    setIsLoggedIn(true);
    localStorage.setItem('agente_token', cleanId);
   } else {
    if (!silencioso) alert('ACESSO NEGADO ❌\nID inválido ou inativo no sistema.');
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
 const openOffer = (o: Offer) => { setSelectedOffer(o); window.scrollTo({ top: 0, behavior: 'smooth' }); };
 const toggleFavorite = (id: string, e?: React.MouseEvent) => { if (e) e.stopPropagation(); setFavorites(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]); };

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 const renderContent = () => {
  if (loading) return <div className="py-40 text-center animate-pulse font-black text-[#D4AF37] uppercase italic">Acessando base de dados...</div>;
  if (selectedOffer) return (
   <div className="space-y-12 animate-in fade-in duration-500 italic">
    <button onClick={() => setSelectedOffer(null)} className="flex items-center text-zinc-500 hover:text-[#D4AF37] font-black uppercase text-xs"><ArrowLeft size={16} className="mr-2"/> Voltar</button>
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
     <div className="w-full lg:w-[65%] space-y-6">
      <div className="bg-[#121212] p-6 rounded-[32px] border border-white/5 shadow-2xl h-full flex flex-col">
       <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5"><VideoPlayer url={selectedOffer.vslLinks[0]?.url} /></div>
       <div className="mt-8 p-8 bg-[#1a1a1a] rounded-[32px] border border-white/5"><h3 className="text-[#D4AF37] font-black uppercase text-[10px] mb-4 tracking-widest border-l-2 border-[#D4AF37] pl-3">Dossiê de Campo</h3><p className="text-zinc-400 font-medium italic leading-relaxed text-lg">{selectedOffer.description || "Análise detalhada em processamento..."}</p></div>
      </div>
     </div>
     <div className="w-full lg:w-[35%] space-y-6">
      <div className="bg-[#121212] p-8 rounded-[32px] border border-white/5 h-full space-y-8 shadow-2xl">
       <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-widest border-l-2 border-zinc-800 pl-3">Dossiê Técnico</h3>
       {[{icon: Tag, label: 'Nicho', value: selectedOffer.niche}, {icon: Lock, label: 'Tipo', value: selectedOffer.productType}, {icon: Globe, label: 'Idioma', value: selectedOffer.language}].map((item, i) => (
        <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-4"><div className="flex items-center gap-2 text-zinc-600 uppercase text-[9px] font-black"><item.icon size={12}/> {item.label}</div><p className="text-white font-black italic uppercase text-sm">{item.value}</p></div>
       ))}
       <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 btn-elite rounded-2xl text-center text-sm italic font-black">Visualizar Arsenal</a>
       <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full py-5 bg-[#1a1a1a] border border-white/10 rounded-2xl text-center text-xs italic font-black text-white hover:bg-white hover:text-black transition-all">Ads Library</a>
      </div>
     </div>
    </div>
    {selectedOffer.creativeEmbedUrls.length > 0 && (
     <div className="space-y-6">
      <h3 className="text-white font-black uppercase italic text-xl flex items-center gap-3"><ImageIcon className="text-[#D4AF37]"/> Arsenal de Criativos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {selectedOffer.creativeEmbedUrls.map((url, i) => (<div key={i} className="bg-[#121212] p-4 rounded-[28px] border border-white/5 space-y-4 shadow-xl"><div className="aspect-video bg-black rounded-xl overflow-hidden"><VideoPlayer url={url} /></div><a href={selectedOffer.creativeDownloadUrls[i]} target="_blank" className="block w-full py-3 bg-[#1a1a1a] border border-[#D4AF37]/20 text-[#D4AF37] rounded-xl text-center font-black text-[10px] uppercase hover:bg-[#D4AF37] hover:text-black transition-all italic">Baixar Criativo</a></div>))}
      </div>
     </div>
    )}
   </div>
  );
  const filtered = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase()));
  return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{(currentPage === 'home' ? filtered : filtered.filter(o => favorites.includes(o.id))).map((o) => (<OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e:any) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />))}</div>);
 };

 return (
  <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <div className="flex">
     <aside className="w-72 bg-[#121212] border-r border-white/5 h-screen sticky top-0 p-10 flex flex-col">
      <div className="flex items-center space-x-3 mb-16 cursor-pointer" onClick={() => navigateToPage('home')}><div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10"><Eye className="text-black" size={24} /></div><span className="text-xl font-black italic tracking-tighter uppercase leading-none">007 SWIPER</span></div>
      <nav className="space-y-4 flex-1">
       <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home'} onClick={() => navigateToPage('home')} />
       <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} />
       <SidebarItem icon={Tag} label="Arsenal Full" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} />
      </nav>
      <div className="pt-8 border-t border-white/5"><SidebarItem icon={LogOut} label="Sair" active={false} onClick={handleLogout} variant="danger" /></div>
     </aside>
     <main className="flex-1 p-12">
      <header className="flex justify-between items-center mb-16 italic"><h1 className="text-3xl font-black uppercase tracking-tighter">Inteligência <span className="text-[#D4AF37]">Militar</span></h1><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16}/><input type="text" placeholder="RASTREAR OFERTA..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#121212] border border-white/5 pl-12 pr-4 py-4 rounded-2xl w-80 font-black text-xs italic focus:border-[#D4AF37] outline-none transition-all shadow-inner" /></div></header>
      {renderContent()}
     </main>
    </div>
   ) : (
    <LandingPage onLogin={handleLogin} onRecuperar={() => setShowRecuperar(true)} isSuccess={isSuccess} agentId={agentId} onDismissSuccess={() => { setIsSuccess(false); navigateToPage('home'); }} />
   )}
  </div>
 );
};

export default App;
