
import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, ShieldAlert, User, HelpCircle
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE REAL (ESTRUTURA TÁTICA) ---
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

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

/** * TYPE DEFINITIONS */
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;
export interface VslLink { label: string; url: string; }
export interface Offer { 
  id: string; title: string; niche: Niche; language: string; trafficSource: string[]; 
  productType: ProductType; description: string; vslLinks: VslLink[]; vslDownloadUrl: string; 
  trend: Trend; facebookUrl: string; pageUrl: string; coverImage: string; views: string; 
  transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; 
  creativeZipUrl: string; addedDate: string; status: string; isFavorite?: boolean; 
}

/** * CONSTANTES */
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const HOTMART_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const HOTMART_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; --brand-card: #121212; --brand-hover: #1a1a1a; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .gold-text { color: var(--brand-gold); }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
 .scrollbar-hide::-webkit-scrollbar { display: none; }
`;

/** * COMPONENTES DE SEGURANÇA (MODALS) */
const RecuperarID = ({ onBack }: any) => {
  const [email, setEmail] = useState('');
  const [res, setRes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim().toLowerCase()));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("E-mail não encontrado no sistema.");
      } else {
        setRes(snap.docs[0].id);
      }
    } catch (err) {
      alert("Erro na consulta do banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 italic">
      <div className="max-w-md w-full bg-[#121212] border-2 border-[#D4AF37]/30 p-10 rounded-[40px] shadow-2xl relative">
        <button onClick={onBack} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors font-black uppercase text-[10px]">Fechar</button>
        <HelpCircle className="text-[#D4AF37] mb-6" size={48} />
        <h2 className="text-white font-black uppercase text-2xl mb-4 italic">Recuperar Credencial</h2>
        <p className="text-zinc-500 text-sm mb-8 italic">Digite seu e-mail de compra para consultarmos o servidor.</p>
        
        {!res ? (
          <form onSubmit={handleRecuperar} className="space-y-6">
            <input 
              type="email" 
              placeholder="E-MAIL DE COMPRA..." 
              className="w-full bg-black border border-white/5 p-4 rounded-xl outline-none focus:border-[#D4AF37] text-white font-bold"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <button className="w-full py-4 btn-elite rounded-xl italic flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "CONSULTAR STATUS"}
            </button>
          </form>
        ) : (
          <div className="mt-8 p-6 bg-black border border-[#D4AF37] rounded-3xl text-center">
            <p className="text-zinc-500 text-[10px] uppercase mb-2 font-black">SUA CREDENCIAL ATIVA:</p>
            <p className="text-3xl font-black text-white">{res}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPanel = ({ onBack }: any) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "agentes")).then(snap => {
      setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col p-10 overflow-y-auto italic">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <ShieldAlert className="text-[#D4AF37]" size={32} />
          <h2 className="text-white font-black text-3xl uppercase italic">Terminal Comando Admin</h2>
        </div>
        <button onClick={onBack} className="text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 rounded-full font-black uppercase text-xs italic">Encerrar Sessão</button>
      </div>
      
      {loading ? <Loader2 className="animate-spin text-[#D4AF37] mx-auto mt-20" size={48} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentes.map(a => (
            <div key={a.id} className="bg-[#121212] p-6 rounded-3xl border border-white/5 space-y-4">
              <p className="text-[#D4AF37] font-black text-xs uppercase">{a.id}</p>
              <p className="text-white font-bold text-sm truncate">{a.email}</p>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${a.ativo ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {a.ativo ? 'AGENTE ATIVO' : 'SESSÃO REVOGADA'}
                </span>
                <span className="text-zinc-700 text-[9px] font-black uppercase">Plan: VIP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** * UTILITÁRIOS */
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

/** * UI COMPONENTS (SIDEBAR FIXA w-72) */
const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button 
   onClick={onClick} 
   className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${
     active 
      ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' 
      : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
   }`}
 >
   <Icon size={20} />
   <span className="text-sm uppercase tracking-tighter font-black italic">{label}</span>
 </button>
);

const OfferCard = ({ offer, isFavorite, onToggleFavorite, onClick }: any) => {
  const getBadgeInfo = () => {
    if (!offer.addedDate) return { text: "OFERTA VIP", isNew: false };
    const dataOferta = new Date(offer.addedDate + 'T00:00:00'); 
    const hoje = new Date();
    const diffDias = Math.floor((hoje.getTime() - dataOferta.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias <= 0) return { text: "ADICIONADO: HOJE", isNew: true };
    return { text: `ADICIONADO: HÁ ${diffDias} DIAS`, isNew: diffDias < 7 };
  };
  const badge = getBadgeInfo();

  return (
    <div onClick={onClick} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl italic">
      <div className="relative aspect-video overflow-hidden">
        <img src={offer.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-2xl ${badge.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}>
            <Clock size={10} /> {badge.text}
          </div>
          {offer.trend && offer.trend.toLowerCase() === 'escalando' && (
            <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={onToggleFavorite} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all ${isFavorite ? 'bg-[#D4AF37] text-black' : 'bg-black/50 text-white hover:bg-[#D4AF37] hover:text-black'}`}>
            <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase shadow-lg">{offer.niche}</div>
      </div>
      <div className="p-5">
        <h3 className="font-black text-white mb-4 line-clamp-1 text-lg uppercase group-hover:text-[#D4AF37] transition-colors italic leading-none tracking-tighter">{offer.title}</h3>
        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
          <span>{offer.productType}</span>
          <div className="flex items-center gap-2"><Facebook size={12} className="text-blue-500" /> SOURCE</div>
        </div>
      </div>
    </div>
  );
};

/** * LANDING PAGE (RESTAURADA) */
const LandingPage = ({ onLogin, onRecuperar, onAdmin }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center italic">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center z-50">
   <div className="flex items-center space-x-3">
    <div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl"><Eye className="text-black" size={28} /></div>
    <span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
   </div>
   <div className="flex items-center gap-6">
    <button onClick={onRecuperar} className="text-gray-500 hover:text-white text-[10px] font-black uppercase italic tracking-widest hidden md:block">Recuperar ID</button>
    <button onClick={() => onLogin()} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs italic tracking-tighter">
      <Lock size={14} className="inline mr-2" /> Acesso Agente
    </button>
   </div>
  </nav>
  
  <main className="w-full max-w-7xl px-8 flex flex-col items-center text-center mt-12 mb-32 italic">
   <h1 className="text-4xl md:text-8xl font-black text-white mb-10 leading-none uppercase tracking-tighter max-w-6xl">
     ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span>
   </h1>
   <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões. O fim do "achismo" na sua escala digital.</p>
   
   <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[40px] border border-white/10 flex flex-col items-center justify-center mb-32 relative overflow-hidden group">
    <div className="z-10 bg-[#D4AF37] p-8 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.4)] mb-6 cursor-pointer group-hover:scale-110 transition-all duration-500">
      <Play size={48} fill="black" className="text-black ml-1" />
    </div>
    <p className="z-10 text-white font-black uppercase text-xs tracking-widest italic">Veja por dentro do nosso arsenal tático</p>
    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
   </section>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-40 text-left items-stretch">
    <div className="bg-[#121212] border border-white/5 rounded-[50px] p-12 flex flex-col shadow-2xl">
      <h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1 tracking-tight">PLANO MENSAL</h3>
      <div className="flex items-baseline gap-2 mb-10"><span className="text-6xl font-black text-white">R$ 197</span><span className="text-zinc-500 font-bold uppercase text-xs">/mês</span></div>
      <ul className="space-y-4 mb-12 flex-1">
        {['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 'Transcrições de VSL', 'Radar de Tendências'].map((it, i) => <li key={i} className="flex items-center gap-3 text-zinc-400 font-bold uppercase text-[10px] tracking-widest"><CheckCircle size={16} className="text-[#D4AF37]" /> {it}</li>)}
      </ul>
      <button onClick={() => window.open(HOTMART_MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-black text-xl rounded-3xl hover:scale-105 transition-all uppercase tracking-tighter">QUERO ACESSO MENSAL</button>
    </div>
    <div className="bg-white text-black rounded-[50px] p-12 flex flex-col scale-105 border-t-[10px] border-[#D4AF37] shadow-2xl relative">
      <div className="absolute -top-5 right-10 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">POUPE R$ 94</div>
      <h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1 tracking-tight">PLANO TRIMESTRAL</h3>
      <div className="flex items-baseline gap-2 mb-10"><span className="text-6xl font-black">R$ 497</span><span className="text-zinc-400 font-bold uppercase text-xs">/trimestre</span></div>
      <ul className="space-y-4 mb-12 flex-1">
        {['Arsenal VIP Completo', 'Download de Criativos', 'Acesso à Comunidade', 'Radar Global 24h', 'Suporte Agente Black'].map((it, i) => <li key={i} className="flex items-center gap-3 text-zinc-800 font-bold uppercase text-[10px] tracking-widest"><CheckCircle size={16} className="text-[#D4AF37]" /> {it}</li>)}
      </ul>
      <button onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')} className="w-full py-5 bg-black text-[#D4AF37] font-black text-xl rounded-3xl animate-btn-pulse uppercase tracking-tighter">ASSINAR TRIMESTRAL</button>
    </div>
   </div>

   <div className="w-full max-w-5xl mx-auto mb-40 border border-[#D4AF37]/30 rounded-[50px] p-16 flex flex-col md:flex-row items-center gap-12 text-left bg-zinc-950 shadow-2xl">
    <div className="w-40 h-40 rounded-full border-8 border-[#D4AF37] flex flex-col items-center justify-center text-[#D4AF37] shrink-0">
      <span className="text-7xl font-black leading-none">7</span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] -mt-1">DIAS</span>
    </div>
    <div className="space-y-4 flex-1">
      <h2 className="text-white text-4xl font-black uppercase italic tracking-tighter leading-none">GARANTIA INCONDICIONAL <br/> <span className="text-[#D4AF37]">RISCO ZERO</span></h2>
      <p className="text-zinc-400 text-xl leading-relaxed">Você tem 7 dias para explorar todo o arsenal. Se não sentir que o conteúdo vale 10x o valor investido, devolvemos 100% do seu dinheiro sem perguntas.</p>
      <button onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')} className="btn-elite px-10 py-5 rounded-2xl italic tracking-tighter font-black text-xl mt-4 uppercase">[ COMEÇAR AGORA &gt;&gt; ]</button>
    </div>
   </div>

   <footer className="w-full pt-12 pb-20 border-t border-white/5 text-center">
    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] italic mb-4">© 2024 007 SWIPER Intelligence Group. Todos os direitos reservados.</p>
    <div onDoubleClick={onAdmin} className="h-20 w-full opacity-0 cursor-default absolute bottom-0">.</div>
   </footer>
  </main>
 </div>
);

/** * MAIN APP */
const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');

 // DATA FETCHING
 useEffect(() => {
  const saved = localStorage.getItem('agente_token');
  if (saved) checkLogin(saved, true);
  
  fetch(CSV_URL).then(r => r.text()).then(text => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const parsed = lines.slice(2).map((l, i) => {
      const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
      if (!v[1]) return null;
      return { 
        id: v[0] || String(i), title: v[1], niche: v[2], productType: v[3], description: v[4], coverImage: v[5], 
        trend: v[6] || 'Estável', vslLinks: [{url:v[8], label:'VSL PRINCIPAL'}], 
        pageUrl: v[14], facebookUrl: v[13], status: v[19]?.toUpperCase(), 
        trafficSource: v[16]?.split(',') || [], transcriptionUrl: v[10], vslDownloadUrl: v[9],
        creativeEmbedUrls: v[11]?.split(',') || [], creativeDownloadUrls: v[12]?.split(',') || []
      } as Offer;
    }).filter((o): o is Offer => o !== null && o.status === 'ATIVO');
    setOffers(parsed.reverse());
    setLoading(false);
  });
 }, []);

 const checkLogin = async (id: string, silent = false) => {
  const cleanId = id.toUpperCase().trim();
  if (cleanId.length < 5) return;
  try {
    // LOGIN REAL VIA FIREBASE (swiper-db-21c6f)
    const docRef = doc(db, "agentes", cleanId);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().ativo === true) {
      setAgentId(cleanId);
      setIsLoggedIn(true);
      localStorage.setItem('agente_token', cleanId);
      const favs = localStorage.getItem(`favs_${cleanId}`);
      if (favs) setFavorites(JSON.parse(favs));
    } else if (!silent) {
      alert("ACESSO NEGADO ❌\nCredencial não encontrada ou inativa no banco de dados.");
    }
  } catch (err) {
    if (!silent) alert("ERRO DE CONEXÃO 📡");
  }
 };

 const handleLogin = () => {
  const id = window.prompt("🕵️ CENTRAL DE INTELIGÊNCIA\nDigite seu ID do AGENTE (AGENTE-XXXX):");
  if (id) checkLogin(id);
 };

 const toggleFavorite = (id: string, e?: any) => {
   if (e) e.stopPropagation();
   setFavorites(prev => {
     const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
     localStorage.setItem(`favs_${agentId}`, JSON.stringify(next));
     return next;
   });
 };

 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;
 if (showAdmin) return <AdminPanel onBack={() => setShowAdmin(false)} />;

 return (
  <div className="min-h-screen bg-[#0a0a0a] text-white italic selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {!isLoggedIn ? (
    <LandingPage onLogin={handleLogin} onRecuperar={() => setShowRecuperar(true)} onAdmin={() => setShowAdmin(true)} />
   ) : (
    <div className="flex">
     {/* SIDEBAR FIXA w-72 (BACKUP DESIGN) */}
     <aside className="w-72 bg-[#121212] border-r border-white/5 h-screen sticky top-0 p-10 flex flex-col shrink-0">
      <div className="flex items-center space-x-3 mb-16 cursor-pointer" onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}}>
        <div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={24} /></div>
        <span className="text-xl font-black tracking-tighter uppercase italic leading-none">007 SWIPER</span>
      </div>
      <nav className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
       <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home' && !selectedOffer} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
       <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setSelectedOffer(null)}} />
       
       <div className="pt-10 pb-4">
         <p className="px-5 text-[10px] font-black uppercase text-gray-600 mb-4 italic tracking-[0.3em]">Módulos VIP</p>
         <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'home' && !selectedOffer} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
         <SidebarItem icon={Video} label="VSL HUB" active={false} onClick={() => {}} />
         <SidebarItem icon={Palette} label="CRIATIVOS" active={false} onClick={() => {}} />
         <SidebarItem icon={Library} label="ADS LIBRARY" active={false} onClick={() => {}} />
       </div>
      </nav>
      <div className="pt-8 border-t border-white/5">
        <SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} variant="danger" />
      </div>
     </aside>

     {/* MAIN CONTENT flex-1 (BACKUP ALIGNMENT) */}
     <main className="flex-1 p-12 bg-[#0a0a0a]">
      <header className="flex justify-between items-center mb-16 italic font-black">
        <div>
          <h1 className="text-3xl uppercase tracking-tighter leading-none">Intelligence <span className="text-[#D4AF37]">Hub</span></h1>
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2"><User size={12} /> ID: {agentId}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" 
            placeholder="RASTREAR OFERTA..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="bg-[#121212] border border-white/5 p-4 pl-12 rounded-2xl w-80 font-black text-xs italic focus:border-[#D4AF37] outline-none shadow-inner" 
          />
        </div>
      </header>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
          <p className="text-[#D4AF37] font-black uppercase text-xs italic">Interceptando Dados...</p>
        </div>
      ) : selectedOffer ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setSelectedOffer(null)} className="flex items-center text-zinc-600 hover:text-[#D4AF37] font-black uppercase text-xs italic group transition-all">
            <div className="bg-[#121212] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all"><ArrowLeft size={16} /></div>
            Voltar ao Arsenal
          </button>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[65%] space-y-10">
              <div className="aspect-video bg-black rounded-[40px] border border-white/5 overflow-hidden shadow-2xl shadow-[#D4AF37]/5">
                <iframe className="w-full h-full" src={getEmbedUrl(selectedOffer.vslLinks[0].url)} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
              </div>
              <div className="p-10 bg-[#121212] rounded-[40px] border border-white/5 shadow-2xl">
                <h3 className="text-[#D4AF37] font-black text-xs italic mb-4 uppercase tracking-[0.2em]">Dossiê Técnico da Operação</h3>
                <p className="text-zinc-400 font-medium italic leading-relaxed text-lg whitespace-pre-line">
                  {selectedOffer.description || "Relatório técnico em processamento pelos nossos analistas de campo."}
                </p>
              </div>
            </div>
            
            <div className="lg:w-[35%] bg-[#121212] p-10 rounded-[40px] border border-white/5 h-fit space-y-10 shadow-2xl sticky top-10">
              <h3 className="text-zinc-700 font-black uppercase text-[10px] italic border-l-2 border-[#D4AF37] pl-4">Metadados Estratégicos</h3>
              <div className="space-y-8">
                {[{icon:Tag, label:'Nicho', value:selectedOffer.niche}, {icon:Monitor, label:'Estrutura', value:selectedOffer.productType}, {icon:Globe, label:'Idioma', value:selectedOffer.language}].map((it, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center gap-2 text-zinc-800 text-[9px] font-black italic uppercase mb-2"><it.icon size={12}/> {it.label}</div>
                    <p className="text-white font-black italic uppercase text-lg group-hover:text-[#D4AF37] transition-colors">{it.value}</p>
                  </div>
                ))}
              </div>
              <div className="pt-6 space-y-4">
                <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 btn-elite rounded-2xl text-center text-sm italic font-black">Visualizar Arsenal Completo</a>
                <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full py-5 bg-[#1a1a1a] border border-white/10 rounded-2xl text-center text-xs font-black text-zinc-500 hover:text-white transition-all italic uppercase">Ads Library Analysis</a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
          {offers
            .filter(o => currentPage === 'favorites' ? favorites.includes(o.id) : true)
            .filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(o => (
              <OfferCard 
                key={o.id} 
                offer={o} 
                isFavorite={favorites.includes(o.id)} 
                onToggleFavorite={(e:any) => toggleFavorite(o.id, e)} 
                onClick={() => {setSelectedOffer(o); window.scrollTo(0,0)}} 
              />
            ))}
        </div>
      )}
     </main>
    </div>
   )}
  </div>
 );
};

export default App;
