import React, { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';
import Tilt from 'react-parallax-tilt';
import { supabase } from '../../supabaseClient'; 
import './home.css';
import profile from '../../assets/profile.png';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const el = useRef(null);

  // 1. FETCH DATA FROM SUPABASE
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data: homeData, error } = await supabase
          .from('home_data')
          .select('*')
          .single(); // Since you only have one row for your bio

        if (!error) {
          setData(homeData);
        }
      } catch (err) {
        console.error("Connection error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // 2. MOUSE GLOW LOGIC
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. TYPING ANIMATION LOGIC
  useEffect(() => {
    if (!loading && data && el.current) {
      const typed = new Typed(el.current, {
        strings: data.typing_strings || ["Welcome"], 
        typeSpeed: 60,
        backSpeed: 40,
        loop: true
      });
      return () => typed.destroy();
    }
  }, [loading, data]);

  if (loading || !data) {
    return <section id="home" className="home" style={{ minHeight: '100vh' }}></section>;
  }

  return (
    <section 
        id="home" 
        className="home"
        style={{ '--x': `${mousePos.x}%`, '--y': `${mousePos.y}%` }}
    >
      <div className="home-content">
        <div className="home-text">
          <h1 className="fade-in">
            <span className="highlight">{data.full_name}</span>
          </h1>
          
          <p className="subtitle fade-in">
            <span ref={el}></span>
          </p>
          
          <p className="description fade-in">
            {data.description}
          </p>

          <div className="cta-buttons fade-in">
            <a href="#contact" className="btn">{data.cta_text || 'Get In Touch'}</a>
            {/* New View Resume button linking to About section */}
            <a href="#about" className="btn">View Resume</a>
          </div>

          <div className="social-links fade-in">
            <a href={data.linkedin_url} target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin-in"></i>
            </a>
            <a href={data.github_url} target="_blank" rel="noreferrer">
                <i className="fab fa-github"></i>
            </a>
            <a href={data.instagram_url} target="_blank" rel="noreferrer">
                <i className="fab fa-instagram"></i>
            </a>
          <a href="#contact">
            <i className="fas fa-envelope"></i>
          </a>
          </div>
        </div>

        <div className="home-image fade-in">
          <Tilt 
            tiltMaxAngleX={15} 
            tiltMaxAngleY={15} 
            perspective={1000} 
            transitionSpeed={1500}
            scale={1.02}
          >
            <div className="image-container">
              <img src={profile} alt={data.full_name} />
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
};

export default Home;