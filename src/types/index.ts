export type CompetencyKey =
  | 'abertura_conexao'
  | 'investigacao_diagnostico'
  | 'qualificacao'
  | 'construcao_valor'
  | 'tratamento_objecoes'
  | 'fechamento_compromisso'
  | 'proximos_passos';

export interface CompetencyConfig {
  key: CompetencyKey;
  label: string;
  weight: number; // 0.10, 0.25, etc.
  description: string;
}

export const COMPETENCY_CONFIGS: Record<CompetencyKey, CompetencyConfig> = {
  abertura_conexao: {
    key: 'abertura_conexao',
    label: 'Abertura e Conexão',
    weight: 0.10,
    description: 'Rapport, alinhamento de pauta e estabelecimento de autoridade inicial.',
  },
  investigacao_diagnostico: {
    key: 'investigacao_diagnostico',
    label: 'Investigação e Diagnóstico',
    weight: 0.25,
    description: 'Perguntas abertas, aprofundamento das dores e impacto no negócio.',
  },
  qualificacao: {
    key: 'qualificacao',
    label: 'Qualificação',
    weight: 0.10,
    description: 'Validação de autoridade, orçamento, urgência e processo de decisão.',
  },
  construcao_valor: {
    key: 'construcao_valor',
    label: 'Construção de Valor',
    weight: 0.15,
    description: 'Demonstração de ROI, personalização e ancoragem antes do preço.',
  },
  tratamento_objecoes: {
    key: 'tratamento_objecoes',
    label: 'Tratamento de Objeções',
    weight: 0.15,
    description: 'Escuta ativa, validação e contorno estruturado das preocupações.',
  },
  fechamento_compromisso: {
    key: 'fechamento_compromisso',
    label: 'Fechamento e Compromisso',
    weight: 0.15,
    description: 'Condução assertiva para o "sim" e pedido claro do fechamento.',
  },
  proximos_passos: {
    key: 'proximos_passos',
    label: 'Próximos Passos',
    weight: 0.10,
    description: 'Definição objetiva de datas, compromissos e responsáveis.',
  },
};

export interface CompetencyAnalysis {
  name: string;
  score: number; // 0 a 10
  weight: number; // 0.10 a 0.25
  justification: string;
  strengths: string[];
  improvements: string[];
  evidence: string[]; // Citações literais da transcrição
  recommendations: string[];
  alternativeApproach?: string; // Como o closer poderia ter falado
}

export interface CallBehaviors {
  investigatedNeeds: boolean;
  consultativeQuestions: boolean;
  exploredConsequences: boolean;
  identifiedMotivationPriority: boolean;
  builtValueBeforePrice: boolean;
  handledObjectionsWell: boolean;
  attemptedClosing: boolean;
  definedNextSteps: boolean;
}

export interface CallObjection {
  objection: string;
  prospectQuote: string;
  howHandled: string;
  rating: 'adequado' | 'parcial' | 'inadequado' | 'ignorado';
  feedback: string;
}

export interface CallAnalysis {
  id?: string;
  callId: string;
  overallScore: number; // 0 a 100
  summary: string;
  competencies: Record<CompetencyKey, CompetencyAnalysis>;
  behaviors: CallBehaviors;
  objections: CallObjection[];
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  modelName: string;
  analysisVersion: string;
  promptVersion: string;
  analyzedAt: string;
}

export interface Closer {
  id: string;
  name: string;
  active: boolean;
  avatarUrl?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesCall {
  id: string;
  closerId: string;
  occurredAt: string;
  transcript: string;
  saleClosed: boolean;
  prospectName?: string;
  dealValue?: number;
  durationMinutes?: number;
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'failed';
  analysis?: CallAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface CloserMetrics {
  closer: Closer;
  totalCalls: number;
  salesClosed: number;
  conversionRate: number;
  avgScore: number;
  evolution: number | null; // Variação % real em relação ao período anterior (null se sem histórico)
  competencyAverages: Record<CompetencyKey, number>;
}

export interface DashboardMetrics {
  totalCalls: number;
  closedSales: number;
  conversionRate: number;
  avgScore: number;
  callsEvolution: number | null;
  salesEvolution: number | null;
  conversionRateEvolution: number | null;
  filteredCalls: SalesCall[];
  closerMetrics: CloserMetrics[];
  bottlenecks: Array<{ name: string; count: number; impact: string }>;
}
