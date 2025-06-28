const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../config/database');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login - Village CMS',
    error: req.session.error || null
  });
  delete req.session.error;
});

// Login handler
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.session.error = 'Please provide both email and password';
      return res.redirect('/auth/login');
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      req.session.error = 'Invalid credentials';
      return res.redirect('/auth/login');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.session.error = 'Invalid credentials';
      return res.redirect('/auth/login');
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    req.session.villageId = user.village_id;

    res.redirect('/admin');
  } catch (error) {
    console.error('Login error:', error);
    req.session.error = 'An error occurred during login';
    res.redirect('/auth/login');
  }
});

// Logout handler
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

// Register page (for initial setup)
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register - Village CMS',
    error: req.session.error || null
  });
  delete req.session.error;
});

// Register handler
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, villageName } = req.body;

    if (!name || !email || !password || !villageName) {
      req.session.error = 'All fields are required';
      return res.redirect('/auth/register');
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      req.session.error = 'User already exists';
      return res.redirect('/auth/register');
    }

    // Create village first
    const { data: village, error: villageError } = await supabase
      .from('villages')
      .insert([{ name: villageName }])
      .select()
      .single();

    if (villageError) {
      req.session.error = 'Error creating village';
      return res.redirect('/auth/register');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        village_id: village.id
      }])
      .select()
      .single();

    if (userError) {
      req.session.error = 'Error creating user';
      return res.redirect('/auth/register');
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    req.session.villageId = user.village_id;

    res.redirect('/admin');
  } catch (error) {
    console.error('Registration error:', error);
    req.session.error = 'An error occurred during registration';
    res.redirect('/auth/register');
  }
});

module.exports = router;