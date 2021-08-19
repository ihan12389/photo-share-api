const { ApolloServer } = require(`apollo-server`);

// user 한명이 여러장의 사진에 태그도리 수 있고, photo 한장에는 여러명의 사용자가 태그될 수 있어서 다대다 관계가 생성됩니다.
// taggedUsers 필드는 사용자 리스트를 반환하고 inPhotos 필드는 사용자가 태그된 사진 리스트를 반환합니다.
const typeDefs = `
type User {
  githubLogin : ID!
  name : String
  avatar: String
  postedPhotos: [Photo!]!
  idPhotos:[Photo!]!
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
    taggedUsers:[User!]!
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
// 다대다 관계 테스트를 위해 샘플 태그 데이터가 담긴 배열 추가
var tags = [
  { photoID: "1", userID: "gPlake" },
  { photoID: "2", userID: "sSchmidt" },
  { photoID: "2", userID: "mHattrup" },
  { photoID: "2", userID: "gPlake" },
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
    taggedUsers: (parent) =>
      tags
        // 현재 사진에 대한 태그만 배열에 담아 반환합니다.
        .filter((tag) => tag.photoID === parent.id)
        // 태그 배열을 userID 배열로 변환합니다.
        .map((tag) => tag.userID)
        // userID 배열을 사용자 객체 배열로 변환합니다.
        .map((userID) => users.find((u) => u.githubLogin === userID)),
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    idPhotos: (parent) =>
      tags
        // 현재 사용자에 대한 태그만 배열에 담아 변환합니다.
        .filter((tag) => tag.userID === parent.id)
        // 태그 배열을 photoID 배열로 변환합니다.
        .map((tag) => tag.photoID)
        // photoID배열을 사진 객체 배열로 변환합니다.
        .map((photoID) => photos.find((p) => p.id === photoID)),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
