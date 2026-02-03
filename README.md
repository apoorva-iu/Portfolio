# Full-Stack Portfolio
This project is a high-performance personal portfolio built with React.js and Supabase. Unlike static portfolios, this application is fully dynamic; it serves as a frontend interface that renders professional data fetched directly from a PostgreSQL database.

# What I Built
### 1. Dynamic Data Architecture (The Backend)
Instead of hardcoding my experience, I built a relational database on Supabase. I created and managed several tables to store my professional profile:

Projects & Skills: Managed through structured SQL tables.

Experience & Education: A dynamic timeline that updates automatically.

Row Level Security (RLS): Configured database permissions to allow the frontend to fetch data securely.

### 2. The React Frontend
I developed a modular React application using Vite for high-speed performance.

State Management: Used useEffect and useState hooks to trigger data fetching as soon as the page loads.

Parallel Fetching: Implemented Promise.all logic to pull data from 7+ different database tables simultaneously, ensuring the fastest possible load time for the user.

### 3. Custom UI Engineering (The Design)
I designed a unique visual language using Pure CSS:

Card-System: Built an interactive project gallery with 3D hover transforms.

Circuit Aesthetics: Created "motherboard nodes" and circuit-line connectors using CSS pseudo-elements (::before and ::after) to give the site a technical, engineered feel.

Interactive Tooltips: Developed a custom tooltip system that displays technology names when hovering over stack icons.

# Tech Stack Used
Language: JavaScript (ES6+)

Framework: React.js

Database: PostgreSQL (via Supabase)

Query Language: SQL

Styling: CSS3 (Flexbox, Grid, Animations)

Environment: Node.js & Vite

# Database Structure (Supabase)
This portfolio is data-driven. It expects the following tables in your Supabase project:

home_data: Hero section titles and subtitles.

about_data: Biographical information.

skills_data: List of technical skills with icon references.

projects_data: Project titles, descriptions, features, and links.

education_data & experience_data: Professional and academic timeline.


## Setup & Installation

### 1. Clone the Repo
```bash
git clone [https://github.com/apoorva-iu/Portfolio.git]
cd Portfolio

⚙️ How to Run the Project
Install Dependencies:

Bash
npm install

Code snippet
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

Start Development Server:
Bash
npm start

📈 Key Learnings
Asynchronous Programming: Mastering async/await for handling database responses.

Database Management: Learning how to structure relational data and write SQL commands for production environments.

Component Lifecycle: Managing how and when data should be fetched to optimize user experience.

## Developed by Apoorva I U — 2026


