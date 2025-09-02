# yt-dlp-web-
# youtube-download

Interface web moderne pour yt-dlp

## Description
Ce projet propose une interface web (React + Node.js) pour faciliter le téléchargement de vidéos et d’audios via yt-dlp. Toutes les options principales de yt-dlp sont exposées pour ajuster les formats, la qualité, etc.

## Fonctionnalités
- Téléchargement de vidéos et audios depuis de nombreux sites
- Choix des options yt-dlp (qualité, format, audio, vidéo…)
- Affichage de la progression et de l’historique des téléchargements
- Interface utilisateur moderne (React, Tailwind CSS)

## Structure du projet
- `backend/` : API Express qui utilise yt-dlp
- `frontend/` : Interface React pour interagir avec l’API

## Installation
1. Clone le dépôt :
	```sh
	git clone https://github.com/Lawelsadio/youtube-download.git
	cd youtube-download
	```
2. Installe les dépendances :
	```sh
	cd backend && npm install
	cd ../frontend && npm install
	```
3. Lance le backend :
	```sh
	cd backend
	npm start
	```
4. Lance le frontend :
	```sh
	cd frontend
	npm start
	```

## Utilisation
- Accède à l’interface web via `http://localhost:3000` (ou le port configuré)
- Saisis l’URL de la vidéo/audio et configure les options
- Lance le téléchargement et suis la progression

## Remarques
- Les fichiers téléchargés ne sont pas versionnés (voir `.gitignore`)
- yt-dlp doit être installé sur le système

## Auteur
Sadio Mamane Lawel

## Licence
MIT
# youtube-download
