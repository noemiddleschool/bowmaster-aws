/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateSession = /* GraphQL */ `
  subscription OnCreateSession($filter: ModelSubscriptionSessionFilterInput) {
    onCreateSession(filter: $filter) {
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
export const onUpdateSession = /* GraphQL */ `
  subscription OnUpdateSession($filter: ModelSubscriptionSessionFilterInput) {
    onUpdateSession(filter: $filter) {
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
export const onDeleteSession = /* GraphQL */ `
  subscription OnDeleteSession($filter: ModelSubscriptionSessionFilterInput) {
    onDeleteSession(filter: $filter) {
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
