import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './projects.css';

// 1. Initialize Supabase using Environment Variables from your .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create the client ONLY if the keys exist to prevent crashes
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      // If supabase failed to initialize (keys missing)
      if (!supabase) {
        console.error("Supabase keys are missing from .env file!");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('projects_data')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 4. Loading State
  if (loading) {
    return (
      <section className="projects-section">
        <h1 className="gallery-header" style={{ opacity: 0.5 }}>INITIALIZING SYSTEMS...</h1>
      </section>
    );
  }

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">
        <h1 className="gallery-header">
          PROJECTS <span>GALLERY</span>
          <a href="https://github.com/apoorva-iu" target="_blank" rel="noreferrer" className="main-github-link">
            <i className="fab fa-github"></i>
          </a>
        </h1>
        
        <div className="bento-motherboard">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className={`cyber-card ${project.size}`}>
                <div className="circuit-h"></div>
                <div className="circuit-node"></div>
                
                <div className="card-inner">
                  <div className="card-top">
                    <span className="status-badge">
                      <span className="blink-dot"></span> [{project.status}]
                    </span>
                    <i className="fas fa-microchip chipset"></i>
                  </div>

                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>

                  <div className="tech-footer">
                    <div className="tech-logos">
                      {project.tech && project.tech.map((t, i) => (
                        <div key={i} className="tech-box" data-name={t.name}>
                          {t.img ? (
                            <img src={t.img} alt={t.name} className="tech-icon-img" />
                          ) : (
                            <i className={`${t.icon} tech-icon-fa`}></i>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="project-links">
                      <a href={project.demo} target="_blank" rel="noreferrer" className="demo-btn">LIVE_DEMO</a>
                      <a href={project.repo} target="_blank" rel="noreferrer" className="repo-icon">
                        <i className="fab fa-github"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Fallback if database is empty or connection fails */
            <div style={{ color: '#00d9ff', textAlign: 'center', gridColumn: '1/-1', padding: '100px' }}>
               <h2>SYSTEM_OFFLINE: No projects detected.</h2>
               <p>Check console for errors or verify Supabase RLS policies.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;