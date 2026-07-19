export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL alvo é obrigatória.' });
  }

  // Format URL if protocol is missing
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout

    const apifyReq = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const html = await apifyReq.text();

    // 1. Checkout Extraction
    const checkoutsFound = [];
    const checkoutKeywords = [
      { name: 'Kiwify', pattern: /kiwify/i },
      { name: 'Hotmart', pattern: /hotmart/i },
      { name: 'Eduzz', pattern: /eduzz/i },
      { name: 'Cartpanda', pattern: /cartpanda/i },
      { name: 'PerfectPay', pattern: /perfectpay/i },
      { name: 'Ticto', pattern: /ticto/i },
      { name: 'Monetizze', pattern: /monetizze/i },
      { name: 'Braip', pattern: /braip/i }
    ];
    for (const item of checkoutKeywords) {
      if (item.pattern.test(html)) {
        checkoutsFound.push(item.name);
      }
    }
    const checkoutText = checkoutsFound.length > 0 ? `${checkoutsFound.join(', ')}` : 'Não Detectado';

    // 2. Pixel Extraction
    let pixelId = 'Não encontrado';
    const pixelRegex1 = /fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]\s*\)/i;
    const pixelRegex2 = /tr\?id=(\d+)/i;
    const match1 = pixelRegex1.exec(html);
    const match2 = pixelRegex2.exec(html);
    if (match1) {
      pixelId = match1[1];
    } else if (match2) {
      pixelId = match2[1];
    }

    // 3. Hosting Extraction
    const server = (apifyReq.headers.get('server') || '').toLowerCase();
    const xPoweredBy = (apifyReq.headers.get('x-powered-by') || '').toLowerCase();
    const xVercelId = apifyReq.headers.get('x-vercel-id');
    const cfRay = apifyReq.headers.get('cf-ray');

    let hosting = 'Desconhecido';
    if (cfRay || server.includes('cloudflare')) {
      hosting = 'Cloudflare';
    } else if (xVercelId || server.includes('vercel')) {
      hosting = 'Vercel';
    } else if (server.includes('nginx')) {
      hosting = 'Nginx Server (Self-Hosted)';
    } else if (server.includes('apache')) {
      hosting = 'Apache Server (Self-Hosted)';
    } else if (server.includes('litespeed')) {
      hosting = 'LiteSpeed Web Server';
    } else if (server.includes('gws') || server.includes('google')) {
      hosting = 'Google Cloud / Firebase';
    } else if (xPoweredBy.includes('next.js') || xPoweredBy.includes('nextjs')) {
      hosting = 'Next.js (Vercel/Node)';
    } else if (server.includes('aws') || server.includes('amazon')) {
      hosting = 'Amazon Web Services (AWS)';
    } else if (server) {
      hosting = server.charAt(0).toUpperCase() + server.slice(1);
    }

    // 4. Operation status
    let statusText = '🟢 FUNIL ESTÁVEL';
    let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    if (pixelId !== 'Não encontrado') {
      statusText = '🔥 FUNIL ATIVO';
      badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
    }

    return res.status(200).json({
      checkoutText,
      pixelId,
      hosting,
      statusText,
      badgeStyle
    });

  } catch (error) {
    console.error('Erro na extração:', error);
    return res.status(200).json({
      checkoutText: 'Erro ao conectar (Bloqueio de CORS/Rede)',
      pixelId: 'Inacessível',
      hosting: 'Desconhecido / Protegido',
      statusText: '⚠️ CONEXÃO BLOQUEADA',
      badgeStyle: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
    });
  }
}
