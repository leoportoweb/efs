import express from 'express';
import { readFile, writeFile, copyFile, access, constants } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const app = express();
const PORT = process.env.PORT || 3001;

const PUBLIC_DIR = join(__dirname, 'dist');
const SKILLS_FILE = join(PUBLIC_DIR, 'skills.json');
const BACKUP_FILE = join(PUBLIC_DIR, 'skills.json.bak');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

async function ensureBackup() {
  try {
    await access(SKILLS_FILE, constants.F_OK);
    await copyFile(SKILLS_FILE, BACKUP_FILE);
    console.log('Backup created:', BACKUP_FILE);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No skills.json to backup');
    } else {
      console.error('Backup failed:', err);
    }
  }
}

app.get('/api/skills', async (req, res) => {
  try {
    const data = await readFile(SKILLS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading skills:', err);
    res.status(500).json({ error: 'Failed to read skills' });
  }
});

app.put('/api/skills', async (req, res) => {
  try {
    await ensureBackup();
    
    const { skills, version, updated } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Invalid data: skills must be an array' });
    }
    
    const data = {
      version: version || '2.0.0',
      updated: updated || new Date().toISOString(),
      skills
    };
    
    await writeFile(SKILLS_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('Skills updated:', new Date().toISOString());
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error writing skills:', err);
    res.status(500).json({ error: 'Failed to write skills' });
  }
});

app.get('/api/skills/backup', async (req, res) => {
  try {
    const data = await readFile(BACKUP_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(404).json({ error: 'No backup found' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});