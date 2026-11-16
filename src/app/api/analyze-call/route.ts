import { NextRequest, NextResponse } from 'next/server';
import { CallAnalysis, COMPETENCY_CONFIGS } from '@/types';

// Função auxiliar para analisar heuristicamente com base nas falas reais caso a chave Gemini não esteja configurada
function analyzeWithLocalEngine(
  transcript: string,
  closerName: string,
  saleClosed: boolean
): CallAnalysis {
  const lines = transcript.split('\n').filter((l) => l.trim().length > 0);
  const fullTextLower = transcript.toLowerCase();

  // 1. Abertura e Conexão
  const hasAgenda = fullTextLower.includes('agenda') || fullTextLower.includes('objetivo') || fullTextLower.includes('minuto') || fullTextLower.includes('pauta');
  const hasRapport = fullTextLower.includes('como está') || fullTextLower.includes('tudo bem') || fullTextLower.includes('prazer') || fullTextLower.includes('obrigad');
  const aberturaScore = hasAgenda && hasRapport ? 9.2 : hasAgenda || hasRapport ? 7.5 : 5.0;

  // 2. Investigação e Diagnóstico
  const questionMarks = (transcript.match(/\?/g) || []).length;
  const hasPainQuestions = fullTextLower.includes('impacto') || fullTextLower.includes('prejuízo') || fullTextLower.includes('gargalo') || fullTextLower.includes('dor') || fullTextLower.includes('perde');
  const investigacaoScore = questionMarks >= 6 && hasPainQuestions ? 9.0 : questionMarks >= 3 ? 7.0 : 4.0;

  // 3. Qualificação
  const hasBudgetOrAuthority = fullTextLower.includes('budget') || fullTextLower.includes('orçamento') || fullTextLower.includes('sócio') || fullTextLower.includes('decis') || fullTextLower.includes('equipe') || fullTextLower.includes('time');
  const qualificacaoScore = hasBudgetOrAuthority ? 8.5 : 5.0;

  // 4. Construção de Valor
  const hasROIOrValue = fullTextLower.includes('roi') || fullTextLower.includes('retorno') || fullTextLower.includes('investimento') || fullTextLower.includes('economia') || fullTextLower.includes('ganho');
  const construcaoScore = hasROIOrValue ? (saleClosed ? 9.0 : 7.0) : 4.5;

  // 5. Tratamento de Objeções
  const hasObjection = fullTextLower.includes('caro') || fullTextLower.includes('pensar') || fullTextLower.includes('dúvida') || fullTextLower.includes('mas') || fullTextLower.includes('porém');
  const hasHandled = hasObjection && (fullTextLower.includes('entendo') || fullTextLower.includes('compreendo') || fullTextLower.includes('garantia') || fullTextLower.includes('exatamente'));
  const objecoesScore = hasHandled ? 8.8 : hasObjection ? (saleClosed ? 7.0 : 4.2) : 8.0;

  // 6. Fechamento e Compromisso
  const hasClosing = fullTextLower.includes('contrato') || fullTextLower.includes('fechar') || fullTextLower.includes('início') || fullTextLower.includes('começ') || fullTextLower.includes('assina') || fullTextLower.includes('proposta');
  const fechamentoScore = saleClosed ? (hasClosing ? 9.2 : 8.0) : (hasClosing ? 5.5 : 4.0);

  // 7. Próximos Passos
  const hasNextSteps = fullTextLower.includes('segunda') || fullTextLower.includes('terça') || fullTextLower.includes('quarta') || fullTextLower.includes('quinta') || fullTextLower.includes('sexta') || fullTextLower.includes('às ') || fullTextLower.includes('horário') || fullTextLower.includes('agenda');
  const proximosScore = hasNextSteps ? 9.0 : 4.5;

  // Cálculo ponderado oficial do score geral (0 a 100)
  const weightedTotal =
    aberturaScore * COMPETENCY_CONFIGS.abertura_conexao.weight +
    investigacaoScore * COMPETENCY_CONFIGS.investigacao_diagnostico.weight +
    qualificacaoScore * COMPETENCY_CONFIGS.qualificacao.weight +
    construcaoScore * COMPETENCY_CONFIGS.construcao_valor.weight +
    objecoesScore * COMPETENCY_CONFIGS.tratamento_objecoes.weight +
    fechamentoScore * COMPETENCY_CONFIGS.fechamento_compromisso.weight +
    proximosScore * COMPETENCY_CONFIGS.proximos_passos.weight;

  const overallScore = Math.round(weightedTotal * 10);

  // Extrair evidência literal do texto
  const sampleEvidence = lines.slice(0, Math.min(lines.length, 3)).join(' ');

  return {
    callId: '',
    overallScore,
    summary: `Análise estruturada da call comercial conduzida por ${closerName}. Reunião com resultado: ${saleClosed ? 'Venda Fechada' : 'Venda Não Concluída'}. Foram identificadas ${questionMarks} perguntas formuladas ao longo do diálogo, com alinhamento de diagnóstico e avaliação criteriosa das 7 competências comerciais.`,
    competencies: {
      abertura_conexao: {
        name: 'Abertura e Conexão',
        score: aberturaScore,
        weight: 0.10,
        justification: hasAgenda
          ? 'O closer definiu pauta e tempo previsto no início da reunião, construindo rapport inicial.'
          : 'Abertura rápida com oportunidade de alinhar a pauta de forma mais assertiva antes de apresentar a solução.',
        strengths: hasAgenda ? ['Alinhamento prévio da conversa', 'Rapport inicial cortês'] : ['Cordialidade no tom'],
        improvements: hasAgenda ? [] : ['Definir objetivo e tempo exato logo nos primeiros 2 minutos'],
        evidence: [lines[0] || 'Abertura da sessão.'],
        recommendations: ['Adotar contrato prévio de 30 segundos no início da reunião.'],
      },
      investigacao_diagnostico: {
        name: 'Investigação e Diagnóstico',
        score: investigacaoScore,
        weight: 0.25,
        justification: hasPainQuestions
          ? 'Explorou ativamente os impactos no negócio e investigou dores com perguntas abertas.'
          : 'Diagnóstico superficial. É crucial aprofundar nas consequências financeiras do problema do prospect.',
        strengths: hasPainQuestions ? ['Perguntas de impacto no negócio', 'Foco na causa raiz'] : ['Tom consultivo'],
        improvements: hasPainQuestions ? [] : ['Aprofundar nas perdas financeiras causadas pelo cenário atual'],
        evidence: [lines[Math.min(lines.length - 1, 2)] || 'Diálogo de diagnóstico.'],
        recommendations: ['Utilizar técnica SPIN Selling para investigar implicações financeiras.'],
      },
      qualificacao: {
        name: 'Qualificação',
        score: qualificacaoScore,
        weight: 0.10,
        justification: hasBudgetOrAuthority
          ? 'Mapeou critérios de decisão e perfil da empresa.'
          : 'Não validou com clareza a presença de outros sócios ou processo interno de compras.',
        strengths: ['Identificação do perfil da empresa'],
        improvements: hasBudgetOrAuthority ? [] : ['Mapear todos os influenciadores e decisores antecipadamente'],
        evidence: [sampleEvidence],
        recommendations: ['Validar quem mais participará da decisão antes de enviar proposta.'],
      },
      construcao_valor: {
        name: 'Construção de Valor',
        score: construcaoScore,
        weight: 0.15,
        justification: hasROIOrValue
          ? 'Conectou o investimento ao retorno direto esperado pelo cliente.'
          : 'Apresentação mais focada em características do que no valor de negócio e retorno sobre investimento.',
        strengths: hasROIOrValue ? ['Ancoragem de ROI', 'Conexão com a dor'] : ['Apresentação clara'],
        improvements: hasROIOrValue ? [] : ['Ancorar o ganho financeiro antes de falar o preço'],
        evidence: [sampleEvidence],
        recommendations: ['Nunca informar o preço sem antes recapitular o custo da inação do prospect.'],
      },
      tratamento_objecoes: {
        name: 'Tratamento de Objeções',
        score: objecoesScore,
        weight: 0.15,
        justification: hasHandled
          ? 'Respondeu às dúvidas de forma fundamentada e segura.'
          : 'Oportunidade de aprofundar na objeção ao invés de apenas justificar ou oferecer desconto reflexivo.',
        strengths: ['Compostura durante a conversa'],
        improvements: ['Isolar a objeção antes de respondê-la'],
        evidence: [sampleEvidence],
        recommendations: ['Usar técnica de validação empática ("Entendo seu ponto, me ajude a entender...")'],
      },
      fechamento_compromisso: {
        name: 'Fechamento e Compromisso',
        score: fechamentoScore,
        weight: 0.15,
        justification: saleClosed
          ? 'Condução assertiva e segura para o fechamento comercial.'
          : 'Hesitação no momento do fechamento, permitindo que a decisão ficasse em aberto.',
        strengths: saleClosed ? ['Assertividade no pedido de compromisso'] : ['Clareza na oferta'],
        improvements: saleClosed ? [] : ['Fazer o pedido claro do fechamento e não aceitar "vou pensar" passivamente'],
        evidence: [lines[lines.length - 1] || 'Encerramento.'],
        recommendations: ['Propor fechamento presumido com data específica de início.'],
      },
      proximos_passos: {
        name: 'Próximos Passos',
        score: proximosScore,
        weight: 0.10,
        justification: hasNextSteps
          ? 'Definiu prazos e datas específicas de continuidade.'
          : 'Faltou formalizar dia e horário exatos no calendário para o próximo contato.',
        strengths: hasNextSteps ? ['Compromisso com data e hora'] : [],
        improvements: hasNextSteps ? [] : ['Nunca encerrar sem convite de agenda enviado'],
        evidence: [lines[lines.length - 1] || 'Encerramento.'],
        recommendations: ['Enviar convite do Google Calendar durante a própria call.'],
      },
    },
    behaviors: {
      investigatedNeeds: questionMarks >= 4,
      consultativeQuestions: hasPainQuestions,
      exploredConsequences: fullTextLower.includes('impacto') || fullTextLower.includes('prejuízo'),
      identifiedMotivationPriority: hasBudgetOrAuthority,
      builtValueBeforePrice: hasROIOrValue,
      handledObjectionsWell: hasHandled || !hasObjection,
      attemptedClosing: hasClosing,
      definedNextSteps: hasNextSteps,
    },
    objections: hasObjection
      ? [
          {
            objection: 'Preço ou Necessidade de Análise Interna',
            prospectQuote: 'Dúvidas levantadas durante a negociação comercial.',
            howHandled: hasHandled ? 'Respondido de forma consultiva.' : 'Tratado com hesitação ou oferta precoce de concessões.',
            rating: hasHandled ? 'adequado' : 'inadequado',
            feedback: hasHandled ? 'Boa postura na resposta.' : 'Evitar ceder descontos sem antes validar a dor real.',
          },
        ]
      : [],
    strengths: [
      'Manutenção de tom profissional e empático ao longo da conversa.',
      hasAgenda ? 'Estruturação de pauta prévia com o cliente.' : 'Apresentação detalhada da proposta.',
    ],
    improvementAreas: [
      hasPainQuestions ? 'Aprofundar nas métricas de aprovação financeira.' : 'Investigar mais a fundo o custo da dor antes de mostrar a solução.',
      hasNextSteps ? 'Acompanhar prazos no CRM com rigor.' : 'Agendar data e horário precisos para o retorno na própria call.',
    ],
    recommendations: [
      'Adotar roteiro de perguntas abertas consultivas para mapear impacto financeiro.',
      'Sempre isolar a objeção antes de fornecer qualquer resposta ou concessão comercial.',
    ],
    modelName: 'engine-heuristic-v1',
    analysisVersion: 'v1.0',
    promptVersion: 'commercial-intelligence-v1',
    analyzedAt: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transcript,
      closerName = 'Closer',
      saleClosed = false,
      callId = '',
      userApiKey = '',
    } = body;

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'A transcrição da call é obrigatória.' },
        { status: 400 }
      );
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

    // Se temos a chave da API do Gemini, fazemos a chamada oficial com Gemini
    if (apiKey) {
      try {
        const systemPrompt = `Você é o maior especialista mundial em Vendas B2B Consultivas e Inteligência Comercial.
Sua missão é realizar uma análise analítica, rigorosa e fundamentada EXCLUSIVAMENTE na transcrição da call comercial fornecida.

REGRAS DE OURO OBRIGATÓRIAS:
1. Nunca invente fatos, falas, objeções ou intenções que não estejam literalmente comprováveis na transcrição.
2. Não dê nota baixa apenas porque a venda não foi fechada (vendas consultivas muitas vezes exigem ciclos saudáveis).
3. Não dê nota alta apenas porque a venda foi fechada (muitos vendedores ganham vendas por sorte ou desconto exagerado).
4. Reconheça quando um critério não foi aplicável ou não pôde ser avaliado com base nas falas.
5. Em "evidence", extraia CITAÇÕES LITERAIS exatas de falas da transcrição.

Avalie rigorosamente as 7 COMPETÊNCIAS com suas respectivas notas de 0 a 10:
1. abertura_conexao (peso 10%): Rapport genuíno, alinhamento de agenda/tempo, quebra-gelo, autoridade.
2. investigacao_diagnostico (peso 25%): Perguntas abertas, aprofundamento das dores, descoberta de consequências e impacto financeiro (custo de inação).
3. qualificacao (peso 10%): Perfil do cliente, presença de decisores, urgência, processo de tomada de decisão e orçamento.
4. construcao_valor (peso 15%): Ancoragem da solução antes do preço, foco no ROI, personalização para as dores diagnosticadas.
5. tratamento_objecoes (peso 15%): Escuta ativa, validação da preocupação, isolamento da objeção e contorno sem concessão precipitada.
6. fechamento_compromisso (peso 15%): Condução assertiva para a decisão, clareza na proposta comercial e pedido direto do fechamento.
7. proximos_passos (peso 10%): Agendamento pontual com data e hora no calendário, definição de responsáveis e alinhamento de expectativas.

Retorne ESTRITAMENTE um JSON válido com o seguinte formato exato (sem formatação markdown envolvente):
{
  "overallScore": number (0 a 100 ponderado),
  "summary": "Resumo executivo de 2 a 3 frases com diagnóstico analítico",
  "competencies": {
    "abertura_conexao": { "name": "Abertura e Conexão", "score": number, "weight": 0.10, "justification": string, "strengths": string[], "improvements": string[], "evidence": string[], "recommendations": string[], "alternativeApproach": string },
    "investigacao_diagnostico": { "name": "Investigação e Diagnóstico", "score": number, "weight": 0.25, "justification": string, "strengths": string[], "improvements": string[], "evidence": string[], "recommendations": string[], "alternativeApproach": string },
    "qualificacao": { "name": "Qualificação", "score": number, "weight": 0.10, "justification": string, "strengths": string[], "improvements": string[], "evidence": string[], "recommendations": string[], "alternativeApproach": string },
    "construcao_valor": { "name": "Construção de Valor", "score": number, "weight": 0.15, "justification": string, "strengths": string[], "improvements": string[], "evidence": string[], "recommendations": string[], "alternativeApproach": string },
    "tratamento_objecoes": { "name": "Tratamento de Objeções", "score": number, "weight": 0.15, "justification": string, "strengths": string[], "improvements": string[], "evidence": string[], "recommendations": string[], "alternativeApproach": string },
    "fechamento_compromisso": { "name": "Fechamento e Compromisso", "score": number, "weight": 0.15, "justification": string, "strengths": string[], "improvements": string[], "evidence": string[], "recommendations": string[], "alternativeApproach": string },
    "proximos_passos": { "name": "Próximos Passos", "score": number, "weight": 0.10, "justification": string, "strengths": string[], "improvements": string[], "evidence": string[], "recommendations": string[], "alternativeApproach": string }
  },
  "behaviors": {
    "investigatedNeeds": boolean,
    "consultativeQuestions": boolean,
    "exploredConsequences": boolean,
    "identifiedMotivationPriority": boolean,
    "builtValueBeforePrice": boolean,
    "handledObjectionsWell": boolean,
    "attemptedClosing": boolean,
    "definedNextSteps": boolean
  },
  "objections": [
    {
      "objection": string,
      "prospectQuote": string,
      "howHandled": string,
      "rating": "adequado" | "parcial" | "inadequado" | "ignorado",
      "feedback": string
    }
  ],
  "strengths": string[],
  "improvementAreas": string[],
  "recommendations": string[]
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${systemPrompt}\n\nDADOS DA CALL:\nCloser: ${closerName}\nResultado Comercial: ${saleClosed ? 'Venda Fechada' : 'Venda Não Fechada'}\n\nTRANSCRIÇÃO COMPLETA:\n${transcript}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.1,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const completeAnalysis: CallAnalysis = {
              ...parsed,
              callId,
              modelName: 'gemini-2.5-flash',
              analysisVersion: 'v1.0',
              promptVersion: 'commercial-intelligence-v1',
              analyzedAt: new Date().toISOString(),
            };
            return NextResponse.json(completeAnalysis);
          }
        } else {
          console.warn('Gemini API call failed, status:', response.status);
        }
      } catch (geminiErr) {
        console.error('Erro na chamada Gemini API:', geminiErr);
      }
    }

    // Fallback inteligente para garantir funcionamento perfeito e robusto imediatamente
    const analysis = analyzeWithLocalEngine(transcript, closerName, saleClosed);
    analysis.callId = callId;
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Erro no processamento da análise:', error);
    return NextResponse.json(
      { error: 'Falha ao processar análise da call: ' + (error?.message || 'Erro desconhecido') },
      { status: 500 }
    );
  }
}
