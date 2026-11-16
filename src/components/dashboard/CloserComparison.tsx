'use client';

import React, { useState } from 'react';
import { Closer, CloserMetrics, COMPETENCY_CONFIGS, CompetencyKey } from '@/types';
import { Sparkles, User, Users, GitCompare } from 'lucide-react';

interface CloserComparisonProps {
  closers: Closer[];
  metrics: CloserMetrics[];
}

interface StrengthDiff {
  key: CompetencyKey;
  label: string;
  diff: number;
}

function computeTopStrengths(
  hasBothCalls: boolean,
  metricA?: CloserMetrics,
  metricB?: CloserMetrics
): { topStrengthA: StrengthDiff | null; topStrengthB: StrengthDiff | null } {
  let topStrengthA: StrengthDiff | null = null;
  let topStrengthB: StrengthDiff | null = null;

  if (hasBothCalls && metricA && metricB) {
    const competencyKeys = Object.keys(COMPETENCY_CONFIGS) as CompetencyKey[];
    for (const key of competencyKeys) {
      const scoreA = metricA.competencyAverages[key] || 0;
      const scoreB = metricB.competencyAverages[key] || 0;
      const diff = scoreA - scoreB;
      if (diff > 0 && (!topStrengthA || diff > topStrengthA.diff)) {
        topStrengthA = { key, label: COMPETENCY_CONFIGS[key].label, diff: Number(diff.toFixed(1)) };
      } else if (diff < 0 && (!topStrengthB || Math.abs(diff) > Math.abs(topStrengthB.diff))) {
        topStrengthB = { key, label: COMPETENCY_CONFIGS[key].label, diff: Number(Math.abs(diff).toFixed(1)) };
      }
    }
  }

  return { topStrengthA, topStrengthB };
}

export const CloserComparison: React.FC<CloserComparisonProps> = ({
  closers,
  metrics,
}) => {
  const [closerAId, setCloserAId] = useState<string>(closers[0]?.id || '');
  const [closerBId, setCloserBId] = useState<string>(closers[1]?.id || closers[0]?.id || '');

  if (!closers || closers.length < 2) {
    return (
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
            Benchmarking Head-to-Head
          </span>
        </div>
        <h3 className="text-[20px] font-semibold tracking-[-0.035em] text-[#0C0C0D] mb-1">
          Comparativo entre closers
        </h3>
        <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mb-6">
          Contraste de competências comportamentais e taxa de conversão
        </p>

        <div className="py-12 px-6 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
            <GitCompare className="w-6 h-6 text-[#71717A]" />
          </div>
          <h4 className="text-[15px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
            Cadastre ao menos 2 closers para habilitar o comparativo
          </h4>
          <p className="text-[12px] text-[#71717A] max-w-sm leading-relaxed tracking-[-0.01em]">
            O comparativo Head-to-Head cruza as 7 competências de vendas lado a lado para identificar os pontos fortes de cada profissional.
          </p>
        </div>
      </div>
    );
  }

  const metricA = metrics.find((m) => m.closer.id === closerAId) || metrics[0];
  const metricB = metrics.find((m) => m.closer.id === closerBId) || metrics[1] || metrics[0];

  const competencyKeys = Object.keys(COMPETENCY_CONFIGS) as CompetencyKey[];

  const hasCallsA = metricA?.totalCalls > 0;
  const hasCallsB = metricB?.totalCalls > 0;
  const hasBothCalls = hasCallsA && hasCallsB;

  // Encontrar onde A se destaca e onde B se destaca
  const { topStrengthA, topStrengthB } = computeTopStrengths(hasBothCalls, metricA, metricB);

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8">
      {/* Cabeçalho do Comparativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
              Benchmarking Head-to-Head
            </span>
          </div>
          <h3 className="text-[24px] font-semibold tracking-[-0.04em] text-[#0C0C0D]">
            Comparativo entre closers
          </h3>
          <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mt-0.5">
            Contraste de competências comportamentais e taxa de conversão
          </p>
        </div>

        {/* Seletores de Closer A e Closer B */}
        <div className="flex items-center gap-2.5 bg-[#F3F4F6] p-1.5 rounded-pill border border-[#E5E7EB]">
          <select
            value={closerAId}
            onChange={(e) => setCloserAId(e.target.value)}
            className="bg-[#CEF52A] text-[#0C0C0D] text-[12px] font-bold py-1.5 px-3 rounded-pill cursor-pointer focus:outline-none tracking-tight"
          >
            {closers.map((c) => (
              <option key={c.id} value={c.id} className="text-[#0C0C0D] bg-white">
                Closer A: {c.name}
              </option>
            ))}
          </select>

          <span className="text-[11px] font-semibold text-[#71717A]">vs</span>

          <select
            value={closerBId}
            onChange={(e) => setCloserBId(e.target.value)}
            className="bg-[#0C0C0D] text-white text-[12px] font-medium py-1.5 px-3 rounded-pill cursor-pointer focus:outline-none tracking-tight"
          >
            {closers.map((c) => (
              <option key={c.id} value={c.id} className="text-[#0C0C0D] bg-white">
                Closer B: {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dois Cards Grandes Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card Closer A — Lime Accent */}
        <div className="rounded-[28px] p-6 border border-[#CEF52A] bg-[#CEF52A]/[0.06]">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white border-2 border-[#CEF52A] flex-shrink-0">
              {metricA?.closer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={metricA.closer.avatarUrl}
                  alt={metricA.closer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#0C0C0D]">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#0C0C0D] bg-[#CEF52A] px-2 py-0.5 rounded-pill">
                Closer A
              </span>
              <h4 className="text-[17px] font-semibold text-[#0C0C0D] mt-1 tracking-[-0.02em]">
                {metricA?.closer.name}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#CEF52A]/30">
            <div>
              <span className="text-[11px] text-[#71717A] block tracking-[-0.01em]">Conversão</span>
              <span className="text-[20px] font-semibold text-[#0C0C0D] tracking-[-0.03em] tabular-nums">
                {hasCallsA ? `${metricA.conversionRate}%` : '0%'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#71717A] block tracking-[-0.01em]">Score médio</span>
              <span className="text-[20px] font-semibold text-[#0C0C0D] tracking-[-0.03em] tabular-nums">
                {metricA.avgScore > 0 ? metricA.avgScore : '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#71717A] block tracking-[-0.01em]">Reuniões</span>
              <span className="text-[20px] font-semibold text-[#0C0C0D] tracking-[-0.03em] tabular-nums">
                {metricA?.totalCalls || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Card Closer B — Obsidian Contrast */}
        <div className="rounded-[28px] p-6 border border-[#27272A] bg-[#0C0C0D] text-white">
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 flex-shrink-0">
              {metricB?.closer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={metricB.closer.avatarUrl}
                  alt={metricB.closer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-white/15 px-2 py-0.5 rounded-pill">
                Closer B
              </span>
              <h4 className="text-[17px] font-semibold text-white mt-1 tracking-[-0.02em]">
                {metricB?.closer.name}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
            <div>
              <span className="text-[11px] text-white/70 block tracking-[-0.01em]">Conversão</span>
              <span className="text-[20px] font-semibold text-[#CEF52A] tracking-[-0.03em] tabular-nums">
                {hasCallsB ? `${metricB.conversionRate}%` : '0%'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-white/70 block tracking-[-0.01em]">Score médio</span>
              <span className="text-[20px] font-semibold text-white tracking-[-0.03em] tabular-nums">
                {metricB.avgScore > 0 ? metricB.avgScore : '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-white/70 block tracking-[-0.01em]">Reuniões</span>
              <span className="text-[20px] font-semibold text-white tracking-[-0.03em] tabular-nums">
                {metricB?.totalCalls || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barras Horizontais das 7 Competências */}
      <div className="mb-8">
        <h4 className="text-[15px] font-semibold text-[#0C0C0D] mb-4 tracking-[-0.02em]">
          Contraste das 7 competências comerciais
        </h4>

        <div className="space-y-4">
          {competencyKeys.map((key) => {
            const config = COMPETENCY_CONFIGS[key];
            const scoreA = metricA?.competencyAverages[key] || 0;
            const scoreB = metricB?.competencyAverages[key] || 0;
            const pctA = Math.min(100, (scoreA / 10) * 100);
            const pctB = Math.min(100, (scoreB / 10) * 100);

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-[#0C0C0D] tracking-[-0.01em]">
                    {config.label}
                    <span className="text-[11px] text-[#71717A] ml-2 font-normal">
                      (peso {Math.round(config.weight * 100)}%)
                    </span>
                  </span>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span className="font-semibold text-[#0C0C0D]">
                      {scoreA > 0 ? scoreA : '—'}
                    </span>
                    <span className="text-[#71717A] text-[11px]">vs</span>
                    <span className="font-semibold text-[#0C0C0D]">
                      {scoreB > 0 ? scoreB : '—'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pctA}%` }}
                      className="bg-[#CEF52A] h-full rounded-full transition-all duration-500"
                    />
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pctB}%` }}
                      className="bg-[#0C0C0D] h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnóstico Comparativo Dinâmico com IA */}
      <div className="border-t border-[#E5E7EB] pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#0C0C0D]" />
          <h4 className="text-[15px] font-semibold text-[#0C0C0D] tracking-[-0.02em]">
            Diagnóstico comparativo de inteligência comercial
          </h4>
        </div>

        {hasBothCalls ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1.5">
                Destaque Closer A ({metricA.closer.name})
              </span>
              <p className="text-[12px] text-[#0C0C0D] leading-relaxed font-normal tracking-[-0.01em]">
                {topStrengthA
                  ? `Maior vantagem em "${topStrengthA.label}" com +${topStrengthA.diff} pts em relação ao colega.`
                  : 'Apresenta desempenho equilibrado nas competências analisadas.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0C0C0D] block mb-1.5">
                Destaque Closer B ({metricB.closer.name})
              </span>
              <p className="text-[12px] text-[#0C0C0D] leading-relaxed font-normal tracking-[-0.01em]">
                {topStrengthB
                  ? `Maior vantagem em "${topStrengthB.label}" com +${topStrengthB.diff} pts em relação ao colega.`
                  : 'Apresenta desempenho equilibrado nas competências analisadas.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0C0C0D] block mb-1.5">
                Recomendação de peer-coaching
              </span>
              <p className="text-[12px] text-[#0C0C0D] leading-relaxed font-normal tracking-[-0.01em]">
                Sessão de mentoria interna cruzada: troca de práticas entre a condução de {metricA.closer.name} e {metricB.closer.name}.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] text-center">
            <p className="text-[12px] text-[#71717A] tracking-[-0.01em]">
              Diagnóstico comparativo detalhado disponível assim que ambos os closers possuírem chamadas analisadas por IA.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
