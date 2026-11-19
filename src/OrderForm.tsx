import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, MessageCircle, Sparkles, X } from "lucide-react";

/**
 * Pedido rápido — formulário que abre como janela sobre a página inicial.
 *
 * Nada é salvo: ao enviar, a conversa do WhatsApp da Agência Rise abre já com a
 * mensagem do cliente pronta e organizada, para conferir e mandar.
 */

const WHATSAPP_DIGITS = "558287589626";

const WEEK_DAYS = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
const FORMATS = ["Vídeo", "Foto", "3D", "Vídeo e foto"];
const NEEDS = [
  "Vídeo institucional",
  "Reels / vídeos para redes",
  "Artes e posts",
  "Gestão de Instagram",
  "Cobertura de evento",
  "Projeto de evento em 3D",
  "Fotos dos produtos",
  "Outro",
];

type Values = {
  name: string;
  business: string;
  needs: string[];
  other: string;
  instagram: string;
  region: string;
  clientType: "" | "fixo" | "avulso";
  weeklyDay: string;
  startDate: string;
  oneOffDate: string;
  oneOffFormat: string;
  oneOffWhat: string;
  oneOffPurpose: string;
  details: string;
};

const EMPTY: Values = {
  name: "", business: "", needs: [], other: "", instagram: "", region: "",
  clientType: "", weeklyDay: "", startDate: "", oneOffDate: "", oneOffFormat: "",
  oneOffWhat: "", oneOffPurpose: "", details: "",
};

/** 2026-05-12 -> 12/05/2026 (o WhatsApp do cliente recebe a data em BR). */
function dateBr(iso: string) {
  const [year, month, day] = iso.split("-");
  return year && month && day ? `${day}/${month}/${year}` : iso;
}

export default function OrderForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [values, setValues] = useState<Values>(EMPTY);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  const close = () => {
    onClose();
    setError("");
    setSent(false);
    setValues(EMPTY);
  };

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const toggleNeed = (need: string) => {
    setValues((current) => ({
      ...current,
      needs: current.needs.includes(need) ? current.needs.filter((item) => item !== need) : [...current.needs, need],
    }));
    setError("");
  };

  const buildMessage = () => {
    const needs = values.needs.map((need) => (need === "Outro" && values.other.trim() ? `Outro: ${values.other.trim()}` : need));
    const line = (label: string, value: string) => (value.trim() ? `*${label}:* ${value.trim()}\n` : "");
    return [
      "*PEDIDO DE ORÇAMENTO | AGÊNCIA RISE*",
      `*Enviado por:* ${values.name.trim()}`,
      "",
      "*O QUE PRECISA*",
      ...needs.map((need) => `• ${need}`),
      "",
      "*SOBRE O NEGÓCIO*",
      line("Empresa", values.name),
      line("O que faz / vende", values.business),
      line("Instagram", values.instagram),
      line("Região", values.region),
      "",
      "*AGENDAMENTO*",
      values.clientType === "fixo"
        ? line("Tipo de cliente", "Cliente fixo (mensal)")
          + line("Dia semanal de gravação", values.weeklyDay)
          + line("Início", dateBr(values.startDate))
        : line("Tipo de cliente", "Cliente avulso (pontual)")
          + line("Data desejada", dateBr(values.oneOffDate))
          + line("Formato", values.oneOffFormat)
          + line("O que será", values.oneOffWhat)
          + line("Para que será", values.oneOffPurpose),
      line("Detalhes", values.details),
      "",
      "_Enviado pelo site da Agência Rise._",
    ].join("\n");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.name.trim()) { setError("Escreva seu nome ou o nome da empresa."); return; }
    if (values.needs.length === 0) { setError("Escolha pelo menos um serviço."); return; }
    if (values.needs.includes("Outro") && !values.other.trim()) { setError("Conte qual é o outro serviço."); return; }
    if (!values.clientType) { setError("Escolha se você é cliente fixo ou avulso."); return; }
    if (values.clientType === "fixo") {
      if (!values.weeklyDay) { setError("Escolha o dia da semana da gravação."); return; }
      if (!values.startDate) { setError("Informe a data de início."); return; }
    } else {
      if (!values.oneOffDate) { setError("Informe a data desejada."); return; }
      if (!values.oneOffFormat) { setError("Escolha o formato: vídeo, foto ou 3D."); return; }
      if (!values.oneOffWhat.trim()) { setError("Conte o que será produzido."); return; }
      if (!values.oneOffPurpose.trim()) { setError("Conte para que será usado."); return; }
    }
    const url = `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <dialog
      ref={dialogRef}
      className="order-dialog"
      aria-labelledby="order-title"
      onClose={close}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <AnimatePresence>
        {sent && (
          <motion.div
            className="order-success"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            <span className="order-success-mark" aria-hidden="true"><Check size={30} strokeWidth={3} /></span>
            <h2>PEDIDO PRONTO NO WHATSAPP!</h2>
            <p>
              A conversa com a Agência Rise abriu com a sua mensagem já escrita e organizada.
              Confira e toque em enviar por lá.
            </p>
            <p className="order-success-note">Nada fica salvo neste site — suas respostas existem só nessa conversa.</p>
            <div className="order-success-actions">
              <button className="order-btn order-btn-primary" type="button" onClick={close}>Fechar <Check size={17} aria-hidden="true" /></button>
              <button className="order-btn order-btn-ghost" type="button" onClick={() => { setSent(false); setValues(EMPTY); }}>Fazer outro pedido</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="order-form" onSubmit={submit} noValidate>
        <div className="order-top">
          <span className="order-kicker"><Sparkles size={13} aria-hidden="true" /> PEDIDO RÁPIDO PELO WHATSAPP</span>
          <button className="order-close" type="button" aria-label="Fechar pedido" onClick={close}><X size={20} aria-hidden="true" /></button>
        </div>

        <h2 className="order-title" id="order-title" ref={headingRef} tabIndex={-1}>
          Conte o que você<br /><em>precisa produzir.</em>
        </h2>
        <p className="order-lead">
          Responda o essencial e a conversa do WhatsApp da Rise abre com a sua mensagem já pronta.
          Nada fica salvo neste site.
        </p>

        {error && <p className="order-error" role="alert">{error}</p>}

        <div className="order-body">
          <fieldset className="order-group">
            <legend>O que você precisa? <b>*</b></legend>
            <div className="order-chips">
              {NEEDS.map((need) => (
                <button key={need} type="button" className="order-chip" aria-pressed={values.needs.includes(need)} onClick={() => toggleNeed(need)}>
                  {values.needs.includes(need) && <Check size={13} strokeWidth={3} aria-hidden="true" />}
                  {need}
                </button>
              ))}
            </div>
            {values.needs.includes("Outro") && (
              <input
                className="order-input"
                type="text"
                value={values.other}
                onChange={(event) => set("other", event.target.value)}
                placeholder="Qual é o outro serviço?"
                aria-label="Qual é o outro serviço?"
              />
            )}
          </fieldset>

          <div className="order-grid">
            <label className="order-field">
              <span>Seu nome ou da empresa <b>*</b></span>
              <input className="order-input" type="text" value={values.name} onChange={(event) => set("name", event.target.value)} placeholder="Ex.: Mercado Bom Preço" autoComplete="organization" />
            </label>
            <label className="order-field">
              <span>O que faz ou vende</span>
              <input className="order-input" type="text" value={values.business} onChange={(event) => set("business", event.target.value)} placeholder="Ex.: Supermercado e açougue" />
            </label>
            <label className="order-field">
              <span>Instagram (se tiver)</span>
              <input className="order-input" type="text" value={values.instagram} onChange={(event) => set("instagram", event.target.value)} placeholder="Ex.: @mercadobompreco" autoComplete="off" />
            </label>
            <label className="order-field">
              <span>Onde você atende</span>
              <input className="order-input" type="text" value={values.region} onChange={(event) => set("region", event.target.value)} placeholder="Ex.: Centro e bairro Jardins" />
            </label>
            <fieldset className="order-group order-schedule">
              <legend>Quando você quer produzir? <b>*</b></legend>
              <div className="order-type" role="radiogroup" aria-label="Tipo de cliente">
                <button type="button" className="order-type-btn" aria-pressed={values.clientType === "fixo"} onClick={() => set("clientType", "fixo")}>
                  <Check size={14} strokeWidth={3} aria-hidden="true" /> Cliente fixo (mensal)
                </button>
                <button type="button" className="order-type-btn" aria-pressed={values.clientType === "avulso"} onClick={() => set("clientType", "avulso")}>
                  <Check size={14} strokeWidth={3} aria-hidden="true" /> Cliente avulso (pontual)
                </button>
              </div>

              {values.clientType === "fixo" && (
                <div className="order-type-fields">
                  <div className="order-field">
                    <span>Dia da semana da gravação <b>*</b></span>
                    <select className="order-input" value={values.weeklyDay} onChange={(event) => set("weeklyDay", event.target.value)} aria-label="Dia da semana da gravação">
                      <option value="">Selecione o dia</option>
                      {WEEK_DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>
                  <div className="order-field">
                    <span>Data de início <b>*</b></span>
                    <input className="order-input" type="date" value={values.startDate} onChange={(event) => set("startDate", event.target.value)} aria-label="Data de início" />
                  </div>
                </div>
              )}

              {values.clientType === "avulso" && (
                <div className="order-type-fields">
                  <div className="order-field">
                    <span>Data desejada <b>*</b></span>
                    <input className="order-input" type="date" value={values.oneOffDate} onChange={(event) => set("oneOffDate", event.target.value)} aria-label="Data desejada" />
                  </div>
                  <div className="order-field">
                    <span>O que você quer? <b>*</b></span>
                    <div className="order-chips">
                      {FORMATS.map((format) => (
                        <button key={format} type="button" className="order-chip" aria-pressed={values.oneOffFormat === format} onClick={() => set("oneOffFormat", format)}>{format}</button>
                      ))}
                    </div>
                  </div>
                  <div className="order-field">
                    <span>O que será produzido <b>*</b></span>
                    <input className="order-input" type="text" value={values.oneOffWhat} onChange={(event) => set("oneOffWhat", event.target.value)} placeholder="Ex.: Vídeo de lançamento da coleção nova" />
                  </div>
                  <div className="order-field">
                    <span>Para que será usado <b>*</b></span>
                    <input className="order-input" type="text" value={values.oneOffPurpose} onChange={(event) => set("oneOffPurpose", event.target.value)} placeholder="Ex.: Divulgar no Instagram e no WhatsApp dos clientes" />
                  </div>
                </div>
              )}
            </fieldset>
            <label className="order-field order-field-full">
              <span>Detalhes que achar importante</span>
              <textarea className="order-input" rows={3} value={values.details} onChange={(event) => set("details", event.target.value)} placeholder="Conte o que imagina: estilo, duração, o que mostrar…" />
            </label>
          </div>
        </div>

        <div className="order-actions">
          <button className="order-btn order-btn-primary" type="submit">
            <MessageCircle size={18} aria-hidden="true" /> ENVIAR PELO WHATSAPP <ArrowRight size={17} aria-hidden="true" />
          </button>
          <p className="order-note">A conversa abre com a mensagem pronta — você só confere e envia.</p>
        </div>
      </form>
    </dialog>
  );
}
