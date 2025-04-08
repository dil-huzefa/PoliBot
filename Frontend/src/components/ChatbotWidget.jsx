import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Fab,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CommunityIcon from '../assets/icon.png';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FuturisticGreetingBot from './FuturisticGreetingBot';

const ChatBot = () => {

    // const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false); // new state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: `Hii, I can help you find answers in your school board's policy documents.

Ask me anything — like attendance rules, grading policies, or student rights!`,
    },
  ]);
  const [input, setInput] = useState('');

  const [dimensions, setDimensions] = useState({
    width: 360,
    height: 500,
  });

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      setDimensions({
        width: Math.min(500, Math.max(300, vw * 0.35)),
        height: Math.min(650, Math.max(400, vh * 0.7)),
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const question = input;
    setInput('');
  
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
  
      const data = await response.json();
      const botMessage = { from: 'bot', text: data.answer || "Sorry, couldn't fetch a response." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = { from: 'bot', text: 'There was an error connecting to the server.' };
      setMessages((prev) => [...prev, errorMsg]);
      console.error('Chatbot fetch error:', error);
    }
  };

  const scrollBoxRef = useRef(null); 
  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTo({
        top: scrollBoxRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);
  

  return (
    <div>
     {(!isOpen || isMinimized) && (
  <FuturisticGreetingBot
  onFabClick={() => {
    setIsOpen(true);
    setIsMinimized(false); 
  }}
  chatOpen={isOpen && !isMinimized}
  
   
  >
    {/* <ChatIcon /> */}
  </FuturisticGreetingBot>
)}

      <AnimatePresence>
        {isOpen && (
         <motion.div
         initial={{ opacity: 0, y: 100 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: 100 }}
         transition={{ duration: 0.3 }}
         style={{
           position: 'fixed',
           bottom: !isOpen && isMinimized ? 100 : 24, 
           right: 24,
           zIndex: 1200,
           width: dimensions.width,
           height: dimensions.height,
         }}
       >
            <Paper
              elevation={8}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#2f3b4d',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12, 
                }}
              >
                <Typography fontWeight="bold">Policy Assistant Chatbot</Typography>
                <Box>
                  <IconButton onClick={() => { setIsOpen(false); setIsMinimized(true); }} size="small">
                    <MinimizeIcon sx={{ color: 'white', fontSize: 18 }} />
                  </IconButton>
                  <IconButton onClick={() => { setIsOpen(false);
    setIsMinimized(false);
    setMessages([
      {
        from: 'bot',
        text: `Hii, I can help you find answers in your school board's policy documents.

Ask me anything — like attendance rules, grading policies, or student rights!`,
      },
    ]); }} size="small">
                    <CloseIcon sx={{ color: 'white', fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>

              <Box
                id="scroll-box"
                ref={scrollBoxRef}
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  px: 2,
                  py: 1,
                  scrollBehavior: 'smooth',
                }}
              >
                {messages.map((msg, i) => {
                  const isBot = msg.from === 'bot';
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        justifyContent: isBot ? 'flex-start' : 'flex-end',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      {isBot && (
                        <Box
                          sx={{
                            backgroundColor: '#2f3b4d',
                            padding: '6px',
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                          }}
                        >
                          <Avatar
                            src={CommunityIcon}
                            sx={{ width: 25, height: 25, bgcolor: '#2f3b4d' }}
                          />
                        </Box>
                      )}

                      <Box
                        sx={{
                          position: 'relative',
                          bgcolor: isBot ? '#eeeeee' : '#2f3b4d',
                          color: isBot ? 'black' : 'white',
                          textAlign: 'left',
                          px: 2,
                          py: 1.5,
                          borderRadius: 2,
                          maxWidth: '75%',
                          whiteSpace: 'pre-line',
                          borderTopLeftRadius: isBot ? 0 : 16,
                          borderTopRightRadius: isBot ? 16 : 0,
                          borderBottomLeftRadius: 16,
                          borderBottomRightRadius: 16,
                        }}
                      >
                        {isBot && i === messages.length - 1 ? (
  <TypingMessage text={msg.text} onScroll={() => { // Add scroll callback
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = 
        scrollBoxRef.current.scrollHeight;
    }
  }}/>
) : (
  msg.text
)}

                      </Box>
                      
                    </Box>
                  );
                })}
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', p: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Need help with a policy? Ask now..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: '#2f3b4d',
                      },
                  }}
                />
                <IconButton onClick={handleSend} color="primary">
                  <SendIcon style={{ color: '#2f3b4d' }} />
                </IconButton>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;



const TypingMessage = ({ text, onScroll }) => { 
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const plainText = text.replace(/\n/g, ' ');

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + plainText.charAt(index));
      index++;
      if (index >= plainText.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  // Trigger scroll on each text update
  useEffect(() => {
    if (onScroll) onScroll();
  }, [displayedText, onScroll]);

  return <Typography>{displayedText}</Typography>;
};