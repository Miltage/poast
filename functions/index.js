const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

/*exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});*/

exports.calcScore = functions.firestore
  .document("posts/{postId}/votes/{voteId}")
  .onWrite((change, context) => {
    const oldVoteVal = change.before.exists ? change.before.data().value : 0;
    // Get value of the newly added rating
    const voteVal = change.after.data().value;

    // Get a reference to the restaurant
    let postRef = db.collection("posts").doc(context.params.postId);

    // Update aggregations in a transaction
    return db.runTransaction(transaction => {
      return transaction.get(postRef).then(postDoc => {
        var oldScore = postDoc.data().score;

        if (!oldScore) oldScore = 0;

        // Compute new score
        var newScore = oldScore - oldVoteVal + voteVal;

        // Update restaurant info
        return transaction.update(postRef, {
          score: newScore
        });
      });
    });
  });
