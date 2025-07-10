const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//  middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0yi4v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const movieCollection = client.db("moviearena4").collection("movie");
      const favoriteCollection = client.db("moviearena4").collection("favorites");

      app.get("/movie", async (req, res) => {
         const cursor = movieCollection.find();
         const result = await cursor.toArray();
         console.log(result);

         res.send(result);
      });

      app.post("/movie", async (req, res) => {
         const form = req.body;
         console.log(form);
         const result = await movieCollection.insertOne(form);
         res.send(result);
      });

      app.delete("/movie/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await movieCollection.deleteOne(query);
         res.send(result);
      });

      app.post("/favorites", async (req, res) => {
         const favorite = req.body;
         const result = await favoriteCollection.insertOne(favorite);

         res.send(result);
      });

      app.get("/favorites", async (req, res) => {
         const email = req.query.email;
         const favorites = await favoriteCollection.find({ userEmail: email }).toArray();
         res.send(favorites);
      });

      app.delete("/favorites/:id", async (req, res) => {
         try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await favoriteCollection.deleteOne(query);
            res.send(result);
            console.log(result);
         } catch (error) {
            console.log(error);
         }
      });
      app.get("/movies/:id", async (req, res) => {
         try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await movieCollection.findOne(query);
            res.send(result);
            console.log(result);
         } catch (error) {
            console.log(error);
         }
      });

      app.get("/update/:id", async (req, res) => {
         try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await movieCollection.findOne(query);
            res.send(result);
            console.log(result);
         } catch (error) {
            console.log(error);
         }
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      //   await client.close();
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("Movie server is Running in your own theater!!");
});

app.listen(port, () => {
   console.log(`Movie server is running on port: ${port} `);
});
