'use strict';
require('dotenv').config();
const express=require('express');
const cors=require('cors');
const pg = require('pg');
const superagent=require('superagent');
const methodOverride=require('method-override');
const app=express();

const PORT = process.env.PORT || 4000;

const client = new pg.Client(process.env.DATABASE_URL);


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');



app.get('/',getCharat);
app.get('/favorite',getDb);
app.get('/charact/:char_id',getOneChar);
app.put('/update/:char_id',updateChar);
app.delete('/delete/:char_id',deleteChar)
app.get('/add',getResults);
app.post('/add',addResults);

app.use('*',notFoundHandler);


function getCharat(req,res){

    let url='https://digimon-api.herokuapp.com/api/digimon';
    return superagent.get(url)
    .then((data)=>{
        let arr=data.body.map((select)=>{
           let fav= new Charactur(select) ;
           return fav;
        })
        res.render('index',{arr:arr});
    })
    .catch((err)=>{
        errorHandler(err,req,res)
    })



    /***************strech goal****************** */
     // if(req.body.myCharacter ==="name"){
    //     url=` https://digimon-api.herokuapp.com/api/digimon/${name}`
    // }
    //     else if(req.body.myCharacter==="level"){
    //         url=` https://digimon-api.herokuapp.com/api/digimon/${level}`
    // }
}

function Charactur(select){
    this.name=select.name;
    this.img=select.img;
    this.level=select.level;
}

function getDb(req,res){
    let SQL='SELECT * FROM digimon;';
    client.query(SQL)
    .then(results=>{
        res.render('favorite',{arr:results.row})
    })
    .catch((err)=>{
        errorHandler(err,req,res)
    })
}

function getOneChar(req,res){
    let SQL='SELECT FROM digimon WHERE id=$1;';
    const value=[req.params.char_id]
    client.query(SQL,value)
    .then((results)=>{
        res.render('detail')
    })
     .catch((err)=>{
        errorHandler(err,req,res)
    })
}

function updateChar(req,res){
    let{name,img,level}=req.body;
    let SQL='UPDATE digimon SET name=$1,img=$2,level=$3 WHERE id=$4 ;';
    const values=[name,img,level,req.params.char_id]
    client.query(SQL,values)
    .then((results)=>{
        res.render(`/charact/${req.params.char_id}`)
    })
    .catch((err)=>{
        errorHandler(err,req,res)
    })
}

function deleteChar(req,res){
    let SQL='DELETE FROM digimon WHERE id=$1 ;'
    const value=[req.params.char_id]
    client.query(SQL,value)
    .then(()=>{
        res.redirect('/')
    })
    .catch((err)=>{
        errorHandler(err,req,res)
    })
}

/*************strech goals (its work) */

// function getResults(req,res){
//     res.render('results')
// }

// function addResults(req,res){
//     let{name,img,level}=req.body;
//     let SQL='INSERT INTO digimon (name,img,level) VALUES ($1,$2,$3);';
//     const values=[name,img,level]
//     client.query(SQL,values)
//     .then((results)=>{
//         res.render('show')
//     })
//     .catch((err)=>{
//         errorHandler(err,req,res)
//     })
// }


function notFoundHandler(req,res){
    res.status(404).send('page not found')
}
function errorHandler(err,req,res){
    res.status(500).send(err);
}






client.connect().then(()=>{
    app.listen(PORT,()=>console.log(`up and runing on port ${PORT}`))
})