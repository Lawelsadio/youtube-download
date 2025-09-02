import React, { useState } from 'react';

const formatOptions = [
  { value: 'bestvideo+bestaudio', label: 'Meilleure vidéo + audio' },
  { value: 'best', label: 'Meilleur (auto)' },
  { value: 'worst', label: 'Pire qualité' },
  { value: 'mp4', label: 'MP4' },
  { value: 'webm', label: 'WebM' },
  { value: 'm4a', label: 'Audio M4A' },
  { value: 'mp3', label: 'Audio MP3' },
  { value: '140', label: 'YouTube audio m4a (140)' },
  { value: '22', label: 'YouTube 720p mp4 (22)' },
  { value: '18', label: 'YouTube 360p mp4 (18)' },
];

const audioQualityOptions = [
  { value: '', label: '-- Choisir --' },
  { value: '0', label: 'Meilleure (0)' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: 'Moins bonne (10)' },
];

const videoQualityOptions = [
  { value: '', label: '-- Choisir --' },
  { value: 'best', label: 'Meilleure' },
  { value: 'worst', label: 'Pire' },
  { value: '1080p', label: '1080p' },
  { value: '720p', label: '720p' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
];

const subtitleOptions = [
  { value: '', label: '-- Choisir --' },
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'pt', label: 'Portugais' },
];

const audioFormatOptions = [
  { value: '', label: '-- Choisir --' },
  { value: 'mp3', label: 'MP3' },
  { value: 'm4a', label: 'M4A' },
  { value: 'wav', label: 'WAV' },
  { value: 'opus', label: 'Opus' },
  { value: 'flac', label: 'FLAC' },
];

const ytOptionsList = [
  { name: 'format', label: 'Format', type: 'select' },
  { name: 'video-quality', label: 'Qualité vidéo', type: 'select', options: videoQualityOptions },
  { name: 'audio-quality', label: 'Qualité audio', type: 'select', options: audioQualityOptions },
  { name: 'extract-audio', label: 'Extraire audio', type: 'checkbox' },
  { name: 'audio-format', label: 'Format audio', type: 'select', options: audioFormatOptions },
  { name: 'output', label: 'Nom du fichier', type: 'auto' },
  { name: 'playlist-items', label: 'Items playlist', placeholder: '1,2,3' },
  { name: 'subtitles', label: 'Sous-titres', type: 'select', options: subtitleOptions },
  { name: 'write-thumbnail', label: 'Télécharger miniature', type: 'checkbox' },
  { name: 'embed-subs', label: 'Intégrer sous-titres', type: 'checkbox' },
  // Ajoutez d'autres options yt-dlp ici
];

function App() {
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, opt) => {
    const value = opt.type === 'checkbox' ? e.target.checked : e.target.value;
    let newOptions = { ...options, [opt.name]: value };
    // Si la qualité vidéo est modifiée, ajuste le format automatiquement
    if (opt.name === 'video-quality' && value) {
      if (value === 'best' || value === 'worst') {
        newOptions.format = value + 'video+bestaudio';
      } else if (['1080p', '720p', '480p', '360p'].includes(value)) {
        newOptions.format = `bestvideo[height<=${value.replace('p','')}]` + '+bestaudio';
      }
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    // On retire video-quality et subtitles des options envoyées au backend
    const { 'video-quality': _videoQuality, subtitles, ...filteredOptions } = options;
    // Sous-titres : si une langue est choisie, ajoute sub-lang et write-subs
    if (subtitles) {
      filteredOptions['sub-lang'] = subtitles;
      filteredOptions['write-subs'] = true;
    }
    try {
      const res = await fetch('http://localhost:4000/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, options: filteredOptions }),
      });
      const data = await res.json();
      if (data.success) setResult(data.result);
      else setError(data.error || 'Erreur inconnue');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Téléchargeur yt-dlp Web</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="URL de la vidéo ou playlist"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
          required
        />
        {ytOptionsList.map(opt => (
          <div key={opt.name} style={{ marginBottom: 8 }}>
            <label>
              {opt.label} :
              {opt.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={!!options[opt.name]}
                  onChange={e => handleChange(e, opt)}
                />
              ) : opt.type === 'select' ? (
                <select
                  value={options[opt.name] || ''}
                  onChange={e => handleChange(e, opt)}
                  style={{ marginLeft: 8 }}
                  required={opt.name === 'format'}
                >
                  {opt.name === 'format' && formatOptions.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                  {opt.options && opt.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : opt.type === 'auto' ? (
                <input
                  type="text"
                  value={url.includes('playlist') ? '%(playlist)s/%(title)s.%(ext)s' : '%(title)s.%(ext)s'}
                  readOnly
                  style={{ marginLeft: 8, background: '#eee' }}
                />
              ) : (
                <input
                  type="text"
                  placeholder={opt.placeholder}
                  value={options[opt.name] || ''}
                  onChange={e => handleChange(e, opt)}
                  style={{ marginLeft: 8 }}
                />
              )}
            </label>
          </div>
        ))}
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? 'Téléchargement...' : 'Télécharger'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 10 }}>
          <h4>Résultat :</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
