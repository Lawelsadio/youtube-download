import express from 'express';
import cors from 'cors';
import youtubedl from 'youtube-dl-exec';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Endpoint principal pour le téléchargement
app.post('/download', async (req, res) => {
  const { url, options } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL manquante.' });
  }
  // Dossier de sortie
  const outputDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Filtrer les options non supportées
  const allowedOptions = [
    'format', 'audio-quality', 'extract-audio', 'audio-format', 'output', 'playlist-items', 'sub-lang', 'write-subs', 'write-thumbnail', 'embed-subs'
  ];
  const filtered = Object.fromEntries(Object.entries(options).filter(([key, value]) => {
    if (key === 'extract-audio') return value === true;
    return allowedOptions.includes(key);
  }));
  const ytOptions = {
    ...filtered,
    output: path.join(outputDir, '%(title)s.%(ext)s'),
  };

  try {
    const result = await youtubedl(url, ytOptions);
    res.json({ success: true, result, outputDir });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pour servir les fichiers téléchargés
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.listen(PORT, () => {
  console.log(`Backend yt-dlp lancé sur http://localhost:${PORT}`);
});
