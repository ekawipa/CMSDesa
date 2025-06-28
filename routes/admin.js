const express = require('express');
const supabase = require('../config/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(requireAuth);

// Admin dashboard
router.get('/', async (req, res) => {
  try {
    // Get statistics
    const [articlesResult, newsResult, pagesResult] = await Promise.all([
      supabase.from('articles').select('id', { count: 'exact' }).eq('village_id', req.session.villageId),
      supabase.from('news').select('id', { count: 'exact' }).eq('village_id', req.session.villageId),
      supabase.from('pages').select('id', { count: 'exact' }).eq('village_id', req.session.villageId)
    ]);

    const stats = {
      articles: articlesResult.count || 0,
      news: newsResult.count || 0,
      pages: pagesResult.count || 0
    };

    res.render('admin/dashboard', {
      title: 'Dashboard - Village CMS',
      user: req.session,
      stats
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('admin/dashboard', {
      title: 'Dashboard - Village CMS',
      user: req.session,
      stats: { articles: 0, news: 0, pages: 0 },
      error: 'Error loading dashboard statistics'
    });
  }
});

// Articles management
router.get('/articles', async (req, res) => {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('village_id', req.session.villageId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('admin/articles/index', {
      title: 'Articles - Village CMS',
      user: req.session,
      articles: articles || []
    });
  } catch (error) {
    console.error('Articles error:', error);
    res.render('admin/articles/index', {
      title: 'Articles - Village CMS',
      user: req.session,
      articles: [],
      error: 'Error loading articles'
    });
  }
});

// Add article page
router.get('/articles/add', (req, res) => {
  res.render('admin/articles/add', {
    title: 'Add Article - Village CMS',
    user: req.session
  });
});

// Create article
router.post('/articles', async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    const { error } = await supabase
      .from('articles')
      .insert([{
        title,
        content,
        excerpt,
        status: status || 'draft',
        village_id: req.session.villageId,
        author_id: req.session.userId
      }]);

    if (error) throw error;

    res.redirect('/admin/articles');
  } catch (error) {
    console.error('Create article error:', error);
    res.render('admin/articles/add', {
      title: 'Add Article - Village CMS',
      user: req.session,
      error: 'Error creating article'
    });
  }
});

// News management
router.get('/news', async (req, res) => {
  try {
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('village_id', req.session.villageId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('admin/news/index', {
      title: 'News - Village CMS',
      user: req.session,
      news: news || []
    });
  } catch (error) {
    console.error('News error:', error);
    res.render('admin/news/index', {
      title: 'News - Village CMS',
      user: req.session,
      news: [],
      error: 'Error loading news'
    });
  }
});

// Add news page
router.get('/news/add', (req, res) => {
  res.render('admin/news/add', {
    title: 'Add News - Village CMS',
    user: req.session
  });
});

// Create news
router.post('/news', async (req, res) => {
  try {
    const { title, content, excerpt, status } = req.body;

    const { error } = await supabase
      .from('news')
      .insert([{
        title,
        content,
        excerpt,
        status: status || 'draft',
        village_id: req.session.villageId,
        author_id: req.session.userId
      }]);

    if (error) throw error;

    res.redirect('/admin/news');
  } catch (error) {
    console.error('Create news error:', error);
    res.render('admin/news/add', {
      title: 'Add News - Village CMS',
      user: req.session,
      error: 'Error creating news'
    });
  }
});

// Pages management
router.get('/pages', async (req, res) => {
  try {
    const { data: pages, error } = await supabase
      .from('pages')
      .select('*')
      .eq('village_id', req.session.villageId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('admin/pages/index', {
      title: 'Pages - Village CMS',
      user: req.session,
      pages: pages || []
    });
  } catch (error) {
    console.error('Pages error:', error);
    res.render('admin/pages/index', {
      title: 'Pages - Village CMS',
      user: req.session,
      pages: [],
      error: 'Error loading pages'
    });
  }
});

// Add page
router.get('/pages/add', (req, res) => {
  res.render('admin/pages/add', {
    title: 'Add Page - Village CMS',
    user: req.session
  });
});

// Create page
router.post('/pages', async (req, res) => {
  try {
    const { title, content, slug, status } = req.body;

    const { error } = await supabase
      .from('pages')
      .insert([{
        title,
        content,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        status: status || 'draft',
        village_id: req.session.villageId,
        author_id: req.session.userId
      }]);

    if (error) throw error;

    res.redirect('/admin/pages');
  } catch (error) {
    console.error('Create page error:', error);
    res.render('admin/pages/add', {
      title: 'Add Page - Village CMS',
      user: req.session,
      error: 'Error creating page'
    });
  }
});

// Menu management
router.get('/menu', async (req, res) => {
  try {
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('village_id', req.session.villageId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    res.render('admin/menu/index', {
      title: 'Menu Management - Village CMS',
      user: req.session,
      menuItems: menuItems || []
    });
  } catch (error) {
    console.error('Menu error:', error);
    res.render('admin/menu/index', {
      title: 'Menu Management - Village CMS',
      user: req.session,
      menuItems: [],
      error: 'Error loading menu items'
    });
  }
});

// Settings
router.get('/settings', async (req, res) => {
  try {
    const { data: village, error } = await supabase
      .from('villages')
      .select('*')
      .eq('id', req.session.villageId)
      .single();

    if (error) throw error;

    res.render('admin/settings', {
      title: 'Settings - Village CMS',
      user: req.session,
      village: village || {}
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.render('admin/settings', {
      title: 'Settings - Village CMS',
      user: req.session,
      village: {},
      error: 'Error loading settings'
    });
  }
});

module.exports = router;