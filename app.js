const express = require('express');
const { request, gql } = require('graphql-request');
const path = require('path');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const { createEngine } = require('express-react-views');

const query = gql`
    {
        readAllContent {
            id
            class
            content
            createdAt
            updatedAt 
        }
    }
`;

const app = express();

const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.set('views', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('jsx', createEngine());
app.set('view engine', 'jsx');

const host = '192.168.0.105';
const port = "3000";

console.log("Servidor rodando em http://"+host+":"+port);

app.get('/',(req, res)=>{
    request('http://localhost:4000/', query).then((content)=> {
        console.log(content);
        res.render('index.jsx', {Contents: content.readAllContent});
    });
    
    
});
app.get('/adm',(req, res)=>{
    res.render('adm.ejs');
});
server.listen(port);