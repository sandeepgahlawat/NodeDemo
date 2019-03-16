/*jshint esversion: 6 */
/* jshint -W033 */

import { } from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import readFileRoute from './routes/ReadFileRoute'
import cron from 'node-cron'
import {readCsvFromFileSysytem} from './controllers/ParseCsvFile'

const app = express();
app.use(cors())

console.log(__dirname)

const server = http.createServer(app)

cron.schedule("* * * * *",readCsvFromFileSysytem)


app.use('/', readFileRoute)


app.all('/', function (req, res) {
    //handle empty slash route all
    // res.render('home');
});

app.all('*', function (req, res) {
    // res.render('error');
});

function startServer() {
    server.listen(process.env.PORT, () => {
        console.log('Express server listening on ', process.env.PORT);
    })
}


setImmediate(startServer)



