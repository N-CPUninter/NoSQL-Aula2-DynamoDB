// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.

const express = require("express");
const app = express();

const AWS = require("aws-sdk");

// const SESConfig = {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     accessSecretKey: process.env.AWS_SECRET_KEY,
//     region: "us-east-1"
// }
// AWS.config.update(SESConfig);

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
  AWS.config.update({ region: "us-east-2" });
  var dynamodb = new AWS.DynamoDB();
  var params = {Limit: 10};
  dynamodb.listTables(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      response.send(data);
    }
  });
});

//Inserir
app.get("/inserir", (request, response) => {
  AWS.config.update({ region: "us-east-2" });
  var client = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: "Filmes",
    Item: {
      Atores: "Guilherme Ditzel Patriota",
      NomeDoFilme: "Eu e ela.",
      Ano: "2024",
      Duração: "180",
      Gênero: "Ação",
    },
  };

  client.put(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      response.send(data);
    }
  });
});

// Excluir
app.get("/excluir", (request, response) => {
  AWS.config.update({ region: "us-east-1" });
  var client = new AWS.DynamoDB.DocumentClient();
  var ator = request.query.ator;
  var filme = request.query.filme;

  var params = {
    TableName: "Filmes",
    Key: {
      Atores: ator,
      NomeDoFilme: filme,
    },
  };

  client.delete(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      response.send(data);
    }
  });
});

// Editar
app.get("/editar", (request, response) => {
  AWS.config.update({ region: "us-east-1" });
  var client = new AWS.DynamoDB.DocumentClient();

  var ator = request.query.ator;
  var filme = request.query.filme;
  var valor = request.query.valor;

  var params = {
    TableName: "Filmes",
    Key: {
      Atores: ator,
      NomeDoFilme: filme,
    },
    UpdateExpression: "set #s = :y",
    ExpressionAttributeNames: {
      "#s": "Ano",
    },
    ExpressionAttributeValues: {
      ":y": valor,
    },
  };

  client.update(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      response.send(data);
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
