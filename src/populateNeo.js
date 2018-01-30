const data = require('../data.json')
const neo4j = require('neo4j-driver').v1
const chunk = require('chunk-array').chunks

async function main() {
    const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123"));
    for (let company of data.companies) {
        if(company.id % 5000 === 0)
            console.log(`company: ${company.id}`)
        const session = driver.session()
        await session.run(`CREATE (p:COMPANY{
            id: {id},
            name: {name},
            catchPhrase: {catchPhrase}
        })`, company)
            .then(() => { session.close })
            .catch((e) => { console.error(e); session.close })
    }
    for (let person of data.people) {
        if(person.id % 5000 === 0)
            console.log(`person: ${person.id}`)
        const session = driver.session()
        await session.run(`MATCH (c:COMPANY {id: {company}})
        CREATE (p:PERSON{
            id: {id},
            firstName: {firstName},
            lastName: {lastName},
            phone: {phone},
            age: {age}
        })-[r:WORKS_AT]->(c)`, person)
            .then(() => { session.close })
            .catch((e) => { console.error(e); session.close })
    }
    let x = 0
    for (let person of data.people) {
        for(let friend of person.friends){
            if(x % 5000 === 0)
                console.log(`friendship: ${x}`)
            x++
            const session = driver.session()
            await session.run(`MATCH (a), (b)
            WHERE a.id = {id} AND b.id = ${friend}
            CREATE (a)-[r:FRIENDS_WITH]->(b)`, person)
                .then(() => { session.close })
                .catch((e) => { console.error(e); session.close })
        }
    }
    driver.close()

}
main()