/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createSession = /* GraphQL */ `
  mutation CreateSession(
    $input: CreateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    createSession(input: $input, condition: $condition) {
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
export const updateSession = /* GraphQL */ `
  mutation UpdateSession(
    $input: UpdateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    updateSession(input: $input, condition: $condition) {
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
export const deleteSession = /* GraphQL */ `
  mutation DeleteSession(
    $input: DeleteSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    deleteSession(input: $input, condition: $condition) {
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
