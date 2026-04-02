import { Avatar, Box, IconButton, InputBase, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <Box mb={3}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        align="center"
      >
        Social
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        gap={2}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            width: '100%',
            px: 2,
            borderRadius: '16px',
            background: '#f1f2f6',
            display: 'flex',
            alignItems: 'center',
            height: 48,
          }}
        >
          <InputBase
            placeholder="Search promotions, users..."
            fullWidth
            sx={{ fontSize: '1rem' }}
          />
        </Paper>

        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
          gap={1.5}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            mt: { xs: 2, sm: 0 },
            px: { xs: 0.5, sm: 0 },
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton
              sx={{
                background: '#0d8bff',
                color: 'white',
                width: 42,
                height: 42,
                transition: 'background 0.2s',
                '&:hover': { background: '#0077e6' },
              }}
            >
              <SearchIcon />
            </IconButton>

            <IconButton
              onClick={handleLogout}
              sx={{
                background: '#f1f2f6',
                width: 42,
                height: 42,
                transition: 'background 0.2s',
                '&:hover': { background: '#e5edf7' },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>

          <Avatar
            sx={{
              width: 42,
              height: 42,
              cursor: 'default',
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || ''}
          </Avatar>
        </Box>
      </Box>
    </Box>
  );
}
