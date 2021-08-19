// 1. 'apollo-server'를 불러옵니다.
const { ApolloServer } = require(`apollo-server`);

const typeDefs = `
type Query {
    totalPhotos:Int!
}

type Mutation {
  postPhoto(name:String! description:String):Boolean!
}
`;

var photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => 42,
  },
};

// 2. 서버 인스턴스를 새로 만듭니다.
// 3. typeDefs(스키마)와 리졸버를 객체에 넣어 전달합니다.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4. 웹 서버를 구동하기 위해 listen 메서드를 호출합니다.
server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
