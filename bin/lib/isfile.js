const fs = require('fs')

exports.isFile = (file) => {
  try {
    fs.statSync(file);
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}
