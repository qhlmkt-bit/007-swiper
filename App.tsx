import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home as HomeIcon, 
  Star, 
  Settings, 
  Tag, 
  Palette, 
  FileText, 
  Search, 
  LogOut, 
  ChevronRight, 
  Monitor, 
  Eye, 
  Lock, 
  Trophy, 
  Download, 
  Video, 
  Zap, 
  ZapOff, 
  Globe, 
  X, 
  ExternalLink, 
  ImageIcon, 
  Layout, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle, 
  Play, 
  Facebook, 
  Youtube, 
  Smartphone, 
  Clock, 
  Target, 
  Menu, 
  Filter, 
  Library, 
  Loader2, 
  Info, 
  Files, 
  Copy, 
  Flame,
  ArrowLeft,
  LifeBuoy
} from 'lucide-react';

/** 
 * TYPE DEFINITIONS
 */
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;

export interface VslLink {
  label: string;
  url: string;
}

export interface Offer {
  id: string;
  title: string;
  niche: Niche;
  language: string;
  trafficSource: string[];
  productType: ProductType;
  description: string;
  vslLinks: VslLink[];
  vslDownloadUrl: string;
  trend: Trend;
  facebookUrl: string;
  pageUrl: string;
  coverImage: string;
  views: string; 
  transcriptionUrl: string;
  creativeImages: string[];
  creativeEmbedUrls: string[]; 
  creativeDownloadUrls: string[]; 
  creativeZipUrl: string; 
  isFavorite?: boolean;
}

/** 
 * CONSTANTS 
 */
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const KIWIFY_MENSAL = 'https://pay.kiwify.com.br/mtU9l7e';
const KIWIFY_TRIMESTRAL = 'https://pay.kiwify.com.br/ExDtrjE';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  :root {
    --brand-gold: #D4AF37;
    --brand-dark: #0a0a0a;
    --brand-card: #121212;
    --brand-hover: #1a1a1a;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--brand-dark);
    color: #ffffff;
    margin: 0;
    overflow-x: hidden;
  }

  .gold-border { border: 1px solid rgba(212, 175, 55, 0.3); }
  .gold-text { color: #D4AF37; }
  .gold-bg { background-color: #D4AF37; }
  
  .btn-elite {
    background-color: #D4AF37;
    color: #000;
    font-weight: 900;
    text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
  }
  
  .btn-elite:hover {
    transform: scale(1.02);
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.5);
  }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }

  @keyframes btnPulse {
    0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
    100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
  }
  .animate-btn-pulse {
    animation: btnPulse 2s infinite;
  }
`;

/**
 * UTILS
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

const generateAgentId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AGENTE-${randomNum}`;
};

/**
 * UI COMPONENTS
 */

const SidebarItem: React.FC<{
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'gold';
}> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' 
        : variant === 'gold'
          ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black'
          : variant === 'danger' 
            ? 'text-red-500 hover:bg-red-500/10' 
            : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm uppercase tracking-tighter font-black">{label}</span>
  </button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => {
  const normalized = source.toLowerCase().trim();
  if (normalized.includes('facebook')) return <Facebook size={14} className="text-blue-500" />;
  if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={14} className="text-red-500" />;
  if (normalized.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />;
  if (normalized.includes('instagram')) return <Smartphone size={14} className="text-purple-500" />;
  return <Target size={14} className="text-[#D4AF37]" />;
};

const VideoPlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
  const embed = getEmbedUrl(url);
  if (!embed || embed === '') return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-[#1a1a1a] border border-dashed border-white/10 rounded-2xl gap-3">
      <ZapOff size={32} className="opacity-20" />
      <p className="font-black uppercase italic text-xs tracking-widest opacity-40">Visualização indisponível</p>
    </div>
  );
  return (
    <iframe 
      className="w-full h-full"
      src={embed}
      title={title || "Video Player"}
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

const OfferCard: React.FC<{
  offer: Offer;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}> = ({ offer, isFavorite, onToggleFavorite, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl"
  >
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} 
        alt={offer.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
        {offer.trend.trim().toLowerCase() === 'escalando' && (
          <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl">
            <Zap size={10} fill="currentColor" /> Escalando
          </div>
        )}
        {offer.trend.trim().toLowerCase() === 'em alta' && (
          <div className="px-2.5 py-1 bg-[#D4AF37] text-black text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl">
            <TrendingUp size={12} className="w-3 h-3" /> Em Alta
          </div>
        )}
        {offer.views && offer.views.trim() !== '' && (
          <div className="px-2.5 py-1 bg-[#0a0a0a]/90 backdrop-blur-xl text-[#D4AF37] text-[10px] font-black rounded uppercase flex items-center gap-1.5 shadow-2xl border border-[#D4AF37]/30">
            <Flame size={12} fill="currentColor" className="text-[#D4AF37] animate-pulse" /> {offer.views.trim()}
          </div>
        )}
      </div>
      <div className="absolute top-3 right-3">
        <button 
          onClick={onToggleFavorite}
          className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${
            isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-[#D4AF37]/20 text-white hover:bg-[#D4AF37] hover:text-black'
          }`}
        >
          <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="absolute bottom-3 left-3">
        <div className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase shadow-lg">
          {offer.niche}
        </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors italic">{offer.title}</h3>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {offer.trafficSource.slice(0, 2).map((source, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <TrafficIcon source={source} />
            </div>
          ))}
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{offer.productType}</span>
        </div>
      </div>
    </div>
  </div>
);

/**
 * LANDING PAGE / WELCOME MODAL
 */
const LandingPage = ({ onLogin, isSuccess, agentId, onDismissSuccess }: any) => (
  <div className="w-full bg-[#0a0a0a] flex flex-col items-center justify-center min-h-screen selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
    <style dangerouslySetInnerHTML={{ __html: STYLES }} />

    {isSuccess && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
        <div className="w-full max-w-2xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-8 md:p-12 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]"></div>
          <div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            <ShieldCheck size={48} className="text-black" />
          </div>
          <h2 className="text-[#D4AF37] font-black uppercase text-2xl md:text-4xl tracking-tighter italic mb-4">ACESSO À INTELIGÊNCIA LIBERADO!</h2>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-10 leading-relaxed">Sua operação de rastreio de elite começa agora. Sua credencial é única e privada.</p>
          
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-12">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">ESTA É SUA CREDENCIAL ÚNICA E PRIVADA</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-white text-3xl md:text-5xl font-black tracking-tighter italic selection:bg-[#D4AF37] selection:text-black">{agentId}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(agentId);
                  alert('ID COPIADO! 🛡️');
                }}
                className="p-3 bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all rounded-xl text-gray-400"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <button 
            onClick={onDismissSuccess} 
            className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase hover:scale-105 transition-all shadow-xl italic tracking-tighter animate-btn-pulse"
          >
            [ACESSAR ARSENAL]
          </button>
        </div>
      </div>
    )}
    
    <nav className="w-full max-w-7xl px-4 md:px-8 py-10 flex justify-between items-center relative z-50 mx-auto">
      <div className="flex items-center space-x-3">
        <div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={28} /></div>
        <span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onLogin}
          className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs tracking-tighter italic"
        >
          <Lock size={14} className="inline mr-2" /> Entrar
        </button>
      </div>
    </nav>
    
    <main className="w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center mt-12 mb-32 relative mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent -z-10 pointer-events-none opacity-40"></div>
      
      <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mx-auto">
        Inteligência de Mercado em Tempo Real
      </div>
      
      <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic max-w-6xl mx-auto text-center">
        ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span>
      </h1>
      
      <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed px-2 mx-auto text-center">
        Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões em YouTube Ads, Facebook Ads e TikTok Ads. Para produtores, afiliados e e-commerces que não querem mais atirar no escuro: 007 Swiper é a plataforma de inteligência que transforma dados em resultados escaláveis.
      </p>

      <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-[#D4AF37]/40 mx-auto mb-32">
        <div className="bg-[#D4AF37] p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500 mb-6 flex items-center justify-center">
          <Play size={40} fill="black" className="text-black ml-1" />
        </div>
        <p className="text-white font-black uppercase text-[10px] md:text-xs tracking-[0.25em] italic max-w-md px-8 leading-relaxed text-center">
          Descubra como rastreamos e organizamos ofertas escaladas em tempo real
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 w-full max-w-5xl mb-40 px-4 justify-center items-stretch mx-auto">
        <div className="bg-[#121212] border border-white/5 rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO MENSAL</h3>
          <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black text-white italic">R$ 197</span><span className="text-gray-500 font-black text-sm uppercase">/mês</span></div>
          <ul className="space-y-4 mb-12 flex-1">
            {['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 'Templates de Funil', 'Transcrições de VSL', 'Radar de Tendências', '007 Academy', 'Hub de Afiliação', 'Cloaker VIP', 'Suporte Prioritário'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(KIWIFY_MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter animate-btn-pulse shadow-xl italic">QUERO ACESSO MENSAL</button>
        </div>
        <div className="bg-white text-black rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col scale-105 border-t-[8px] border-[#D4AF37]">
          <div className="absolute top-6 right-8 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Economize R$ 94</div>
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO TRIMESTRAL</h3>
          <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black italic">R$ 497</span><span className="text-gray-400 font-black text-sm uppercase">/trimestre</span></div>
          <ul className="space-y-4 mb-12 flex-1">
            {['Acesso a Todas as Ofertas', 'Banco de Criativos Híbrido', 'Comunidade VIP Exclusiva', 'Checklist de Modelagem 007', '12% OFF na IDL Edições', 'Transcrições Ilimitadas', 'Radar de Tendências Global', 'Hub de Afiliação Premium', 'Academy Completo', 'Suporte Agente Black'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(KIWIFY_TRIMESTRAL, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-tighter animate-btn-pulse italic">ASSINAR PLANO TRIMESTRAL</button>
        </div>
      </div>

      <footer className="w-full max-w-7xl px-4 md:px-8 border-t border-white/5 pt-12 pb-20 mx-auto">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic text-center">© 2024 007 SWIPER Intelligence Platform. Todos os direitos reservados.</p>
      </footer>
    </main>
  </div>
);

/**
 * MAIN APP
 */
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
  
  // Filtering States
  const [selectedNiche, setSelectedNiche] = useState('Todos');
  const [selectedLanguage, setSelectedLanguage] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedTraffic, setSelectedTraffic] = useState('Todos');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNicheSelection, setActiveNicheSelection] = useState<string | null>(null);
  const [activeLanguageSelection, setActiveLanguageSelection] = useState<string | null>(null);

  // Success Modal State
  const [isSuccess, setIsSuccess] = useState(false);
  const [newlyGeneratedId, setNewlyGeneratedId] = useState<string>('');

  // Derived Values
  const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
  const allLanguages = Array.from(new Set(offers.map(o => o.language))).sort();
  const allTypes = Array.from(new Set(offers.map(o => o.productType))).sort();
  const allTrafficSources = Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort();

  // Storage Keys per Agent
  const getFavKey = (id: string) => `favs_${id}`;
  const getViewedKey = (id: string) => `viewed_${id}`;

  const applyEliteFilters = useCallback((data: Offer[]) => {
    return data.filter(offer => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = offer.title.toLowerCase().includes(searchLower) || 
                           (offer.description && offer.description.toLowerCase().includes(searchLower));
      const matchesNiche = selectedNiche === 'Todos' || offer.niche === selectedNiche;
      const matchesLanguage = selectedLanguage === 'Todos' || offer.language === selectedLanguage;
      const matchesType = selectedType === 'Todos' || offer.productType === selectedType;
      const matchesTraffic = selectedTraffic === 'Todos' || offer.trafficSource.some(t => t.toLowerCase().includes(selectedTraffic.toLowerCase()));
      return matchesSearch && matchesNiche && matchesLanguage && matchesType && matchesTraffic;
    });
  }, [searchQuery, selectedNiche, selectedLanguage, selectedType, selectedTraffic]);

  // Updated filter visibility logic: only on 'offers' page and no offer selected
  const showFilters = currentPage === 'offers' && !selectedOffer;

  const pushNavState = useCallback((params: any) => {
    const newState = { cp: currentPage, sid: selectedOffer?.id || null, ans: activeNicheSelection, als: activeLanguageSelection, ...params };
    window.history.pushState(newState, '');
  }, [currentPage, selectedOffer, activeNicheSelection, activeLanguageSelection]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        const { cp, sid, ans, als } = e.state;
        setCurrentPage(cp || 'home');
        setActiveNicheSelection(ans || null);
        setActiveLanguageSelection(als || null);
        if (sid) {
          const found = offers.find(o => o.id === sid);
          setSelectedOffer(found || null);
        } else {
          setSelectedOffer(null);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [offers]);

  const openOffer = (offer: Offer) => {
    const newViewed = [offer.id, ...recentlyViewed.filter(id => id !== offer.id)].slice(0, 8);
    setRecentlyViewed(newViewed);
    if (agentId) localStorage.setItem(getViewedKey(agentId), JSON.stringify(newViewed));
    setSelectedOffer(offer);
    pushNavState({ sid: offer.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeOffer = () => {
    setSelectedOffer(null);
    pushNavState({ sid: null });
  };

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    setSelectedOffer(null);
    setActiveNicheSelection(null);
    setActiveLanguageSelection(null);
    pushNavState({ cp: page, sid: null, ans: null, als: null });
    setIsMobileMenuOpen(false);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter(f => f !== id) : [...prev, id];
      if (agentId) localStorage.setItem(getFavKey(agentId), JSON.stringify(next));
      return next;
    });
  };

  // INITIAL LOAD
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsSuccess(true);
      setNewlyGeneratedId(generateAgentId());
    } else {
      const savedId = localStorage.getItem('agente_token');
      if (savedId) {
        setAgentId(savedId);
        setIsLoggedIn(true);
        const favs = localStorage.getItem(getFavKey(savedId));
        if (favs) setFavorites(JSON.parse(favs));
        const viewed = localStorage.getItem(getViewedKey(savedId));
        if (viewed) setRecentlyViewed(JSON.parse(viewed));
      }
    }

    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch(CSV_URL);
        const text = await res.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) return;
        const parsed: Offer[] = lines.slice(2).map((l, i) => {
          const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').trim());
          if (!v[1] || v[1].toLowerCase() === 'undefined') return null;
          return {
            id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '',
            coverImage: v[5] || '', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#',
            trend: (v[6] as Trend) || 'Estável', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean),
            creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#',
            language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', creativeImages: [], 
          };
        }).filter((o): o is Offer => o !== null);
        setOffers([...parsed].reverse());
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchOffers();
  }, []);

  const handleLogin = () => {
    const inputId = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE (ex: AGENTE-12345):");
    if (inputId && inputId.trim().toUpperCase().startsWith('AGENTE-')) {
      const cleanId = inputId.trim().toUpperCase();
      setAgentId(cleanId);
      setIsLoggedIn(true);
      localStorage.setItem('agente_token', cleanId);
      const favs = localStorage.getItem(getFavKey(cleanId));
      setFavorites(favs ? JSON.parse(favs) : []);
      const viewed = localStorage.getItem(getViewedKey(cleanId));
      setRecentlyViewed(viewed ? JSON.parse(viewed) : []);
    } else if (inputId !== null) {
      alert('IDENTIDADE NÃO RECONHECIDA ❌\nUse o formato AGENTE-XXXXX.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAgentId('');
    localStorage.removeItem('agente_token');
    setFavorites([]);
    setRecentlyViewed([]);
  };

  const dismissSuccess = () => {
    setIsSuccess(false);
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    const cleanId = newlyGeneratedId;
    setAgentId(cleanId);
    setIsLoggedIn(true);
    localStorage.setItem('agente_token', cleanId);
    setFavorites([]);
    setRecentlyViewed([]);
  };

  /**
   * SELECTION UI FOR NICHES/LANGUAGES
   */
  const renderSelectionGrid = (items: string[], setter: (val: string) => void, icon: any, label: string) => (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col mb-12">
        <h2 className="text-3xl font-black text-white uppercase italic flex items-center gap-4">{React.createElement(icon, { className: "text-[#D4AF37]", size: 32 })} {label}</h2>
        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 italic">Selecione uma categoria para infiltrar nos dados</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => {
              setter(item);
              pushNavState({ [items === allNiches ? 'ans' : 'als']: item });
            }}
            className="group bg-[#121212] border border-white/5 hover:border-[#D4AF37]/50 p-8 rounded-[32px] text-left transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between h-48 relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-[#D4AF37]/10 transition-colors">
              {React.createElement(icon, { size: 120 })}
            </div>
            <p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic mb-2">Categoria 00{idx + 1}</p>
            <span className="text-white text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors relative z-10">{item}</span>
            <div className="flex items-center gap-2 mt-auto relative z-10">
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest group-hover:text-white transition-colors italic">Infiltrar</span>
              <ChevronRight size={14} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 animate-pulse">
        <Loader2 className="text-[#D4AF37] animate-spin" size={48} />
        <p className="text-[#D4AF37] font-black uppercase text-xs tracking-widest italic">Interceptando pacotes de dados...</p>
      </div>
    );

    if (selectedOffer) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <button onClick={closeOffer} className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs tracking-widest group">
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all"><ArrowLeft size={16} /></div>
              Voltar
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <a href={selectedOffer.vslDownloadUrl} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg italic"><Download size={16} /> BAIXAR VSL</a>
              <a href={selectedOffer.transcriptionUrl} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#D4AF37] border border-white/5 transition-all shadow-lg italic"><FileText size={16} /> BAIXAR TRANSCRIÇÃO</a>
              <button onClick={() => toggleFavorite(selectedOffer.id)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg border ${favorites.includes(selectedOffer.id) ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#1a1a1a] text-white border-white/5'}`}>
                <Star size={16} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'FAVORITADO' : 'FAVORITAR'}
              </button>
            </div>
          </div>

          <div className="space-y-12">
            {selectedOffer.views && selectedOffer.views.trim() !== '' && (
              <div className="flex items-center gap-3 bg-[#121212]/50 px-5 py-2.5 rounded-2xl border border-[#D4AF37]/40 w-fit shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <Flame size={20} fill="currentColor" className="text-[#D4AF37] animate-pulse" />
                <span className="text-[#D4AF37] font-black uppercase text-sm md:text-base italic tracking-[0.1em]">{selectedOffer.views} ANÚNCIOS ATIVOS</span>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              <div className="w-full lg:w-[62%] space-y-6">
                <div className="bg-[#121212] p-4 md:p-6 rounded-[32px] border border-white/5 shadow-2xl overflow-hidden h-full flex flex-col">
                  <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-6 scrollbar-hide shrink-0">
                    {selectedOffer.vslLinks.map((link, idx) => (
                      <button key={idx} onClick={() => setActiveVslIndex(idx)} className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 whitespace-nowrap ${activeVslIndex === idx ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white'}`}>
                        <Video size={12} /> {link.label || `VSL ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 relative z-10 flex-1 shadow-2xl">
                    <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} title="VSL Player" />
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[38%]">
                <div className="bg-[#121212] p-6 md:p-8 rounded-[32px] border border-white/5 shadow-2xl h-full flex flex-col">
                  <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3 italic shrink-0"><ShieldCheck className="w-4 h-4" /> INFORMAÇÕES DA OPERAÇÃO</h3>
                  <div className="grid grid-cols-1 gap-4 md:gap-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    {[
                      { icon: Info, label: 'NOME', value: selectedOffer.description || selectedOffer.title },
                      { icon: Tag, label: 'NICHO', value: selectedOffer.niche },
                      { icon: Lock, label: 'TIPO', value: selectedOffer.productType },
                      { icon: Globe, label: 'IDIOMA', value: selectedOffer.language },
                      { icon: Target, label: 'FONTE', value: selectedOffer.trafficSource.join(', ') },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col p-4 bg-[#1a1a1a] rounded-2xl border border-white/5 gap-2 shrink-0">
                        <div className="flex items-center gap-3"><item.icon className="text-[#D4AF37] w-5 h-5 shrink-0" /><span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{item.label}</span></div>
                        <span className="text-white text-sm font-black uppercase italic tracking-tight whitespace-normal break-words leading-relaxed">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {selectedOffer.creativeEmbedUrls.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2"><ImageIcon className="text-[#D4AF37] w-6 h-6" /> CRIATIVOS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedOffer.creativeEmbedUrls.map((url, i) => (
                    <div key={i} className="bg-[#121212] p-4 rounded-2xl border border-white/5 flex flex-col gap-4 shadow-xl">
                      <div className="aspect-video bg-black rounded-xl overflow-hidden">
                        <VideoPlayer url={url} title={`Creative ${i + 1}`} />
                      </div>
                      <a href={selectedOffer.creativeDownloadUrls[i] || '#'} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-[#1a1a1a] text-[#D4AF37] font-black text-[9px] uppercase tracking-widest rounded-xl text-center italic hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/20 flex items-center justify-center gap-2"><Download size={14} /> Download Criativo {i + 1}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
               <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2"><Layout className="text-[#D4AF37] w-6 h-6" /> ESTRUTURA DE VENDAS</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <a href={selectedOffer.pageUrl} target="_blank" rel="noopener noreferrer" className="p-6 bg-[#121212] rounded-[28px] border border-white/5 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded-xl group-hover:bg-[#D4AF37] group-hover:text-black transition-colors"><Monitor size={20} /></div>
                      <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acessar</p><p className="text-white font-black uppercase text-base md:text-lg italic">PÁGINA OFICIAL</p></div>
                   </div>
                   <ExternalLink size={20} className="text-gray-600 group-hover:text-[#D4AF37]" />
                 </a>
                 <a href={selectedOffer.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-6 bg-[#121212] rounded-[28px] border border-white/5 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded-xl group-hover:bg-[#D4AF37] group-hover:text-black transition-colors"><Facebook size={20} /></div>
                      <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acessar</p><p className="text-white font-black uppercase text-base md:text-lg italic">BIBLIOTECA DE ANÚNCIOS</p></div>
                   </div>
                   <ExternalLink size={20} className="text-gray-600 group-hover:text-[#D4AF37]" />
                 </a>
               </div>
            </div>
          </div>
        </div>
      );
    }

    const filtered = applyEliteFilters(offers);
    switch (currentPage) {
      case 'home':
        const scalingHome = offers.filter(o => o.trend.trim().toLowerCase() === 'escalando').slice(0, 4);
        const recentlyHome = offers.filter(o => recentlyViewed.includes(o.id));
        return (
          <div className="animate-in fade-in duration-700 space-y-16 md:space-y-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4"><Zap className="text-[#D4AF37]" fill="currentColor" /> OPERAÇÕES EM ESCALA</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {scalingHome.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4"><Monitor className="text-[#D4AF37]" /> VISTOS RECENTEMENTE</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {recentlyHome.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
              </div>
              {recentlyHome.length === 0 && <p className="text-gray-600 font-bold uppercase text-xs italic">Nenhuma atividade recente registrada.</p>}
            </div>
          </div>
        );
      case 'offers':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-700">
            {filtered.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
            {filtered.length === 0 && <div className="col-span-full py-40 text-center text-gray-600 font-black uppercase text-sm italic">Nenhuma inteligência corresponde aos critérios aplicados.</div>}
          </div>
        );
      case 'vsl':
        if (!activeNicheSelection) return renderSelectionGrid(allNiches, setActiveNicheSelection, Video, "CENTRAL DE VSL");
        return (
          <div className="animate-in slide-in-from-right duration-500 space-y-12">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveNicheSelection(null)} className="p-3 bg-[#121212] border border-white/5 rounded-2xl text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all"><ArrowLeft size={20} /></button>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter"><span className="text-[#D4AF37] mr-3">VSL:</span> {activeNicheSelection}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offers.filter(o => o.niche === activeNicheSelection).flatMap(offer => 
                offer.vslLinks.map((link, idx) => (
                  <div key={`${offer.id}-vsl-${idx}`} className="bg-[#121212] p-6 rounded-[32px] border border-white/5 flex flex-col gap-6 shadow-2xl group">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group-hover:border-[#D4AF37]/30 border border-transparent transition-all">
                      <VideoPlayer url={link.url} title={`${offer.title} - ${link.label}`} />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-black uppercase text-lg italic tracking-tight">{offer.title} - {link.label}</h3>
                        <button onClick={(e) => toggleFavorite(offer.id, e)} className={`p-2 rounded-xl ${favorites.includes(offer.id) ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-500 hover:text-white'}`}><Star size={16} fill={favorites.includes(offer.id) ? "currentColor" : "none"} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <a href={offer.vslDownloadUrl} target="_blank" rel="noopener noreferrer" className="py-3.5 bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-widest rounded-xl text-center italic hover:scale-105 transition-all shadow-lg"><Download size={14} className="inline mr-2" /> Baixar VSL</a>
                        <button onClick={() => openOffer(offer)} className="py-3.5 bg-[#1a1a1a] text-white font-black text-[10px] uppercase tracking-widest rounded-xl italic hover:bg-white hover:text-black transition-all border border-white/5">Ver Oferta Completa</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'creatives':
        if (!activeNicheSelection) return renderSelectionGrid(allNiches, setActiveNicheSelection, Palette, "ARSENAL DE CRIATIVOS");
        return (
          <div className="animate-in slide-in-from-right duration-500 space-y-12">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveNicheSelection(null)} className="p-3 bg-[#121212] border border-white/5 rounded-2xl text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all"><ArrowLeft size={20} /></button>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter"><span className="text-[#D4AF37] mr-3">CRIATIVOS:</span> {activeNicheSelection}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.filter(o => o.niche === activeNicheSelection).flatMap(offer => 
                offer.creativeEmbedUrls.map((embedUrl, idx) => (
                  <div key={`${offer.id}-creative-${idx}`} className="bg-[#121212] p-5 rounded-[28px] border border-white/5 flex flex-col gap-5 group shadow-xl hover:border-[#D4AF37]/50 transition-all">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-white/5">
                      <VideoPlayer url={embedUrl} title={`Creative ${idx + 1} - ${offer.title}`} />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-black uppercase text-xs italic truncate flex-1 mr-4">{offer.title} - #{idx + 1}</span>
                        <div className="flex gap-2">
                          <button onClick={(e) => toggleFavorite(offer.id, e)} className={`p-2 rounded-lg ${favorites.includes(offer.id) ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-500 hover:text-white'}`}><Star size={14} fill={favorites.includes(offer.id) ? "currentColor" : "none"} /></button>
                          <a href={offer.creativeDownloadUrls[idx] || '#'} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#D4AF37] text-black rounded-lg hover:scale-110 transition-transform"><Download size={14} /></a>
                        </div>
                      </div>
                      <button onClick={() => openOffer(offer)} className="w-full py-2.5 bg-[#1a1a1a] text-[#D4AF37] font-black text-[9px] uppercase tracking-widest rounded-xl italic hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/20">Ver Oferta Completa</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'pages':
        if (!activeNicheSelection) return renderSelectionGrid(allNiches, setActiveNicheSelection, FileText, "PÁGINAS DE ALTA CONVERSÃO");
        return (
          <div className="animate-in slide-in-from-right duration-500 space-y-12">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveNicheSelection(null)} className="p-3 bg-[#121212] border border-white/5 rounded-2xl text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all"><ArrowLeft size={20} /></button>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter"><span className="text-[#D4AF37] mr-3">PÁGINAS:</span> {activeNicheSelection}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {offers.filter(o => o.niche === activeNicheSelection && o.pageUrl && o.pageUrl !== '#').map(o => (
                <div key={o.id} className="bg-[#121212] rounded-[28px] overflow-hidden border border-white/5 group hover:border-[#D4AF37]/50 transition-all flex flex-col shadow-2xl h-full">
                  <div className="aspect-[4/3] bg-black relative">
                    <img src={getDriveDirectLink(o.coverImage)} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a href={o.pageUrl} target="_blank" rel="noopener noreferrer" className="p-5 bg-[#D4AF37] text-black rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl"><Monitor size={28} /></a>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="mb-6">
                      <h3 className="text-white font-black uppercase text-sm italic mb-2 tracking-tight group-hover:text-[#D4AF37] transition-colors">{o.title}</h3>
                      <p className="text-gray-500 text-[10px] font-bold uppercase italic truncate">{o.pageUrl}</p>
                    </div>
                    <div className="space-y-2">
                       <a href={o.pageUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-widest rounded-xl text-center italic hover:scale-105 transition-all shadow-lg block">Acessar Link Externo</a>
                       <button onClick={() => openOffer(o)} className="w-full py-3 bg-[#1a1a1a] text-white font-black text-[10px] uppercase tracking-widest rounded-xl text-center italic hover:bg-white hover:text-black transition-all border border-white/5">Ver Oferta Completa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ads_library':
        if (!activeLanguageSelection) return renderSelectionGrid(allLanguages, setActiveLanguageSelection, Library, "BIBLIOTECA DE ANÚNCIOS");
        return (
          <div className="animate-in slide-in-from-right duration-500 space-y-12">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveLanguageSelection(null)} className="p-3 bg-[#121212] border border-white/5 rounded-2xl text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all"><ArrowLeft size={20} /></button>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter"><span className="text-[#D4AF37] mr-3">IDIOMA:</span> {activeLanguageSelection}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offers.filter(o => o.language === activeLanguageSelection && o.facebookUrl && o.facebookUrl !== '#').map(o => (
                <div key={o.id} className="bg-[#121212] p-8 rounded-[32px] border border-white/5 hover:border-[#D4AF37]/50 transition-all flex flex-col gap-8 shadow-2xl group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="p-5 bg-[#1a1a1a] rounded-2xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all shadow-xl"><Facebook size={32} /></div>
                      <div>
                        <p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest mb-1 italic">FACEBOOK ADS LIBRARY</p>
                        <h3 className="text-white font-black uppercase text-xl italic tracking-tight">{o.title}</h3>
                      </div>
                    </div>
                    <button onClick={(e) => toggleFavorite(o.id, e)} className={`p-3 rounded-xl ${favorites.includes(o.id) ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-500 hover:text-white'}`}><Star size={20} fill={favorites.includes(o.id) ? "currentColor" : "none"} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href={o.facebookUrl} target="_blank" rel="noopener noreferrer" className="py-4 bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-widest rounded-xl text-center italic hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"><ExternalLink size={16} /> Acessar Link Externo</a>
                    <button onClick={() => openOffer(o)} className="py-4 bg-[#1a1a1a] text-white font-black text-[10px] uppercase tracking-widest rounded-xl italic hover:bg-white hover:text-black transition-all border border-white/5">Ver Oferta Completa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'favorites':
        const favs = offers.filter(o => favorites.includes(o.id));
        return (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4"><Star className="text-[#D4AF37]" fill="currentColor" /> SEUS FAVORITOS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {favs.map(o => <OfferCard key={o.id} offer={o} isFavorite={true} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
            </div>
            {favs.length === 0 && <p className="text-gray-600 font-black uppercase text-sm italic py-20 text-center col-span-full">Sua lista privada de favoritos está vazia.</p>}
          </div>
        );
      case 'settings':
        return (
          <div className="animate-in fade-in duration-700 max-w-5xl mx-auto space-y-10">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic flex items-center gap-4"><Settings className="text-[#D4AF37]" /> Painel do Agente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#121212] p-8 rounded-[32px] border border-white/5 shadow-2xl">
                <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-widest mb-8 italic">Identidade Operacional</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5"><span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">SENHA</span><span className="text-white font-black uppercase italic text-lg">{agentId}</span></div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5"><span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">SESSÃO</span><span className="bg-[#D4AF37] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">INDIVIDUAL / PRIVADA</span></div>
                </div>
              </div>
              <div className="bg-[#121212] p-8 rounded-[32px] border border-white/5 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic mb-6">SUPORTE</h3>
                  <span className="text-white font-black text-xl italic mb-8 block">{SUPPORT_EMAIL}</span>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(SUPPORT_EMAIL); alert('E-MAIL COPIADO! 📡'); }} className="w-full py-4 bg-[#1a1a1a] rounded-2xl flex items-center justify-center gap-3 text-white font-black hover:bg-[#D4AF37] hover:text-black transition-all border border-white/5 uppercase text-xs tracking-widest"><Copy size={18} /> Copiar E-mail</button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const SidebarContent = () => (
    <div className="p-8 md:p-10 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-12 px-2">
        <div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10"><Eye className="text-black" size={24} /></div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
      </div>
      <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
        <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} />
        <SidebarItem icon={Star} label="SEUS FAVORITOS" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} />
        <SidebarItem icon={Settings} label="PAINEL DO AGENTE" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} />
        
        <div className="pt-8 pb-4">
          <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
          <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} />
          <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} />
          <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} />
          <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => navigateToPage('pages')} />
          <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} />
        </div>
      </nav>
      
      <div className="mt-8 space-y-3">
        <SidebarItem icon={LogOut} label="Sair" active={false} onClick={handleLogout} variant="danger" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {isLoggedIn ? (
        <>
          {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />}
          <aside className={`w-72 bg-[#121212] border-r border-white/5 flex flex-col fixed h-screen z-[110] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}><SidebarContent /></aside>
          <main className="flex-1 lg:ml-72 relative w-full">
            <header className="h-auto py-6 md:py-8 flex flex-col px-4 md:px-10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-[80] border-b border-white/5 gap-4 md:gap-6">
              <div className="flex items-center justify-between gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-[#121212] border border-white/5 rounded-xl text-[#D4AF37] hover:bg-[#1a1a1a] transition-colors"><Menu size={24} /></button>
                <div className="flex-1 flex items-center bg-[#121212] px-4 md:px-6 py-2.5 md:py-3 rounded-[16px] md:rounded-[24px] border border-white/5 shadow-inner max-w-xl">
                   <Search className="text-gray-500 mr-3 md:mr-4" size={18} />
                   <input 
                     type="text" 
                     placeholder="Pesquisar inteligência..." 
                     value={searchQuery} 
                     onChange={(e) => setSearchQuery(e.target.value)} 
                     className="bg-transparent border-none outline-none text-xs md:text-sm w-full font-bold placeholder:text-gray-700" 
                   />
                </div>
                <div className="flex items-center gap-3 bg-[#121212] p-1.5 pr-4 md:pr-6 rounded-[16px] md:rounded-[24px] border border-white/5 shadow-2xl ml-2 md:ml-6 shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#D4AF37] rounded-lg md:rounded-xl flex items-center justify-center font-black text-black text-sm md:text-lg shadow-lg">007</div>
                    <div className="hidden sm:block"><p className="font-black text-[10px] uppercase tracking-tighter text-white leading-none">Agente Ativo</p></div>
                </div>
              </div>
              
              {showFilters && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500 flex flex-wrap items-center gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { label: 'Nicho', value: selectedNiche, setter: setSelectedNiche, options: ['Todos', ...allNiches] },
                    { label: 'Tipo', value: selectedType, setter: setSelectedType, options: ['Todos', ...allTypes] },
                    { label: 'Idioma', value: selectedLanguage, setter: setSelectedLanguage, options: ['Todos', ...allLanguages] },
                    { label: 'Fonte', value: selectedTraffic, setter: setSelectedTraffic, options: ['Todos', ...allTrafficSources] }
                  ].map((f, i) => (
                    <div key={i} className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">{f.label}</label>
                      <select 
                        value={f.value} 
                        onChange={(e) => f.setter(e.target.value)} 
                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-[#D4AF37] cursor-pointer transition-all"
                      >
                        {f.options.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </header>
            
            <div className="p-4 md:p-10 max-w-[1600px] mx-auto min-h-screen pb-32">{renderContent()}</div>
          </main>
        </>
      ) : (
        <LandingPage onLogin={handleLogin} isSuccess={isSuccess} agentId={newlyGeneratedId} onDismissSuccess={dismissSuccess} />
      )}
    </div>
  );
};

export default App;
