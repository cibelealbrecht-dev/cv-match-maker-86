import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { analyze, buildAtsResume, type Analysis } from "@/lib/cv-analysis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CVMatch AI — Gerador de Currículo ATS-Friendly" },
      {
        name: "description",
        content:
          "Compare seu currículo com a descrição de uma vaga, encontre palavras-chave e gere uma versão ATS-friendly sem inventar experiências.",
      },
      { property: "og:title", content: "CVMatch AI — Currículo ATS-Friendly" },
      {
        property: "og:description",
        content:
          "Otimize seu currículo para cada vaga: match, palavras-chave e versão ATS-friendly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function scoreTone(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

function Index() {
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [ats, setAts] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const disabled = useMemo(
    () => !job.trim() || !resume.trim(),
    [job, resume],
  );

  function handleAnalyze() {
    if (disabled) return;
    setLoading(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(analyze(job, resume));
      setAts(buildAtsResume(resume));
      setLoading(false);
      window.setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60,
      );
    }, 700);
  }

  function handleReset() {
    setJob("");
    setResume("");
    setResult(null);
    setAts("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ats);
      toast.success("Currículo copiado para a área de transferência.");
    } catch {
      toast.error("Não foi possível copiar. Selecione o texto manualmente.");
    }
  }

  async function handlePdf() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;

    doc.setFont("helvetica", "normal");
    for (const line of ats.split("\n")) {
      const isHeading = line === line.toUpperCase() && line.trim().length > 0;
      doc.setFontSize(isHeading ? 12 : 10.5);
      doc.setFont("helvetica", isHeading ? "bold" : "normal");
      const wrapped = doc.splitTextToSize(line || " ", width);
      for (const w of wrapped) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(w, margin, y);
        y += isHeading ? 18 : 14;
      }
    }
    doc.save("curriculo-ats.pdf");
    toast.success("PDF gerado com sucesso.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">CVMatch AI</h1>
            <p className="text-sm text-muted-foreground">
              Otimize seu currículo para cada vaga.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Seu currículo está alinhado com a vaga?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Compare seu currículo com uma descrição de vaga, encontre palavras-chave
            importantes e gere uma versão mais adequada para sistemas ATS.
          </p>
        </section>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descrição da vaga</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="vaga" className="sr-only">
                Descrição da vaga
              </Label>
              <Textarea
                id="vaga"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Cole aqui a descrição da vaga..."
                className="min-h-56 resize-y"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Seu currículo</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="cv" className="sr-only">
                Seu currículo
              </Label>
              <Textarea
                id="cv"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Cole aqui o conteúdo do seu currículo..."
                className="min-h-56 resize-y"
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p>
            <strong className="font-semibold">Importante:</strong> nunca inventamos
            experiências ou competências que você não possui.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={disabled || loading}
            onClick={handleAnalyze}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            Analisar currículo
          </Button>
        </div>

        {loading && (
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Analisando currículo...
          </p>
        )}

        {result && !loading && (
          <div ref={resultsRef} className="mt-12 space-y-6">
            <h3 className="text-xl font-semibold tracking-tight">Resultado da análise</h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Match com a vaga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className={`text-4xl font-bold ${scoreTone(result.score)}`}>
                    {result.score}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {result.found.length} de {result.found.length + result.missing.length}{" "}
                    termos encontrados
                  </span>
                </div>
                <Progress value={result.score} />
                <p className="text-xs text-muted-foreground">
                  Este percentual representa apenas a correspondência entre os termos da
                  vaga e do currículo. Não é garantia de contratação.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-5 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="size-4 text-success" />
                    Palavras-chave encontradas
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.found.length ? (
                    result.found.map((k) => (
                      <Badge key={k} variant="success">
                        {k}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum termo em comum foi identificado.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="size-4 text-warning" />
                    Palavras-chave que podem estar faltando
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {result.missing.length ? (
                      result.missing.map((k) => (
                        <Badge key={k} variant="warning">
                          {k}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nada relevante ficou de fora.
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Adicione uma palavra-chave somente se ela representar uma competência
                    ou experiência que você realmente possui.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Sugestões para melhorar seu currículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.suggestions.map((s) => (
                    <li key={s} className="flex gap-2 text-sm leading-relaxed">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Seu currículo ATS-friendly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 font-sans text-sm leading-relaxed">
                  {ats}
                </pre>
                <p className="text-xs text-muted-foreground">
                  Versão reorganizada a partir das informações do seu currículo original.
                  Nenhuma experiência ou competência foi criada.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" className="sm:w-auto" onClick={handleCopy}>
                    <Copy className="size-4" />
                    Copiar currículo
                  </Button>
                  <Button className="sm:w-auto" onClick={handlePdf}>
                    <Download className="size-4" />
                    Exportar PDF
                  </Button>
                  <Button variant="ghost" className="sm:ml-auto sm:w-auto" onClick={handleReset}>
                    <RefreshCw className="size-4" />
                    Nova análise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 text-center sm:px-6">
          <p className="font-semibold">CVMatch AI</p>
          <p className="text-sm text-muted-foreground">
            Apresentação melhor. Experiência verdadeira.
          </p>
          <Separator className="mx-auto my-4 max-w-xs" />
          <p className="text-xs text-muted-foreground">
            Projeto desenvolvido como parte do desafio DIO — Riachuelo: Criando produtos
            com IA.
          </p>
        </div>
      </footer>
    </div>
  );
}
