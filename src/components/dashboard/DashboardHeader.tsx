'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Closer } from '@/types';

interface DashboardHeaderProps {
  selectedPeriod: number;
  setSelectedPeriod: (days: number) => void;
  selectedCloserId: string;
  setSelectedCloserId: (id: string) => void;
  closers: Closer[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedPeriod,
  setSelectedPeriod,
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
        {/* Filtro de Closer */}
        <div className="relative">
          <select
            value={selectedCloserId}
            onChange={(e) => setSelectedCloserId(e.target.value)}
            className="appearance-none bg-white border border-[#E5E7EB] hover:border-[#0C0C0D] text-[13px] font-medium text-[#0C0C0D] py-2 pl-3.5 pr-8 rounded-pill cursor-pointer focus:outline-none transition-all shadow-card tracking-[-0.01em]"
          >
            <option value="all">Todos os closers</option>
            {closers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.active ? '' : '(Inativo)'}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filtro Temporal em formato Pill */}
        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-pill p-1 shadow-card">
          <button
            onClick={() => setSelectedPeriod(7)}
            className={`px-3 py-1.5 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
              selectedPeriod === 7
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#52525B] hover:text-[#0C0C0D]'
            }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setSelectedPeriod(30)}
            className={`px-3 py-1.5 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
              selectedPeriod === 30
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#52525B] hover:text-[#0C0C0D]'
            }`}
          >
            30 dias
          </button>
          <button
            onClick={() => setSelectedPeriod(90)}
            className={`px-3 py-1.5 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
              selectedPeriod === 90
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#52525B] hover:text-[#0C0C0D]'
            }`}
          >
            90 dias
          </button>
        </div>
      </div>
    </div>
  );
};
