import PDFJS from 'pdfjs-dist'

// convert uploaded PDF to dataURLs for each page and callback on each
export default function pdfToDataURL (file, viewportWidth, cb) {
  let reader = new FileReader()
  reader.onload = (ev) => {
    PDFJS.getDocument(ev.target.result).then((pdf) => {
      // fetch each page
      for (var num = 1; num <= pdf.numPages; num++) {
        pdf.getPage(num).then((page) => pageToDataURL(page, viewportWidth, cb))
      }
    })
  }
  reader.readAsArrayBuffer(file)
}

function pageToDataURL (page, viewportWidth, cb) {
  // scale page to pageWidth / width
  let viewport = page.getViewport(viewportWidth / page.view[2])
  let canvasElem = document.createElement('canvas')
  canvasElem.width = viewport.width
  canvasElem.height = viewport.height
  let canvasContext = canvasElem.getContext('2d')
  page.render({canvasContext, viewport}).then(() =>
    // pass index as each image is rendered async
    cb({
      src: canvasElem.toDataURL('image/jpeg', 1.0),
      index: page.pageIndex,
      ...viewport
    })
  )
}
