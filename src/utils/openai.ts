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

Regras e instruções importantes:
- Extraia todas as linhas de apostas, mesmo que sejam 2, 3 ou mais.
- Odds podem aparecer como 1.875, 1.820, 2.950, etc.
- Stakes podem aparecer coladas (ex: 175848 → 1758.48, 84542 → 845.42, 59610 → 596.10). Sempre que encontrar um número de stake com 5 ou mais dígitos e sem ponto, insira o ponto duas casas antes do final.
- Se houver múltiplas possibilidades para stake colada, escolha a que, somada às outras stakes, mais se aproxima do valor total extraído (“Aposta total”).
- Lucro pode aparecer ao final da linha.
- Ignore caracteres estranhos, símbolos ou letras entre odds, stake e lucro.
- Os times geralmente aparecem juntos, separados por “—” ou “-”.
- A competição geralmente aparece após “/”.
- Odds e stakes nunca devem ser absurdamente altos (odds > 100, stake > 10.000).
- Se não conseguir extrair algum valor, retorne 0 e explique no campo "erro".
- Ignore linhas irrelevantes.
- Retorne apenas o JSON, sem explicações.

Exemplo de texto extraído:
Barracas Central — Independiente Rivadavia 3.04%
ROI: 558.55%
Futebol / Argentina Liga Profesional
Chance Aposta DÉO cOê Lucro
Bet365 (Fast) H2(0) - cartões 1.875 175848 BRL 97.15
Betano (BR) H1(+0.5) - cartões 1.820 84542 BRL 97.14
Betano (BR) 1-cartões 2.950 59610 BRL 97.16
Aposta total: 3200 BRL

Exemplo de saída:
{
  "match": {
    "team1": "Barracas Central",
    "team2": "Independiente Rivadavia",
    "sport": "Futebol",
    "competition": "Argentina Liga Profesional"
  },
  "bookmakers": [
    {
      "name": "Bet365 (Fast)",
      "odds": 1.875,
      "betType": "H2(0) - cartões",
      "stake": 1758.48,
      "profit": 97.15
    },
    {
      "name": "Betano (BR)",
      "odds": 1.82,
      "betType": "H1(+0.5) - cartões",
      "stake": 845.42,
      "profit": 97.14
    },
    {
      "name": "Betano (BR)",
      "odds": 2.95,
      "betType": "1-cartões",
      "stake": 596.10,
      "profit": 97.16
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
    const result = JSON.parse(content);
    // Pós-processamento para odds: garantir que odds como '2.891' não virem 1.2891
    if (result.bookmakers && Array.isArray(result.bookmakers)) {
      result.bookmakers = result.bookmakers.map((bm: any) => {
        if (typeof bm.odds === "string") {
          let oddsStr = bm.odds.trim().replace(/,/g, ".").replace(/^0+/, "");
          if (/^1\.\d{3,}$/.test(oddsStr)) {
            const match = oddsStr.match(/^1\.(\d{3,})$/);
            if (match) {
              oddsStr = match[1][0] + "." + match[1].slice(1);
            }
          }
          bm.odds = parseFloat(oddsStr);
        }
        return bm;
      });
    }
    // Pós-processamento para stakes colados: corrigir para casar com o total extraído
    if (result.bookmakers && Array.isArray(result.bookmakers)) {
      // Extrair total
      let totalStake = 0;
      if (result.metrics && result.metrics.totalStake) {
        totalStake = result.metrics.totalStake;
      } else if (result.bookmakers.length > 0) {
        totalStake = result.bookmakers.reduce(
          (a: number, b: any) =>
            a + (typeof b.stake === "number" ? b.stake : 0),
          0
        );
      }
      // Função auxiliar para splits possíveis
      function getPossibleStakes(stakeRaw: number | string): number[] {
        const raw = String(stakeRaw).replace(/[^0-9]/g, "");
        const results: number[] = [];
        // Só aplicar split se for inteiro grande e não já float
        if (raw.length >= 5 && !String(stakeRaw).includes(".")) {
          for (let i = 2; i <= Math.min(6, raw.length - 1); i++) {
            const stake = parseFloat(raw.slice(0, -i) + "." + raw.slice(-i));
            if (!isNaN(stake) && stake > 0 && stake < 10000)
              results.push(stake);
          }
        }
        // Se não for inteiro grande, retorna valor original
        if (results.length === 0) {
          const val = parseFloat(String(stakeRaw).replace(/,/g, "."));
          results.push(val);
        }
        return results;
      }
      // Gerar todas as combinações possíveis
      function getAllStakeCombinations(bookmakers: any[]): number[][] {
        if (bookmakers.length === 0) return [[]];
        const [first, ...rest] = bookmakers;
        let options: number[] = [];
        // Só aplicar splits se for inteiro grande e não já float
        if (
          (typeof first.stake === "number" &&
            first.stake >= 10000 &&
            Number.isInteger(first.stake) &&
            !String(first.stake).includes(".")) ||
          (typeof first.stake === "string" &&
            !String(first.stake).includes(".") &&
            parseInt(first.stake) >= 10000)
        ) {
          options = getPossibleStakes(first.stake);
        } else {
          options = [
            typeof first.stake === "number"
              ? first.stake
              : parseFloat(String(first.stake).replace(/,/g, ".")),
          ];
        }
        const restComb: number[][] = getAllStakeCombinations(rest);
        const result: number[][] = [];
        for (const opt of options) {
          for (const comb of restComb) {
            result.push([opt, ...comb]);
          }
        }
        return result;
      }
      let bestCombo: number[] | null = null;
      let minDiff = Infinity;
      const allComb: number[][] = getAllStakeCombinations(result.bookmakers);
      for (const combo of allComb) {
        const sum = combo.reduce((a: number, b: number) => a + b, 0);
        const diff = Math.abs(sum - totalStake);
        if (diff < minDiff) {
          minDiff = diff;
          bestCombo = combo;
        }
      }
      if (bestCombo) {
        result.bookmakers = result.bookmakers.map((bm: any, i: number) => {
          let stake = bestCombo![i];
          // NÃO APLICAR AJUSTE DE ESCALA - VALOR EXTRAÍDO É O CORRETO
          return { ...bm, stake };
        });
        // Log para depuração
        console.log(
          "Bookmakers após parser OpenAI (sem ajuste de escala):",
          result.bookmakers
        );
      }
    }
    return result;
  } catch (e) {
    throw new Error("Falha ao interpretar resposta da OpenAI: " + content);
  }
}
