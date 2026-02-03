import React, { useState } from 'react';
import './about.css';

const About = ({ data }) => {
    const [activeTab, setActiveTab] = useState('skills');
    const [isDownloading, setIsDownloading] = useState(false);

    if (!data) return null;

    const handleDownloadClick = (e) => {
        // 1. Prevent instant jump
        e.preventDefault();
        setIsDownloading(true);

        // 2. Artificial delay (1.5 seconds) to show "Downloading..."
        setTimeout(() => {
            setIsDownloading(false);
            // 3. Manually trigger the open in a new tab
            window.open(data.cv_url, '_blank', 'noopener,noreferrer');
        }, 1500);
    };

    return (
        <section id="about" className="about" data-aos="fade-up">
            <div className="about-container">
                <div className="about-row">
                    
                    {/* COLUMN 1: BIO */}
                    <div className="about-col-left">
                        <h1 className="about-title">About <span>Me</span></h1>
                        <p className="about-bio">{data.bio_main}</p>
                        <p className="about-bio small">{data.bio_small}</p>
                    </div>

                    {/* COLUMN 2: TABS */}
                    <div className="about-col-right">
                        <div className="glass-card">
                            <div className="tab-navigation">
                                {['skills', 'education', 'experience'].map((tab) => (
                                    <button 
                                        key={tab}
                                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                                <div className={`tab-indicator ${activeTab}`}></div>
                            </div>

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                                <div className="skills-grid">
                                    {data.skillsList?.map((skill) => (
                                        <div className="skill-group" key={skill.id}>
                                            <span className="info-label">{skill.category}</span>
                                            <p className="skill-text">{skill.list}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'education' && (
                                <ul className="info-list">
                                    {data.educationList?.map((edu) => (
                                        <li key={edu.id}>
                                            {/* Changed {duration} to {edu.duration} */}
                                            <span>{edu.duration || "Date TBD"}</span> 
                                            {edu.degree}
                                            <div className="sub-detail">{edu.institution}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* Experience Tab */}
                            {activeTab === 'experience' && (
                                <ul className="info-list">
                                    {data.experienceList?.map((exp) => (
                                        <li key={exp.id}>
                                            <span>{exp.title} ({exp.duration})</span>
                                            <div className="sub-detail">{exp.company}</div>
                                            <p className="tab-desc">{exp.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div> 
                </div> 

                {/* THE DOWNLOAD BUTTON WITH DELAY */}
                <div className="about-footer">
                    <a 
                        href={data.cv_url} 
                        onClick={handleDownloadClick}
                        className={`cv-button-glow ${isDownloading ? 'is-loading' : ''}`}
                    >
                        <span className="btn-text">
                            {isDownloading ? "Downloading..." : (data.cv_button_text || "Download CV")}
                        </span>
                        <span className="btn-icon">
                            <i className={isDownloading ? "fas fa-spinner fa-spin" : "fas fa-download"}></i>
                        </span>
                        <div className="btn-glow-layer"></div>
                    </a>
                </div>
            </div> 
        </section>
    );
};

export default About;