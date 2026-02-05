import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle, MessageCircle
} from 'lucide-react';
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

// --- CONFIGURAÇÃO WHATSAPP ---
const WHATSAPP_NUMBER = "5500000000000"; // Substitua pelo seu número (com DDD)

// --- COMPONENTES AUXILIARES ---
const RecuperarID = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const buscarID = async (e: React.FormEvent) => {
    e.preventDefault(); setResultado(null);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const snap = await getDocs(q);
      if (snap.empty) alert('E-mail não localizado.');
      else setResultado(snap.docs[0].id);
    } catch (err) { alert('Erro de conexão.'); }
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-in fade-in">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-8 rounded-[32px] shadow-2xl">
        <h2 className="text-2xl font-black text-[#D4AF37] italic uppercase mb-6 text-center">Recuperar Acesso</h2>
        <form onSubmit={buscarID} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-black p-4 rounded-xl hover:bg-white transition-all uppercase italic">Consultar</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-zinc-900 border border-[#D4AF37] rounded-2xl text-center"><p className="text-xs text-zinc-500 uppercase mb-2">Sua Credencial:</p><p className="text-2xl font-black text-white">{resultado}</p></div>}
      </div>
    </div>
  );
};

const PainelAdmin = ({ onBack }: { onBack: () => void }) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  useEffect(() => {
    const buscar = async () => {
      const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
      const snap = await getDocs(q);
      setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }; buscar();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white p-10 animate-in fade-in">
      <button onClick={onBack} className="mb-8 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Sair</button>
      <h1 className="text-3xl font-black mb-10 italic uppercase text-center">Base <span className="text-[#D4AF37]">Agentes</span></h1>
      <div className="max-w-4xl mx-auto overflow-x-auto border border-zinc-800 rounded-3xl bg-zinc-950">
        <table className="w-full text-left text-sm"><thead className="bg-zinc-900 text-[10px] uppercase text-zinc-500"><tr><th className="p-4">ID</th><th className="p-4">Email</th><th className="p-4">Status</th></tr></thead>
          <tbody>{agentes.map(a => <tr key={a.id} className="border-b border-zinc-900"><td className="p-4 text-[#D4AF37] font-bold">{a.id}</td><td className="p-4">{a.email}</td><td className="p-4 text-green-500">ATIVO</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

// --- TYPES & CONSTANTS ---
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;
export interface VslLink { label: string; url: string; }
export interface Offer { id: string; title: string; niche: Niche; language: string; trafficSource: string[]; productType: ProductType; description: string; vslLinks: VslLink[]; vslDownloadUrl: string; trend: Trend; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeImages: string[]; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; creativeZipUrl: string; addedDate: string; status: string; isFavorite?: boolean; }

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?output=csv';
const SUPPORT_EMAIL = 'suporte@007swiper.com';
const NO_VSL_PLACEHOLDER = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1600&auto=format&fit=crop'; 

// LINKS DE PAGAMENTO (DINÂMICOS)
const LINKS = {
    KIWIFY_MENSAL: "https://pay.hotmart.com/H104019113G?bid=1769103375372",
    KIWIFY_TRIMESTRAL: "https://pay.hotmart.com/H104019113G?off=fc7oudim",
    HOTMART_MENSAL: "https://pay.hotmart.com/H104019113G", // Exemplo, coloque o link real aqui
    HOTMART_TRIMESTRAL: "https://pay.hotmart.com/H104019113G?off=trimestral" // Exemplo, coloque o link real aqui
};

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; --brand-card: #121212; --brand-hover: #1a1a1a; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .gold-border { border: 1px solid rgba(212, 175, 55, 0.3); }
 .gold-text { color: #D4AF37; } .gold-bg { background-color: #D4AF37; }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

const isDirectVideo = (url: string) => { const clean = url.trim().toLowerCase(); return clean.includes('.mp4') || clean.includes('.m3u8') || clean.includes('bunny.net') || clean.includes('b-cdn.net') || clean.includes('mediapack'); };

const getFastDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'play_480p.mp4');
    if (trimmed.endsWith('original')) return trimmed.replace('original', 'play_480p.mp4');
  } return trimmed;
};

const getOriginalDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'original');
  } return trimmed;
};

const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black">{label}</span></button>
);

const VideoPlayer = ({ url, title, type = 'vsl' }: any) => { 
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return (
    <div className="w-full aspect-video bg-[#0a0a0a] flex items-center justify-center border border-white/5 rounded-2xl relative overflow-hidden">
      <img src={NO_VSL_PLACEHOLDER} className="absolute w-full h-full object-cover opacity-10" />
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <ZapOff size={32} className="text-gray-500 mb-4" />
        <p className="text-gray-500 font-black uppercase text-xs tracking-[0.2em]">{type === 'vsl' ? "ESSA OFERTA NÃO TEM VSL" : "VÍDEO INDISPONÍVEL"}</p>
      </div>
    </div>
  ); 

  let content;
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    let baseUrl = trimmed.replace(/playlist\.m3u8|play_720p\.mp4|play_480p\.mp4|play_360p\.mp4|original/, '');
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    content = (
      <video className="w-full h-full max-h-[70vh] bg-black" controls playsInline controlsList="nodownload">
        <source src={`${baseUrl}play_720p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}play_480p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}original`} type="video/mp4" />
      </video>
    );
  } else if (isDirectVideo(trimmed)) {
    content = <video className="w-full h-full max-h-[70vh] bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    content = <iframe className="w-full aspect-video" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }

  return <div className="w-full flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl">{content}</div>;
};

const SelectionGrid = ({ items, onSelect, Icon, label }: any) => (
  <div className="animate-in fade-in duration-500">
   <div className="flex flex-col mb-12"><h2 className="text-3xl font-black text-white uppercase italic flex items-center gap-4"><Icon className="text-[#D4AF37]" size={32} />{label}</h2><p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 italic">Selecione uma categoria para infiltrar nos dados</p></div>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {items.map((item: string, idx: number) => (
     <button key={idx} onClick={() => onSelect(item)} className="group bg-[#121212] border border-white/5 hover:border-[#D4AF37]/50 p-8 rounded-[32px] text-left transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between h-48 relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-[#D4AF37]/10 transition-colors"><Icon size={120} /></div>
      <p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic mb-2">Categoria 00{idx + 1}</p>
      <span className="text-white text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors relative z-10">{item}</span>
      <div className="flex items-center gap-2 mt-auto relative z-10"><span className="text-gray-500 text-[9px] font-black uppercase tracking-widest group-hover:text-white transition-colors italic">Infiltrar</span><ChevronRight size={14} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" /></div>
     </button>
    ))}
   </div>
  </div>
);

const SidebarContent = ({ currentPage, selectedOffer, navigateToPage, handleLogout }: any) => (
  <div className="p-8 md:p-10 h-full flex flex-col">
   <div className="flex items-center space-x-3 mb-12 px-2"><div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10"><Eye className="text-black" size={24} /></div><span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
   <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
    <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} />
    <SidebarItem icon={Star} label="SEUS FAVORITOS" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} />
    <div className="pt-8 pb-4">
     <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
     <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} />
     <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} />
     <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} />
     <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => navigateToPage('pages')} />
     <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} />
    </div>
    <div className="pt-4 pb-4">
     <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Ferramentas</p>
     <SidebarItem icon={LifeBuoy} label="CENTRAL 007" active={currentPage === 'support'} onClick={() => navigateToPage('support')} variant="gold" />
     <SidebarItem icon={Puzzle} label="EXTENSÃO 007" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} />
     <SidebarItem icon={Settings} label="PAINEL DO AGENTE" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} />
    </div>
   </nav>
   <div className="mt-8 space-y-3"><SidebarItem icon={LogOut} label="Sair" active={false} onClick={handleLogout} variant="danger" /></div>
  </div>
);

const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [activeVslIndex, setActiveVslIndex] = useState(0);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [activeNicheSelection, setActiveNicheSelection] = useState<string | null>(null);
 const [activeLanguageSelection, setActiveLanguageSelection] = useState<string | null>(null);
 const [isSuccess, setIsSuccess] = useState(false);
 const [newlyGeneratedId, setNewlyGeneratedId] = useState('');
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
 const allLanguages = Array.from(new Set(offers.map(o => o.language))).sort();
 const allTypes = Array.from(new Set(offers.map(o => o.productType))).sort();
 const allTrafficSources = Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort();

 useEffect(() => {
    const savedId = localStorage.getItem('agente_token');
    if (savedId) checkLogin(savedId, true);
    fetchOffers();
 }, []);

 const fetchOffers = async () => {
   try {
    setLoading(true);
    const res = await fetch(CSV_URL);
    const text = await res.text();
    const parsed: Offer[] = text.split(/\r?\n/).slice(2).map((l, i) => {
     const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
     if (!v[1]) return null;
     return {
      id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: v[6] || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase(), creativeImages: []
     };
    }).filter((o): o is Offer => o !== null && o.status === 'ATIVO');
    setOffers([...parsed].reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
 };

 const checkLogin = async (id: string, silent = false) => {
    try {
        const docRef = doc(db, "agentes", id.toUpperCase().trim());
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().ativo) {
            setAgentId(id.toUpperCase()); setIsLoggedIn(true);
            localStorage.setItem('agente_token', id.toUpperCase());
        } else if (!silent) alert('Acesso Negado ❌');
    } catch (e) { console.error(e); }
 };

 const navigateToPage = (page: string) => { setCurrentPage(page); setSelectedOffer(null); setActiveNicheSelection(null); setIsMobileMenuOpen(false); };
 const toggleFavorite = (id: string) => { setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); };

 const renderSupportPage = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
        <div className="text-center space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Central <span className="text-[#D4AF37]">007</span></h2>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest italic">Escolha o canal de comunicação para sua missão</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
            <div className="bg-[#121212] border border-white/5 p-8 rounded-[40px] space-y-6 hover:border-[#D4AF37]/50 transition-all group">
                <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500"><AlertTriangle size={32} /></div>
                <div><h3 className="text-white font-black uppercase italic text-xl">Reportar Falha</h3><p className="text-zinc-500 text-sm mt-2">Encontrou um link quebrado ou vídeo que não carrega? Avise nossa inteligência agora.</p></div>
                <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Agente%20007,%20identifiquei%20uma%20falha%20no%20link:%20`, '_blank')} className="w-full py-4 bg-white text-black font-black rounded-2xl uppercase italic text-sm hover:scale-105 transition-all">Acionar Suporte</button>
            </div>
            <div className="bg-[#121212] border border-white/5 p-8 rounded-[40px] space-y-6 hover:border-[#D4AF37]/50 transition-all group">
                <div className="bg-[#D4AF37]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#D4AF37]"><Zap size={32} /></div>
                <div><h3 className="text-white font-black uppercase italic text-xl">Sugerir Melhoria</h3><p className="text-zinc-500 text-sm mt-2">Tem alguma oferta em mente ou sugestão para a plataforma? Queremos ouvir você.</p></div>
                <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Agente%20007,%20tenho%20uma%20sugestão:%20`, '_blank')} className="w-full py-4 bg-[#D4AF37] text-black font-black rounded-2xl uppercase italic text-sm hover:scale-105 transition-all">Enviar Sugestão</button>
            </div>
        </div>
    </div>
 );

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 return (
  <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   
   {/* BOTÃO WHATSAPP FLUTUANTE NA LANDING PAGE */}
   {!isLoggedIn && (
       <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá,%20estou%20com%20dúvidas%20sobre%20o%20007%20Swiper`, '_blank')} className="fixed bottom-8 right-8 z-[300] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-110 transition-all group">
           <MessageCircle size={32} />
           <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase italic whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Suporte Online</span>
       </button>
   )}

   {isLoggedIn ? (
    <>
     {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
     <aside className={`w-72 bg-[#121212] border-r border-white/5 fixed h-screen z-[110] transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <SidebarContent currentPage={currentPage} selectedOffer={selectedOffer} navigateToPage={navigateToPage} handleLogout={() => setIsLoggedIn(false)} />
     </aside>
     <main className="flex-1 lg:ml-72 relative">
      <header className="py-8 px-10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-[80] border-b border-white/5 flex items-center justify-between">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-[#121212] rounded-xl text-[#D4AF37]"><Menu size={24} /></button>
        <div className="flex-1"></div>
        <div className="bg-[#121212] p-1.5 pr-6 rounded-full border border-white/5 flex items-center gap-3"><div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black">007</div><p className="text-[10px] font-black uppercase tracking-widest">{agentId}</p></div>
      </header>
      <div className="p-10 max-w-[1600px] mx-auto pb-32">
        {currentPage === 'support' ? renderSupportPage() : (
            selectedOffer ? (
                <div className="animate-in fade-in space-y-10">
                    <button onClick={closeOffer} className="flex items-center text-gray-500 hover:text-[#D4AF37] font-black uppercase text-xs tracking-widest"><ArrowLeft size={16} className="mr-2" /> Voltar</button>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} title="VSL Player" type="vsl" />
                            <div className="grid grid-cols-2 lg:flex gap-3">
                                <a href={getFastDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#D4AF37] text-black text-[10px] font-black rounded-xl uppercase italic"><Download size={14} /> VSL LEVE</a>
                                <a href={getOriginalDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1a1a1a] text-zinc-400 text-[10px] font-black rounded-xl uppercase italic border border-white/5"><Video size={14} /> VSL ORIGINAL</a>
                                <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1a1a1a] text-zinc-400 text-[10px] font-black rounded-xl uppercase italic border border-white/5"><FileText size={14} /> TRANSCRIÇÃO</a>
                                <button onClick={() => toggleFavorite(selectedOffer.id)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase italic border ${favorites.includes(selectedOffer.id) ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#1a1a1a] text-zinc-400 border-white/5'}`}><Star size={14} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'FAVORITO' : 'FAVORITAR'}</button>
                            </div>
                            <div className="p-8 bg-[#121212] rounded-[32px] border border-white/5"><h3 className="text-[#D4AF37] font-black text-xs uppercase italic mb-4">Dossiê Técnico</h3><p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-line">{selectedOffer.description}</p></div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-[#121212] p-8 rounded-[32px] border border-white/5 space-y-6">
                                <h3 className="text-[#D4AF37] font-black uppercase text-xs italic border-l-2 border-[#D4AF37] pl-4">Dados da Operação</h3>
                                {[{icon: Tag, label: 'Nicho', value: selectedOffer.niche}, {icon: Lock, label: 'Tipo', value: selectedOffer.productType}, {icon: Globe, label: 'Idioma', value: selectedOffer.language}, {icon: Target, label: 'Fonte', value: selectedOffer.trafficSource.join(', ')}].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1 p-4 bg-black/40 rounded-2xl"><div className="flex items-center gap-2 text-zinc-600"><item.icon size={14} /><span className="text-[10px] font-black uppercase">{item.label}</span></div><span className="text-white font-black uppercase italic text-sm">{item.value}</span></div>
                                ))}
                                <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 bg-[#D4AF37] text-black text-center font-black rounded-2xl uppercase italic shadow-xl animate-btn-pulse">Visualizar Página</a>
                                <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full text-center text-[10px] font-black text-zinc-600 uppercase italic hover:text-white transition-all">Ads Library</a>
                            </div>
                        </div>
                    </div>
                    {/* CRIATIVOS COM AVISO INTELIGENTE */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3"><ImageIcon className="text-[#D4AF37]" /> CRIATIVOS</h3>
                        {selectedOffer.creativeEmbedUrls.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {selectedOffer.creativeEmbedUrls.map((url, i) => (
                                    <div key={i} className="bg-[#121212] p-4 rounded-2xl border border-white/5 space-y-4 shadow-xl">
                                        <div className="aspect-video bg-black rounded-xl overflow-hidden"><VideoPlayer url={url} type="creative" /></div>
                                        <a href={getFastDownloadUrl(selectedOffer.creativeDownloadUrls[i] || '#')} target="_blank" className="block w-full py-3 bg-[#1a1a1a] text-[#D4AF37] text-center font-black text-[9px] rounded-xl border border-[#D4AF37]/20 uppercase italic">Download Criativo {i+1}</a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center shadow-xl">
                                <ZapOff size={48} className="text-gray-600 mb-6" />
                                <p className="text-gray-500 font-black uppercase text-sm tracking-[0.25em] italic">ESSA OFERTA NÃO TEM CRIATIVOS EM VÍDEO</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                currentPage === 'vsl' ? <SelectionGrid items={allNiches} onSelect={(v:any) => {setActiveNicheSelection(v); pushNavState({ans:v});}} Icon={Video} label="Central de VSL" /> :
                currentPage === 'creatives' ? <SelectionGrid items={allNiches} onSelect={(v:any) => {setActiveNicheSelection(v); pushNavState({ans:v});}} Icon={Palette} label="Arsenal de Criativos" /> :
                <div className="animate-in fade-in space-y-12">
                    <h2 className="text-3xl font-black italic uppercase"><Zap className="text-[#D4AF37] inline mr-4" fill="currentColor" /> Operações em Escala</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {offers.filter(o => o.trend === 'Escalando').slice(0, 8).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={() => toggleFavorite(o.id)} onClick={() => openOffer(o)} />)}
                    </div>
                </div>
            )
        )}
      </div>
     </main>
    </>
   ) : (
    <LandingPage 
        onLogin={handleLogin} 
        onRecover={() => setShowRecuperar(true)} 
        onAdmin={() => setShowAdmin(true)} 
        isSuccess={isSuccess} 
        agentId={agentId} 
        onDismissSuccess={() => setIsSuccess(false)} 
        links={LINKS}
    />
   )}
  </div>
 );
};

export default App;
