const PNG = require('pngjs').PNG

exports.transcode = (buffer) => {
  const png = PNG.sync.read(buffer);

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      let i = (png.width * y + x) * 4
      let d = png.data[i] * 2 ** 16 +
        png.data[i + 1] * 2 ** 8 +
        png.data[i + 2]
      let h = (d < 2 ** 23) ? d : d - 2 ** 24
      if (h == - (2 ** 23)) {
        h = 0
      } else {
        h *= 0.01
      }

      let box = Math.round(10 * (h + 10000)).toString(16)
      let boxr = parseInt(box.slice(-6, -4), 16)
      let boxg = parseInt(box.slice(-4, -2), 16)
      let boxb = parseInt(box.slice(-2), 16)

      png.data[i] = boxr
      png.data[i + 1] = boxg
      png.data[i + 2] = boxb
    }
  }

  return PNG.sync.write(png)
}
