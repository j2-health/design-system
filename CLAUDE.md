# design-system

A shared React component library: presentational UI primitives, consumed as a
git submodule by other applications.

## This repository is PUBLIC

**Treat this section as a hard constraint, not a style preference.**

This repository is public, and its Storybook is published publicly at
<https://j2-health.github.io/design-system/>. This is **deliberate** — do not
"fix" it by making the repository private, and do not open work to do so.

Everything committed here is world-readable, permanently, including anything
later deleted: source, tests, stories, fixtures, comments, and commit messages.
Git history cannot be un-published, so a mistake here is not recoverable by
deleting the file in a later commit.

## Never commit here

- **Business logic or domain rules** of any kind
- **Customer, tenant, member, or provider data** — including "realistic" sample
  data, fixtures, and test snapshots
- **Anything derived from a customer contract or regulatory requirement**
- **Details of the private repositories that consume this one** — their names,
  API endpoints, request/response schemas, model or table names, internal URLs,
  or infrastructure identifiers
- **Secrets of any kind** — credentials, tokens, keys, connection strings

## What belongs here

Presentational, generic UI primitives: components that would make sense in _any_
React application and that carry no knowledge of the consuming application's
domain.

The test to apply: **a component may accept domain data as props, but it must
not know what that data means.** A `<Table>` that renders arbitrary rows belongs
here. A table that knows which of those rows counts as passing does not.

Naming is part of this. A component name that only makes sense to someone who
knows the business is a signal the component is in the wrong repository.

## If a change seems to need domain behavior

Build it in the consuming application and pass the result in as props.

If a change appears to _require_ domain knowledge inside a component, the
component boundary is in the wrong place. **Stop and ask** rather than embedding
the logic here.
