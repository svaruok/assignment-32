import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { commentPostApi } from '../services/api';

export default function CommentModal({ open, onClose, post, refreshPosts }) {
  const [commentText, setCommentText] = useState('');
  const token = localStorage.getItem('token');

  const handleComment = async () => {
    if (!commentText.trim() || !post?._id || !token) return;

    await commentPostApi(post._id, commentText, token);
    setCommentText('');
    if (refreshPosts) {
      refreshPosts();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight="bold">Comments</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mb={3}>
          {post?.comments?.length > 0 ? (
            post.comments.map((comment, index) => (
              <Box key={index}>
                <Box display="flex" gap={2} alignItems="flex-start">
                  <Avatar />
                  <Box>
                    <Typography fontWeight="bold" fontSize="0.95rem">
                      User
                    </Typography>
                    <Typography color="text.secondary">
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">No comments yet.</Typography>
          )}
        </Box>

        <Box display="flex" gap={2} mt={2}>
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleComment}
            disabled={!commentText.trim() || !token}
            sx={{
              borderRadius: '999px',
              px: 3,
              textTransform: 'none',
            }}
          >
            Post
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
