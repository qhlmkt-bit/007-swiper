import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle, MessageCircle, Share2, Calendar
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";

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

// --- ⚠️ CONFIGURAÇÃO DOS LINKS ⚠️ ---
const LINKS = {
    KIWIFY: {
        MENSAL: "https://pay.kiwify.com.br/mtU9l7e", 
        TRIMESTRAL: "https://pay.kiwify.com.br/ExDtrjE"
    },
    HOTMART: {
        MENSAL: "https://pay.hotmart.com/H104019113G?bid=1769103375372",
        TRIMESTRAL: "https://pay.hotmart.com/H104019113G?off=fc7oudim"
    }
};

const WHATSAPP_NUMBER = "5573981414083"; 
const SUPPORT_EMAIL = 'suporte@007swiper.com';
const NO_VSL_PLACEHOLDER = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1600&auto=format&fit=crop'; 
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?output=csv';
const COMMUNITY_LINK = "https://chat.whatsapp.com/DVQrZLpHFR31KUgmPq6ibL";

// TIPAGEM
type Trend = 'Escalando' | 'Em Alta' | 'Estável';
interface Offer {
  id: string; title: string; niche: string; productType: string; description: string; coverImage: string; trend: Trend; views: string; vslLinks: { label: string; url: string }[]; vslDownloadUrl: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; facebookUrl: string; pageUrl: string; language: string; trafficSource: string[]; creativeZipUrl: string; addedDate: string; status: string; creativeImages: string[];
}

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #050505; --brand-card: #0d0d0d; --brand-hover: #141414; }
 body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .glass-card { background: rgba(13, 13, 13, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.03); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
 .gold-glow:hover { box-shadow: 0 0 30px rgba(212, 175, 55, 0.1); border-color: rgba(212, 175, 55, 0.3); transform: translateY(-4px); }
 .btn-elite { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #000; font-weight: 800; text-transform: uppercase; transition: all 0.3s ease; }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
 ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
 .grid-5 { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1.5rem; }
 @media (min-width: 640px) { .grid-5 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
 @media (min-width: 1024px) { .grid-5 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
 @media (min-width: 1440px) { .grid-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
`;

// --- UTILS ---
const getDriveDirectLink = (url: string) => { 
  if (!url) return ''; 
  const trimmed = url.trim(); 
  if (trimmed.includes('drive.google.com')) { 
    const idMatch = trimmed.match(/[-\w]{25,}/); 
    if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w1000`; 
  } 
  return trimmed; 
};
const isDirectVideo = (url: string) => { const clean = url.trim().toLowerCase(); return clean.includes('.mp4') || clean.includes('.m3u8') || clean.includes('bunny.net') || clean.includes('b-cdn.net') || clean.includes('mediapack'); };

const getFastDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'play_480p.mp4');
    if (trimmed.endsWith('original')) return trimmed.replace('original', 'play_480p.mp4');
  } return trimmed;
};

// --- COMPONENTES ---
const SidebarItem: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void; variant?: 'default' | 'danger' | 'gold'; }> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-extrabold shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}><Icon size={18} /><span className="text-[10px] uppercase tracking-widest font-black">{label}</span></button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => { const normalized = source.toLowerCase().trim(); if (normalized.includes('facebook')) return <Facebook size={12} className="text-blue-500" />; if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={12} className="text-red-500" />; if (normalized.includes('tiktok')) return <Smartphone size={12} className="text-pink-500" />; return <Target size={12} className="text-[#D4AF37]" />; };

// 🛡️ PLAYER DE VÍDEO À PROVA DE ERROS (Não trava se for imagem)
const VideoPlayer: React.FC<{ url: string; title?: string; type?: 'vsl' | 'creative' }> = ({ url, title, type = 'vsl' }) => { 
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return (
    <div className="w-full aspect-video bg-black/60 flex items-center justify-center border border-white/5 rounded-2xl">
      <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">Sem Mídia Disponível</p>
    </div>
  ); 

  let content;
  if (trimmed.match(/\.(jpeg|jpg|gif|png|webp)$/i) || trimmed.includes('drive.google.com/thumbnail')) {
    content = <img src={trimmed} alt="Media" className="w-full h-full object-contain bg-black" />;
  } else if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    let baseUrl = trimmed.replace(/playlist\.m3u8|play_720p\.mp4|play_480p\.mp4|original/, '');
    content = <video className="w-full h-full object-contain bg-black" controls playsInline><source src={`${baseUrl}play_720p.mp4`} type="video/mp4" /><source src={`${baseUrl}original`} type="video/mp4" /></video>;
  } else if (isDirectVideo(trimmed)) {
    content = <video className="w-full h-full object-contain bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    content = <iframe className="w-full h-full" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }
  
  return <div className="w-full aspect-video flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-white/5">{content}</div>;
};

const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
 const getBadgeInfo = () => { 
   if (!offer.addedDate) return { text: "VERIFICADA", isNew: false, dias: 15 }; 
   const dataOferta = new Date(offer.addedDate + 'T00:00:00');
   const diffDias = Math.floor((new Date().getTime() - dataOferta.getTime()) / (1000 * 60 * 60 * 24));
   if (diffDias <= 0) return { text: "NOVA: HOJE", isNew: true, dias: 1 };
   if (diffDias <= 7) return { text: `NOVA: ${diffDias} DIAS`, isNew: true, dias: diffDias };
   return { text: "SISTEMA ATIVO", isNew: false, dias: diffDias };
 };
 const badge = getBadgeInfo();
 
 return (
  <div onClick={onClick} className="glass-card rounded-[28px] overflow-hidden group cursor-pointer gold-glow shadow-2xl flex flex-col h-full relative">
   <div className="relative aspect-video overflow-hidden shrink-0">
    <img src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100" />
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
     <div className={`px-2.5 py-1 text-[8px] font-black rounded-lg uppercase flex items-center gap-1 shadow-2xl ${badge.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-black/60 text-gray-300 border border-white/10'}`}><Clock size={10} /> {badge.text}</div>
     {offer.trend.trim().toLowerCase() === 'escalando' && (<div className="px-2.5 py-1 bg-green-600 text-white text-[8px] font-black rounded-lg uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>)}
    </div>
    <div className="absolute top-3 right-3"><button onClick={onToggleFavorite} className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${isFavorite ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-white hover:bg-[#D4AF37] hover:text-black'}`}><Star size={14} fill={isFavorite ? "currentColor" : "none"} /></button></div>
    <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white text-[8px] font-bold rounded uppercase border border-white/5">{offer.niche}</div></div>
   </div>
   <div className="p-4 flex flex-col flex-1">
    <h3 className="font-extrabold text-white mb-2 line-clamp-2 text-[13px] md:text-sm tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors">{offer.title}</h3>
    
    <div className="flex flex-wrap items-center gap-2 mb-4 mt-1">
      <span className="text-gray-500 text-[8px] uppercase font-black bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-1"><Calendar size={10}/> Rodando há {badge.dias} dias</span>
      <span className="text-[#D4AF37] text-[8px] uppercase font-black bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/20 flex items-center gap-1"><Flame size={10} className={offer.views ? "animate-pulse" : ""}/> {offer.views ? `${offer.views} anúncios` : 'Validada'}</span>
    </div>

    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
     <div className="flex items-center gap-2">{offer.trafficSource.slice(0, 2).map((source, idx) => <TrafficIcon key={idx} source={source} />)}<span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span></div>
     <ChevronRight size={14} className="text-gray-800 group-hover:text-[#D4AF37]" />
    </div>
   </div>
  </div>
 );
};

const App: React.FC = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState<string>('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [activeVslIndex, setActiveVslIndex] = useState(0);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedNiche, setSelectedNiche] = useState('Todos');
 const [selectedLanguage, setSelectedLanguage] = useState('Todos');
 const [selectedType, setSelectedType] = useState('Todos');
 const [selectedTraffic, setSelectedTraffic] = useState('Todos');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [activeNicheSelection, setActiveNicheSelection] = useState<string | null>(null);
 const [activeLanguageSelection, setActiveLanguageSelection] = useState<string | null>(null);
 const [isSuccess, setIsSuccess] = useState(false);
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 const allNiches = useMemo(() => Array.from(new Set(offers.map(o => o.niche))).sort(), [offers]);
 const allLanguages = useMemo(() => Array.from(new Set(offers.map(o => o.language))).sort(), [offers]);
 const allTypes = useMemo(() => Array.from(new Set(offers.map(o => o.productType))).sort(), [offers]);
 const allTrafficSources = useMemo(() => Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort(), [offers]);

 // 🛡️ FILTRO UNIVERSAL (CORRIGE O BUG DA PESQUISA NA HOME)
 const filteredData = useMemo(() => {
  return offers.filter(offer => {
   const searchLower = searchQuery.toLowerCase();
   const matchesSearch = offer.title.toLowerCase().includes(searchLower) || offer.description.toLowerCase().includes(searchLower) || offer.niche.toLowerCase().includes(searchLower);
   const matchesNiche = selectedNiche === 'Todos' || offer.niche === selectedNiche;
   const matchesLanguage = selectedLanguage === 'Todos' || offer.language === selectedLanguage;
   const matchesType = selectedType === 'Todos' || offer.productType === selectedType;
   const matchesTraffic = selectedTraffic === 'Todos' || offer.trafficSource.some(t => t.toLowerCase().includes(selectedTraffic.toLowerCase()));
   return matchesSearch && matchesNiche && matchesLanguage && matchesType && matchesTraffic;
  });
 }, [offers, searchQuery, selectedNiche, selectedLanguage, selectedType, selectedTraffic]);

 const navigateToPage = (page: string) => {
  setCurrentPage(page); setSelectedOffer(null); setActiveNicheSelection(null); setActiveLanguageSelection(null);
  setIsMobileMenuOpen(false);
 };

 const toggleFavorite = (id: string, e?: React.MouseEvent) => {
  if (e) e.stopPropagation();
  setFavorites(prev => {
   const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
   if (agentId) localStorage.setItem(`favs_${agentId}`, JSON.stringify(next));
   return next;
  });
 };

 const openOffer = (offer: Offer) => {
  const newViewed = [offer.id, ...recentlyViewed.filter(id => id !== offer.id)].slice(0, 10);
  setRecentlyViewed(newViewed);
  if (agentId) localStorage.setItem(`viewed_${agentId}`, JSON.stringify(newViewed));
  setSelectedOffer(offer);
  window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const checkLogin = async (id: string, silencioso = false) => {
    const cleanId = id.toUpperCase().trim();
    if (cleanId.length < 5) return;
    try {
        const docRef = doc(db, "agentes", cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().ativo === true) {
            await updateDoc(docRef, { ultimo_acesso: serverTimestamp() });
            setAgentId(cleanId); setIsLoggedIn(true);
            localStorage.setItem('agente_token', cleanId);
            const savedFavs = localStorage.getItem(`favs_${cleanId}`);
            if (savedFavs) setFavorites(JSON.parse(savedFavs));
            const savedViewed = localStorage.getItem(`viewed_${cleanId}`);
            if (savedViewed) setRecentlyViewed(JSON.parse(savedViewed));
        } else if (!silencioso) alert('Credencial inválida ou suspensa.');
    } catch (e) { console.error(e); }
 };

 useEffect(() => {
  const savedId = localStorage.getItem('agente_token');
  if (savedId) checkLogin(savedId, true);

  const fetchOffers = async () => {
   try {
    setLoading(true);
    const res = await fetch(CSV_URL);
    const text = await res.text();
    
    // 🛡️ NOVO PARSER BLINDADO (À Prova de Enters e Aspas)
    const parseCSV = (csvText: string) => {
      const rows: string[][] = []; let currentRow: string[] = []; let cell = ''; let inQuotes = false;
      for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i]; const next = csvText[i + 1];
        if (char === '"' && inQuotes && next === '"') { cell += '"'; i++; }
        else if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { currentRow.push(cell.trim()); cell = ''; }
        else if ((char === '\n' || char === '\r') && !inQuotes) {
          if (char === '\r' && next === '\n') i++; 
          currentRow.push(cell.trim()); if (currentRow.length > 1) rows.push(currentRow);
          currentRow = []; cell = '';
        } else cell += char;
      }
      if (cell || currentRow.length > 0) { currentRow.push(cell.trim()); rows.push(currentRow); }
      return rows;
    };

    const parsedRows = parseCSV(text);
    const valid: Offer[] = parsedRows.slice(2).map((v, i) => {
     if (!v[1] || v[1].toLowerCase() === 'undefined') return null;
     return {
      id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: (v[6] as Trend) || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase(), creativeImages: [],
     };
    }).filter((o): o is Offer => o !== null);
    
    setOffers(valid.filter(o => o.status === 'ATIVO').reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  fetchOffers();
 }, []);

 const renderContent = () => {
  if (loading) return (<div className="flex flex-col items-center justify-center py-40 gap-4 animate-pulse"><Loader2 className="text-[#D4AF37] animate-spin" size={48} /><p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic">Interceptando Dados de Elite...</p></div>);
  
  if (selectedOffer) return (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
    <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest gap-2"><ArrowLeft size={16} /> Voltar ao Arsenal</button>
    <div className="flex flex-col lg:flex-row gap-10 items-stretch">
      <div className="w-full lg:w-[65%] space-y-6">
       <div className="glass-card p-6 rounded-[32px] flex flex-col h-full">
        <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-6 scrollbar-hide shrink-0">
          {selectedOffer.vslLinks.map((link, idx) => (
            <button key={idx} onClick={() => setActiveVslIndex(idx)} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 whitespace-nowrap ${activeVslIndex === idx ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-gray-500 hover:text-white'}`}>
              <Video size={14} /> {selectedOffer.vslLinks.length > 1 ? `PARTE ${idx + 1}` : 'VÍDEO PRINCIPAL'}
            </button>
          ))}
        </div>
        <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} title="VSL Player" type="vsl" />
        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 lg:flex gap-4">
           <a href={getFastDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all"><Download size={14} /> Download VSL</a>
           <a href={selectedOffer.transcriptionUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-white/5 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all border border-white/5"><FileText size={14} /> Ler Transcrição</a>
           <button onClick={() => toggleFavorite(selectedOffer.id)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${favorites.includes(selectedOffer.id) ? 'bg-white text-black' : 'bg-white/5 text-gray-300'}`}><Star size={14} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'Favorito' : 'Favoritar'}</button>
        </div>
       </div>
      </div>
      <div className="w-full lg:w-[35%]">
       <div className="glass-card p-10 rounded-[32px] h-full flex flex-col">
        <h3 className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest mb-10 flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Inteligência de Campo</h3>
        <div className="grid grid-cols-1 gap-5 flex-1">
          {[{ icon: Info, label: 'NOME OFERTA', value: selectedOffer.title }, { icon: Tag, label: 'NICHO ATIVO', value: selectedOffer.niche }, { icon: Lock, label: 'ESTRATÉGIA', value: selectedOffer.productType }, { icon: Globe, label: 'IDIOMA', value: selectedOffer.language }, { icon: Target, label: 'FONTE DE TRAF.', value: selectedOffer.trafficSource.join(', ') }].map((item, idx) => (
            <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-gray-600"><item.icon size={12} /><span className="text-[9px] font-black tracking-widest uppercase">{item.label}</span></div>
              <span className="text-white text-[13px] font-black uppercase tracking-tight leading-tight">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-4">
          <a href={selectedOffer.pageUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-5 bg-[#D4AF37] text-black text-center text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-2xl">Visualizar Página Oficial</a>
          <a href={selectedOffer.facebookUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-5 bg-white/5 text-gray-500 text-center text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all border border-white/5">Biblioteca de Anúncios</a>
        </div>
       </div>
      </div>
    </div>
    <div className="space-y-6">
       <h3 className="text-white font-black uppercase text-xl tracking-tighter flex items-center gap-3"><ImageIcon className="text-[#D4AF37] w-6 h-6" /> Arsenal de Criativos</h3>
       {selectedOffer.creativeEmbedUrls.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
           {selectedOffer.creativeEmbedUrls.map((url, i) => (
             <div key={i} className="glass-card p-4 rounded-[28px] flex flex-col gap-4">
               <VideoPlayer url={url} type="creative" />
               <a href={selectedOffer.creativeDownloadUrls[i] || '#'} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white/5 text-[#D4AF37] font-black text-[9px] uppercase tracking-widest rounded-xl text-center hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/20 flex items-center justify-center gap-2"><Download size={12} /> Download Criativo</a>
             </div>
           ))}
         </div>
       ) : (
         <div className="w-full p-20 glass-card rounded-[40px] flex flex-col items-center justify-center text-center opacity-40"><ZapOff size={48} className="mb-4 text-gray-700" /><p className="text-gray-600 font-black uppercase text-[10px] tracking-[0.4em]">Nenhum criativo em vídeo disponível para esta inteligência.</p></div>
       )}
    </div>
   </div>
  );

  switch (currentPage) {
   case 'home': return (
     <div className="animate-in fade-in duration-700 space-y-20">
       <div>
         <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4"><Zap className="text-[#D4AF37]" fill="currentColor" /> Operações Escalando</h2>
         <div className="grid-5">
           {filteredData.filter(o => o.trend.toLowerCase() === 'escalando').slice(0, 10).map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
         </div>
       </div>
       <div>
         <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4"><Monitor className="text-[#D4AF37]" /> Trilha de Rastreamento</h2>
         <div className="grid-5">
           {filteredData.filter(o => recentlyViewed.includes(o.id)).map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
         </div>
       </div>
     </div>
   );
   case 'offers': return (<div className="grid-5 animate-in fade-in duration-700">{filteredData.map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}{filteredData.length === 0 && <div className="col-span-full py-40 text-center text-gray-700 font-black uppercase text-[10px] tracking-widest italic">Nenhuma inteligência interceptada para os critérios aplicados.</div>}</div>);
   case 'organic': return (
    <div className="animate-in fade-in duration-700 space-y-10">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4"><Share2 className="text-[#D4AF37]" /> Ofertas Orgânicas (Escala Viral)</h2>
      <div className="grid-5">
        {filteredData.filter(o => o.productType.toLowerCase().includes('orgânico') || o.trafficSource.some(t => t.toLowerCase().includes('tiktok'))).map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
      </div>
    </div>
  );
   default: return (<div className="grid-5">{filteredData.map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}</div>);
  }
 };

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 return (
  <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <>
     {isMobileMenuOpen && <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
     <aside className={`w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed h-screen z-[110] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}><div className="p-8 h-full flex flex-col"><div className="flex items-center space-x-3 mb-12 px-2"><div className="bg-[#D4AF37] p-2 rounded-2xl shadow-[0_10px_20px_rgba(212,175,55,0.2)]"><Eye className="text-black" size={24} /></div><span className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div><nav className="space-y-1.5 flex-1 overflow-y-auto scrollbar-hide"><SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} /><SidebarItem icon={Star} label="Salvos por você" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} /><div className="pt-8 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-600 tracking-[0.4em] mb-4 italic">Módulos Inteligência</p><SidebarItem icon={Tag} label="Todas as Ofertas" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} /><SidebarItem icon={Video} label="Biblioteca VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} /><SidebarItem icon={Palette} label="Criativos Elite" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} /><SidebarItem icon={FileText} label="Páginas / Funis" active={currentPage === 'pages'} onClick={() => navigateToPage('pages')} /><SidebarItem icon={Share2} label="Tráfego Orgânico" active={currentPage === 'organic'} onClick={() => navigateToPage('organic')} /></div><div className="pt-4 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-600 tracking-[0.4em] mb-4 italic">Ferramentas de campo</p><SidebarItem icon={Library} label="Ads Library Global" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} /><SidebarItem icon={Puzzle} label="Extensão 007 Spy" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} /><SidebarItem icon={MessageCircle} label="Comunidade VIP" active={false} onClick={() => window.open(COMMUNITY_LINK, '_blank')} variant="gold" /></div></nav><div className="mt-8 pt-6 border-t border-white/5 space-y-1"><SidebarItem icon={Settings} label="Meu Perfil" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} /><SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => { setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); }} variant="danger" /></div></div></aside>
     <main className="flex-1 lg:ml-72 relative w-full overflow-x-hidden">
      <header className="h-auto py-8 flex flex-col px-4 md:px-12 bg-[#050505]/95 backdrop-blur-2xl sticky top-0 z-[80] border-b border-white/5 gap-8">
       <div className="flex items-center justify-between">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-2xl text-[#D4AF37]"><Menu size={24} /></button>
        <div className="hidden lg:flex flex-col"><h1 className="text-xl font-black uppercase tracking-tighter leading-none">{currentPage === 'home' ? 'Monitoramento de Escala' : currentPage.toUpperCase()}</h1><p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Conexão Segura Ativa</p></div>
        <div className="flex items-center gap-3 bg-white/5 p-2 pr-6 rounded-2xl border border-white/5 shadow-2xl"><div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">007</div><div><p className="font-black text-[10px] uppercase tracking-tighter text-white leading-none">Agente</p><p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest">{agentId}</p></div></div>
       </div>
       {!selectedOffer && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
         <div className="relative group md:col-span-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-[#D4AF37] transition-colors" size={16} /><input type="text" placeholder="Pesquisar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-[11px] font-bold uppercase text-white outline-none hover:border-white/20 transition-all placeholder:text-gray-700" /></div>
         {[ { label: 'Nicho', value: selectedNiche, setter: setSelectedNiche, options: ['Todos', ...allNiches] }, { label: 'Tipo', value: selectedType, setter: setSelectedType, options: ['Todos', ...allTypes] }, { label: 'Idioma', value: selectedLanguage, setter: setSelectedLanguage, options: ['Todos', ...allLanguages] }, { label: 'Fonte', value: selectedTraffic, setter: setSelectedTraffic, options: ['Todos', ...allTrafficSources] } ].map((f, i) => (
          <select key={i} value={f.value} onChange={(e) => f.setter(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black uppercase text-gray-400 outline-none hover:border-white/20 cursor-pointer transition-all appearance-none">{f.options.map(n => <option key={n} value={n} className="bg-[#0a0a0a] text-white">{f.label}: {n}</option>)}</select>
         ))}
        </div>
       )}
      </header>
      <div className="p-4 md:p-12 max-w-[1800px] mx-auto min-h-screen pb-32">{renderContent()}</div>
     </main>
    </>
   ) : (
    <LandingPage onLogin={() => { const id = window.prompt("Digite seu ID DO AGENTE:"); if (id) checkLogin(id); }} onRecover={() => setShowRecuperar(true)} onAdmin={() => setShowAdmin(true)} isSuccess={isSuccess} agentId={agentId} onDismissSuccess={() => setIsSuccess(false)} />
   )}
  </div>
 );
};

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
      <div className="max-w-md w-full glass-card p-10 rounded-[40px] shadow-2xl">
        <h2 className="text-2xl font-black text-[#D4AF37] uppercase mb-6 text-center tracking-tighter">Recuperar Acesso</h2>
        <form onSubmit={buscarID} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl focus:border-[#D4AF37] outline-none text-white text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-black p-5 rounded-2xl hover:bg-white transition-all uppercase text-xs tracking-widest">Consultar Credencial</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-white/5 border border-[#D4AF37]/30 rounded-2xl text-center"><p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Sua Identidade Operacional:</p><p className="text-2xl font-black text-white tracking-widest">{resultado}</p></div>}
      </div>
    </div>
  );
};

const PainelAdmin = ({ onBack }: { onBack: () => void }) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  const buscarAgentes = async () => {
    const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
    const snap = await getDocs(q);
    setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { buscarAgentes(); }, []);
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? "SUSPENDER" : "REATIVAR";
    if (!window.confirm(`Deseja realmente ${action} o acesso deste agente?`)) return;
    try {
      const docRef = doc(db, "agentes", id);
      await updateDoc(docRef, { ativo: !currentStatus });
      alert(`Agente ${action === "SUSPENDER" ? "suspenso" : "reativado"} com sucesso!`);
      buscarAgentes();
    } catch (err) { alert("Erro ao atualizar status."); }
  };
  return (
    <div className="min-h-screen bg-black text-white p-10 animate-in fade-in">
      <button onClick={onBack} className="mb-8 text-[#D4AF37] flex items-center gap-2 font-black uppercase text-xs"><ArrowLeft size={16}/> Sair do Terminal</button>
      <h1 className="text-3xl font-black mb-10 uppercase tracking-tighter text-center">Base <span className="text-[#D4AF37]">Agentes</span></h1>
      <div className="max-w-6xl mx-auto overflow-x-auto border border-white/5 rounded-3xl glass-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[9px] uppercase text-zinc-500 tracking-widest">
            <tr><th className="p-5">ID / Senha</th><th className="p-5">Email</th><th className="p-5">Status</th><th className="p-5">Último Acesso</th><th className="p-5 text-center">Ação</th></tr>
          </thead>
          <tbody className="text-xs">{agentes.map(a => (
            <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-5 text-[#D4AF37] font-black">{a.id}</td>
                <td className="p-5">{a.email}</td>
                <td className={`p-5 font-black ${a.ativo ? 'text-green-500' : 'text-red-500'}`}>{a.ativo ? 'ATIVO' : 'SUSPENSO'}</td>
                <td className="p-5 text-zinc-500">{a.ultimo_acesso ? a.ultimo_acesso.toDate().toLocaleString('pt-BR') : 'Sem registros'}</td>
                <td className="p-5 text-center"><button onClick={() => toggleStatus(a.id, a.ativo)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${a.ativo ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>{a.ativo ? 'Suspender' : 'Reativar'}</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
