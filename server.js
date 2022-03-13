const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// serve files from the public directory
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// connect to the db and start the express server
let db;
// Replace the URL below with the URL for your database
const url = `mongodb://localhost:27017?useUnifiedTopology=true`;

MongoClient.connect(url, (err, database) => {
  if(err) {
    throw(err);
  }
  db = database.db("users");
  // start the express web server listening on 8080
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});

// serve the homepage
app.get('/signup', (req, res) => {
  if ('message' in req.query) {
    console.log({message:req.query['message']})
    res.render('index', {message:req.query['message'], error:""});
  }
  else if ("error" in req.query){
    res.render('index', {message:"", error:req.query['error']});
  } 
  else {
    res.render('index', {message:"", error:""});
  } 
});

app.get('/login', (req, res) => {
  if ('message' in req.query) {
    // console.log({message:req.query['message']})
    res.render('signinpage', {message:req.query['message'], error:""});
  }
  else if ("error" in req.query){
    res.render('signinpage', {message:"", error:req.query['error']});
  } 
  else {
    res.render('signinpage', {message:"", error:""});
  } 
});

app.get('/delete', (req, res) => {
    res.render('deletePg', {message:req.query['message'], 
    password:req.query['password'], userName:req.query['userName']});
});


//add signup event
app.post('/signup', (req, res) => {
  let userName = req.body.name;
  if (userName.length==0) {
    res.redirect(303, `/signup?error=User Name must not be empty`);
    res.end();
  }
  else {
    let password = req.body.password;
    // console.log(userName, password, "server");
    db.collection('users').find({'userName':userName}).toArray().then((arr)=>{
      // console.log(arr, userName);
      if (arr.length==0) {
        db.collection('users').insertOne({'userName':userName, "password":password});
        res.redirect(303, `/signup?message=Successfully registered for user ${userName}`);
        res.end();
      }
      else {
        res.redirect(303, `/signup?error=User Name ${userName} already exists, try another one`);
        res.end();
      }
    })
  }
});

app.post('/signin', (req, res) => {
  let userName = req.body.name;
  if (userName.length==0) {
    res.redirect(303, `/login?error=User Name must not be empty`);
    res.end();
  }
  else {
    let password = req.body.password;
    // console.log(userName, password, "server");
    db.collection('users').find({'userName':userName}).toArray().then((arr)=>{
      // console.log(arr, userName);
      if (arr.length==0) {
        res.redirect(303, `/login?error=User Name ${userName} does not exist. Try register?`);
        res.end();
      }
      else if (arr[0]['password']!=password){
        res.redirect(303, `/login?error=Password incorrect!`);
        res.end();
      }
      else {
        res.redirect(303, `/delete?message=Successfully log 
        in as user ${userName}!&password=${password}&userName=${userName}`);
        res.end();
      }
    })
  }
});

app.post('/delete', async (req, res) => {
  let userName = req.body.name;
  // console.log(userName, "delete")
  await db.collection('users').deleteOne({"userName":userName})
  res.redirect(303, `/signup?message=Successfully delete user ${userName}!`);
  res.end();
});