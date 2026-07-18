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

  const token = process.env.VITE_APIFY_API_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'TOKEN_FALTANDO: A variável VITE_APIFY_API_TOKEN não foi encontrada no ambiente da Vercel.' });
    return;
  }

  try {
    if (req.method === 'POST') {
      let bodyData;
      if (typeof req.body === 'string') {
        bodyData = req.body;
      } else {
        bodyData = JSON.stringify(req.body);
      }

      const response = await fetch(
        `https://api.apify.com/v2/acts/apify~facebook-ads-scraper/run-sync-get-dataset-items?token=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: bodyData
        }
      );

      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      res.status(response.status).send(data);
    } else if (req.method === 'GET') {
      const response = await fetch(
        `https://api.apify.com/v2/actors/apify~facebook-ads-scraper/runs/last/dataset/items?token=${token}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const contentType = response.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      res.status(response.status).send(data);
    } else {
      res.status(405).json({ error: 'Método não permitido.' });
    }
  } catch (error) {
    console.error('Erro na Vercel Serverless Function:', error);
    res.status(500).json({ error: error.message || 'Erro interno no processamento da requisição.' });
  }
}
