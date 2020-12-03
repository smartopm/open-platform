/* eslint-disable */
// Return back the orientaion byte
function extractOrientation(readerResult) {
  // Ugly, but the only way at this point
  const bytes =
    readerResult.split(',')[0].indexOf('base64') >= 0
      ? atob(readerResult.split(',')[1])
      : unescape(readerResult.split(',')[1])
  const max = 1024 // Don't bother reading the entire thing
  const ia = new Uint8Array(max)
  for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i)
  var view = new DataView(ia.buffer)
  if (view.getUint16(0, false) != 0xffd8) {
    return -2
  }
  var length = view.byteLength,
    offset = 2
  while (offset < length) {
    if (view.getUint16(offset + 2, false) <= 8) return -1
    var marker = view.getUint16(offset, false)
    offset += 2
    if (marker == 0xffe1) {
      if (view.getUint32((offset += 2), false) != 0x45786966) {
        return -1
      }

      var little = view.getUint16((offset += 6), false) == 0x4949
      offset += view.getUint32(offset + 4, little)
      var tags = view.getUint16(offset, little)
      offset += 2
      for (var i = 0; i < tags; i++) {
        if (view.getUint16(offset + i * 12, little) == 0x0112) {
          return view.getUint16(offset + i * 12 + 8, little)
        }
      }
    } else if ((marker & 0xff00) != 0xff00) {
      break
    } else {
      offset += view.getUint16(offset, false)
    }
  }
  return -1
}

function resizeImage(image, maxSize, srcOrientation) {
  let width = image.width
  let height = image.height
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (width > height) {
    if (width > maxSize) {
      height *= maxSize / width
      width = maxSize
    }
  } else {
    if (height > maxSize) {
      width *= maxSize / height
      height = maxSize
    }
  }
  // set proper canvas dimensions before transform & export
  if (4 < srcOrientation && srcOrientation < 9) {
    canvas.width = height
    canvas.height = width
  } else {
    canvas.width = width
    canvas.height = height
  }

  // transform context before drawing image
  switch (srcOrientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0)
      break
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height)
      break
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height)
      break
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0)
      break
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0)
      break
    case 7:
      ctx.transform(0, -1, -1, 0, height, width)
      break
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width)
      break
    default:
      break
  }

  // draw image
  ctx.drawImage(image, 0, 0, width, height)
  const dataUrl = canvas.toDataURL('image/jpeg')
  return dataURItoBlob(dataUrl)
}

const dataURItoBlob = function(dataURI) {
  const bytes =
    dataURI.split(',')[0].indexOf('base64') >= 0
      ? atob(dataURI.split(',')[1])
      : unescape(dataURI.split(',')[1])
  const mime = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  const max = bytes.length
  const ia = new Uint8Array(max)
  for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i)
  return new Blob([ia], { type: mime })
}

export default function({ file, maxSize }) {
  const reader = new FileReader()
  const image = new Image()
  return new Promise(function(ok, no) {
    if (!file.type.match(/image.*/)) {
      no(new Error('Not an image'))
      return
    }
    reader.onload = function(readerEvent) {
      const result = readerEvent.target.result
      const srcOrientation = extractOrientation(result)
      image.onload = function() {
        return ok(resizeImage(image, maxSize, srcOrientation))
      }
      image.src = result
    }
    reader.readAsDataURL(file)
  })
}

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

export const getCroppedImg = async (imageSrc, crop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  /* setting canvas width & height allows us to 
  resize from the original image resolution */
  canvas.width = 250
  canvas.height = 250

  ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
  )

  return new Promise((resolve) => {
      canvas.toBlob((blob) => {
          resolve(blob)
      }, 'image/jpeg')
  })
}
