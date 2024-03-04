import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

var domainFolders = fs.readdirSync(path.join(path.resolve(), '../data/chunked/'))
domainFolders.forEach((dir) => {
    console.log(`unzip ${dir} -d ${dir}`)
})