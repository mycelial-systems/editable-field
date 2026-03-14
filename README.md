# package name here
![tests](https://github.com/mycelial-systems/editable-field/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/editable-field?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@mycelial-systems/editable-field?cache-control=no-cache)](https://packagephobia.com/result?p=@mycelial-systems/editable-field)
[![GZip size](https://flat.badgen.net/bundlephobia/minzip/@substrate-system/editable-field)](https://bundlephobia.com/package/@substrate-system/editable-field)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


`<package description goes here>`

[See a live demo](https://mycelial-systems.github.io/editable-field/)

<details><summary><h2>Contents</h2></summary>
<!-- toc -->
</details>

## Install

Installation instructions

```sh
npm i -S @substrate-system/editable-field
```

## Example

```ts
```

## API

This exposes ESM and common JS via
[package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import '@substrate-system/editable-field'
```

### Common JS
```js
require('@substrate-system/editable-field')
```

### Attributes

`<all attributes here>`

### Events

`<all events here>`


## CSS

### Import CSS

```js
import '@substrate-system/editable-field/css'
```

Or minified:
```js
import '@substrate-system/editable-field/min/css'
```

### Customize CSS via some variables

```css
editable-field {
    --example: pink;
}
```

## Use
This calls the global function `customElements.define`. Just import, then use
the tag in your HTML.

### JS
```js
import '@substrate-system/editable-field'
```

### HTML
```html
<div>
    <editable-field></editable-field>
</div>
```

### pre-built

This package exposes minified JS and CSS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### copy
```sh
cp ./node_modules/@substrate-system/editable-field/dist/index.min.js ./public/editable-field.min.js
cp ./node_modules/@substrate-system/editable-field/dist/style.min.css ./public/editable-field.css
```

#### HTML
```html
<head>
    <link rel="stylesheet" href="./editable-field.css">
</head>
<body>
    <!-- ... -->
    <script type="module" src="./editable-field.min.js"></script>
</body>
```
