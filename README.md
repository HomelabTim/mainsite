# Personal Portfolio

[![Deploy Production](https://github.com/HomelabTim/Portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/HomelabTim/Portfolio/actions/workflows/pages.yml)
[![Minimum Hugo Version](https://img.shields.io/static/v1?label=min-HUGO-version&message=0.87.0&color=blue&logo=hugo)](https://github.com/gohugoio/hugo/releases/tag/v0.87.0)
[![Blowfish](https://img.shields.io/badge/Hugo--Themes-@Blowfish-blue)](https://themes.gohugo.io/themes/blowfish/)
![code-size](https://img.shields.io/github/languages/code-size/nunocoracao/blowfish)

For my personal portfolio site I coded my site using a theme called [Blowfish](https://themes.gohugo.io/themes/blowfish/). It is designed to be a powerful, lightweight theme for the static site generator called [Hugo](https://gohugo.io). It's built using Tailwind CSS with a clean and minimalist design that prioritizes to your content.

![blowfish logo](https://github.com/nunocoracao/blowfish/blob/main/logo.png?raw=true)

To see Blowfish at work and to get a better understanding of it [CLICK HERE](https://blowfish.page/). To give love and support to the creator of Blowfish or to check out his repo [CLICK HERE](https://github.com/nunocoracao/blowfish)


## Show love and support to HomelabTim
<a href="https://www.buymeacoffee.com/HomelabTim" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Features

- Fully responsive layout built with Tailwind CSS 3.0
- Multiple color schemes (or fully customize your own)
- Dark mode (forced on/off or auto-switching with user toggle)
- Highly customizable configuration
- Firebase integration to support dynamic data
- Views count & like mechanism
- Related articles
- Multiple homepage layouts
- Multiple authors
- Series of articles
- Zen mode for article reading
- Flexible with any content types, taxonomies and menus
- Header and footer menus
- Nested menus & sub-navigation menu
- Multilingual content support including support for RTL languages
- Ability to link to posts on third-party websites
- Support for several shortcodes like Gallery, Timeline, GitHub cards, and Carousels
- Buymeacoffee integration
- Client-side site search powered by Fuse.js
- Diagrams and visualizations using Mermaid
- Charts using Chart.js
- TypeIt integration
- Youtube embeds with performance improvements
- Mathematical notation using KaTeX
- SVG icons from FontAwesome 6
- Automatic image resizing using Hugo Pipes
- Heading anchors, Tables of Contents, Code copy, Buttons, Badges and more
- HTML and Emoji support in articles 🎉
- SEO friendly with links for sharing to social media
- Fathom Analytics and Google Analytics support
- RSS feeds, Favicons and comments support
- Advanced customization using simple Tailwind color definitions and styles
- Optimized for performance and accessibility with perfect Lighthouse scores
- Fully documented with regular updates

---

![blowfish screenshot](https://github.com/nunocoracao/blowfish/blob/main/images/screenshot.png?raw=true)
## Documentation

Blowfish has [extensive documentation](https://blowfish.page/docs/) that covers all aspects of the theme. Be sure to [read the docs](https://blowfish.page/docs/) to learn more about how to use the theme and its features.

---

## Installation

Blowfish supports several installation methods - as a git submodule, a Hugo Module, or as a completely manual install.

Detailed instructions for each method can be found in the [Installation](https://blowfish.page/docs/installation) docs. You should consult the documentation for the simplest setup experience. Below is a quick start guide using submodules if you are using git, or Hugo modules if you're already confident installing Hugo themes.

### Quick start using Blowfish Tools

> **Note:** Ensure you have **Node.js**, **Git**, **Go** and **Hugo** installed, and that you have created a new Hugo project before proceeding.

We just launched a new CLI tool to help you get started with Blowfish. It will create a new Hugo project, install the theme and set up the theme configuration files for you. It's still in beta so please [report any issues you find](https://github.com/nunocoracao/blowfish-tools).

Install the CLI tool globally using npm (or other package manager):
```shell
npm i -g blowfish-tools
```

Then run the command `blowfish-tools` to start an interactive run which will guide you through creation and configuration use-cases.
```shell
blowfish-tools
```

You can also run the command `blowfish-tools new` to create a new Hugo project and install the theme in one go. Check the CLI help for more information.
```shell
blowfish-tools new mynewsite
```

### Quick start using git submodules

> **Note:** Ensure you have **Git**, **Go**, and **Hugo** installed, and that you have created a new Hugo project before proceeding.

1. From your project directory, initialise git:

   ```shell
   git init
   ```

2. Configure Blowfish as a git submodule:

   ```shell
   git submodule add -b main https://github.com/nunocoracao/blowfish.git themes/blowfish
   ```

3. In the root folder of your website, delete the `config.toml` file that was generated by Hugo. Copy the `*.toml` config files from the theme into your `config/_default/` folder.

   You will find these theme config files in the Hugo cache directory, or [download a copy](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/nunocoracao/blowfish/tree/main/config/_default) from GitHub.

4. Follow the [Getting Started](https://blowfish.page/docs/getting-started/) instructions to configure your website.

### Quick start using Hugo

> **Note:** Ensure you have **Go** and **Hugo** installed, and that you have created a new Hugo project before proceeding.

1. From your project directory, initialise Hugo Modules:

   ```shell
   hugo mod init github.com/<username>/<repo-name>
   ```

2. Create `config/_default/module.toml` and add the following:

   ```toml
   [[imports]]
   path = "github.com/nunocoracao/blowfish/v2"
   ```

3. Start your server using `hugo server` and the theme will be downloaded automatically.

4. In the root folder of your website, delete the `config.toml` file that was generated by Hugo. Copy the `*.toml` config files from the theme into your `config/_default/` folder.

   > **Note:** Do not overwrite the `module.toml` file you created above!

   You will find these theme config files in the Hugo cache directory, or [download a copy](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/nunocoracao/blowfish/tree/main/config/_default) from GitHub.

5. Follow the [Getting Started](https://blowfish.page/docs/getting-started/) instructions to configure your website.

### Installing theme updates

As new releases are posted, you can update the theme using Hugo. Simply run `hugo mod get -u` from your project directory and the theme will automatically update to the latest release.

Detailed [update instructions](https://blowfish.page/docs/installation/#installing-updates) are available in the docs.

---