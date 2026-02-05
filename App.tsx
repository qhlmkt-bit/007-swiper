import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle, MessageCircle
} from 'lucide-react';
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

// --- CONFIGURAÇÃO SUPORTE ---
const WHATSAPP_NUMBER = "5500000000000"; // INSIRA SEU NÚMERO AQUI (Com 55 e DDD)

// --- COMPONENTES EXTERNOS (EVITA ERRO VERCEL) ---
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

const SidebarItem = ({ icon: Icon, label, active, onClick, variant = 'default' }: any) => (
 <button onClick={onClick} className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37] text-black font-black shadow-lg shadow-[#D4AF37]/20' : variant === 'gold' ? 'text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black' : variant === 'danger' ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}><Icon size={20} /><span className="text-sm uppercase tracking-tighter font-black">{label}</span></button>
);

const VideoPlayer = ({ url, type = 'vsl' }: any) => { 
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return (
    <div className="w-full aspect-video bg-[#0a0a0a] flex items-center justify-center border border-white/5 rounded-2xl relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <ZapOff size={32} className="text-gray-500 mb-4" />
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
        <source src={`${baseUrl}original`} type="video/mp4" />
      </video>
    );
  } else if (trimmed.includes('mp4')) {
    content = <video className="max-w-full max-h-[70vh] object-contain bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    content = <iframe className="w-full aspect-video" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }
  return <div className="w-full flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">{content}</div>;
};

// --- APP PRINCIPAL ---
const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [currentPage, setCurrentPage] = useState('home');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
 const [activeVslIndex, setActiveVslIndex] = useState(0);
 const [favorites, setFavorites] = useState<string[]>([]);
 const [searchQuery, setSearchQuery] = useState('');
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [activeNicheSelection, setActiveNicheSelection] = useState<string | null>(null);
 const [isSuccess, setIsSuccess] = useState(false);
 const [showRecuperar, setShowRecuperar] = useState(false);
 const [showAdmin, setShowAdmin] = useState(false);

 useEffect(() => {
    const savedId = localStorage.getItem('agente_token');
    if (savedId) checkLogin(savedId, true);
    fetchOffers();
 }, []);

 const fetchOffers = async () => {
   try {
    setLoading(true);
    const res = await fetch(CSV_URL);
    const text = await res.text();
    const parsed: Offer[] = text.split(/\r?\n/).slice(2).map((l, i) => {
     const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
     if (!v[1]) return null;
     return {
      id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: v[6] || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })).filter(link => link.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase(), creativeImages: []
     };
    }).filter((o): o is Offer => o !== null && o.status === 'ATIVO');
    setOffers([...parsed].reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
 };

 const checkLogin = async (id: string, silent = false) => {
    try {
        const docRef = doc(db, "agentes", id.toUpperCase().trim());
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().ativo) {
            setAgentId(id.toUpperCase()); setIsLoggedIn(true);
            localStorage.setItem('agente_token', id.toUpperCase());
        } else if (!silent) alert('Acesso Negado ❌');
    } catch (e) { console.error(e); }
 };

 const navigateToPage = (page: string) => { setCurrentPage(page); setSelectedOffer(null); setActiveNicheSelection(null); setIsMobileMenuOpen(false); };
 const openOffer = (offer: Offer) => { setSelectedOffer(offer); setActiveVslIndex(0); window.scrollTo(0,0); };

 const renderSupportPage = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in py-10">
        <div className="text-center space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Central <span className="text-[#D4AF37]">007</span></h2>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest italic">Escolha o canal de comunicação para sua missão</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 px-4">
            <div className="bg-[#121212] border border-white/5 p-8 rounded-[40px] space-y-6 hover:border-[#D4AF37]/50 transition-all group">
                <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500"><AlertTriangle size={32} /></div>
                <div><h3 className="text-white font-black uppercase italic text-xl">Reportar Falha</h3><p className="text-zinc-500 text-sm mt-2">Encontrou um link quebrado ou vídeo que não carrega? Avise nossa inteligência agora.</p></div>
                <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Agente%20007,%20identifiquei%20uma%20falha%20na%20oferta:%20${selectedOffer?.title || 'Geral'}`, '_blank')} className="w-full py-4 bg-white text-black font-black rounded-2xl uppercase italic text-sm hover:scale-105 transition-all">Acionar Suporte</button>
            </div>
            <div className="bg-[#121212] border border-white/5 p-8 rounded-[40px] space-y-6 hover:border-[#D4AF37]/50 transition-all group">
                <div className="bg-[#D4AF37]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#D4AF37]"><Zap size={32} /></div>
                <div><h3 className="text-white font-black uppercase italic text-xl">Sugerir Melhoria</h3><p className="text-zinc-500 text-sm mt-2">Tem alguma oferta em mente ou sugestão para a plataforma? Queremos ouvir você.</p></div>
                <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Agente%20007,%20tenho%20uma%20sugestão:%20`, '_blank')} className="w-full py-4 bg-[#D4AF37] text-black font-black rounded-2xl uppercase italic text-sm hover:scale-105 transition-all">Enviar Sugestão</button>
            </div>
        </div>
    </div>
 );

 if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
 if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;

 return (
  <div className="flex min-h-screen bg-[#0a0a0a] text-white">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   
   {!isLoggedIn && (
       <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá,%20tenho%20uma%20dúvida%20antes%20de%20assinar`, '_blank')} className="fixed bottom-8 right-8 z-[300] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"><MessageCircle size={32} /></button>
   )}

   {isLoggedIn ? (
    <>
     {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-[100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
     <aside className={`w-72 bg-[#121212] border-r border-white/5 fixed h-screen z-[110] transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-12"><div className="bg-[#D4AF37] p-2 rounded-xl"><Eye className="text-black" size={24} /></div><span className="text-2xl font-black italic uppercase leading-none">007 SWIPER</span></div>
            <nav className="space-y-1 flex-1 overflow-y-auto">
                <SidebarItem icon={HomeIcon} label="Home" active={currentPage === 'home' && !selectedOffer} onClick={() => navigateToPage('home')} />
                <SidebarItem icon={Star} label="SEUS FAVORITOS" active={currentPage === 'favorites'} onClick={() => navigateToPage('favorites')} />
                <div className="pt-8 pb-4"><p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Módulos VIP</p>
                <SidebarItem icon={Tag} label="OFERTAS" active={currentPage === 'offers'} onClick={() => navigateToPage('offers')} />
                <SidebarItem icon={Video} label="VSL" active={currentPage === 'vsl'} onClick={() => navigateToPage('vsl')} />
                <SidebarItem icon={Palette} label="CRIATIVOS" active={currentPage === 'creatives'} onClick={() => navigateToPage('creatives')} />
                <SidebarItem icon={FileText} label="PÁGINAS" active={currentPage === 'pages'} onClick={() => navigateToPage('pages')} />
                <SidebarItem icon={Library} label="BIBLIOTECA" active={currentPage === 'ads_library'} onClick={() => navigateToPage('ads_library')} /></div>
                <div className="pt-4 pb-4"><p className="px-5 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4 italic">Ferramentas</p>
                <SidebarItem icon={LifeBuoy} label="CENTRAL 007" active={currentPage === 'support'} onClick={() => navigateToPage('support')} variant="gold" />
                <SidebarItem icon={Puzzle} label="EXTENSÃO 007" active={currentPage === 'extension'} onClick={() => navigateToPage('extension')} />
                <SidebarItem icon={Settings} label="PAINEL DO AGENTE" active={currentPage === 'settings'} onClick={() => navigateToPage('settings')} /></div>
            </nav>
            <div className="mt-8"><SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => setIsLoggedIn(false)} variant="danger" /></div>
        </div>
     </aside>
     <main className="flex-1 lg:ml-72">
      <header className="py-8 px-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-50">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-[#121212] rounded-xl text-[#D4AF37]"><Menu size={24} /></button>
        <div className="flex-1"></div>
        <div className="bg-[#121212] px-6 py-2 rounded-full border border-white/5 flex items-center gap-3"><div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-xs">007</div><p className="text-[10px] font-black uppercase tracking-widest">{agentId}</p></div>
      </header>
      <div className="p-10 max-w-[1600px] mx-auto pb-32">
        {currentPage === 'support' ? renderSupportPage() : (
            selectedOffer ? (
                <div className="animate-in fade-in space-y-10">
                    <button onClick={() => setSelectedOffer(null)} className="flex items-center text-gray-500 hover:text-white font-black uppercase text-xs italic"><ArrowLeft size={16} className="mr-2" /> Voltar</button>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <VideoPlayer url={selectedOffer.vslLinks[activeVslIndex]?.url} type="vsl" />
                            <div className="grid grid-cols-2 lg:flex gap-3">
                                <a href={getFastDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#D4AF37] text-black text-[10px] font-black rounded-xl uppercase italic"><Download size={14} /> VSL LEVE</a>
                                <a href={getOriginalDownloadUrl(selectedOffer.vslDownloadUrl)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1a1a1a] text-zinc-400 text-[10px] font-black rounded-xl uppercase italic border border-white/5"><Video size={14} /> VSL ORIGINAL</a>
                                <a href={selectedOffer.transcriptionUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-[#1a1a1a] text-zinc-400 text-[10px] font-black rounded-xl uppercase italic border border-white/5"><FileText size={14} /> TRANSCRIÇÃO</a>
                                <button onClick={() => setFavorites(f => f.includes(selectedOffer.id) ? f.filter(x => x !== selectedOffer.id) : [...f, selectedOffer.id])} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase italic border ${favorites.includes(selectedOffer.id) ? 'bg-[#D4AF37] text-black' : 'border-white/5'}`}><Star size={14} fill={favorites.includes(selectedOffer.id) ? "currentColor" : "none"} /> FAVORITAR</button>
                            </div>
                            <div className="p-8 bg-[#121212] rounded-[32px] border border-white/5"><h3 className="text-[#D4AF37] font-black text-xs uppercase mb-4">Dossiê Técnico</h3><p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-line">{selectedOffer.description}</p></div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-[#121212] p-8 rounded-[32px] border border-white/5 space-y-6">
                                <h3 className="text-[#D4AF37] font-black uppercase text-xs italic">Informações</h3>
                                {[{icon: Tag, label: 'Nicho', value: selectedOffer.niche}, {icon: Lock, label: 'Tipo', value: selectedOffer.productType}].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1 p-4 bg-black/40 rounded-2xl"><span className="text-[10px] font-black uppercase text-zinc-600">{item.label}</span><span className="text-white font-black uppercase italic text-sm">{item.value}</span></div>
                                ))}
                                <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-5 bg-[#D4AF37] text-black text-center font-black rounded-2xl uppercase italic">Visualizar Página</a>
                            </div>
                        </div>
                    </div>
                    {/* CRIATIVOS COM AVISO */}
                    <div className="space-y-6">
                        <h3 className="text-white font-black uppercase text-xl italic flex items-center gap-3"><ImageIcon className="text-[#D4AF37]" /> CRIATIVOS</h3>
                        {selectedOffer.creativeEmbedUrls.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {selectedOffer.creativeEmbedUrls.map((url, i) => (
                                    <div key={i} className="bg-[#121212] p-4 rounded-2xl border border-white/5 space-y-4">
                                        <VideoPlayer url={url} type="creative" />
                                        <a href={getFastDownloadUrl(selectedOffer.creativeDownloadUrls[i] || '#')} target="_blank" className="block w-full py-3 bg-[#1a1a1a] text-[#D4AF37] text-center font-black text-[9px] rounded-xl border border-[#D4AF37]/20 uppercase italic">Download Criativo {i+1}</a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col items-center justify-center text-center">
                                <ZapOff size={48} className="text-gray-600 mb-6" /><p className="text-gray-500 font-black uppercase text-sm italic">ESSA OFERTA NÃO TEM CRIATIVOS EM VÍDEO</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                currentPage === 'vsl' ? <SelectionGrid items={Array.from(new Set(offers.map(o => o.niche)))} onSelect={(v:any) => setActiveNicheSelection(v)} Icon={Video} label="Central de VSL" /> :
                currentPage === 'creatives' ? <SelectionGrid items={Array.from(new Set(offers.map(o => o.niche)))} onSelect={(v:any) => setActiveNicheSelection(v)} Icon={Palette} label="Arsenal de Criativos" /> :
                <div className="animate-in fade-in space-y-12">
                    <h2 className="text-3xl font-black italic uppercase"><Zap className="text-[#D4AF37] inline mr-4" fill="currentColor" /> Operações em Escala</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {offers.filter(o => o.trend === 'Escalando').slice(0, 8).map(o => <OfferCard key={o.id} offer={o} isFavorite={favorites.includes(o.id)} onToggleFavorite={() => {}} onClick={() => openOffer(o)} />)}
                    </div>
                </div>
            )
        )}
      </div>
     </main>
    </>
   ) : (
    <LandingPage onLogin={() => checkLogin(window.prompt("ID Agente:") || "")} onRecover={() => setShowRecuperar(true)} onAdmin={() => setShowAdmin(true)} isSuccess={isSuccess} agentId={agentId} onDismissSuccess={() => setIsSuccess(false)} />
   )}
  </div>
 );
};

const LandingPage = ({ onLogin, onRecover, onAdmin }: any) => {
    // LÓGICA DE DUAS LANDINGPAGES (KIWIFY VS HOTMART)
    const params = new URLSearchParams(window.location.search);
    const isHotmart = params.get('src') === 'hotmart' || params.get('src') === 'afiliado';
    
    const checkoutLink = isHotmart ? "https://pay.hotmart.com/H104019113G" : "https://pay.kiwify.com.br/LINK_KIWIFY_REAL";

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-[#D4AF37] p-4 rounded-3xl mb-8"><Eye size={48} className="text-black" /></div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 max-w-4xl">ACESSE O MAIOR ARSENAL DE <span className="text-[#D4AF37]">OFERTAS ESCALADAS.</span></h1>
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <button onClick={() => window.open(checkoutLink, '_blank')} className="flex-1 py-5 bg-white text-black font-black rounded-2xl uppercase italic hover:scale-105 transition-all animate-btn-pulse">Quero Acesso Agora</button>
                <button onClick={onLogin} className="flex-1 py-5 bg-[#121212] border border-white/10 text-white font-black rounded-2xl uppercase italic hover:bg-white hover:text-black transition-all">Entrar</button>
            </div>
            <button onDoubleClick={onAdmin} className="mt-10 text-zinc-800 text-[10px] uppercase font-bold tracking-widest">Acesso Restrito</button>
        </div>
    );
};

export default App;
