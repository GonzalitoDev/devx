import type {
  Comment,
  Community,
  Message,
  Notification,
  Post,
  Project,
  Trend,
  User,
} from "./types";

export const CURRENT_USER_ID = "u-devx";

export const guestUser: User = {
  id: "guest",
  username: "invitado",
  name: "Invitado",
  bio: "Inicia sesión para unirte a la conversación.",
  followers: 0,
  following: 0,
  technologies: [],
  likedPosts: [],
  joined: "2026-01-01",
};

export const users: User[] = [
  {
    id: "u-devx",
    username: "devx",
    name: "Alex Torres",
    bio: "Full-stack developer · React, TypeScript y café en vena ☕ Construyendo cosas en la web.",
    website: "https://devx.dev",
    github: "devx",
    location: "Madrid, España",
    followers: 4821,
    following: 318,
    technologies: ["TypeScript", "React", "Next.js"],
    likedPosts: ["p-2", "p-5"],
    joined: "2021-03-14",
    verified: true,
  },
  {
    id: "u-maria",
    username: "mariadev",
    name: "María García",
    bio: "Frontend engineer. Diseño sistemas de componentes y cuido el detalle de la UI.",
    website: "https://mariadev.dev",
    github: "mariadev",
    location: "Barcelona, España",
    followers: 12304,
    following: 451,
    technologies: ["React", "TailwindCSS", "TypeScript"],
    likedPosts: ["p-1", "p-3"],
    joined: "2020-05-02",
    verified: true,
  },
  {
    id: "u-john",
    username: "johndoe",
    name: "John Carter",
    bio: "Backend engineer. Go, microservicios y bases de datos a escala. Aprendiendo Rust.",
    github: "johncarter",
    location: "Austin, EE. UU.",
    followers: 8912,
    following: 620,
    technologies: ["Go", "PostgreSQL", "Docker"],
    likedPosts: ["p-4"],
    joined: "2019-11-20",
  },
  {
    id: "u-ravi",
    username: "ravi",
    name: "Ravi Patel",
    bio: "AI/ML engineer. LLMs, RAG y agentes. Comparto experimentos y papers que valen la pena.",
    github: "ravipatel",
    location: "Bangalore, India",
    followers: 27340,
    following: 389,
    technologies: ["Python", "AI", "PyTorch"],
    likedPosts: ["p-6", "p-7"],
    joined: "2019-01-08",
    verified: true,
  },
  {
    id: "u-anna",
    username: "anna",
    name: "Anna Kova",
    bio: "Rust developer. Sistemas, WASM y CLIs rápidos. Performance es mi religión.",
    github: "annakova",
    location: "Berlín, Alemania",
    followers: 15420,
    following: 210,
    technologies: ["Rust", "WASM", "Linux"],
    likedPosts: ["p-8"],
    joined: "2020-08-15",
  },
  {
    id: "u-luis",
    username: "luisdev",
    name: "Luis Fernández",
    bio: "DevOps / SRE. CI/CD, Kubernetes y observabilidad. Automatizo todo lo que puedo.",
    github: "luisdev",
    location: "México DF, México",
    followers: 6580,
    following: 540,
    technologies: ["DevOps", "Kubernetes", "AWS"],
    likedPosts: ["p-9"],
    joined: "2018-06-30",
  },
  {
    id: "u-sofia",
    username: "sofia",
    name: "Sofía Mendoza",
    bio: "Pythonista y defensora del open source. Mantengo 3 paquetes que usan miles de personas.",
    github: "sofiamendoza",
    location: "Bogotá, Colombia",
    followers: 19820,
    following: 760,
    technologies: ["Python", "Open Source", "Django"],
    likedPosts: ["p-10"],
    joined: "2017-09-12",
    verified: true,
  },
  {
    id: "u-tomas",
    username: "tomweb",
    name: "Tom Weber",
    bio: "Mobile dev. React Native y Expo. Me gusta la arquitectura limpia y las apps bonitas.",
    github: "tomweber",
    location: "Ámsterdam, Países Bajos",
    followers: 4310,
    following: 302,
    technologies: ["React Native", "TypeScript", "Expo"],
    likedPosts: ["p-11"],
    joined: "2022-01-25",
  },
  {
    id: "u-hana",
    username: "hana",
    name: "Hana Sato",
    bio: "Research engineer. Causal inference y deep learning. Blog con visualizaciones.",
    github: "hanasato",
    location: "Tokio, Japón",
    followers: 31280,
    following: 150,
    technologies: ["AI", "Python", "MLOps"],
    likedPosts: ["p-12"],
    joined: "2020-02-10",
    verified: true,
  },
];

export const communities: Community[] = [
  {
    slug: "javascript",
    name: "JavaScript",
    description: "Todo sobre JavaScript: bundlers, frameworks y el ecosistema que nunca duerme.",
    members: 128400,
    posts: 4820,
    emoji: "🟨",
    gradient: "from-yellow-500/30 to-amber-600/10",
    technologies: ["JavaScript", "Node.js", "ES2024"],
  },
  {
    slug: "typescript",
    name: "TypeScript",
    description: "Tipos, genéricos, inferencia y cómo hacer que TS trabaje para ti.",
    members: 98300,
    posts: 3610,
    emoji: "🔷",
    gradient: "from-blue-500/30 to-sky-600/10",
    technologies: ["TypeScript", "Strict Mode", "Generics"],
  },
  {
    slug: "react",
    name: "React",
    description: "Componentes, hooks, suspense y Server Components. De hooks a patrones avanzados.",
    members: 154200,
    posts: 6900,
    emoji: "⚛️",
    gradient: "from-cyan-500/30 to-sky-600/10",
    technologies: ["React", "Hooks", "RSC"],
  },
  {
    slug: "nextjs",
    name: "Next.js",
    description: "App Router, Server Actions, ISR y despliegues en Vercel.",
    members: 87600,
    posts: 3100,
    emoji: "▲",
    gradient: "from-zinc-400/30 to-zinc-600/10",
    technologies: ["Next.js", "App Router", "Vercel"],
  },
  {
    slug: "python",
    name: "Python",
    description: "De scripts a ML. Python para todo: data, web, automatización y ciencia.",
    members: 142600,
    posts: 5240,
    emoji: "🐍",
    gradient: "from-green-500/30 to-emerald-600/10",
    technologies: ["Python", "FastAPI", "Pandas"],
  },
  {
    slug: "rust",
    name: "Rust",
    description: "Memoria segura sin GC. Sistemas, CLIs, WASM y networking de alto rendimiento.",
    members: 62100,
    posts: 2100,
    emoji: "🦀",
    gradient: "from-orange-500/30 to-red-600/10",
    technologies: ["Rust", "Cargo", "Tokio"],
  },
  {
    slug: "go",
    name: "Go",
    description: "Goroutines, canales y simplicidad. Backends escalables con el lenguaje de Google.",
    members: 54800,
    posts: 1740,
    emoji: "🐹",
    gradient: "from-cyan-500/30 to-blue-600/10",
    technologies: ["Go", "Concurrency", "gRPC"],
  },
  {
    slug: "ai",
    name: "AI",
    description: "LLMs, agentes, RAG y todo lo que está pasando en IA aplicada al código.",
    members: 173000,
    posts: 8100,
    emoji: "🤖",
    gradient: "from-fuchsia-500/30 to-purple-600/10",
    technologies: ["LLM", "RAG", "Agents"],
  },
  {
    slug: "devops",
    name: "DevOps",
    description: "CI/CD, Kubernetes, IaC y observabilidad. Automatiza tu infraestructura.",
    members: 89500,
    posts: 2900,
    emoji: "🔧",
    gradient: "from-slate-400/30 to-zinc-600/10",
    technologies: ["Docker", "K8s", "Terraform"],
  },
  {
    slug: "open-source",
    name: "Open Source",
    description: "Mantener, contribuir y construir en público. El software libre en acción.",
    members: 112000,
    posts: 3650,
    emoji: "🌍",
    gradient: "from-emerald-500/30 to-green-600/10",
    technologies: ["GitHub", "MIT", "Contributions"],
  },
];

export const posts: Post[] = [
  {
    id: "p-1",
    authorId: "u-maria",
    kind: "code",
    content:
      "Un truco de React que me ahorró 200 líneas: combina useMemo y el estado derivado con un reducer. La clave está en mantener una sola fuente de verdad. #React #TypeScript",
    hashtags: ["React", "TypeScript"],
    code: {
      language: "typescript",
      code: `const [state, dispatch] = useReducer(reducer, initial);

const derived = useMemo(() => {
  const total = state.items.reduce((acc, item) => acc + item.price, 0);
  return { total, count: state.items.length };
}, [state.items]);

// El estado derivado nunca queda desincronizado.
return <Summary total={derived.total} count={derived.count} />;`,
    },
    createdAt: "2026-09-23T15:32:00Z",
    replies: 24,
    reposts: 86,
    likes: 452,
    views: 23000,
    communitySlug: "react",
  },
  {
    id: "p-2",
    authorId: "u-ravi",
    kind: "tutorial",
    content:
      "El patrón que uso para RAG que funciona de verdad (y no es recetar chunks a un vector store). 1) Guarda metadatos ricos. 2) Re-ranking con cross-encoder. 3) Cita las fuentes. #AI #RAG #Python",
    hashtags: ["AI", "RAG", "Python"],
    image: "https://picsum.photos/seed/devx-rag/800/450",
    createdAt: "2026-09-23T10:15:00Z",
    replies: 58,
    reposts: 210,
    likes: 1240,
    views: 81000,
    communitySlug: "ai",
  },
  {
    id: "p-3",
    authorId: "u-devx",
    kind: "question",
    content:
      "¿Alguien más ha notado que los Server Actions en Next.js vuelven loco a eslint con las funciones anidadas? ¿Cuál es la forma limpia de tiparlas? #Next.js #TypeScript",
    hashtags: ["Next.js", "TypeScript"],
    createdAt: "2026-09-22T18:45:00Z",
    replies: 42,
    reposts: 12,
    likes: 96,
    views: 6400,
    communitySlug: "nextjs",
  },
  {
    id: "p-4",
    authorId: "u-john",
    kind: "experience",
    content:
      "Tras 6 años con microservicios en Go, hoy creo que la mayoría de proyectos quedan mejor con un monolito modular. Menos latencia, menos 'dancing' en el despliegue y los módulos se separan igual. #Go #Arquitectura",
    hashtags: ["Go", "Arquitectura"],
    createdAt: "2026-09-22T09:20:00Z",
    replies: 95,
    reposts: 340,
    likes: 2100,
    views: 120000,
    communitySlug: "go",
  },
  {
    id: "p-5",
    authorId: "u-anna",
    kind: "code",
    content:
      "¿Sabías que puedes hacer un parser JSON en Rust en ~200 líneas sin dependencias? Así se ve una `match` bien usada. #Rust #Performance",
    hashtags: ["Rust", "Performance"],
    code: {
      language: "rust",
      code: `fn parse_value(input: &str) -> Result<Value, Error> {
    match input.trim_start().as_bytes().first() {
        Some(b'{') => parse_object(input),
        Some(b'[') => parse_array(input),
        Some(b'"') => parse_string(input),
        Some(b't') => parse_literal(input, "true", Value::Bool(true)),
        Some(b'n') => parse_literal(input, "null", Value::Null),
        _ => Err(Error::UnexpectedToken),
    }
}`,
    },
    createdAt: "2026-09-21T14:10:00Z",
    replies: 17,
    reposts: 128,
    likes: 890,
    views: 45000,
    communitySlug: "rust",
  },
  {
    id: "p-6",
    authorId: "u-hana",
    kind: "news",
    content:
      "La evaluación de agentes sigue siendo el problema abierto más caro de la IA. Si tu pipeline no distingue 'el modelo olvidó la fecha' de 'el modelo no pudo acceder al tool', la métrica no sirve. #AI",
    hashtags: ["AI"],
    image: "https://picsum.photos/seed/devx-ai/800/450",
    createdAt: "2026-09-21T08:00:00Z",
    replies: 33,
    reposts: 95,
    likes: 780,
    views: 52000,
    communitySlug: "ai",
  },
  {
    id: "p-7",
    authorId: "u-sofia",
    kind: "project",
    content:
      "Acabo de publicar la v2.0 de mi librería de paginación para Django REST. Ahora con async support y cache integrada. ¡PRs bienvenidos! #Python #OpenSource",
    hashtags: ["Python", "OpenSource"],
    image: "https://picsum.photos/seed/devx-django/800/450",
    createdAt: "2026-09-20T16:30:00Z",
    replies: 21,
    reposts: 64,
    likes: 610,
    views: 38000,
    communitySlug: "python",
  },
  {
    id: "p-8",
    authorId: "u-tomas",
    kind: "tutorial",
    content:
      "Guía rápida para publicar una app de React Native en TestFlight sin llorar en el intento: 1) Firma los certificados bien. 2) Bump de versión. 3) Exporta con 'development' primero. #ReactNative #Mobile",
    hashtags: ["ReactNative", "Mobile"],
    createdAt: "2026-09-19T12:00:00Z",
    replies: 19,
    reposts: 45,
    likes: 380,
    views: 21000,
  },
  {
    id: "p-9",
    authorId: "u-luis",
    kind: "experience",
    content:
      "El error más caro que cometí como DevOps: desplegar en producción un Helm chart con `imagePullPolicy: Always` y una tag `latest`. Cuando rompimos, no había forma de saber qué versión corría. #DevOps #Kubernetes",
    hashtags: ["DevOps", "Kubernetes"],
    code: {
      language: "yaml",
      code: `image:
  repository: myapp
  # NUNCA uses latest en producción
  tag: "1.4.2"
  pullPolicy: IfNotPresent`,
    },
    createdAt: "2026-09-19T09:45:00Z",
    replies: 47,
    reposts: 180,
    likes: 1100,
    views: 66000,
    communitySlug: "devops",
  },
  {
    id: "p-10",
    authorId: "u-maria",
    kind: "idea",
    content:
      "Idea: una API de color que devuelva paletas accesibles (contraste AA) según el contexto de uso. Los devs siempre terminamos implementando esto a mano. ¿Alguien quiere construirla? #Idea #Design",
    hashtags: ["Idea", "Design"],
    createdAt: "2026-09-18T17:20:00Z",
    replies: 63,
    reposts: 120,
    likes: 940,
    views: 41000,
    communitySlug: "react",
  },
  {
    id: "p-11",
    authorId: "u-john",
    kind: "code",
    content:
      "El worker pool en Go que uso como plantilla para todo lo que consume colas. Simple, cancelable y con graceful shutdown. #Go",
    hashtags: ["Go"],
    code: {
      language: "go",
      code: `func Run(ctx context.Context, jobs <-chan Job, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case job, ok := <-jobs:
                    if !ok {
                        return
                    }
                    process(job)
                }
            }
        }()
    }
    wg.Wait()
}`,
    },
    createdAt: "2026-09-17T10:05:00Z",
    replies: 29,
    reposts: 210,
    likes: 1500,
    views: 78000,
    communitySlug: "go",
  },
  {
    id: "p-12",
    authorId: "u-ravi",
    kind: "experience",
    content:
      "Lección aprendida: el prompt perfecto no existe, pero el sistema de evaluación sí. En los últimos 3 meses, lo que más mejoró nuestros agentes fue añadir tests que miden el proceso, no solo el resultado. #AI #Agents",
    hashtags: ["AI", "Agents"],
    createdAt: "2026-09-16T11:40:00Z",
    replies: 44,
    reposts: 160,
    likes: 1300,
    views: 71000,
    communitySlug: "ai",
  },
  {
    id: "p-13",
    authorId: "u-hana",
    kind: "project",
    content:
      "Lancé un pequeño CLI para visualizar la evolución del loss en entrenamientos largos sin TensorBoard. Sirve un HTML autocontenido con la gráfica. 2 dependencias, 300 líneas. #Python #MLOps",
    hashtags: ["Python", "MLOps"],
    code: {
      language: "python",
      code: `import json
import sys
from pathlib import Path

def build_report(log_path: Path) -> str:
    metrics = json.loads(log_path.read_text())
    rows = ",".join(
        f"{{x:{m['step']},y:{m['loss']:.4f}}}" for m in metrics
    )
    return f"<script>const DATA=[{rows}];</script>"`,
    },
    createdAt: "2026-09-15T13:15:00Z",
    replies: 12,
    reposts: 38,
    likes: 540,
    views: 29000,
    communitySlug: "python",
  },
  {
    id: "p-14",
    authorId: "u-anna",
    kind: "experience",
    content:
      "Migré el hot path de nuestro backend de Python a Rust y la latencia p99 bajó de 120ms a 14ms. El proceso tomó 3 semanas. ¿Valió la pena? Para nosotros sí. Pero solo por la cola del trabajo, no por el hype. #Rust",
    hashtags: ["Rust"],
    createdAt: "2026-09-14T08:30:00Z",
    replies: 71,
    reposts: 260,
    likes: 1900,
    views: 96000,
    communitySlug: "rust",
  },
];

export const comments: Record<string, Comment[]> = {
  "p-3": [
    {
      id: "c-1",
      postId: "p-3",
      authorId: "u-maria",
      content:
        "Yo defino las server actions en un archivo aparte con un helper de tipado. Así eslint no se queja y las pruebas son más fáciles.",
      createdAt: "2026-09-22T19:10:00Z",
      likes: 12,
    },
    {
      id: "c-2",
      postId: "p-3",
      authorId: "u-john",
      content:
        "Uso `use server` solo en el entrypoint y las funciones internas las dejo puras. La acción queda de una línea.",
      code: {
        language: "typescript",
        code: `export async function createPost(input: Input) {
  "use server";
  return service.create(input); // lógica fuera
}`,
      },
      createdAt: "2026-09-22T20:02:00Z",
      likes: 8,
    },
  ],
  "p-1": [
    {
      id: "c-3",
      postId: "p-1",
      authorId: "u-devx",
      content: "Justo lo que necesitaba, gracias. ¿Cómo manejas los casos con dependencias costosas en el reducer?",
      createdAt: "2026-09-23T16:01:00Z",
      likes: 4,
    },
  ],
  "p-9": [
    {
      id: "c-4",
      postId: "p-9",
      authorId: "u-devx",
      content: "Lo pagamos caro en mi equipo también. Desde entonces todo despliegue exige un commit hash como tag.",
      createdAt: "2026-09-19T10:30:00Z",
      likes: 21,
    },
  ],
};

export const notifications: Notification[] = [
  {
    id: "n-1",
    type: "like",
    fromUserId: "u-maria",
    postId: "p-3",
    text: "le gustó tu publicación",
    createdAt: "2026-09-23T18:20:00Z",
    read: false,
  },
  {
    id: "n-2",
    type: "follow",
    fromUserId: "u-john",
    text: "empezó a seguirte",
    createdAt: "2026-09-23T14:05:00Z",
    read: false,
  },
  {
    id: "n-3",
    type: "comment",
    fromUserId: "u-ravi",
    postId: "p-3",
    text: "comentó tu publicación: «Uso onlyServer y listo»",
    createdAt: "2026-09-22T21:00:00Z",
    read: false,
  },
  {
    id: "n-4",
    type: "repost",
    fromUserId: "u-sofia",
    postId: "p-3",
    text: "reposteó tu publicación",
    createdAt: "2026-09-22T18:50:00Z",
    read: true,
  },
  {
    id: "n-5",
    type: "mention",
    fromUserId: "u-anna",
    text: "te mencionó en una publicación sobre Rust",
    createdAt: "2026-09-21T16:10:00Z",
    read: true,
  },
  {
    id: "n-6",
    type: "system",
    text: "Bienvenido a DevX. Completa tu perfil para que la comunidad te encuentre.",
    createdAt: "2026-09-20T09:00:00Z",
    read: true,
  },
];

export const messages: Message[] = [
  {
    id: "m-1",
    conversationId: "u-maria",
    senderId: "u-maria",
    text: "Oye, vi tu pregunta sobre server actions. ¿Quieres que te pase el helper de tipos que uso?",
    createdAt: "2026-09-23T17:40:00Z",
  },
  {
    id: "m-2",
    conversationId: "u-maria",
    senderId: "u-devx",
    text: "Sí por favor, me está dando guerra el tipado con el formData.",
    createdAt: "2026-09-23T17:42:00Z",
  },
  {
    id: "m-3",
    conversationId: "u-maria",
    senderId: "u-maria",
    text: "Este es el truco: define el schema con zod y deja que TS infiera el tipo de entrada.",
    code: {
      language: "typescript",
      code: `const schema = z.object({
  content: z.string().min(1).max(280),
  tags: z.array(z.string()),
});

type Input = z.infer<typeof schema>;`,
    },
    createdAt: "2026-09-23T17:45:00Z",
  },
  {
    id: "m-4",
    conversationId: "u-john",
    senderId: "u-john",
    text: "Mañana nos juntamos a pair programming con el worker pool?",
    createdAt: "2026-09-22T12:30:00Z",
  },
  {
    id: "m-5",
    conversationId: "u-john",
    senderId: "u-devx",
    text: "Va. ¿A las 6?",
    createdAt: "2026-09-22T12:35:00Z",
  },
];

export const projects: Project[] = [
  {
    id: "pr-1",
    ownerId: "u-sofia",
    name: "django-smart-pagination",
    description: "Paginación con cache y soporte async para Django REST Framework.",
    language: "Python",
    stars: 1240,
    forks: 210,
    updatedAt: "2026-09-20T16:30:00Z",
    url: "https://github.com/sofiamendoza/django-smart-pagination",
  },
  {
    id: "pr-2",
    ownerId: "u-hana",
    name: "lossviz",
    description: "CLI para visualizar métricas de entrenamiento en un HTML autocontenido.",
    language: "Python",
    stars: 340,
    forks: 28,
    updatedAt: "2026-09-15T13:15:00Z",
    url: "https://github.com/hanasato/lossviz",
  },
  {
    id: "pr-3",
    ownerId: "u-devx",
    name: "devx-web",
    description: "Este proyecto. Una red social para desarrolladores construida con Next.js.",
    language: "TypeScript",
    stars: 89,
    forks: 14,
    updatedAt: "2026-09-24T08:00:00Z",
    url: "https://github.com/devx/devx-web",
  },
  {
    id: "pr-4",
    ownerId: "u-anna",
    name: "mini-json",
    description: "Parser JSON sin dependencias en Rust, ~200 líneas.",
    language: "Rust",
    stars: 720,
    forks: 96,
    updatedAt: "2026-09-21T14:10:00Z",
    url: "https://github.com/annakova/mini-json",
  },
];

export const trends: Trend[] = [
  { id: "t-1", tag: "Next.js 16", posts: 48200, category: "Tecnología" },
  { id: "t-2", tag: "TypeScript", posts: 35600, category: "Tecnología" },
  { id: "t-3", tag: "AI Agents", posts: 29400, category: "Inteligencia Artificial" },
  { id: "t-4", tag: "Rust", posts: 21800, category: "Tecnología" },
  { id: "t-5", tag: "Server Actions", posts: 16300, category: "Web" },
  { id: "t-6", tag: "Vercel Deploy", posts: 12100, category: "Web" },
  { id: "t-7", tag: "Open Source", posts: 9800, category: "Comunidad" },
  { id: "t-8", tag: "TailwindCSS", posts: 7600, category: "Diseño" },
];

export const popularTechnologies = [
  { name: "TypeScript", color: "text-blue-400" },
  { name: "React", color: "text-cyan-400" },
  { name: "Next.js", color: "text-zinc-300" },
  { name: "Python", color: "text-green-400" },
  { name: "Rust", color: "text-orange-400" },
  { name: "Go", color: "text-sky-400" },
  { name: "Node.js", color: "text-lime-400" },
  { name: "PostgreSQL", color: "text-indigo-400" },
  { name: "Docker", color: "text-blue-500" },
  { name: "AWS", color: "text-amber-400" },
];

export const userById = (id: string): User | undefined =>
  users.find((u) => u.id === id);

export const userByUsername = (username: string): User | undefined =>
  users.find((u) => u.username === username);

export const communityBySlug = (slug: string): Community | undefined =>
  communities.find((c) => c.slug === slug);

export const postById = (id: string): Post | undefined =>
  posts.find((p) => p.id === id);