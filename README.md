# Match CV

CVMatch AI — Gerador de Currículo ATS-Friendly

Crie uma aplicação web chamada CVMatch AI, em português do Brasil.

Objetivo

A aplicação deve comparar um currículo com a descrição de uma vaga e ajudar o usuário a adaptar seu currículo para aquela oportunidade.

O fluxo principal deve ser:

Descrição da vaga → Currículo → Análise → Match → Palavras-chave → Currículo ATS-friendly → Exportação

A aplicação deve ser simples, bonita, responsiva e funcional.

Regra principal

A aplicação pode melhorar a organização e a forma de apresentar as informações do currículo, mas NUNCA deve inventar experiências profissionais, empresas, cargos, competências, certificações ou resultados que não estejam no currículo original.

Essa regra deve aparecer de forma visível na interface.

Tela principal

Criar uma página única com um cabeçalho contendo:

CVMatch AI

Subtítulo:

Otimize seu currículo para cada vaga.

No centro da página, mostrar o título:

Seu currículo está alinhado com a vaga?

Texto:

"Compare seu currículo com uma descrição de vaga, encontre palavras-chave importantes e gere uma versão mais adequada para sistemas ATS."

Área de entrada

Criar dois campos de texto grandes.

Campo 1

Título:

Descrição da vaga

Placeholder:

"Cole aqui a descrição da vaga..."

Campo 2

Título:

Seu currículo

Placeholder:

"Cole aqui o conteúdo do seu currículo..."

Abaixo dos campos mostrar:

Importante: nunca inventamos experiências ou competências que você não possui.

Criar um botão principal:

Analisar currículo

O botão deve ficar desabilitado se algum dos dois campos estiver vazio.

Análise

Ao clicar em "Analisar currículo", processar os dois textos e mostrar uma área de resultados.

Criar um estado de carregamento com:

Analisando currículo...

Depois mostrar:

Resultado da análise

Criar um card principal mostrando:

Match com a vaga

Mostrar uma porcentagem de 0 a 100% e uma barra de progresso.

A porcentagem deve representar somente a correspondência entre os termos e informações encontrados na vaga e no currículo.

Não apresentar o percentual como garantia de contratação.

Palavras-chave

Criar duas seções:

Palavras-chave encontradas

Mostrar as palavras ou competências relevantes encontradas tanto na vaga quanto no currículo.

Exibir como badges.

Palavras-chave que podem estar faltando

Mostrar termos relevantes identificados na vaga que não foram encontrados no currículo.

Exibir como badges.

Adicionar a mensagem:

"Adicione uma palavra-chave somente se ela representar uma competência ou experiência que você realmente possui."

Recomendações

Criar um card:

Sugestões para melhorar seu currículo

Mostrar recomendações baseadas na comparação entre a vaga e o currículo.

As recomendações podem sugerir:

destacar experiências relevantes;

melhorar a clareza das descrições;

utilizar termos da vaga quando forem verdadeiros para o candidato;

organizar melhor as informações;

destacar competências já existentes.

Nunca recomendar que o usuário invente uma experiência ou competência.

Currículo ATS-friendly

Depois da análise, criar uma seção:

Seu currículo ATS-friendly

Gerar uma versão reorganizada e melhor apresentada do currículo original.

A versão deve:

preservar as informações verdadeiras do currículo;

melhorar clareza e organização;

utilizar termos relevantes da vaga quando eles forem compatíveis com o currículo original;

utilizar títulos simples;

evitar tabelas;

evitar gráficos;

evitar elementos visuais complexos;

ser fácil de ler por sistemas ATS.

Estrutura sugerida:

NOME

CONTATO

RESUMO PROFISSIONAL

EXPERIÊNCIA PROFISSIONAL

FORMAÇÃO

COMPETÊNCIAS

CERTIFICAÇÕES

IDIOMAS

Usar somente informações realmente existentes no currículo original.

Criar dois botões:

Copiar currículo

Exportar PDF

Criar também:

Nova análise

para voltar ao início.

Design

Utilizar shadcn/ui.

Criar uma interface moderna, profissional e limpa.

Paleta:

fundo: #F8FAFC

cards: #FFFFFF

texto principal: #0F172A

texto secundário: #64748B

azul principal: #2563EB

azul escuro: #1D4ED8

verde: #16A34A

amarelo: #D97706

vermelho: #DC2626

bordas: #E2E8F0

Utilizar azul como cor principal.

Usar verde para indicar correspondências, amarelo para atenção e vermelho somente para erros.

Manter o design minimalista e profissional.

Responsividade

A aplicação deve funcionar em:

computador;

tablet;

celular.

No celular, os campos e resultados devem ficar empilhados.

Rodapé

Adicionar:

CVMatch AI

"Apresentação melhor. Experiência verdadeira."

E:

"Projeto desenvolvido como parte do desafio DIO — Riachuelo: Criando produtos com IA."

Requisitos técnicos

Priorize o funcionamento do fluxo principal.

Não criar:

login;

cadastro;

banco de dados;

dashboard;

histórico;

pagamentos;

integrações externas desnecessárias.

O projeto deve funcionar como um MVP.

A análise deve produzir resultados consistentes para a mesma entrada.

Não utilizar resultados aleatórios.

Garantir que os botões funcionem.

Garantir que a aplicação seja responsiva.

Garantir que a exportação em PDF funcione.

Priorize simplicidade, clareza e funcionamento.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cv-match-maker-86.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/08bc16bb-f2ba-46cd-9cd8-435dcae540e9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
