const PNG = require('pngjs').PNG
const recursive = require('recursive-readdir')
const path = require('path')
const fs = require('graceful-fs')

const fromdir = `${path.dirname(__dirname)}/maps.gsi.go.jp/xyz/dem_png`
const publicdir = `${path.dirname(__dirname)}/tiles`

fs.mkdirSync(publicdir, {recursive: true})

recursive(fromdir, (err, files) => {
  if (err) return console.error(err);

  files.forEach((file) => {
    const filename = `${publicdir}${file.replace(fromdir, '')}`

    const data = fs.readFileSync(file);
    const png = PNG.sync.read(data);

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
        const rgb = [0, 1, 2].map(j => {
                return png.data[i + j].toString()
              }).join()

        png.data[i] = boxr
        png.data[i + 1] = boxg
        png.data[i + 2] = boxb
      }
    }

    fs.mkdirSync(path.dirname(filename), {recursive: true})
    const buffer = PNG.sync.write(png)
    fs.writeFileSync(filename, buffer)
  });
});
