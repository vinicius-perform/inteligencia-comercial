'use client';

import React, { useState, useRef } from 'react';
import { SalesCall, Closer } from '@/types';
import {
  Plus,
  Upload,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Zap,
} from 'lucide-react';
import { CallAnalysisModal } from './CallAnalysisModal';

interface CallsModuleProps {
  calls: SalesCall[];
  closers: Closer[];
  onAddAndAnalyzeCall: (callData: {
    closerId: string;
    occurredAt: string;
    transcript: string;
    saleClosed: boolean;
    prospectName?: string;
    dealValue?: number;
    durationMinutes?: number;
  }) => Promise<SalesCall>;
  onReanalyzeCall: (callId: string) => Promise<void>;
  preselectedCloserId?: string;
}

export const CallsModule: React.FC<CallsModuleProps> = ({
  calls,
  closers,
  onAddAndAnalyzeCall,
  onReanalyzeCall,
  preselectedCloserId,
}) => {
  const [activeView, setActiveView] = useState<'history' | 'new'>('history');

  const [closerId, setCloserId] = useState<string>(
    preselectedCloserId || closers[0]?.id || ''
  );
  const [occurredAt, setOccurredAt] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [prospectName, setProspectName] = useState<string>('');
  const [dealValue, setDealValue] = useState<number>(20000);
  const [saleClosed, setSaleClosed] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  const [filterCloser, setFilterCloser] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<'all' | 'won' | 'lost'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [selectedCallForModal, setSelectedCallForModal] = useState<SalesCall | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setTranscript(text);
          if (!prospectName) {
            setProspectName(file.name.replace('.txt', ''));
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleInsertSample = () => {
    setCloserId(closers[0]?.id || '');
    setProspectName('Roberto Mendonça (FinanTech)');
    setDealValue(35000);
    setSaleClosed(true);
    setTranscript(`[00:01] Lucas Andrade: Olá Roberto, muito boa tarde! Como está em São Paulo hoje?
[00:15] Roberto Mendonça: Olá Lucas, tudo certo por aqui! Semana agitada com planejamento do próximo trimestre.
[00:30] Lucas Andrade: Excelente. Combinei 40 minutos hoje com você. Minha intenção é entender onde estão os principais vazamentos no funil comercial da FinanTech e, se houver alinhamento claro, demonstrar como nossa plataforma de inteligência de calls resolve isso. Podemos seguir com essa agenda?
[01:05] Roberto Mendonça: Perfeito, objetivo e prático.
[01:15] Lucas Andrade: Roberto, hoje vocês contam com 18 closers. Qual é a principal dor que você e a diretoria sentem ao final do mês?
[01:30] Roberto Mendonça: Nossa taxa de conversão caiu de 22% para 11%. Os vendedores dizem que os clientes estão sem verba, mas desconfio que o time não está tratando as objeções e aceita o 'vou pensar' muito facilmente.
[02:10] Lucas Andrade: E quanto custa essa queda de 11 pontos percentuais em receita perdida por mês para a FinanTech?
[02:35] Roberto Mendonça: Deixamos na mesa cerca de R$ 120.000 mensais de novos contratos recorrentes.
[03:10] Lucas Andrade: É mais de R$ 1,4 milhão ao ano. A Sales Intelligence analisa as transcrições das chamadas automaticamente, identifica se o closer isolou a objeção de preço e aponta os padrões dos melhores para a equipe replicar.
[04:20] Roberto Mendonça: Fantástico. E qual o investimento?
[04:35] Lucas Andrade: Para seus 18 closers, o plano Enterprise fica em R$ 2.800/mês. Se a plataforma recuperar apenas 1 cliente a cada dois meses dos que estão escapando, ela já se paga mais de 10 vezes. Como vê esse retorno?
[05:15] Roberto Mendonça: O retorno é evidente. Conseguimos rodar o treinamento na terça que vem?
[05:30] Lucas Andrade: Com certeza! Envio o contrato digital para sua assinatura agora e bloqueio a agenda do time de sucesso do cliente para terça às 14h.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) {
      alert('Por favor, informe a transcrição da call comercial.');
      return;
    }

    setIsSubmitting(true);
    setAnalysisStep('1/3: Processando transcrição e falas...');

    try {
      setTimeout(() => setAnalysisStep('2/3: Avaliando as 7 competências comerciais com IA...'), 800);
      setTimeout(() => setAnalysisStep('3/3: Extraindo citações literais e plano de ação...'), 1600);

      const createdCall = await onAddAndAnalyzeCall({
        closerId: closerId || closers[0]?.id || '',
        occurredAt: occurredAt ? new Date(occurredAt).toISOString() : new Date().toISOString(),
        transcript: transcript.trim(),
        saleClosed,
        prospectName: prospectName.trim() || 'Lead Comercial',
        dealValue: Number(dealValue) || 15000,
      });

      setTranscript('');
      setProspectName('');
      setActiveView('history');
      setSelectedCallForModal(createdCall);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao processar a call. Tente novamente.');
    } finally {
      setIsSubmitting(false);
      setAnalysisStep('');
    }
  };

  const filteredCalls = calls.filter((c) => {
    const matchCloser = filterCloser === 'all' || c.closerId === filterCloser;
    const matchResult =
      filterResult === 'all'
        ? true
        : filterResult === 'won'
        ? c.saleClosed
        : !c.saleClosed;
    const matchSearch =
      !searchTerm ||
      (c.prospectName && c.prospectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.transcript.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCloser && matchResult && matchSearch;
  });

  return (
    <div className="animate-fade-in font-sans">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#0C0C0D] leading-[1.15]">
            Calls de Vendas
          </h1>
          <p className="text-[14px] font-normal text-[#71717A] tracking-[-0.01em] mt-1">
            Cadastro, transcrição e diagnóstico detalhado por Inteligência Artificial.
          </p>
        </div>

        {/* Alternância entre Histórico e Cadastro em Pill */}
        <div className="flex items-center bg-white p-1 rounded-pill border border-[#E5E7EB] shadow-card self-start sm:self-auto">
          <button
            onClick={() => setActiveView('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-pill text-[13px] font-medium tracking-[-0.01em] transition-all ${
              activeView === 'history'
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#52525B] hover:text-[#0C0C0D]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Histórico de calls ({calls.length})</span>
          </button>
          <button
            onClick={() => setActiveView('new')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-pill text-[13px] font-medium tracking-[-0.01em] transition-all ${
              activeView === 'new'
                ? 'bg-[#0C0C0D] text-white shadow-pill font-semibold'
                : 'text-[#52525B] hover:text-[#0C0C0D]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#CEF52A]" />
            <span>+ Nova call</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CADASTRO DE CALL */}
      {activeView === 'new' && (
        <div className="bg-white rounded-[32px] p-6 md:p-10 border border-[#E5E7EB] shadow-card max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F3F4F6]">
            <div>
              <h2 className="text-[22px] font-semibold text-[#0C0C0D] tracking-[-0.035em]">
                Cadastrar e analisar nova reunião
              </h2>
              <p className="text-[13px] text-[#71717A] tracking-[-0.01em] mt-0.5">
                Cole a transcrição ou faça upload de um arquivo .txt para processamento com a IA.
              </p>
            </div>

            <button
              type="button"
              onClick={handleInsertSample}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-[#CEF52A] hover:bg-[#BEE81E] text-[#0C0C0D] text-[12px] font-bold tracking-tight transition-all shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Inserir exemplo</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* CAMPO 1: Closer Responsável */}
              <div>
                <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                  1. Closer responsável *
                </label>
                <select
                  required
                  value={closerId}
                  onChange={(e) => setCloserId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] font-medium text-[#0C0C0D] focus:outline-none focus:border-[#0C0C0D] focus:bg-white transition-all cursor-pointer tracking-[-0.01em]"
                >
                  {closers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.active ? '' : '(Inativo)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* CAMPO 2: Data da Call */}
              <div>
                <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                  2. Data e horário da reunião *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={occurredAt}
                  onChange={(e) => setOccurredAt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] font-medium text-[#0C0C0D] focus:outline-none focus:border-[#0C0C0D] focus:bg-white transition-all tracking-[-0.01em]"
                />
              </div>

              {/* Empresa / Prospect */}
              <div>
                <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                  Prospect / Empresa
                </label>
                <input
                  type="text"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  placeholder="Ex: Carlos Silva (Empresa XYZ)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] font-medium text-[#0C0C0D] placeholder:text-[#999999] focus:outline-none focus:border-[#0C0C0D] focus:bg-white transition-all tracking-[-0.01em]"
                />
              </div>

              {/* CAMPO 4: Resultado Comercial (Toggle Selecionável) */}
              <div>
                <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                  4. Desfecho comercial *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSaleClosed(true)}
                    className={`py-2.5 px-4 rounded-2xl border text-[12px] font-bold flex items-center justify-center gap-2 transition-all tracking-[-0.01em] ${
                      saleClosed
                        ? 'bg-[#CEF52A] border-[#BEE81E] text-[#0C0C0D] shadow-xs'
                        : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#71717A] hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Venda fechada</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaleClosed(false)}
                    className={`py-2.5 px-4 rounded-2xl border text-[12px] font-medium flex items-center justify-center gap-2 transition-all tracking-[-0.01em] ${
                      !saleClosed
                        ? 'bg-[#0C0C0D] border-[#0C0C0D] text-white shadow-xs'
                        : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#71717A] hover:bg-gray-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Venda não fechada</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CAMPO 3: Transcrição Completa da Call */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider">
                  3. Transcrição completa da call *
                </label>

                {/* Upload de arquivo .txt */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[11px] font-medium text-[#0C0C0D] border border-[#E5E7EB] transition-all tracking-[-0.01em]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload arquivo .txt</span>
                  </button>
                </div>
              </div>

              <textarea
                required
                rows={11}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Cole aqui o diálogo transcrito completo da reunião (Zoom, Google Meet, Fireflies, Grain, etc.). Exemplo:
[00:01] Closer: Olá Fulano, tudo bem?
[00:15] Prospect: Tudo ótimo, como vocês podem nos ajudar?..."
                className="w-full p-4 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] text-[#0C0C0D] placeholder:text-[#999999] focus:outline-none focus:border-[#0C0C0D] focus:bg-white transition-all font-mono leading-relaxed resize-y"
              />
              <span className="text-[11px] text-[#71717A] block mt-1 tracking-[-0.01em]">
                {transcript.length > 0
                  ? `${transcript.split('\n').length} linhas | ${transcript.length} caracteres`
                  : 'Suporta transcrições longas sem limite de tamanho.'}
              </span>
            </div>

            {/* Feedback de análise */}
            {isSubmitting && (
              <div className="p-4 rounded-2xl bg-[#0C0C0D] text-white border border-[#27272A] flex items-center gap-3 animate-pulse">
                <Sparkles className="w-4 h-4 text-[#CEF52A] animate-spin" />
                <span className="text-[12px] font-medium tracking-tight text-[#CEF52A]">{analysisStep}</span>
              </div>
            )}

            {/* Botão Principal de Submissão */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => setActiveView('history')}
                className="px-5 py-2.5 rounded-pill text-[12px] font-medium text-[#71717A] hover:bg-[#F3F4F6] transition-colors tracking-[-0.01em]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-pill bg-[#0C0C0D] hover:bg-[#1F1F22] text-white font-semibold text-[13px] tracking-[-0.01em] transition-all shadow-pill disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CEF52A]" />
                <span>{isSubmitting ? 'Processando com IA...' : 'Salvar e analisar com IA'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: HISTÓRICO DE CALLS */}
      {activeView === 'history' && (
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#E5E7EB] shadow-card mb-8">
          {calls.length === 0 ? (
            <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#71717A] mb-3 shadow-xs">
                <PhoneCall className="w-7 h-7 text-[#71717A]" />
              </div>
              <h3 className="text-[18px] font-semibold text-[#0C0C0D] tracking-[-0.02em] mb-1">
                Nenhuma call registrada ainda
              </h3>
              <p className="text-[13px] text-[#71717A] max-w-md leading-relaxed tracking-[-0.01em] mb-5">
                Cadastre suas reuniões comerciais com transcrição ou faça upload de arquivo .txt para habilitar a avaliação das 7 competências de vendas com IA.
              </p>
              <button
                onClick={() => setActiveView('new')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] font-semibold text-[13px] tracking-[-0.01em] transition-all shadow-pill"
              >
                <Plus className="w-4 h-4 text-[#CEF52A]" />
                <span>+ Cadastrar primeira call</span>
              </button>
            </div>
          ) : (
            <>
              {/* Barra de Filtros do Histórico */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#F3F4F6]">
            {/* Campo de Busca */}
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por prospect ou fala..."
                className="w-full bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] font-normal py-2 pl-9 pr-4 rounded-pill focus:outline-none focus:bg-white focus:border-[#0C0C0D] transition-all tracking-[-0.01em]"
              />
              <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-2.5" />
            </div>

            {/* Filtros em Pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filtro Closer */}
              <select
                value={filterCloser}
                onChange={(e) => setFilterCloser(e.target.value)}
                className="bg-[#F3F4F6] border border-[#E5E7EB] text-[12px] font-medium py-1.5 px-3.5 rounded-pill cursor-pointer focus:outline-none tracking-[-0.01em]"
              >
                <option value="all">Todos os closers</option>
                {closers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Filtro Resultado */}
              <div className="flex items-center bg-[#F3F4F6] p-1 rounded-pill border border-[#E5E7EB]">
                <button
                  onClick={() => setFilterResult('all')}
                  className={`px-3 py-1 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
                    filterResult === 'all'
                      ? 'bg-[#0C0C0D] text-white font-semibold shadow-xs'
                      : 'text-[#71717A]'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterResult('won')}
                  className={`px-3 py-1 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
                    filterResult === 'won'
                      ? 'bg-[#CEF52A] text-[#0C0C0D] font-bold shadow-xs'
                      : 'text-[#71717A]'
                  }`}
                >
                  Ganhos
                </button>
                <button
                  onClick={() => setFilterResult('lost')}
                  className={`px-3 py-1 rounded-pill text-[12px] font-medium tracking-[-0.01em] transition-all ${
                    filterResult === 'lost'
                      ? 'bg-white text-[#0C0C0D] font-semibold shadow-xs'
                      : 'text-[#71717A]'
                  }`}
                >
                  Perdidos
                </button>
              </div>
            </div>
          </div>

          {/* Tabela de Histórico */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Closer</th>
                  <th className="py-3 px-4">Prospect / Empresa</th>
                  <th className="py-3 px-4 text-center">Desfecho comercial</th>
                  <th className="py-3 px-4 text-center">Score IA</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Diagnóstico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6] text-[13px]">
                {filteredCalls.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#71717A]">
                      Nenhuma reunião encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredCalls.map((call) => {
                    const closer = closers.find((c) => c.id === call.closerId);
                    const score = call.analysis?.overallScore;

                    return (
                      <tr
                        key={call.id}
                        onClick={() => setSelectedCallForModal(call)}
                        className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                      >
                        {/* Data */}
                        <td className="py-4 px-4 font-normal text-[#0C0C0D] tabular-nums">
                          {new Date(call.occurredAt).toLocaleDateString('pt-BR')}
                          <span className="text-[11px] text-[#71717A] block">
                            {new Date(call.occurredAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        {/* Closer */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#0C0C0D] block group-hover:text-black transition-colors tracking-[-0.01em]">
                            {closer?.name || 'Closer desconhecido'}
                          </span>
                        </td>

                        {/* Prospect */}
                        <td className="py-4 px-4 text-[#52525B] tracking-[-0.01em]">
                          {call.prospectName || 'Lead qualificado'}
                        </td>

                        {/* Desfecho */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-pill text-[11px] tracking-tight ${
                              call.saleClosed
                                ? 'bg-[#CEF52A] text-[#0C0C0D] font-bold'
                                : 'bg-[#F3F4F6] text-[#71717A] border border-[#E5E7EB] font-medium'
                            }`}
                          >
                            {call.saleClosed ? 'Venda fechada' : 'Venda não fechada'}
                          </span>
                        </td>

                        {/* Score */}
                        <td className="py-4 px-4 text-center">
                          {score !== undefined ? (
                            <span className="font-bold text-[13px] text-[#0C0C0D] tabular-nums">
                              {score}
                              <span className="text-[11px] text-[#71717A] font-normal"> /100</span>
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-pill text-[10px] font-semibold bg-[#F3F4F6] text-[#0C0C0D] border border-[#E5E7EB] tracking-tight">
                            {call.analysisStatus === 'completed'
                              ? 'Concluída'
                              : call.analysisStatus === 'analyzing'
                              ? 'Em análise'
                              : 'Pendente'}
                          </span>
                        </td>

                        {/* Ação */}
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCallForModal(call);
                            }}
                            className="px-3 py-1 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] font-medium text-[12px] tracking-[-0.01em] transition-all shadow-pill inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver diagnóstico</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )}

      {/* Modal de Detalhes da Análise */}
      <CallAnalysisModal
        isOpen={Boolean(selectedCallForModal)}
        call={selectedCallForModal}
        closer={closers.find((c) => c.id === selectedCallForModal?.closerId)}
        onClose={() => setSelectedCallForModal(null)}
        onReanalyze={async (callId) => {
          await onReanalyzeCall(callId);
          const updated = calls.find((c) => c.id === callId);
          if (updated) setSelectedCallForModal(updated);
        }}
      />
    </div>
  );
};
