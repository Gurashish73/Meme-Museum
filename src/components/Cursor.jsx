import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        pointerEvents: 'none', 
        zIndex: 9999, 
        backgroundImage: `url(${faceCursorImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 0 10px rgba(120, 0, 255, 0.4)'
      }}
      animate={{
        x: mousePosition.x - 40, 
        y: mousePosition.y - 40,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
}
