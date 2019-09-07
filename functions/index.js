const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.aggregateRatings = functions.firestore
  .document("posts/{postId}/votes/{voteId}")
  .onWrite((change, context) => {
    // Get value of the newly added rating
    var voteVal = change.after.data().value;

    // Get a reference to the restaurant
    var postRef = db.collection("posts").doc(context.params.postId);

    // Update aggregations in a transaction
    return db.runTransaction(transaction => {
      return transaction.get(postRef).then(postDoc => {
        // Compute new score
        var newScore = postDoc.data().score + voteVal;

        // Update restaurant info
        return transaction.update(postRef, {
          score: newScore
        });
      });
    });
  });
