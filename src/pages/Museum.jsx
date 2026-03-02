import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

// --- YOUR ASSETS ---
import funnySong from '../assets/audio/funny_song.mp3';
import alarmSound from '../assets/audio/alarm.mp3'; 
import danceSong from '../assets/audio/song.mp3'; 
import aujlaSong from '../assets/audio/Aujla.mp3'; 
import Dance from '../assets/gifs/dance.gif';
import classroomDance from '../assets/gifs/classroom_dance.gif';
import classroomFight from '../assets/gifs/classroom_fight.gif'; 
import faceBall from '../assets/stickers/face_cursor.png'; 
import winnerSticker from '../assets/stickers/winner_sticker.png';
import princessSticker from '../assets/stickers/princess.png'; 
import gurraSticker from '../assets/stickers/gurra.png';
import bewdaSticker from '../assets/stickers/bewda.png';
import gurra1Sticker from '../assets/stickers/gurra1.png';
import butterflySticker from '../assets/stickers/butterfly.png';
import gurra3Sticker from '../assets/stickers/gurra3.png';
import gurra4Sticker from '../assets/stickers/gurra4.png';
import gurra5Sticker from '../assets/stickers/gurra5.png';
import gurra6Sticker from '../assets/stickers/gurra6.png';
import gurra7Sticker from '../assets/stickers/gurra7.png';
import gurra8Sticker from '../assets/stickers/gurra8.png';
import gurra9Sticker from '../assets/stickers/gurra9.png';
import gurra10Sticker from '../assets/stickers/gurra10.png';

export default function Museum() {
  const navigate = useNavigate();
  const galleryRef = useRef(null);
  
  const activeAudios = useRef([]); 
  const activeAlarm = useRef(null); 
  const danceAudioRef = useRef(null); 
  const aujlaAudioRef = useRef(null); 
  
  // States
  const [trapSprung, setTrapSprung] = useState(false);
  const [showRiddle, setShowRiddle] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleError, setRiddleError] = useState(false);
  const [punishmentCount, setPunishmentCount] = useState(1);
  const [bouncerActive, setBouncerActive] = useState(false); 
  const [isDancePlaying, setIsDancePlaying] = useState(false); 
  const [isAujlaPlaying, setIsAujlaPlaying] = useState(false); 
  const [butterflyFlown, setButterflyFlown] = useState(false);
  const [quitSprung, setQuitSprung] = useState(false);
  const [buntyAngry, setBuntyAngry] = useState(false);

  // --- GAME MODE STATES ---
  const [isGameMode, setIsGameMode] = useState(false);
  const [activeBricks, setActiveBricks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [saveTheQueenActive, setSaveTheQueenActive] = useState(false);

  // Physics Refs
  const ballRef = useRef(null);
  const paddleRef = useRef(null);
  const gameBoardRef = useRef(null); 
  const leftWallRef = useRef(null);  
  const rightWallRef = useRef(null); 

  const physics = useRef({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight - 300, 
    dx: 6, 
    dy: -6, 
    paddleX: window.innerWidth / 2,
    paddleY: window.innerHeight - 50, 
    paddleWidth: 150,
    paddleRotation: 0, 
    ballSize: 120,
    isDraggingPaddle: false, 
    godMode: false, 
    leftWallBroken: false,
    rightWallBroken: false
  });

  const allExhibits = [
    { id: 1, src: butterflySticker, title: 'Butterfly Nigga', desc: 'Not ur Nigga' },
    { id: 2, src: Dance, title: 'Vibing to Karan Aujla', desc: 'Pure focus. Do not disturb. (2026)', playsAujla: true },
    { id: 3, src: classroomDance, title: 'Naacho 🕺', desc: 'Punjabi Aagye Oye !', playsSong: true },
    { id: 4, src: gurra1Sticker, title: 'Famous Quote', desc: 'Stay Blessed' },
    { id: 5, src: bewdaSticker, title: 'CR hi Kehde', desc: 'Bewda hu bewkoof nhi' },
    { id: 6, src: gurraSticker, title: 'UGB Winner', desc: 'Dont Underestimate' },
    { id: 7, src: gurra3Sticker, title: 'Bunty', desc: 'Sabun Tez Hai' },
    { id: 8, src: gurra4Sticker, title: 'Never Quit', desc: 'Stay Positive' },
    { id: 9, src: gurra5Sticker, title: 'Hello Kitty Nigga', desc: 'Yumm !' },
    { id: 10, src: gurra6Sticker, title: 'Anda hi Kehde', desc: 'Another Nigga' },
    { id: 11, src: gurra7Sticker, title: 'SuperHero', desc: 'The Ultimate Nigga' },
    { id: 12, src: gurra8Sticker, title: '💔💔', desc: 'Humesha Mai hi KYU' },
    { id: 13, src: gurra9Sticker, title: 'ALways Smile ☺️', desc: 'Jolly by Nature' },
    { id: 14, src: gurra10Sticker, title: 'Pookie hi Kehde', desc: 'The Ultimate Nigga' },
    { id: 15, src: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDk4OGVob2tsbDF6ejNkeGFtaXY0YXBhaXh3Z2NycDl1Nm5sd3NlYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEhmM10mIi1dkMfmg/giphy.gif', title: 'Do Not Play', desc: 'Audio evidence. Highly classified.', isTrap: true },
    { id: 16, src: 'https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif', title: 'Load-Bearing Div', desc: 'DO NOT CLICK. Structural integrity compromised.', isGameTrigger: true },
  ];

  useEffect(() => {
    if (isGameMode && activeBricks.length === 0 && !gameOver) {
      if (physics.current.godMode) {
        setSaveTheQueenActive(true); 
      }
    }
  }, [activeBricks.length, isGameMode, gameOver]);

  useEffect(() => {
    const handleGlobalUp = () => {
      if (physics.current && !physics.current.godMode) {
        physics.current.isDraggingPaddle = false;
        if (paddleRef.current) {
          paddleRef.current.style.boxShadow = '0 0 20px #00ffcc';
          paddleRef.current.style.backgroundColor = '#00ffcc';
        }
      }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  const triggerScreenShake = () => {
    if (gameBoardRef.current) {
      gameBoardRef.current.style.backgroundColor = 'rgba(255, 0, 50, 0.4)'; 
      const shakeX = Math.random() * 40 - 20; 
      const shakeY = Math.random() * 40 - 20;
      gameBoardRef.current.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
      setTimeout(() => {
        if (gameBoardRef.current) {
          gameBoardRef.current.style.backgroundColor = 'transparent';
          gameBoardRef.current.style.transform = 'translate(0px, 0px)';
        }
      }, 60); 
    }
  };

  // --- THE CRASH-FREE PHYSICS LOOP ---
  useEffect(() => {
    if (!isGameMode || gameOver || activeBricks.length === 0) return;

    let animationId;
    const SPEED_MULTIPLIER = 1.08; 
    const MAX_SPEED = 22;          

    const updatePhysics = () => {
      const state = physics.current;
      
      if (state.ballSize > 40) {
        state.ballSize -= 0.15; 
        if (ballRef.current) {
          ballRef.current.style.width = `${state.ballSize}px`;
          ballRef.current.style.height = `${state.ballSize}px`;
        }
      }

      state.x += state.dx;
      state.y += state.dy;

      if (!state.godMode && !state.isDraggingPaddle) {
        state.paddleY += (window.innerHeight - 50 - state.paddleY) * 0.2; 
        state.paddleRotation += (0 - state.paddleRotation) * 0.2;
      } else if (state.godMode) {
        state.paddleRotation += (90 - state.paddleRotation) * 0.2;
      }

      if (state.x <= 20) {
        if (!state.leftWallBroken) state.dx = Math.abs(state.dx); 
        else if (state.x + state.ballSize < 0) state.x = window.innerWidth; 
      }
      if (state.x >= window.innerWidth - state.ballSize - 20) {
        if (!state.rightWallBroken) state.dx = -Math.abs(state.dx); 
        else if (state.x > window.innerWidth) state.x = -state.ballSize; 
      }
      if (state.y <= 0) state.dy = Math.abs(state.dy);

      if (state.y >= window.innerHeight - state.ballSize) {
        if (state.godMode) {
          state.dy = -Math.abs(state.dy); 
          state.y = window.innerHeight - state.ballSize - 5;
        } else {
          setGameOver(true); 
          return;
        }
      }

      let pWidth = state.godMode ? 20 : state.paddleWidth;
      let pHeight = state.godMode ? state.paddleWidth : 20;

      if (
        state.y + state.ballSize >= state.paddleY - (pHeight / 2) && 
        state.y <= state.paddleY + (pHeight / 2) &&
        state.x + state.ballSize >= state.paddleX - (pWidth / 2) && 
        state.x <= state.paddleX + (pWidth / 2)
      ) {
        if (state.isDraggingPaddle || state.godMode) {
          state.dy = -20; 
          state.dx += (state.x - state.paddleX) * 0.3; 
          triggerScreenShake();
        } else {
          state.dy = -Math.abs(state.dy); 
          state.dx += (state.x - state.paddleX) * 0.08; 
        }

        if (Math.abs(state.dy) < MAX_SPEED) {
          state.dx *= SPEED_MULTIPLIER;
          state.dy *= SPEED_MULTIPLIER;
        }

        if (!state.isDraggingPaddle && !state.godMode) {
          state.paddleWidth = Math.max(state.paddleWidth - 10, 50);
          if (paddleRef.current) paddleRef.current.style.width = `${state.paddleWidth}px`;
        }
      }

      if (state.isDraggingPaddle || state.godMode) {
        if (!state.leftWallBroken && state.paddleX - (pWidth / 2) <= 20) {
          state.leftWallBroken = true;
          if (leftWallRef.current) leftWallRef.current.style.transform = 'rotate(-45deg) translateY(100vh)';
          triggerScreenShake();
        }
        if (!state.rightWallBroken && state.paddleX + (pWidth / 2) >= window.innerWidth - 20) {
          state.rightWallBroken = true;
          if (rightWallRef.current) rightWallRef.current.style.transform = 'rotate(45deg) translateY(100vh)';
          triggerScreenShake();
        }
      }

      const brickElements = document.querySelectorAll('.brick-element');
      let hit = false;
      
      brickElements.forEach((brickEl) => {
        if (hit) return;
        const rect = brickEl.getBoundingClientRect();
        
        let ballHit = (state.x + state.ballSize > rect.left && state.x < rect.right && state.y + state.ballSize > rect.top && state.y < rect.bottom);
        let paddleHit = (state.isDraggingPaddle || state.godMode) && (
          state.paddleX + (pWidth / 2) > rect.left && 
          state.paddleX - (pWidth / 2) < rect.right && 
          state.paddleY + (pHeight / 2) > rect.top && 
          state.paddleY - (pHeight / 2) < rect.bottom
        );

        if (ballHit || paddleHit) {
          const id = parseInt(brickEl.dataset.id);
          if (ballHit) state.dy *= -1; 
          
          hit = true;
          setActiveBricks(prev => prev.filter(b => b.id !== id));
          triggerScreenShake();
        }
      });

      if (ballRef.current) ballRef.current.style.transform = `translate(${state.x}px, ${state.y}px)`;
      if (paddleRef.current) {
        paddleRef.current.style.transform = `translate(${state.paddleX - (state.paddleWidth / 2)}px, ${state.paddleY - 10}px) rotate(${state.paddleRotation}deg)`;
      }

      animationId = requestAnimationFrame(updatePhysics);
    };

    animationId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationId);
  }, [isGameMode, gameOver, activeBricks]);

  const handleMouseMove = (e) => {
    if (isGameMode) {
      physics.current.paddleX = e.clientX;
      if (physics.current.isDraggingPaddle || physics.current.godMode) {
        physics.current.paddleY = e.clientY;
      }
    }
  };

  const handlePaddleGrab = (e) => {
    e.stopPropagation();
    if (!physics.current.godMode) {
      physics.current.isDraggingPaddle = true;
      if (paddleRef.current) {
        paddleRef.current.style.boxShadow = '0 0 40px #ff00ff';
        paddleRef.current.style.backgroundColor = '#ff00ff'; 
      }
    }
  };

  const handleGodModeToggle = (e) => {
    e.stopPropagation();
    physics.current.godMode = !physics.current.godMode;
    physics.current.isDraggingPaddle = false; 
    
    if (paddleRef.current) {
      paddleRef.current.style.boxShadow = physics.current.godMode ? '0 0 50px #ff0000' : '0 0 20px #00ffcc';
      paddleRef.current.style.backgroundColor = physics.current.godMode ? '#ff0000' : '#00ffcc';
    }
  };

  const spawnAudio = () => { const a = new Audio(funnySong); a.loop=true; a.play(); activeAudios.current.push(a); };
  
  const stopAllAudio = () => {
    activeAudios.current.forEach(a => { a.pause(); a.currentTime = 0; });
    activeAudios.current = []; 
    if (activeAlarm.current) { activeAlarm.current.pause(); activeAlarm.current.currentTime = 0; }
    if (danceAudioRef.current) { danceAudioRef.current.pause(); setIsDancePlaying(false); }
    if (aujlaAudioRef.current) { aujlaAudioRef.current.pause(); setIsAujlaPlaying(false); } 
  };

  const startGame = () => {
    stopAllAudio();
    setActiveBricks(allExhibits);
    setIsGameMode(true);
    setGameOver(false);
    setSaveTheQueenActive(false); 
    
    physics.current = { 
      x: window.innerWidth / 2, y: window.innerHeight - 300, 
      dx: 6, dy: -6, 
      paddleX: window.innerWidth / 2, paddleY: window.innerHeight - 50, 
      paddleWidth: 150, paddleRotation: 0, ballSize: 120,
      isDraggingPaddle: false, godMode: false, leftWallBroken: false, rightWallBroken: false
    };

    if (paddleRef.current) {
      paddleRef.current.style.width = '150px';
      paddleRef.current.style.backgroundColor = '#00ffcc';
      paddleRef.current.style.boxShadow = '0 0 20px #00ffcc';
      paddleRef.current.style.transform = `translate(${window.innerWidth / 2 - 75}px, ${window.innerHeight - 60}px) rotate(0deg)`;
    }
    if (ballRef.current) { ballRef.current.style.width = '120px'; ballRef.current.style.height = '120px'; }
    if (leftWallRef.current) { leftWallRef.current.style.transform = 'translateY(0)'; leftWallRef.current.style.height = '100vh'; }
    if (rightWallRef.current) { rightWallRef.current.style.transform = 'translateY(0)'; rightWallRef.current.style.height = '100vh'; }
  };

  const handleExhibitInteraction = (exhibit) => {
    if (exhibit.isGameTrigger) {
      startGame();
      return;
    }
    
    if (exhibit.id === 1) {
      setButterflyFlown(true);
      return; 
    }

    if (exhibit.id === 8) {
      setQuitSprung(true);
      return;
    }

    // --- NEW: Trigger Angry Bunty ---
    if (exhibit.id === 7) {
      setBuntyAngry(prev => !prev);
      return;
    }

    if (exhibit.isTrap) {
      if (!trapSprung) { spawnAudio(); setTrapSprung(true); } 
      else { setShowRiddle(true); }
    } else if (exhibit.playsSong) {
      if (!danceAudioRef.current) { danceAudioRef.current = new Audio(danceSong); danceAudioRef.current.loop = true; danceAudioRef.current.volume = 0.8; }
      if (danceAudioRef.current.paused) { danceAudioRef.current.play(); setIsDancePlaying(true); } 
      else { danceAudioRef.current.pause(); setIsDancePlaying(false); }
    } else if (exhibit.playsAujla) {
      if (!aujlaAudioRef.current) { aujlaAudioRef.current = new Audio(aujlaSong); aujlaAudioRef.current.loop = true; aujlaAudioRef.current.volume = 0.8; }
      if (aujlaAudioRef.current.paused) { aujlaAudioRef.current.play(); setIsAujlaPlaying(true); } 
      else { aujlaAudioRef.current.pause(); setIsAujlaPlaying(false); }
    }
  };

  const submitRiddle = () => {
    if (riddleAnswer.toLowerCase().trim() === 'keyboard') {
      stopAllAudio(); setTrapSprung(false); setShowRiddle(false); setRiddleAnswer(''); setRiddleError(false); setPunishmentCount(1); setBouncerActive(false);
    } else {
      spawnAudio(); setPunishmentCount(prev => prev + 1); setRiddleError(true); setRiddleAnswer('');
      if (activeAlarm.current) { activeAlarm.current.pause(); activeAlarm.current.currentTime = 0; }
      activeAlarm.current = new Audio(alarmSound); activeAlarm.current.volume = 0.8; activeAlarm.current.play();
      setBouncerActive(true);
      setTimeout(() => { setBouncerActive(false); if(activeAlarm.current) activeAlarm.current.pause(); }, 4500); 
    }
  };

  return (
    <div 
      ref={galleryRef} 
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh', backgroundColor: '#1c1c1e', backgroundImage: 'radial-gradient(circle at 50% 10%, #303036 0%, #111112 80%)',
        padding: isGameMode ? '0' : '5rem 2rem', color: '#eaeaea', fontFamily: "'Georgia', serif", overflow: 'hidden', position: 'relative',
        cursor: isGameMode && !physics.current.isDraggingPaddle && !physics.current.godMode ? 'none' : 'default' 
      }}
    >
      {/* =========================================
                 THE BREAKOUT GAME UI 
      ========================================== */}
      {isGameMode && (
        <div ref={gameBoardRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, transition: 'background-color 0.05s ease, transform 0.05s ease' }}>
          
          {!gameOver && activeBricks.length > 0 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (physics.current) physics.current.ballSize += 60; 
              }}
              style={{
                position: 'absolute', top: '20px', right: '30px', color: '#ffffff', opacity: 0.05, 
                fontFamily: 'monospace', fontSize: '0.9rem', cursor: 'pointer', zIndex: 100, transition: 'opacity 0.2s ease', userSelect: 'none'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '0.05'}
            >
              [+] inflate_head
            </div>
          )}

          <div ref={leftWallRef} style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '100vh', backgroundColor: '#444', borderRight: '2px solid #ff0055', willChange: 'transform, height' }} />
          <div ref={rightWallRef} style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '100vh', backgroundColor: '#444', borderLeft: '2px solid #ff0055', willChange: 'transform, height' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', padding: '50px 40px' }}>
            <AnimatePresence>
              {activeBricks.map((brick) => (
                <motion.div key={brick.id} data-id={brick.id} className="brick-element" layout initial={{ scale: 1 }} exit={{ scale: 0, opacity: 0, rotate: 45 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} style={{ width: '120px', height: '60px', border: '4px solid #d4af37', borderRadius: '4px', backgroundImage: `url(${brick.src})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }} />
              ))}
            </AnimatePresence>
          </div>

          <div 
            ref={paddleRef}
            onPointerDown={handlePaddleGrab}
            onDoubleClick={handleGodModeToggle} 
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '150px', height: '20px', 
              backgroundColor: '#00ffcc', borderRadius: '10px', boxShadow: '0 0 20px #00ffcc', 
              cursor: 'grab', willChange: 'transform, width', 
              transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
              transformOrigin: 'center center' 
            }}
          />

          <div ref={ballRef} style={{ position: 'absolute', top: 0, left: 0, backgroundImage: `url(${faceBall})`, backgroundSize: 'cover', borderRadius: '50%', boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)', willChange: 'transform, width, height' }} />

          {gameOver && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '20px' }}>
                <motion.img src={Dance} alt="Jivjot" initial={{ scale: 0, x: -50 }} animate={{ scale: 1, x: 0 }} transition={{ type: 'spring' }} style={{ width: '250px', borderRadius: '15px', filter: 'drop-shadow(0 0 30px rgba(0, 255, 0, 0.8))' }} />
                <motion.img src={princessSticker} alt="Trapped Queen" initial={{ scale: 0, x: 50 }} animate={{ scale: 1, x: 0 }} transition={{ type: 'spring', delay: 0.2 }} style={{ width: '250px', filter: 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))', borderRadius: '15px' }} />
              </div>
              <h1 style={{ fontSize: '3.5rem', color: '#ff0000', textShadow: '0 0 20px red', fontFamily: 'monospace', margin: '20px 0' }}>Jivjot ate the Queen !</h1>
              <motion.button whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255,0,0,1)' }} onClick={startGame} style={{ padding: '15px 40px', backgroundColor: '#fff', color: '#000', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>
                REBUILD GALLERY
              </motion.button>
            </div>
          )}
          
          {activeBricks.length === 0 && !gameOver && (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div style={{ textAlign: 'center', width: '100%' }}>
                  
                  <AnimatePresence mode="wait">
                    {saveTheQueenActive ? (
                      <motion.div key="princess" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                        <motion.img 
                          src={princessSticker} 
                          alt="Trapped Queen" 
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ rotate: { repeat: Infinity, duration: 1.5, type: 'spring' } }}
                          style={{ width: '300px', filter: 'drop-shadow(0 0 30px rgba(255, 0, 0, 0.8))', borderRadius: '15px', margin: '0 auto', display: 'block' }} 
                        />
                        <h1 style={{ fontSize: '2.5rem', color: '#ff0000', textShadow: '0 0 20px red', fontFamily: 'monospace', margin: '20px 0' }}>
                          QUEEN TRAPPED IN THE VOID
                        </h1>
                        <motion.button whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255,0,0,1)' }} onClick={() => navigate('/void')} style={{ padding: '15px 40px', backgroundColor: '#ff0000', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>
                          GO THERE TO SAVE HER
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div key="lassi" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                        <motion.img src={winnerSticker} alt="Normal Win" style={{ width: '280px', filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.8))', margin: '0 auto', display: 'block' }} />
                        <h1 style={{ fontSize: '2.2rem', color: '#00ffcc', textShadow: '0 0 20px #00ffcc', fontFamily: 'monospace', margin: '15px auto', maxWidth: '800px', lineHeight: '1.4' }}>
                          Win but at wht cost Queen Rejected you 😂🫵🏻
                          (Can't Enter Void without her, dummy)
                        </h1>
                        
                        <p style={{ color: '#ff0055', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 0 10px #ff0055', margin: '0 0 25px 0', fontFamily: 'monospace' }}>
                          HINT: Show some god powers, fool. Try *double-tapping* that paddle...
                        </p>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px #fff' }} onClick={startGame} style={{ padding: '15px 30px', backgroundColor: '#fff', color: '#000', fontSize: '1.1rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>
                            PLAY AGAIN
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px #ff0055' }} onClick={() => setIsGameMode(false)} style={{ padding: '15px 30px', backgroundColor: '#ff0055', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>
                            RETURN TO GALLERY
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* =========================================
             ORIGINAL GALLERY (Hidden when playing)
      ========================================== */}
      <div style={{ display: isGameMode ? 'none' : 'block' }}>
        
        <AnimatePresence>
          {bouncerActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(50, 0, 0, 0.85)', backdropFilter: 'blur(10px)', zIndex: 999999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div initial={{ scale: 0.2, rotate: -20, y: 100 }} animate={{ scale: 1.2, rotate: [0, -3, 3, -3, 0], y: 0 }} transition={{ scale: { type: "spring", stiffness: 300, damping: 15 }, rotate: { repeat: Infinity, duration: 0.2 } }} style={{ width: '90%', maxWidth: '650px', border: '10px solid #ff0000', borderRadius: '15px', boxShadow: '0 0 100px rgba(255,0,0,1)', backgroundColor: '#000', overflow: 'hidden' }}>
                <img src={classroomFight} alt="Security Bouncer" style={{ width: '100%', display: 'block' }} />
                <div style={{ backgroundColor: '#ff0000', color: '#fff', padding: '15px', fontSize: '2rem', fontWeight: '900', textAlign: 'center', fontFamily: 'monospace', letterSpacing: '2px' }}>PHYSICAL REMOVAL IN PROGRESS</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRiddle && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8 }} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 10, 0, 0.95)', border: '2px solid #00ff00', boxShadow: '0 0 30px rgba(0, 255, 0, 0.5)', padding: '40px', borderRadius: '8px', zIndex: 9999, fontFamily: 'monospace', color: '#00ff00', width: '90%', maxWidth: '500px', textAlign: 'center' }}>
              <h2 style={{ color: '#00ff00', marginTop: 0, fontSize: '1.5rem' }}>SECURITY OVERRIDE REQUIRED</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '30px', lineHeight: '1.5' }}>"I have keys but no locks. <br/>I have space but no room. <br/>You can enter, but not go outside." <br/><br/><strong>What am I?</strong></p>
              <input type="text" value={riddleAnswer} onChange={(e) => setRiddleAnswer(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitRiddle()} autoFocus placeholder="Type your answer..." disabled={bouncerActive} style={{ width: '80%', padding: '10px', backgroundColor: '#000', color: '#00ff00', border: '1px solid #00ff00', outline: 'none', fontSize: '1.2rem', textAlign: 'center', marginBottom: '15px' }} />
              {riddleError && <div style={{ color: '#ff0000', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>ACCESS DENIED. AUDIO MULTIPLIED (x{punishmentCount}).</div>}
              <button onClick={submitRiddle} disabled={bouncerActive} style={{ display: 'block', margin: '0 auto', padding: '10px 20px', backgroundColor: '#00ff00', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>SUBMIT</button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ textAlign: 'center', marginBottom: '8rem', position: 'relative' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 'normal', letterSpacing: '12px', margin: '0 0 10px 0', textTransform: 'uppercase', color: trapSprung ? '#ff3333' : '#dcdcdc', textShadow: '0px 4px 10px rgba(0,0,0,0.8)', transition: 'color 0.5s ease' }}>Hall of Shame</h1>
          <div style={{ width: '150px', height: '3px', background: 'linear-gradient(90deg, transparent, #8b6b22, transparent)', margin: '0 auto 20px auto' }}></div>
        </motion.div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
          {allExhibits.map((exhibit, index) => {
            const isTrapActive = trapSprung && exhibit.isTrap;
            const isThisPartyActive = (exhibit.playsSong && isDancePlaying) || (exhibit.playsAujla && isAujlaPlaying);
            const isTriggerActive = exhibit.isGameTrigger;
            const currentAnimation = isTrapActive ? 'pulse 2s infinite' : (isThisPartyActive ? 'partyPulse 1s infinite' : (isTriggerActive ? 'glitchPulse 0.5s infinite' : 'none'));

            const isEscapingButterfly = exhibit.id === 1 && butterflyFlown;
            const isAngryBunty = exhibit.id === 7 && buntyAngry;

            return (
              <motion.div
                key={exhibit.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                drag dragConstraints={galleryRef} dragElastic={0.2} whileHover={{ scale: 1.02 }} whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 50 }}
                onPointerDown={() => handleExhibitInteraction(exhibit)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '340px', position: 'relative', animation: currentAnimation }}
              >
                <style>
                  {`
                    @keyframes pulse { 0% { filter: drop-shadow(0 0 20px rgba(255,0,0,0.4)); } 50% { filter: drop-shadow(0 0 50px rgba(255,0,0,1)); } 100% { filter: drop-shadow(0 0 20px rgba(255,0,0,0.4)); } }
                    @keyframes partyPulse { 0% { filter: drop-shadow(0 0 20px rgba(0,255,200,0.4)); } 50% { filter: drop-shadow(0 0 50px rgba(0,255,200,1)); } 100% { filter: drop-shadow(0 0 20px rgba(0,255,200,0.4)); } }
                    @keyframes glitchPulse { 0% { filter: drop-shadow(0 0 20px rgba(255,0,255,0.8)); transform: skewX(2deg); } 50% { filter: drop-shadow(0 0 50px rgba(0,255,255,1)); transform: skewX(-2deg); } 100% { filter: drop-shadow(0 0 20px rgba(255,0,255,0.8)); transform: skewX(2deg); } }
                  `}
                </style>
                <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '250px', background: 'radial-gradient(ellipse at top, rgba(255, 250, 220, 0.25) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                
                <div style={{ padding: '35px', backgroundColor: '#f4f4f0', border: '18px solid #141414', boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 8px 15px rgba(0,0,0,0.4)', borderRadius: '2px', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1, borderTopColor: '#2a2a2a', borderLeftColor: '#2a2a2a' }}>
                  
                  <div style={{ boxShadow: 'inset 0px 4px 10px rgba(0,0,0,0.5)', overflow: isEscapingButterfly ? 'visible' : 'hidden', position: 'relative', width: '100%', height: '220px' }}>
                    
                    <motion.img 
                      src={exhibit.src} 
                      alt={exhibit.title} 
                      animate={
                        isEscapingButterfly ? {
                          x: [0, 150, -50, 300, 100, window.innerWidth], 
                          y: [0, -150, -100, -400, -300, -window.innerHeight], 
                          rotate: [0, 15, -15, 25, -25, 45], 
                          scale: [1, 1.2, 0.8, 1.3, 0.9, 0] 
                        } : isAngryBunty ? {
                          x: [-3, 3, -3, 3, 0] // Angry shake
                        } : {}
                      }
                      transition={
                        isEscapingButterfly ? { duration: 5, ease: "easeInOut" } : 
                        isAngryBunty ? { repeat: Infinity, duration: 0.1 } : {}
                      }
                      style={{ 
                        width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', display: 'block',
                        position: isEscapingButterfly ? 'absolute' : 'static', 
                        zIndex: isEscapingButterfly ? 99999 : 1 
                      }} 
                    />

                    {/* --- ANGRY BUNTY OVERLAYS --- */}
                    {isAngryBunty && (
                      <>
                        {/* Red pulsating vignette on the photo */}
                        <motion.div
                          animate={{ opacity: [0.1, 0.6, 0.1] }}
                          transition={{ repeat: Infinity, duration: 0.3 }}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', boxShadow: 'inset 0 0 50px red', pointerEvents: 'none', zIndex: 5 }}
                        />
                        {/* Left Ear Steam */}
                        <motion.div
                          animate={{ y: [0, -40], opacity: [0.8, 0], scale: [1, 2] }}
                          transition={{ repeat: Infinity, duration: 0.5, ease: "easeOut" }}
                          style={{ position: 'absolute', top: '30%', left: '15%', width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', filter: 'blur(5px)', pointerEvents: 'none', zIndex: 10 }}
                        />
                        {/* Right Ear Steam */}
                        <motion.div
                          animate={{ y: [0, -40], opacity: [0.8, 0], scale: [1, 2] }}
                          transition={{ repeat: Infinity, duration: 0.5, ease: "easeOut", delay: 0.2 }}
                          style={{ position: 'absolute', top: '30%', right: '15%', width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', filter: 'blur(5px)', pointerEvents: 'none', zIndex: 10 }}
                        />
                        {/* Anime Vein */}
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 0.4 }}
                          style={{ position: 'absolute', top: '10%', right: '25%', fontSize: '3.5rem', textShadow: '0 0 10px red', pointerEvents: 'none', zIndex: 10 }}
                        >
                          💢
                        </motion.div>
                      </>
                    )}

                    {exhibit.id === 8 && quitSprung && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: 'spring', bounce: 0.6 }}
                        style={{
                          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.7)', 
                          color: '#ff0000', fontSize: '3rem', fontFamily: 'monospace',
                          fontWeight: '900', textShadow: '0 0 20px red', pointerEvents: 'none', zIndex: 10
                        }}
                      >
                        I QUIT
                      </motion.div>
                    )}

                  </div>
                </div>

                <div style={{ marginTop: '2.5rem', padding: '15px 20px', position: 'relative', background: 'linear-gradient(135deg, #d4af37 0%, #aa7700 40%, #f3e5ab 50%, #aa7700 60%, #8b6b22 100%)', color: '#222', borderRadius: '4px', border: '1px solid #5a4200', boxShadow: '0 10px 20px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.4)', textAlign: 'center', width: '85%', zIndex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontFamily: "'Trebuchet MS', sans-serif", textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px', color: '#111', textShadow: '0px 1px 1px rgba(255,255,255,0.4)' }}>{exhibit.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontFamily: "'Georgia', serif", fontStyle: 'italic', color: '#2a2a2a', fontWeight: 'bold', textShadow: '0px 1px 1px rgba(255,255,255,0.3)' }}>
                    {isTriggerActive ? "⚠️ SYSTEM UNSTABLE" : (isThisPartyActive ? "🔊 PARTY MODE ACTIVATED" : (trapSprung && exhibit.isTrap ? `AUDIO THREADS ACTIVE: ${punishmentCount}` : exhibit.desc))}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}