This is a template for angular 1.6. I'm not sure what I'm doing.

Change `package.json` application name, version and all shenanigans that refers to your project after cloning this repo.

It uses:

- [Grunt](https://gruntjs.com): for task automation. Mainly for building the application and watching code changes.
- [Tailwind](https://tailwindcss.com): for a better styling experience.

### Install

Run `npm i` on the terminal.

### Start server

Run `npm start`. It will start a server on [localhost:3000](http://localhost:3000).

### Build

**Development build**
Run `npm run build` to dev build and not watch

**Production build**
Run `npm run dist` to dev build and not watch

**Build and Watch**
Run `npm run dev` to build and watch for changes. It runs `npx grunt build` and then watches for changes.

_\*A new build is required when changing config files like `tailwind.config.js`, `Gruntfile.js`, `package.json` or whatnot._
