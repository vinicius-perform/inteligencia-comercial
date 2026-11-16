'use client';

import React from 'react';
import { ArrowUpRight, ArrowRight, TrendingUp } from 'lucide-react';

interface BentoCardsProps {
  conversionRate: number;
  closedSales: number;
  totalCalls: number;
  avgScore: number;
  conversionRateEvolution?: number | null;
  bottlenecks: Array<{ name: string; count: number; impact: string }>;
  onViewDiagnostic: () => void;
  onFilterBottleneckCalls: () => void;
}

export const BentoCards: React.FC<BentoCardsProps> = ({
  conversionRate,
  closedSales,
  totalCalls,
  avgScore,
  conversionRateEvolution = null,
  bottlenecks,
  onViewDiagnostic,
  onFilterBottleneckCalls,
}) => {
  const activeBottlenecks = bottlenecks.filter((b) => b.count > 0);
  const soundwaves1 = [12, 18, 10, 24, 16, 28, 20, 14, 22, 18, 30, 26, 16, 22, 18, 12, 26, 32, 20, 14];
  const soundwaves2 = [14, 22, 28, 16, 34, 20, 26, 18, 30, 24, 38, 28, 22, 16, 24, 32, 20, 18, 26, 14];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 font-sans">
      {/* CARD 1 — TAXA DE FECHAMENTO (Deep Obsidian #0C0C0D + Highlights #CEF52A) */}
      <div className="rounded-[32px] p-7 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-card bg-[#0C0C0D] border border-[#27272A]">
        {/* Glow sutil de fundo em #CEF52A */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#CEF52A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Topo do Card */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] font-bold tracking-tight px-3 py-1 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
            Taxa de fechamento
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[#CEF52A] border border-white/10">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Informações Principais */}
        <div className="my-auto py-3 z-10">
          <div className="text-[48px] font-semibold tracking-[-0.055em] text-white leading-none mb-2 tabular-nums">
            {totalCalls > 0 ? `${conversionRate}%` : '0%'}
          </div>
          <p className="text-white/80 text-[13px] font-normal leading-relaxed max-w-[240px] tracking-[-0.01em]">
            {totalCalls > 0
              ? `${closedSales} vendas realizadas de ${totalCalls} reuniões comerciais qualificadas.`
              : 'Nenhuma reunião registrada no período selecionado.'}
          </p>
        </div>

        {/* Rodapé com Micrográfico Equalizador em #CEF52A */}
        <div className="pt-4 border-t border-white/10 z-10 flex items-center justify-between">
          <div className="flex items-end h-7 gap-[2px]">
            {soundwaves1.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h * 0.8}px` }}
                className="soundwave-bar-lime opacity-90"
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-[#CEF52A] tracking-[-0.01em]">
            {conversionRateEvolution !== null && conversionRateEvolution !== undefined
              ? `${conversionRateEvolution >= 0 ? `+${conversionRateEvolution}` : conversionRateEvolution} pp vs período anterior`
              : 'Período base'}
          </span>
        </div>
      </div>

      {/* CARD 2 — INTELIGÊNCIA COMERCIAL (Branco Premium com Acentos #0C0C0D e #CEF52A) */}
      <div className="bg-white rounded-[32px] p-7 text-[#0C0C0D] relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-card border border-[#E5E7EB]">
        {/* Topo do Card */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] font-medium tracking-tight px-3 py-1 rounded-pill bg-[#F3F4F6] text-[#0C0C0D] border border-[#E5E7EB]">
            Inteligência comercial
          </span>
          <button
            onClick={onViewDiagnostic}
            title="Abrir Diagnóstico"
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#0C0C0D] hover:text-white flex items-center justify-center text-[#0C0C0D] border border-[#E5E7EB] transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Informações Principais */}
        <div className="my-auto py-3 z-10">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[48px] font-semibold tracking-[-0.055em] text-[#0C0C0D] leading-none tabular-nums">
              {avgScore > 0 ? avgScore : '—'}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D] tracking-tight">
              {avgScore >= 80
                ? 'Alta performance'
                : avgScore >= 65
                ? 'Consistente'
                : avgScore > 0
                ? 'Em evolução'
                : 'Aguardando análises'}
            </span>
          </div>
          <p className="text-[#0C0C0D] text-[13px] font-medium tracking-[-0.01em]">
            Score geral da equipe (0 a 100)
          </p>
          <span className="text-[11px] text-[#71717A] tracking-[-0.01em]">
            Média ponderada oficial das 7 competências
          </span>
        </div>

        {/* Rodapé com Micrográfico */}
        <div className="pt-4 border-t border-[#E5E7EB] z-10 flex items-center justify-between">
          <div className="flex items-end h-7 gap-[2px]">
            {soundwaves2.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h * 0.8}px` }}
                className="soundwave-bar-dark opacity-40"
              />
            ))}
          </div>
          <button
            onClick={onViewDiagnostic}
            className="px-4 py-1.5 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] text-[12px] font-semibold tracking-[-0.01em] transition-all shadow-pill"
          >
            Ver diagnóstico
          </button>
        </div>
      </div>

      {/* CARD 3 — GARGALOS IDENTIFICADOS (Minimalista #FFFFFF + Tags) */}
      <div className="bg-white rounded-[32px] p-7 border border-[#E5E7EB] shadow-card flex flex-col justify-between min-h-[300px]">
        {/* Topo do Card */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#0C0C0D] tracking-[-0.02em]">
              Gargalos identificados
            </h3>
            <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mt-0.5">
              Ocorrências críticas mapeadas pela IA
            </p>
          </div>
          <button
            onClick={onFilterBottleneckCalls}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#0C0C0D] hover:text-white flex items-center justify-center text-[#71717A] transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lista dos Gargalos Reais ou Estado Vazio */}
        {activeBottlenecks.length > 0 ? (
          <div className="space-y-3 my-1">
            {activeBottlenecks.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-2xl bg-[#F3F4F6] hover:bg-[#EBECEF] transition-colors border border-[#E5E7EB]/80 flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-[#0C0C0D] leading-snug tracking-[-0.01em]">
                    {item.name}
                  </p>
                  <span className="text-[11px] text-[#71717A] mt-0.5 block tracking-[-0.01em]">
                    {item.impact}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-pill flex-shrink-0 tracking-tight ${
                    index === 0
                      ? 'bg-[#CEF52A] text-[#0C0C0D]'
                      : 'bg-white text-[#0C0C0D] border border-[#E5E7EB]'
                  }`}
                >
                  {item.count} {item.count === 1 ? 'call' : 'calls'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] text-center my-auto">
            <p className="text-[12px] font-medium text-[#0C0C0D] tracking-[-0.01em]">
              Nenhum gargalo crítico detectado
            </p>
            <span className="text-[11px] text-[#71717A] block mt-1 tracking-[-0.01em]">
              Gargalos comportamentais surgem automaticamente com as análises de reuniões perdidas.
            </span>
          </div>
        )}

        {/* Rodapé */}
        <button
          onClick={onFilterBottleneckCalls}
          className="mt-2 text-[12px] font-semibold text-[#0C0C0D] flex items-center gap-1.5 hover:gap-2 transition-all self-start tracking-[-0.01em]"
        >
          <span>Acessar reuniões com gargalos</span>
          <ArrowRight className="w-3 h-3 text-[#0C0C0D]" />
        </button>
      </div>
    </div>
  );
};
