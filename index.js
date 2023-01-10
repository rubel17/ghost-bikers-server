const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-leabwa6-shard-00-00.nzbu8kl.mongodb.net:27017,ac-leabwa6-shard-00-01.nzbu8kl.mongodb.net:27017,ac-leabwa6-shard-00-02.nzbu8kl.mongodb.net:27017/?ssl=true&replicaSet=atlas-8a48sm-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//jwt token function.

function verifyJwt(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'Unauthorized access1'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
           return res.status(403).send({message: 'Unauthorized access2'})
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
     const userCollection = client.db('Rubel').collection('Ghost-Bikers');
     const userCollectiont = client.db('Rubel').collection('Product');
     const reviewCollection = client.db('Rubel').collection('reviewData');

     //jwt token
     app.post('/jwt', async(req, res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET ,{
            expiresIn: '2h'
        });
        res.send({token});
    })
        
        app.get('/GhostBikers', async(req, res) =>{
            const query = {};
            const cursor = userCollection.find(query).sort({time: -1});
             //new input .sort({time: -1})
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/Product', async(req, res) =>{
            const query = {};
            const cursors = userCollectiont.find(query);
            const user = await cursors.toArray();
            res.send(user);
        })

           //GhostBikers api post.
           app.post('/GhostBikers',verifyJwt, async(req, res)=>{
            req.body.time = new Date();
            const service = req.body;
            const result = await userCollection.insertOne(service);
            res.send(result);
            console.log(result);
        })

        app.get('/GhostBikersLimit', async(req, res) =>{
            const query = {};
            const cursor = userCollection.find(query).sort({time: -1});
            //new input=.sort({time: -1})
            const users = await cursor.limit(3).toArray();
            res.send(users);
        })

        app.get('/GhostBikers/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const ghost = await userCollection.findOne(query);
            res.send(ghost);
        })
        app.get('/reviewDatas', async(req, res) =>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

          //Review api get all EmailData.
          app.get('/reviewData', verifyJwt, async(req, res)=>{
            const decoded = req.decoded;
            console.log(decoded);
            if(decoded.email !== req.query.email){
                return res.status(403).send({message: 'Unauthorized access3'})
            }
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query).sort({time: -1});
            const reviews = await cursor.toArray();
            res.send(reviews);
          })

          //.sort( { price: -1 } )

          //Review api get Id Data.
          app.get('/reviewData/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const ghost = await reviewCollection.findOne(query);
            res.send(ghost);
        })


        //Review api post.
        app.post('/reviewData',verifyJwt, async(req, res)=>{
            req.body.time = new Date();
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })


            //Review api Update.
            app.patch('/reviewData/:id',verifyJwt, async(req, res) =>{
                const id = req.params.id;
                const status = req.body.status;
                const email = req.body.email;
                const serviceName = req.body.serviceName;
                const query = {_id: ObjectId(id)};
                const updatedUser = {
                    $set:{
                        status: status,
                        email: email,
                        serviceName: serviceName
                    }
                };
                const result = await reviewCollection.updateOne(query, updatedUser);
                res.send(result);
    })

        //Review api delete.
        app.delete('/reviewData/:id',verifyJwt, async(req, res) => {
                const id = req.params.id;
                const query = {_id: ObjectId(id)}
                const result = await reviewCollection.deleteOne(query);
                res.send(result);
                
            })

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

