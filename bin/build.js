const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const zlib = require('zlib');
const PNG = require('pngjs').PNG

const { csv2json } = require('./lib/csv2json')
const { isFile } = require('./lib/isfile')

const publicdir = `${path.dirname(__dirname)}/tiles`
fs.mkdirSync(publicdir, {recursive: true})

const url = 'https://cyberjapandata.gsi.go.jp/xyz/dem_png'
const mokurokuURL = `${url}/mokuroku.csv.gz`

const log = path.join(path.dirname(path.dirname(__filename)), '.mokuroku.log')
let mokuroku = path.join(path.dirname(path.dirname(__filename)), 'mokuroku.csv')

if (! isFile(mokuroku)) {
  mokuroku = log
}

let currentData
if (isFile(mokuroku)) {
  currentData = csv2json(fs.readFileSync(mokuroku, 'utf-8'))
} else {
  currentData = {}
}

fetch(mokurokuURL)
  .then(res => res.buffer())
  .then(buffer => {
    zlib.unzip(buffer, async (err, buffer) => {
      const newData = csv2json(buffer.toString())
      for (const tile in newData) {
        if (! currentData[tile] || newData[tile][3] !== currentData[tile][3]) {
          try {
            const tileUrl = `${url.replace(/\/$/, '')}/${tile}`
            const res = await fetch(tileUrl)
            const buffer = await res.buffer();
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

            const filename = path.join(publicdir, tile)
            fs.mkdirSync(path.dirname(filename), {recursive: true})
            const pngbuffer = PNG.sync.write(png)
            fs.writeFileSync(filename, pngbuffer)

            fs.appendFileSync(log, newData[tile].join(',') + "\n")
            console.log(`${newData[tile][0]}: saved`)
          } catch(e) {
            console.log(`${newData[tile][0]}: error`)
            console.error(e)
          }
        } else {
          console.log(`${newData[tile][0]}: skip`)
        }
      }

      fs.writeFileSync(path.join(path.dirname(path.dirname(__filename)), 'mokuroku.csv'), buffer.toString())

      if (isFile(log)) {
        fs.unlinkSync(log)
      }

      console.log('Done!')
    });
  })
