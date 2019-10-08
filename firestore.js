const admin = require('firebase-admin');

const serviceAccount = require('./ikc-deal-e803e-6ffce9b07334.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const firestore = async (contact, transaction, amount) => {
  await db.collection('users').doc(''+contact).set({
    transactions: admin.firestore.FieldValue.arrayUnion({
       transaction
    }),
    amount: amount
})
}

module.exports = firestore