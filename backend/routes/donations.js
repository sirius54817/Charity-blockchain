const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create new donation
router.post('/', async (req, res) => {
  try {
    const { donor_id, charity_id, amount, message } = req.body;
    const { data, error } = await supabase
      .from('donations')
      .insert([
        { 
          donor_id,
          charity_id,
          amount,
          message,
          status: 'completed',
          transaction_hash: `tx_${Date.now()}` // Mock blockchain transaction hash
        }
      ])
      .select();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        charities:charity_id(name, description)
      `)
      .eq('donor_id', req.params.userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 