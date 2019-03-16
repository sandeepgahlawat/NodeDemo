/*jshint esversion: 6 */
/* jshint -W033 */

import connectionPool from './connectionPool'


exports.storeUserData = (userData) => {

    console.log(`the structure is :   ${userData[0]}`);
    if (Array.isArray(userData)) {
        let sql = "INSERT INTO users_tbl (user_id, user_name) VALUES ? ON DUPLICATE KEY UPDATE user_id = VALUES(user_id),user_name = VALUES(user_name)";
        return connectionPool.query(
            sql,
            [userData]
        )
    }
};


exports.storeStepsData = (stepsData) => {
    console.log(`the structure 2 is :   ${stepsData}`);
    let sql = "INSERT INTO steps_data_tbl (user_id,date, steps,calories) VALUES ? ON DUPLICATE KEY UPDATE user_id = VALUES(user_id),date = VALUES(date),steps = VALUES(steps),calories = VALUES(calories)";
    return connectionPool.query(
        sql,
        [stepsData]
    )
};

exports.getUsersCompleteData = (user_id) => {
    console.log("fetching user's complete data")
    let sql = "SELECT a.user_id, a.user_name, b.steps, b.calories, b.date, b.created_at, b.updated_at FROM users_tbl AS a INNER JOIN steps_data_tbl AS b ON a.user_id = b.user_id WHERE a.user_id = " + user_id + ";";
    return connectionPool.query(sql)
}

