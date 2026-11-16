'use client';

import React from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { Closer } from '@/types';
import { DateRangePicker, DateRange } from './DateRangePicker';

interface DashboardHeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  selectedCloserId: string;
  setSelectedCloserId: (id: string) => void;
  closers: Closer[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dateRange,
  setDateRange,
  selectedCloserId,
  setSelectedCloserId,
  closers,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#0C0C0D] leading-[1.15]">
          Visão Geral
        </h1>
        <p className="text-[14px] font-normal text-[#71717A] tracking-[-0.01em] leading-[1.5] mt-1">
          Inteligência comercial baseada em dados reais das suas calls.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Calendário no estilo exato da imagem de referência */}
        <DateRangePicker range={dateRange} onChange={setDateRange} />

        {/* Filtro de Closer com ícone de usuários */}
        <div className="relative">
          <Users className="w-3.5 h-3.5 text-[#0C0C0D] absolute left-3.5 top-3 pointer-events-none" />
          <select
            value={selectedCloserId}
            onChange={(e) => setSelectedCloserId(e.target.value)}
            className="appearance-none bg-white border border-[#E5E7EB] hover:border-[#0C0C0D] text-[13px] font-medium text-[#0C0C0D] py-2 pl-9 pr-8 rounded-pill cursor-pointer focus:outline-none transition-all shadow-xs tracking-[-0.01em]"
          >
            <option value="all">Todos os closers</option>
            {closers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.active ? '' : '(Inativo)'}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
