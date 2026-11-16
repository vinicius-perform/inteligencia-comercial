'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardsProps {
  totalCalls: number;
  closedSales: number;
  conversionRate: number;
  avgScore: number;
  callsEvolution?: number | null;
  salesEvolution?: number | null;
  conversionRateEvolution?: number | null;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalCalls,
  closedSales,
  conversionRate,
  avgScore,
  callsEvolution = null,
  salesEvolution = null,
  conversionRateEvolution = null,
}) => {
  const renderEvolutionBadge = (evolution: number | null, suffix = '%') => {
    if (evolution === null || evolution === undefined) {
      return (
        <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-pill bg-[#F3F4F6] text-[#71717A] tracking-tight">
          Período base
        </span>
      );
    }
    const isPositive = evolution >= 0;
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2.5 py-0.5 rounded-pill tracking-tight ${
          isPositive ? 'bg-[#CEF52A] text-[#0C0C0D]' : 'bg-[#F3F4F6] text-[#71717A] border border-[#E5E7EB]'
        }`}
      >
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {isPositive ? `+${evolution}` : `${evolution}`}{suffix}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
      {/* 1. Calls Analisadas */}
      <div className="bg-white rounded-[28px] p-6 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[13px] font-medium text-[#71717A] tracking-[-0.01em]">
            Calls analisadas
          </span>
          {renderEvolutionBadge(callsEvolution)}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[42px] font-semibold tracking-[-0.055em] text-[#0C0C0D] leading-[1.05] tabular-nums">
            {totalCalls}
          </span>
          <span className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em]">reuniões</span>
        </div>
        <p className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em] mt-3">
          {totalCalls > 0 ? 'Processadas com transcrição e IA' : 'Nenhuma call registrada no período'}
        </p>
      </div>

      {/* 2. Vendas Fechadas */}
      <div className="bg-white rounded-[28px] p-6 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[13px] font-medium text-[#71717A] tracking-[-0.01em]">
            Vendas fechadas
          </span>
          {renderEvolutionBadge(salesEvolution)}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[42px] font-semibold tracking-[-0.055em] text-[#0C0C0D] leading-[1.05] tabular-nums">
            {closedSales}
          </span>
          <span className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em]">deals ganhos</span>
        </div>
        <p className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em] mt-3">
          {closedSales > 0 ? 'Contratos validados pelo time' : 'Aguardando primeiros fechamentos'}
        </p>
      </div>

      {/* 3. Taxa de Fechamento */}
      <div className="bg-white rounded-[28px] p-6 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[13px] font-medium text-[#71717A] tracking-[-0.01em]">
            Taxa de fechamento
          </span>
          {renderEvolutionBadge(conversionRateEvolution, ' pp')}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[42px] font-semibold tracking-[-0.055em] text-[#0C0C0D] leading-[1.05] tabular-nums">
            {totalCalls > 0 ? `${conversionRate}%` : '0%'}
          </span>
        </div>
        <p className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em] mt-3">
          {totalCalls > 0 ? 'Conversão direta em venda' : 'Sem amostra no período'}
        </p>
      </div>

      {/* 4. Score Médio */}
      <div className="bg-white rounded-[28px] p-6 border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[13px] font-medium text-[#71717A] tracking-[-0.01em]">
            Score médio comercial
          </span>
          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-pill bg-[#0C0C0D] text-[#CEF52A] tracking-tight">
            Meta: 80+
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[42px] font-semibold tracking-[-0.055em] text-[#0C0C0D] leading-[1.05] tabular-nums">
            {avgScore > 0 ? avgScore : '—'}
          </span>
          {avgScore > 0 && (
            <span className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em]">/ 100</span>
          )}
        </div>
        <p className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em] mt-3">
          {avgScore > 0 ? 'Média ponderada das 7 competências' : 'Aguardando análises por IA'}
        </p>
      </div>
    </div>
  );
};
