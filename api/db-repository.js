import mysql from "mysql";

const connection = mysql.createConnection({
    host: "mysqlstudenti.litv.sssvt.cz",
    user: "slivamatej",
    password: "123456",
    database: "4a2_slivamatej_db1"
});

connection.connect((err) => {
    if (err) {
        console.error("DB connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});

export function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}