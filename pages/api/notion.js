export default async function handler(req, res) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  if (!NOTION_API_KEY || !DATABASE_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();

    // 🔽 Парсим результат и вытаскиваем нужные поля (например, title)
    const parsed = data.results.map((page) => {
      return {
        id: page.id,
        title: page.properties?.Name?.title?.[0]?.plain_text || 'Без названия',
      };
    });

    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}