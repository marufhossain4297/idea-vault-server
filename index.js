const express = require('express')
const app = express()
const cors = require('cors')
const port = 8000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://ideavault:WSJtlEMlrufpxAN1@cluster0.bjgy0lu.mongodb.net/?appName=Cluster0";

app.use(express.json())
app.use(cors())

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

async function run() {
    try {
        await client.connect();

        const db = client.db('ideavault')
        const ideasCollection = db.collection('ideas')
        const commentsCollection = db.collection('comments')

        app.post('/ideas', async (req, res) => {
            const ideaInfo = req.body
            const result = await ideasCollection.insertOne(ideaInfo)
            res.send(result)
        })

        app.get('/ideas/featured', async (req, res) => {
            const result = await ideasCollection.find().limit(3).toArray()
            res.send(result)
        })

        app.get('/ideas', async (req, res) => {
            const result = await ideasCollection.find().toArray()
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
            const id = req.params.ideaId
            const result = await commentsCollection.find({ ideaId: id }).toArray()
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);


