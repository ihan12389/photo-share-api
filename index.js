const { ApolloServer } = require(`apollo-server`);

// User 타입에서 Photo 타입으로 건너갈 수 있으니 방향성을 띈 그래프를 만든 셈입니다.
// 다시 Photo 타입에서 User 타입으로 거슬러 갈 수 있게해서 무방향 그래프가 됩니다.
// 하나의 사진은 User 한명에 의해 게시된 것이기에 일대일 연결 관계입니다.
const typeDefs = `
type User {
  githubLogin : ID!
  name : String
  avatar: String
  postedPhotos: [Photo!]!
}

enum PhotoCategory {
  SELFIE
  PORTRAIT
  ACTION
  LANDSCAPE
  GRAPHIC
}


type Photo {
    id : ID!
    url: String!
    name : String!
    description : String
    category : PhotoCategory!
    postedBy : User!
}

input PostPhotoInput {
  name : String!
  category : PhotoCategory=PORTRAIT
  description : String
}

type Query {
  totalPhotos : Int!
  allPhotos: [Photo!]!
}

type Mutation {
  postPhoto(input: PostPhotoInput!):Photo!
}
`;

var _id = 0;
// 서버를 테스트하기 위해 샘플 데이터를 추가
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
  },
  {
    id: "2",
    name: "Enjoying the sunshine",
    category: "SELFIE",
    githubUser: "sSchmidt",
  },
  {
    id: "3",
    name: "Gunbarrel 25",
    description: "25 laps on gunbarrel today",
    category: "LANDSCAPE",
    githubUser: "sSchmidt",
  },
];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args.input,
      };
      photos.push(newPhoto);

      return newPhoto;
    },
  },
  Photo: {
    url: (parent) => `https://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      return users.find((u) => u.githubLogin === parent.githubUser);
    },
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
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
