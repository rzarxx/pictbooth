import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <br>
    <div className="background-gradient h-screen flex  flex-col justify-center items-center text-center">
      <div className="home-container">
        <h1 className="text-5xl font-bold text-pink-600 mb-4">PictBooth</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to RezzDev' photobooth! This is your personal photobooth at home.
        </p>      
          
        <img src="/photobooth-strip.png" alt="photobooth strip" className="photobooth-strip"/>
        
        <button onClick={() => navigate("/welcome")} className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
        >START</button>

        <footer className="mt-8 text-sm text-gray-600">
          <p>
            made by{" "}
            <a
              href="https://instagram.com/rza.rxx" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: "pink", textDecoration: "none" }}>RezzDev</a>
            </p>
            <p>© 2025 Rezz Dev. All Rights Reserved.</p>
        </footer>
      </div>
    );
  };

export default Home;
