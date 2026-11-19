# Agência Rise — Portfólio

Site institucional/portfólio da **Agência Rise** construído com **React + Vite + Tailwind CSS**.
Mostra os trabalhos em vídeo (Vimeo), os serviços — vídeos e artes, projetos de eventos em 3D
interativo e marketing para comércios —, os planos mensais, um briefing de novos clientes e um
botão de contato direto pelo WhatsApp.

## Stack

- **React 19** + **Vite 7** + **TypeScript**
- **Tailwind CSS 4** (estilos em `src/index.css`)
- **Framer Motion** (animações) e **lucide-react** (ícones)
- **@vimeo/player** (prévias em loop e player completo na própria página)
- **vite-plugin-singlefile** (o build gera um único `dist/index.html` com JS/CSS embutidos)

## Rodando localmente

```bash
npm install        # instala as dependências
npm run dev        # sobe o site em http://localhost:5173
```

## Gerando o build de produção

```bash
npm run build      # gera a pasta dist/
node scripts/fix-paths.mjs dist/index.html
npm run preview    # pré-visualiza o build em http://localhost:4173
```

> Os comandos acima geram `dist/index.html`, `dist/briefing/index.html` e as imagens de `public/`.

### Pedido rápido (janela na página inicial)

Ao clicar em **Briefing** (menu, menu do celular ou rodapé), um formulário abre **na própria página
inicial**, como uma janela. Nada é navegado nem recarregado — por isso não há como dar "not found".

O cliente escolhe o que precisa produzir, preenche os dados do negócio e clica em
"ENVIAR PELO WHATSAPP". A conversa da agência abre com a mensagem já pronta e organizada,
para conferir e mandar. **Nada fica salvo**: sem cadastro, sem servidor e sem banco de dados.

**Agendamento:** o cliente escolhe entre **cliente fixo** (dia da semana da gravação + data de início)
ou **cliente avulso** (data desejada, formato — vídeo, foto, 3D ou vídeo e foto —, o que será produzido
e para que será usado). Só os campos do tipo escolhido aparecem.

Arquivos: `src/OrderForm.tsx` (janela) e os estilos ao final de `src/briefing.css`.
O número do WhatsApp fica em `WHATSAPP_DIGITS`, no topo de `src/OrderForm.tsx`.

### Página completa de briefing (`/briefing/`)

A rota `/briefing/` é a área onde o cliente cadastra o que precisa produzir e os dados do negócio,
em cinco etapas. No GitHub Pages ela é gerada em `dist/briefing/index.html`, para abrir diretamente
sem depender de um fallback de SPA.

**Nada fica salvo no site**: não há cadastro, login, servidor nem banco de dados. Ao clicar em
"ENVIAR BRIEFING PARA A RISE", a conversa do WhatsApp da agência abre com a mensagem já pronta e
organizada (negrito e quebras de linha); o cliente confere e confirma o envio dentro do WhatsApp.

---

## Publicando no GitHub Pages

### ⚠️ Se a página ficou em branco depois de subir no GitHub

Página branca **com o título certo na aba** = o GitHub está publicando o arquivo de **origem**
(`index.html` da raiz, que carrega `/src/main.tsx` — código TypeScript que não existe na web) em
vez do **build**. Duas causas possíveis, nas duas o site nunca é o gerado:

1. **Settings → Pages → Source = "Deploy from a branch"** (pasta raiz) — troque para **GitHub Actions**
   (Opção A abaixo).
2. **O workflow não está rodando** — ele tinha uma etapa sem `run`, o que faz o GitHub rejeitar o
   arquivo inteiro. Isso foi corrigido neste repositório (`.github/workflows/deploy.yml`).

**Conferir:** GitHub → aba **Actions** → o workflow "Publicar no GitHub Pages" deve estar **verde**.
Se estiver vermelho, clique nele e veja a etapa que falhou.

> Localizei a causa reproduzindo a URL real (`/siteagenciarise/`): o build renderiza perfeitamente
> (9 vídeos, 7 artes de Instagram, 0 erros e 0 `404`), e a simulação do código de origem gerava
> exatamente a tela branca do print.

### Opção A — GitHub Actions (recomendada)

O workflow em `.github/workflows/deploy.yml` **constrói e publica sozinho** a cada push.

1. Suba o código do projeto para o repositório (`main`).
2. No GitHub: **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **GitHub Actions** e salve.
4. Abra a aba **Actions** e aguarde o workflow ficar verde.
5. O site aparece em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

### Opção B — Pasta `docs/` (sem Actions)

```bash
./deploy.sh    # gera dist/ e espelha tudo em docs/
git add -A && git commit -m "Site publicado"
git push
```

No GitHub: **Settings → Pages → Source: Deploy from a branch** → branch `main` → pasta `/docs` → **Save**.

> O `deploy.sh` gera `dist/` e espelha em `docs/`; o `docs/` vai versionado no Git de propósito.
> Rode `./deploy.sh` sempre que alterar o código para atualizar as duas pastas.

> **Por que os caminhos são relativos?** O GitHub Pages publica em uma subpasta
> (`usuario.github.io/repo/`). O `scripts/fix-paths.mjs` deixa tudo em `./images/...` e cria
> `docs/briefing/index.html` (página física do cadastro).

---

## Como editar o conteúdo

Quase todo o conteúdo fica em **`src/App.tsx`**, no topo do arquivo:

| O que | Onde |
| --- | --- |
| **Vídeos (Vimeo)** | Array `videos` — `id`, `title`, `category`, `duration`, `orientation` e `posterFallback` |
| **Número de WhatsApp** | Constantes `whatsappNumber` (exibição) e `whatsappLink` (link `wa.me/...`) |
| **Serviços** | Array `services` (vídeos e artes, eventos 3D, marketing) |
| **Perfis de Instagram (artes)** | Array `igProfiles` — `handle`, `name`, `initials`, `highlights` (destaques), `cover` (capa de vídeo opcional) |
| **Clientes do letreiro** | Array `clients` |
| **Programas do estúdio** | Array `studioTools` (nome, sigla e função de cada programa) |
| **Clipes da timeline** | Arrays `studioTracks` (vídeo/gráficos) e `studioPages` — ilustração animada, sem imagens de clientes |
| **Planos mensais** | Array `plans` (4 planos com valor, itens, selo e mensagem de WhatsApp) |
| **WhatsApp dos planos** | `planWhatsappLink` no topo de `src/App.tsx` (número comercial dos planos) |
| **Calculadora de orçamento** | `catalogServices` em `src/BudgetSection.tsx` (serviços e valores de referência) |
| **Cobertura de eventos** | `eventPackages` em `src/BudgetSection.tsx` — Pequeno Porte R$ 800, Médio Porte R$ 1.500, Grande Porte R$ 2.500+ e Combo Experience 3D R$ 3.000 (`src/EventPackages.tsx`) |
| **Casamentos** | `weddingPackages`, `weddingCeremony` e `eventPolicy` em `src/BudgetSection.tsx` — Só Vídeo (de R$ 2.000, a partir de R$ 1.500), Foto + Vídeo (de R$ 3.500, a partir de R$ 2.500) e **Cobertura da Cerimônia** (R$ 1.200 vídeo / R$ 1.800 foto + vídeo, apenas na cerimônia), em `src/WeddingPackages.tsx` |
| **Condições de contrato** | `budgetConditions` no mesmo arquivo (7 itens) |
| **Casting & Estilos** | array `casting` em `src/CastingSection.tsx` — preencha `video` com o link do vídeo modelo |
| **Perguntas frequentes** | Array `faqs` |
| **Frases/destaques** | Direto no JSX do componente `App` (hero, seções, rodapé) |

Imagens ficam em **`public/images/`** e as capas dos vídeos em **`public/images/videos/`**.

### Calculadora, catálogo e impressão

- **Calculadora de orçamento** (`#calculadora`): o total usa o **valor mínimo** de cada serviço
  (por isso aparece como "a partir de"), e o sinal de 50% é recalculado na hora.
- **Tema escuro cinematográfico:** as seções de serviços, planos, eventos, casamentos, calculadora e
  catálogo usam preto grafite `#0D0D0D`, roxo profundo `#6C2BD9` e verde neon `#00FF66`. Na impressão
  essas seções voltam a claro automaticamente (via tokens CSS).
- **Cobertura de eventos** (`#eventos`): três diárias (Pequeno Porte R$ 800, Médio Porte R$ 1.500,
  Grande Porte R$ 2.500+) mais o Combo Experience 3D R$ 3.000, com condições adicionais em tabela.
- **Catálogo** (`#catalogo`): os 9 serviços em **cartões de preço** (valor de referência grande
  e o intervalo logo abaixo), as 7 condições, um botão de orçamento por serviço e o atalho
  **"Abrir a calculadora"**.
- **Imprimir / salvar em PDF:** os botões usam a impressão do navegador. O CSS em `@media print`
  esconde o resto da página e mostra só o bloco escolhido (catálogo **ou** estimativa) — no diálogo
  de impressão, escolha "Salvar como PDF" para baixar.
- **WhatsApp:** os botões novos usam o número comercial `5582987589626` (definido em
  `budgetWhatsappLink`, em `src/BudgetSection.tsx`).

### Trocar os vídeos

Cole o `id` do vídeo do Vimeo (o número do link `vimeo.com/123456789` → `123456789`) e uma imagem
de capa em `public/images/videos/<id>.jpg`. As prévias rodam sem som em loop e, ao clicar, o vídeo
completo abre na própria página.

### Trocar o número de WhatsApp

Atualize as duas constantes no topo de `src/App.tsx`:

```ts
const whatsappNumber = "+55 82 8758-9626";
const whatsappLink = (message: string) => `https://wa.me/558287589626?text=${encodeURIComponent(message)}`;
```

(o número no `wa.me/` é só os dígitos, sem `+`, espaços ou traços).

## Fotos e números reais dos perfis do Instagram

As artes dos perfis na seção "Instagram organizado" já aceitam a foto real e os números de cada cliente:

- **Foto de perfil:** salve a imagem em `public/images/instagram/<perfil>.jpg`
  (ex.: `public/images/instagram/otica_florees.jpg`). Quadrada, ~400 px. Se o arquivo não existir, aparecem as iniciais.
- **Publicações, seguidores e seguindo:** preencha `stats` no perfil em `igProfiles` (`src/App.tsx`), por exemplo
  `stats: { posts: "247", followers: "5.147", following: "169" }`. Sem `stats`, aparecem barras neutras.
- Os números são uma foto do momento: atualize de tempos em tempos.

## Estrutura do projeto

```
├─ index.html                 # HTML base (título, meta, favicon, fontes)
├─ public/
│  ├─ favicon.svg
│  └─ images/                 # imagens do site + capas dos vídeos
├─ scripts/
│  └─ fix-paths.mjs           # ajusta caminhos p/ GitHub Pages (usado no deploy)
├─ src/
│  ├─ App.tsx                 # todo o conteúdo e layout da página
│  ├─ index.css               # estilos (Tailwind + CSS próprio)
│  ├─ main.tsx
│  └─ utils/cn.ts
├─ .github/workflows/deploy.yml  # publicação automática no Pages
└─ deploy.sh                  # build local + ajuste de caminhos
```
