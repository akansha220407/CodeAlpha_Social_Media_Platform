const API_URL = 'http://localhost:4000/api';

let token = localStorage.getItem('token');
let currentUser  = null;

const authDiv = document.getElementById('auth');
const appDiv = document.getElementById('app');

const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');

const signupUsername = document.getElementById('signup-username');
const signupPassword = document.getElementById('signup-password');
const signupBtn = document.getElementById('signup-btn');

const logoutBtn = document.getElementById('logout-btn');

const newPostContent = document.getElementById('new-post-content');
const postBtn = document.getElementById('post-btn');

const postsDiv = document.getElementById('posts');

function setToken(t) {
  token = t;
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}

async function fetchCurrentUser () {
  if (!token) return null;
  // Decode token to get user id (simple parse)
  const payload = JSON.parse(atob(token.split('.')[1]));
  return { id: payload.id };
}

async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  setToken(data.token);
  currentUser  = { id: data.id, username: data.username };
}

async function signup(username, password) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Signup failed');
  const data = await res.json();
  setToken(data.token);
  currentUser  = { id: data.id, username: data.username };
}

async function logout() {
  setToken(null);
  currentUser  = null;
  authDiv.style.display = 'block';
  appDiv.style.display = 'none';
}

async function loadPosts() {
  postsDiv.innerHTML = 'Loading...';
  const res = await fetch(`${API_URL}/posts`);
  const posts = await res.json();
  postsDiv.innerHTML = '';
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';

    const authorEl = document.createElement('div');
    authorEl.className = 'author';
    authorEl.textContent = post.author.username;
    postEl.appendChild(authorEl);

    const contentEl = document.createElement('div');
    contentEl.className = 'content';
    contentEl.textContent = post.content;
    postEl.appendChild(contentEl);

    const likesEl = document.createElement('div');
    likesEl.className = 'likes';
    likesEl.textContent = `Likes: ${post.likes.length}`;
    likesEl.style.cursor = token ? 'pointer' : 'default';
    likesEl.onclick = async () => {
      if (!token) return alert('Login to like posts');
      const res = await fetch(`${API_URL}/posts/${post._id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        likesEl.textContent = `Likes: ${data.likesCount}`;
      }
    };
    postEl.appendChild(likesEl);

    // Comments
    const commentsDiv = document.createElement('div');
    post.comments.forEach(comment => {
      const commentEl = document.createElement('div');
      commentEl.className = 'comment';

      const commentAuthor = document.createElement('div');
      commentAuthor.className = 'author';
      commentAuthor.textContent = comment.author.username;
      commentEl.appendChild(commentAuthor);

      const commentContent = document.createElement('div');
      commentContent.textContent = comment.content;
      commentEl.appendChild(commentContent);

      commentsDiv.appendChild(commentEl);
    });
    postEl.appendChild(commentsDiv);

    // Add comment form
    if (token) {
      const commentInput = document.createElement('textarea');
      commentInput.placeholder = 'Add a comment...';
      const commentBtn = document.createElement('button');
      commentBtn.textContent = 'Comment';
      commentBtn.onclick = async () => {
        if (!comment
