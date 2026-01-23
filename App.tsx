
import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, ShieldAlert, User, HelpCircle
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE REAL (SWIPER-DB-21C6F) ---
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

/** * COMPONENTES DE SEGURANÇA */
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
        alert("E-mail não encontrado na base de dados 007.");
      } else {
        setRes(snap.docs[0].id);
      }
    } catch (err) {
      alert("Falha na interceptação de dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 italic">
      <div className="max-w-md w-full bg-[#121212] border-2 border-[#D4AF37]/30 p-10 rounded-[40px] shadow-2xl text-center relative">
        <button onClick={onBack} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors uppercase font-black text-[10px]">Fechar</button>
        <div className="bg-[#D4AF37]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/20">
          <HelpCircle className="text-[#D4AF37]" size={40} />
        </div>
        <h2 className="text-[#D4AF37] font-black uppercase text-xl mb-4 italic">Recuperar Credencial</h2>
        <p className="text-zinc-500 text-xs mb-8 uppercase font-bold tracking-widest leading-relaxed">Insira o e-mail utilizado na aquisição da licença Swiper.</p>
        
        {!res ? (
          <form onSubmit={handleRecuperar} className="space-y-4 text-left">
            <label className="text-[10px] font-black uppercase text-zinc-600 ml-1">E-mail Registrado</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-[#D4AF37] text-white font-bold placeholder:text-zinc-800"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <button className="w-full py-5 btn-elite rounded-2xl italic flex items-center justify-center gap-2 mt-4">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "CONSULTAR SERVIDOR"}
            </button>
          </form>
        ) : (
          <div className="mt-8 p-8 bg-black border border-[#D4AF37] rounded-3xl animate-in zoom-in-95">
            <p className="text-zinc-500 text-[10px] uppercase mb-2 font-black">SUA CREDENCIAL ÚNICA:</p>
            <p className="text-3xl font-black text-white selection:bg-[#D4AF37] selection:text-black">{res}</p>
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
    <div className="fixed inset-0 z-[200] bg-black p-10 italic overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
            <ShieldAlert className="text-[#D4AF37]" size={40} />
            <h1 className="text-4xl font-black text-white uppercase italic">Terminal <span className="text-[#D4AF37]">Admin</span></h1>
          </div>
          <button onClick={onBack} className="px-8 py-3 border border-[#D4AF37]/40 text-[#D4AF37] rounded-full text-xs font-black uppercase hover:bg-[#D4AF37] hover:text-black transition-all">Encerrar Comando</button>
        </header>
        
        {loading ? <Loader2 className="animate-spin text-[#D4AF37] mx-auto mt-20" size={48} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agentes.map(a => (
              <div key={a.id} className="bg-[#121212] p-8 rounded-[40px] border border-white/5 space-y-6 shadow-2xl">
                <div className="flex justify-between items-start">
                  <div className="bg-[#D4AF37] text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg">AGENTE 007</div>
                  <div className={`w-3 h-3 rounded-full ${a.ativo ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}></div>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-500 text-[9px] font-black uppercase">Token de Acesso</p>
                  <p className="text-xl font-black text-white truncate">{a.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-500 text-[9px] font-black uppercase">E-mail Vinculado</p>
                  <p className="text-white font-bold text-sm truncate">{a.email}</p>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-zinc-700 text-[9px] font-black uppercase italic">Status: {a.ativo ? 'ATIVO' : 'REVOGADO'}</span>
                  <span className="text-zinc-700 text-[9px] font-black uppercase italic">Membro: VIP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** * UI COMPONENTS (SIDEBAR FIXA w-72) */
const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}>
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
        <img src={offer.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={offer.title} />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-2xl ${badge.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}>
            <Clock size={10} /> {badge.text}
          </div>
          {offer.trend && offer.trend.toLowerCase() === 'escalando' && (
            <div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <button onClick={onToggleFavorite} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all ${isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-black/50 text-white hover:bg-[#D4AF37] hover:text-black'}`}>
            <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase shadow-lg">{offer.niche}</div>
      </div>
      <div className="p-5">
        <h3 className="font-black text-white mb-4 line-clamp-1 text-lg uppercase group-hover:text-[#D4AF37] transition-colors italic leading-none tracking-tighter">{offer.title}</h3>
        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
          <span>{offer.productType}</span>
          <div className="flex items-center gap-2"><Facebook size={12} className="text-blue-500" /> SOURCE</div>
        </div>
      </div>
    </div>
  );
};

/** * LANDING PAGE */
const LandingPage = ({ onLogin, onRecuperar, onAdmin }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center italic">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center z-50">
   <div className="flex items-center space-x-3">
    <div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={28} /></div>
    <span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span>
   </div>
   <div className="flex items-center gap-6">
    <button onClick={onRecuperar} className="text-gray-500 hover:text-white text-[10px] font-black uppercase italic tracking-widest hidden md:block">Recuperar ID</button>
    <button onClick={() => onLogin()} className="px-7 py-3 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs italic tracking-tighter">
      <Lock size={14} className="inline mr-2" /> Acesso Agente
    </button>
   </div>
  </nav>
  
  <main className="w-full max-w-7xl px-8 flex flex-col items-center text-center mt-12 mb-32 italic">
   <h1 className="text-4xl md:text-8xl font-black text-white mb-10 leading-[0.95] uppercase tracking-tighter max-w-6xl">
     ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span>
   </h1>
   <p className="text-zinc-500 text-lg md:text-2xl font-medium max-w-5xl mb-20 leading-relaxed">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões. O fim do "achismo" na sua escala digital.</p>
   
   <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[50px] border border-white/10 flex flex-col items-center justify-center mb-32 relative overflow-hidden group shadow-2xl">
    <div className="z-10 bg-[#D4AF37] p-8 rounded-full shadow-[0_0_60px_rgba(212,175,55,0.4)] mb-6 cursor-pointer group-hover:scale-110 transition-all duration-700">
      <Play size={48} fill="black" className="text-black ml-1" />
    </div>
    <p className="z-10 text-white font-black uppercase text-xs tracking-[0.3em] italic">Dossiê de Demonstração do Arsenal</p>
    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Scanner de Ofertas" />
   </section>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-40 text-left items-stretch">
    <div className="bg-[#121212] border border-white/5 rounded-[50px] p-14 flex flex-col shadow-2xl group hover:border-[#D4AF37]/20 transition-all">
      <h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1 tracking-tight">PLANO MENSAL</h3>
      <div className="flex items-baseline gap-2 mb-10"><span className="text-6xl font-black text-white">R$ 197</span><span className="text-zinc-500 font-bold uppercase text-xs tracking-widest">/mês</span></div>
      <ul className="space-y-4 mb-14 flex-1">
        {['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 'Transcrições de VSL', 'Radar de Tendências'].map((it, i) => (
          <li key={i} className="flex items-center gap-3 text-zinc-400 font-bold uppercase text-[10px] tracking-widest"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {it}</li>
        ))}
      </ul>
      <button onClick={() => window.open(HOTMART_MENSAL, '_blank')} className="w-full py-6 bg-white text-black font-black text-xl rounded-3xl hover:scale-105 transition-all uppercase tracking-tighter shadow-xl">QUERO ACESSO MENSAL</button>
    </div>
    <div className="bg-white text-black rounded-[50px] p-14 flex flex-col scale-105 border-t-[12px] border-[#D4AF37] shadow-2xl relative">
      <div className="absolute -top-6 right-10 bg-[#D4AF37] text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">POUPE R$ 94</div>
      <h3 className="text-[#D4AF37] font-black uppercase text-xl mb-1 tracking-tight">PLANO TRIMESTRAL</h3>
      <div className="flex items-baseline gap-2 mb-10"><span className="text-6xl font-black">R$ 497</span><span className="text-zinc-400 font-bold uppercase text-xs tracking-widest">/trimestre</span></div>
      <ul className="space-y-4 mb-14 flex-1">
        {['Arsenal VIP Completo', 'Download de Criativos', 'Comunidade Agentes', 'Radar Global 24h', 'Suporte Prioritário'].map((it, i) => (
          <li key={i} className="flex items-center gap-3 text-zinc-800 font-bold uppercase text-[10px] tracking-widest"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {it}</li>
        ))}
      </ul>
      <button onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')} className="w-full py-6 bg-black text-[#D4AF37] font-black text-xl rounded-3xl animate-btn-pulse uppercase tracking-tighter shadow-2xl">ASSINAR TRIMESTRAL</button>
    </div>
   </div>

   <div className="w-full max-w-5xl mx-auto mb-40 border border-[#D4AF37]/20 rounded-[60px] p-16 md:p-20 flex flex-col md:flex-row items-center gap-16 text-left bg-zinc-950 shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
    <div className="w-48 h-48 rounded-full border-[10px] border-[#D4AF37] flex flex-col items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
      <span className="text-8xl font-black leading-none">7</span>
      <span className="text-[12px] font-black uppercase tracking-[0.3em] -mt-2">DIAS</span>
    </div>
    <div className="space-y-6 flex-1 relative z-10">
      <h2 className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">GARANTIA INCONDICIONAL <br/> <span className="text-[#D4AF37]">RISCO TOTALMENTE ZERO</span></h2>
      <p className="text-zinc-500 text-xl leading-relaxed italic">Explore todo o arsenal tático. Se em até 7 dias você não sentir que os dados valem 10x o valor investido, devolvemos 100% do seu investimento. Sem burocracia.</p>
      <button onClick={() => window.open(HOTMART_TRIMESTRAL, '_blank')} className="btn-elite px-12 py-6 rounded-3xl italic tracking-tighter font-black text-xl mt-4 uppercase">{'[ COMEÇAR AGORA >> ]'}</button>
    </div>
   </div>

   <footer className="w-full pt-16 pb-24 border-t border-white/5 text-center relative">
    <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] italic mb-4">© 2024 007 SWIPER Intelligence Group. Operações de Elite.</p>
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
    // LOGIN REAL VIA FIREBASE (DOC ID MUST EXIST AND BE ACTIVE)
    const docRef = doc(db, "agentes", cleanId);
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data()?.ativo === true) {
      setAgentId(cleanId);
      setIsLoggedIn(true);
      localStorage.setItem('agente_token', cleanId);
      const favs = localStorage.getItem(`favs_${cleanId}`);
      if (favs) setFavorites(JSON.parse(favs));
    } else if (!silent) {
      alert("ACESSO NEGADO ❌\nCredencial não autorizada ou revogada no servidor.");
    }
  } catch (err) {
    if (!silent) alert("ERRO DE CONEXÃO 📡\nFalha ao interceptar banco de dados.");
  }
 };

 const handleLogin = () => {
  const id = window.prompt("🕵️ CENTRAL DE INTELIGÊNCIA\nIdentifique-se com seu ID de AGENTE:");
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
     {/* SIDEBAR FIXA w-72 */}
     <aside className="w-72 bg-[#121212] border-r border-white/5 h-screen sticky top-0 p-10 flex flex-col shrink-0 z-50">
      <div className="flex items-center space-x-3 mb-20 cursor-pointer" onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}}>
        <div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={24} /></div>
        <span className="text-xl font-black tracking-tighter uppercase italic leading-none">007 SWIPER</span>
      </div>
      <nav className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
       <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home' && !selectedOffer} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
       <SidebarItem icon={Star} label="Meus Favoritos" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setSelectedOffer(null)}} />
       
       <div className="pt-12 pb-4">
         <p className="px-5 text-[10px] font-black uppercase text-zinc-700 mb-6 italic tracking-[0.4em]">Módulos VIP</p>
         <div className="space-y-2">
            <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'home' && !selectedOffer} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
            <SidebarItem icon={Video} label="VSL HUB" active={false} onClick={() => {}} />
            <SidebarItem icon={Palette} label="CRIATIVOS" active={false} onClick={() => {}} />
            <SidebarItem icon={Library} label="ADS LIBRARY" active={false} onClick={() => {}} />
         </div>
       </div>
      </nav>
      <div className="pt-8 border-t border-white/5">
        <SidebarItem icon={LogOut} label="Encerrar Sessão" active={false} onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} variant="danger" />
      </div>
     </aside>

     {/* MAIN CONTENT flex-1 */}
     <main className="flex-1 p-12 bg-[#0a0a0a] min-h-screen">
      <header className="flex justify-between items-start mb-20 italic font-black">
        <div>
          <h1 className="text-4xl uppercase tracking-tighter leading-none">Intelligence <span className="text-[#D4AF37]">Hub</span></h1>
          <div className="flex items-center gap-2 mt-3 bg-[#121212] px-3 py-1.5 rounded-xl border border-white/5 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Agente ID: {agentId}</p>
          </div>
        </div>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="RASTREAR OFERTA OU NICHO..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="bg-[#121212] border border-white/5 p-5 pl-14 rounded-3xl w-96 font-black text-xs italic focus:border-[#D4AF37]/50 focus:bg-[#1a1a1a] outline-none shadow-2xl transition-all placeholder:text-zinc-800" 
          />
        </div>
      </header>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-6 animate-in fade-in">
          <Loader2 className="animate-spin text-[#D4AF37]" size={56} />
          <p className="text-[#D4AF37] font-black uppercase text-xs italic tracking-[0.3em]">Interceptando Pacotes de Dados...</p>
        </div>
      ) : selectedOffer ? (
        <div className="space-y-14 animate-in slide-in-from-bottom-6 duration-700 italic">
          <button onClick={() => setSelectedOffer(null)} className="flex items-center text-zinc-600 hover:text-[#D4AF37] font-black uppercase text-[10px] italic group transition-all tracking-widest">
            <div className="bg-[#121212] p-2.5 rounded-xl mr-4 group-hover:bg-[#D4AF37] group-hover:text-black transition-all border border-white/5"><ArrowLeft size={16} /></div>
            Retornar ao Arsenal
          </button>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-[65%] space-y-12">
              <div className="aspect-video bg-black rounded-[50px] border border-white/5 overflow-hidden shadow-2xl shadow-[#D4AF37]/5 relative">
                <iframe className="w-full h-full" src={selectedOffer.vslLinks[0].url} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
              </div>
              <div className="p-12 bg-[#121212] rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={120} /></div>
                <h3 className="text-[#D4AF37] font-black text-xs italic mb-6 uppercase tracking-[0.4em] border-l-2 border-[#D4AF37] pl-4">Dossiê Técnico da Operação</h3>
                <p className="text-zinc-400 font-medium italic leading-relaxed text-lg whitespace-pre-line relative z-10">
                  {selectedOffer.description || "Relatório técnico em processamento secreto pelos nossos analistas de campo. Dados indisponíveis no momento."}
                </p>
              </div>
            </div>
            
            <div className="lg:w-[35%] bg-[#121212] p-12 rounded-[50px] border border-white/5 h-fit space-y-12 shadow-2xl sticky top-10">
              <h3 className="text-zinc-800 font-black uppercase text-[10px] italic tracking-widest">Metadados de Inteligência</h3>
              <div className="space-y-10">
                {[
                    {icon:Tag, label:'Nicho de Atuação', value:selectedOffer.niche}, 
                    {icon:Monitor, label:'Tipo de Estrutura', value:selectedOffer.productType}, 
                    {icon:Globe, label:'Idioma Operacional', value:selectedOffer.language}
                ].map((it, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex items-center gap-3 text-zinc-800 text-[10px] font-black italic uppercase mb-3"><it.icon size={14}/> {it.label}</div>
                    <p className="text-white font-black italic uppercase text-xl group-hover:text-[#D4AF37] transition-colors tracking-tight">{it.value}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8 space-y-5">
                <a href={selectedOffer.pageUrl} target="_blank" className="flex items-center justify-center gap-3 w-full py-6 btn-elite rounded-3xl text-sm italic font-black shadow-xl">VISUALIZAR ARSENAL <ExternalLink size={18}/></a>
                <a href={selectedOffer.facebookUrl} target="_blank" className="flex items-center justify-center gap-3 w-full py-6 bg-[#1a1a1a] border border-white/10 rounded-3xl text-xs font-black text-zinc-600 hover:text-white transition-all italic uppercase tracking-widest group">BIBLIOTECA DE ADS <Facebook size={18} className="group-hover:text-blue-500 transition-colors"/></a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-40 animate-in fade-in duration-1000">
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
            {offers.length > 0 && offers.filter(o => currentPage === 'favorites' ? favorites.includes(o.id) : true).filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="col-span-full py-40 text-center flex flex-col items-center gap-4">
                    <ZapOff size={40} className="text-zinc-800" />
                    <p className="text-zinc-800 font-black uppercase text-xs italic tracking-widest">Nenhuma inteligência encontrada nos parâmetros atuais.</p>
                </div>
            )}
        </div>
      )}
     </main>
    </div>
   )}
  </div>
 );
};

export default App;
