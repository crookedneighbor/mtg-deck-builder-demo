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

### Set up git hooks (optional)

There are 2 git hooks that are recomended for use, a pre-commit hook and a pre-push hook. To create them, first copy the samples in `.git/hooks`

```bash
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
cp .git/hooks/pre-push.sample .git/hooks/pre-push
```

Then, replace the contents of `.git/hooks/pre-commit` with:

```bash
#!/bin/sh
exec npm run build:precommit
```

And the contents of `.git/hooks/pre-push` with:

```bash
#!/bin/sh
exec npm run build:prepush
```

Now, before you commit, the linting code will run and automatically compile the js for production if there are no pending changes in `src`.

And before you push, it'll run the integration tests (be sure to have he app running).

## Tests

This project uses [cypress](https://www.cypress.io/) for integration testins. The following command will run the tests:

```bash
npm test
```

This command will also automatically run the lint command, if you'd like to just run the integration tests:

```bash
npm run test:integration
```
