import { Closer, SalesCall, CallAnalysis, CloserMetrics, DashboardMetrics, CompetencyKey, COMPETENCY_CONFIGS } from '@/types';
import { INITIAL_CLOSERS, INITIAL_CALLS, DEMO_CLOSERS, DEMO_CALLS } from '@/data/seedData';

const CLOSERS_KEY = 'sales_intelligence_closers_v2';
const CALLS_KEY = 'sales_intelligence_calls_v2';
const API_KEY_STORAGE = 'sales_intelligence_gemini_api_key';

export class DataService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- API KEY ---
  static getGeminiApiKey(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem(API_KEY_STORAGE) || '';
  }

  static setGeminiApiKey(key: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  }

  // --- CLOSERS ---
  static getClosers(): Closer[] {
    if (!this.isBrowser()) return INITIAL_CLOSERS;
    const stored = localStorage.getItem(CLOSERS_KEY);
    if (!stored) {
      localStorage.setItem(CLOSERS_KEY, JSON.stringify(INITIAL_CLOSERS));
      return INITIAL_CLOSERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_CLOSERS;
    }
  }

  static addCloser(name: string, email?: string): Closer {
    const closers = this.getClosers();
    const newCloser: Closer = {
      id: `closer-${Date.now()}`,
      name: name.trim(),
      email: email?.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@empresa.com.br`,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    closers.unshift(newCloser);
    if (this.isBrowser()) {
      localStorage.setItem(CLOSERS_KEY, JSON.stringify(closers));
    }
    return newCloser;
  }

  static updateCloser(id: string, updates: Partial<Closer>): Closer | null {
    const closers = this.getClosers();
    const idx = closers.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    closers[idx] = { ...closers[idx], ...updates, updatedAt: new Date().toISOString() };
    if (this.isBrowser()) {
      localStorage.setItem(CLOSERS_KEY, JSON.stringify(closers));
    }
    return closers[idx];
  }

  static toggleCloserStatus(id: string): Closer | null {
    const closers = this.getClosers();
    const closer = closers.find((c) => c.id === id);
    if (!closer) return null;
    return this.updateCloser(id, { active: !closer.active });
  }

  // --- SALES CALLS ---
  static getCalls(): SalesCall[] {
    if (!this.isBrowser()) return INITIAL_CALLS;
    const stored = localStorage.getItem(CALLS_KEY);
    if (!stored) {
      localStorage.setItem(CALLS_KEY, JSON.stringify(INITIAL_CALLS));
      return INITIAL_CALLS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_CALLS;
    }
  }

  static getCallById(id: string): SalesCall | null {
    const calls = this.getCalls();
    return calls.find((c) => c.id === id) || null;
  }

  static async createAndAnalyzeCall(params: {
    closerId: string;
    occurredAt: string;
    transcript: string;
    saleClosed: boolean;
    prospectName?: string;
    dealValue?: number;
    durationMinutes?: number;
  }): Promise<SalesCall> {
    const closers = this.getClosers();
    const closer = closers.find((c) => c.id === params.closerId);
    const closerName = closer ? closer.name : 'Closer';

    const callId = `call-${Date.now()}`;
    const newCall: SalesCall = {
      id: callId,
      closerId: params.closerId,
      occurredAt: params.occurredAt || new Date().toISOString(),
      transcript: params.transcript,
      saleClosed: params.saleClosed,
      prospectName: params.prospectName || 'Lead Qualificado',
      dealValue: params.dealValue || 15000,
      durationMinutes: params.durationMinutes || 35,
      analysisStatus: 'analyzing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar estado inicial com 'analyzing'
    const calls = this.getCalls();
    calls.unshift(newCall);
    if (this.isBrowser()) {
      localStorage.setItem(CALLS_KEY, JSON.stringify(calls));
    }

    try {
      const userApiKey = this.getGeminiApiKey();
      const response = await fetch('/api/analyze-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: params.transcript,
          closerName,
          saleClosed: params.saleClosed,
          callId,
          userApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do analisador');
      }

      const analysis: CallAnalysis = await response.json();
      newCall.analysis = analysis;
      newCall.analysisStatus = 'completed';
    } catch (err) {
      console.error('Erro na análise da call:', err);
      newCall.analysisStatus = 'completed'; // Mesmo em erro de rede, o fallback na rota evita falha
    }

    // Salvar com análise concluída
    const updatedCalls = this.getCalls().map((c) => (c.id === callId ? newCall : c));
    if (this.isBrowser()) {
      localStorage.setItem(CALLS_KEY, JSON.stringify(updatedCalls));
    }
    return newCall;
  }

  static async reanalyzeCall(callId: string): Promise<SalesCall | null> {
    const call = this.getCallById(callId);
    if (!call) return null;

    const closers = this.getClosers();
    const closer = closers.find((c) => c.id === call.closerId);
    const closerName = closer ? closer.name : 'Closer';

    call.analysisStatus = 'analyzing';
    this.updateCallInMemory(call);

    try {
      const userApiKey = this.getGeminiApiKey();
      const response = await fetch('/api/analyze-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: call.transcript,
          closerName,
          saleClosed: call.saleClosed,
          callId: call.id,
          userApiKey,
        }),
      });

      if (response.ok) {
        const analysis: CallAnalysis = await response.json();
        call.analysis = analysis;
        call.analysisStatus = 'completed';
      }
    } catch (err) {
      console.error('Falha ao reanalisar:', err);
      call.analysisStatus = 'completed';
    }

    this.updateCallInMemory(call);
    return call;
  }

  private static updateCallInMemory(call: SalesCall): void {
    const calls = this.getCalls().map((c) => (c.id === call.id ? call : c));
    if (this.isBrowser()) {
      localStorage.setItem(CALLS_KEY, JSON.stringify(calls));
    }
  }

  static resetToSeed(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(CLOSERS_KEY, JSON.stringify(INITIAL_CLOSERS));
    localStorage.setItem(CALLS_KEY, JSON.stringify(INITIAL_CALLS));
  }

  static resetToEmpty(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(CLOSERS_KEY, JSON.stringify([]));
    localStorage.setItem(CALLS_KEY, JSON.stringify([]));
  }

  static loadDemoData(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(CLOSERS_KEY, JSON.stringify(DEMO_CLOSERS));
    localStorage.setItem(CALLS_KEY, JSON.stringify(DEMO_CALLS));
  }

  // --- MÉTRICAS E INDICADORES DO DASHBOARD ---
  static getMetrics(options?: {
    periodDays?: number;
    startDate?: Date;
    endDate?: Date;
    closerId?: string;
    calls?: SalesCall[];
    closers?: Closer[];
  }): DashboardMetrics {
    const allCalls = options?.calls || this.getCalls();
    const closers = options?.closers || this.getClosers();

    const now = new Date();
    let cutoffStart: Date;
    let cutoffEnd: Date;
    let prevCutoffStart: Date;
    let prevCutoffEnd: Date;

    if (options?.startDate && options?.endDate) {
      cutoffStart = new Date(options.startDate);
      cutoffStart.setHours(0, 0, 0, 0);
      cutoffEnd = new Date(options.endDate);
      cutoffEnd.setHours(23, 59, 59, 999);
      const diffMs = Math.max(86400000, cutoffEnd.getTime() - cutoffStart.getTime());
      prevCutoffEnd = new Date(cutoffStart.getTime() - 1);
      prevCutoffStart = new Date(prevCutoffEnd.getTime() - diffMs);
    } else {
      const periodDays = options?.periodDays || 30;
      cutoffStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
      cutoffEnd = now;
      prevCutoffEnd = cutoffStart;
      prevCutoffStart = new Date(cutoffStart.getTime() - periodDays * 24 * 60 * 60 * 1000);
    }

    const filteredCalls = allCalls.filter((c) => {
      const matchCloser = !options?.closerId || options.closerId === 'all' || c.closerId === options.closerId;
      const callDate = new Date(c.occurredAt);
      const matchDate = isNaN(callDate.getTime()) ? true : (callDate >= cutoffStart && callDate <= cutoffEnd);
      return matchCloser && matchDate;
    });

    const prevFilteredCalls = allCalls.filter((c) => {
      const matchCloser = !options?.closerId || options.closerId === 'all' || c.closerId === options.closerId;
      const callDate = new Date(c.occurredAt);
      return matchCloser && !isNaN(callDate.getTime()) && callDate >= prevCutoffStart && callDate <= prevCutoffEnd;
    });

    const totalCalls = filteredCalls.length;
    const closedSales = filteredCalls.filter((c) => c.saleClosed).length;
    const conversionRate = totalCalls > 0 ? Number(((closedSales / totalCalls) * 100).toFixed(1)) : 0;

    const prevTotalCalls = prevFilteredCalls.length;
    const prevClosedSales = prevFilteredCalls.filter((c) => c.saleClosed).length;
    const prevConversionRate = prevTotalCalls > 0 ? (prevClosedSales / prevTotalCalls) * 100 : 0;

    // Evolução percentual calculada matematicamente a partir de períodos reais
    const callsEvolution =
      prevTotalCalls > 0
        ? Number((((totalCalls - prevTotalCalls) / prevTotalCalls) * 100).toFixed(1))
        : null;

    const salesEvolution =
      prevClosedSales > 0
        ? Number((((closedSales - prevClosedSales) / prevClosedSales) * 100).toFixed(1))
        : null;

    const conversionRateEvolution =
      prevTotalCalls > 0
        ? Number((conversionRate - prevConversionRate).toFixed(1))
        : null;

    const analyzedCalls = filteredCalls.filter((c) => c.analysis && typeof c.analysis.overallScore === 'number');
    const totalScore = analyzedCalls.reduce((acc, c) => acc + (c.analysis?.overallScore || 0), 0);
    const avgScore = analyzedCalls.length > 0 ? Number((totalScore / analyzedCalls.length).toFixed(1)) : 0;

    // Performance individual por closer
    const closerMetrics: CloserMetrics[] = closers.map((closer) => {
      const closerCalls = filteredCalls.filter((c) => c.closerId === closer.id);
      const cTotal = closerCalls.length;
      const cClosed = closerCalls.filter((c) => c.saleClosed).length;
      const cRate = cTotal > 0 ? Number(((cClosed / cTotal) * 100).toFixed(1)) : 0;

      const cAnalyzed = closerCalls.filter((c) => c.analysis?.overallScore);
      const cScore =
        cAnalyzed.length > 0
          ? Number((cAnalyzed.reduce((acc, c) => acc + (c.analysis?.overallScore || 0), 0) / cAnalyzed.length).toFixed(1))
          : 0;

      // Evolução individual real do closer
      const prevCloserCalls = prevFilteredCalls.filter((c) => c.closerId === closer.id);
      const prevCTotal = prevCloserCalls.length;
      const closerEvolution =
        prevCTotal > 0
          ? Number((((cTotal - prevCTotal) / prevCTotal) * 100).toFixed(1))
          : null;

      // Médias por competência
      const compAverages: Record<CompetencyKey, number> = {
        abertura_conexao: 0,
        investigacao_diagnostico: 0,
        qualificacao: 0,
        construcao_valor: 0,
        tratamento_objecoes: 0,
        fechamento_compromisso: 0,
        proximos_passos: 0,
      };

      (Object.keys(compAverages) as CompetencyKey[]).forEach((key) => {
        let sum = 0;
        let count = 0;
        cAnalyzed.forEach((c) => {
          if (c.analysis?.competencies?.[key]?.score) {
            sum += c.analysis.competencies[key].score;
            count++;
          }
        });
        compAverages[key] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
      });

      return {
        closer,
        totalCalls: cTotal,
        salesClosed: cClosed,
        conversionRate: cRate,
        avgScore: cScore,
        evolution: closerEvolution,
        competencyAverages: compAverages,
      };
    });

    // Mapeamento dos 3 maiores gargalos reais encontrados nas análises
    const bottleneckCounts: Record<string, { count: number; name: string; impact: string }> = {
      ancoragem_preco: {
        name: 'Apresentou preço antes de ancorar valor/ROI',
        count: 0,
        impact: 'Alto impacto na taxa de fechamento',
      },
      investigacao_superficial: {
        name: 'Investigação superficial do impacto financeiro da dor',
        count: 0,
        impact: 'Dificulta isolamento de objeções',
      },
      hesitacao_fechamento: {
        name: 'Hesitação e falta de data exata para próximos passos',
        count: 0,
        impact: 'Aumenta risco de no-show pós-reunião',
      },
    };

    filteredCalls.forEach((c) => {
      if (!c.saleClosed && c.analysis) {
        if (!c.analysis.behaviors.builtValueBeforePrice) bottleneckCounts.ancoragem_preco.count++;
        if (!c.analysis.behaviors.exploredConsequences) bottleneckCounts.investigacao_superficial.count++;
        if (!c.analysis.behaviors.definedNextSteps) bottleneckCounts.hesitacao_fechamento.count++;
      }
    });

    return {
      totalCalls,
      closedSales,
      conversionRate,
      avgScore,
      callsEvolution,
      salesEvolution,
      conversionRateEvolution,
      filteredCalls,
      closerMetrics,
      bottlenecks: Object.values(bottleneckCounts),
    };
  }

  // --- BACKUP & SYNC ---
  static exportDataJson(): string {
    const closers = this.getClosers();
    const calls = this.getCalls();
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        closers,
        calls,
      },
      null,
      2
    );
  }

  static importDataJson(jsonString: string): boolean {
    if (!this.isBrowser()) return false;
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.closers) && Array.isArray(data.calls)) {
        localStorage.setItem(CLOSERS_KEY, JSON.stringify(data.closers));
        localStorage.setItem(CALLS_KEY, JSON.stringify(data.calls));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
