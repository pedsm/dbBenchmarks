const neo4j = require('neo4j-driver').v1
const mysql = require('mysql');

async function benchmark(neoQuery, sqlQuery) {
    // Start neoBench
    const neoStart = Date.now()
    let neoDelay = 0
    const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123"));
    const session = driver.session()
    return session
        .run(neoQuery)
        .then((data) => {
            neoDelay = Date.now() - neoStart
            // console.log(data.records.map(a => a._fields[0].properties))
            session.close()
            driver.close()
            // Start SQL Bench
            const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '123',
                database: 'companies'
            });
            let mysqlStart = Date.now()
            let sqlDelay = 0
            connection.connect()
            connection.query(sqlQuery, (error, results, fields) => {
                    sqlDelay = Date.now() - mysqlStart
                    if (error) {
                        console.error(error)
                        return
                    }
                    // console.log(results)
                    connection.end()
                    printMarkdown(neoQuery, sqlQuery, neoDelay, sqlDelay)
            });
        })
        .catch((e) =>{
            session.close()
            driver.close()
            console.error(e)
        })
    
}

function printMarkdown(neoQuery, sqlQuery, neoDelay, sqlDelay) {
    // console.log(`${(sqlDelay/neoDelay)*100}%`)
    console.log(`| DB        | Responose Delay           | Query  |
| ------------- |:-------------:| -----:|
| Neo4j      | ${neoDelay} | ${neoQuery}|
| Mysql      | ${sqlDelay} |  ${sqlQuery} |
`)
}

async function bench() {
    await benchmark(`MATCH (n:PERSON) RETURN n LIMIT 1000`, `SELECT * FROM people LIMIT 1000`)
    await benchmark(
        `MATCH (c:COMPANY {id: '10'})-[r]-(n:PERSON) RETURN c`,
        `SELECT * from people WHERE people.company = 10`)
    await benchmark(
        `MATCH (a:COMPANY {id: '10'})-[r]-(n:PERSON) RETURN n`,
        `SELECT * from people INNER JOIN companies ON people.company=companies.id WHERE companies.id = 10`)
    await benchmark(
        `MATCH (p:PERSON {id: '10'})-[r]-(friends:PERSON) RETURN friends`,
        `SELECT *
        FROM people as user, people as friend, friendships
        WHERE user.id = aId AND friend.id = bId AND user.id = 10`)
    await benchmark(
        `MATCH (p:PERSON)-[r]-(friends:PERSON) RETURN friends`,
        `SELECT *
        FROM people as user, people as friend, friendships
        WHERE user.id = aId AND friend.id = bId`)
    await benchmark(
        `MATCH (a:COMPANY {id: '10'})-[r1]-(x:PERSON)-[r2]-(y:PERSON)-[r3]-(b:COPMANY {id:52}) RETURN x,y`,
        `SELECT *
        FROM people as user, people as friend, friendships
        WHERE user.id = aId AND friend.id = bId AND user.company = 10 AND friend.company = 52`)
}
// for(let i = 0; i < 100; i++) {
    // bench()
// }
bench()