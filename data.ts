
import { Offer } from './types';

export const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Protocolo Zero Barriga',
    niche: 'Emagrecimento',
    language: 'Português',
    trafficSource: 'Facebook Ads',
    productType: 'Low Ticket',
    structure: 'VSL + Checkout',
    trend: 'Escalando',
    vslLinks: [
      { label: 'VSL Principal', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { label: 'VSL de Remarketing', url: 'https://www.youtube.com/embed/9bZkp7q19f0' }
    ],
    downloadUrl: '#',
    facebookUrl: '#',
    pageUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
    views: 45200,
    transcription: 'Este protocolo foi desenvolvido para quem deseja resultados rápidos sem dietas restritivas. Começamos entendendo o metabolismo e como ativar a queima de gordura visceral através de ciclos de 24 horas...',
    creativeImages: ['https://picsum.photos/seed/pzb1/400/400', 'https://picsum.photos/seed/pzb2/400/400', 'https://picsum.photos/seed/pzb3/400/400']
  },
  {
    id: '2',
    title: 'Renda Turbo IA',
    niche: 'Renda Extra',
    language: 'Português',
    trafficSource: 'YouTube Ads',
    productType: 'Infoproduto',
    structure: 'Webinar',
    trend: 'Em Alta',
    vslLinks: [
      { label: 'Webinar de Vendas', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    downloadUrl: '#',
    facebookUrl: '#',
    pageUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format&fit=crop',
    views: 28400,
    transcription: 'A inteligência artificial está criando milionários todos os dias. Neste treinamento, mostro como configurar robôs simples para realizar arbitragem de tráfego de forma 100% automática...',
    creativeImages: ['https://picsum.photos/seed/rtia1/400/400', 'https://picsum.photos/seed/rtia2/400/400']
  },
  {
    id: '3',
    title: 'Código da Sedução',
    niche: 'Relacionamento',
    language: 'Português',
    trafficSource: 'Instagram Ads',
    productType: 'Infoproduto',
    structure: 'VSL',
    trend: 'Escalando',
    vslLinks: [
      { label: 'VSL Direct', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { label: 'VSL Storytelling', url: 'https://www.youtube.com/embed/9bZkp7q19f0' }
    ],
    downloadUrl: '#',
    facebookUrl: '#',
    pageUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1516589174184-c685266d430c?q=80&w=800&auto=format&fit=crop',
    views: 67100,
    transcription: 'Existe uma linguagem oculta que ativa o desejo primitivo no cérebro feminino. Não se trata de aparência ou dinheiro, mas sim de gatilhos psicológicos específicos que você pode aprender hoje...',
    creativeImages: ['https://picsum.photos/seed/cds1/400/400', 'https://picsum.photos/seed/cds2/400/400']
  },
  {
    id: '4',
    title: 'Manual do Cabelo',
    niche: 'Beleza',
    language: 'Português',
    trafficSource: 'TikTok Ads',
    productType: 'E-book',
    structure: 'Sales Page',
    trend: 'Em Alta',
    vslLinks: [
      { label: 'Pitch de Vendas', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    downloadUrl: '#',
    facebookUrl: '#',
    pageUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1560869713-7d0a29430863?q=80&w=800&auto=format&fit=crop',
    views: 19800,
    transcription: 'Recupere o brilho e a força do seu cabelo em 30 dias usando apenas ingredientes naturais que você já tem na cozinha. O segredo que a indústria da beleza não quer que você saiba...',
    creativeImages: ['https://picsum.photos/seed/mdc1/400/400', 'https://picsum.photos/seed/mdc2/400/400', 'https://picsum.photos/seed/mdc3/400/400']
  },
  {
    id: '5',
    title: 'Chave do Desejo',
    niche: 'Sexualidade',
    language: 'Português',
    trafficSource: 'Native Ads',
    productType: 'Nutracêutico',
    // Fix: Added missing 'structure' property required by the Offer interface
    structure: 'VSL',
    trend: 'Escalando',
    vslLinks: [
      { label: 'VSL Nativa 1', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { label: 'VSL Nativa 2', url: 'https://www.youtube.com/embed/9bZkp7q19f0' }
    ],
    downloadUrl: '#',
    facebookUrl: '#',
    pageUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    views: 89000,
    transcription: 'Aumente o vigor e a libido em até 300% com esta fórmula clínica aprovada. Resultados permanentes e naturais para transformar sua vida íntima e sua confiança instantaneamente...',
    creativeImages: ['https://picsum.photos/seed/cdd1/400/400', 'https://picsum.photos/seed/cdd2/400/400']
  }
];
