const admin = require('firebase-admin');
const User = require('./models/users');
const serviceAccount = require('./ikc-deal-e803e-6ffce9b07334.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const firestore = async (contact, transaction, amount) => {
  const user = await User.findOne({'contact': contact});
  if(user){
    db.collection('users').doc(''+contact).update({
      transactions: admin.firestore.FieldValue.arrayUnion(
         transaction
      ),
      amount: amount
    })
  }
  else {
    db.collection('users').doc(''+contact).set({
      amount: amount
    })
  }
}

module.exports = firestore