
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home as HomeIcon, 
  Star, 
  Settings, 
  Tag, 
  Search, 
  LogOut, 
  ChevronRight, 
  Eye, 
  Lock, 
  Download, 
  Video, 
  Zap, 
  ZapOff, 
  Globe, 
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
  Loader2, 
  Info, 
  Copy, 
  ArrowLeft,
  LifeBuoy,
  X,
  FileText
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
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--brand-dark);
    color: #ffffff;
    margin: 0;
    overflow-x: hidden;
  }

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

const UpdateBadge: React.FC<{ index: number }> = ({ index }) => {
  if (index < 5) {
    return (
      <div className="px-2.5 py-1 bg-[#D4AF37] text-black text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl">
        <Clock size={10} fill="currentColor" /> NOVO: ADICIONADO HOJE
      </div>
    );
  } else {
    return (
      <div className="px-2.5 py-1 bg-[#1a1a1a] text-gray-400 text-[10px] font-black rounded border border-white/10 uppercase flex items-center gap-1">
        <Clock size={10} /> ATUALIZADO RECENTEMENTE
      </div>
    );
  }
};

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

const OfferCard: React.FC<{
  offer: Offer;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}> = ({ offer, index, isFavorite, onToggleFavorite, onClick }) => (
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
        <UpdateBadge index={index} />
        {offer.trend.trim().toLowerCase() === 'escalando' && (
          <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl">
            <Zap size={10} fill="currentColor" /> Escalando
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
    </div>
    <div className="p-5">
      <h3 className="font-black text-white mb-2 line-clamp-1 text-lg uppercase italic group-hover:text-[#D4AF37] transition-colors">{offer.title}</h3>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[#D4AF37] text-[10px] font-black uppercase">{offer.niche}</span>
        <div className="flex items-center gap-2">
          {offer.trafficSource.map((s, idx) => <TrafficIcon key={idx} source={s} />)}
        </div>
      </div>
    </div>
  </div>
);

/**
 * LANDING PAGE COMPONENT
 */
const LandingPage = ({ onLogin, isSuccess, agentId, onDismissSuccess }: any) => (
  <div className="w-full bg-[#0a0a0a] flex flex-col min-h-screen selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
    <style dangerouslySetInnerHTML={{ __html: STYLES }} />

    {isSuccess && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
        <div className="w-full max-w-xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-10 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)]">
          <div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            <ShieldCheck size={40} className="text-black" />
          </div>
          <h2 className="text-[#D4AF37] font-black uppercase text-2xl tracking-tighter italic mb-4">ACESSO LIBERADO!</h2>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-8">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">SUA CREDENCIAL ÚNICA</p>
            <span className="text-white text-3xl font-black italic">{agentId}</span>
          </div>
          <button 
            onClick={onDismissSuccess} 
            className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase shadow-xl italic tracking-tighter animate-btn-pulse"
          >
            [ACESSAR ARSENAL]
          </button>
        </div>
      </div>
    )}
    
    <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center mx-auto z-50">
      <div className="flex items-center space-x-3">
        <div className="bg-[#D4AF37] p-2 rounded-xl rotate-3"><Eye className="text-black" size={24} /></div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">007 SWIPER</span>
      </div>
      <button 
        onClick={onLogin}
        className="px-6 py-2.5 bg-[#D4AF37] text-black font-black rounded-full shadow-xl uppercase text-xs italic"
      >
        <Lock size={14} className="inline mr-2" /> Entrar
      </button>
    </nav>
    
    <main className="w-full max-w-7xl px-8 py-20 text-center mx-auto">
      <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
        Inteligência de Mercado de Resposta Direta
      </div>
      
      <h1 className="text-4xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tighter uppercase italic max-w-5xl mx-auto">
        MODELE AS OFERTAS QUE ESTÃO <span className="text-[#D4AF37]">GERANDO MILHÕES</span> EM TEMPO REAL.
      </h1>
      
      <p className="text-gray-400 text-lg md:text-xl font-medium max-w-3xl mb-20 italic mx-auto">
        Rastreie, analise e replique os funis, criativos e VSLs que estão dominando o YouTube, Facebook e TikTok Ads. O fim do "achismo" na sua escala digital.
      </p>

      {/* PRICING SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mx-auto mb-40">
        <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 text-left hover:border-[#D4AF37]/30 transition-all flex flex-col shadow-2xl">
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO MENSAL</h3>
          <div className="flex items-baseline gap-2 mb-8"><span className="text-5xl font-black text-white italic">R$ 197</span><span className="text-gray-500 font-bold text-xs uppercase">/mês</span></div>
          <ul className="space-y-4 mb-10 flex-1">
            {['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 'Transcrições de VSL', 'Radar de Tendências', 'Suporte Prioritário'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37]" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(KIWIFY_MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-black text-lg rounded-2xl uppercase tracking-tighter italic shadow-xl">QUERO ACESSO MENSAL</button>
        </div>
        <div className="bg-white text-black rounded-[40px] p-10 text-left relative flex flex-col scale-105 border-t-[8px] border-[#D4AF37] shadow-[0_0_60px_rgba(212,175,55,0.2)]">
          <div className="absolute top-6 right-8 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Economize R$ 94</div>
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO TRIMESTRAL</h3>
          <div className="flex items-baseline gap-2 mb-8"><span className="text-5xl font-black italic">R$ 497</span><span className="text-gray-400 font-bold text-xs uppercase">/trimestre</span></div>
          <ul className="space-y-4 mb-10 flex-1">
            {['Acesso a Todas as Ofertas', 'Banco de Criativos VIP', 'Histórico de Escala Completo', 'Transcrições Ilimitadas', 'Radar de Tendências Global', 'Comunidade VIP'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37]" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(KIWIFY_TRIMESTRAL, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-black text-lg rounded-2xl uppercase tracking-tighter italic animate-btn-pulse shadow-2xl">ASSINAR TRIMESTRAL</button>
        </div>
      </div>

      {/* GUARANTEE SECTION - FIXED & RECONSTRUCTED */}
      <div className="w-full max-w-5xl mx-auto mb-40 px-4">
        <div className="bg-[#050505] border border-[#D4AF37]/30 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_80px_rgba(212,175,55,0.1)]">
          {/* Lado Esquerdo - Selo Circular */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-[#D4AF37] flex items-center justify-center relative shadow-[0_0_40px_rgba(212,175,55,0.2)]">
              <span className="text-[#D4AF37] text-6xl md:text-8xl font-black italic">7</span>
            </div>
            <div className="bg-[#D4AF37] text-black px-8 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] -mt-5 relative z-10 shadow-xl">
              DIAS
            </div>
          </div>
          
          {/* Lado Direito - Conteúdo */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
              GARANTIA INCONDICIONAL DE <span className="text-[#D4AF37]">7 DIAS</span>
            </h2>
            <p className="text-gray-400 font-medium text-base md:text-xl leading-relaxed italic max-w-2xl">
              Sua satisfação é nossa prioridade absoluta. Teste o <span className="text-white">007 Swiper</span> por 7 dias completos. Se você não sentir que os dados e a inteligência de mercado estão transformando seu negócio, devolvemos 100% do seu investimento sem perguntas. <span className="text-[#D4AF37] font-bold">Risco Zero para sua Operação.</span>
            </p>
            <button 
              onClick={() => window.open(KIWIFY_TRIMESTRAL, '_blank')}
              className="w-full md:w-auto px-12 py-6 bg-[#D4AF37] text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl italic tracking-tighter uppercase"
            >
              [COMEÇAR AGORA – RISCO ZERO]
            </button>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-7xl px-8 border-t border-white/5 pt-12 pb-20 mx-auto">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic text-center">© 2024 007 SWIPER Intelligence Platform. Todos os direitos reservados.</p>
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('Todos');

  useEffect(() => {
    const savedId = localStorage.getItem('agente_token');
    if (savedId) {
      setAgentId(savedId);
      setIsLoggedIn(true);
      const favs = localStorage.getItem(`favs_${savedId}`);
      if (favs) setFavorites(JSON.parse(favs));
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
          if (!v[1]) return null;
          return {
            id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '',
            coverImage: v[5] || '', trend: v[6] || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })), vslDownloadUrl: v[9] || '#',
            transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').filter(Boolean),
            facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').filter(Boolean), creativeZipUrl: v[17] || '#', creativeImages: [], 
          };
        }).filter((o): o is Offer => o !== null);
        setOffers(parsed.reverse());
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
    }
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(`favs_${agentId}`, JSON.stringify(next));
      return next;
    });
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  const filtered = offers.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiche = selectedNiche === 'Todos' || o.niche === selectedNiche;
    return matchesSearch && matchesNiche;
  });

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* SIDEBAR - CLEAN & NO OBSOLETE FEATURES */}
      <aside className="w-72 bg-[#050505] border-right border-white/5 flex flex-col p-8 z-50">
        <div className="flex items-center space-x-3 mb-16">
          <div className="bg-[#D4AF37] p-2 rounded-xl"><Eye className="text-black" size={24} /></div>
          <span className="text-xl font-black text-white italic">007 SWIPER</span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home'} onClick={() => {setCurrentPage('home'); setSelectedOffer(null);}} />
          <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favs'} onClick={() => {setCurrentPage('favs'); setSelectedOffer(null);}} />
          <SidebarItem icon={LifeBuoy} label="Suporte" active={currentPage === 'support'} onClick={() => setCurrentPage('support')} />
        </nav>

        <SidebarItem icon={LogOut} label="Encerrar Sessão" active={false} onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} variant="danger" />
      </aside>

      <main className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">CENTRAL DE INTELIGÊNCIA</h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1 italic">Bem-vindo, Agente {agentId}</p>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="PESQUISAR OFERTA..." 
              className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white font-bold uppercase text-xs outline-none focus:border-[#D4AF37]/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="text-[#D4AF37] animate-spin" size={48} />
            <p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic">Interceptando pacotes de dados...</p>
          </div>
        ) : selectedOffer ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
            <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-white transition-all font-black uppercase text-xs italic">
              <ArrowLeft className="mr-2" size={16} /> Voltar para o Banco de Ofertas
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
                  {selectedOffer.vslLinks[0] ? (
                    <iframe className="w-full h-full" src={getEmbedUrl(selectedOffer.vslLinks[0].url)} frameBorder="0" allowFullScreen></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-black uppercase italic">Sem Visualização</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href={selectedOffer.vslDownloadUrl} target="_blank" className="flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-black rounded-2xl font-black uppercase text-xs italic shadow-xl"><Download size={18} /> Baixar VSL Principal</a>
                  <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white border border-white/5 rounded-2xl font-black uppercase text-xs italic"><FileText size={18} /> Baixar Transcrição</a>
                </div>
              </div>
              <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
                <h3 className="text-[#D4AF37] font-black uppercase text-xs italic border-l-2 border-[#D4AF37] pl-4">DADOS TÉCNICOS</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Título', value: selectedOffer.title },
                    { label: 'Nicho', value: selectedOffer.niche },
                    { label: 'Estrutura', value: selectedOffer.productType },
                    { label: 'Fontes', value: selectedOffer.trafficSource.join(', ') }
                  ].map((d, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{d.label}</p>
                      <p className="text-white font-black uppercase italic text-sm">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-8 space-y-4">
                  <a href={selectedOffer.pageUrl} target="_blank" className="w-full block p-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all font-black uppercase text-[10px] text-center italic">Acessar Página de Vendas</a>
                  <a href={selectedOffer.facebookUrl} target="_blank" className="w-full block p-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all font-black uppercase text-[10px] text-center italic">Biblioteca de Anúncios</a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {currentPage === 'home' && filtered.map((o, i) => (
              <OfferCard key={o.id} offer={o} index={i} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => setSelectedOffer(o)} />
            ))}
            {currentPage === 'favs' && filtered.filter(o => favorites.includes(o.id)).map((o, i) => (
              <OfferCard key={o.id} offer={o} index={i} isFavorite={true} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => setSelectedOffer(o)} />
            ))}
            {currentPage === 'support' && (
              <div className="col-span-full bg-[#121212] p-16 rounded-[40px] text-center border border-white/5 shadow-2xl">
                <LifeBuoy className="text-[#D4AF37] mx-auto mb-8" size={64} />
                <h2 className="text-4xl font-black text-white italic uppercase mb-4">CENTRAL DE SUPORTE</h2>
                <p className="text-gray-400 font-bold mb-12 uppercase text-xs tracking-widest">Problemas com sua infiltração? Contate um de nossos agentes black.</p>
                <a href="mailto:suporte@007swiper.com" className="px-12 py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase italic shadow-xl">ABRIR CHAMADO PRIORITÁRIO</a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
