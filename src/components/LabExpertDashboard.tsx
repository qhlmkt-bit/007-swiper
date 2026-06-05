import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Target, Shield, FileText, Copy, 
  Sparkles, Award, RefreshCw, ChevronRight
} from 'lucide-react';

export const LabExpertDashboard: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number | null>(1);
  const [copiedText, setCopiedText] = useState<string>('');

  // Phase 1 States
  const [pitchCategory, setPitchCategory] = useState<'cold' | 'meeting'>('cold');
  const [checklist, setChecklist] = useState({
    contrato: false,
    divisao: false,
    acessoRedes: false,
    alinhamentoExpectativa: false,
    definicaoEntregas: false
  });

  // Phase 2 States
  const [selectedProfession, setSelectedProfession] = useState<string>('Fisioterapeuta');
  const [isMappingLoading, setIsMappingLoading] = useState<boolean>(false);
  const [mappingResult, setMappingResult] = useState<string>('');
  const [expertProfession, setExpertProfession] = useState<string>('Fisioterapeuta');
  const [customProfession, setCustomProfession] = useState<string>('');

  const fetchExpertMapping = async (profession: string) => {
    if (!profession.trim()) return;
    setIsMappingLoading(true);
    setMappingResult('');
    setSelectedProfession(profession);
    setExpertProfession(profession);

    const apiKey = ((import.meta as any).env.VITE_GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      setMappingResult('[ERRO] Chave de API não detectada no arquivo .env');
      setIsMappingLoading(false);
      return;
    }

    try {
      const promptText = 'Atue como um estrategista de marketing digital de alto nível. Crie um mapeamento comercial rápido e direto para a profissão: ' + profession + '. Retorne a resposta estritamente formatada com estes 4 títulos em Markdown: Nicho Ultra-Específico Recomendado:, Transição de Modelo Comercial:, Mapeamento Biológico de Dores (3 bullet points):, e Produto Premium Sugerido:.';
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }

      const json = await response.json();
      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text || 'Nenhuma resposta gerada.';
      setMappingResult(reply);
    } catch (error) {
      console.error('API Error:', error);
      setMappingResult('[SISTEMA] Falha na rede ou na API do Google. Verifique sua chave no AI Studio.');
    } finally {
      setIsMappingLoading(false);
    }
  };

  useEffect(() => {
    fetchExpertMapping('Fisioterapeuta');
  }, []);

  const parseMappingResult = (text: string) => {
    const headers = [
      { key: 'Nicho Ultra-Específico Recomendado:', title: 'Nicho Ultra-Específico Recomendado' },
      { key: 'Transição de Modelo Comercial:', title: 'Transição de Modelo Comercial' },
      { key: 'Mapeamento Biológico de Dores (3 bullet points):', title: 'Mapeamento Biológico de Dores' },
      { key: 'Produto Premium Sugerido:', title: 'Produto Premium Sugerido' }
    ];

    const findHeaderIndex = (txt: string, header: string) => {
      const normalizedTxt = txt.toLowerCase();
      const normalizedHeader = header.toLowerCase();
      let index = normalizedTxt.indexOf(normalizedHeader);
      if (index === -1) {
        const noColon = normalizedHeader.replace(/:$/, '');
        index = normalizedTxt.indexOf(noColon);
      }
      return index;
    };

    const sortedFound = headers
      .map(h => {
        let idx = findHeaderIndex(text, h.key);
        if (idx === -1) {
          const noColon = h.key.replace(/:$/, '');
          idx = findHeaderIndex(text, noColon);
        }
        return { ...h, index: idx };
      })
      .filter(h => h.index !== -1)
      .sort((a, b) => a.index - b.index);

    if (sortedFound.length === 0) {
      return (
        <div className="text-zinc-300 font-mono text-xs leading-relaxed whitespace-pre-wrap bg-[#050505] border border-white/5 p-5 rounded-lg overflow-y-auto max-h-[400px]">
          {text}
        </div>
      );
    }

    const sections: { title: string; content: string }[] = [];
    for (let i = 0; i < sortedFound.length; i++) {
      const current = sortedFound[i];
      const next = sortedFound[i + 1];
      
      const originalHeaderMatch = text.substring(current.index, current.index + current.key.length + 5);
      const colonIndex = originalHeaderMatch.indexOf(':');
      const headerLength = colonIndex !== -1 ? colonIndex + 1 : current.key.length;
      
      const start = current.index + headerLength;
      const end = next ? next.index : text.length;
      
      let content = text.substring(start, end).trim();
      content = content.replace(/^[*:\s#-]+/, '').replace(/[*#]+$/, '').trim();
      
      sections.push({
        title: current.title,
        content: content
      });
    }

    return (
      <div className="space-y-4">
        {sections.map((sec, idx) => {
          const isGold = sec.title.includes('Produto') || sec.title.includes('Dores');
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isGold ? 'bg-[#0e0e0a] border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.02)]' : 'bg-[#0a0a0a] border-white/5'
              }`}
            >
              <p className="text-[8px] text-[#D4AF37] font-bold uppercase tracking-wider">{sec.title}</p>
              {sec.title.includes('Dores') ? (
                <div className="text-[10px] text-zinc-400 mt-2 leading-relaxed whitespace-pre-wrap font-sans">
                  {sec.content}
                </div>
              ) : (
                <p className="text-[11px] text-white font-bold uppercase mt-1 leading-relaxed whitespace-pre-wrap font-sans">
                  {sec.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Phase 3 States
  const [editorialDay, setEditorialDay] = useState<string>('Segunda');
  const [generatedPost, setGeneratedPost] = useState<string>('');
  const [postType, setPostType] = useState<'mito' | 'caso' | 'ciencia'>('mito');

  // Phase 4 States
  const [vslTargetOutcome, setVslTargetOutcome] = useState<string>('Eliminar a dor ciática crônica sem remédios');
  const [expertName, setExpertName] = useState<string>('Dr. Marcos Silva');
  const [generatedVsl, setGeneratedVsl] = useState<{ hook: string; rootCause: string; method: string; offer: string } | null>(null);

  // Clipboard utility
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Pre-configured Expert Data for Phase 2
  const expertPresets: Record<string, { niche: string; painPoints: string[]; proposal: string; product: string }> = {
    Fisioterapeuta: {
      niche: 'Tratamento de Dor Lombar e Hérnia de Disco em Executivos',
      painPoints: [
        'Falta de tempo para sessões de fisioterapia presencial diariamente.',
        'Dor constante ao sentar por mais de 1 hora no escritório.',
        'Medo de precisar de cirurgia na coluna.'
      ],
      product: 'Mentoria Premium "Coluna de Ferro 007": Acompanhamento híbrido de 8 semanas com protocolo de exercícios de 15 min diários e suporte VIP individual.',
      proposal: 'Transformar sessões avulsas de R$ 150 em um programa de alinhamento postural de alta performance de R$ 3.000, vendendo a liberdade de trabalhar sem dor.'
    },
    Nutricionista: {
      niche: 'Emagrecimento Definitivo para Mulheres de Negócios com Menopausa',
      painPoints: [
        'Metabolismo lento e fadiga constante durante reuniões.',
        'Ansiedade descontada em doces no fim do dia.',
        'Dietas restritivas que destroem o foco e a produtividade.'
      ],
      product: 'Programa "Reset Metabólico": Protocolo nutricional anti-inflamatório individualizado de 60 dias com foco em energia cerebral e equilíbrio hormonal.',
      proposal: 'Deixar de vender consultas de retorno e criar uma mentoria de R$ 2.500 focada no restabelecimento da vitalidade celular e perda de peso sem passar fome.'
    },
    Advogado: {
      niche: 'Blindagem Patrimonial e Sucessória para Famílias do Agronegócio',
      painPoints: [
        'Risco de perda da fazenda e bens devido a disputas familiares.',
        'Altos custos tributários no processo de inventário.',
        'Falta de um plano de transição de gestão claro para a próxima geração.'
      ],
      product: 'Masterclass + Diagnóstico Individualizado de Governança Familiar Patrimonial.',
      proposal: 'Substituir a advocacia contenciosa reativa por um serviço de consultoria estrutural preventiva de R$ 15.000 a R$ 50.000 por holding montada.'
    }
  };

  const currentPreset = expertPresets[expertProfession] || {
    niche: 'Nicho Especializado do Expert',
    painPoints: ['Dor A', 'Dor B', 'Dor C'],
    product: 'Mentoria Premium customizada focada no método autoral.',
    proposal: 'Empacotar o conhecimento do expert em uma oferta de alto ticket baseado em entrega híbrida.'
  };

  // Generate content script for Phase 3
  const handleGeneratePost = () => {
    let text = '';
    const profession = expertProfession;
    if (postType === 'mito') {
      text = `🔥 [POST ORGÂNICO: DESTRUIÇÃO DE MITO]\n\n` +
             `📌 Título: O erro clássico de quem tenta resolver ${currentPreset.niche} sozinho.\n\n` +
             `✍️ Legenda/Roteiro:\n` +
             `Se você acha que a solução para sua dor/problema é fazer o que todo mundo faz (alongar sem parar, cortar todo carboidrato, ou fazer contratos genéricos da internet), preste muita atenção.\n\n` +
             `Como ${profession}, eu vejo pessoas agravando a situação todos os dias por causa de 3 mitos perigosos:\n` +
             `1️⃣ Mito 1: Achar que repouso absoluto resolve (ou que restrição severa é o caminho).\n` +
             `2️⃣ Mito 2: Tratar o sintoma imediato ao invés da causa biológica profunda.\n` +
             `3️⃣ Mito 3: Acreditar que o que funciona para o vizinho serve para o seu caso específico.\n\n` +
             `A verdade científica é: Sem um plano desenhado sob medida para a sua rotina, o problema só vai aumentar.\n\n` +
             `💬 Quer descobrir onde está o verdadeiro gargalo do seu caso? Deixe a palavra "QUERO" nos comentários que eu vou analisar seu perfil pessoalmente no direct.`;
    } else if (postType === 'caso') {
      text = `📈 [POST ORGÂNICO: ESTUDO DE CASO]\n\n` +
             `📌 Título: Como meu paciente/cliente eliminou a pior dor em apenas 21 dias.\n\n` +
             `✍️ Legenda/Roteiro:\n` +
             `Quando ele chegou no meu consultório, ele estava cético. Ele já tinha tentado de tudo:\n` +
             `❌ [Inserir dor comum mapeada]\n` +
             `❌ Consultas rápidas de convênio que não olhavam no olho.\n\n` +
             `Mas quando aplicamos o Protocolo Científico focado na raiz do problema, o jogo mudou.\n\n` +
             `Em 1 semana, a inflamação cedeu. Em 3 semanas, ele pôde voltar a fazer o que mais amava sem nenhuma limitação.\n\n` +
             `Isso não é mágica. É técnica combinada com consistência.\n\n` +
             `👉 Se você quer ter esses mesmos resultados com o meu acompanhamento direto, clique no link da bio e aplique para a minha mentoria individual.`;
    } else {
      text = `🧪 [POST ORGÂNICO: AUTORIDADE CIENTÍFICA]\n\n` +
             `📌 Título: A ciência por trás da resolução definitiva de ${currentPreset.niche}.\n\n` +
             `✍️ Legenda/Roteiro:\n` +
             `Artigos científicos recentes publicados no principal jornal da nossa área médica/técnica comprovam:\n\n` +
             `O fator determinante para a cura não é a quantidade de tratamento, mas sim o estímulo à regeneração correta (ou estruturação preventiva correta).\n\n` +
             `É por isso que no meu método nós não focamos em "remendos temporários". Nós aplicamos um plano fundamentado em evidências científicas sólidas.\n\n` +
             `Você prefere continuar testando dicas aleatórias da internet ou quer seguir um método validado pela ciência?\n\n` +
             `💬 Toque no link da minha bio e fale diretamente comigo para desenharmos sua rota de tratamento.`;
    }
    setGeneratedPost(text);
  };

  // Generate VSL script for Phase 4
  const handleGenerateVsl = () => {
    const outcome = vslTargetOutcome || 'conquistar o resultado desejado de forma definitiva';
    const name = expertName || 'nosso especialista';
    
    setGeneratedVsl({
      hook: `⚠️ ATENÇÃO: Se você sofre com isso e quer ${outcome}, este vídeo pode salvar sua saúde e seu bolso.\n` +
            `Nos próximos 3 minutos, eu vou te mostrar como as abordagens tradicionais estão piorando o seu quadro e o que a ciência de ponta realmente diz sobre a cura definitiva.`,
      rootCause: `Por muito tempo, disseram que o problema era puramente superficial. Mas estudos clínicos mostram que a causa raiz é muito mais profunda: está associada à sobrecarga inflamatória crônica e ao enfraquecimento das bases de sustentação.\n` +
                 `Sem tratar essa base biológica, qualquer remédio ou solução temporária é como colocar um curativo em um motor quebrado.`,
      method: `Meu nome é ${name}, e dediquei os últimos anos desenvolvendo um protocolo clínico exclusivo que ataca diretamente essa causa raiz, restabelecendo o equilíbrio e a força natural do seu organismo. Um método validado por mais de centenas de casos reais sob minha supervisão direta.`,
      offer: `É por isso que eu criei a Mentoria Premium Coluna de Ferro. Um acompanhamento VIP passo a passo onde eu pego na sua mão e guio sua reabilitação de forma individualizada.\n` +
             `Clique no botão abaixo, faça sua aplicação e garanta sua vaga para conversar comigo ainda esta semana.`
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans antialiased text-zinc-300">
      
      {/* HEADER SECTION */}
      <div className="border-b border-white/5 pb-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3 font-sans">
          <Award className="text-[#D4AF37]" size={16} /> 
          LABORATÓRIO DE EXPERT
        </h2>
        <p className="text-[11px] text-zinc-400 mt-2 font-medium tracking-normal max-w-4xl leading-relaxed">
          Transforme o conhecimento técnico de profissionais (Fisioterapeutas, Nutricionistas, Advogados) em ofertas altamente lucrativas. 
          Assuma o papel de <span className="text-[#D4AF37] font-semibold">Estrategista Oculto</span> enquanto o Expert fornece a autoridade, a técnica e a permissão inerente para validar o produto no mercado.
        </p>
      </div>

      {/* PHASE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1 */}
        <button 
          onClick={() => setActivePhase(1)}
          className={`flex flex-col text-left p-5 rounded-xl transition-all duration-300 relative overflow-hidden border ${
            activePhase === 1 
              ? 'bg-[#0e0e0a] border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]' 
              : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-[#0c0c0c]'
          }`}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
          <div className="p-2 bg-[#121212] rounded-lg border border-white/5 w-fit text-[#D4AF37] mb-4">
            <MessageSquare size={16} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider">1. O Pitch Irrecusável</h3>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">Abordagem & Fechamento</p>
          <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
            Ferramentas práticas de abordagem direta e roteiros para fechamento de parcerias com experts em sociedade.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">
            Explorar Módulo <ChevronRight size={10} />
          </div>
        </button>

        {/* Card 2 */}
        <button 
          onClick={() => setActivePhase(2)}
          className={`flex flex-col text-left p-5 rounded-xl transition-all duration-300 relative overflow-hidden border ${
            activePhase === 2 
              ? 'bg-[#0e0e0a] border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]' 
              : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-[#0c0c0c]'
          }`}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
          <div className="p-2 bg-[#121212] rounded-lg border border-white/5 w-fit text-[#D4AF37] mb-4">
            <Target size={16} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider">2. O Extrator de Ouro</h3>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">Mapeamento & Produto</p>
          <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
            Metodologia para mapear as maiores dores do Expert e empacotar seu conhecimento em ofertas de alto ticket.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">
            Explorar Módulo <ChevronRight size={10} />
          </div>
        </button>

        {/* Card 3 */}
        <button 
          onClick={() => setActivePhase(3)}
          className={`flex flex-col text-left p-5 rounded-xl transition-all duration-300 relative overflow-hidden border ${
            activePhase === 3 
              ? 'bg-[#0e0e0a] border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]' 
              : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-[#0c0c0c]'
          }`}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
          <div className="p-2 bg-[#121212] rounded-lg border border-white/5 w-fit text-[#D4AF37] mb-4">
            <Shield size={16} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider">3. Protocolo de Permissão</h3>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">Orgânico para Autoridade</p>
          <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
            Estratégias de conteúdo de valor técnico para construir audiência engajada e gerar autoridade instantânea.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">
            Explorar Módulo <ChevronRight size={10} />
          </div>
        </button>

        {/* Card 4 */}
        <button 
          onClick={() => setActivePhase(4)}
          className={`flex flex-col text-left p-5 rounded-xl transition-all duration-300 relative overflow-hidden border ${
            activePhase === 4 
              ? 'bg-[#0e0e0a] border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]' 
              : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-[#0c0c0c]'
          }`}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/2 rounded-bl-full pointer-events-none"></div>
          <div className="p-2 bg-[#121212] rounded-lg border border-white/5 w-fit text-[#D4AF37] mb-4">
            <FileText size={16} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider">4. VSL de Jaleco Branco</h3>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">Script Técnico & Vendas</p>
          <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-normal">
            Estrutura e roteirizador de vídeo de vendas persuasivo unindo dados científicos e rigor com conversão.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider">
            Explorar Módulo <ChevronRight size={10} />
          </div>
        </button>

      </div>

      {/* ACTIVE MODULE CONTAINER (Premium Glassmorphism & Gold border) */}
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-6 min-h-[400px] shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/2 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* PHASE 1 WORKSPACE */}
        {activePhase === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
              <div>
                <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase">FASE 1 // SISTEMA DE PARCERIAS</span>
                <h3 className="text-sm font-bold text-white uppercase mt-1">O Pitch Irrecusável</h3>
              </div>
              
              <div className="flex bg-[#050505] p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setPitchCategory('cold')}
                  className={`px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
                    pitchCategory === 'cold' ? 'bg-[#D4AF37] text-black' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Abordagem Fria (Cold Direct)
                </button>
                <button 
                  onClick={() => setPitchCategory('meeting')}
                  className={`px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
                    pitchCategory === 'meeting' ? 'bg-[#D4AF37] text-black' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Roteiro de Reunião
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column (The Script Content) */}
              <div className="lg:col-span-2 space-y-4">
                {pitchCategory === 'cold' ? (
                  <div className="bg-[#050505] border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Template: Abordagem via Instagram Direct</span>
                      <button 
                        onClick={() => handleCopy(
                          `Olá, [Nome do Expert]. Estava analisando seu perfil e vejo que você tem um conteúdo excelente sobre [Especialidade].\n\n` +
                          `Eu sou estrategista de negócios digitais e ajudo especialistas a transformarem esse conhecimento em programas de alto ticket (mentorias premium). Seu perfil tem o exato padrão técnico que o mercado busca.\n\n` +
                          `Fiz um breve mapeamento de uma nova oferta que funcionaria muito bem para sua audiência, sem exigir que você grave dezenas de aulas ou faça lançamentos complexos.\n\n` +
                          `Se eu te enviar um áudio de 2 minutos explicando essa oportunidade de parceria, você teria interesse em ouvir?`,
                          'cold'
                        )}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider border border-white/10 px-2.5 py-1 rounded hover:bg-white hover:text-black transition-all"
                      >
                        <Copy size={10} /> {copiedText === 'cold' ? 'Copiado!' : 'Copiar Script'}
                      </button>
                    </div>
                    
                    <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-lg font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                      <p className="text-zinc-500 mb-2">// Copie e adapte os dados entre colchetes</p>
                      Olá, <span className="text-[#D4AF37]">[Nome do Expert]</span>. Estava analisando seu perfil e vejo que você tem um conteúdo excelente sobre <span className="text-[#D4AF37]">[Especialidade]</span>.<br/><br/>
                      Eu sou estrategista de negócios digitais e ajudo especialistas a transformarem esse conhecimento em programas de alto ticket (mentorias premium). Seu perfil tem o exato padrão técnico que o mercado busca.<br/><br/>
                      Fiz um breve mapeamento de uma nova oferta que funcionaria muito bem para sua audiência, sem exigir que você grave dezenas de aulas ou faça lançamentos complexos.<br/><br/>
                      Se eu te enviar um áudio de 2 minutos explicando essa oportunidade de parceria, você teria interesse em ouvir?
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] leading-relaxed text-blue-400">
                      <strong>💡 ESTRATÉGIA OCULTA:</strong> A chamada de ação final não vende nada diretamente, apenas pede permissão para enviar um áudio rápido. Isso diminui a barreira de entrada do expert e gera reciprocidade.
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#050505] border border-white/5 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">Roteiro: Estrutura da Reunião de Fechamento</span>
                      <button 
                        onClick={() => handleCopy(
                          `Estrutura da Reunião de 4 Passos:\n` +
                          `1. Diagnóstico e Alinhamento: "Me conte mais sobre como está sua agenda e qual é o perfil de paciente/cliente mais lucrativo hoje?"\n` +
                          `2. O Gargalo Comercial: "Hoje sua hora clínica/consultoria tem um limite físico. O plano é empacotar seu método para atender 10x mais pessoas com o mesmo tempo."\n` +
                          `3. Divisão de Sociedade: "Você fornece a ciência, as respostas técnicas e o suporte técnico. Eu entro como estrategista de bastidores, gerindo tráfego, funil e copy."\n` +
                          `4. Modelo Coprodução: 50% / 50% de divisão líquida dos lucros. Zero custo de entrada para o expert.`,
                          'meeting'
                        )}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider border border-white/10 px-2.5 py-1 rounded hover:bg-white hover:text-black transition-all"
                      >
                        <Copy size={10} /> {copiedText === 'meeting' ? 'Copiado!' : 'Copiar Roteiro'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-[#0c0c0c] border-l-2 border-[#D4AF37] rounded">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Passo 1: Investigação e Diagnóstico</h4>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          Faça perguntas para o expert reclamar sobre cansaço de consultas avulsas e falta de tempo. Deixe-o expor a dor.
                        </p>
                      </div>
                      
                      <div className="p-3.5 bg-[#0c0c0c] border-l-2 border-zinc-700 rounded">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Passo 2: Apresentação do Modelo Digital Híbrido</h4>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          Mostre que ele não precisa gravar um curso gigante. Ele entregará mentorias em grupo ao vivo ou sessões de suporte rápidas.
                        </p>
                      </div>
                      
                      <div className="p-3.5 bg-[#0c0c0c] border-l-2 border-zinc-700 rounded">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Passo 3: A Proposta Comercial</h4>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          "Seu trabalho é fazer a entrega técnica de excelência e responder dúvidas. O meu trabalho é trazer os clientes prontos, estruturar o funil e escalar."
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Partnership Checklist) */}
              <div className="bg-[#050505] border border-white/5 rounded-xl p-5 space-y-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">CHECKLIST DE SOCIEDADE</span>
                
                <div className="space-y-3">
                  {[
                    { key: 'contrato', label: 'Acordo de Sociedade/Coprodução assinado' },
                    { key: 'divisao', label: 'Definição da divisão (Recomendado 50/50)' },
                    { key: 'acessoRedes', label: 'Acesso às contas sociais e gerenciador' },
                    { key: 'alinhamentoExpectativa', label: 'Alinhamento de prazos e reuniões semanais' },
                    { key: 'definicaoEntregas', label: 'Definição exata dos horários de suporte do Expert' }
                  ].map(item => (
                    <label key={item.key} className="flex items-start gap-3 cursor-pointer group select-none">
                      <input 
                        type="checkbox" 
                        checked={(checklist as any)[item.key]} 
                        onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                        className="mt-0.5 accent-[#D4AF37]"
                      />
                      <span className={`text-[10px] font-bold uppercase transition-all ${
                        (checklist as any)[item.key] ? 'text-zinc-500 line-through' : 'text-zinc-300 group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4">
                  <p className="text-[9px] text-zinc-500 uppercase font-semibold leading-relaxed">
                    ⚠️ Nunca inicie campanhas de tráfego pago sem o alinhamento de custos de anúncios previamente aprovados em contrato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2 WORKSPACE */}
        {activePhase === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase">FASE 2 // ARQUITETURA DE OFERTA</span>
              <h3 className="text-sm font-bold text-white uppercase mt-1">O Extrator de Ouro</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Form Input Panel */}
              <div className="bg-[#050505] p-5 rounded-xl border border-white/5 space-y-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Profissão do Expert</span>
                
                <div className="flex flex-col gap-2">
                  {['Fisioterapeuta', 'Nutricionista', 'Advogado'].map(prof => (
                    <button
                      key={prof}
                      onClick={() => {
                        setCustomProfession('');
                        fetchExpertMapping(prof);
                      }}
                      className={`w-full py-2.5 px-4 text-left text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all ${
                        selectedProfession === prof && !customProfession
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#0a0a0a] text-zinc-400 border-white/5 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {prof}
                    </button>
                  ))}
                  
                  <div className="border-t border-white/5 pt-2 mt-2">
                    <label className="text-[9px] text-zinc-500 uppercase font-black block mb-1">Outra Especialidade</label>
                    <input 
                      type="text" 
                      placeholder="Pressione Enter para buscar..."
                      value={customProfession}
                      onChange={(e) => setCustomProfession(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customProfession.trim()) {
                          fetchExpertMapping(customProfession.trim());
                        }
                      }}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-3 text-xs text-[#D4AF37] placeholder:text-zinc-600 outline-none focus:border-[#D4AF37]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Mapped Insights Panel */}
              <div className="lg:col-span-2 bg-[#050505] p-5 rounded-xl border border-[#D4AF37]/20 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="text-[#D4AF37]" size={12} />
                    Mapeamento Comercial: {selectedProfession}
                  </span>
                  <button
                    onClick={() => handleCopy(mappingResult, 'mapped-insights')}
                    disabled={!mappingResult || isMappingLoading}
                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider border border-white/10 px-2.5 py-1 rounded hover:bg-white hover:text-black transition-all disabled:opacity-50"
                  >
                    <Copy size={10} /> {copiedText === 'mapped-insights' ? 'Copiado!' : 'Copiar Mapeamento'}
                  </button>
                </div>

                {isMappingLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-20">
                    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest animate-pulse">
                      Mapeando mercado...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {parseMappingResult(mappingResult || 'Nenhum mapeamento gerado. Escolha uma profissão ao lado.')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3 WORKSPACE */}
        {activePhase === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
              <div>
                <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase">FASE 3 // FUNIL ORGÂNICO DE AUTORIDADE</span>
                <h3 className="text-sm font-bold text-white uppercase mt-1">Protocolo de Permissão</h3>
              </div>

              <div className="flex bg-[#050505] p-1 rounded-lg border border-white/5">
                {[
                  { id: 'mito', label: 'Quebrar Mito' },
                  { id: 'caso', label: 'Estudo de Caso' },
                  { id: 'ciencia', label: 'Prova Científica' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => { setPostType(tab.id as any); setGeneratedPost(''); }}
                    className={`px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-wider transition-all ${
                      postType === tab.id ? 'bg-[#D4AF37] text-black' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column (Weekly Calendar) */}
              <div className="bg-[#050505] border border-white/5 rounded-xl p-5 space-y-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">CRONOGRAMA EDITORIAL DE BASE</span>
                
                <div className="flex gap-1 border-b border-white/5 pb-2">
                  {['Segunda', 'Quarta', 'Sexta'].map(day => (
                    <button
                      key={day}
                      onClick={() => setEditorialDay(day)}
                      className={`flex-1 py-1 text-[9px] font-black uppercase tracking-wider rounded transition-all ${
                        editorialDay === day ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {editorialDay === 'Segunda' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase">Conteúdo: A Quebra de Paradigma</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-normal">
                      Mostre um erro gravíssimo que 90% das pessoas cometem ao tratar um sintoma. Explicar como a solução comum na verdade agrava a situação biológica ou técnica.
                    </p>
                  </div>
                )}

                {editorialDay === 'Quarta' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase">Conteúdo: O Estudo de Caso / Bastidores</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-normal">
                      Narrar brevemente o diagnóstico de um paciente real do expert (preservando identidade). Mostrar a reviravolta clínica que validou o método.
                    </p>
                  </div>
                )}

                {editorialDay === 'Sexta' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase">Conteúdo: Conexão Técnica / Chamada de Mentoria</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-normal">
                      Explicar o rigor técnico por trás do método e convidar as pessoas interessadas a responderem a palavra-chave para entrarem na lista de triagem da mentoria.
                    </p>
                  </div>
                )}

                <div className="border-t border-white/5 pt-3">
                  <p className="text-[9px] text-[#D4AF37] font-bold uppercase">💡 DICA DO ESTRATEGISTA:</p>
                  <p className="text-[9px] text-zinc-500 leading-relaxed font-normal mt-1">
                    Ensine o expert a nunca postar sem ter um link de aplicação ou direct automatizado com robô de triagem ativo na bio.
                  </p>
                </div>
              </div>

              {/* Right Column (Script Generator Box) */}
              <div className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Modelador de Conteúdo para: {expertProfession}</span>
                  {generatedPost && (
                    <button 
                      onClick={() => handleCopy(generatedPost, 'generated-post')}
                      className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider border border-white/10 px-2.5 py-1 rounded hover:bg-white hover:text-black transition-all"
                    >
                      <Copy size={10} /> {copiedText === 'generated-post' ? 'Copiado!' : 'Copiar Roteiro'}
                    </button>
                  )}
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-lg min-h-[180px] flex flex-col justify-center text-center">
                  {generatedPost ? (
                    <pre className="text-zinc-300 font-sans text-[10px] leading-relaxed text-left whitespace-pre-wrap select-text">
                      {generatedPost}
                    </pre>
                  ) : (
                    <div className="space-y-3 py-6">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        Roteiro pronto de acordo com a especialidade do Expert selecionada na Fase 2.
                      </p>
                      <button
                        onClick={handleGeneratePost}
                        className="mx-auto bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest py-2 px-6 rounded-lg text-[9px] transition-all"
                      >
                        ⚡ MODELAR COPY DE AUTORIDADE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4 WORKSPACE */}
        {activePhase === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="border-b border-white/5 pb-4">
              <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase">FASE 4 // COPYS DE ALTA CONVERSÃO</span>
              <h3 className="text-sm font-bold text-white uppercase mt-1">VSL de Jaleco Branco</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Inputs Panel */}
              <div className="bg-[#050505] p-5 rounded-xl border border-white/5 space-y-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block font-sans">Configuração da VSL</span>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-black block mb-1">Nome do Expert</label>
                    <input 
                      type="text"
                      value={expertName}
                      onChange={(e) => setExpertName(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-3 text-xs text-[#D4AF37] outline-none focus:border-[#D4AF37]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-black block mb-1">Resultado de Promessa Única</label>
                    <textarea 
                      value={vslTargetOutcome}
                      onChange={(e) => setVslTargetOutcome(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/50 resize-none transition-all"
                    />
                  </div>

                  <button
                    onClick={handleGenerateVsl}
                    className="w-full bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest py-2.5 px-4 rounded-lg text-[9px] transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={10} /> ROTEIRIZAR ESTRUTURA
                  </button>
                </div>
              </div>

              {/* Roteiro Result Panel */}
              <div className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Estrutura Científica Gerada</span>
                  {generatedVsl && (
                    <button 
                      onClick={() => handleCopy(
                        `--- 1. O GANCHO CIENTÍFICO ---\n${generatedVsl.hook}\n\n` +
                        `--- 2. A CAUSA RAIZ OCULTA ---\n${generatedVsl.rootCause}\n\n` +
                        `--- 3. O MÉTODO DO EXPERT ---\n${generatedVsl.method}\n\n` +
                        `--- 4. A OFERTA IMPULSIONADA ---\n${generatedVsl.offer}`,
                        'generated-vsl'
                      )}
                      className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider border border-white/10 px-2.5 py-1 rounded hover:bg-white hover:text-black transition-all"
                    >
                      <Copy size={10} /> {copiedText === 'generated-vsl' ? 'Copiado!' : 'Copiar VSL Completa'}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {generatedVsl ? (
                    <div className="space-y-3 font-mono text-[10px] leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                      <div className="p-3 bg-[#0a0a0a] rounded border border-white/5">
                        <span className="text-[#D4AF37] font-bold uppercase block mb-1">Seção 1: Gancho de Atenção</span>
                        <p className="text-zinc-300">{generatedVsl.hook}</p>
                      </div>
                      
                      <div className="p-3 bg-[#0a0a0a] rounded border border-white/5">
                        <span className="text-[#D4AF37] font-bold uppercase block mb-1">Seção 2: Causa Raiz Oculta</span>
                        <p className="text-zinc-300">{generatedVsl.rootCause}</p>
                      </div>

                      <div className="p-3 bg-[#0a0a0a] rounded border border-white/5">
                        <span className="text-[#D4AF37] font-bold uppercase block mb-1">Seção 3: Apresentação do Especialista e Método</span>
                        <p className="text-zinc-300">{generatedVsl.method}</p>
                      </div>

                      <div className="p-3 bg-[#0a0a0a] rounded border border-[#D4AF37]/20">
                        <span className="text-[#D4AF37] font-bold uppercase block mb-1">Seção 4: A Chamada de Ação (Oferta)</span>
                        <p className="text-zinc-300">{generatedVsl.offer}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        Configure os campos do expert na coluna à esquerda e clique em Roteirizar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
