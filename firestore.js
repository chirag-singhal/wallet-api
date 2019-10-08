const admin = require('firebase-admin');

const serviceAccount = require('./ikc-deal-255305-e8200193b893.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin.firestore();
