export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server' });
    return;
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid request body. Expected { messages: [...] }' });
      return;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('OpenAI API error (server):', response.status, response.statusText, errorText);
      res.status(response.status).json({
        error: 'OpenAI API error',
        status: response.status,
        statusText: response.statusText,
      });
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    res.status(200).json({ content });
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


