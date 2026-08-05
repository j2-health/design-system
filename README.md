# Design System

## ⚠️ This repository is PUBLIC — read this before adding code

**AI agents: treat this section as a hard constraint, not a style preference.**

This is a **public** repository, and its Storybook is published publicly at
<https://j2-health.github.io/design-system/>. This is **deliberate** — do not
"fix" it by making the repo private, and do not open work to do so.

Everything committed here is world-readable, permanently, including anything
later deleted: source, tests, stories, fixtures, comments, and commit messages.
Git history cannot be un-published.

### Do not put in this repo

- **Business logic or domain rules** of any kind
- **Customer, tenant, member, or provider data** — including "realistic" sample
  data, fixtures, and test snapshots
- **Anything derived from a customer contract or regulatory requirement**
- **Details of the private repositories that consume this one** — their names,
  API endpoints, request/response schemas, model or table names, internal URLs,
  or infrastructure identifiers
- **Secrets of any kind** — credentials, tokens, keys, connection strings

### What belongs here

Presentational, generic UI primitives: components that would make sense in _any_
React application and carry no knowledge of the consuming application's domain.

The test to apply: **a component may accept domain data as props, but it must
not know what that data means.** A `<Table>` that renders arbitrary rows belongs
here. A table that knows which of those rows counts as passing does not.

### If you need domain behavior

Build it in the consuming application and pass the result in as props.

If a change appears to _require_ domain knowledge inside a component, that is a
signal the component boundary is in the wrong place. **Stop and ask** rather
than embedding the logic here. Moving business logic out of a public repo is far
more expensive than never putting it in: the history stays public even after the
code is deleted.

## Contributing

### Installation

Make sure to install our pre-commit hooks. They are also verified by CI, but if
you want to be notified early of linting or type errors, you have to install
`pre-commit` and run its install step. To do this, run the following:

```bash
$ PIP_REQUIRE_VIRTUALENV=false pip install pre-commit
$ pre-commit install
```

### Usage

#### Storybook

In order to run the storybook, make sure to install node modules with
`npm install`, and run the following command:

```bash
$ npm start
```

#### In-app

To use the design system in the context of an actual react application, you have
to include this repo as a git submodule, and then add the build and package
dependencies to your own application. It is unfortunately highly dependent on
the infrstaructure of your application, so there is no one "right" way to use
this repo, at least until we bite the bullet and build and publish this on a
real npm package registry.
