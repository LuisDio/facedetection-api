const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');

const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      port : 5432,
      user : 'luisdo',
      password : '',
      database : 'smart-brain'
    }
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}


app.get('/', (req, res) => {
    res.send(database);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(404).json('Error logging in')
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));
    
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if (user.length > 0) {
            res.json(user[0])
        } else {
            res.status(400).json("Not Found")
        }
    })
    .catch(err => res.status(400).json("Error getting user"));

    // if (!found) {
    //     res.status(404).json('Not found')
    // }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
    
})

app.listen(3000, () => {
    console.log('listening on port 3000')
});

/*
* / --> response with this is working
* /signin -->  POST request = success or failled
* /register --> POST request = user
* /profile/:userId --> GET = user
* /image --> PUT = user
*/