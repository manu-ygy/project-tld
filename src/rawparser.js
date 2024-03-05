import fs from 'fs'
import path from 'path'

class rawParser {
    constructor() {
        this.domainFolders = fs.readdirSync(path.join(path.resolve(), '../data/domains/data'))
    }

    extract() {
        this.domainFolders.forEach((folder) => {
            fs.readdir(path.join(path.resolve(), '../data/domains/data', folder), (err, files) => {
                
            })
        })
    }

    merge() {

    }

    chunk() {

    }
    
    zip() {

    }

    sync() {

    }
}

domainFolders.forEach(async (folder) => {
    fs.readdir(path.join(path.resolve(), '../data/domains/data', folder), (err, files) => {
        var txt = files.filter((file) => {
            return file.replace('.txt.xz').includes('.txt')
        })

        if (txt.length == 0) {
            console.log(`${folder} haven't extracted yet. Extracting ...`)

            files.forEach((file) => {
                exec(`unxz ${path.join(path.resolve(), '../data/domains/data', folder, file)}`, (err, stdout, stderr) => {
                    console.log(stdout, stderr)
                })
            })
        } else {
            var filename

            txt.forEach((file) => {
                filename = file.replace('domain2multi-', '').replace('.txt', '').replace(/[0-9]/g, '')

                var text = fs.readFileSync(path.join(path.resolve(), '../data/domains/data', folder, file), 'utf-8')
                fs.appendFileSync(path.join(path.resolve(), '../data/cleaned', `${filename}.txt`), text, 'utf-8')
            })
        }
    })
})