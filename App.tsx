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
 .glass-card { background: rgba(13, 13, 13, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
 .gold-glow:hover { box-shadow: 0 0 20px rgba(212, 175, 55, 0.15); border-color: rgba(212, 175, 55, 0.4); }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 800; text-transform: uppercase; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
 .btn-elite:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3); }
 ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
 @keyframes pulse-gold { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
 .animate-pulse-gold { animation: pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
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
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-extrabold shadow-[0_10px_20px_rgba(212,175,55,0.2)]' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}><Icon size={18} /><span className="text-[11px] uppercase tracking-widest font-bold">{label}</span></button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => { const normalized = source.toLowerCase().trim(); if (normalized.includes('facebook')) return <Facebook size={12} className="text-blue-500" />; if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={12} className="text-red-500" />; if (normalized.includes('tiktok')) return <Smartphone size={12} className="text-pink-500" />; return <Target size={12} className="text-[#D4AF37]" />; };

// 🛡️ COMPONENTE PLAYER CORRIGIDO (IMUNE A ERROS DE URL)
const VideoPlayer: React.FC<{ url: string; title?: string; type?: 'vsl' | 'creative' }> = ({ url, title, type = 'vsl' }) => { 
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return (
    <div className="w-full aspect-video bg-black/40 flex items-center justify-center border border-white/5 rounded-2xl">
      <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Sem Mídia Disponível</p>
    </div>
  ); 

  let content;
  // Se por erro de cadastro cair uma imagem no player, ele exibe a imagem e não quebra o layout
  if (trimmed.match(/\.(jpeg|jpg|gif|png|webp)$/i) || trimmed.includes('drive.google.com/thumbnail')) {
    content = <img src={trimmed} alt="Media Preview" className="w-full h-full object-contain bg-black" loading="lazy" />;
  } else if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    let baseUrl = trimmed.replace(/playlist\.m3u8|play_720p\.mp4|play_480p\.mp4|original/, '');
    content = <video className="w-full h-full object-contain bg-black" controls playsInline><source src={`${baseUrl}play_720p.mp4`} type="video/mp4" /><source src={`${baseUrl}original`} type="video/mp4" /></video>;
  } else if (isDirectVideo(trimmed)) {
    content = <video className="w-full h-full object-contain bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    content = <iframe className="w-full h-full" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }
  
  return <div className="w-full aspect-video flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-inner relative">{content}</div>;
};

const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
 const getBadgeInfo = () => { 
   if (!offer.addedDate) return { text: "OFERTA VIP", isNew: false, dias: 15 }; 
   const dataOferta = new Date(offer.addedDate + 'T00:00:00');
   const diffDias = Math.floor((new Date().getTime() - dataOferta.getTime()) / (1000 * 60 * 60 * 24));
   if (diffDias <= 0) return { text: "NOVA: HOJE", isNew: true, dias: 1 };
   if (diffDias <= 7) return { text: `NOVA: ${diffDias} DIAS`, isNew: true, dias: diffDias };
   return { text: "VERIFICADA", isNew: false, dias: diffDias };
 };
 const badge = getBadgeInfo();
 
 return (
  <div onClick={onClick} className="glass-card rounded-[24px] overflow-hidden group cursor-pointer gold-glow transition-all duration-500 shadow-2xl flex flex-col h-full relative">
   <div className="relative aspect-video overflow-hidden shrink-0">
    <img src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" loading="lazy" />
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
     <div className={`px-2.5 py-1 text-[8px] font-extrabold rounded-lg uppercase flex items-center gap-1 shadow-2xl ${badge.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-black/60 text-gray-300 border border-white/10'}`}><Clock size={10} /> {badge.text}</div>
     {offer.trend.trim().toLowerCase() === 'escalando' && (<div className="px-2.5 py-1 bg-green-600/90 text-white text-[8px] font-extrabold rounded-lg uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>)}
    </div>
    <div className="absolute top-3 right-3"><button onClick={onToggleFavorite} className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ${isFavorite ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-white hover:bg-[#D4AF37] hover:text-black'}`}><Star size={14} fill={isFavorite ? "currentColor" : "none"} /></button></div>
    <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white text-[8px] font-bold rounded uppercase border border-white/10">{offer.niche}</div></div>
   </div>
   <div className="p-4 flex flex-col flex-1">
    <h3 className="font-bold text-white mb-2 line-clamp-2 text-[13px] md:text-sm tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors">{offer.title}</h3>
    
    {/* TAGS DE DADOS HARDCORE (ESTILO DEEPTUBE) */}
    <div className="flex flex-wrap items-center gap-2 mb-4 mt-1">
      <span className="text-gray-400 text-[8px] uppercase font-bold bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-1"><Calendar size={10}/> {badge.dias} dias ativo</span>
      <span className="text-[#D4AF37] text-[8px] uppercase font-bold bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/20 flex items-center gap-1"><Flame size={10} className={offer.views ? "animate-pulse" : ""}/> {offer.views ? `${offer.views} cópias` : 'Validação'}</span>
    </div>

    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
     <div className="flex items-center gap-2">{offer.trafficSource.slice(0, 2).map((source, idx) => <TrafficIcon key={idx} source={source} />)}<span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span></div>
     <ChevronRight size={14} className="text-gray-700 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
    </div>
   </div>
  </div>
 );
};

const SelectionGrid = ({ items, onSelect, Icon, label }: any) => (
  <div className="animate-in fade-in duration-500">
   <div className="flex flex-col mb-12"><h2 className="text-2xl font-extrabold text-white uppercase tracking-tighter flex items-center gap-3"><Icon className="text-[#D4AF37]" size={28} />{label}</h2><p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-1 italic">Rastreamento de inteligência por categoria</p></div>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
    {items.map((item: string, idx: number) => (
     <button key={idx} onClick={() => onSelect(item)} className="group glass-card hover:bg-white/5 p-8 rounded-[32px] text-left transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between h-44 relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-[#D4AF37]/10 transition-colors"><Icon size={120} /></div>
      <p className="text-[#D4AF37] font-black uppercase text-[9px] tracking-widest italic mb-2">Ref: 00{idx + 1}</p>
      <span className="text-white text-xl font-extrabold uppercase tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors relative z-10">{item}</span>
      <div className="flex items-center gap-2 mt-auto relative z-10"><span className="text-gray-500 text-[8px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Infiltrar</span><ChevronRight size={12} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" /></div>
     </button>
    ))}
   </div>
  </div>
);

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
 const [newlyGeneratedId, setNewlyGeneratedId] = useState<string>('');
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 const allNiches = useMemo(() => Array.from(new Set(offers.map(o => o.niche))).sort(), [offers]);
 const allLanguages = useMemo(() => Array.from(new Set(offers.map(o => o.language))).sort(), [offers]);
 const allTypes = useMemo(() => Array.from(new Set(offers.map(o => o.productType))).sort(), [offers]);
 const allTrafficSources = useMemo(() => Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort(), [offers]);

 // 🛡️ FILTRO UNIVERSAL CORRIGIDO (HOME + OFERTAS)
 const filteredOffers = useMemo(() => {
  return offers.filter(offer => {
   const sLower = searchQuery.toLowerCase();
   const matchesSearch = offer.title.toLowerCase().includes(sLower) || offer.description.toLowerCase().includes(sLower) || offer.niche.toLowerCase().includes(sLower);
   const matchesNiche = selectedNiche === 'Todos' || offer.niche === selectedNiche;
   const matchesLang = selectedLanguage === 'Todos' || offer.language === selectedLanguage;
   const matchesType = selectedType === 'Todos' || offer.productType === selectedType;
   const matchesTraffic = selectedTraffic === 'Todos' || offer.trafficSource.some(t => t.toLowerCase().includes(selectedTraffic.toLowerCase()));
   return matchesSearch && matchesNiche && matchesLang && matchesType && matchesTraffic;
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

 const closeOffer = () => setSelectedOffer(null);

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
        } else if (!silencioso) alert('Credencial inválida ou inativa.');
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
    
    // 🛡️ NOVO PARSER BLINDADO (Ignora quebras de linha dentro do texto da planilha)
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
    const validOffers: Offer[] = parsedRows.slice(2).map((v, i) => {
     if (!v[1] || v[1].toLowerCase() === 'undefined') return null;
     return {
      id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: (v[6] as Trend) || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase(), creativeImages: [],
     };
    }).filter((o): o is Offer => o !== null);
    
    setOffers(validOffers.filter(o => o.status === 'ATIVO').reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  fetchOffers();
 }, []);

 const renderContent = () => {
  if (loading) return (<div className="flex flex-col items-center justify-center py-40 gap-4"><Loader2 className="text-[#D4AF37] animate-spin" size={48} /><p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest animate-pulse">Sincronizando Banco de Dados...</p></div>);
  
  if (selectedOffer) return (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
    <button onClick={closeOffer} className="flex items-center text-gray-500 hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest gap-2"><ArrowLeft size={16} /> Voltar ao Painel</button>
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
      <div className="w-full lg:w-[65%] space-y-6">
       <div className="glass-card p-6 rounded-[32px] flex flex-col h-full">
        <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-6 scrollbar-hide shrink-0">
          {selectedOffer.vslLinks.map((link, idx) => (
            <button key={idx} onClick={() => setActiveVslIndex(idx)} className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 whitespace-nowrap ${activeVslIndex === idx ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>
              <Video size={14} /> {selectedOffer.vslLinks.length > 1 ? `PARTE ${idx + 1}` : 'VÍDEO DA OFERTA'}
            </button>
          ))}
        </div>
        <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} title="VSL Player" type="vsl" />
        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 lg:flex gap-3">
           <a href={getFastDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all"><Download size={14} /> Download VSL</a>
           <a href={selectedOffer.transcriptionUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"><FileText size={14} /> Transcrição</a>
           <button onClick={() => toggleFavorite(selectedOffer.id)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${favorites.includes(selectedOffer.id) ? 'bg-white text-black' : 'bg-white/5 text-gray-300'}`}><Star size={14} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'Favorito' : 'Salvar'}</button>
        </div>
       </div>
      </div>
      <div className="w-full lg:w-[35%]">
       <div className="glass-card p-8 rounded-[32px] h-full flex flex-col">
        <h3 className="text-[#D4AF37] font-extrabold uppercase text-[10px] tracking-widest mb-8 flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Inteligência Operacional</h3>
        <div className="grid grid-cols-1 gap-4 flex-1">
          {[{ icon: Tag, label: 'NICHO', value: selectedOffer.niche }, { icon: Lock, label: 'ESTRATÉGIA', value: selectedOffer.productType }, { icon: Globe, label: 'IDIOMA', value: selectedOffer.language }, { icon: Target, label: 'ORIGEM', value: selectedOffer.trafficSource.join(', ') }].map((item, idx) => (
            <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-500"><item.icon size={12} /><span className="text-[9px] font-black tracking-widest uppercase">{item.label}</span></div>
              <span className="text-white text-[13px] font-extrabold uppercase tracking-tight">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3">
          <a href={selectedOffer.pageUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-[#D4AF37] text-black text-center text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-xl">Visualizar Página Oficial</a>
          <a href={selectedOffer.facebookUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-white/5 text-gray-400 text-center text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/5">Acessar Ads Library</a>
        </div>
       </div>
      </div>
    </div>
    <div className="space-y-6">
       <h3 className="text-white font-extrabold uppercase text-xl tracking-tighter flex items-center gap-3"><ImageIcon className="text-[#D4AF37] w-6 h-6" /> Principais Criativos</h3>
       {selectedOffer.creativeEmbedUrls.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
           {selectedOffer.creativeEmbedUrls.map((url, i) => (
             <div key={i} className="glass-card p-4 rounded-[24px] flex flex-col gap-4">
               <VideoPlayer url={url} type="creative" />
               <a href={selectedOffer.creativeDownloadUrls[i] || '#'} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-white/5 text-[#D4AF37] font-extrabold text-[9px] uppercase tracking-widest rounded-lg text-center hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/20 flex items-center justify-center gap-2"><Download size={12} /> Download #{i + 1}</a>
             </div>
           ))}
         </div>
       ) : (
         <div className="w-full p-20 glass-card rounded-[40px] flex flex-col items-center justify-center text-center opacity-50"><ZapOff size={48} className="mb-4 text-gray-700" /><p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.3em]">Esta oferta não possui criativos em vídeo registrados.</p></div>
       )}
    </div>
   </div>
  );

  switch (currentPage) {
   case 'home': return (
     <div className="animate-in fade-in duration-700 space-y-16">
       <div>
         <h2 className="text-2xl font-extrabold text-white uppercase tracking-tighter mb-8 flex items-center gap-3"><Zap className="text-[#D4AF37]" fill="currentColor" /> Operações em Escala</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
           {filteredOffers.filter(o => o.trend.toLowerCase() === 'escalando').slice(0, 10).map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
         </div>
         {filteredOffers.filter(o => o.trend.toLowerCase() === 'escalando').length === 0 && <p className="text-gray-700 py-10 font-bold uppercase text-[10px] tracking-widest italic">Nenhum dado interceptado para os critérios atuais.</p>}
       </div>
       <div>
         <h2 className="text-2xl font-extrabold text-white uppercase tracking-tighter mb-8 flex items-center gap-3"><Monitor className="text-[#D4AF37]" /> Vistos Recentemente</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
           {filteredOffers.filter(o => recentlyViewed.includes(o.id)).map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
         </div>
         {recentlyViewed.length === 0 && <p className="text-gray-700 py-10 font-bold uppercase text-[10px] tracking-widest italic">Sua trilha de rastreamento está vazia.</p>}
       </div>
     </div>
   );
   case 'offers': return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-in fade-in duration-700">{filteredOffers.map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}{filteredOffers.length === 0 && <div className="col-span-full py-40 text-center text-gray-700 font-black uppercase text-[10px] tracking-widest italic">Nenhuma inteligência encontrada no QG.</div>}</div>);
   case 'vsl': if (!activeNicheSelection) return <SelectionGrid items={allNiches} onSelect={setActiveNicheSelection} Icon={Video} label="Central de VSL" />; return (<div className="animate-in slide-in-from-right duration-500 space-y-12"><button onClick={() => setActiveNicheSelection(null)} className="p-3 glass-card rounded-2xl text-gray-400 hover:text-white transition-all"><ArrowLeft size={20} /></button><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">{offers.filter(o => o.niche === activeNicheSelection).map(o => (<div key={o.id} className="glass-card p-6 rounded-[32px] space-y-6"><VideoPlayer url={o.vslLinks[0]?.url} /><h3 className="text-white font-extrabold uppercase text-xs truncate">{o.title}</h3><button onClick={() => openOffer(o)} className="w-full py-3 bg-white/5 text-[#D4AF37] font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all">Ver Completo</button></div>))}</div></div>);
   case 'creatives': if (!activeNicheSelection) return <SelectionGrid items={allNiches} onSelect={setActiveNicheSelection} Icon={Palette} label="Arsenal de Criativos" />; return (<div className="animate-in slide-in-from-right duration-500 space-y-12"><button onClick={() => setActiveNicheSelection(null)} className="p-3 glass-card rounded-2xl text-gray-400 hover:text-white transition-all"><ArrowLeft size={20} /></button><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">{offers.filter(o => o.niche === activeNicheSelection).flatMap(offer => offer.creativeEmbedUrls.map((url, idx) => (<div key={`${offer.id}-${idx}`} className="glass-card p-4 rounded-[24px] space-y-4"><VideoPlayer url={url} type="creative" /><button onClick={() => openOffer(offer)} className="w-full py-2.5 bg-white/5 text-gray-400 font-bold text-[8px] uppercase tracking-widest rounded-lg hover:text-white transition-all italic">Ref: {offer.title}</button></div>)))}</div></div>);
   case 'pages': if (!activeNicheSelection) return <SelectionGrid items={allNiches} onSelect={setActiveNicheSelection} Icon={FileText} label="Páginas de Alta Conversão" />; return (<div className="animate-in slide-in-from-right duration-500 space-y-12"><button onClick={() => setActiveNicheSelection(null)} className="p-3 glass-card rounded-2xl text-gray-400 hover:text-white transition-all"><ArrowLeft size={20} /></button><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">{offers.filter(o => o.niche === activeNicheSelection && o.pageUrl !== '#').map(o => (<div key={o.id} className="glass-card rounded-[24px] overflow-hidden group border border-white/5 hover:border-[#D4AF37]/30 transition-all flex flex-col h-full shadow-2xl"><div className="aspect-[4/3] bg-black relative"><img src={getDriveDirectLink(o.coverImage)} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" /><div className="absolute inset-0 flex items-center justify-center"><a href={o.pageUrl} target="_blank" rel="noopener noreferrer" className="p-5 bg-[#D4AF37] text-black rounded-full scale-0 group-hover:scale-100 transition-all duration-300 shadow-2xl"><Monitor size={28} /></a></div></div><div className="p-5 flex-1 flex flex-col"><h3 className="text-white font-extrabold uppercase text-[11px] mb-4 tracking-tight leading-relaxed">{o.title}</h3><button onClick={() => openOffer(o)} className="mt-auto w-full py-2.5 bg-white/5 text-gray-500 font-bold text-[9px] uppercase tracking-widest rounded-lg hover:text-white transition-all">Ver Estrutura</button></div></div>))}</div></div>);
   case 'ads_library': if (!activeLanguageSelection) return <SelectionGrid items={allLanguages} onSelect={setActiveLanguageSelection} Icon={Library} label="Biblioteca de Anúncios" />; return (<div className="animate-in slide-in-from-right duration-500 space-y-12"><button onClick={() => setActiveLanguageSelection(null)} className="p-3 glass-card rounded-2xl text-gray-400 hover:text-white transition-all"><ArrowLeft size={20} /></button><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">{offers.filter(o => o.language === activeLanguageSelection && o.facebookUrl !== '#').map(o => (<div key={o.id} className="glass-card p-8 rounded-[32px] gold-glow transition-all flex flex-col gap-8 shadow-2xl group"><div className="flex items-center justify-between"><div className="flex items-center gap-5"><div className="p-5 bg-white/5 rounded-2xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all shadow-xl"><Facebook size={32} /></div><div><p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest mb-1">FB ADS LIBRARY</p><h3 className="text-white font-extrabold uppercase text-lg italic tracking-tight">{o.title}</h3></div></div><button onClick={(e) => toggleFavorite(o.id, e)} className={`p-3 rounded-xl ${favorites.includes(o.id) ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-500'}`}><Star size={20} fill={favorites.includes(o.id) ? "currentColor" : "none"} /></button></div><button onClick={() => openOffer(o)} className="w-full py-4 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all">Analisar Oferta Completa</button></div>))}</div></div>);
   case 'favorites': return (<div className="animate-in fade-in duration-700"><h2 className="text-2xl font-extrabold text-white uppercase tracking-tighter mb-8 flex items-center gap-3"><Star className="text-[#D4AF37]" fill="currentColor" /> Seus Favoritos</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">{filteredOffers.filter(o => favorites.includes(o.id)).map((o) => <OfferCard key={o.id} offer={o} isFavorite={true} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}</div>{favorites.length === 0 && <p className="text-gray-700 py-40 text-center font-black uppercase text-[11px] tracking-widest italic">Sua lista de espionagem privada está limpa.</p>}</div>);
   case 'support': return (<div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pt-10"><div className="text-center space-y-2"><h2 className="text-4xl font-extrabold text-white uppercase tracking-tighter">Central <span className="text-[#D4AF37]">007</span></h2><p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Protocolo de Comunicação de Campo</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10"><div className="glass-card p-10 rounded-[40px] space-y-6 gold-glow transition-all"><div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]"><AlertTriangle size={32} /></div><div><h3 className="text-white font-extrabold uppercase tracking-tight text-xl">Reportar Falha</h3><p className="text-gray-500 text-[13px] leading-relaxed mt-2">Identificou algum link quebrado ou vídeo indisponível? Avise o suporte imediatamente.</p></div><button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Agente%20007,%20identifiquei%20uma%20falha%20na%20plataforma`, '_blank')} className="w-full py-4 bg-white text-black font-extrabold rounded-2xl uppercase tracking-widest text-[11px] hover:scale-105 transition-all">Acionar Suporte Online</button></div><div className="glass-card p-10 rounded-[40px] space-y-6 gold-glow transition-all"><div className="bg-[#D4AF37]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.1)]"><Zap size={32} /></div><div><h3 className="text-white font-extrabold uppercase tracking-tight text-xl">Sugerir Oferta</h3><p className="text-gray-500 text-[13px] leading-relaxed mt-2">Encontrou algo escalando forte? Envie para nossa equipe de mineração processar.</p></div><button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Agente%20007,%20tenho%20uma%20sugestão%20de%20oferta`, '_blank')} className="w-full py-4 bg-[#D4AF37] text-black font-extrabold rounded-2xl uppercase tracking-widest text-[11px] hover:scale-105 transition-all">Enviar Sugestão de Campo</button></div></div></div>);
   case 'settings': return (<div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pt-10"><h2 className="text-2xl font-extrabold text-white uppercase tracking-tighter flex items-center gap-3"><Settings className="text-[#D4AF37]" /> Painel do Agente</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="glass-card p-8 rounded-[40px] space-y-6"><h3 className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest">Identidade Operacional</h3><div className="space-y-4"><div className="flex justify-between items-center pb-4 border-b border-white/5"><span className="text-gray-500 text-[10px] font-bold tracking-widest">CREDENCIAL</span><span className="text-white font-extrabold text-lg">{agentId}</span></div><div className="flex justify-between items-center"><span className="text-gray-500 text-[10px] font-bold tracking-widest">SESSÃO</span><span className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-[#D4AF37]/20 uppercase">Individual / Criptografada</span></div></div></div><div className="glass-card p-8 rounded-[40px] flex flex-col justify-between"><div className="space-y-4"><h3 className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Briefing Semanal</h3><p className="text-white font-extrabold text-lg leading-tight">Receba novas ofertas e alertas de escala direto no seu e-mail.</p><p className="text-gray-400 font-bold text-sm">{SUPPORT_EMAIL}</p></div><button onClick={() => { navigator.clipboard.writeText(SUPPORT_EMAIL); alert('📡 Canal de suporte copiado!'); }} className="mt-8 w-full py-4 bg-white/5 rounded-2xl flex items-center justify-center gap-3 text-white font-extrabold hover:bg-[#D4AF37] hover:text-black transition-all uppercase text-[10px] tracking-widest border border-white/5"><Copy size={16} /> Copiar Contato</button></div></div></div>);
   case 'organic': return (
     <div className="animate-in fade-in duration-700 space-y-16">
       <div>
         <h2 className="text-2xl font-extrabold text-white uppercase tracking-tighter mb-8 flex items-center gap-3"><Share2 className="text-[#D4AF37]" /> Ofertas Orgânicas (Escala Viral)</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
           {filteredOffers.filter(o => o.productType.toLowerCase().includes('orgânico') || o.trafficSource.some(t => t.toLowerCase().includes('tiktok'))).map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
         </div>
         {filteredOffers.filter(o => o.productType.toLowerCase().includes('orgânico')).length === 0 && <p className="text-gray-700 py-40 text-center font-black uppercase text-[11px] tracking-widest italic col-span-full">Nenhuma inteligência orgânica processada hoje.</p>}
       </div>
     </div>
   );
   default: return null;
  }
 };

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 return (
  <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <>
     {isMobileMenuOpen && <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />}
     <aside className={`w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed h-screen z-[110] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}><div className="p-8 h-full flex flex-col"><div className="flex items-center space-x-3 mb-12 px-2"><div className="bg-[#D4AF37] p-2 rounded-2xl shadow-[0_10px_20px_rgba(212,175,55,0.2)]"><Eye className="text-black" size={24} /></div><span className="text-xl font-extrabold tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div><nav className="space-y-1.5 flex-1 overflow-y-auto scrollbar-hide"><SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} /><SidebarItem icon={Star} label="Salvos por você" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} /><div className="pt-8 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-600 tracking-[0.4em] mb-4 italic">Módulos Inteligência</p><SidebarItem icon={Tag} label="Todas as Ofertas" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} /><SidebarItem icon={Video} label="Biblioteca VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} /><SidebarItem icon={Palette} label="Criativos Elite" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} /><SidebarItem icon={FileText} label="Páginas / Funis" active={currentPage === 'pages'} onClick={() => navigateToPage('pages')} /><SidebarItem icon={Share2} label="Tráfego Orgânico" active={currentPage === 'organic'} onClick={() => navigateToPage('organic')} /></div><div className="pt-4 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-600 tracking-[0.4em] mb-4 italic">Ferramentas de campo</p><SidebarItem icon={Library} label="Ads Library Global" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} /><SidebarItem icon={Puzzle} label="Extensão 007 Spy" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} /><SidebarItem icon={MessageCircle} label="Comunidade VIP" active={false} onClick={() => window.open(COMMUNITY_LINK, '_blank')} variant="gold" /></div></nav><div className="mt-8 pt-6 border-t border-white/5 space-y-1"><SidebarItem icon={Settings} label="Meu Perfil" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} /><SidebarItem icon={LogOut} label="Desativar Acesso" active={false} onClick={() => { setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); }} variant="danger" /></div></div></aside>
     <main className="flex-1 lg:ml-72 relative w-full overflow-x-hidden">
      <header className="h-auto py-8 flex flex-col px-4 md:px-12 bg-[#050505]/90 backdrop-blur-3xl sticky top-0 z-[80] border-b border-white/5 gap-8">
       <div className="flex items-center justify-between">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 glass-card rounded-2xl text-[#D4AF37]"><Menu size={24} /></button>
        <div className="hidden lg:flex flex-col"><h1 className="text-lg font-extrabold uppercase tracking-tighter leading-none">{currentPage === 'home' ? 'Monitoramento de Escala' : currentPage.toUpperCase()}</h1><p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Status: Conexão Segura Ativa</p></div>
        <div className="flex items-center gap-3 bg-white/5 p-2 pr-6 rounded-2xl border border-white/5 shadow-2xl"><div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">007</div><div><p className="font-extrabold text-[10px] uppercase tracking-tighter text-white leading-none">Agente</p><p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest">{agentId}</p></div></div>
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
      <div className="p-4 md:p-12 max-w-[1700px] mx-auto min-h-screen pb-32">{renderContent()}</div>
     </main>
    </>
   ) : (
    <LandingPage onLogin={() => { const id = window.prompt("Digite seu ID DE AGENTE:"); if (id) checkLogin(id); }} onRecover={() => setShowRecuperar(true)} onAdmin={() => setShowAdmin(true)} isSuccess={isSuccess} agentId={agentId} onDismissSuccess={() => setIsSuccess(false)} />
   )}
  </div>
 );
};

export default App;
