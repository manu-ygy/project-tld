import fs from 'fs'
import path from 'path'
import axios from 'axios'

var domain = process.argv[process.argv.length - 1]

var inactive = []
var randomized = fs.readFileSync(path.join(path.resolve(), '../data/randomized/', `${domain}.txt`), 'utf-8').split('\n')
randomized.splice(randomized.length - 1, 1) // remove empty space
var chunkSize = fs.readdirSync(path.join(path.resolve(), '../data/chunked/', domain)).length

var maxLineToSearch
if (chunkSize > 1) {
    maxLineToSearch = (chunkSize - 1) * 10000
} else {
    maxLineToSearch = 1000
}

async function doRequest() {
    var randomChunkIndex = Math.round(Math.random() * (chunkSize - 1))
    var randomChunk = fs.readFileSync(path.join(path.resolve(), '../data/chunked/', domain, `${randomChunkIndex}.txt`), 'utf-8').split('\n')
    
    var randomDomain = randomChunk[Math.round(Math.random() * (randomChunk.length - 1))]
    if (!randomized.includes(randomDomain) && !inactive.includes(randomDomain)) {
        axios.head(`http://${randomDomain}`, {timeout: 10000}).then((response) => {
            console.log(JSON.stringify({status: 'success', domain: randomDomain, code: response.status, tld: domain}))
            
            randomized.push(randomDomain)
            fs.appendFileSync(path.join(path.resolve(), '../data/randomized/', `${domain}.txt`), randomDomain + '\n', 'utf-8')
        
            doRequest()
        }).catch((err) => {
            console.log(JSON.stringify({status: 'failed', domain: randomDomain, reason: err.code}))

            inactive.push(randomDomain)
        
            doRequest()
        })
    } else {
        doRequest()
    }
}

console.log(JSON.stringify({status: 'initiated', tld: domain, count: randomized.length}))
doRequest()