'use client';

import React, { useState } from 'react';
import { Closer, SalesCall, CloserMetrics } from '@/types';
import { Plus, Edit2, Power, Eye, User, X, Search } from 'lucide-react';

interface ClosersModuleProps {
  closers: Closer[];
  calls: SalesCall[];
  metrics: CloserMetrics[];
  onAddCloser: (name: string) => void;
  onEditCloser: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
  onViewCloserCalls: (closerId: string) => void;
}

export const ClosersModule: React.FC<ClosersModuleProps> = ({
  closers,
  calls,
  onAddCloser,
  onEditCloser,
  onToggleStatus,
  onViewCloserCalls,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCloser, setEditingCloser] = useState<Closer | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [search, setSearch] = useState('');

  const handleOpenAdd = () => {
    setEditingCloser(null);
    setNameInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (closer: Closer) => {
    setEditingCloser(closer);
    setNameInput(closer.name);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    if (editingCloser) {
      onEditCloser(editingCloser.id, nameInput.trim());
    } else {
      onAddCloser(nameInput.trim());
    }
    setIsModalOpen(false);
    setNameInput('');
  };

  const filteredClosers = closers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in font-sans">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#0C0C0D] leading-[1.15]">
            Closers
          </h1>
          <p className="text-[14px] font-normal text-[#71717A] tracking-[-0.01em] mt-1">
            Gerencie os profissionais responsáveis pelas calls comerciais.
          </p>
        </div>

        {/* Botão Principal Preto em formato Pill */}
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] font-semibold text-[13px] tracking-[-0.01em] transition-all shadow-pill self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#CEF52A]" />
          <span>+ Novo closer</span>
        </button>
      </div>

      {/* Tabela Minimalista de Closers ou Estado Vazio */}
      {closers.length > 0 ? (
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card">
        {/* Barra de Busca rápida */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar closer por nome..."
              className="w-full bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] font-normal py-2 pl-9 pr-4 rounded-pill focus:outline-none focus:bg-white focus:border-[#0C0C0D] transition-all tracking-[-0.01em]"
            />
            <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-2.5" />
          </div>

          <span className="text-[12px] text-[#71717A] tracking-[-0.01em]">
            Total: <strong className="font-semibold text-[#0C0C0D]">{filteredClosers.length}</strong> profissionais cadastrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
                <th className="py-3 px-4">Nome do closer</th>
                <th className="py-3 px-4 text-center">Total de calls</th>
                <th className="py-3 px-4 text-center">Vendas fechadas</th>
                <th className="py-3 px-4 text-center">Taxa de conversão</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[13px]">
              {filteredClosers.map((closer) => {
                const closerCallsCount = calls.filter((c) => c.closerId === closer.id).length;
                const closedCount = calls.filter((c) => c.closerId === closer.id && c.saleClosed).length;
                const rate = closerCallsCount > 0 ? ((closedCount / closerCallsCount) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={closer.id} className="hover:bg-[#F9FAFB] transition-colors">
                    {/* Nome com avatar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB] flex-shrink-0">
                          {closer.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={closer.avatarUrl}
                              alt={closer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#71717A]">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-[13px] text-[#0C0C0D] block tracking-[-0.01em]">
                            {closer.name}
                          </span>
                          <span className="text-[11px] text-[#71717A] tracking-[-0.01em]">
                            Cadastrado em {new Date(closer.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total de Calls */}
                    <td className="py-4 px-4 text-center font-normal text-[#0C0C0D] tabular-nums">
                      {closerCallsCount} calls
                    </td>

                    {/* Vendas Fechadas */}
                    <td className="py-4 px-4 text-center font-normal text-[#0C0C0D] tabular-nums">
                      {closedCount} vendas
                    </td>

                    {/* Taxa de Conversão */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-pill text-[11px] font-bold bg-[#CEF52A] text-[#0C0C0D] tabular-nums tracking-tight">
                        {rate}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-pill text-[11px] font-semibold tracking-tight ${
                          closer.active
                            ? 'bg-[#0C0C0D] text-[#CEF52A]'
                            : 'bg-[#F3F4F6] text-[#71717A] border border-[#E5E7EB]'
                        }`}
                      >
                        {closer.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ver Calls */}
                        <button
                          onClick={() => onViewCloserCalls(closer.id)}
                          title="Consultar calls vinculadas"
                          className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#0C0C0D] hover:text-white text-[#52525B] flex items-center justify-center transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => handleOpenEdit(closer)}
                          title="Editar closer"
                          className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#0C0C0D] hover:text-white text-[#52525B] flex items-center justify-center transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Ativar/Inativar */}
                        <button
                          onClick={() => onToggleStatus(closer.id)}
                          title={closer.active ? 'Inativar closer' : 'Ativar closer'}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            closer.active
                              ? 'bg-[#F3F4F6] text-[#71717A] hover:bg-[#DC2626] hover:text-white'
                              : 'bg-[#CEF52A] text-[#0C0C0D] hover:bg-[#BEE81E]'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="bg-white rounded-[32px] p-8 border border-[#E5E7EB] shadow-card mb-8 text-center flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
            <User className="w-7 h-7 text-[#71717A]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
            Nenhum closer cadastrado
          </h3>
          <p className="text-[13px] text-[#71717A] max-w-md leading-relaxed tracking-[-0.01em] mb-5">
            Cadastre os profissionais da sua equipe comercial para vincular reuniões, analisar gravações e acompanhar as taxas individuais de fechamento.
          </p>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] font-semibold text-[13px] tracking-[-0.01em] transition-all shadow-pill"
          >
            <Plus className="w-4 h-4 text-[#CEF52A]" />
            <span>Cadastrar primeiro closer</span>
          </button>
        </div>
      )}

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white w-full max-w-md rounded-[28px] p-7 shadow-2xl border border-[#E5E7EB] relative animate-scale-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#71717A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-[20px] font-semibold text-[#0C0C0D] tracking-[-0.03em] mb-1">
              {editingCloser ? 'Editar closer' : 'Novo closer'}
            </h3>
            <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mb-6">
              Informe o nome do profissional para vinculá-lo às reuniões comerciais.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ex: Gabriel Silveira"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] text-[#0C0C0D] placeholder:text-[#999999] focus:outline-none focus:border-[#0C0C0D] focus:bg-white transition-all tracking-[-0.01em]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-pill text-[12px] font-medium text-[#52525B] hover:bg-[#F3F4F6] transition-colors tracking-[-0.01em]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-pill text-[12px] font-semibold bg-[#0C0C0D] text-white hover:bg-[#1F1F22] transition-all shadow-pill tracking-[-0.01em]"
                >
                  {editingCloser ? 'Salvar alterações' : 'Cadastrar closer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
