
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
type ProductType = 'Infoproduto' | 'Low Ticket' | 'Nutracêutico' | 'Dropshipping';
type Niche = string;

interface Offer {
  id: string; title: string; niche: string; productType: string; 
  description: string; coverImage: string; trend: string; views: number; 
  vslLinks: { label: string; url: string }[]; downloadUrl: string;
  transcription: string; creativeImages: string[]; 
  facebookUrl: string; pageUrl: string; language: string; trafficSource: string[];
}
import { MOCK_OFFERS } from './data';


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

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-brand-gold bg-opacity-10 text-brand-gold' 
        : 'text-gray-400 hover:bg-brand-hover hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
  <div className="mb-12">
    <div className="flex items-center space-x-2 mb-6">
      <Icon className="text-brand-gold" size={24} />
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  </div>
);

interface OfferCardProps {
  offer: Offer;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ 
  offer, 
  isFavorite, 
  onToggleFavorite, 
  onClick 
}) => (
  <div 
    onClick={onClick}
    className="bg-brand-card rounded-xl overflow-hidden group cursor-pointer border border-transparent hover:border-brand-gold transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={offer.coverImage} 
        alt={offer.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {offer.trend === 'Escalando' && (
          <div className="px-2 py-1 bg-green-600 text-white text-[9px] font-black rounded uppercase flex items-center gap-1 shadow-lg">
            <Zap size={10} /> Escalando
          </div>
        )}
        {offer.trend === 'Em Alta' && (
          <div className="px-2 py-1 bg-brand-gold text-black text-[9px] font-black rounded uppercase flex items-center gap-1 shadow-lg">
            <TrendingUp size={10} /> Em Alta
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 flex space-x-2">
        <button 
          onClick={onToggleFavorite}
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${
            isFavorite ? 'bg-brand-gold text-white' : 'bg-black bg-opacity-40 text-white hover:bg-brand-gold'
          }`}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
        <div className="px-2 py-0.5 bg-brand-gold text-black text-[9px] font-black rounded uppercase shadow-lg">
          {offer.niche}
        </div>
        <div className="px-2 py-0.5 bg-white text-black text-[9px] font-black rounded uppercase shadow-lg">
          {offer.productType}
        </div>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-white mb-3 line-clamp-1">{offer.title}</h3>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex space-x-1">
          <div className="p-1.5 bg-brand-hover text-gray-400 rounded flex items-center gap-1 text-[10px] uppercase font-bold transition-colors">
            <Video size={12} /> VSL {offer.vslLinks.length > 1 ? `x${offer.vslLinks.length}` : ''}
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-xs">
          <Eye size={14} className="mr-1" />
          {(offer.views / 1000).toFixed(1)}k
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = ({ 
  onLogin, 
  isSuccess, 
  onCloseSuccess 
}: { 
  onLogin: () => void, 
  isSuccess: boolean,
  onCloseSuccess: () => void
}) => (
  <div className="min-h-screen bg-brand-dark flex flex-col items-center">
    {isSuccess && (
      <div className="w-full bg-brand-gold text-black py-4 px-6 md:px-12 text-center font-black animate-in fade-in slide-in-from-top-4 duration-500 flex items-center justify-between gap-4 border-b-4 border-black/10 shadow-[0_4px_30px_rgba(212,175,55,0.4)] sticky top-0 z-[60]">
        <div className="flex-1 flex items-center justify-center gap-3">
          <Trophy size={24} className="animate-bounce shrink-0" />
          <span className="text-xs md:text-sm lg:text-base tracking-tight uppercase leading-tight">
            PAGAMENTO CONFIRMADO! 🕵️‍♂️ Sua chave de acesso permanente é: 
            <span className="bg-black text-brand-gold px-3 py-1 rounded mx-2 inline-flex items-center gap-1 shadow-lg">
              <Lock size={14} /> AGENTE007
            </span> 
            <span className="text-red-700 bg-red-700/10 px-2 py-0.5 rounded border border-red-700/20">
              <AlertTriangle size={14} className="inline mr-1" />
              ATENÇÃO: Salve esta senha agora ou tire um print desta tela para não perder seu acesso futuro!
            </span>
          </span>
        </div>
        <button 
          onClick={onCloseSuccess}
          className="p-1 hover:bg-black/10 rounded-full transition-colors shrink-0"
          title="Fechar aviso"
        >
          <X size={24} />
        </button>
      </div>
    )}
    
    <nav className="w-full max-w-7xl px-6 py-6 flex justify-between items-center relative z-50">
      <div className="flex items-center space-x-2">
        <div className="bg-brand-gold p-2 rounded-lg shadow-lg shadow-brand-gold/20">
          <Eye className="text-black" size={24} />
        </div>
        <span className="text-2xl font-extrabold tracking-tighter text-white">007 SWIPER</span>
      </div>
      
      <button 
        onClick={onLogin}
        className="px-6 py-2 bg-brand-gold hover:bg-yellow-600 text-black font-bold rounded-full transition-all shadow-lg shadow-brand-gold/20 flex items-center gap-2 uppercase text-xs tracking-tighter"
      >
        <Lock size={14} /> Entrar na Plataforma
      </button>
    </nav>
    
    <main className="flex-1 w-full max-w-7xl px-6 flex flex-col items-center justify-center text-center mt-12 mb-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent -z-10 pointer-events-none"></div>
      
      <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-brand-gold border-opacity-30 bg-brand-gold bg-opacity-5 text-brand-gold text-sm font-semibold animate-pulse">
        A Ferramenta Secreta dos Top Afiliados & Produtores
      </div>
      <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
        Espione as Ofertas que estão <br/> <span className="text-brand-gold italic">Dominando o Mercado.</span>
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mb-12 font-medium">
        Acesse os funis, criativos e VSLs que estão faturando alto agora mesmo. Pare de tentar adivinhar e comece a copiar o que já funciona.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-20 w-full max-w-5xl">
        {[
          { title: "Funis Completos", desc: "Veja cada etapa, do anúncio ao checkout." },
          { title: "Análise de Criativos", desc: "Os vídeos e imagens com maior CTR." },
          { title: "Transcrição com IA", desc: "Estude o script por trás das vendas." }
        ].map((feature, i) => (
          <div key={i} className="bg-brand-card p-8 rounded-2xl border border-white border-opacity-5 hover:border-brand-gold/50 transition-colors shadow-xl">
            <h3 className="text-brand-gold text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white text-black p-10 rounded-[40px] w-full max-w-md shadow-2xl shadow-brand-gold/20 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Eye size={160} />
        </div>
        <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Acesso Premium</h2>
        <p className="text-gray-600 mb-8 font-medium text-sm">Libere agora o banco de dados restrito dos maiores players do mercado digital.</p>
        <div className="text-6xl font-black mb-10 tracking-tighter">R$ 197<span className="text-lg text-gray-400 font-bold">/mês</span></div>
        <button 
          onClick={() => window.open('https://pay.kiwify.com.br/Bo6rspD', '_blank')}
          className="w-full py-5 bg-brand-dark text-brand-gold font-black text-xl rounded-2xl hover:scale-105 transition-transform shadow-2xl uppercase tracking-tighter flex items-center justify-center gap-3"
        >
          <Unlock size={24} /> QUERO ACESSO AGORA
        </button>
        <div className="mt-6 flex items-center justify-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Kiwify.png" alt="Kiwify Secure" className="h-4 grayscale opacity-50" />
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Garantia Blindada de 7 dias</p>
        </div>
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

  const chartData = [
    { name: 'Seg', value: 400 },
    { name: 'Ter', value: 300 },
    { name: 'Qua', value: 600 },
    { name: 'Qui', value: 800 },
    { name: 'Sex', value: 500 },
    { name: 'Sáb', value: 900 },
    { name: 'Dom', value: 700 },
  ];

  if (!isLoggedIn) {
    return (
      <LandingPage 
        onLogin={handleLogin} 
        isSuccess={isSuccess} 
        onCloseSuccess={() => setIsSuccess(false)}
      />
    );
  }

  const renderContent = () => {
    if (selectedOffer) {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => { setSelectedOffer(null); setActiveVslIndex(0); }}
              className="flex items-center text-gray-400 hover:text-brand-gold transition-colors font-bold uppercase text-xs tracking-widest"
            >
              <ChevronRight className="rotate-180 mr-2" size={16} /> Voltar para lista
            </button>
            
            <div className="flex gap-2">
              <a 
                href={selectedOffer.downloadUrl}
                className="flex items-center gap-2 px-6 py-2 bg-brand-hover hover:bg-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-white/5 hover:border-brand-gold/30 transition-all"
              >
                <Download size={16} /> Baixar VSL
              </a>
              <button 
                onClick={(e) => toggleFavorite(selectedOffer.id, e)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  favorites.includes(selectedOffer.id) 
                  ? 'bg-brand-gold text-black' 
                  : 'bg-brand-hover text-white border border-white/5'
                }`}
              >
                <Star size={16} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> 
                {favorites.includes(selectedOffer.id) ? 'Remover' : 'Arquivar'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <h1 className="text-3xl font-black mr-4">{selectedOffer.title}</h1>
            <span className="px-4 py-1.5 bg-brand-gold text-black text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg">{selectedOffer.niche}</span>
            <span className="px-4 py-1.5 bg-brand-card rounded-lg text-brand-gold text-[10px] font-black border border-brand-gold border-opacity-20 uppercase tracking-widest shadow-lg">{selectedOffer.productType}</span>
            {selectedOffer.trend === 'Escalando' && (
              <span className="px-4 py-1.5 bg-green-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest flex items-center gap-1 shadow-lg animate-pulse">
                <Zap size={12} /> Escalando
              </span>
            )}
            {selectedOffer.trend === 'Em Alta' && (
              <span className="px-4 py-1.5 bg-brand-gold text-black text-[10px] font-black rounded-lg uppercase tracking-widest flex items-center gap-1 shadow-lg animate-pulse">
                <TrendingUp size={12} /> Em Alta
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* VSL Section with Tabs */}
              <div className="bg-brand-card rounded-3xl overflow-hidden border border-white border-opacity-5 shadow-2xl">
                <div className="flex border-b border-white/5 bg-brand-hover/50">
                  {selectedOffer.vslLinks.map((link, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveVslIndex(idx)}
                      className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        activeVslIndex === idx 
                        ? 'bg-brand-card text-brand-gold border-b-2 border-brand-gold' 
                        : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      <Play size={14} fill={activeVslIndex === idx ? "currentColor" : "none"} /> {link.label}
                    </button>
                  ))}
                </div>
                <div className="aspect-video">
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
              
              <div className="bg-brand-card p-8 rounded-3xl border border-white border-opacity-5 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black flex items-center gap-2 text-white">
                    <FileText className="text-brand-gold" size={20} /> Transcrição do Script
                  </h3>
                  <button className="text-[10px] font-black text-brand-gold hover:underline uppercase tracking-widest">Copiar Tudo</button>
                </div>
                <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed font-medium bg-brand-hover/30 p-6 rounded-2xl border border-white/5">
                  {selectedOffer.transcription}
                </div>
              </div>

              <div className="bg-brand-card p-8 rounded-3xl border border-white border-opacity-5 shadow-xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-white">
                  <Palette className="text-brand-gold" size={20} /> Criativos Espionados
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedOffer.creativeImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative border border-white border-opacity-5">
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Creative" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button className="bg-brand-gold p-3 rounded-xl text-black shadow-xl transform scale-75 group-hover:scale-100 transition-transform"><Search size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-brand-card p-8 rounded-3xl border border-white border-opacity-5 shadow-xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-white">
                  <BarChart2 className="text-brand-gold" size={20} /> Inteligência de Tráfego
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                      <XAxis dataKey="name" stroke="#444" fontSize={10} fontWeight="bold" />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#121212', border: '1px solid #D4AF37', borderRadius: '12px' }} 
                        itemStyle={{ color: '#D4AF37' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#D4AF37" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-gray-400 font-bold">Volume de Buscas</span>
                    <span className="text-white font-black">{(selectedOffer.views / 10).toLocaleString()} / DIA</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-gray-400 font-bold">Escalabilidade</span>
                    <span className="text-green-500 font-black">ALTA DISPONIBILIDADE</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                    <span className="text-gray-400 font-bold">Frequência de Anúncios</span>
                    <span className="text-white font-black">CRÍTICA</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-card p-8 rounded-3xl border border-white border-opacity-5 shadow-xl">
                <h3 className="text-xl font-black mb-6 text-white uppercase tracking-tighter">Intercepção Direta</h3>
                <div className="space-y-4">
                  <a href={selectedOffer.facebookUrl} className="flex items-center justify-between w-full p-4 bg-brand-hover rounded-2xl text-gray-300 hover:text-white hover:bg-zinc-800 transition-all border border-white/5 hover:border-brand-gold/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Monitor size={20} /></div>
                      <span className="font-black text-xs uppercase tracking-tighter">Spy Library</span>
                    </div>
                    <ArrowUpRight size={18} />
                  </a>
                  <a href={selectedOffer.pageUrl} className="flex items-center justify-between w-full p-4 bg-brand-hover rounded-2xl text-gray-300 hover:text-white hover:bg-zinc-800 transition-all border border-white/5 hover:border-brand-gold/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-black shadow-lg"><ExternalLink size={20} /></div>
                      <span className="font-black text-xs uppercase tracking-tighter">Sales Page</span>
                    </div>
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-500">
            <Section title="Spy Trends" icon={TrendingUp}>
              {MOCK_OFFERS.slice(0, 4).map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={favorites.includes(offer.id)}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => setSelectedOffer(offer)}
                />
              ))}
            </Section>
            
            <Section title="Recém Interceptados" icon={Clock}>
              {MOCK_OFFERS.slice(4, 8).map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={favorites.includes(offer.id)}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => setSelectedOffer(offer)}
                />
              ))}
            </Section>
          </div>
        );
      case 'offers':
      case 'creatives':
      case 'pages':
        const filtered = MOCK_OFFERS.filter(o => {
          const matchSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase());
          const matchLang = filters.language === 'Todos' || o.language === filters.language;
          const matchTraffic = filters.traffic === 'Todos' || o.trafficSource.includes(filters.traffic);
          const matchType = filters.type === 'Todos' || o.productType === filters.type;
          const matchNiche = filters.niche === 'Todos' || o.niche === filters.niche;
          return matchSearch && matchLang && matchTraffic && matchType && matchNiche;
        });

        return (
          <div className="animate-in fade-in duration-500">
            <div className="bg-brand-card p-8 rounded-[32px] border border-white border-opacity-5 mb-10 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="relative col-span-2">
                  <label className="text-[10px] font-black uppercase text-brand-gold tracking-widest px-2 block mb-1.5">Interceptar Operação</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Nome, nicho ou palavra-chave..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-brand-hover rounded-2xl text-sm border-2 border-transparent focus:border-brand-gold outline-none transition-all placeholder:text-gray-600 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-brand-gold tracking-widest px-2 block">Nicho</label>
                  <select 
                    value={filters.niche}
                    onChange={(e) => setFilters(f => ({ ...f, niche: e.target.value }))}
                    className="w-full bg-brand-hover border-2 border-transparent hover:border-brand-gold/30 px-4 py-3 rounded-2xl text-sm outline-none cursor-pointer transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Todos">Todos</option>
                    {NICHES.sort().map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-brand-gold tracking-widest px-2 block">Tipo</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-brand-hover border-2 border-transparent hover:border-brand-gold/30 px-4 py-3 rounded-2xl text-sm outline-none cursor-pointer transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Todos">Todos</option>
                    {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(offer => (
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
        );
      case 'favorites':
        const favoriteOffers = MOCK_OFFERS.filter(o => favorites.includes(o.id));
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
              <Star className="text-brand-gold fill-brand-gold" size={32} /> Arquivo Secreto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteOffers.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  isFavorite={true}
                  onToggleFavorite={(e) => toggleFavorite(offer.id, e)}
                  onClick={() => setSelectedOffer(offer)}
                />
              ))}
            </div>
          </div>
        );
      default:
        return <div className="py-20 text-center font-black text-gray-700 text-4xl uppercase tracking-tighter">Em breve...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark text-white selection:bg-brand-gold selection:text-black">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-card border-r border-white border-opacity-5 hidden lg:flex flex-col fixed h-screen z-50">
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-12">
            <div className="bg-brand-gold p-2 rounded-xl shadow-lg shadow-brand-gold/20">
              <Eye className="text-black" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">007 SWIPER</span>
          </div>
          
          <div className="space-y-1">
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
          </div>

          <div className="my-8 border-t border-white border-opacity-5"></div>

          <div className="space-y-1">
            <SidebarItem 
              icon={Tag} 
              label="Operações" 
              active={currentPage === 'offers' || (selectedOffer !== null && currentPage === 'offers')} 
              onClick={() => { setCurrentPage('offers'); setSelectedOffer(null); }} 
            />
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-500/20"
            >
              <LogOut size={18} />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 relative">
        <header className="h-24 flex items-center justify-between px-10 bg-brand-dark/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
          <div className="flex items-center">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              {selectedOffer ? 'Operação em Curso' : 'Quartel General'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 cursor-pointer group p-1 pr-4 bg-brand-card rounded-2xl border border-white border-opacity-5 hover:border-brand-gold/30 transition-all shadow-xl">
            <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center font-black text-black border-2 border-transparent group-hover:border-white transition-all shadow-lg">007</div>
            <div className="hidden md:block">
              <p className="font-black text-xs uppercase tracking-tighter text-white">Agente 007</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Acesso VIP</p>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
