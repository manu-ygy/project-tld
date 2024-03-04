import fs from 'fs'
import path from 'path'
import koa from 'koa'
import {Eta} from 'eta'
import EventEmitter from 'events'
import WebSocket, { WebSocketServer } from 'ws'
import { exec } from 'child_process'
import chalk from 'chalk'

const event = new EventEmitter()
var progress = {}

var index = 0

const app = new koa()
const eta = new Eta({views: path.join(path.resolve(), '../site')})
app.use((ctx, next) => {
    ctx.body = eta.render('randomizer.html')
})
app.listen(3000, () => {
    console.log('Server live')

    const wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', function connection(ws) {
        function broadcast(data, isBinary) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data, {binary: false})
                } 
            })      
        }

        ws.on('message', (data, isBinary) => {
            data = JSON.parse(data)

            if (data.action == 'getcurrentstat') {
                broadcast(JSON.stringify({action: 'getcurrentstat', data: progress}))
            } 
        })

        event.on('exist', (domain) => {
            progress[domain] += 1
            broadcast(JSON.stringify({action: 'update', tld: domain}), false)
        })
    })

    var domainFolders = fs.readdirSync(path.join(path.resolve(), '../data/chunked/'))
    
    domainFolders.forEach((dir) => {
        progress[dir] = 0
        var child = exec(`node randomizer-worker.js ${dir}`)
        child.stdout.on('data', (data) => {
            var data = JSON.parse(data.split('\n')[0])

            if (data.status == 'success') {
                event.emit('exist', data.tld)
            }

            if (data.status == 'initiated') {
                progress[data.tld] = data.count
                console.log(chalk.green(`Success spawning ${dir}`))
            }
        })

        child.stderr.on('data', (data) => {
            console.log(chalk.red('Failed to start, have you run the initiator?'))
            process.exit()
        })
    })
})