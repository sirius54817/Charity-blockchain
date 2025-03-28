const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get all charities
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('charities')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get charity details with donation history
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('charities')
      .select(`
        *,
        donations(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 