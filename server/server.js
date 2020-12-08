const express = require('express')
const app = express()
const dotenv = require('dotenv')

dotenv.config()

const { DB_HOST: host, DB_PORT, DB_USER: user, DB_PASS: password, DB_NAME: DB } = process.env

const fetch = require("node-fetch")
const {
  Sequelize,
  DataTypes
} = require('sequelize');
const sequelize = new Sequelize(DB, user, password, {
  host: host,
  dialect: 'postgres'
})

app.get('/users/:username', (req, res) => {
  let colonnesDB = {}
  fetch("https://api.github.com/users/" + req.params.username)
    .then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server")
      }
      return res.json()
    })
    .then(response => {
      const data = Object.keys(response)
      data.forEach(val => {
        if (val === "id") {
          colonnesDB = {
            ...colonnesDB,
            [val]: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
            }
          }
        } else {
          colonnesDB = {
            ...colonnesDB,
            [val]: {
              type: Sequelize.STRING
            }
          }
        }
      });
      const person = sequelize.define("Users", colonnesDB);
      person.findOne({
        attributes: ['login'],
        where: { login: data[0] }
      })
        .then(function (userFound) {
          if (!userFound) {
            person.create(response)
              .then(function (newUser) {
                return res.status(201).json({
                  'login': newUser.login
                })
              })
              .catch(function (err) {
                return res.status(500).json({ 'error': 'Cannot add user' })
              })
          } else {
            return res.status(409).json({ 'error': 'User already exists' })
          }
        })
    })
})

app.get('/users', function (req, res) {
  res.send("Bonjour")
})

app.listen(3000, () => {
  console.log("Serveur listens on port 3000")
})