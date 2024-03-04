import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

var domainFolders = fs.readdirSync(path.join(path.resolve(), '../data/chunked/'))
var index = 0

function unzip() {
    var child = exec(`unzip ${path.join(path.resolve(), '../data/chunked/', domainFolders[index])} -d ${path.join(path.resolve(), '../data/chunked/', domainFolders[index])}`)
    child.stdout.on('close', () => {
        unzip()
        index++

        console.log(`Unzipping ${domainFolders[index]}`)
    })
}

unzip()