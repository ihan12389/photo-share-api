const { ApolloServer } = require(`apollo-server`);

const typeDefs = `
type Query {
    totalPhotos:Int!
}

type Mutation {
  postPhoto(name:String! description:String):Boolean!
}
`;

// 1. 메모리에 사진을 저장할 때 사용할 데이터 타입
var photos = [];

const resolvers = {
  Query: {
    // 2. 사진 배열의 길이를 반환합니다.
    totalPhotos: () => photos.length,
  },

  // 3. Mutation & postPhoto 리졸버 함수
  Mutation: {
    postPhoto(parent, args) {
      // 플레이스홀더인 parnet(Mutation)을 첫번재 인자로 넣어 리졸버로 전달한 두 번째 인자, 즉 뮤테이션 인자를 사용할 수 있도록 만듭니다.
      photos.push(args);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
