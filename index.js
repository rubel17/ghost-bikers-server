const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-leabwa6-shard-00-00.nzbu8kl.mongodb.net:27017,ac-leabwa6-shard-00-01.nzbu8kl.mongodb.net:27017,ac-leabwa6-shard-00-02.nzbu8kl.mongodb.net:27017/?ssl=true&replicaSet=atlas-8a48sm-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
     const userCollection = client.db('Rubel').collection('Ghost-Bikers');

        app.get('/Ghost-Bikers', async(req, res) =>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/Ghost-Bikers/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const ghost = await userCollection.findOne(query);
            res.send(ghost);
        })

    // app.post('/Ghost-Bikers', async(req, res) => {
    //     const user = req.body;
    //     const result = await userCollection.insertOne(user);
    //     res.send(result);
    //     console.log(result)
    // })

    // app.put('/Ghost-Bikers/:id', async(req, res) =>{
    //     const id = req.params.id;
    //     const filter = {_id: ObjectId(id)};
    //     const user = req.body;
    //     const option = {upsert: true};
    //     const updatedUser = {
    //         $set:{
    //             name:user.name,
    //             email:user.email
    //         }
    //     };
    //     const result = await userCollection.updateOne(filter, updatedUser, option);
    //     res.send(result);
    //     console.log(updatedUser);
    // })

    // app.delete('/Ghost-Bikers/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = {_id: ObjectId(id)}
    //     const result = await userCollection.deleteOne(query);
    //     res.send(result);
    //     console.log(id)
    // })

    } finally {
      
    }
  }
  run().catch(err =>console.log(err));


app.get('/', (req, res) =>{
    res.send('Ghost Is Coming Soon....');
});
app.get('/Ghost-Bikers/add', (req, res) =>{
    res.send('I am Ghost-Bikers add data');
});

app.listen(port, () =>{
    console.log(`I Am Ghost ${port}`);
})

