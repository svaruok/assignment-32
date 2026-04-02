import { Box, Button } from '@mui/material';

const tabs = ['All Post', 'For You', 'Most Liked', 'Most Commented'];

export default function FeedTabs({ active, onChange }) {
  const current = active || 'All Post';

  return (
    <Box
      display="flex"
      gap={1.2}
      overflow="auto"
      py={2}
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        whiteSpace: 'nowrap',
      }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onChange && onChange(tab)}
          sx={{
            flexShrink: 0,
            borderRadius: '999px',
            px: { xs: 2.2, sm: 3 },
            py: { xs: 0.7, sm: 1 },
            textTransform: 'none',
            background: current === tab ? '#0d8bff' : '#fff',
            color: current === tab ? '#fff' : '#555',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
          }}
        >
          {tab}
        </Button>
      ))}
    </Box>
  );
}
