<!-- Thanks to shd101wy, it's possible to make h1 and h2 without the line under it; see https://github.com/shd101wyy/markdown-preview-enhanced/issues/185#issuecomment-1373553815 -->

<div id="user-content-toc" align="center">
  <div>
    <img src="./public/assets/images/png/banner.png">
  </div>

  <div>
    <ul>
    <summary style="list-style: none;">
      <h1>Discord Bio Links</h1>
    </summary>
    </ul>
  </div>
  <div>
    <div>
      <img src="https://img.shields.io/badge/License-MPL%202.0-d64f00" alt="License: MPL 2.0">
      <img src="https://img.shields.io/github/last-commit/xefyrdev/discord-bio-links/main" alt="Last commit on main">
      <img src="https://img.shields.io/github/contributors/xefyrdev/discord-bio-links" alt="Number of contributors">
      <img src="https://img.shields.io/github/languages/code-size/xefyrdev/discord-bio-links" alt="Code size">
      <img src="https://img.shields.io/github/issues/xefyrdev/discord-bio-links" alt="Number of issues">
    </div>
  </div>
</div>

<br>

## Table of contents

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [About](#about)
- [Installation](#installation)
- [Configuration](#configuration)
    + [Creating a Discord application](#creating-a-discord-application)
- [Usage](#usage)
- [Contributing](#contributing)
  * [Adding support for a new language](#adding-support-for-a-new-language)
- [License](#license)

<!-- TOC end -->

## About

A web application that won't limit your "about-me" section to 190 characters.

The application is live at [discord-bio-links.onrender.com](https://discord-bio-links.onrender.com/).

## Installation

> This is if you want to run the application locally. If you just want to use it, visit [discord-bio-links.onrender.com](https://discord-bio-links.onrender.com/).

Clone the repo either through HTTPS or SSH.

```shell
git clone https://github.com/xefyrdev/discord-bio-links.git && cd discord-bio-links
git clone git@github.com:xefydev/discord-bio-links.git && cd discord-bio-links
```

Then, install the dependencies:
```shell
npm install
```

## Configuration

> This is if you want to run the application locally. If you just want to use it, visit [discord-bio-links.onrender.com](https://discord-bio-links.onrender.com/).

Go to `code/config.ts` and make sure that line 8 is

```ts
const envName = `dev`;
```

Create a `.dev.env` file at the root of the project.
You'll need to define a few environnement variables:

```
SERVER_PORT=3000
NUMBER_OF_PROXIES=0
REDIRECT_URI=https://(your local ip):3000
CLIENT_ID=(your client's id)
CLIENT_SECRET=(your client's secret)
LOCAL_IP=(your local ip)
```

Replace all instances of `(your local ip)` by your actual local IP, which you can see by running `ipconfig /all` (Windows).

#### Creating a Discord application
Then, you'll need to create a Discord application through [Discord's developer portal](https://discord.com/developers/applications) :

- Log into [Discord's developer portal](https://discord.com/developers/applications).
- Click `New application`.
- Name the application whatever you want.
- Accept the [Discord developer Terms of Service](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service) and the [Discord developer policy](https://discord.com/developers/docs/policies-and-agreements/developer-policy) then click `Create`.
- Go to the `OAuth2 section`.
- Under `CLIENT ID`, click `Copy`; Then go to the `.dev.env` file you created and replace `(your client's id)` by what you just copied.
- Under `CLIENT SECRET`, click `Reset Secret`; then click `Copy` and go to the `.dev.env` file you created and replace `(your client's secret)` by what you just copied.
- Click `Add Redirect`. Write `https://(your local ip):3000`. Make sure to save the changes.

## Usage

> This is if you want to run the application locally. If you just want to use it, visit [discord-bio-links.onrender.com](https://discord-bio-links.onrender.com/).

Starting the app:
```shell
npm run start
```

By default, translations are in a format called Human JSON (HJSON) which allows line breaks in strings. To convert it into JSON that `i18next` (the library used to handle translation), run this command:
```shell
npm run translate
```

## Contributing

> This is if you want to run to contribute to the development of the application. If you just want to use it, visit [discord-bio-links.onrender.com](https://discord-bio-links.onrender.com/).

- Fork this repository by clicking [here](https://github.com/xefyrdev/discord-bio-links/fork).
- Install the project just like shown in [Installation](#installation) but clone your fork instead.
- Configure the project just like shown in [Configuration](#configuration).
- Run the project just like shown in [Usage](#usage).
- Make your changes, push them to your main branch then open a pull request.

### Adding support for a new language

- Go to `public/locales/hjson`. Create a new directory named after the language code you want to add translations for.
- Create HJSON files imitating the structure found in `public/locales/hjson/fr`.
- Translate the strings for each translation key. If you encounter something like `{{ username }}`, don't change it; it will be replaced by the actual variable by the application. Don't change the common `app name` key.
- Go to `code/languages.ts` and add your language code into the `langs object`. For example, for Spanish:

  ```diff
  const langs = {
    us: 1,
    fr: 1,
  + es: 1
   }
  ```

- Run `npm run translate && npm start` and ensure the translations display correctly.

## License

This project is licensed under the `MPL 2.0` license. See [LICENSE](LICENSE) for more information.