'use client';

import React from 'react';
import { CloserMetrics } from '@/types';
import { ArrowUpRight, ArrowDownRight, ChevronRight, User, Users, Plus } from 'lucide-react';

interface ClosersTableProps {
  metrics: CloserMetrics[];
  onSelectCloser: (closerId: string) => void;
  onViewAllClosers: () => void;
}

export const ClosersTable: React.FC<ClosersTableProps> = ({
  metrics,
  onSelectCloser,
  onViewAllClosers,
}) => {
  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8">
      {/* Cabeçalho da Tabela */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[20px] font-semibold tracking-[-0.035em] text-[#0C0C0D]">
            Performance dos closers
          </h3>
          <p className="text-[13px] text-[#71717A] mt-0.5 tracking-[-0.01em]">
            Métricas individuais de conversão e qualidade de abordagem
          </p>
        </div>

        <button
          onClick={onViewAllClosers}
          className="flex items-center gap-1 text-[12px] font-medium text-[#0C0C0D] hover:text-black transition-colors py-1.5 px-3 rounded-pill hover:bg-[#F3F4F6] tracking-[-0.01em]"
        >
          <span>Gerenciar closers</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabela ou Estado Vazio */}
      {metrics.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
                <th className="py-3 px-4">Closer</th>
                <th className="py-3 px-4 text-center">Calls analisadas</th>
                <th className="py-3 px-4 text-center">Vendas fechadas</th>
                <th className="py-3 px-4 text-center">Taxa de conversão</th>
                <th className="py-3 px-4 text-center">Score médio</th>
                <th className="py-3 px-4 text-center">Evolução</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[13px]">
              {metrics.map(({ closer, totalCalls, salesClosed, conversionRate, avgScore, evolution }) => {
                const isPositive = evolution !== null && evolution >= 0;
                const rateTagClass =
                  totalCalls === 0
                    ? 'bg-[#F3F4F6] text-[#71717A] font-normal'
                    : conversionRate >= 30
                    ? 'bg-[#CEF52A] text-[#0C0C0D] font-bold'
                    : conversionRate >= 15
                    ? 'bg-[#CEF52A]/20 text-[#0C0C0D] font-semibold border border-[#CEF52A]/40'
                    : 'bg-[#F3F4F6] text-[#52525B] font-medium';

                return (
                  <tr
                    key={closer.id}
                    onClick={() => onSelectCloser(closer.id)}
                    className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                  >
                    {/* Closer com Avatar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB] flex-shrink-0">
                          {closer.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={closer.avatarUrl}
                              alt={closer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#71717A]">
                              <User className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-[13px] text-[#0C0C0D] block group-hover:text-black transition-colors tracking-[-0.01em]">
                            {closer.name}
                          </span>
                          <span className="text-[11px] text-[#71717A] tracking-[-0.01em]">
                            {closer.email || 'closer@empresa.com.br'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Calls Analisadas */}
                    <td className="py-4 px-4 text-center font-normal text-[#0C0C0D] tabular-nums">
                      {totalCalls} {totalCalls === 1 ? 'call' : 'calls'}
                    </td>

                    {/* Vendas Fechadas */}
                    <td className="py-4 px-4 text-center font-normal text-[#0C0C0D] tabular-nums">
                      {salesClosed} {salesClosed === 1 ? 'venda' : 'vendas'}
                    </td>

                    {/* Taxa de Conversão */}
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-pill text-[11px] tabular-nums tracking-tight ${rateTagClass}`}>
                        {totalCalls > 0 ? `${conversionRate}%` : '0%'}
                      </span>
                    </td>

                    {/* Score Médio */}
                    <td className="py-4 px-4 text-center">
                      {avgScore > 0 ? (
                        <>
                          <span className="font-semibold text-[13px] text-[#0C0C0D] tabular-nums">
                            {avgScore}
                          </span>
                          <span className="text-[11px] text-[#71717A] font-normal"> /100</span>
                        </>
                      ) : (
                        <span className="text-[12px] text-[#71717A] font-normal">—</span>
                      )}
                    </td>

                    {/* Evolução Real */}
                    <td className="py-4 px-4 text-center">
                      {evolution !== null && evolution !== undefined ? (
                        <span
                          className={`inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${
                            isPositive ? 'text-[#0C0C0D]' : 'text-[#71717A]'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#0C0C0D]" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-[#71717A]" />
                          )}
                          {isPositive ? `+${evolution}%` : `${evolution}%`}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#71717A] font-normal" title="Sem período anterior">
                          —
                        </span>
                      )}
                    </td>

                    {/* Ação */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCloser(closer.id);
                        }}
                        className="px-3 py-1 rounded-pill bg-[#0C0C0D] hover:bg-[#1F1F22] text-white font-medium text-[12px] tracking-[-0.01em] transition-all shadow-xs"
                      >
                        Analisar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 px-6 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
            <Users className="w-6 h-6 text-[#71717A]" />
          </div>
          <h4 className="text-[15px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
            Nenhum closer cadastrado ainda
          </h4>
          <p className="text-[12px] text-[#71717A] max-w-sm leading-relaxed tracking-[-0.01em] mb-4">
            Cadastre os vendedores da sua equipe para acompanhar a taxa de fechamento, o score de vendas e a evolução individual.
          </p>
          <button
            onClick={onViewAllClosers}
            className="flex items-center gap-2 px-4 py-2 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] text-[12px] font-bold transition-all shadow-pill tracking-[-0.01em]"
          >
            <Plus className="w-3.5 h-3.5 text-[#CEF52A]" />
            <span>Cadastrar primeiro closer</span>
          </button>
        </div>
      )}
    </div>
  );
};
