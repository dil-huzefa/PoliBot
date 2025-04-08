import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import botIcon from '../assets/botIcon2.png';


const TypingMessage = ({ text, speed = 35 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  const lines = displayedText.split('\n');

  return (
    <Typography sx={{ fontSize: 12, color: '#ffffff', whiteSpace: 'pre-line' }}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          width: '1ch',
          animation: 'blink 1s step-start infinite',
          ml: 0.5,
        }}
      >
        
      </Box>
    </Typography>
  );
};


const FuturisticGreetingBot = ({ onFabClick, chatOpen }) => {
  const [showGreeting, setShowGreeting] = useState(true);

  return (
    <AnimatePresence>
      {!chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1300,
            display: 'flex',
            alignItems: 'flex-end',
            cursor: 'pointer',
          }}
          onClick={onFabClick} 
        >
          {showGreeting && (
            <Box
              sx={{
                background: 'linear-gradient(145deg, #1e2a38, #2a3a4d)',
                color: '#fff',
                borderRadius: '16px 16px 0px 16px',
                px: 2,
                py: 1.5,
                mr: 2,
                maxWidth: 280,
                position: 'relative',
                border: '1px solid rgba(0, 183, 255, 0.4)',
                backdropFilter: 'blur(6px)',
                padding: 1,
                marginBottom: 3,
                transform: 'translateY(-20px)',
              }}
            >
              <Typography variant="body2">
                <TypingMessage text="Got questions about policy? Click here to chat with me!" speed={50} />
              </Typography>
            </Box>
          )}

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{
              padding: '10px',
              borderRadius: '50%',
              boxShadow: '0 0 25px rgba(0, 183, 255, 0.9)',
            }}
          >
            <img src={botIcon} alt="Policy Bot" style={{ width: 50, height: 50 }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};





export default FuturisticGreetingBot
