import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { loginUser } from '../services/api';
import toast from 'react-hot-toast';

export default function Login({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful');
        if (onAuthSuccess) onAuthSuccess();
        navigate('/');
      } else {
        toast.error(data.msg || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Network error while logging in. Please try again.');
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0f0c29 100%)',
        position: 'relative',
        overflow: 'hidden',
        // Glow blobs in background
        '&::before': {
          content: '""',
          position: 'fixed',
          top: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,60,255,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          bottom: '-10%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,210,255,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Paper
        sx={{
          p: { xs: 4, sm: 4.5 },
          borderRadius: '24px',
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top accent line */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '20%',
            width: '60%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #a78bfa, #38bdf8, transparent)',
            borderRadius: '0 0 4px 4px',
          }}
        />

        <Typography
          variant="overline"
          sx={{
            letterSpacing: 3,
            color: '#a78bfa',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
        >
          TaskPlanet Social
        </Typography>

        <Typography
          variant="h5"
          fontWeight="800"
          mt={0.5}
          sx={{
            color: '#f1f5f9',
            letterSpacing: '-0.5px',
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          mt={0.5}
          mb={3}
          sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.92rem' }}
        >
          Sign in to continue to your social feed.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="filled"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.35)' },
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                borderRadius: '14px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'border-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(167,139,250,0.4)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: '#a78bfa',
                },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="filled"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.35)' },
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                borderRadius: '14px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'border-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(167,139,250,0.4)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: '#a78bfa',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 1,
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 'bold',
              py: 1.5,
              fontSize: '1rem',
              background: 'linear-gradient(90deg, #7c3aed, #38bdf8)',
              boxShadow: '0 6px 24px rgba(124,58,237,0.45)',
              letterSpacing: '0.3px',
              '&:hover': {
                background: 'linear-gradient(90deg, #6d28d9, #0ea5e9)',
                boxShadow: '0 8px 28px rgba(124,58,237,0.6)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Login
          </Button>
        </Box>

        <Typography
          mt={3}
          textAlign="center"
          sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#a78bfa',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
