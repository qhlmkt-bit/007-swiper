import React, { useState } from 'react';
import { 
  ArrowLeft, Video, Download, FileText, ShieldCheck, 
  Info, Tag, Lock, Target, Flame, ImageIcon,
  Monitor, Facebook, ExternalLink, ZapOff, Star, Globe 
} from 'lucide-react';

// --- UTILS ISOLADOS PARA O COMPONENTE ---
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
const isDirectVideo = (url: string) => { const clean = url.trim().toLowerCase(); return clean.includes('.mp4') || clean.includes('.m3u8') || clean.includes('bunny.net') || clean.includes('b-cdn.net'); };
const getFastDownloadUrl = (url: string) => {
  if (!url) return ''; const trimmed = url.trim(); 
  if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    if (trimmed.includes('playlist.m3u8')) return trimmed.replace('playlist.m3u8', 'play_480p.mp4');
    if (trimmed.endsWith('original')) return trimmed.replace('original', 'play_480p.mp4');
  } return trimmed;
};

// --- PLAYER BLINDADO ---
const VideoPlayer: React.FC<{ url: string; title?: string; type?: 'vsl' | 'creative' }> = ({ url, type = 'vsl' }) => { 
  const trimmed = url ? url.trim() : '';
  if (!trimmed) return (
    <div className="w-full aspect-video bg-[#050505] flex items-center justify-center border border-white/5 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#121212] p-4 rounded-full border border-white/10 mb-4"><ZapOff size={24} className="text-zinc-600" /></div>
        <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">{type === 'vsl' ? "OFERTA SEM VSL" : "MÍDIA INDISPONÍVEL"}</p>
      </div>
    </div>
  ); 

  let content;
  if (trimmed.match(/\.(jpeg|jpg|gif|png|webp)$/i) || trimmed.includes('drive.google.com/thumbnail') || trimmed.includes('drive.google.com/file')) {
    content = <img src={getDriveDirectLink(trimmed) || trimmed} alt="Media" loading="lazy" className="w-full h-full object-contain bg-black" />;
  } else if (trimmed.includes('bunny.net') || trimmed.includes('b-cdn.net')) {
    let baseUrl = trimmed.replace(/playlist\.m3u8|play_720p\.mp4|play_480p\.mp4|play_360p\.mp4|original/, '');
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    content = <video className="w-full h-full object-contain bg-black" controls playsInline controlsList="nodownload"><source src={`${baseUrl}play_720p.mp4`} type="video/mp4" /><source src={`${baseUrl}play_480p.mp4`} type="video/mp4" /></video>;
  } else if (isDirectVideo(trimmed)) {
    content = <video className="w-full h-full object-contain bg-black" controls playsInline><source src={trimmed} type="video/mp4" /></video>;
  } else {
    const embedUrl = trimmed.includes('vimeo.com') ? `https://player.vimeo.com/video/${trimmed.match(/(?:vimeo\.com\/|video\/)([0-9]+)/)?.[1]}` : (trimmed.includes('youtube.com') ? `https://www.youtube.com/embed/${trimmed.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}` : trimmed);
    content = <iframe className="w-full h-full" src={embedUrl} frameBorder="0" allowFullScreen></iframe>;
  }
  return <div className="w-full aspect-video flex items-center justify-center bg-black overflow-hidden relative border border-white/5">{content}</div>;
};

// --- COMPONENTE PRINCIPAL ---
export const OfferDetails = ({ offer, onBack, isFavorite, onFavoriteToggle }: any) => {
  const [activeVslIndex, setActiveVslIndex] = useState(0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button onClick={onBack} className="flex items-center text-zinc-500 hover:text-[#D4AF37] transition-all font-black uppercase text-xs tracking-widest group">
          <div className="bg-[#121212] p-2 rounded-lg mr-3 group-hover:bg-[#D4AF37] group-hover:text-black transition-all border border-white/5"><ArrowLeft size={16} /></div>
          Voltar ao Radar
        </button>

        <button 
          onClick={onFavoriteToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
            isFavorite 
              ? 'bg-[#D4AF37] text-black border-[#D4AF37] hover:bg-[#D4AF37]/90' 
              : 'bg-[#121212] text-zinc-400 border-white/5 hover:text-white hover:bg-white/5'
          }`}
        >
          <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? 'FAVORITADO' : 'FAVORITAR'}
        </button>
      </div>
      
      <div className="space-y-10">
        {/* CABEÇALHO COM MÉTRICAS */}
        {offer.views && offer.views.trim() !== '' && (
          <div className="flex items-center gap-3 bg-[#121212] px-5 py-3 rounded-lg border border-[#D4AF37]/30 w-fit">
            <Flame size={16} className="text-[#D4AF37] animate-pulse" />
            <span className="text-[#D4AF37] font-black text-xs uppercase tracking-widest">{offer.views} ANÚNCIOS ATIVOS NESTE FUNIL</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* COLUNA ESQUERDA: VSL */}
          <div className="w-full lg:w-[65%] space-y-4">
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 h-full flex flex-col">
              <div className="flex bg-[#050505] p-1.5 gap-2 overflow-x-auto rounded-lg mb-4 scrollbar-hide shrink-0 border border-white/5">
                {offer.vslLinks.map((_: any, idx: number) => (
                  <button key={idx} onClick={() => setActiveVslIndex(idx)} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded flex items-center gap-2 whitespace-nowrap ${activeVslIndex === idx ? 'bg-[#D4AF37] text-black' : 'text-zinc-500 hover:text-white'}`}>
                    <Video size={14} /> {offer.vslLinks.length > 1 ? `VSL ${idx + 1}` : 'VSL'}
                  </button>
                ))}
              </div>
              <div className="rounded-lg overflow-hidden border border-white/5 flex-1 bg-black">
                <VideoPlayer url={offer.vslLinks[activeVslIndex]?.url} title="VSL Player" type="vsl" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={getFastDownloadUrl(offer.vslDownloadUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded hover:scale-[1.02] transition-all">
                  <Download size={14} /> BAIXAR VSL MP4
                </a>
                <a href={offer.transcriptionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#121212] text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded hover:text-white hover:bg-white/5 transition-all border border-white/5">
                  <FileText size={14} /> ACESSAR SCRIPT
                </a>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: DADOS DE ESPIONAGEM */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/5 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-[#D4AF37] font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2 shrink-0">
                  <ShieldCheck size={14} /> INTELIGÊNCIA DA OFERTA
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Info, label: 'NOME DA OFERTA', value: offer.title }, 
                    { icon: Tag, label: 'NICHO', value: offer.niche }, 
                    { icon: Lock, label: 'MODELO', value: offer.productType }, 
                    { icon: Target, label: 'TRÁFEGO', value: offer.trafficSource.join(', ') },
                    { icon: Globe, label: 'IDIOMA', value: offer.language ? (offer.language.toUpperCase() === 'PT-BR' ? 'Português' : offer.language) : 'Português' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col p-4 bg-[#050505] rounded-lg border border-white/5 gap-1.5">
                      <div className="flex items-center gap-2">
                        <item.icon className="text-[#D4AF37]" size={12} />
                        <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-zinc-200 text-xs font-bold uppercase tracking-tight break-words">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTOES DE INFRAESTRUTURA EXTERNA */}
              <div className="mt-6 space-y-3 shrink-0">
                <a 
                  href={offer.pageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 bg-[#121212] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#050505] rounded-lg text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                      <Monitor size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Acessar Link</p>
                      <p className="text-zinc-200 group-hover:text-white font-black uppercase text-xs">PÁGINA OFICIAL</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-zinc-500 group-hover:text-[#D4AF37] transition-colors" />
                </a>

                <a 
                  href={offer.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 bg-[#121212] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all rounded-lg group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#050505] rounded-lg text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                      <Facebook size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Spy Tool</p>
                      <p className="text-zinc-200 group-hover:text-white font-black uppercase text-xs">BIBLIOTECA DE ANÚNCIOS</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-zinc-500 group-hover:text-[#D4AF37] transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CRIATIVOS DA CAMPANHA */}
        {((offer.creativeEmbedUrls && offer.creativeEmbedUrls.trim() !== '') || 
          (offer.creativeDownloadUrls && offer.creativeDownloadUrls.trim() !== '') ||
          (offer.creativeZipUrl && offer.creativeZipUrl.trim() !== '')) && (
          <div className="space-y-4">
            <h3 className="text-zinc-400 font-black uppercase text-xs tracking-widest flex items-center gap-2">
              <ImageIcon size={14} className="text-[#D4AF37]"/> 
              CRIATIVOS E MÍDIAS DE ANÚNCIO
            </h3>
            
            {offer.creativeZipUrl && offer.creativeZipUrl.trim() !== '' && (
              <a href={offer.creativeZipUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all mb-2">
                <Download size={14} /> BAIXAR ZIP DE CRIATIVOS COMPLETO
              </a>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const embeds = offer.creativeEmbedUrls ? offer.creativeEmbedUrls.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
                const downloads = offer.creativeDownloadUrls ? offer.creativeDownloadUrls.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
                const maxLen = Math.max(embeds.length, downloads.length);
                
                if (maxLen === 0) return <p className="text-zinc-500 text-xs font-bold uppercase">Nenhum criativo disponível para visualização.</p>;
                
                return Array.from({ length: maxLen }).map((_, idx) => {
                  const embedUrl = embeds[idx] || '';
                  const downloadUrl = downloads[idx] || '';
                  return (
                    <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                      <div className="rounded-lg overflow-hidden border border-white/5 bg-black">
                        <VideoPlayer url={embedUrl || downloadUrl} title={`Criativo ${idx + 1}`} type="creative" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zinc-500">CRIATIVO #{idx + 1}</span>
                        {downloadUrl && (
                          <a href={getFastDownloadUrl(downloadUrl)} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline flex items-center gap-1">
                            <Download size={12} /> BAIXAR
                          </a>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};