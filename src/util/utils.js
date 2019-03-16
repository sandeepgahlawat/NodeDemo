/*jshint esversion: 6 */
/* jshint -W033 */


export function spliceTheData(array, predicate) {
    return new Promise((resolve, reject) => {
        if (array == null || array.length == 0 || predicate == null)
            reject(Error("array length is empty or predicate is null"))

        console.log(array[0])
        const data = {}
        data.userArray = []
        data.stepsArray = []
        const spliceIndex = predicate()
        let currentVal = []
        console.log(`spilce index is ${spliceIndex}`)
        let i
        for (i = 1; i < array.length; i++) {
            currentVal = array[i]

            // console.log(`spilce array is ${currentVal.slice(spliceIndex, currentVal.length)}`)
            data.userArray.push(currentVal.slice(0, spliceIndex))
            currentVal.splice(1, 1)
            // console.log(`spliced array is ${currentVal}`)
            data.stepsArray.push(currentVal)
        }
        resolve(data)
    })

}