# CVMatch AI — Otimize seu currículo para cada vaga

## 📌 Sobre o projeto

O **CVMatch AI** é uma aplicação web desenvolvida para ajudar candidatos a comparar seus currículos com descrições de vagas e identificar pontos de alinhamento.

A aplicação analisa o conteúdo da vaga e do currículo, apresenta uma estimativa de correspondência textual, identifica palavras-chave encontradas e ausentes e gera uma versão do currículo organizada para leitura por sistemas ATS.

O projeto foi desenvolvido como parte do desafio **DIO — Riachuelo: Criando produtos com IA**.

---

## 🎯 Problema que a aplicação resolve

Muitas pessoas possuem experiências e competências compatíveis com uma vaga, mas apresentam essas informações de maneira pouco alinhada à descrição utilizada pela empresa.

Isso pode dificultar a identificação de palavras-chave e informações relevantes por sistemas de triagem de currículos, conhecidos como ATS (Applicant Tracking Systems).

O CVMatch AI busca facilitar esse processo ao:

- comparar currículo e descrição da vaga;
- identificar palavras-chave profissionais relevantes;
- mostrar termos encontrados no currículo;
- apontar termos importantes da vaga que não aparecem no currículo;
- sugerir melhorias de apresentação;
- gerar uma versão mais organizada e adequada para leitura por ATS.

A aplicação não promete contratação e não considera o resultado como probabilidade de aprovação em um processo seletivo.

---

## 💡 Solução desenvolvida

O usuário cola:

1. a descrição da vaga;
2. o próprio currículo.

Depois, a aplicação realiza uma análise textual e apresenta:

- percentual de correspondência;
- palavras-chave encontradas;
- palavras-chave ausentes;
- sugestões de melhoria;
- currículo ATS-friendly.

O fluxo principal é:

**Descrição da vaga → Currículo → Análise → Match → Palavras-chave → Recomendações → Currículo ATS-friendly → Copiar/Exportar**

---

## 🚀 Funcionalidades

### Comparação entre vaga e currículo

A aplicação compara os termos profissionais presentes na descrição da vaga com aqueles encontrados no currículo.

### Match

É apresentado um percentual de correspondência textual entre os dois conteúdos.

Esse percentual representa apenas a correspondência identificada pela aplicação e não representa garantia ou probabilidade de contratação.

### Palavras-chave encontradas

São apresentadas competências, ferramentas, tecnologias, conhecimentos e conceitos profissionais identificados tanto na vaga quanto no currículo.

### Palavras-chave ausentes

São apresentados termos relevantes encontrados na vaga que não foram identificados no currículo.

A aplicação orienta o usuário a adicionar uma palavra-chave somente quando ela representar uma competência ou experiência que ele realmente possua.

### Sugestões

A aplicação apresenta recomendações para melhorar a organização e a clareza do currículo, priorizando informações que já existem no conteúdo original.

### Currículo ATS-friendly

A aplicação reorganiza o currículo original em uma estrutura mais simples e adequada para sistemas ATS.

A versão gerada evita:

- tabelas;
- gráficos;
- elementos visuais complexos;
- Markdown bruto;
- informações inventadas.

Também disponibiliza as opções:

- **Copiar currículo**
- **Exportar PDF**
- **Nova análise**

---

## 🔒 Regra de veracidade

Uma regra fundamental do projeto é:

> O CVMatch AI pode melhorar a organização e a apresentação das informações, mas nunca deve inventar experiências profissionais, empresas, cargos, competências, certificações ou resultados.

Uma palavra-chave da vaga só deve ser incorporada ao currículo ATS-friendly quando existir evidência compatível no currículo original.

O objetivo é melhorar a apresentação da experiência real do candidato, e não criar informações fictícias.

---

# 🧠 Mega Prompt utilizado

O desenvolvimento inicial da aplicação foi orientado pelo seguinte prompt:

```text
# CVMatch AI — Gerador de Currículo ATS-Friendly

Crie uma aplicação web chamada **CVMatch AI**, em português do Brasil.

## Objetivo

A aplicação deve comparar um currículo com a descrição de uma vaga e ajudar o usuário a adaptar seu currículo para aquela oportunidade.

O fluxo principal deve ser:

**Descrição da vaga → Currículo → Análise → Match → Palavras-chave → Currículo ATS-friendly → Exportação**

A aplicação deve ser simples, bonita, responsiva e funcional.

## Regra principal

A aplicação pode melhorar a organização e a forma de apresentar as informações do currículo, mas **NUNCA deve inventar experiências profissionais, empresas, cargos, competências, certificações ou resultados que não estejam no currículo original.**

Essa regra deve aparecer de forma visível na interface.

---

# Tela principal

Criar uma página única com um cabeçalho contendo:

**CVMatch AI**

Subtítulo:

**Otimize seu currículo para cada vaga.**

No centro da página, mostrar o título:

**Seu currículo está alinhado com a vaga?**

Texto:

"Compare seu currículo com uma descrição de vaga, encontre palavras-chave importantes e gere uma versão mais adequada para sistemas ATS."

---

# Área de entrada

Criar dois campos de texto grandes.

### Campo 1

Título:

**Descrição da vaga**

Placeholder:

"Cole aqui a descrição da vaga..."

### Campo 2

Título:

**Seu currículo**

Placeholder:

"Cole aqui o conteúdo do seu currículo..."

Abaixo dos campos mostrar:

**Importante: nunca inventamos experiências ou competências que você não possui.**

Criar um botão principal:

**Analisar currículo**

O botão deve ficar desabilitado se algum dos dois campos estiver vazio.

---

# Análise

Ao clicar em "Analisar currículo", processar os dois textos e mostrar uma área de resultados.

Criar um estado de carregamento com:

**Analisando currículo...**

Depois mostrar:

## Resultado da análise

Criar um card principal mostrando:

**Match com a vaga**

Mostrar uma porcentagem de 0 a 100% e uma barra de progresso.

A porcentagem deve representar somente a correspondência entre os termos e informações encontrados na vaga e no currículo.

Não apresentar o percentual como garantia de contratação.

---

# Palavras-chave

Criar duas seções:

### Palavras-chave encontradas

Mostrar as palavras ou competências relevantes encontradas tanto na vaga quanto no currículo.

Exibir como badges.

### Palavras-chave que podem estar faltando

Mostrar termos relevantes identificados na vaga que não foram encontrados no currículo.

Exibir como badges.

Adicionar a mensagem:

"Adicione uma palavra-chave somente se ela representar uma competência ou experiência que você realmente possui."

---

# Recomendações

Criar um card:

**Sugestões para melhorar seu currículo**

Mostrar recomendações baseadas na comparação entre a vaga e o currículo.

As recomendações podem sugerir:

- destacar experiências relevantes;
- melhorar a clareza das descrições;
- utilizar termos da vaga quando forem verdadeiros para o candidato;
- organizar melhor as informações;
- destacar competências já existentes.

Nunca recomendar que o usuário invente uma experiência ou competência.

---

# Currículo ATS-friendly

Depois da análise, criar uma seção:

## Seu currículo ATS-friendly

Gerar uma versão reorganizada e melhor apresentada do currículo original.

A versão deve:

- preservar as informações verdadeiras do currículo;
- melhorar clareza e organização;
- utilizar termos relevantes da vaga quando eles forem compatíveis com o currículo original;
- utilizar títulos simples;
- evitar tabelas;
- evitar gráficos;
- evitar elementos visuais complexos;
- ser fácil de ler por sistemas ATS.

Estrutura sugerida:

**NOME**

**CONTATO**

**RESUMO PROFISSIONAL**

**EXPERIÊNCIA PROFISSIONAL**

**FORMAÇÃO**

**COMPETÊNCIAS**

**CERTIFICAÇÕES**

**IDIOMAS**

Usar somente informações realmente existentes no currículo original.

Criar dois botões:

**Copiar currículo**

**Exportar PDF**

Criar também:

**Nova análise**

para voltar ao início.

---

# Design

Utilizar **shadcn/ui**.

Criar uma interface moderna, profissional e limpa.

Paleta:

- fundo: `#F8FAFC`
- cards: `#FFFFFF`
- texto principal: `#0F172A`
- texto secundário: `#64748B`
- azul principal: `#2563EB`
- azul escuro: `#1D4ED8`
- verde: `#16A34A`
- amarelo: `#D97706`
- vermelho: `#DC2626`
- bordas: `#E2E8F0`

Utilizar azul como cor principal.

Usar verde para indicar correspondências, amarelo para atenção e vermelho somente para erros.

Manter o design minimalista e profissional.

---

# Responsividade

A aplicação deve funcionar em:

- computador;
- tablet;
- celular.

No celular, os campos e resultados devem ficar empilhados.

---

# Rodapé

Adicionar:

**CVMatch AI**

"Apresentação melhor. Experiência verdadeira."

E:

"Projeto desenvolvido como parte do desafio DIO — Riachuelo: Criando produtos com IA."

---

# Requisitos técnicos

Priorize o funcionamento do fluxo principal.

Não criar:

- login;
- cadastro;
- banco de dados;
- dashboard;
- histórico;
- pagamentos;
- integrações externas desnecessárias.

O projeto deve funcionar como um MVP.

A análise deve produzir resultados consistentes para a mesma entrada.

Não utilizar resultados aleatórios.

Garantir que os botões funcionem.

Garantir que a aplicação seja responsiva.

Garantir que a exportação em PDF funcione.

Priorize simplicidade, clareza e funcionamento.
