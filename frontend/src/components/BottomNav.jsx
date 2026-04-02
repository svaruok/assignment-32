import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

export default function BottomNavBar() {
  const [value, setValue] = useState(2);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '600px',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 -4px 18px rgba(0,0,0,0.08)',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{
          background: '#1f6dff',
          height: { xs: 64, sm: 72 },
        }}
      >
        <BottomNavigationAction icon={<HomeOutlinedIcon sx={{ color: '#fff', fontSize: { xs: 22, sm: 24 } }} />} />
        <BottomNavigationAction icon={<AssignmentTurnedInOutlinedIcon sx={{ color: '#fff', fontSize: { xs: 22, sm: 24 } }} />} />
        <BottomNavigationAction icon={<PublicOutlinedIcon sx={{ color: '#fff', fontSize: { xs: 22, sm: 24 } }} />} />
        <BottomNavigationAction icon={<EmojiEventsOutlinedIcon sx={{ color: '#fff', fontSize: { xs: 22, sm: 24 } }} />} />
      </BottomNavigation>
    </Paper>
  );
}
