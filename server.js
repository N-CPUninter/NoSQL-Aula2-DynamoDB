// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
 // import { DynamoDBClient, 
 //            ListTablesCommand 
 //    } from "@aws-sdk/client-dynamodb";

const express = require("express");
const app = express();

//const AWS = require("aws-sdk");
const {DynamoDB} = require('@aws-sdk/client-dynamodb');


var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// our default array of dreams
const dreams = [
  "teste de aula",
  "Climb a really tall mountain",
  "Wash the dishes",
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

app.get("/listartabelas", (request, response) => {
  const dymamoDB = new DynamoDB({region: 'us-west-2'});
  (async function () {
     const dbclient = new DynamoDBClient({ region: 'us-west-2'});

    try {
      const results = await dbclient.send(new ListTablesCommand);
      results.Tables.forEach(function (item, index) {
        console.log(item.Name);
      });
    } catch (err) {
      console.error(err)
    }
  })();
  
  // AWS.config.update({ region: "us-east-1" });
  // var dynamodb = new AWS.DynamoDB();
  // var params = {};
  // dynamodb.listTables(params, function (err, data) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     response.send(data);
  //   }
  // });
});

// Inserir
// app.get("/inserir", (request, response) => {
//   AWS.config.update({ region: "us-east-1" });
//   var client = new AWS.DynamoDB.DocumentClient();
//   var params = {
//     TableName: "Filmes",
//     Item: {
//       Atores: "Antônio Fagundes",
//       NomeDoFilme: "Lagoa Azul",
//       Ano: "2018",
//       Duração: "180",
//       Gênero: "Terror",
//     },
//   };

//   client.put(params, function (err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       response.send(data);
//     }
//   });
// });

// // Excluir
// app.get("/excluir", (request, response) => {
//   AWS.config.update({ region: "us-east-1" });
//   var client = new AWS.DynamoDB.DocumentClient();
//   var ator = request.query.ator;
//   var filme = request.query.filme;

//   var params = {
//     TableName: "Filmes",
//     Key: {
//       Atores: ator,
//       NomeDoFilme: filme,
//     },
//   };

//   client.delete(params, function (err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       response.send(data);
//     }
//   });
// });

// // Editar
// app.get("/editar", (request, response) => {
//   AWS.config.update({ region: "us-east-1" });
//   var client = new AWS.DynamoDB.DocumentClient();

//   var ator = request.query.ator;
//   var filme = request.query.filme;
//   var valor = request.query.valor;

//   var params = {
//     TableName: "Filmes",
//     Key: {
//       Atores: ator,
//       NomeDoFilme: filme,
//     },
//     UpdateExpression: "set #s = :y",
//     ExpressionAttributeNames: {
//       "#s": "Ano",
//     },
//     ExpresionAttributeValues: {
//       ":y": valor,
//     },
//   };

//   client.update(params, function (err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       response.send(data);
//     }
//   });
// });

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
