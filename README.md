# Example Bot

Example Bot is a project that I created to make the process of creating discord bot easier for me.
To create a new Discord Bot, I simply clone this repository which includes Command and Listener handling, utility classes, and more.

### Dependencies:

- [yarn](https://www.npmjs.com/package/yarn) - My preferred package manager, used as an [npm](https://npmjs.com) alternative.
- [typescript](https://yarnpkg.com/package/typescript) - Needed to run TypeScript (since discord.js isn't supported by [deno](https://deno.land/)).
- [ts-node](https://yarnpkg.com/package/ts-node) - Helps me test the bot without needing to build it. Only used in testing, not in production.
- [discord.js](https://discord.js.org/#/) - Used for easily interacting with Discord's API using OOP.

### How to use:

- Clone the repository.
- Run `yarn install` or `npm install` to install the dependencies.
- Change the token in `config.json` with your bot token.
- Run `yarn dev` or `npm run dev` when testing, and `yarn start` or `npm run start` in production.
