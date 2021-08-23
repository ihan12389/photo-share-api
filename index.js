const expressPlayground =
  require("graphql-playground-middleware-express").default;

// Node.js의 fs 모듈로 typeDefs.graphql 파일의 내용을 읽어들입니다.
const { readFileSync } = require("fs");

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");

// 1. 'apollo-server-express'와 'express'를 require합니다.
const { ApolloServer } = require(`apollo-server-express`);
const express = require("express");

var _id = 0;
var users = [
  {
    githubLogin: "mHattrup",
    name: "Mike Hattrup",
  },
  {
    githubLogin: "gPlake",
    name: "Glen Plake",
  },
  {
    githubLogin: "sSchmidt",
    name: "Scot Schmidt",
  },
];
var photos = [
  {
    id: "1",
    name: "Droppint the Heart Chute",
    description: "The heart chute is one of my favorite cutes",
    category: "ACTION",
    githubUser: "gPlake",
    created: "3-28-1977",
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
    created: "1-2-1985",
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
    created: "2018-04-15T19:09:57.308Z",
  },
];
var tags = [
  { photoID: "1", userID: "gPlake" },
  { photoID: "2", userID: "sSchmidt" },
  { photoID: "2", userID: "mHattrup" },
  { photoID: "2", userID: "gPlake" },
];

// 2. 'express()'를 호출하여 익스프레스 애플리케이션을 만듭니다.
var app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 3. 'applyMiddleware()'를 호출하여 미들웨어가 같은 경로에 마운트되도록 합니다.
server.applyMiddleware({ app });

// 4. 홈 라우트를 만듭니다.
app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": `text/html; charset=UTF-8 ` });
  res.end("PhotoShare API에 오신 것을 환영합니다.");
});
// localhost:4000/playground에서 실행할 GraphQL 플레이그라운드 라우트를 만듭니다.
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

// 5. 특정 포토에서 리스닝을 시작합니다.
app.listen({ port: 4000 }, () =>
  console.log(
    `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`
  )
);
