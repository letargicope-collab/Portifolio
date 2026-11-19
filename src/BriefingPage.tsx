import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import "./briefing.css";

type BriefingAnswers = {
  requestedServices: string[];
  otherService: string;
  businessName: string;
  businessType: string;
  marketTime: string;
  regions: string;
  audience: string;
  objectives: string[];
  otherObjective: string;
  differential: string;
  instagram: string;
  references: string;
  contentPreferences: string[];
  onCamera: string;
  availabilityDays: string[];
  bestTime: string;
  priorities: string;
  visualIdentity: string;
  plannedCampaigns: string;
  promotionChallenges: string;
  additionalNotes: string;
};

type AnswerKey = keyof BriefingAnswers;
type ChoiceField = "requestedServices" | "objectives" | "contentPreferences" | "availabilityDays";

const INITIAL_ANSWERS: BriefingAnswers = {
  requestedServices: [],
  otherService: "",
  businessName: "",
  businessType: "",
  marketTime: "",
  regions: "",
  audience: "",
  objectives: [],
  otherObjective: "",
  differential: "",
  instagram: "",
  references: "",
  contentPreferences: [],
  onCamera: "",
  availabilityDays: [],
  bestTime: "",
  priorities: "",
  visualIdentity: "",
  plannedCampaigns: "",
  promotionChallenges: "",
  additionalNotes: "",
};

const STEP_LABELS = ["O negócio", "Objetivos", "Instagram", "Produção", "Identidade"];
const SERVICES = ["Vídeo ou filme institucional", "Reels e vídeos para redes sociais", "Artes e posts para redes sociais", "Gestão de Instagram", "Cobertura de evento ou gravação", "Projeto de evento em 3D interativo", "Outro serviço"];
const OBJECTIVES = ["Atrair novos clientes", "Aumentar as vendas", "Gerar engajamento", "Fortalecer a marca", "Ser referência no segmento", "Divulgar produtos ou serviços", "Outro objetivo"];
const CONTENT_PREFERENCES = ["Reels e vídeos", "Artes e carrosséis", "Stories", "Depoimentos de clientes", "Dicas e conteúdo educativo", "Bastidores do negócio", "Ofertas e campanhas"];
const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const ON_CAMERA = ["Sim, fico à vontade", "Sim, com um pouco de orientação", "Prefiro aparecer pouco", "Prefiro não aparecer"];
const VISUAL_IDENTITY = ["Sim, tenho identidade visual definida", "Tenho algo, mas preciso organizar", "Ainda não tenho"];

const HOME_LINK = "../";

function RiseLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="60" fill="#6900ae" />
      <g fill="#fff">
        <path d="M60 7.7 105.5 33.8v52.3L89 95.5 74.4 87.2l16.3-9.4V42.1L60 24.4 29.3 42.1v52.5L14.6 86.1V33.8L60 7.7Z" />
        <path d="m60 41.2 16.3 9.4v18.7L60 78.8l-16.3-9.5V50.6L60 41.2Z" />
        <path d="m43.7 86.1 30.8 17.9L60 112.3l-16.3-9.4V86.1Z" />
      </g>
    </svg>
  );
}

function Field({
  name,
  label,
  optional = false,
  hint,
  error,
  children,
}: {
  name: AnswerKey;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`bf-field${error ? " has-error" : ""}`}>
      <div className="bf-field-heading">
        <label id={`${name}-label`} htmlFor={name}>{label}{optional && <span className="bf-optional"> opcional</span>}</label>
        {hint && <span className="bf-hint">{hint}</span>}
      </div>
      {children}
      {error && <p className="bf-field-error" id={`${name}-error`}>{error}</p>}
    </div>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      className="bf-input"
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  );
}

function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  error?: string;
}) {
  return (
    <textarea
      id={id}
      className="bf-input bf-textarea"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  );
}

function OptionGroup({
  id,
  name,
  options,
  value,
  onChange,
  multi = false,
  columns = 1,
  error,
}: {
  id: string;
  name: string;
  options: string[];
  value: string | string[];
  onChange: (option: string) => void;
  multi?: boolean;
  columns?: number;
  error?: string;
}) {
  const selected = (option: string) => multi ? (value as string[]).includes(option) : value === option;

  return (
    <div id={id} className={`bf-options bf-options-${columns}`} role={multi ? "group" : "radiogroup"} aria-label={name} aria-labelledby={`${id}-label`} aria-invalid={Boolean(error)} tabIndex={error ? -1 : undefined}>
      {options.map((option) => (
        <button
          className={`bf-option${selected(option) ? " is-selected" : ""}`}
          type="button"
          key={option}
          role={multi ? "checkbox" : "radio"}
          aria-checked={selected(option)}
          onClick={() => onChange(option)}
        >
          <span className="bf-option-mark">{multi ? (selected(option) ? <Check size={15} /> : null) : <i />}</span>
          <span>{option}</span>
        </button>
      ))}
      {error && <span className="bf-sr-only" role="alert">{error}</span>}
    </div>
  );
}

function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <select id={id} className="bf-input bf-select" value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function validateStep(step: number, answers: BriefingAnswers): Record<string, string> {
  const errors: Record<string, string> = {};
  const requiredText = (key: string, value: string, message: string) => {
    if (!value.trim()) errors[key] = message;
  };

  if (step === 0) {
    if (answers.requestedServices.length === 0) errors.requestedServices = "Selecione pelo menos um serviço.";
    if (answers.requestedServices.includes("Outro serviço")) requiredText("otherService", answers.otherService, "Descreva o outro serviço.");
    requiredText("businessName", answers.businessName, "Informe o nome da empresa.");
    requiredText("businessType", answers.businessType, "Conte o que a empresa faz ou vende.");
    requiredText("marketTime", answers.marketTime, "Selecione há quanto tempo a empresa existe.");
    requiredText("regions", answers.regions, "Informe as regiões atendidas.");
  }

  if (step === 1) {
    requiredText("audience", answers.audience, "Conte quem é o público que a empresa quer alcançar.");
    if (answers.objectives.length === 0) errors.objectives = "Escolha pelo menos um objetivo.";
    if (answers.objectives.includes("Outro objetivo")) requiredText("otherObjective", answers.otherObjective, "Descreva o outro objetivo.");
    requiredText("differential", answers.differential, "Conte o que diferencia a empresa.");
  }

  if (step === 2 && answers.contentPreferences.length === 0) {
    errors.contentPreferences = "Escolha pelo menos um tipo de conteúdo.";
  }

  if (step === 3) {
    requiredText("onCamera", answers.onCamera, "Escolha uma opção.");
    if (answers.availabilityDays.length === 0) errors.availabilityDays = "Selecione pelo menos um dia.";
    requiredText("bestTime", answers.bestTime, "Selecione o melhor horário.");
    requiredText("priorities", answers.priorities, "Conte quais conteúdos são prioridade.");
  }

  if (step === 4) requiredText("visualIdentity", answers.visualIdentity, "Selecione uma opção.");
  return errors;
}

function formatBriefing(answers: BriefingAnswers): string {
  const value = (text: string) => text.trim() || "Não informado";
  const list = (items: string[]) => items.length ? items.join(", ") : "Não informado";
  const objectives = answers.objectives.map((item) => item === "Outro objetivo" && answers.otherObjective.trim()
    ? `Outro: ${answers.otherObjective.trim()}` : item);

  return [
    "*CADASTRO DE PROJETO | AGÊNCIA RISE*",
    `*Enviado por:* ${value(answers.businessName)}`,
    "",
    "*1. PEDIDO E NEGÓCIO*",
    `*Serviço(s) solicitado(s):* ${list(answers.requestedServices.map((item) => item === "Outro serviço" && answers.otherService.trim() ? `Outro: ${answers.otherService.trim()}` : item))}`,
    `*Empresa:* ${value(answers.businessName)}`,
    `*Nicho / produtos / serviços:* ${value(answers.businessType)}`,
    `*Tempo de mercado:* ${value(answers.marketTime)}`,
    `*Regiões atendidas:* ${value(answers.regions)}`,
    "",
    "*2. PÚBLICO E OBJETIVOS*",
    `*Público-alvo:* ${value(answers.audience)}`,
    `*Objetivos:* ${list(objectives)}`,
    `*Diferencial da empresa:* ${value(answers.differential)}`,
    "",
    "*3. REDES SOCIAIS E REFERÊNCIAS*",
    `*Instagram:* ${value(answers.instagram)}`,
    `*Links de referência:* ${value(answers.references)}`,
    `*Conteúdos preferidos:* ${list(answers.contentPreferences)}`,
    "",
    "*4. GRAVAÇÕES E PRODUÇÃO*",
    `*Aparecer nos vídeos:* ${value(answers.onCamera)}`,
    `*Dias disponíveis:* ${list(answers.availabilityDays)}`,
    `*Melhor horário:* ${value(answers.bestTime)}`,
    `*Prioridades de conteúdo:* ${value(answers.priorities)}`,
    "",
    "*5. IDENTIDADE E PLANEJAMENTO*",
    `*Identidade visual:* ${value(answers.visualIdentity)}`,
    `*Eventos / campanhas previstas:* ${value(answers.plannedCampaigns)}`,
    `*Dificuldades na divulgação:* ${value(answers.promotionChallenges)}`,
    `*Informações adicionais:* ${value(answers.additionalNotes)}`,
  ].join("\n");
}

export default function BriefingPage() {
  const reduceMotion = useReducedMotion();
  const [answers, setAnswers] = useState<BriefingAnswers>(INITIAL_ANSWERS);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Cadastro de Projeto | Agência Rise";
    return () => { document.title = previousTitle; };
  }, []);

  const update = <K extends keyof BriefingAnswers>(key: K, value: BriefingAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const toggle = (key: ChoiceField, option: string) => {
    const current = answers[key];
    const next = current.includes(option) ? current.filter((item) => item !== option) : [...current, option];
    update(key, next);
  };

  const changeOption = (key: AnswerKey, value: string) => {
    if (key === "onCamera" || key === "visualIdentity") {
      setAnswers((current) => ({ ...current, [key]: value }));
      setErrors((current) => {
        if (!current[key]) return current;
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const nextStep = () => {
    const nextErrors = validateStep(step, answers);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => {
        document.querySelector<HTMLElement>(".briefing-page [aria-invalid='true'], .briefing-page .bf-option.is-selected")?.focus();
      }, 0);
      return;
    }
    setStep((current) => Math.min(current + 1, STEP_LABELS.length - 1));
  };

  const previousStep = () => {
    setErrors({});
    setSubmitError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const submitBriefing = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lastErrors = validateStep(4, answers);
    if (Object.keys(lastErrors).length) {
      setErrors(lastErrors);
      return;
    }

    const url = `https://wa.me/558287589626?text=${encodeURIComponent(formatBriefing(answers))}`;
    setWhatsAppUrl(url);
    setSubmitError("");

    // O WhatsApp abre a conversa com o texto preenchido; o usuário confirma o envio no app.
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const renderStep = () => {
    if (step === 0) return (
      <section className="bf-step" aria-labelledby="step-title-1">
        <span className="bf-step-index">ETAPA 01 / 05</span>
        <h2 id="step-title-1">Primeiro, o que você<br /><em>precisa produzir?</em></h2>
        <p className="bf-step-description">Um pouco sobre a empresa nos ajuda a pensar em ideias que façam sentido para você.</p>
        <div className="bf-fields">
          <Field name="requestedServices" label="Qual serviço você quer contratar?" hint="Escolha quantos quiser" error={errors.requestedServices}>
            <OptionGroup id="requested-services" name="Serviços solicitados" options={SERVICES} value={answers.requestedServices} onChange={(option) => toggle("requestedServices", option)} multi columns={1} error={errors.requestedServices} />
            {answers.requestedServices.includes("Outro serviço") && (
              <Field name="otherService" label="Qual é o outro serviço?" error={errors.otherService}>
                <TextInput id="otherService" value={answers.otherService} onChange={(value) => update("otherService", value)} placeholder="Descreva o serviço desejado" error={errors.otherService} />
              </Field>
            )}
          </Field>
          <Field name="businessName" label="Qual é o nome da sua empresa?" error={errors.businessName}>
            <TextInput id="businessName" value={answers.businessName} onChange={(value) => update("businessName", value)} placeholder="Ex.: Café Aurora" error={errors.businessName} />
          </Field>
          <Field name="businessType" label="O que a empresa faz ou vende?" error={errors.businessType}>
            <TextArea id="businessType" value={answers.businessType} onChange={(value) => update("businessType", value)} placeholder="Conte um pouco sobre seus produtos ou serviços" rows={3} error={errors.businessType} />
          </Field>
          <Field name="marketTime" label="Há quanto tempo a empresa está no mercado?" error={errors.marketTime}>
            <SelectField id="marketTime" value={answers.marketTime} onChange={(value) => update("marketTime", value)} placeholder="Selecione uma opção" options={["Ainda vou começar", "Menos de 1 ano", "De 1 a 3 anos", "De 3 a 5 anos", "Mais de 5 anos"]} error={errors.marketTime} />
          </Field>
          <Field name="regions" label="Quais regiões vocês atendem?" hint="Cidade, bairros ou atendimento on-line" error={errors.regions}>
            <TextInput id="regions" value={answers.regions} onChange={(value) => update("regions", value)} placeholder="Ex.: Arapiraca e região" error={errors.regions} />
          </Field>
        </div>
      </section>
    );

    if (step === 1) return (
      <section className="bf-step" aria-labelledby="step-title-2">
        <span className="bf-step-index">ETAPA 02 / 05</span>
        <h2 id="step-title-2">Para crescer, é bom saber<br /><em>aonde queremos chegar.</em></h2>
        <p className="bf-step-description">Vamos alinhar as pessoas que você quer alcançar e o que espera conquistar.</p>
        <div className="bf-fields">
          <Field name="audience" label="Quem é o público que você quer alcançar?" error={errors.audience}>
            <TextArea id="audience" value={answers.audience} onChange={(value) => update("audience", value)} placeholder="Conte como são seus clientes e o que procuram" rows={3} error={errors.audience} />
          </Field>
          <Field name="objectives" label="Quais são seus principais objetivos?" hint="Escolha quantos quiser" error={errors.objectives}>
            <OptionGroup id="objectives" name="Objetivos do negócio" options={OBJECTIVES} value={answers.objectives} onChange={(option) => toggle("objectives", option)} multi columns={2} error={errors.objectives} />
          </Field>
          {answers.objectives.includes("Outro objetivo") && (
            <Field name="otherObjective" label="Qual é o outro objetivo?" error={errors.otherObjective}>
              <TextInput id="otherObjective" value={answers.otherObjective} onChange={(value) => update("otherObjective", value)} placeholder="Conte qual" error={errors.otherObjective} />
            </Field>
          )}
          <Field name="differential" label="O que faz sua empresa ser diferente?" error={errors.differential}>
            <TextArea id="differential" value={answers.differential} onChange={(value) => update("differential", value)} placeholder="Pode ser seu jeito de atender, um produto especial ou a experiência que oferece" rows={3} error={errors.differential} />
          </Field>
        </div>
      </section>
    );

    if (step === 2) return (
      <section className="bf-step" aria-labelledby="step-title-3">
        <span className="bf-step-index">ETAPA 03 / 05</span>
        <h2 id="step-title-3">Vamos encontrar a voz<br /><em>da sua marca.</em></h2>
        <p className="bf-step-description">Suas referências ajudam a gente a entender o que combina com o seu negócio.</p>
        <div className="bf-fields">
          <Field name="instagram" label="Qual é o Instagram da empresa?" optional>
            <TextInput id="instagram" value={answers.instagram} onChange={(value) => update("instagram", value)} placeholder="@suaempresa" />
          </Field>
          <Field name="references" label="Tem perfis ou marcas que servem de referência?" optional>
            <TextArea id="references" value={answers.references} onChange={(value) => update("references", value)} placeholder="Cole links ou conte o que você gosta nessas referências" rows={3} />
          </Field>
          <Field name="contentPreferences" label="Que tipo de conteúdo você prefere?" hint="Escolha quantos quiser" error={errors.contentPreferences}>
            <OptionGroup id="contentPreferences" name="Tipos de conteúdo" options={CONTENT_PREFERENCES} value={answers.contentPreferences} onChange={(option) => toggle("contentPreferences", option)} multi columns={2} error={errors.contentPreferences} />
          </Field>
        </div>
      </section>
    );

    if (step === 3) return (
      <section className="bf-step" aria-labelledby="step-title-4">
        <span className="bf-step-index">ETAPA 04 / 05</span>
        <h2 id="step-title-4">Vamos planejar o que<br /><em>vamos produzir.</em></h2>
        <p className="bf-step-description">Queremos deixar gravações e produção confortáveis para você.</p>
        <div className="bf-fields">
          <Field name="onCamera" label="Você gosta de aparecer nos vídeos?" error={errors.onCamera}>
            <OptionGroup id="onCamera" name="Você gosta de aparecer nos vídeos?" options={ON_CAMERA} value={answers.onCamera} onChange={(option) => changeOption("onCamera", option)} error={errors.onCamera} />
          </Field>
          <Field name="availabilityDays" label="Quais dias costumam ser melhores para gravação?" hint="Escolha quantos quiser" error={errors.availabilityDays}>
            <OptionGroup id="availabilityDays" name="Dias disponíveis para gravação" options={DAYS} value={answers.availabilityDays} onChange={(option) => toggle("availabilityDays", option)} multi columns={4} error={errors.availabilityDays} />
          </Field>
          <Field name="bestTime" label="Qual horário funciona melhor?" error={errors.bestTime}>
            <SelectField id="bestTime" value={answers.bestTime} onChange={(value) => update("bestTime", value)} placeholder="Selecione uma opção" options={["Manhã", "Tarde", "Noite", "Varia conforme o dia"]} error={errors.bestTime} />
          </Field>
          <Field name="priorities" label="Que conteúdos são prioridade para você?" error={errors.priorities}>
            <TextArea id="priorities" value={answers.priorities} onChange={(value) => update("priorities", value)} placeholder="Ex.: mostrar os produtos, explicar um serviço, gravar depoimentos…" rows={3} error={errors.priorities} />
          </Field>
        </div>
      </section>
    );

    return (
      <section className="bf-step" aria-labelledby="step-title-5">
        <span className="bf-step-index">ETAPA 05 / 05</span>
        <h2 id="step-title-5">Últimos detalhes,<br /><em>grande começo.</em></h2>
        <p className="bf-step-description">Mais algumas informações para deixar nossa primeira conversa bem preparada.</p>
        <div className="bf-fields">
          <Field name="visualIdentity" label="A empresa já tem identidade visual?" error={errors.visualIdentity}>
            <OptionGroup id="visualIdentity" name="A empresa já tem identidade visual?" options={VISUAL_IDENTITY} value={answers.visualIdentity} onChange={(option) => changeOption("visualIdentity", option)} error={errors.visualIdentity} />
          </Field>
          <Field name="plannedCampaigns" label="Tem eventos, datas ou campanhas previstas?" optional>
            <TextArea id="plannedCampaigns" value={answers.plannedCampaigns} onChange={(value) => update("plannedCampaigns", value)} placeholder="Ex.: inauguração, Dia das Mães, lançamento de coleção" rows={2} />
          </Field>
          <Field name="promotionChallenges" label="O que é mais difícil na divulgação hoje?" optional>
            <TextArea id="promotionChallenges" value={answers.promotionChallenges} onChange={(value) => update("promotionChallenges", value)} placeholder="Conte quais desafios gostaria de superar" rows={2} />
          </Field>
          <Field name="additionalNotes" label="Quer acrescentar mais alguma coisa?" optional>
            <TextArea id="additionalNotes" value={answers.additionalNotes} onChange={(value) => update("additionalNotes", value)} placeholder="Qualquer detalhe que ajude a gente a conhecer melhor sua empresa" rows={2} />
          </Field>
        </div>
      </section>
    );
  };

  if (success) {
    return (
      <main className="briefing-page bf-success-page">
        <a className="bf-skip" href="#success-content">Pular para o conteúdo</a>
        <header className="bf-header">
          <a className="bf-brand" href={HOME_LINK} aria-label="Agência Rise, voltar ao site">
            <RiseLogo className="bf-brand-logo" />
            <span>agência rise<span className="bf-dot">.</span></span>
          </a>
          <a className="bf-header-link" href={HOME_LINK}>Voltar ao site <ArrowUpRight size={15} aria-hidden="true" /></a>
        </header>
        <section className="bf-success" id="success-content" aria-labelledby="success-title">
          <motion.div className="bf-success-inner" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="bf-success-icon"><Check size={32} strokeWidth={1.8} aria-hidden="true" /></span>
            <p className="bf-kicker">OBRIGADO POR ESCOLHER A RISE</p>
            <h1 id="success-title">BRIEFING ENVIADO<br /><em>COM SUCESSO!</em></h1>
            <p className="bf-success-copy">Obrigado por confiar na Agência RISE! Agora temos as informações necessárias para conhecer melhor seu negócio e começar a construir uma estratégia de conteúdo para sua empresa.</p>
            <p className="bf-send-note">O WhatsApp foi aberto com suas respostas preenchidas. Toque em <strong>Enviar</strong> na conversa para que a equipe receba seu briefing.</p>
            <div className="bf-success-actions">
              {whatsAppUrl && <a className="bf-primary-btn" href={whatsAppUrl} target="_blank" rel="noopener noreferrer">Abrir o WhatsApp <ArrowUpRight size={17} aria-hidden="true" /></a>}
              <a className="bf-secondary-btn" href={HOME_LINK}>Retornar ao site <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  return (
    <main className="briefing-page">
      <a className="bf-skip" href="#briefing-form">Pular para o formulário</a>
      <header className="bf-header">
        <a className="bf-brand" href={HOME_LINK} aria-label="Agência Rise, voltar ao site">
          <RiseLogo className="bf-brand-logo" />
          <span>agência rise<span className="bf-dot">.</span></span>
        </a>
        <a className="bf-header-link" href={HOME_LINK}>Voltar ao site <ArrowUpRight size={15} aria-hidden="true" /></a>
      </header>

      <div className="bf-shell">
        <aside className="bf-aside">
          <p className="bf-kicker"><Sparkles size={13} aria-hidden="true" /> CADASTRO DE PEDIDO DE TRABALHO</p>
          <h1>Cadastre o seu<br /><em>pedido de trabalho.</em></h1>
          <p className="bf-aside-copy">Vídeo, artes, Instagram ou evento em 3D: diga o que você precisa e a gente prepara a proposta com o cuidado que sua próxima fase merece.</p>
          <div className="bf-aside-rule" />
          <p className="bf-aside-note">Nada fica salvo no site: seu pedido vai direto para a nossa equipe pelo WhatsApp. O cadastro leva cerca de 5 minutos.</p>
          <span className="bf-aside-wordmark" aria-hidden="true">RISE<span>.</span></span>
        </aside>

        <section className="bf-panel" aria-label="Cadastro de pedido de trabalho da Agência Rise">
          <div className="bf-panel-top">
            <div>
              <p className="bf-kicker">AGÊNCIA RISE <span>/</span> CADASTRO DE PROJETO</p>
              <h2>Cadastro de pedido de trabalho</h2>
            </div>
            <span className="bf-step-count">{String(step + 1).padStart(2, "0")} <span>/</span> 05</span>
          </div>

          <div className="bf-progress" role="progressbar" aria-label="Progresso do cadastro" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step + 1}>
            <span style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }} />
          </div>
          <ol className="bf-step-list" aria-label="Etapas do cadastro">
            {STEP_LABELS.map((label, index) => (
              <li className={index === step ? "is-current" : index < step ? "is-complete" : ""} key={label} aria-current={index === step ? "step" : undefined}>
                <span>{index < step ? <Check size={12} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>
                <small>{label}</small>
              </li>
            ))}
          </ol>

          <form id="briefing-form" onSubmit={submitBriefing} noValidate>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {submitError && <p className="bf-submit-error" role="alert">{submitError}</p>}

            <div className="bf-form-nav">
              {step > 0 ? (
                <button className="bf-back-btn" type="button" onClick={previousStep}><ArrowLeft size={16} aria-hidden="true" /> Voltar</button>
              ) : <span className="bf-private-note">Sem cadastro. Suas respostas só vão para o WhatsApp da Rise.</span>}
              {step < STEP_LABELS.length - 1 ? (
                <button className="bf-next-btn" type="button" onClick={nextStep}>Continuar <ArrowRight size={17} aria-hidden="true" /></button>
              ) : (
                <button className="bf-next-btn bf-submit-btn" type="submit">ENVIAR BRIEFING PARA A RISE <ArrowUpRight size={17} aria-hidden="true" /></button>
              )}
            </div>
            {step === STEP_LABELS.length - 1 && <p className="bf-send-caption">Nada fica salvo neste site: ao enviar, a conversa do WhatsApp da agência abre já com a sua mensagem pronta e organizada. Lá, basta conferir e tocar em enviar.</p>}
          </form>
          <p className="bf-privacy-note">Agência Rise <span>·</span> Cadastro de pedido de trabalho <span>·</span> Nada é armazenado: suas respostas vão direto para o nosso WhatsApp <span>·</span> {new Date().getFullYear()}</p>
        </section>
      </div>
    </main>
  );
}