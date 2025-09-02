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
];

function App() {
  const [url, setUrl] = useState('');
  const [options, setOptions] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloads, setDownloads] = useState([]);

  const handleChange = (e, opt) => {
    const value = opt.type === 'checkbox' ? e.target.checked : e.target.value;
    let newOptions = { ...options, [opt.name]: value };
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
    const { 'video-quality': _videoQuality, subtitles, ...filteredOptions } = options;
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
      if (data.success) {
        setResult(data.result);
        setDownloads(prev => [...prev, { url, options: filteredOptions, date: new Date().toLocaleString(), outputDir: data.outputDir }]);
      }
      else setError(data.error || 'Erreur inconnue');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="shadcn-ui" style={{ maxWidth: 700, margin: 'auto', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Téléchargeur yt-dlp Web</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="URL de la vidéo ou playlist"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          required
        />
        <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-4">
          {/* Première colonne */}
          <div className="space-y-6">
            <div>
              <label className="font-medium block mb-1">Format :</label>
              <select value={options['format'] || ''} onChange={e => handleChange(e, ytOptionsList[0])} className="w-full px-2 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" required>
                {formatOptions.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium block mb-1">Qualité audio :</label>
              <select value={options['audio-quality'] || ''} onChange={e => handleChange(e, ytOptionsList[2])} className="w-full px-2 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
                {audioQualityOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium block mb-1">Format audio :</label>
              <select value={options['audio-format'] || ''} onChange={e => handleChange(e, ytOptionsList[4])} className="w-full px-2 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
                {audioFormatOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium block mb-1">Items playlist :</label>
              <input type="text" placeholder="1,2,3" value={options['playlist-items'] || ''} onChange={e => handleChange(e, ytOptionsList[6])} className="w-full px-2 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
            </div>
            <div>
              <label className="font-medium block mb-1">Télécharger miniature :</label>
              <input type="checkbox" checked={!!options['write-thumbnail']} onChange={e => handleChange(e, ytOptionsList[8])} className="ml-2" />
            </div>
          </div>
          {/* Deuxième colonne */}
          <div className="space-y-6">
            <div>
              <label className="font-medium block mb-1">Qualité vidéo :</label>
              <select value={options['video-quality'] || ''} onChange={e => handleChange(e, ytOptionsList[1])} className="w-full px-2 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
                {videoQualityOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium block mb-1">Extraire audio :</label>
              <input type="checkbox" checked={!!options['extract-audio']} onChange={e => handleChange(e, ytOptionsList[3])} className="ml-2" />
            </div>
            <div>
              <label className="font-medium block mb-1">Nom du fichier :</label>
              <input type="text" value={url.includes('playlist') ? '%(playlist)s/%(title)s.%(ext)s' : '%(title)s.%(ext)s'} readOnly className="w-full px-2 py-2 bg-gray-100 border rounded" />
            </div>
            <div>
              <label className="font-medium block mb-1">Sous-titres :</label>
              <select value={options['subtitles'] || ''} onChange={e => handleChange(e, ytOptionsList[7])} className="w-full px-2 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
                {subtitleOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium block mb-1">Intégrer sous-titres :</label>
              <input type="checkbox" checked={!!options['embed-subs']} onChange={e => handleChange(e, ytOptionsList[9])} className="ml-2" />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-44 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Téléchargement...
            </span>
          ) : 'Télécharger'}
        </button>
      </form>
      {loading && <div className="flex items-center justify-center mb-4"><svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {result && (
        <details className="mb-4">
          <summary className="font-semibold mb-2 cursor-pointer text-gray-500">Résultat (logs yt-dlp)</summary>
          <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </details>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">URL</th>
              <th className="py-2 px-4 border-b">Options</th>
              <th className="py-2 px-4 border-b">Dossier</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{d.date}</td>
                <td className="py-2 px-4 border-b break-all">{d.url}</td>
                <td className="py-2 px-4 border-b"><pre className="text-xs">{JSON.stringify(d.options, null, 2)}</pre></td>
                <td className="py-2 px-4 border-b break-all">{d.outputDir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
