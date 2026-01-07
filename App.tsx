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
  Files
} from 'lucide-react';

/** 
 * TYPE DEFINITIONS
 */
export type ProductType = 'Infoproduto' | 'Low Ticket' | 'Nutracêutico' | 'Dropshipping' | 'E-book' | string;
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
  views: number;
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
const PRODUCT_TYPES: ProductType[] = ['Infoproduto', 'Low Ticket', 'Nutracêutico', 'Dropshipping', 'E-book'];

/**
 * UTILS - VIDEO NORMALIZATION
 */
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Vimeo
  if (trimmed.includes('vimeo.com')) {
    const vimeoIdMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|video\/)([0-9]+)/);
    if (vimeoIdMatch) return `https://player.vimeo.com/video/${vimeoIdMatch[1]}?badge=0&autopause=0&player_id=0&app_id=58479`;
  }
  
  // YouTube
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const ytIdMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (ytIdMatch) return `https://www.youtube.com/embed/${ytIdMatch[1]}`;
  }

  // Already an embed link or other format
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
        ? 'bg-brand-gold text-black font-black shadow-lg shadow-brand-gold/20' 
        : variant === 'danger' 
          ? 'text-red-500 hover:bg-red-500/10' 
          : 'text-gray-400 hover:bg-brand-hover hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm uppercase tracking-tighter font-black">{label}</span>
  </button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => {
  const normalized = source.toLowerCase();
  if (normalized.includes('facebook')) return <Facebook size={14} className="text-blue-500" />;
  if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={14} className="text-red-500" />;
  if (normalized.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />;
  if (normalized.includes('instagram')) return <Smartphone size={14} className="text-purple-500" />;
  return <Target size={14} className="text-brand-gold" />;
};

const VideoPlayer: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
  const embed = getEmbedUrl(url);
  if (!embed) return (
    <div className="w-full h-full flex items-center justify-center text-gray-700 font-black uppercase italic text-xs">
      Link de vídeo inválido
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
    className="bg-brand-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-brand-gold/50 transition-all duration-500 shadow-xl"
  >
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={offer.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} 
        alt={offer.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {offer.trend === 'Escalando' && (
          <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl">
            <Zap size={10} fill="currentColor" /> Escalando
          </div>
        )}
        {offer.trend === 'Em Alta' && (
          <div className="px-2.5 py-1 bg-brand-gold text-black text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl">
            <TrendingUp size={12} className="w-3 h-3" /> Em Alta
          </div>
        )}
      </div>
      <div className="absolute top-3 right-3">
        <button 
          onClick={onToggleFavorite}
          className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${
            isFavorite ? 'bg-brand-gold text-black scale-110' : 'bg-brand-gold/20 text-white hover:bg-brand-gold hover:text-black'
          }`}
        >
          <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="absolute bottom-3 left-3">
        <div className="px-2 py-0.5 bg-brand-gold text-black text-[9px] font-black rounded uppercase shadow-lg">
          {offer.niche}
        </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-brand-gold transition-colors italic">{offer.title}</h3>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {offer.trafficSource.slice(0, 2).map((source, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <TrafficIcon source={source} />
            </div>
          ))}
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{offer.productType}</span>
        </div>
        <div className="flex items-center text-gray-500 text-xs font-black italic">
          <Eye size={14} className="mr-1 text-brand-gold" />
          {offer.views > 1000 ? `${(offer.views / 1000).toFixed(1)}K` : offer.views}
        </div>
      </div>
    </div>
  </div>
);

/**
 * LANDING PAGE COMPONENT
 */
const LandingPage = ({ onLogin, isSuccess, onCloseSuccess }: any) => (
  <div className="min-h-screen bg-brand-dark flex flex-col items-center">
    {isSuccess && (
      <div className="w-full bg-[#050505] border-b-2 border-brand-gold py-6 px-4 md:px-12 text-center animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col md:flex-row items-center justify-between gap-6 sticky top-0 z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-4">
          <div className="bg-brand-gold p-3 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hidden sm:flex">
            <ShieldCheck size={28} className="text-black" />
          </div>
          <div className="text-left">
            <h2 className="text-brand-gold font-black uppercase text-lg md:text-2xl tracking-tighter">ACESSO À INTELIGÊNCIA LIBERADO! 🕵️‍♂️</h2>
            <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-tight leading-relaxed max-w-2xl">
              Sua chave de acesso ao Quartel General é única e confidencial. SALVE ESTA SENHA AGORA: 
              <span className="text-brand-gold font-black ml-2 text-base md:text-xl">AGENTE007</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onLogin}
            className="flex-1 md:flex-none px-6 py-3 bg-brand-gold text-black font-black rounded-xl uppercase text-[10px] md:text-sm tracking-tighter hover:scale-105 transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 border-2 border-black/10"
          >
            <Lock size={16} /> ENTRAR NO ARSENAL
          </button>
          <button onClick={onCloseSuccess} className="p-2 text-gray-600 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>
    )}
    
    <nav className="w-full max-w-7xl px-4 md:px-8 py-8 flex justify-between items-center relative z-50">
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="bg-brand-gold p-2 md:p-2.5 rounded-2xl rotate-3 shadow-xl shadow-brand-gold/20">
          <Eye className="text-black" size={24} />
        </div>
        <span className="text-xl md:text-3xl font-black tracking-tighter text-white uppercase italic">007 Swiper</span>
      </div>
      <button 
        onClick={onLogin}
        className="px-6 md:px-8 py-2.5 md:py-3 bg-brand-gold hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl shadow-brand-gold/30 flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-tighter transform hover:scale-105"
      >
        <Lock size={14} /> Entrar
      </button>
    </nav>
    
    <main className="flex-1 w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center mt-4 md:mt-8 mb-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent -z-10 pointer-events-none opacity-40"></div>
      
      <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 mb-6 md:mb-8 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
        Inteligência de Mercado em Tempo Real
      </div>
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-10 leading-[1.1] md:leading-[1.0] tracking-tighter uppercase italic max-w-6xl">
        ESPIONE AS OFERTAS QUE <span className="text-brand-gold">DOMINAM O JOGO.</span>
      </h1>
      
      <p className="text-gray-400 text-base md:text-xl font-medium max-w-4xl mb-12 md:mb-16 italic px-2 leading-relaxed">
        Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões em YouTube Ads, Facebook Ads e TikTok Ads. Para produtores, afiliados e e-commerces que não querem mais atirar no escuro: 007 Swiper é a plataforma de inteligência competitiva que transforma dados em resultados escaláveis.
      </p>

      {/* VIDEO DEMO PLACEHOLDER */}
      <div className="w-full max-w-4xl aspect-video bg-brand-card rounded-[32px] border border-white/10 mb-20 md:mb-32 flex flex-col items-center justify-center gap-6 group cursor-pointer hover:border-brand-gold/50 transition-all shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-20 h-20 bg-brand-gold text-black rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
          <Play fill="currentColor" size={32} />
        </div>
        <p className="text-white font-black uppercase text-xs md:text-sm tracking-widest italic group-hover:text-brand-gold transition-colors">
          Descubra como rastreamos e organizamos ofertas escaladas em tempo real
        </p>
      </div>

      {/* SEÇÃO DE BENEFÍCIOS RÁPIDOS - "DECODIFIQUE" */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 w-full max-w-5xl mb-24 md:mb-32 px-2">
        <div className="md:col-span-6 bg-brand-card p-8 md:p-10 rounded-[30px] border border-white/5 text-left group">
          <div className="w-12 h-12 bg-brand-hover rounded-2xl flex items-center justify-center mb-6 text-brand-gold shadow-lg group-hover:bg-brand-gold group-hover:text-black transition-all">
            <Zap size={24} />
          </div>
          <h3 className="text-white font-black uppercase text-xl md:text-2xl mb-4 tracking-tight italic">Decodifique o que Realmente Converte</h3>
          <p className="text-gray-500 font-medium text-base leading-relaxed">
            Chega de testar às cegas. No 007 Swiper, você acessa ofertas validadas pelo mercado, organizadas por nicho, formato e estratégia. Entenda o que faz um funil bater ROI antes mesmo de subir sua primeira campanha.
          </p>
        </div>

        <div className="md:col-span-6 bg-brand-card p-8 md:p-10 rounded-[30px] border border-white/5 text-left group">
          <div className="w-12 h-12 bg-brand-hover rounded-2xl flex items-center justify-center mb-6 text-brand-gold shadow-lg group-hover:bg-brand-gold group-hover:text-black transition-all">
            <Files size={24} />
          </div>
          <h3 className="text-white font-black uppercase text-xl md:text-2xl mb-4 tracking-tight italic">Banco de Criativos Escalados</h3>
          <p className="text-gray-500 font-medium text-base leading-relaxed">
            O mercado não perdoa amadorismo criativo. Por isso, entregamos um arsenal de anúncios já provados que estão em escala ativa agora. Baixe, analise a estrutura e modele para o seu produto em minutos.
          </p>
        </div>

        <div className="md:col-span-12 lg:col-span-4 lg:col-start-5 bg-brand-card p-8 rounded-[30px] border border-white/5 text-center group">
          <div className="w-12 h-12 bg-brand-hover rounded-2xl flex items-center justify-center mb-6 text-brand-gold shadow-lg mx-auto group-hover:bg-brand-gold group-hover:text-black transition-all">
            <Globe size={24} />
          </div>
          <h3 className="text-white font-black uppercase text-lg mb-3 tracking-tight italic">Inteligência Global, Resultados Locais</h3>
          <p className="text-gray-500 font-medium text-sm leading-relaxed">
            Escale sem fronteiras. Todas as ofertas, VSLs e criativos disponíveis em múltiplos idiomas para que você possa importar as melhores tendências do exterior diretamente para o Brasil.
          </p>
        </div>
      </div>
      
      {/* PRICING PLANS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl mb-24 md:mb-32 px-4">
        {/* MONTHLY */}
        <div className="bg-brand-card border border-white/5 rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group hover:border-brand-gold/30 transition-all flex flex-col">
          <h3 className="text-brand-gold font-black uppercase text-lg md:text-xl italic mb-1 tracking-tight">PLANO MENSAL</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl md:text-5xl font-black text-white italic">R$ 197</span>
            <span className="text-gray-500 font-black text-sm uppercase">/mês</span>
          </div>
          <ul className="space-y-4 mb-12 flex-1">
            {[
              'Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 
              'Templates de Funil', 'Transcrições de VSL', 'Radar de Tendências', 
              '007 Academy', 'Hub de Afiliação', 'Cloaker VIP', 'Suporte Prioritário'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic">
                <CheckCircle size={16} className="text-brand-gold shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => window.open('https://pay.kiwify.com.br/SRiorgy', '_blank')}
            className="w-full py-5 bg-white text-black font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter"
          >
            QUERO ACESSO MENSAL
          </button>
        </div>

        {/* QUARTERLY */}
        <div className="bg-white text-black rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group shadow-[0_0_50px_rgba(212,175,55,0.2)] flex flex-col scale-105 border-t-[8px] border-brand-gold">
          <div className="absolute top-6 right-8 bg-brand-gold text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            Economize R$ 94
          </div>
          <h3 className="text-brand-gold font-black uppercase text-lg md:text-xl italic mb-1 tracking-tight">PLANO TRIMESTRAL</h3>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl md:text-5xl font-black italic">R$ 497</span>
            <span className="text-gray-400 font-black text-sm uppercase">/trimestre</span>
          </div>
          <ul className="space-y-4 mb-12 flex-1">
            {[
              'Acesso a Todas as Ofertas', 'Banco de Criativos Híbrido', 'Comunidade VIP Exclusiva', 
              'Checklist de Modelagem 007', '12% OFF na IDL Edições', 'Transcrições Ilimitadas', 
              'Radar de Tendências Global', 'Hub de Afiliação Premium', 'Academy Completo', 'Suporte Agente Black'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic">
                <CheckCircle size={16} className="text-brand-gold shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => window.open('https://pay.kiwify.com.br/SRiorgy', '_blank')}
            className="w-full py-5 bg-brand-dark text-brand-gold font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-tighter"
          >
            ASSINAR PLANO TRIMESTRAL
          </button>
        </div>
      </div>

      {/* GUARANTEE & FOOTER */}
      <div className="w-full max-w-4xl bg-brand-card p-10 md:p-16 rounded-[40px] border border-brand-gold/20 mb-32 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 flex items-center justify-center border-4 border-brand-gold rounded-full relative">
          <span className="text-brand-gold font-black text-5xl italic">7</span>
          <span className="absolute -bottom-2 bg-brand-gold text-black px-4 py-1 text-[10px] font-black uppercase rounded">Dias</span>
        </div>
        <div className="text-left flex-1">
          <h2 className="text-white font-black text-2xl md:text-4xl uppercase italic mb-4 tracking-tighter">Garantia Incondicional de 7 Dias</h2>
          <p className="text-gray-500 font-medium text-base mb-8 leading-relaxed italic">
            Estamos tão seguros da qualidade do nosso arsenal que oferecemos risco zero. Se em até 7 dias você sentir que a plataforma não é para você, devolvemos 100% do seu dinheiro. Sem perguntas.
          </p>
          <button 
            onClick={() => window.open('https://pay.kiwify.com.br/SRiorgy', '_blank')}
            className="px-10 py-5 bg-brand-gold text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-tighter"
          >
            [COMEÇAR AGORA – RISCO ZERO]
          </button>
        </div>
      </div>

      <footer className="text-gray-600 text-xs font-bold uppercase tracking-widest italic border-t border-white/5 pt-12 w-full">
        © 2024 007 Swiper Intelligence Platform. Todos os direitos reservados.
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

        // Parsing line 2 as headers
        const headers = lines[1].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^"|"$/g, ''));
        
        const parsedData: Offer[] = lines.slice(2).map((line, idx) => {
          const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
          const row: any = {};
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });

          // Re-mapping based on provided instructions:
          // Col I (8): vslEmbedUrl
          // Col L (11): creativeEmbedUrls
          // Col N (13): facebookUrl
          // Col O (14): pageUrl
          // Col P (15): language
          // Col Q (16): trafficSource
          // Col R (17): creativeZipUrl
          
          return {
            id: values[0] || row.id || idx.toString(),
            title: values[1] || row.title || 'Sem Título',
            niche: values[2] || row.niche || 'Geral',
            productType: values[3] || row.productType || 'Infoproduto',
            description: values[4] || row.description || '',
            coverImage: values[5] || row.coverImage || '',
            trend: values[6] || row.trend || 'Estável',
            views: parseInt(values[7]) || parseInt(row.views) || 0,
            vslLinks: [{ label: 'VSL Principal', url: values[8] || row.vslEmbedUrl || '' }],
            vslDownloadUrl: values[9] || row.vslDownloadUrl || '#',
            transcriptionUrl: values[10] || row.transcriptionUrl || '#',
            creativeImages: (values[11] || row.creativeImages || '').split(',').map((s: string) => s.trim()).filter(Boolean),
            creativeEmbedUrls: (values[12] || row.creativeEmbedUrls || '').split(',').map((s: string) => s.trim()).filter(Boolean),
            creativeDownloadUrls: (values[13] || row.creativeDownloadUrls || '').split(',').map((s: string) => s.trim()).filter(Boolean),
            facebookUrl: values[13] || row.facebookUrl || '#', // Col N (index 13)
            pageUrl: values[14] || row.pageUrl || '#',         // Col O (index 14)
            language: values[15] || row.language || 'Português', // Col P (index 15)
            trafficSource: (values[16] || row.trafficSource || '').split(',').map((s: string) => s.trim()).filter(Boolean), // Col Q (index 16)
            creativeZipUrl: values[17] || row.creativeZipUrl || '#', // Col R (index 17)
          };
        });

        setOffers(parsedData);
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
      const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNiche = selectedNiche === 'Todos' || o.niche === selectedNiche;
      const matchesType = selectedType === 'Todos' || o.productType === selectedType;
      const matchesLanguage = selectedLanguage === 'Todos' || o.language === selectedLanguage;
      const matchesTraffic = selectedTraffic === 'Todos' || o.trafficSource.some(ts => ts === selectedTraffic);
      return matchesSearch && matchesNiche && matchesType && matchesLanguage && matchesTraffic;
    });
  };

  const availableNiches = ['Todos', ...Array.from(new Set(offers.map(o => o.niche)))];
  const availableLanguages = ['Todos', ...Array.from(new Set(offers.map(o => o.language)))];
  const availableTrafficSources = ['Todos', ...Array.from(new Set(offers.flatMap(o => o.trafficSource)))];

  const showFilters = ['offers', 'vsl', 'creatives', 'pages', 'ads_library'].includes(currentPage) && !selectedOffer;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-40 gap-4 animate-pulse">
          <Loader2 className="text-brand-gold animate-spin" size={48} />
          <p className="text-brand-gold font-black uppercase text-xs tracking-widest italic">Infiltrando nos Servidores...</p>
        </div>
      );
    }

    if (selectedOffer) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <button 
              onClick={() => { setSelectedOffer(null); setActiveVslIndex(0); }}
              className="flex items-center text-gray-500 hover:text-brand-gold transition-all font-black uppercase text-xs tracking-widest group"
            >
              <div className="bg-brand-hover p-2 rounded-lg mr-3 group-hover:bg-brand-gold group-hover:text-black transition-all">
                <ChevronRight className="rotate-180" size={16} />
              </div>
              Voltar para Base
            </button>
            
            <div className="flex flex-wrap items-center gap-3">
              <a href={selectedOffer.vslDownloadUrl} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                <Download size={16} /> BAIXAR VSL
              </a>
              <a href={selectedOffer.transcriptionUrl} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-hover text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-brand-gold border border-white/5 transition-all shadow-lg">
                <FileText size={16} /> BAIXAR TRANSCRIÇÃO
              </a>
              <button 
                onClick={() => toggleFavorite(selectedOffer.id)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg border ${favorites.includes(selectedOffer.id) ? 'bg-brand-gold text-black border-brand-gold' : 'bg-brand-hover text-white border-white/5'}`}
              >
                <Star size={16} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'FAVORITADO' : 'FAVORITAR'}
              </button>
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-[60%] space-y-6">
                <div className="bg-brand-card p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-6 scrollbar-hide">
                    {selectedOffer.vslLinks.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVslIndex(idx)}
                        className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 whitespace-nowrap ${
                          activeVslIndex === idx ? 'bg-brand-gold text-black' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        <Video size={12} /> {link.label}
                      </button>
                    ))}
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/5">
                    <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} title="VSL Player" />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[40%] space-y-4">
                <div className="bg-brand-card p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 shadow-2xl h-full">
                  <h3 className="text-brand-gold font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3 italic">
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
                      <div key={idx} className="flex items-center justify-between p-4 bg-brand-hover rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <item.icon className="text-brand-gold w-5 h-5 shrink-0" />
                          <span className="text-gray-500 text-[10px] font-black uppercase">{item.label}</span>
                        </div>
                        <span className="text-white text-sm font-black uppercase italic tracking-tight text-right line-clamp-1">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2">
                 <ImageIcon className="text-brand-gold w-6 h-6" /> ARSENAL DE CRIATIVOS HÍBRIDOS
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
                        rel="noreferrer"
                        className="w-full py-3 bg-brand-hover text-brand-gold font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-black transition-all border border-brand-gold/20"
                      >
                        <Download size={14} /> BAIXAR ESTE CRIATIVO
                      </a>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-8">
                 {selectedOffer.creativeImages.map((img, i) => (
                   <div key={i} className="aspect-square bg-brand-card rounded-2xl overflow-hidden border border-white/5 group relative cursor-pointer">
                     <img src={img} alt="Creative" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-brand-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="text-white w-8 h-8" />
                     </div>
                   </div>
                 ))}
               </div>

               <div className="pt-10 flex justify-center">
                  <a 
                    href={selectedOffer.creativeZipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-10 py-5 bg-brand-gold text-black font-black text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase tracking-tighter flex items-center gap-3 italic"
                  >
                    <Zap size={20} fill="currentColor" /> BAIXAR ARSENAL COMPLETO (ZIP)
                  </a>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2">
                 <Layout className="text-brand-gold w-6 h-6" /> ESTRUTURA DE VENDAS
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <a href={selectedOffer.pageUrl} target="_blank" rel="noreferrer" className="p-6 bg-brand-card rounded-[24px] md:rounded-[28px] border border-white/5 hover:border-brand-gold/50 transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-hover rounded-xl group-hover:bg-brand-gold group-hover:text-black transition-colors">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acessar</p>
                        <p className="text-white font-black uppercase text-base md:text-lg italic">PÁGINA OFICIAL</p>
                      </div>
                   </div>
                   <ExternalLink size={20} className="text-gray-600 group-hover:text-brand-gold" />
                 </a>
                 <a href={selectedOffer.facebookUrl} target="_blank" rel="noreferrer" className="p-6 bg-brand-card rounded-[24px] md:rounded-[28px] border border-white/5 hover:border-brand-gold/50 transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-hover rounded-xl group-hover:bg-brand-gold group-hover:text-black transition-colors">
                        <Facebook size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Acessar</p>
                        <p className="text-white font-black uppercase text-base md:text-lg italic">BIBLIOTECA DE ANÚNCIOS</p>
                      </div>
                   </div>
                   <ExternalLink size={20} className="text-gray-600 group-hover:text-brand-gold" />
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
        const scalingHome = offers.filter(o => o.trend === 'Escalando').slice(0, 4);
        const recentlyHome = offers.filter(o => recentlyViewed.includes(o.id));

        return (
          <div className="animate-in fade-in duration-700 space-y-16 md:space-y-20">
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                  <Zap className="text-brand-gold" fill="currentColor" /> OPERAÇÕES EM ESCALA
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
                  <Monitor className="text-brand-gold" /> VISTOS RECENTEMENTE
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
          </div>
        );

      case 'vsl':
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filtered.map(offer => (
                <div key={offer.id} onClick={() => trackView(offer)} className="bg-brand-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-brand-gold/50 transition-all shadow-xl">
                    <div className="relative aspect-video">
                        <img src={offer.coverImage} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-brand-gold text-black rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                                <Play fill="currentColor" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-brand-hover">
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
        return (
          <div className="animate-in fade-in duration-700 space-y-12">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filtered.map(offer => (
                  <div key={offer.id} onClick={() => trackView(offer)} className="bg-brand-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-brand-gold/50 transition-all shadow-xl">
                      <div className="relative aspect-video">
                          <img src={offer.coverImage} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                              <ImageIcon className="text-brand-gold group-hover:scale-125 transition-all" size={32} />
                              <p className="text-[10px] text-white font-black uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full">{offer.creativeEmbedUrls.length + offer.creativeImages.length} Arquivos</p>
                          </div>
                      </div>
                      <div className="p-4 bg-brand-hover">
                          <p className="text-white font-black uppercase text-sm italic mb-1 truncate">{offer.title}</p>
                          <div className="flex items-center gap-2">
                             {offer.trafficSource.slice(0, 1).map((s, i) => <TrafficIcon key={i} source={s} />)}
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Acessar Arsenal</p>
                          </div>
                      </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'pages':
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(offer => (
                <div key={offer.id} className="bg-brand-card p-6 rounded-[24px] md:rounded-[32px] border border-white/5 hover:border-brand-gold/50 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-hover rounded-xl flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-all">
                                <Layout size={20} />
                            </div>
                            <p className="text-white font-black uppercase text-sm md:text-base italic truncate max-w-[150px] md:max-w-none">{offer.title}</p>
                        </div>
                        <button onClick={(e) => toggleFavorite(offer.id, e)} className="text-gray-600 hover:text-brand-gold transition-colors">
                            <Star size={18} fill={favorites.includes(offer.id) ? "currentColor" : "none"} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <a href={offer.pageUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-hover hover:bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                            <Monitor size={14} /> PÁGINA OFICIAL <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ads_library':
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(offer => (
                <div key={offer.id} className="bg-brand-card p-6 rounded-[24px] md:rounded-[32px] border border-white/5 hover:border-brand-gold/50 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-hover rounded-xl flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-all">
                                <Library size={20} />
                            </div>
                            <p className="text-white font-black uppercase text-sm md:text-base italic truncate max-w-[150px] md:max-w-none">{offer.title}</p>
                        </div>
                        <button onClick={(e) => toggleFavorite(offer.id, e)} className="text-gray-600 hover:text-brand-gold transition-colors">
                            <Star size={18} fill={favorites.includes(offer.id) ? "currentColor" : "none"} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <a href={offer.facebookUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-hover hover:bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                            <Facebook size={14} /> BIBLIOTECA DE ANÚNCIOS <ExternalLink size={12} />
                        </a>
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

      default:
        return <div className="text-center py-20 text-gray-500 font-black uppercase italic">Em desenvolvimento...</div>;
    }
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} isSuccess={isSuccess} onCloseSuccess={() => setIsSuccess(false)} />;
  }

  const SidebarContent = () => (
    <div className="p-10 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-16 px-2">
        <div className="bg-brand-gold p-2 rounded-xl shadow-xl shadow-brand-gold/10">
          <Eye className="text-black" size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">007 Swiper</span>
      </div>
      
      <nav className="space-y-2">
        <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => { setCurrentPage('home'); setSelectedOffer(null); }} />
        <SidebarItem icon={Star} label="SEUS FAVORITOS" active={currentPage === 'favorites'} onClick={() => { setCurrentPage('favorites'); setSelectedOffer(null); }} />
        <SidebarItem icon={Settings} label="Configurações" active={currentPage === 'settings'} onClick={() => { setCurrentPage('settings'); setSelectedOffer(null); }} />
        
        <div className="pt-8 pb-4">
          <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
          <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers' || (selectedOffer !== null && currentPage === 'offers')} onClick={() => { setCurrentPage('offers'); setSelectedOffer(null); }} />
          <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => { setCurrentPage('vsl'); setSelectedOffer(null); }} />
          <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => { setCurrentPage('creatives'); setSelectedOffer(null); }} />
          <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => { setCurrentPage('pages'); setSelectedOffer(null); }} />
          <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => { setCurrentPage('ads_library'); setSelectedOffer(null); }} />
        </div>
      </nav>

      <div className="mt-auto">
        <SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => setIsLoggedIn(false)} variant="danger" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-brand-dark text-white selection:bg-brand-gold selection:text-black">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`w-72 bg-brand-card border-r border-white/5 flex flex-col fixed h-screen z-[110] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <SidebarContent />
      </aside>

      <main className="flex-1 lg:ml-72 relative w-full">
        <header className="h-auto py-6 md:py-8 flex flex-col px-4 md:px-10 bg-brand-dark/80 backdrop-blur-xl sticky top-0 z-[80] border-b border-white/5 gap-4 md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-brand-card border border-white/5 rounded-xl text-brand-gold hover:bg-brand-hover transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 flex items-center bg-brand-card px-4 md:px-6 py-2.5 md:py-3 rounded-[16px] md:rounded-[24px] border border-white/5 shadow-inner max-w-xl">
               <Search className="text-gray-500 mr-3 md:mr-4" size={18} />
               <input 
                  type="text" 
                  placeholder="Pesquisar inteligência..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs md:text-sm w-full font-bold placeholder:text-gray-700" 
               />
            </div>

            <div className="flex items-center gap-3 bg-brand-card p-1.5 pr-4 md:pr-6 rounded-[16px] md:rounded-[24px] border border-white/5 shadow-2xl ml-2 md:ml-6 shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-gold rounded-lg md:rounded-xl flex items-center justify-center font-black text-black text-sm md:text-lg shadow-lg">007</div>
                <div className="hidden sm:block">
                  <p className="font-black text-[10px] uppercase tracking-tighter text-white leading-none">Agente Ativo</p>
                </div>
            </div>
          </div>

          {showFilters && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="lg:hidden w-full flex items-center justify-center gap-2 py-3 bg-brand-card border border-brand-gold/20 rounded-xl text-brand-gold font-black uppercase text-[10px] tracking-widest hover:bg-brand-hover transition-all"
              >
                <Filter size={14} /> {isFiltersOpen ? 'FECHAR FILTROS' : 'FILTRAR RESULTADOS'}
              </button>

              <div className={`${isFiltersOpen ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-3 md:gap-4 mt-4 lg:mt-0`}>
                <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[45%] lg:min-w-0">
                  <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Nicho</label>
                  <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
                    {availableNiches.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[45%] lg:min-w-0">
                  <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Tipo de Produto</label>
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
                    <option value="Todos">Todos</option>
                    {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[45%] lg:min-w-0">
                  <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Tráfego</label>
                  <select value={selectedTraffic} onChange={(e) => setSelectedTraffic(e.target.value)} className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
                    {availableTrafficSources.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[45%] lg:min-w-0">
                  <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">Idioma</label>
                  <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
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
    </div>
  );
};

export default App;
