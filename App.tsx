import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle, MessageCircle, Share2, Calendar
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

const LINKS = {
    KIWIFY: { MENSAL: "https://pay.kiwify.com.br/mtU9l7e", TRIMESTRAL: "https://pay.kiwify.com.br/ExDtrjE" },
    HOTMART: { MENSAL: "https://pay.hotmart.com/H104019113G?bid=1769103375372", TRIMESTRAL: "https://pay.hotmart.com/H104019113G?off=fc7oudim" }
};

const WHATSAPP_NUMBER = "5573981414083"; 
const SUPPORT_EMAIL = 'suporte@007swiper.com';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?output=csv';
const COMMUNITY_LINK = "https://chat.whatsapp.com/DVQrZLpHFR31KUgmPq6ibL";

type Trend = 'Escalando' | 'Em Alta' | 'Estável';
interface Offer {
  id: string; title: string; niche: string; productType: string; description: string; coverImage: string; trend: Trend; views: string; vslLinks: { label: string; url: string }[]; vslDownloadUrl: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; facebookUrl: string; pageUrl: string; language: string; trafficSource: string[]; creativeZipUrl: string; addedDate: string; status: string;
}

const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #050505; --brand-card: #0d0d0d; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; overflow-x: hidden; }
 .glass { background: rgba(15, 15, 15, 0.7); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.05); }
 .card-premium { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid rgba(255, 255, 255, 0.03); }
 .card-premium:hover { transform: translateY(-5px); border-color: rgba(212, 175, 55, 0.4); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.1); }
 .btn-gold { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #000; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
 .btn-gold:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.3); }
 .grid-5-cols { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1.5rem; }
 @media (min-width: 640px) { .grid-5-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
 @media (min-width: 1024px) { .grid-5-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
 @media (min-width: 1440px) { .grid-5-cols { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
 ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
`;

const getDriveDirectLink = (url: string) => { 
  if (!url) return ''; 
  const idMatch = url.match(/[-\w]{25,}/); 
  return idMatch ? `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w1000` : url; 
};

const VideoPlayer: React.FC<{ url: string; type?: 'vsl' | 'creative' }> = ({ url, type = 'vsl' }) => { 
  const trimmed = url?.trim() || '';
  if (!trimmed) return <div className="w-full aspect-video bg-zinc-900/50 rounded-xl flex items-center justify-center border border-white/5"><p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Mídia Indisponível</p></div>;

  // 🛡️ PROTEÇÃO: Se for imagem, renderiza imagem e não quebra o layout
  const isImg = trimmed.match(/\.(jpeg|jpg|gif|png|webp)$/i) || trimmed.includes('drive.google.com/thumbnail');
  
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">
      {isImg ? (
        <img src={trimmed} alt="Preview" className="w-full h-full object-contain" />
      ) : trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net') ? (
        <video className="w-full h-full object-contain" controls playsInline><source src={trimmed.replace(/playlist\.m3u8|play_720p\.mp4|original/, 'play_720p.mp4')} type="video/mp4" /></video>
      ) : (
        <iframe className="w-full h-full" src={trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed} frameBorder="0" allowFullScreen></iframe>
      )}
    </div>
  );
};

const OfferCard: React.FC<{ offer: Offer; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; onClick: () => void; }> = ({ offer, isFavorite, onToggleFavorite, onClick }) => {
 const dataOferta = offer.addedDate ? new Date(offer.addedDate + 'T00:00:00') : new Date();
 const diffDias = Math.floor((new Date().getTime() - dataOferta.getTime()) / (1000 * 60 * 60 * 24));
 
 return (
  <div onClick={onClick} className="glass card-premium rounded-[24px] overflow-hidden group cursor-pointer flex flex-col h-full">
   <div className="relative aspect-video overflow-hidden shrink-0">
    <img src={getDriveDirectLink(offer.coverImage)} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
     <div className={`px-2 py-1 text-[8px] font-black rounded-md uppercase flex items-center gap-1 ${diffDias <= 7 ? 'bg-[#D4AF37] text-black animate-pulse' : 'bg-black/60 text-gray-400 border border-white/10'}`}><Clock size={10} /> {diffDias <= 0 ? 'ADICIONADO HOJE' : `HÁ ${diffDias} DIAS`}</div>
     {offer.trend.toLowerCase() === 'escalando' && <div className="px-2 py-1 bg-green-600 text-white text-[8px] font-black rounded-md uppercase flex items-center gap-1 shadow-xl"><Zap size={10} fill="currentColor" /> Escalando</div>}
    </div>
    <div className="absolute top-3 right-3"><button onClick={onToggleFavorite} className={`p-2 rounded-xl backdrop-blur-md transition-all ${isFavorite ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-white hover:bg-[#D4AF37]'}`}><Star size={14} fill={isFavorite ? "currentColor" : "none"} /></button></div>
    <div className="absolute bottom-3 left-3"><div className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white text-[8px] font-bold rounded uppercase border border-white/5">{offer.niche}</div></div>
   </div>
   <div className="p-4 flex flex-col flex-1">
    <h3 className="font-extrabold text-white mb-2 line-clamp-2 text-sm tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors">{offer.title}</h3>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-500 text-[8px] uppercase font-bold bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-1"><Calendar size={10}/> Ativo há {diffDias > 0 ? diffDias : 1} dias</span>
      <span className="text-[#D4AF37] text-[8px] uppercase font-bold bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/20 flex items-center gap-1"><Flame size={10} className="animate-pulse"/> {offer.views || 'Scale'}</span>
    </div>
    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
     <div className="flex items-center gap-2">{offer.trafficSource.slice(0, 2).map((s, i) => <div key={i} className="p-1 bg-white/5 rounded"><Facebook size={10} className="text-blue-500"/></div>)}<span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{offer.productType}</span></div>
     <ChevronRight size={14} className="text-gray-800 group-hover:text-[#D4AF37]" />
    </div>
   </div>
  </div>
 );
};

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
 const [activeNicheSelection, setActiveNicheSelection] = useState<string | null>(null);

 // 🛡️ FILTRO UNIVERSAL (FIX PARA O BUG DA PESQUISA)
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
        } else if (!sil) alert('Acesso Negado.');
    } catch (e) { console.error(e); }
 };

 useEffect(() => {
  const tid = localStorage.getItem('agente_token'); if (tid) checkLogin(tid, true);
  const load = async () => {
   try {
    setLoading(true); const res = await fetch(CSV_URL); const text = await res.text();
    
    // 🛡️ PARSER DE CSV À PROVA DE BALAS (RegEx Robusto)
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const parsed: Offer[] = lines.slice(2).map((l, i) => {
        const v = l.split(regex).map(s => s.trim().replace(/^"|"$/g, '').trim());
        if (!v[1]) return null;
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

 const navigateToPage = (p: string) => { setCurrentPage(p); setSelectedOffer(null); setActiveNicheSelection(null); setIsMobileMenuOpen(false); };
 const openOffer = (o: Offer) => { setSelectedOffer(o); setRecentlyViewed(prev => [o.id, ...prev.filter(id => id !== o.id)].slice(0, 10)); window.scrollTo(0,0); };

 const renderMain = () => {
    if (loading) return <div className="flex flex-col items-center justify-center py-40 gap-4"><Loader2 className="animate-spin text-[#D4AF37]" size={48}/><p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Sincronizando Banco de Dados...</p></div>;
    
    if (selectedOffer) return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
            <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest gap-2"><ArrowLeft size={16}/> Voltar ao Dashboard</button>
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="w-full lg:w-[65%] space-y-6">
                    <div className="glass p-6 rounded-[32px] flex flex-col h-full">
                        <div className="flex bg-black/40 p-1.5 gap-2 overflow-x-auto rounded-2xl mb-6 scrollbar-hide shrink-0">
                            {selectedOffer.vslLinks.map((link, idx) => (
                                <button key={idx} onClick={() => setActiveVslIndex(idx)} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeVslIndex === idx ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>VSL {idx + 1}</button>
                            ))}
                        </div>
                        <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} />
                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 lg:flex gap-3">
                            <a href={selectedOffer.vslDownloadUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#D4AF37] text-black text-[10px] font-black uppercase rounded-2xl hover:scale-[1.02] transition-all shadow-xl"><Download size={14}/> Download VSL</a>
                            <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 text-gray-300 text-[10px] font-black uppercase rounded-2xl border border-white/5 hover:bg-white/10 transition-all"><FileText size={14}/> Transcrição</a>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[35%]">
                    <div className="glass p-8 rounded-[32px] h-full flex flex-col">
                        <h3 className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest mb-8 flex items-center gap-3"><ShieldCheck size={16}/> Inteligência Operacional</h3>
                        <div className="space-y-4 flex-1">
                            {[{ icon: Tag, label: 'Nicho', value: selectedOffer.niche }, { icon: Lock, label: 'Estratégia', value: selectedOffer.productType }, { icon: Globe, label: 'Idioma', value: selectedOffer.language }, { icon: Target, label: 'Origem', value: selectedOffer.trafficSource.join(', ') }].map((item, idx) => (
                                <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-white text-xs font-extrabold uppercase">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 space-y-3">
                            <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-4 bg-[#D4AF37] text-black text-center text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all">Página Oficial</a>
                            <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full py-4 bg-white/5 text-gray-500 text-center text-[10px] font-black uppercase rounded-xl border border-white/5">Ads Library</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6 pb-20">
                <h3 className="text-white font-black uppercase text-xl flex items-center gap-3"><ImageIcon className="text-[#D4AF37]"/> Principais Criativos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
                    {selectedOffer.creativeEmbedUrls.map((url, i) => (
                        <div key={i} className="glass p-4 rounded-[28px] space-y-4">
                            <VideoPlayer url={url} type="creative" />
                            <a href={selectedOffer.creativeDownloadUrls[i] || '#'} target="_blank" className="w-full py-2.5 bg-white/5 text-[#D4AF37] font-black text-[9px] uppercase rounded-lg text-center border border-[#D4AF37]/20 block">Download #{i+1}</a>
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
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4"><Zap className="text-[#D4AF37]" fill="currentColor"/> Operações em Escala</h2>
                    <div className="grid-5-cols">
                        {filtered.filter(o => o.trend.toLowerCase() === 'escalando').slice(0, 10).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => { e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id]); }} onClick={() => openOffer(o)} />)}
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4"><Monitor className="text-[#D4AF37]"/> Vistos Recentemente</h2>
                    <div className="grid-5-cols">
                        {filtered.filter(o => recentlyViewed.includes(o.id)).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => { e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id]); }} onClick={() => openOffer(o)} />)}
                    </div>
                </section>
            </div>
        );
        case 'offers': return <div className="grid-5-cols animate-in fade-in duration-700">{filtered.map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => { e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id]); }} onClick={() => openOffer(o)} />)}</div>;
        case 'organic': return <div className="grid-5-cols animate-in fade-in duration-700">{filtered.filter(o => o.productType.toLowerCase().includes('orgânico')).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e) => { e.stopPropagation(); setFavorites(p => p.includes(o.id) ? p.filter(f => f !== o.id) : [...p, o.id]); }} onClick={() => openOffer(o)} />)}</div>;
        default: return null;
    }
 };

 return (
  <div className="flex min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {isLoggedIn ? (
    <>
     {isMobileMenuOpen && <div className="fixed inset-0 bg-black/95 z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
     <aside className={`w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col fixed h-screen z-[110] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-12 px-2"><div className="bg-[#D4AF37] p-2 rounded-2xl shadow-xl"><Eye className="text-black" size={24}/></div><span className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">007 SWIPER</span></div>
            <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
                <SidebarItem icon={HomeIcon} label="Dashboard" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} />
                <SidebarItem icon={Star} label="Meus Favoritos" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} />
                <div className="pt-8 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-600 tracking-[0.4em] mb-4 italic">Módulos Inteligência</p>
                    <SidebarItem icon={Tag} label="Ofertas Ativas" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} />
                    <SidebarItem icon={Share2} label="Estratégia Orgânica" active={currentPage === 'organic'} onClick={() => navigateToPage('organic')} />
                    <SidebarItem icon={Video} label="Biblioteca VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} />
                    <SidebarItem icon={Palette} label="Criativos Elite" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} />
                </div>
                <div className="pt-4 pb-4"><p className="px-5 text-[8px] font-black uppercase text-gray-600 tracking-[0.4em] mb-4 italic">Ferramentas Pro</p>
                    <SidebarItem icon={Library} label="Ads Library" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} />
                    <SidebarItem icon={Puzzle} label="Extensão Spy" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} />
                    <SidebarItem icon={MessageCircle} label="Comunidade VIP" active={false} onClick={() => window.open(COMMUNITY_LINK, '_blank')} variant="gold" />
                </div>
            </nav>
            <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
                <SidebarItem icon={Settings} label="Configurações" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} />
                <SidebarItem icon={LogOut} label="Encerrar Sessão" active={false} onClick={() => { setIsLoggedIn(false); setAgentId(''); localStorage.removeItem('agente_token'); }} variant="danger" />
            </div>
        </div>
     </aside>
     <main className="flex-1 lg:ml-72 relative w-full">
      <header className="py-8 flex flex-col px-4 md:px-12 bg-[#050505]/95 backdrop-blur-3xl sticky top-0 z-[80] border-b border-white/5 gap-8">
       <div className="flex items-center justify-between">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-2xl text-[#D4AF37]"><Menu size={24}/></button>
        <div className="hidden lg:flex flex-col"><h1 className="text-xl font-black uppercase tracking-tighter leading-none">{currentPage === 'home' ? 'Monitoramento de Escala' : currentPage.toUpperCase()}</h1><p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">Operando em canal seguro</p></div>
        <div className="flex items-center gap-3 bg-white/5 p-2 pr-6 rounded-2xl border border-white/5 shadow-2xl">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">007</div>
            <div><p className="font-black text-[10px] uppercase tracking-tighter text-white leading-none">Agente Ativo</p><p className="text-[9px] text-[#D4AF37] font-black uppercase">{agentId}</p></div>
        </div>
       </div>
       {!selectedOffer && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
         <div className="relative group md:col-span-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-[#D4AF37] transition-colors" size={16}/><input type="text" placeholder="Filtrar Arsenal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-[11px] font-black uppercase text-white outline-none hover:border-white/20 transition-all placeholder:text-gray-700" /></div>
         <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black uppercase text-gray-400 outline-none cursor-pointer appearance-none hover:border-white/20">
            <option value="Todos" className="bg-black">Todos os Nichos</option>
            {Array.from(new Set(offers.map(o => o.niche))).map(n => <option key={n} value={n} className="bg-black">{n}</option>)}
         </select>
        </div>
       )}
      </header>
      <div className="p-4 md:p-12 max-w-[1800px] mx-auto min-h-screen pb-32">{renderMain()}</div>
     </main>
    </>
   ) : (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-black">
        <div className="max-w-md w-full glass p-10 rounded-[40px] text-center space-y-8 shadow-[0_0_100px_rgba(212,175,55,0.15)]">
            <div className="bg-[#D4AF37] w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl rotate-3"><Lock size={40} className="text-black"/></div>
            <div className="space-y-2"><h2 className="text-3xl font-black uppercase tracking-tighter italic">Credencial Requerida</h2><p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Insira sua identidade operacional para acessar o arsenal</p></div>
            <input type="text" placeholder="ID DO AGENTE" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-center font-black text-xl tracking-widest focus:border-[#D4AF37] outline-none transition-all uppercase" onKeyDown={(e) => { if (e.key === 'Enter') checkLogin(e.currentTarget.value); }} />
            <button className="w-full py-5 btn-gold rounded-2xl text-xs" onClick={() => { const id = window.prompt("Digite seu ID:"); if(id) checkLogin(id); }}>Acessar QG</button>
        </div>
    </div>
   )}
  </div>
 );
};

export default App;
