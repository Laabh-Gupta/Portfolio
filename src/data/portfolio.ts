export const personal = {
  name: 'Laabh Gupta',
  title: 'AI/ML Engineer | Software Engineer | MLOps & DevOps',
  email: 'reachlaabhgupta@gmail.com',
  phone: '+91 9793084444',
  location: 'Kanpur, India',
  github: 'https://github.com/Laabh-Gupta',
  linkedin: 'https://linkedin.com/in/laabhgupta',
  leetcode: 'https://leetcode.com/u/laabhgupta',
  url: 'https://laabh-portfolio.netlify.app',
  resume: '/Laabh_Gupta_Resume.pdf',
  summary: 'Building AI systems, full-stack products and production-oriented ML infrastructure.',
} as const;

export const argulab = {
  live: 'https://argulab.netlify.app/dashboard',
  github: 'https://github.com/Laabh-Gupta/argu-lab',
  history: 'https://github.com/Laabh-Gupta/argu-lab/blob/main/PROJECT_HISTORY.md',
  subtitle: 'AI communication practice & personalized training platform',
  stack: ['React 19', 'TypeScript', 'Fastify', 'Groq', 'PostgreSQL'],
};

export const modes = [
  {
    name: 'Debate',
    detail: 'Build a position, respond to counterarguments and examine the evidence.',
  },
  {
    name: 'Group Discussion',
    detail: 'Practice contributing to a structured discussion with different perspectives.',
  },
  {
    name: 'Interview',
    detail: 'Rehearse interview conversations and review the clarity of your responses.',
  },
  {
    name: 'Public Speaking',
    detail: 'Develop a structured message and refine how you express it.',
  },
  { name: 'Extempore', detail: 'Think on your feet and organize an unscripted response.' },
  {
    name: 'Negotiation',
    detail: 'Explore competing priorities and practice making a persuasive case.',
  },
  {
    name: 'Case Discussion',
    detail: 'Reason through a case and explain the trade-offs behind your decisions.',
  },
  {
    name: 'Real-World Simulation',
    detail: 'Rehearse practical conversations in a scenario-based session.',
  },
  {
    name: 'Observer Analysis',
    detail: 'Study a conversation and analyze the arguments being made.',
  },
];

export const trainingLoop = [
  {
    title: 'Practice session',
    short: 'Session',
    detail:
      'A user practices one of nine communication modes through a structured AI conversation.',
    output: 'Conversation + session history',
    icon: 'message',
  },
  {
    title: 'AI evaluation',
    short: 'Evaluation',
    detail:
      'The conversation is reviewed for strengths, weaknesses, evidence, weak claims, fallacies and counterarguments.',
    output: 'Structured review + next steps',
    icon: 'sparkles',
  },
  {
    title: 'Extract learning signals',
    short: 'Learning signals',
    detail:
      'Previous sessions are summarized and strengths and weaknesses are extracted into useful training context.',
    output: 'Strengths + areas to improve',
    icon: 'scan',
  },
  {
    title: 'Persist user context',
    short: 'User context',
    detail:
      'User-specific training context is saved alongside session history, so it can be used beyond a single conversation.',
    output: 'Persistent, user-specific context',
    icon: 'database',
  },
  {
    title: 'Personalize the next session',
    short: 'Next session',
    detail:
      'Future session requests carry the saved context, allowing the AI to tailor practice to previous performance.',
    output: 'Context-aware future practice',
    icon: 'repeat',
  },
] as const;

export interface Project {
  name: string;
  category: 'AI / ML' | 'Software';
  description: string;
  stack: string[];
  github: string;
  type: string;
}
export const selectedProjects: Project[] = [
  {
    name: 'Virtual Try-On',
    category: 'AI / ML',
    description:
      'Computer vision experiments in garment synthesis, image segmentation and GAN-based try-on.',
    stack: ['Python', 'OpenCV', 'Deep Learning'],
    github: `${personal.github}/VirtualTryOn`,
    type: 'Computer vision · Experimental',
  },
  {
    name: 'Parkinson’s Disease Detection',
    category: 'AI / ML',
    description:
      'Classification experiments using biomedical voice features, data preparation and model evaluation.',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    github: `${personal.github}/Parkinsons-disease-Detection`,
    type: 'Applied machine learning',
  },
  {
    name: 'VXL — Academic Portal',
    category: 'Software',
    description:
      'An academic platform for institutional submissions and corrections, built around a typed React interface.',
    stack: ['TypeScript', 'React', 'Vite', 'Firebase'],
    github: `${personal.github}/VXL`,
    type: 'Academic software',
  },
  {
    name: 'Payment Fraud Detection',
    category: 'AI / ML',
    description:
      'A classification workflow exploring transaction features and patterns associated with online payment fraud.',
    stack: ['Python', 'Scikit-learn', 'Pandas'],
    github: `${personal.github}/Online_Payment_Fraud_Detection`,
    type: 'Classification · Data',
  },
  {
    name: 'Daily Journal',
    category: 'Software',
    description:
      'A journaling application exploring authenticated APIs, persistent entries and event-driven communication.',
    stack: ['Spring Boot', 'MongoDB', 'JWT', 'Kafka', 'React', 'Maven'],
    github: `${personal.github}/Daily-Journal-App`,
    type: 'Backend engineering',
  },
];

export const experience = [
  {
    company: 'Ernst & Young Global Delivery Services',
    short: 'EY GDS',
    role: 'AI & Data Engineer',
    period: 'Jun 2026 – Present',
    current: true,
    description:
      'Converted to a full-time AI & Data Engineer role following the January–May 2026 internship.',
    projects: [],
  },
  {
    company: 'Ernst & Young Global Delivery Services',
    short: 'EY GDS',
    role: 'AI & Data Intern',
    period: 'Jan 2026 – May 2026',
    current: false,
    description:
      'Contributed to enterprise AI, data engineering and MLOps solutions, working across agentic AI, RAG, APIs and full-stack development.',
    projects: [
      {
        name: 'Agentic Data Ingestion Platform',
        description:
          'Contributed to automated discovery and ingestion of enterprise data from multiple cloud sources. A reusable JSON configuration approach was designed to reduce manual setup and inconsistent workflows.',
        stack:
          'Streamlit · Databricks · Unity Catalog · LangChain · REST APIs · Control Plane Service',
      },
      {
        name: 'MLOps Experiment Tracking Dashboard',
        description:
          'Contributed to a full-stack dashboard for experiment runs, model metrics and comparison across Databricks, improving traceability and visibility beyond the default MLflow UI.',
        stack:
          'MLflow · Databricks SQL · Delta Tables · PySpark · FastAPI · React · Axios · Python · Uvicorn · scikit-learn · pandas · NumPy',
      },
    ],
  },
  {
    company: 'Hindustan Aeronautics Limited',
    short: 'HAL',
    role: 'Tech Intern',
    period: 'Jun 2025 – Jul 2025',
    current: false,
    description:
      'Developed and deployed a secure application for aircraft-part manufacturing cost estimation, improving decision-making speed by approximately 25%.',
    projects: [
      {
        name: 'Manufacturing cost estimation',
        description:
          'Built a Node.js and MySQL backend for man-hour, man standard rate and material cost computation and reporting. Used express-session, bcrypt and role-based access control within an MVC architecture, with GitHub version control and a CI/CD deployment workflow.',
        stack: 'Node.js · MySQL · Express.js · bcrypt · MVC · CI/CD',
      },
    ],
  },
];

export interface SkillGroup {
  id: string;
  label: string;
  headline: string;
  description: string;
  skills: string[];
  evidence: { name: string; text: string; href?: string }[];
  learning?: string;
}
export const skillGroups: SkillGroup[] = [
  {
    id: 'ai',
    label: 'AI / ML',
    headline: 'From data to a working model.',
    description:
      'Model experimentation, computer vision and audio classification, connected to usable applications.',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'Pandas', 'NumPy'],
    evidence: [
      {
        name: 'Voice Anti-Spoofing',
        text: 'CNNs and Vision Transformers on Mel Spectrograms, served through FastAPI.',
        href: `${personal.github}/Voice-Anti-Spoofing-Web-App`,
      },
      {
        name: 'Virtual Try-On',
        text: 'Image processing and deep-learning experiments.',
        href: `${personal.github}/VirtualTryOn`,
      },
    ],
  },
  {
    id: 'genai',
    label: 'GenAI / LLM',
    headline: 'AI with an application around it.',
    description:
      'Structured conversations, evaluation and persistent context; connecting model capabilities to a product workflow.',
    skills: [
      'LLM Applications',
      'Groq',
      'AI SDK',
      'Structured AI Workflows',
      'Agentic AI',
      'RAG',
      'LangChain',
    ],
    evidence: [
      {
        name: 'ArguLab',
        text: 'Streaming conversations, structured reviews and personalized future sessions.',
        href: '/projects/argulab',
      },
      {
        name: 'EY internship',
        text: 'Agentic data ingestion and exposure to RAG and enterprise AI workflows.',
      },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    headline: 'The interface is part of the system.',
    description: 'Responsive product experiences that make AI workflows understandable and usable.',
    skills: [
      'React.js',
      'TypeScript',
      'JavaScript',
      'Vite',
      'Tailwind CSS',
      'HTML',
      'CSS',
      'Streamlit',
    ],
    evidence: [
      {
        name: 'ArguLab',
        text: 'Responsive mobile-first AI product experience, built with React 19 and TypeScript.',
        href: '/projects/argulab',
      },
      {
        name: 'EY MLOps dashboard',
        text: 'React interface for experiments, metrics and model comparison.',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    headline: 'Reliable boundaries. Useful APIs.',
    description:
      'Authentication, owned user data and server-side integrations for full-stack software.',
    skills: [
      'Fastify',
      'Node.js',
      'FastAPI',
      'Spring Boot',
      'REST APIs',
      'Express.js',
      'Better Auth',
      'Spring Security',
      'JWT',
      'Uvicorn',
    ],
    evidence: [
      {
        name: 'ArguLab',
        text: 'Fastify, Better Auth, authenticated APIs and server-side AI.',
        href: '/projects/argulab',
      },
      {
        name: 'HAL',
        text: 'Node.js APIs, session authentication, password hashing and role-based access.',
      },
    ],
  },
  {
    id: 'data',
    label: 'Data engineering',
    headline: 'Context that survives the session.',
    description: 'Relational persistence, configurable ingestion and experiment data workflows.',
    skills: [
      'SQL',
      'PostgreSQL',
      'Supabase',
      'Databricks',
      'PySpark',
      'Delta Tables',
      'MySQL',
      'MongoDB',
    ],
    evidence: [
      {
        name: 'ArguLab',
        text: 'PostgreSQL on Supabase for user context and account session history.',
        href: '/projects/argulab',
      },
      {
        name: 'EY internship',
        text: 'Databricks, PySpark, Delta Tables and configurable ingestion.',
      },
    ],
  },
  {
    id: 'mlops',
    label: 'MLOps / DevOps',
    headline: 'Beyond the notebook.',
    description: 'Experiment tracking, testing, container configuration and deployment workflows.',
    skills: ['MLflow', 'Docker', 'CI/CD', 'GitHub Actions', 'DVC', 'Kubernetes', 'KServe'],
    evidence: [
      { name: 'EY MLOps dashboard', text: 'MLflow experiments and model lifecycle visibility.' },
      {
        name: 'ArguLab',
        text: 'Docker backend configuration, unit/integration tests and Playwright browser testing.',
        href: '/projects/argulab',
      },
    ],
    learning: 'DVC, Kubernetes and KServe: learned and practiced through MLOps training.',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    headline: 'Learning the deployment lifecycle.',
    description:
      'Cloud infrastructure and production MLOps concepts practiced through structured training.',
    skills: ['AWS EC2', 'AWS S3', 'AWS SageMaker', 'VPC', 'Load balancers', 'Nginx', 'Gunicorn'],
    evidence: [
      {
        name: 'MLOps Zero to Hero',
        text: '12.5 hours of training covering data versioning, cloud deployment, model management and monitoring.',
        href: 'https://ude.my/UC-9e829c95-e6db-4262-b425-005e973a13ba',
      },
    ],
    learning:
      'AWS technologies shown here reflect training and practice, not large-scale production experience.',
  },
  {
    id: 'engineering',
    label: 'Languages & tools',
    headline: 'A foundation in software engineering.',
    description:
      'Algorithms, version control and the everyday tools used to move from an idea to working software.',
    skills: [
      'Java',
      'Python',
      'C',
      'C++',
      'SQL',
      'Git',
      'GitHub',
      'Bun',
      'Jupyter',
      'VS Code',
      'IntelliJ',
    ],
    evidence: [
      {
        name: 'Problem solving',
        text: '370+ LeetCode problems solved; top 2% globally.',
        href: personal.leetcode,
      },
      {
        name: 'Full-stack projects',
        text: 'Source control and development workflows across AI and software applications.',
        href: personal.github,
      },
    ],
  },
];

export const certifications = [
  {
    name: 'MLOps Zero to Hero',
    issuer: 'Udemy',
    detail: '14 Sep 2026 · 12.5 hours',
    href: 'https://ude.my/UC-9e829c95-e6db-4262-b425-005e973a13ba',
    topics:
      'ML lifecycle, DVC, S3, MLflow, Docker, EC2, VPC, load balancers, Gunicorn, Nginx, Kubernetes, KServe, SageMaker, CI/CD and model monitoring.',
  },
  {
    name: 'ML Practitioner Series — 6 courses',
    issuer: 'Databricks Academy',
    detail: 'Apr–May 2026 · Completed learning plan',
    topics: 'PySpark, MLflow, ML lifecycle and MLOps.',
  },
  {
    name: 'Master LangChain & Gen AI — Build #16 AI Apps HuggingFace LLM',
    issuer: 'Udemy',
    detail: '2 Dec 2025 · 10 hours',
    topics: 'LangChain, generative AI applications and Hugging Face LLMs.',
  },
  {
    name: 'The Complete Full-Stack Web Development Bootcamp',
    issuer: 'Udemy',
    detail: '11 Jul 2025 · 61.5 hours',
    topics: 'Full-stack web development.',
  },
  {
    name: 'Data Structures & Algorithms in Java',
    issuer: 'Great Learning Academy',
    detail: 'Course certificate',
    topics: 'Data structures, algorithms and problem solving in Java.',
  },
];
