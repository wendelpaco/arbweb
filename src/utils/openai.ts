export async function extractArbitrageWithOpenAI(
  ocrText: string,
  apiKey: string
): Promise<any> {
  const prompt = `Você é um assistente de apostas esportivas. Receberá o texto extraído de uma imagem de calculadora de arbitragem (OCR). Extraia os dados de arbitragem e retorne um JSON com o seguinte formato:

{
  "match": {
    "team1": "",
    "team2": "",
    "sport": "",
    "competition": ""
  },
  "bookmakers": [
    {
      "name": "",
      "odds": 0,
      "betType": "",
      "stake": 0,
      "profit": 0
    }
  ]
}

- Os times geralmente aparecem juntos, separados por “—” ou “-” (ex: FC Libertad — Manta FC).
- A competição geralmente aparece após “Futebol /”.
- Odds, stake e lucro podem estar juntos na mesma linha, e números podem vir com espaços ou símbolos estranhos (ex: “6 586047 — BRL” significa “5860.47 BRL”).
- Corrija números quebrados e converta para decimal.
- Se algum campo não estiver presente, deixe vazio ou zero.
- Não invente dados.
- Ignore linhas irrelevantes.
- Retorne apenas o JSON, sem explicações.

Exemplo de texto extraído:
"""
FC Libertad — Manta FC 7.44%
Futebol / Ecuador - Serie À
SeuBet (BR) H1(—1.5) - escanteios 2.100 6139.53 BRL 893.01
Blaze H2(+1.5) - escanteios 2.200 5860.47 BRL 893.03
Aposta total: 12000
"""

Exemplo de saída:
{
  "match": {
    "team1": "FC Libertad",
    "team2": "Manta FC",
    "sport": "Futebol",
    "competition": "Ecuador - Serie A"
  },
  "bookmakers": [
    {
      "name": "SeuBet (BR)",
      "odds": 2.1,
      "betType": "H1(-1.5) - escanteios",
      "stake": 6139.53,
      "profit": 893.01
    },
    {
      "name": "Blaze",
      "odds": 2.2,
      "betType": "H2(+1.5) - escanteios",
      "stake": 5860.47,
      "profit": 893.03
    }
  ]
}

Texto real extraído da imagem:
"""
${ocrText}
"""
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente de apostas esportivas.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao consultar a OpenAI: " + response.statusText);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error("Falha ao interpretar resposta da OpenAI: " + content);
  }
}
