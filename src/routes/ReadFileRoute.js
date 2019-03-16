/*jshint esversion: 6 */
/* jshint -W033 */


import { } from 'dotenv/config'
import { readCsv, putUserData, putStepsData, getUserData } from '../controllers/ParseCsvFile'
import express from 'express'
import multer from 'multer'
const upload = multer({ dest: 'tmp/csv/' });
import { spliceTheData } from '../util/utils'



const Router = express.Router;
const router = new Router();

router.post('/upload-csv', upload.single('file'), (req, res) => {

    readCsv(req)
        .then((result) => {
            console.log(result);
            return spliceTheData(result, () => {
                return result[0].indexOf('date')
            })
        })
        .then((result) => {
            return putUserData(result.userArray).then((userDataRes) => {
                return putStepsData(result.stepsArray)
            })
        })
        .then((result) => {
            console.log(result)
            res.send("File stored succesfully")

        })
        .catch((err) => {
            console.error(err)
            // res.error(err)
        })
});

router.get('/users/:userId', (req, res) => {
    getUserData(req.params.userId).then((result) => {
        console.log(result)
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router;





