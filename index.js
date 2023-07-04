const express = require('express');
const cors = require('cors');
const colors = require('colors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const app = express();

// middle wares
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => res.send('ginius car server is up and ready'));




// adding mongo

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.ix1iyof.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {
        await client.connect();
        console.log('mongo connected'.bold.cyan)
    } catch (error) {
        console.log(error.name.red, error.message.yellow.bold, error.stack.bold)
    }

};

run();

// database collections
const Services = client.db('GiniusCar').collection('services');
const Orders = client.db('GiniusCar').collection('orders');



// read services
app.get('/services', async (req, res) => {
    try {
        const cursor = Services.find({});
        const result = await cursor.toArray();
        res.send(result);
    } catch (error) {
        console.log(error.name.bold.red, error.message.italic.yellow);
        res.send({
            success: false,
            message: 'could not get the services'
        })
    }
});


// reading a specific service
app.get('/chekout/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await Services.findOne(query);
        res.send(result)
    } catch (error) {
        console.log(error.name.bold.bgRed, error.message.yellow);
        res.send({
            success: false,
            message: 'could not get the service'
        })
    }
});

// reading orders data by specific email
app.get('/orders', async (req, res) => {
    try {
        const query = {
            'customer.email': req.query.email
        };
        const cursor = Orders.find(query);
        const result = await cursor.toArray();
        res.send(result)
    } catch (error) {
        res.send({
            error: error.name,
            message: error.message
        })
    }
});

// creating the ordered service data

app.post('/orders', async (req, res) => {
    try {
        const order = req.body;
        const result = await Orders.insertOne(order);
        res.send({
            success: true,
            message: 'order place success'
        })
        console.log(result)
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: 'could not send the data'
        })
    }
});




// deleting the order by delete btn
app.delete('/orders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await Orders.deleteOne(query);
        res.send(result)
        console.log(result)
    } catch (error) {
        console.log(error.name.bgRed, error.message.yellow);
        res.send(error)
    }
})




app.listen(port, () => console.log(`server running on ${port}`.bold.bgMagenta))