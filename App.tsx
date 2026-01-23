import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

// --- CONFIGURAÇÃO ---
const firebaseConfig = { apiKey: "AIzaSyAF94806dAwkSvPJSVHglfYMm9vE1Rnei4", authDomain: "swiper-db-21c6f.firebaseapp.com", projectId: "swiper-db-21c6f", storageBucket: "swiper-db-21c6f.firebasestorage.app", messagingSenderId: "235296129520", appId: "1:235296129520:web:612a9c5444064ce5b11d35", measurementId: "G-SGQY0W9CWC" };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const KIWIFY_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const KIWIFY_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';
const SUPPORT_EMAIL = 'suporte@007swiper.com';

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; --brand-card: #121212; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

// --- TYPES ---
export interface Offer { id: string; title: string; niche: string; language: string; trafficSource: string[]; productType: string; description: string; vslLinks: {label:string; url:string}[]; vslDownloadUrl: string; trend: string; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; status: string; addedDate: string; }

// --- UTILS & COMPONENTS ---
const getDriveDirectLink = (url: string) => { if (!url) return ''; const trimmed = url.trim(); if (trimmed.includes('drive.google.com')) { const idMatch = trimmed.match(/[-\w]{25,}/); if (idMatch) return `https://lh3.googleusercontent.com/u/0/d/${idMatch[0]}`; } return trimmed; };
const getEmbedUrl = (url: string) => { if (!url) return ''; const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/); return ytId ? `https://www.youtube.com/embed/${ytId[1]}` : url; };

const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black">{label}</span></button>
);

const OfferCard = ({ offer, isFavorite, onToggleFavorite, onClick }: any) => {
  const isEscalando = offer.trend.trim().toLowerCase() === 'escalando';
  return (
    <div onClick={onClick} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
      <div className="relative aspect-video overflow-hidden">
        <img src={getDriveDirectLink(offer.coverImage)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <div className={`px-2.5 py-1 text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl ${isEscalando ? 'bg-green-600 text-white' : 'bg-[#D4AF37] text-black animate-pulse'}`}><Clock size={10} /> {isEscalando ? 'ESCALANDO' : 'ADICIONADO HOJE'}</div>
        </div>
        <div className="absolute top-3 right-3"><button onClick={onToggleFavorite} className={`p-2.5 rounded-xl backdrop-blur-xl transition-all duration-300 ${isFavorite ? 'bg-[#D4AF37] text-black scale-110' : 'bg-[#D4AF37]/20 text-white hover:bg-[#D4AF37] hover:text-black'}`}><Star size={18} fill={isFavorite ? "currentColor" : "none"} /></button></div>
        <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase shadow-lg">{offer.niche}</div></div>
      </div>
      <div className="p-5">
        <h3 className="font-black text-white mb-4 line-clamp-1 text-lg tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors italic">{offer.title}</h3>
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2"><Target size={14} className="text-[#D4AF37]" /><span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span></div>
        </div>
      </div>
    </div>
  );
};

// --- TELAS SECUNDÁRIAS ---
const RecuperarID = ({ onBack }: any) => {
  const [email, setEmail] = useState(''); const [res, setRes] = useState<string|null>(null);
  const buscar = async (e:any) => { e.preventDefault(); const q = query(collection(db, "agentes"), where("email", "==", email.trim())); const s = await getDocs(q); if(s.empty) alert('E-mail não encontrado.'); else setRes(s.docs[0].id); };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6"><button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] font-black uppercase text-xs flex gap-2"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full bg-[#121212] border border-zinc-800 p-10 rounded-[32px]"><h2 className="text-2xl font-black text-[#D4AF37] italic uppercase mb-6 text-center">Recuperar Acesso</h2>
      <form onSubmit={buscar} className="space-y-4"><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#D4AF37]" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required /><button className="w-full btn-elite py-4 rounded-xl italic">CONSULTAR</button></form>
      {res && <div className="mt-6 p-4 bg-black border border-[#D4AF37] rounded-xl text-center"><p className="text-xs text-gray-500 uppercase">SEU ID:</p><p className="text-2xl font-black text-white">{res}</p></div>}</div>
    </div>
  );
};

const PainelAdmin = ({ onBack }: any) => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { getDocs(query(collection(db, "agentes"), orderBy("data_ativacao", "desc"))).then(s => setList(s.docs.map(d => ({id: d.id, ...d.data()})))) }, []);
  return (
    <div className="min-h-screen bg-black text-white p-10"><button onClick={onBack} className="mb-8 text-[#D4AF37] font-black uppercase text-xs">Sair</button><h1 className="text-3xl font-black mb-8 italic uppercase text-center">Base <span className="text-[#D4AF37]">Agentes</span></h1>
      <div className="max-w-4xl mx-auto border border-zinc-800 rounded-2xl bg-[#121212] overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-zinc-900 text-[10px] uppercase text-zinc-500"><tr><th className="p-4">ID</th><th className="p-4">Email</th><th className="p-4">Status</th></tr></thead><tbody>{list.map(a => <tr key={a.id} className="border-b border-white/5"><td className="p-4 text-[#D4AF37] font-mono font-bold">{a.id}</td><td className="p-4">{a.email}</td><td className="p-4 text-green-500 font-bold">ATIVO</td></tr>)}</tbody></table></div>
    </div>
  );
};

const LandingPage = ({ onLogin, onRecover, onAdmin, isSuccess, agentId, onDismissSuccess }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  {isSuccess && <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"><div className="bg-[#121212] border-2 border-[#D4AF37] p-10 rounded-[40px] text-center"><h2 className="text-[#D4AF37] text-3xl font-black italic uppercase mb-4">ACESSO LIBERADO!</h2><p className="text-white text-4xl font-black mb-8">{agentId}</p><button onClick={onDismissSuccess} className="btn-elite px-10 py-4 rounded-xl italic">ENTRAR AGORA</button></div></div>}
  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center z-50">
   <div className="flex items-center gap-3"><div className="bg-[#D4AF37] p-2 rounded-xl rotate-3"><Eye className="text-black" size={24}/></div><span className="text-2xl font-black italic text-white tracking-tighter">007 SWIPER</span></div>
   <div className="flex gap-6"><button onClick={onRecover} className="text-gray-500 hover:text-[#D4AF37] text-[10px] font-black uppercase italic tracking-widest">Recuperar ID</button><button onClick={onLogin} className="px-6 py-2.5 bg-[#D4AF37] text-black font-black rounded-full uppercase text-xs italic"><Lock size={14} className="inline mr-2"/> Entrar</button></div>
  </nav>
  <main className="w-full max-w-7xl px-8 flex flex-col items-center text-center mt-12 mb-32 italic">
   <h1 className="text-4xl md:text-8xl font-black text-white mb-10 leading-none uppercase">ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
   <p className="text-gray-400 text-xl max-w-4xl mb-20">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões.</p>
   <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 flex items-center justify-center mb-32"><Play size={64} className="text-[#D4AF37]"/></section>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-40 text-left">
    <div className="bg-[#121212] border border-white/5 rounded-[40px] p-12"><h3 className="text-[#D4AF37] font-black text-xl mb-4">PLANO MENSAL</h3><p className="text-5xl font-black text-white mb-10">R$ 197</p><button onClick={() => window.open(KIWIFY_MENSAL)} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all">QUERO ACESSO MENSAL</button></div>
    <div className="bg-white text-black rounded-[40px] p-12 border-t-8 border-[#D4AF37] shadow-2xl"><h3 className="text-[#D4AF37] font-black text-xl mb-4">PLANO TRIMESTRAL</h3><p className="text-5xl font-black mb-10">R$ 497</p><button onClick={() => window.open(KIWIFY_TRIMESTRAL)} className="w-full py-5 bg-black text-[#D4AF37] font-black text-xl rounded-2xl animate-btn-pulse">ASSINAR TRIMESTRAL</button></div>
   </div>
   <div className="w-full max-w-5xl mx-auto mb-40 border border-[#D4AF37]/30 rounded-[40px] p-16 flex items-center gap-12 bg-zinc-950"><div className="text-6xl font-black text-[#D4AF37] border-4 border-[#D4AF37] p-10 rounded-full">7</div><div className="text-left"><h2 className="text-white text-4xl font-black italic mb-4">GARANTIA DE 7 DIAS</h2><p className="text-gray-400 text-lg">Risco zero. Se não gostar, devolvemos seu dinheiro.</p></div></div>
   <footer className="w-full pt-12 pb-20 border-t border-white/5"><p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">© 2026 007 SWIPER Intelligence Group</p><div onDoubleClick={onAdmin} className="h-10 opacity-0 cursor-default">.</div></footer>
  </main>
 </div>
);

// --- APP PRINCIPAL ---
const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 // Filtros
 const [selectedNiche, setSelectedNiche] = useState('Todos');
 const [selectedType, setSelectedType] = useState('Todos');
 const [selectedLang, setSelectedLang] = useState('Todos');
 const [selectedTraffic, setSelectedTraffic] = useState('Todos');
 // Modais
 const [showRecover, setShowRecover] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 useEffect(() => {
  const saved = localStorage.getItem('agente_token');
  if (saved) checkLogin(saved, true);
  fetch(CSV_URL).then(r => r.text()).then(text => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const parsed = lines.slice(2).map((l, i) => {
      const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
      if (!v[1]) return null;
      return { id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4], coverImage: v[5], vslLinks: [{url:v[8], label:'VSL'}], pageUrl: v[14], facebookUrl: v[13], status: v[19]?.toUpperCase(), trafficSource: [v[16]], creativeEmbedUrls: (v[11] || '').split(',').filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').filter(Boolean) } as Offer;
    }).filter((o): o is Offer => o !== null && o.status === 'ATIVO');
    setOffers(parsed.reverse());
    setLoading(false);
  });
 }, []);

 const checkLogin = async (id: string, sil = false) => {
  const cleanId = id.toUpperCase().trim();
  if (cleanId.length < 5) return;
  const docRef = doc(db, "agentes", cleanId);
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().ativo) { setAgentId(cleanId); setIsLoggedIn(true); localStorage.setItem('agente_token', cleanId); }
  else if (!sil) alert("ACESSO NEGADO ❌");
 };

 const handleLogin = () => { const id = window.prompt("ID DO AGENTE:"); if (id) checkLogin(id); };
 const toggleFavorite = (id: string) => setFavorites(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

 // Lógica de Filtros
 const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
 const filtered = offers.filter(o => {
   const matchSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase());
   const matchNiche = selectedNiche === 'Todos' || o.niche === selectedNiche;
   return matchSearch && matchNiche;
 });

 // Renderização Condicional
 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecover) return <RecuperarID onBack={() => setShowRecover(false)} />;
 if (!isLoggedIn) return <LandingPage onLogin={handleLogin} onRecover={() => setShowRecover(true)} onAdmin={() => setShowAdmin(true)} />;

 // Conteúdo Interno (Dashboard)
 return (
  <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   <aside className={`w-72 bg-[#121212] border-r border-white/5 flex flex-col fixed h-screen z-50 transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
    <div className="p-8"><div className="flex items-center gap-3 mb-12"><Eye className="text-[#D4AF37]" size={24}/><span className="font-black italic text-xl">007 SWIPER</span></div>
    <nav className="space-y-2">
     <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home'} onClick={() => setCurrentPage('home')} />
     <SidebarItem icon={Star} label="Favoritos" active={currentPage === 'favorites'} onClick={() => setCurrentPage('favorites')} />
     <div className="pt-8 pb-2"><p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4 mb-2">Módulos VIP</p>
      <SidebarItem icon={Tag} label="Ofertas" active={currentPage === 'offers'} onClick={() => setCurrentPage('offers')} />
     </div>
    </nav></div>
    <div className="mt-auto p-8 border-t border-white/5"><SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} variant="danger"/></div>
   </aside>
   <main className="flex-1 lg:ml-72 relative w-full bg-black min-h-screen">
    <header className="p-8 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-40">
     <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-black italic uppercase">Radar de <span className="text-[#D4AF37]">Inteligência</span></h1><div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-full border border-white/5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-[10px] font-black uppercase text-zinc-400">Agente: {agentId}</span></div><button className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu/></button></div>
      {/* BARRA DE BUSCA E FILTROS (LARGURA IGUAL) - SÓ EM OFERTAS */}
      {currentPage === 'offers' && !selectedOffer && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1 w-full"><label className="text-[9px] font-black uppercase text-zinc-500 ml-1">Buscar</label><div className="relative"><input type="text" placeholder="Pesquisar..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-[11px] font-black text-white outline-none focus:border-[#D4AF37]"/><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14}/></div></div>
          {[{l:'Nicho',v:selectedNiche,s:setSelectedNiche,o:allNiches}].map((f,i)=>(<div key={i} className="flex flex-col gap-1 w-full"><label className="text-[9px] font-black uppercase text-zinc-500 ml-1">{f.l}</label><select value={f.v} onChange={e=>f.s(e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-black text-white outline-none focus:border-[#D4AF37] cursor-pointer"><option value="Todos">Todos</option>{f.o.map(x=><option key={x} value={x}>{x}</option>)}</select></div>))}
          {/* Adicionei placeholders para os outros filtros manterem a grid de 5 colunas visualmente, se quiser reativá-los basta duplicar a lógica acima */}
          <div className="hidden md:block"></div><div className="hidden md:block"></div><div className="hidden md:block"></div>
        </div>
      )}
     </div>
    </header>
    <div className="p-8 pb-32">
     {loading ? <div className="text-center py-20 animate-pulse text-[#D4AF37] font-black uppercase italic">Carregando dados...</div> : selectedOffer ? (
      <div className="space-y-8 animate-in fade-in">
       <button onClick={()=>setSelectedOffer(null)} className="flex items-center text-zinc-500 hover:text-white font-black uppercase text-xs gap-2"><ArrowLeft size={16}/> Voltar</button>
       <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[65%] space-y-6"><div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"><iframe src={getEmbedUrl(selectedOffer.vslLinks[0].url)} className="w-full h-full" frameBorder="0" allowFullScreen></iframe></div><div className="bg-[#121212] p-8 rounded-3xl border border-white/5"><h3 className="text-[#D4AF37] font-black uppercase text-xs mb-4">Análise</h3><p className="text-zinc-400 italic font-medium">{selectedOffer.description || "Sem descrição."}</p></div></div>
        <div className="lg:w-[35%] bg-[#121212] p-8 rounded-3xl border border-white/5 h-fit space-y-6"><h3 className="text-zinc-500 font-black uppercase text-xs">Dados da Oferta</h3><div className="space-y-4"><div className="border-b border-white/5 pb-2"><p className="text-[9px] uppercase text-zinc-600 font-black">Nicho</p><p className="font-black italic">{selectedOffer.niche}</p></div></div><a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-4 btn-elite rounded-xl text-center font-black text-sm italic">VER PÁGINA</a></div>
       </div>
      </div>
     ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{(currentPage === 'home' || currentPage === 'offers' ? filtered : filtered.filter(o => favorites.includes(o.id))).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e:any)=>{e.stopPropagation(); toggleFavorite(o.id)}} onClick={()=>{setSelectedOffer(o); window.scrollTo({top:0,behavior:'smooth'})}}/>)}</div>
     )}
    </div>
   </main>
  </div>
 );
};

export default App;
