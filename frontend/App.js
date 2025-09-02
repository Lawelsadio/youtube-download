import React, { useState } from 'react';

const ytOptionsList = [
  { name: 'format', label: 'Format', placeholder: 'bestvideo+bestaudio' },
  { name: 'audio-quality', label: 'Qualité audio', placeholder: '0-10' },
  { name: 'video-quality', label: 'Qualité vidéo', placeholder: 'best' },
  { name: 'extract-audio', label: 'Extraire audio', type: 'checkbox' },
  { name: 'audio-format', label: 'Format audio', placeholder: 'mp3, m4a, wav...' },
  { name: 'output', label: 'Nom du fichier', placeholder: '%(title)s.%(ext)s' },
  { name: 'playlist-items', label: 'Items playlist', placeholder: '1,2,3' },
  { name: 'subtitles', label: 'Sous-titres', placeholder: 'fr,en' },
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
    setOptions({ ...options, [opt.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('http://localhost:4000/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, options }),
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
