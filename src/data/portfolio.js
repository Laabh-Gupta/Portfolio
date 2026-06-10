export const personal = {
  name: "Laabh Gupta",
  tagline: "Full-Stack Developer · AI/ML Engineer · Data Engineer",
  email: "reachlaabhgupta@gmail.com",
  phone: "+91 9793084444",
  location: "Kanpur, India",
  github: "https://github.com/Laabh-Gupta",
  linkedin: "https://linkedin.com/in/laabhgupta",
  leetcode: "https://leetcode.com/u/laabhgupta",
  hackerrank: "https://hackerrank.com/profile/laabhgupta",
  summary: "Results-oriented developer with a B.Tech in Computer Science (AI & ML) and hands-on industry experience in agentic AI and data engineering at EY GDS. Skilled in designing, building, and deploying scalable full-stack applications, machine learning models, and enterprise data pipelines. Strong foundation in Python, Java, and data structures combined with expertise in React.js, Node.js, Databricks, and cloud platforms."
};

export const skills = [
  { group: "Languages", items: ["Java", "Python", "C", "C++", "SQL"] },
  { group: "AI / ML", items: ["PyTorch", "TensorFlow", "Scikit-learn", "MLflow", "Agentic AI", "RAG", "LangChain", "OpenCV", "Pandas", "NumPy"] },
  { group: "Frontend", items: ["React.js", "TypeScript", "JavaScript", "HTML", "CSS", "Streamlit"] },
  { group: "Backend", items: ["Spring Boot", "Node.js", "FastAPI", "REST APIs", "Spring Security (JWT)", "Uvicorn", "Express.js"] },
  { group: "Data & Cloud", items: ["Databricks", "MySQL", "MongoDB", "PostgreSQL", "PySpark", "Delta Tables"] },
  { group: "Tools & Platforms", items: ["Git", "GitHub", "Docker", "CI/CD", "Kafka", "Jupyter", "VS Code", "IntelliJ"] },
];

export const experience = [
  {
    company: "Ernst & Young Global Delivery Services",
    role: "AI & Data Intern",
    period: "Jan 2026 – May 2026",
    desc: "Contributed to two enterprise-scale projects in data engineering and MLOps, while upskilling in Generative AI, RAG, Agentic AI, Databricks, and MLOps through structured learning and hands-on implementation.",
    projects: [
      {
        title: "Agentic Data Ingestion Platform",
        desc: "An agentic AI system that automates discovery and ingestion of enterprise data from multiple cloud sources into a unified platform — reducing dependency on experienced data engineers and scalable across multiple clients.",
        stack: ["Streamlit", "Databricks", "LangChain", "Unity Catalog", "REST APIs", "JSON Config Framework"]
      },
      {
        title: "MLOps Experiment Tracking Dashboard",
        desc: "A full-stack MLOps dashboard for real-time visibility into ML experiments, model runs, and performance metrics across a Databricks workspace — replacing the default MLflow UI with a stakeholder-friendly interface.",
        stack: ["React", "FastAPI", "MLflow", "PySpark", "Delta Tables", "Uvicorn", "Axios"]
      }
    ]
  },
  {
    company: "Hindustan Aeronautics Limited",
    role: "Tech Intern",
    period: "June 2025 – July 2025",
    desc: "Developed and deployed a secure full-stack application to automate cost estimation for aircraft parts manufacturing at India's premier aerospace company.",
    bullets: [
      "Built a modular Node.js + MySQL backend for man-hour, man standard rate, and material cost computation from internal production databases.",
      "Implemented Express-session auth with bcrypt password hashing for role-based access control across internal engineering teams.",
      "Improved decision-making speed by ~25% by streamlining computation pipelines using MVC architecture.",
      "Leveraged Agile methodology with CI/CD pipelines on GitHub for automated version control and deployment."
    ],
    stack: ["Node.js", "MySQL", "Express.js", "bcrypt", "MVC", "CI/CD", "GitHub"]
  }
];

export const projects = [
  {
    icon: "🛡️",
    name: "TruthGuard",
    highlight: "AI-powered misinformation detection system",
    desc: "LLM-powered platform for detecting misinformation and hallucinated content across textual sources. Combines retrieval-augmented generation, fact verification, and explainable AI techniques to provide trustworthy responses with supporting evidence.",
    stack: ["Python", "LangChain", "RAG", "LLMs", "FastAPI", "Streamlit"],
    github: "YOUR_REPO_LINK",
    featured: true
  },
  {
    icon: "🎙️",
    name: "Voice Anti-Spoofing System",
    highlight: "99.75% test accuracy in spoof detection",
    desc: "Deep learning system to differentiate AI-generated voices from human speech. Fine-tuned CNNs and a Vision Transformer (ViT) on Mel Spectrograms, deployed as a full-stack web app — bridging research to production.",
    stack: ["PyTorch", "Vision Transformer", "FastAPI", "React.js", "OpenCV"],
    github: "https://github.com/Laabh-Gupta/Voice-Anti-Spoofing-Web-App",
    featured: true
  },
  {
    icon: "📓",
    name: "Daily Journal App",
    highlight: "Event-driven architecture with Kafka",
    desc: "Full-stack journaling platform with a secure Spring Boot backend. Features JWT auth, role-based access control, Hibernate ORM for efficient persistence, and Confluent Kafka for async event-driven communication.",
    stack: ["Spring Boot", "MongoDB", "JWT", "Kafka", "React", "Maven"],
    github: "https://github.com/Laabh-Gupta/Daily-Journal-App",
    featured: true
  },
  {
    icon: "📚",
    name: "Advanced RAG Systems",
    highlight: "Multi-strategy retrieval experimentation framework",
    desc: "Collection of advanced Retrieval-Augmented Generation pipelines exploring hybrid search, query expansion, parent-document retrieval, contextual compression, and re-ranking strategies to improve answer quality and retrieval performance.",
    stack: ["LangChain", "Vector Databases", "Python", "RAG", "LLMs"],
    github: "YOUR_REPO_LINK",
    featured: true
  },
  {
    icon: "👗",
    name: "Virtual Try-On",
    highlight: "Real-time garment overlay with CV",
    desc: "Virtual clothing try-on app using image segmentation and geometric warping techniques — letting users visualize garments on their own image in real time.",
    stack: ["Python", "OpenCV", "Deep Learning", "Image Segmentation"],
    github: "https://github.com/Laabh-Gupta/VirtualTryOn",
    featured: false
  },
  {
    icon: "💰",
    name: "Payment Fraud Detection",
    highlight: "ML system for financial anomaly detection",
    desc: "Machine learning system to detect fraudulent online payment transactions. Uses classification algorithms and feature engineering to flag anomalous patterns.",
    stack: ["Python", "Scikit-learn", "Pandas", "Classification"],
    github: "https://github.com/Laabh-Gupta/Online_Payment_Fraud_Detection",
    featured: false
  },
  {
    icon: "🎓",
    name: "VXL — Academic Portal",
    highlight: "Full-stack assignment & submission system",
    desc: "Web platform for institutions to handle academic assignment submission and grading, with role management for students and instructors.",
    stack: ["TypeScript", "Node.js", "React", "REST API"],
    github: "https://github.com/Laabh-Gupta/VXL",
    featured: false
  },
  {
    icon: "🎧",
    name: "Speech Sentiment Analysis",
    highlight: "Emotion detection from spoken audio",
    desc: "Deep learning system for analyzing sentiment directly from speech signals. Extracted acoustic features from audio recordings and trained classification models to identify emotions and sentiment patterns in real-time conversations.",
    stack: ["Python", "Librosa", "TensorFlow", "Scikit-learn", "Audio Processing"],
    github: "YOUR_REPO_LINK",
    featured: false
  },
    {
    icon: "🏥",
    name: "Parkinson's Disease Detection",
    highlight: "Explainable AI for healthcare diagnostics",
    desc: "Machine learning system for early detection of Parkinson's disease using biomedical voice data. Combined predictive modeling with Explainable AI (XAI) techniques to identify key contributing features and provide interpretable insights for healthcare decision-making.",
    stack: ["Python", "Scikit-learn", "SHAP", "Pandas", "NumPy", "Classification"],
    github: "https://github.com/Laabh-Gupta/Parkinsons-disease-Detection",
    featured: true
  },
  {
    icon: "🎨",
    name: "Human Image Cartoonization",
    highlight: "AI-powered image stylization system",
    desc: "Computer vision application that transforms real human photographs into cartoon-style images using deep learning and image processing techniques while preserving facial structure and visual characteristics.",
    stack: ["Python", "OpenCV", "Deep Learning", "Computer Vision"],
    github: "YOUR_REPO_LINK",
    featured: false
  },
    {
    icon: "🚕",
    name: "Taxi Fare Prediction",
    highlight: "Regression-based demand forecasting model",
    desc: "Machine learning system for predicting taxi fares using trip-related features such as distance, location, and travel time. Applied feature engineering and regression techniques to improve pricing accuracy.",
    stack: ["Python", "Scikit-learn", "Pandas", "NumPy", "Regression"],
    github: "YOUR_REPO_LINK",
    featured: false
  }
];

export const achievements = [
  { icon: "⭐", title: "Converted to Full-Time at EY GDS", desc: "Earned a full-time AI & Data Engineer role at EY GDS based on strong performance and contributions during internship." },
  { icon: "⚡", title: "LeetCode Top 2% Globally", desc: "Solved 370+ coding problems, ranked in the top 2% worldwide — demonstrating advanced DSA and algorithmic skills." },
  { icon: "🏅", title: "HackClub — Top 20 AI/ML Students", desc: "Selected among the top 20 AI/ML students nationally through HackClub's competitive selection process." },
  { icon: "📜", title: "Databricks ML Practitioner Certified", desc: "Completed the full Databricks ML Practitioner Learning Plan — PySpark, MLflow, ML lifecycle, and MLOps." },
  { icon: "🎓", title: "Full-Stack Web Dev Bootcamp", desc: "Completed a comprehensive 61.5-hour Udemy bootcamp mastering front-end and back-end technologies end-to-end." },
  { icon: "☕", title: "DSA in Java — Great Learning", desc: "Certified in Data Structures & Algorithms in Java from Great Learning Academy." },
  { icon: "📊", title: "CGPA 8.1 — VIT Chennai", desc: "Strong academic performance in B.Tech Computer Science (AI & ML) at Vellore Institute of Technology." }
];

export const education = [
  { degree: "B.Tech — Computer Science (AI & ML)", school: "Vellore Institute of Technology, Chennai", detail: "2022 – 2026  ·  CGPA 8.1" },
  { degree: "Secondary School (Class XII)", school: "St. Thomas School, Kanpur", detail: "2021 – 2022  ·  92%" },
  { degree: "High School (Class X)", school: "St. Thomas School, Kanpur", detail: "2019 – 2020  ·  89%" }
];
