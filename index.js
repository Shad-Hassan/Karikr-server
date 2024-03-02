const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bj7a8hd.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // database Collection 


        // product database
        const productCollection = client.db('karikrDB').collection('products');
        // service database
        const serviceCollection = client.db('karikrDB').collection('service');
        // user database
        const userCollection = client.db('karikrDB').collection('user');
        // order database
        const orderCollection = client.db('karikrDB').collection('orders');
        
        
        //  Crud Operations

        // 1) Get data through app.get
        // get products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
          })
        // get services
        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
          })
        // get users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
          })
        // get orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find();
            const result = await cursor.toArray();
            res.send(result);
          })

        
        
        // 2) Get Specific Data
          // get a specific product object
        app.get('/products/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }
          const result = await productCollection.findOne(query)
          res.send(result);
        })
        // get a specific service object
        app.get('/service/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }
          const result = await serviceCollection.findOne(query)
          res.send(result);
        })
        // get a specific order object
        app.get('/orders/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }
          const result = await orderCollection.findOne(query)
          res.send(result);
        })

        





        // 3) Post data through app.post
        // post products
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
          })
        // post service
        app.post('/service', async (req, res) => {
            const newService = req.body;
            console.log(newService);
            const result = await serviceCollection.insertOne(newService);
            res.send(result)
          })
        // post users
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result)
          })
        // post orders
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            console.log(newOrder);
            const result = await orderCollection.insertOne(newOrder);
            res.send(result)
          })


          // Delete Operations
          // Delete a object from the order collection
          app.delete('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await orderCollection.deleteOne(query);
            res.send(result)
          })

          // Patch Operations
          // patch delivery status
          app.patch(('/orders/:id'),async(req,res)=>{
            const id = req.params.id;
            // Extract what properties you are patching
            const {delivered, pending} = req.body;
            const query = {_id: new ObjectId(id)}
            const patchOrder = {
              $set:{delivered, pending}
            };

            const result = await orderCollection.updateOne(query,patchOrder);
            res.send(result)
            
          });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Karikr Server is Running')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})