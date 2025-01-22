require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9gttp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("movieDB");
    const moviesCollection = database.collection("movies");

    app.get('/allmovies', async (req, res) => {
        const cursor = moviesCollection.find({});
        const movies = await cursor.toArray();
        res.send(movies);
    }
    )

    //get a movie by id
    app.get('/movies/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const movie =  await moviesCollection.findOne(query);
        res.send(movie);
    })

    //get 6 movies for feature by top ratings
    app.get('/getfeaturemovies', async (req, res) => {
        const cursor = moviesCollection.find({}).sort({rating:-1}).limit(6);
        const movies = await cursor.toArray();
        res.send(movies);
    }
    )


    app.post('/user/addmovies', async (req, res) => {
        const movie = req.body;
        // console.log('new movie',movie);
        const result = await moviesCollection.insertOne(movie);
        res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Movie Server is running');
});



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});