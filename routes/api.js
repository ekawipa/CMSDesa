const express = require('express');
const supabase = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all API routes
router.use(requireAuth);

// Update menu order
router.post('/menu/reorder', async (req, res) => {
  try {
    const { items } = req.body;

    // Update each menu item's order
    for (let i = 0; i < items.length; i++) {
      const { error } = await supabase
        .from('menu_items')
        .update({ order_index: i })
        .eq('id', items[i].id)
        .eq('village_id', req.session.villageId);

      if (error) throw error;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Menu reorder error:', error);
    res.status(500).json({ error: 'Error updating menu order' });
  }
});

// Add menu item
router.post('/menu', async (req, res) => {
  try {
    const { title, url, type } = req.body;

    const { data: menuItem, error } = await supabase
      .from('menu_items')
      .insert([{
        title,
        url,
        type: type || 'custom',
        village_id: req.session.villageId,
        order_index: 999
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, menuItem });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ error: 'Error adding menu item' });
  }
});

// Delete menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', req.params.id)
      .eq('village_id', req.session.villageId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});

// Update village settings
router.post('/settings', async (req, res) => {
  try {
    const { name, description, theme_color, contact_email, address } = req.body;

    const { error } = await supabase
      .from('villages')
      .update({
        name,
        description,
        theme_color,
        contact_email,
        address
      })
      .eq('id', req.session.villageId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Error updating settings' });
  }
});

module.exports = router;