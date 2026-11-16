'use client';

import React, { useState } from 'react';
import { SalesCall, Closer, COMPETENCY_CONFIGS, CompetencyKey } from '@/types';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Quote,
  Lightbulb,
} from 'lucide-react';

interface CallAnalysisModalProps {
  call: SalesCall | null;
  closer?: Closer;
  isOpen: boolean;
  onClose: () => void;
  onReanalyze: (callId: string) => Promise<void>;
}

export const CallAnalysisModal: React.FC<CallAnalysisModalProps> = ({
  call,
  closer,
  isOpen,
  onClose,
  onReanalyze,
}) => {
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [expandedCompetency, setExpandedCompetency] = useState<string | null>(null);

  if (!isOpen || !call) return null;

  const analysis = call.analysis;
  const competencyKeys = Object.keys(COMPETENCY_CONFIGS) as CompetencyKey[];

  const handleCopy = () => {
    navigator.clipboard.writeText(call.transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const handleTriggerReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      await onReanalyze(call.id);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const score = analysis?.overallScore || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[32px] shadow-2xl border border-[#E5E7EB] relative overflow-hidden flex flex-col my-auto animate-scale-in">
        {/* Cabeçalho Fixo do Modal */}
        <div className="px-6 md:px-8 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0C0C0D] text-[#CEF52A] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[19px] font-semibold text-[#0C0C0D] tracking-[-0.035em]">
                  Diagnóstico 360° da call comercial
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D] tabular-nums tracking-tight">
                  Score: {score} / 100
                </span>
              </div>
              <p className="text-[12px] text-[#71717A] mt-0.5 tracking-[-0.01em]">
                Closer: <strong className="font-semibold text-[#0C0C0D]">{closer?.name || 'Closer'}</strong> • Realizada em{' '}
                {new Date(call.occurredAt).toLocaleDateString('pt-BR')} às{' '}
                {new Date(call.occurredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} •{' '}
                <span className={call.saleClosed ? 'text-[#0C0C0D] font-bold' : 'text-[#71717A] font-medium'}>
                  {call.saleClosed ? 'Venda fechada' : 'Venda não fechada'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerReanalyze}
              disabled={isReanalyzing}
              title="Reanalisar call com IA"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#F3F4F6] hover:bg-[#0C0C0D] hover:text-white text-[12px] font-medium text-[#0C0C0D] transition-all tracking-[-0.01em]"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isReanalyzing ? 'Reanalisando...' : 'Reanalisar'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#71717A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conteúdo Rolável */}
        <div className="px-6 md:px-8 py-6 overflow-y-auto space-y-6">
          {/* 1. Resumo Executivo */}
          <div className="p-5 rounded-[24px] bg-[#F3F4F6] border border-[#E5E7EB]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] block mb-1.5">
              Resumo executivo da reunião
            </span>
            <p className="text-[13px] text-[#0C0C0D] leading-relaxed font-normal tracking-[-0.01em]">
              {analysis?.summary || 'Análise da call em processamento...'}
            </p>
            <div className="flex items-center gap-3 mt-3 text-[11px] text-[#71717A] tracking-[-0.01em]">
              <span>Motor: <strong>{analysis?.modelName || 'gemini-2.5-flash'}</strong></span>
              <span>•</span>
              <span>Versão do avaliador: <strong>{analysis?.analysisVersion || 'v1.0'}</strong></span>
            </div>
          </div>

          {/* 2. Checklist dos 8 Comportamentos Consultivos */}
          {analysis?.behaviors && (
            <div className="p-5 rounded-[24px] bg-white border border-[#E5E7EB]">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-3">
                Verificação dos comportamentos consultivos críticos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { label: 'Investigou necessidade', val: analysis.behaviors.investigatedNeeds },
                  { label: 'Perguntas consultivas', val: analysis.behaviors.consultativeQuestions },
                  { label: 'Consequências do problema', val: analysis.behaviors.exploredConsequences },
                  { label: 'Identificou motivação', val: analysis.behaviors.identifiedMotivationPriority },
                  { label: 'Ancorou valor antes do preço', val: analysis.behaviors.builtValueBeforePrice },
                  { label: 'Tratou objeções', val: analysis.behaviors.handledObjectionsWell },
                  { label: 'Conduziu fechamento', val: analysis.behaviors.attemptedClosing },
                  { label: 'Definiu próximos passos', val: analysis.behaviors.definedNextSteps },
                ].map((b, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-[12px] tracking-[-0.01em] ${
                      b.val
                        ? 'bg-[#CEF52A]/15 border-[#CEF52A]/50 text-[#0C0C0D] font-semibold'
                        : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#71717A]'
                    }`}
                  >
                    {b.val ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-[#0C0C0D]" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-[#71717A]" />
                    )}
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Avaliação Detalhada das 7 Competências */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-3">
              Avaliação das 7 competências comerciais (pesos oficiais)
            </h4>

            <div className="space-y-3">
              {competencyKeys.map((key) => {
                const config = COMPETENCY_CONFIGS[key];
                const comp = analysis?.competencies?.[key];
                if (!comp) return null;

                const isExpanded = expandedCompetency === key;
                const compScore = comp.score || 0;
                const isHigh = compScore >= 8.5;

                return (
                  <div
                    key={key}
                    className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white hover:border-[#0C0C0D] transition-all"
                  >
                    {/* Linha Resumo da Competência */}
                    <div
                      onClick={() => setExpandedCompetency(isExpanded ? null : key)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[12px] tabular-nums ${
                            isHigh
                              ? 'bg-[#CEF52A] text-[#0C0C0D]'
                              : 'bg-[#F3F4F6] text-[#0C0C0D] border border-[#E5E7EB]'
                          }`}
                        >
                          {compScore}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[13px] text-[#0C0C0D] tracking-[-0.01em]">
                              {config.label}
                            </span>
                            <span className="text-[11px] text-[#71717A] font-normal">
                              (peso: {Math.round(config.weight * 100)}%)
                            </span>
                          </div>
                          <p className="text-[12px] text-[#71717A] line-clamp-1 tracking-[-0.01em]">
                            {comp.justification}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-20 sm:w-28 bg-[#F3F4F6] h-2 rounded-full overflow-hidden hidden sm:block">
                          <div
                            style={{ width: `${compScore * 10}%` }}
                            className={`h-full rounded-full ${
                              isHigh ? 'bg-[#CEF52A]' : 'bg-[#0C0C0D]'
                            }`}
                          />
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#71717A]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#71717A]" />
                        )}
                      </div>
                    </div>

                    {/* Detalhamento Expansível */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-[#F3F4F6] bg-[#FAFAFA] space-y-3 text-[12px] tracking-[-0.01em]">
                        <div>
                          <span className="font-semibold text-[#0C0C0D] block mb-1">
                            Justificativa do avaliador:
                          </span>
                          <p className="text-[#52525B] leading-relaxed font-normal">{comp.justification}</p>
                        </div>

                        {/* Evidência Literal da Transcrição */}
                        {comp.evidence && comp.evidence.length > 0 && (
                          <div className="p-3 rounded-xl bg-white border border-[#E5E7EB]">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A] mb-1">
                              <Quote className="w-3.5 h-3.5 text-[#0C0C0D]" />
                              <span>Evidência literal na transcrição:</span>
                            </div>
                            <blockquote className="italic text-[#0C0C0D] text-[12px] leading-relaxed">
                              &ldquo;{comp.evidence.join(' ')}&rdquo;
                            </blockquote>
                          </div>
                        )}

                        {/* Abordagem Alternativa Sugerida */}
                        {comp.alternativeApproach && (
                          <div className="p-3.5 rounded-xl bg-[#0C0C0D] text-white">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#CEF52A] mb-1">
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Como o closer poderia ter abordado:</span>
                            </div>
                            <p className="text-[12px] text-white/90 leading-relaxed">{comp.alternativeApproach}</p>
                          </div>
                        )}

                        {/* Pontos Positivos e Oportunidades */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {comp.strengths && comp.strengths.length > 0 && (
                            <div>
                              <span className="font-semibold text-[#0C0C0D] block mb-1">Pontos positivos:</span>
                              <ul className="list-disc pl-4 space-y-0.5 text-[#52525B]">
                                {comp.strengths.map((s, idx) => (
                                  <li key={idx}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {comp.improvements && comp.improvements.length > 0 && (
                            <div>
                              <span className="font-semibold text-[#71717A] block mb-1">Oportunidades de melhoria:</span>
                              <ul className="list-disc pl-4 space-y-0.5 text-[#52525B]">
                                {comp.improvements.map((imp, idx) => (
                                  <li key={idx}>{imp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Objeções Identificadas */}
          {analysis?.objections && analysis.objections.length > 0 && (
            <div className="p-5 rounded-[24px] bg-white border border-[#E5E7EB]">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] mb-3">
                Objeções identificadas no diálogo
              </h4>
              <div className="space-y-3">
                {analysis.objections.map((obj, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-[12px] space-y-1.5 tracking-[-0.01em]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0C0C0D]">{obj.objection}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-pill ${
                          obj.rating === 'adequado'
                            ? 'bg-[#CEF52A] text-[#0C0C0D]'
                            : 'bg-[#0C0C0D] text-white'
                        }`}
                      >
                        Tratamento: {obj.rating}
                      </span>
                    </div>
                    {obj.prospectQuote && (
                      <p className="italic text-[#71717A]">Fala do prospect: &ldquo;{obj.prospectQuote}&rdquo;</p>
                    )}
                    <p className="text-[#0C0C0D]">Resposta do closer: {obj.howHandled}</p>
                    <p className="text-[11px] text-[#71717A] pt-0.5">{obj.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Transcrição Original Completa */}
          <div className="border border-[#E5E7EB] rounded-[24px] overflow-hidden bg-white">
            <div
              onClick={() => setShowFullTranscript(!showFullTranscript)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#71717A]" />
                <span className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider">
                  Transcrição original da reunião
                </span>
                <span className="text-[11px] text-[#71717A]">
                  ({call.transcript.split('\n').length} linhas)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className="px-2.5 py-1 rounded-pill bg-[#F3F4F6] hover:bg-[#0C0C0D] hover:text-white text-[11px] font-medium text-[#0C0C0D] flex items-center gap-1 transition-colors tracking-[-0.01em]"
                >
                  {copiedTranscript ? <Check className="w-3 h-3 text-[#CEF52A]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTranscript ? 'Copiado' : 'Copiar'}</span>
                </button>
                {showFullTranscript ? (
                  <ChevronUp className="w-4 h-4 text-[#71717A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#71717A]" />
                )}
              </div>
            </div>

            {showFullTranscript && (
              <div className="p-5 border-t border-[#E5E7EB] bg-[#0C0C0D] text-[#ECECEC] text-[12px] font-mono max-h-72 overflow-y-auto leading-relaxed select-text whitespace-pre-wrap">
                {call.transcript}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé Fixo */}
        <div className="px-6 md:px-8 py-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between">
          <span className="text-[12px] text-[#71717A] tracking-[-0.01em]">
            Avaliação armazenada com conformidade e governança.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-pill bg-[#0C0C0D] text-white hover:bg-[#1F1F22] font-semibold text-[12px] tracking-[-0.01em] transition-all shadow-pill"
          >
            Concluir leitura
          </button>
        </div>
      </div>
    </div>
  );
};
