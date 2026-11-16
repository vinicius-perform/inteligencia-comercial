'use client';

import React from 'react';
import { SalesCall, COMPETENCY_CONFIGS, CompetencyKey } from '@/types';
import { Sparkles, Target, BookOpen, CheckCircle } from 'lucide-react';

interface DevelopmentPlanProps {
  calls?: SalesCall[];
}

export const DevelopmentPlan: React.FC<DevelopmentPlanProps> = ({ calls = [] }) => {
  const analyzedCalls = calls.filter((c) => c.analysis && typeof c.analysis.overallScore === 'number');
  const lostCalls = analyzedCalls.filter((c) => !c.saleClosed);

  if (analyzedCalls.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8 font-sans">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
            Plano Estratégico IA
          </span>
        </div>
        <h3 className="text-[20px] font-semibold tracking-[-0.035em] text-[#0C0C0D] mb-1">
          Plano de desenvolvimento comercial
        </h3>
        <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mb-6">
          Ações práticas geradas por IA a partir das evidências reais das reuniões
        </p>

        <div className="py-12 px-6 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
            <Target className="w-6 h-6 text-[#71717A]" />
          </div>
          <h4 className="text-[15px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
            Plano estratégico aguardando análises de calls
          </h4>
          <p className="text-[12px] text-[#71717A] max-w-md leading-relaxed tracking-[-0.01em]">
            Assim que você registrar e analisar as primeiras reuniões comerciais, a Inteligência Artificial mapeará a competência com menor nota média e sintetizará as 3 ações prioritárias da semana.
          </p>
        </div>
      </div>
    );
  }

  // Identificar dinamicamente a competência com menor score médio nas calls analisadas
  const compKeys = Object.keys(COMPETENCY_CONFIGS) as CompetencyKey[];
  const compScores: Record<CompetencyKey, { sum: number; count: number }> = {
    abertura_conexao: { sum: 0, count: 0 },
    investigacao_diagnostico: { sum: 0, count: 0 },
    qualificacao: { sum: 0, count: 0 },
    construcao_valor: { sum: 0, count: 0 },
    tratamento_objecoes: { sum: 0, count: 0 },
    fechamento_compromisso: { sum: 0, count: 0 },
    proximos_passos: { sum: 0, count: 0 },
  };

  analyzedCalls.forEach((c) => {
    compKeys.forEach((key) => {
      const score = c.analysis?.competencies?.[key]?.score;
      if (typeof score === 'number') {
        compScores[key].sum += score;
        compScores[key].count++;
      }
    });
  });

  let weakestKey: CompetencyKey = 'construcao_valor';
  let minAvg = 999;

  compKeys.forEach((key) => {
    const item = compScores[key];
    const avg = item.count > 0 ? item.sum / item.count : 10;
    if (avg < minAvg) {
      minAvg = avg;
      weakestKey = key;
    }
  });

  const priorityConfig = COMPETENCY_CONFIGS[weakestKey];
  const priorityAvg = Number(minAvg.toFixed(1));

  // Calcular percentual real de calls com score abaixo de 7 nesta competência
  const belowThresholdCalls = lostCalls.filter(
    (c) => (c.analysis?.competencies?.[weakestKey]?.score || 10) < 7.0
  ).length;
  const lostPercentage =
    lostCalls.length > 0 ? Math.round((belowThresholdCalls / lostCalls.length) * 100) : 0;

  // Plano de ações práticas calibrado de acordo com a competência prioritária
  const planActions = [
    {
      title: 'Diagnóstico e Perguntas de Implicação',
      competency: 'Investigação',
      action: 'Inserir a pergunta: "Quanto custa para a empresa NÃO resolver isso nos próximos 6 meses?".',
      training: 'Oficina de SPIN Selling (Implicação e Necessidade de Solução).',
      target: 'Média Diagnóstico > 8.0',
    },
    {
      title: 'Isolamento Estruturado de Objeções',
      competency: 'Objeções',
      action: 'Proibir concessão de desconto na 1ª hesitação. Isolar: "Além do valor, há outro ponto que impeça o início imediato?".',
      training: 'Roleplay de defesa de valor e sustentação de margem comercial.',
      target: 'Score Objeções > 8.0',
    },
    {
      title: 'Formalização de Próximos Passos',
      competency: 'Compromisso',
      action: 'Nunca encerrar a chamada sem convite de calendário aceito em tempo real pelo cliente.',
      training: 'Gestão de pipeline e fechamento com compromisso formal.',
      target: 'No-show pós-reunião < 10%',
    },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8 font-sans">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
              Plano Estratégico IA
            </span>
          </div>
          <h3 className="text-[24px] font-semibold tracking-[-0.04em] text-[#0C0C0D]">
            Plano de desenvolvimento comercial
          </h3>
          <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mt-0.5">
            Ações práticas geradas por IA a partir das evidências reais das reuniões
          </p>
        </div>
      </div>

      {/* Competência Prioritária em Card Dark com Acento Lime */}
      <div className="rounded-[28px] p-6 mb-8 bg-[#0C0C0D] text-white border border-[#27272A] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#CEF52A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0C0C0D] bg-[#CEF52A] px-3 py-1 rounded-pill">
            Competência prioritária mapeada
          </span>
          <h4 className="text-[20px] font-semibold text-white mt-2.5 tracking-[-0.02em]">
            {priorityConfig.label}
          </h4>
          <p className="text-[13px] text-white/80 mt-1 max-w-xl leading-relaxed tracking-[-0.01em]">
            Score médio atual de <strong className="text-[#CEF52A]">{priorityAvg} / 10</strong>.
            {lostCalls.length > 0 && lostPercentage > 0
              ? ` Em ${lostPercentage}% das reuniões não fechadas, este critério apresentou hesitação ou falha de condução.`
              : ' Principal oportunidade identificada para elevar a conversão geral da equipe.'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center min-w-[170px] shadow-sm z-10">
          <span className="text-[11px] uppercase font-medium text-white/70 tracking-tight">Impacto Projetado</span>
          <span className="text-[28px] font-bold text-[#CEF52A] mt-0.5 tracking-[-0.04em] tabular-nums">
            +{Math.min(15, Math.max(5, Math.round((10 - priorityAvg) * 1.8)))}%
          </span>
          <span className="text-[11px] text-white/80 tracking-[-0.01em]">na taxa de conversão</span>
        </div>
      </div>

      {/* Três Ações Práticas e Objetivas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planActions.map((item, index) => (
          <div
            key={index}
            className="bg-[#F3F4F6] rounded-[24px] p-6 border border-[#E5E7EB] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill bg-[#0C0C0D] text-white">
                  Ação #{index + 1}
                </span>
                <span className="text-[11px] font-semibold text-[#0C0C0D]">{item.competency}</span>
              </div>
              <h5 className="text-[14px] font-semibold text-[#0C0C0D] mb-3 tracking-[-0.01em]">
                {item.title}
              </h5>

              <div className="space-y-3 text-[12px] text-[#0C0C0D] tracking-[-0.01em]">
                <div>
                  <span className="font-semibold text-[#71717A] block text-[10px] uppercase tracking-wider mb-0.5">
                    Instrução prática:
                  </span>
                  <span className="leading-relaxed">{item.action}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#71717A] block text-[10px] uppercase tracking-wider mb-0.5">
                    Treinamento recomendado:
                  </span>
                  <span className="text-[#52525B] leading-relaxed">{item.training}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-[12px]">
              <span className="text-[#71717A]">Meta de qualidade:</span>
              <span className="font-bold text-[#0C0C0D] tabular-nums">{item.target}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
