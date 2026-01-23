import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE OFICIAL (BLOQUEIO TOTAL) ---
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

/** * COMPONENTE RECUPERAR ID (INJETADO NO BACKUP) */
const RecuperarID = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  const buscarID = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(''); setResultado(null);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const snap = await getDocs(q);
      if (snap.empty) setErro('E-mail não localizado na base de dados.');
      else setResultado(snap.docs[0].id);
    } catch (err) { setErro('Erro de comunicação com o servidor.'); }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-in fade-in duration-500">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs hover:scale-105 transition-all">
        <ArrowLeft size={16}/> Voltar
      </button>
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-10 rounded-[40px] shadow-2xl">
        <h2 className="text-2xl font-black text-[#D4AF37] italic uppercase mb-8 text-center tracking-tighter">Recuperar Credencial</h2>
        <form onSubmit={buscarID} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl focus:border-[#D4AF37] outline-none transition-all text-white font-bold" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-black p-5 rounded-2xl hover:bg-white transition-all uppercase italic tracking-widest shadow-xl">Consultar Base de Dados</button>
        </form>
        {resultado && (
          <div className="mt-10 p-8 bg-zinc-900 border border-[#D4AF37] rounded-[32px] text-center shadow-inner animate-bounce">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3">Sua Credencial Privada:</p>
            <p className="text-4xl font-mono font-black text-white selection:bg-[#D4AF37] selection:text-black">{resultado}</p>
          </div>
        )}
        {erro && <p className="mt-6 text-red-500 text-center text-xs font-black uppercase tracking-widest animate-pulse">{erro}</p>}
      </div>
    </div>
  );
};

/** * COMPONENTE ADMIN (INJETADO NO BACKUP) */
const PainelAdmin = ({ onBack }: { onBack: () => void }) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscar = async () => {
      try {
        const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
        const snap = await getDocs(q);
        setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    buscar();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10 animate-in fade-in duration-500 font-sans">
      <button onClick={onBack} className="mb-10 text-zinc-500 hover:text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs transition-all"><ArrowLeft size={16}/> Sair do Comando</button>
      <h1 className="text-4xl font-black mb-12 italic uppercase tracking-tighter text-center">CENTRAL DE <span className="text-[#D4AF37]">INTELIGÊNCIA 007</span></h1>
      {loading ? (
        <div className="flex justify-center py-20 animate-pulse"><Loader2 className="animate-spin text-[#D4AF37]" size={48}/></div>
      ) : (
        <div className="max-w-6xl mx-auto overflow-hidden border border-white/5 rounded-[40px] bg-[#121212] shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-zinc-900/50 text-[10px] uppercase text-zinc-500 tracking-[0.2em]"><tr className="border-b border-white/5"><th className="p-8">Identificação (ID)</th><th className="p-8">E-mail do Operador</th><th className="p-8">Status Operacional</th></tr></thead>
            <tbody className="text-sm">
              {agentes.map(a => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-8 font-mono text-[#D4AF37] font-black text-lg italic">{a.id}</td>
                  <td className="p-8 font-bold text-zinc-300">{a.email}</td>
                  <td className="p-8"><span className="px-3 py-1 bg-green-950/30 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase">Agente Ativo</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/** * DATA TYPES */
export interface Offer {
 id: string; title: string; niche: string; language: string; trafficSource: string[]; productType: string; description: string; vslLinks: {label:string; url:string}[]; vslDownloadUrl: string; trend: string; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; status: string; addedDate: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const KIWIFY_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const KIWIFY_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; }
 body { font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; overflow-x: hidden; }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 ::-webkit-scrollbar { width: 8px; }
 ::-webkit-scrollbar-track { background: #0a0a0a; }
 ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
 ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

const getEmbedUrl = (url: string) => {
 if (!url) return '';
 const vId = url.match(/vimeo\.com\/([0-9]+)/);
 if (vId) return `https://player.vimeo.com/video/${vId[1]}?title=0&byline=0&portrait=0`;
 const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
 if (ytId) return `https://www.youtube.com/embed/${ytId[1]}`;
 return url;
};

const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black italic">{label}</span></button>
);

const LandingPage = ({ onLogin, onRecuperar, isSuccess, agentId, onDismissSuccess }: any) => (
 <div className="w-full bg-[#0a0a0a] flex flex-col items-center selection:bg-[#D4AF37] selection:text-black">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  
  {isSuccess && (
   <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500"><div className="w-full max-w-2xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-8 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)] relative overflow-hidden"><div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"><ShieldCheck size={48} className="text-black" /></div><h2 className="text-[#D4AF37] font-black uppercase text-2xl italic mb-4">ACESSO LIBERADO!</h2><div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-12"><p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">SUA CREDENCIAL ÚNICA</p><div className="text-white text-3xl font-black italic">{agentId}</div></div><button onClick={onDismissSuccess} className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase italic animate-btn-pulse shadow-2xl">[ACESSAR ARSENAL]</button></div></div>
  )}

  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center z-50 mx-auto">
   <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2.5 rounded-2xl rotate-3 shadow-xl"><Eye className="text-black" size={28} /></div><span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
   <div className="flex items-center gap-6">
    <button onClick={onRecuperar} className="text-gray-500 hover:text-[#D4AF37] text-[10px] font-black uppercase italic tracking-widest transition-all">Recuperar ID</button>
    <button onClick={() => onLogin()} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs italic tracking-tighter"><Lock size={14} className="inline mr-2" /> Entrar</button>
   </div>
  </nav>

  <main className="w-full max-w-7xl px-8 flex flex-col items-center text-center mt-12 mb-32 mx-auto">
   <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic max-w-6xl">ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
   <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed text-center">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões. O fim do "achismo" na sua escala digital.</p>
   
   <section className="w-full max-w-4xl aspect-video bg-[#121212] rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:border-[#D4AF37]/40 mb-32 transition-all">
    <div className="bg-[#D4AF37] p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform mb-6"><Play size={40} fill="black" className="text-black ml-1" /></div>
    <p className="text-white font-black uppercase text-[10px] md:text-xs tracking-[0.25em] italic">Descubra como rastreamos ofertas escaladas em tempo real</p>
   </section>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-40 text-left">
    <div className="bg-[#121212] border border-white/5 rounded-[40px] p-12 flex flex-col shadow-2xl"><h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO MENSAL</h3><p className="text-5xl font-black text-white mb-10 italic">R$ 197 <span className="text-sm font-normal text-zinc-500">/mês</span></p><button onClick={() => window.open(KIWIFY_MENSAL)} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-xl uppercase italic">QUERO ACESSO MENSAL</button></div>
    <div className="bg-white text-black rounded-[40px] p-12 flex flex-col scale-105 border-t-8 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20"><h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO TRIMESTRAL</h3><p className="text-5xl font-black mb-10 italic">R$ 497 <span className="text-sm font-normal text-gray-400">/tri</span></p><button onClick={() => window.open(KIWIFY_TRIMESTRAL)} className="w-full py-5 bg-black text-[#D4AF37] font-black text-xl rounded-2xl animate-btn-pulse uppercase italic">ASSINAR TRIMESTRAL</button></div>
   </div>

   <div className="w-full max-w-5xl mx-auto mb-40 border border-[#D4AF37]/30 rounded-[40px] p-16 flex flex-col md:flex-row items-center gap-12 text-left bg-[#050505] shadow-[0_0_100px_rgba(212,175,55,0.1)]">
    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#D4AF37] flex items-center justify-center text-6xl md:text-8xl font-black italic text-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.2)]">7</div>
    <div className="space-y-4 flex-1">
      <h2 className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter">GARANTIA INCONDICIONAL DE <span className="text-[#D4AF37]">7 DIAS</span></h2>
      <p className="text-gray-400 text-lg md:text-xl font-medium italic leading-relaxed">Se em até 7 dias você não sentir que a plataforma é para você, devolvemos 100% do seu investimento. Sem perguntas. Risco zero para sua operação.</p>
    </div>
   </div>

   <footer className="w-full pt-12 pb-20 border-t border-white/5 text-center"><p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic leading-loose">© 2026 007 SWIPER Intelligence Group. Todos os direitos reservados.</p><div onDoubleClick={() => onLogin('admin')} className="h-10 w-full opacity-0 cursor-default">.</div></footer>
  </main>
 </div>
);

/** * APP CORE */
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
     return { id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: v[6] || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').filter(Boolean), status: (v[19] || '').toUpperCase() } as Offer;
    }).filter((o): o is Offer => o !== null);
    setOffers(parsed.filter(o => o.status === 'ATIVO').reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
  }; fetchOffers();
 }, []);

 /** --- TRAVA DE SEGURANÇA BLINDADA --- */
 const checkLogin = async (id: string, silencioso = false) => {
  const cleanId = id.toUpperCase().trim();
  if (!cleanId || cleanId === 'AGENTE-' || cleanId.length < 10) {
    if (!silencioso) alert('FORMATO INVÁLIDO ❌\nSua credencial deve ser completa.');
    return;
  }
  
  try {
   const docRef = doc(db, "agentes", cleanId);
   const docSnap = await getDoc(docRef);
   
   // SEGURANÇA: SÓ ENTRA SE O ID EXISTIR NO FIREBASE E ESTIVER ATIVO
   if (docSnap.exists() && docSnap.data().ativo === true) {
    setAgentId(cleanId);
    setIsLoggedIn(true);
    localStorage.setItem('agente_token', cleanId);
   } else {
    if (!silencioso) alert('ACESSO NEGADO ❌\nCredencial não reconhecida ou assinatura expirada.');
    handleLogout();
   }
  } catch (e) { 
    console.error(e); 
    if (!silencioso) alert('Erro de conexão com o sistema central.');
  }
 };

 const handleLogin = async (type = 'user') => {
  if (type === 'admin') { setShowAdmin(true); return; }
  const inputId = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE:");
  if (inputId) checkLogin(inputId);
 };

 const handleLogout = () => { setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); };
 
 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 const renderContent = () => {
  if (loading) return <div className="py-40 text-center animate-pulse text-[#D4AF37] font-black uppercase italic tracking-widest">Infiltrando nos servidores de dados...</div>;
  
  if (selectedOffer) return (
   <div className="space-y-12 animate-in fade-in duration-500 italic">
    <button onClick={() => setSelectedOffer(null)} className="flex items-center text-zinc-600 hover:text-[#D4AF37] font-black uppercase text-xs transition-all tracking-widest group"><ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform"/> Voltar ao Radar</button>
    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
     <div className="w-full lg:w-[65%] space-y-6">
      <div className="bg-[#121212] p-6 rounded-[40px] border border-white/5 shadow-2xl h-full flex flex-col">
       <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 shadow-[#D4AF37]/5"><VideoPlayer url={selectedOffer.vslLinks[0]?.url} /></div>
       <div className="mt-8 p-10 bg-[#1a1a1a] rounded-[40px] border border-white/5"><h3 className="text-[#D4AF37] font-black uppercase text-[10px] mb-6 tracking-[0.2em] border-l-2 border-[#D4AF37] pl-4 italic">Dossiê de Campo</h3><p className="text-zinc-400 font-medium italic leading-relaxed text-lg break-words">{selectedOffer.description || "Análise técnica em processamento por nossos agentes..."}</p></div>
      </div>
     </div>
     <div className="w-full lg:w-[35%] space-y-6">
      <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5 h-full space-y-10 shadow-2xl">
       <h3 className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em] border-l-2 border-zinc-800 pl-4 italic">Dossiê da Operação</h3>
       {[{icon: Tag, label: 'Nicho', value: selectedOffer.niche}, {icon: Lock, label: 'Estrutura', value: selectedOffer.productType}, {icon: Globe, label: 'Idioma', value: selectedOffer.language}].map((item, i) => (
        <div key={i} className="flex flex-col gap-2 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 text-zinc-700 uppercase text-[9px] font-black tracking-widest"><item.icon size={14}/> {item.label}</div>
          <p className="text-white font-black italic uppercase text-base tracking-tighter">{item.value}</p>
        </div>
       ))}
       <a href={selectedOffer.pageUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-5 btn-elite rounded-2xl text-center text-sm italic font-black shadow-2xl">VISUALIZAR ARSENAL</a>
       <a href={selectedOffer.facebookUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-5 bg-[#1a1a1a] border border-white/10 rounded-2xl text-center text-xs italic font-black text-zinc-500 hover:text-white hover:bg-white/5 transition-all">ADS LIBRARY (CLOAKER)</a>
      </div>
     </div>
    </div>
    <div className="space-y-8 pt-10">
     <h3 className="text-white font-black uppercase italic text-2xl flex items-center gap-4 px-2 tracking-tighter"><ImageIcon className="text-[#D4AF37]" size={28}/> Criativos Infiltrados</h3>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {selectedOffer.creativeEmbedUrls.map((url, i) => (
        <div key={i} className="bg-[#121212] p-5 rounded-[32px] border border-white/5 space-y-5 shadow-2xl hover:border-[#D4AF37]/30 transition-all">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"><VideoPlayer url={url} /></div>
          <a href={selectedOffer.creativeDownloadUrls[i]} target="_blank" className="block w-full py-4 bg-[#1a1a1a] border border-[#D4AF37]/20 text-[#D4AF37] rounded-2xl text-center font-black text-[10px] uppercase hover:bg-[#D4AF37] hover:text-black transition-all italic tracking-widest shadow-inner">Baixar Criativo VIP</a>
        </div>
      ))}
     </div>
    </div>
   </div>
  );

  const filtered = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-in fade-in duration-700">
    {(currentPage === 'home' ? filtered : filtered.filter(o => favorites.includes(o.id))).map((o) => (
     <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e:any) => { e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id]) }} onClick={() => { setSelectedOffer(o); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    ))}
   </div>
  );
 };

 return (
  <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <div className="flex">
     <aside className="w-80 bg-[#121212] border-r border-white/5 h-screen sticky top-0 p-10 flex flex-col shadow-2xl">
      <div className="flex items-center space-x-4 mb-16 cursor-pointer group" onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}}>
        <div className="bg-[#D4AF37] p-2.5 rounded-2xl shadow-xl shadow-[#D4AF37]/10 group-hover:scale-110 transition-transform"><Eye className="text-black" size={26} /></div>
        <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">007 SWIPER</span>
      </div>
      <nav className="space-y-4 flex-1">
       <SidebarItem icon={HomeIcon} label="Home Radar" active={currentPage === 'home'} onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} />
       <SidebarItem icon={Star} label="Dossiês Salvos" active={currentPage === 'favorites'} onClick={() => {setCurrentPage('favorites'); setSelectedOffer(null)}} />
       <SidebarItem icon={Tag} label="Banco de Dados" active={currentPage === 'offers'} onClick={() => {setCurrentPage('offers'); setSelectedOffer(null)}} />
      </nav>
      <div className="pt-10 border-t border-white/5">
        <div className="bg-[#1a1a1a] p-5 rounded-2xl mb-8 border border-white/5 shadow-inner"><p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1 italic">Operador Identificado</p><p className="text-[#D4AF37] font-mono text-[10px] font-black truncate">{agentId}</p></div>
        <SidebarItem icon={LogOut} label="Encerrar Missão" active={false} onClick={handleLogout} variant="danger" />
      </div>
     </aside>
     <main className="flex-1 p-16 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/10 via-transparent to-transparent">
      <header className="flex justify-between items-center mb-20 italic">
        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Radar de <span className="text-[#D4AF37]">Inteligência</span></h1>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-hover:text-[#D4AF37] transition-colors" size={18}/>
          <input type="text" placeholder="RASTREAR OFERTA..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#121212] border border-white/5 pl-14 pr-6 py-5 rounded-2xl w-[400px] font-black text-xs italic focus:border-[#D4AF37] outline-none transition-all shadow-inner placeholder:text-zinc-800" />
        </div>
      </header>
      {renderContent()}
     </main>
    </div>
   ) : (
    <LandingPage 
      onLogin={handleLogin} 
      onRecuperar={() => setShowRecuperar(true)} 
      isSuccess={false} 
      agentId={agentId} 
      onDismissSuccess={() => navigateToPage('home')} 
    />
   )}
  </div>
 );
};

export default App;
