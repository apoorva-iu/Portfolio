import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 
import './certification.css';

const Certification = () => {
  const [certs, setCerts] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setCerts(data || []);
      } catch (error) {
        console.error('Error fetching certs:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  if (loading) return (
    <div className="loading-text">
      ACCESSING_SECURE_DATABASE...
    </div>
  );

  return (
    <section className="cert-hub" id="certifications">
      <div className="cert-container">
        <h2 className="cert-title">VERIFIED_CREDENTIALS</h2>
        
        <div className="cert-grid">
          {certs.map((cert) => (
            <div 
              key={cert.id} 
              className="cert-card" 
              onClick={() => setSelectedImg(cert.cert_url)}
            >
              <div className="cert-preview">
                <img 
                  src={cert.cert_url} 
                  alt={cert.name} 
                  className="cert-img-small"
                />
                <div className="cert-hover-hint">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
              <div className="cert-info">
                <img src={cert.logo_url} alt="provider" className="provider-logo" />
                <span className="cert-name">{cert.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Overlay: Image Only */}
      {selectedImg && (
        <div className="cert-overlay" onClick={() => setSelectedImg(null)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setSelectedImg(null)}>&times;</span>
            <div className="img-wrapper">
              <img src={selectedImg} alt="Certificate Full View" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certification;