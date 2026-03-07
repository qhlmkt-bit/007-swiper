import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle, MessageCircle
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";

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

// --- ⚠️ CONFIGURAÇÃO DOS LINKS ⚠️ ---
const LINKS = {
    KIWIFY: {
        MENSAL: "https://pay.kiwify.com.br/mtU9l7e", 
        TRIMESTRAL: "https://pay.kiwify.com.br/ExDtrjE"
    },
    HOTMART: {
        MENSAL: "https://pay.hotmart.com/H104019113G?bid=1769103375372",
        TRIMESTRAL: "https://pay.hotmart.com/H104019113G?off=fc7oudim"
    }
};

const WHATSAPP_NUMBER = "5573981414083"; 
const SUPPORT_EMAIL = 'suporte@007swiper.com';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?output=csv';
const COMMUNITY_LINK = "https://chat.whatsapp.com/DVQrZLpHFR31KUgmPq6ibL";

// TIPAGEM
type Trend = 'Escalando' | 'Em Alta' | 'Estável';
interface Offer {
  id: string; title: string; niche: string; productType: string; description: string; coverImage: string; trend: Trend; views: string; vslLinks: { label: string; url: string }[]; vslDownloadUrl: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; facebookUrl: string; pageUrl: string; language: string; trafficSource: string[]; creativeZipUrl: string; addedDate: string; status: string;
}

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

// --- UTILS CORRIGIDOS ---
const getDriveDirectLink = (url: string) => { 
  if (!url) return ''; 
  const trimmed = url.trim(); 
  if (trimmed.includes('drive.google.com')) { 
    const idMatch = trimmed.match(/[-\w]{25,}/); 
    // USANDO O ENDPOINT DE THUMBNAIL DO GOOGLE PARA EVITAR ERROS DE CARREGAMENTO
    if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w1000`; 
  } 
  return trimmed; 
};

const isDirectVideo = (url: string) => { const clean = url.trim().toLowerCase(); return clean.includes('.mp4') || clean.includes('.m3u8') || clean.includes('bunny.net') || clean.includes('b-cdn.net') || clean.includes('mediapack'); };

const getFastDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'play_480p.mp4');
    if (trimmed.endsWith('original')) return trimmed.replace('original', 'play_480p.mp4');
    if (trimmed.includes('play_720p.mp4')) return trimmed.replace('play_720p.mp4', 'play_480p.mp4');
  } return trimmed;
};

const getOriginalDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'original');
    if (trimmed.includes('play_720p.mp4')) return trimmed.replace('play_720p.mp4', 'original');
    if (trimmed.includes('play_480p.mp4')) return trimmed.replace('play_480p.mp4', 'original');
    if (trimmed.includes('play_360p.mp4')) return trimmed.replace('play_360p.mp4', 'original');
  } return trimmed;
};

// --- COMPONENTES ---
const RecuperarID = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const buscarID = async (e: React.FormEvent) => {
    e.preventDefault(); setResultado(null);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const snap = await getDocs(q);
      if (snap.empty) alert('E-mail não localizado.');
      else setResultado(snap.docs[0].id);
    } catch (err) { alert('Erro de conexão.'); }
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 animate-in fade-in">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full border border-zinc-800 bg-zinc-950 p-8 rounded-[32px] shadow-2xl">
        <h2 className="text-2xl font-black text-[#D4AF37] italic uppercase mb-6 text-center">Recuperar Acesso</h2>
        <form onSubmit={buscarID} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-[#D4AF37] outline-none text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-[#D4AF37] text-black font-black p-4 rounded-xl hover:bg-white transition-all uppercase italic">Consultar</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-zinc-900 border border-[#D4AF37] rounded-2xl text-center"><p className="text-xs text-zinc-500 uppercase mb-2">Sua Credencial:</p><p className="text-2xl font-black text-white">{resultado}</p></div>}
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
      <button onClick={onBack} className="mb-8 text-[#D4AF37] flex items-center gap-2 font-black uppercase italic text-xs"><ArrowLeft size={16}/> Sair</button>
      <h1 className="text-3xl font-black mb-10 italic uppercase text-center">Base <span className="text-[#D4AF37]">Agentes</span></h1>
      <div className="max-w-5xl mx-auto overflow-x-auto border border-zinc-800 rounded-3xl bg-zinc-950">
        <table className="w-full text-left text-sm"><thead className="bg-zinc-900 text-[10px] uppercase text-zinc-500"><tr><th className="p-4">ID</th><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Último Acesso</th></tr></thead>
          <tbody>{agentes.map(a => (
            <tr key={a.id} className="border-b border-zinc-900">
                <td className="p-4 text-[#D4AF37] font-bold">{a.id}</td>
                <td className="p-4">{a.email}</td>
                <td className="p-4 text-green-500 font-black">ATIVO</td>
                <td className="p-4 text-zinc-400">
                    {a.ultimo_acesso ? a.ultimo_acesso.toDate().toLocaleString('pt-BR') : 'Sem registros'}
                </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void; variant?: 'default' | 'danger' | 'gold'; }> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black">{label}</span></button>
);

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => { const normalized = source.toLowerCase().trim(); if (normalized.includes('facebook')) return <Facebook size={14} className="text-blue-500" />; if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={14} className="text-red-500" />; if (normalized.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />; if (normalized.includes('instagram')) return <Smartphone size={14} className="text-purple-500" />; return <Target size={14} className="text-[#D4AF37]" />; };

const VideoPlayer: React.FC<{ url: string; title?: string; type?: 'vsl' | 'creative' }> = ({ url, title, type = 'vsl' }) => { 
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return (
    <div className="w-full aspect-video bg-[#0a0a0a] flex items-center justify-center border border-white/5 rounded-2xl relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm border border-white/10 mb-4"><ZapOff size={32} className="text-gray-500" /></div>
        <p className="text-gray-500 font-black uppercase text-xs tracking-[0.2em]">{type === 'vsl' ? "ESSA OFERTA NÃO TEM VSL" : "VÍDEO INDISPONÍVEL"}</p>
      </div>
    </div>
  ); 

  let content;
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    let baseUrl = trimmed.replace(/playlist\.m3u8|play_720p\.mp4|play_480p\.mp4|play_360p\.mp4|original/, '');
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    content = (
      <video className="max-w-full max-h-[70vh] object-contain bg-black" controls playsInline controlsList="nodownload">
        <source src={`${baseUrl}play_720p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}play_480p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}play_360p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}original`} type="video/mp4" />
      </video>
    );
  } else if (isDirectVideo(trimmed)) {
    content = <video className="max-w-full max-h-[70vh] object-contain bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    content = <iframe className="w-full aspect-video" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }
  return <div className="w-full flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">{content}</div>;
};

const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
 const getBadgeInfo = () => { if (!offer.addedDate) return { text: "OFERTA VIP", isNew: false }; const dataOferta = new Date(offer.addedDate + 'T00:00:00'); const hoje = new Date(); hoje.setHours(0, 0, 0, 0); const diffTempo = hoje.getTime() - dataOferta.getTime(); const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24)); if (diffDias <= 0) return { text: "ADICIONADO: HOJE", isNew: true }; if (diffDias === 1) return { text: "ADICIONADO: HÁ 1 DIA", isNew: true }; if (diffDias >= 2 && diffDias <= 7) return { text: `ADICIONADO: HÁ ${diffDias} DIAS`, isNew: true }; return { text: "OFERTA: +7 DIAS", isNew: false }; };
 const badge = getBadgeInfo();
 return (
  <div onClick={onClick} className="bg-[#121212] rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
   <div className="relative aspect-video overflow-hidden">
    <img src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
     <div className={`px-2.5 py-1 text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl ${badge.isNew ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}><Clock size={10} fill={badge.isNew ? "currentColor" : "none"} /> {badge.text}</div>
     {offer.trend.trim().toLowerCase() === 'escalando' && (<div className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl"><Zap size={10} fill="currentColor" /> Escalando</div>)}
     {offer.trend.trim().toLowerCase() === 'em alta' && (<div className="px-2.5 py-1 bg-[#D4AF37] text-black text-[10px] font-black rounded uppercase flex items-center gap-1 shadow-2xl"><TrendingUp size={12} className="w-3 h-3" /> Em Alta</div>)}
     {offer.views && offer.views.trim() !== '' && (<div className="px-2.5 py-1 bg-[#0a0a0a]/90 backdrop-blur-xl text-[#D4AF37] text-[10px] font-black rounded uppercase flex items-center gap-1.5 shadow-2xl border border-[#D4AF37]/30"><Flame size={12} fill="currentColor" className="text-[#D4AF37] animate-pulse" /> {offer.views.trim()}</div>)}
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

const SelectionGrid = ({ items, onSelect, Icon, label }: any) => (
  <div className="animate-in fade-in duration-500">
   <div className="flex flex-col mb-12"><h2 className="text-3xl font-black text-white uppercase italic flex items-center gap-4"><Icon className="text-[#D4AF37]" size={32} />{label}</h2><p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 italic">Selecione uma categoria para infiltrar nos dados</p></div>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {items.map((item: string, idx: number) => (
     <button key={idx} onClick={() => onSelect(item)} className="group bg-[#121212] border border-white/5 hover:border-[#D4AF37]/50 p-8 rounded-[32px] text-left transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between h-48 relative overflow-hidden">
      <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-[#D4AF37]/10 transition-colors"><Icon size={120} /></div>
      <p className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic mb-2">Categoria 00{idx + 1}</p>
      <span className="text-white text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-[#D4AF37] transition-colors relative z-10">{item}</span>
      <div className="flex items-center gap-2 mt-auto relative z-10"><span className="text-gray-500 text-[9px] font-black uppercase tracking-widest group-hover:text-white transition-colors italic">Infiltrar</span><ChevronRight size={14} className="text-[#D4AF37] group-hover:translate-x-1 transition-transform" /></div>
     </button>
    ))}
   </div>
  </div>
);

const SidebarContent = ({ currentPage, selectedOffer, navigateToPage, handleLogout }: any) => (
  <div className="p-8 md:p-10 h-full flex flex-col">
   <div className="flex items-center space-x-3 mb-12 px-2"><div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/10"><Eye className="text-black" size={24} /></div><span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
   <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
    <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} />
    <SidebarItem icon={Star} label="SEUS FAVORITOS" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} />
    <div className="pt-8 pb-4">
     <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
     <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} />
     <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} />
     <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} />
     <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => navigateToPage('pages')} />
     <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} />
    </div>
    <div className="pt-4 pb-4">
     <p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Ferramentas</p>
     <SidebarItem icon={LifeBuoy} label="CENTRAL 007" active={currentPage === 'support'} onClick={() => navigateToPage('support')} />
     <SidebarItem icon={Puzzle} label="EXTENSÃO 007" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} />
     <button onClick={() => window.open(COMMUNITY_LINK, '_blank')} className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 text-[#25D366] hover:bg-[#25D366]/10 mb-1">
        <MessageCircle size={20} />
        <span className="text-sm uppercase tracking-tighter font-black">COMUNIDADE VIP</span>
     </button>
     <SidebarItem icon={Settings} label="PAINEL DO AGENTE" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} />
    </div>
   </nav>
   <div className="mt-8 space-y-3"><SidebarItem icon={LogOut} label="Sair" active={false} onClick={handleLogout} variant="danger" /></div>
  </div>
);

const LandingPage = ({ onLogin, isSuccess, agentId, onDismissSuccess, onRecover, onAdmin }: any) => {
    const params = new URLSearchParams(window.location.search);
    const isHotmart = params.get('src') === 'afiliado' || params.get('src') === 'hotmart';
    const activeLinks = isHotmart ? LINKS.HOTMART : LINKS.KIWIFY;
    return (
        <div className="w-full bg-[#0a0a0a] flex flex-col items-center selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        {isSuccess && (<div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500"><div className="w-full max-w-2xl bg-[#121212] border-2 border-[#D4AF37] rounded-[40px] p-8 md:p-12 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)] relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]"></div><div className="bg-[#D4AF37] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.4)]"><ShieldCheck size={48} className="text-black" /></div><h2 className="text-[#D4AF37] font-black uppercase text-2xl md:text-4xl tracking-tighter italic mb-4">ACESSO À INTELIGÊNCIA LIBERADO!</h2><p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-10 leading-relaxed">Sua operação de rastreio de elite começa agora. Sua credencial é única e privada.</p><div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 mb-12"><p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">ESTA É SUA CREDENCIAL ÚNICA E PRIVADA</p><div className="flex items-center justify-center gap-4"><span className="text-white text-3xl md:text-5xl font-black tracking-tighter italic selection:bg-[#D4AF37] selection:text-black">{agentId}</span><button onClick={() => {navigator.clipboard.writeText(agentId);alert('ID COPIADO! 🛡️');}} className="p-3 bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all rounded-xl text-gray-400"><Copy size={20} /></button></div></div><button onClick={onDismissSuccess} className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase hover:scale-105 transition-all shadow-xl italic tracking-tighter animate-btn-pulse">[ACESSAR ARSENAL]</button></div></div>)}
        <nav className="w-full max-w-7xl px-4 md:px-8 py-10 flex justify-between items-center relative z-50 mx-auto">
        <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2 rounded-xl rotate-3 shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={28} /></div><span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
        <div className="flex items-center gap-4">
            <button onClick={onRecover} className="text-gray-500 hover:text-[#D4AF37] text-[10px] font-black uppercase italic tracking-widest hidden md:block">Recuperar ID</button>
            <button onClick={onLogin} className="px-6 py-2.5 bg-[#D4AF37] hover:bg-yellow-600 text-black font-black rounded-full transition-all shadow-xl uppercase text-xs tracking-tighter italic"><Lock size={14} className="inline mr-2" /> Entrar</button>
        </div>
        </nav>
        <main className="w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center text-center mt-12 mb-32 relative mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent -z-10 pointer-events-none opacity-40"></div>
        <div className="inline-block px-5 py-2 mb-10 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mx-auto">Inteligência de Mercado em Tempo Real</div>
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.0] tracking-tighter uppercase italic max-w-6xl mx-auto text-center">ACESSE SEM LIMITES AS OFERTAS MAIS LUCRATIVAS E ESCALADAS DO MERCADO DE RESPOSTA DIRETA <span className="text-[#D4AF37]">ANTES DA CONCORRÊNCIA.</span></h1>
        <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-5xl mb-20 italic leading-relaxed px-2 mx-auto text-center">Rastreie, analise e modele VSLs, criativos e funis que estão gerando milhões em YouTube Ads, Facebook Ads e TikTok Ads. O fim do "achismo" na sua escala digital.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 w-full max-w-5xl mb-40 px-4 justify-center items-stretch mx-auto">
            <div className="bg-[#121212] border border-white/5 rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]"><h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO MENSAL</h3><div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black text-white italic">R$ 197</span><span className="text-gray-500 font-black text-sm uppercase">/mês</span></div><ul className="space-y-4 mb-12 flex-1">{['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Histórico de Escala', 'Templates de Funil', 'Transcrições de VSL', 'Radar de Tendências', '007 Academy', 'Hub de Afiliação', 'Cloaker VIP', 'Suporte Prioritário'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}</li>))}</ul><button onClick={() => window.open(activeLinks.MENSAL, '_blank')} className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter animate-btn-pulse shadow-xl italic">QUERO ACESSO MENSAL</button></div>
            <div className="bg-white text-black rounded-[40px] p-8 md:p-12 text-left relative overflow-hidden group shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col scale-105 border-t-[8px] border-[#D4AF37]"><div className="absolute top-6 right-8 bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Economize R$ 94</div><h3 className="text-[#D4AF37] font-black uppercase text-xl italic mb-1 tracking-tight">PLANO TRIMESTRAL</h3><div className="flex items-baseline gap-2 mb-10"><span className="text-5xl font-black italic">R$ 497</span><span className="text-gray-400 font-black text-sm uppercase">/trimestre</span></div><ul className="space-y-4 mb-12 flex-1">{['Acesso a Todas as Ofertas', 'Banco de Criativos Híbrido', 'Comunidade VIP Exclusiva', 'Checklist de Modelagem 007', '12% OFF na IDL Edições', 'Transcrições Ilimitadas', 'Radar de Tendências Global', 'Hub de Afiliação Premium', 'Academy Completo', 'Suporte Agente Black'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold italic"><CheckCircle size={16} className="text-[#D4AF37] shrink-0" /> {item}</li>))}</ul><button onClick={() => window.open(activeLinks.TRIMESTRAL, '_blank')} className="w-full py-5 bg-[#0a0a0a] text-[#D4AF37] font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-tighter animate-btn-pulse italic">ASSINAR PLANO TRIMESTRAL</button></div>
        </div>
        <footer className="w-full max-w-7xl px-4 md:px-8 border-t border-white/5 pt-12 pb-20 mx-auto text-center"><p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">© 2026 007 SWIPER Intelligence Platform.</p><div onDoubleClick={onAdmin} className="h-10 w-full opacity-0 cursor-default">.</div></footer>
        <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá,%20tenho%20dúvida`, '_blank')} className="fixed bottom-8 right-8 z-[300] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"><MessageCircle size={32} /></button>
        </main>
    </div>
);
};

const App: React.FC = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState<string>('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [activeVslIndex, setActiveVslIndex] = useState(0);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedNiche, setSelectedNiche] = useState('Todos');
 const [selectedLanguage, setSelectedLanguage] = useState('Todos');
 const [selectedType, setSelectedType] = useState('Todos');
 const [selectedTraffic, setSelectedTraffic] = useState('Todos');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [activeNicheSelection, setActiveNicheSelection] = useState<string | null>(null);
 const [activeLanguageSelection, setActiveLanguageSelection] = useState<string | null>(null);
 const [isSuccess, setIsSuccess] = useState(false);
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 const allNiches = Array.from(new Set(offers.map(o => o.niche))).sort();
 const allLanguages = Array.from(new Set(offers.map(o => o.language))).sort();
 const allTypes = Array.from(new Set(offers.map(o => o.productType))).sort();
 const allTrafficSources = Array.from(new Set(offers.flatMap(o => o.trafficSource))).sort();

 const getFavKey = (id: string) => `favs_${id}`;
 const getViewedKey = (id: string) => `viewed_${id}`;

 const applyEliteFilters = useCallback((data: Offer[]) => {
  return data.filter(offer => {
   const searchLower = searchQuery.toLowerCase();
   const matchesSearch = offer.title.toLowerCase().includes(searchLower);
   const matchesNiche = selectedNiche === 'Todos' || offer.niche === selectedNiche;
   const matchesLanguage = selectedLanguage === 'Todos' || offer.language === selectedLanguage;
   const matchesType = selectedType === 'Todos' || offer.productType === selectedType;
   const matchesTraffic = selectedTraffic === 'Todos' || offer.trafficSource.some(t => t.toLowerCase().includes(selectedTraffic.toLowerCase()));
   return matchesSearch && matchesNiche && matchesLanguage && matchesType && matchesTraffic;
  });
 }, [searchQuery, selectedNiche, selectedLanguage, selectedType, selectedTraffic]);

 const showFilters = currentPage === 'offers' && !selectedOffer;

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
      id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: (v[6] as Trend) || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase()
     };
    }).filter((o): o is Offer => o !== null);
    setOffers([...parsed.filter(o => o.status === 'ATIVO')].reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  fetchOffers();
 }, []);

 const checkLogin = async (id: string, silencioso = false) => {
    const cleanId = id.toUpperCase().trim();
    try {
        const docRef = doc(db, "agentes", cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().ativo === true) {
            await updateDoc(docRef, { ultimo_acesso: serverTimestamp() });
            setAgentId(cleanId);
            setIsLoggedIn(true);
            localStorage.setItem('agente_token', cleanId);
        } else if (!silencioso) alert('ACESSO NEGADO ❌');
    } catch (e) { console.error(e); }
 };

 const handleLogout = () => { setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); };

 const renderContent = () => {
  if (loading) return (<div className="py-40 text-center"><Loader2 className="text-[#D4AF37] animate-spin mx-auto" size={48} /></div>);
  if (selectedOffer) return (
   <div className="animate-in fade-in duration-500">
    <button onClick={() => setSelectedOffer(null)} className="mb-8 text-gray-500 flex items-center gap-2 uppercase font-black italic text-xs"><ArrowLeft size={16}/> Voltar</button>
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-[62%] space-y-6">
       <div className="bg-[#121212] p-6 rounded-[32px] border border-white/5">
        <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} type="vsl" />
        <div className="mt-5 grid grid-cols-2 gap-3">
           <a href={getFastDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" className="p-4 bg-[#D4AF37] text-black text-center font-black rounded-xl uppercase italic text-xs shadow-lg">Baixar VSL</a>
           <a href={selectedOffer.transcriptionUrl} target="_blank" className="p-4 bg-[#1a1a1a] text-zinc-400 text-center font-black rounded-xl border border-white/5 uppercase italic text-xs">Transcrição</a>
        </div>
        <p className="mt-8 text-zinc-400 leading-relaxed text-lg italic">{selectedOffer.description}</p>
       </div>
      </div>
      <div className="lg:w-[38%] bg-[#121212] p-8 rounded-[32px] border border-white/5 h-fit">
        <h3 className="text-[#D4AF37] font-black uppercase text-xs italic mb-8">Informações da Operação</h3>
        <div className="space-y-4">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-[9px] font-black uppercase mb-1">NICHO</p><p className="font-black italic text-white uppercase">{selectedOffer.niche}</p></div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5"><p className="text-gray-500 text-[9px] font-black uppercase mb-1">FONTE</p><p className="font-black italic text-white uppercase">{selectedOffer.trafficSource.join(', ')}</p></div>
        </div>
        <a href={selectedOffer.pageUrl} target="_blank" className="mt-8 block w-full py-5 btn-elite rounded-2xl text-center italic">Visualizar Página</a>
      </div>
    </div>
   </div>
  );
  const filtered = applyEliteFilters(offers);
  return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filtered.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={() => {}} onClick={() => setSelectedOffer(o)} />)}</div>);
 };

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 return (
  <div className="flex min-h-screen bg-[#0a0a0a] text-white">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <>
     <aside className="w-72 bg-[#121212] border-r border-white/5 hidden lg:flex flex-col fixed h-screen"><SidebarContent currentPage={currentPage} navigateToPage={setCurrentPage} handleLogout={handleLogout} /></aside>
     <main className="flex-1 lg:ml-72 p-4 md:p-10">
      <header className="mb-12 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
        <h2 className="text-2xl font-black italic uppercase text-[#D4AF37]">007 Central</h2>
        {showFilters && (
            <div className="flex gap-4">
                <input type="text" placeholder="BUSCAR..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-xs font-black uppercase outline-none focus:border-[#D4AF37]" />
                <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-xs font-black uppercase text-white outline-none">{['Todos', ...allNiches].map(n => <option key={n} value={n}>{n}</option>)}</select>
            </div>
        )}
      </header>
      {renderContent()}
     </main>
    </>
   ) : (
    <LandingPage onLogin={() => checkLogin(window.prompt("Digite seu ID:") || "")} onRecover={() => setShowRecuperar(true)} onAdmin={() => setShowAdmin(true)} isSuccess={isSuccess} agentId={agentId} onDismissSuccess={() => setIsSuccess(false)} />
   )}
  </div>
 );
};

export default App;
