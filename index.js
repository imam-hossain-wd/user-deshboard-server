const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express'); 
const cors = require('cors');
const app = express()
const port = 5000;
require('dotenv').config();

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijfbjuv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

try{
    const usersCollection = client.db('user-dashboard').collection('users')

    app.post('/users', async(req, res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user)
        res.send(result)
    })

    app.get('/users', async (req, res)=>{
        const query = {}
        const result = await usersCollection.find(query).toArray();
        res.send(result);
    })
    app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)}
        const result = await usersCollection.deleteOne(filter)
        res.send(result)
    })

    app.put('/users/upgrade/:id', async (req, res) => {
        const user = req.body;
        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                email: user.email,
                name:user.name,
                phone:user.phone,
                selary:user.selary,
                age:user.age,
                image:user.image
            }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    });

}
finally{

}

app.get('/', async(req , res)=>{
    res.send('server is running')
})

app.listen(port ,()=>{
    console.log(`server is running on port ${port}`);
})