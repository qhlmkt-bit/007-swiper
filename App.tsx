import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Star, 
  Settings, 
  Tag, 
  Palette, 
  FileText, 
  Search, 
  Menu, 
  X,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Play,
  Monitor,
  Eye,
  CheckCircle,
  BarChart2,
  Lock,
  Unlock,
  ShieldCheck,
  Trophy,
  AlertTriangle,
  Download,
  Video,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { MOCK_OFFERS } from './data/data';

// Definições de Tipos para evitar erro na Vercel
type ProductType = 'Infoproduto' | 'Low Ticket' | 'Nutracêutico' | 'Dropshipping';
type Niche = string;

interface Offer {
  id: string;
  title: string;
  niche: string;
  productType: string;
  description: string;
  coverImage: string;
  trend: string;
  views: number;
  vslLinks: { label: string; url: string }[];
  downloadUrl: string;
  transcription: string;
  creativeImages: string[];
  facebookUrl: string;
  pageUrl: string;
  language: string;
  trafficSource: string[];
}

const PRODUCT_TYPES: ProductType[] = ['Infoproduto', 'Low Ticket', 'Nutracêutico', 'Dropshipping'];

const NICHES: Niche[] = [
  'Exercícios', 'Disfunção Erétil', 'Outros', 'Próstata', 
  'Lei da Atração/Prosperidade', 'Emagrecimento', 'Rejuvenescimento', 
  'Renda Extra', 'Infantil/Maternidade', 'Dores Articulares', 
  'Sexualidade', 'Alzheimer', 'Pet', 'Neuropatia', 
  'Evangélico/Cristianismo', 'Relacionamento', 'Desenvolvimento Pessoal', 
  'Diabetes', 'Menopausa', 'Saúde Mental', 'Visão', 
  'Aumento Peniano', 'Pressão Alta', 'Saúde Respiratória', 
  'Calvície', 'Pack', 'Escrita', 'Idiomas', 'Prisão de Ventre', 
  'Beleza', 'Fungos', 'Nutrição', 'Produtividade', 
  'Refluxo/Gastrite', 'Moda', 'Edema', 'Varizes', 'Zumbido'
];

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-[#D4AF37] bg-opacity-10 text-[#D4AF37]' 
        : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
  <div className="mb-12">
    <div className="flex items-center space-x-2 mb-6">
      <Icon className="text-[#D4AF37]" size={24} />
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  </div>
);

interface OfferCardProps {
  offer: Offer;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ 
  offer, 
  isFavorite, 
  onToggleFavorite, 
  onClick 
}) => (
  <div 
    onClick={onClick}
    className="bg-zinc-900 rounded-xl overflow-hidden group cursor-pointer border border-transparent hover:border-[#D4AF37] transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={offer.coverImage} 
        alt={offer.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {offer.trend === 'Escalando' && (
          <div className="px-2 py-1 bg-green-600 text-white text-[9px] font-black rounded uppercase flex items-center gap-1 shadow-lg">
            <Zap size={10} /> Escalando
          </div>
        )}
        {offer.trend === 'Em Alta' && (
          <div className="px-2 py-1 bg-[#D4AF37] text-black text-[9px] font-black rounded uppercase flex items-center gap-1 shadow-lg">
            <TrendingUp size={10} /> Em Alta
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 flex space-x-2">
        <button 
          onClick={onToggleFavorite}
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${
            isFavorite ? 'bg-[#D4
