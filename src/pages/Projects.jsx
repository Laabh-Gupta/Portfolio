import { useState } from "react";
import { projects } from "../data/portfolio";
import { useFadeIn } from "../components/useFadeIn";
import "./Projects.css";

const FILTERS = ["All", "Featured", "AI/ML", "Full-Stack", "Data"];

const PROJECT_FILTER_MAP = {
  "All": () => true,
  "Featured": p => p.featured,
  "AI/ML": p => p.stack.some(s => ["PyTorch","TensorFlow","Scikit-learn","OpenCV","Deep Learning","Vision Transformer","Classification","Regression","Image Segmentation","Computer Vision","Audio Processing","SHAP","MLflow","LangChain","RAG","LLMs"].includes(s)),
  "Full-Stack": p => p.stack.some(s => ["React.js","React","Spring Boot","FastAPI","Node.js","TypeScript","REST API","JWT","Kafka","MongoDB","Maven","Streamlit"].includes(s)),
  "Data": p => p.stack.some(s => ["Pandas","NumPy","Scikit-learn","Classification","Regression","MLflow"].includes(s)),
};

export default function Projects() {
  const [filter, setFilter] = useState("All");
  useFadeIn();

  const visible = projects.filter(PROJECT_FILTER_MAP[filter]);

  return (
    <div className="projects-page">
      <div className="projects-header fade-in">
        <p className="section-label">Things I've built</p>
        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">
          A collection of full-stack apps, ML systems, and data engineering tools — all production-deployed or production-ready.
        </p>
        <div className="filter-bar">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid fade-in">
        {visible.map((p, i) => (
          <div key={i} className={`project-card${p.featured ? " featured" : ""}`}>
            <div className="project-top">
              <span className="project-icon">{p.icon}</span>
              <div className="project-badges">
                {p.featured && <span className="featured-badge">Featured</span>}
                <a href={p.github} target="_blank" rel="noreferrer" className="project-gh-link">↗ GitHub</a>
              </div>
            </div>
            <div className="project-name">{p.name}</div>
            <div className="project-highlight">⚡ {p.highlight}</div>
            <p className="project-desc">{p.desc}</p>
            <div className="project-stack">
              {p.stack.map(s => <span key={s} className="stack-tag">{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
