import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Check, RefreshCw, Layers, Flame, HelpCircle } from 'lucide-react';
import { AdCard, Ad } from './AdCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AdCardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col h-fit relative animate-pulse">
      <div className="p-4 border-b border-zinc-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-4 w-12 bg-zinc-800 rounded-full"></div>
            <div className="h-4 w-16 bg-zinc-800 rounded"></div>
          </div>
          <div className="h-6 w-6 bg-zinc-800 rounded-md"></div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-3 w-20 bg-zinc-800 rounded"></div>
          <div className="h-3 w-16 bg-zinc-800/60 rounded"></div>
        </div>
      </div>
      <div className="p-4 flex items-center space-x-3 bg-zinc-900/40">
        <div className="w-9 h-9 rounded-full bg-zinc-800 shrink-0"></div>
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
          <div className="h-2 bg-zinc-800/60 rounded w-1/2"></div>
        </div>
      </div>
      <div className="px-4 pb-3 flex-1 space-y-2 py-2">
        <div className="h-3 bg-zinc-800 rounded w-full"></div>
        <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
        <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
      </div>
      <div className="relative aspect-[4/5] bg-zinc-950/90 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
          <div className="w-3 h-3 bg-zinc-800 rounded"></div>
        </div>
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent skeleton-scanline"></div>
      </div>
    </div>
  );
};

export const AdLibrary: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdData = async (niche: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const adsRef = collection(db, 'facebook_ads');
      // Se tiver nicho, filtra. Se não, busca tudo.
      const q = niche ? query(adsRef, where('nicho', '==', niche)) : adsRef;
      const querySnapshot = await getDocs(q);

      const list: Ad[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          status: 'Ativo',
          startDate: data.dataCaptura ? new Date(data.dataCaptura).toLocaleDateString('pt-BR') : 'Recente',
          activeDays: 1,
          copies: 1,
          advertiserName: data.nomeAnunciante || 'Anunciante',
          advertiserAvatar: (data.nomeAnunciante || 'Anunciante').substring(0, 2).toUpperCase(),
          pageUrl: data.paginaDestino || '',
          bodyText: data.texto || '',
          videoUrl: data.videoUrl || '',
          category: data.nicho || 'Geral',
          transcription: '',
          fanPage: data.nomeAnunciante || '',
          destinationPage: data.paginaDestino || '',
          videoThumbnail: ''
        });
      });
      setAds(list.reverse());
    } catch (e: any) {
      console.error("Erro ao carregar anúncios:", e);
      setError("Erro ao carregar os anúncios.");
      setAds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdData(selectedNiche);
  }, [selectedNiche]);

  // Advanced Filter states
  const [searchTargets, setSearchTargets] = useState({
    transcription: false,
    fanPage: false,
    destinationPage: false,
    texts: false,
  });

  const [copiesRange, setCopiesRange] = useState({ min: '', max: '' });
  const [activeDaysRange, setActiveDaysRange] = useState({ min: '', max: '' });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('swiper_library_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('swiper_library_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]);
  };

  const handleTargetChange = (key: keyof typeof searchTargets) => {
    setSearchTargets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedNiche('');
    setSearchTargets({ transcription: false, fanPage: false, destinationPage: false, texts: false });
    setCopiesRange({ min: '', max: '' });
    setActiveDaysRange({ min: '', max: '' });
  };

  const filteredAds = ads.filter(ad => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const anyTargetSelected = Object.values(searchTargets).some(val => val);
      if (anyTargetSelected) {
        let matchesAnyTarget = false;
        if (searchTargets.texts && ad.bodyText.toLowerCase().includes(query)) matchesAnyTarget = true;
        if (searchTargets.fanPage && (ad.fanPage?.toLowerCase().includes(query) || ad.advertiserName.toLowerCase().includes(query))) matchesAnyTarget = true;
        if (!matchesAnyTarget) return false;
      } else {
        if (!ad.bodyText.toLowerCase().includes(query) && !ad.advertiserName.toLowerCase().includes(query)) return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full h-full flex overflow-hidden font-sans antialiased text-white bg-[#050505]">
      <div className="flex-1 h-full flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h1 className="text-lg font-black uppercase tracking-widest text-white">Biblioteca Interna</h1>
            <span className="text-xs font-black text-red-500 font-mono">{filteredAds.length}</span>
          </div>

          <div className="relative group flex items-center">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <AdCardSkeleton key={i} />) :
              filteredAds.map(ad => <AdCard key={ad.id} ad={ad} isFavorite={favorites.includes(ad.id)} onToggleFavorite={handleToggleFavorite} />)}
          </div>
        </div>
      </div>

      {/* Sidebar de Filtros */}
      <div className="w-80 shrink-0 border-l border-zinc-800 bg-zinc-950/80 p-6 space-y-6">
        <div className="space-y-3">
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Nicho / Categoria</span>
          <select value={selectedNiche} onChange={(e) => setSelectedNiche(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white">
            <option value="">TODOS OS NICHOS</option>
            <option value="truque">TRUQUE</option>
            <option value="emagrecimento">EMAGRECIMENTO</option>
            <option value="renda extra">RENDA EXTRA</option>
          </select>
        </div>
      </div>
    </div>
  );
};