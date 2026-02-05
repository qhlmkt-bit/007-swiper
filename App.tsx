import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle
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

// --- UTILS ---
const getDriveDirectLink = (url: string) => { if (!url) return ''; const trimmed = url.trim(); if (trimmed.includes('drive.google.com')) { const idMatch = trimmed.match(/[-\w]{25,}/); if (idMatch) return `https://lh3.googleusercontent.com/u/0/d/${idMatch[0]}`; } return trimmed; };
const isDirectVideo = (url: string) => { const clean = url.trim().toLowerCase(); return clean.includes('.mp4') || clean.includes('.m3u8') || clean.includes('bunny.net') || clean.includes('b-cdn.net') || clean.includes('mediapack'); };

const getFastDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'play_480p.mp4');
    if (trimmed.endsWith('original')) return trimmed.replace('original', 'play_480p.mp4');
    if (trimmed.includes('play_720p.mp4')) return trimmed.replace('play_720p.mp4', 'play_480p.mp4');
  } return trimmed;
};

const getOriginalDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'original');
  } return trimmed;
};

// *** COMPONENTE PLAYER ADAPTATIVO (FIM DO CORTE DE CABEÇA) ***
const VideoPlayer = ({ url, type = 'vsl' }: any) => { 
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return (
    <div className="w-full aspect-video bg-[#0a0a0a] flex items-center justify-center border border-white/5 rounded-2xl relative overflow-hidden">
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
      <video className="max-w-full max-h-[70vh] object-contain bg-black" controls playsInline controlsList="nodownload">
        <source src={`${baseUrl}play_720p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}play_480p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}original`} type="video/mp4" />
      </video>
    );
  } else if (trimmed.includes('mp4')) {
    content = <video className="max-w-full max-h-[70vh] object-contain bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    content = <iframe className="w-full aspect-video" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }
  return <div className="w-full flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">{content}</div>;
};

// *** COMPONENTE SELECTION GRID (FIX TELA PRETA) ***
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

const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black">{label}</span></button>
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
     <SidebarItem icon={Puzzle} label="EXTENSÃO 007" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} />
     <SidebarItem icon={Settings} label="PAINEL DO AGENTE" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} />
    </div>
   </nav>
   <div className="mt-8 space-y-3"><SidebarItem icon={LogOut} label="Sair" active={false} onClick={handleLogout} variant="danger" /></div>
  </div>
);

const TrafficIcon = ({ source }: any) => { const normalized = source.toLowerCase().trim(); if (normalized.includes('facebook')) return <Facebook size={14} className="text-blue-500" />; if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={14} className="text-red-500" />; if (normalized.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />; if (normalized.includes('instagram')) return <Smartphone size={14} className="text-purple-500" />; return <Target size={14} className="text-[#D4AF37]" />; };

const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [activeVslIndex, setActiveVslIndex] = useState(0);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [activeNicheSelection, setActiveNicheSelection] = useState<string | null>(null);
 const [isSuccess, setIsSuccess] = useState(false);
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();

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

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 return (
  <div className="flex min-h-screen bg-[#0a0a0a] text-white">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <>
     {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
     <aside className={`w-72 bg-[#121212] border-r border-white/5 fixed h-screen z-[110] transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <SidebarContent currentPage={currentPage} selectedOffer={selectedOffer} navigateToPage={navigateToPage} handleLogout={() => setIsLoggedIn(false)} />
     </aside>
     <main className="flex-1 lg:ml-72 relative">
      <header className="py-8 px-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-[#121212] rounded-xl text-[#D4AF37]"><Menu size={24} /></button>
        <div className="flex-1"></div>
        <div className="bg-[#121212] px-6 py-2 rounded-full border border-white/5 flex items-center gap-3"><div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-xs">007</div><p className="text-[10px] font-black uppercase tracking-widest">{agentId}</p></div>
      </header>
      <div className="p-10 max-w-[1600px] mx-auto pb-32">
        {selectedOffer ? (
            <div className="animate-in fade-in space-y-10">
                <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-white font-black uppercase text-xs italic"><ArrowLeft size={16} className="mr-2" /> Voltar</button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} type="vsl" />
                        <div className="grid grid-cols-2 lg:flex gap-3">
                            <a href={getFastDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#D4AF37] text-black text-[10px] font-black rounded-xl uppercase italic"><Download size={14} /> VSL LEVE</a>
                            <a href={getOriginalDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1a1a1a] text-zinc-400 text-[10px] font-black rounded-xl uppercase italic border border-white/5"><Video size={14} /> VSL ORIGINAL</a>
                            <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1a1a1a] text-zinc-400 text-[10px] font-black rounded-xl uppercase italic border border-white/5"><FileText size={14} /> TRANSCRIÇÃO</a>
                            <button onClick={() => {}} className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1a1a1a] text-zinc-400 text-[10px] font-black rounded-xl uppercase italic border border-white/5 hover:text-white transition-all"><Star size={14} /> FAVORITAR</button>
                        </div>
                        <div className="p-8 bg-[#121212] rounded-[32px] border border-white/5"><h3 className="text-[#D4AF37] font-black text-xs uppercase mb-4">Dossiê Técnico</h3><p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-line">{selectedOffer.description}</p></div>
                    </div>
                    <div className="bg-[#121212] p-8 rounded-[32px] border border-white/5 h-fit space-y-6">
                        <h3 className="text-[#D4AF37] font-black uppercase text-xs italic">Informações</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col p-4 bg-black/40 rounded-2xl"><span className="text-[10px] font-black uppercase text-zinc-600">Nicho</span><span className="text-white font-black uppercase italic text-sm">{selectedOffer.niche}</span></div>
                            <div className="flex flex-col p-4 bg-black/40 rounded-2xl"><span className="text-[10px] font-black uppercase text-zinc-600">Tipo</span><span className="text-white font-black uppercase italic text-sm">{selectedOffer.productType}</span></div>
                        </div>
                        <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 bg-[#D4AF37] text-black text-center font-black rounded-2xl uppercase italic">Visualizar Página</a>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3"><ImageIcon className="text-[#D4AF37]" /> CRIATIVOS</h3>
                    {selectedOffer.creativeEmbedUrls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {selectedOffer.creativeEmbedUrls.map((url, i) => (
                                <div key={i} className="bg-[#121212] p-4 rounded-2xl border border-white/5 space-y-4">
                                    <VideoPlayer url={url} type="creative" />
                                    <a href={getFastDownloadUrl(selectedOffer.creativeDownloadUrls[i] || '#')} target="_blank" className="block w-full py-3 bg-[#1a1a1a] text-[#D4AF37] text-center font-black text-[9px] rounded-xl border border-[#D4AF37]/20 uppercase italic">Download Criativo {i+1}</a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center">
                            <ZapOff size={48} className="text-gray-600 mb-6" /><p className="text-gray-500 font-black uppercase text-sm italic">ESSA OFERTA NÃO TEM CRIATIVOS EM VÍDEO</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            currentPage === 'vsl' ? <SelectionGrid items={allNiches} onSelect={(v:any) => setActiveNicheSelection(v)} Icon={Video} label="Central de VSL" /> :
            <div className="animate-in fade-in space-y-12">
                <h2 className="text-3xl font-black italic uppercase"><Zap className="text-[#D4AF37] inline mr-4" fill="currentColor" /> Operações em Escala</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {offers.filter(o => o.trend === 'Escalando').slice(0, 8).map(o => <OfferCard key={o.id} offer={o} isFavorite={false} onToggleFavorite={() => {}} onClick={() => setSelectedOffer(o)} />)}
                </div>
            </div>
        )}
      </div>
     </main>
    </>
   ) : (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#D4AF37] p-4 rounded-3xl mb-8"><Eye size={48} className="text-black" /></div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-6">Acesse o arsenal de <span className="text-[#D4AF37]">Ofertas Escaladas.</span></h1>
        <button onClick={() => checkLogin(window.prompt("ID Agente:") || "")} className="w-full max-w-md py-5 bg-white text-black font-black rounded-2xl uppercase italic hover:scale-105 transition-all">Entrar na Central</button>
    </div>
   )}
  </div>
 );
};

export default App;
