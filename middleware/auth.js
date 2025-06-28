const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'admin') {
    return res.status(403).render('error', {
      title: 'Access Denied',
      message: 'You do not have permission to access this resource.',
      error: {}
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin
};