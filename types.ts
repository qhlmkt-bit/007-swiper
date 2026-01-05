
export type ProductType = 'Infoproduto' | 'Low Ticket' | 'Nutracêutico' | 'Dropshipping' | string;

export type Niche = 
  | 'Exercícios' | 'Disfunção Erétil' | 'Outros' | 'Próstata' 
  | 'Lei da Atração/Prosperidade' | 'Emagrecimento' | 'Rejuvenescimento' 
  | 'Renda Extra' | 'Infantil/Maternidade' | 'Dores Articulares' 
  | 'Sexualidade' | 'Alzheimer' | 'Pet' | 'Neuropatia' 
  | 'Evangélico/Cristianismo' | 'Relacionamento' | 'Desenvolvimento Pessoal' 
  | 'Diabetes' | 'Menopausa' | 'Saúde Mental' | 'Visão' 
  | 'Aumento Peniano' | 'Pressão Alta' | 'Saúde Respiratória' 
  | 'Calvície' | 'Pack' | 'Escrita' | 'Idiomas' | 'Prisão de Ventre' 
  | 'Beleza' | 'Fungos' | 'Nutrição' | 'Produtividade' 
  | 'Refluxo/Gastrite' | 'Moda' | 'Edema' | 'Varizes' | 'Zumbido' | string;

export interface Offer {
  id: string;
  title: string;
  niche: Niche;
  language: string;
  trafficSource: string;
  productType: ProductType;
  structure: string;
  vslUrl: string;
  facebookUrl: string;
  pageUrl: string;
  coverImage: string;
  views: number;
  transcription: string;
  creativeImages: string[];
}

export interface ChartData {
  name: string;
  value: number;
}
