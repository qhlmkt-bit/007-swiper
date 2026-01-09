import React from 'react';

// Link do seu checkout da Perfect Pay
const CHECKOUT_URL = "https://go.perfectpay.com.br/PPU38CQ5PGO";

const App = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-gold selection:text-black">
      {/* Script do Tailwind injetado via código para garantir o design */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-gold { background-color: #D4AF37; }
        .text-gold { color: #D4AF37; }
        .border-gold { border-color: #D4AF37; }
        @keyframes pulse-gold {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        .animate-pulse-gold { animation: pulse-gold 2s infinite; }
      `}} />

      {/* Header */}
      <nav className="border-b border-gray-800 p-6 flex justify-between items-center bg-[#0d0d0d]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tighter text-gold">007 SWIPER</span>
          <span className="bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded">AGENTE ATIVO</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          A MAIOR PLATAFORMA DE <span className="text-gold">ESPIONAGEM DE OFERTAS</span>
        </h1>
        <p className="text-gray-400 text-xl mb-12 max-w-3xl mx-auto">
          Acesse o arsenal secreto que os grandes produtores usam para faturar 7 dígitos todos os meses. Criativos, VSLs e Funis validados na palma da sua mão.
        </p>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
          
          {/* Plano Mensal */}
          <div className="bg-[#121212] border border-gray-800 p-8 rounded-2xl hover:border-gold transition-all">
            <h3 className="text-xl font-bold mb-2">PLANO MENSAL</h3>
            <div className="text-4xl font-bold mb-6 text-gold">R$ 197<span className="text-sm text-gray-500">/mês</span></div>
            <ul className="text-left space-y-4 mb-8 text-gray-300">
              <li className="flex items-center gap-2">✓ Banco de Ofertas VIP</li>
              <li className="flex items-center gap-2">✓ Arsenal de Criativos</li>
              <li className="flex items-center gap-2">✓ Templates de Funil</li>
              <li className="flex items-center gap-2">✓ Transcrições Ilimitadas</li>
            </ul>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" 
               className="block w-full bg-gold text-black font-bold py-4 rounded-xl hover:scale-105 transition-transform animate-pulse-gold">
              QUERO ACESSO MENSAL
            </a>
          </div>

          {/* Plano Trimestral */}
          <div className="bg-[#121212] border-2 border-gold p-8 rounded-2xl relative transform scale-105">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-4 py-1 rounded-full">MELHOR CUSTO-BENEFÍCIO</span>
            <h3 className="text-xl font-bold mb-2 text-gold">PLANO TRIMESTRAL</h3>
            <div className="text-4xl font-bold mb-6 text-gold">R$ 497<span className="text-sm text-gray-500">/trimestre</span></div>
            <ul className="text-left space-y-4 mb-8 text-gray-300">
              <li className="flex items-center gap-2">✓ Tudo do Mensal</li>
              <li className="flex items-center gap-2">✓ Comunidade VIP</li>
              <li className="flex items-center gap-2">✓ Radar Global 007</li>
              <li className="flex items-center gap-2">✓ 12% OFF em Edições</li>
            </ul>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" 
               className="block w-full bg-gold text-black font-bold py-4 rounded-xl hover:scale-105 transition-transform animate-pulse-gold">
              ASSINAR PLANO TRIMESTRAL
            </a>
          </div>

        </div>

        {/* Garantia */}
        <div className="mt-20 p-8 bg-[#0d0d0d] rounded-2xl border border-gray-800 inline-block">
          <h4 className="text-xl font-bold mb-2">GARANTIA DE 7 DIAS</h4>
          <p className="text-gray-400">Não gostou? Devolvemos seu investimento sem perguntas. Risco zero para você espiar o mercado.</p>
        </div>
      </main>

      <footer className="py-10 text-center text-gray-600 text-sm border-t border-gray-900 mt-20">
        © 2024 007 SWIPER Intelligence Platform. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
