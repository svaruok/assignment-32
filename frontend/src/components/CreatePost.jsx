import { useRef, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { createPostApi } from '../services/api';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { Menu, MenuItem, Chip } from '@mui/material';

export default function CreatePost({ onPostCreated, onModeChange }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [mode, setMode] = useState('post'); // 'post' | 'poll' | 'promotion'
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('24h');
  const [promo, setPromo] = useState({
    appName: '',
    title: '',
    description: '',
    buttonText: '',
    category: '',
    link: '',
  });
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const token = localStorage.getItem('token');
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const changeMode = (nextMode) => {
    setMode(nextMode);
    if (onModeChange) {
      onModeChange(nextMode);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result?.toString() || '');
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiToggle = (event) => {
    setEmojiAnchor((prev) => (prev ? null : event.currentTarget));
  };

  const insertEmoji = (emojiData) => {
    const emoji = emojiData.emoji;
    if (mode === 'post') {
      setText((prev) => prev + emoji);
    } else if (mode === 'poll') {
      setPollQuestion((prev) => prev + emoji);
    }
    setEmojiAnchor(null);
  };

  const buildPostText = () => {
    if (mode === 'post') return text;

    if (mode === 'poll') {
      const options = pollOptions.filter((o) => o.trim());
      if (!pollQuestion.trim() || options.length < 2) return '';
      return [
        `Poll: ${pollQuestion.trim()}`,
        ...options.map((o) => `• ${o.trim()}`),
        `(Duration: ${pollDuration})`,
      ].join('\n');
    }

    if (mode === 'promotion') {
      const { appName, title, description, buttonText, category, link } = promo;
      const required = [appName, title, description, buttonText, category, link];
      if (!required.every((field) => field.trim())) return '';
      return [
        `Promotion: ${appName.trim()}`,
        `Title: ${title.trim()}`,
        description.trim() && `Description: ${description.trim()}`,
        buttonText.trim() && `CTA: ${buttonText.trim()}`,
        category.trim() && `Category: ${category.trim()}`,
        link.trim() && `Link: ${link.trim()}`,
      ]
        .filter(Boolean)
        .join('\n');
    }

    return text;
  };

  const handlePost = async () => {
    const formattedText = buildPostText();

    if (!formattedText && !image) return;

    if (!token) {
      toast.error('Please log in to create a post.');
      return;
    }

    try {
      const data = await createPostApi({ text: formattedText, image }, token);

      if (data && data._id) {
        setText('');
        setImage('');
        setPollQuestion('');
        setPollOptions(['', '']);
        setPromo({
          appName: '',
          title: '',
          description: '',
          buttonText: '',
          category: '',
          link: '',
        });
        toast.success('Post created');
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        toast.error((data && data.msg) || 'Failed to create post.');
      }
    } catch (err) {
      console.error('Create post error:', err);
      toast.error('Network error while creating post. Please try again.');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '24px',
        background: 'background.paper',
        boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'center', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 2, sm: 0 }}
        mb={3}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ textAlign: { xs: 'center', sm: 'left' }, width: '100%' }}
        >
          {mode === 'post' && 'Create Post'}
          {mode === 'poll' && 'Create Poll'}
          {mode === 'promotion' && 'Create Promotion'}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            background: '#f1f2f6',
            borderRadius: '999px',
            p: 0.5,
            width: { xs: 'auto', sm: 'auto' },
            maxWidth: 360,
            alignSelf: { xs: 'center', sm: 'flex-end' },
          }}
        >
          <Button
            variant={mode === 'post' ? 'contained' : 'text'}
            sx={{
              flex: 1,
              minWidth: 0,
              borderRadius: '999px',
              textTransform: 'none',
              px: { xs: 2.2, sm: 2.6 },
              py: { xs: 0.7, sm: 0.6 },
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              lineHeight: 1.1,
              boxShadow: 'none',
            }}
            onClick={() => changeMode('post')}
          >
            All Posts
          </Button>

          <Button
            sx={{
              flex: 1,
              minWidth: 0,
              borderRadius: '999px',
              textTransform: 'none',
              color: '#666',
              px: { xs: 2.2, sm: 2.6 },
              py: { xs: 0.7, sm: 0.6 },
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              lineHeight: 1.1,
            }}
            color={mode === 'promotion' ? 'primary' : 'inherit'}
            onClick={() => changeMode('promotion')}
          >
            Promotions
          </Button>
        </Box>
      </Box>
      {mode === 'post' && (
        <TextField
          multiline
          minRows={isMobile ? 3 : 4}
          fullWidth
          placeholder="What’s on your mind?"
          variant="standard"
          value={text}
          onChange={(e) => setText(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: '#444',
            },
          }}
        />
      )}

      {mode === 'poll' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            placeholder="Ask a question..."
            variant="standard"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
          {pollOptions.map((opt, idx) => (
            <TextField
              key={idx}
              fullWidth
              placeholder={`Option ${idx + 1}`}
              variant="standard"
              value={opt}
              onChange={(e) => {
                const next = [...pollOptions];
                next[idx] = e.target.value;
                setPollOptions(next);
              }}
              InputProps={{ disableUnderline: true }}
            />
          ))}
          {pollOptions.length < 4 && (
            <Button
              size="small"
              sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
              onClick={() => setPollOptions((prev) => [...prev, ''])}
            >
              + Add option
            </Button>
          )}
          <Box display="flex" gap={1} mt={1}>
            {['24h', '3 Days', '7 Days'].map((d) => (
              <Chip
                key={d}
                label={d}
                clickable
                color={pollDuration === d ? 'primary' : 'default'}
                onClick={() => setPollDuration(d)}
              />
            ))}
          </Box>
        </Box>
      )}

      {mode === 'promotion' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="App / Website Name"
            variant="outlined"
            size="small"
            value={promo.appName}
            onChange={(e) => setPromo({ ...promo, appName: e.target.value })}
          />
          <TextField
            fullWidth
            label="Promotion Title"
            variant="outlined"
            size="small"
            value={promo.title}
            onChange={(e) => setPromo({ ...promo, title: e.target.value })}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={2}
            variant="outlined"
            size="small"
            value={promo.description}
            onChange={(e) => setPromo({ ...promo, description: e.target.value })}
          />
          <TextField
            fullWidth
            label="Button Text"
            variant="outlined"
            size="small"
            value={promo.buttonText}
            onChange={(e) => setPromo({ ...promo, buttonText: e.target.value })}
          />
          <TextField
            fullWidth
            label="Category"
            variant="outlined"
            size="small"
            value={promo.category}
            onChange={(e) => setPromo({ ...promo, category: e.target.value })}
          />
          <TextField
            fullWidth
            label="Link"
            variant="outlined"
            size="small"
            value={promo.link}
            onChange={(e) => setPromo({ ...promo, link: e.target.value })}
          />
        </Box>
      )}

      {image && (
        <Box mt={2}>
          <img
            src={image}
            alt="preview"
            style={{
              width: '100%',
              borderRadius: '18px',
              maxHeight: '280px',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />

      <Box
        mt={3}
        pt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
        borderTop="1px solid #eee"
      >
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <ImageOutlinedIcon sx={{ color: '#0d8bff' }} />
          </IconButton>

          <IconButton onClick={handleEmojiToggle}>
            <EmojiEmotionsOutlinedIcon sx={{ color: '#0d8bff' }} />
          </IconButton>

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MenuIcon sx={{ color: '#0d8bff' }} />
          </IconButton>

          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            ml={1}
            sx={{ cursor: 'pointer' }}
            onClick={() => changeMode('promotion')}
          >
            <CampaignOutlinedIcon sx={{ color: '#0d8bff' }} />
            <Typography color="#0d8bff" fontWeight="500">
              Promo
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!buildPostText() && !image}
          sx={{
            borderRadius: '999px',
            px: { xs: 3, sm: 4 },
            py: { xs: 0.75, sm: 1 },
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            boxShadow: 'none',
          }}
        >
          Post
        </Button>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            changeMode('post');
            setMenuAnchor(null);
          }}
        >
          Create Post
        </MenuItem>
        <MenuItem
          onClick={() => {
            changeMode('poll');
            setMenuAnchor(null);
          }}
        >
          Create Poll
        </MenuItem>
      </Menu>

      {emojiAnchor && (
        <Box sx={{ position: 'absolute', zIndex: 10, mt: 1 }}>
          <EmojiPicker onEmojiClick={insertEmoji} />
        </Box>
      )}
    </Paper>
  );
}
