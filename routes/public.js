const express = require('express');
const supabase = require('../config/database');
const router = express.Router();

// Home page
router.get('/', async (req, res) => {
  try {
    // Get village ID from subdomain or use default
    const villageId = req.session.villageId || 1;

    // Get latest news and articles
    const [newsResult, articlesResult, villageResult] = await Promise.all([
      supabase.from('news').select('*').eq('village_id', villageId).eq('status', 'published').order('created_at', { ascending: false }).limit(5),
      supabase.from('articles').select('*').eq('village_id', villageId).eq('status', 'published').order('created_at', { ascending: false }).limit(3),
      supabase.from('villages').select('*').eq('id', villageId).single()
    ]);

    const news = newsResult.data || [];
    const articles = articlesResult.data || [];
    const village = villageResult.data || { name: 'Village CMS' };

    res.render('public/home', {
      title: `${village.name} - Village Portal`,
      village,
      news,
      articles
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('public/home', {
      title: 'Village Portal',
      village: { name: 'Village CMS' },
      news: [],
      articles: [],
      error: 'Error loading content'
    });
  }
});

// News listing
router.get('/news', async (req, res) => {
  try {
    const villageId = req.session.villageId || 1;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('village_id', villageId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.render('public/news/index', {
      title: 'News - Village Portal',
      news: news || [],
      currentPage: page
    });
  } catch (error) {
    console.error('News listing error:', error);
    res.render('public/news/index', {
      title: 'News - Village Portal',
      news: [],
      currentPage: 1,
      error: 'Error loading news'
    });
  }
});

// Single news article
router.get('/news/:id', async (req, res) => {
  try {
    const { data: newsItem, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', req.params.id)
      .eq('status', 'published')
      .single();

    if (error || !newsItem) {
      return res.status(404).render('error', {
        title: 'News Not Found',
        message: 'The news article you are looking for does not exist.',
        error: {}
      });
    }

    res.render('public/news/single', {
      title: `${newsItem.title} - Village Portal`,
      newsItem
    });
  } catch (error) {
    console.error('Single news error:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Error loading news article',
      error: {}
    });
  }
});

// Articles listing
router.get('/articles', async (req, res) => {
  try {
    const villageId = req.session.villageId || 1;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('village_id', villageId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.render('public/articles/index', {
      title: 'Articles - Village Portal',
      articles: articles || [],
      currentPage: page
    });
  } catch (error) {
    console.error('Articles listing error:', error);
    res.render('public/articles/index', {
      title: 'Articles - Village Portal',
      articles: [],
      currentPage: 1,
      error: 'Error loading articles'
    });
  }
});

// Single article
router.get('/articles/:id', async (req, res) => {
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', req.params.id)
      .eq('status', 'published')
      .single();

    if (error || !article) {
      return res.status(404).render('error', {
        title: 'Article Not Found',
        message: 'The article you are looking for does not exist.',
        error: {}
      });
    }

    res.render('public/articles/single', {
      title: `${article.title} - Village Portal`,
      article
    });
  } catch (error) {
    console.error('Single article error:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Error loading article',
      error: {}
    });
  }
});

// Dynamic pages
router.get('/page/:slug', async (req, res) => {
  try {
    const villageId = req.session.villageId || 1;
    
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('village_id', villageId)
      .eq('status', 'published')
      .single();

    if (error || !page) {
      return res.status(404).render('error', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.',
        error: {}
      });
    }

    res.render('public/page', {
      title: `${page.title} - Village Portal`,
      page
    });
  } catch (error) {
    console.error('Dynamic page error:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Error loading page',
      error: {}
    });
  }
});

module.exports = router;