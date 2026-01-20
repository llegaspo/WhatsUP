import type { ReactNode  } from 'react';
import { Prompt } from 'next/font/google';
import type { SxProps, Theme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import  TextField  from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import GoogleIcon from '@mui/icons-material/Google';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(178, 74, 54, 0.7)',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
  display: 'flow',
  maxHeight: 600,
  color: 'Black'
}

type inputArg = {
  open: boolean
  onClose: (() => void)
  // sx: SxProps<Theme>
}

export default function LoginModal(props: inputArg){
  return (
    <Modal open={props.open} onClose={props.onClose} >
      <Box sx={style}>
        <Box mb={2} fontSize='24px' fontWeight='bold' textAlign="center">Sign In</Box>
        <TextField
          fullWidth
          label = "Username"
          type = "text"
          margin = "normal"
          variant = "outlined"
          sx = {{mb: 2}}
          InputProps = {{
            style: {
              backgroundColor: '#fbeaea',
              fontFamily: 'Prompt, sans-serif',
            },
            notched: false
          }}
          InputLabelProps = {{
            // shrink: true,
            sx: {
              // transform: 'translate(2%, -95%)',
              '&.Mui-focused, &.MuiInputLabel-shrink': {
              color: 'black',
              transform: 'translate(2%, -95%)',
              transformOrigin: 'top left',
              },
              '&':{
                color: '#888',
              },
              color: 'black',
              fontWeight: 'bold'
            },
          }}
          />
        <TextField
          fullWidth
          label = "Password"
          type = "password"
          margin = "normal"
          variant = "outlined"
          InputProps={{
            style: {
              backgroundColor: '#fbeaea'
            },
            notched: false
          }}
          InputLabelProps={{
            // shrink: true,
            sx: {
              '&.Mui-focused, &.MuiInputLabel-shrink': {
                color: 'black',
                transform: 'translate(2%, -95%)',
                transformOrigin: 'top left',
              },
              '&':{
                color: '#888',
              },
              color: 'black',
              fontWeight: 'bold'
            },
          }}
          />
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt:2,
            fontFamily: 'Prompt, sans-serif',
            backgroundColor: '#B22222',
            '&:hover': {
              backgroundColor: '#8B0000',
            },
          }}
          >
          Sign In
        </Button>

        <Divider sx={{ my: 3}}> or Sign In with </Divider>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon/>}
          sx={{
            textTransform: 'none',
            fontFamily: 'Prompt, sans-serif',
          }}
          >
          Sign in with Google
        </Button>
        <div style={{ padding: '2px'}}></div>
        <p style={{textAlign: 'Center',}}>No account? <Button sx={{
                        color:'blue',
                        textTransform: 'none',
                        textDecoration: 'underline',
                        fontFamily: 'Prompt, sans-serif',}}>
          Sign Up</Button> Now</p>

      </Box>
    </Modal>
  )

}
