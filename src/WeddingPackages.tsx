import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { budgetWhatsappLink, eventPolicy, formatBRL, weddingCeremony, weddingPackages, type WeddingPackage } from "./BudgetSection";

/**
 * Casamentos RISE — dois pacotes com preço de tabela (âncora) e preço promocional.
 * Nada é salvo na página: os botões abrem o WhatsApp com a mensagem pronta.
 */

const messageFor = (pkg: WeddingPackage) =>
  [
    "*CASAMENTOS | AGÊNCIA RISE*",
    "",
    `Olá! Tenho interesse no ${pkg.name} — ${pkg.subtitle}.`,
    `Preço promocional: ${formatBRL(pkg.promo)} (tabela: ${formatBRL(pkg.anchor)}).`,
    "",
    "O que está incluído:",
    ...pkg.features.map((feature) => `• ${feature}`),
    "",
    "Podem me enviar mais informações e disponibilidade de data?",
  ].join("\n");

function WeddingPrintHead() {
  return (
    <div className="print-only print-head">
      <strong>AGÊNCIA RISE</strong>
      <span>Casamentos · {new Date().toLocaleDateString("pt-BR")}</span>
    </div>
  );
}

function WeddingCard({ pkg, index }: { pkg: WeddingPackage; index: number }) {
  return (
    <article className="wedding-card">
      <div className="event-card-top">
        <span className="event-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="event-tier">{index === 0 ? "SÓ VÍDEO" : "FOTO + VÍDEO"}</span>
      </div>

      <h3>{pkg.name}</h3>
      <p className="wedding-subtitle">{pkg.subtitle}</p>

      <div className="wedding-price">
        <span className="wedding-anchor">De {formatBRL(pkg.anchor)}</span>
        <span className="wedding-amount"><i>A partir de</i>{" "}<strong><b>R$</b>{pkg.promo.toLocaleString("pt-BR")}</strong></span>
      </div>

      <ul className="event-features">
        {pkg.features.map((feature) => (
          <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>
        ))}
      </ul>

      <a className="wedding-cta no-print" href={budgetWhatsappLink(messageFor(pkg))} target="_blank" rel="noopener noreferrer">
        Quero este pacote <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </article>
  );
}

export default function WeddingPackages() {
  return (
    <section className="casamentos-section section-space" id="casamentos" aria-labelledby="wedding-title">
      <div className="container">
        <WeddingPrintHead />

        <div className="wedding-head">
          <div>
            <p className="section-kicker"><span>CASAMENTOS RISE</span></p>
            <h2 id="wedding-title">O dia mais importante,<br /><em>eternizado.</em></h2>
            <p className="wedding-lead">Filmes cinematográficos e coberturas completas, com preço de tabela transparente e condições especiais de lançamento.</p>
          </div>
          <a className="events-jump events-jump-ghost no-print" href="#eventos">Ver cobertura de eventos</a>
        </div>

        <div className="wedding-grid">
          {weddingPackages.map((pkg, index) => <WeddingCard pkg={pkg} index={index} key={pkg.id} />)}
        </div>

        <article className="wedding-ceremony">
          <div className="wedding-ceremony-main">
            <div className="event-card-top">
              <span className="event-index">03</span>
              <span className="event-tier">SÓ CERIMÔNIA</span>
            </div>
            <h3>{weddingCeremony.name}</h3>
            <p className="wedding-subtitle">{weddingCeremony.subtitle}</p>
            <p className="wedding-scope">{weddingCeremony.scope}</p>
            <a
              className="wedding-cta no-print"
              href={budgetWhatsappLink(
                [
                  "*CASAMENTOS | AGÊNCIA RISE*",
                  "",
                  "Olá! Tenho interesse na Cobertura da Cerimônia do casamento:",
                  ...weddingCeremony.options.map((option) => `• ${option.label} — ${formatBRL(option.price)}`),
                  "",
                  `*Abrangência:* ${weddingCeremony.scope}`,
                  "",
                  "Podem me enviar mais informações e disponibilidade de data?",
                ].join("\n")
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero a cerimônia <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="wedding-ceremony-options">
            {weddingCeremony.options.map((option) => (
              <div className="wedding-option" key={option.label}>
                <span className="wedding-option-label">{option.label}</span>
                <span className="wedding-option-price"><b>R$</b>{option.price.toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </article>

        <div className="event-policy no-print">
          <div className="event-policy-head">
            <ShieldCheck size={20} aria-hidden="true" />
            <p>POLÍTICA COMERCIAL PARA EVENTOS E CASAMENTOS</p>
          </div>
          <ul>
            {eventPolicy.map((item) => (
              <li key={item}><Check size={15} aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
