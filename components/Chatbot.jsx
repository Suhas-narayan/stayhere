'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Avatar, Fab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      content: 'Hello! I\'m your travel assistant. I can help you find properties, suggest destinations, and answer questions about our services.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

 
  const travelContext = `
    You are "StayHere AI", the virtual assistant for https://stayhere.asia/, a premium travel booking platform. 
    Your knowledge includes:

    Company Information:
    - Name: StayHere
    - Website: https://stayhere.asia/
    - Contact: support@StayHere.com
    - Operating since: 2023

    Services Offered:
    - Hotel bookings (luxury, budget, boutique)
    - Vacation rentals
    - Flight reservations
    - Travel packages

    Key Features:
    - Price match guarantee
    - 24/7 customer support
    - Free cancellation on most bookings
    - Loyalty program with 5% cashback

    Current Promotions:
    - SUMMER24: 15% off all beach resorts
    - LONGSTAY: 10% discount for 7+ night stays
    - NEWUSER: $25 credit for first-time users

    Policies:
    - Check-in: 3 PM
    - Check-out: 11 AM
    - Pet policy: Varies by property
    - Payment methods: All major credit cards, PayPal

    Popular Destinations:
    - Kuala lumpur
    - Penang
    - Johar bahru
    - Petaling 
    - Kota kinabalu
    - Pattaya

    Response Guidelines:
    1. Always be polite and professional
    2. Keep responses concise but helpful
    3. For booking questions, direct to website or support
    4. Mention promotions when relevant
    5. If unsure, offer to connect to human support
  `;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          context: travelContext,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "Sorry, I'm having trouble responding. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '500px', 
          width: '350px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white'
        }}>
          <Box sx={{ 
            backgroundColor: '#4285F4',
            color: 'white', 
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SmartToyIcon sx={{ marginRight: '8px' }} />
              <Typography variant="h6">StayHere Assistant</Typography>
            </Box>
            <IconButton color="inherit" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            padding: '16px', 
            overflowY: 'auto', 
            backgroundColor: '#f9f9f9'
          }}>
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}
              >
                {msg.role === 'model' && (
                  <Avatar sx={{ bgcolor: '#4285F4', marginRight: '8px' }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    padding: '8px 12px',
                    maxWidth: '70%',
                    backgroundColor: msg.role === 'user' ? '#4285F4' : 'white',
                    color: msg.role === 'user' ? 'white' : 'black',
                    borderRadius: msg.role === 'user' 
                      ? '18px 18px 0 18px' 
                      : '18px 18px 18px 0'
                  }}
                >
                  <Typography>{msg.content}</Typography>
                </Paper>
                {msg.role === 'user' && (
                  <Avatar sx={{ bgcolor: '#34A853', marginLeft: '8px' }}>U</Avatar>
                )}
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Avatar sx={{ bgcolor: '#4285F4', marginRight: '8px' }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper sx={{ padding: '8px 12px', borderRadius: '18px 18px 18px 0' }}>
                  <Typography>Thinking...</Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          
          <Box sx={{ 
            padding: '12px 16px', 
            borderTop: '1px solid #ddd',
            backgroundColor: 'white'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about properties, destinations, or deals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    color="primary" 
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
      )}
      
      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          backgroundColor: '#4285F4',
          '&:hover': {
            backgroundColor: '#3367D6'
          }
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </div>
  );
}