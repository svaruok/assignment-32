const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const signupUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  return res.json();
};

export const loginUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  return res.json();
};

export const getPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const createPostApi = async (postData, token) => {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  return res.json();
};

export const likePostApi = async (postId, token) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const commentPostApi = async (postId, text, token) => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  return res.json();
};
