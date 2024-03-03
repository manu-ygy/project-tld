import fs from 'fs'
import path from 'path'

var domainFolders = fs.readdirSync(path.join(path.resolve(), '../data/chunked/'))
domainFolders.forEach((dir) => {
    if (!fs.existsSync(path.join(path.resolve(), '../data/randomized/', `${dir}.txt`))) {
        fs.writeFileSync(path.join(path.resolve(), '../data/randomized', `${dir}.txt`), '', 'utf-8')
    }
})

console.log('Initiated.')