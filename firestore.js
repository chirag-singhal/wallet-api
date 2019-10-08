const admin = require('firebase-admin');

const serviceAccount = require('./ikc-deal-255305-76807df6f2cb.json');

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