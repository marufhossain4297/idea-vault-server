const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
dotenv.config()
const port = process.env.PORT
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
const uri = process.env.MONGODB_URI

app.use(express.json())
app.use(cors());
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('server is runing')
})

app.listen(port, () => {
    console.log(`Runing in port ${port}`)
})

const JWKS = createRemoteJWKSet(
    new URL(`${process.env.URL}/api/auth/jwks`)
)

const verifyToken = async (req, res, next) => {
    const authHeader = req?.headers.authorization;
    const token = authHeader

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }

    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }

    try {
        const { payload } = await jwtVerify(token, JWKS)
        console.log(payload);
        next()
    }
    catch (error) {
        return res.status(401).send({ message: 'Forbidden access' })
    }


}

async function run() {
    try {
        // await client.connect();

        const db = client.db('ideavault')
        const ideasCollection = db.collection('ideas')
        const commentsCollection = db.collection('comments')


        app.post('/ideas', async (req, res) => {
            const ideaInfo = req.body
            const result = await ideasCollection.insertOne(ideaInfo)
            res.send(result)
        })

        app.get('/ideas', async (req, res) => {
            const result = await ideasCollection.find().toArray()
            res.send(result)
        })

        app.get('/ideas/featured', async (req, res) => {
            const result = await ideasCollection.find().limit(3).toArray()
            res.send(result)
        })

        app.get('/ideas/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await ideasCollection.findOne(query)
            res.send(result)
        })

        app.patch('/ideas/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            const result = await ideasCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            res.send(result);
        });


        app.get('/idea/:userId', async (req, res) => {
            const id = req.params.userId
            const result = await ideasCollection.find({ userId: id }).toArray()
            res.send(result)
        })

        app.delete('/idea/:userId', async (req, res) => {
            const id = req.params.userId
            const query = {
                _id: new ObjectId(id)
            };
            const result = await ideasCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/comment', async (req, res) => {
            const comment = req.body
            const result = await commentsCollection.insertOne(comment)
            res.send(result)
        })

        app.get('/comment', async (req, res) => {
            const result = await commentsCollection.find().toArray()
            res.send(result)
        })

        app.get('/comment/:ideaId', async (req, res) => {
            const id = req.params.ideaId;
            const result = await commentsCollection.find({ ideaId: id }).toArray();
            res.send(result);
        });


        app.get('/comments/:userId', async (req, res) => {
            const id = req.params.userId
            const result = await commentsCollection.find({ userId: id }).toArray()
            res.send(result);
        });

        app.delete('/comment/:ideaId', async (req, res) => {
            const id = req.params.ideaId
            const query = {
                _id: new ObjectId(id)
            };
            const result = await commentsCollection.deleteOne(query)
            res.send(result)
        })


        app.patch('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            const result = await commentsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            res.send(result);
        });

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);


