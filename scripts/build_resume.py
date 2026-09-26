"""Generate the portfolio resume from the September 2026 supplied brief.

Requires reportlab. Run from the application root with Python 3.
No external services, personal data uploads or private information.
"""
from pathlib import Path
from shutil import copyfile
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'output' / 'pdf'
OUT.mkdir(parents=True, exist_ok=True)
FILE = OUT / 'Laabh_Gupta_Resume.pdf'
NAVY = colors.HexColor('#172842')
BLUE = colors.HexColor('#365782')
MUTED = colors.HexColor('#526073')
styles = {
    'name': ParagraphStyle('Name', fontName='Helvetica-Bold', fontSize=25, leading=29, textColor=NAVY, spaceAfter=7),
    'role': ParagraphStyle('Role', fontName='Helvetica', fontSize=11, leading=15, textColor=BLUE, spaceAfter=10),
    'contact': ParagraphStyle('Contact', fontName='Helvetica', fontSize=8.5, leading=13, textColor=MUTED, spaceAfter=2),
    'section': ParagraphStyle('Section', fontName='Helvetica-Bold', fontSize=9.5, leading=14, textColor=BLUE, spaceBefore=17, spaceAfter=9, borderColor=colors.HexColor('#c8d2e0'), borderWidth=0, borderPadding=0),
    'heading': ParagraphStyle('Heading', fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=NAVY, spaceBefore=8, spaceAfter=3, keepWithNext=True),
    'meta': ParagraphStyle('Meta', fontName='Helvetica', fontSize=8.5, leading=12, textColor=BLUE, spaceAfter=6, keepWithNext=True),
    'body': ParagraphStyle('Body', fontName='Helvetica', fontSize=9.2, leading=13.5, textColor=colors.HexColor('#293341'), spaceAfter=6, alignment=TA_LEFT),
    'bullet': ParagraphStyle('Bullet', fontName='Helvetica', fontSize=9.2, leading=13.5, textColor=colors.HexColor('#293341'), leftIndent=10, firstLineIndent=-8, spaceAfter=5),
}
story=[]
def p(text, style='body'):
    story.append(Paragraph(text,styles[style]))
def bullet(text): p('- ' + text, 'bullet')
def section(text): p(text.upper(),'section')
def link(url,label): return f'<a href="{url}" color="#365782">{label}</a>'

p('LAABH GUPTA','name')
p('AI/ML Engineer | Software Engineer | MLOps &amp; DevOps','role')
p('Kanpur, India | +91 9793084444 | ' + link('mailto:reachlaabhgupta@gmail.com','reachlaabhgupta@gmail.com'),'contact')
p(link('https://github.com/Laabh-Gupta','GitHub: Laabh-Gupta') + ' | ' + link('https://linkedin.com/in/laabhgupta','LinkedIn: laabhgupta') + ' | ' + link('https://laabh-portfolio.netlify.app/','Portfolio'),'contact')
section('Profile')
p('Computer Science engineer specializing in AI/ML, with enterprise AI and data engineering experience at EY GDS and independent AI product development. Builds across model integration, full-stack applications, APIs, databases, automated testing and deployment workflows.')
section('Professional experience')
p('Ernst &amp; Young Global Delivery Services','heading')
p('AI &amp; Data Engineer | Jun 2026 - Present','meta')
p('Converted to a full-time AI &amp; Data Engineer role following the January-May 2026 internship.')
p('Ernst &amp; Young Global Delivery Services','heading')
p('AI &amp; Data Intern | Jan 2026 - May 2026','meta')
bullet('Contributed to enterprise AI, data engineering and MLOps solutions using Generative AI, RAG, Agentic AI, Databricks, MLflow, PySpark, REST APIs and full-stack development.')
bullet('<b>Agentic Data Ingestion Platform:</b> contributed to automated discovery and ingestion of enterprise data from multiple cloud sources. A reusable JSON configuration framework was designed to reduce manual setup and inconsistent ingestion workflows.')
p('Technologies: Streamlit, Databricks, Unity Catalog, LangChain, REST APIs, JSON configuration and Control Plane Service.','contact')
bullet('<b>MLOps Experiment Tracking Dashboard:</b> contributed to centralized visibility into experiment runs, metrics and model comparison across Databricks, improving traceability and stakeholder visibility beyond the default MLflow UI.')
p('Technologies: MLflow, Databricks SQL, Delta Tables, PySpark, FastAPI, Uvicorn, React, Axios, Python, scikit-learn, pandas and NumPy.','contact')
p('Hindustan Aeronautics Limited','heading')
p('Tech Intern | Jun 2025 - Jul 2025','meta')
bullet('Developed and deployed a secure full-stack application for aircraft-part manufacturing cost estimation, improving decision-making speed by approximately 25%.')
bullet('Built a Node.js and MySQL backend for man-hour, man standard rate and material cost computation, retrieval and reporting.')
bullet('Implemented express-session authentication, bcrypt password hashing and role-based access control within an MVC architecture; used GitHub version control and a CI/CD deployment workflow.')
section('Education')
p('Vellore Institute of Technology, Chennai','heading')
p('B.Tech, Computer Science Engineering with Artificial Intelligence and Machine Learning','body')
p('2022 - 2026 | CGPA: 8.1 / 10','meta')
section('Selected achievements')
p('370+ LeetCode problems solved; top 2% globally. Selected among the Top 20 AI/ML students nationally through HackClub.','body')

story.append(PageBreak())
p('SELECTED ENGINEERING WORK','name')
p('Laabh Gupta | AI applications, software &amp; MLOps','role')
section('Flagship project')
p('ArguLab - AI Communication Practice &amp; Personalized Training','heading')
p(link('https://argulab.netlify.app/dashboard','Live product') + ' | ' + link('https://github.com/Laabh-Gupta/argu-lab','Public product guide') + ' | ' + link('https://github.com/Laabh-Gupta/mindforge-ai-debate','Code and architecture'),'meta')
bullet('Built an AI training platform with nine practice modes: Debate, Group Discussion, Interview, Public Speaking, Extempore, Negotiation, Case Discussion, Real-World Simulation and Observer Analysis.')
bullet('Engineered an adaptive loop that summarizes sessions, extracts strengths and weaknesses, persists user-specific context and supplies that context to future session requests.')
bullet('Integrated streaming conversations and structured evaluation through Groq using openai/gpt-oss-120b. Added browser recording, Whisper transcription (whisper-large-v3-turbo), editable transcripts and browser Speech Synthesis.')
bullet('Implemented authenticated APIs, session persistence, user data ownership, database access controls, rate limiting, history, resumable sessions, transcripts, reviews, reports and JSON export.')
p('<b>Stack:</b> React 19, TypeScript, Vite, TanStack Router, Tailwind CSS, Fastify, Better Auth, AI SDK, PostgreSQL and Supabase. Netlify frontend, Render backend and Docker backend configuration. Responsive mobile-first experience.')
p('<b>Documented v3.0.1 verification:</b> 47 unit/integration tests and 21 Playwright browser tests passed.','body')
p('Voice Anti-Spoofing System','heading')
p('Project Lead | Dec 2024 - Mar 2025 | ' + link('https://github.com/Laabh-Gupta/Voice-Anti-Spoofing-Web-App','Repository'),'meta')
bullet('Developed a deep-learning system to distinguish AI-generated speech from genuine human speech using Mel Spectrograms, CNNs, Vision Transformers and data augmentation; achieved 99.75% test-set accuracy.')
bullet('Served PyTorch models through a FastAPI REST backend and built a React frontend, deploying the system as a full-stack application.')
section('Technical toolkit')
p('<b>Languages:</b> Java, Python, C, C++, SQL. <b>AI/ML:</b> PyTorch, TensorFlow, scikit-learn, OpenCV, pandas, NumPy, MLflow. <b>GenAI:</b> RAG, Agentic AI, LangChain, Groq, AI SDK, structured AI workflows.')
p('<b>Frontend:</b> React, TypeScript, JavaScript, Vite, Tailwind CSS, HTML, CSS, Streamlit. <b>Backend:</b> Fastify, FastAPI, Node.js, Express.js, Spring Boot, Spring Security, Better Auth, JWT, REST APIs, Uvicorn.')
p('<b>Data:</b> PostgreSQL, Supabase, Databricks, PySpark, Delta Tables, MySQL, MongoDB. <b>Engineering:</b> Docker, CI/CD, GitHub Actions, Git, GitHub, Bun, Jupyter, VS Code, IntelliJ.')
p('<b>Training and practice:</b> DVC, Kubernetes, KServe, AWS EC2, S3 and SageMaker through MLOps training; not represented as large-scale production experience.')
section('Certifications & continued learning')
p('<b>MLOps Zero to Hero</b> - Udemy | 14 Sep 2026 | 12.5 hours | ' + link('https://ude.my/UC-9e829c95-e6db-4262-b425-005e973a13ba','Certificate') + '<br/>ML lifecycle, data versioning, MLflow, Docker, cloud deployment, Kubernetes, KServe, CI/CD and monitoring.')
p('<b>Databricks Machine Learning Practitioner Learning Plan</b> - completed learning plan covering PySpark, MLflow, ML lifecycle and MLOps.<br/><b>Data Structures &amp; Algorithms in Java</b> - Great Learning Academy.')

def footer(canvas,doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#d5dde8'))
    canvas.line(42,35,A4[0]-42,35)
    canvas.setFont('Helvetica',7)
    canvas.setFillColor(MUTED)
    canvas.drawString(42,23,'LAABH GUPTA | reachlaabhgupta@gmail.com')
    canvas.drawRightString(A4[0]-42,23,f'{doc.page} / 2')
    canvas.restoreState()

doc=SimpleDocTemplate(str(FILE),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=36,bottomMargin=47,title='Laabh Gupta - AI/ML Engineer | Software Engineer | MLOps & DevOps',author='Laabh Gupta')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
copyfile(FILE,ROOT/'public'/'Laabh_Gupta_Resume.pdf')
copyfile(FILE,ROOT/'public'/'Laabh_Gupta.pdf')
print(FILE)
