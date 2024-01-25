/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Mustafa Toygar Baykal Student ID: 112398227 Date: January 24, 2024
*  Cyclic Link: 
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();
const companiesDB = require("./modules/companiesDB.js")
const db = new companiesDB();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("API Listening");
});


app.post('/api/companies', async (req, res) => {
    try {
      const data = req.body;
      const newCompany = await db.addNewCompany(data);
      res.status(201).json(newCompany); 
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' }); 
    }
  });
  
  
  app.get('/api/companies', async (req, res) => {
    try {
      const { page, perPage, title } = req.query;
      const companies = await db.getAllCompanies(page, perPage, title);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  app.get('/api/company/:name', async (req, res) => {
    try {
      const company = await db.getCompanyByName(req.params.name);
      if (!company) {
        res.status(404).json({ error: 'Company not found' }); 
      } else {
        res.json(company);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  app.put('/api/companiesDB/:name', async (req, res) => {
    try {
      const data = req.body;
      const name = req.params.name;
      const result = await db.updateCompanyByName(data, name);
      if (result.nModified === 0) {
        res.status(500).json({ error: 'No Company was updated' });
      } else {
        res.json({ message: 'Company updated successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  app.delete('/api/companiesDB/:name', async (req, res) => {
    try {
      const id = req.params.name;
      const result = await db.deleteCompanyByName(id);
      if (result.deletedCount === 0) {
        res.status(500).json({ error: 'No Company was deleted' });
      } else {
        res.json({ message: 'Company deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});