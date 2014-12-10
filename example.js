var appendScript = require('append-script');
var fs = require('fs');

fs.createReadStream('index.html')
  .pipe(appendScript({
    needle: '<!-- endbuild -->',
    splicable: [
      '<script src="scripts/abcd.js"></script>'
    ]
  }))
  // .pipe(fs.createWriteStream('index.html'))
  .pipe(fs.createWriteStream('abc.html'))

