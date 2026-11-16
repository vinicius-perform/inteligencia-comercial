'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, HardDrive, Key, Check, RotateCcw, Download, Upload } from 'lucide-react';
import { DataService } from '@/lib/dataService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupMsg, setBackupMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(DataService.getGeminiApiKey());
      setSavedSuccess(false);
      setBackupMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    DataService.setGeminiApiKey(apiKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetToEmpty = () => {
    if (confirm('Deseja limpar todos os closers e calls locais? A base ficará zerada.')) {
      DataService.resetToEmpty();
      if (onDataReset) onDataReset();
      setBackupMsg('Base de dados zerada com sucesso!');
      setTimeout(() => setBackupMsg(''), 3000);
    }
  };

  const handleLoadDemo = () => {
    if (confirm('Deseja carregar as 4 reuniões de exemplo para testes de visualização?')) {
      DataService.loadDemoData();
      if (onDataReset) onDataReset();
      setBackupMsg('Dados de demonstração carregados!');
      setTimeout(() => setBackupMsg(''), 3000);
    }
  };

  const handleExportBackup = () => {
    const jsonStr = DataService.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-intelligence-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupMsg('Backup baixado com sucesso!');
    setTimeout(() => setBackupMsg(''), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = DataService.importDataJson(content);
      if (success) {
        if (onDataReset) onDataReset();
        setBackupMsg('Backup importado com sucesso!');
      } else {
        alert('Arquivo de backup inválido. Certifique-se de selecionar um arquivo JSON exportado por esta plataforma.');
      }
      setTimeout(() => setBackupMsg(''), 3000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white w-full max-w-lg rounded-[28px] p-8 shadow-2xl border border-[#E5E7EB] relative animate-scale-in">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#71717A] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#0C0C0D] text-[#CEF52A] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-[#0C0C0D] tracking-[-0.03em]">
              Configurações da plataforma
            </h3>
            <p className="text-[12px] text-[#71717A] tracking-[-0.01em]">Motor de IA & Gerenciamento de Dados</p>
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2">
              Chave da Gemini API (Google AI) — Opcional
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua GEMINI_API_KEY aqui (AIzaSy...)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-[13px] text-[#0C0C0D] placeholder:text-[#999999] focus:outline-none focus:border-[#0C0C0D] focus:bg-white transition-all font-mono tracking-normal"
              />
              <Key className="w-3.5 h-3.5 text-[#71717A] absolute right-4 top-3" />
            </div>
            <p className="text-[11px] text-[#71717A] mt-2 tracking-[-0.01em]">
              Se deixada em branco, o sistema utilizará o motor heurístico de vendas integrado, garantindo análise instantânea de 7 competências sem depender de chaves externas.
            </p>
          </div>

          {/* Gerenciamento de Dados Local / Vercel */}
          <div className="p-4 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-[#71717A]" />
                <span className="text-[12px] font-semibold text-[#0C0C0D] tracking-[-0.01em]">
                  Modo Autônomo / Vercel
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-pill bg-[#CEF52A] text-[#0C0C0D]">
                Ativo
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] tracking-[-0.01em]">
              Sem dependência de banco externo ou tela de login. Você pode exportar backups ou sincronizar seus dados entre a sua máquina e a versão na nuvem com um clique.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#0C0C0D] text-[11px] font-semibold text-[#0C0C0D] transition-all shadow-xs"
              >
                <Download className="w-3 h-3 text-[#71717A]" />
                <span>Exportar backup JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#0C0C0D] text-[11px] font-semibold text-[#0C0C0D] transition-all shadow-xs"
              >
                <Upload className="w-3 h-3 text-[#71717A]" />
                <span>Importar JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </div>

            {backupMsg && (
              <div className="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{backupMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToEmpty}
              className="flex items-center gap-1.5 text-[11px] text-[#71717A] hover:text-[#DC2626] transition-colors py-1.5 px-3 rounded-pill hover:bg-[#FEE2E2] tracking-[-0.01em]"
              title="Apagar dados e iniciar limpo"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Zerar base</span>
            </button>
            <button
              type="button"
              onClick={handleLoadDemo}
              className="flex items-center gap-1.5 text-[11px] text-[#71717A] hover:text-[#0C0C0D] transition-colors py-1.5 px-3 rounded-pill hover:bg-[#F3F4F6] tracking-[-0.01em]"
              title="Carregar 4 chamadas com transcrições para teste de visualização"
            >
              <Sparkles className="w-3 h-3 text-[#CEF52A]" />
              <span>Carregar demo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-pill text-[12px] font-medium text-[#71717A] hover:bg-[#F3F4F6] transition-colors tracking-[-0.01em]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-pill text-[12px] font-bold bg-[#0C0C0D] text-white hover:bg-[#1F1F22] transition-all shadow-pill tracking-[-0.01em]"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#CEF52A]" />
                  <span>Salvo!</span>
                </>
              ) : (
                <span>Salvar configurações</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
