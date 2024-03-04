import fs from 'fs'
import { exec } from 'child_process'

var domainFolders = fs.readdirSync(path.join(path.resolve(), '../data/chunked/'))
var index = 0

function unzip() {
    var child = exec(`unzip ${domainFolders[index]} -d ${domainFolders[index]}`)
    child.stdout.on('close', () => {
        unzip()
        index++

        console.log(`Unzipping ${domainFolder[index]}`)
    })
}

unzip()