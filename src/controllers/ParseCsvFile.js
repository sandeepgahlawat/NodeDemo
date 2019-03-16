/*jshint esversion: 6 */
/* jshint -W033 */

import csv from 'fast-csv'
import fs from 'fs'
import Promise from 'bluebird'
import { storeUserData, storeStepsData, getUsersCompleteData } from '../db/userDb'
import path from 'path'
// import assetsPath from '../assets/Users-Steps-1.csv'
import { spliceTheData } from '../util/utils'



exports.readCsv = (req) => {
    console.log('starting to read file')
    return new Promise((resolve, reject) => {
        const fileRows = []
        try {
            csv.fromPath(req.file.path).on("data", (data) => {
                fileRows.push(data)
            }).on("end", () => {
                fs.unlinkSync(req.file.path)
                resolve(fileRows)
            })
        } catch (exception) {
            reject(exception)
        }
    });
}

const syncSingleCsvFileFromAssetsWithDb = (fileNumber) => {
    return new Promise((resolve, reject) => {
        try {
            const fileLocation = path.resolve(`../FirstNodeApp/src/assets/Users-Steps-${fileNumber}.csv`)
            console.log(fileLocation)
            resolve(fileLocation)
        } catch (exc) {
            reject(exc)
        }
    }).then((result) => {
        return new Promise((resolve, reject) => {
            const finalArray = []
            try {
                csv.fromPath(result)
                    .on("data", (data) => {
                        finalArray.push(data)
                        // console.log(data);
                    })
                    .on("end", () => {
                        console.log("done");
                        resolve(finalArray)
                    });
            } catch (ex) {
                reject(ex)
            }
        })
    }).then((result) => {
        return spliceTheData(result, () => {
            return result[0].indexOf('date')
        })
    }).then((result) => {
        return putUserData(result.userArray).then((userDataRes) => {
            return putStepsData(result.stepsArray)
        })
    }).then((result) => {
        console.log(result)
        console.log(`Users-Steps-${fileNumber}.csv synced succesfully`)
    })
}

exports.readCsvFromFileSysytem = () => {

    // new Promise((resolve, reject) => {
    //     const promiseArray = []
    //     fs.readdir('../FirstNodeApp/src/assets/', (err, files) => {
    //         if (typeof err !== undefined || err == null)
    //             reject(err)
    //         for (let i = 1; i <= 2; i++) {
    //             promiseArray.push(syncSingleCsvFileFromAssetsWithDb(i))
    //         }
    //         resolve(promiseArray)
    //     })
    // }).then((result) => {
    //     console.log('All files synced correctly')
    // }).catch((err) => {
    //     console.error(err)
    //     // res.error(err)
    // })
    promiseSerial(funcs)
        .then(console.log.bind(console))
        .catch(console.error.bind(console))


}

const promiseSerial = funcs =>
    funcs.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]))

// some url's to resolve
const urls = ['1', '2', '3', '4']

// convert each url to a function that returns a promise
const funcs = urls.map(url => () => syncSingleCsvFileFromAssetsWithDb(url))


const putUserData = (userData) => {
    return storeUserData(userData)
}
const putStepsData = (stepsData) => {
    return storeStepsData(stepsData)
}

exports.putUserData = putUserData

exports.putStepsData = putStepsData

exports.getUserData = (user_id) => {
    return getUsersCompleteData(user_id)
        .then((result) => {
            return new Promise((resolve, reject) => {
                if (result == null || result[0].length == 0)
                    reject('unable to find any data')
                resolve(result[0])
            })
        }).then((result) => {
            return new Promise((resolve, reject) => {
                const userData = {}
                let currentRow = null
                userData.stats = []
                try {
                    for (let i = 0; i < result.length; i++) {
                        currentRow = result[i]
                        if (i == 0) {
                            userData.userId = currentRow.user_id
                            userData.userName = currentRow.user_name
                            userData.createdAt = currentRow.created_at
                            userData.updatedAt = currentRow.updated_at
                        }
                        const stats = {}
                        stats.steps = currentRow.steps
                        stats.calories = currentRow.calories
                        stats.date = currentRow.date
                        userData.stats.push(stats)
                    }
                    resolve(userData)
                } catch (ex) {
                    reject(ex)
                }
            })
        })
}

