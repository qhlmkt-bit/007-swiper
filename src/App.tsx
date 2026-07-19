import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Sparkles, HelpCircle, HomeIcon, 
  ShieldCheck, MessageCircle, Search, Star, FileText, ExternalLink,
  FolderOpen, Youtube, Facebook, Target, Radar, Download, Briefcase, Puzzle,
  RefreshCw, TrendingUp, Layers, Activity, Globe, CheckCircle2, Terminal, LogOut, Video
} from 'lucide-react';
import { OfferDetails } from './components/OfferDetails';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdLibrary } from './components/AdLibrary';


const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?output=csv';
const ORGANIC_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6N1u2xV-Of_muP_LJY9OGC77qXDOJ254TVzwpYAb-Ew8X-6-ZL3ZurlTiAwy19w/pub?gid=512156750&single=true&output=csv';
const COMMUNITY_LINK = "https://chat.whatsapp.com/DVQrZLpHFR31KUgmPq6ibL";

// --- UTILS ---
const getDriveDirectLink = (url: string) => { 
  if (!url) return '';
  let trimmed = url.replace(/["']/g, "").trim();
  if (trimmed.includes(',')) {
    trimmed = trimmed.split(',')[0].trim();
  }
  if (trimmed.includes('drive.google.com')) { 
    const idMatch = trimmed.match(/[-\w]{25,}/); 
    if (idMatch) return `https://drive.google.com/thumbnail?id=${idMatch[0]}&sz=w1000`; 
  } 
  return trimmed; 
};

const TrafficIcon: React.FC<{ source: string }> = ({ source }) => { 
    const normalized = source.toLowerCase().trim(); 
    if (normalized.includes('facebook')) return <Facebook size={12} className="text-blue-500" />; 
    if (normalized.includes('youtube') || normalized.includes('google')) return <Youtube size={12} className="text-red-500" />; 
    if (normalized.includes('tiktok')) return <Smartphone size={12} className="text-pink-500" />; 
    return <Target size={12} className="text-[#D4AF37]" />; 
};

const getTrafficBadgeStyle = (source: string) => {
  const normalized = source.toLowerCase().trim();
  if (normalized.includes('facebook')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (normalized.includes('youtube') || normalized.includes('google')) return 'bg-red-500/10 text-red-400 border-red-500/20';
  if (normalized.includes('tiktok')) return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
};

const getFastDownloadUrl = (url: string) => {
  if (!url) return '';
  const trimmed = url.replace(/["']/g, "").trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'play_480p.mp4');
    if (trimmed.endsWith('original')) return trimmed.replace('original', 'play_480p.mp4');
  }
  return trimmed;
};

const VideoPlayerMini: React.FC<{ url: string }> = ({ url }) => {
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return <div className="w-full h-full bg-[#050505] flex items-center justify-center text-zinc-600 text-[10px] uppercase font-semibold">Sem Mídia</div>;
  
  if (trimmed.match(/\.(jpeg|jpg|gif|png|webp)$/i) || trimmed.includes('drive.google.com/thumbnail') || trimmed.includes('drive.google.com/file')) {
    return <img src={getDriveDirectLink(trimmed) || trimmed} alt="Preview" loading="lazy" className="w-full h-full object-contain bg-black" />;
  } else if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    let baseUrl = trimmed.replace(/playlist\.m3u8|play_720p\.mp4|play_480p\.mp4|play_360p\.mp4|original/, '');
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    return (
      <video className="w-full h-full object-contain bg-black" controls playsInline controlsList="nodownload">
        <source src={`${baseUrl}play_480p.mp4`} type="video/mp4" />
        <source src={`${baseUrl}play_360p.mp4`} type="video/mp4" />
      </video>
    );
  } else if (trimmed.includes('.mp4') || trimmed.includes('.m3u8') || trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    return <video className="w-full h-full object-contain bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    return <iframe className="w-full h-full" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }
};


const parseCSV = (csvText: string): string[][] => {
  const lines: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      row.push(current.trim());
      lines.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (row.length > 0 || current !== '') {
    row.push(current.trim());
    lines.push(row);
  }
  return lines;
};

const convertSocialToEmbed = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();

  // YouTube Shorts
  if (trimmed.includes('youtube.com/shorts/') || trimmed.includes('youtu.be/shorts/')) {
    const match = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // Instagram Reels
  if (trimmed.includes('instagram.com/')) {
    const match = trimmed.match(/\/(?:p|reel|reels)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://www.instagram.com/reel/${match[1]}/embed/`;
    }
  }

  // TikTok
  if (trimmed.includes('tiktok.com/')) {
    const match = trimmed.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
  }

  return trimmed;
};

const getEngagementLevel = (views: string) => {
  if (!views) return '🔥 ALTA';
  const clean = views.toLowerCase().trim();
  if (clean.includes('m') || (parseFloat(clean) >= 1000000)) {
    return '🔥 CRÍTICO';
  }
  if (clean.includes('k') || parseFloat(clean) >= 100000) {
    return '📈 EM ALTA';
  }
  return '🟢 ESTÁVEL';
};





// --- NOVO CARD MINIMALISTA (TAGS) ---
const OfferCard = ({ offer, onClick, isFavorite, onFavoriteToggle }: { offer: any; onClick?: () => void; isFavorite?: boolean; onFavoriteToggle?: (e: React.MouseEvent) => void }) => {
    return (
        <div onClick={onClick} className="bg-[#0a0a0a] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col h-full relative cursor-pointer rounded-lg overflow-hidden group font-sans antialiased">
            <div className="relative aspect-video overflow-hidden shrink-0 bg-[#050505]">
                <img src={getDriveDirectLink(offer.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={offer.title} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                    <button 
                        className={`p-1.5 rounded border backdrop-blur-md transition-all ${isFavorite ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white border-white/10'}`} 
                        onClick={(e) => { e.stopPropagation(); onFavoriteToggle?.(e); }}
                        title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                    >
                        <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button className="p-1.5 bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white rounded border border-white/10 backdrop-blur-md transition-colors" onClick={(e) => { e.stopPropagation(); }}><FolderOpen size={14} /></button>
                </div>
            </div>
            
            <div className="p-3 flex flex-col flex-1">
                {/* Sistema de Tags Limpo e Alinhado Horizontalmente */}
                <div className="flex flex-row flex-nowrap items-center gap-1 mb-3 overflow-hidden w-full">
                    {(offer.trafficSource || []).slice(0, 1).map((s: string, idx: number) => (
                        <span key={idx} className={`inline-flex items-center gap-1 text-[8px] uppercase font-semibold tracking-normal px-1.5 py-0.5 rounded-full border shrink-0 max-w-[65px] whitespace-nowrap overflow-hidden ${getTrafficBadgeStyle(s)}`} title={s}>
                            <span className="shrink-0"><TrafficIcon source={s} /></span>
                            <span className="truncate">{s}</span>
                        </span>
                    ))}
                    {offer.niche && (
                        <span className="inline-flex items-center text-[8px] uppercase font-semibold tracking-normal bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded-full shrink-0 max-w-[65px] whitespace-nowrap overflow-hidden" title={offer.niche}>
                            <span className="truncate">{offer.niche}</span>
                        </span>
                    )}
                    {offer.productType && (
                        <span className="inline-flex items-center text-[8px] uppercase font-semibold tracking-normal bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-full shrink-0 max-w-[65px] whitespace-nowrap overflow-hidden" title={offer.productType}>
                            <span className="truncate">{offer.productType}</span>
                        </span>
                    )}
                    {offer.language && (
                        <span className="inline-flex items-center text-[8px] uppercase font-semibold tracking-normal bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0 max-w-[45px] whitespace-nowrap overflow-hidden" title={offer.language}>
                            <span className="truncate">{offer.language}</span>
                        </span>
                    )}
                </div>
                
                <h3 className="font-semibold text-zinc-200 mb-1 line-clamp-2 text-xs uppercase tracking-normal break-all overflow-hidden mt-auto font-sans antialiased" title={offer.title}>
                    {offer.title}
                </h3>
            </div>
        </div>
    );
};

// Removed Laboratory AI dashboards


// --- APP PRINCIPAL ---
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('swiper_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [currentModule, setCurrentModule] = useState('home');
  const [currentPage, setCurrentPage] = useState<string>('dashboard'); 
  const [offers, setOffers] = useState<any[]>([]);

  // Unused States and useEffect removed

  // Filtros e Sub-menus
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNiche, setFilterNiche] = useState('Todos');
  const [filterType, setFilterType] = useState('Todos');
  const [filterPlatform, setFilterPlatform] = useState('Todos');
  const [filterLanguage, setFilterLanguage] = useState('Todos');
  const [activeSubTab, setActiveSubTab] = useState('OFERTAS'); // OFERTAS, CRIATIVOS, VSL's, PÁGINAS
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  // States do Módulo de Virais Orgânicos
  const [activeViralTab, setActiveViralTab] = useState('TIKTOK');
  const [viralNiche, setViralNiche] = useState('Todos');
  const [organicVideos, setOrganicVideos] = useState<any[]>([]);

  // Favorites State with persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('swiper_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('swiper_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteToggle = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Sync selectedOffer with browser history for native back button support
  useEffect(() => {
    if (selectedOffer) {
      if (window.location.hash !== '#offer') {
        window.history.pushState({}, '', '#offer');
      }
    } else {
      if (window.location.hash === '#offer') {
        window.history.back();
      }
    }
  }, [selectedOffer]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#offer') {
        setSelectedOffer(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);




  // Estados do Interceptador
  const [interceptorUrl, setInterceptorUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<boolean>(false);
  const [scanPhase, setScanPhase] = useState(0);
  const [interceptData, setInterceptData] = useState<{
    checkoutText: string;
    pixelId: string;
    hosting: string;
    statusText: string;
    badgeStyle: string;
  } | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(CSV_URL);
        const text = await res.text();
        
        const rows = parseCSV(text);
        
        const data = rows.slice(2).map((v, i) => {
            if (!v[1] || v[1].trim() === '') return null;
            const statusVal = (v[19] || '').trim().toUpperCase();
            if (statusVal !== 'ATIVO') return null; // Strictly active status rows only
            
            return {
                id: v[0] || String(i),
                title: v[1] || '',
                niche: v[2] || '',
                productType: v[3] || 'Geral',
                description: v[4] || '',
                coverImage: v[5] || '',
                trend: v[6] || '',
                views: v[7] || '',
                vslEmbedUrl: v[8] || '',
                vslDownloadUrl: v[9] || '',
                transcriptionUrl: v[10] || '',
                creativeEmbedUrls: v[11] || '',
                creativeDownloadUrls: v[12] || '',
                facebookUrl: v[13] || '',
                pageUrl: v[14] || '',
                language: v[15] || 'PT-BR',
                trafficSource: (v[16] || 'facebook').split(',').map((s: string) => s.trim()),
                creativeZipUrl: v[17] || '',
                status: statusVal,
                vslLinks: v[8] ? v[8].split(',').map((url: string) => ({ url: url.trim() })) : []
            };
        }).filter(o => o !== null) as any[];
        
        // Reverse sort so latest entries appear first
        setOffers(data.reverse());

      } catch (e) { console.error(e); }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchOrganicVideos = async () => {
      try {
        const res = await fetch(ORGANIC_CSV_URL);
        const text = await res.text();
        const rows = parseCSV(text);
        
        const data = rows.slice(1).map((v, i) => {
          if (!v[1] || v[1].trim() === '') return null;
          const statusVal = (v[0] || '').trim().toUpperCase();
          if (statusVal !== 'ATIVO') return null;
          
          return {
            id: v[3] || String(i),
            status: statusVal,
            platform: (v[1] || '').trim().toUpperCase(),
            niche: v[2] || '',
            linkVideo: v[3] || '',
            embedUrl: convertSocialToEmbed(v[3] || ''),
            views: v[4] || '',
            hook: v[5] || '',
            engagement: getEngagementLevel(v[4] || '')
          };
        }).filter(v => v !== null) as any[];
        
        setOrganicVideos(data.reverse());
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrganicVideos();
  }, []);

  // Reset filters and selected offer when switching pages or modules
  useEffect(() => {
    setSelectedOffer(null);
    setSearchQuery('');
    setFilterNiche('Todos');
    setFilterType('Todos');
    setFilterPlatform('Todos');
    setFilterLanguage('Todos');
    setActiveSubTab('OFERTAS');
    setActiveViralTab('TIKTOK');
    setViralNiche('Todos');
  }, [currentPage, currentModule]);





  const handleScan = async () => {
    if(!interceptorUrl) return;
    setIsScanning(true);
    setScanResult(false);
    setInterceptData(null);
    setScanPhase(0);

    // Terminal loading simulation phases
    setTimeout(() => setScanPhase(1), 800);
    setTimeout(() => setScanPhase(2), 1600);
    setTimeout(() => setScanPhase(3), 2400);

    try {
      const response = await fetch('/api/intercept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: interceptorUrl })
      });

      const data = await response.json();
      
      // Wait for the full tactical scan animation before rendering results
      setTimeout(() => {
        setInterceptData(data);
        setIsScanning(false);
        setScanResult(true);
      }, 3500);
    } catch (error) {
      console.error("Erro no interceptador de URL:", error);
      setTimeout(() => {
        setInterceptData({
          checkoutText: 'Erro ao conectar (Bloqueio de CORS/Rede)',
          pixelId: 'Inacessível',
          hosting: 'Desconhecido / Protegido',
          statusText: '⚠️ CONEXÃO BLOQUEADA',
          badgeStyle: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
        });
        setIsScanning(false);
        setScanResult(true);
      }, 3500);
    }
  };

  const renderContent = () => {
    // Admin Dashboard Route Protection
    if (currentPage === 'admin_dashboard' || currentModule === 'admin') {
      if (!isAuthenticated) {
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center border border-white/5 rounded-xl bg-[#0a0a0a]">
            <ShieldCheck size={48} className="text-[#D4AF37] mb-6 opacity-50" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Acesso Restrito</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold max-w-md">Você precisa estar autenticado para acessar este painel.</p>
          </div>
        );
      }
      return (
        <AdminDashboard 
          onBack={() => {
            setCurrentPage('dashboard');
            setCurrentModule('home');
          }} 
        />
      );
    }

    if (currentModule === 'swiper') {

        if (currentPage === 'cofre' || currentPage === 'favoritos') {
            if (selectedOffer) {
                return (
                    <div className="animate-in fade-in pb-20 font-sans antialiased">
                        <OfferDetails 
                            offer={selectedOffer} 
                            onBack={() => setSelectedOffer(null)} 
                            isFavorite={favorites.includes(selectedOffer.id)}
                            onFavoriteToggle={() => handleFavoriteToggle(selectedOffer.id)}
                        />
                    </div>
                );
            }

            // Extrair valores únicos normalizados para os dropdowns
            const uniqueNiches = ['Todos', ...Array.from(new Set(offers.map(o => o.niche?.trim().toUpperCase()).filter(Boolean)))];
            const uniqueTypes = ['Todos', ...Array.from(new Set(offers.map(o => o.productType?.trim().toUpperCase()).filter(Boolean)))];
            const uniquePlatforms = ['Todos', ...Array.from(new Set(offers.flatMap(o => o.trafficSource || []).map(s => s.trim().toUpperCase()).filter(Boolean)))];
            const uniqueLanguages = ['Todos', ...Array.from(new Set(offers.map(o => o.language?.trim().toUpperCase()).filter(Boolean)))];

            // Lógica de Filtro Multi-Nível + Sub-Tabs Funcionais
            const filteredOffers = offers.filter(o => {
                // If we are on favorites page, strictly show favorited items only
                if (currentPage === 'favoritos' && !favorites.includes(o.id)) {
                    return false;
                }

                // 1. Text Search (title or niche or description or productType or platform)
                const search = searchQuery.toLowerCase().trim();
                const matchSearch = !search || 
                    (o.title || '').toLowerCase().includes(search) || 
                    (o.niche || '').toLowerCase().includes(search) ||
                    (o.description || '').toLowerCase().includes(search) ||
                    (o.productType || '').toLowerCase().includes(search) ||
                    (o.trafficSource || []).some((s: string) => s.toLowerCase().includes(search));

                // 2. Dropdown Filters
                const matchNiche = filterNiche === 'Todos' || (o.niche || '').toUpperCase() === filterNiche.toUpperCase();
                const matchType = filterType === 'Todos' || (o.productType || '').toUpperCase() === filterType.toUpperCase();
                const matchPlatform = filterPlatform === 'Todos' || (o.trafficSource || []).some((s: string) => s.toUpperCase() === filterPlatform.toUpperCase());
                const matchLanguage = filterLanguage === 'Todos' || (o.language || '').toUpperCase() === filterLanguage.toUpperCase();

                // 3. Functional Sub-Tabs Filter
                let matchSubTab = true;
                if (activeSubTab === 'CRIATIVOS') {
                    matchSubTab = (o.creativeEmbedUrls && o.creativeEmbedUrls.includes('http')) || 
                                  (o.creativeDownloadUrls && o.creativeDownloadUrls.includes('http')) ||
                                  (o.creativeZipUrl && o.creativeZipUrl.includes('http'));
                } else if (activeSubTab === "VSL's") {
                    matchSubTab = (o.vslEmbedUrl && o.vslEmbedUrl.includes('http')) || 
                                  (o.vslDownloadUrl && o.vslDownloadUrl.includes('http'));
                } else if (activeSubTab === 'PÁGINAS') {
                    matchSubTab = o.pageUrl && o.pageUrl.includes('http');
                }

                return matchSearch && matchNiche && matchType && matchPlatform && matchLanguage && matchSubTab;
            });

            return (
                <div className="animate-in fade-in pb-20 font-sans antialiased">
                    {/* CABEÇALHO, FILTROS E SUB-MENUS */}
                    <div className="flex flex-col mb-8 gap-5 bg-[#0a0a0a] p-5 rounded-xl border border-white/5 font-sans antialiased">
                        
                        <div className="flex flex-col gap-5 w-full">
                            {/* Titulo e Subtitulo */}
                            <div>
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3 font-sans antialiased">
                                    <Briefcase className="text-[#D4AF37]" size={16} /> 
                                    {currentPage === 'favoritos' ? 'FAVORITOS SALVOS' : 'OFERTAS VALIDADAS'}
                                </h2>
                                <p className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold tracking-wider font-sans antialiased">Base de inteligência filtrada manualmente.</p>
                            </div>
                            
                            {/* Reorganized Controls: Unified Same horizontal row */}
                            <div className="flex flex-col lg:flex-row lg:items-end gap-3 w-full font-sans antialiased">
                                {/* Search Bar FIRST */}
                                <div className="flex flex-col gap-1 flex-1 lg:flex-[2]">
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold font-sans antialiased">Buscar</span>
                                    <div className="relative w-full">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 animate-pulse" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar oferta..." 
                                            value={searchQuery} 
                                            onChange={(e) => setSearchQuery(e.target.value)} 
                                            className="w-full bg-[#050505] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-[#D4AF37]/50 font-normal placeholder:text-zinc-600 shadow-inner font-sans antialiased transition-all" 
                                        />
                                    </div>
                                </div>

                                {/* exactly 4 dropdown filters with small top labels */}
                                <div className="flex flex-col gap-1 shrink-0 lg:w-[15%]">
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold font-sans antialiased">Nicho</span>
                                    <select 
                                        value={filterNiche} 
                                        onChange={(e) => setFilterNiche(e.target.value)}
                                        className="bg-[#050505] border border-white/10 rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/50 font-medium cursor-pointer w-full font-sans antialiased"
                                    >
                                        {uniqueNiches.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1 shrink-0 lg:w-[15%]">
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold font-sans antialiased">Tipo</span>
                                    <select 
                                        value={filterType} 
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="bg-[#050505] border border-white/10 rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/50 font-medium cursor-pointer w-full font-sans antialiased"
                                    >
                                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1 shrink-0 lg:w-[15%]">
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold font-sans antialiased">Plataforma</span>
                                    <select 
                                        value={filterPlatform} 
                                        onChange={(e) => setFilterPlatform(e.target.value)}
                                        className="bg-[#050505] border border-white/10 rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/50 font-medium cursor-pointer w-full font-sans antialiased"
                                    >
                                        {uniquePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1 shrink-0 lg:w-[15%]">
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold font-sans antialiased">Idioma</span>
                                    <select 
                                        value={filterLanguage} 
                                        onChange={(e) => setFilterLanguage(e.target.value)}
                                        className="bg-[#050505] border border-white/10 rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/50 font-medium cursor-pointer w-full font-sans antialiased"
                                    >
                                        {uniqueLanguages.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SUB-MENU DE ABAS */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto scrollbar-hide">
                            {[
                                { id: 'OFERTAS', label: 'OFERTAS' },
                                { id: 'CRIATIVOS', label: 'CRIATIVOS' },
                                { id: "VSL's", label: "VSL's" },
                                { id: 'PÁGINAS', label: 'PÁGINAS' }
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveSubTab(tab.id)}
                                    className={`px-5 py-2 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap font-sans antialiased ${activeSubTab === tab.id ? 'bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GRID DE RESULTADOS DEPENDENDO DA SUB-ABA ATIVA */}
                    {(() => {
                        if (filteredOffers.length === 0) {
                            return (
                                <div className="col-span-full py-10 text-center">
                                    <p className="text-zinc-500 text-xs uppercase font-semibold font-sans antialiased">
                                        Nenhuma oferta curada encontrada.
                                    </p>
                                </div>
                            );
                        }

                        if (activeSubTab === 'CRIATIVOS') {
                            const allCreatives = filteredOffers.flatMap(o => {
                                const embeds = o.creativeEmbedUrls ? o.creativeEmbedUrls.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
                                const downloads = o.creativeDownloadUrls ? o.creativeDownloadUrls.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
                                const maxLen = Math.max(embeds.length, downloads.length);
                                return Array.from({ length: maxLen }).map((_, idx) => ({
                                    offerId: o.id,
                                    offerTitle: o.title,
                                    embedUrl: embeds[idx] || '',
                                    downloadUrl: downloads[idx] || '',
                                    index: idx + 1
                                }));
                            });

                            if (allCreatives.length === 0) {
                                return (
                                    <div className="col-span-full py-10 text-center">
                                        <p className="text-zinc-500 text-xs uppercase font-semibold font-sans antialiased">
                                            Nenhum criativo ativo encontrado.
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-sans antialiased">
                                    {allCreatives.map((c, idx) => (
                                        <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-3 font-sans antialiased group hover:border-[#D4AF37]/30 transition-all duration-300">
                                            <div className="rounded-lg overflow-hidden border border-white/5 bg-black aspect-video relative">
                                                <VideoPlayerMini url={c.embedUrl || c.downloadUrl} />
                                            </div>
                                            <div className="flex flex-col flex-1 gap-1">
                                                <span className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider">Criativo #{c.index}</span>
                                                <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1 uppercase tracking-tight">{c.offerTitle}</h4>
                                            </div>
                                            {c.downloadUrl && (
                                                <a 
                                                    href={getFastDownloadUrl(c.downloadUrl)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider rounded hover:bg-white hover:scale-[1.02] transition-all font-sans antialiased"
                                                >
                                                    <Download size={12} /> BAIXAR CRIATIVO
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        if (activeSubTab === "VSL's") {
                            const offersWithVsl = filteredOffers.filter(o => (o.vslEmbedUrl && o.vslEmbedUrl.trim() !== '') || (o.vslDownloadUrl && o.vslDownloadUrl.trim() !== '') || (o.vslLinks && o.vslLinks.length > 0));

                            if (offersWithVsl.length === 0) {
                                return (
                                    <div className="col-span-full py-10 text-center">
                                        <p className="text-zinc-500 text-xs uppercase font-semibold font-sans antialiased">
                                            Nenhuma VSL encontrada.
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans antialiased">
                                    {offersWithVsl.map((o: any) => (
                                        <div key={o.id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex flex-col gap-4 font-sans antialiased group hover:border-[#D4AF37]/30 transition-all duration-300">
                                            <div className="rounded-lg overflow-hidden border border-white/5 bg-black aspect-video relative">
                                                <VideoPlayerMini url={o.vslEmbedUrl || o.vslDownloadUrl} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider">VSL Longa-Metragem</span>
                                                <h4 className="text-sm font-semibold text-zinc-200 uppercase tracking-tight line-clamp-1">{o.title}</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-auto font-sans antialiased">
                                                {o.vslDownloadUrl && (
                                                    <a 
                                                        href={getFastDownloadUrl(o.vslDownloadUrl)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="flex items-center justify-center gap-2 py-2.5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider rounded hover:bg-white hover:scale-[1.02] transition-all font-sans antialiased"
                                                    >
                                                        <Download size={12} /> BAIXAR VSL
                                                    </a>
                                                )}
                                                {o.transcriptionUrl && (
                                                    <a 
                                                        href={o.transcriptionUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="flex items-center justify-center gap-2 py-2.5 bg-[#121212] text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded hover:text-white hover:bg-white/5 transition-all border border-white/5 font-sans antialiased"
                                                    >
                                                        <FileText size={12} /> VER SCRIPT
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        if (activeSubTab === 'PÁGINAS') {
                            const offersWithPages = filteredOffers.filter(o => o.pageUrl && o.pageUrl.trim() !== '');

                            if (offersWithPages.length === 0) {
                                return (
                                    <div className="col-span-full py-10 text-center">
                                        <p className="text-zinc-500 text-xs uppercase font-semibold font-sans antialiased">
                                            Nenhuma landing page encontrada.
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans antialiased">
                                    {offersWithPages.map((o: any) => (
                                        <div key={o.id} className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden flex flex-col h-full font-sans antialiased group hover:border-[#D4AF37]/30 transition-all duration-300">
                                            <div className="relative aspect-video overflow-hidden shrink-0 bg-[#050505] border-b border-white/5">
                                                <img src={getDriveDirectLink(o.coverImage) || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'} alt={o.title} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                            </div>
                                            <div className="p-4 flex flex-col flex-1 gap-4 font-sans antialiased">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider">Landing Page</span>
                                                    <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-tight line-clamp-2">{o.title}</h4>
                                                </div>
                                                <a 
                                                    href={o.pageUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider rounded hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] font-sans antialiased"
                                                >
                                                    ACESSAR LINK EXTERNO <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        // OFERTAS: Renders standard product overview grid
                        return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 font-sans antialiased">
                                {filteredOffers.map((o: any) => (
                                    <OfferCard 
                                        key={o.id} 
                                        offer={o} 
                                        onClick={() => setSelectedOffer(o)} 
                                        isFavorite={favorites.includes(o.id)}
                                        onFavoriteToggle={() => handleFavoriteToggle(o.id)}
                                    />
                                ))}
                            </div>
                        );
                    })()}
                </div>
            );
        }

        if (currentPage === 'biblioteca') {
            return (
                <div className="w-full h-full flex flex-col">
                    <AdLibrary />
                </div>
            );
        }

        // --- INTERCEPTADOR E EXTENSÃO CONTINUAM AQUI... (ocultos para poupar espaço visual, mas renderizam normalmente) ---
        if (currentPage === 'interceptador') {
            return (
                <div className="animate-in fade-in max-w-4xl mx-auto mt-10 font-sans antialiased">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Radar size={48} className="mx-auto text-[#D4AF37] mb-3 opacity-90 animate-pulse" />
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                            <Terminal size={18} className="text-[#D4AF37]" /> INTERCEPTADOR WEB
                        </h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-xl mx-auto">
                            Analise checkouts e páginas de vendas em tempo real para extrair a infraestrutura e a escala do concorrente.
                        </p>
                    </div>

                    {!isScanning && !scanResult && (
                        /* INITIAL INPUT STATE */
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all duration-300">
                            {/* Background Tech Decors */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/2 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">URL de Destino</label>
                                    <input 
                                        type="text" 
                                        value={interceptorUrl} 
                                        onChange={(e) => setInterceptorUrl(e.target.value)} 
                                        placeholder="Cole a URL do checkout ou página de vendas concorrente..." 
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-4 px-5 text-xs text-white outline-none focus:border-[#D4AF37] placeholder:text-zinc-700 font-medium transition-all" 
                                    />
                                </div>

                                <button 
                                    onClick={handleScan} 
                                    disabled={!interceptorUrl.trim()} 
                                    className="w-full bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-[#D4AF37] flex items-center justify-center gap-2 text-xs shadow-[0_4px_20px_rgba(212,175,55,0.15)] active:scale-[0.98]"
                                >
                                    <Radar size={14} className="animate-spin" /> INVESTIGAR OPERAÇÃO
                                </button>
                                
                                {/* Info Cards Decorativos */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5 mt-2">
                                    <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
                                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider font-sans">Detecção Automática</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 font-sans">Pixels de Rastreamento</p>
                                    </div>
                                    <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
                                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider font-sans">Servidor Seguro</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 font-sans">Scan de Tráfego Criptografado</p>
                                    </div>
                                    <div className="p-3 bg-[#050505] rounded-lg border border-white/5">
                                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider font-sans">Gateway Integrado</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 font-sans">Varredura de Plataformas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isScanning && (
                        /* SCANNING ANIMATION STATE */
                        <div className="bg-[#050505] border border-[#D4AF37]/20 p-8 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.05)] relative overflow-hidden">
                            <div className="scan-line"></div>
                            
                            <div className="flex flex-col items-center justify-center py-8">
                                {/* Visual Cyber Radar Indicator */}
                                <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-ping"></div>
                                    <div className="absolute inset-2 rounded-full border border-[#D4AF37]/40 animate-pulse"></div>
                                    <Radar size={32} className="text-[#D4AF37] animate-spin" />
                                </div>

                                <div className="w-full max-w-lg bg-[#000000] border border-white/5 rounded-xl p-5 font-mono text-[10px] md:text-xs text-emerald-400 space-y-2.5 shadow-inner">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                                        <span className="text-zinc-500 font-bold uppercase tracking-wider">SHELL_PROCESS_ID: 007_SPY</span>
                                        <span className="text-[#D4AF37] font-bold animate-pulse">STATUS: ACTIVE_SCAN</span>
                                    </div>
                                    
                                    <div className="space-y-1.5 min-h-[100px] text-left">
                                        {scanPhase >= 0 && (
                                            <p className="flex items-center gap-2 animate-in fade-in duration-300">
                                                <span className="text-zinc-500">&gt;&gt;</span> 📡 Conectando ao servidor alvo...
                                            </p>
                                        )}
                                        {scanPhase >= 1 && (
                                            <p className="flex items-center gap-2 animate-in fade-in duration-300">
                                                <span className="text-zinc-500">&gt;&gt;</span> 🕵️‍♂️ Interceptando pacotes de tráfego...
                                            </p>
                                        )}
                                        {scanPhase >= 2 && (
                                            <p className="flex items-center gap-2 animate-in fade-in duration-300">
                                                <span className="text-zinc-500">&gt;&gt;</span> 🔍 Varrendo pixels de rastreamento ativos...
                                            </p>
                                        )}
                                        {scanPhase >= 3 && (
                                            <p className="flex items-center gap-2 animate-in fade-in duration-300">
                                                <span className="text-zinc-500">&gt;&gt;</span> 📊 Consolidando métricas de conversão...
                                            </p>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="pt-4 border-t border-white/5 mt-4">
                                        <div className="flex justify-between text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-1.5">
                                            <span>Mapeando Operação</span>
                                            <span>{Math.min(100, Math.round(((scanPhase + 1) / 4) * 100))}%</span>
                                        </div>
                                        <div className="w-full bg-[#080808] border border-white/10 h-2 rounded overflow-hidden">
                                            <div 
                                                className="bg-[#D4AF37] h-full transition-all duration-700 ease-out" 
                                                style={{ width: `${Math.min(100, ((scanPhase + 1) / 4) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {scanResult && interceptData && (() => {
                        const report = interceptData;
                        return (
                            /* THE INTELLIGENCE REPORT DASHBOARD */
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                {/* Main Report Summary */}
                                <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                                    {/* Decorative tech background */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none"></div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <CheckCircle2 size={12} className="text-emerald-500 animate-pulse" /> RELATÓRIO DE INTELIGÊNCIA CONCLUÍDO
                                            </h3>
                                            <p className="text-xs font-bold text-white uppercase tracking-normal break-all mt-1">{interceptorUrl}</p>
                                        </div>
                                        
                                        <div className={`flex items-center gap-2 border px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)] shrink-0 ${report.badgeStyle}`}>
                                            <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                                {report.statusText}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-[#050505] rounded-xl border border-white/5 flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <Activity size={12} className="text-[#D4AF37]" />
                                                <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Status da Operação</span>
                                            </div>
                                            <span className={`text-xs font-black uppercase tracking-wider ${
                                                report.statusText.includes('BLOQUEADA') ? 'text-red-400' : report.statusText.includes('ATIVO') ? 'text-amber-400' : 'text-emerald-400'
                                            }`}>{report.statusText}</span>
                                        </div>
                                        
                                        <div className="p-4 bg-[#050505] rounded-xl border border-white/5 flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={12} className="text-[#D4AF37]" />
                                                <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Tráfego Mensal Estimado</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-zinc-500 text-xs font-black uppercase tracking-tight font-mono">Radar Oculto</span>
                                                <span className="text-[7px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded group relative cursor-help">
                                                    API REQUERIDA
                                                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 p-2 bg-zinc-950 border border-zinc-800 text-zinc-400 text-[8px] font-bold uppercase tracking-wider rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center leading-normal whitespace-normal normal-case z-20">
                                                        Esses dados exigem integração com ferramentas de análise de tráfego de terceiros (como SimilarWeb) no futuro.
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-[#050505] rounded-xl border border-white/5 flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <Globe size={12} className="text-[#D4AF37]" />
                                                <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Principais Fontes</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-zinc-500 text-xs font-black uppercase tracking-tight font-mono">Canais Privados</span>
                                                <span className="text-[7px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded group relative cursor-help">
                                                    RADAR BLOQUEADO
                                                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 p-2 bg-zinc-950 border border-zinc-800 text-zinc-400 text-[8px] font-bold uppercase tracking-wider rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center leading-normal whitespace-normal normal-case z-20">
                                                        Esses dados exigem integração com ferramentas de análise de tráfego de terceiros (como SimilarWeb) no futuro.
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-[#050505] rounded-xl border border-white/5 flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={12} className="text-[#D4AF37]" />
                                                <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Checkout Protegido</span>
                                            </div>
                                            <span className="text-zinc-200 text-xs font-black uppercase tracking-tight">{report.checkoutText}</span>
                                        </div>
                                    </div>

                                    {/* Extra intelligence metrics */}
                                    <div className="mt-6 pt-5 border-t border-white/5 space-y-4">
                                        <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Layers size={10} className="text-[#D4AF37]" /> DETALHES TÉCNICOS ADICIONAIS
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="p-3 bg-[#0d0d0d] rounded border border-white/5">
                                                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">Meta Pixel Actives</p>
                                                <p className="text-[9px] text-zinc-300 font-mono mt-1">ID: {report.pixelId}</p>
                                            </div>
                                            <div className="p-3 bg-[#0d0d0d] rounded border border-white/5">
                                                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">Hospedagem / CDN</p>
                                                <p className="text-[9px] text-zinc-300 font-mono mt-1">{report.hosting}</p>
                                            </div>
                                            <div className="p-3 bg-[#0d0d0d] rounded border border-white/5">
                                                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">Criptografia SSL</p>
                                                <p className="text-[9px] text-zinc-300 font-mono mt-1">Ativo (SHA-256)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button 
                                        onClick={() => {
                                            setInterceptorUrl('');
                                            setScanResult(false);
                                            setScanPhase(0);
                                        }}
                                        className="flex items-center gap-2 py-3 px-6 bg-[#121212] hover:bg-white hover:text-black border border-white/10 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                                    >
                                        <RefreshCw size={12} /> NOVA INVESTIGAÇÃO
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            );
        }

        if (currentPage === 'extensao') {
            return (
                <div className="animate-in fade-in max-w-5xl mx-auto mt-6 font-sans antialiased">
                    <div className="mb-8 border-b border-white/5 pb-6">
                        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 mb-2 font-sans antialiased">
                            <Puzzle className="text-[#D4AF37]" size={22} /> CENTRAL DE EXTENSÃO 007
                        </h2>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-sans antialiased">
                            Módulo avançado de captura e mineração de ofertas estruturadas.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Left Side (65% width) */}
                        <div className="w-full lg:w-[65%] space-y-4">
                            <div className="aspect-video bg-[#050505] border border-white/5 rounded-xl overflow-hidden shadow-2xl relative">
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/En_eE15WR3s"
                                    title="Installation Tutorial"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-normal leading-relaxed font-sans antialiased">
                                Aprenda como instalar a extensão no modo desenvolvedor e utilizar as funções de mineração de vídeo e desbloqueio de downloads em sites protegidos.
                            </p>
                        </div>

                        {/* Right Side (35% width) */}
                        <div className="w-full lg:w-[35%]">
                            <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden group hover:border-[#D4AF37]/25 transition-all duration-300">
                                {/* Background Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/2 rounded-full blur-2xl pointer-events-none"></div>
                                
                                <div className="p-4 bg-[#121212] rounded-full border border-white/5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                                    <Puzzle size={36} />
                                </div>
                                
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest font-sans antialiased">007 SWIPER SPY</h3>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans antialiased">VERSÃO V23.0 (ESTÁVEL)</p>
                                </div>

                                <a 
                                    href="https://drive.google.com/file/d/1s0Jnth9iCVuwPyU1nMo7vssjPO7UtcZN/view?usp=drive_link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest py-3.5 px-6 rounded-lg text-[11px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.15)] active:scale-[0.98] font-sans antialiased"
                                >
                                    📥 BAIXAR .ZIP
                                </a>

                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wide leading-relaxed font-sans antialiased max-w-[250px]">
                                    COMPATÍVEL COM GOOGLE CHROME, EDGE E BRAVE. INSTALAÇÃO MANUAL NECESSÁRIA.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    if (currentModule === 'organicos' || currentPage === 'virais') {
        const uniqueViralNiches = ['Todos', ...Array.from(new Set(organicVideos.map(v => v.niche).filter(Boolean)))];

        const filteredVideos = organicVideos.filter(v => {
            const matchTab = v.platform === activeViralTab;
            const matchNiche = viralNiche === 'Todos' || v.niche === viralNiche;
            return matchTab && matchNiche;
        });

        return (
            <div className="animate-in fade-in max-w-6xl mx-auto mt-6 font-sans antialiased">
                <div className="mb-8">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 mb-2 font-sans antialiased">
                        <Smartphone className="text-[#D4AF37]" size={22} /> CENTRAL DE VIRAIS ORGÂNICOS
                    </h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-sans antialiased">
                        Tendências e criativos que estão estourando no tráfego orgânico.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-[#0a0a0a] p-5 rounded-xl border border-white/5 font-sans antialiased">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        {[
                            { id: 'TIKTOK', label: 'TikTok Trends', icon: Smartphone },
                            { id: 'REELS', label: 'Instagram Reels', icon: Video },
                            { id: 'SHORTS', label: 'YouTube Shorts', icon: Youtube }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveViralTab && setActiveViralTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    activeViralTab === tab.id
                                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                                        : 'text-zinc-400 border-transparent hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <tab.icon size={14} />
                                <span className="text-xs uppercase font-semibold tracking-wider">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold font-sans antialiased">Nicho</span>
                        <select 
                            value={viralNiche} 
                            onChange={(e) => setViralNiche(e.target.value)}
                            className="bg-[#050505] border border-white/10 rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/50 font-medium cursor-pointer min-w-[150px] font-sans antialiased"
                        >
                            {uniqueViralNiches.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>

                {filteredVideos.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-zinc-500 text-xs uppercase font-semibold font-sans antialiased">
                            Nenhuma tendência viral encontrada para este filtro.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans antialiased">
                        {filteredVideos.map(v => {
                            const videoTitle = `Viral de ${v.niche || 'Geral'}`;
                            
                            // Helper function to strip query parameters from the URL
                            const getCleanUrl = (url: string): string => {
                                return url.split('?')[0];
                            };
                            const cleanUrl = v.embedUrl ? getCleanUrl(v.embedUrl) : '';

                            return (
                                <div key={v.id} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-4 font-sans antialiased group hover:border-[#D4AF37]/30 transition-all duration-300">
                                    <div className="w-full aspect-[9/16] bg-zinc-900 border border-white/10 rounded-lg relative overflow-hidden group shadow-inner">
                                        {cleanUrl ? (
                                            <iframe 
                                                src={cleanUrl}
                                                title={videoTitle}
                                                className="w-full h-full rounded-lg"
                                                frameBorder="0"
                                                allowFullScreen
                                                scrolling="no"
                                            ></iframe>
                                        ) : (
                                            <div className="w-full h-full bg-[#050505] flex items-center justify-center text-zinc-600 text-[10px] uppercase font-semibold">Sem Mídia</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 gap-3">
                                        <div>
                                            <span className="inline-block text-[8px] uppercase font-semibold tracking-normal bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-full mb-1">
                                                {v.niche}
                                            </span>
                                            <h4 className="text-xs font-semibold text-zinc-200 line-clamp-2 uppercase tracking-tight leading-relaxed">{videoTitle}</h4>
                                        </div>
                                        
                                        <div className="space-y-1.5 border-t border-white/5 pt-2 text-[10px]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500 uppercase font-semibold">🔥 Engajamento</span>
                                                <span className="text-emerald-400 font-bold">{v.engagement}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500 uppercase font-semibold">📊 Visualizações Estimadas</span>
                                                <span className="text-zinc-200 font-bold font-mono">{v.views}</span>
                                            </div>
                                        </div>

                                        <div className="bg-[#050505] border border-white/5 p-2.5 rounded text-[9px] text-zinc-400 leading-relaxed mt-auto">
                                            <span className="font-bold text-[#D4AF37] uppercase block mb-0.5">Gancho / Hook:</span>
                                            {v.hook}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // Deleted routes

    if (currentModule === 'home' || currentPage === 'dashboard') {
        const baseOffers = offers.length > 0 ? offers.slice(0, 10) : [
            { id: '1', title: 'PROTOCOLO ZERO BARRIGA', niche: 'Saúde', coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300', trend: 'ROI: 400%' },
            { id: '2', title: 'VELAS AROMÁTICAS LUCRATIVAS', niche: 'Hobbies', coverImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=300', trend: 'ROI: 350%' },
            { id: '3', title: 'CÓDIGO DA RIQUEZA', niche: 'Finanças', coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300', trend: 'ROI: 520%' },
            { id: '4', title: 'MANUAL DA CONQUISTA', niche: 'Relacionamento', coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300', trend: 'ROI: 310%' },
            { id: '5', title: 'DESPERTAR HORMONAL', niche: 'Saúde', coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300', trend: 'ROI: 450%' },
            { id: '6', title: 'CERVEJA ARTESANAL', niche: 'Gastronomia', coverImage: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=300', trend: 'ROI: 380%' }
        ];

        let displayOffers = [...baseOffers];
        while (displayOffers.length < 8) {
            displayOffers = [...displayOffers, ...baseOffers];
        }

        return (
            <div className="animate-in fade-in duration-500 w-full font-sans antialiased pb-20 pt-2 px-8 md:px-12">
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-marquee-infinite {
                    display: flex;
                    width: max-content;
                    animation: marquee-scroll 35s linear infinite;
                  }
                  .animate-marquee-infinite:hover {
                    animation-play-state: paused;
                  }
                  .mask-marquee-glow {
                    mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
                  }
                ` }} />

                {/* Header/Persuasive Copy */}
                <div className="text-center space-y-3 py-4 border-b border-white/5 mb-8 md:mb-12">
                    <h1 className="text-xl md:text-3xl font-black tracking-wider text-white">
                        O ECOSSISTEMA DEFINITIVO PARA <span className="text-[#D4AF37]">DOMINAR O MERCADO</span>.
                    </h1>
                    <p className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-semibold max-w-2xl mx-auto">
                        Copie o que funciona, escale o que converte. Nenhuma oferta passa despercebida.
                    </p>
                </div>

                <div className="w-full space-y-8">
                    
                    {/* Dynamic Marquee Section */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                            🔥 RADAR DE OFERTAS (EM ALTA)
                        </h3>
                        
                        <div className="relative w-full overflow-hidden py-1 mask-marquee-glow rounded-xl border border-white/5 bg-[#070707] p-2">
                            <div className="animate-marquee-infinite gap-4">
                                {displayOffers.concat(displayOffers).map((offer, idx) => {
                                    const imgUrl = getDriveDirectLink(offer.coverImage) || offer.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300';
                                    const isFav = favorites.includes(offer.id);
                                    return (
                                        <div 
                                            key={idx} 
                                            onClick={() => {
                                                setSelectedOffer(offer);
                                                setCurrentModule('swiper');
                                                setCurrentPage('cofre');
                                            }}
                                            className="flex-shrink-0 w-72 bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden group hover:border-[#D4AF37]/35 hover:scale-[1.02] transition-all duration-300 relative cursor-pointer"
                                        >
                                            <div className="h-40 overflow-hidden relative bg-black">
                                                <img 
                                                    src={imgUrl} 
                                                    alt={offer.title} 
                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                                                />
                                                
                                                {/* Trend Badge */}
                                                <span className="absolute top-2 left-2 bg-black/80 border border-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                                    {offer.trend || 'ALTA CONVERSÃO'}
                                                </span>

                                                {/* Favorite Toggle Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFavoriteToggle(offer.id);
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 border border-white/10 hover:border-[#D4AF37]/50 text-zinc-400 hover:text-[#D4AF37] transition-all"
                                                >
                                                    <Star size={14} className={isFav ? "fill-[#D4AF37] text-[#D4AF37]" : ""} />
                                                </button>
                                            </div>
                                            <div className="p-3 space-y-1">
                                                <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-tight line-clamp-1 group-hover:text-[#D4AF37] transition-all">
                                                    {offer.title}
                                                </h4>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                    {offer.niche || 'Geral'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Exclusive Tools Grid */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">FERRAMENTAS EXCLUSIVAS</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            {/* OFERTAS VALIDADAS */}
                            <button 
                                onClick={() => {
                                    setCurrentModule('swiper');
                                    setCurrentPage('cofre');
                                    setSelectedOffer(null);
                                }}
                                className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between min-h-[170px] relative overflow-hidden group hover:border-[#D4AF37]/40 hover:bg-[#0c0c0c] transition-all duration-300 shadow-xl cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
                                <div className="p-3 bg-[#121212] rounded-xl border border-white/5 text-[#D4AF37] w-fit">
                                    <Briefcase size={20} />
                                </div>
                                <div className="mt-4 space-y-1.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-all">OFERTAS VALIDADAS</h4>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Base de Inteligência</p>
                                    <p className="text-[11px] text-zinc-400 leading-normal font-normal pt-1">
                                        Acesse ofertas validadas, scripts e infraestrutura de vendas dos concorrentes.
                                    </p>
                                </div>
                            </button>

                            {/* BIBLIOTECA FACEBOOK */}
                            <button 
                                onClick={() => {
                                    setCurrentModule('swiper');
                                    setCurrentPage('biblioteca');
                                    setSelectedOffer(null);
                                }}
                                className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between min-h-[170px] relative overflow-hidden group hover:border-[#D4AF37]/40 hover:bg-[#0c0c0c] transition-all duration-300 shadow-xl cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
                                <div className="p-3 bg-[#121212] rounded-xl border border-white/5 text-[#D4AF37] w-fit">
                                    <Facebook size={20} />
                                </div>
                                <div className="mt-4 space-y-1.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-all">BIBLIOTECA FACEBOOK</h4>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Espionagem de Criativos</p>
                                    <p className="text-[11px] text-zinc-400 leading-normal font-normal pt-1">
                                        Explore nossa biblioteca interna de anúncios para obter insights imediatos.
                                    </p>
                                </div>
                            </button>

                            {/* INTERCEPTADOR WEB */}
                            <button 
                                onClick={() => {
                                    setCurrentModule('swiper');
                                    setCurrentPage('interceptador');
                                    setSelectedOffer(null);
                                }}
                                className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between min-h-[170px] relative overflow-hidden group hover:border-[#D4AF37]/40 hover:bg-[#0c0c0c] transition-all duration-300 shadow-xl cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
                                <div className="p-3 bg-[#121212] rounded-xl border border-white/5 text-[#D4AF37] w-fit">
                                    <Radar size={20} />
                                </div>
                                <div className="mt-4 space-y-1.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-all">INTERCEPTADOR WEB</h4>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Análise de Tráfego</p>
                                    <p className="text-[11px] text-zinc-400 leading-normal font-normal pt-1">
                                        Analise checkouts e páginas de vendas em tempo real para extrair a infraestrutura e a escala do concorrente.
                                    </p>
                                </div>
                            </button>

                            {/* EXTENSÃO */}
                            <button 
                                onClick={() => {
                                    setCurrentModule('swiper');
                                    setCurrentPage('extensao');
                                    setSelectedOffer(null);
                                }}
                                className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between min-h-[170px] relative overflow-hidden group hover:border-[#D4AF37]/40 hover:bg-[#0c0c0c] transition-all duration-300 shadow-xl cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
                                <div className="p-3 bg-[#121212] rounded-xl border border-white/5 text-[#D4AF37] w-fit">
                                    <Puzzle size={20} />
                                </div>
                                <div className="mt-4 space-y-1.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-all">EXTENSÃO</h4>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Central de Captura</p>
                                    <p className="text-[11px] text-zinc-400 leading-normal font-normal pt-1">
                                        Baixe a extensão oficial do 007 Swiper para minerar vídeos e desbloquear downloads.
                                    </p>
                                </div>
                            </button>

                            {/* VIRAIS ORGÂNICOS */}
                            <button 
                                onClick={() => {
                                    setCurrentModule('organicos');
                                    setCurrentPage('virais');
                                }}
                                className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl text-left flex flex-col justify-between min-h-[170px] relative overflow-hidden group hover:border-[#D4AF37]/40 hover:bg-[#0c0c0c] transition-all duration-300 shadow-xl cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
                                <div className="p-3 bg-[#121212] rounded-xl border border-white/5 text-[#D4AF37] w-fit">
                                    <Smartphone size={20} />
                                </div>
                                <div className="mt-4 space-y-1.5">
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider group-hover:text-[#D4AF37] transition-all">VIRAIS ORGÂNICOS</h4>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Mapeamento de Tendências</p>
                                    <p className="text-[11px] text-zinc-400 leading-normal font-normal pt-1">
                                        Monitore os criativos e vídeos orgânicos que estão viralizando nas redes sociais.
                                    </p>
                                </div>
                            </button>

                        </div>
                    </div>

                </div>

            </div>
        );
    }

    if (currentPage === 'suporte' || currentModule === 'central') {
        return (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans antialiased pb-20">
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3 font-sans">
                        <HelpCircle className="text-[#D4AF37]" size={16} /> 
                        CENTRAL 007
                    </h2>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold tracking-wider font-sans">
                        PAINEL DO AGENTE E COMUNICAÇÃO OFICIAL
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
                        <div className="space-y-4">
                            <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase">IDENTIDADE OPERACIONAL</span>
                            <div className="space-y-3 font-mono text-[10px] pt-2">
                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 uppercase font-bold">SENHA</span>
                                    <span className="text-zinc-200 font-bold">AGENTE-007</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 uppercase font-bold">SESSÃO</span>
                                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded text-[8px] font-black uppercase">INDIVIDUAL / PRIVADA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
                        <div className="space-y-4 w-full">
                            <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase">SUPORTE TÉCNICO</span>
                            <p className="text-[11px] text-zinc-300 font-mono pt-2">suporte@007swiper.com</p>
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText('suporte@007swiper.com');
                                alert('E-mail copiado com sucesso!');
                            }}
                            className="mt-6 w-full bg-[#121212] hover:bg-white hover:text-black border border-white/5 text-zinc-300 text-[9px] font-black uppercase tracking-widest py-2.5 rounded transition-all"
                        >
                            COPIAR E-MAIL
                        </button>
                    </div>


                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center border border-white/5 rounded-xl bg-[#0a0a0a]">
            <Sparkles size={48} className="text-[#D4AF37] mb-6 opacity-50" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Módulo em Desenvolvimento</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold max-w-md">O ambiente [{currentModule.toUpperCase()}] está sendo codificado.</p>
        </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <LandingPage 
        onLogin={() => {
          setIsAuthenticated(true);
          localStorage.setItem('swiper_authenticated', 'true');
        }} 
        onRouteToAdmin={() => {
          setIsAuthenticated(true);
          localStorage.setItem('swiper_authenticated', 'true');
          setCurrentPage('admin_dashboard');
          setCurrentModule('admin');
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden font-sans antialiased">

      <header className="h-[65px] bg-[#0a0a0a] border-b border-white/5 fixed top-0 left-0 w-full z-50 flex items-center px-6 shadow-xl">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-[#D4AF37] p-1.5 rounded-md"><ShieldCheck className="text-black" size={20} /></div>
          <span className="text-lg font-black tracking-widest text-white uppercase italic">007 <span className="text-[#D4AF37]">SWIPER</span></span>
        </div>
        <nav className="flex-1 flex items-center justify-start gap-2 md:gap-4 overflow-x-auto scrollbar-hide px-6">
          {[
            { id: 'home', icon: HomeIcon, label: 'HOME', page: 'dashboard', module: 'home' },
            { id: 'ofertas', icon: Briefcase, label: 'OFERTAS VALIDADAS', page: 'cofre', module: 'swiper' },
            { id: 'biblioteca', icon: Facebook, label: 'BIBLIOTECA FACEBOOK', page: 'biblioteca', module: 'swiper' },
            { id: 'interceptador', icon: Radar, label: 'INTERCEPTADOR WEB', page: 'interceptador', module: 'swiper' },
            { id: 'extensao', icon: Puzzle, label: 'EXTENSÃO', page: 'extensao', module: 'swiper' },
            { id: 'favoritos', icon: Star, label: 'FAVORITOS', page: 'favoritos', module: 'swiper' },
            { id: 'central', icon: HelpCircle, label: 'CENTRAL 007', page: 'suporte', module: 'central' },
            { id: 'comunidade', icon: MessageCircle, label: 'COMUNIDADE VIP', page: 'comunidade', module: 'comunidade' }
          ].map(item => {
            const isActive = currentPage === item.page;
            
            if (item.id === 'comunidade') {
              return (
                <button 
                  key={item.id} 
                  onClick={() => window.open(COMMUNITY_LINK, '_blank')} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border border-green-500 text-green-500 hover:bg-green-500/10 whitespace-nowrap"
                >
                  <item.icon size={15} className="text-green-500" /> 
                  <span className="text-xs uppercase tracking-wide font-medium">{item.label}</span>
                </button>
              );
            }

            if (item.id === 'central') {
              return (
                <button 
                  key={item.id} 
                  onClick={() => {
                    setCurrentModule(item.module);
                    setCurrentPage(item.page);
                  }} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border whitespace-nowrap ${
                    isActive 
                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 font-semibold' 
                      : 'text-yellow-500 border-transparent hover:text-yellow-500 hover:bg-yellow-500/5'
                  }`}
                >
                  <item.icon size={15} className={isActive ? "fill-yellow-500 text-yellow-500" : "text-yellow-500"} /> 
                  <span className="text-xs uppercase tracking-wide font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <button 
                key={item.id} 
                onClick={() => {
                  setCurrentModule(item.module);
                  setCurrentPage(item.page);
                  if (item.module === 'swiper') {
                    setSelectedOffer(null);
                  }
                }} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 font-semibold' 
                    : 'text-white font-medium drop-shadow-md hover:text-zinc-200 border-transparent hover:bg-white/5'
                }`}
              >
                <item.icon size={15} className={isActive ? 'text-[#D4AF37]' : 'text-zinc-400 group-hover:text-white'} /> 
                <span className="text-xs uppercase tracking-wide font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="flex items-center shrink-0 pl-4">
          <button 
            onClick={() => {
              if (window.confirm('Deseja realmente sair?')) {
                setIsAuthenticated(false);
                localStorage.removeItem('swiper_authenticated');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all border border-transparent text-red-500 hover:bg-red-500/10 hover:text-red-400 whitespace-nowrap"
          >
            <LogOut size={14} /> 
            <span className="text-[10px] font-black uppercase tracking-widest">SAIR</span>
          </button>
        </div>
      </header>
      <div className="flex flex-1 mt-[65px] w-full">
        <main className={
          currentPage === 'biblioteca'
            ? `flex-1 h-[calc(100vh-65px)] overflow-hidden flex flex-col`
            : `flex-1 p-8 overflow-y-auto h-[calc(100vh-65px)] flex flex-col justify-between`
        }>
            <div className={currentPage === 'biblioteca' ? "flex-1 h-full overflow-hidden" : "flex-1"}>
              {renderContent()}
            </div>
            
            {currentPage !== 'biblioteca' && (
              <footer className="border-t border-white/5 py-8 text-center bg-[#030303]/50 mt-12 relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                  <p 
                    className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest select-none"
                  >
                    © 2026 007 SWIPER INTELLIGENCE PLATFORM. TODOS OS DIREITOS RESERVADOS.
                  </p>
                  <div
                    onDoubleClick={() => {
                      setCurrentPage('admin_dashboard');
                      setCurrentModule('admin');
                    }}
                    className="w-[100px] h-[100px] mx-auto mt-2 relative z-50 cursor-default select-none"
                    style={{ opacity: 0 }}
                  />
                </div>
              </footer>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;