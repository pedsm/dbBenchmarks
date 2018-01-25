const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'companies'
});
const data = require('../data.json')
 
connection.connect();
data.companies.forEach(company => {
    connection.query(`INSERT INTO companies (id, name, catchPhrase)
            VALUES (${company.id}, "${company.name}", "${company.catchPhrase}");`, (error, results, fields) => {
            if (error) {
                console.error(error);
                return
            }
            console.log(`Added copmany: ${company.name}`);
        });
});

data.people.forEach(person => {
    connection.query(`INSERT INTO people (id, firstName, lastName, phone, age, company)
            VALUES (
                ${person.id}, 
                "${person.firstName}", 
                "${person.lastName}",
                "${person.phone}",
                "${person.age}",
                ${person.company}
            );`, (error, results, fields) => {
            if (error) throw error;
            console.log(`Added person: ${person.firstName} ${person.lastName}`);
        });
});

let i = 0
data.people.forEach(person => {
    person.friends.forEach((friend) => {
        connection.query(`INSERT INTO friendships (friendshipId, aId, bId)
            VALUES (
                ${i++},
                ${person.id}, 
                ${friend}
            );`, (error, results, fields) => {
                if (error) throw error;
                console.log(`Added friendship: ${person.id}`);
            });
    })
});
 
connection.end();