import { useState } from 'react';
import Modal from '@mui/material/Modal';
import LoginModal from './modals/login';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, 50%)',
  bgcolor: '#B22222',
  p: 4,
  overflow: 'auto',
  display: 'flow',
  maxHeight: 600
};

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
    <LoginModal
      open={open}
      onClose={closeModal}
      header={() => <h1>Sign In</h1>}>

    </LoginModal>

  )

}
