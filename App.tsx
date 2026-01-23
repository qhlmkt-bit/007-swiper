import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';

// --- INJEÇÃO FIREBASE ---
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
// ------------------------

/** * TYPE DEFINITIONS */
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;

export interface VslLink { label: string; url: string; }

export interface Offer {
 id: string; title: string; niche: Niche; language: string; trafficSource: string[]; productType: ProductType; description: string; vslLinks: VslLink[]; vslDownloadUrl: string; trend: Trend; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeImages: string[]; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; creativeZipUrl: string; addedDate: string; status: string; isFavorite?: boolean;
}

/** * CONSTANTS */
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const HOTMART_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const HOTMART_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

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

const getDriveDirectLink = (url: string) => {
 if (!url) return '';
 const trimmed = url.trim();
 if (trimmed.includes('drive.google.com')) {
  const idMatch = trimmed.match(/[-\w]{25,}/);
  if (idMatch) return \`https://lh3.googleusercontent.com/d/\${idMatch[0]}\`;
 }
 return trimmed;
};

const getEmbedUrl = (url: string) => {
 if (!url) return '';
 const trimmed = url.trim();
 if (trimmed.includes('vimeo.com')) {
  const vimeoIdMatch = trimmed.match(/(?:vimeo\\.com\\/|player\\.vimeo\\.com\\/video\\/|video\\/)([0-9]+)/);
  if (vimeoIdMatch) return \`https://player.vimeo.com/video/\${vimeoIdMatch[1]}?title=0&byline=0&portrait=0&badge=0&autopause=0\`;
 }
 if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
  const ytIdMatch = trimmed.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([^&?]+)/);
  if (ytIdMatch) return \`https://www.youtube.com/embed/\${ytIdMatch[1]}\`;
 }
 return trimmed;
};

/** * UI COMPONENTS */
const SidebarItem: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void; variant?: 'default' | 'danger' | 'gold'; }> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 \${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}>
  <Icon size={20} />
  <span className="text-sm uppercase tracking-tighter font-black">{label}</span>
 </button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => {
 const normalized = source.toLowerCase().trim();
 if (normalized.includes('facebook')) return <Facebook size={14} className="text-blue-500" />;
 if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={14} className="text-red-500" />;
 if (normalized.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />;
 return <Target size={14} className="text-[#D4AF37]" />;
};

const VideoPlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
 const embed = getEmbedUrl(url);
 if (!embed) return <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-[#1a1a1a] border border-dashed border-white/10 rounded-2xl gap-3"><ZapOff size={32} className="opacity-20" /><p className="font-black uppercase italic text-xs tracking-widest opacity-40">Visualização indisponível</p></div>;
 return <iframe className="w-full h-full" src={embed} title={title || "Video Player"} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>;
};

const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
  const getBadgeInfo = () => {
    if (!offer.addedDate) return { text: "OFERTA VIP", isNew: false };
    const dataOferta = new Date(offer.addedDate + 'T00:00:00'); 
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const diffDias = Math.floor((hoje.getTime() - dataOferta.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias <= 7) return { text: "NOVO", isNew: true };
    return { text: "OFERTA VIP", isNew: false };
  };
  const badge = getBadgeInfo();
  return (
    <div onClick={onClick} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
      <div className="relative aspect-video overflow-hidden">
        <img src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <div className={`px-2.5 py-1 text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl \${badge.isNew ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}><Clock size={10} /> {badge.text}</div>
          {offer.trend.toLowerCase() === 'escalando' && <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>}
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={onToggleFavorite} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 \${isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-[#D4AF37]/20 text-white hover:bg-[#D4AF37] hover:text-black'}`}><Star size={18} fill={isFavorite ? "currentColor" : "none"} /></button>
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

/** * LANDING PAGE */
const LandingPage = ({ onLogin, isSuccess, agentId, onDismissSuccess }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isSuccess && (
     <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
       <div className="w-full max-w-2xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-8 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)] relative">
         <div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"><ShieldCheck size={48} className="text-black" /></div>
         <h2 className="text-[#D4AF37] font-black uppercase text-2xl md:text-4xl tracking-tighter italic mb-4">ACESSO LIBERADO!</h2>
         <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-12">
           <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">SUA CREDENCIAL ÚNICA</p>
           <span className="text-white text-3xl md:text-5xl font-black tracking-tighter italic">{agentId}</span>
         </div>
         <button onClick={onDismissSuccess} className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase hover:scale-105 transition-all shadow-xl italic tracking-tighter animate-btn-pulse">[ACESSAR ARSENAL]</button>
       </div>
     </div>
   )}
   <nav className="w-full max-w-7xl px-4 py-10 flex justify-between items-center relative z-50 mx-auto">
     <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3"><Eye className="text-black" size={28} /></div><span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
     <button onClick={onLogin} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs tracking-tighter italic font-black"><Lock size={14} className="inline mr-2" /> Entrar</button>
   </nav>
   <main className="w-full max-w-7xl px-4 flex flex-col items-center justify-center text-center mt-12 mb-32 relative mx-auto">
     <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic max-w-6xl mx-auto text-center">ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS DO MERCADO <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
     <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed text-center px-4">Rastreie VSLs, criativos e funis validados nos maiores players do mercado digital. O fim do "achismo" na sua escala digital.</p>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl mb-40 px-4 mx-auto items-stretch">
       <div className="bg-[#121212] border border-white/5 rounded-[40px] p-8 text-left relative overflow-hidden group shadow-xl">
         <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO MENSAL</h3>
         <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black text-white italic">R$ 197</span><span className="text-gray-500 font-black text-sm uppercase">/mês</span></div>
         <ul className="space-y-4 mb-12 flex-1">
           {['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Transcrições de VSL', 'Radar de Tendências'].map((item, i) => (
             <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37]" /> {item}</li>
           ))}
         </ul>
         <button onClick={() => window.open(HOTMART_MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all uppercase tracking-tighter shadow-xl italic">QUERO ACESSO MENSAL</button>
       </div>
       <div className="bg-white text-black rounded-[40px] p-8 text-left relative overflow-hidden group shadow-2xl scale-105 border-t-[8px] border-[#D4AF37]">
         <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO TRIMESTRAL</h3>
         <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black italic">R$ 497</span><span className="text-gray-400 font-black text-sm uppercase">/trimestre</span></div>
         <ul className="space-y-4 mb-12 flex-1">
           {['Tudo do Mensal', 'Comunidade VIP', 'Transcrições Ilimitadas', 'Suporte Prioritário'].map((item, i) => (
             <li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37]" /> {item}</li>
           ))}
         </ul>
         <button onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl uppercase tracking-tighter italic">ASSINAR TRIMESTRAL</button>
       </div>
     </div>
     <footer className="w-full max-w-7xl px-4 border-t border-white/5 pt-12 pb-20 mx-auto"><p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic text-center">© 2026 007 SWIPER. Todos os direitos reservados.</p></footer>
   </main>
 </div>
);

/** * MAIN APP */
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

  const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
  const allLanguages = Array.from(new Set(offers.map(o => o.language))).sort();
  const allTypes = Array.from(new Set(offers.map(o => o.productType))).sort();
  const allTrafficSources = Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort();

  const getFavKey = (id: string) => `favs_\${id}`;
  const getViewedKey = (id: string) => `viewed_\${id}`;

  const applyEliteFilters = useCallback((data: Offer[]) => {
    return data.filter(offer => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = offer.title.toLowerCase().includes(searchLower) || (offer.description && offer.description.toLowerCase().includes(searchLower));
      const matchesNiche = selectedNiche === 'Todos' || offer.niche === selectedNiche;
      const matchesLanguage = selectedLanguage === 'Todos' || offer.language === selectedLanguage;
      const matchesType = selectedType === 'Todos' || offer.productType === selectedType;
      const matchesTraffic = selectedTraffic === 'Todos' || offer.trafficSource.some(t => t.toLowerCase().includes(selectedTraffic.toLowerCase()));
      return matchesSearch && matchesNiche && matchesLanguage && matchesType && matchesTraffic;
    });
  }, [searchQuery, selectedNiche, selectedLanguage, selectedType, selectedTraffic]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch(CSV_URL);
        const text = await res.text();
        const lines = text.split(/\\r?\\n/).filter(l => l.trim());
        const parsed: Offer[] = lines.slice(2).map((l, i) => {
          const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').trim());
          if (!v[1] || v[1].toLowerCase() === 'undefined') return null;
          return {
            id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: v[6] || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase(), creativeImages: [],
          };
        }).filter((o): o is Offer => o !== null);
        setOffers(parsed.filter(o => o.status === 'ATIVO').reverse());
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsSuccess(true);
      setNewlyGeneratedId("AGUARDANDO ATIVAÇÃO...");
    } else {
      const savedId = localStorage.getItem('agente_token');
      if (savedId) { checkLogin(savedId, true); }
    }
    fetchOffers();
  }, []);

  const checkLogin = async (id: string, silently = false) => {
    const cleanId = id.toUpperCase().trim();
    try {
      const docRef = doc(db, "agentes", cleanId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().ativo === true) {
        setAgentId(cleanId);
        setIsLoggedIn(true);
        localStorage.setItem('agente_token', cleanId);
        const f = localStorage.getItem(getFavKey(cleanId)); if (f) setFavorites(JSON.parse(f));
        const v = localStorage.getItem(getViewedKey(cleanId)); if (v) setRecentlyViewed(JSON.parse(v));
      } else if (!silently) {
        alert('CREDENCIAL INVÁLIDA OU INATIVA ❌');
      }
    } catch (e) { console.error(e); }
  };

  const handleLogin = () => {
    const inputId = window.prompt("🕵️ ACESSO À CENTRAL\\nDigite seu ID DO AGENTE:");
    if (inputId) checkLogin(inputId);
  };

  const SidebarContent = () => (
    <div className="p-8 md:p-10 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-12 px-2"><div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl"><Eye className="text-black" size={24} /></div><span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
      <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
        <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => {setCurrentPage('home'); setSelectedOffer(null); setIsMobileMenuOpen(false);}} />
        <SidebarItem icon={Star} label="FAVORITOS" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setIsMobileMenuOpen(false);}} />
        <SidebarItem icon={Settings} label="PAINEL" active={currentPage === 'settings'} onClick={() => {setCurrentPage('settings'); setIsMobileMenuOpen(false);}} />
        <div className="pt-8 pb-4">
          <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-widest mb-4 italic">Módulos VIP</p>
          <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers'} onClick={() => {setCurrentPage('offers'); setIsMobileMenuOpen(false);}} />
          <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => {setCurrentPage('vsl'); setIsMobileMenuOpen(false);}} />
          <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => {setCurrentPage('creatives'); setIsMobileMenuOpen(false);}} />
          <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => {setCurrentPage('pages'); setIsMobileMenuOpen(false);}} />
          <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => {setCurrentPage('ads_library'); setIsMobileMenuOpen(false);}} />
        </div>
      </nav>
      <div className="mt-8"><SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} variant="danger" /></div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <div className="flex flex-col items-center justify-center py-40 gap-4 animate-pulse"><Loader2 className="text-[#D4AF37] animate-spin" size={48} /><p className="text-[#D4AF37] font-black uppercase text-xs italic tracking-widest">Interceptando pacotes de dados...</p></div>;
    
    if (selectedOffer) {
      return (
        <div className="animate-in fade-in duration-500">
          <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs tracking-widest mb-10"><ArrowLeft size={16} className="mr-2"/> Voltar</button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-[#121212] p-6 rounded-[32px] border border-white/5 shadow-2xl">
              <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-6"><VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} /></div>
              <div className="flex gap-4">
                <a href={selectedOffer.vslDownloadUrl} target="_blank" className="flex-1 py-4 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] text-center uppercase italic shadow-lg"><Download size={16} className="inline mr-2"/> Baixar VSL</a>
                <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex-1 py-4 bg-[#1a1a1a] text-white rounded-2xl font-black text-[10px] text-center uppercase italic border border-white/5 shadow-lg"><FileText size={16} className="inline mr-2"/> Transcrição</a>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white uppercase italic">{selectedOffer.title}</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-[#1a1a1a] rounded-2xl border border-white/5"><p className="text-gray-500 text-[10px] font-black uppercase">NICHO</p><p className="text-white font-black uppercase italic">{selectedOffer.niche}</p></div>
                <div className="p-4 bg-[#1a1a1a] rounded-2xl border border-white/5"><p className="text-gray-500 text-[10px] font-black uppercase">IDIOMA</p><p className="text-white font-black uppercase italic">{selectedOffer.language}</p></div>
                <a href={selectedOffer.pageUrl} target="_blank" className="p-6 bg-[#121212] rounded-2xl border border-[#D4AF37]/30 flex justify-between items-center group transition-all"><span className="text-white font-black italic">PÁGINA DE VENDAS</span> <ExternalLink size={20} className="group-hover:text-[#D4AF37]"/></a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const filtered = applyEliteFilters(offers);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => {e.stopPropagation(); const n = favorites.includes(o.id) ? favorites.filter(f => f !== o.id) : [...favorites, o.id]; setFavorites(n); localStorage.setItem(getFavKey(agentId), JSON.stringify(n));}} onClick={() => setSelectedOffer(o)} />)}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {isLoggedIn ? (
        <>
          {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
          <aside className={`w-72 bg-[#121212] border-r border-white/5 fixed h-screen z-[110] transition-transform lg:translate-x-0 \${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}><SidebarContent /></aside>
          <main className="flex-1 lg:ml-72 relative w-full p-4 md:p-10">
            <header className="flex flex-col md:flex-row gap-6 mb-12 justify-between items-center bg-[#0a0a0a]/80 sticky top-0 py-4 z-50">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-[#121212] border border-white/5 rounded-xl text-[#D4AF37]"><Menu size={24} /></button>
              <div className="flex-1 flex items-center bg-[#121212] px-6 py-3 rounded-2xl border border-white/5 shadow-inner max-w-xl">
                <Search className="text-gray-500 mr-4" size={20} /><input type="text" placeholder="Pesquisar inteligência..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none w-full font-bold placeholder:text-gray-700" />
              </div>
              <div className="flex items-center gap-3 bg-[#121212] p-2 pr-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center font-black text-black">007</div>
                <div className="hidden md:block"><p className="font-black text-[10px] uppercase text-zinc-500 leading-none">Agente</p><p className="text-white font-mono text-[10px] uppercase">{agentId}</p></div>
              </div>
            </header>
            <div className="max-w-[1600px] mx-auto pb-32">{renderContent()}</div>
          </main>
        </>
      ) : (
        <LandingPage onLogin={handleLogin} isSuccess={isSuccess} agentId={newlyGeneratedId} onDismissSuccess={() => setIsSuccess(false)} />
      )}
    </div>
  );
};

export default App;
