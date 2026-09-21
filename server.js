import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const app = express();
const PORT = process.env.PORT || 3001;

const PUBLIC_DIR = join(__dirname, 'dist');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

async function fetchSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('id, name_en, name_ptpt, name_ptbr, count')
    .order('id', { ascending: true });

  if (error) throw error;

  return data.map(s => ({
    id: s.id,
    names: {
      en: s.name_en,
      ptPT: s.name_ptpt,
      ptBR: s.name_ptbr
    },
    count: s.count
  }));
}

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await fetchSkills();
    const data = {
      version: '3.0.0',
      updated: new Date().toISOString(),
      skills
    };
    res.json(data);
  } catch (err) {
    console.error('Error reading skills:', err);
    res.status(500).json({ error: 'Failed to read skills' });
  }
});

app.put('/api/skills', async (req, res) => {
  try {
    const { skills, version, updated } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Invalid data: skills must be an array' });
    }

    const updates = skills.map(s => ({
      id: s.id,
      name_en: s.names.en,
      name_ptpt: s.names.ptPT,
      name_ptbr: s.names.ptBR,
      count: s.count,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('skills')
      .upsert(updates, { onConflict: 'id' });

    if (error) throw error;

    console.log('Skills updated:', new Date().toISOString());
    const updatedSkills = await fetchSkills();
    res.json({ 
      success: true, 
      data: { version: version || '3.0.0', updated: updated || new Date().toISOString(), skills: updatedSkills }
    });
  } catch (err) {
    console.error('Error writing skills:', err);
    res.status(500).json({ error: 'Failed to write skills' });
  }
});

app.get('/api/skills/backup', async (req, res) => {
  res.status(404).json({ error: 'Backup not available with Supabase' });
});

app.get('*', (req, res) => {
  res.sendFile(join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});