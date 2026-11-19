import { useState } from "react";
import { ArrowRight, ArrowUpRight, Calculator, Check, MessageCircle, Minus, Plus, Printer } from "lucide-react";

/**
 * Calculadora de Orçamento + Catálogo de Serviços.
 *
 * - Nada é salvo: os valores e a seleção existem só na página, e o envio abre
 *   a conversa do WhatsApp com a mensagem já pronta.
 * - O catálogo e a estimativa podem ser impressos (ou salvos em PDF) pelo navegador.
 */

const BUDGET_WHATSAPP = "5582987589626"; // WhatsApp comercial da Rise (usado nos planos)

export type CatalogItem = {
  id: string;
  name: string;
  min: number;
  max?: number;
  from?: boolean;
};

export const catalogServices: CatalogItem[] = [
  { id: "video-institucional", name: "Vídeo institucional de empresa", min: 500, max: 900 },
  { id: "video-publicitario", name: "Vídeo publicitário comercial", min: 300, max: 500 },
  { id: "video-produto", name: "Vídeo de apresentação de produto", min: 200, max: 350 },
  { id: "stories-10", name: "Pacote de 10 Stories", min: 150, max: 150 },
  { id: "identidade-visual", name: "Identidade visual básica", min: 500, max: 800 },
  { id: "apresentacao-comercial", name: "Apresentação comercial em vídeo", min: 400, max: 700 },
  { id: "logo-animada", name: "Animação de logotipo", min: 150, max: 300 },
  { id: "modelagem-3d", name: "Modelagem 3D de produto", min: 300, from: true },
  { id: "video-3d", name: "Vídeo com animação 3D", min: 500, from: true },
];

export const budgetConditions = [
  "50% de entrada e 50% na entrega (ou pagamento mensal antecipado para gerenciamento).",
  "Até 2 rodadas de alterações.",
  "Alterações extras cobradas à parte.",
  "Deslocamentos fora da região sob orçamento.",
  "Prazos de entrega definidos no contrato.",
  "Arquivos brutos e projetos editáveis não inclusos.",
  "Atendimento de mensagens e SAC do Instagram não inclusos na gestão, salvo contratação adicional.",
];

export type EventPackage = {
  id: string;
  name: string;
  tier: string;
  price: number;
  suffix?: string;
  hours: string;
  features: string[];
  note?: string;
  observation?: string;
  combo?: boolean;
};

/** Pacotes de cobertura de eventos — valores definidos pelo cliente. */
export const eventPackages: EventPackage[] = [
  {
    id: "event-pequeno",
    name: "Pequeno Porte",
    tier: "DIÁRIA SIMPLES",
    price: 800,
    hours: "Até 4 horas de evento",
    features: [
      "1 Videomaker.",
      "1 Aftermovie (até 1 min).",
      "Stories em tempo real.",
    ],
  },
  {
    id: "event-medio",
    name: "Médio Porte",
    tier: "DIÁRIA COMPLETA",
    price: 1500,
    hours: "Evento de 1 dia",
    features: [
      "1 Aftermovie principal.",
      "1 Reel extra.",
      "Stories em tempo real.",
      "Captação com drone.",
    ],
  },
  {
    id: "event-grande",
    name: "Grande Porte",
    tier: "MULTI-DIÁRIAS",
    price: 2500,
    suffix: "+",
    hours: "Multi-diárias",
    features: [
      "Festas grandes, feiras e cavalgadas.",
      "Equipe completa.",
      "Múltiplos Reels.",
      "Cobertura intensiva.",
      "Captação com drone.",
    ],
  },
  {
    id: "event-combo-3d",
    name: "Combo Experience 3D",
    tier: "EXPERIÊNCIA COMPLETA",
    price: 3000,
    hours: "Cobertura audiovisual + Projeto 3D",
    combo: true,
    features: [
      "Cobertura profissional do evento.",
      "Filmagem e fotografia profissional.",
      "Captação com drone.",
      "Vídeos editados do evento.",
      "Stories e registros dos bastidores.",
      "Modelagem 3D personalizada do projeto ou espaço.",
      "Renderização 3D de alta qualidade.",
      "Apresentação visual do projeto em imagens e vídeos.",
      "Integração do material 3D com a produção audiovisual.",
    ],
    observation: "O valor de R$ 3.000 considera projetos 3D de complexidade padrão. Projetos maiores ou com modelagem muito detalhada poderão ter orçamento adicional.",
  },
];

/** Pacotes de casamento — preços de tabela (âncora) e promocionais. */
export type WeddingPackage = {
  id: string;
  name: string;
  subtitle: string;
  anchor: number;
  promo: number;
  features: string[];
};

export const weddingPackages: WeddingPackage[] = [
  {
    id: "wed-video",
    name: "Casamento — Só Vídeo",
    subtitle: "Filme Cinematográfico",
    anchor: 2000,
    promo: 1500,
    features: [
      "Cobertura audiovisual completa da cerimônia e recepção",
      "Filme do Casamento (edição refinada e color grading profissional)",
      "Teaser / Reels com os melhores momentos",
      "Captação de áudio de lapela limpo na cerimônia",
      "Imagens aéreas de drone (conforme condições de segurança)",
    ],
  },
  {
    id: "wed-photo",
    name: "Casamento — Foto + Vídeo",
    subtitle: "Cobertura Completa",
    anchor: 3500,
    promo: 2500,
    features: [
      "Equipe dedicada (videomaker + fotógrafo + apoio)",
      "Cobertura fotográfica completa com galeria tratada em alta resolução",
      "Filme Oficial + teaser dinâmico para Instagram",
      "Takes aéreos panorâmicos de drone",
      "Cobertura completa de ponta a ponta (cerimônia + festa)",
    ],
  },
];

/** Política comercial de eventos e casamentos (exibida como rodapé dos preços). */
/** Cobertura da cerimônia do casamento — dois formatos, apenas durante a cerimônia. */
export type WeddingCeremony = {
  id: string;
  name: string;
  subtitle: string;
  scope: string;
  options: { label: string; price: number }[];
};

export const weddingCeremony: WeddingCeremony = {
  id: "wed-ceremony",
  name: "Cobertura da Cerimônia",
  subtitle: "Cerimônia do casamento",
  scope: "Esse valor vale apenas na cerimônia.",
  options: [
    { label: "Vídeo profissional", price: 1200 },
    { label: "Foto e vídeo incluso", price: 1800 },
  ],
};

export const eventPolicy = [
  "50% no ato da reserva da data e 50% quitados impreterivelmente até o dia do evento.",
  "A data é reservada somente após a confirmação do sinal.",
  "Deslocamentos fora da região imediata têm custos de transporte e diária orçados à parte.",
];

export const eventConditions = [
  { service: "Hora extra", value: "R$ 200" },
  { service: "Deslocamento", value: "Sob orçamento" },
  { service: "Hospedagem", value: "Sob orçamento" },
  { service: "Drone", value: "Sujeito ao clima e autorizações de voo" },
];

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const budgetWhatsappLink = (message: string) =>
  `https://wa.me/${BUDGET_WHATSAPP}?text=${encodeURIComponent(message)}`;

const priceLabel = (item: CatalogItem) =>
  item.from || item.max === undefined
    ? `A partir de ${formatBRL(item.min)}`
    : item.min === item.max
      ? formatBRL(item.min)
      : `${formatBRL(item.min)} – ${formatBRL(item.max)}`;

/** Imprime só o bloco escolhido: catálogo ou estimativa. */
function printOnly(which: "catalog" | "calc") {
  const body = document.body;
  const className = which === "catalog" ? "print-catalog" : "print-calc";
  const cleanup = () => {
    body.classList.remove("print-catalog", "print-calc");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  body.classList.add(className);
  window.print();
  window.setTimeout(cleanup, 2000);
}

function PrintHeader({ title }: { title: string }) {
  return (
    <div className="print-only print-head">
      <strong>AGÊNCIA RISE</strong>
      <span>{title} · {new Date().toLocaleDateString("pt-BR")}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- Calculadora */

export function BudgetCalculator() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [client, setClient] = useState("");
  const [notes, setNotes] = useState("");

  const step = (id: string, delta: number) =>
    setQty((current) => ({ ...current, [id]: Math.max(0, Math.min(99, (current[id] ?? 0) + delta)) }));

  // Serviços do catálogo + pacotes de cobertura de eventos.
  const selectable = [
    ...catalogServices.map((item) => ({ id: item.id, name: item.name, min: item.min, label: priceLabel(item) })),
    ...eventPackages.map((pkg) => ({ id: pkg.id, name: pkg.name, min: pkg.price, label: `${formatBRL(pkg.price)}${pkg.suffix ?? ""}` })),
  ];
  const selected = selectable.filter((item) => (qty[item.id] ?? 0) > 0);
  const total = selected.reduce((sum, item) => sum + item.min * (qty[item.id] ?? 0), 0);
  const signal = total / 2;

  const message = [
    "*SOLICITAÇÃO DE ORÇAMENTO | AGÊNCIA RISE*",
    `*Nome:* ${client.trim() || "Não informado"}`,
    "",
    "*SERVIÇOS SELECIONADOS*",
    ...selected.map((item) => `• ${item.name} (${qty[item.id]}x) — ${item.label}`),
    "",
    notes.trim() ? `*Observações:* ${notes.trim()}` : "",
    "",
    `*Total estimado (a partir de):* ${formatBRL(total)}`,
    `*Sinal de 50%:* ${formatBRL(signal)}`,
    `*Restante 50% na entrega:* ${formatBRL(signal)}`,
    "",
    "*CONDIÇÕES*",
    ...budgetConditions.map((condition) => `• ${condition}`),
    "",
    "_Estimativa gerada no site da Agência Rise._",
  ].filter((line, index, all) => !(line === "" && all[index - 1] === "" && all[index + 1] === "")).join("\n");

  return (
    <section className="calculator-section section-space" id="calculadora" aria-labelledby="calculator-title">
      <div className="container">
        <PrintHeader title="Estimativa de orçamento" />

        <div className="calc-head">
          <div>
            <p className="section-kicker"><span>CALCULADORA DE ORÇAMENTO</span></p>
            <h2 id="calculator-title">Simule e veja<br /><em>o sinal na hora.</em></h2>
            <p className="calc-lead">Escolha os serviços, ajuste as quantidades e acompanhe o valor total e o sinal de 50% em tempo real. Ao final, envie a seleção pronta para a Rise pelo WhatsApp — ou imprima a estimativa.</p>
          </div>
          <button className="calc-print no-print" type="button" onClick={() => printOnly("calc")}>
            <Printer size={16} aria-hidden="true" /> Imprimir estimativa
          </button>
        </div>

        <div className="calc-layout">
          <div className="calc-services" role="group" aria-label="Serviços para orçamento">
            {catalogServices.map((item, index) => {
              const current = qty[item.id] ?? 0;
              return (
                <div className={`calc-row${current > 0 ? " is-selected" : ""}`} key={item.id}>
                  <div className="calc-row-info">
                    <span className="calc-row-index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{priceLabel(item)}</p>
                    </div>
                  </div>
                  <div className="calc-stepper" role="group" aria-label={`Quantidade de ${item.name}`}>
                    <button type="button" aria-label={`Remover uma unidade de ${item.name}`} onClick={() => step(item.id, -1)} disabled={current === 0}>
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <span aria-live="polite" aria-label={`${current} unidade(s)`}>{current}</span>
                    <button type="button" aria-label={`Adicionar uma unidade de ${item.name}`} onClick={() => step(item.id, 1)}>
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
            <p className="calc-group-label">RISE — COBERTURA DE EVENTOS</p>
            {eventPackages.map((pkg, index) => {
              const current = qty[pkg.id] ?? 0;
              return (
                <div className={`calc-row calc-row-event${current > 0 ? " is-selected" : ""}`} key={pkg.id}>
                  <div className="calc-row-info">
                    <span className="calc-row-index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{pkg.name}{pkg.combo && <em className="calc-row-tag">3D</em>}</h3>
                      <p>{formatBRL(pkg.price)}{pkg.suffix ?? ""} · {pkg.hours}</p>
                    </div>
                  </div>
                  <div className="calc-stepper" role="group" aria-label={`Quantidade de ${pkg.name}`}>
                    <button type="button" aria-label={`Remover uma unidade de ${pkg.name}`} onClick={() => step(pkg.id, -1)} disabled={current === 0}>
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <span aria-live="polite" aria-label={`${current} unidade(s)`}>{current}</span>
                    <button type="button" aria-label={`Adicionar uma unidade de ${pkg.name}`} onClick={() => step(pkg.id, 1)}>
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
            <p className="calc-note">Valores de referência. O total é calculado com o valor mínimo de cada serviço — o fechamento final é combinado no orçamento.</p>
          </div>

          <aside className="calc-summary" aria-label="Resumo do orçamento">
            <p className="calc-summary-label">VALOR TOTAL (A PARTIR DE)</p>
            <p className="calc-total" aria-live="polite">{formatBRL(total)}</p>

            <div className="calc-split">
              <div>
                <span>Sinal de entrada (50%)</span>
                <strong>{formatBRL(signal)}</strong>
              </div>
              <div>
                <span>Na entrega (50%)</span>
                <strong>{formatBRL(signal)}</strong>
              </div>
            </div>

            <div className="calc-fields">
              <label>
                <span>Seu nome ou da empresa</span>
                <input type="text" value={client} onChange={(event) => setClient(event.target.value)} placeholder="Ex.: Mercado Bom Preço" autoComplete="organization" />
              </label>
              <label>
                <span>O que você precisa? (opcional)</span>
                <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: 4 Reels + 10 Artes + influenciadora parceira" />
              </label>
            </div>

            {selected.length === 0 ? (
              <p className="calc-empty">Selecione ao menos um serviço ao lado para gerar o orçamento.</p>
            ) : (
              <a className="calc-whatsapp no-print" href={budgetWhatsappLink(message)} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={19} aria-hidden="true" /> Enviar seleção no WhatsApp
              </a>
            )}

            <button className="calc-print calc-print-wide no-print" type="button" onClick={() => printOnly("calc")}>
              <Printer size={16} aria-hidden="true" /> Imprimir ou salvar em PDF
            </button>

            <p className="calc-conditions">50% de entrada e 50% na entrega · até 2 rodadas de alterações · condições completas no <a href="#catalogo">catálogo</a>.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Catálogo */

export function ServiceCatalog() {
  const generalMessage = [
    "*CATÁLOGO DE SERVIÇOS | AGÊNCIA RISE*",
    "",
    "Olá! Estou vendo o catálogo de serviços de vocês e gostaria de um orçamento.",
    "",
    ...catalogServices.map((item) => `• ${item.name} — ${priceLabel(item)}`),
    "",
    "Podem me enviar as condições completas?",
  ].join("\n");

  return (
    <section className="catalog-section section-space" id="catalogo" aria-labelledby="catalog-title">
      <div className="container">
        <PrintHeader title="Catálogo de serviços" />

        <div className="catalog-head">
          <div>
            <p className="section-kicker"><span>CATÁLOGO DE SERVIÇOS</span></p>
            <h2 id="catalog-title">Tudo o que a Rise<br /><em>produz para você.</em></h2>
            <p className="catalog-lead">Valores de referência para você planejar. Imprima o catálogo inteiro ou salve em PDF, e fale com a gente para fechar o orçamento.</p>
          </div>
          <div className="catalog-head-actions no-print">
            <a className="catalog-jump" href="#calculadora">
              <Calculator size={16} aria-hidden="true" /> Abrir a calculadora
            </a>
            <button className="catalog-print" type="button" onClick={() => printOnly("catalog")}>
              <Printer size={16} aria-hidden="true" /> Baixar / imprimir catálogo
            </button>
          </div>
        </div>

        <a className="catalog-events no-print" href="#eventos">
          <span className="catalog-events-kicker">RISE — COBERTURA DE EVENTOS</span>
          <strong>Pacotes de R$ 800 a R$ 3.000</strong>
          <em>Essencial, Profissional, Premium e Combo Experience 3D — cobertura audiovisual + projeto 3D.</em>
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>

        <div className="catalog-grid">
          {catalogServices.map((item, index) => {
            const hasRange = item.max !== undefined && item.max > item.min;
            const kicker = item.from || item.max === undefined ? "A PARTIR DE" : item.min === item.max ? "VALOR DO SERVIÇO" : "VALOR DE REFERÊNCIA";
            return (
              <article className="value-card" key={item.id}>
                <div className="value-card-top">
                  <span className="value-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="value-kicker">{kicker}</span>
                </div>

                <h3>{item.name}</h3>

                <div className="value-price">
                  <span className="value-amount"><i>R$</i>{item.min.toLocaleString("pt-BR")}</span>
                  {hasRange && <span className="value-range">até R$ {item.max!.toLocaleString("pt-BR")}</span>}
                </div>

                <a
                  className="value-cta no-print"
                  href={budgetWhatsappLink(
                    `*ORÇAMENTO | AGÊNCIA RISE*\n\nOlá! Gostaria de um orçamento para: ${item.name}.\nFaixa de valor informada: ${priceLabel(item)}.\n\nPodem me enviar as condições?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir orçamento <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>

        <div className="catalog-conditions">
          <p className="catalog-conditions-title">CONDIÇÕES GERAIS</p>
          <ul>
            {budgetConditions.map((condition) => (
              <li key={condition}><Check size={15} aria-hidden="true" />{condition}</li>
            ))}
          </ul>
        </div>

        <div className="catalog-actions no-print">
          <a className="button button-dark" href={budgetWhatsappLink(generalMessage)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" /> Falar sobre um serviço <ArrowRight size={17} aria-hidden="true" />
          </a>
          <button className="catalog-print" type="button" onClick={() => printOnly("catalog")}>
            <Printer size={16} aria-hidden="true" /> Imprimir catálogo
          </button>
        </div>
      </div>
    </section>
  );
}
