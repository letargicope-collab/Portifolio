import { useEffect, useRef, useState, type ReactNode } from "react";
import Player from "@vimeo/player";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, CalendarDays, Check, Clapperboard, Heart, Info, LayoutGrid, Megaphone, Menu, MessageCircle, Palette, Pause, Pill, Play, Plus, Search, Sparkles, Tag, TrendingUp, Users, X } from "lucide-react";
import BriefingPage from "./BriefingPage";
import OrderForm from "./OrderForm";
import CastingSection from "./CastingSection";
import { BudgetCalculator, ServiceCatalog } from "./BudgetSection";
import EventPackages from "./EventPackages";
import WeddingPackages from "./WeddingPackages";

const whatsappNumber = "+55 82 8758-9626";
const whatsappLink = (message: string) => `https://wa.me/558287589626?text=${encodeURIComponent(message)}`;
// WhatsApp comercial usado APENAS nos botões de planos (definido pelo cliente nesta atualização).
const planWhatsappLink = (message: string) => `https://wa.me/5582987589626?text=${encodeURIComponent(message)}`;
const contactLink = whatsappLink("Olá! Gostaria de conversar sobre os serviços da Agência Rise.");

type VideoProject = {
  id: string;
  title: string;
  category: string;
  duration: string;
  orientation: "landscape" | "portrait";
  posterFallback: string;
};

const videos: VideoProject[] = [
  {
    id: "1241010885",
    title: "Campanha Política",
    category: "DOIS RIACHOS, AL",
    duration: "02:23",
    orientation: "landscape",
    posterFallback: "https://i.vimeocdn.com/video/2218932197-864ba60b13187b664648ad2d1530410447f19e723d0c055fbc509e3cf8958e86-d_1280?region=us",
  },
  {
    id: "1241009042",
    title: "Vaquejada Pajeú",
    category: "AFTERMOVIE",
    duration: "01:30",
    orientation: "landscape",
    posterFallback: "https://i.vimeocdn.com/video/2218928757-1947aff1c8a982d257898f1892ee833358934f02996b22b79df3b3e1d2ae951b-d_1280?region=us",
  },
  {
    id: "1241128214",
    title: "Aniversário de 1 ano",
    category: "FESTA INFANTIL",
    duration: "02:45",
    orientation: "landscape",
    posterFallback: "https://i.vimeocdn.com/video/2219070139-8acc2acad72eba668821809ded390e02eaf30b649d49a61486a3350415e83c8f-d_1280?region=us",
  },
  {
    id: "1241010558",
    title: "MJ e Plantec",
    category: "EXPO BACIA LEITEIRA",
    duration: "00:52",
    orientation: "portrait",
    posterFallback: "https://i.vimeocdn.com/video/2218930971-4a14f6d1e949998ab6d4bb40a981b44f5a1745756e0a88b713131f2f954f4665-d_540?region=us",
  },
  {
    id: "1241010417",
    title: "Aroma Cosméticos",
    category: "PRODUÇÃO DE MARCA",
    duration: "00:20",
    orientation: "portrait",
    posterFallback: "https://i.vimeocdn.com/video/2218930276-c663e5b1b82f07b2df9229d8caf2d99e4017638498f36880411fc9162e4599e1-d_540?region=us",
  },
  {
    id: "1241010414",
    title: "Ótica Flores",
    category: "PRODUÇÃO DE MARCA",
    duration: "00:35",
    orientation: "portrait",
    posterFallback: "https://i.vimeocdn.com/video/2218930645-ea1f2361b58c1725843585ec7d8b30c5e71c6dd983cd578364f38464235a22e9-d_540?region=us",
  },
  {
    id: "1241010415",
    title: "Pousada Flor do Sertão",
    category: "PRODUÇÃO DE MARCA",
    duration: "00:39",
    orientation: "portrait",
    posterFallback: "https://i.vimeocdn.com/video/2218930686-7472ab5a9c938b1190204a391814212d303763aa920e553b1e684568d03b43b8-d_540?region=us",
  },
  {
    id: "1241010416",
    title: "Cavalgada da Independência",
    category: "DIVULGAÇÃO DE EVENTO",
    duration: "01:29",
    orientation: "portrait",
    posterFallback: "https://i.vimeocdn.com/video/2218931506-f8a6b8df56e4effbda65fe39ad762ed697894b1d17b1a51b1e7abfa7f64558a3-d_540?region=us",
  },
  {
    id: "1241128480",
    title: "Super Connect",
    category: "AÇÃO: CASADINHA",
    duration: "00:33",
    orientation: "portrait",
    posterFallback: "https://i.vimeocdn.com/video/2219070278-85f94feb751b1eead8a0b0bdc79824d2b3b81bcd2541727ca5df7caaf0b00ec6-d_540?region=us",
  },
];

const services = [
  {
    number: "01",
    title: "Vídeos e artes.",
    copy: "Conteúdo criativo para apresentar sua marca, divulgar produtos e conectar seu negócio com as pessoas.",
  },
  {
    number: "02",
    title: "Eventos em 3D.",
    copy: "Projetos interativos em 3D para visualizar espaços e explorar ideias para o seu evento.",
  },
  {
    number: "03",
    title: "Marketing e Instagram.",
    copy: "Gestão de Instagram com métricas e estudo, mais planejamento e conteúdo para atrair novos clientes.",
  },
];

const plans = [
  {
    number: "01",
    name: "Plano Personalizado",
    tag: "OPÇÃO DE ENTRADA",
    featured: false,
    price: "500",
    pricePrefix: "A partir de",
    description: "Indicado para pequenas empresas, profissionais autônomos e negócios que precisam de uma presença profissional no Instagram, mas possuem uma demanda menor de conteúdo.",
    scopeNote: "Escopo reduzido e personalizado: a quantidade de conteúdos, vídeos e atividades será definida conforme a necessidade de cada cliente.",
    features: [
      "Quantidade reduzida de publicações",
      "Artes personalizadas",
      "Conteúdo adaptado à necessidade da empresa",
      "Legendas e hashtags",
      "Planejamento básico de conteúdo",
      "Organização das publicações",
    ],
    message: "Olá! Tenho interesse em um plano de gestão de Instagram a partir de R$ 500 mensais. Minha empresa possui uma demanda menor de conteúdo e gostaria de receber uma proposta personalizada.",
    action: "SOLICITAR PROPOSTA",
  },
  {
    number: "02",
    name: "Plano Rise Essencial",
    tag: null,
    featured: false,
    price: "800",
    pricePrefix: null,
    description: "Indicado para empresas que desejam manter uma presença profissional e constante no Instagram.",
    scopeNote: null,
    features: [
      "3 publicações por semana",
      "Artes personalizadas",
      "2 vídeos por mês",
      "Criação de legendas e hashtags",
      "Planejamento mensal de conteúdo",
      "Agendamento das publicações",
    ],
    message: "Olá! Tenho interesse no plano RISE Essencial de R$ 800 mensais. Gostaria de mais informações.",
    action: "QUERO ESSE PLANO",
  },
  {
    number: "03",
    name: "Plano Rise Profissional",
    tag: "MAIS CONTRATADO",
    featured: true,
    price: "1.200",
    pricePrefix: null,
    description: "Indicado para empresas que desejam uma presença digital mais ativa, estratégica e profissional.",
    scopeNote: null,
    features: [
      "5 publicações por semana",
      "Artes e carrosséis personalizados",
      "1 vídeo por semana",
      "Edição profissional de vídeos",
      "Legendas estratégicas",
      "Planejamento semanal",
      "Agendamento das publicações",
      "Gerenciamento do Instagram",
    ],
    message: "Olá! Tenho interesse no plano RISE Profissional de R$ 1.200 mensais. Gostaria de mais informações.",
    action: "QUERO ESSE PLANO",
  },
  {
    number: "04",
    name: "Plano Rise Premium",
    tag: "MAIS COMPLETO",
    featured: false,
    price: "1.800",
    pricePrefix: null,
    description: "Indicado para empresas que desejam uma gestão mais completa e uma produção de conteúdo mais intensa.",
    scopeNote: null,
    features: [
      "5 a 6 publicações por semana",
      "2 vídeos por semana",
      "Artes e carrosséis personalizados",
      "Planejamento estratégico",
      "Planejamento de Stories",
      "Captação presencial programada",
      "Gerenciamento completo do Instagram",
      "Relatório mensal de desempenho",
    ],
    message: "Olá! Tenho interesse no plano RISE Premium de R$ 1.800 mensais. Gostaria de mais informações.",
    action: "QUERO ESSE PLANO",
  },
];

// Informações de contratação exibidas abaixo dos planos.
const contractTerms = [
  "Os valores são mensais.",
  "O pagamento é antecipado.",
  "O início dos serviços acontece após a confirmação do pagamento e alinhamento inicial.",
  "O escopo do plano personalizado é definido individualmente.",
  "Serviços extras e investimento em tráfego pago não estão incluídos nos valores apresentados.",
];

// Clientes e parceiros exibidos no letreiro "histórias contadas ao lado de".
// A tipografia alterna (serifada / caixa-alta) pelo índice, para um ritmo editorial.
const clients = [
  "Aroma",
  "ÓTICA FLORES",
  "Flor do Sertão",
  "MJ & PLANTEC",
  "Farmácia São Marcos",
  "JOZÉLIA CAVALCANTE",
  "Humanize",
  "DR. ANA BERTHO",
  "Jorginho Duca",
  "ZÉ LUIZ DOS ANJOS",
  "Superconnect",
  "P2 OUTLET",
  "Edson Gomes",
  "DETONAUTAS",
];

const clientClass = (index: number) =>
  ["audience-serif", "audience-caps", "audience-serif audience-italic", "audience-caps"][index % 4];

const faqs = [
  {
    question: "Posso assistir aos vídeos sem sair da página?",
    answer:
      "Sim. É só escolher um projeto e clicar no play para assistir ao vídeo completo aqui mesmo, com os controles do player.",
  },
  {
    question: "Por que as prévias começam sem som?",
    answer:
      "As prévias são reproduzidas sem áudio para que possam começar automaticamente. Ao abrir o vídeo completo, você pode controlar o som no player.",
  },
  {
    question: "A Rise cuida do Instagram do meu negócio?",
    answer:
      "Sim. Fazemos a gestão do Instagram com acompanhamento de métricas, estudo de público e conteúdo, criação de artes e a organização completa do perfil: bio, destaques e grade de publicações.",
  },
  {
    question: "Quais programas a Rise utiliza?",
    answer:
      "Trabalhamos com DaVinci Resolve, Premiere Pro, After Effects, Blender, Twinmotion, Photoshop e Lightroom, entre outros, escolhendo a ferramenta certa para cada projeto.",
  },
  {
    question: "Quais serviços a Agência Rise oferece?",
    answer:
      "Trabalhamos com vídeos, artes, gestão de Instagram, projetos de eventos em 3D interativo e marketing para comércios que querem crescer no digital.",
  },
  {
    question: "Vocês têm planos mensais para comércios?",
    answer:
      "Sim. São quatro planos mensais: Personalizado (a partir de R$ 500), Rise Essencial (R$ 800), Rise Profissional (R$ 1.200) e Rise Premium (R$ 1.800). Os valores são mensais, com pagamento antecipado, e o escopo do plano personalizado é definido individualmente.",
  },
  {
    question: "Que tipos de comércio podem contratar?",
    answer:
      "Atendemos negócios locais como lojas, mercados, restaurantes, salões, óticas, pousadas e outros comércios que desejam fortalecer sua presença digital.",
  },
  {
    question: "Como funciona o projeto de evento em 3D?",
    answer:
      "O projeto em 3D interativo ajuda a visualizar o espaço e explorar as ideias do evento antes de sua realização. Os detalhes são definidos para cada projeto.",
  },
];

function RisePaths() {
  return (
    <>
      <path d="M60 7.7 105.5 33.8v52.3L89 95.5 74.4 87.2l16.3-9.4V42.1L60 24.4 29.3 42.1v52.5L14.6 86.1V33.8L60 7.7Z" />
      <path d="m60 41.2 16.3 9.4v18.7L60 78.8l-16.3-9.5V50.6L60 41.2Z" />
      <path d="m43.7 86.1 30.8 17.9L60 112.3l-16.3-9.4V86.1Z" />
    </>
  );
}

function RiseSymbol({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="currentColor" aria-hidden="true">
      <RisePaths />
    </svg>
  );
}

function RiseLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="60" fill="#6900ae" />
      <g fill="#fff"><RisePaths /></g>
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M8.7 7.9c.2-.4.4-.4.7-.4h.4c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.6.7c-.1.2-.1.3 0 .5.4.8 1 1.4 1.7 1.9.4.3.8.5 1.2.7.2.1.4.1.5-.1l.8-.9c.2-.2.4-.3.6-.2l1.6.8c.3.1.4.3.4.5 0 .4-.2 1.1-.7 1.4-.5.4-1.2.6-1.9.4-1-.2-2.3-.8-3.5-1.9-1.1-1-1.9-2.1-2.2-3.1-.3-.8-.2-1.7.3-2.9Z" />
    </svg>
  );
}

function Brand({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <a className={`brand ${className}`} href="#inicio" aria-label="Agência Rise, voltar ao início" onClick={onClick}>
      <RiseLogo className="brand-mark" />
      <span className="brand-word">agência rise<span className="brand-period">.</span></span>
    </a>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function VimeoPreview({ video, paused, className = "" }: { video: VideoProject; paused: boolean; className?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const pausedRef = useRef(paused);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    pausedRef.current = paused;
    const player = playerRef.current;
    if (!player) return;
    if (paused) {
      void player.pause().catch(() => undefined);
    } else {
      void player.play().catch(() => undefined);
    }
  }, [paused]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || reduceMotion) return;

    let active = true;
    let rewinding = false;
    const player = new Player(iframe);
    playerRef.current = player;

    const onPlaying = () => {
      if (active) setPlaying(true);
    };
    const onTimeUpdate = ({ seconds }: { seconds: number }) => {
      if (seconds < 15 || rewinding || pausedRef.current) return;
      rewinding = true;
      void player.setCurrentTime(0).catch(() => undefined).finally(() => { rewinding = false; });
    };

    player.on("playing", onPlaying);
    player.on("timeupdate", onTimeUpdate);
    void player.ready().then(() => {
      if (active && !pausedRef.current) return player.play();
    }).catch(() => undefined);

    return () => {
      active = false;
      player.off("playing", onPlaying);
      player.off("timeupdate", onTimeUpdate);
      if (playerRef.current === player) playerRef.current = null;
      // Strict Mode replays effects on connected iframes; only destroy detached players.
      window.setTimeout(() => { if (!iframe.isConnected) void player.destroy().catch(() => undefined); }, 0);
    };
  }, [video.id, reduceMotion]);

  return (
    <div className={`vimeo-preview ${className}`} aria-hidden="true">
      <img src={`/images/videos/${video.id}.jpg`} alt="" onError={(event) => {
        const image = event.currentTarget;
        if (image.dataset.fallback === "true") image.style.visibility = "hidden";
        else { image.dataset.fallback = "true"; image.src = video.posterFallback; }
      }} />
      {!reduceMotion && (
        <iframe
          ref={iframeRef}
          className={playing ? "is-playing" : ""}
          src={`https://player.vimeo.com/video/${video.id}?autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&controls=0&title=0&byline=0&portrait=0&dnt=1&max_quality=540p`}
          title={`Prévia de ${video.title}`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

function VideoCard({ video, index, paused, onOpen }: { video: VideoProject; index: number; paused: boolean; onOpen: (video: VideoProject) => void }) {
  return (
    <Reveal className="video-card" delay={(index % 5) * 0.07}>
      <div className={`video-media video-media-${video.orientation}`}>
        <VimeoPreview video={video} paused={paused} />
        <button className="video-trigger" type="button" onClick={() => onOpen(video)} aria-label={`Assistir ao vídeo completo: ${video.title}`}>
          <span className="video-play-icon"><Play size={19} fill="currentColor" strokeWidth={1.6} aria-hidden="true" /></span>
          <span className="video-trigger-label">ASSISTIR AO FILME</span>
        </button>
      </div>
      <div className="video-info">
        <div>
          <p>{String(index + 1).padStart(2, "0")} / {video.category}</p>
          <h3>{video.title}</h3>
        </div>
        <span>{video.duration}</span>
      </div>
    </Reveal>
  );
}

function FullVideoPlayer({ video }: { video: VideoProject }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let active = true;
    const player = new Player(iframe);
    const timeout = window.setTimeout(() => { if (active) setSlow(true); }, 15000);
    const onError = (error?: { name?: string }) => { if (active && error?.name !== "NotAllowedError") setSlow(true); };

    player.on("error", onError);
    void player.ready().then(() => {
      if (!active) return;
      window.clearTimeout(timeout);
      setSlow(false);
      void player.play().catch(() => undefined);
    }).catch(onError);

    return () => {
      active = false;
      window.clearTimeout(timeout);
      player.off("error", onError);
      window.setTimeout(() => { if (!iframe.isConnected) void player.destroy().catch(() => undefined); }, 0);
    };
  }, [video.id, attempt]);

  return (
    <div className={`full-player full-player-${video.orientation}`}>
      <iframe
        key={`${video.id}-${attempt}`}
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${video.id}?autoplay=1&muted=0&loop=0&playsinline=1&dnt=1`}
        title={`Vídeo completo: ${video.title}`}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {slow && (
        <div className="player-message" role="status">
          <p>O vídeo está demorando para carregar. Verifique sua conexão e tente novamente.</p>
          <button type="button" onClick={() => { setSlow(false); setAttempt((current) => current + 1); }}>Tentar novamente</button>
        </div>
      )}
    </div>
  );
}

type IgTile = { kind: "brand" | "light" | "ink" | "photo"; label?: string };

type IgProfile = {
  handle: string;
  name: string;
  initials: string;
  tagline?: string;
  highlights: string[];
  cover?: string;
  stats?: { posts: string; followers: string; following: string };
  offset: number;
  labels?: Record<string, string>;
};

// Padrão da grade de publicações: alterna cores e tipos de post para o perfil ficar harmônico.
const igTilePattern: IgTile[] = [
  { kind: "brand", label: "PROMOÇÃO" },
  { kind: "light", label: "DICA" },
  { kind: "photo" },
  { kind: "light", label: "NOVIDADE" },
  { kind: "ink", label: "OFERTA" },
  { kind: "brand", label: "BASTIDORES" },
  { kind: "photo" },
  { kind: "brand", label: "DEPOIMENTO" },
  { kind: "light", label: "CONTATO" },
];

const igDefaultHighlights = ["Promoções", "Novidades", "Sobre nós", "Contato", "Dúvidas"];

const igProfiles: IgProfile[] = [
  { handle: "farmaciasaomarcos_oficial", name: "Farmácia São Marcos", initials: "SM", tagline: "A FARMÁCIA DE TODA FAMÍLIA.", highlights: ["Promoção", "Medicamentos", "Informação", "Quem somos", "Novidades"], stats: { posts: "247", followers: "5.147", following: "169" }, offset: 0 },
  { handle: "humanize.oaf", name: "Humanize", initials: "H", highlights: igDefaultHighlights, offset: 2 },
  { handle: "aromacosmeticoss", name: "Aroma Cosméticos", initials: "AC", highlights: igDefaultHighlights, cover: "1241010417", offset: 4 },
  { handle: "superconnectbr", name: "Superconnect", initials: "SC", highlights: igDefaultHighlights, offset: 1 },
  { handle: "otica_florees", name: "Ótica Flores", initials: "OF", highlights: igDefaultHighlights, cover: "1241010414", offset: 3 },
  { handle: "jorginho_duca", name: "Jorginho Duca", initials: "JD", highlights: ["Ações", "Agenda", "Quem sou", "Notícias", "Contato"], offset: 5, labels: { "PROMOÇÃO": "AÇÃO", "OFERTA": "AGENDA", "NOVIDADE": "NOTÍCIA", "DICA": "AVISO" } },
  { handle: "p2outlet", name: "P2 Outlet", initials: "P2", highlights: igDefaultHighlights, offset: 6 },
];

const igPillars = [
  { icon: <TrendingUp size={20} strokeWidth={1.6} aria-hidden="true" />, title: "Métricas", copy: "Acompanhamos os números do perfil para entender o que funciona e ajustar a estratégia." },
  { icon: <Search size={20} strokeWidth={1.6} aria-hidden="true" />, title: "Estudo e estratégia", copy: "Estudamos o público e o mercado para decidir o que, como e quando publicar." },
  { icon: <Palette size={20} strokeWidth={1.6} aria-hidden="true" />, title: "Criação de artes", copy: "Artes e vídeos com a identidade do seu negócio, prontos para feed, stories e reels." },
  { icon: <LayoutGrid size={20} strokeWidth={1.6} aria-hidden="true" />, title: "Perfil organizado", copy: "Bio, destaques e grade alinhados para que cada visita ao perfil vire um contato." },
];

function HighlightIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  const props = { size: 20, strokeWidth: 1.7, "aria-hidden": true } as const;
  if (key.includes("promo")) return <Tag {...props} />;
  if (key.includes("medic")) return <Pill {...props} />;
  if (key.includes("inform") || key.includes("dúv")) return <Info {...props} />;
  if (key.includes("quem") || key.includes("sobre")) return <Users {...props} />;
  if (key.includes("agenda")) return <CalendarDays {...props} />;
  if (key.includes("novid") || key.includes("not")) return <Megaphone {...props} />;
  if (key.includes("contato")) return <MessageCircle {...props} />;
  return <Sparkles {...props} />;
}

// Fotos reais de perfil (opcionais): coloque o arquivo em
// public/images/instagram/<perfil>.jpg e registre aqui. Só o que estiver
// listado é requisitado — assim o site publicado não gera 404.
const igAvatarPhotos: Record<string, string> = {
  // "otica_florees": "/images/instagram/otica_florees.jpg",
};

function IgAvatar({ profile }: { profile: IgProfile }) {
  const photo = igAvatarPhotos[profile.handle];
  return (
    <span className="ig-avatar">
      <span>
        {profile.initials}
        {photo && <img src={photo} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
      </span>
    </span>
  );
}

// Capa de vídeo na grade: tenta o arquivo local, depois a capa do Vimeo e, por fim, um quadrado de reel.
function IgPhotoTile({ coverId }: { coverId: string }) {
  const fallback = videos.find((video) => video.id === coverId)?.posterFallback;
  const [src, setSrc] = useState(`/images/videos/${coverId}.jpg`);
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="ig-tile ig-tile-reel"><Play size={18} fill="currentColor" strokeWidth={1.5} aria-hidden="true" /></span>;
  return (
    <span className="ig-tile">
      <img src={src} alt="" loading="lazy" onError={() => { if (fallback && src !== fallback) setSrc(fallback); else setFailed(true); }} />
    </span>
  );
}

function InstagramMock({ profile }: { profile: IgProfile }) {
  const tiles = Array.from({ length: 9 }, (_, position) => igTilePattern[(position + profile.offset) % igTilePattern.length]);

  return (
    <div className="ig-mock" role="img" aria-label={`Ilustração conceitual do perfil @${profile.handle}, com bio, destaques e grade de publicações organizados`}>
      <div className="ig-top">@{profile.handle}</div>
      <div className="ig-head">
        <IgAvatar profile={profile} />
        <div className="ig-bio">
          <strong>{profile.name}</strong>
          {profile.tagline ? <em>{profile.tagline}</em> : <i className="ig-line" />}
          <i className="ig-line ig-line-short" />
          <i className="ig-line ig-line-link" />
        </div>
      </div>
      <div className="ig-stats">
        {([["posts", "publicações"], ["followers", "seguidores"], ["following", "seguindo"]] as const).map(([key, label]) => (
          <span key={key}>{profile.stats ? <b>{profile.stats[key]}</b> : <i className="ig-stat-skeleton" />}<small>{label}</small></span>
        ))}
      </div>
      <div className="ig-actions"><span className="ig-btn ig-btn-primary">Seguir</span><span className="ig-btn">Mensagem</span></div>
      <div className="ig-highlights">
        {profile.highlights.map((label) => (
          <span className="ig-highlight" key={label}>
            <span className="ig-highlight-ring"><HighlightIcon label={label} /></span>
            <span className="ig-highlight-label">{label}</span>
          </span>
        ))}
      </div>
      <div className="ig-tabs"><LayoutGrid size={17} aria-hidden="true" /><Clapperboard size={17} aria-hidden="true" /><Heart size={17} aria-hidden="true" /></div>
      <div className="ig-grid">
        {tiles.map((tile, position) => {
          if (tile.kind === "photo") {
            return profile.cover ? (
              <IgPhotoTile key={position} coverId={profile.cover} />
            ) : (
              <span className="ig-tile ig-tile-reel" key={position}><Play size={18} fill="currentColor" strokeWidth={1.5} aria-hidden="true" /></span>
            );
          }
          const label = tile.label ? profile.labels?.[tile.label] ?? tile.label : "";
          return <span className={`ig-tile ig-tile-${tile.kind}`} key={position}>{label}</span>;
        })}
      </div>
    </div>
  );
}

function InstagramCard({ profile, index }: { profile: IgProfile; index: number }) {
  return (
    <Reveal className="ig-card" delay={(index % 4) * 0.07}>
      <InstagramMock profile={profile} />
      <a className="ig-handle" href={`https://www.instagram.com/${profile.handle}/`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o Instagram @${profile.handle} em uma nova aba`}>
        @{profile.handle} <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </Reveal>
  );
}

const studioTools = [
  { abbr: "Dr", name: "DaVinci Resolve", role: "Edição e correção de cor" },
  { abbr: "Pr", name: "Premiere Pro", role: "Edição de vídeo" },
  { abbr: "Ae", name: "After Effects", role: "Motion graphics e efeitos visuais" },
  { abbr: "Bl", name: "Blender", role: "Modelagem e animação 3D" },
  { abbr: "Tm", name: "Twinmotion", role: "Visualização 3D de eventos e espaços" },
  { abbr: "Ps", name: "Photoshop", role: "Criação e tratamento de artes" },
  { abbr: "Lr", name: "Lightroom", role: "Tratamento de fotografias" },
];

type StudioClip = { start: number; width: number; label: string; tone: "main" | "alt" | "gfx" | "color" };

const studioTracks: { id: string; clips: StudioClip[] }[] = [
  { id: "V3", clips: [
    { start: 5, width: 13, label: "Título animado", tone: "gfx" },
    { start: 36, width: 11, label: "Lower third", tone: "gfx" },
    { start: 68, width: 17, label: "Motion graphics", tone: "gfx" },
  ] },
  { id: "V2", clips: [
    { start: 0, width: 21, label: "B-roll", tone: "alt" },
    { start: 22.5, width: 14, label: "B-roll", tone: "alt" },
    { start: 41, width: 19, label: "B-roll", tone: "alt" },
    { start: 62, width: 10, label: "Drone", tone: "alt" },
    { start: 74, width: 24, label: "B-roll", tone: "alt" },
  ] },
  { id: "V1", clips: [
    { start: 0, width: 15, label: "Entrevista", tone: "main" },
    { start: 15.6, width: 22, label: "Cena 02", tone: "main" },
    { start: 38, width: 19, label: "Cena 03", tone: "color" },
    { start: 57.6, width: 15, label: "Cena 04", tone: "main" },
    { start: 73, width: 25, label: "Finalização", tone: "color" },
  ] },
];

// Forma de onda determinística (sem aleatoriedade em tempo de execução, para o visual ser estável).
function waveformPath(seed: number, bars: number, calm: number) {
  let x = seed;
  const rand = () => (x = (x * 16807) % 2147483647) / 2147483647;
  let d = "";
  for (let i = 0; i < bars; i++) {
    const envelope = 0.35 + 0.65 * Math.abs(Math.sin(i / (6 + calm * 8)) * Math.cos(i / 17));
    const h = Math.max(0.6, (0.25 + rand() * 0.75) * envelope * 9);
    d += `M${i} ${(10 - h).toFixed(2)}V${(10 + h).toFixed(2)}`;
  }
  return d;
}
const waveVoice = waveformPath(7, 220, 0);
const waveMusic = waveformPath(19, 220, 1);

function Waveform({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 220 20" preserveAspectRatio="none" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function StudioViewer() {
  const fallback = videos[1].posterFallback;
  const [src, setSrc] = useState(`/images/videos/${videos[1].id}.jpg`);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <img src={src} alt="" onError={() => { if (src !== fallback) setSrc(fallback); else setFailed(true); }} />;
}

const studioPages = ["Mídia", "Corte", "Edição", "Cor", "Áudio", "Entrega"];
const studioSliders = [["Contraste", 62], ["Saturação", 48], ["Temperatura", 55]] as const;
const STUDIO_SECONDS = 45;

function StudioMock() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const head = headRef.current;
    const code = codeRef.current;
    if (!root || !head || !code) return;

    const setProgress = (progress: number) => {
      head.style.left = `${progress * 100}%`;
      const total = progress * STUDIO_SECONDS;
      const seconds = Math.floor(total);
      const frames = Math.floor((total - seconds) * 24);
      code.textContent = `00:00:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;
    };
    setProgress(0.38);
    if (reduceMotion) return;

    let frame = 0;
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      setProgress(((now - start) % 20000) / 20000 * 0.96 + 0.02);
      frame = requestAnimationFrame(loop);
    };
    // Só anima enquanto a timeline está visível na tela.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) { start = 0; frame = requestAnimationFrame(loop); }
      if (!entry.isIntersecting && frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.2 });
    observer.observe(root);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [reduceMotion]);

  return (
    <div ref={rootRef} className="studio-mock" role="img" aria-label="Ilustração de uma linha do tempo de edição de vídeo, com camadas de vídeo, gráficos animados, áudio e correção de cor">
      <div className="sm-bar">
        <span className="sm-dots"><i /><i /><i /></span>
        <span className="sm-title">Rise Studio · Timeline 1</span>
        <span className="sm-spec">4K · 24 fps</span>
      </div>
      <div className="sm-body">
        <div className="sm-viewer">
          <StudioViewer />
          <span className="sm-guides" />
          <span className="sm-timecode" ref={codeRef}>00:00:17:04</span>
        </div>
        <div className="sm-panel">
          <span className="sm-panel-title">Correção de cor</span>
          <div className="sm-wheels">
            {["Lift", "Gamma", "Gain"].map((name) => <span key={name}><i className="sm-wheel" /><small>{name}</small></span>)}
          </div>
          <div className="sm-sliders">
            {studioSliders.map(([name, value]) => <span key={name}><small>{name}</small><i><b style={{ width: `${value}%` }} /></i></span>)}
          </div>
        </div>
      </div>
      <div className="sm-pages">
        {studioPages.map((page) => <span key={page} className={page === "Edição" ? "is-active" : ""}>{page}</span>)}
      </div>
      <div className="sm-timeline">
        <div className="sm-ruler">
          <span className="sm-track-name" />
          <span className="sm-ruler-lane">
            {[0, 25, 50, 75].map((position) => (
              <small key={position} style={{ left: `${position}%` }}>00:{String(Math.round(position * STUDIO_SECONDS / 100)).padStart(2, "0")}</small>
            ))}
          </span>
        </div>
        {studioTracks.map((track) => (
          <div className="sm-track" key={track.id}>
            <span className="sm-track-name">{track.id}</span>
            <span className="sm-lane">
              {track.clips.map((clip) => (
                <span key={`${clip.start}-${clip.label}`} className={`sm-clip sm-clip-${clip.tone}`} style={{ left: `${clip.start}%`, width: `${clip.width}%` }}>{clip.label}</span>
              ))}
            </span>
          </div>
        ))}
        <div className="sm-track sm-track-audio">
          <span className="sm-track-name">A1</span>
          <span className="sm-lane"><span className="sm-clip sm-clip-voice" style={{ left: "0%", width: "100%" }}><Waveform d={waveVoice} /></span></span>
        </div>
        <div className="sm-track sm-track-audio">
          <span className="sm-track-name">A2</span>
          <span className="sm-lane"><span className="sm-clip sm-clip-music" style={{ left: "0%", width: "100%" }}><Waveform d={waveMusic} /></span></span>
        </div>
        <div className="sm-overlay"><span className="sm-playhead" ref={headRef} /></div>
      </div>
    </div>
  );
}

function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoProject | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [previewsPaused, setPreviewsPaused] = useState(false);
  const videoDialogRef = useRef<HTMLDialogElement>(null);
  const pausePreviews = previewsPaused || selectedVideo !== null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  useEffect(() => {
    const dialog = videoDialogRef.current;
    if (selectedVideo && dialog && !dialog.open) dialog.showModal();
  }, [selectedVideo]);

  const heroMotion = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav-inner container">
          <Brand onClick={() => setMenuOpen(false)} />
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#trabalhos">Trabalhos</a>
            <a href="#instagram">Instagram</a>
            <a href="#servicos">Serviços</a>
            <a href="#estudio">Estúdio</a>
            <a href="#sobre">Eventos em 3D</a>
            <a href="#planos">Planos</a>
            <a href="#catalogo">Catálogo</a>
            <button type="button" className="order-link" onClick={() => setOrderOpen(true)}>Briefing</button>
          </nav>
          <div className="nav-actions">
            <a className="nav-cta" href={contactLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="whatsapp-icon" /> Fale com a Rise <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" /></a>
            <button className="menu-toggle" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Navegação para celular" initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
              <div className="mobile-nav-inner">
                <a href="#trabalhos" onClick={() => setMenuOpen(false)}>Trabalhos <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#instagram" onClick={() => setMenuOpen(false)}>Instagram <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#servicos" onClick={() => setMenuOpen(false)}>O que fazemos <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#estudio" onClick={() => setMenuOpen(false)}>Estúdio <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#sobre" onClick={() => setMenuOpen(false)}>Eventos em 3D <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#planos" onClick={() => setMenuOpen(false)}>Planos mensais <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#eventos" onClick={() => setMenuOpen(false)}>Cobertura de eventos <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#casamentos" onClick={() => setMenuOpen(false)}>Casamentos <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo de serviços <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a href="#calculadora" onClick={() => setMenuOpen(false)}>Calculadora <ArrowUpRight size={18} aria-hidden="true" /></a>
                <button type="button" className="order-link-mobile" onClick={() => { setMenuOpen(false); setOrderOpen(true); }}>Briefing inicial <ArrowUpRight size={18} aria-hidden="true" /></button>
                <a href="#duvidas" onClick={() => setMenuOpen(false)}>Dúvidas <ArrowUpRight size={18} aria-hidden="true" /></a>
                <a className="button button-dark" href={contactLink} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}><WhatsAppIcon className="whatsapp-icon" /> Fale com a Rise <ArrowUpRight size={17} aria-hidden="true" /></a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <VimeoPreview video={videos[1]} paused={pausePreviews} className="hero-preview" />
          <div className="hero-wash" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-content">
              <motion.p className="eyebrow hero-eyebrow" {...heroMotion(0.08)}>A CRIATIVIDADE EM MOVIMENTO</motion.p>
              <motion.h1 id="hero-title" className="hero-title" {...heroMotion(0.18)}>
                <span className="hero-brand">Agência Rise<span>.</span></span>
                <span className="hero-statement">Criar. Conectar.<br /><em>Fazer crescer.</em></span>
              </motion.h1>
              <motion.p className="hero-description" {...heroMotion(0.3)}>Vídeos, artes, projetos 3D e marketing para fazer seu comércio se destacar.</motion.p>
              <motion.div className="hero-actions" {...heroMotion(0.42)}>
                <a className="button button-light hero-whatsapp" href={contactLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="whatsapp-icon" /> Falar no WhatsApp <ArrowUpRight size={17} aria-hidden="true" /></a>
                <button type="button" className="text-link hero-link hero-watch" onClick={() => setSelectedVideo(videos[1])}>Assistir em destaque <Play size={14} fill="currentColor" aria-hidden="true" /></button>
              </motion.div>
              <motion.p className="hero-phone" {...heroMotion(0.52)}>WHATSAPP <a href={contactLink} target="_blank" rel="noopener noreferrer">{whatsappNumber}</a></motion.p>
            </div>
          </div>
        </section>

        <section className="works-section section-space" id="trabalhos" aria-labelledby="works-title">
          <div className="container">
            <Reveal className="works-heading">
              <div>
                <p className="section-kicker"><span>01 / TRABALHOS SELECIONADOS</span></p>
                <h2 id="works-title">Histórias feitas<br /><em>para acontecer.</em></h2>
              </div>
              <div className="works-heading-aside">
                <p>Um pouco do nosso olhar em cada projeto. Escolha um filme e assista sem sair daqui.</p>
                <span>{reduceMotion ? "PRÉVIAS EM MOVIMENTO DESATIVADAS" : "PRÉVIAS SEM SOM"} <ArrowDown size={15} aria-hidden="true" /></span>
                {!reduceMotion && <button className="preview-control" type="button" onClick={() => setPreviewsPaused((paused) => !paused)}>{previewsPaused ? <Play size={13} fill="currentColor" aria-hidden="true" /> : <Pause size={14} fill="currentColor" aria-hidden="true" />}{previewsPaused ? "Reproduzir prévias" : "Pausar prévias"}</button>}
              </div>
            </Reveal>
            <div className="landscape-grid">
              {videos.slice(0, 3).map((video, index) => <VideoCard key={video.id} video={video} index={index} paused={pausePreviews} onOpen={setSelectedVideo} />)}
            </div>
            <Reveal className="vertical-intro">
              <div>
                <p className="section-kicker"><span>VÍDEOS VERTICAIS / FEITOS PARA O INSTAGRAM</span></p>
                <h3 className="vertical-title">Vídeos que convertem<br /><em>no seu comércio.</em></h3>
              </div>
              <div className="vertical-aside">
                <p>Conteúdo pensado para prender a atenção, gerar conversas e trazer clientes para o seu negócio. A maioria destes vídeos foi feita para clientes que também têm o Instagram gerenciado pela Rise.</p>
                <a className="text-link" href={whatsappLink("Olá! Quero vídeos que convertem para o meu comércio.")} target="_blank" rel="noopener noreferrer">Quero vídeos assim <ArrowRight size={17} aria-hidden="true" /></a>
              </div>
            </Reveal>
            <div className="portrait-grid">
              {videos.slice(3).map((video, index) => <VideoCard key={video.id} video={video} index={index + 3} paused={pausePreviews} onOpen={setSelectedVideo} />)}
            </div>
            <p className="works-caption">{reduceMotion ? "Clique no play para assistir ao vídeo completo." : "As prévias se repetem sem som. Clique no play para assistir ao vídeo completo."}</p>
          </div>
        </section>

        <section className="audience-band" aria-label={`Clientes e parceiros: ${clients.join(", ")}`}>
          <div className="container audience-inner">
            <p>HISTÓRIAS CONTADAS{" "}<br />AO LADO DE</p>
            <div className="marquee">
              <div className="marquee-track">
                <div className="marquee-group">
                  {clients.map((name, index) => <span className={clientClass(index)} key={name}>{name}</span>)}
                </div>
                <div className="marquee-group" aria-hidden="true">
                  {clients.map((name, index) => <span className={clientClass(index)} key={name}>{name}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="instagram-section section-space" id="instagram" aria-labelledby="instagram-title">
          <div className="container">
            <Reveal className="section-intro">
              <p className="section-kicker"><span>02 / GESTÃO DE INSTAGRAM</span><span>DO PERFIL AO RESULTADO</span></p>
              <div className="intro-grid">
                <h2 id="instagram-title">Instagram organizado<br /><em>atrai clientes.</em></h2>
                <p>Cuidamos do Instagram do seu negócio de ponta a ponta: números, estudo, criação de artes e a organização de todo o perfil.</p>
              </div>
            </Reveal>
            <div className="ig-pillars">
              {igPillars.map((pillar, index) => (
                <Reveal className="ig-pillar" delay={index * 0.07} key={pillar.title}>
                  <span className="ig-pillar-icon">{pillar.icon}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="ig-showcase-heading">
              <p className="section-kicker"><span>PERFIS QUE A RISE ORGANIZA</span></p>
              <p>Bio, destaques e grade de publicações pensados para que cada visita ao perfil vire contato.</p>
            </Reveal>
            <div className="ig-cards" role="region" aria-label="Exemplos de perfis do Instagram organizados pela Rise" tabIndex={0}>
              {igProfiles.map((profile, index) => <InstagramCard key={profile.handle} profile={profile} index={index} />)}
              <Reveal className="ig-cta-card" delay={0.21}>
                <RiseSymbol className="ig-cta-mark" />
                <p className="ig-cta-kicker">O PRÓXIMO PERFIL PODE SER O SEU</p>
                <h3>Seu Instagram <em>organizado.</em></h3>
                <p>Métricas, estudo e artes para o seu perfil crescer e atrair mais clientes.</p>
                <a className="button button-light" href={whatsappLink("Olá! Quero organizar e fazer crescer o Instagram do meu negócio.")} target="_blank" rel="noopener noreferrer">Quero o meu <ArrowUpRight size={18} aria-hidden="true" /></a>
              </Reveal>
            </div>
            <p className="ig-note">Ilustrações conceituais da organização dos perfis (bio, destaques e grade de publicações). O nome de cada perfil abre o Instagram real do cliente.</p>
          </div>
        </section>

        <CastingSection />

        <section className="features-section section-space" id="servicos" aria-labelledby="features-title">
          <div className="container">
            <Reveal className="section-intro">
              <p className="section-kicker"><span>03 / O QUE FAZEMOS</span><span>CRIATIVIDADE E ESTRATÉGIA PARA O SEU NEGÓCIO</span></p>
              <div className="intro-grid">
                <h2 id="features-title">Boas ideias.<br /><em>Marcas em movimento.</em></h2>
                <p>Unimos criatividade e estratégia para sua marca aparecer, conectar pessoas e encontrar novos caminhos para crescer.</p>
              </div>
            </Reveal>
            <div className="feature-grid">
              {services.map((service, index) => (
                <Reveal className="feature-item" delay={index * 0.08} key={service.number}>
                  <span className="feature-number">{service.number} <span>/</span></span>
                  <h3>{service.title}</h3><p>{service.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="studio-section section-space" id="estudio" aria-labelledby="studio-title">
          <div className="container">
            <Reveal className="section-intro">
              <p className="section-kicker light-kicker"><span>04 / ESTÚDIO E PÓS-PRODUÇÃO</span><span>DO CORTE À ENTREGA</span></p>
              <div className="intro-grid">
                <h2 id="studio-title">Tecnologia de cinema<br /><em>a serviço da sua marca.</em></h2>
                <p>Editamos, colorimos, animamos e finalizamos cada projeto com programas profissionais usados no cinema e na publicidade, para entregar imagem e som de alta qualidade.</p>
              </div>
            </Reveal>
            <Reveal className="studio-mock-wrap" delay={0.05}><StudioMock /></Reveal>
            <Reveal>
              <ul className="studio-tools">
                {studioTools.map((tool) => (
                  <li key={tool.name}>
                    <span className="studio-tool-badge" aria-hidden="true">{tool.abbr}</span>
                    <strong>{tool.name}</strong>
                    <span>{tool.role}</span>
                  </li>
                ))}
                <li className="studio-tool-more">
                  <strong>E outros programas</strong>
                  <span>Sempre a ferramenta certa para cada projeto.</span>
                </li>
              </ul>
            </Reveal>
            <div className="studio-foot">
              <a className="text-link" href={whatsappLink("Olá! Quero um vídeo com qualidade de cinema para o meu negócio.")} target="_blank" rel="noopener noreferrer">Quero um vídeo com qualidade de cinema <ArrowRight size={17} aria-hidden="true" /></a>
              <p>DaVinci Resolve, Premiere Pro, After Effects, Photoshop, Lightroom, Blender e Twinmotion são marcas de seus respectivos proprietários, citadas apenas para indicar as ferramentas utilizadas, sem vínculo ou endosso.</p>
            </div>
          </div>
        </section>

        <section className="about-section" id="sobre" aria-labelledby="about-title">
          <div className="about-image"><img src="/images/evento-3d-conceito.jpg" alt="Ilustração conceitual de um espaço para eventos visualizado em 3D" loading="lazy" /><span className="about-image-caption">ILUSTRAÇÃO CONCEITUAL</span></div>
          <div className="about-content">
            <RiseSymbol className="about-watermark" />
            <Reveal className="about-copy">
              <p className="section-kicker light-kicker"><span>05 / PROJETOS DE EVENTOS EM 3D</span></p>
              <h2 id="about-title">Seu evento, antes<br /><em>de acontecer.</em></h2>
              <p>Criamos projetos de eventos em 3D interativo para visualizar o espaço, explorar possibilidades e dar vida às suas ideias.</p>
              <a className="button button-light" href={whatsappLink("Olá! Quero conversar sobre um projeto de evento em 3D interativo.")} target="_blank" rel="noopener noreferrer">Conversar sobre meu evento <ArrowUpRight size={18} aria-hidden="true" /></a>
            </Reveal>
          </div>
        </section>

        <section className="manifesto-section section-space" id="comercios" aria-labelledby="manifesto-title">
          <div className="container manifesto-layout">
            <Reveal><p className="section-kicker"><span>06 / PARA O SEU COMÉRCIO</span></p><h2 id="manifesto-title">Seu negócio merece<br /><em>ser visto.</em></h2></Reveal>
            <Reveal className="commerce-copy" delay={0.08}>
              <p>Do comércio de bairro aos negócios em expansão, criamos conteúdo e estratégias para fortalecer sua presença digital e atrair clientes.</p>
              <p>Para lojas, mercados, restaurantes, salões, óticas, pousadas e outros negócios locais.</p>
              <a className="text-link" href={whatsappLink("Olá! Quero conversar sobre marketing para o meu comércio.")} target="_blank" rel="noopener noreferrer">Vamos falar sobre seu negócio <ArrowRight size={17} aria-hidden="true" /></a>
            </Reveal>
          </div>
        </section>

        <section className="investment-section section-space" id="planos" aria-labelledby="investment-title">
          <div className="container">
            <Reveal className="investment-layout">
              <div><p className="section-kicker"><span>07 / PLANOS MENSAIS</span></p><h2 id="investment-title">Uma parceria<br /><em>para crescer.</em></h2></div>
              <div className="investment-copy"><p>Quatro planos mensais de gestão de Instagram. Compare as entregas, veja os valores e peça a proposta pelo WhatsApp.</p><a className="text-link" href="#calculadora">Simule seu orçamento <ArrowRight size={17} aria-hidden="true" /></a></div>
            </Reveal>

            <div className="plans-four">
              {plans.map((plan, index) => (
                <Reveal className={`price-card${plan.featured ? " price-card-featured" : ""}`} delay={index * 0.07} key={plan.name}>
                  <div className="price-card-top">
                    {plan.featured && <span className="price-badge">MAIS CONTRATADO</span>}
                    {!plan.featured && plan.tag && <span className="price-tag">{plan.tag}</span>}
                    <span className="price-index">{plan.number}</span>
                  </div>

                  <h3 className="price-name">{plan.name}</h3>

                  <div className="price-amount">
                    {plan.pricePrefix && <span className="price-prefix">{plan.pricePrefix}</span>}
                    <span className="price-value"><i>R$</i>{plan.price}<b>/mês</b></span>
                  </div>

                  <p className="price-description">{plan.description}</p>

                  <ul className="price-features">
                    {plan.features.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}
                  </ul>

                  {plan.scopeNote && <p className="price-scope">{plan.scopeNote}</p>}

                  <a
                    className={`price-btn${plan.featured ? " price-btn-light" : ""}`}
                    href={planWhatsappLink(plan.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="whatsapp-icon" /> {plan.action}
                  </a>
                </Reveal>
              ))}
            </div>

            <div className="plans-terms">
              <p className="plans-terms-title">COMO FUNCIONA A CONTRATAÇÃO</p>
              <ul>
                {contractTerms.map((term) => <li key={term}><span aria-hidden="true" />{term}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <EventPackages />
        <WeddingPackages />
        <BudgetCalculator />
        <ServiceCatalog />

        <section className="faq-section section-space" id="duvidas" aria-labelledby="faq-title">
          <div className="container faq-layout">
            <Reveal className="faq-heading"><p className="section-kicker"><span>08 / BOM SABER</span></p><h2 id="faq-title">Algumas boas<br /><em>perguntas.</em></h2><p>Um pouco mais sobre nossos serviços e planos.</p></Reveal>
            <Reveal className="faq-list" delay={0.08}>
              {faqs.map((faq, index) => {
                const expanded = openFaq === index;
                return (
                  <div className="faq-item" key={faq.question}>
                    <button id={`faq-question-${index}`} type="button" aria-expanded={expanded} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(expanded ? null : index)}>
                      <span>{faq.question}</span><motion.span className="faq-plus" animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}><Plus size={19} aria-hidden="true" /></motion.span>
                    </button>
                    <motion.div className="faq-answer-wrap" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={!expanded} initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeInOut" }}><p>{faq.answer}</p></motion.div>
                  </div>
                );
              })}
            </Reveal>
          </div>
        </section>

        <section className="closing-section" aria-labelledby="closing-title">
          <RiseSymbol className="closing-mark" />
          <div className="container"><Reveal className="closing-content"><p className="section-kicker light-kicker"><span>VAMOS CRESCER JUNTOS</span></p><h2 id="closing-title">Sua próxima ideia<br /><em>começa aqui.</em></h2><p>Conte para a gente o que você imagina para sua marca ou seu evento.</p><a className="button button-light closing-whatsapp" href={contactLink} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="whatsapp-icon" /> Chamar no WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></a><a className="closing-phone" href={contactLink} target="_blank" rel="noopener noreferrer">{whatsappNumber}</a></Reveal></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-about"><Brand className="footer-brand" /><p>Histórias em movimento.<br />Ideias que deixam sua marca.</p></div>
            <div className="footer-nav-group"><p>EXPLORE</p><a href="#trabalhos">Trabalhos</a><a href="#instagram">Gestão de Instagram</a><a href="#servicos">O que fazemos</a><a href="#estudio">Estúdio e ferramentas</a><a href="#sobre">Eventos em 3D</a></div>
            <div className="footer-nav-group"><p>SAIBA MAIS</p><a href="#planos">Planos mensais</a><a href="#eventos">Cobertura de eventos</a><a href="#casamentos">Casamentos</a><a href="#calculadora">Calculadora de orçamento</a><a href="#catalogo">Catálogo de serviços</a><a href="#comercios">Para comércios</a><a href="#duvidas">Dúvidas frequentes</a><button type="button" className="order-link-footer" onClick={() => setOrderOpen(true)}>Briefing inicial</button></div>
            <div className="footer-nav-group footer-contact"><p>FALE COM A RISE</p><a href={contactLink} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14} aria-hidden="true" /></a><a href={contactLink} target="_blank" rel="noopener noreferrer">{whatsappNumber}</a></div>
          </div>
          <div className="footer-wordmark" aria-hidden="true">rise<span>.</span></div>
          <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Agência Rise. Todos os direitos reservados.</span><a href="#inicio">Voltar ao topo <ArrowUp size={15} aria-hidden="true" /></a></div>
        </div>
      </footer>

      <dialog ref={videoDialogRef} className={`site-dialog video-dialog ${selectedVideo?.orientation === "portrait" ? "video-dialog-portrait" : ""}`} aria-labelledby="video-dialog-title" onClose={() => setSelectedVideo(null)} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        {selectedVideo && (
          <>
            <div className="video-dialog-heading">
              <div><p>AGÊNCIA RISE / {selectedVideo.category}</p><h2 id="video-dialog-title">{selectedVideo.title}</h2></div>
              <button className="dialog-close" type="button" aria-label="Fechar vídeo" autoFocus onClick={() => videoDialogRef.current?.close()}><X size={21} aria-hidden="true" /></button>
            </div>
            <FullVideoPlayer key={selectedVideo.id} video={selectedVideo} />
          </>
        )}
      </dialog>

      <OrderForm open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname.endsWith("/briefing")) return <BriefingPage />;
  return <LandingPage />;
}