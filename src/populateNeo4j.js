const Bulk = require('neo4j-bulk')
const bulk = new Bulk()
const data = require('../data.json')
const rp = require('request-promise')

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

// console.log(bulk.generateBatch())

var options = {
    method: 'POST',
    uri: 'http://localhost:7474/db/data/batch',
    headers: {
        "Authorization": `Basic ${require('btoa')('neo4j:123')}`,
    },
    body: bulk.generateBatch(),
    json: true // Automatically stringifies the body to JSON
};

rp(options)
    .then(function (parsedBody) {
        console.log('Done')
    })
    .catch(function (err) {
        console.error(err.message)
    });
