// server.js
const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
var firebase = require("firebase/app");
require("firebase/auth");

var db = null
var users = null
var bills = null
MongoClient.connect('mongodb+srv://omnia:greencomputing@cluster0.g1kbr.mongodb.net/omnia?retryWrites=true&w=majority', {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Connected to Database')
        db = client.db('omnia')
        users = db.collection('users')
        bills = db.collection('bills')
    })
    .catch(error => console.error(error))

    
app.listen(3000, function () {
    console.log('listening on 3000')
})

app.use(bodyParser.urlencoded({ extended: true }))

//CRUD Handlers
app.get('/', (req, res) => {
    //res.send('Hello World')
    res.sendFile(__dirname + '/index.html')
})

app.get('/reg', (req, res) => {
    //res.send('Hello World')
    res.sendFile(__dirname + '/register.html')
})

app.get('/test', (req, res) => {
    //res.send('Hello World')
    res.sendFile(__dirname + '/test.html')
})

app.post('/register', (req, res) => {
    let json = req.body
    email = json.email
    password = json.password

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            var token = null
            user.getIdToken(true).then(function(idToken){
                res.send({'token':idToken})
                token = idToken
            }).catch(function(error) {
                // Handle error
            });
            delete json['password']
            users.insertOne(json)
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            res.send(errorMessage)
        });
})

app.post('/signin', (req, res) => {
    let json = req.body
    email = json.email
    password = json.password
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            user.getIdToken(true).then(function(idToken){
                res.send({'token':idToken})
            }).catch(function(error) {
                // Handle error
            });

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            res.send(errorMessage)
        });
})

app.post('/user', (req, res) => {
    let json = req.body
    token = json.token
    email = json.email
    users.findOne({}, function(err, result) {
        if (err) throw err;
        res.send(result)
    });

})

var firebaseConfig = {
    apiKey: "AIzaSyBq4Z7zkRzESTz5snCeVzvXrwC6L818z_w",
    authDomain: "omnia-ba948.firebaseapp.com",
    projectId: "omnia-ba948",
    storageBucket: "omnia-ba948.appspot.com",
    messagingSenderId: "96172612663",
    appId: "1:96172612663:web:4b426ad33f298e6056b3b2",
    measurementId: "G-DR8BG1ZL2L"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);