// Análise determinística (sem aleatoriedade) entre vaga e currículo.

export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Remove qualquer sintaxe Markdown bruta do texto. */
export function stripMarkdown(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .split("\n")
    .map((line) =>
      line
        .replace(/^\s{0,3}#{1,6}\s*/, "")
        .replace(/^\s{0,3}>\s?/, "")
        .replace(/^\s*[-*+•–—]\s+/, "")
        .replace(/^\s*\d+[.)]\s+/, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/__([^_]+)__/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/_([^_]+)_/g, "$1")
        .replace(/[*_#`]+/g, "")
        .replace(/^\s*[-–—]{2,}\s*$/, "")
        .replace(/\s{2,}/g, " ")
        .trimEnd(),
    )
    .join("\n");
}

/** Termos profissionais reconhecidos (competências, ferramentas, conceitos). */
const SKILL_TERMS = [
  "marketing digital",
  "marketing de conteudo",
  "midias sociais",
  "redes sociais",
  "google analytics",
  "google ads",
  "google sheets",
  "google workspace",
  "google data studio",
  "looker studio",
  "meta ads",
  "facebook ads",
  "instagram",
  "linkedin",
  "tiktok",
  "seo",
  "sem",
  "crm",
  "erp",
  "sap",
  "excel",
  "power bi",
  "powerpoint",
  "word",
  "canva",
  "figma",
  "photoshop",
  "trello",
  "notion",
  "jira",
  "slack",
  "analise de dados",
  "analise de metricas",
  "analise de indicadores",
  "indicadores de desempenho",
  "kpis",
  "kpi",
  "relatorios",
  "relatorio",
  "dashboards",
  "dashboard",
  "campanhas",
  "campanha",
  "planilhas",
  "planilha",
  "copywriting",
  "redacao",
  "branding",
  "comunicacao",
  "comunicacao interna",
  "atendimento ao cliente",
  "gestao de projetos",
  "gestao de equipes",
  "gestao de tempo",
  "organizacao",
  "proatividade",
  "trabalho em equipe",
  "ingles",
  "espanhol",
  "sql",
  "python",
  "javascript",
  "typescript",
  "react",
  "node",
  "java",
  "git",
  "api",
  "apis",
  "banco de dados",
  "metodologias ageis",
  "scrum",
  "kanban",
  "e-mail marketing",
  "email marketing",
  "funil de vendas",
  "vendas",
  "prospeccao",
  "negociacao",
  "pesquisa de mercado",
  "benchmarking",
  "storytelling",
  "edicao de video",
  "design grafico",
  "ux",
  "ui",
  "wordpress",
  "hubspot",
  "rd station",
  "salesforce",
  "controle de estoque",
  "logistica",
  "financeiro",
  "contas a pagar",
  "contas a receber",
  "recrutamento e selecao",
  "departamento pessoal",
  "rotinas administrativas",
  "suporte tecnico",
  "documentacao",
  "treinamento",
  "apresentacoes",
];

/** Palavras isoladas que nunca devem virar palavra-chave. */
const STOPWORDS = new Set(
  normalize(
    `a o as os um uma uns umas de do da dos das em no na nos nas por para com sem sob sobre entre ate
     e ou mas que se ao aos à às pelo pela pelos pelas seu sua seus suas nosso nossa nossos nossas este esta
     estes estas esse essa esses essas isso isto aquele aquela aqueles aquelas ser estar ter haver fazer foi
     era sao serao sera somos estamos estao temos tem tinha havia como mais menos muito muita muitos muitas
     todo toda todos todas cada qual quais quando onde porque pois ja ainda tambem apenas outro outra outros
     outras nao sim bem bom boa melhor melhores grande grandes pequeno pequena novo nova novos novas
     vaga vagas empresa empresas candidato candidata candidatos profissional profissionais pessoa pessoas
     area areas nivel niveis junior pleno senior estagio estagiario trainee aprendiz
     ano anos mes meses dia dias semana horario horas periodo
     experiencia experiencias conhecimento conhecimentos atividade atividades requisito requisitos
     desejavel desejaveis diferencial diferenciais responsabilidade responsabilidades principais
     trabalho trabalhar realizar atuar atuacao equipe time
     beneficios beneficio salario vale refeicao transporte contrato clt pj home office presencial hibrido
     busca buscamos buscar procuramos procurar oferecemos oferecer voce voces nos seja sejam junto atraves
     forma formas criar cria criando desenvolver apoio apoiar ajudar auxiliar participar acompanhar
     diferente diferentes varios varias demais entre alem sempre nunca alguns algumas
     local cidade estado brasil remoto curso cursando superior ensino graduacao formacao
     capacidade facilidade vontade interesse gosto perfil oportunidade desafio desafios crescimento
     cultura valores missao visao clientes cliente produto produtos servico servicos projeto projetos
     dados informacao informacoes resultado resultados meta metas processo processos acoes acao
     ferramenta ferramentas plataforma plataformas sistema sistemas rotina rotinas`,
  )
    .split(/\s+/)
    .filter(Boolean),
);

function stem(word: string) {
  return word
    .replace(/(coes|cao)$/, "ca")
    .replace(/(mentos|mento)$/, "ment")
    .replace(/(s|es)$/, "");
}

function normalizedWords(text: string) {
  return normalize(stripMarkdown(text))
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[-.]+|[-.]+$/g, ""))
    .filter(Boolean);
}

function isMeaningfulWord(word: string) {
  if (word.length < 3) return false;
  if (/^[\d.+#-]+$/.test(word)) return false;
  if (!/[a-z]/.test(word)) return false;
  if (STOPWORDS.has(word)) return false;
  // verbos comuns no infinitivo e gerúndio não são competências
  if (/(ar|er|ir|ando|endo|indo)$/.test(word) && word.length <= 9) return false;
  return true;
}

export type Analysis = {
  score: number;
  found: string[];
  missing: string[];
  suggestions: string[];
};

const ACRONYMS = new Set([
  "seo",
  "sem",
  "crm",
  "erp",
  "sap",
  "sql",
  "api",
  "apis",
  "kpi",
  "kpis",
  "ux",
  "ui",
]);

function pretty(term: string, display: Map<string, string>) {
  const original = display.get(term);
  if (original) return original;
  return term
    .split(" ")
    .map((w) =>
      ACRONYMS.has(w) || w.length <= 2
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

function buildDisplayMap(text: string) {
  const clean = stripMarkdown(text);
  const map = new Map<string, string>();
  const words = clean.split(/[^A-Za-zÀ-ÿ0-9+#.-]+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    for (let n = 1; n <= 3 && i + n <= words.length; n++) {
      const phrase = words.slice(i, i + n).join(" ");
      const key = normalize(phrase);
      if (!map.has(key)) map.set(key, phrase);
    }
  }
  return map;
}

function extractKeywords(job: string) {
  const jobNorm = normalize(stripMarkdown(job));
  const terms: string[] = [];
  const seen = new Set<string>();

  // 1) termos profissionais conhecidos (inclui expressões compostas)
  for (const term of SKILL_TERMS) {
    const re = new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`);
    if (re.test(jobNorm) && !seen.has(term)) {
      seen.add(term);
      terms.push(term);
    }
  }

  // 2) palavras significativas restantes, por frequência
  const words = normalizedWords(job).filter(isMeaningfulWord);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  const covered = new Set(terms.flatMap((t) => t.split(" ")));
  const ranked = [...freq.entries()]
    .filter(([w]) => !covered.has(w) && !seen.has(w))
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length || a[0].localeCompare(b[0]))
    .slice(0, Math.max(0, 20 - terms.length))
    .map(([w]) => w);

  return [...terms, ...ranked].slice(0, 20);
}

function hasTerm(term: string, resumeNorm: string, resumeStems: Set<string>) {
  if (term.includes(" ")) {
    return resumeNorm.includes(term);
  }
  return resumeStems.has(stem(term)) || resumeNorm.includes(term);
}

export function analyze(job: string, resume: string): Analysis {
  const keywords = extractKeywords(job);
  const display = buildDisplayMap(job);

  const resumeNorm = normalize(stripMarkdown(resume));
  const resumeStems = new Set(normalizedWords(resume).map(stem));

  const found: string[] = [];
  const missing: string[] = [];
  for (const k of keywords) {
    if (hasTerm(k, resumeNorm, resumeStems)) found.push(pretty(k, display));
    else missing.push(pretty(k, display));
  }

  const score = keywords.length
    ? Math.round((found.length / keywords.length) * 100)
    : 0;

  const suggestions: string[] = [];
  if (score >= 75) {
    suggestions.push(
      "Seu currículo já apresenta forte alinhamento com a vaga. Destaque logo no resumo profissional as experiências mais relacionadas à oportunidade.",
    );
  } else if (score >= 45) {
    suggestions.push(
      "Há alinhamento parcial. Reorganize o currículo para trazer as experiências mais relevantes para a vaga no topo de cada seção.",
    );
  } else {
    suggestions.push(
      "O alinhamento textual está baixo. Reveja se experiências que você realmente possui foram descritas com clareza suficiente.",
    );
  }

  if (found.length) {
    suggestions.push(
      `Dê mais evidência às competências que você já possui e que a vaga cita: ${found
        .slice(0, 6)
        .join(", ")}.`,
    );
  }
  if (missing.length) {
    suggestions.push(
      `A vaga menciona termos ausentes no seu texto (ex.: ${missing
        .slice(0, 6)
        .join(", ")}). Use-os apenas se corresponderem a algo que você realmente fez.`,
    );
  }

  if (!/\d/.test(resume)) {
    suggestions.push(
      "Inclua números reais já alcançados por você (metas, volumes, prazos) para tornar as descrições mais concretas.",
    );
  }
  if (resume.split(/\n/).filter((l) => l.trim()).length < 10) {
    suggestions.push(
      "Detalhe melhor cada experiência existente em linhas curtas, começando por verbos de ação.",
    );
  }
  suggestions.push(
    "Use títulos simples de seção e evite tabelas, colunas ou imagens para facilitar a leitura por sistemas ATS.",
  );

  return { score, found, missing, suggestions };
}

const SECTION_RULES: { key: string; patterns: RegExp }[] = [
  { key: "RESUMO PROFISSIONAL", patterns: /^(resumo|perfil|objetivo|sobre)/ },
  {
    key: "EXPERIÊNCIA PROFISSIONAL",
    patterns: /^(experi|hist[oó]rico|atua|carreira|trajet)/,
  },
  { key: "FORMAÇÃO", patterns: /^(forma|escolarid|educa|acad)/ },
  { key: "COMPETÊNCIAS", patterns: /^(compet|habilid|skills|conhecim|tecnolog)/ },
  { key: "CERTIFICAÇÕES", patterns: /^(certific|cursos|curso)/ },
  { key: "IDIOMAS", patterns: /^(idioma|l[ií]nguas)/ },
  { key: "CONTATO", patterns: /^(contato|dados pessoais)/ },
];

const ORDER = [
  "CONTATO",
  "RESUMO PROFISSIONAL",
  "EXPERIÊNCIA PROFISSIONAL",
  "FORMAÇÃO",
  "COMPETÊNCIAS",
  "CERTIFICAÇÕES",
  "IDIOMAS",
];

function detectSection(line: string) {
  const clean = normalize(line.trim()).replace(/[:•\-–]/g, " ").trim();
  if (clean.length > 40) return null;
  for (const rule of SECTION_RULES) if (rule.patterns.test(clean)) return rule.key;
  return null;
}

const CONTACT_RE = /(@|https?:\/\/|linkedin|github|\(\d{2}\)|\d{4,5}-?\d{4})/i;

/** Reorganiza o currículo original sem inventar conteúdo novo. */
export function buildAtsResume(resume: string): string {
  const lines = stripMarkdown(resume)
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^[-=_·•]+$/.test(l));
  if (!lines.length) return "";

  const sections = new Map<string, string[]>();
  const push = (key: string, value: string) => {
    if (!value) return;
    if (!sections.has(key)) sections.set(key, []);
    const arr = sections.get(key)!;
    if (!arr.includes(value)) arr.push(value);
  };

  const name = lines[0] ?? "";
  let current: string | null = null;

  for (const line of lines.slice(1)) {
    const section = detectSection(line);
    if (section) {
      current = section;
      continue;
    }
    if (CONTACT_RE.test(line) && (!current || current === "CONTATO")) {
      push("CONTATO", line);
      continue;
    }
    push(current ?? "EXPERIÊNCIA PROFISSIONAL", line);
  }

  const out: string[] = [name.toUpperCase(), ""];
  for (const key of ORDER) {
    const items = sections.get(key);
    if (!items?.length) continue;
    out.push(key);
    for (const item of items) {
      out.push(key === "CONTATO" ? item : `• ${item}`);
    }
    out.push("");
  }
  return out.join("\n").trim();
}
