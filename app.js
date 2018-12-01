const express = require('express');
const bodyParser = require('body-parser');
const album = require('./server/routes/album.route');
var cors = require('cors')

const app = express();
let port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use('/api', album);
app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/albumsdb').then(()=> {
  console.log("mongo has started");
}).catch((err)=> {
  console.log("mongo error on start");
  process.exit(1);
});
let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

