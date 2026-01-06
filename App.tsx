
import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Star, 
  Settings, 
  Tag, 
  Palette, 
  FileText, 
  Search, 
  Menu, 
  X,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Play,
  Monitor,
  Eye,
  CheckCircle,
  BarChart2,
  Lock,
  Unlock,
  ShieldCheck,
  Trophy,
  AlertTriangle,
  Download,
  Video,
  ArrowUpRight,
  Zap,
  Layout,
  Globe,
  MoreVertical
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { MOCK_OFFERS } from './data';

/**
 * TECHNICAL SPECIFICATION & TYPES
 */
export type ProductType = 'Infoproduto' | 'Low Ticket' | 'Nutracêutico' | 'Dropshipping' | string;

export type Niche = 
  | 'Exercícios' | 'Disfunção Erétil' | 'Outros' | 'Próstata' 
  | 'Lei da Atração/Prosperidade' | 'Emagrecimento' | 'Rejuvenescimento' 
  | 'Renda Extra' | 'Infantil/Maternidade' | 'Dores Articulares' 
  | 'Sexualidade' | 'Alzheimer' | 'Pet' | 'Neuropatia' 
  | 'Evangélico/Cristianismo' | 'Relacionamento' | 'Desenvolvimento Pessoal' 
  | 'Diabetes' | 'Menopausa' | 'Saúde Mental' | 'Visão' 
  | 'Aumento Peniano' | 'Pressão Alta' | 'Saúde Respiratória' 
  | 'Calvície' | 'Pack' | 'Escrita' | 'Idiomas' | 'Prisão de Ventre' 
  | 'Beleza' | 'Fungos' | 'Nutrição' | 'Produtividade' 
  | 'Refluxo/Gastrite' | 'Moda' | 'Edema' | 'Varizes' | 'Zumbido' | string;

export type Trend = 'Em Alta' | 'Escalando' | 'Estável';

export interface VslLink {
  label: string;
  url: string;
}

export interface Offer {
  id: string;
  title: string;
  niche: Niche;
  language: string;
  trafficSource: string;
  productType: ProductType;
  structure: string;
  vslLinks: VslLink[];
  downloadUrl: string;
  trend: Trend;
  facebookUrl: string;
  pageUrl: string;
  coverImage: string;
  views: number;
  transcription: string;
  creativeImages: string[];
}

const PRODUCT_TYPES: ProductType[] = ['Infoproduto', 'Low Ticket', 'Nutracêutico', 'Dropshipping'];

const NICHES: Niche[] = [
  'Exercícios', 'Disfunção Erétil', 'Outros', 'Próstata', 
  'Lei da Atração/Prosperidade', 'Emagrecimento', 'Rejuvenescimento', 
  'Renda Extra', 'Infantil/Maternidade', 'Dores Articulares', 
  'Sexualidade', 'Alzheimer', 'Pet', 'Neuropatia', 
  'Evangélico/Cristianismo', 'Relacionamento', 'Desenvolvimento Pessoal', 
  'Diabetes', 'Menopausa', 'Saúde Mental', 'Visão', 
  'Aumento Peniano', 'Pressão Alta', 'Saúde Respiratória', 
  'Calvície', 'Pack', 'Escrita', 'Idiomas', 'Prisão de Ventre', 
  'Beleza', 'Fungos', 'Nutrição', 'Produtividade', 
  'Refluxo/Gastrite', 'Moda', 'Edema', 'Varizes', 'Zumbido'
];

/**
 * COMPONENTS
 */

const SidebarItem: React.FC<{
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-brand-gold text-black font-black shadow-lg shadow-brand-gold/20' 
        : 'text-gray-400 hover:bg-brand-hover hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm uppercase tracking-tighter">{label}</span>
  </button>
);

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
        src={offer.coverImage} 
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
            <TrendingUp size={10} /> Em Alta
          </div>
        )}
      </div>

      <div className="absolute top-3 right-3">
        <button 
          onClick={onToggleFavorite}
          className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${
            isFavorite ? 'bg-brand-gold text-black scale-110' : 'bg-black/40 text-white hover:bg-brand-gold hover:text-black'
          }`}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        <div className="px-2 py-0.5 bg-brand-gold text-black text-[9px] font-black rounded uppercase shadow-lg">
          {offer.niche}
        </div>
        <div className="px-2 py-0.5 bg-white text-black text-[9px] font-black rounded uppercase shadow-lg">
          {offer.productType}
        </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-brand-gold transition-colors">{offer.title}</h3>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          <Video size={14} className="text-brand-gold" /> {offer.vslLinks.length} VSL{offer.vslLinks.length > 1 ? 's' : ''}
        </div>
        <div className="flex items-center text-gray-500 text-xs font-black italic">
          <Eye size={14} className="mr-1 text-brand-gold" />
          {(offer.views / 1000).toFixed(1)}K
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = ({ onLogin, isSuccess, onCloseSuccess }: any) => (
  <div className="min-h-screen bg-brand-dark flex flex-col items-center">
    {isSuccess && (
      <div className="w-full bg-brand-gold text-black py-4 px-6 md:px-12 text-center font-black animate-in fade-in slide-in-from-top-4 duration-500 flex items-center justify-between gap-4 border-b-4 border-black/10 shadow-[0_4px_30px_rgba(212,175,55,0.4)] sticky top-0 z-[100]">
        <div className="flex-1 flex items-center justify-center gap-3">
          <Trophy size={24} className="animate-bounce shrink-0" />
          <span className="text-xs md:text-sm lg:text-base tracking-tight uppercase leading-tight">
            PAGAMENTO CONFIRMADO! 🕵️‍♂️ Sua chave de acesso permanente é: 
            <span className="bg-black text-brand-gold px-3 py-1 rounded mx-2 inline-flex items-center gap-1 shadow-lg border border-white/10">
              <Lock size={14} /> AGENTE007
            </span> 
            <span className="text-red-700 bg-red-700/10 px-2 py-0.5 rounded border border-red-700/20 text-[10px] md:text-xs">
              <AlertTriangle size={14} className="inline mr-1" />
              ATENÇÃO: Salve esta senha agora ou tire um print para não perder seu acesso!
            </span>
          </span>
        </div>
        <button onClick={onCloseSuccess} className="p-1 hover:bg-black/10 rounded-full transition-colors shrink-0">
          <X size={24} />
        </button>
      </div>
    )}
    
    <nav className="w-full max-w-7xl px-8 py-8 flex justify-between items-center relative z-50">
      <div className="flex items-center space-x-3">
        <div className="bg-brand-gold p-2.5 rounded-2xl shadow-xl shadow-brand-gold/20 rotate-3">
          <Eye className="text-black" size={28} />
        </div>
        <span className="text-3xl font-black tracking-tighter text-white">007 SWIPER</span>
      </div>
      <button 
        onClick={onLogin}
        className="px-8 py-3 bg-brand-gold hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl shadow-brand-gold/30 flex items-center gap-2 uppercase text-xs tracking-tighter transform hover:scale-105"
      >
        <Lock size={16} /> Entrar na Plataforma
      </button>
    </nav>
    
    <main className="flex-1 w-full max-w-7xl px-8 flex flex-col items-center justify-center text-center mt-12 mb-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent -z-10 pointer-events-none opacity-50"></div>
      
      <div className="inline-block px-5 py-2 mb-8 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-black uppercase tracking-[0.2em] animate-pulse">
        Relatório Secreto de Inteligência Digital
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
        Espione as Ofertas que <br/> <span className="text-brand-gold italic">Dominam o Jogo.</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-3xl mb-16 font-medium leading-relaxed">
        Não perca tempo tentando reinventar a roda. Acesse os scripts, funis e criativos que já estão validado e faturando múltiplos 7 dígitos todos os meses.
      </p>
      
      <div className="bg-white text-black p-12 rounded-[50px] w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(212,175,55,0.2)] relative overflow-hidden group border-b-[10px] border-brand-gold">
        <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Eye size={200} />
        </div>
        {/* Requirement: Fully gold title */}
        <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter italic text-brand-gold">Acesso Premium</h2>
        <p className="text-gray-600 mb-10 font-bold text-sm tracking-tight">O arsenal definitivo para quem joga no nível profissional.</p>
        {/* Requirement: R$ 197 Highlighted, /mês smaller and gray */}
        <div className="text-7xl font-black mb-12 tracking-tighter flex items-end justify-center text-black">
          R$ 197<span className="text-xl text-gray-400 font-black mb-2 ml-1">/mês</span>
        </div>
        <button 
          onClick={() => window.open('https://pay.kiwify.com.br/SRiorgy', '_blank')}
          className="w-full py-6 bg-brand-dark text-brand-gold font-black text-2xl rounded-3xl hover:scale-105 transition-all shadow-2xl uppercase tracking-tighter flex items-center justify-center gap-3 border-2 border-transparent hover:border-brand-gold"
        >
          <Zap size={28} fill="currentColor" /> QUERO ACESSO AGORA
        </button>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <ShieldCheck size={16} />
            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Garantia Incondicional de 7 dias</p>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Kiwify.png" alt="Kiwify Secure" className="h-4 grayscale opacity-40" />
        </div>
      </div>
    </main>
  </div>
);

/**
 * MAIN APP
 */
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [activeVslIndex, setActiveVslIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [filters, setFilters] = useState({
    language: 'Todos',
    traffic: 'Todos',
    type: 'Todos',
    niche: 'Todos'
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsSuccess(true);
    }
  }, []);

  const handleLogin = () => {
    const password = window.prompt("🕵️‍♂️ AUTENTICAÇÃO NECESSÁRIA\nPara acessar o quartel-general, digite sua chave:");
    if (password === 'AGENTE007') {
      setIsLoggedIn(true);
      setIsSuccess(false);
    } else if (password !== null) {
      alert('ACESSO NEGADO ❌\nSua licença não foi encontrada ou a chave está incorreta.');
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} isSuccess={isSuccess} onCloseSuccess={() => setIsSuccess(false)} />;
  }

  const FilterBar = () => (
    <div className="bg-brand-card p-6 lg:p-10 rounded-[40px] border border-white/5 mb-12 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 relative">
          <label className="text-[10px] font-black uppercase text-brand-gold tracking-[0.2em] px-2 block mb-3">Pesquisar Banco de Dados</label>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Identificar operação, nicho, player..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-brand-hover rounded-[20px] text-sm border-2 border-transparent focus:border-brand-gold outline-none transition-all placeholder:text-gray-700 font-bold"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-brand-gold tracking-[0.2em] px-2 block">Nicho</label>
          <select 
            value={filters.niche}
            onChange={(e) => setFilters(f => ({ ...f, niche: e.target.value }))}
            className="w-full bg-brand-hover border-2 border-transparent hover:border-brand-gold/30 px-5 py-4 rounded-[20px] text-sm outline-none cursor-pointer transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:18px] bg-[right_1.2rem_center] bg-no-repeat"
          >
            <option value="Todos">Todos os Nichos</option>
            {NICHES.sort().map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-brand-gold tracking-[0.2em] px-2 block">Tipo</label>
          <select 
            value={filters.type}
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            className="w-full bg-brand-hover border-2 border-transparent hover:border-brand-gold/30 px-5 py-4 rounded-[20px] text-sm outline-none cursor-pointer transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:18px] bg-[right_1.2rem_center] bg-no-repeat"
          >
            <option value="Todos">Todos os Tipos</option>
            {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedOffer) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <button 
              onClick={() => { setSelectedOffer(null); setActiveVslIndex(0); }}
              className="flex items-center text-gray-500 hover:text-brand-gold transition-all font-black uppercase text-xs tracking-[0.2em] group"
            >
              <div className="bg-brand-hover p-2 rounded-lg mr-3 group-hover:bg-brand-gold group-hover:text-black transition-all">
                <ChevronRight className="rotate-180" size={16} />
              </div>
              Voltar para Base
            </button>
            
            <div className="flex flex-wrap gap-3">
              <a 
                href={selectedOffer.downloadUrl}
                className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand-gold/10"
              >
                <Download size={18} /> Baixar VSL
              </a>
              <button 
                onClick={(e) => toggleFavorite(selectedOffer.id, e)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                  favorites.includes(selectedOffer.id) 
                  ? 'bg-red-600 text-white' 
                  : 'bg-brand-hover text-gray-300 border border-white/5 hover:border-brand-gold/30'
                }`}
              >
                <Star size={18} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> 
                {favorites.includes(selectedOffer.id) ? 'Remover do Arquivo' : 'Salvar no Arquivo'}
              </button>
            </div>
          </div>

          <div className="bg-brand-card p-6 lg:p-10 rounded-[40px] border border-white/5 shadow-3xl mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <div className="flex flex-wrap items-end gap-4 mb-2">
                  <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedOffer.title}</h1>
                  <div className="flex gap-2 pb-1">
                    <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-black rounded-lg uppercase tracking-widest border border-brand-gold/20">{selectedOffer.niche}</span>
                    <span className="px-3 py-1 bg-white/5 text-white text-[10px] font-black rounded-lg uppercase tracking-widest border border-white/10">{selectedOffer.productType}</span>
                  </div>
                </div>

                <div className="bg-brand-hover rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
                  <div className="flex bg-black/40 p-2 gap-2 overflow-x-auto">
                    {selectedOffer.vslLinks.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVslIndex(idx)}
                        className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl flex items-center gap-2 whitespace-nowrap ${
                          activeVslIndex === idx 
                          ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20' 
                          : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Video size={14} fill={activeVslIndex === idx ? "currentColor" : "none"} /> {link.label}
                      </button>
                    ))}
                  </div>
                  <div className="aspect-video relative group">
                    <iframe 
                      className="w-full h-full"
                      src={selectedOffer.vslLinks[activeVslIndex].url}
                      title="VSL Player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-brand-hover/40 p-8 rounded-[32px] border border-white/5 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black flex items-center gap-3 text-white uppercase tracking-tighter">
                        <FileText className="text-brand-gold" size={24} /> Transcrição
                      </h3>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedOffer.transcription)}
                        className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl hover:bg-brand-gold hover:text-black transition-all"
                        title="Copiar Script"
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <div className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-[12] whitespace-pre-line italic">
                      "{selectedOffer.transcription}"
                    </div>
                    <button className="mt-6 w-full py-4 bg-brand-gold/10 text-brand-gold text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all">Ver Transcrição Completa</button>
                  </div>

                  <div className="bg-brand-hover/40 p-8 rounded-[32px] border border-white/5 shadow-xl">
                    <h3 className="text-lg font-black flex items-center gap-3 text-white mb-6 uppercase tracking-tighter">
                      <Palette className="text-brand-gold" size={24} /> Criativos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedOffer.creativeImages.map((img, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden group/img relative border border-white/5 cursor-zoom-in">
                          <img src={img} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" alt="Creative" />
                          <div className="absolute inset-0 bg-brand-gold/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Search size={24} className="text-black" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 w-full py-4 bg-white/5 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all">Exportar Pack (.zip)</button>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-brand-hover p-8 rounded-[32px] border border-white/5 shadow-xl">
                  <h3 className="text-lg font-black mb-8 text-white uppercase tracking-tighter flex items-center gap-3">
                    <BarChart2 size={24} className="text-brand-gold" /> Inteligência
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'S1', value: 400 },
                        { name: 'S2', value: 300 },
                        { name: 'S3', value: 600 },
                        { name: 'S4', value: 800 },
                        { name: 'S5', value: 500 },
                        { name: 'S6', value: 900 },
                      ]}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#D4AF37" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 space-y-5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-500">Volume de Tráfego</span>
                      <span className="text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">CRÍTICO</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-500">Estimativa de CTR</span>
                      <span className="text-white">3.4% - 4.1%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-500">CPM Médio</span>
                      <span className="text-white">R$ 14,20</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-hover p-8 rounded-[32px] border border-white/5 shadow-xl">
                  <h3 className="text-lg font-black mb-6 text-white uppercase tracking-tighter">Links Diretos</h3>
                  <div className="space-y-4">
                    <a href={selectedOffer.facebookUrl} target="_blank" className="flex items-center justify-between w-full p-5 bg-brand-dark/40 rounded-2xl text-gray-300 hover:text-white hover:bg-brand-dark transition-all border border-white/5 hover:border-brand-gold/30 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Monitor size={24} /></div>
                        <div>
                          <p className="font-black text-xs uppercase tracking-tighter">Facebook Ads</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Biblioteca de Anúncios</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href={selectedOffer.pageUrl} target="_blank" className="flex items-center justify-between w-full p-5 bg-brand-dark/40 rounded-2xl text-gray-300 hover:text-white hover:bg-brand-dark transition-all border border-white/5 hover:border-brand-gold/30 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-black shadow-lg"><Globe size={24} /></div>
                        <div>
                          <p className="font-black text-xs uppercase tracking-tighter">Página de Vendas</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Funil Ativo</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Prepare filtered list for both 'home' and 'offers' to ensure filters work everywhere as requested
    const filteredOffers = MOCK_OFFERS.filter(o => {
      const matchSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filters.type === 'Todos' || o.productType === filters.type;
      const matchNiche = filters.niche === 'Todos' || o.niche === filters.niche;
      return matchSearch && matchType && matchNiche;
    });

    switch (currentPage) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-700">
            {/* Filter Bar re-activated at the top of Quartel General */}
            <FilterBar />

            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Monitor de Inteligência</h2>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-brand-hover rounded-xl border border-white/5 text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Atualizado Agora
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredOffers.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={favorites.includes(offer.id)}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => setSelectedOffer(offer)}
                />
              ))}
              {filteredOffers.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 font-bold">Nenhuma operação identificada com os filtros atuais.</div>
              )}
            </div>
          </div>
        );
      case 'offers':
        return (
          <div className="animate-in fade-in duration-700">
            <FilterBar />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredOffers.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={favorites.includes(offer.id)}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => setSelectedOffer(offer)}
                />
              ))}
              {filteredOffers.length === 0 && (
                <div className="col-span-full py-40 text-center flex flex-col items-center">
                  <div className="p-10 bg-brand-hover rounded-full mb-8 border border-white/5 opacity-30">
                    <Search size={64} />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Nenhuma operação identificada</h3>
                  <button onClick={() => { setSearchQuery(''); setFilters({ language: 'Todos', traffic: 'Todos', type: 'Todos', niche: 'Todos' }); }} className="text-brand-gold font-black uppercase text-xs tracking-widest hover:underline">Reiniciar Filtros de Inteligência</button>
                </div>
              )}
            </div>
          </div>
        );
      case 'favorites':
        const favoriteOffers = MOCK_OFFERS.filter(o => favorites.includes(o.id));
        return (
          <div className="animate-in fade-in duration-700">
            <h2 className="text-4xl font-black mb-12 text-white uppercase italic tracking-tighter flex items-center gap-5">
              <Star className="text-brand-gold" fill="#D4AF37" size={40} /> Arquivo Secreto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favoriteOffers.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={true}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => setSelectedOffer(offer)}
                />
              ))}
              {favoriteOffers.length === 0 && (
                <div className="col-span-full py-40 text-center flex flex-col items-center">
                  <div className="p-10 bg-brand-hover rounded-full mb-8 border border-white/5 opacity-30">
                    <Star size={64} />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Seu arquivo está vazio</h3>
                  <p className="text-gray-500 max-w-sm font-medium mb-10">Arquive as melhores ofertas para estudá-las e replicar suas estratégias vencedoras.</p>
                  <button onClick={() => setCurrentPage('offers')} className="px-10 py-5 bg-brand-gold text-black font-black rounded-3xl uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-gold/20">Explorar Operações</button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark text-white selection:bg-brand-gold selection:text-black">
      {/* SIDEBAR */}
      <aside className="w-72 bg-brand-card border-r border-white/5 hidden lg:flex flex-col fixed h-screen z-[90]">
        <div className="p-10 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-16 px-2">
            <div className="bg-brand-gold p-2 rounded-xl shadow-xl shadow-brand-gold/10">
              <Eye className="text-black" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">007 SWIPER</span>
          </div>
          
          <nav className="space-y-2">
            {/* Requirement: Side menus Inteligência, Arquivo Secreto, Operações */}
            <SidebarItem 
              icon={HomeIcon} 
              label="Inteligência" 
              active={currentPage === 'home' && !selectedOffer} 
              onClick={() => { setCurrentPage('home'); setSelectedOffer(null); }} 
            />
            <SidebarItem 
              icon={Star} 
              label="Arquivo Secreto" 
              active={currentPage === 'favorites'} 
              onClick={() => { setCurrentPage('favorites'); setSelectedOffer(null); }} 
            />
            <div className="pt-8 pb-4">
              <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4">Monitoramento</p>
              <SidebarItem 
                icon={Tag} 
                label="Operações" 
                active={currentPage === 'offers' || (selectedOffer !== null && currentPage === 'offers')} 
                onClick={() => { setCurrentPage('offers'); setSelectedOffer(null); }} 
              />
            </div>
          </nav>

          <div className="mt-auto space-y-4">
            <div className="bg-brand-hover p-6 rounded-[28px] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:rotate-12 transition-transform"><Trophy size={64} /></div>
               <p className="text-[10px] font-black uppercase text-brand-gold tracking-widest mb-1">Status do Agente</p>
               <p className="text-sm font-black text-white uppercase italic tracking-tighter">Acesso VIP Vitalício</p>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center justify-center space-x-3 px-6 py-5 rounded-[20px] text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-500/20"
            >
              <LogOut size={18} />
              <span>Desativar Sessão</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-72 relative">
        <header className="h-28 flex items-center justify-between px-10 bg-brand-dark/80 backdrop-blur-xl sticky top-0 z-[80] border-b border-white/5">
          <div>
            <p className="text-[10px] font-black uppercase text-brand-gold tracking-[0.4em] mb-1">Status: Conectado</p>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              {selectedOffer ? 'Análise Tática' : (currentPage === 'home' ? 'Monitor Global' : (currentPage === 'offers' ? 'Explorador' : 'Arquivo'))}
            </h1>
          </div>
          
          <div className="flex items-center space-x-10">
            <div className="hidden xl:flex items-center gap-8">
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Base de Dados</p>
                  <p className="text-sm font-black text-brand-gold">1,492 OFERTAS</p>
               </div>
               <div className="text-right border-l border-white/10 pl-8">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Atividade 24h</p>
                  <p className="text-sm font-black text-green-500">+12 DETECTADAS</p>
               </div>
            </div>

            <div className="flex items-center gap-4 bg-brand-card p-2 pr-6 rounded-[24px] border border-white/5 shadow-2xl">
              <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-lg border-2 border-white/10">007</div>
              <div className="hidden sm:block">
                <p className="font-black text-xs uppercase tracking-tighter text-white">Agente Secreto</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Licença 007-V</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto min-h-screen pb-32">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
