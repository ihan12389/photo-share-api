const { ApolloServer } = require(`apollo-server`);
const { GraphQLScalarType } = require("graphql");

// 스칼라 타입을 직접 만들 때는 타입 직렬화와 유효성 검사 방식을 고려해야 합니다.
// DateTime 타입을 만들려고 한다면 유효한 DateTime에 대한 정의가 우선되어야 합니다.
// typeDefs에 직접 만든 DateTime 스칼라 타입을 추가하여 Photo 타입의 created 필드에서 사용합니다. (created 필드는 사진이 게시된 날짜와 시간을 기록하는 용도입니다.)
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

scalar DateTime
type Photo {
    id : ID!
    url: String!
    name : String!
    description : String
    category : PhotoCategory!
    postedBy : User!
    taggedUsers:[User!]!
    created:DateTime!
}

input PostPhotoInput {
  name : String!
  category : PhotoCategory=PORTRAIT
  description : String
}

type Query {
  totalPhotos : Int!
  allPhotos(after: DateTime): [Photo!]!
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
        created: new Date(),
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
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => users.find((u) => u.githubLogin === userID)),
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    idPhotos: (parent) =>
      tags
        .filter((tag) => tag.userID === parent.id)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((p) => p.id === photoID)),
  },
  // GraphQLScalarType 객체로 커스텀 스칼라 타입에 대응하는 리졸버를 만들었습니다.
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value",
    // after 인자는 리졸버로 보내지기 전에 자바스크립트 Date 객체로 변환됩니다.
    // perseValue 함수로 쿼리와 함께 받아오는 문자열 값을 변환합니다. 여기서 반환하는 모든 값은 리졸버 함수의 인자로 보내지게 됩니다.
    parseValue: (value) => new Date(value),
    // 필드반환 값으로 날짜를 받으면 이를 ISO 형식 문자열 값으로 직렬화합니다.
    // serialize 함수는 객체에서 필드 값을 가져다가 사용합니다.
    serialize: (value) => new Date(value).toISOString(), //직렬화
    // after 인자는 쿼리 변수로 넘기지 않고 코드에 곧장 써줍니다.
    // 인자 값은 쿼리를 추상 구문 트리(AST)로 변환한 다음 파싱을 하기 전에 추출해야 합니다.
    // parseLiteral 함수를 사용해 파싱 전의 인자 값을 쿼리에서 가져옵니다.
    parseLiteral: (ast) => ast.value,
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
