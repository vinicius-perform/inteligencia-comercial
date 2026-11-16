'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateRange {
  start: Date;
  end: Date;
  label?: string;
}

interface DateRangePickerProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

type QuickFilter = 'hoje' | 'ontem' | '7dias' | 'esteMes' | '30dias' | 'custom';

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ range, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mês exibido no calendário (inicia com o mês da data inicial do range)
  const [viewDate, setViewDate] = useState<Date>(() => new Date(range.start));
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('esteMes');

  // Estado transitório ao clicar para selecionar intervalo (primeiro clique = start, segundo = end)
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectionStart(null);
        setHoverDate(null);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Formatação DD/MM/YY
  const formatDateShort = (d: Date): string => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const displayText = useMemo(() => {
    return `${formatDateShort(range.start)} - ${formatDateShort(range.end)}`;
  }, [range.start, range.end]);

  // Ações de filtros rápidos
  const applyQuickFilter = (filter: QuickFilter) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let start = new Date(today);
    let end = new Date(today);

    if (filter === 'hoje') {
      start.setHours(0, 0, 0, 0);
    } else if (filter === 'ontem') {
      start.setDate(today.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(today.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    } else if (filter === '7dias') {
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (filter === 'esteMes') {
      start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
    } else if (filter === '30dias') {
      start.setDate(today.getDate() - 29);
      start.setHours(0, 0, 0, 0);
    }

    setActiveFilter(filter);
    setViewDate(new Date(start));
    setSelectionStart(null);
    setHoverDate(null);
    onChange({ start, end, label: filter });
  };

  // Navegação de mês
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Nome do mês em português (ex: "novembro 2026")
  const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Geração dos dias do calendário
  const daysInGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = dom, 1 = seg...
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Dias do mês anterior
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Dias do próximo mês para completar semanas (múltiplo de 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }
    }

    return days;
  }, [viewDate]);

  // Normalização de datas (apenas YYYY-MM-DD para comparação)
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isBetween = (d: Date, start: Date, end: Date) => {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return t >= Math.min(s, e) && t <= Math.max(s, e);
  };

  // Clique em um dia
  const handleDayClick = (clickedDate: Date) => {
    if (!selectionStart) {
      // Primeiro clique: define o início
      setSelectionStart(clickedDate);
      setActiveFilter('custom');
    } else {
      // Segundo clique: define o final
      let start = new Date(selectionStart);
      start.setHours(0, 0, 0, 0);
      let end = new Date(clickedDate);
      end.setHours(23, 59, 59, 999);

      if (start.getTime() > end.getTime()) {
        const tmp = start;
        start = new Date(end);
        start.setHours(0, 0, 0, 0);
        end = new Date(tmp);
        end.setHours(23, 59, 59, 999);
      }

      setSelectionStart(null);
      setHoverDate(null);
      setActiveFilter('custom');
      onChange({ start, end, label: 'custom' });
    }
  };

  const effectiveStart = selectionStart || range.start;
  const effectiveEnd = selectionStart ? (hoverDate || selectionStart) : range.end;

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Botão Pill com Ícone de Calendário e Borda Verde-Lima */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-white border-2 border-[#CEF52A] hover:border-[#b5e016] text-[13px] font-semibold text-[#0C0C0D] shadow-xs cursor-pointer transition-all tracking-tight active:scale-[0.99]"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-[#0C0C0D]" />
        <span>{displayText}</span>
      </button>

      {/* Popover do Calendário no Estilo Exato da Imagem */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto z-50 w-[310px] bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-4 animate-fade-in font-sans">
          {/* 1. Chips de Filtros Rápidos (Hoje, Ontem, Últimos 7 dias, Este mês) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#F3F4F6] text-[12px] no-scrollbar">
            <button
              type="button"
              onClick={() => applyQuickFilter('hoje')}
              className={`px-2.5 py-1 rounded-pill whitespace-nowrap transition-all ${
                activeFilter === 'hoje'
                  ? 'bg-[#CEF52A]/30 text-[#0C0C0D] font-bold border border-[#CEF52A]'
                  : 'text-[#52525B] hover:bg-[#F3F4F6]'
              }`}
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => applyQuickFilter('ontem')}
              className={`px-2.5 py-1 rounded-pill whitespace-nowrap transition-all ${
                activeFilter === 'ontem'
                  ? 'bg-[#CEF52A]/30 text-[#0C0C0D] font-bold border border-[#CEF52A]'
                  : 'text-[#52525B] hover:bg-[#F3F4F6]'
              }`}
            >
              Ontem
            </button>
            <button
              type="button"
              onClick={() => applyQuickFilter('7dias')}
              className={`px-2.5 py-1 rounded-pill whitespace-nowrap transition-all ${
                activeFilter === '7dias'
                  ? 'bg-[#CEF52A]/30 text-[#0C0C0D] font-bold border border-[#CEF52A]'
                  : 'text-[#52525B] hover:bg-[#F3F4F6]'
              }`}
            >
              Últimos 7 dias
            </button>
            <button
              type="button"
              onClick={() => applyQuickFilter('esteMes')}
              className={`px-2.5 py-1 rounded-pill whitespace-nowrap transition-all ${
                activeFilter === 'esteMes'
                  ? 'bg-[#CEF52A]/30 text-[#0C0C0D] font-bold border border-[#CEF52A]'
                  : 'text-[#52525B] hover:bg-[#F3F4F6]'
              }`}
            >
              Este mês
            </button>
          </div>

          {/* 2. Cabeçalho de Navegação de Mês */}
          <div className="flex items-center justify-between mt-3 mb-2 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#71717A] hover:text-[#0C0C0D] hover:bg-[#F3F4F6] transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-[14px] font-semibold text-[#0C0C0D] capitalize tracking-tight">
              {monthName}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#71717A] hover:text-[#0C0C0D] hover:bg-[#F3F4F6] transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3. Cabeçalho dos Dias da Semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-medium text-[#71717A]">
            <span>dom</span>
            <span>seg</span>
            <span>ter</span>
            <span>qua</span>
            <span>qui</span>
            <span>sex</span>
            <span>sab</span>
          </div>

          {/* 4. Grade dos Dias */}
          <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center text-[12px]">
            {daysInGrid.map(({ date, isCurrentMonth }, idx) => {
              const isStart = isSameDay(date, effectiveStart);
              const isEnd = isSameDay(date, effectiveEnd);
              const inRange = isBetween(date, effectiveStart, effectiveEnd);

              // Dia do início (ex: Dia 1 na imagem de referência)
              if (isStart) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDayClick(date)}
                    onMouseEnter={() => selectionStart && setHoverDate(date)}
                    className="w-8 h-8 mx-auto flex items-center justify-center font-bold text-[#0C0C0D] bg-[#CEF52A] rounded-xl border-2 border-[#84CC16] shadow-xs cursor-pointer transition-transform active:scale-95"
                  >
                    {date.getDate()}
                  </button>
                );
              }

              // Dia do final ou dias intermediários
              if (inRange) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDayClick(date)}
                    onMouseEnter={() => selectionStart && setHoverDate(date)}
                    className={`w-8 h-8 mx-auto flex items-center justify-center text-[#0C0C0D] cursor-pointer transition-all ${
                      isEnd
                        ? 'bg-[#CEF52A]/60 font-bold rounded-xl border border-[#84CC16]/60'
                        : 'bg-[#CEF52A]/25 font-medium rounded-lg'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              }

              // Dias normais do mês atual
              if (isCurrentMonth) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDayClick(date)}
                    onMouseEnter={() => selectionStart && setHoverDate(date)}
                    className="w-8 h-8 mx-auto flex items-center justify-center text-[#0C0C0D] font-normal rounded-xl hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                  >
                    {date.getDate()}
                  </button>
                );
              }

              // Dias fora do mês atual
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  className="w-8 h-8 mx-auto flex items-center justify-center text-[#D4D4D8] font-normal rounded-xl hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
