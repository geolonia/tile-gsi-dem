const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const zlib = require('zlib');

const { csv2json } = require('./lib/csv2json')
const { isFile } = require('./lib/isfile')
const { transcode } = require('./lib/transcode')

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

            const pngbuffer = transcode(buffer)

            const filename = path.join(publicdir, tile)
            fs.mkdirSync(path.dirname(filename), {recursive: true})
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
