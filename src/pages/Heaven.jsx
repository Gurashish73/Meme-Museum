import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ASSETS ---
import haklaSticker from '../assets/stickers/hakla.png';
import hahaAudio from '../assets/audio/haha.mp3';

export default function Heaven() {
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [jumpCount, setJumpCount] = useState(0);
  const [btnPos, setBtnPos] = useState({ top: '80%', left: '50%' });

  const taunts = [
    "TAKE ME BACK TO REALITY",
    "TOO SLOW!",
    "NICE TRY 😂",
    "MISSED ME!",
    "YOU'RE TRAPPED HERE",
    "CATCH ME IF YOU CAN 🫵",
    "GETTING TIRED?",
    "FINE. YOU CAN LEAVE."
  ];

  useEffect(() => {
    audioRef.current = new Audio(hahaAudio);
    audioRef.current.loop = true;
    audioRef.current.volume = 1.0;
    audioRef.current.play().catch(e => console.log("Audio autoplay blocked by browser:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // --- THE TROLL MECHANIC ---
  const handleButtonHover = () => {
    if (jumpCount < 7) {
      const newTop = Math.floor(Math.random() * 70) + 10;
      const newLeft = Math.floor(Math.random() * 70) + 10;
      
      setBtnPos({ top: `${newTop}%`, left: `${newLeft}%` });
      setJumpCount(prev => prev + 1);
    }
  };

  const escapeHeaven = () => {
    if (audioRef.current) audioRef.current.pause();
    navigate('/museum');
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Fake angelic text */}
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          position: 'absolute', top: '15%', 
          color: '#e0e0e0', fontFamily: "'Georgia', serif", 
          fontSize: '3rem', letterSpacing: '10px',
          textShadow: '0 0 20px rgba(255,255,255,1)',
          zIndex: 1
        }}
      >
        Welcome to Salvation...
      </motion.h1>

      {/* THE RICKROLL: Massive, vibrating Hakla sticker */}
      <motion.img
        src={haklaSticker}
        alt="GET RICKROLLED"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 4.5],
          opacity: 1,
          x: [-25, 25, -30, 30, -20, 20],
          y: [-25, 25, 30, -30, 20, -20],
          rotate: [-2, 2, -3, 3, -1, 1] 
        }}
        transition={{
          scale: { duration: 0.4, ease: "easeOut" },
          x: { repeat: Infinity, duration: 0.08 },
          y: { repeat: Infinity, duration: 0.08 },
          rotate: { repeat: Infinity, duration: 0.1 }
        }}
        style={{
          position: 'relative',
          zIndex: 50,
          width: '350px', 
          filter: 'drop-shadow(0 40px 50px rgba(0,0,0,0.6))',
          pointerEvents: 'none'
        }}
      />

      {/* Flashing strobe background effect */}
      <motion.div
        animate={{ backgroundColor: ['rgba(255,0,0,0)', 'rgba(255,0,0,0.3)', 'rgba(255,0,0,0)'] }}
        transition={{ repeat: Infinity, duration: 0.2 }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none'
        }}
      />

      {/* THE TRICKY ESCAPE BUTTON */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          top: btnPos.top,
          left: btnPos.left,
        }}
        transition={{ 
          opacity: { delay: 2.5 }, 
          scale: { delay: 2.5, type: 'spring' },
          top: { type: 'spring', stiffness: 300, damping: 20 },
          left: { type: 'spring', stiffness: 300, damping: 20 }
        }} 
        style={{ 
          position: 'absolute', 
          zIndex: 100,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <button
          onMouseEnter={handleButtonHover}
          onClick={escapeHeaven}
          style={{
            padding: '20px 40px',
            fontSize: '1.5rem',
            fontWeight: '900',
            fontFamily: 'monospace',
            backgroundColor: jumpCount >= 7 ? '#33ff33' : '#000',
            color: jumpCount >= 7 ? '#000' : '#fff',
            border: `4px solid ${jumpCount >= 7 ? '#000' : '#ff0000'}`,
            borderRadius: '10px',
            cursor: jumpCount >= 7 ? 'pointer' : 'default',
            boxShadow: `0 0 30px ${jumpCount >= 7 ? '#33ff33' : '#ff0000'}`,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}
        >
          {taunts[Math.min(jumpCount, taunts.length - 1)]}
        </button>
      </motion.div>

    </div>
  );
}