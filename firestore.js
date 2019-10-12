const admin = require('firebase-admin');

const serviceAccount = require('./ikc-deal-e803e-6ffce9b07334.json');

const firestore = async (contact, transaction, amount) => {

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();
  await db.collection('users').doc(''+contact).update({
    transactions: admin.firestore.FieldValue.arrayUnion({
       transaction
    }),
    amount: amount
  })
}

module.exports = firestore