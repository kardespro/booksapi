const express = require('express');
const axios = require("axios")
const app = express();

app.get('/', (req, res) => {
  res.json({status:200,message: "Super API Running"})
});


app.get('/api/_v1/_ping-callback', (req, res) => {
  res.json({status:200,message: "Super API Running"})
});

app.get('/api/_v1/_books/search', async(req, res) => {
  // super-api.oxusan.com/api/_v1/_books/search?_q=react
  let q = req.query._q;
  let f = req.query.filter;
  let sort = req.query.sort;
  let proj = req.query.projection;
  if(!q) return res.json({status:404,message: "Query Error"})
  let d = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`)
  let p = d.data
  if(f){
    let ft = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}&filter=${f}`)
     res.setHeader('Content-Type', 'text/json'); 

    res.json({
      status:200,
      sortType: sort || "Not Found",
      filterType: f,
      projection: proj ||"Not Found",
      message: ft.data
    })
  }
  if(sort){
    let s = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}&orderBy=${sort}`)
    res.setHeader('Content-Type', 'text/json'); 

     res.json({
      status:200,
      sortType: sort,
      filterType: f || "Not Found",
      projection: proj ||"Not Found",
      message: s.data
    })
  }
  if(proj){
    let prj = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}&projection=${proj}`)
    res.setHeader('Content-Type', 'text/json'); 

    res.json({
      status:200,
      sortType: sort || "Not Found",
      filterType: f || "Not Found",
      projection: proj,
      message: prj.data
    })
  }
  res.setHeader('Content-Type', 'text/json'); 

  res.json({status:200,sortType: "Not Found", filterType: "Not Found",projection:"Not Found",message: p})
});



app.listen(80, () => {
  console.log('server started');
});
