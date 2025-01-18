const pool = require("../connect");
const queries = require("./queries.json");

module.exports = async function main({name, params: args}) {
    const [rows] = await pool.promise().query(
        queries[name],
        [...args]
    );

    return rows;
}