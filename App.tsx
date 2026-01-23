import React, { useState, useEffect, useCallback } from 'react';
import { 
 Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Trophy, Download, Video, Zap, ZapOff, Globe, X, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Filter, Library, Loader2, Info, Files, Copy, Flame, ArrowLeft
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// --- CONFIGURAÇÃO FIREBASE ---
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

// --- CONSTANTES ---
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDp0QGfirNoQ8JIIFeb4p-AAIjYjbWSTMctxce21Ke7dn3HUHL3v4f5uTkTblnxQ/pub?output=csv';
const HOTMART_MENSAL = 'https://pay.hotmart.com/H104019113G?bid=1769103375372';
const HOTMART_TRIMESTRAL = 'https://pay.hotmart.com/H104019113G?off=fc7oudim';

// --- ESTILOS ORIGINAIS (RESTAURADOS) ---
const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 :root { --brand-gold: #D4AF37; --brand-dark: #0a0a0a; }
 body { font-family: 'Inter', sans-serif; background-color: var(--brand-dark); color: #ffffff; margin: 0; }
 .gold-text { color: #D4AF37; }
 .gold-border { border: 1px solid rgba(212, 175, 55, 0.3); }
 .btn-elite { background-color: #D4AF37; color: #000; font-weight: 900; text-transform: uppercase; transition: all 0.3s ease; }
 .btn-elite:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }
 @keyframes btnPulse { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
 .animate-btn-pulse { animation: btnPulse 2s infinite; }
`;

// --- TYPES & UTILS (RESTAURADOS) ---
export interface Offer {
 id: string; title: string; niche: string; language: string; trafficSource: string[]; productType: string; description: string; vslLinks: {label: string, url: string}[]; vslDownloadUrl: string; trend: string; facebookUrl: string; pageUrl: string; coverImage: string; views: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; addedDate: string; status: string;
}

const getDriveDirectLink = (url: string) => {
 if (!url) return '';
 const idMatch = url.match(/[-\w]{25,}/);
 return idMatch ? `https://lh3.googleusercontent.com/u/0/d/${idMatch[0]}` : url;
};

// --- COMPONENTES UI ---
const TrafficIcon = ({ source }: { source: string }) => {
 const n = source.toLowerCase();
 if (n.includes('facebook')) return <Facebook size={14} className="text-blue-500" />;
 if (n.includes('youtube')) return <Youtube size={14} className="text-red-500" />;
 if (n.includes('tiktok')) return <Smartphone size={14} className="text-pink-500" />;
 return <Target size={14} className="text-gold-text" />;
};

const VideoPlayer = ({ url }: { url: string }) => {
 if (!url) return <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-xs text-zinc-600">PREVIEW INDISPONÍVEL</div>;
 let embed = url;
 if (url.includes('youtube.com/watch?v=')) embed = url.replace('watch?v=', 'embed/');
 if (url.includes('vimeo.com/')) embed = `https://player.vimeo.com/video/${url.split('/').pop()}`;
 return <iframe className="w-full h-full" src={embed} frameBorder="0" allowFullScreen></iframe>;
};

// --- COMPONENTE LANDING PAGE (RESTAURADO) ---
const LandingPage = ({ onLogin }: any) => (
 <div className="w-full bg-[#0a0a0a] min-h-screen text-white flex flex-col items-center">
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
  <nav className="w-full max-w-7xl px-8 py-10 flex justify-between items-center">
   <div className="flex items-center gap-3"><Eye className="text-gold-text" size={32} /><span className="text-3xl font-black italic">007 SWIPER</span></div>
   <button onClick={onLogin} className="px-8 py-3 bg-gold-text text-black font-black rounded-full uppercase italic tracking-tighter hover:scale-105 transition-all">ENTRAR NO ARSENAL</button>
  </nav>
  <main className="max-w-7xl px-8 text-center mt-20 pb-40">
   <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-10">ACESSE AS OFERTAS QUE ESTÃO <span className="text-gold-text">ESCALANDO AGORA.</span></h1>
   <p className="text-xl text-zinc-400 max-w-4xl mx-auto mb-20 italic">O fim do achismo. Rastreie VSLs, criativos e funis validados nos maiores players do mercado digital.</p>
   
   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
    <div className="bg-zinc-900/50 p-12 rounded-[40px] border border-white/5 text-left">
     <h3 className="text-gold-text font-black text-xl mb-2 italic">PLANO MENSAL</h3>
     <p className="text-4xl font-black mb-10">R$ 197<span className="text-xs text-zinc-500">/mês</span></p>
     <button onClick={() => window.open(HOTMART_MENSAL)} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase italic hover:scale-105 transition-all">ASSINAR AGORA</button>
    </div>
    <div className="bg-white p-12 rounded-[40px] text-left scale-105 border-t-8 border-gold-text">
     <h3 className="text-gold-text font-black text-xl mb-2 italic">PLANO TRIMESTRAL</h3>
     <p className="text-4xl font-black text-black mb-10">R$ 497<span className="text-xs text-zinc-400">/trimestre</span></p>
     <button onClick={() => window.open(HOTMART_TRIMESTRAL)} className="w-full py-5 bg-black text-gold-text font-black rounded-2xl uppercase italic hover:scale-105 transition-all">ASSINAR COM DESCONTO</button>
    </div>
   </div>
  </main>
 </div>
);

// --- APP PRINCIPAL ---
const App = () => {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [agentId, setAgentId] = useState('');
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

 // Carrega Ofertas
 useEffect(() => {
  const fetchOffers = async () => {
   try {
    const res = await fetch(CSV_URL);
    const text = await res.text();
    const lines = text.split('\n').slice(2);
    const parsed = lines.map(line => {
     const v = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.trim().replace(/^"|"$/g, ''));
     return {
      id: v[0], title: v[1], niche: v[2], productType: v[3], description: v[4], coverImage: v[5], trend: v[6], views: v[7],
      vslLinks: v[8] ? [{label: 'VSL', url: v[8]}] : [], vslDownloadUrl: v[9], transcriptionUrl: v[10],
      creativeEmbedUrls: v[11] ? v[11].split(',') : [], creativeDownloadUrls: v[12] ? v[12].split(',') : [],
      facebookUrl: v[13], pageUrl: v[14], language: v[15], trafficSource: v[16] ? v[16].split(',') : [], status: v[19]
     } as Offer;
    }).filter(o => o.status?.toUpperCase() === 'ATIVO');
    setOffers(parsed.reverse());
   } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  
  const saved = localStorage.getItem('agente_token');
  if (saved) { setAgentId(saved); setIsLoggedIn(true); }
  fetchOffers();
 }, []);

 // Login Firebase
 const handleLogin = async () => {
  const id = window.prompt("🕵️ ACESSO AGENTE: Digite sua credencial:");
  if (!id) return;
  const cleanId = id.toUpperCase().trim();
  const docRef = doc(db, "agentes", cleanId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists() && docSnap.data().ativo === true) {
   setAgentId(cleanId);
   setIsLoggedIn(true);
   localStorage.setItem('agente_token', cleanId);
  } else {
   alert("❌ CREDENCIAL INVÁLIDA OU INATIVA.");
  }
 };

 if (!isLoggedIn) return <LandingPage onLogin={handleLogin} />;

 return (
  <div className="flex bg-[#0a0a0a] min-h-screen text-white">
   <style dangerouslySetInnerHTML={{ __html: STYLES }} />
   {/* SIDEBAR MANTIDA */}
   <aside className="w-64 border-r border-white/5 p-8 flex flex-col gap-10">
    <div className="flex items-center gap-2"><ShieldCheck className="text-gold-text" /> <span className="font-black italic">007 SWIPER</span></div>
    <nav className="flex flex-col gap-4">
      <button className="flex items-center gap-3 text-gold-text font-black uppercase text-xs tracking-widest"><HomeIcon size={18}/> Home</button>
      <button className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all font-black uppercase text-xs tracking-widest"><Tag size={18}/> Ofertas</button>
      <button className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all font-black uppercase text-xs tracking-widest"><Palette size={18}/> Criativos</button>
    </nav>
    <div className="mt-auto pt-10 border-t border-white/5">
      <p className="text-[10px] text-zinc-600 font-bold mb-2">AGENTE:</p>
      <p className="text-xs font-mono text-gold-text mb-6">{agentId}</p>
      <button onClick={() => {setIsLoggedIn(false); localStorage.removeItem('agente_token');}} className="text-red-500 text-xs font-black uppercase">Sair</button>
    </div>
   </aside>

   {/* DASHBOARD PRINCIPAL */}
   <main className="flex-1 p-10 overflow-y-auto">
    <header className="flex justify-between items-center mb-16">
      <h2 className="text-2xl font-black italic uppercase">Arsenal de Inteligência</h2>
      <div className="bg-zinc-900 px-6 py-3 rounded-full border border-white/5 flex items-center gap-3 w-96">
        <Search size={16} className="text-zinc-500" />
        <input type="text" placeholder="Pesquisar..." className="bg-transparent outline-none text-xs w-full" />
      </div>
    </header>

    {selectedOffer ? (
      <div className="animate-in fade-in duration-500">
        <button onClick={() => setSelectedOffer(null)} className="mb-10 text-zinc-500 hover:text-gold-text flex items-center gap-2 uppercase text-xs font-black"><ArrowLeft size={14}/> Voltar</button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-video bg-black rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
            <VideoPlayer url={selectedOffer.vslLinks[0]?.url} />
          </div>
          <div className="space-y-8">
            <h3 className="text-4xl font-black italic uppercase">{selectedOffer.title}</h3>
            <div className="flex flex-wrap gap-4">
              <a href={selectedOffer.vslDownloadUrl} className="px-8 py-4 bg-gold-text text-black font-black rounded-2xl text-xs uppercase italic flex items-center gap-2"><Download size={16}/> Baixar VSL</a>
              <a href={selectedOffer.transcriptionUrl} className="px-8 py-4 bg-zinc-800 text-white font-black rounded-2xl text-xs uppercase italic flex items-center gap-2 border border-white/5">Transcrição</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5"><p className="text-zinc-600 text-[10px] font-black uppercase mb-1">NICHO</p><p className="font-black italic text-gold-text">{selectedOffer.niche}</p></div>
              <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5"><p className="text-zinc-600 text-[10px] font-black uppercase mb-1">IDIOMA</p><p className="font-black italic text-gold-text">{selectedOffer.language}</p></div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? <p className="col-span-full text-center text-zinc-700 animate-pulse">Sincronizando dados...</p> : 
          offers.map(o => (
            <div key={o.id} onClick={() => setSelectedOffer(o)} className="bg-zinc-900 rounded-[32px] border border-white/5 p-2 overflow-hidden group cursor-pointer hover:border-gold-text/50 transition-all shadow-xl">
              <div className="aspect-video rounded-[26px] overflow-hidden mb-5 relative">
                <img src={getDriveDirectLink(o.coverImage)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black italic text-gold-text border border-gold-text/20 uppercase">{o.niche}</div>
              </div>
              <div className="p-4">
                <h4 className="font-black uppercase italic mb-4 truncate">{o.title}</h4>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <div className="flex gap-2 text-zinc-500 text-[10px] font-bold uppercase">{o.trafficSource.map((s, i) => <TrafficIcon key={i} source={s}/>)}</div>
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-gold-text transition-all" />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    )}
   </main>
  </div>
 );
};

export default App;
