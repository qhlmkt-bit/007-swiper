import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

/** * CONFIGURAÇÃO FIREBASE - 007 SWIPER
 */
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

/** * TYPE DEFINITIONS & CONSTANTS
 */
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;
export interface VslLink { label: string; url: string; }
export interface Offer {
 id: string; title: string; niche: Niche; language: string; trafficSource: string[]; productType: ProductType; description: string; vslLinks: VslLink[]; vslDownloadUrl: string; trend: Trend; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeImages: string[]; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; creativeZipUrl: string; addedDate: string; status: string; isFavorite?: boolean;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const HOTMART_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const HOTMART_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

/** * STYLES (MANTENDO SEU DESIGN DOURADO)
 */
const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; --brand-card: #121212; --brand-hover: #1a1a1a; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .gold-border { border: 1px solid rgba(212, 175, 55, 0.3); }
 .gold-text { color: #D4AF37; }
 .gold-bg { background-color: #D4AF37; }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 ::-webkit-scrollbar { width: 8px; }
 ::-webkit-scrollbar-track { background: #0a0a0a; }
 ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
 ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

/** * UTILS
 */
const getDriveDirectLink = (url: string) => {
 if (!url) return '';
 const trimmed = url.trim();
 if (trimmed.includes('drive.google.com')) {
  const idMatch = trimmed.match(/[-\w]{25,}/);
  if (idMatch) return `https://lh3.googleusercontent.com/u/0/d/${idMatch[0]}`;
 }
 return trimmed;
};

const getEmbedUrl = (url: string) => {
 if (!url) return '';
 const trimmed = url.trim();
 if (trimmed.includes('vimeo.com')) {
  const vimeoIdMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|video\/)([0-9]+)/);
  if (vimeoIdMatch) return `https://player.vimeo.com/video/${vimeoIdMatch[1]}?title=0&byline=0&portrait=0&badge=0&autopause=0`;
 }
 if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
  const ytIdMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (ytIdMatch) return `https://www.youtube.com/embed/${ytIdMatch[1]}`;
 }
 return trimmed;
};

/** * UI COMPONENTS (MANTENDO SUA IDENTIDADE)
 */
const SidebarItem: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void; variant?: 'default' | 'danger' | 'gold'; }> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}>
  <Icon size={20} />
  <span className="text-sm uppercase tracking-tighter font-black">{label}</span>
 </button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => {
 const n = source.toLowerCase().trim();
 if (n.includes('facebook')) return <Facebook size={14} className="text-blue-500" />;
 if (n.includes('youtube') || n.includes('google')) return <Youtube size={14} className="text-red-500" />;
 if (n.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />;
 return <Target size={14} className="text-[#D4AF37]" />;
};

const VideoPlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
 const embed = getEmbedUrl(url);
 if (!embed) return <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-[#1a1a1a] border border-dashed border-white/10 rounded-2xl gap-3"><ZapOff size={32} className="opacity-20" /><p className="font-black uppercase italic text-xs tracking-widest opacity-40">Indisponível</p></div>;
 return <iframe className="w-full h-full" src={embed} title={title || "Video"} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>;
};

const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
 const getBadge = () => {
  if (!offer.addedDate) return { text: "OFERTA VIP", isNew: false };
  const d = new Date(offer.addedDate + 'T00:00:00');
  const diff = Math.floor((new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 1) return { text: "NOVO", isNew: true };
  return { text: "OFERTA VIP", isNew: false };
 };
 const b = getBadge();
 return (
  <div onClick={onClick} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
   <div className="relative aspect-video overflow-hidden">
    <img src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
     <div className={`px-2.5 py-1 text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl ${b.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}><Clock size={10} /> {b.text}</div>
     {offer.trend.toLowerCase().includes('escalando') && <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>}
    </div>
    <div className="absolute top-3 right-3">
     <button onClick={onToggleFavorite} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-[#D4AF37]/20 text-white hover:bg-[#D4AF37] hover:text-black'}`}><Star size={18} fill={isFavorite ? "currentColor" : "none"} /></button>
    </div>
    <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase shadow-lg">{offer.niche}</div></div>
   </div>
   <div className="p-5">
    <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors italic">{offer.title}</h3>
    <div className="flex items-center justify-between border-t border-white/5 pt-4">
     <div className="flex items-center gap-2">{offer.trafficSource.slice(0, 2).map((s, i) => <TrafficIcon key={i} source={s} />)}<span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span></div>
    </div>
   </div>
  </div>
 );
};

/** * LANDING PAGE (COM OS LINKS DA HOTMART)
 */
const LandingPage = ({ onLogin, isSuccess, agentId, onDismissSuccess }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  {isSuccess && (
   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
    <div className="w-full max-w-2xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-8 md:p-12 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)] relative">
     <div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"><ShieldCheck size={48} className="text-black" /></div>
     <h2 className="text-[#D4AF37] font-black uppercase text-2xl md:text-4xl tracking-tighter italic mb-4">ACESSO LIBERADO!</h2>
     <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-12">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">SUA CREDENCIAL ÚNICA</p>
      <div className="flex items-center justify-center gap-4"><span className="text-white text-3xl md:text-5xl font-black italic">{agentId}</span></div>
     </div>
     <button onClick={onDismissSuccess} className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase hover:scale-105 transition-all shadow-xl italic tracking-tighter animate-btn-pulse">[ACESSAR ARSENAL]</button>
    </div>
   </div>
  )}
  <nav className="w-full max-w-7xl px-4 md:px-8 py-10 flex justify-between items-center relative z-50 mx-auto">
   <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3"><Eye className="text-black" size={28} /></div><span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic">007 SWIPER</span></div>
   <button onClick={onLogin} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs italic tracking-tighter"><Lock size={14} className="inline mr-2" /> Entrar</button>
  </nav>
  <main className="w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center mt-12 mb-32 relative mx-auto">
   <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic text-center">ACESSE AS OFERTAS ESCALADAS <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mb-40 mt-20">
    <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 text-left flex flex-col">
     <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO MENSAL</h3>
     <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black text-white italic">R$ 197</span><span className="text-gray-500 font-black text-xs uppercase">/mês</span></div>
     <button onClick={() => window.open(HOTMART_MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all uppercase italic">QUERO ACESSO MENSAL</button>
    </div>
    <div className="bg-white text-black rounded-[40px] p-10 text-left flex flex-col scale-105 border-t-[8px] border-[#D4AF37]">
     <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO TRIMESTRAL</h3>
     <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black italic">R$ 497</span><span className="text-gray-400 font-black text-xs uppercase">/trimestre</span></div>
     <button onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-black text-xl rounded-2xl hover:scale-105 transition-all uppercase italic">ASSINAR TRIMESTRAL</button>
    </div>
   </div>
   <footer className="w-full max-w-7xl px-4 md:px-8 border-t border-white/5 pt-12 pb-20 mx-auto">
    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic text-center">© 2026 007 SWIPER Intelligence. Todos os direitos reservados.</p>
   </footer>
  </main>
 </div>
);

/** * MAIN APP CONECTADO AO FIREBASE
 */
const App: React.FC = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState<string>('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [validating, setValidating] = useState(false);
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

 const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
 const allLanguages = Array.from(new Set(offers.map(o => o.language))).sort();
 const allTypes = Array.from(new Set(offers.map(o => o.productType))).sort();
 const allTrafficSources = Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort();

 const getFavKey = (id: string) => `favs_${id}`;
 const getViewedKey = (id: string) => `viewed_${id}`;

 /**
  * LÓGICA DE LOGIN REAL NO FIREBASE
  */
 const checkLogin = async (id: string, silencioso = false) => {
  if (!id) return;
  if (!silencioso) setValidating(true);
  try {
   const cleanId = id.toUpperCase().trim();
   const docRef = doc(db, "agentes", cleanId);
   const docSnap = await getDoc(docRef);
   if (docSnap.exists() && docSnap.data().ativo === true) {
    setAgentId(cleanId);
    setIsLoggedIn(true);
    localStorage.setItem('agente_token', cleanId);
    const favs = localStorage.getItem(getFavKey(cleanId));
    setFavorites(favs ? JSON.parse(favs) : []);
    const viewed = localStorage.getItem(getViewedKey(cleanId));
    setRecentlyViewed(viewed ? JSON.parse(viewed) : []);
   } else if (!silencioso) {
    alert('❌ ACESSO NEGADO: ID Inválido ou Assinatura Inativa.');
    localStorage.removeItem('agente_token');
   }
  } catch (e) {
   console.error(e);
   if (!silencioso) alert('Erro na central de dados.');
  } finally {
   setValidating(false);
  }
 };

 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
   setIsSuccess(true);
   setNewlyGeneratedId("AGUARDANDO ATIVAÇÃO..."); // O Webhook cuidará disso
  } else {
   const savedId = localStorage.getItem('agente_token');
   if (savedId) checkLogin(savedId, true);
  }
  fetchOffers();
 }, []);

 const fetchOffers = async () => {
  try {
   setLoading(true);
   const res = await fetch(CSV_URL);
   const text = await res.text();
   const lines = text.split(/\r?\n/).filter(l => l.trim());
   const parsed: Offer[] = lines.slice(2).map((l, i) => {
    const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').trim());
    if (!v[1] || v[1].toLowerCase() === 'undefined') return null;
    return {
     id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: (v[6] as Trend) || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase(), creativeImages: [],
    };
   }).filter((o): o is Offer => o !== null);
   setOffers(parsed.filter(o => o.status === 'ATIVO').reverse());
  } catch (e) { console.error(e); } finally { setLoading(false); }
 };

 const applyEliteFilters = useCallback((data: Offer[]) => {
  return data.filter(offer => {
   const s = searchQuery.toLowerCase();
   const mSearch = offer.title.toLowerCase().includes(s) || (offer.description && offer.description.toLowerCase().includes(s));
   const mNiche = selectedNiche === 'Todos' || offer.niche === selectedNiche;
   const mLang = selectedLanguage === 'Todos' || offer.language === selectedLanguage;
   return mSearch && mNiche && mLang;
  });
 }, [searchQuery, selectedNiche, selectedLanguage]);

 const handleLogin = () => {
  const inputId = window.prompt("🕵️‍♂️ CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE:");
  if (inputId) checkLogin(inputId);
 };

 const renderContent = () => {
  if (loading || validating) return <div className="flex flex-col items-center justify-center py-40 gap-4"><Loader2 className="text-[#D4AF37] animate-spin" size={48} /><p className="text-[#D4AF37] font-black uppercase text-xs italic tracking-widest">Sincronizando com a Central...</p></div>;
  if (selectedOffer) {
    // RENDERIZAR DETALHE DA OFERTA (VSL, DOWNLOADS, ETC)
    return (
      <div className="animate-in fade-in duration-500">
        <button onClick={() => setSelectedOffer(null)} className="mb-10 flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] font-black uppercase text-xs"><ArrowLeft size={16} /> Voltar</button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-[#121212] p-6 rounded-[32px] border border-white/5 shadow-2xl">
            <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-6"><VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} /></div>
            <div className="flex flex-wrap gap-4">
              <a href={selectedOffer.vslDownloadUrl} className="flex-1 py-4 bg-[#D4AF37] text-black rounded-2xl font-black text-center text-xs uppercase italic"><Download size={16} className="inline mr-2" /> Baixar VSL</a>
              <a href={selectedOffer.transcriptionUrl} className="flex-1 py-4 bg-[#1a1a1a] text-white rounded-2xl font-black text-center text-xs border border-white/5 uppercase italic">Transcrição</a>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white uppercase italic">{selectedOffer.title}</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 bg-[#121212] rounded-2xl border border-white/5"><p className="text-gray-500 text-[10px] font-black">NICHO</p><p className="font-black text-white">{selectedOffer.niche}</p></div>
              <div className="p-5 bg-[#121212] rounded-2xl border border-white/5"><p className="text-gray-500 text-[10px] font-black">IDIOMA</p><p className="font-black text-white">{selectedOffer.language}</p></div>
              <a href={selectedOffer.pageUrl} target="_blank" className="p-5 bg-[#121212] rounded-2xl border border-[#D4AF37]/30 flex justify-between items-center group"><span className="font-black uppercase italic">Página de Vendas</span> <ExternalLink size={20} className="group-hover:text-[#D4AF37]" /></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const filtered = applyEliteFilters(offers);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filtered.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => { e.stopPropagation(); const next = favorites.includes(o.id) ? favorites.filter(f => f !== o.id) : [...favorites, o.id]; setFavorites(next); localStorage.setItem(getFavKey(agentId), JSON.stringify(next)); }} onClick={() => setSelectedOffer(o)} />)}
    </div>
  );
 };

 return (
  <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <>
     <aside className={`w-72 bg-[#121212] border-r border-white/5 fixed h-screen z-[110] transition-transform lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
       <div className="p-10 flex flex-col h-full">
         <div className="flex items-center gap-3 mb-12"><Eye className="text-[#D4AF37]" /> <span className="font-black text-xl italic">007 SWIPER</span></div>
         <nav className="space-y-2 flex-1">
           <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home'} onClick={() => setCurrentPage('home')} />
           <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favorites'} onClick={() => setCurrentPage('favorites')} />
           <SidebarItem icon={Settings} label="Painel" active={currentPage === 'settings'} onClick={() => setCurrentPage('settings')} />
         </nav>
         <button onClick={() => { setIsLoggedIn(false); localStorage.removeItem('agente_token'); }} className="flex items-center gap-3 text-red-500 font-black uppercase text-xs mt-auto">Sair</button>
       </div>
     </aside>
     <main className="flex-1 lg:ml-72 relative w-full p-4 md:p-10">
       <header className="flex flex-col md:flex-row gap-6 mb-12 justify-between items-center">
         <div className="bg-[#121212] px-6 py-3 rounded-full border border-white/5 flex items-center w-full max-w-xl">
           <Search className="text-gray-500 mr-4" size={20} />
           <input type="text" placeholder="Pesquisar inteligência..." className="bg-transparent border-none outline-none w-full font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
         </div>
         <div className="flex items-center gap-3 bg-[#121212] p-2 pr-6 rounded-full border border-white/5">
           <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-black text-black">007</div>
           <span className="font-mono text-[10px] text-zinc-500">{agentId}</span>
         </div>
       </header>
       {renderContent()}
     </main>
    </>
   ) : (
    <LandingPage onLogin={handleLogin} isSuccess={isSuccess} agentId={newlyGeneratedId} onDismissSuccess={() => setIsSuccess(false)} />
   )}
  </div>
 );
};

export default App;
