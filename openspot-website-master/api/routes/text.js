const router = require("express").Router();

// Database options/connection
const MongoClient = require('mongodb').MongoClient;
const connstring = "mongodb+srv://root:root@cluster0.56jzb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Retrieve the center and bound coordinates for the parking lot
router.post("/text_notifications", async (req, res) => {
    const client = new MongoClient(connstring,{useUnifiedTopology: true});
    try
    {
        var lot_name = req.body.parking_lot;
        var number = req.body.phone_number;
        await client.connect();
        const db = client.db('Backend');
        const collection = db.collection('parking_lot');

        //Push to the phoneNumbers array
        await collection.updateOne({parkingLotName : lot_name}, {$addToSet : { phoneNumbers : number}})
    }
    finally {
        await client.close();
    }
});


router.post("/unsubscribe", async (req, res) => {
    const client = new MongoClient(connstring,{useUnifiedTopology: true});
    try
    {
        var lot_name = req.body.parking_lot;
        var number = req.body.phone_number;
        await client.connect();
        const db = client.db('Backend');
        const collection = db.collection('parking_lot');

        //Pull from the phoneNumbers array
        await collection.updateOne({parkingLotName : lot_name}, {$pull : { phoneNumbers : number}}, {multi: true})
    }
    finally {
        await client.close();
    }
});
module.exports = router;