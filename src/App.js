/* src/App.js */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const App = ({ signOut, user }) => {
  return (
    <div style={styles.container}>
      <Heading level={4}>Welcome, {user.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
      <Heading level={1}>Welcome to BowMaster v1</Heading>
    </div>
  );
}

const styles = {
  container: { width: 800, margin: '0 auto', display: 'flex',
flexDirection: 'column', justifyContent: 'center', padding: 20 },
  button: { backgroundColor: 'blue', color: 'white', outline: 'none',
fontSize: 18, padding: '12px 0px' }
}


export default withAuthenticator(App);
