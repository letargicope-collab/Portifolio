import { ArrowRight, Play } from "lucide-react";

/**
 * Casting & Estilos — influenciadoras parceiras.
 *
 * `video` guarda o link do vídeo modelo de cada influenciadora (Vimeo, YouTube,
 * Instagram...). Enquanto estiver vazio, o botão leva ao portfólio da página
 * para assistir aos vídeos da Rise.
 */

const casting = [
  { name: "Lisbella Lins", video: "" },
  { name: "Kelly Nascimento", video: "" },
  { name: "Rulliely", video: "" },
];

const CTA_WHATSAPP = "5582987589626";

const initialsOf = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export default function CastingSection() {
  return (
    <section className="casting-section section-space" id="casting" aria-labelledby="casting-title">
      <div className="container">
        <div className="casting-head">
          <div>
            <p className="section-kicker"><span>CASTING &amp; ESTILOS</span></p>
            <h2 id="casting-title">Influenciadoras<br /><em>parceiras da Rise.</em></h2>
            <p className="casting-lead">Perfis parceiros para dar rosto e estilo às suas peças. Veja os vídeos modelo e escolha quem combina com a sua marca.</p>
          </div>
          <span className="casting-count">{String(casting.length).padStart(2, "0")} <span>/ PARCEIRAS</span></span>
        </div>

        <div className="casting-grid">
          {casting.map((person, index) => (
            <article className="casting-card" key={person.name}>
              <div className={`casting-avatar casting-avatar-${index + 1}`} aria-hidden="true">
                <span>{initialsOf(person.name)}</span>
              </div>
              <p className="casting-role">INFLUENCIADORA PARCEIRA</p>
              <h3>{person.name}</h3>
              <a
                className="casting-link"
                href={person.video || "#trabalhos"}
                {...(person.video ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Play size={15} fill="currentColor" aria-hidden="true" /> Ver vídeos modelo
              </a>
            </article>
          ))}
        </div>

        <div className="casting-cta">
          <p>Quer uma das nossas parceiras no seu projeto?</p>
          <a
            className="button button-dark"
            href={`https://wa.me/${CTA_WHATSAPP}?text=${encodeURIComponent(
              "*CASTING & ESTILOS | AGÊNCIA RISE*\n\nOlá! Tenho interesse em trabalhar com uma influenciadora parceira da Rise no meu projeto. Podem me enviar os perfis e valores?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar sobre casting <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
