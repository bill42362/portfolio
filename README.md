# portfolio
Portfolio of bill42362

# Roadmap
* Enable server side render (SSR) on both production and develop enviroment.
  - [x] `yarn start`, `yarn devstart`
  - [x] Enable optional enviroments on both stage. (`HTTPS`, `MORGAN`, `HELMET`)
  - [x] Enable **hot-reload** on develop enviroment.
* Enable Docker caching.
  - [x] Add Dockerfile for server side render image.
  - [x] Add Dockerfile stages for compile client side  render artifacts.
  - [x] Add different docker build stages to maximize cacheability.
* Enable using GitHub Action and Docker Hub as CI.
  - [x] Add GitHub workflow files to build docker images across stages.
  - [x] Enable push/pull stage images to Docker Hub for caching.
* Enable hosting sample sites for each branch/tag on GitHub Page.
  - [x] Deploy static client side render files to gh-page branch during build process.
  - [x] Enable deploy gh-page folders by branch. (ex: **feature/async_import** branch to `/feature-async-import` folder)
  - [ ] Enable deploy gh-page folders by tag. (ex: **v1.0.1** tag to `/v1-0-1` folder)
  - [x] Modify `<base>` tag to enable hosting branched on and files referencing.
* Enable PWA for each branch.
  - [ ] Add manifest generator in webpack.
  - [ ] Enable generate manifest per branch.
  - [ ] Enable generate service worker per branch.

# Experiment roadmap
* SSR + Code spliting + Intersection observer
* x-state
* WebGL
* Electron
