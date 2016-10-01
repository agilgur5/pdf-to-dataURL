import PDFJS from 'pdfjs-dist'
import { readAsArrayBuffer } from 'promise-file-reader'

function getPDF (file) {
  return readAsArrayBuffer(file).then(PDFJS.getDocument)
}

function getPDFPage (pdf, num, viewportWidth) {
  return pdf.getPage(num)
    .then((page) => pageToDataURL(page, viewportWidth))
}

function pageToDataURL (page, viewportWidth) {
  // scale page to pageWidth / width
  let viewport = page.getViewport(viewportWidth / page.view[2])
  let canvasElem = document.createElement('canvas')
  canvasElem.width = viewport.width
  canvasElem.height = viewport.height
  let canvasContext = canvasElem.getContext('2d')
  return page.render({canvasContext, viewport}).then(() => {
    // pass index as each image is rendered async
    return {
      src: canvasElem.toDataURL('image/jpeg', 1.0),
      index: page.pageIndex,
      ...viewport
    }
  })
}

// convert uploaded PDF to dataURLs for each page
export function pdfToDataURLPromise (file, viewportWidth) {
  return getPDF.then((pdf) =>
    // fetch each page
    Promise.all(Array(null, {length: pdf.numPages})
      .map((_, index) =>  getPDFPage(pdf, index + 1, viewportWidth))
    )
  )
}

// convert uploaded PDF to dataURLs for each page and callback on each
export default function pdfToDataURL (file, viewportWidth, cb) {
  return getPDF.then((pdf) => {
    // fetch each page
    for (var num = 1; num <= pdf.numPages; num++) {
      getPDFPage(pdf, num, viewportWidth).then(cb)
    }
  })
}
