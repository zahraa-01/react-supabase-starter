import express from 'express';
import { join, dirname } from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Configure dotenv
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Get Supabase URL and API key from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_ANON_KEY;

// API endpoint that calls Supabase Edge Function
app.get('/api/todos', async (req, res) => {
  try {
    // Validate that environment variables are set
    if (!SUPABASE_URL || !SUPABASE_API_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Call the Supabase Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/todos`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Edge function error: ${response.status} ${response.statusText}`);
    }

    // Get the JSON response from the Edge Function
    const data = await response.json();
    
    // Send the data back to the client
    res.json(data);
  } catch (error) {
    console.error('Error fetching To-Dos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch To-Dos',
      message: error.message
    });
  }
});

// Simple response for root path
app.get('/', (req, res) => {
  res.send('Express server is running. Please access the React app through the Vite dev server.');
});

// In production, serve the React build files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client/dist/index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});