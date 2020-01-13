// implement your API here
const express = require('express')

const db = require('./data/db')

const server = express()

server.use(express.json())

server.get('/api/users', (req, res) =>
  db
    .find()
    .then(userList => res.status(200).json(userList))
    .catch(e =>
      res
        .status(500)
        .json({ errorMessage: 'The users information could not be retrieved.' })
    )
)

server.get('/api/users/:id', (req, res) =>
  db
    .findById(req.params.id)
    .then(user =>
      user
        ? res.status(200).json(user)
        : res.status(404).json({
            errorMessage: 'The user with the specified ID does not exist.',
          })
    )
    .catch(e =>
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved.' })
    )
)

server.post('/api/users', (req, res) => {
  req.body.name && req.body.bio
    ? db
        .insert(req.body)
        .then(user =>
          db.findById(user.id).then(user => res.status(200).json(user))
        )
        .catch(e =>
          res.status(500).json({
            errorMessage: 'The user information could not be retrieved.',
          })
        )
    : res.status(400).json({
        errorMessage: 'Please provide name and bio for the user.',
      })
})

server.delete('/api/users/:id', (req, res) =>
  db
    .remove(req.params.id)
    .then(user =>
      user
        ? res.status(200).json({ message: 'User deleted successfully' })
        : res.status(404).json({
            errorMessage: 'The user with the specified ID does not exist.',
          })
    )
    .catch(e =>
      res.status(500).json({ errorMessage: 'The user could not be removed.' })
    )
)

server.put('/api/users/:id', (req, res) =>
  req.body.name && req.body.bio
    ? db
        .update(req.params.id, req.body)
        .then(updateRes =>
          updateRes
            ? db
                .findById(req.params.id)
                .then(user => res.status(200).json(user))
            : res.status(404).json({
                errorMessage: 'The user with the specified ID does not exist.',
              })
        )
        .catch(e =>
          res
            .status(500)
            .json({ errorMessage: 'The user could not be updated.' })
        )
    : res.status(400).json({
        errorMessage: 'Please provide name and bio for the user.',
      })
)

const port = 5000

server.listen(port, () => console.log(`Listening on port ${port}`))
