const {MongoClient} = require('mongodb');

let dbConnection;

module.exports = {
    //ATTEMPT TO CONNECT TO A DATABASE
    connectToDb: (cb) => {
        MongoClient.connect ('mongodb://localhost:7030/FEMAMutualFundSystem')
        //IF CONNECTION SUCCESSFUL
        .then((client) =>{
            dbConnection = client.db();
            cb(null);
        })
        //IF CONNECTION UNSUCCESSFUL
        .catch(err =>{
            console.error(err);
            cb(err);
        });
    },
    getDB: () => dbConnection

};