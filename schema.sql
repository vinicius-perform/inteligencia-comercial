-- ==============================================================================
-- SALES INTELLIGENCE — ESQUEMA DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- ==============================================================================

-- Habilita extensão de UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE CLOSERS
CREATE TABLE IF NOT EXISTS public.closers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para Closers
CREATE INDEX IF NOT EXISTS idx_closers_active ON public.closers(active);
CREATE INDEX IF NOT EXISTS idx_closers_name ON public.closers(name);

-- 2. TABELA DE CALLS DE VENDAS
CREATE TABLE IF NOT EXISTS public.sales_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    closer_id UUID NOT NULL REFERENCES public.closers(id) ON DELETE CASCADE,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    transcript TEXT NOT NULL,
    sale_closed BOOLEAN NOT NULL DEFAULT FALSE,
    prospect_name VARCHAR(255),
    deal_value NUMERIC(12, 2) DEFAULT 0.00,
    duration_minutes INTEGER DEFAULT 30,
    analysis_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'analyzing', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para Sales Calls
CREATE INDEX IF NOT EXISTS idx_sales_calls_closer_id ON public.sales_calls(closer_id);
CREATE INDEX IF NOT EXISTS idx_sales_calls_occurred_at ON public.sales_calls(occurred_at);
CREATE INDEX IF NOT EXISTS idx_sales_calls_sale_closed ON public.sales_calls(sale_closed);
CREATE INDEX IF NOT EXISTS idx_sales_calls_status ON public.sales_calls(analysis_status);

-- 3. TABELA DE ANÁLISES COM IA (GEMINI ENGINE)
CREATE TABLE IF NOT EXISTS public.call_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL UNIQUE REFERENCES public.sales_calls(id) ON DELETE CASCADE,
    overall_score NUMERIC(5, 2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    competencies JSONB NOT NULL,
    behaviors JSONB NOT NULL,
    objections JSONB NOT NULL,
    strengths JSONB NOT NULL,
    improvement_areas JSONB NOT NULL,
    evidence JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    summary TEXT NOT NULL,
    model_name VARCHAR(100) NOT NULL DEFAULT 'gemini-2.5-flash',
    analysis_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    prompt_version VARCHAR(20) NOT NULL DEFAULT 'commercial-intelligence-v1',
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para Análises
CREATE INDEX IF NOT EXISTS idx_call_analyses_call_id ON public.call_analyses(call_id);
CREATE INDEX IF NOT EXISTS idx_call_analyses_score ON public.call_analyses(overall_score);

-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.closers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_analyses ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público autenticado/anônimo configurável
CREATE POLICY "Acesso total a closers autenticados" ON public.closers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acesso total a calls autenticadas" ON public.sales_calls
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acesso total a análises autenticadas" ON public.call_analyses
    FOR ALL USING (true) WITH CHECK (true);
