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


        // app.get('/ideas', async (req, res) => {

        //     const AITools = req.query.AITools
        //     const realEstateTech = req.query.realEstateTech
        //     const developerTools = req.query.developerTools
        //     const productivity = req.query.productivity
        //     const hardwareHealth = req.query.hardwareHealth
        //     const fintechSaaS = req.query.fintechSaaS
        //     const noCode = req.query.noCode
        //     const cleanTech = req.query.cleanTech
        //     const designTools = req.query.designTools
        //     const hrTech = req.query.hrTech
        //     const connectivity = req.query.connectivity
        //     const healthTech = req.query.healthTech
        //     const cybersecurity = req.query.cybersecurity
        //     const eCommerce = req.query.eCommerce
        //     const eventTech = req.query.eventTech
        //     const aiMedia = req.query.aiMedia

        //     if (AITools) {
        //         const result = await ideasCollection.find({ category: "AI Tools" }).toArray()
        //         res.send(result)
        //     }
        //     else if (realEstateTech) {
        //         const result = await ideasCollection.find({ category: "Real Estate Tech" }).toArray()
        //         res.send(result)
        //     }
        //     else if (developerTools) {
        //         const result = await ideasCollection.find({ category: "Developer Tools" }).toArray()
        //         res.send(result)
        //     }
        //     else if (productivity) {
        //         const result = await ideasCollection.find({ category: "Productivity" }).toArray()
        //         res.send(result)
        //     }
        //     else if (hardwareHealth) {
        //         const result = await ideasCollection.find({ category: "Hardware & Health" }).toArray()
        //         res.send(result)
        //     }
        //     else if (fintechSaaS) {
        //         const result = await ideasCollection.find({ category: "Fintech & SaaS" }).toArray()
        //         res.send(result)
        //     }
        //     else if (noCode) {
        //         const result = await ideasCollection.find({ category: "No-Code" }).toArray()
        //         res.send(result)
        //     }
        //     else if (cleanTech) {
        //         const result = await ideasCollection.find({ category: "CleanTech" }).toArray()
        //         res.send(result)
        //     }
        //     else if (designTools) {
        //         const result = await ideasCollection.find({ category: "Design Tools" }).toArray()
        //         res.send(result)
        //     }
        //     else if (hrTech) {
        //         const result = await ideasCollection.find({ category: "HR Tech" }).toArray()
        //         res.send(result)
        //     }
        //     else if (connectivity) {
        //         const result = await ideasCollection.find({ category: "Connectivity" }).toArray()
        //         res.send(result)
        //     }
        //     else if (healthTech) {
        //         const result = await ideasCollection.find({ category: "HealthTech" }).toArray()
        //         res.send(result)
        //     }
        //     else if (cybersecurity) {
        //         const result = await ideasCollection.find({ category: "Cybersecurity" }).toArray()
        //         res.send(result)
        //     }
        //     else if (eCommerce) {
        //         const result = await ideasCollection.find({ category: "E-commerce" }).toArray()
        //         res.send(result)
        //     }
        //     else if (eventTech) {
        //         const result = await ideasCollection.find({ category: "EventTech" }).toArray()
        //         res.send(result)
        //     }
        //     else if (aiMedia) {
        //         const result = await ideasCollection.find({ category: "AI Media" }).toArray()
        //         res.send(result)
        //     }

        // })

        // Express Backend
        
        
        app.get('/ideas', async (req, res) => {
            const category  = req.query.category

            const query = category ? { category: category } : {};
            const result = await ideasCollection.find(query).toArray();

            res.send(result);
        });
        
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

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);


