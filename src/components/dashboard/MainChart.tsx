'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { SalesCall } from '@/types';
import { BarChart3, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ChartPoint {
  label: string;
  calls: number;
  sales: number;
}

interface MainChartProps {
  calls?: SalesCall[];
  periodDays?: number;
  callsEvolution?: number | null;
  onGoToCalls?: () => void;
}

export const MainChart: React.FC<MainChartProps> = ({
  calls = [],
  periodDays = 30,
  callsEvolution = null,
  onGoToCalls,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Agrupamento dinâmico e 100% real baseado exclusivamente nas chamadas registradas
  const chartData = useMemo<ChartPoint[]>(() => {
    if (!calls || calls.length === 0) return [];

    if (viewMode === 'daily') {
      const dayMap: Record<string, { label: string; calls: number; sales: number; date: Date }> = {};
      const sortedCalls = [...calls].sort(
        (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
      );

      sortedCalls.forEach((c) => {
        const d = new Date(c.occurredAt);
        if (isNaN(d.getTime())) return;
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
        if (!dayMap[key]) {
          dayMap[key] = { label, calls: 0, sales: 0, date: d };
        }
        dayMap[key].calls++;
        if (c.saleClosed) dayMap[key].sales++;
      });

      return Object.values(dayMap)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(({ label, calls, sales }) => ({ label, calls, sales }));
    }

    if (viewMode === 'monthly') {
      const monthMap: Record<string, { label: string; calls: number; sales: number; yearMonth: string }> = {};
      calls.forEach((c) => {
        const d = new Date(c.occurredAt);
        if (isNaN(d.getTime())) return;
        const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
        if (!monthMap[yearMonth]) {
          monthMap[yearMonth] = { label, calls: 0, sales: 0, yearMonth };
        }
        monthMap[yearMonth].calls++;
        if (c.saleClosed) monthMap[yearMonth].sales++;
      });

      return Object.values(monthMap)
        .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))
        .map(({ label, calls, sales }) => ({ label, calls, sales }));
    }

    // Weekly (padrão)
    const weekMap: Record<string, { label: string; calls: number; sales: number; sortKey: number }> = {};
    calls.forEach((c) => {
      const d = new Date(c.occurredAt);
      if (isNaN(d.getTime())) return;
      const oneJan = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
      const key = `${d.getFullYear()}-W${weekNum}`;
      const label = `Sem ${weekNum}`;
      if (!weekMap[key]) {
        weekMap[key] = { label, calls: 0, sales: 0, sortKey: d.getFullYear() * 100 + weekNum };
      }
      weekMap[key].calls++;
      if (c.saleClosed) weekMap[key].sales++;
    });

    return Object.values(weekMap)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ label, calls, sales }) => ({ label, calls, sales }));
  }, [calls, viewMode]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0C0C0D] text-white p-3.5 rounded-2xl shadow-2xl text-[12px] border border-[#27272A] animate-fade-in font-sans">
          <p className="font-semibold text-gray-400 mb-2 tracking-[-0.01em]">{label}</p>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
            <span className="text-gray-300 font-normal">Calls totais:</span>
            <span className="font-semibold text-white ml-auto tabular-nums">{payload[0]?.value}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CEF52A]" />
            <span className="text-gray-300 font-normal">Vendas fechadas:</span>
            <span className="font-bold text-[#CEF52A] ml-auto tabular-nums">{payload[1]?.value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasData = chartData.length > 0;

  return (
    <div className="bg-white rounded-[28px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8">
      {/* Cabeçalho do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[13px] font-medium text-[#71717A] tracking-[-0.01em] block mb-1">
              Volume comercial
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-[32px] font-semibold tracking-[-0.045em] text-[#0C0C0D] leading-[1.1] tabular-nums">
                {calls.length}
              </span>
              {callsEvolution !== null && callsEvolution !== undefined ? (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2.5 py-0.5 rounded-pill tracking-tight ${
                    callsEvolution >= 0
                      ? 'bg-[#CEF52A] text-[#0C0C0D]'
                      : 'bg-[#F3F4F6] text-[#71717A] border border-[#E5E7EB]'
                  }`}
                >
                  {callsEvolution >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {callsEvolution >= 0 ? `+${callsEvolution}%` : `${callsEvolution}%`}
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-pill bg-[#F3F4F6] text-[#71717A] tracking-tight">
                  Período base
                </span>
              )}
            </div>
          </div>

          {/* Legenda compacta com as cores oficiais */}
          {hasData && (
            <div className="hidden md:flex items-center gap-4 text-[12px] font-medium text-[#52525B] tracking-[-0.01em] border-l border-[#E5E7EB] pl-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0C0C0D]" />
                <span>Volume de calls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CEF52A]" />
                <span className="text-[#0C0C0D] font-semibold">Vendas fechadas</span>
              </div>
            </div>
          )}
        </div>

        {/* Seletor Diário / Semanal / Mensal em Pill */}
        <div className="flex items-center bg-[#F3F4F6] p-1 rounded-pill border border-[#E5E7EB] self-start sm:self-auto">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
              viewMode === 'daily'
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#71717A] hover:text-[#0C0C0D]'
            }`}
          >
            Diário
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
              viewMode === 'weekly'
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#71717A] hover:text-[#0C0C0D]'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
              viewMode === 'monthly'
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#71717A] hover:text-[#0C0C0D]'
            }`}
          >
            Mensal
          </button>
        </div>
      </div>

      {/* Gráfico ou Estado Vazio */}
      {hasData ? (
        <div className="w-full h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEEF2" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#71717A',
                  fontSize: 11,
                  fontFamily: 'var(--font-inter), "Inter", -apple-system, sans-serif',
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#71717A',
                  fontSize: 11,
                  fontFamily: 'var(--font-inter), "Inter", -apple-system, sans-serif',
                }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(12,12,13,0.03)' }} />
              <Bar
                dataKey="calls"
                fill="#0C0C0D"
                radius={[10, 10, 10, 10]}
                maxBarSize={32}
              />
              <Bar
                dataKey="sales"
                fill="#CEF52A"
                radius={[10, 10, 10, 10]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full h-64 md:h-72 rounded-2xl bg-[#F9FAFB] border border-dashed border-[#E5E7EB] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
            <BarChart3 className="w-6 h-6 text-[#71717A]" />
          </div>
          <h4 className="text-[15px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
            Nenhum volume comercial no período
          </h4>
          <p className="text-[12px] text-[#71717A] max-w-md leading-relaxed tracking-[-0.01em] mb-4">
            Cadastre reuniões com transcrição na aba &ldquo;Calls de Vendas&rdquo; para visualizar o comparativo temporal de volume e conversão.
          </p>
          {onGoToCalls && (
            <button
              onClick={onGoToCalls}
              className="flex items-center gap-2 px-4 py-2 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] text-[12px] font-bold transition-all shadow-pill tracking-[-0.01em]"
            >
              <Plus className="w-3.5 h-3.5 text-[#CEF52A]" />
              <span>Cadastrar primeira call</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
