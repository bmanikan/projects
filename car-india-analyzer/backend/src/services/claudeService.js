import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzeCarWithAI(carData, query = null) {
  const systemPrompt = `You are an expert automotive analyst specializing in the Indian car market.
You have deep knowledge of:
- Indian car market dynamics, buyer preferences, and road conditions
- Technical automotive engineering (engines, suspension, safety systems)
- Maruti Suzuki brand history and strategy
- Competitive landscape in India
- Sales trends and market positioning

Always provide structured, insightful analysis. Be specific with numbers and comparisons.
Format your responses in clean markdown with clear sections.`;

  const userMessage = query
    ? `Based on this car data, answer the following question: "${query}"\n\nCar Data:\n${JSON.stringify(carData, null, 2)}`
    : `Analyze this car comprehensively for an Indian consumer/enthusiast. Provide:

1. **Market Position & Why It Sells** - Why is the Swift India's bestseller?
2. **Engineering Highlights** - Key technical strengths of this model
3. **Suspension Analysis** - How the suspension setup suits Indian roads
4. **Value Proposition** - Price vs features vs competition analysis
5. **Who Should Buy It** - Ideal buyer profile
6. **Concerns & Caveats** - Any known issues or limitations
7. **Future Outlook** - Expected EV transition, upcoming updates

Car Data:
${JSON.stringify(carData, null, 2)}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: userMessage }],
    system: systemPrompt,
  });

  return {
    analysis: response.content[0].text,
    model: 'claude-sonnet-4-6',
    generatedAt: new Date().toISOString(),
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  };
}

export async function compareVariants(carData) {
  const systemPrompt = `You are a concise Indian car market expert. Give crisp, actionable variant recommendations.`;

  const variantSummary = carData.variants.map(v => ({
    name: v.name,
    price: v.price,
    highlights: v.highlights,
  }));

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `For the ${carData.brand} ${carData.model}, analyze these variants and give a "Best Value Pick" and "Best For Budget" recommendation with 2-3 line reasoning each. Also flag which variant offers the biggest feature jump for the price.

Variants:
${JSON.stringify(variantSummary, null, 2)}`,
      },
    ],
    system: systemPrompt,
  });

  return {
    recommendation: response.content[0].text,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateSalesInsight(salesData, carName) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Analyze these sales figures for the ${carName} and provide:
1. A one-sentence trend summary
2. Best month and why (festive season, launch, etc.)
3. YoY growth/decline assessment
4. What the numbers say about its market position

Sales Data:
${JSON.stringify(salesData, null, 2)}`,
      },
    ],
  });

  return {
    insight: response.content[0].text,
    generatedAt: new Date().toISOString(),
  };
}
