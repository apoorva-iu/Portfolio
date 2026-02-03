import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from '../../supabaseClient'; 
import './contacts.css';

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState('INITIATE_HANDSHAKE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('TRANSMITTING...');

    // Extracting values directly from the ref
    const name = form.current.name.value;
    const email = form.current.email.value;
    const message = form.current.message.value;

    try {
      // 1. Save to Supabase (Matching your exact SQL schema)
      const { error: supabaseError } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: name, 
            email: email, 
            message: message 
          }
        ]);

      if (supabaseError) {
        console.error('Supabase Error:', supabaseError);
        throw supabaseError;
      }

      // 2. Send via EmailJS
      await emailjs.sendForm(
        'service_bezatba', 
        'template_al90l1h', 
        form.current, 
        'ytaZ0zjrE7Uh24Zw1'
      );

      setStatus('HANDSHAKE_COMPLETE');
      form.current.reset(); 
    } catch (error) {
      console.error('Transmission Failure:', error);
      setStatus('LINK_ERROR_RETRY');
      setTimeout(() => setStatus('INITIATE_HANDSHAKE'), 3000);
    }
  };

  return (
    <section className="hologram-contact" id="contact">
      <h1 className="outside-title">
        Let's Discuss <span className="cyan-highlight">Your Vision</span>
      </h1>

      <div className="contact-frame">
        <div className="contact-sidebar">
          <div className="sidebar-header">
            <div className="status-dot pulse"></div>
            <span className="hub-text">ACTIVE_LINK</span>
          </div>
          
          <div className="sidebar-links">
            <div className="side-item">
              <span className="side-label">DIRECT_MAIL</span>
              <span className="side-value">apoorvaiu2004@gmail.com</span>
            </div>

            <div className="side-item">
              <span className="side-label">PHONE_LINE</span>
              <span className="side-value">+91 9074463615</span>
            </div>

            <div className="side-item socials-group">
              <span className="side-label">SOCIAL_NODES</span>
              <div className="side-socials">
                <a href="https://linkedin.com/in/apoorva-i-u-97059034b" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://github.com/apoorva-iu" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://www.instagram.com/o.studyyy?igsh=eTl4ZmYxazEwNnlv" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
                                    
              <a href="/Apoorva_CV.pdf" download="Apoorva_CV.pdf" style={{ textDecoration: 'none' }}>
                <button className="cv-pill-btn-medium" type="button">
                  <i className="fas fa-download"></i> DOWNLOAD_CV
                </button>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-main">
          {status === 'HANDSHAKE_COMPLETE' ? (
            <div className="success-message-overlay">
              <div className="success-icon">
                <i className="fas fa-shield-check"></i>
              </div>
              <h3 className="success-title">TRANSMISSION_RECEIVED</h3>
              <p className="success-text">
                Your vision has been securely delivered. 
                Expect a response once the handshake is processed.
              </p>
              <button 
                className="edit-btn" 
                style={{marginTop: '20px', width: 'auto'}}
                onClick={() => setStatus('INITIATE_HANDSHAKE')}
              >
                SEND_NEW_MESSAGE
              </button>
            </div>
          ) : (
            <>
              <h3 className="box-internal-title">Connect With Me</h3>
              <form ref={form} onSubmit={handleSubmit} className="hologram-form">
                <div className="input-box">
                  <input type="text" name="name" required />
                  <label>NAME</label>
                  <div className="glitch-line"></div>
                </div>
                <div className="input-box">
                  <input type="email" name="email" required />
                  <label>EMAIL_ADDRESS</label>
                  <div className="glitch-line"></div>
                </div>
                <div className="input-box">
                  <textarea name="message" required rows="3"></textarea>
                  <label>MESSAGE</label>
                  <div className="glitch-line"></div>
                </div>
                <button 
                  type="submit" 
                  className="neon-submit" 
                  disabled={status === 'TRANSMITTING...'}
                >
                  {status}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;