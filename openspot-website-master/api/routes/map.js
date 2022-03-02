const router = require("express").Router();

// Database options/connection
const MongoClient = require('mongodb').MongoClient;
const connstring = "mongodb+srv://root:root@cluster0.56jzb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//const client = new MongoClient(connstring,{useUnifiedTopology: true});

// Grab spots for the parking lot requested
router.get("/spots/:lotName", async (req, res) => {
    const client = new MongoClient(connstring,{useUnifiedTopology: true});
    try
    {
        var parkingLotName = req.params.lotName;
        await client.connect();
        const db = client.db('Backend');   
        const collection = db.collection('spots');

        var spotFilter = {'parkingLotName': parkingLotName};

        // Query the db for all the spots from that parking lot
        const cursor = collection.find(spotFilter);

        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        var spots = [];
        await cursor.forEach(function(spot) { 
            spots.push(spot);
        });
        //console.log(spots);
        res.send(spots);
    }
    finally {
        await client.close();
    }

});

// Retrieve the center and bound coordinates for the parking lot
router.get("/parking_lot/:lotName", async (req, res) => {
    const client = new MongoClient(connstring,{useUnifiedTopology: true});
    try
    {
        var parkingLotName = req.params.lotName;
        await client.connect();
        const db = client.db('Backend');   
        const collection = db.collection('parking_lot');

        var spotFilter = {'parkingLotName': parkingLotName};

        // Query the db for all the spots from that parking lot
        const cursor = collection.find(spotFilter);

        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        var spots = [];
        await cursor.forEach(function(spot) { 
            spots.push(spot);
        });
        res.send(spots);

    }
    finally {
        await client.close();
    }
});

router.get("/parking_lots", async (req, res) => {
    const client = new MongoClient(connstring,{useUnifiedTopology: true});
    try
    {
        //var parkingLotName = req.params.lotName;
        await client.connect();
        const db = client.db('Backend');   
        const collection = db.collection('parking_lot');


        // Query the db for all the spots from that parking lot
        var cursor = collection.find({}).project({parkingLotName : 1, _id: 0});

        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        var spots = [];
        await cursor.forEach(function(spot) { 
            spots.push(spot);
        });
        res.send(spots);
    }
    finally {
        await client.close();
    }
});

module.exports = router;
