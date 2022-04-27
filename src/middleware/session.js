// const driver = require('../services/db-connection')

// function sessionProvider(req, res, next){
//     const session = driver.session()
//     try{
//         req.session = session
//         next()
//     }finally{
//         session.close()
//     }
// }

// module.exports = sessionProvider