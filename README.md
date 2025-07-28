<p align="center">
  <p align="center">
   <img height="100" src="assets/logo.png" alt="Logo">
  </p>
	<h1 align="center"><b>Minemaker</b></h1>
	<p align="center">
		A UGC platform for Minecraft: Java Edition
    <br />
    <a href="https://minemaker.net"><strong>minemaker.net</strong></a>
  </p>
</p>

Minemaker is a server for Minecraft: Java Edition that functions as a platform for [user-generated content (UGC)](https://en.wikipedia.org/wiki/User-generated_content#Video_games). It features a website to browse games, a desktop app to create them, and a Minecraft server to play them.

## Monorepo structure:

### Apps:

- `api`: A ElysiaJS HTTP api
- `commander`: Orchestrator for game instances
- `studio`: Tauri desktop app
- `website`: Sveltekit website

### Libraries:

- `db`: Typescript library for db operations
- `ui`: Shared Svelte components

### Plugins:

- `core`: PaperMC plugin that runs on all game instances
- `lobby`: PaperMC plugin for server lobby
- `proxy`: Velocity plugin
