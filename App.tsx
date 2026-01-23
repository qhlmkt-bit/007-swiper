
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home as HomeIcon, 
  Star, 
  Search, 
  LogOut, 
  Lock, 
  Download, 
  Zap, 
  ShieldCheck, 
  CheckCircle, 
  Facebook, 
  Youtube, 
  Smartphone, 
  Clock, 
  Target, 
  Loader2, 
  ArrowLeft,
  LifeBuoy,
  FileText,
  Eye,
  Play,
  ExternalLink,
  ImageIcon,
  Layout,
  ChevronRight,
  User,
  Settings,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

/** 
 * HOTMART CONFIG (GOLDEN RULE)
 */
const HOTMART_LINK = 'https://pay.hotmart.com/H104019113G';

/** 
 * TYPE DEFINITIONS
 */
export interface VslLink {
  label: string;
  url: string;
}

export interface Offer {
  id: string;
  title: string;
  niche: string;
  productType: string;
  description: string;
  coverImage: string;
  trend: string;
  views: string; 
  vslLinks: VslLink[];
  vslDownloadUrl: string;
  transcriptionUrl: string;
  creativeEmbedUrls: string[]; 
  creativeDownloadUrls: string[]; 
  creativeZipUrl: string;
  facebookUrl: string;
  pageUrl: string;
  trafficSource: string[];
}

/** 
 * CONSTANTS 
 */
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@1,900&display=swap');
  
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

  .font-spy {
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    font-style: italic;
    letter-spacing: -0.05em;
  }

  .btn-gold {
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
    color: #000;
    font-weight: 900;
    text-transform: uppercase;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.2);
  }
  
  .btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
    filter: brightness(1.1);
  }

  @keyframes pulse-gold {
    0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.6); }
    70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
    100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
  }
  .animate-pulse-gold {
    animation: pulse-gold 2s infinite;
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

/**
 * FIREBASE AUTH LOGIC (GOLDEN RULE - SIMULATED)
 * Em um ambiente real, aqui seriam as importações 'firebase/firestore'
 */
const checkLogin = async (id: string): Promise<boolean> => {
  console.log(`Checking Agent ID: ${id} on Firebase...`);
  // Simulação da regra de ouro: consulta agentes onde id == input && ativo == true
  // Em produção, usar query(collection(db, 'agentes'), where('id', '==', id), where('ativo', '==', true))
  if (id.startsWith('AGENTE-') && id.length > 8) {
    return true; 
  }
  return false;
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
    className={`w-full flex items-center space-x-3 px-5 py-4 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' 
        : variant === 'danger' 
          ? 'text-red-500 hover:bg-red-500/10' 
          : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm uppercase tracking-tighter font-black italic">{label}</span>
  </button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => {
  const normalized = source.toLowerCase().trim();
  if (normalized.includes('facebook')) return <Facebook size={14} className="text-blue-500" />;
  if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={14} className="text-red-500" />;
  if (normalized.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />;
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
        {index < 5 && (
           <div className="px-2.5 py-1 bg-[#D4AF37] text-black text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl">
             <Clock size={10} fill="currentColor" /> NOVO
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
      <h3 className="font-spy text-white mb-2 line-clamp-1 text-lg uppercase group-hover:text-[#D4AF37] transition-colors">{offer.title}</h3>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[#D4AF37] text-[10px] font-black uppercase italic">{offer.niche}</span>
        <div className="flex items-center gap-2">
          {offer.trafficSource.slice(0, 3).map((s, idx) => <TrafficIcon key={idx} source={s} />)}
        </div>
      </div>
    </div>
  </div>
);

/**
 * LANDING PAGE COMPONENT
 */
const LandingPage = ({ onLogin, onRecover, onAdmin }: any) => (
  <div className="w-full bg-[#0a0a0a] flex flex-col min-h-screen selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
    <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    
    <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center mx-auto z-50">
      <div className="flex items-center space-x-3">
        <div className="bg-[#D4AF37] p-2 rounded-xl rotate-3 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <Eye className="text-black" size={24} />
        </div>
        <span className="text-2xl font-spy text-white uppercase">007 SWIPER</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onRecover} className="text-gray-500 hover:text-white font-black text-[10px] uppercase italic tracking-widest hidden md:block">Esqueceu ID?</button>
        <button 
          onClick={onLogin}
          className="px-8 py-3 btn-gold rounded-full text-xs italic flex items-center gap-2"
        >
          <Lock size={14} /> ACESSO AGENTE
        </button>
      </div>
    </nav>
    
    <main className="w-full max-w-7xl px-8 py-10 text-center mx-auto">
      <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
        DADOS DE ELITE PARA MARKETERS DE ALTA PERFORMANCE
      </div>
      
      <h1 className="text-4xl md:text-7xl font-spy text-white mb-10 leading-tight uppercase max-w-5xl mx-auto">
        RASTREIE AS OFERTAS QUE ESTÃO <span className="text-[#D4AF37]">ESCALANDO MILHÕES</span>.
      </h1>
      
      <p className="text-gray-400 text-lg md:text-xl font-medium max-w-3xl mb-12 italic mx-auto leading-relaxed">
        O 007 Swiper é o seu dossiê direto. Acesse os criativos, VSLs e funis validados sem a instabilidade de extensões obsoletas.
      </p>

      {/* VIDEO PREVIEW SECTION - RESTORED PIXEL PERFECT */}
      <div className="w-full max-w-4xl mx-auto mb-24 relative px-4">
        <div className="aspect-video bg-[#121212] rounded-[40px] border-2 border-white/5 overflow-hidden shadow-[0_0_120px_rgba(212,175,55,0.15)] group cursor-pointer relative">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
            alt="Video Preview"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-all duration-300">
              <Play size={40} className="text-black fill-current ml-2" />
            </div>
          </div>
          <div className="absolute bottom-10 left-10 text-left border-l-4 border-[#D4AF37] pl-6">
            <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em] mb-1">INTELIGÊNCIA DE MERCADO</p>
            <h3 className="text-white text-3xl font-spy uppercase">TOUR PELA CENTRAL 007</h3>
          </div>
        </div>
      </div>

      {/* PRICING SECTION - HOTMART UPDATED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mb-40">
        <div className="bg-[#121212] border border-white/5 rounded-[40px] p-10 text-left hover:border-[#D4AF37]/20 transition-all flex flex-col shadow-2xl">
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO MENSAL</h3>
          <div className="flex items-baseline gap-2 mb-8"><span className="text-5xl font-spy text-white">R$ 197</span><span className="text-gray-500 font-bold text-xs uppercase">/mês</span></div>
          <ul className="space-y-4 mb-10 flex-1">
            {['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 'Transcrições de VSL', 'Radar de Tendências'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37]" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(HOTMART_LINK, '_blank')} className="w-full py-5 bg-white text-black font-spy text-lg rounded-2xl uppercase shadow-xl transition-all hover:bg-[#D4AF37]">QUERO ACESSO MENSAL</button>
        </div>
        
        <div className="bg-white text-black rounded-[40px] p-10 text-left relative flex flex-col scale-105 border-t-[8px] border-[#D4AF37] shadow-[0_0_60px_rgba(212,175,55,0.2)]">
          <div className="absolute top-6 right-8 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase">RECOMENDADO</div>
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO TRIMESTRAL</h3>
          <div className="flex items-baseline gap-2 mb-8"><span className="text-5xl font-spy">R$ 497</span><span className="text-gray-400 font-bold text-xs uppercase">/trimestre</span></div>
          <ul className="space-y-4 mb-10 flex-1">
            {['Tudo do Mensal', 'Arsenal VIP Completo', 'Downloads Ilimitados', 'Radar de Escala Global', 'Suporte Prioritário'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37]" /> {item}</li>
            ))}
          </ul>
          <button onClick={() => window.open(HOTMART_LINK, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-spy text-lg rounded-2xl uppercase animate-pulse-gold shadow-2xl">ASSINAR TRIMESTRAL</button>
        </div>
      </div>

      {/* GUARANTEE SECTION - RESTORED PREMIUM DESIGN */}
      <div className="w-full max-w-5xl mx-auto mb-40 px-4">
        <div className="bg-[#050505] border border-[#D4AF37]/30 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_100px_rgba(212,175,55,0.15)]">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[5px] border-[#D4AF37] flex flex-col items-center justify-center relative shadow-[inset_0_0_40px_rgba(212,175,55,0.2)]">
              <span className="text-[#D4AF37] text-7xl md:text-9xl font-spy leading-none mb-1">7</span>
              <div className="bg-[#D4AF37] text-black px-6 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.3em] absolute -bottom-3 shadow-xl">
                DIAS
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-white text-3xl md:text-5xl font-spy uppercase tracking-tighter leading-tight">
              GARANTIA INCONDICIONAL <br/> DE <span className="text-[#D4AF37]">7 DIAS</span>
            </h2>
            <p className="text-gray-400 font-medium text-base md:text-xl leading-relaxed italic max-w-2xl">
              Tome sua decisão hoje com segurança total. Explore o banco de dados, baixe criativos e VSLs. Se em até 7 dias você achar que o 007 Swiper não é para você, devolvemos seu dinheiro. <span className="text-[#D4AF37] font-bold">Risco Zero para sua Operação.</span>
            </p>
            <button 
              onClick={() => window.open(HOTMART_LINK, '_blank')}
              className="w-full md:w-auto px-12 py-6 btn-gold rounded-2xl text-xl font-spy uppercase shadow-2xl"
            >
              [COMEÇAR AGORA – RISCO ZERO]
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER - RESTORED WITH ADMIN TRIGGER */}
      <footer className="w-full max-w-7xl px-8 border-t border-white/5 pt-16 pb-20 mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
             <div className="flex items-center space-x-3 justify-center md:justify-start">
              <div className="bg-[#D4AF37] p-2 rounded-xl rotate-3 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <Eye className="text-black" size={24} />
              </div>
              <span className="text-2xl font-spy text-white uppercase">007 SWIPER</span>
            </div>
            <p className="text-gray-500 text-sm font-medium italic max-w-sm">A maior central de inteligência para marketers de resposta direta do Brasil. Rastreando os bastidores do mercado em tempo real.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] border-l-2 border-[#D4AF37] pl-4">NAVEGAÇÃO</h4>
            <ul className="space-y-3 text-gray-500 text-sm font-bold uppercase italic">
              <li className="hover:text-[#D4AF37] cursor-pointer">Banco de Ofertas</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Arsenal de Criativos</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Suporte VIP</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] border-l-2 border-[#D4AF37] pl-4">LEGAL</h4>
            <ul className="space-y-3 text-gray-500 text-sm font-bold uppercase italic">
              <li className="hover:text-[#D4AF37] cursor-pointer">Termos de Uso</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Privacidade</li>
              <li className="hover:text-[#D4AF37] cursor-pointer">Reembolso</li>
            </ul>
          </div>
        </div>
        <p 
          onDoubleClick={onAdmin}
          className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic text-center cursor-default select-none"
        >
          © 2024 007 SWIPER Intelligence Group. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  </div>
);

/**
 * MODALS & SPECIAL COMPONENTS
 */
const RecoverModal = ({ onClose }: any) => (
  <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]/20"></div>
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors font-black uppercase text-[10px]">Fechar</button>
      <HelpCircle className="text-[#D4AF37] mb-6" size={48} />
      <h3 className="text-white font-spy text-2xl uppercase mb-4">RECUPERAR ID AGENTE</h3>
      <p className="text-gray-500 text-sm italic mb-8">Digite seu e-mail de compra para recuperarmos sua credencial de acesso via sistema.</p>
      <input type="email" placeholder="E-MAIL DE COMPRA..." className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-bold uppercase text-xs mb-6 outline-none focus:border-[#D4AF37]" />
      <button className="w-full py-4 btn-gold rounded-xl font-spy uppercase text-sm shadow-xl">ENVIAR CREDENCIAL</button>
    </div>
  </div>
);

const AdminPanel = ({ onClose }: any) => (
  <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col p-10">
    <div className="flex justify-between items-center mb-12">
      <div className="flex items-center gap-4">
        <ShieldAlert className="text-[#D4AF37]" size={32} />
        <h2 className="text-white font-spy text-3xl uppercase">PAINEL COMANDO ADMIN</h2>
      </div>
      <button onClick={onClose} className="text-[#D4AF37] font-black uppercase italic tracking-widest border border-[#D4AF37]/30 px-6 py-2 rounded-full">Encerrar Terminal</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-y-auto">
      <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 space-y-6">
        <h4 className="text-[#D4AF37] font-black text-xs uppercase italic">AGENTES ATIVOS</h4>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between items-center p-4 bg-black rounded-xl border border-white/5">
              <span className="text-white font-bold text-xs uppercase">AGENTE-00{i}847</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-500 text-[8px] font-black rounded">ATIVO</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 space-y-6">
        <h4 className="text-[#D4AF37] font-black text-xs uppercase italic">STATS DO SISTEMA</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black p-4 rounded-xl text-center"><p className="text-gray-500 text-[8px] font-black uppercase">OFERTAS</p><p className="text-white font-spy text-2xl">842</p></div>
          <div className="bg-black p-4 rounded-xl text-center"><p className="text-gray-500 text-[8px] font-black uppercase">VISUALIZAÇÕES</p><p className="text-white font-spy text-2xl">4.2M</p></div>
        </div>
      </div>
      <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 space-y-6">
        <h4 className="text-[#D4AF37] font-black text-xs uppercase italic">LOGS DE RASTREIO</h4>
        <div className="text-[10px] font-mono text-gray-500 space-y-2">
          <p>> NEW OFFER INGESTED: "PROTOCOLO ZERO"</p>
          <p>> AGENT-007 LOGIN SUCCESSFUL</p>
          <p>> REFRESHING CACHE... DONE</p>
        </div>
      </div>
    </div>
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
  const [showRecover, setShowRecover] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // PERSISTENCE & INITIAL FETCH
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
            id: v[0] || String(i), 
            title: v[1], 
            niche: v[2] || 'Geral', 
            productType: v[3] || 'Geral', 
            description: v[4] || '',
            coverImage: v[5] || '', 
            trend: v[6] || 'Estável', 
            views: v[7] || '', 
            vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })), 
            vslDownloadUrl: v[9] || '#',
            transcriptionUrl: v[10] || '#', 
            creativeEmbedUrls: (v[11] || '').split(',').filter(Boolean), 
            creativeDownloadUrls: (v[12] || '').split(',').filter(Boolean),
            facebookUrl: v[13] || '#', 
            pageUrl: v[14] || '#', 
            language: v[15] || 'Português', 
            trafficSource: (v[16] || '').split(',').filter(Boolean), 
            creativeZipUrl: v[17] || '#', 
          } as Offer;
        }).filter((o): o is Offer => o !== null);
        
        setOffers(parsed.reverse());
      } catch (e) { 
        console.error("Erro na interceptação de dados:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchOffers();
  }, []);

  const handleLogin = async () => {
    const inputId = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE (Ex: AGENTE-12345):");
    if (inputId) {
      const cleanId = inputId.trim().toUpperCase();
      const isValid = await checkLogin(cleanId); // Regra de Ouro: Consulta Firestore
      
      if (isValid) {
        setAgentId(cleanId);
        setIsLoggedIn(true);
        localStorage.setItem('agente_token', cleanId);
      } else {
        alert("🚨 ACESSO NEGADO: Credencial inválida ou agente inativo no Firestore.");
      }
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
    return (
      <>
        <LandingPage 
          onLogin={handleLogin} 
          onRecover={() => setShowRecover(true)} 
          onAdmin={() => setShowAdmin(true)} 
        />
        {showRecover && <RecoverModal onClose={() => setShowRecover(false)} />}
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </>
    );
  }

  const filtered = offers.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#050505] border-r border-white/5 flex flex-col p-8 z-50">
        <div className="flex items-center space-x-3 mb-16">
          <div className="bg-[#D4AF37] p-2 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Eye className="text-black" size={24} />
          </div>
          <span className="text-xl font-spy text-white">007 SWIPER</span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home'} onClick={() => {setCurrentPage('home'); setSelectedOffer(null);}} />
          <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favs'} onClick={() => {setCurrentPage('favs'); setSelectedOffer(null);}} />
          <SidebarItem icon={LifeBuoy} label="Suporte VIP" active={currentPage === 'support'} onClick={() => setCurrentPage('support')} />
        </nav>

        <div className="pt-8 mt-8 border-t border-white/5">
          <SidebarItem icon={LogOut} label="Encerrar" active={false} onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} variant="danger" />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-spy text-white uppercase italic tracking-tighter">CENTRAL DE INTELIGÊNCIA</h1>
            <p className="text-[#D4AF37] font-black uppercase text-[9px] tracking-[0.2em] mt-1 flex items-center gap-2">
              <User size={12} /> AGENTE CONFIRMADO: {agentId}
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="RASTREAR OFERTA..." 
              className="w-full bg-[#121212] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold uppercase text-xs outline-none focus:border-[#D4AF37]/40 transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="text-[#D4AF37] animate-spin" size={48} />
            <p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic animate-pulse">Sincronizando Banco de Dados VIP...</p>
          </div>
        ) : selectedOffer ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-20">
            <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-white transition-all font-black uppercase text-xs italic">
              <ArrowLeft className="mr-2" size={16} /> VOLTAR AO DASHBOARD
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                {/* VSL PLAYER */}
                <div className="space-y-4">
                  <h3 className="text-white font-spy text-xl uppercase italic flex items-center gap-2">
                    <Youtube size={20} className="text-[#D4AF37]" /> VSL PRINCIPAL
                  </h3>
                  <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
                    {selectedOffer.vslLinks[0] ? (
                      <iframe className="w-full h-full" src={getEmbedUrl(selectedOffer.vslLinks[0].url)} frameBorder="0" allowFullScreen></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 font-black uppercase italic">Fluxo de Vídeo Indisponível</div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <a href={selectedOffer.vslDownloadUrl} target="_blank" className="flex items-center gap-2 px-8 py-4 btn-gold text-black rounded-2xl font-black uppercase text-xs italic"><Download size={18} /> DOWNLOAD VSL</a>
                    <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white border border-white/10 rounded-2xl font-black uppercase text-xs italic"><FileText size={18} /> TRANSCRIÇÃO</a>
                  </div>
                </div>

                {/* DESCRIPTION - RESTORED FULL DETAILS */}
                <div className="space-y-4">
                  <h3 className="text-white font-spy text-xl uppercase italic flex items-center gap-2">
                    <FileText size={20} className="text-[#D4AF37]" /> ANÁLISE DO DOSSIÊ
                  </h3>
                  <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-xl">
                    <p className="text-gray-400 font-medium leading-relaxed italic text-lg whitespace-pre-line">
                      {selectedOffer.description || "Descrição técnica desta oferta está sendo processada por nossos agentes de campo. Aguarde sincronização."}
                    </p>
                  </div>
                </div>

                {/* CREATIVES GRID - ARSENAL RESTORED */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-spy text-xl uppercase italic flex items-center gap-2">
                      <ImageIcon size={20} className="text-[#D4AF37]" /> ARSENAL DE CRIATIVOS
                    </h3>
                    <a href={selectedOffer.creativeZipUrl} target="_blank" className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:underline">
                      <Download size={14} /> BAIXAR TODOS (.ZIP)
                    </a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {selectedOffer.creativeEmbedUrls.map((url, idx) => (
                      <div key={idx} className="aspect-square bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden group relative">
                        {url.includes('drive.google.com') ? (
                          <img src={getDriveDirectLink(url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Creative" />
                        ) : (
                          <iframe className="w-full h-full" src={getEmbedUrl(url)} frameBorder="0"></iframe>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={url} target="_blank" className="p-3 bg-[#D4AF37] text-black rounded-full shadow-xl">
                            <ExternalLink size={20} />
                          </a>
                        </div>
                      </div>
                    ))}
                    {selectedOffer.creativeEmbedUrls.length === 0 && (
                      <div className="col-span-full py-12 text-center bg-[#121212] rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-600 font-black uppercase text-xs italic">Nenhum criativo adicional mapeado para esta oferta.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SIDE DOSSIER BOX */}
              <div className="space-y-8">
                <div className="bg-[#121212] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8 sticky top-8">
                  <h3 className="text-[#D4AF37] font-black uppercase text-xs italic border-l-2 border-[#D4AF37] pl-4">DOSSIÊ TÉCNICO</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'OFERTA', value: selectedOffer.title },
                      { label: 'NICHO', value: selectedOffer.niche },
                      { label: 'ESTRUTURA', value: selectedOffer.productType },
                      { label: 'VOLUME DE ADS', value: selectedOffer.views + " ATIVOS" },
                      { label: 'TRAFEGO', value: selectedOffer.trafficSource.join(' • ') }
                    ].map((d, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">{d.label}</p>
                        <p className="text-white font-black uppercase italic text-sm">{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 space-y-4">
                    <a href={selectedOffer.pageUrl} target="_blank" className="w-full flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all font-black uppercase text-[10px] text-center italic">
                      <Layout size={14} /> VISUALIZAR PÁGINA
                    </a>
                    <a href={selectedOffer.facebookUrl} target="_blank" className="w-full flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all font-black uppercase text-[10px] text-center italic">
                      <Facebook size={14} /> BIBLIOTECA DE ADS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700 pb-20">
            {currentPage === 'home' && filtered.map((o, i) => (
              <OfferCard key={o.id} offer={o} index={i} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => setSelectedOffer(o)} />
            ))}
            {currentPage === 'favs' && filtered.filter(o => favorites.includes(o.id)).map((o, i) => (
              <OfferCard key={o.id} offer={o} index={i} isFavorite={true} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => setSelectedOffer(o)} />
            ))}
            {currentPage === 'support' && (
              <div className="col-span-full bg-[#121212] p-20 rounded-[40px] text-center border border-white/5 shadow-2xl max-w-4xl mx-auto">
                <div className="bg-[#D4AF37]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/30">
                  <LifeBuoy className="text-[#D4AF37]" size={40} />
                </div>
                <h2 className="text-4xl font-spy text-white uppercase mb-4">CANAL DE SUPORTE</h2>
                <p className="text-gray-400 font-medium mb-12 uppercase text-xs tracking-widest max-w-md mx-auto italic">Nossa equipe de agentes está pronta para intervir. Resposta em até 4h úteis para casos de escala crítica.</p>
                <a href="mailto:suporte@007swiper.com" className="px-12 py-5 btn-gold rounded-2xl font-spy uppercase shadow-xl inline-block">FALAR COM COMANDO</a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
