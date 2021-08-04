
const http = require('http');
const url = require('url');
const fs = require('fs');

const slugify =require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview =fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct =fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el=>slugify(el.productName,{lower:true}));


const server = http.createServer((req,res)=>{

    const {query,pathname} = url.parse(req.url,true);
    console.log(query);
    //Overview Page
    if (pathname==='/'||pathname==='/overview'){

        res.writeHead(200,{
            'Content-type':'text/html'
        })
        const cardsHtml = dataObj.map(item=> replaceTemplate(tempCard,item)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    //product page
    }else if (pathname==='/product'){

        res.writeHead(200,{
            'Content-type':'text/html'
        })
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    //api
    }else if(pathname==='/api'){
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(data)
    }
    //not found page
    else {
        res.writeHead(404,{
            'Content-type':'text/html'
        })
        res.end('<h1>Page Not Found!!!</h1>');
    }
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening on port 8000');
})