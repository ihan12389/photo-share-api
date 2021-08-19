const { ApolloServer } = require(`apollo-server`);

// PhotoCategory 열거 타입과 PostPhotoInput 인풋 타입을 typeDefs에 추가
// 열거(enum)와 인풋(input) 타입 사용
// 사용자가 카테고리 필드값을 인자에 넣지 않으면 기본값인 PORTRAIT가 들어갑니다.
const typeDefs = `
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
var photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },
  Mutation: {
    // args 대신 args.input을 사용해 값에 접근
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
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));

/*
  mutation newPhoto($input: PostPhotoInput!) {
    postPhoto(input: $input) {
      id
      name
      url
        description
      category
    }
  }
variables
  {
    "input" : {
      "name" : "sample photo A",
      "description" : "A sample photo for our dataset"
    }
  }

*/
