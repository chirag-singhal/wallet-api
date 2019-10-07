const admin = require('firebase-admin');

const serviceAccount = require('./ikc-deal-64088-8d60df02a979.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin.firestore();
