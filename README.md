# pdf-to-dataURL

[![NPM](https://nodei.co/npm/pdf-to-dataURL.png)](https://npmjs.org/package/pdf-to-dataURL)

A tiny wrapper around [pdf.js](https://github.com/mozilla/pdf.js) to convert
PDFs to dataURLs.

## Installation

`npm i -S pdf-to-dataURL`

## Usage

pdfToDataURL is an async function (due to the async nature of pdf.js), that
accepts a Blob of the PDF (e.g. from an `<input type='file' />` element), the
width of the viewport the dataURL should fit in (for proper sizing), and a
callback that will be called after each page of the PDF is converted with a
page object.

The page object has four properties:
`width`: `number` the width of the page's dataURL
`height`: `number` the height of the page's dataURL
`src`: `dataURL` the dataURL of the page
`index`: `number` the index of the page -- as pdf.js is async, the callback may
  be called not in the correct page order. Use this property if the order of
  the pages matters to you to properly place into an array.
  Useful with rendering libraries like React, where you can easily control the
  ordering of elements in the DOM.

### Example

```
import pdfToDataURL from 'pdf-to-dataURL'
const viewportWidth = 800

let initialNumChildren = document.body.children.length

const cb = function (page) {
  let img = document.createElement('img')
  img.width = page.width
  img.height = page.height
  img.src = page.src // the dataURL is here

  document.body.appendChild(img)
}

pdfToDataURL(pdfBlob, viewportWidth, cb)
```
