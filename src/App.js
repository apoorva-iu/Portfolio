import React, { useState, useEffect } from 'react'; // Added this line
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Component Imports - DOUBLE CHECK THESE PATHS MATCH YOUR FOLDERS
import Navbar from "./components/NavBar/navbar";
import CustomCursor from './components/CustomCursor/CustomCursor';
import Home from "./components/Home/home";
import About from "./components/About/about";
import Projects from './components/Projects/projects';
import Contacts from './components/Contacts/contacts';
import Admin from './Admin/admin'; // Make sure folder is 'admin' and file is 'Admin.js'
import Certification from './components/Certification/certification';



import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true,
    });

    const fetchAllData = async () => {
      try {
        const [home, aboutMain, edu, skills, exp] = await Promise.all([
          supabase.from('home_data').select('*').single(),
          supabase.from('about_data').select('*').single(),
          supabase.from('education_data').select('*').order('id', { ascending: true }),
          supabase.from('skills_data').select('*').order('id', { ascending: true }),
          supabase.from('experience_data').select('*').order('id', { ascending: true })
        ]);

        if (home.data) setData(home.data);

        setAboutData({
          ...aboutMain.data,
          educationList: edu.data,
          skillsList: skills.data,
          experienceList: exp.data
        });

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAllData();
  }, []);

  return (
    <Router>
      <div className="App">
        <CustomCursor />

        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={
            <>
              <Navbar data={data} />
              <Home data={data} />
              <About data={aboutData} />
              <Projects />
              <Certification />

              <Contacts />


            </>
          } />

          {/* Admin Panel Route */}
          <Route path="/admin-control" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;