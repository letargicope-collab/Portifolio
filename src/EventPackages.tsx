import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { budgetWhatsappLink, eventConditions, eventPackages, formatBRL, type EventPackage } from "./BudgetSection";

/**
 * RISE — Cobertura de Eventos.
 *
 * Diárias de Pequeno, Médio e Grande Porte + o Combo Experience 3D.
 * Nada é salvo na página: os botões abrem o WhatsApp com a mensagem pronta.
 */

const messageFor = (pkg: EventPackage) =>
  [
    "*COBERTURA DE EVENTOS | AGÊNCIA RISE*",
    "",
    `Olá! Tenho interesse na ${pkg.name} — ${formatBRL(pkg.price)}${pkg.suffix ?? ""} (${pkg.hours}).`,
    "",
    "Inclui:",
    ...pkg.features.map((feature) => `• ${feature}`),
    "",
    "Podem me enviar mais informações, disponibilidade e as condições?",
  ].join("\n");

function EventPrintHead() {
  return (
    <div className="print-only print-head">
      <strong>AGÊNCIA RISE</strong>
      <span>Cobertura de eventos · {new Date().toLocaleDateString("pt-BR")}</span>
    </div>
  );
}

function EventCard({ pkg, index }: { pkg: EventPackage; index: number }) {
  return (
    <article className={`event-card${index === 0 ? " event-card-entry" : ""}`}>
      <div className="event-card-top">
        <span className="event-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="event-tier">{pkg.tier}</span>
      </div>
      {index === 0 && <span className="event-highlight">ORÇAMENTO INICIAL</span>}

      <h3>{pkg.name}</h3>

      <div className="event-price">
        <span className="event-amount"><i>R$</i>{pkg.price.toLocaleString("pt-BR")}{pkg.suffix ?? ""}</span>
        <span className="event-hours">{pkg.hours}</span>
      </div>

      <ul className="event-features">
        {pkg.features.map((feature) => (
          <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>
        ))}
      </ul>

      <a className="event-cta no-print" href={budgetWhatsappLink(messageFor(pkg))} target="_blank" rel="noopener noreferrer">
        Quero este pacote <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </article>
  );
}

export default function EventPackages() {
  const main = eventPackages.filter((pkg) => !pkg.combo);
  const combo = eventPackages.find((pkg) => pkg.combo)!;

  return (
    <section className="events-section section-space" id="eventos" aria-labelledby="events-title">
      <div className="container">
        <EventPrintHead />

        <div className="events-head">
          <div>
            <p className="section-kicker"><span>RISE — COBERTURA DE EVENTOS</span></p>
            <h2 id="events-title">Seu evento, do primeiro<br /><em>ao último detalhe.</em></h2>
            <p className="events-lead">Diárias de pequeno, médio e grande porte para eventos institucionais e sociais — e o Combo Experience 3D, que une a cobertura completa à modelagem 3D do projeto ou espaço.</p>
          </div>
          <div className="events-head-actions no-print">
            <a className="events-jump events-jump-ghost" href="#casamentos">Casamentos</a>
            <a className="events-jump" href="#calculadora">Simular no orçamento <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>

        <div className="events-grid">
          {main.map((pkg, index) => <EventCard pkg={pkg} index={index} key={pkg.id} />)}
        </div>

        <article className="event-combo">
          <div className="event-combo-main">
            <div className="event-card-top">
              <span className="event-index">04</span>
              <span className="event-tier">{combo.tier}</span>
            </div>
            <span className="event-highlight event-highlight-light">PROJETO 3D EM DESTAQUE</span>
            <h3>{combo.name}</h3>
            <div className="event-price">
              <span className="event-amount"><i>R$</i>{combo.price.toLocaleString("pt-BR")}</span>
              <span className="event-hours">{combo.hours}</span>
            </div>
            <p className="event-observation">{combo.observation}</p>
            <a className="event-cta event-cta-light no-print" href={budgetWhatsappLink(messageFor(combo))} target="_blank" rel="noopener noreferrer">
              Quero o Combo Experience 3D <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="event-combo-features">
            <p className="event-combo-title">O QUE ESTÁ INCLUSO</p>
            <ul className="event-features">
              {combo.features.map((feature) => (
                <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className="event-conditions-wrap">
          <div className="event-conditions">
            <p className="event-conditions-title">CONDIÇÕES ADICIONAIS</p>
            <table>
              <thead>
                <tr><th scope="col">Serviço</th><th scope="col">Valor</th></tr>
              </thead>
              <tbody>
                {eventConditions.map((row) => (
                  <tr key={row.service}><th scope="row">{row.service}</th><td>{row.value}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
