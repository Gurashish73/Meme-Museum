import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- ADD THIS IMPORT ---
// This tells Vite to load your image as a bundled asset
import faceCursorImage from '../assets/stickers/face_cursor.png';

export default function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '80px',   // Size of the custom cursor (can be adjusted)
        height: '80px',
        borderRadius: '50%',
        pointerEvents: 'none', 
        zIndex: 9999, 
        
        // --- UPDATE THIS PROPERTY ---
        // Instead of a URL string, we are using the imported asset variable.
        backgroundImage: `url(${faceCursorImage})`, 
        
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Optional glow effect:
        boxShadow: '0 0 10px rgba(120, 0, 255, 0.4)'
      }}
      animate={{
        // Adjust the offset (20px) based on half the width/height (40px)
        x: mousePosition.x - 40, 
        y: mousePosition.y - 40,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
}