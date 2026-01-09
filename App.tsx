import React from 'react';

const CHECKOUT_URL = "https://go.perfectpay.com.br/PPU38CQ5PGO";

const App = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Injeção de CSS para garantir o Tema Dark */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #0a0a0a !important; color: white !important; }
        .card-dark { background-color: #121212 !important; border: 1px solid #262626; }
        .text-gold { color: #D4AF37 !important; }
        .bg-gold { background-color: #D4AF37 !important; color: black !important; }
        @keyframes pulse-gold {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        .animate-gold { animation: pulse-gold 2s infinite; }
      `}} />

      {/* Header */}
      <nav className="border-b border-gray-800 p-6 flex justify-between items-center bg-[#0d0d0d]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter text-gold">007 SWIPER</span>
          <span className="bg-gold text-[10px] font-bold px-2 py-0.5 rounded">AGENTE ATIVO</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
          ESPIONAGEM DE <span className="text-gold">OFERTAS</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          Acesse o arsenal secreto que os grandes produtores usam para faturar 7 dígitos. Criativos, VSLs e Funis validados.
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plano Mensal */}
          <div className="card-dark p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-2 text-white">PLANO MENSAL</h3>
            <div className="text-4xl font-bold mb-6 text-gold">R$ 197<span className="text-sm text-gray-500">/mês</span></div>
            <ul className="text-left space-y-4 mb-8 text-gray-400 text-sm">
              <li>✓ Banco de Ofertas VIP</li>
              <li>✓ Arsenal de Criativos</li>
              <li>✓ Templates de Funil</li>
              <li>✓ Transcrições Ilimitadas</li>
            </ul>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" 
               className="block w-full bg-gold font-bold py-4 rounded-xl transition-transform hover:scale-105 animate-gold text-center">
              QUERO ACESSO MENSAL
            </a>
          </div>

          {/* Plano Trimestral */}
          <div className="card-dark border-2 border-gold p-8 rounded-2xl relative transform md:scale-105">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-[10px] font-bold px-4 py-1 rounded-full uppercase">Melhor Custo-Benefício</span>
            <h3 className="text-xl font-bold mb-2 text-gold">PLANO TRIMESTRAL</h3>
            <div className="text-4xl font-bold mb-6 text-gold">R$ 497<span className="text-sm text-gray-500">/trimestre</span></div>
            <ul className="text-left space-y-4 mb-8 text-gray-400 text-sm">
              <li>✓ Tudo do Mensal</li>
              <li>✓ Comunidade VIP</li>
              <li>✓ Radar Global 007</li>
              <li>✓ 12% OFF em Edições</li>
            </ul>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" 
               className="block w-full bg-gold font-bold py-4 rounded-xl transition-transform hover:scale-105 animate-gold text-center">
              ASSINAR PLANO TRIMESTRAL
            </a>
          </div>

        </div>

        {/* Garantia */}
        <div className="mt-16 p-6 card-dark rounded-xl inline-block max-w-xl">
