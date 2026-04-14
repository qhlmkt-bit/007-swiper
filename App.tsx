import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Home as HomeIcon, Star, Settings, Tag, Palette, FileText, Search, LogOut, ChevronRight, Monitor, Eye, Lock, Download, Video, Zap, ZapOff, Globe, ExternalLink, ImageIcon, Layout, TrendingUp, ShieldCheck, CheckCircle, Play, Facebook, Youtube, Smartphone, Clock, Target, Menu, Library, Loader2, Info, Copy, Flame, ArrowLeft, LifeBuoy, Puzzle, AlertTriangle, MessageCircle, Share2, Calendar } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore(initializeApp({ apiKey: "AIzaSyAF94806dAwkSvPJSVHglfYMm9vE1Rnei4", authDomain: "swiper-db-21c6f.firebaseapp.com", projectId: "swiper-db-21c6f", storageBucket: "swiper-db-21c6f.firebasestorage.app", messagingSenderId: "235296129520", appId: "1:235296129520:web:612a9c5444064ce5b11d35" }));
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?output=csv';
const WPP = "5573981414083";

type Offer = { id: string; title: string; niche: string; productType: string; description: string; coverImage: string; trend: string; views: string; vslLinks: {label: string; url: string}[]; vslDownloadUrl: string; transcriptionUrl: string; creativeEmbedUrls: string[]; creativeDownloadUrls: string[]; facebookUrl: string; pageUrl: string; language: string; trafficSource: string[]; addedDate: string; status: string; };

const STYLES = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap'); body { font-family: 'Plus Jakarta Sans', sans-serif; background: #050505; color: #fff; margin: 0; } .glass { background: rgba(15,15,15,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); } .gold-btn { background: linear-gradient(135deg, #D4AF37, #B8860B); color: #000; font-weight: 800; text-transform: uppercase; } .grid-5 { display: grid; gap: 1.5rem; grid-template-columns: repeat(1, 1fr); } @media(min-width:640px){.grid-5{grid-template-columns: repeat(2, 1fr)}} @media(min-width:1024px){.grid-5{grid-template-columns: repeat(3, 1fr)}} @media(min-width:1440px){.grid-5{grid-template-columns: repeat(5, 1fr)}}`;

const parseCSV = (t: string) => { const r: string[][] = []; let cur: string[] = []; let cell = '', q = false; for (let i = 0; i < t.length; i++) { const c = t[i], n = t[i + 1]; if (c === '"' && q && n === '"') { cell += '"'; i++; } else if (c === '"') q = !q; else if (c === ',' && !q) { cur.push(cell.trim()); cell = ''; } else if ((c === '\n' || c === '\r') && !q) { if (c === '\r' && n === '\n') i++; cur.push(cell.trim()); if (cur.length > 1) r.push(cur); cur = []; cell = ''; } else cell += c; } if (cell || cur.length > 0) { cur.push(cell.trim()); r.push(cur); } return r; };

const VideoPlayer = ({ url }: { url: string }) => {
  const t = url?.trim() || ''; if (!t) return <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center"><ZapOff className="text-zinc-600"/></div>;
  const isImg = t.match(/\.(jpeg|jpg|gif|png|webp)$/i) || t.includes('drive.google.com/thumbnail');
  return <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-white/5 flex items-center justify-center">{isImg ? <img src={t} className="w-full h-full object-contain"/> : <iframe className="w-full h-full" src={t.includes('youtube.com') ? `https://www.youtube.com/embed/${t.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : t.replace(/playlist\.m3u8|play_720p\.mp4|original/, 'play_720p.mp4')} frameBorder="0" allowFullScreen />}</div>;
};

const Card = ({ o, fav, onFav, onClick }: any) => {
  const dias = Math.floor((Date.now() - new Date(o.addedDate ? o.addedDate + 'T00:00:00' : Date.now()).getTime()) / 86400000);
  return (
    <div onClick={onClick} className="glass rounded-[24px] overflow-hidden group cursor-pointer flex flex-col hover:border-[#D4AF37]/40 hover:-translate-y-1 transition-all">
      <div className="relative aspect-video shrink-0"><img src={o.coverImage} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all" /><div className="absolute top-3 left-3 flex flex-col gap-1"><div className="px-2 py-1 text-[8px] font-black rounded uppercase bg-[#D4AF37] text-black"><Clock size={10} className="inline mr-1"/>{dias <= 0 ? 'NOVA' : `${dias} DIAS`}</div></div><button onClick={onFav} className="absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md bg-black/40 hover:bg-[#D4AF37]"><Star size={14} className={fav ? "text-[#D4AF37] fill-current" : "text-white"} /></button></div>
      <div className="p-4 flex flex-col flex-1"><h3 className="font-extrabold text-sm uppercase line-clamp-2 mb-2">{o.title}</h3><div className="flex gap-2 mb-3"><span className="text-[8px] bg-white/5 px-2 py-1 rounded text-gray-400">Scale: {o.views||'OK'}</span><span className="text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded">{o.trend}</span></div><div className="mt-auto border-t border-white/5 pt-3 flex justify-between text-[9px] text-gray-500 uppercase font-bold"><span>{o.productType}</span><ChevronRight size={14}/></div></div>
    </div>
  );
};

export default function App() {
  const [auth, setAuth] = useState({ logged: false, id: '', admin: false, rec: false });
  const [data, setData] = useState<{ offers: Offer[], view: Offer | null, cp: string, favs: string[], hist: string[], q: string, niche: string }>({ offers: [], view: null, cp: 'home', favs: [], hist: [], q: '', niche: 'Todos' });
  const [load, setLoad] = useState(true); const [menu, setMenu] = useState(false);

  useEffect(() => {
    const tid = localStorage.getItem('ag_tk'); if (tid) login(tid, true);
    fetch(CSV_URL).then(r => r.text()).then(t => {
      const rows = parseCSV(t).slice(2).filter(v => v[1] && v[1].toLowerCase() !== 'undefined');
      setData(d => ({ ...d, offers: rows.map((v, i) => ({ id: v[0] || `${i}`, title: v[1], niche: v[2] || 'Geral', productType: v[3] || 'Geral', description: v[4] || '', coverImage: v[5]?.match(/[-\w]{25,}/) ? `https://drive.google.com/thumbnail?id=${v[5].match(/[-\w]{25,}/)![0]}&sz=w1000` : v[5] || '', trend: (v[6] as Trend) || 'Estável', views: v[7] || '', vslLinks: (v[8] || '').split(',').map(u => ({ label: 'VSL', url: u.trim() })).filter(x => x.url), vslDownloadUrl: v[9] || '#', transcriptionUrl: v[10] || '#', creativeEmbedUrls: (v[11] || '').split(',').map(s => s.trim()).filter(Boolean), creativeDownloadUrls: (v[12] || '').split(',').map(s => s.trim()).filter(Boolean), facebookUrl: v[13] || '#', pageUrl: v[14] || '#', language: v[15] || 'BR', trafficSource: (v[16] || '').split(',').map(s => s.trim()).filter(Boolean), creativeZipUrl: v[17] || '#', addedDate: v[18] || '', status: (v[19] || '').toUpperCase() })).filter(o => o.status === 'ATIVO').reverse() }));
      setLoad(false);
    });
  }, []);

  const login = async (id: string, sil = false) => {
    const cid = id.toUpperCase().trim(); if (cid.length < 5) return;
    const snap = await getDoc(doc(db, "agentes", cid));
    if (snap.exists() && snap.data().ativo) { updateDoc(doc(db, "agentes", cid), { ultimo_acesso: serverTimestamp() }); setAuth(a => ({ ...a, logged: true, id: cid })); localStorage.setItem('ag_tk', cid); setData(d => ({ ...d, favs: JSON.parse(localStorage.getItem(`f_${cid}`) || '[]'), hist: JSON.parse(localStorage.getItem(`h_${cid}`) || '[]') })); } else if (!sil) alert('ID Inválido.');
  };

  const filtered = useMemo(() => data.offers.filter(o => (o.title.toLowerCase().includes(data.q.toLowerCase()) || o.niche.toLowerCase().includes(data.q.toLowerCase())) && (data.niche === 'Todos' || o.niche === data.niche)), [data.offers, data.q, data.niche]);
  const action = (act: string, p?: any) => {
    if (act === 'nav') { setData(d => ({ ...d, cp: p, view: null })); setMenu(false); }
    if (act === 'view') { setData(d => { const h = [p.id, ...d.hist.filter(x => x !== p.id)].slice(0,10); localStorage.setItem(`h_${auth.id}`, JSON.stringify(h)); return { ...d, view: p, hist: h }; }); window.scrollTo(0,0); }
    if (act === 'fav') { setData(d => { const f = d.favs.includes(p) ? d.favs.filter(x => x !== p) : [...d.favs, p]; localStorage.setItem(`f_${auth.id}`, JSON.stringify(f)); return { ...d, favs: f }; }); }
  };

  if (!auth.logged) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center text-white"><style dangerouslySetInnerHTML={{ __html: STYLES }} /><nav className="w-full max-w-7xl p-8 flex justify-between"><div className="flex items-center gap-3"><div className="bg-[#D4AF37] p-2 rounded-xl"><Eye className="text-black"/></div><span className="text-2xl font-black italic">007 SWIPER</span></div><button onClick={() => {const id = prompt("ID:"); if(id) login(id);}} className="px-6 py-2 bg-[#D4AF37] text-black font-black rounded-full uppercase">Entrar</button></nav><main className="text-center mt-20 px-4 max-w-4xl"><h1 className="text-5xl md:text-7xl font-black mb-8 italic text-[#D4AF37]">ARSENAL MILIONÁRIO</h1><p className="text-gray-400 text-xl mb-16">O sistema de inteligência que rastreia os funis de alta conversão em tempo real.</p><div className="flex justify-center gap-8"><button onClick={() => window.open(LINKS.KIWIFY.MENSAL)} className="px-8 py-4 bg-white text-black font-black rounded-2xl uppercase">Assinar Mensal</button><button onClick={() => window.open(LINKS.KIWIFY.TRIMESTRAL)} className="px-8 py-4 gold-btn rounded-2xl uppercase">Assinar Elite (Tri)</button></div></main></div>
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {menu && <div className="fixed inset-0 bg-black/90 z-40 lg:hidden" onClick={() => setMenu(false)} />}
      <aside className={`w-72 bg-[#0a0a0a] border-r border-white/5 fixed h-screen z-50 transition-transform ${menu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col p-6`}>
        <div className="flex items-center gap-3 mb-10"><div className="bg-[#D4AF37] p-2 rounded-xl"><Eye className="text-black"/></div><span className="text-xl font-black italic">007 SWIPER</span></div>
        <nav className="space-y-2 flex-1 overflow-y-auto"><button onClick={() => action('nav', 'home')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase"><HomeIcon size={16}/> Dashboard</button><button onClick={() => action('nav', 'offers')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase"><Tag size={16}/> Ofertas</button><button onClick={() => action('nav', 'organic')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase"><Share2 size={16}/> Orgânico</button></nav>
        <button onClick={() => { setAuth(a=>({...a, logged: false})); localStorage.removeItem('ag_tk'); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 font-bold text-xs uppercase"><LogOut size={16}/> Sair</button>
      </aside>
      <main className="flex-1 lg:ml-72 p-8 max-w-[1900px] mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between gap-4 mb-10"><button onClick={()=>setMenu(true)} className="lg:hidden p-2 bg-white/5 rounded-xl"><Menu/></button><div className="flex-1 flex gap-4"><div className="relative flex-1 max-w-md"><Search className="absolute left-4 top-3 text-gray-500" size={16}/><input type="text" placeholder="Buscar..." value={data.q} onChange={e=>setData(d=>({...d, q: e.target.value}))} className="w-full bg-white/5 rounded-xl pl-12 py-3 text-xs outline-none" /></div><select value={data.niche} onChange={e=>setData(d=>({...d, niche: e.target.value}))} className="bg-white/5 rounded-xl px-4 py-3 text-xs outline-none"><option value="Todos" className="bg-black">Todos os Nichos</option>{Array.from(new Set(data.offers.map(o=>o.niche))).map(n=><option key={n} value={n} className="bg-black">{n}</option>)}</select></div></header>
        {load ? <div className="py-40 text-center"><Loader2 className="animate-spin mx-auto mb-4 text-[#D4AF37]"/>Sincronizando...</div> : data.view ? (
          <div className="space-y-10"><button onClick={()=>action('nav', data.cp)} className="flex items-center gap-2 text-gray-500 hover:text-white uppercase text-xs font-bold"><ArrowLeft size={16}/> Voltar</button>
            <div className="flex flex-col lg:flex-row gap-8"><div className="flex-1 glass p-6 rounded-3xl"><VideoPlayer url={data.view.vslLinks[0]?.url} /><div className="flex gap-4 mt-6"><a href={data.view.vslDownloadUrl} target="_blank" className="flex-1 text-center py-4 bg-[#D4AF37] text-black font-black uppercase rounded-xl">Download</a><button onClick={()=>action('fav', data.view!.id)} className="flex-1 py-4 bg-white/5 font-black uppercase rounded-xl border border-white/5">Salvar</button></div></div></div>
          </div>
        ) : (
          <div className="grid-5">{filtered.map(o => <Card key={o.id} o={o} fav={data.favs.includes(o.id)} onFav={(e:any)=>{e.stopPropagation(); action('fav', o.id);}} onClick={()=>action('view', o)} />)}</div>
        )}
      </main>
    </div>
  );
}
