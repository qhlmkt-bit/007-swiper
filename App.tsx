import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle, MessageCircle, Share2, Calendar
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";

// --- CONFIGURAÇÃO FIREBASE (NÃO ALTERAR) ---
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

// --- LINKS E SUPORTE ---
const LINKS = {
    KIWIFY: { MENSAL: "https://pay.kiwify.com.br/mtU9l7e", TRIMESTRAL: "https://pay.kiwify.com.br/ExDtrjE" },
    HOTMART: { MENSAL: "https://pay.hotmart.com/H104019113G?bid=1769103375372", TRIMESTRAL: "https://pay.hotmart.com/H104019113G?off=fc7oudim" }
};
const WHATSAPP_NUMBER = "5573981414083"; 
const SUPPORT_EMAIL = 'suporte@007swiper.com';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?output=csv';
const COMMUNITY_LINK = "https://chat.whatsapp.com/DVQrZLpHFR31KUgmPq6ibL";

// --- TIPAGEM ---
type Trend = 'Escalando' | 'Em Alta' | 'Estável';
interface Offer {
  id: string; title: string; niche: string; productType: string; description: string; coverImage: string; trend: Trend; views: string; vslLinks: { label: string; url: string }[]; vslDownloadUrl: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; facebookUrl: string; pageUrl: string; language: string; trafficSource: string[]; creativeZipUrl: string; addedDate: string; status: string;
}

// --- ESTILOS VISUAIS ---
const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #050505; }
 body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #050505; color: #ffffff; margin: 0; overflow-x: hidden; }
 .glass-card { background: rgba(13, 13, 13, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.04); }
 .card-hover:hover { border-color: rgba(212, 175, 55, 0.4); box-shadow: 0 0 30px rgba(212, 175, 55, 0.05); transform: translateY(-3px); }
 .btn-gold { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #000; font-weight: 800; text-transform: uppercase; }
 .grid-5-cols { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1.5rem; }
 @media (min-width: 640px) { .grid-5-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
 @media (min-width: 1024px) { .grid-5-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
 @media (min-width: 1440px) { .grid-5-cols { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
 ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
`;

// --- UTILS ---
const getDriveDirectLink = (url: string) => { 
  if (!url) return ''; 
  const idMatch = url.match(/[-\w]{25,}/); 
  return idMatch ? `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w1000` : url; 
};

// --- COMPONENTES AUXILIARES ---
const VideoPlayer: React.FC<{ url: string }> = ({ url }) => { 
  const trimmed = url?.trim() || '';
  if (!trimmed) return <div className="w-full aspect-video bg-zinc-900 rounded-xl flex items-center justify-center"><p className="text-zinc-700 text-[10px] font-bold uppercase">Mídia Ausente</p></div>;
  const isImg = trimmed.match(/\.(jpeg|jpg|gif|png|webp)$/i) || trimmed.includes('drive.google.com/thumbnail');
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">
      {isImg ? <img src={trimmed} className="w-full h-full object-contain" alt="Preview" /> : <iframe className="w-full h-full" src={trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed} frameBorder="0" allowFullScreen></iframe>}
    </div>
  );
};

const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
 const dataOferta = offer.addedDate ? new Date(offer.addedDate + 'T00:00:00') : new Date();
 const diffDias = Math.floor((new Date().getTime() - dataOferta.getTime()) / (1000 * 60 * 60 * 24));
 return (
  <div onClick={onClick} className="glass-card card-hover rounded-[24px] overflow-hidden group cursor-pointer flex flex-col h-full relative">
   <div className="relative aspect-video overflow-hidden shrink-0">
    <img src={getDriveDirectLink(offer.coverImage)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" loading="lazy" />
    <div className="absolute top-3 left-3 flex flex-col gap-1">
     <div className={`px-2 py-1 text-[8px] font-black rounded-md uppercase flex items-center gap-1 ${diffDias <= 7 ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-black/60 text-gray-400'}`}><Clock size={10} /> {diffDias <= 0 ? 'NOVA HOJE' : `HÁ ${diffDias} DIAS`}</div>
     {offer.trend.toLowerCase() === 'escalando' && <div className="px-2 py-1 bg-green-600 text-white text-[8px] font-black rounded-md uppercase flex items-center gap-1 shadow-lg"><Zap size={10} fill="currentColor" /> Escalando</div>}
    </div>
    <div className="absolute top-3 right-3"><button onClick={onToggleFavorite} className={`p-2 rounded-xl backdrop-blur-md ${isFavorite ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-white hover:bg-[#D4AF37]'}`}><Star size={14} fill={isFavorite ? "currentColor" : "none"} /></button></div>
    <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white text-[8px] font-bold rounded uppercase border border-white/5">{offer.niche}</div></div>
   </div>
   <div className="p-4 flex flex-col flex-1">
    <h3 className="font-extrabold text-white mb-2 line-clamp-2 text-xs tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors leading-tight">{offer.title}</h3>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-500 text-[8px] font-bold bg-white/5 px-2 py-1 rounded">Scale: {offer.views || 'Checked'}</span>
      <span className="text-[#D4AF37] text-[8px] font-bold bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/20 uppercase">Validada</span>
    </div>
    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3"><span className="text-gray-500 text-[8px] font-bold uppercase">{offer.productType}</span><ChevronRight size={14} className="text-gray-800" /></div>
   </div>
  </div>
 );
};

// --- PÁGINA DE VENDAS ---
const LandingPage = ({ onLogin, onRecover }: any) => (
    <div className="w-full min-h-screen bg-[#050505] flex flex-col items-center">
        <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center">
            <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2 rounded-xl"><Eye className="text-black" size={24} /></div><span className="text-2xl font-black tracking-tighter text-white uppercase italic">007 SWIPER</span></div>
            <div className="flex items-center gap-6">
                <button onClick={onRecover} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest">Recuperar ID</button>
                <button onClick={onLogin} className="px-6 py-2.5 bg-[#D4AF37] text-black font-black rounded-full uppercase text-xs italic transition-all hover:scale-105 shadow-xl">Entrar</button>
            </div>
        </nav>
        <main className="text-center px-4 mt-24 max-w-5xl flex flex-col items-center">
            <h1 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-none">O ARSENAL DAS OFERTAS <span className="text-[#D4AF37]">MILIONÁRIAS.</span></h1>
            <p className="text-gray-400 text-lg md:text-2xl font-medium mb-20 italic max-w-3xl leading-relaxed">Rastreie, mapeie e escale os funis de alta conversão do mercado digital em tempo real.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                <div className="glass-card p-12 rounded-[40px] text-left border-t-4 border-[#D4AF37]">
                    <h3 className="text-[#D4AF37] font-black text-xl mb-2">PLANO MENSAL</h3>
                    <div className="text-5xl font-black text-white mb-10 tracking-tighter">R$ 197<span className="text-sm text-gray-500 font-bold"> / Mês</span></div>
                    <button onClick={() => window.open(LINKS.KIWIFY.MENSAL)} className="w-full py-5 bg-white text-black font-black rounded-2xl mb-8 uppercase text-sm">Assinar Mensal</button>
                    <div className="space-y-4">{['Banco de Ofertas VIP', 'Arsenal de Criativos', 'Biblioteca VSL'].map((item, i) => <div key={i} className="flex items-center gap-3 text-gray-400 text-sm font-bold"><CheckCircle size={16} className="text-[#D4AF37]"/> {item}</div>)}</div>
                </div>
                <div className="bg-white p-12 rounded-[40px] text-left scale-105 shadow-2xl border-2 border-[#D4AF37]/30">
                    <h3 className="text-[#D4AF37] font-black text-xl mb-2">PLANO TRIMESTRAL</h3>
                    <div className="text-5xl font-black text-black mb-10 tracking-tighter">R$ 497<span className="text-sm text-gray-400 font-bold"> / Tri</span></div>
                    <button onClick={() => window.open(LINKS.KIWIFY.TRIMESTRAL)} className="w-full py-5 bg-black text-[#D4AF37] font-black rounded-2xl mb-8 uppercase text-sm">Assinar Elite</button>
                    <div className="space-y-4">{['Comunidade VIP', 'Estratégias Orgânicas', 'Checklist de Escala'].map((item, i) => <div key={i} className="flex items-center gap-3 text-gray-700 text-sm font-bold"><CheckCircle size={16} className="text-[#D4AF37]"/> {item}</div>)}</div>
                </div>
            </div>
        </main>
    </div>
);

// --- COMPONENTE PRINCIPAL (ENGINE) ---
const App: React.FC = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [activeVslIndex, setActiveVslIndex] = useState(0);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedNiche, setSelectedNiche] = useState('Todos');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [showRecuperar, setShowRecuperar] = useState(false);

 // 🛡️ FILTRO UNIVERSAL (FIX DA PESQUISA)
 const filtered = useMemo(() => {
    return offers.filter(o => {
        const s = searchQuery.toLowerCase();
        const matchesSearch = o.title.toLowerCase().includes(s) || o.description.toLowerCase().includes(s) || o.niche.toLowerCase().includes(s);
        const matchesNiche = selectedNiche === 'Todos' || o.niche === selectedNiche;
        return matchesSearch && matchesNiche;
    });
 }, [offers, searchQuery, selectedNiche]);

 const checkLogin = async (id: string, sil = false) => {
    const cid = id.toUpperCase().trim(); if (cid.length < 5) return;
    try {
        const docRef = doc(db, "agentes", cid); const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().ativo) {
            await updateDoc(docRef, { ultimo_acesso: serverTimestamp() });
            setAgentId(cid); setIsLoggedIn(true); localStorage.setItem('agente_token', cid);
            const favs = localStorage.getItem(`favs_${cid}`); if (favs) setFavorites(JSON.parse(favs));
        } else if (!sil) alert('IDENTIDADE INVÁLIDA.');
    } catch (e) { console.error(e); }
 };

 useEffect(() => {
  const tid = localStorage.getItem('agente_token'); if (tid) checkLogin(tid, true);
  const load = async () => {
   try {
    setLoading(true); const res = await fetch(CSV_URL); const text = await res.text();
    
    // 🛡️ PARSER À PROVA DE BALAS (RegEx Robusto para evitar lentidão)
    const parseCSV = (t: string) => {
        const rows: string[][] = []; let cur: string[] = []; let cell = ''; let q = false;
        for (let i = 0; i < t.length; i++) {
            const c = t[i]; if (c === '"') q = !q;
            else if (c === ',' && !q) { cur.push(cell.trim()); cell = ''; }
            else if (c === '\n' && !q) { cur.push(cell.trim()); if (cur.length > 1) rows.push(cur); cur = []; cell = ''; }
            else cell += c;
        }
        if (cur.length > 0) { cur.push(cell.trim()); rows.push(cur); }
        return rows;
    };

    const parsed = parseCSV(text).slice(2).map((v, i) => {
        if (!v[1] || v[1].toLowerCase() === 'undefined') return null;
        return {
            id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: (v[6] as Trend) || 'Estável', views: v[7] || '', 
            vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL', url: u.trim() })).filter(x => x.url),
            vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean),
            facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'BR', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase()
        };
    }).filter((x): x is Offer => x !== null);
    setOffers(parsed.filter(o => o.status === 'ATIVO').reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
  }; load();
 }, []);

 const SidebarItemIcon: React.FC<{ icon: any; label: string; active: boolean; onClick: () => void; variant?: 'default' | 'danger' | 'gold'; }> = ({ icon: Icon, label, active, onClick, variant = 'default' }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3 rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-extrabold' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}><Icon size={18} /><span className="text-[10px] uppercase tracking-widest font-black">{label}</span></button>
 );

 const renderMain = () => {
    if (loading) return <div className="flex flex-col items-center justify-center py-40 gap-4"><Loader2 className="animate-spin text-[#D4AF37]" size={48}/><p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest animate-pulse">Sincronizando Dados...</p></div>;
    
    if (selectedOffer) return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-32">
            <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest gap-2"><ArrowLeft size={16}/> Voltar ao Dashboard</button>
            <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                <div className="w-full lg:w-[65%] glass-card p-8 rounded-[40px]">
                    <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-8 scrollbar-hide">
                        {selectedOffer.vslLinks.map((link, idx) => (
                            <button key={idx} onClick={() => setActiveVslIndex(idx)} className={`px-6 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${activeVslIndex === idx ? 'bg-[#D4AF37] text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}>VSL {idx + 1}</button>
                        ))}
                    </div>
                    <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} />
                    <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 lg:flex gap-4">
                        <a href={selectedOffer.vslDownloadUrl} target="_blank" className="flex-1 flex items-center justify-center gap-3 py-5 bg-[#D4AF37] text-black text-[11px] font-black uppercase rounded-2xl hover:scale-105 transition-all">Download VSL</a>
                        <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex-1 flex items-center justify-center gap-3 py-5 bg-white/5 text-white text-[11px] font-black rounded-2xl border border-white/5">Ler Transcrição</a>
                        <button onClick={() => toggleFavorite(selectedOffer.id)} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-[11px] uppercase transition-all ${favorites.includes(selectedOffer.id) ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}><Star size={18} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> Salvar</button>
                    </div>
                </div>
                <div className="w-full lg:w-[35%] glass-card p-10 rounded-[40px] flex flex-col">
                    <h3 className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest mb-10 flex items-center gap-3"><ShieldCheck size={16}/> Inteligência Operacional</h3>
                    <div className="space-y-5 flex-1">
                        {[{ label: 'NICHO', value: selectedOffer.niche }, { label: 'TIPO', value: selectedOffer.productType }, { label: 'IDIOMA', value: selectedOffer.language }, { label: 'FONTE', value: selectedOffer.trafficSource.join(', ') }].map((item, idx) => (
                            <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-black text-gray-600 uppercase block mb-1">{item.label}</span>
                                <span className="text-white text-xs font-extrabold uppercase italic">{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 space-y-4">
                        <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 bg-[#D4AF37] text-black text-center text-[10px] font-black rounded-2xl transition-all hover:scale-105">Página Oficial</a>
                        <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full py-5 bg-white/5 text-gray-500 text-center text-[10px] font-black rounded-2xl border border-white/5">Ads Library</a>
                    </div>
                </div>
            </div>
            <div className="space-y-8">
                <h3 className="text-white font-black uppercase text-2xl tracking-tighter flex items-center gap-3"><ImageIcon className="text-[#D4AF37]" size={28}/> Criativos Elite</h3>
                <div className="grid-5-cols">
                    {selectedOffer.creativeEmbedUrls.map((url, i) => (
                        <div key={i} className="glass-card p-4 rounded-[32px] space-y-4 border-white/5">
                            <VideoPlayer url={url} />
                            <a href={selectedOffer.creativeDownloadUrls[i] || '#'} target="_blank" className="w-full py-3 bg-white/5 text-[#D4AF37] font-black text-[10px] uppercase rounded-xl text-center border border-[#D4AF37]/20 block hover:bg-[#D4AF37] hover:text-black transition-all">Download HD #{i+1}</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    switch(currentPage) {
        case 'home': return (
            <div className="animate-in fade-in duration-700 space-y-20">
                <section>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4 italic"><Zap className="text-[#D4AF37]" fill="currentColor"/> Operações Escalando</h2>
                    <div className="grid-5-cols">
                        {filtered.filter(o => o.trend.toLowerCase() === 'escalando').slice(0, 10).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4 italic"><Monitor className="text-[#D4AF37]"/> Rastreamento Recente</h2>
                    <div className="grid-5-cols">
                        {filtered.filter(o => recentlyViewed.includes(o.id)).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}
                    </div>
                </section>
            </div>
        );
        case 'offers': return <div className="grid-5-cols animate-in fade-in duration-700">{filtered.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}</div>;
        case 'organic': return <div className="grid-5-cols animate-in fade-in duration-700">{filtered.filter(o => o.productType.toLowerCase().includes('orgânico')).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}</div>;
        case 'favorites': return <div className="grid-5-cols animate-in fade-in duration-700">{offers.filter(o => favorites.includes(o.id)).map(o => <OfferCard key={o.id} offer={o} isFavorite={true} onToggleFavorite={(e) => toggleFavorite(o.id, e)} onClick={() => openOffer(o)} />)}</div>;
        default: return null;
    }
 };

 const toggleFavorite = (id: string, e?: React.MouseEvent) => { if (e) e.stopPropagation(); setFavorites(p => { const n = p.includes(id) ? p.filter(f => f !== id) : [...p, id]; if (agentId) localStorage.setItem(`favs_${agentId}`, JSON.stringify(n)); return n; }); };
 const navigateToPage = (p: string) => { setCurrentPage(p); setSelectedOffer(null); setIsMobileMenuOpen(false); };
 const openOffer = (o: Offer) => { setSelectedOffer(o); setRecentlyViewed(prev => [o.id, ...prev.filter(id => id !== o.id)].slice(0, 10)); window.scrollTo(0,0); };

 if (showRecuperar) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><button onClick={() => setShowRecuperar(false)} className="absolute top-10 left-10 text-[#D4AF37] uppercase text-xs font-black"><ArrowLeft className="inline mr-2" /> Voltar</button><div className="max-w-md w-full glass-card p-12 rounded-[40px] text-center border border-[#D4AF37]/20 shadow-[0_0_100px_rgba(212,175,55,0.1)]"><h2 className="text-3xl font-black text-white uppercase mb-4 tracking-tighter italic">RECUPERAR <span className="text-[#D4AF37]">ACESSO</span></h2><p className="text-gray-500 text-xs mb-10 leading-relaxed">Sua credencial de agente é enviada para o seu e-mail de compra. Se não encontrar, acione nosso canal seguro.</p><button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`)} className="w-full py-5 bg-[#D4AF37] text-black font-black rounded-2xl uppercase text-[10px]">Falar com Inteligência 007</button></div></div>;

 return (
  <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <>
     {isMobileMenuOpen && <div className="fixed inset-0 bg-black/95 z-[100] lg:hidden backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />}
     <aside className={`w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed h-screen z-[110] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-14 px-2"><div className="bg-[#D4AF37] p-2 rounded-2xl shadow-xl shadow-[#D4AF37]/20"><Eye className="text-black" size={24}/></div><span className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
            <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
                <SidebarItemIcon icon={HomeIcon} label="Dashboard" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} />
                <SidebarItemIcon icon={Star} label="Salvos por você" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} />
                <div className="pt-10 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-700 tracking-[0.4em] mb-5 italic">Módulos Inteligência</p>
                    <SidebarItemIcon icon={Tag} label="Banco de Ofertas" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} />
                    <SidebarItemIcon icon={Share2} label="Funis Orgânicos" active={currentPage === 'organic'} onClick={() => navigateToPage('organic')} />
                    <SidebarItemIcon icon={Video} label="Biblioteca VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} />
                    <SidebarItemIcon icon={Palette} label="Arsenal Criativos" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} />
                </div>
                <div className="pt-6 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-700 tracking-[0.4em] mb-5 italic">Ferramentas Pro</p>
                    <SidebarItemIcon icon={Library} label="Ads Library Global" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} />
                    <SidebarItemIcon icon={Puzzle} label="Extensão 007 Spy" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} />
                    <SidebarItemIcon icon={MessageCircle} label="Comunidade VIP" active={false} onClick={() => window.open(COMMUNITY_LINK, '_blank')} variant="gold" />
                </div>
            </nav>
            <div className="mt-8 pt-8 border-t border-white/5 space-y-1">
                <SidebarItemIcon icon={Settings} label="Meu Perfil" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} />
                <SidebarItemIcon icon={LogOut} label="Desativar Credencial" active={false} onClick={() => { setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); }} variant="danger" />
            </div>
        </div>
     </aside>
     <main className="flex-1 lg:ml-72 relative w-full overflow-x-hidden">
      <header className="py-8 flex flex-col px-4 md:px-12 bg-[#050505]/95 backdrop-blur-3xl sticky top-0 z-[80] border-b border-white/5 gap-8">
       <div className="flex items-center justify-between">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-2xl text-[#D4AF37] border border-white/10"><Menu size={24}/></button>
        <div className="hidden lg:flex flex-col"><h1 className="text-lg font-black uppercase tracking-tighter leading-none italic">{currentPage === 'home' ? 'Monitoramento Ativo' : currentPage.toUpperCase()}</h1><p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Status: Conexão Segura</p></div>
        <div className="flex items-center gap-3 bg-white/5 p-2 pr-6 rounded-2xl border border-white/5 shadow-2xl">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">007</div>
            <div><p className="font-black text-[10px] uppercase text-white leading-none">Agente</p><p className="text-[9px] text-[#D4AF37] font-black uppercase">{agentId}</p></div>
        </div>
       </div>
       {!selectedOffer && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
         <div className="relative group md:col-span-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16}/><input type="text" placeholder="Filtrar Arsenal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-[11px] font-bold uppercase text-white outline-none focus:border-[#D4AF37]/40 transition-all placeholder:text-gray-700" /></div>
         <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black uppercase text-gray-500 outline-none appearance-none hover:border-white/10 cursor-pointer">
            <option value="Todos" className="bg-black">Todos os Nichos</option>
            {Array.from(new Set(offers.map(o => o.niche))).map(n => <option key={n} value={n} className="bg-black">{n}</option>)}
         </select>
        </div>
       )}
      </header>
      <div className="p-4 md:p-12 max-w-[1900px] mx-auto min-h-screen pb-32">{renderMain()}</div>
     </main>
    </>
   ) : (
    <LandingPage onLogin={() => { const id = window.prompt("INSIRA SEU ID:"); if (id) checkLogin(id); }} onRecover={() => setShowRecuperar(true)} />
   )}
  </div>
 );
};

export default App;
