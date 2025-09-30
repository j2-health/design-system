# Design System

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
