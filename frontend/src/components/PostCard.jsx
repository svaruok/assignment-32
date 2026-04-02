import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { likePostApi } from '../services/api';
import CommentModal from './CommentModal';

export default function PostCard({ post, refreshPosts }) {
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [openComments, setOpenComments] = useState(false);
  const username = post.userId?.username || 'User';

  const parsePromotion = (text) => {
    if (!text) return null;
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    const first = lines[0]
      .replace(/^📢\s*/u, '')
      .replace(/^Promotion:\s*/i, '')
      .trim();

    if (!lines[0].toLowerCase().includes('promotion:')) return null;

    const getValue = (prefix) => {
      const line = lines.find((l) => l.toLowerCase().startsWith(prefix));
      return line ? line.slice(prefix.length).trim() : '';
    };

    const appName = first;
    const title = getValue('title:');
    const description = getValue('description:');
    const buttonText = getValue('cta:');
    const category = getValue('category:');
    const link = getValue('link:');

    if (!appName || !title) return null;

    return { appName, title, description, buttonText, category, link };
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return (
      d.toLocaleDateString() +
      ' \u2022 ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const createdAt = formatTime(post.createdAt);
  const promotion = parsePromotion(post.text || '');
  const isPromotion = Boolean(promotion);

  const openPromotionLink = () => {
    if (!promotion?.link) return;
    const url = promotion.link.match(/^https?:\/\//i)
      ? promotion.link
      : `https://${promotion.link}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLike = async () => {
    if (!token) return;

    // Optimistic UI update
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((count) => (prev ? count - 1 : count + 1));
      return next;
    });

    try {
      await likePostApi(post._id, token);
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userId = currentUser?._id;
    const likesArray = Array.isArray(post.likes) ? post.likes : [];

    const isLiked = userId
      ? likesArray.some(
          (id) => id === userId || (id && typeof id === 'object' && id._id === userId)
        )
      : false;

    setLiked(isLiked);
    setLikeCount(likesArray.length);
  }, [post, currentUser]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: '24px',
          background: isPromotion ? '#fffdf5' : '#fff',
          border: isPromotion ? '1px solid #facc15' : 'none',
          boxShadow: isPromotion
            ? '0 8px 24px rgba(250,204,21,0.25)'
            : '0 6px 18px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box display="flex" gap={1.5}>
            <Avatar sx={{ width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography fontWeight="bold" fontSize={{ xs: '1rem', sm: '1.2rem' }}>
                {username}
              </Typography>

              <Typography color="text.secondary" fontSize={{ xs: '0.85rem', sm: '0.95rem' }}>
                @{post.userId?.username?.toLowerCase() || 'user'}
              </Typography>

              {createdAt && (
                <Typography
                  color="text.secondary"
                  fontSize={{ xs: '0.75rem', sm: '0.85rem' }}
                  mt={0.5}
                >
                  {createdAt}
                </Typography>
              )}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
            {isPromotion && promotion?.appName && (
              <Box
                sx={{
                  borderRadius: '999px',
                  border: '1px solid #facc15',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.8rem',
                  color: '#92400e',
                  backgroundColor: '#fffbeb',
                }}
              >
                {promotion.appName}
              </Box>
            )}
            <Button
              variant="contained"
              sx={{
                borderRadius: '999px',
                textTransform: 'none',
                px: { xs: 2.4, sm: 3 },
                boxShadow: 'none',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                py: { xs: 0.4, sm: 0.6 },
              }}
            >
              Follow
            </Button>
          </Box>
        </Box>

        {/* Content */}
        {isPromotion ? (
          <Box mt={3}>
            <Typography fontSize={{ xs: '1.2rem', sm: '1.4rem' }} fontWeight="bold" color="#1f2937">
              {promotion.title}
            </Typography>
            {promotion.description && (
              <Typography mt={1} color="#374151">
                {promotion.description}
              </Typography>
            )}

            <Box mt={2} display="flex" flexWrap="wrap" gap={1.5} alignItems="center">
              {promotion.buttonText && (
                <Button
                  onClick={openPromotionLink}
                  sx={{
                    borderRadius: '999px',
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1, sm: 1.2 },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    backgroundColor: '#facc15',
                    color: '#92400e',
                    '&:hover': { backgroundColor: '#eab308' },
                  }}
                >
                  {promotion.buttonText}
                </Button>
              )}

              {promotion.category && (
                <Box
                  sx={{
                    borderRadius: '999px',
                    border: '1px solid #facc15',
                    px: 2,
                    py: 0.5,
                    fontSize: '0.8rem',
                    color: '#92400e',
                    backgroundColor: '#fffbeb',
                  }}
                >
                  {promotion.category}
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          post.text && (
            <Typography mt={2} fontSize={{ xs: '1.05rem', sm: '1.35rem' }} color="#222">
              {post.text}
            </Typography>
          )
        )}

        {post.image && (
          <Box mt={2}>
            <img
              src={post.image}
              alt="post"
              style={{
                width: '100%',
                borderRadius: '18px',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        <Box mt={3} borderTop="1px solid #eee" />

        {/* Actions */}
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton onClick={handleLike} disabled={!token}>
              {liked ? (
                <FavoriteIcon sx={{ color: 'red', fontSize: 22 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 22 }} />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton onClick={() => setOpenComments(true)}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <Typography>{post.comments?.length || 0}</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <IconButton>
              <ShareOutlinedIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <Typography>1</Typography>
          </Box>
        </Box>
      </Paper>

      <CommentModal
        open={openComments}
        onClose={() => setOpenComments(false)}
        post={post}
        refreshPosts={refreshPosts}
      />
    </>
  );
}
