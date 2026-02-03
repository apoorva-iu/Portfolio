import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './admin.css';

const Admin = () => {
  const [session, setSession] = useState(null);
  const [activeTable, setActiveTable] = useState('dashboard');
  const [data, setData] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const tables = [
    { id: '📊 Dashboard', name: 'dashboard' },
    { id: 'Home', name: 'home_data' },
    { id: 'About', name: 'about_data' },
    { id: 'Skills', name: 'skills_data' },
    { id: 'Projects', name: 'projects_data' },
    { id: 'Education', name: 'education_data' },
    { id: 'Experience', name: 'experience_data' },
    { id: 'Certifications', name: 'certifications' },
    { id: 'Messages', name: 'contact_messages' }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (session && activeTable !== 'dashboard') {
      const fetchTableData = async () => {
        const { data, error } = await supabase.from(activeTable).select('*').order('id', { ascending: true });
        if (!error && isMounted) setData(data);
      };
      fetchTableData();
    }
    return () => { isMounted = false; };
  }, [activeTable, session]);

  const fetchTableData = async () => {
    const { data, error } = await supabase.from(activeTable).select('*').order('id', { ascending: true });
    if (!error) setData(data);
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    window.location.reload(); 
  };

  const handleFileUpload = async (event, columnName) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    const bucketName = 'portfolio_files'; 
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `${activeTable}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      setFormData({ ...formData, [columnName]: data.publicUrl });
      alert("Image uploaded successfully!");
    } catch (error) {
      alert("Upload error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const { id, created_at, ...payload } = formData;
    let result;
    if (editingItem) {
      result = await supabase.from(activeTable).update(payload).eq('id', editingItem.id);
    } else {
      result = await supabase.from(activeTable).insert([payload]);
    }
    if (result.error) alert(result.error.message);
    else {
      setEditingItem(null);
      setIsAdding(false);
      fetchTableData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this permanently?")) {
      const { error } = await supabase.from(activeTable).delete().eq('id', id);
      if (error) alert(error.message);
      else fetchTableData();
    }
  };

  if (!session) {
    return (
      <div className="admin-login-page">
        <div className="login-container">
          <form onSubmit={handleLogin} className="login-form">
            <h2>PORTFOLIO_ADMIN</h2>
            <div className="input-group">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h3>My_PANEL</h3>
        <div className="sidebar-nav">
          {tables.map(t => (
            <button 
              key={t.name} 
              className={activeTable === t.name ? 'active' : ''} 
              onClick={() => {
                setData([]); 
                setSearchTerm('');
                setActiveTable(t.name);
              }}
            >
              {t.id}
            </button>
          ))}
        </div>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="content">
        {activeTable === 'dashboard' ? (
          <div className="dashboard-view">
            <div className="content-header">
              <h1>System Overview</h1>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Tables Managed</h3>
                <p className="stat-number">{tables.length - 1}</p>
              </div>
              <div className="stat-card">
                <h3>Admin</h3>
                <p className="stat-number" style={{fontSize: '1.1rem', marginTop: '20px', wordBreak: 'break-all'}}>{session.user.email}</p>
              </div>
              <div className="stat-card">
                <h3>System Status</h3>
                <p className="stat-number" style={{color: '#4ade80', fontSize: '2rem'}}>CONNECTED</p>
                <small style={{color: '#8892b0'}}>Supabase Link Active</small>
              </div>
            </div>
            <div className="recent-activity">
              <h3>Quick Actions</h3>
              <div className="action-btns" style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
                <button className="edit-btn" onClick={() => { setData([]); setActiveTable('contact_messages'); }}>View Messages</button>
                <button className="edit-btn" onClick={() => { setData([]); setActiveTable('projects_data'); }}>Manage Projects</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="content-header">
              <h1>Managing: {activeTable.replace('_', ' ')}</h1>
              <div className="header-actions" style={{display: 'flex', gap: '15px'}}>
                <input 
                  type="text" 
                  className="search-bar" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="add-btn" onClick={() => {
                  setIsAdding(true);
                  const emptyForm = data.length > 0 ? Object.keys(data[0]).reduce((acc, key) => ({ ...acc, [key]: '' }), {}) : {};
                  setFormData(emptyForm);
                }}>+ Add New</button>
              </div>
            </div>

            <div className="data-table">
              {filteredData.map((item, index) => (
                <div key={item.id} className="data-row" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="item-info">
                    <strong>
                      {item.degree || item.full_name || item.title || item.category || item.name || `Entry #${index + 1}`}
                    </strong>
                    <p>
                      {item.institution || item.description || item.bio_main || item.message || item.list || item.desc || item.issuer || item.cert_url || "No Description"}
                    </p>
                    {(item.duration || item.date) && <small className="secondary-detail">📅 {item.duration || item.date}</small>}
                  </div>
                  <div className="button-group">
                    <button className="edit-btn" onClick={() => { setEditingItem(item); setFormData(item); }}>Edit</button>
                    <button className="del-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {filteredData.length === 0 && <p className="no-results">No entries found.</p>}
            </div>
          </>
        )}

        {(editingItem || isAdding) && (
          <div className="edit-modal">
            <div className="modal-content">
              <h3>{editingItem ? 'Edit Entry' : 'New Entry'}</h3>
              <div className="modal-scroll-area">
                {Object.keys(formData)
                  .filter(key => key !== 'id' && key !== 'created_at')
                  .map(key => (
                    <div key={key} className="input-group">
                      <label>{key.replace('_', ' ').toUpperCase()}</label>
                      <div className="field-container">
                        {key.includes('desc') || key.includes('bio') || key.includes('message') || key.includes('list') ? (
                          <textarea 
                            value={formData[key] || ''} 
                            onChange={e => setFormData({...formData, [key]: e.target.value})}
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={formData[key] || ''} 
                            onChange={e => setFormData({...formData, [key]: e.target.value})}
                          />
                        )}

                        {/* Upload ONLY for profile and general image URLs, excluding logo_url and cert_url */}
                        {(key === 'profile_img_url' || key === 'image_url') && (
                          <div className="file-upload-section">
                            <label className="custom-file-upload">
                              <input type="file" className="file-input" onChange={(e) => handleFileUpload(e, key)} disabled={uploading} />
                              {uploading ? "Uploading..." : "Upload File"}
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="modal-btns">
                <button className="save-btn" onClick={handleSave} disabled={uploading}>
                  {uploading ? 'Wait...' : 'Save Changes'}
                </button>
                <button className="cancel-btn" onClick={() => { setEditingItem(null); setIsAdding(false); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;