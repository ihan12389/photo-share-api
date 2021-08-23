const { MongoClient } = require("mongodb");
// DB_HOST URL을 불러오기 위해 dotenv 패키지를 사용합니다.
require("dotenv").config();

const { ApolloServer } = require(`apollo-server-express`);
const express = require("express");

const expressPlayground =
  require("graphql-playground-middleware-express").default;
const { readFileSync } = require("fs");

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");

// 비동기 함수를 생성합니다.
// 프로미스가 await 키워드를 해결할 때까지 기다리도록 붙잡아둡니다.
async function start() {
  console.log("start");
  const app = express();
  console.log("app");
  const MONGO_DB = process.env.DB_HOST;
  console.log(MONGO_DB);

  // 로컬 혹은 원격 데이터베이스 연결이 성공적으로 이루어질 때까지 기다립니다.
  const clinet = await MongoClient.connect(MONGO_DB, {
    useNewUrlParser: true,
  });
  const db = clinet.db();

  // 데이터베이스에 연결되었다면 컨텍스트 객체에 연결 정보가 추가되고 서버가 시작됩니다..
  const context = { db };

  const server = new ApolloServer({ typeDefs, resolvers, context });

  server.applyMiddleware({ app });

  app.get("/", (req, res) => res.end("Welcome to the PhotoShare API"));

  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  app.listen({ port: 4000 }, () =>
    console.log(
      `GraphQL Server running at http://localhost:4000${server.graphqlPath}`
    )
  );
}

// 시작 준비를 마친 후에 함수를 호출합니다.
start();
