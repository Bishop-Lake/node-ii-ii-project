const express = require('express');

const db = require('../data/db-config')

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Sanity check')
})

server.get("/cars", (req, res) => {
    db.select('*').from('cars')
        .then(cars => {
            res.status(200).json(cars)
        })
        .catch(err => {
            res.status(500).json({error: "there was an issue retriveing the cars from the database"})
        })   
})

server.get("/cars/:id", (req, res) => {
    db('cars').where({id:req.params.id})
        .then(car => {
            if (car.length == 0) {
                res.status(404).json({Error: "there is no car in the database with that id"})
            } else {
                res.status(200).json(car)
            }
        })
        .catch(err => {
            res.status(500).json({error: "there was an issue retriveing the car from the database"})
        })   
})

server.post("/cars", (req, res) => {
    const {vin, make, model, mileage, transmission, title} = req.body
    if (!vin || !make || !mileage || !model) {
        res.status(400).json({Missing_info:'The vin, make, model, and mileage are all required fields when submitting a vehicle'})
    } else {
        db('cars').insert(req.body)
            .then(id => {
                res.status(201).json(id)
            })
            .then(err => {
                res.status(500).json({Error : 'there was an issue createing the entry in the database'})
            })
            
            
    }
})

module.exports = server;