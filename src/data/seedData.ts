import { Closer, SalesCall, CallAnalysis } from '@/types';

// O sistema operacional inicia 100% limpo, exibindo dados exclusivamente reais
export const INITIAL_CLOSERS: Closer[] = [];
export const INITIAL_CALLS: SalesCall[] = [];

// Dados demonstrativos reservados exclusivamente para restauração opcional de teste
export const DEMO_CLOSERS: Closer[] = [
  {
    id: 'closer-1',
    name: 'Lucas Andrade',
    active: true,
    email: 'lucas.andrade@salesintel.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'closer-2',
    name: 'Mariana Duarte',
    active: true,
    email: 'mariana.duarte@salesintel.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-09-15T14:30:00Z',
    updatedAt: '2026-09-15T14:30:00Z',
  },
  {
    id: 'closer-3',
    name: 'Rodrigo Matos',
    active: true,
    email: 'rodrigo.matos@salesintel.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-10-01T09:15:00Z',
    updatedAt: '2026-10-01T09:15:00Z',
  },
  {
    id: 'closer-4',
    name: 'Camila Siqueira',
    active: true,
    email: 'camila.siqueira@salesintel.com.br',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-10-10T11:00:00Z',
    updatedAt: '2026-10-10T11:00:00Z',
  },
];

export const DEMO_CALLS: SalesCall[] = [
  {
    id: 'call-101',
    closerId: 'closer-1',
    occurredAt: '2026-11-14T15:30:00Z',
    prospectName: 'Eduardo Martins (LogTech Brasil)',
    dealValue: 24000,
    durationMinutes: 38,
    saleClosed: true,
    analysisStatus: 'completed',
    createdAt: '2026-11-14T16:15:00Z',
    updatedAt: '2026-11-14T16:15:00Z',
    transcript: `[00:01] Lucas Andrade: Olá Eduardo, tudo bem? Uma honra falar com você hoje. Como está o clima aí em Belo Horizonte?
[00:15] Eduardo Martins: Tudo ótimo Lucas! Aqui está bem quente hoje. Obrigado pelo contato, estou ansioso para entender como vocês podem nos ajudar com nosso gargalo de conversão.
[00:32] Lucas Andrade: Excelente, Eduardo. Combinei 45 minutos na sua agenda. Meu objetivo hoje é fazer um raio-x do processo comercial atual da LogTech, entender onde estão os vazamentos de receita e, se fizermos sentido mútuo, mostrar como nossa solução resolve exatamente isso. Caso contrário, indicarei outros caminhos sem problema algum. Esse plano faz sentido para você?
[01:05] Eduardo Martins: Perfeito, transparência total. Vamos nessa.
[01:12] Lucas Andrade: Me conte, Eduardo: hoje vocês têm 12 executivos de vendas. Qual é o principal sintoma que fez você buscar essa reunião agora?
[01:25] Eduardo Martins: O maior problema é a taxa de conversão pós-demonstração. A gente gera 400 demos qualificadas por mês, mas apenas 32 fecham. O time alega que os clientes somem ou pedem descontos agressivos.
[02:00] Lucas Andrade: Entendi. 32 fechamentos em 400 reuniões representa 8% de taxa de conversão. Se você perdesse 10% a menos dessas oportunidades qualificadas, qual seria o impacto financeiro anual na LogTech?
[02:28] Eduardo Martins: Cara, nosso ticket médio é R$ 2.000 mensais no plano anual. 40 clientes a mais por mês seriam R$ 80.000 em MRR novo todo mês... Quase um milhão ao ano de dinheiro deixado na mesa.
[03:10] Lucas Andrade: Isso dói muito no crescimento da empresa. E quando um cliente diz que vai 'pensar' ou pede desconto, o que o seu closer normalmente responde?
[03:30] Eduardo Martins: Eles geralmente mandam uma mensagem 3 dias depois perguntando se pensou, ou aplicam um desconto de 15% aprovado comigo.
[04:05] Lucas Andrade: Ou seja, vocês estão sacrificando margem para compensar uma falha de diagnóstico inicial e tratamento de objeção. A plataforma Sales Intelligence atua como um copiloto em tempo real: ela analisa as 400 calls do seu time, identifica exatamente em qual minuto o cliente demonstrou hesitação e aponta os padrões dos seus top performers para que os outros 10 repliquem.
[05:20] Eduardo Martins: Parece muito poderoso. Mas qual o investimento para uma equipe do nosso tamanho?
[05:35] Lucas Andrade: Para uma operação com 12 closers e 400 chamadas monitoradas, o investimento é de R$ 2.000 mensais no contrato anual. Comparando com os R$ 80.000 em receita nova que você acabou de me dizer que estão escapando todo mês, recuperar apenas 1 cliente a cada dois meses já paga 100% da ferramenta. Como soa isso em termos de retorno?
[06:15] Eduardo Martins: O ROI é indiscutível. Minha única dúvida é o tempo de implementação e integração com nosso HubSpot.
[06:30] Lucas Andrade: Compreendo perfeitamente, Eduardo. A última coisa que você quer é uma ferramenta complexa que o time demore semanas para adotar. Nossa integração com HubSpot é nativa em 1 clique via OAuth e nosso time de Onboarding realiza o treinamento guiado em 48 horas. Se rodarmos o setup na próxima terça-feira, na quinta-feira seu time já terá os primeiros insights das calls. Podemos gerar o contrato para início imediato?
[07:15] Eduardo Martins: Excelente, Lucas. Pode me enviar o link de assinatura que vou validar com o financeiro e assinar hoje mesmo.
[07:35] Lucas Andrade: Maravilha, Eduardo! Acabei de enviar no seu e-mail e reservei a agenda de onboarding para terça às 10h. Muito obrigado e bem-vindo à Sales Intelligence!`,
    analysis: {
      callId: 'call-101',
      overallScore: 92,
      summary: 'Reunião comercial de alto nível consultivo. O closer estabeleceu rapport ágil com agenda clara, quantificou a dor do prospect em R$ 80.000/mês de impacto financeiro (R$ 1M anual), ancorou o ROI com maestria antes de apresentar o valor e isolou a objeção de integração HubSpot conduzindo ao fechamento imediato.',
      competencies: {
        abertura_conexao: {
          name: 'Abertura e Conexão',
          score: 9.5,
          weight: 0.10,
          justification: 'Abertura rápida com quebra-gelo empático, definição explícita do objetivo da reunião (45 min) e contrato prévio com transparência.',
          strengths: ['Pauta pré-alinhada', 'Contrato inicial de desfecho sem pressão'],
          improvements: ['Poderia ter confirmado o papel decisor de terceiros logo na abertura'],
          evidence: ['Combinei 45 minutos na sua agenda. Meu objetivo hoje é fazer um raio-x do processo comercial atual... Caso contrário, indicarei outros caminhos.'],
          recommendations: ['Manter este modelo de agenda como padrão no playbook da equipe.'],
          alternativeApproach: 'Excelente postura, modelo a ser replicado.'
        },
        investigacao_diagnostico: {
          name: 'Investigação e Diagnóstico',
          score: 9.5,
          weight: 0.25,
          justification: 'Mapeou a dor central (conversão de 8% pós-demo) e explorou as consequências financeiras diretas calculando R$ 80k/mês em dinheiro perdido.',
          strengths: ['Cálculo de impacto financeiro em conjunto com o prospect', 'Descoberta do gargalo real de descontos'],
          improvements: ['Poderia ter investigado os impactos emocionais no time de vendas'],
          evidence: ['Se você perdesse 10% a menos dessas oportunidades qualificadas, qual seria o impacto financeiro anual na LogTech?'],
          recommendations: ['Continuar incentivando o cliente a expressar os números em voz alta.'],
        },
        qualificacao: {
          name: 'Qualificação',
          score: 9.0,
          weight: 0.10,
          justification: 'Confirmou tamanho da equipe (12 executivos), volume mensal (400 demos) e autoridade para validação contratual.',
          strengths: ['Identificação do perfil ideal de cliente B2B'],
          improvements: ['Poderia ter verificado se há outros decisores além do financeiro'],
          evidence: ['Hoje vocês têm 12 executivos de vendas... A gente gera 400 demos qualificadas por mês.'],
          recommendations: ['Perguntar antecipadamente sobre o fluxo de aprovação com o comitê diretivo.'],
        },
        construcao_valor: {
          name: 'Construção de Valor',
          score: 9.5,
          weight: 0.15,
          justification: 'Conectou a solução diretamente aos gargalos relatados e ancorou o preço em relação aos R$ 80k mensais de ganho potencial.',
          strengths: ['Demonstração de ROI superior a 40x', 'Solução adaptada à dor de descontos'],
          improvements: ['Poderia ter mostrado um mini depoimento de empresa de logística'],
          evidence: ['Comparando com os R$ 80.000 em receita nova que você acabou de me dizer... recuperar apenas 1 cliente a cada dois meses já paga 100% da ferramenta.'],
          recommendations: ['Utilizar a técnica de ancoragem matemática em todas as propostas.'],
        },
        tratamento_objecoes: {
          name: 'Tratamento de Objeções',
          score: 8.5,
          weight: 0.15,
          justification: 'Validou a preocupação legítima com tempo de implantação e complexidade, esclarecendo a integração nativa em 48h.',
          strengths: ['Validação empática da objeção sem confrontar', 'Solução prática com onboarding guiado'],
          improvements: ['Poderia ter pedido confirmação adicional antes do call-to-action'],
          evidence: ['Compreendo perfeitamente, Eduardo. A última coisa que você quer é uma ferramenta complexa... Nossa integração com HubSpot é nativa em 1 clique.'],
          recommendations: ['Isolar a objeção com "Além da integração, haveria mais algum impeditivo?".'],
        },
        fechamento_compromisso: {
          name: 'Fechamento e Compromisso',
          score: 9.0,
          weight: 0.15,
          justification: 'Pedido direto e elegante de fechamento com prazo claro (início na terça-feira).',
          strengths: ['Fechamento presumido e condução firme', 'Eliminação de atrito com link direto'],
          improvements: ['Poderia ter colhido o aceite já compartilhando a tela'],
          evidence: ['Se rodarmos o setup na próxima terça-feira, na quinta-feira seu time já terá os primeiros insights. Podemos gerar o contrato para início imediato?'],
          recommendations: ['Manter fechamento de compromisso com data específica de ativação.'],
        },
        proximos_passos: {
          name: 'Próximos Passos',
          score: 9.0,
          weight: 0.10,
          justification: 'Definiu o envio imediato da minuta contratual e agendou a sessão de onboarding para terça às 10h.',
          strengths: ['Data e horário pré-reservados', 'Papéis e responsabilidades distribuídos'],
          improvements: ['Enviar convite de calendário durante a própria ligação'],
          evidence: ['Acabei de enviar no seu e-mail e reservei a agenda de onboarding para terça às 10h.'],
          recommendations: ['Padronizar o envio de convite de onboarding no Google Calendar em tempo real.'],
        },
      },
      behaviors: {
        investigatedNeeds: true,
        consultativeQuestions: true,
        exploredConsequences: true,
        identifiedMotivationPriority: true,
        builtValueBeforePrice: true,
        handledObjectionsWell: true,
        attemptedClosing: true,
        definedNextSteps: true,
      },
      objections: [
        {
          objection: 'Tempo e complexidade de integração com CRM HubSpot',
          prospectQuote: 'Minha única dúvida é o tempo de implementação e integração com nosso HubSpot.',
          howHandled: 'Explicou integração nativa em 1 clique e garantia de onboarding em 48h.',
          rating: 'adequado',
          feedback: 'Excelente resposta que eliminou o risco percebido de atrito operacional.',
        },
      ],
      strengths: [
        'Ancoragem de valor de R$ 80.000/mês antes de falar o preço de R$ 2.000/mês.',
        'Investigação aprofundada com métricas de conversão reais.',
        'Fechamento claro com data de onboarding pré-agendada.',
      ],
      improvementAreas: [
        'Explorar processo formal de aprovação jurídica e financeira de forma preventiva.',
      ],
      recommendations: [
        'Replicar a pergunta de impacto financeiro ("quanto custa deixar 10% a menos?") nos treinamentos de novos closers.',
      ],
      modelName: 'gemini-2.5-flash',
      analysisVersion: 'v1.0',
      promptVersion: 'commercial-intelligence-v1',
      analyzedAt: '2026-11-14T16:15:00Z',
    },
  },
  {
    id: 'call-102',
    closerId: 'closer-2',
    occurredAt: '2026-11-13T10:00:00Z',
    prospectName: 'Carolina Braga (Fintech Ágora)',
    dealValue: 36000,
    durationMinutes: 42,
    saleClosed: true,
    analysisStatus: 'completed',
    createdAt: '2026-11-13T11:00:00Z',
    updatedAt: '2026-11-13T11:00:00Z',
    transcript: `[00:02] Mariana Duarte: Bom dia, Carolina! Prazer enorme recebê-la aqui. Li sobre a nova rodada de investimento da Ágora, parabéns pela conquista!
[00:20] Carolina Braga: Oi Mariana, muito obrigada! Tem sido uma correria boa, contratamos 20 pessoas no último trimestre.
[00:35] Mariana Duarte: Imagino a demanda de alinhamento com tanta gente nova. Para aproveitarmos da melhor forma nossos 40 minutos, reservei os primeiros 20 minutos para entender profundamente o momento da operação comercial da Ágora, e os 20 finais para demonstrar a solução de inteligência comercial se fizer total sentido. Combinado?
[01:05] Carolina Braga: Combinado, gostei da pontualidade.
[01:15] Mariana Duarte: Carolina, com 20 novas contratações, como vocês estão garantindo que o pitch e a qualidade do diagnóstico dos novos closers sigam o padrão dos seniores?
[01:35] Carolina Braga: Esse é meu maior pesadelo hoje. Nossos dois gerentes comerciais passam 4 horas por dia ouvindo gravações aleatórias. É inviável humanamente escutar tudo, então os novos closers cometem erros básicos de falar de preço antes da hora e nós só descobrimos semanas depois quando o lead dá no-show.
[02:15] Mariana Duarte: Que diagnóstico preciso, Carolina. E qual o impacto disso na produtividade dos gerentes e no ramp-up dos novos vendedores?
[02:40] Carolina Braga: O ramp-up que deveria ser de 2 meses está levando 5 meses. Cada mês de atraso por closer nos custa cerca de R$ 35.000 em metas não batidas. Com 8 closers novos, estamos falando de R$ 280.000 de oportunidade postergada.
[03:25] Mariana Duarte: É um número assustador para qualquer diretoria comercial. Nossa plataforma automatiza 100% da escuta ativa: cada call finalizada é sintetizada com score das 7 competências, identificação dos gargalos e sugestão de feedback individual para o gestor em 30 segundos.
[04:40] Carolina Braga: Isso economizaria 80 horas de trabalho por mês dos meus gerentes! E como é a cobrança disso?
[05:00] Mariana Duarte: Para a equipe da Ágora, o plano Enterprise fica em R$ 3.000/mês. Reduzindo o ramp-up de apenas 1 closer de 5 para 3 meses, você já recupera mais de 10 vezes esse valor.
[05:40] Carolina Braga: O valor cabe perfeitamente no nosso budget aprovado para enablement de vendas.
[06:00] Mariana Duarte: Maravilhoso. Gostaria de iniciar o piloto oficial na próxima segunda-feira? Já gero os acessos de homologação hoje mesmo.
[06:20] Carolina Braga: Sim, com certeza Mariana. Envie o formulário para assinatura que libero com o time de compras agora à tarde.`,
    analysis: {
      callId: 'call-102',
      overallScore: 94,
      summary: 'Execução exemplar de vendas consultivas. Mariana conectou com o momento de funding da empresa, identificou com precisão a dor operacional de escuta manual (4h/dia dos gerentes) e o custo de atraso de ramp-up (R$ 280k). Fechamento direto e com alto valor agregado.',
      competencies: {
        abertura_conexao: {
          name: 'Abertura e Conexão',
          score: 9.8,
          weight: 0.10,
          justification: 'Pesquisa prévia relevante sobre o funding da empresa do prospect, elogio contextualizado e agenda cristalina.',
          strengths: ['Rapport hiper-personalizado', 'Alinhamento preciso de tempo'],
          improvements: [],
          evidence: ['Li sobre a nova rodada de investimento da Ágora, parabéns pela conquista!'],
          recommendations: ['Utilizar como exemplo padrão de abertura comercial.'],
        },
        investigacao_diagnostico: {
          name: 'Investigação e Diagnóstico',
          score: 9.6,
          weight: 0.25,
          justification: 'Descoberta do gargalo de 4h/dia dos gestores e cálculo do atraso de ramp-up gerando R$ 280k de prejuízo.',
          strengths: ['Perguntas investigativas de segundo e terceiro nível', 'Foco no custo de inação'],
          improvements: [],
          evidence: ['O ramp-up que deveria ser de 2 meses está levando 5 meses... estamos falando de R$ 280.000 de oportunidade postergada.'],
          recommendations: ['Continuar explorando o impacto na equipe de liderança.'],
        },
        qualificacao: {
          name: 'Qualificação',
          score: 9.5,
          weight: 0.10,
          justification: 'Identificou budget aprovado para enablement e poder imediato de decisão da diretora.',
          strengths: ['Confirmação de orçamento pré-alocado'],
          improvements: [],
          evidence: ['O valor cabe perfeitamente no nosso budget aprovado para enablement de vendas.'],
          recommendations: ['Validar prazos de compras da grande empresa.'],
        },
        construcao_valor: {
          name: 'Construção de Valor',
          score: 9.4,
          weight: 0.15,
          justification: 'Apresentou a solução como libertação de 80h de gestão e acelerador direto de receita.',
          strengths: ['Equivalência de tempo e economia em horas dos gestores'],
          improvements: [],
          evidence: ['Reduzindo o ramp-up de apenas 1 closer de 5 para 3 meses, você já recupera mais de 10 vezes esse valor.'],
          recommendations: ['Manter métrica de economia de horas de gestão.'],
        },
        tratamento_objecoes: {
          name: 'Tratamento de Objeções',
          score: 9.0,
          weight: 0.15,
          justification: 'Antecipou qualquer objeção de adoção ao focar na automação sem esforço dos gestores.',
          strengths: ['Prevenção de objeções pelo diagnóstico robusto'],
          improvements: ['Poderia ter investigado se a equipe de TI costuma impor travas de segurança'],
          evidence: ['Isso economizaria 80 horas de trabalho por mês dos meus gerentes!'],
          recommendations: ['Incluir checklist de segurança de dados antecipadamente.'],
        },
        fechamento_compromisso: {
          name: 'Fechamento e Compromisso',
          score: 9.2,
          weight: 0.15,
          justification: 'Pergunta de fechamento assertiva propondo data precisa de início na próxima segunda-feira.',
          strengths: ['Condução direta para o sim', 'Geração imediata dos acessos'],
          improvements: [],
          evidence: ['Gostaria de iniciar o piloto oficial na próxima segunda-feira? Já gero os acessos de homologação hoje mesmo.'],
          recommendations: ['Replicar técnica de proposta de data imediata.'],
        },
        proximos_passos: {
          name: 'Próximos Passos',
          score: 9.0,
          weight: 0.10,
          justification: 'Envio imediato do formulário e acompanhamento com o setor de compras ainda na tarde da reunião.',
          strengths: ['Ação atribuída e prazo no mesmo dia'],
          improvements: [],
          evidence: ['Envie o formulário para assinatura que libero com o time de compras agora à tarde.'],
          recommendations: ['Acompanhar com WhatsApp de apoio ao financeiro.'],
        },
      },
      behaviors: {
        investigatedNeeds: true,
        consultativeQuestions: true,
        exploredConsequences: true,
        identifiedMotivationPriority: true,
        builtValueBeforePrice: true,
        handledObjectionsWell: true,
        attemptedClosing: true,
        definedNextSteps: true,
      },
      objections: [],
      strengths: [
        'Excelente pesquisa prévia gerando rapport autêntico imediato.',
        'Mapeamento de prejuízo de R$ 280.000 em atraso de ramp-up.',
        'Posicionamento de alto valor com aceitação imediata de preço.',
      ],
      improvementAreas: [
        'Explorar requisitos de compliance e segurança de TI da fintech.',
      ],
      recommendations: [
        'Adicionar materiais de apoio de segurança ISO/LGPD para grandes clientes institucionais.',
      ],
      modelName: 'gemini-2.5-flash',
      analysisVersion: 'v1.0',
      promptVersion: 'commercial-intelligence-v1',
      analyzedAt: '2026-11-13T11:00:00Z',
    },
  },
  {
    id: 'call-103',
    closerId: 'closer-3',
    occurredAt: '2026-11-12T14:00:00Z',
    prospectName: 'Gabriel Viana (Viana Imóveis)',
    dealValue: 18000,
    durationMinutes: 29,
    saleClosed: false,
    analysisStatus: 'completed',
    createdAt: '2026-11-12T15:00:00Z',
    updatedAt: '2026-11-12T15:00:00Z',
    transcript: `[00:02] Rodrigo Matos: Alô Gabriel? Tudo bem? Vamos começar a demo da ferramenta?
[00:14] Gabriel Viana: Oi Rodrigo, tudo bem. Pode mostrar, tenho 30 minutos porque tenho outra reunião às 14h30.
[00:25] Rodrigo Matos: Beleza, vou compartilhar minha tela aqui e mostrar todas as funcionalidades do nosso software. Aqui no menu você tem o painel geral, depois tem a aba de relatórios, aqui você configura os filtros...
[01:10] Gabriel Viana: Certo... mas antes da tela, eu queria entender se vocês atendem o setor imobiliário. Nosso ciclo de venda de apartamento de alto padrão é longo, 6 meses.
[01:28] Rodrigo Matos: Atendemos sim qualquer segmento! Vou continuar mostrando a tela, veja que legal essa parte de transcrição com inteligência artificial, você clica aqui e ela gera o texto.
[02:30] Gabriel Viana: E qual o valor disso?
[02:35] Rodrigo Matos: O valor é R$ 1.500 por mês no plano básico.
[02:45] Gabriel Viana: Achei um pouco caro para o que a gente precisa hoje. Já temos um CRM e o pessoal não usa direito.
[03:00] Rodrigo Matos: Mas se você fechar hoje eu consigo te dar 20% de desconto, fica por R$ 1.200. O que você acha?
[03:15] Gabriel Viana: Olha Rodrigo, não é nem só pelo preço, preciso falar com meu sócio e analisar com mais calma. Me manda uma apresentação por e-mail que qualquer coisa eu entro em contato.
[03:32] Rodrigo Matos: Tá bom, Gabriel. Vou te mandar o PDF por e-mail então e semana que vem eu te ligo para saber o que você achou. Um abraço!`,
    analysis: {
      callId: 'call-103',
      overallScore: 48,
      summary: 'Call transacional e focada em features ao invés de dores de negócio. O closer não fez perguntas abertas de investigação, ignorou a dúvida do cliente sobre ciclo longo em imóveis, entregou o preço precipitadamente e concedeu 20% de desconto na primeira hesitação sem ancorar valor, resultando em objeção clássica de "vou falar com o sócio".',
      competencies: {
        abertura_conexao: {
          name: 'Abertura e Conexão',
          score: 5.0,
          weight: 0.10,
          justification: 'Abertura afobada, sem alinhamento de expectativas ou quebra-gelo. Começou pulando direto para a tela.',
          strengths: ['Pontualidade no início'],
          improvements: ['Fazer perguntas antes de compartilhar a tela', 'Estabelecer autoridade e rapport'],
          evidence: ['Alô Gabriel? Tudo bem? Vamos começar a demo da ferramenta? Beleza, vou compartilhar minha tela...'],
          recommendations: ['Nunca começar uma call abrindo a tela sem entender quem é o cliente.'],
          alternativeApproach: 'Gabriel, antes de abrirmos qualquer tela, me conta: o que motivou você a buscar essa reunião hoje para a Viana Imóveis?'
        },
        investigacao_diagnostico: {
          name: 'Investigação e Diagnóstico',
          score: 3.5,
          weight: 0.25,
          justification: 'Não investigou tamanho da equipe, faturamento, perda de negócios ou processo de vendas.',
          strengths: [],
          improvements: ['Fazer perguntas de Spin Selling ou diagnóstico profundo', 'Explorar dores e consequências financeiras'],
          evidence: ['Atendemos sim qualquer segmento! Vou continuar mostrando a tela, veja que legal essa parte...'],
          recommendations: ['Dedicar no mínimo 15 minutos exclusivamente para perguntas investigativas.'],
          alternativeApproach: 'Gabriel, você mencionou que o ciclo de vocês é de 6 meses. Onde vocês mais perdem negócios nesse período?'
        },
        qualificacao: {
          name: 'Qualificação',
          score: 4.5,
          weight: 0.10,
          justification: 'Descobriu a existência de um sócio apenas no momento final do fechamento.',
          strengths: [],
          improvements: ['Mapear todos os decisores no início da conversa'],
          evidence: ['Preciso falar com meu sócio e analisar com mais calma.'],
          recommendations: ['Perguntar no início: "Além de você, quem mais participa da decisão?".'],
        },
        construcao_valor: {
          name: 'Construção de Valor',
          score: 4.0,
          weight: 0.15,
          justification: 'Focou em funcionalidades técnicas ("clica aqui e gera texto") sem conectar com aumento de vendas imobiliárias.',
          strengths: ['Conhecimento dos botões da ferramenta'],
          improvements: ['Traduzir features em benefícios financeiros reais'],
          evidence: ['O valor é R$ 1.500 por mês no plano básico.'],
          recommendations: ['Ancorar ROI: uma comissão de imóvel paga anos da ferramenta.'],
        },
        tratamento_objecoes: {
          name: 'Tratamento de Objeções',
          score: 4.0,
          weight: 0.15,
          justification: 'Ao ouvir "achei caro", ofertou desconto imediato de 20% sem investigar o real motivo da hesitação.',
          strengths: [],
          improvements: ['Não desvalorizar o produto oferecendo desconto imediato', 'Explorar a objeção'],
          evidence: ['Mas se você fechar hoje eu consigo te dar 20% de desconto, fica por R$ 1.200.'],
          recommendations: ['Responder a "está caro" com: "Caro em relação a quê, Gabriel?".'],
          alternativeApproach: 'Entendo sua preocupação com custo, Gabriel. Mas considerando que um único imóvel vendido gera R$ 30k de comissão, o que especificamente te parece desproporcional?'
        },
        fechamento_compromisso: {
          name: 'Fechamento e Compromisso',
          score: 4.5,
          weight: 0.15,
          justification: 'Tentativa de fechamento baseada em desespero por desconto, facilmente rejeitada pelo prospect.',
          strengths: [],
          improvements: ['Fazer fechamento condicional e profissional'],
          evidence: ['O que você acha? Me manda uma apresentação por e-mail que qualquer coisa eu entro em contato.'],
          recommendations: ['Evitar aceitar o "me manda por e-mail" passivamente.'],
        },
        proximos_passos: {
          name: 'Próximos Passos',
          score: 5.0,
          weight: 0.10,
          justification: 'Prometeu ligar "semana que vem" sem fixar dia ou horário exato na agenda.',
          strengths: [],
          improvements: ['Definir data, hora e objetivo específico do próximo contato'],
          evidence: ['Vou te mandar o PDF por e-mail então e semana que vem eu te ligo para saber o que você achou.'],
          recommendations: ['Sempre agendar dia e horário no calendário.'],
          alternativeApproach: 'Gabriel, para não ficarmos jogando telefone sem resposta, que tal marcarmos terça-feira às 14h com seu sócio presente para uma conversa de 15 minutos?'
        },
      },
      behaviors: {
        investigatedNeeds: false,
        consultativeQuestions: false,
        exploredConsequences: false,
        identifiedMotivationPriority: false,
        builtValueBeforePrice: false,
        handledObjectionsWell: false,
        attemptedClosing: false,
        definedNextSteps: false,
      },
      objections: [
        {
          objection: 'Preço considerado elevado / "Achei caro"',
          prospectQuote: 'Achei um pouco caro para o que a gente precisa hoje. Já temos um CRM e o pessoal não usa.',
          howHandled: 'Concedeu desconto imediato de 20% sem isolar a causa.',
          rating: 'inadequado',
          feedback: 'Diminuiu a credibilidade da proposta e comprovou insegurança na ancoragem de valor.',
        },
        {
          objection: 'Necessidade de consultar o sócio / "Vou pensar"',
          prospectQuote: 'Preciso falar com meu sócio e analisar com mais calma.',
          howHandled: 'Aceitou passivamente enviar PDF por e-mail.',
          rating: 'ignorado',
          feedback: 'Perdeu o controle da venda ao delegar o pitch para o próprio cliente.',
        },
      ],
      strengths: [
        'Boa dicção e simpatia no tom de voz.',
      ],
      improvementAreas: [
        'Investigação prévia inexistente (abriu a tela no minuto 1).',
        'Oferta de desconto reflexivo e desesperado.',
        'Próximos passos sem agendamento no calendário.',
      ],
      recommendations: [
        'Treinamento intensivo de perguntas investigativas (SPIN Selling).',
        'Regra de ouro: proibido dar desconto antes de entender a dor real do cliente.',
        'Sempre incluir todos os sócios na primeira conversa ou agendar retorno com eles.',
      ],
      modelName: 'gemini-2.5-flash',
      analysisVersion: 'v1.0',
      promptVersion: 'commercial-intelligence-v1',
      analyzedAt: '2026-11-12T15:00:00Z',
    },
  },
  {
    id: 'call-104',
    closerId: 'closer-4',
    occurredAt: '2026-11-11T16:00:00Z',
    prospectName: 'Bruno Alcantara (HealthMed)',
    dealValue: 28000,
    durationMinutes: 35,
    saleClosed: true,
    analysisStatus: 'completed',
    createdAt: '2026-11-11T17:00:00Z',
    updatedAt: '2026-11-11T17:00:00Z',
    transcript: `[00:05] Camila Siqueira: Olá Bruno, muito boa tarde! Como estão as operações da HealthMed essa semana?
[00:22] Bruno Alcantara: Olá Camila, tudo ótimo! Estamos expandindo nossa rede de clínicas e o time de vendas está sob forte pressão por novas adesões.
[00:45] Camila Siqueira: Imagino o ritmo acelerado, Bruno. Nosso objetivo hoje em 35 minutos é avaliar como a padronização das abordagens dos seus 15 consultores pode elevar a taxa de adesão sem sobrecarregar sua equipe médica. Se identificarmos sinergia, estruturamos os passos seguintes. Caso contrário, ficamos com a troca de experiências. Tudo bem?
[01:15] Bruno Alcantara: Maravilhoso, Camila. Bem direto como eu gosto.
[01:25] Camila Siqueira: Bruno, nas reuniões dos seus consultores com as clínicas parceiras, qual tem sido a maior objeção apresentada pelos médicos?
[01:42] Bruno Alcantara: Os médicos dizem que não têm tempo para preencher prontuários eletrônicos novos e que os softwares atuais travam muito. Nossos consultores acabam se enrolando na explicação técnica em vez de focar na retenção de pacientes que o sistema gera.
[02:20] Camila Siqueira: Perfeito. Quando o consultor se enrola na técnica, o médico perde o interesse e pede 'para mandar por e-mail', correto?
[02:35] Bruno Alcantara: Exatamente isso! 70% dos médicos dizem exatamente essa frase e nunca mais respondem.
[03:10] Camila Siqueira: Camila demonstrou como a Sales Intelligence alerta o consultor para mudar o foco imediatamente de software para 'mais pacientes na cadeira da clínica'. Mostrou o caso de uso com dados de saúde.
[04:20] Bruno Alcantara: Isso muda completamente nosso jogo. Como implementamos?
[04:40] Camila Siqueira: O plano para os 15 consultores é de R$ 2.400/mês. Podemos assinar o termo de adesão hoje para garantir o início do treinamento de inteligência na próxima segunda-feira às 9h?
[05:10] Bruno Alcantara: Com certeza, Camila. Já estou com o contrato aberto aqui na tela e vou assinar agora.`,
    analysis: {
      callId: 'call-104',
      overallScore: 90,
      summary: 'Excelente condução com foco cirúrgico no nicho de saúde. Camila diagnosticou rapidamente o padrão de escape dos médicos parceiros ("manda por e-mail"), reposicionou a narrativa comercial e obteve o fechamento imediato com assinatura em tempo real.',
      competencies: {
        abertura_conexao: {
          name: 'Abertura e Conexão',
          score: 9.2,
          weight: 0.10,
          justification: 'Postura profissional, respeitosa e alinhamento do tempo com clareza.',
          strengths: ['Agenda clara', 'Postura segura'],
          improvements: [],
          evidence: ['Nosso objetivo hoje em 35 minutos é avaliar como a padronização das abordagens...'],
          recommendations: ['Excelente padrão para segmento B2B corporativo.'],
        },
        investigacao_diagnostico: {
          name: 'Investigação e Diagnóstico',
          score: 9.0,
          weight: 0.25,
          justification: 'Identificou que 70% dos médicos escapavam com o mesmo padrão ("manda por e-mail") por causa de foco excessivo em detalhes técnicos.',
          strengths: ['Diagnóstico comportamental da equipe', 'Mapeamento do padrão de escape'],
          improvements: ['Poderia ter calculado o valor exato perdido nessas 70% de perdas'],
          evidence: ['70% dos médicos dizem exatamente essa frase e nunca mais respondem.'],
          recommendations: ['Sempre anexar uma estimativa financeira ao volume de perdas.'],
        },
        qualificacao: {
          name: 'Qualificação',
          score: 9.0,
          weight: 0.10,
          justification: 'Mapeou tamanho da equipe (15 consultores) e autoridade de assinatura direta.',
          strengths: ['Tomador de decisão presente e validado'],
          improvements: [],
          evidence: ['Já estou com o contrato aberto aqui na tela e vou assinar agora.'],
          recommendations: ['Manter processo ágil com links digitais.'],
        },
        construcao_valor: {
          name: 'Construção de Valor',
          score: 9.1,
          weight: 0.15,
          justification: 'Trocou o discurso de software técnico por impacto direto em pacientes na cadeira da clínica.',
          strengths: ['Linguagem orientada ao desfecho do cliente'],
          improvements: [],
          evidence: ['Mudou o foco imediatamente de software para mais pacientes na cadeira da clínica.'],
          recommendations: ['Treinar outros closers a usar termos do dia a dia do cliente.'],
        },
        tratamento_objecoes: {
          name: 'Tratamento de Objeções',
          score: 8.8,
          weight: 0.15,
          justification: 'Eliminou a objeção do prospect demonstrando a solução diretamente na dor.',
          strengths: ['Demonstração prática direcionada'],
          improvements: [],
          evidence: ['Isso muda completamente nosso jogo. Como implementamos?'],
          recommendations: ['Manter demonstrações curtas focadas em resolução.'],
        },
        fechamento_compromisso: {
          name: 'Fechamento e Compromisso',
          score: 9.3,
          weight: 0.15,
          justification: 'Fechou com data exata de início (segunda às 9h) e acompanhou a assinatura em tempo real.',
          strengths: ['Assinatura na call'],
          improvements: [],
          evidence: ['Podemos assinar o termo de adesão hoje para garantir o início do treinamento na próxima segunda-feira às 9h?'],
          recommendations: ['Incentivar sempre a assinatura durante a própria reunião.'],
        },
        proximos_passos: {
          name: 'Próximos Passos',
          score: 8.8,
          weight: 0.10,
          justification: 'Treinamento de segunda agendado com horário estabelecido.',
          strengths: ['Início imediato'],
          improvements: [],
          evidence: ['Garantir o início do treinamento de inteligência na próxima segunda-feira às 9h.'],
          recommendations: ['Enviar convite do Google Calendar com antecedência.'],
        },
      },
      behaviors: {
        investigatedNeeds: true,
        consultativeQuestions: true,
        exploredConsequences: true,
        identifiedMotivationPriority: true,
        builtValueBeforePrice: true,
        handledObjectionsWell: true,
        attemptedClosing: true,
        definedNextSteps: true,
      },
      objections: [],
      strengths: [
        'Transição do foco técnico para o valor de negócio (pacientes na cadeira).',
        'Assinatura realizada durante a própria reunião comercial.',
      ],
      improvementAreas: [
        'Quantificar o valor financeiro da perda das 70% de oportunidades.',
      ],
      recommendations: [
        'Incorporar planilha de ROI rápido para operações na área de saúde.',
      ],
      modelName: 'gemini-2.5-flash',
      analysisVersion: 'v1.0',
      promptVersion: 'commercial-intelligence-v1',
      analyzedAt: '2026-11-11T17:00:00Z',
    },
  },
  {
    id: 'call-105',
    closerId: 'closer-1',
    occurredAt: '2026-11-09T11:00:00Z',
    prospectName: 'Renata Albuquerque (OmniRetail)',
    dealValue: 42000,
    durationMinutes: 45,
    saleClosed: true,
    analysisStatus: 'completed',
    createdAt: '2026-11-09T12:00:00Z',
    updatedAt: '2026-11-09T12:00:00Z',
    transcript: `[00:02] Lucas Andrade: Olá Renata, tudo bem? Prazer em conhecê-la.
[00:15] Renata Albuquerque: Olá Lucas, tudo certo! Acompanho seus posts no LinkedIn sobre eficiência de vendas.
[00:30] Lucas Andrade: Que honra, Renata! Hoje quero entender como está o pipeline da OmniRetail com a Black Friday se aproximando...`,
    analysis: {
      callId: 'call-105',
      overallScore: 89,
      summary: 'Reunião comercial estratégica com o varejo. Lucas ancorou a sazonalidade da Black Friday, mapeou a perda de oportunidades no checkout telefônico e fechou o contrato para o trimestre com foco em ganho de margem operacional.',
      competencies: {
        abertura_conexao: { name: 'Abertura e Conexão', score: 9.0, weight: 0.10, justification: 'Excelente autoridade prévia pelo LinkedIn.', strengths: ['Autoridade estabelecida'], improvements: [], evidence: ['Acompanho seus posts no LinkedIn sobre eficiência de vendas.'], recommendations: ['Seguir utilizando personal branding no pré-call.'] },
        investigacao_diagnostico: { name: 'Investigação e Diagnóstico', score: 8.8, weight: 0.25, justification: 'Mapeou o risco da Black Friday com equipe descalibrada.', strengths: ['Gatilho de urgência temporal real'], improvements: ['Aprofundar margem de produtos'], evidence: ['Mapeou a perda de oportunidades no checkout telefônico'], recommendations: ['Investigar ticket médio de cada linha de produto.'] },
        qualificacao: { name: 'Qualificação', score: 9.0, weight: 0.10, justification: 'Diretora com poder de compra imediato.', strengths: ['Alinhamento de orçamento sazonal'], improvements: [], evidence: ['Diretora comercial com autonomia total'], recommendations: ['Manter foco em C-levels.'] },
        construcao_valor: { name: 'Construção de Valor', score: 9.0, weight: 0.15, justification: 'Conectou o software com o pico de vendas de novembro.', strengths: ['Conexão com a meta trimestral da empresa'], improvements: [], evidence: ['Foco em ganho de margem operacional'], recommendations: ['Apresentar relatórios de pico de tráfego.'] },
        tratamento_objecoes: { name: 'Tratamento de Objeções', score: 8.7, weight: 0.15, justification: 'Respondeu à dúvida sobre estabilidade de servidores com SLA contratual de 99.9%.', strengths: ['Segurança técnica'], improvements: [], evidence: ['SLA de 99.9% garantido em contrato'], recommendations: ['Destacar SLA no sumário executivo.'] },
        fechamento_compromisso: { name: 'Fechamento e Compromisso', score: 8.9, weight: 0.15, justification: 'Fechamento rápido aproveitando a urgência da Black Friday.', strengths: ['Urgência genuína'], improvements: [], evidence: ['Fechou o contrato para o trimestre'], recommendations: ['Validar prazo de entrega do onboarding.'] },
        proximos_passos: { name: 'Próximos Passos', score: 8.8, weight: 0.10, justification: 'Início de treinamento marcado para a quarta-feira seguinte.', strengths: ['Plano de ação claro'], improvements: [], evidence: ['Treinamento marcado para quarta-feira'], recommendations: ['Acompanhar métricas de adesão no primeiro mês.'] },
      },
      behaviors: {
        investigatedNeeds: true,
        consultativeQuestions: true,
        exploredConsequences: true,
        identifiedMotivationPriority: true,
        builtValueBeforePrice: true,
        handledObjectionsWell: true,
        attemptedClosing: true,
        definedNextSteps: true,
      },
      objections: [
        {
          objection: 'Estabilidade da plataforma durante o pico da Black Friday',
          prospectQuote: 'Não podemos ter nosso sistema fora do ar durante a semana mais movimentada do ano.',
          howHandled: 'Apresentou SLA de 99.9% com suporte prioritário 24/7.',
          rating: 'adequado',
          feedback: 'Garantia contratual removeu qualquer receio da diretora.',
        }
      ],
      strengths: ['Aproveitamento de momento sazonal de mercado.', 'Ancoragem de autoridade forte.'],
      improvementAreas: ['Aprofundar métricas de margem por canal de venda.'],
      recommendations: ['Criar ofertas temáticas sazonais para o time comercial.'],
      modelName: 'gemini-2.5-flash',
      analysisVersion: 'v1.0',
      promptVersion: 'commercial-intelligence-v1',
      analyzedAt: '2026-11-09T12:00:00Z',
    },
  },
  {
    id: 'call-106',
    closerId: 'closer-3',
    occurredAt: '2026-11-08T15:00:00Z',
    prospectName: 'Thiago Nogueira (ConstruTech)',
    dealValue: 20000,
    durationMinutes: 31,
    saleClosed: false,
    analysisStatus: 'completed',
    createdAt: '2026-11-08T16:00:00Z',
    updatedAt: '2026-11-08T16:00:00Z',
    transcript: `[00:05] Rodrigo Matos: Boa tarde Thiago. Tudo bem? Hoje vou te mostrar nossa plataforma de IA para o seu time de vendas.
[00:20] Thiago Nogueira: Boa tarde Rodrigo. Nós usamos um CRM próprio e queríamos saber se vocês têm API aberta.
[00:40] Rodrigo Matos: Temos sim API REST. Deixa eu te mostrar a tela dos relatórios aqui...
[01:10] Thiago Nogueira: Mas Rodrigo, quem desenvolveu o CRM foi nossa equipe de tecnologia interna, então eles são muito exigentes com autenticação e segurança.
[01:30] Rodrigo Matos: Ah, entendi. É bem seguro sim. Veja aqui os gráficos como são bonitos...
[02:15] Thiago Nogueira: E quanto custa?
[02:22] Rodrigo Matos: Custa R$ 1.800 por mês.
[02:35] Thiago Nogueira: Achei alto para integrar em um sistema que já temos. Vou passar a documentação para o nosso CTO e se ele aprovar a gente fala.
[02:50] Rodrigo Matos: Tá certo Thiago, qualquer dúvida estou por aqui. Até mais!`,
    analysis: {
      callId: 'call-106',
      overallScore: 42,
      summary: 'Outra oportunidade perdida por Rodrigo devido a diagnóstico superficial e falta de isolamento de objeções técnicas. O prospect demonstrou preocupação genuína com segurança e autenticação do CTO, mas o closer respondeu com visual de telas ("veja os gráficos bonitos") em vez de documentação técnica ou ROI.',
      competencies: {
        abertura_conexao: { name: 'Abertura e Conexão', score: 5.2, weight: 0.10, justification: 'Início genérico e sem estabelecer autoridade técnica.', strengths: [], improvements: ['Fazer perguntas de cenário'], evidence: ['Hoje vou te mostrar nossa plataforma de IA'], recommendations: ['Perguntar as expectativas da empresa antes da tela.'] },
        investigacao_diagnostico: { name: 'Investigação e Diagnóstico', score: 3.0, weight: 0.25, justification: 'Não investigou quantas pessoas usam o CRM interno ou por que querem IA.', strengths: [], improvements: ['Fazer perguntas investigativas sobre dores do time'], evidence: ['Deixa eu te mostrar a tela dos relatórios aqui...'], recommendations: ['Investigar o que o CTO realmente exige.'] },
        qualificacao: { name: 'Qualificação', score: 4.0, weight: 0.10, justification: 'CTO não estava presente e o closer não agendou reunião tripartite.', strengths: [], improvements: ['Envolver o CTO imediatamente'], evidence: ['Vou passar a documentação para o nosso CTO'], recommendations: ['Oferecer conversa técnica direta com o CTO.'] },
        construcao_valor: { name: 'Construção de Valor', score: 3.8, weight: 0.15, justification: 'Discurso superficial focado em "gráficos bonitos".', strengths: [], improvements: ['Focar em eficiência e economia de horas dos engenheiros'], evidence: ['Veja aqui os gráficos como são bonitos...'], recommendations: ['Nunca vender sofisticação visual para perfil analítico/técnico.'] },
        tratamento_objecoes: { name: 'Tratamento de Objeções', score: 3.5, weight: 0.15, justification: 'Respondeu superficialmente ("é bem seguro sim") sem dados ou certificações.', strengths: [], improvements: ['Apresentar whitepaper de segurança'], evidence: ['Ah, entendi. É bem seguro sim.'], recommendations: ['Ter documentação de API e segurança pronta para envio.'] },
        fechamento_compromisso: { name: 'Fechamento e Compromisso', score: 4.0, weight: 0.15, justification: 'Nenhuma tentativa de fechamento estruturado.', strengths: [], improvements: ['Propor próximo passo formal'], evidence: ['Tá certo Thiago, qualquer dúvida estou por aqui.'], recommendations: ['Jamais terminar uma reunião comercial sem data e hora.'] },
        proximos_passos: { name: 'Próximos Passos', score: 4.2, weight: 0.10, justification: 'Encerramento passivo aguardando retorno do prospect.', strengths: [], improvements: ['Agendar chamada técnica com CTO'], evidence: ['Até mais!'], recommendations: ['Marcar data de alinhamento com CTO.'] },
      },
      behaviors: {
        investigatedNeeds: false,
        consultativeQuestions: false,
        exploredConsequences: false,
        identifiedMotivationPriority: false,
        builtValueBeforePrice: false,
        handledObjectionsWell: false,
        attemptedClosing: false,
        definedNextSteps: false,
      },
      objections: [
        {
          objection: 'Dúvidas de segurança e exigência de aprovação do CTO',
          prospectQuote: 'Eles são muito exigentes com autenticação e segurança. Vou passar a documentação para o nosso CTO.',
          howHandled: 'Disse que "é bem seguro sim" e encerrou passivamente.',
          rating: 'inadequado',
          feedback: 'Prospect técnico precisa de dados, documentação de API e reunião técnica com o CTO agendada.',
        }
      ],
      strengths: ['Respondeu educadamente.'],
      improvementAreas: [
        'Respostas rasas a perguntas técnicas ("é bem seguro sim").',
        'Falta de ancoragem de ROI no valor da ferramenta.',
        'Não tentou agendar reunião com o CTO.',
      ],
      recommendations: [
        'Criar ficha técnica e playbook para lidar com prospects de TI / Engenharia.',
        'Sempre agendar a conversa com o decisor técnico na própria reunião.',
      ],
      modelName: 'gemini-2.5-flash',
      analysisVersion: 'v1.0',
      promptVersion: 'commercial-intelligence-v1',
      analyzedAt: '2026-11-08T16:00:00Z',
    },
  },
];
