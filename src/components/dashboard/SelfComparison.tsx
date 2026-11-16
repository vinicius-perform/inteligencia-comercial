'use client';

import React, { useState } from 'react';
import { Closer, SalesCall, COMPETENCY_CONFIGS, CompetencyKey } from '@/types';
import { Sparkles, CheckCircle2, XCircle, HelpCircle, User, BarChart2 } from 'lucide-react';

interface SelfComparisonProps {
  closers: Closer[];
  calls: SalesCall[];
}

export const SelfComparison: React.FC<SelfComparisonProps> = ({
  closers,
  calls,
}) => {
  const [selectedCloserId, setSelectedCloserId] = useState<string>(closers[0]?.id || '');
  const [mode, setMode] = useState<'closed_vs_lost' | 'current_vs_previous'>('closed_vs_lost');

  if (!closers || closers.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
            Autocomparação individual
          </span>
        </div>
        <h3 className="text-[20px] font-semibold tracking-[-0.035em] text-[#0C0C0D] mb-1">
          Análise individual do closer
        </h3>
        <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mb-6">
          Identificação de padrões comportamentais entre vitórias e perdas
        </p>

        <div className="py-12 px-6 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
            <User className="w-6 h-6 text-[#71717A]" />
          </div>
          <h4 className="text-[15px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
            Nenhum closer cadastrado
          </h4>
          <p className="text-[12px] text-[#71717A] max-w-sm leading-relaxed tracking-[-0.01em]">
            Cadastre os membros da sua equipe para habilitar o diagnóstico individual de vitórias e perdas.
          </p>
        </div>
      </div>
    );
  }

  const selectedCloser = closers.find((c) => c.id === selectedCloserId) || closers[0];
  const closerCalls = calls.filter((c) => c.closerId === selectedCloser?.id);

  const closedCalls = closerCalls.filter((c) => c.saleClosed && c.analysis);
  const lostCalls = closerCalls.filter((c) => !c.saleClosed && c.analysis);

  const avgClosedScore =
    closedCalls.length > 0
      ? Math.round(closedCalls.reduce((acc, c) => acc + (c.analysis?.overallScore || 0), 0) / closedCalls.length)
      : null;

  const avgLostScore =
    lostCalls.length > 0
      ? Math.round(lostCalls.reduce((acc, c) => acc + (c.analysis?.overallScore || 0), 0) / lostCalls.length)
      : null;

  const competencyKeys = Object.keys(COMPETENCY_CONFIGS) as CompetencyKey[];
  const hasAnalyzedCalls = closedCalls.length > 0 || lostCalls.length > 0;

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
              Autocomparação individual
            </span>
          </div>
          <h3 className="text-[24px] font-semibold tracking-[-0.04em] text-[#0C0C0D]">
            Análise individual: {selectedCloser.name}
          </h3>
          <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mt-0.5">
            Identificação de padrões comportamentais entre vitórias e perdas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Seletor de Closer */}
          <select
            value={selectedCloser.id}
            onChange={(e) => setSelectedCloserId(e.target.value)}
            className="bg-[#F3F4F6] border border-[#E5E7EB] text-[#0C0C0D] text-[12px] font-medium py-2 px-3.5 rounded-pill cursor-pointer focus:outline-none shadow-xs tracking-[-0.01em]"
          >
            {closers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Toggle de Modos */}
          <div className="flex items-center bg-[#F3F4F6] p-1 rounded-pill border border-[#E5E7EB]">
            <button
              onClick={() => setMode('closed_vs_lost')}
              className={`px-3 py-1.5 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
                mode === 'closed_vs_lost'
                  ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                  : 'text-[#71717A] hover:text-[#0C0C0D]'
              }`}
            >
              Fechadas vs não fechadas
            </button>
            <button
              onClick={() => setMode('current_vs_previous')}
              className={`px-3 py-1.5 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
                mode === 'current_vs_previous'
                  ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                  : 'text-[#71717A] hover:text-[#0C0C0D]'
              }`}
            >
              Período atual vs anterior
            </button>
          </div>
        </div>
      </div>

      {hasAnalyzedCalls ? (
        <>
          {/* Amostra Analisada Alert */}
          <div className="p-3 mb-6 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-between text-[12px] text-[#0C0C0D] tracking-[-0.01em]">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0 text-[#71717A]" />
              <span>
                Amostra utilizada: <strong className="font-semibold">{closedCalls.length} calls fechadas</strong> e <strong className="font-semibold">{lostCalls.length} calls não fechadas</strong> analisadas integralmente com transcrição.
              </span>
            </div>
            <span className="font-bold text-[10px] uppercase bg-[#CEF52A] text-[#0C0C0D] px-2.5 py-0.5 rounded-pill tracking-wider">
              Amostra real
            </span>
          </div>

          {/* Comparação dos Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-[28px] bg-[#0C0C0D] text-white border border-[#27272A] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CEF52A]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3 z-10 relative">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0C0C0D] bg-[#CEF52A] px-2.5 py-0.5 rounded-pill">
                  Calls fechadas (ganhas)
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#CEF52A]" />
              </div>
              <div className="flex items-baseline gap-2 mt-3 z-10 relative">
                <span className="text-[44px] font-semibold text-white tracking-[-0.055em] tabular-nums leading-none">
                  {avgClosedScore !== null ? avgClosedScore : '—'}
                </span>
                <span className="text-[12px] text-white/70 font-normal">
                  {avgClosedScore !== null ? '/ 100 score médio' : 'Nenhuma call ganha'}
                </span>
              </div>
              <p className="text-[12px] text-white/80 mt-2 leading-relaxed tracking-[-0.01em] z-10 relative">
                {closedCalls.length > 0
                  ? `${closedCalls.length} reunião(ões) ganha(s) com análise de transcrição.`
                  : 'Ainda não há reuniões com venda fechada para este closer.'}
              </p>
            </div>

            <div className="p-6 rounded-[28px] bg-[#F3F4F6] border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0C0C0D] bg-white border border-[#E5E7EB] px-2.5 py-0.5 rounded-pill">
                  Calls não fechadas (perdidas)
                </span>
                <XCircle className="w-4 h-4 text-[#71717A]" />
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-[44px] font-semibold text-[#0C0C0D] tracking-[-0.055em] tabular-nums leading-none">
                  {avgLostScore !== null ? avgLostScore : '—'}
                </span>
                <span className="text-[12px] text-[#71717A] font-normal">
                  {avgLostScore !== null ? '/ 100 score médio' : 'Nenhuma call perdida'}
                </span>
              </div>
              <p className="text-[12px] text-[#71717A] mt-2 leading-relaxed tracking-[-0.01em]">
                {lostCalls.length > 0
                  ? `${lostCalls.length} reunião(ões) perdida(s) mapeada(s) pela IA.`
                  : 'Nenhuma call perdida registrada para este closer.'}
              </p>
            </div>
          </div>

          {/* Gráfico Comparativo por Competência */}
          <div className="p-6 rounded-[28px] bg-[#F3F4F6] border border-[#E5E7EB] mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[14px] font-semibold text-[#0C0C0D] tracking-[-0.01em]">
                Comparativo de competências: ganhas (lime) vs perdidas (preto)
              </h4>
              <div className="flex items-center gap-4 text-[12px] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CEF52A] border border-[#0C0C0D]/20" />
                  <span className="text-[#0C0C0D] font-semibold">Venda fechada</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0C0C0D]" />
                  <span className="text-[#0C0C0D] font-semibold">Venda perdida</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {competencyKeys.map((key) => {
                const config = COMPETENCY_CONFIGS[key];
                let winSum = 0, winCount = 0;
                closedCalls.forEach((c) => {
                  if (c.analysis?.competencies?.[key]?.score) {
                    winSum += c.analysis.competencies[key].score;
                    winCount++;
                  }
                });
                const scoreWin = winCount > 0 ? Number((winSum / winCount).toFixed(1)) : null;

                let lossSum = 0, lossCount = 0;
                lostCalls.forEach((c) => {
                  if (c.analysis?.competencies?.[key]?.score) {
                    lossSum += c.analysis.competencies[key].score;
                    lossCount++;
                  }
                });
                const scoreLoss = lossCount > 0 ? Number((lossSum / lossCount).toFixed(1)) : null;

                const pctWin = scoreWin !== null ? Math.min(100, Math.max(0, scoreWin * 10)) : 0;
                const pctLoss = scoreLoss !== null ? Math.min(100, Math.max(0, scoreLoss * 10)) : 0;

                return (
                  <div key={key} className="bg-white p-3.5 rounded-2xl border border-[#E5E7EB]">
                    <div className="flex items-center justify-between text-[12px] mb-2">
                      <span className="font-medium text-[#0C0C0D] tracking-[-0.01em]">{config.label}</span>
                      <div className="flex items-center gap-3 font-semibold text-[12px] tabular-nums">
                        <span className="text-[#0C0C0D] bg-[#CEF52A] px-1.5 py-0.5 rounded-md text-[11px] font-bold">
                          {scoreWin !== null ? `${scoreWin} / 10` : '—'}
                        </span>
                        <span className="text-[#71717A] font-normal">vs</span>
                        <span className="text-white bg-[#0C0C0D] px-1.5 py-0.5 rounded-md text-[11px]">
                          {scoreLoss !== null ? `${scoreLoss} / 10` : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pctWin}%` }}
                          className="bg-[#CEF52A] h-full rounded-full transition-all duration-500"
                        />
                      </div>
                      <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pctLoss}%` }}
                          className="bg-[#0C0C0D] h-full rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="py-12 px-6 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
            <BarChart2 className="w-6 h-6 text-[#71717A]" />
          </div>
          <h4 className="text-[15px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
            Nenhuma call analisada para {selectedCloser.name}
          </h4>
          <p className="text-[12px] text-[#71717A] max-w-sm leading-relaxed tracking-[-0.01em]">
            Cadastre reuniões com transcrição na aba &ldquo;Calls de Vendas&rdquo; para cruzar as competências das chamadas ganhas vs perdidas deste closer.
          </p>
        </div>
      )}
    </div>
  );
};
