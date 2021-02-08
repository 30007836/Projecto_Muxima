module.exports.config = {
    passport: {
      secret: 'private-acess',
      expiresIn: 10000,
    },
    env: {
      port: 3000,
      mongoDBUri: 'mongodb://localhost/muximabom',
      mongoHostName: process.env.ENV === 'prod' ? 'mongodbAtlas' : 'localhost',
    },
  };
  module.exports.underscoreId = '_id'

 


