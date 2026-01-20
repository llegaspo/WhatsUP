'use client';
import { useState } from 'react';
import LoginModal from '@/components/modals/login';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const buttonStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: 2,
  boxSizing: 'border-box:',
  width: '100%'
}
export default function Login(){
  const [ open, setOpen ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ login, setLogin ] = useState(false);
  const [ error, setError ] = useState('');

  const handleLoginClick = () => {
    if(!email || !password){
      setError('Please enter both email and password');
    }

    if(email === 'admin@legaspo.com' && password === 'legaspo123'){
      setLogin(true);
      setError('');
      setOpen(false);
    }
    else{
      setError('Invalid credentials');
    }
  }

  const openModal = () => setOpen(true);

  const closeModal = () => {
    setOpen(false);
    setEmail('');
    setPassword('');
    setError('');
  }

  return(
    <>
    <Box sx={buttonStyle}>
    <Button onClick={openModal} variant='outlined'
        sx={{
            color:'#800000',
            borderColor: '#800000',
            '&:hover': {
              borderColor: '#660000',
              backgroundColor: 'rgba(128, 30, 20, 0.8)',
              color: '#fbeaea'
            },
            mt: 2,
            mr: 3
          }}>Log in</Button>
    </Box>
    <LoginModal
      open={open}
      onClose={closeModal}>

    </LoginModal>
    </>
  )

}


