
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
  Zap
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
 * TYPES DEFINITIONS 
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

const PRODUCT_TYPES: ProductType[] = ['Infoproduto', 'Low Ticket', 'Nutracêutico', 'Dropshipping'];

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
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-brand-gold transition-colors">{offer.title}</h3>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          <Video size={14} className="text-brand-gold" /> {offer.vslLinks.length} VSL
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
      
      <div className="bg-white text-black p-12 rounded-[50px] w-full max-w-lg shadow-2xl relative overflow-hidden group border-b-[10px] border-brand-gold mt-12">
        <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Eye size={200} />
        </div>
        <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter italic text-brand-gold">ACESSO PREMIUM</h2>
        <p className="text-gray-600 mb-10 font-bold text-sm tracking-tight italic">O arsenal definitivo para quem joga no nível profissional.</p>
        <div className="text-7xl font-black mb-12 tracking-tighter flex items-end justify-center text-black">
          R$ 197<span className="text-xl text-gray-400 font-black mb-2 ml-1">/mês</span>
        </div>
        <button 
          onClick={() => window.open('https://pay.kiwify.com.br/SRiorgy', '_blank')}
          className="w-full py-6 bg-brand-dark text-brand-gold font-black text-2xl rounded-3xl hover:scale-105 transition-all shadow-2xl uppercase tracking-tighter flex items-center justify-center gap-3 border-2 border-transparent hover:border-brand-gold"
        >
          <Zap size={28} fill="currentColor" /> QUERO ACESSO AGORA
        </button>
      </div>
    </main>
  </div>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [activeVslIndex, setActiveVslIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsSuccess(true);
    }
  }, []);

  const handleLogin = () => {
    const password = window.prompt("🕵️‍♂️ AUTENTICAÇÃO NECESSÁRIA\nDigite sua chave de acesso VIP:");
    if (password === 'AGENTE007') {
      setIsLoggedIn(true);
      setIsSuccess(false);
    } else if (password !== null) {
      alert('ACESSO NEGADO ❌\nSua assinatura não foi identificada ou a chave está incorreta.');
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filterOffers = (offers: Offer[]) => {
    return offers.filter(o => {
      const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNiche = selectedNiche === 'Todos' || o.niche === selectedNiche;
      const matchesType = selectedType === 'Todos' || o.productType === selectedType;
      return matchesSearch && matchesNiche && matchesType;
    });
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} isSuccess={isSuccess} onCloseSuccess={() => setIsSuccess(false)} />;
  }

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
              <a href={selectedOffer.downloadUrl} className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                <Download size={18} /> Baixar VSL
              </a>
              <button onClick={() => setSelectedOffer(null)} className="flex items-center gap-2 px-6 py-3 bg-brand-hover text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:border-brand-gold transition-all border border-white/5 shadow-lg">
                <FileText size={18} /> Ver Transcrição
              </button>
            </div>
          </div>

          <div className="bg-brand-card p-6 lg:p-10 rounded-[40px] border border-white/5 shadow-3xl">
             <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-10">
                    <h1 className="text-4xl font-black text-white uppercase italic">{selectedOffer.title}</h1>
                    <div className="bg-brand-hover rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
                      <div className="flex bg-black/40 p-2 gap-2 overflow-x-auto">
                        {selectedOffer.vslLinks.map((link, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveVslIndex(idx)}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl flex items-center gap-2 whitespace-nowrap ${
                              activeVslIndex === idx 
                              ? 'bg-brand-gold text-black' 
                              : 'text-gray-500 hover:text-white'
                            }`}
                          >
                            <Video size={14} /> {link.label}
                          </button>
                        ))}
                      </div>
                      <div className="aspect-video">
                        <iframe 
                          className="w-full h-full"
                          src={selectedOffer.vslLinks[activeVslIndex].url}
                          title="VSL Player"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                </div>
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-brand-hover p-6 rounded-[32px] border border-white/5 shadow-xl">
                        <h3 className="text-brand-gold font-black uppercase text-xs mb-4">Informações</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between"><span className="text-gray-500 text-xs font-bold uppercase">Nicho</span><span className="text-white text-xs font-black uppercase">{selectedOffer.niche}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 text-xs font-bold uppercase">Tipo</span><span className="text-white text-xs font-black uppercase">{selectedOffer.productType}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 text-xs font-bold uppercase">Tráfego</span><span className="text-white text-xs font-black uppercase">{selectedOffer.trafficSource}</span></div>
                        </div>
                    </div>
                    <div className="bg-brand-hover p-6 rounded-[32px] border border-white/5 shadow-xl">
                        <h3 className="text-brand-gold font-black uppercase text-xs mb-4">Análise Tática</h3>
                        <div className="h-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[{v:10},{v:25},{v:15},{v:40},{v:30}]}>
                                <Area type="monotone" dataKey="v" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      );
    }

    const filteredOffers = filterOffers(MOCK_OFFERS);

    switch (currentPage) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-700">
            <div className="mb-12">
                <h2 className="text-3xl font-black text-white uppercase italic mb-6">Mais Vistos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filterOffers(MOCK_OFFERS.slice(0, 4)).map(offer => (
                    <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    isFavorite={favorites.includes(offer.id)}
                    onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                    onClick={() => setSelectedOffer(offer)}
                    />
                ))}
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-black text-white uppercase italic mb-6">Vistos Recentemente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filterOffers(MOCK_OFFERS.slice(1, 5)).map(offer => (
                    <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    isFavorite={favorites.includes(offer.id)}
                    onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                    onClick={() => setSelectedOffer(offer)}
                    />
                ))}
                </div>
            </div>
          </div>
        );
      case 'offers':
        return (
          <div className="animate-in fade-in duration-700">
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
                <div className="col-span-full py-20 text-center text-gray-500 font-black uppercase italic">Nenhuma oferta encontrada para os filtros selecionados.</div>
              )}
            </div>
          </div>
        );
      case 'favorites':
        const favs = filterOffers(MOCK_OFFERS.filter(o => favorites.includes(o.id)));
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favs.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={true}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => setSelectedOffer(offer)}
                />
              ))}
              {favs.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 font-black uppercase italic">Nenhum favorito encontrado.</div>
              )}
            </div>
          </div>
        );
      default:
        return <div className="text-center py-20 text-gray-500 font-black uppercase italic">Em Breve...</div>;
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
            {/* UPPER SECTION */}
            <SidebarItem 
              icon={HomeIcon} 
              label="Home" 
              active={currentPage === 'home' && !selectedOffer} 
              onClick={() => { setCurrentPage('home'); setSelectedOffer(null); }} 
            />
            <SidebarItem 
              icon={Star} 
              label="Favoritos" 
              active={currentPage === 'favorites'} 
              onClick={() => { setCurrentPage('favorites'); setSelectedOffer(null); }} 
            />
            <SidebarItem 
              icon={Settings} 
              label="Configurações" 
              active={currentPage === 'settings'} 
              onClick={() => { setCurrentPage('settings'); setSelectedOffer(null); }} 
            />
            
            {/* LOWER SECTION */}
            <div className="pt-8 pb-4">
              <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4">Análise</p>
              <SidebarItem 
                icon={Tag} 
                label="Ofertas" 
                active={currentPage === 'offers' || (selectedOffer !== null && currentPage === 'offers')} 
                onClick={() => { setCurrentPage('offers'); setSelectedOffer(null); }} 
              />
              <SidebarItem 
                icon={Palette} 
                label="Criativos" 
                active={currentPage === 'creatives'} 
                onClick={() => { setCurrentPage('creatives'); setSelectedOffer(null); }} 
              />
              <SidebarItem 
                icon={FileText} 
                label="Páginas" 
                active={currentPage === 'pages'} 
                onClick={() => { setCurrentPage('pages'); setSelectedOffer(null); }} 
              />
            </div>
          </nav>

          <div className="mt-auto">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center justify-center space-x-3 px-6 py-5 rounded-[20px] text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-500/20"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72 relative">
        <header className="h-28 flex items-center justify-between px-10 bg-brand-dark/80 backdrop-blur-xl sticky top-0 z-[80] border-b border-white/5">
          <div className="flex-1 flex items-center gap-4">
            {/* SEARCH + FILTERS BAR */}
            <div className="flex-1 flex items-center bg-brand-card px-6 py-4 rounded-[24px] border border-white/5 shadow-inner max-w-2xl">
              <Search className="text-gray-500 mr-4" size={20} />
              <input 
                  type="text" 
                  placeholder="Pesquisar banco de dados..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full font-bold placeholder:text-gray-700" 
              />
            </div>

            {/* NICHE FILTER */}
            <div className="hidden xl:flex items-center gap-2">
               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest whitespace-nowrap">Nicho:</label>
               <select 
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="bg-brand-card border border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-tighter text-white outline-none hover:border-brand-gold transition-all cursor-pointer"
               >
                  <option value="Todos">Todos</option>
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
               </select>
            </div>

            {/* TYPE FILTER */}
            <div className="hidden xl:flex items-center gap-2">
               <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest whitespace-nowrap">Tipo:</label>
               <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-brand-card border border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-tighter text-white outline-none hover:border-brand-gold transition-all cursor-pointer"
               >
                  <option value="Todos">Todos</option>
                  {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
          </div>
          
          <div className="flex items-center gap-6 ml-10">
            <div className="flex items-center gap-4 bg-brand-card p-2 pr-6 rounded-[24px] border border-white/5 shadow-2xl">
              <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-lg border-2 border-white/10">007</div>
              <div className="hidden sm:block">
                <p className="font-black text-xs uppercase tracking-tighter text-white">Agente Secreto</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">VIP</p>
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
