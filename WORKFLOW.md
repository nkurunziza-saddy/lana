# Lana Workflow

This repository uses [Changesets](https://github.com/changesets/changesets) for versioning and changelogs.

## Local Development

- `pnpm dev`: Start the website for development.
- `pnpm check`: Run linting and type checking across the workspace.
- `pnpm test`: Run tests across the workspace.

## Making Changes

1. Create your changes.
2. Run `pnpm changeset`.
3. Select the packages that have changed and the version bump type.
4. Commit the generated changeset file.

## Publishing

### 1. Versioning

When you are ready to release, run:

```bash
pnpm version
```

This will bump the versions in `package.json` files and update `CHANGELOG.md` files.

### 2. Releasing

To build all assets (including the shadcn registry) and publish to NPM, run:

```bash
pnpm release
```

## Registry Management

The shadcn registry is automatically managed by three scripts:

- `pnpm registry:sync`: Syncs source code from `packages/editor/src` to `registry/`.
- `pnpm registry:config`: Automatically updates `registry.json` files with all files found in the registry.
- `pnpm registry:generate`: Runs `shadcn build` to generate the public registry files in `apps/website/public/r`.

Run `pnpm registry:build` to run all three in sequence.
