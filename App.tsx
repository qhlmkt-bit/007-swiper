import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home as HomeIcon, Star, Search, LogOut, Lock, Download, Zap, ShieldCheck, CheckCircle, 
  Facebook, Youtube, Smartphone, Clock, Target, Loader2, ArrowLeft, LifeBuoy, FileText, 
  Eye, Play, ExternalLink, ImageIcon, Layout, ChevronRight, User, Copy
} from 'lucide-react';

// --- INTEGRAÇÃO FIREBASE OFICIAL (RESTAURADA) ---
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
export interface VslLink { label: string; url: string; }
export interface Offer {
  id: string; title: string; niche: string; productType: string; description: string; coverImage: string; trend: string; views: string; 
  vslLinks: VslLink[]; vslDownloadUrl: string; transcriptionUrl: string; creativeEmbedUrls: string[]; 
  creativeDownloadUrls: string[]; creativeZipUrl: string; facebookUrl: string; pageUrl: string; trafficSource: string[];
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const KIWIFY_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const KIWIFY_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; }
  body { font-family: 'Inter', sans-serif; background-color: #0a0a0a; color: #fff; margin: 0; }
  .font-spy { font-weight: 900; font-style: italic; letter-spacing: -0.05em; text-transform: uppercase; }
  .btn-gold { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #000; font-weight: 900; transition: all 0.3s ease; }
  .btn-gold:hover { transform: scale(1.05); filter: brightness(1.1); }
  @keyframes pulse-gold { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
  .animate-pulse-gold { animation: pulse-gold 2s infinite; }
`;

// --- COMPONENTE RECUPERAR ID (RESTAURADO) ---
const RecuperarID = ({ onBack }: any) => {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const buscarID = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(''); setResultado(null);
    try {
      const q = query(collection(db, "agentes"), where("email", "==", email.trim()));
      const snap = await getDocs(q);
      if (snap.empty) setErro('Credencial não encontrada.');
      else setResultado(snap.docs[0].id);
    } catch (err) { setErro('Erro na central.'); }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 animate-in fade-in duration-500">
      <button onClick={onBack} className="absolute top-10 left-10 text-[#D4AF37] font-spy text-xs flex items-center gap-2"><ArrowLeft size={16}/> Voltar</button>
      <div className="max-w-md w-full glass-card p-10 rounded-[40px] border border-white/10 bg-[#121212]">
        <h2 className="text-2xl font-spy text-[#D4AF37] mb-6">Recuperar Credencial</h2>
        <form onSubmit={buscarID} className="space-y-4">
          <input type="email" placeholder="seu@email.com" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-[#D4AF37]" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full py-5 btn-gold rounded-2xl font-spy">Consultar</button>
        </form>
        {resultado && <div className="mt-8 p-6 bg-black border border-[#D4AF37] rounded-2xl text-center"><p className="text-xs text-zinc-500 uppercase mb-2">Seu ID:</p><p className="text-3xl font-spy text-white">{resultado}</p></div>}
        {erro && <p className="mt-4 text-red-500 text-center font-bold italic">{erro}</p>}
      </div>
    </div>
  );
};

// --- COMPONENTE ADMIN (RESTAURADO) ---
const PainelAdmin = ({ onBack }: any) => {
  const [agentes, setAgentes] = useState<any[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, "agentes"), orderBy("data_ativacao", "desc"));
      const snap = await getDocs(q);
      setAgentes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }; fetch();
  }, []);
  return (
    <div className="min-h-screen bg-black p-10 animate-in fade-in duration-500">
      <button onClick={onBack} className="mb-10 text-[#D4AF37] font-spy text-xs flex items-center gap-2"><ArrowLeft size={16}/> Sair do Admin</button>
      <h1 className="text-4xl font-spy mb-10">Central de <span className="text-[#D4AF37]">Controle 007</span></h1>
      <div className="bg-[#121212] border border-white/10 rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 font-spy text-[10px] text-zinc-500"><tr className="border-b border-white/10"><th className="p-6">ID AGENTE</th><th className="p-6">E-MAIL</th><th className="p-6">DATA</th></tr></thead>
          <tbody className="text-sm font-bold italic">
            {agentes.map(a => <tr key={a.id} className="border-b border-white/5"><td className="p-6 text-[#D4AF37]">{a.id}</td><td className="p-6">{a.email}</td><td className="p-6 text-zinc-500">{a.data_ativacao?.split('T')[0]}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** * UTILS */
const getDriveDirectLink = (url: string) => {
  if (!url) return '';
  const idMatch = url.match(/[-\w]{25,}/);
  return idMatch ? `https://lh3.googleusercontent.com/u/0/d/${idMatch[0]}` : url;
};
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const vimeoId = url.match(/vimeo\.com\/([0-9]+)/);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId[1]}?badge=0&autopause=0&player_id=0&app_id=58479`;
  const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (ytId) return `https://www.youtube.com/embed/${ytId[1]}`;
  return url;
};

const OfferCard = ({ offer, index, isFavorite, onToggleFavorite, onClick }: any) => (
  <div onClick={onClick} className="bg-[#121212] rounded-[32px] overflow-hidden group cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500">
    <div className="relative aspect-video overflow-hidden">
      <img src={getDriveDirectLink(offer.coverImage)} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-4 left-4"><div className="px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-spy rounded">007 VIP</div></div>
      <button onClick={onToggleFavorite} className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md ${isFavorite ? 'bg-[#D4AF37] text-black' : 'bg-black/50 text-white'}`}><Star size={16} fill={isFavorite ? "currentColor" : "none"} /></button>
    </div>
    <div className="p-6"><h3 className="font-spy text-white text-lg truncate mb-4">{offer.title}</h3><div className="flex justify-between items-center pt-4 border-t border-white/5"><span className="text-[#D4AF37] text-[10px] font-spy">{offer.niche}</span><div className="flex gap-2 text-zinc-500 italic text-[10px] font-bold">{offer.trafficSource[0]}</div></div></div>
  </div>
);

const LandingPage = ({ onLogin, onRecuperar }: any) => (
  <div className="w-full bg-[#0a0a0a] min-h-screen">
    <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    <nav className="max-w-7xl px-8 py-10 flex justify-between items-center mx-auto">
      <div className="flex items-center space-x-3"><div className="bg-[#D4AF37] p-2 rounded-xl rotate-3"><Eye className="text-black" size={24} /></div><span className="text-2xl font-spy text-white">007 SWIPER</span></div>
      <div className="flex items-center gap-6">
        <button onClick={onRecuperar} className="text-zinc-500 font-spy text-[10px] hover:text-[#D4AF37]">Recuperar ID</button>
        <button onClick={() => onLogin()} className="px-8 py-3 btn-gold rounded-full text-xs font-spy"><Lock size={14} className="inline mr-2"/> Entrar</button>
      </div>
    </nav>
    <main className="max-w-7xl px-8 py-20 text-center mx-auto">
      <h1 className="text-5xl md:text-8xl font-spy text-white mb-8 leading-none">RASTREIE AS OFERTAS QUE ESTÃO <span className="text-[#D4AF37]">ESCALANDO MILHÕES.</span></h1>
      <p className="text-zinc-500 text-xl font-medium max-w-3xl mb-20 italic mx-auto leading-relaxed">Acesse criativos, VSLs e funis validados sem instabilidade. Seu dossiê de espionagem digital de elite.</p>
      
      {/* VIDEO PREVIEW - RESTORED */}
      <div className="w-full max-w-4xl mx-auto mb-32 relative group cursor-pointer aspect-video bg-[#121212] rounded-[40px] border border-white/10 flex items-center justify-center overflow-hidden">
        <Play size={64} className="text-[#D4AF37] animate-pulse-gold relative z-10" fill="currentColor"/>
        <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-32 text-left italic">
        <div className="bg-[#121212] p-12 rounded-[40px] border border-white/5">
          <h3 className="text-[#D4AF37] font-spy text-xl mb-4">PLANO MENSAL</h3>
          <p className="text-4xl font-spy mb-10">R$ 197 <span className="text-sm">/mês</span></p>
          <button onClick={() => window.open(KIWIFY_MENSAL)} className="w-full py-5 bg-white text-black font-spy rounded-2xl hover:bg-[#D4AF37] transition-all">ASSINAR MENSAL</button>
        </div>
        <div className="bg-white p-12 rounded-[40px] border-t-8 border-[#D4AF37] scale-105 shadow-2xl">
          <h3 className="text-[#D4AF37] font-spy text-xl mb-4">PLANO TRIMESTRAL</h3>
          <p className="text-4xl font-spy text-black mb-10">R$ 497 <span className="text-sm">/trimestre</span></p>
          <button onClick={() => window.open(KIWIFY_TRIMESTRAL)} className="w-full py-5 bg-black text-[#D4AF37] font-spy rounded-2xl animate-pulse-gold">ASSINAR TRIMESTRAL</button>
        </div>
      </div>

      {/* GUARANTEE - RESTORED */}
      <div className="bg-[#050505] border border-[#D4AF37]/30 rounded-[40px] p-16 flex flex-col md:flex-row items-center gap-12 text-left mb-32">
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[5px] border-[#D4AF37] flex flex-col items-center justify-center"><span className="text-[#D4AF37] text-7xl font-spy leading-none">7</span><p className="text-[#D4AF37] text-[10px] font-spy -mt-2">DIAS</p></div>
        <div className="flex-1 space-y-4">
          <h2 className="text-white text-4xl font-spy">GARANTIA INCONDICIONAL</h2>
          <p className="text-zinc-500 text-lg italic leading-relaxed">Se em até 7 dias você não sentir que os dados do <span className="text-white">007 Swiper</span> mudaram sua operação, devolvemos 100% do seu dinheiro. Risco zero.</p>
        </div>
      </div>

      <footer className="pt-20 border-t border-white/5 text-center">
        <p className="text-zinc-600 font-spy text-[10px] tracking-widest mb-10">© 2026 007 SWIPER Intelligence Group</p>
        <div onDoubleClick={() => onLogin('admin')} className="h-10 opacity-0 cursor-default">.</div>
      </footer>
    </main>
  </div>
);

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
    if (savedId) { setAgentId(savedId); setIsLoggedIn(true); }
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch(CSV_URL);
        const text = await res.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const parsed: Offer[] = lines.slice(2).map((l, i) => {
          const v = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, '').trim());
          if (!v[1]) return null;
          return { id: v[0] || String(i), title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5] || '', trend: v[6] || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL Principal', url: u.trim() })), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'Português', trafficSource: (v[16] || '').split(',').filter(Boolean), creativeZipUrl: v[17] || '#', } as Offer;
        }).filter((o): o is Offer => o !== null);
        setOffers(parsed.reverse());
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }; fetchOffers();
  }, []);

  const handleLogin = async (type = 'user') => {
    if (type === 'admin') { setShowAdmin(true); return; }
    const inputId = window.prompt("🕵️‍♂️ ACESSO À CENTRAL DE INTELIGÊNCIA\nDigite seu ID DO AGENTE:");
    if (inputId) {
      const cleanId = inputId.trim().toUpperCase();
      try {
        const docRef = doc(db, "agentes", cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().ativo === true) {
          setAgentId(cleanId); setIsLoggedIn(true); localStorage.setItem('agente_token', cleanId);
        } else { alert('IDENTIDADE NÃO RECONHECIDA OU INATIVA ❌'); }
      } catch (e) { console.error(e); }
    }
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);
  };

  if (showAdmin) return <PainelAdmin onBack={() => setShowAdmin(false)} />;
  if (showRecuperar) return <RecuperarID onBack={() => setShowRecuperar(false)} />;
  if (!isLoggedIn) return <LandingPage onLogin={handleLogin} onRecuperar={() => setShowRecuperar(true)} />;

  const filtered = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.niche.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <aside className="w-72 bg-[#050505] border-r border-white/5 p-8">
        <div className="flex items-center space-x-3 mb-16"><div className="bg-[#D4AF37] p-2 rounded-xl"><Eye size={24} className="text-black"/></div><span className="font-spy text-lg">007 SWIPER</span></div>
        <nav className="space-y-6">
          <div onClick={() => {setCurrentPage('home'); setSelectedOffer(null)}} className={`flex items-center gap-3 font-spy text-sm cursor-pointer ${currentPage === 'home' ? 'text-[#D4AF37]' : 'text-zinc-500'}`}><HomeIcon size={20}/> Dashboard</div>
          <div onClick={() => {setCurrentPage('favs'); setSelectedOffer(null)}} className={`flex items-center gap-3 font-spy text-sm cursor-pointer ${currentPage === 'favs' ? 'text-[#D4AF37]' : 'text-zinc-500'}`}><Star size={20}/> Favoritos</div>
        </nav>
        <div className="mt-auto pt-10 border-t border-white/5"><div onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} className="flex items-center gap-3 font-spy text-sm text-red-500 cursor-pointer"><LogOut size={20}/> Encerrar</div></div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-spy italic">INTELIGÊNCIA <span className="text-[#D4AF37]">007</span></h1>
          <input type="text" placeholder="RASTREAR..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-[#121212] border border-white/5 p-4 rounded-2xl w-80 font-spy text-xs focus:border-[#D4AF37] outline-none" />
        </header>

        {loading ? <div className="animate-pulse text-[#D4AF37] font-spy">Interceptando dados...</div> : selectedOffer ? (
          <div className="space-y-12 animate-in fade-in duration-500">
            <button onClick={() => setSelectedOffer(null)} className="text-zinc-500 font-spy text-xs flex items-center gap-2"><ArrowLeft size={16}/> Voltar ao Dashboard</button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 italic">
              <div className="lg:col-span-2 space-y-10">
                <div className="aspect-video bg-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                  <iframe className="w-full h-full" src={getEmbedUrl(selectedOffer.vslLinks[0]?.url)} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="bg-[#121212] p-10 rounded-[40px] border border-white/5 space-y-4">
                  <h3 className="text-[#D4AF37] font-spy">Dossiê Técnico</h3>
                  <p className="text-zinc-500 leading-relaxed italic">{selectedOffer.description || "Análise detalhada desta oferta em processamento."}</p>
                </div>
                <div className="space-y-6">
                  <h3 className="font-spy text-white">Arsenal de Criativos</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {selectedOffer.creativeEmbedUrls.map((url, idx) => (
                      <div key={idx} className="aspect-square bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden">
                        <iframe className="w-full h-full" src={getEmbedUrl(url)} frameBorder="0"></iframe>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-[#121212] p-8 rounded-[40px] border border-white/5 space-y-8">
                  <div className="space-y-1"><p className="text-[10px] text-zinc-500 font-spy">OPERADOR</p><p className="font-spy text-[#D4AF37]">{agentId}</p></div>
                  <div className="space-y-1"><p className="text-[10px] text-zinc-500 font-spy">ESTRUTURA</p><p className="font-spy">{selectedOffer.productType}</p></div>
                  <a href={selectedOffer.pageUrl} target="_blank" className="block w-full py-4 btn-gold rounded-2xl text-center font-spy text-xs">VISUALIZAR PÁGINA</a>
                  <a href={selectedOffer.facebookUrl} target="_blank" className="block w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-center font-spy text-xs">ADS LIBRARY</a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {(currentPage === 'home' ? filtered : filtered.filter(o => favorites.includes(o.id))).map((o, i) => (
              <OfferCard key={o.id} offer={o} index={i} isFavorite={favorites.includes(o.id)} onToggleFavorite={(e:any) => toggleFavorite(o.id, e)} onClick={() => setSelectedOffer(o)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
