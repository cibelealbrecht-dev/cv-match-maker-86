// Análise determinística (sem aleatoriedade) entre vaga e currículo.

const STOPWORDS = new Set(
  `a o as os um uma uns umas de do da dos das em no na nos nas por para com sem sob sobre entre ate até
   e ou mas que se ao aos à às pelo pela pelos pelas seu sua seus suas nosso nossa este esta esse essa
   isso isto aquele aquela ser estar ter haver foi sao são será serão como mais menos muito muita muitos
   muitas todo toda todos todas cada qual quais quando onde porque pois já ainda também apenas outro outra
   outros outras nao não sim bem bom boa vaga empresa candidato profissional area área nivel nível anos
   ano experiencia experiência experiencias experiências conhecimento conhecimentos atividades atividade
   requisitos requisito desejavel desejável diferencial responsabilidades responsabilidade principais
   trabalho trabalhar realizar fazer atuar atuacao atuação equipe time dia dias mes meses horario horário
   beneficios benefícios salario salário vale contrato clt pj home office presencial hibrido híbrido
   nossa nosso sera serao busca buscamos procuramos voce você seja seus suas junto atraves através
   forma novos nova novas novo`
    .split(/\s+/)
    .filter(Boolean),
);

export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokens(text: string) {
  return normalize(text)
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[-.]+|[-.]+$/g, ""))
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

function stem(word: string) {
  return word
    .replace(/(coes|cao|ções|ção)$/, "ca")
    .replace(/(mentos|mento)$/, "ment")
    .replace(/(s|es)$/, "");
}

export type Analysis = {
  score: number;
  found: string[];
  missing: string[];
  suggestions: string[];
};

function titleCase(word: string, original: Map<string, string>) {
  const raw = original.get(word) ?? word;
  if (raw.length <= 3) return raw.toUpperCase();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function analyze(job: string, resume: string): Analysis {
  const jobTokens = tokens(job);
  const resumeTokens = tokens(resume);

  // mapa de versão "original" para exibição
  const display = new Map<string, string>();
  for (const raw of job.split(/[^A-Za-zÀ-ÿ0-9+#.-]+/)) {
    const key = normalize(raw).replace(/^[-.]+|[-.]+$/g, "");
    if (key && !display.has(key)) display.set(key, raw);
  }

  const resumeStems = new Set(resumeTokens.map(stem));

  const freq = new Map<string, number>();
  for (const t of jobTokens) freq.set(t, (freq.get(t) ?? 0) + 1);

  const ranked = [...freq.entries()].sort(
    (a, b) => b[1] - a[1] || b[0].length - a[0].length || a[0].localeCompare(b[0]),
  );

  const keywords = ranked.slice(0, 30).map(([w]) => w);

  const found: string[] = [];
  const missing: string[] = [];
  for (const k of keywords) {
    if (resumeStems.has(stem(k))) found.push(titleCase(k, display));
    else missing.push(titleCase(k, display));
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
  const lines = resume
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return "";

  const sections = new Map<string, string[]>();
  const push = (key: string, value: string) => {
    if (!sections.has(key)) sections.set(key, []);
    const arr = sections.get(key)!;
    if (!arr.includes(value)) arr.push(value);
  };

  const name = lines[0];
  let current: string | null = null;

  for (const line of lines.slice(1)) {
    const section = detectSection(line);
    if (section) {
      current = section;
      continue;
    }
    if (CONTACT_RE.test(line) && (!current || current === "CONTATO")) {
      push("CONTATO", line.replace(/^[-•*]\s*/, ""));
      continue;
    }
    const content = line.replace(/^[-•*]\s*/, "");
    push(current ?? "EXPERIÊNCIA PROFISSIONAL", content);
  }

  const out: string[] = [name.toUpperCase(), ""];
  for (const key of ORDER) {
    const items = sections.get(key);
    if (!items?.length) continue;
    out.push(key);
    for (const item of items) {
      out.push(key === "CONTATO" ? item : `- ${item}`);
    }
    out.push("");
  }
  return out.join("\n").trim();
}
