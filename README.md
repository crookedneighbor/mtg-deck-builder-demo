MtG Deck Demo
=============

An open source deck builder site.

[Demo](https://crookedneighbor.github.io/mtg-deck-builder-demo/)

## Found a problem?

Report it [here](https://github.com/crookedneighbor/mtg-deck-builder-demo/issues)! If you're a developer, pull requests are welcome!

## Development

### Install Dependencies

Install [node](https://nodejs.org/en/download/) (currently using node v8).

Install `npm` dependencies

```bash
npm install
```

### Start App

The following command will start up the http server for the app and run command to automatically transpile the JS code for the browser.

```bash
npm run dev
```


### Lint your code

This project uses the [standard ruleset](https://www.npmjs.com/package/standard) for linting. If you've never used it before, the biggest surpize will be that semicolons are only used when absoutely necessary. You can check your code style by running the following command:

```bash
npm run lint
```

## Tests

This project uses [cypress](https://www.cypress.io/) for integration testins. The following command will run the tests:

```bash
npm test
```

This command will also automatically run the lint command, if you'd like to just run the integration tests:

```bash
npm run test:integration
```
