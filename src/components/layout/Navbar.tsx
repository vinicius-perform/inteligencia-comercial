'use client';

import React from 'react';
import { BarChart3, Users, PhoneCall, Key } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'closers' | 'calls';
  setActiveTab: (tab: 'dashboard' | 'closers' | 'calls') => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
}) => {
  return (
    <header className="w-full pt-6 pb-4 px-6 md:px-12 flex items-center justify-between">
      {/* Logotipo à esquerda — Logo oficial com o símbolo branco nítido sobre fundo lime */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs flex-shrink-0 border border-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png?v=2"
            alt="Inteligência Comercial"
            width={40}
            height={40}
            className="w-full h-full object-cover block"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[17px] tracking-[-0.035em] text-[#0C0C0D] leading-tight">
              Inteligência Comercial
            </span>
          </div>
          <span className="text-[12px] font-normal text-[#71717A] tracking-[-0.01em] leading-snug">
            Fazendo Acontecer
          </span>
        </div>
      </div>

      {/* Navegação central em formato Pill — Item ativo #0C0C0D */}
      <nav className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-pill border border-[#E5E7EB] shadow-card">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-2 rounded-pill text-[13px] font-medium tracking-[-0.01em] transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
              : 'text-[#52525B] hover:text-[#0C0C0D] hover:bg-[#F3F4F6]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('closers')}
          className={`flex items-center gap-2 px-5 py-2 rounded-pill text-[13px] font-medium tracking-[-0.01em] transition-all duration-200 ${
            activeTab === 'closers'
              ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
              : 'text-[#52525B] hover:text-[#0C0C0D] hover:bg-[#F3F4F6]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Closers</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`flex items-center gap-2 px-5 py-2 rounded-pill text-[13px] font-medium tracking-[-0.01em] transition-all duration-200 ${
            activeTab === 'calls'
              ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
              : 'text-[#52525B] hover:text-[#0C0C0D] hover:bg-[#F3F4F6]'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Calls de Vendas</span>
        </button>
      </nav>

      {/* Identificação do Usuário e Configurações */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          title="Configurações & Chave Gemini API"
          className="w-9 h-9 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#52525B] hover:text-[#0C0C0D] hover:border-[#0C0C0D] transition-all shadow-sm"
        >
          <Key className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-pill bg-white border border-[#E5E7EB] shadow-card">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 flex-shrink-0 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png?v=2"
              alt="Fazendo Acontecer"
              className="w-full h-full object-cover"
            />
            {/* Indicador de status online em #0C0C0D */}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#0C0C0D] border border-white" />
          </div>
          <div className="hidden lg:flex flex-col text-left pr-0.5">
            <span className="text-[12px] font-semibold text-[#0C0C0D] tracking-[-0.01em] leading-tight">
              Fazendo Acontecer
            </span>
            <span className="text-[10px] text-[#71717A] tracking-[-0.01em] leading-none">
              Inteligência Comercial
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
