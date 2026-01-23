import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE OFICIAL RECONECTADA ---
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

/** * TYPE DEFINITIONS */
export type ProductType = string;
export type Niche = string;
export type Trend = 'Em Alta' | 'Escalando' | 'Estável' | string;
export interface VslLink { label: string; url: string; }
export interface Offer { id: string; title: string; niche: Niche; language: string; trafficSource: string[]; productType: ProductType; description: string; vslLinks: VslLink[]; vslDownloadUrl: string; trend: Trend; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeImages: string[]; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; creativeZipUrl: string; addedDate: string; status: string; isFavorite?: boolean; }

// --- COMPONENTES DE SEGURANÇA (RECUPERAR E ADMIN) ---
const RecuperarID = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const buscarID = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
    const snap = await getDocs(q);
    if (snap.empty) alert('E-mail não localizado na base.');
    else setResultado(snap.docs[0].id);
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-in fade-in">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-10 rounded-[40px] shadow-2xl">
        <h2 className="text-2xl font-bold text-[#D4AF37] italic uppercase mb-6 text-center">Recuperar Credencial</h2>
        <form onSubmit={buscarID} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl focus:border-[#D4AF37] outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-bold p-5 rounded-2xl hover:bg-white transition-all uppercase italic">Consultar</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-zinc-900 border border-[#D4AF37] rounded-3xl text-center"><p className="text-xs text-zinc-500 uppercase mb-2">Sua Credencial:</p><p className="text-3xl font-mono font-black text-white">{resultado}</p></div>}
      </div>
    </div>
  );
};

const PainelAdmin = ({ onBack }: { onBack: () => void }) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  useEffect(() => {
    const buscar = async () => {
      const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
      const snap = await getDocs(q);
      setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }; buscar();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white p-10 animate-in fade-in">
      <button onClick={onBack} className="mb-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Sair</button>
      <h1 className="text-3xl font-black mb-10 italic uppercase tracking-tighter">CENTRAL DE <span className="text-[#D4AF37]">CONTROLE</span></h1>
      <div className="max-w-5xl mx-auto overflow-hidden border border-zinc-800 rounded-3xl bg-zinc-950">
        <table className="w-full text-left"><thead className="bg-zinc-900 text-[10px] uppercase text-zinc-500 tracking-widest"><tr><th className="p-6">ID Agente</th><th className="p-6">E-mail</th><th className="p-6">Status</th></tr></thead>
          <tbody className="text-sm italic font-bold">{agentes.map(a => <tr key={a.id} className="border-b border-zinc-900"><td className="p-6 font-mono text-[#D4AF37]">{a.id}</td><td className="p-6">{a.email}</td><td className="p-6 text-green-500">ATIVO</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

/** * CONSTANTS & STYLES */
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const KIWIFY_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const KIWIFY_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; --brand-card: #121212; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .gold-border { border: 1px solid rgba(212, 175, 55, 0.3); }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

/** * UTILS & COMPONENTS */
const getEmbedUrl = (url: string) => {
 if (!url) return '';
 const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
 return ytId ? `https://www.youtube.com/embed/${ytId[1]}` : url;
};

const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black italic">{label}</span></button>
);

const OfferCard = ({ offer, isFavorite, onToggleFavorite, onClick }: any) => {
 const badge = offer.trend === 'Escalando' ? { text: 'ESCALANDO', class: 'bg-green-600' } : { text: 'ADICIONADO HOJE', class: 'bg-[#D4AF37] text-black animate-pulse' };
 return (
  <div onClick={onClick} className="bg-[#121212] rounded-[24px] overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
   <div className="relative aspect-video overflow-hidden">
    <img src={offer.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
     <div className={`px-2.5 py-1 text-[9px] font-black rounded uppercase flex items-center gap-1 shadow-2xl ${badge.class}`}>
      <Clock size={10} /> {badge.text}
     </div>
    </div>
    <div className="absolute top-3 right-3">
     <button onClick={onToggleFavorite} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-[#D4AF37]/20 text-white hover:bg-[#D4AF37] hover:text-black'}`}><Star size={18} fill={isFavorite ? "currentColor" : "none"} /></button>
    </div>
    <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase shadow-lg">{offer.niche}</div></div>
   </div>
   <div className="p-5">
    <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors italic">{offer.title}</h3>
    <div className="flex items-center justify-between border-t border-white/5 pt-4">
     <div className="flex items-center gap-2"><Facebook size={14} className="text-blue-500" /><span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span></div>
    </div>
   </div>
  </div>
 );
};

const LandingPage = ({ onLogin, onRecuperar }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center z-50 mx-auto">
   <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={28} /></div><span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
   <div className="flex items-center gap-6">
    <button onClick={onRecuperar} className="text-gray-500 hover:text-[#D4AF37] text-[10px] font-black uppercase italic tracking-widest transition-all">Recuperar ID</button>
    <button onClick={() => onLogin()} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs italic"><Lock size={14} className="inline mr-2" /> Entrar</button>
   </div>
  </nav>
  <main className="w-full max-w-7xl px-8 flex flex-col items-center text-center mt-12 mb-32 relative mx-auto italic">
   <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em]">Inteligência de Mercado em Tempo Real</div>
   <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic max-w-6xl mx-auto">ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
   <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed text-center px-4 mx-auto">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões. O fim do "achismo" na sua escala digital.</p>
   <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 shadow-2xl relative flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-[#D4AF37]/40 mb-32 mx-auto"><div className="bg-[#D4AF37] p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500 mb-6 flex items-center justify-center"><Play size={40} fill="black" className="text-black ml-1" /></div><p className="text-white font-black uppercase text-[10px] md:text-xs tracking-[0.25em] italic">Descubra como rastreamos ofertas escaladas em tempo real</p></section>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-40 px-4 items-stretch">
    <div className="bg-[#121212] border border-white/5 rounded-[40px] p-12 flex flex-col shadow-2xl"><h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO MENSAL</h3><p className="text-5xl font-black text-white mb-10 italic">R$ 197 <span className="text-sm font-normal text-zinc-500 uppercase">/mês</span></p><button onClick={() => window.open(KIWIFY_MENSAL)} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-xl italic uppercase">QUERO ACESSO MENSAL</button></div>
    <div className="bg-white text-black rounded-[40px] p-12 flex flex-col scale-105 border-t-8 border-[#D4AF37] shadow-[0_0_60px_rgba(212,175,55,0.25)]"><h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1">PLANO TRIMESTRAL</h3><p className="text-5xl font-black mb-10 italic">R$ 497 <span className="text-sm font-normal text-gray-400 uppercase">/tri</span></p><button onClick={() => window.open(KIWIFY_TRIMESTRAL)} className="w-full py-5 bg-black text-[#D4AF37] font-black text-xl rounded-2xl animate-btn-pulse shadow-2xl italic uppercase">ASSINAR TRIMESTRAL</button></div>
   </div>
   <div className="w-full max-w-5xl mx-auto mb-40 border border-[#D4AF37]/30 rounded-[40px] p-16 flex flex-col md:flex-row items-center gap-12 text-left bg-zinc-950 shadow-2xl"><div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-6xl md:text-8xl font-black italic text-[#D4AF37]">7</div><div className="space-y-4 flex-1"><h2 className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter">GARANTIA INCONDICIONAL DE <span className="text-[#D4AF37]">7 DIAS</span></h2><p className="text-gray-400 text-lg md:text-xl font-medium italic leading-relaxed">Se em até 7 dias você não sentir que a plataforma é para você, devolvemos 100% do seu investimento. Sem perguntas. Risco zero.</p></div></div>
   <footer className="w-full pt-12 pb-20 border-t border-white/5 text-center"><p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic text-center">© 2026 007 SWIPER Intelligence Group. Todos os direitos reservados.</p><div onDoubleClick={() => onLogin('admin')} className="h-10 w-full opacity-0 cursor-default">.</div></footer>
  </main>
 </div>
);

const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 useEffect(() => {
  const savedId = localStorage.getItem('agente_token');
  if (savedId) checkLogin(savedId, true);
  fetch(CSV_URL).then(r => r.text()).then(text => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const parsed = lines.slice(2).map((l, i) => {
      const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
      if (!v[1]) return null;
      return { id: v[0] || String(i), title: v[1], niche: v[2], productType: v[3], description: v[4], coverImage: v[5], vslLinks: [{url:v[8], label:'VSL'}], transcriptionUrl: v[10], creativeEmbedUrls: (v[11] || '').split(',').filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').filter(Boolean), facebookUrl: v[13], pageUrl: v[14], status: (v[19] || '').toUpperCase(), trafficSource:[v[16]] } as Offer;
    }).filter((o): o is Offer => o !== null && o.status === 'ATIVO');
    setOffers(parsed.reverse());
    setLoading(false);
  });
 }, []);

 const checkLogin = async (id: string, silencioso = false) => {
  const cleanId = id.toUpperCase().trim();
  if (cleanId.length < 5) return;
  try {
   const docRef = doc(db, "agentes", cleanId);
   const docSnap = await getDoc(docRef);
   if (docSnap.exists() && docSnap.data().ativo === true) {
    setAgentId(cleanId); setIsLoggedIn(true); localStorage.setItem('agente_token', cleanId);
   } else if (!silencioso) alert('ACESSO NEGADO ❌');
  } catch (e) { console.error(e); }
 };

 const handleLogin = (type = 'user') => {
  if (type === 'admin') { setShowAdmin(true); return; }
  const id = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE:");
  if (id) checkLogin(id);
 };

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 const renderContent = () => {
  if (loading) return <div className="py-40 text-center animate-pulse text-[#D4AF37] font-black uppercase italic tracking-widest">Interceptando pacotes de dados...</div>;
  if (selectedOffer) return (
   <div className="animate-in fade-in duration-500 space-y-12">
    <button onClick={() => setSelectedOffer(null)} className="flex items-center text-zinc-600 hover:text-[#D4AF37] font-black uppercase text-xs italic transition-all group"><div className="bg-[#1a1a1a] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all"><ArrowLeft size={16} /></div> Voltar</button>
    <div className="flex flex-col lg:flex-row gap-12 items-stretch italic">
     <div className="w-full lg:w-[65%] space-y-8">
      <div className="bg-[#121212] p-6 rounded-[40px] border border-white/5 shadow-2xl">
       <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/5 shadow-[#D4AF37]/5"><iframe className="w-full h-full" src={getEmbedUrl(selectedOffer.vslLinks[0].url)} frameBorder="0" allowFullScreen></iframe></div>
       <div className="mt-8 p-10 bg-[#1a1a1a] rounded-[40px] border border-white/5 shadow-2xl"><h3 className="text-[#D4AF37] font-black text-xs italic mb-4 border-l-2 border-[#D4AF37] pl-4 uppercase">Dossiê Técnico</h3><p className="text-zinc-400 font-medium leading-relaxed text-lg whitespace-pre-line">{selectedOffer.description || "Descrição técnica em processamento..."}</p></div>
      </div>
     </div>
     <div className="w-full lg:w-[35%] bg-[#121212] p-10 rounded-[40px] border border-white/5 h-fit space-y-10 shadow-2xl">
      <h3 className="text-zinc-700 font-black uppercase text-[10px] italic border-l-2 border-zinc-800 pl-4">Dossiê da Operação</h3>
      {[{icon:Tag, label:'Nicho', value:selectedOffer.niche}, {icon:Lock, label:'Estrutura', value:selectedOffer.productType}, {icon:Globe, label:'Fonte', value:selectedOffer.trafficSource[0]}].map((it, i) => (
       <div key={i} className="border-b border-white/5 pb-6 space-y-2"><div className="flex items-center gap-2 text-zinc-800 text-[9px] font-black uppercase"><it.icon size={12}/> {it.label}</div><p className="text-white font-black uppercase text-base">{it.value}</p></div>
      ))}
      <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 btn-elite rounded-2xl text-center text-sm italic font-black shadow-xl uppercase animate-btn-pulse">Visualizar Página</a>
      <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full py-5 bg-[#1a1a1a] border border-white/10 rounded-2xl text-center text-xs font-black text-zinc-500 hover:text-white transition-all uppercase italic">Ads Library</a>
     </div>
    </div>
    <div className="space-y-8 pt-10 px-2 italic">
       <h3 className="text-white font-black uppercase text-2xl flex items-center gap-4"><ImageIcon className="text-[#D4AF37]" size={28}/> Criativos Infiltrados</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedOffer.creativeEmbedUrls.map((url:any, i:any) => (<div key={i} className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-5 shadow-2xl hover:border-[#D4AF37]/50 transition-all group"><div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"><iframe className="w-full h-full" src={getEmbedUrl(url)} frameBorder="0" allowFullScreen></iframe></div><a href={selectedOffer.creativeDownloadUrls[i]} target="_blank" className="block w-full py-4 bg-[#1a1a1a] border border-[#D4AF37]/20 text-[#D4AF37] rounded-2xl text-center font-black text-[10px] uppercase hover:bg-[#D4AF37] hover:text-black transition-all italic shadow-inner">Baixar Criativo VIP</a></div>))}
       </div>
    </div>
   </div>
  );
  const filtered = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700 pb-40">
    {(currentPage === 'home' ? filtered : filtered.filter(o => favorites.includes(o.id))).map((o) => (
     <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e:any) => {e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id])}} onClick={() => {setSelectedOffer(o); window.scrollTo({ top: 0, behavior: 'smooth' });}} />
    ))}
   </div>
  );
 };

 return (
  <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {!isLoggedIn ? (
    <LandingPage onLogin={handleLogin} onRecuperar={() => setShowRecuperar(true)} />
   ) : (
    <div className="flex h-screen overflow-hidden">
     <aside className="w-72 bg-[#121212] border-r border-white/5 flex flex-col shadow-2xl z-50">
      <div className="p-10"><div className="flex items-center space-x-3 mb-16 cursor-pointer" onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}}><div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10"><Eye className="text-black" size={24} /></div><span className="text-2xl font-black italic uppercase tracking-tighter leading-none">007 SWIPER</span></div>
      <nav className="space-y-3">
       <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home'} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
       <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setSelectedOffer(null)}} />
       <div className="pt-8 pb-4"><p className="px-5 text-[10px] font-black uppercase text-gray-600 mb-4 italic tracking-[0.2em]">Módulos VIP</p>
         <SidebarItem icon={Tag} label="Todas Ofertas" active={currentPage === 'home'} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
       </div>
      </nav></div>
      <div className="mt-auto p-10 border-t border-white/5 bg-[#0a0a0a]/50">
        <div className="bg-[#1a1a1a] p-4 rounded-xl mb-6 border border-white/5 shadow-inner"><p className="text-zinc-600 text-[8px] font-black uppercase mb-1 tracking-widest">ID Operador</p><p className="text-[#D4AF37] font-mono text-[10px] font-black truncate uppercase">{agentId}</p></div>
        <SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} variant="danger" />
      </div>
     </aside>
     <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent relative">
      <header className="flex justify-between items-center mb-16 italic">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Radar de <span className="text-[#D4AF37]">Inteligência</span></h1>
        <div className="relative group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#D4AF37] transition-colors" size={18}/><input type="text" placeholder="RASTREAR OFERTA..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-[#121212] border border-white/5 pl-12 pr-4 py-4 rounded-2xl w-96 font-black text-xs italic focus:border-[#D4AF37] outline-none shadow-inner transition-all placeholder:text-zinc-800" /></div>
      </header>
      {renderContent()}
     </main>
    </div>
   )}
  </div>
 );
};

export default App;
