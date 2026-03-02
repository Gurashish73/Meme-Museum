import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ASSETS ---
import funnySong from '../assets/audio/funny_song.mp3';
import alarmSound from '../assets/audio/alarm.mp3'; 
import scaryLaugh from '../assets/audio/scary_laugh.mp3'; 
import princessSticker from '../assets/stickers/princess.png'; 
import devilGif from '../assets/gifs/devil.gif'; 
import waScreenshot1 from '../assets/stickers/screenshot1.png';

export default function Void() {
  const navigate = useNavigate();
  
  // Mouse and Game States
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [devilEncountered, setDevilEncountered] = useState(false);
  const [queenSaved, setQueenSaved] = useState(false); 
  
  const [queenPos, setQueenPos] = useState({ x: window.innerWidth * 0.8, y: window.innerHeight * 0.8 });
  const [devilPos, setDevilPos] = useState({ x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 });
  
  const audioRef = useRef(null);
  const alarmRef = useRef(null);
  const laughRef = useRef(null);

  // Distractions (Massive & Engraved)
  const distractions = [
    { x: '10vw', y: '15vh', text: 'Oyeee bkl lick krdunga' },
    { x: '65vw', y: '20vh', text: 'kal phir mai ek pauwa coke ka piyunga' },
    { x: '35vw', y: '80vh', text: 'Ignore Krdiya' },
    { x: '75vw', y: '65vh', text: 'Thoda Rude Thoda Cute Killer mera Attitude #Gurraraper' },
    { x: '45vw', y: '20vh', img: waScreenshot1 },
    { x: '20vw', y: '35vh', text: '...is someone breathing behind you?' }
  ];

  // --- AUDIO SETUP (Horror Mode) ---
  useEffect(() => {
    audioRef.current = new Audio(funnySong);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    audioRef.current.playbackRate = 0.4; 
    audioRef.current.play().catch(e => console.log("Audio blocked until interaction"));

    alarmRef.current = new Audio(alarmSound);
    laughRef.current = new Audio(scaryLaugh);

    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (alarmRef.current) alarmRef.current.pause();
      if (laughRef.current) laughRef.current.pause();
    };
  }, []);

  // Flashlight tracking
  const handleMouseMove = (e) => {
    if (!devilEncountered && !queenSaved) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // --- THE JUMPSCARE TRIGGER ---
  const triggerDevil = () => {
    if (devilEncountered || queenSaved) return;
    setDevilEncountered(true);
    
    if (audioRef.current) audioRef.current.pause();
    
    if (alarmRef.current) {
      alarmRef.current.volume = 0.2; 
      alarmRef.current.play().catch(e => console.log(e));
    }
    
    if (laughRef.current) {
      laughRef.current.volume = 1.0; 
      laughRef.current.currentTime = 0;
      laughRef.current.play().catch(e => console.log(e));
    }
  };

  // --- WIN CONDITION (QUEEN SAVED) ---
  const catchQueen = (e) => {
    e.stopPropagation();
    if (devilEncountered) return; 
    
    if (audioRef.current) audioRef.current.pause();
    setQueenSaved(true); 
  };

  // Make Queen jump around
  useEffect(() => {
    if (devilEncountered || queenSaved) return;
    const interval = setInterval(() => {
      setQueenPos({
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: Math.random() * (window.innerHeight - 200) + 100
      });
    }, 2500); 
    return () => clearInterval(interval);
  }, [devilEncountered, queenSaved]);

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        backgroundColor: queenSaved ? '#ffffff' : '#000000', 
        overflow: 'hidden',
        position: 'relative',
        cursor: (devilEncountered || queenSaved) ? 'default' : 'crosshair',
        transition: 'background-color 1s ease'
      }}
    >
      {/* =========================================
            NORMAL GAMEPLAY (THE FLASHLIGHT)
      ========================================== */}
      {!devilEncountered && !queenSaved && (
        <>
          {/* THE FLASHLIGHT BEAM (zIndex 50 covers everything below it!) */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
            background: `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, transparent 10%, rgba(0,0,0,0.95) 60%, #000000 100%)`,
            pointerEvents: 'none', 
            zIndex: 50 
          }} />

          {/* BACKGROUND DISTRACTIONS (zIndex 10 - hidden in dark) */}
          {/* BACKGROUND DISTRACTIONS (Hidden UNDER the darkness) */}
          {/* BACKGROUND DISTRACTIONS (Hidden UNDER the darkness with images) */}
          {distractions.map((item, i) => (
            <motion.div 
              key={i} 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 + (i % 3), ease: "easeInOut" }}
              style={{ 
                position: 'absolute', 
                left: item.x, 
                top: item.y, 
                color: '#33ff33', 
                fontFamily: 'monospace', 
                fontSize: '1.8rem', 
                fontWeight: 'bold',
                zIndex: 10, // BELOW the darkness mask
                maxWidth: '400px',
                textShadow: '0 0 15px rgba(51, 255, 51, 0.8)',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
            >
              {/* Renders the text if it exists */}
              {item.text && <div>{item.text}</div>}
              
              {/* Renders the WhatsApp screenshot if it exists */}
              {item.img && (
                <img 
                  src={item.img} 
                  alt="WhatsApp Evidence" 
                  style={{
                    width: '280px', // Adjust this to make your screenshots bigger or smaller
                    borderRadius: '12px',
                    border: '2px solid rgba(51, 255, 51, 0.4)',
                    boxShadow: '0 0 20px rgba(51, 255, 51, 0.2)',
                    // Optional: This filter turns the screenshots slightly green and creepy!
                    filter: 'grayscale(30%) sepia(80%) hue-rotate(70deg) brightness(0.8)'
                  }}
                />
              )}
            </motion.div>
          ))}

          {/* THE HIDDEN DEVIL (zIndex 20 - hidden in dark) */}
          <div 
            onMouseEnter={triggerDevil}
            style={{ position: 'absolute', left: devilPos.x, top: devilPos.y, width: '150px', height: '150px', zIndex: 20, borderRadius: '50%' }}
          >
            <img src={devilGif} alt="Trap" style={{ width: '100%', height: '100%', opacity: 0.8, filter: 'grayscale(50%)' }} />
          </div>

          {/* THE QUEEN (FIXED: zIndex changed from 60 to 40 so she hides in the dark!) */}
          <motion.img 
            src={princessSticker} 
            alt="Queen"
            onPointerDown={catchQueen}
            animate={{ x: queenPos.x, y: queenPos.y }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            style={{ position: 'absolute', width: '120px', borderRadius: '10px', zIndex: 40, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))', cursor: 'pointer' }}
            whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 20px rgba(255,255,255,1))' }}
          />
        </>
      )}

      {/* =========================================
            VICTORY SCREEN (THE QUEEN IS YOURS)
      ========================================== */}
      <AnimatePresence>
        {queenSaved && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.img 
              src={princessSticker} 
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1.2, y: 0, rotate: [0, -3, 3, 0] }}
              transition={{ 
                scale: { type: 'spring', bounce: 0.5 },
                rotate: { repeat: Infinity, duration: 3, ease: 'easeInOut' } 
              }}
              style={{ width: '300px', borderRadius: '20px', filter: 'drop-shadow(0 0 60px rgba(212, 175, 55, 1))', zIndex: 10 }}
            />

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ color: '#d4af37', fontFamily: "'Georgia', serif", fontSize: '4rem', letterSpacing: '5px', textShadow: '0 0 30px rgba(212, 175, 55, 0.8)', marginTop: '40px', textAlign: 'center', zIndex: 10 }}
            >
              The Queen is all yours
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              style={{ display: 'flex', gap: '30px', marginTop: '50px', zIndex: 10 }}
            >
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#f4f4f0', color: '#111' }}
                onClick={() => navigate('/museum')}
                style={{ padding: '15px 40px', backgroundColor: '#111', color: '#dcdcdc', border: '2px solid #555', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', borderRadius: '8px', transition: 'all 0.3s ease' }}
              >
                RETURN TO GALLERY
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212, 175, 55, 1)' }}
                onClick={() => navigate('/heaven')}
                style={{ padding: '15px 40px', backgroundColor: '#d4af37', color: '#000', border: 'none', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)', transition: 'all 0.3s ease' }}
              >
                GO TO HEAVEN
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
            JUMPSCARE / GAME OVER SCREEN
      ========================================== */}
      <AnimatePresence>
        {devilEncountered && !queenSaved && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#050000', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              animate={{ x: [-10, 10, -15, 15, -5, 5, 0], y: [-10, 10, -5, 5, -15, 15, 0] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.img 
                src={devilGif} 
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                style={{ position: 'absolute', width: '400px', filter: 'drop-shadow(0 0 50px red)', zIndex: 1 }}
              />

              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 200 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 1.5, type: 'spring' }} 
                style={{ position: 'relative', zIndex: 10, marginTop: '200px' }}
              >
                <img src={princessSticker} alt="Dead Queen" style={{ width: '200px', filter: 'grayscale(100%) brightness(50%)', borderRadius: '15px' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', color: 'red', fontFamily: 'sans-serif', fontWeight: 'bold', textShadow: '0 0 20px #000' }}>
                  X
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                style={{ color: '#ff0000', fontFamily: 'monospace', fontSize: '3rem', letterSpacing: '10px', textShadow: '0 0 20px red', marginTop: '30px', zIndex: 10 }}
              >
                THE QUEEN IS DEAD.
              </motion.h1>

              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                onClick={() => window.location.reload()} 
                style={{ marginTop: '40px', padding: '15px 40px', backgroundColor: 'transparent', color: '#ff0000', border: '2px solid #ff0000', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', zIndex: 10, transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#ff0000'; e.target.style.color = '#000'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ff0000'; }}
              >
                TRY AGAIN, FOOL.
              </motion.button>
              
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 0, 0, 0.1)', pointerEvents: 'none', zIndex: 100, mixBlendMode: 'overlay' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}