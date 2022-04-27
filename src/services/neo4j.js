require('dotenv').config();
const neo4j = require('neo4j-driver')

const uri = process.env.AURA_URI;
const user = process.env.AURA_USER;
const password = process.env.AURA_PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

// (async ()=>{
//     try{
//         await driver.verifyConnectivity();
//         console.log("Driver created 🎉🎉🎉");
//     }catch(error){
//         console.log("Driver creation failed 😭😭😭")
//         console.error(error)
//         driver.close
//     }
// })()


module.exports = driver

