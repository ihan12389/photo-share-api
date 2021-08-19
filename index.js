const { ApolloServer } = require(`apollo-server`);

// 1. Photo 타입 정의를 추가합니다.
// 2. allPhotos에서 Photo 타입을 반환합니다.
// 3. 뮤테이션에서 새로 게시된 사진을 반환합니다.
const typeDefs = `
type Photo {
    id : ID!
    url: String!
    name : String!
    description : String
}

type Query {
  totalPhotos : Int!
  allPhotos: [Photo!]!
}

type Mutation {
  postPhoto(name:String! description:String):Photo!
}
`;

// 1. 고유 ID를 만들기 위해 값을 하나씩 증가시킬 변수입니다.
var _id = 0;
var photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto(parent, args) {
      // 2. 새로운 사진을 만들고 id를 부여합니다.
      var newPhoto = {
        id: _id++,
        ...args,
      };
      photos.push(newPhoto);

      // 3. 새로 만든 사진을 반환합니다.
      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `https://yoursite.com/img/${parent.id}.jpg`,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
