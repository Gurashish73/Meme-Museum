import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import your assets
import missSound from '../assets/audio/miss.mp3';
import loginReaction from '../assets/gifs/login_reaction.gif'; 
import classroomDance from '../assets/gifs/classroom_dance.gif'; 

export default function Login() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // The Chaos Trackers
  const [missCount, setMissCount] = useState(0);
  const [popups, setPopups] = useState([]);
  const [isInfected, setIsInfected] = useState(false);
  
  const navigate = useNavigate();
  const boink = new Audio(missSound);

  const triggerVirus = () => {
    setIsInfected(true);
    // Generate 35 random popup coordinates 
    const newPopups = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.floor(Math.random() * (window.innerWidth - 300)),
      y: Math.floor(Math.random() * (window.innerHeight - 250)),
      delay: i * 0.1 
    }));
    setPopups(newPopups);
  };

  const runAway = () => {
    if (isInfected) return; 

    boink.currentTime = 0; 
    boink.play();
    let newX = Math.floor(Math.random() * 700) - 350; 
    let newY = Math.floor(Math.random() * 400) - 200;
    if (Math.abs(newX - position.x) < 150) {
      newX = position.x > 0 ? newX - 200 : newX + 200;
    }
    if (Math.abs(newY - position.y) < 100) {
      newY = position.y > 0 ? newY - 150 : newY + 150;
    }

    setPosition({ x: newX, y: newY });
    setMissCount(prev => {
      const newCount = prev + 1;
      if (newCount === 8) {
        triggerVirus();
      }
      return newCount;
    });
  };

  const handleSuccessClick = () => {
    navigate('/museum');
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ff00cc 0%, #3333ff 50%, #00ffcc 100%)',
      backgroundSize: '300% 300%',
      animation: 'gradientShift 10s ease infinite',
      position: 'relative' 
    }}>
      
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* Main UI fades out slightly when infected to emphasize the popups */}
      <motion.div 
        animate={{ opacity: isInfected ? 0.3 : 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.6 }}
          style={{ 
            color: '#fff', 
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            fontSize: '3.5rem',
            marginBottom: '2rem', 
            textShadow: '4px 4px 0px #000, 8px 8px 0px #ff0055',
            textAlign: 'center',
            textTransform: 'uppercase',
            zIndex: 2,
            margin: '0 20px 30px 20px'
          }}
        >
          {isInfected ? "SKILL ISSUE DETECTED" : "Vibe Check Required"}
        </motion.h1>

        <motion.div
          initial={{ y: -100, rotate: -15 }}
          animate={{ y: 0, rotate: -2 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          style={{
            backgroundColor: '#fff',
            padding: '15px 15px 45px 15px',
            borderRadius: '10px',
            boxShadow: '15px 15px 0px rgba(0,0,0,0.4)',
            marginBottom: '3rem',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img 
            src={loginReaction} 
            alt="Reaction" 
            style={{ width: '450px', height: 'auto', maxHeight: '450px', objectFit: 'cover', borderRadius: '5px', pointerEvents: 'none', border: '2px solid #000' }}
          />
          <span style={{ color: '#000', fontFamily: 'monospace', fontSize: '1.4rem', marginTop: '15px', fontWeight: 'bold' }}>
            POV: Trying to enter the site
          </span>
        </motion.div>

        <motion.button
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onPointerEnter={runAway}
          onClick={handleSuccessClick}
          style={{
            padding: '20px 40px',
            fontSize: '1.5rem',
            fontWeight: '900',
            fontFamily: 'monospace',
            cursor: isInfected ? 'not-allowed' : 'pointer',
            backgroundColor: isInfected ? '#555' : '#ccff00',
            color: '#000',
            border: '4px solid #000',
            borderRadius: '50px',
            boxShadow: '8px 8px 0px #000',
            textTransform: 'uppercase',
            zIndex: 10
          }}
        >
          {isInfected ? "TOO SLOW" : "Click Me If You Can"}
        </motion.button>
      </motion.div>

      {/* --- THE VIRUS PAYLOAD --- */}
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: popup.delay }} 
            style={{
              position: 'absolute',
              top: popup.y,
              left: popup.x,
              width: '280px',
              backgroundColor: '#ece9d8', 
              border: '2px solid #0055ea', 
              borderRadius: '8px 8px 0 0',
              boxShadow: '5px 5px 15px rgba(0,0,0,0.5)',
              zIndex: 50 + popup.id, 
              overflow: 'hidden',
              pointerEvents: 'none' 
            }}
          >
            <div style={{
              backgroundColor: '#0055ea',
              background: 'linear-gradient(90deg, #0055ea 0%, #3a93ff 100%)',
              color: '#fff',
              padding: '4px 8px',
              fontFamily: '"Trebuchet MS", sans-serif',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>SUCCESS.exe</span>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#e81123', borderRadius: '3px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>X</div>
            </div>
            
            <div style={{ padding: '10px', backgroundColor: '#fff' }}>
              <img src={classroomDance} alt="Virus" style={{ width: '100%', height: 'auto', border: '1px solid #ccc' }} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* THE FUNNY ESCAPE BUTTON */}
      <AnimatePresence>
        {isInfected && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              // Creates a continuous red glowing pulse
              boxShadow: ['0px 0px 0px rgba(255,0,0,0)', '0px 0px 40px rgba(255,0,0,0.8)', '0px 0px 0px rgba(255,0,0,0)']
            }}
            transition={{ 
              delay: 4, 
              type: 'spring',
              boxShadow: { duration: 1.5, repeat: Infinity } // Loops the glow
            }} 
            onClick={handleSuccessClick}
            whileHover={{ scale: 1.1, backgroundColor: '#fff', color: '#ff0000', border: '4px dashed #ff0000' }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '10%',
              padding: '15px 30px',
              fontSize: '1.6rem',
              fontWeight: '900',
              fontFamily: '"Comic Sans MS", cursive, sans-serif',
              backgroundColor: '#ff0000',
              color: '#fff',
              border: '4px dashed #fff',
              borderRadius: '15px',
              cursor: 'pointer',
              zIndex: 9999,
              textTransform: 'uppercase'
            }}
          >
            My Aim Is Trash 😭 (Let Me In)
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}