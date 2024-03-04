import archiver from 'archiver'
import fs from 'fs'
import path from 'path'

var domainFolders = fs.readdirSync(path.join(path.resolve(), '../data/chunked'))
domainFolders.forEach((dir) => {
    console.log(`deployed for ${dir}`)
    const output = fs.createWriteStream(path.join(path.resolve(), '../data/zipped/', `${dir}.zip`))
    var archive = archiver('zip')
    
    output.on('close', () => {
        console.log(`Archived ${archive.pointer()} bytes.`)
    })
    
    archive.on('error', (err) => {
        console.log(err)
    })
    
    archive.pipe(output)
    archive.directory(path.join(path.resolve(), '../data/chunked/', dir), false)
    archive.finalize()
})