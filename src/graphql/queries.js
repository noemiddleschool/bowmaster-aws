/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      firstname
      lastname
      email
      draw
      handedness
      sessions {
        items {
          id
          starttime
          createdAt
          updatedAt
          userSessionsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstname
        lastname
        email
        draw
        handedness
        sessions {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSession = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
      id
      starttime
      user {
        id
        firstname
        lastname
        email
        draw
        handedness
        sessions {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      userSessionsId
    }
  }
`;
export const listSessions = /* GraphQL */ `
  query ListSessions(
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        starttime
        user {
          id
          firstname
          lastname
          email
          draw
          handedness
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        userSessionsId
      }
      nextToken
    }
  }
`;
