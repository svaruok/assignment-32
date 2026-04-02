import { useEffect, useState } from 'react';
import { Box, Container, Fab, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import FeedTabs from '../components/FeedTabs';
import PostCard from '../components/PostCard';
import BottomNavBar from '../components/BottomNav';
import AddIcon from '@mui/icons-material/Add';
import { getPosts } from '../services/api';

export default function Feed({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Post');
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const isPromotionPost = (post) => {
    const text = post?.text || '';
    return (
      text.startsWith('Promotion:') || text.startsWith('📢 Promotion:')
    );
  };

  const getVisiblePosts = () => {
    const base = showPromotionsOnly
      ? posts.filter(isPromotionPost)
      : posts;

    const ordered = [...base];

    if (activeTab === 'Most Liked') {
      ordered.sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    } else if (activeTab === 'Most Commented') {
      ordered.sort(
        (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
      );
    }

    return ordered;
  };

  const visiblePosts = getVisiblePosts();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3 },
        pb: { xs: 18, sm: 20 },
        background: 'linear-gradient(160deg, #0f0c29 0%, #1a1040 50%, #0f0c29 100%)',
        position: 'relative',
        // Ambient glow blobs
        '&::before': {
          content: '""',
          position: 'fixed',
          top: '-5%',
          left: '-10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,60,255,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          bottom: '-5%',
          right: '-10%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,210,255,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 0 }, position: 'relative', zIndex: 1 }}>
        <Navbar onLogout={onLogout} />
        <CreatePost
          onPostCreated={fetchPosts}
          onModeChange={(m) => setShowPromotionsOnly(m === 'promotion')}
        />
        <FeedTabs active={activeTab} onChange={setActiveTab} />

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {loading ? (
            <Typography
              textAlign="center"
              mt={4}
              sx={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Loading posts...
            </Typography>
          ) : visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                refreshPosts={fetchPosts}
              />
            ))
          ) : (
            <Box textAlign="center" mt={5}>
              <Typography variant="h6" sx={{ color: '#f1f5f9' }}>
                No posts yet
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                Be the first to post something
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      <BottomNavBar />

      <Fab
        color="primary"
        size="medium"
        sx={{
          position: 'fixed',
          bottom: 88,
          right: { xs: 16, sm: 24 },
          background: 'linear-gradient(135deg, #7c3aed, #38bdf8)',
          boxShadow: '0 8px 24px rgba(124,58,237,0.5)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6d28d9, #0ea5e9)',
            boxShadow: '0 10px 28px rgba(124,58,237,0.65)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease',
        }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
