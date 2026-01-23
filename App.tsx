import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE OFICIAL ---
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

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

// --- COMPONENTE RECUPERAR ID (NOVO) ---
const RecuperarID = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  
  const buscarID = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(''); setResultado(null);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const snap = await getDocs(q);
      if (snap.empty) setErro('E-mail não localizado na base de agentes.');
      else setResultado(snap.docs[0].id);
    } catch (err) { setErro('Erro de conexão. Tente novamente.'); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 animate-in fade-in">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs hover:underline"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full border border-white/10 bg-[#121212] p-8 rounded-[32px] shadow-2xl">
        <h2 className="text-2xl font-black text-[#D4AF37] italic uppercase mb-6 text-center">Recuperar Acesso</h2>
        <form onSubmit={buscarID} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white font-bold" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-black p-4 rounded-xl hover:scale-105 transition-transform uppercase italic shadow-lg">Consultar Base</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-black border border-[#D4AF37] rounded-2xl text-center"><p className="text-xs text-gray-500 uppercase mb-2 font-bold">Sua Credencial:</p><p className="text-2xl font-black text-white selection:bg-[#D4AF37]">{resultado}</p></div>}
        {erro && <p className="mt-4 text-red-500 text-center text-xs font-bold uppercase">{erro}</p>}
      </div>
    </div>
  );
};

// --- COMPONENTE ADMIN (NOVO) ---
const PainelAdmin = ({ onBack }: { onBack: () => void }) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  useEffect(() => {
    const buscar = async () => {
      try {
        const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
        const snap = await getDocs(q);
        setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
    }; buscar();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white p-8 animate-in fade-in">
      <button onClick={onBack} className="mb-8 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Sair</button>
      <h1 className="text-3xl font-black mb-10 italic uppercase tracking-tighter text-center">Base de <span className="text-[#D4AF37]">Agentes</span></h1>
      <div className="max-w-5xl mx-auto overflow-x-auto border border-white/10 rounded-3xl bg-[#121212]">
        <table className="w-full text-left"><thead className="bg-white/5 text-[10px] uppercase text-gray-500 tracking-widest"><tr><th className="p-6">ID</th><th className="p-6">E-mail</th><th className="p-6">Status</th></tr></thead>
          <tbody className="text-sm font-bold">{agentes.map(a => <tr key={a.id} className="border-b border-white/5"><td className="p-6 text-[#D4AF37] font-mono">{a.id}</td><td className="p-6">{a.email}</td><td className="p-6 text-green-500">ATIVO</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

/** * CONSTANTS & TYPES */
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;
export interface VslLink { label: string; url: string; }
export interface Offer { id: string; title: string; niche: Niche; language: string; trafficSource: string[]; productType: ProductType; description: string; vslLinks: VslLink[]; vslDownloadUrl: string; trend: Trend; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeImages: string[]; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; creativeZipUrl: string; addedDate: string; status: string; isFavorite?: boolean; }

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
// NOVOS LINKS HOTMART
const KIWIFY_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const KIWIFY_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; --brand-card: #121212; --brand-hover: #1a1a1a; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

/** * UTILS & HELPERS */
const getDriveDirectLink = (url: string) => {
 if (!url) return '';
 const trimmed = url.trim();
 if (trimmed.includes('drive.google.com')) { const idMatch = trimmed.match(/[-\w]{25,}/); if (idMatch) return `https://lh3.googleusercontent.com/u/0/d/${idMatch[0]}`; }
 return trimmed;
};

const getEmbedUrl = (url: string) => {
 if (!url) return '';
 const trimmed = url.trim();
 if (trimmed.includes('vimeo.com')) { const vimeoIdMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|video\/)([0-9]+)/); if (vimeoIdMatch) return `https://player.vimeo.com/video/${vimeoIdMatch[1]}?title=0&byline=0&portrait=0&badge=0&autopause=0`; }
 if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) { const ytIdMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/); if (ytIdMatch) return `https://www.youtube.com/embed/${ytIdMatch[1]}`; }
 return trimmed;
};

const SidebarItem: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void; variant?: 'default' | 'danger' | 'gold'; }> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black">{label}</span></button>
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
 return <iframe className="w-full h-full" src={embed} title={title || "Video Player"} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>;
};

// --- CARD ORIGINAL PRESERVADO ---
const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
  const getBadgeInfo = () => {
    if (!offer.addedDate) return { text: "OFERTA VIP", isNew: false };
    const dataOferta = new Date(offer.addedDate + 'T00:00:00');
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const diff = Math.floor((hoje.getTime() - dataOferta.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return { text: "ADICIONADO: HOJE", isNew: true };
    if (diff === 1) return { text: "ADICIONADO: HÁ 1 DIA", isNew: true };
    return { text: `ADICIONADO: HÁ ${diff} DIAS`, isNew: true };
  };
  const badge = getBadgeInfo();
  return (
    <div onClick={onClick} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
      <div className="relative aspect-video overflow-hidden">
        <img src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <div className={`px-2.5 py-1 text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl ${badge.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}><Clock size={10} fill={badge.isNew ? "currentColor" : "none"} /> {badge.text}</div>
          {offer.trend.trim().toLowerCase() === 'escalando' && <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>}
        </div>
        <div className="absolute top-3 right-3"><button onClick={onToggleFavorite} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-[#D4AF37]/20 text-white hover:bg-[#D4AF37] hover:text-black'}`}><Star size={18} fill={isFavorite ? "currentColor" : "none"} /></button></div>
        <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase shadow-lg">{offer.niche}</div></div>
      </div>
      <div className="p-5">
        <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors italic">{offer.title}</h3>
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">{offer.trafficSource.slice(0, 2).map((source, idx) => <TrafficIcon key={idx} source={source} />)}<span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span></div>
        </div>
      </div>
    </div>
  );
};

/**
 * LANDING PAGE (VISUAL BACKUP + LINKS NOVOS)
 */
const LandingPage = ({ onLogin, onRecover, onAdmin }: any) => (
  <div className="w-full bg-[#0a0a0a] flex flex-col items-center selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
    <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    
    <nav className="w-full max-w-7xl px-4 md:px-8 py-10 flex justify-between items-center relative z-50 mx-auto">
      <div className="flex items-center space-x-3">
        <div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={28} /></div>
        <span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onRecover} className="text-gray-500 hover:text-white font-black text-[10px] uppercase italic tracking-widest hidden md:block">Esqueceu ID?</button>
        <button onClick={onLogin} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs tracking-tighter italic">
          <Lock size={14} className="inline mr-2" /> Entrar
        </button>
      </div>
    </nav>
    
    <main className="w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center mt-12 mb-32 relative mx-auto">
      <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mx-auto">Inteligência de Mercado em Tempo Real</div>
      
      <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic max-w-6xl mx-auto text-center">
        ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span>
      </h1>
      
      <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed px-2 mx-auto text-center">
        Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões em YouTube Ads, Facebook Ads e TikTok Ads. O fim do "achismo" na sua escala digital.
      </p>

      <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-[#D4AF37]/40 mx-auto mb-32">
        <div className="bg-[#D4AF37] p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500 mb-6 flex items-center justify-center"><Play size={40} fill="black" className="text-black ml-1" /></div>
        <p className="text-white font-black uppercase text-[10px] md:text-xs tracking-[0.25em] italic max-w-md px-8 leading-relaxed text-center">Descubra como rastreamos e organizamos ofertas escaladas em tempo real</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 w-full max-w-5xl mb-40 px-4 justify-center items-stretch mx-auto">
        <div className="bg-[#121212] border border-white/5 rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO MENSAL</h3>
          <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black text-white italic">R$ 197</span><span className="text-gray-500 font-black text-sm uppercase">/mês</span></div>
          <button onClick={() => window.open(KIWIFY_MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter animate-btn-pulse shadow-xl italic">QUERO ACESSO MENSAL</button>
        </div>
        <div className="bg-white text-black rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col scale-105 border-t-[8px] border-[#D4AF37]">
          <div className="absolute top-6 right-8 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Economize R$ 94</div>
          <h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO TRIMESTRAL</h3>
          <div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black italic">R$ 497</span><span className="text-gray-400 font-black text-sm uppercase">/trimestre</span></div>
          <button onClick={() => window.open(KIWIFY_TRIMESTRAL, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-tighter animate-btn-pulse italic">ASSINAR PLANO TRIMESTRAL</button>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-40 px-4">
        <div className="bg-[#050505] border border-[#D4AF37]/30 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_80px_rgba(212,175,55,0.1)]">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-[#D4AF37] flex items-center justify-center relative shadow-[0_0_40px_rgba(212,175,55,0.2)]"><span className="text-[#D4AF37] text-6xl md:text-8xl font-black italic">7</span></div>
            <div className="bg-[#D4AF37] text-black px-8 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] -mt-5 relative z-10 shadow-xl">DIAS</div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-tighter">GARANTIA INCONDICIONAL DE <span className="text-[#D4AF37]">7 DIAS</span></h2>
            <p className="text-gray-400 font-medium text-base md:text-xl leading-relaxed italic max-w-2xl">Estamos tão seguros da qualidade do nosso arsenal que oferecemos risco zero. Se em até 7 dias você não sentir que a plataforma é para você, devolvemos 100% do seu investimento.</p>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-7xl px-4 md:px-8 border-t border-white/5 pt-12 pb-20 mx-auto">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic text-center">© 2026 007 SWIPER Intelligence Platform. Todos os direitos reservados.</p>
        <div onDoubleClick={onAdmin} className="h-10 w-full opacity-0 cursor-default">.</div>
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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering States
  const [selectedNiche, setSelectedNiche] = useState('Todos');
  const [selectedLanguage, setSelectedLanguage] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedTraffic, setSelectedTraffic] = useState('Todos');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [showRecover, setShowRecover] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Derived Values
  const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
  const allLanguages = Array.from(new Set(offers.map(o => o.language))).sort();
  const allTypes = Array.from(new Set(offers.map(o => o.productType))).sort();
  const allTrafficSources = Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort();

  const getFavKey = (id: string) => `favs_${id}`;

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

  const showFilters = currentPage === 'home' || (currentPage === 'offers' && !selectedOffer);

  useEffect(() => {
    const savedId = localStorage.getItem('agente_token');
    if (savedId) checkLogin(savedId, true);

    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch(CSV_URL);
        const text = await res.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const parsed: Offer[] = lines.slice(2).map((l, i) => {
          const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').trim());
          if (!v[1]) return null;
          return {
            id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: (v[6] as Trend) || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase(), creativeImages: [],
          };
        }).filter((o): o is Offer => o !== null);
        const ofertasAtivas = parsed.filter(o => o.status === 'ATIVO');
        setOffers([...ofertasAtivas].reverse());
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchOffers();
  }, []);

  const checkLogin = async (id: string, silencioso = false) => {
    const cleanId = id.toUpperCase().trim();
    if (!cleanId || cleanId.length < 5) return;
    try {
      const docRef = doc(db, "agentes", cleanId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().ativo === true) {
        setAgentId(cleanId);
        setIsLoggedIn(true);
        localStorage.setItem('agente_token', cleanId);
        const favs = localStorage.getItem(getFavKey(cleanId));
        if (favs) setFavorites(JSON.parse(favs));
      } else {
        if (!silencioso) alert('ACESSO NEGADO ❌\nCredencial não encontrada ou inativa na base.');
        if (silencioso) handleLogout();
      }
    } catch (e) { console.error(e); }
  };

  const handleLogin = () => {
    const inputId = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE:");
    if (inputId) checkLogin(inputId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); setFavorites([]);
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

  if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
  if (showRecover) return <RecuperarID onBack={() => setShowRecover(false)} />;

  const SidebarContent = () => (
    <div className="p-8 md:p-10 h-full flex flex-col bg-[#121212] border-r border-white/5">
      <div className="flex items-center space-x-3 mb-12 px-2">
        <div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10"><Eye className="text-black" size={24} /></div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
      </div>
      <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
        <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => {setCurrentPage('home'); setSelectedOffer(null);}} />
        <SidebarItem icon={Star} label="SEUS FAVORITOS" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setSelectedOffer(null);}} />
        <SidebarItem icon={Settings} label="PAINEL DO AGENTE" active={currentPage === 'settings'} onClick={() => {setCurrentPage('settings'); setSelectedOffer(null);}} />
        <div className="pt-8 pb-4"><p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
          <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers'} onClick={() => {setCurrentPage('offers'); setSelectedOffer(null);}} />
        </div>
      </nav>
      <div className="mt-8 space-y-3">
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5"><p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Operador Ativo</p><p className="text-[#D4AF37] font-mono text-[10px] font-black truncate">{agentId}</p></div>
        <SidebarItem icon={LogOut} label="Sair" active={false} onClick={handleLogout} variant="danger" />
      </div>
    </div>
  );

  const filtered = applyEliteFilters(offers);

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
                  <input type="text" placeholder="Pesquisar inteligência..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs md:text-sm w-full font-bold placeholder:text-gray-700" />
                </div>
              </div>
              {showFilters && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500 flex flex-wrap items-center gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {[{ label: 'Nicho', value: selectedNiche, setter: setSelectedNiche, options: ['Todos', ...allNiches] }, { label: 'Tipo', value: selectedType, setter: setSelectedType, options: ['Todos', ...allTypes] }, { label: 'Idioma', value: selectedLanguage, setter: setSelectedLanguage, options: ['Todos', ...allLanguages] }].map((f, i) => (
                    <div key={i} className="flex-1 lg:flex-none flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[9px] font-black uppercase text-gray-600 px-1 italic">{f.label}</label>
                      <select value={f.value} onChange={(e) => f.setter(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-[10px] md:text-[11px] font-black uppercase text-white outline-none hover:border-[#D4AF37] cursor-pointer transition-all">{f.options.map(n => <option key={n} value={n}>{n}</option>)}</select>
                    </div>
                  ))}
                </div>
              )}
            </header>
            <div className="p-4 md:p-10 max-w-[1600px] mx-auto min-h-screen pb-32">
              {loading ? <div className="flex flex-col items-center justify-center py-40 gap-4 animate-pulse"><Loader2 className="text-[#D4AF37] animate-spin" size={48} /><p className="text-[#D4AF37] font-black uppercase text-xs tracking-widest italic">Interceptando pacotes de dados...</p></div> : 
               selectedOffer ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs tracking-widest mb-8"><ArrowLeft size={16} className="mr-2"/> VOLTAR</button>
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-[65%] space-y-6">
                      <div className="bg-[#121212] p-4 md:p-6 rounded-[32px] border border-white/5 shadow-2xl overflow-hidden h-full flex flex-col">
                        <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 relative z-10 flex-1 shadow-2xl"><VideoPlayer url={selectedOffer.vslLinks[0]?.url} title="VSL Player" /></div>
                        <div className="mt-6 p-6 bg-[#1a1a1a] rounded-3xl border border-white/5"><h3 className="text-[#D4AF37] font-black text-xs uppercase mb-4 tracking-widest">Análise Tática</h3><p className="text-gray-400 font-medium italic leading-relaxed">{selectedOffer.description || "Descrição em processamento."}</p></div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[35%] space-y-6">
                      <div className="bg-[#121212] p-8 rounded-[32px] border border-white/5 shadow-2xl h-full flex flex-col space-y-6">
                        <h3 className="text-[#D4AF37] font-black uppercase text-xs tracking-widest border-l-2 border-[#D4AF37] pl-4">Dossiê da Operação</h3>
                        <div className="space-y-4">{[{label: 'Nicho', val: selectedOffer.niche}, {label: 'Tipo', val: selectedOffer.productType}, {label: 'Fonte', val: selectedOffer.trafficSource[0]}].map((i, k) => (<div key={k} className="border-b border-white/5 pb-2"><p className="text-[9px] font-black uppercase text-gray-600">{i.label}</p><p className="text-white font-black italic uppercase">{i.val}</p></div>))}</div>
                        <a href={selectedOffer.pageUrl} target="_blank" className="w-full py-4 btn-elite rounded-xl text-center text-sm font-black italic uppercase">Visualizar Página</a>
                        <a href={selectedOffer.facebookUrl} target="_blank" className="w-full py-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-center text-xs font-black text-gray-400 hover:text-white transition-all uppercase italic">Ads Library</a>
                      </div>
                    </div>
                  </div>
                </div>
               ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-700">
                  {filtered.map((o) => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e:any) => toggleFavorite(o.id, e)} onClick={() => {setSelectedOffer(o); window.scrollTo({ top: 0, behavior: 'smooth' });}} />)}
                </div>
               )
              }
            </div>
          </main>
        </>
      ) : (
        <LandingPage onLogin={handleLogin} onRecover={() => setShowRecover(true)} onAdmin={() => setShowAdmin(true)} isSuccess={isSuccess} agentId={newlyGeneratedId} onDismissSuccess={dismissSuccess} />
      )}
    </div>
  );
};

export default App;
