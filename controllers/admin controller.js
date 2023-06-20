
const {getFirestore}= require("firebase/firestore")
const db =  getFirestore()

const fs = require('fs');
const csv = require('fast-csv');
//I am attempting to start the back end for the administrator end of the project
// the admin will send in a csv file in the specified format to the node supervisorRouter
// then  in the server I will extract the data and clean it up then I will push it into a collection 
//named with the intended year 
exports.storeUsers=()=>{
        const reader = csv.createReader(fs.createReadStream('data.csv'));

        reader.on('data',(row) => {
        const data = {
            name: row.name,
            age: row.age
        };
    console.log(data)
       // db.ref('users').push(data);
        });

}