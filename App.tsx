
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
  Play
} from 'lucide-react';
import { MOCK_OFFERS } from './data';
import { Offer, Niche, ProductType, Trend, VslLink } from './types';

/** 
 * CONSTANTS FOR FILTERS
 */
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

const PRODUCT_TYPES: ProductType[] = ['Infoproduto', 'Low Ticket', 'Nutracêutico', 'Dropshipping', 'E-book'];
const TRAFFIC_SOURCES = ['Facebook Ads', 'YouTube Ads', 'TikTok Ads', 'Google Ads', 'Taboola', 'Instagram Ads', 'Native Ads'];
const LANGUAGES = ['Português', 'Inglês', 'Espanhol'];

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
    className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-brand-gold text-black font-black shadow-lg shadow-brand-gold/20' 
        : variant === 'danger' 
          ? 'text-red-500 hover:bg-red-500/10' 
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
            <TrendingUp size={12} className="w-3 h-3" /> Em Alta
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
      <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-brand-gold transition-colors">{offer.title}</h3>
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          <Monitor size={14} className="text-brand-gold" /> {offer.trafficSource}
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
          <Trophy size={24} className="shrink-0" />
          <span className="text-xs md:text-sm lg:text-base tracking-tight uppercase leading-tight">
            PAGAMENTO CONFIRMADO! 🕵️‍♂️ SUA CHAVE: 
            <span className="bg-black text-brand-gold px-3 py-1 rounded mx-2 inline-flex items-center gap-1 shadow-lg">
              <Lock size={14} /> AGENTE007
            </span> 
          </span>
        </div>
        <button onClick={onCloseSuccess} className="p-1 hover:bg-black/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>
    )}
    
    <nav className="w-full max-w-7xl px-8 py-8 flex justify-between items-center relative z-50">
      <div className="flex items-center space-x-3">
        <div className="bg-brand-gold p-2.5 rounded-2xl rotate-3">
          <Eye className="text-black" size={28} />
        </div>
        <span className="text-3xl font-black tracking-tighter text-white uppercase italic">007 Swiper</span>
      </div>
      <button 
        onClick={onLogin}
        className="px-8 py-3 bg-brand-gold hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl shadow-brand-gold/30 flex items-center gap-2 uppercase text-xs tracking-tighter"
      >
        <Lock size={16} /> Entrar
      </button>
    </nav>
    
    <main className="flex-1 w-full max-w-7xl px-8 flex flex-col items-center justify-center text-center mt-12 mb-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent -z-10 pointer-events-none opacity-50"></div>
      
      <div className="inline-block px-5 py-2 mb-8 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-black uppercase tracking-[0.2em]">
        Inteligência Digital Secreta
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase italic">
        Espione as Ofertas que <br/> <span className="text-brand-gold">Dominam o Jogo.</span>
      </h1>
      
      <div className="bg-white text-black p-12 rounded-[50px] w-full max-w-lg shadow-2xl relative overflow-hidden group border-b-[10px] border-brand-gold mt-12">
        <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter italic text-brand-gold">ACESSO PREMIUM</h2>
        <p className="text-gray-600 mb-10 font-bold text-sm tracking-tight italic">O arsenal definitivo para o mercado digital profissional.</p>
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
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedNiche, setSelectedNiche] = useState<string>('Todos');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [selectedTraffic, setSelectedTraffic] = useState<string>('Todos');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Todos');

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setIsSuccess(true);
    }
    const savedFavs = localStorage.getItem('007_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedViewed = localStorage.getItem('007_viewed');
    if (savedViewed) setRecentlyViewed(JSON.parse(savedViewed));
  }, []);

  const handleLogin = () => {
    const password = window.prompt("🕵️‍♂️ ACESSO VIP\nDigite sua chave de acesso VIP:");
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

  const applyEliteFilters = (offers: Offer[]) => {
    return offers.filter(o => {
      const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNiche = selectedNiche === 'Todos' || o.niche === selectedNiche;
      const matchesType = selectedType === 'Todos' || o.productType === selectedType;
      const matchesTraffic = selectedTraffic === 'Todos' || o.trafficSource === selectedTraffic;
      const matchesLanguage = selectedLanguage === 'Todos' || o.language === selectedLanguage;
      return matchesSearch && matchesNiche && matchesType && matchesTraffic && matchesLanguage;
    });
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} isSuccess={isSuccess} onCloseSuccess={() => setIsSuccess(false)} />;
  }

  const renderContent = () => {
    if (selectedOffer) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* TOPO: TRÊS BOTÕES ALINHADOS */}
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
              <a href={selectedOffer.downloadUrl} className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                <Download size={16} /> BAIXAR VSL
              </a>
              <button className="flex items-center gap-2 px-6 py-3 bg-brand-hover text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-brand-gold border border-white/5 transition-all shadow-lg">
                <FileText size={16} /> BAIXAR TRANSCRIÇÃO
              </button>
              <button 
                onClick={() => toggleFavorite(selectedOffer.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg border ${favorites.includes(selectedOffer.id) ? 'bg-brand-gold text-black border-brand-gold' : 'bg-brand-hover text-white border-white/5'}`}
              >
                <Star size={16} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> {favorites.includes(selectedOffer.id) ? 'FAVORITADO' : 'FAVORITAR'}
              </button>
            </div>
          </div>

          <div className="space-y-12">
            {/* MEIO: LAYOUT DE DUAS COLUNAS (ESPIONAGEM) */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* MEIO (ESQUERDA 60%) */}
              <div className="w-full lg:w-[60%] space-y-6">
                <div className="bg-brand-card p-6 rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-6">
                    {selectedOffer.vslLinks.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVslIndex(idx)}
                        className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-2 whitespace-nowrap ${
                          activeVslIndex === idx 
                          ? 'bg-brand-gold text-black' 
                          : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        <Video size={12} /> {selectedOffer.vslLinks.length > 1 ? `VSL ${idx + 1}` : 'VSL'}
                      </button>
                    ))}
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/5">
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

              {/* MEIO (DIREITA 40%) */}
              <div className="w-full lg:w-[40%] space-y-4">
                <div className="bg-brand-card p-8 rounded-[32px] border border-white/5 shadow-2xl h-full">
                  <h3 className="text-brand-gold font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3 italic">
                    <ShieldCheck className="w-4 h-4" /> INFORMAÇÕES DA OPERAÇÃO
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      { icon: Tag, label: 'Nicho', value: selectedOffer.niche },
                      { icon: Lock, label: 'Tipo de Produto', value: selectedOffer.productType },
                      { icon: Globe, label: 'Idioma', value: selectedOffer.language },
                      { icon: Monitor, label: 'Rede de Tráfego', value: selectedOffer.trafficSource },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-brand-hover rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <item.icon className="text-brand-gold w-5 h-5" />
                          <span className="text-gray-500 text-[10px] font-black uppercase">{item.label}</span>
                        </div>
                        <span className="text-white text-base font-black uppercase italic tracking-tight">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BASE: CRIATIVOS ESPIONADOS */}
            <div className="space-y-6">
               <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2">
                 <ImageIcon className="text-brand-gold w-6 h-6" /> CRIATIVOS ESPIONADOS
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                 {selectedOffer.creativeImages.map((img, i) => (
                   <div key={i} className="aspect-square bg-brand-card rounded-2xl overflow-hidden border border-white/5 group relative cursor-pointer">
                     <img src={img} alt="Creative" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-brand-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="text-white w-8 h-8" />
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* BASE: PÁGINAS DE VENDA */}
            <div className="space-y-6">
               <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3 px-2">
                 <Layout className="text-brand-gold w-6 h-6" /> PÁGINAS DE VENDA
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <a 
                   href={selectedOffer.pageUrl} 
                   target="_blank" 
                   rel="noreferrer"
                   className="p-6 bg-brand-card rounded-[28px] border border-white/5 hover:border-brand-gold/50 transition-all flex items-center justify-between group"
                 >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-hover rounded-xl group-hover:bg-brand-gold group-hover:text-black transition-colors">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Acessar</p>
                        <p className="text-white font-black uppercase text-lg italic">Sales Page Oficial</p>
                      </div>
                   </div>
                   <ExternalLink size={20} className="text-gray-600 group-hover:text-brand-gold" />
                 </a>

                 <a 
                   href="#" 
                   target="_blank" 
                   rel="noreferrer"
                   className="p-6 bg-brand-card rounded-[28px] border border-white/5 hover:border-brand-gold/50 transition-all flex items-center justify-between group"
                 >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-hover rounded-xl group-hover:bg-brand-gold group-hover:text-black transition-colors">
                        <MousePointer2 size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Acessar</p>
                        <p className="text-white font-black uppercase text-lg italic">Página de Checkout</p>
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

    const filtered = applyEliteFilters(MOCK_OFFERS);

    switch (currentPage) {
      case 'home':
        const scalingHome = applyEliteFilters(MOCK_OFFERS.filter(o => o.trend === 'Escalando'));
        const recentlyHome = applyEliteFilters(MOCK_OFFERS.filter(o => recentlyViewed.includes(o.id)));
        const favoritesHome = applyEliteFilters(MOCK_OFFERS.filter(o => favorites.includes(o.id)));

        return (
          <div className="animate-in fade-in duration-700 space-y-16">
            {/* OPERAÇÕES EM ESCALA */}
            <div>
                <h2 className="text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                  <Zap className="text-brand-gold" fill="currentColor" /> OPERAÇÕES EM ESCALA
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

            {/* VISTOS RECENTEMENTE */}
            <div>
                <h2 className="text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                  <Monitor className="text-brand-gold" /> VISTOS RECENTEMENTE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recentlyHome.map(offer => (
                    <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    isFavorite={favorites.includes(offer.id)}
                    onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                    onClick={() => trackView(offer)}
                    />
                ))}
                {recentlyHome.length === 0 && <p className="text-gray-600 font-bold uppercase text-xs italic px-2">Nenhuma atividade recente registrada.</p>}
                </div>
            </div>

            {/* SEUS FAVORITOS */}
            <div>
                <h2 className="text-3xl font-black text-white uppercase italic mb-8 flex items-center gap-4">
                  <Star className="text-brand-gold" fill="currentColor" /> SEUS FAVORITOS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favoritesHome.map(offer => (
                    <OfferCard 
                    key={offer.id} 
                    offer={offer} 
                    isFavorite={true}
                    onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                    onClick={() => trackView(offer)}
                    />
                ))}
                {favoritesHome.length === 0 && <p className="text-gray-600 font-bold uppercase text-xs italic px-2">Favoritos vazios. Marque ofertas para acesso rápido.</p>}
                </div>
            </div>
          </div>
        );

      case 'offers':
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                        <p className="text-white font-black uppercase text-sm italic mb-1">{offer.title}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1"><Monitor size={12} className="text-brand-gold" /> {offer.trafficSource}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'creatives':
        const allCreatives = filtered.flatMap(o => o.creativeImages.map(img => ({ img, offer: o })));
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {allCreatives.map((item, i) => (
                <div key={i} onClick={() => trackView(item.offer)} className="aspect-square bg-brand-card rounded-xl overflow-hidden border border-white/5 group relative cursor-pointer">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[9px] font-black text-white uppercase truncate">{item.offer.title}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pages':
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(offer => (
                <div key={offer.id} className="bg-brand-card p-6 rounded-[32px] border border-white/5 hover:border-brand-gold/50 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-hover rounded-xl flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-all">
                                <Layout size={20} />
                            </div>
                            <p className="text-white font-black uppercase text-base italic">{offer.title}</p>
                        </div>
                        <button onClick={(e) => toggleFavorite(offer.id, e)} className="text-gray-600 hover:text-brand-gold transition-colors">
                            <Star size={18} fill={favorites.includes(offer.id) ? "currentColor" : "none"} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <a href={offer.pageUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-hover hover:bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                            <Monitor size={14} /> SALES PAGE <ExternalLink size={12} />
                        </a>
                        <a href="#" target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-hover hover:bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                            <MousePointer2 size={14} /> CHECKOUT <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        const favList = applyEliteFilters(MOCK_OFFERS.filter(o => favorites.includes(o.id)));
        return (
          <div className="animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favList.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={true}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => trackView(offer)}
                />
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-center py-20 text-gray-500 font-black uppercase italic">Módulo VIP em desenvolvimento...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark text-white selection:bg-brand-gold selection:text-black">
      {/* SIDEBAR REORGANIZADA */}
      <aside className="w-72 bg-brand-card border-r border-white/5 hidden lg:flex flex-col fixed h-screen z-[90]">
        <div className="p-10 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-16 px-2">
            <div className="bg-brand-gold p-2 rounded-xl shadow-xl shadow-brand-gold/10">
              <Eye className="text-black" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">007 Swiper</span>
          </div>
          
          <nav className="space-y-2">
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
            
            <div className="pt-8 pb-4">
              <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4">Inteligência Modular</p>
              <SidebarItem 
                icon={Tag} 
                label="OFERTAS" 
                active={currentPage === 'offers' || (selectedOffer !== null && currentPage === 'offers')} 
                onClick={() => { setCurrentPage('offers'); setSelectedOffer(null); }} 
              />
              <SidebarItem 
                icon={Video} 
                label="VSL" 
                active={currentPage === 'vsl'} 
                onClick={() => { setCurrentPage('vsl'); setSelectedOffer(null); }} 
              />
              <SidebarItem 
                icon={Palette} 
                label="CRIATIVOS" 
                active={currentPage === 'creatives'} 
                onClick={() => { setCurrentPage('creatives'); setSelectedOffer(null); }} 
              />
              <SidebarItem 
                icon={FileText} 
                label="PÁGINAS" 
                active={currentPage === 'pages'} 
                onClick={() => { setCurrentPage('pages'); setSelectedOffer(null); }} 
              />
            </div>
          </nav>

          <div className="mt-auto">
            <SidebarItem 
              icon={LogOut} 
              label="Sair" 
              active={false}
              onClick={() => setIsLoggedIn(false)} 
              variant="danger"
            />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-72 relative">
        <header className="h-auto py-8 flex flex-col px-10 bg-brand-dark/80 backdrop-blur-xl sticky top-0 z-[80] border-b border-white/5 gap-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center bg-brand-card px-6 py-3 rounded-[24px] border border-white/5 shadow-inner max-w-xl">
               <Search className="text-gray-500 mr-4" size={18} />
               <input 
                  type="text" 
                  placeholder="Pesquisar inteligência..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full font-bold placeholder:text-gray-700" 
               />
            </div>
            <div className="flex items-center gap-4 bg-brand-card p-2 pr-6 rounded-[24px] border border-white/5 shadow-2xl ml-6">
                <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">007</div>
                <div className="hidden sm:block">
                  <p className="font-black text-[10px] uppercase tracking-tighter text-white leading-none">Agente Secreto</p>
                </div>
            </div>
          </div>

          {!selectedOffer && (
            <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-gray-600 px-1">Nicho</label>
                <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
                  <option value="Todos">Todos</option>
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-gray-600 px-1">Tipo de Produto</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
                  <option value="Todos">Todos</option>
                  {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-gray-600 px-1">Rede de Tráfego</label>
                <select value={selectedTraffic} onChange={(e) => setSelectedTraffic(e.target.value)} className="bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
                  <option value="Todos">Todas</option>
                  {TRAFFIC_SOURCES.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-gray-600 px-1">Idioma</label>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="bg-brand-card border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black uppercase text-white outline-none hover:border-brand-gold cursor-pointer transition-all">
                  <option value="Todos">Todos</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}
        </header>

        <div className="p-10 max-w-[1600px] mx-auto min-h-screen pb-32">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
