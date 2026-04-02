import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ msg: 'Post cannot be empty' });
    }

    const post = await Post.create({
      userId: req.user,
      text,
      image,
    });

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === req.user);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user);
    } else {
      post.likes.push(req.user);
    }

    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.comments.push({
      userId: req.user,
      text: req.body.text,
    });

    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
