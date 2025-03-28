const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        charities:charity_id(name, description)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Ensure we always return an array
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message, data: [] });
  }
});

// Get transactions by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        charities:charity_id(name, description)
      `)
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Ensure we always return an array
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ error: error.message, data: [] });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        charities:charity_id(name, description)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    res.json(data || null);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error.message, data: null });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  try {
    const { user_id, charity_id, amount, transaction_hash } = req.body;

    const { data, error } = await supabase
      .from('donations')
      .insert([
        {
          user_id,
          charity_id,
          amount,
          transaction_hash,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update transaction status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from('donations')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 