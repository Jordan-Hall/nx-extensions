---
id: application
title: Application
---

# @nxext/react:app

Generates a React application

This schematic also executes the [Init](init) schematic and [Nrwl NX App](https://nx.dev/l/r/react/overview)

## Usage

```
nx g @nxext/react:app my-lib
```

or

```
nx g @nxext/react:application my-lib
```

## Options

### classComponent

Alias(es): C

Default: `false`

Type: `boolean`

Use class components instead of functional component.

### directory

Alias(es): dir

Type: `string`

The directory of the new application.

### globalCss

Default: `false`

Type: `boolean`

Default is false. When true, the component is generated with _.css/_.scss instead of _.module.css/_.module.scss

### js

Default: `false`

Type: `boolean`

Generate JavaScript files rather than TypeScript files.

### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `tslint`

The tool to use for running lint checks.

### name

Type: `string`

The name of the application.

### pascalCaseFiles

Alias(es): P

Default: `false`

Type: `boolean`

Use pascal case component file name (e.g. App.tsx).

### routing

Default: `false`

Type: `boolean`

Generate application with routes.

### setParserOptionsProject

Default: `false`

Type: `boolean`

Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.

### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

### skipWorkspaceJson

Default: `false`

Type: `boolean`

Skip updating workspace.json with default options based on values provided to this app (e.g. babel, style).

### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside `workspace.json`

### strict

Default: `true`

Type: `boolean`

Creates an application with strict mode and strict type checking

### style

Alias(es): s

Default: `css`

Type: `string`

Possible values: `css`, `scss`, `styl`, `less`, `styled-components`, `@emotion/styled`, `styled-jsx`, `none`

The file extension to be used for style files.

### tags

Alias(es): t

Type: `string`

Add tags to the application (used for linting).

### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
