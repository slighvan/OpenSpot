const router = require("express").Router();

// Database options/connection
const MongoClient = require('mongodb').MongoClient;
const connstring = "mongodb+srv://root:root@cluster0.56jzb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Retrieve the center and bound coordinates for the parking lot
router.post("/contact", async (req, res) => {
    const client = new MongoClient(connstring,{useUnifiedTopology: true});
        var name = req.body.name;
        var email = req.body.email;
        var phone_number = req.body.phone_number
        var message = req.body.message
        var myobj = { name: name, email: email, number: phone_number, message: message };
        await client.connect();
        const db = client.db('Backend');

        db.collection('contact').insertOne(myobj, function (findErr, result) {
            if (findErr) throw findErr;
            client.close();
          });
});
module.exports = router;