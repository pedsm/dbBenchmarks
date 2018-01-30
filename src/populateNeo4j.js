const Bulk = require('neo4j-bulk')
const bulk = new Bulk()
const data = require('../data.json')
const rp = require('request-promise')
const fs = require('fs')
// const Promise = require('bluebird')
const chunkArray = require('chunk-array').chunks

const companies = data.companies.map(company => bulk.addNode(company))
const people = data.people.map(person => bulk.addNode({
    id: person.id,
    firstName: person.firstName,
    lastName: person.lastName,
    phone: person.phone,
    age: person.age
}))
companies.forEach(company => bulk.addLabel('COMPANY', company))
people.forEach(person => bulk.addLabel('PERSON', person))

data.people.forEach((person, i) => {
   bulk.addRelation(people[i], companies[person.company], 'WORKS_AT')
   person.friends.forEach(friend => bulk.addRelation(people[i], people[friend], 'FRIENDS_WITH'))
});

console.log(`Data in bulk`)

const batch = bulk.generateBatch()
console.log(`${batch.length} operations`)
const chunks = chunkArray(batch, 10000)
console.log(`Data chunked in ${chunks.length} pieces`)

// const stream = fs.createWriteStream('neo4j.json', { flag: 'a'})
// for(let i = 0; i < chunks.length; i++) {
//     console.log(`Writing packet ${i}`)
//     stream.write(JSON.stringify(chunks[i]))
// }
// console.log('stream closed')
let options = {
    method: 'POST',
    uri: 'http://localhost:7474/db/data/batch',
    headers: {
        "Authorization": `Basic ${require('btoa')('neo4j:123')}`,
    },
    body: Buffer.concat(chunks.map(a => Buffer.from(a)))
    }
console.log(Buffer.concat(chunks.map(a => Buffer.from(a))).byteLength)
rp(options).promise()
    .then(function (parsedBody) {
        console.log('Done')
    })
    .catch(function (err) {
        console.error(err.message)
    })

// async function send() { 
//     for (let i = 0; i < 1; i++) { 
//     let options = {
//         method: 'POST',
//         uri: 'http://localhost:7474/db/data/batch',
//         headers: {
//             "Authorization": `Basic ${require('btoa')('neo4j:123')}`,
//         },
//         body: chunks.reduce((a,b, i) => {
//             console.log(`part ${i}`)
//             return a.concat(Buffer.from(b))
//         }, new Buffer()),//requests[i],
//         json: true // Automatically stringifies the body to JSON
//     }
//     console.log(i)
//     try {
//         await rp(options).promise()
//             .then(function (parsedBody) {
//                 console.log('Done')
//             })
//             .catch(function (err) {
//                 console.error(err.message)
//             })
//     } catch (err) {
//         throw (err)
//     }
//     }
// }
// send()