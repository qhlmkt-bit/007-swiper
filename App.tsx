import React, { useState, useEffect } from 'react';
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
  MousePointer2, 
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
  Flame
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

  .plan-card {
    border-radius: 2.5rem;
    transition: all 0.4s ease;
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
 * UTILS - DATA NORMALIZATION
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
    if (vimeoIdMatch) {
      const baseEmbed = `https://player.vimeo.com/video/${vimeoIdMatch[1]}`;
      return `${baseEmbed}?title=0&byline=0&portrait=0&badge=0&autopause=0`;
    }
  }
  
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const ytIdMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (ytIdMatch) return `https://www.youtube.com/embed/${ytIdMatch[1]}`;
  }

  return trimmed;
};

/**
 * UI COMPONENTS
 */

const SidebarItem: React.FC<{
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'danger';
}> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' 
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
 * LANDING PAGE COMPONENT
 */
const LandingPage = ({ onLogin, isSuccess, onCloseSuccess }: any) => (
  <div className="w-full bg-[#0a0a0a] flex flex-col items-center justify-center min-h-screen selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
    {/* Global Styles */}
    <style dangerouslySetInnerHTML={{ __html: STYLES }} />

    {/* Success Access Notification */}
    {isSuccess && (
      <div className="w-full bg-[#050505] border-b-2 border-[#D4AF37] py-6 px-4 md:px-12 text-center flex flex-col md:flex-row items-center justify-between gap-6 sticky top-0 z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-top duration-500">
        <div className="flex items-center gap-4 text-left max-w-4xl mx-auto md:mx-0">
          <div className="bg-[#D4AF37] p-3 rounded-full shrink-0">
            <ShieldCheck size={28} className="text-black" />
          </div>
          <div>
            <h2 className="text-[#D4AF37] font-black uppercase text-lg md:text-2xl tracking-tighter italic leading-none mb-1">ACESSO À INTELIGÊNCIA LIBERADO!</h2>
            <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-tight leading-none">Sua chave é única e confidencial. SENHA: <span className="text-[#D4AF37] font-black">AGENTE007</span></p>
          </div>
        </div>
        <button onClick={onLogin} className="w-full md:w-auto px-8 py-3 bg-[#D4AF37] text-black font-black rounded-xl uppercase hover:scale-105 transition-all shadow-xl italic tracking-tighter">ENTRAR NO ARSENAL</button>
      </div>
    )}
    
    <nav className="w-full max-w-7xl px-4 md:px-8 py-10 flex justify-between items-center relative z-50 mx-auto">
      <div className="flex items-center space-x-3">
        <div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl shadow-[#D4AF37]/20">
          <Eye className="text-black" size={28} />
        </div>
        <span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-[#121212]/50 border border-[#D4AF37]/30 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">AGENTE ATIVO</span>
        </div>
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

      {/* Demo Video Section - Restored */}
      <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-[#D4AF37]/40 mx-auto mb-32">
        <div className="bg-[#D4AF37] p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500 mb-6 flex items-center justify-center">
          <Play size={40} fill="black" className="text-black ml-1" />
        </div>
        <p className="text-white font-black uppercase text-[10px] md:text-xs tracking-[0.25em] italic max-w-md px-8 leading-relaxed text-center">
          Descubra como rastreamos e organizamos ofertas escaladas em tempo real
        </p>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent h-[1px] w-full animate-pulse top-1/3"></div>
      </section>

      {/* PLAN CARDS SECTION - CENTERED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 w-full max-w-5xl mb-40 px-4 justify-center justify-items-center items-stretch mx-auto">
        {/* Monthly Plan (Dark) */}
        <div className="bg-[#121212] border border-white/5 rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all flex flex-col w-full shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO MENSAL</h3>
          <div className="flex items-baseline gap-2 mb-10">
            <span className="text-5xl font-black text-white italic">R$ 197</span>
            <span className="text-gray-500 font-black text-sm uppercase">/mês</span>
          </div>
          <ul className="space-y-4 mb-12 flex-1">
            {[
              'Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 
              'Templates de Funil', 'Transcrições de VSL', 'Radar de Tendências', 
              '007 Academy', 'Hub de Afiliação', 'Cloaker VIP', 'Suporte Prioritário'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic">
                <CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col">
            <button 
              onClick={() => window.open(KIWIFY_MENSAL, '_blank')}
              className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter animate-btn-pulse shadow-xl italic"
            >
              QUERO ACESSO MENSAL
            </button>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-4 text-center italic tracking-wider">Acesso imediato enviado para o seu e-mail.</p>
          </div>
        </div>

        {/* Quarterly Plan (White) */}
        <div className="bg-white text-black rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col scale-105 border-t-[8px] border-[#D4AF37] w-full">
          <div className="absolute top-6 right-8 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            Economize R$ 94
          </div>
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO TRIMESTRAL</h3>
          <div className="flex items-baseline gap-2 mb-10">
            <span className="text-5xl font-black italic">R$ 497</span>
            <span className="text-gray-400 font-black text-sm uppercase">/trimestre</span>
          </div>
          <ul className="space-y-4 mb-12 flex-1">
            {[
              'Acesso a Todas as Ofertas', 'Banco de Criativos Híbrido', 'Comunidade VIP Exclusiva', 
              'Checklist de Modelagem 007', '12% OFF na IDL Edições', 'Transcrições Ilimitadas', 
              'Radar de Tendências Global', 'Hub de Afiliação Premium', 'Academy Completo', 'Suporte Agente Black'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic">
                <CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col">
            <button 
              onClick={() => window.open(KIWIFY_TRIMESTRAL, '_blank')}
              className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-tighter animate-btn-pulse italic"
            >
              ASSINAR PLANO TRIMESTRAL
            </button>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-4 text-center italic tracking-wider">Acesso imediato enviado para o seu e-mail.</p>
          </div>
        </div>
      </div>

      {/* GUARANTEE SECTION - CENTERED */}
      <section className="w-full max-w-7xl px-4 md:px-8 mb-32 flex justify-center mx-auto text-center">
        <div className="w-full max-w-4xl bg-[#121212] p-10 md:p-16 rounded-[40px] border border-[#D4AF37]/20 flex flex-col md:flex-row items-center gap-10 md:gap-16 shadow-2xl mx-auto">
          <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 flex items-center justify-center border-4 border-[#D4AF37] rounded-full relative mx-auto md:mx-0 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <span className="text-[#D4AF37] font-black text-6xl md:text-7xl italic leading-none">7</span>
            <span className="absolute -bottom-2 bg-[#D4AF37] text-black px-4 py-1 text-[10px] font-black uppercase rounded shadow-lg">Dias</span>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-white font-black text-2xl md:text-4xl uppercase italic mb-4 tracking-tighter text-center md:text-left">GARANTIA INCONDICIONAL DE 7 DIAS</h2>
            <p className="text-gray-500 font-medium text-base mb-8 leading-relaxed italic text-center md:text-left">
              Estamos tão seguros da qualidade do nosso arsenal que oferecemos risco zero. Se em até 7 dias você sentir que a plataforma não é para você, devolvemos 100% do seu dinheiro. Sem perguntas.
            </p>
            <div className="flex flex-col items-center md:items-start w-full">
              <button 
                onClick={() => window.open(KIWIFY_TRIMESTRAL, '_blank')}
                className="px-10 py-5 bg-[#D4AF37] text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-tighter animate-btn-pulse italic w-full md:w-auto"
              >
                [COMEÇAR AGORA – RISCO ZERO]
              </button>
              <p className="text-[10px] text-gray-600 font-bold uppercase mt-4 italic tracking-wider text-center w-full md:w-auto">Acesso imediato enviado para o seu e-mail.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-7xl px-4 md:px-8 border-t border-white/5 pt-12 pb-20 mx-auto">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic text-center">
          © 2024 007 SWIPER Intelligence Platform. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  </div>
);

/**
 * MAIN APP
 */
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [activeVslIndex, setActiveVslIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [selectedNiche, setSelectedNiche] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [selectedTraffic, setSelectedTraffic] = useState<string>('Todos');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Todos');

  // Sub-navigation states
  const [activeNicheModule, setActiveNicheModule] = useState<string | null>(null);
  const [activeLanguageModule, setActiveLanguageModule] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch Data from Google Sheets
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await fetch(CSV_URL);
        const text = await response.text();
        
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) throw new Error("Database file is missing expected headers.");

        const parsedData: Offer[] = lines.slice(2).map((line, idx) => {
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, '').trim());
          
          if (!values[1] || values[1].toLowerCase() === 'undefined' || values[1] === '') {
            return null;
          }

          return {
            id: values[0] || String(idx),
            title: values[1],
            niche: values[2] || 'Geral',
            productType: values[3] || 'Geral', 
            description: values[4] || '',
            coverImage: values[5] || '',
            views: values[7] || '', 
            vslLinks: [{ label: 'VSL Principal', url: values[8] || '' }],
            vslDownloadUrl: values[9] || '#',
            trend: (values[6] as Trend) || 'Estável',
            transcriptionUrl: values[10] || '#',
            creativeEmbedUrls: (values[11] || '').split(',').map(s => s.trim()).filter(Boolean),
            creativeDownloadUrls: (values[12] || '').split(',').map(s => s.trim()).filter(Boolean),
            facebookUrl: values[13] || '#',
            pageUrl: values[14] || '#',
            language: values[15] || 'Português',
            trafficSource: (values[16] || '').split(',').map(s => s.trim()).filter(Boolean),
            creativeZipUrl: values[17] || '#',
            creativeImages: [], 
          };
        }).filter((o): o is Offer => o !== null);

        // REVERSE CHRONOLOGICAL ORDER: Last line of spreadsheet first in app
        setOffers([...parsedData].reverse());
      } catch (error) {
        console.error('Error fetching intelligence database:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsSuccess(true);
    }
    const savedFavs = localStorage.getItem('007_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedViewed = localStorage.getItem('007_viewed');
    if (savedViewed) setRecentlyViewed(JSON.parse(savedViewed));
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage, selectedOffer]);

  const handleLogin = () => {
    const password = window.prompt("🕵️‍♂️ ACESSO RESTRITO\nDigite a senha de agente VIP:");
    if (password === 'AGENTE007') {
      setIsLoggedIn(true);
      setIsSuccess(false);
    } else if (password !== null) {
      alert('ACESSO NEGADO ❌');
    }
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('007_favs', JSON.stringify(newFavs));
  };

  const trackView = (offer: Offer) => {
    const newViewed = [offer.id, ...recentlyViewed.filter(id => id !== offer.id)].slice(0, 8);
    setRecentlyViewed(newViewed);
    localStorage.setItem('007_viewed', JSON.stringify(newViewed));
    setSelectedOffer(offer);
  };

  const applyEliteFilters = (offersList: Offer[]) => {
    return offersList.filter(o => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q);
      const matchesNiche = selectedNiche === 'Todos' || o.niche.toLowerCase() === selectedNiche.toLowerCase();
      const matchesType = selectedType === 'Todos' || o.productType.toLowerCase() === selectedType.toLowerCase();
      const matchesLanguage = selectedLanguage === 'Todos' || o.language.toLowerCase() === selectedLanguage.toLowerCase();
      const matchesTraffic = selectedTraffic === 'Todos' || o.trafficSource.some(ts => ts.toLowerCase() === selectedTraffic.toLowerCase());
      return matchesSearch && matchesNiche && matchesType && matchesLanguage && matchesTraffic;
    });
  };

  const getUniqueValues = (key: keyof Offer) => {
    const valuesSet = new Set<string>();
    offers.forEach(o => {
      const val = o[key];
      if (Array.isArray(val)) {
        val.forEach(v => {
          const trimmed = String(v).trim();
          if (trimmed && trimmed.toLowerCase() !== 'undefined') valuesSet.add(trimmed);
        });
      } else if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed && trimmed.toLowerCase() !== 'undefined') valuesSet.add(trimmed);
      }
    });

    const caseMap = new Map<string, string>();
    Array.from(valuesSet).forEach(v => {
      const lower = v.toLowerCase();
      if (!caseMap.has(lower)) {
        caseMap.set(lower, v);
      }
    });

    return ['Todos', ...Array.from(caseMap.values()).sort((a, b) => a.localeCompare(b))];
  };

  const availableNiches = getUniqueValues('niche');
  const availableLanguages = getUniqueValues('language');
  const availableTypes = getUniqueValues('productType');
  const availableTrafficSources = getUniqueValues('trafficSource');

  const showFilters = ['home', 'offers'].includes(currentPage) && !selectedOffer;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('qhl.mkt@gmail.com');
    alert('E-mail copiado para a área de transferência! 📋');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-40 gap-4 animate-pulse">
          <Loader2 className="text-[#D4AF37] animate-spin" size={48} />
          <p className="text-[#D4AF37] font-black uppercase text-xs tracking-widest italic">Infiltrando nos Servidores...</p>
        </div>
      );
    }

    if (selectedOffer) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <button 
              onClick={() => { setSelectedOffer(null); setActiveVslIndex(0); }}
              className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs tracking-widest group"
            >
              <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                <ChevronRight className="rotate-180" size={16} />
              </div>
              Voltar para Base
            </button>
            
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href={selectedOffer.vslDownloadUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg italic"
              >
                <Download size={16} /> BAIXAR VSL
              </a>
              <a 
                href={selectedOffer.transcriptionUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#D4AF37] border border-white/5 transition-all shadow-lg italic"
              >
                <FileText size={16} /> BAIXAR TRANSCRIÇÃO
              </a>
              <button 
                onClick={() => toggleFavorite(selectedOffer.id)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg border ${favorites.includes(selectedOffer.id) ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#1a1a1a] text-white border-white/5'}`}
              >
                <Star size={16} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'FAVORITADO' : 'FAVORITAR'}
              </button>
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col gap-3 mb-8">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedOffer.title}</h2>
              {selectedOffer.views && selectedOffer.views.trim() !== '' && (
                <div className="flex items-center gap-3 bg-[#121212]/50 px-4 py-2 rounded-xl border border-[#D4AF37]/30 w-fit">
                  <Flame size={20} fill="currentColor" className="text-[#D4AF37] animate-bounce" />
                  <span className="text-[#D4AF37] font-black uppercase text-sm md:text-base italic tracking-widest">{selectedOffer.views}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-[60%] space-y-6">
                <div className="bg-[#121212] p-4 md:p-6 rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-6 scrollbar-hide">
                    {selectedOffer.vslLinks.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVslIndex(idx)}
                        className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 whitespace-nowrap ${
                          activeVslIndex === idx ? 'bg-[#D4AF37] text-black' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        <Video size={12} /> {link.label}
                      </button>
                    ))}
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 relative z-10">
                    <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} title="VSL Player" />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[40%] space-y-4">
                <div className="bg-[#121212] p-6 md:p-8 rounded-[32px] border border-white/5 shadow-2xl h-full">
                  <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3 italic">
                    <ShieldCheck className="w-4 h-4" /> INFORMAÇÕES DA OPERAÇÃO
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {[
                      { icon: Tag, label: 'Nicho', value: selectedOffer.niche },
                      { icon: Lock, label: 'Tipo', value: selectedOffer.productType },
                      { icon: Info, label: 'Briefing', value: selectedOffer.description || 'Briefing confidencial' },
                      { icon: Globe, label: 'Idioma', value: selectedOffer.language },
                      { icon: Target, label: 'Fontes', value: selectedOffer.trafficSource.join(', ') },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col p-4 bg-[#1a1a1a] rounded-2xl border border-white/5 gap-2">
                        <div className="flex items-center gap-3">
                          <item.icon className="text-[#D4AF37] w-5 h-5 shrink-0" />
                          <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className="text-white text-sm font-black uppercase italic tracking-tight whitespace-normal break-words leading-relaxed">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2">
                 <ImageIcon className="text-[#D4AF37] w-6 h-6" /> CRIATIVOS
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedOffer.creativeEmbedUrls.slice(0, 3).map((embedUrl, i) => (
                    <div key={i} className="flex flex-col gap-4">
                      <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                        <VideoPlayer url={embedUrl} title={`Creative Player ${i + 1}`} />
                      </div>
                      <a 
                        href={selectedOffer.creativeDownloadUrls[i] || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#1a1a1a] text-[#D4AF37] font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/20 italic"
                      >
                        <Download size={14} /> BAIXAR ESTE CRIATIVO
                      </a>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2">
                 <Layout className="text-[#D4AF37] w-6 h-6" /> ESTRUTURA DE VENDAS
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <a href={selectedOffer.pageUrl} target="_blank" rel="noopener noreferrer" className="p-6 bg-[#121212] rounded-[28px] border border-white/5 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded-xl group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acessar</p>
                        <p className="text-white font-black uppercase text-base md:text-lg italic">PÁGINA OFICIAL</p>
                      </div>
                   </div>
                   <ExternalLink size={20} className="text-gray-600 group-hover:text-[#D4AF37]" />
                 </a>
                 <a href={selectedOffer.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-6 bg-[#121212] rounded-[28px] border border-white/5 hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded-xl group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <Facebook size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acessar</p>
                        <p className="text-white font-black uppercase text-base md:text-lg italic">BIBLIOTECA DE ANÚNCIOS</p>
                      </div>
                   </div>
                   <ExternalLink size={20} className="text-gray-600 group-hover:text-[#D4AF37]" />
                 </a>
               </div>
            </div>

            <div className="pt-10 md:pt-16 flex justify-center pb-8 border-t border-white/5">
                <a 
                  href={selectedOffer.creativeZipUrl && selectedOffer.creativeZipUrl !== '#' ? selectedOffer.creativeZipUrl : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-12 py-6 bg-[#D4AF37] text-black font-black text-xl md:text-2xl rounded-[24px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(212,175,55,0.25)] uppercase tracking-tighter flex items-center gap-4 italic group"
                  onClick={(e) => {
                    if (!selectedOffer.creativeZipUrl || selectedOffer.creativeZipUrl === '#') {
                      e.preventDefault();
                      alert('Link do Arsenal ZIP não configurado nesta oferta.');
                    }
                  }}
                >
                  <div className="p-2 bg-black/10 rounded-xl group-hover:bg-black/20 transition-colors">
                    <Zap size={24} fill="currentColor" className="md:w-8 md:h-8" />
                  </div>
                  BAIXAR ARSENAL COMPLETO (ZIP)
                </a>
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
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                  <Zap className="text-[#D4AF37]" fill="currentColor" /> OPERAÇÕES EM ESCALA
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {scalingHome.map(offer => (
                    <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    isFavorite={favorites.includes(offer.id)}
                    onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                    onClick={() => trackView(offer)}
                    />
                ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                  <Monitor className="text-[#D4AF37]" /> VISTOS RECENTEMENTE
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {recentlyHome.map(offer => (
                    <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    isFavorite={favorites.includes(offer.id)}
                    onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                    onClick={() => trackView(offer)}
                    />
                ))}
                {recentlyHome.length === 0 && <p className="text-gray-600 font-bold uppercase text-xs italic px-2">Nenhuma atividade registrada.</p>}
                </div>
            </div>
          </div>
        );

      case 'offers':
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filtered.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={favorites.includes(offer.id)}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => trackView(offer)}
                />
              ))}
            </div>
            {filtered.length === 0 && <p className="text-gray-600 font-black uppercase text-sm italic py-20 text-center">Nenhuma inteligência encontrada para estes filtros.</p>}
          </div>
        );

      case 'vsl':
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filtered.map(offer => (
                <div key={offer.id} onClick={() => trackView(offer)} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all shadow-xl">
                    <div className="relative aspect-video">
                        <img src={getDriveDirectLink(offer.coverImage)} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-[#D4AF37] text-black rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                                <Play fill="currentColor" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-[#1a1a1a]">
                        <p className="text-white font-black uppercase text-sm italic mb-1 truncate">{offer.title}</p>
                        <div className="flex items-center gap-2">
                           {offer.trafficSource.slice(0, 2).map((s, i) => <TrafficIcon key={i} source={s} />)}
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{offer.productType}</p>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'creatives':
        if (!activeNicheModule) {
          const uniqueNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
          return (
            <div className="animate-in fade-in duration-700">
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                 <Palette className="text-[#D4AF37]" /> ARSENAL POR NICHO
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {uniqueNiches.map(niche => (
                    <div 
                      key={niche} 
                      onClick={() => setActiveNicheModule(niche)}
                      className="bg-[#121212] p-8 rounded-3xl border border-white/5 hover:border-[#D4AF37]/50 transition-all group cursor-pointer text-center relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                          <ImageIcon size={80} />
                       </div>
                       <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-[#D4AF37] mx-auto mb-6 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                         <Tag size={32} />
                       </div>
                       <h3 className="text-white font-black uppercase text-xl italic group-hover:text-[#D4AF37] transition-colors">{niche}</h3>
                       <p className="text-gray-600 font-bold text-[10px] uppercase mt-4 tracking-widest">
                         {offers.filter(o => o.niche === niche).length} Ofertas Mapeadas
                       </p>
                    </div>
                  ))}
               </div>
            </div>
          );
        }

        const nicheOffers = offers.filter(o => o.niche === activeNicheModule);
        return (
          <div className="animate-in fade-in duration-700 space-y-12">
             <button 
               onClick={() => setActiveNicheModule(null)}
               className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs tracking-widest group"
             >
               <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                 <ChevronRight className="rotate-180" size={16} />
               </div>
               Voltar para Nichos
             </button>
             
             <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8">
               CRIATIVOS: <span className="text-[#D4AF37]">{activeNicheModule}</span>
             </h2>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {nicheOffers.map(offer => (
                  <div key={offer.id} onClick={() => trackView(offer)} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all shadow-xl">
                      <div className="relative aspect-video">
                          <img src={getDriveDirectLink(offer.coverImage)} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt={offer.title} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                              <ImageIcon className="text-[#D4AF37] group-hover:scale-125 transition-all" size={32} />
                              <p className="text-[10px] text-white font-black uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full shadow-lg border border-white/10">
                                {offer.creativeEmbedUrls.length} {offer.creativeEmbedUrls.length === 1 ? 'VÍDEO' : 'VÍDEOS'}
                              </p>
                          </div>
                      </div>
                      <div className="p-4 bg-[#1a1a1a]">
                          <p className="text-white font-black uppercase text-sm italic mb-1 truncate">{offer.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Acessar Arsenal</p>
                      </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'pages':
        return (
          <div className="animate-in fade-in duration-700">
             <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
               <Monitor className="text-[#D4AF37]" /> FUNIS E PÁGINAS DE VENDA
             </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filtered.map(offer => (
                <div key={offer.id} onClick={() => trackView(offer)} className="bg-[#121212] p-6 rounded-[32px] border border-white/5 hover:border-[#D4AF37]/50 transition-all shadow-xl group cursor-pointer">
                    <div className="w-full aspect-square bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                      <Monitor size={64} className="opacity-20 group-hover:opacity-100" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-black uppercase text-sm italic mb-2 tracking-tighter line-clamp-2">{offer.title}</p>
                        <div className="flex items-center justify-center gap-2">
                           <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{offer.niche}</p>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ads_library':
        if (!activeLanguageModule) {
          const uniqueLangs = Array.from(new Set(offers.map(o => o.language))).sort();
          return (
            <div className="animate-in fade-in duration-700">
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                 <Library className="text-[#D4AF37]" /> BIBLIOTECA POR IDIOMA
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {uniqueLangs.map(lang => (
                    <div 
                      key={lang} 
                      onClick={() => setActiveLanguageModule(lang)}
                      className="bg-[#121212] p-8 rounded-3xl border border-white/5 hover:border-[#D4AF37]/50 transition-all group cursor-pointer text-center"
                    >
                       <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#D4AF37] mx-auto mb-6 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                         <Globe size={32} />
                       </div>
                       <h3 className="text-white font-black uppercase text-xl italic group-hover:text-[#D4AF37] transition-colors">{lang}</h3>
                       <p className="text-gray-600 font-bold text-[10px] uppercase mt-4 tracking-widest">
                         Explorar Inteligência
                       </p>
                    </div>
                  ))}
               </div>
            </div>
          );
        }

        const langOffers = offers.filter(o => o.language === activeLanguageModule);
        return (
          <div className="animate-in fade-in duration-700 space-y-12">
             <button 
               onClick={() => setActiveLanguageModule(null)}
               className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs tracking-widest group"
             >
               <div className="bg-[#1a1a1a] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                 <ChevronRight className="rotate-180" size={16} />
               </div>
               Voltar para Idiomas
             </button>
             
             <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8">
               INTELIGÊNCIA: <span className="text-[#D4AF37]">{activeLanguageModule}</span>
             </h2>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {langOffers.map(offer => (
                <div key={offer.id} onClick={() => trackView(offer)} className="bg-[#121212] p-6 rounded-2xl border border-white/5 hover:border-[#D4AF37]/50 transition-all group cursor-pointer">
                    <p className="text-white font-black uppercase text-sm italic mb-4 truncate">{offer.title}</p>
                    <div className="flex items-center justify-between gap-2">
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{offer.productType}</p>
                       <ExternalLink size={14} className="text-gray-600 group-hover:text-[#D4AF37]" />
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        const favList = offers.filter(o => favorites.includes(o.id));
        const filteredFavs = applyEliteFilters(favList);
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredFavs.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={true}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => trackView(offer)}
                />
              ))}
            </div>
            {filteredFavs.length === 0 && <p className="text-gray-600 font-black uppercase text-sm italic py-20 text-center">Nenhum favorito encontrado.</p>}
          </div>
        );

      case 'settings':
        return (
          <div className="animate-in fade-in duration-700 max-w-5xl mx-auto space-y-10">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic flex items-center gap-4">
              <Settings className="text-[#D4AF37]" /> Painel do Agente
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#121212] p-6 rounded-[24px] border border-white/5 shadow-2xl">
                <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-widest mb-6 italic">Identificação do Operador</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Agente</span>
                    <span className="text-white font-black uppercase italic text-sm">Operador 007</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Plano</span>
                    <span className="bg-[#D4AF37] text-black px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest italic shadow-lg shadow-[#D4AF37]/10">Operação VIP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Acesso</span>
                    <span className="text-white font-black uppercase italic text-sm">Ilimitado</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#121212] p-6 rounded-[24px] border border-white/5 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-widest mb-6 italic">Suporte e Contatos</h3>
                  <div className="flex flex-col gap-1.5 mb-6">
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">E-mail de Comando</span>
                    <span className="text-white font-black text-lg md:text-xl italic">qhl.mkt@gmail.com</span>
                  </div>
                </div>
                <button 
                  onClick={handleCopyEmail}
                  className="w-full py-3.5 bg-[#1a1a1a] rounded-xl flex items-center justify-center gap-3 text-white font-black hover:bg-[#D4AF37] hover:text-black transition-all border border-white/5 uppercase text-xs tracking-widest"
                >
                  <Copy size={16} /> Copiar E-mail
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center py-20 text-gray-500 font-black uppercase italic">Em desenvolvimento...</div>;
    }
  };

  const SidebarContent = () => (
    <div className="p-10 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-16 px-2">
        <div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10">
          <Eye className="text-black" size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
      </div>
      
      <nav className="space-y-2">
        <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => { setCurrentPage('home'); setSelectedOffer(null); }} />
        <SidebarItem icon={Star} label="SEUS FAVORITOS" active={currentPage === 'favorites'} onClick={() => { setCurrentPage('favorites'); setSelectedOffer(null); }} />
        <SidebarItem icon={Settings} label="PAINEL DO AGENTE" active={currentPage === 'settings'} onClick={() => { setCurrentPage('settings'); setSelectedOffer(null); }} />
        
        <div className="pt-8 pb-4">
          <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
          <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers' || (selectedOffer !== null && currentPage === 'offers')} onClick={() => { setCurrentPage('offers'); setSelectedOffer(null); }} />
          <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => { setCurrentPage('vsl'); setSelectedOffer(null); }} />
          <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => { setCurrentPage('creatives'); setSelectedOffer(null); setActiveNicheModule(null); }} />
          <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => { setCurrentPage('pages'); setSelectedOffer(null); }} />
          <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => { setCurrentPage('ads_library'); setSelectedOffer(null); setActiveLanguageModule(null); }} />
        </div>
      </nav>

      <div className="mt-auto">
        <SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => setIsLoggedIn(false)} variant="danger" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {isLoggedIn ? (
        <>
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          <aside className={`w-72 bg-[#121212] border-r border-white/5 flex flex-col fixed h-screen z-[110] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <SidebarContent />
          </aside>

          <main className="flex-1 lg:ml-72 relative w-full">
            <header className="h-auto py-6 md:py-8 flex flex-col px-4 md:px-10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-[80] border-b border-white/5 gap-4 md:gap-6">
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 bg-[#121212] border border-white/5 rounded-xl text-[#D4AF37] hover:bg-[#1a1a1a] transition-colors"
                >
                  <Menu size={24} />
                </button>

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
                    <div className="hidden sm:block">
                      <p className="font-black text-[10px] uppercase tracking-tighter text-white leading-none">Agente Ativo</p>
                    </div>
                </div>
              </div>

              {showFilters && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <button 
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="lg:hidden w-full flex items-center justify-center gap-2 py-3 bg-[#121212] border border-[#D4AF37]/20 rounded-xl text-[#D4AF37] font-black uppercase text-[10px] tracking-widest hover:bg-[#1a1a1a] transition-all"
                  >
                    <Filter size={14} /> {isFiltersOpen ? 'FECHAR FILTROS' : 'FILTRAR RESULTADOS'}
                  </button>

                  <div className={`${isFiltersOpen ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-3 md:gap-4 mt-4 lg:mt-0 overflow-x-auto pb-2 scrollbar-hide`}>
                    <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Nicho</label>
                      <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-[#D4AF37] cursor-pointer transition-all">
                        {availableNiches.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Tipo de Produto</label>
                      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-[#D4AF37] cursor-pointer transition-all">
                        {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Tráfego</label>
                      <select value={selectedTraffic} onChange={(e) => setSelectedTraffic(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-[#D4AF37] cursor-pointer transition-all">
                        {availableTrafficSources.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Idioma</label>
                      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-[#D4AF37] cursor-pointer transition-all">
                        {availableLanguages.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </header>

            <div className="p-4 md:p-10 max-w-[1600px] mx-auto min-h-screen pb-32">
              {renderContent()}
            </div>
          </main>
        </>
      ) : (
        <LandingPage onLogin={handleLogin} isSuccess={isSuccess} onCloseSuccess={() => setIsSuccess(false)} />
      )}
    </div>
  );
};

export default App;
