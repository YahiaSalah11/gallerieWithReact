const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');
const bcrypt = require('bcrypt');
const validator = require('validator');

const router = express.Router();

// Session store
const sessionStore = new MySQLStore({
  expiration: 86400000,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, db);

// Session setup
router.use(
  session({
    key: 'session_cookie_name',
    secret: 'yahia2002',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 86400000 },
  })
);

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { title, Fname, Lname, username, email, password, passwordMatch } = req.body;
  
  try {
    if (!title || !Fname || !Lname || !username || !email || !password || !passwordMatch) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    if (password !== passwordMatch) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const [existingEmail] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (title, Fname, Lname, username, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [title, Fname, Lname, username, email, hashedPassword]
    );

    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, username: user.username, email: user.email };
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Session save error' });
      }
      res.json({ success: true, message: 'Login successful', user: req.session.user });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('session_cookie_name');
    res.json({ success: true, message: 'Logout successful' });
  });
});

// Check session endpoint
router.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
