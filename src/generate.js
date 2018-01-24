const faker = require('faker')
const fs = require('fs')
let personId = 0
let companyId = 0

/** Person interface
 * firstname
 * lastname
 * phone
 * age
 * company: one id
 * friends: many to many 
 */

function createPerson(companiesMax, pplMax) {
    return {
        id: personId++,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: faker.phone.phoneNumberFormat(),
        age: (faker.random.number() % 40) + 18,
        company: (faker.random.number() % companiesMax) + 1,
        friends: (() => {
           const maxSize = (faker.random.number() % 90) + 10
           const ids = new Set()
           for(let i = 0; i < maxSize; i++) {
               ids.add(faker.random.number() % pplMax)
           }
           return [...ids]
        })()
    }
}

function createCompany() {
    return {
        id: companyId++,
        name: faker.company.companyName(),
        catchPhrase: faker.company.catchPhrase(),
    }
}

function generateEverything() {
    const maxPpl = 1000
    const maxCompanies = 100
    const returnable = {
        people: [],
        companies: []
    }
    for(let i = 0; i < maxPpl; i++) {
        returnable.people.push(createPerson(maxPpl, maxCompanies))
    }
    for(let i = 0; i < maxCompanies; i++) {
        returnable.companies.push(createCompany())
    }
    return returnable
}

fs.writeFile('data.json', JSON.stringify(generateEverything()), (err) => {
    console.log('File written')
})