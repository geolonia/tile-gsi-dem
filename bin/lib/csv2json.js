exports.csv2json = (csv) => {
  const lines = csv.split(/\n/)
  const json = {}
  for (let i = 0; i < lines.length; i++) {
    if (! lines[i]) {
      break;
    }
    const col = lines[i].trim().split(/,/)
    json[col[0]] = col
  }

  return json
}
