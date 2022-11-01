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
      <Heading level={1}>Logged in as {user.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
	  Test changes for cont deploy.. attempt 2.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
    </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex',
flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10,
padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none',
fontSize: 18, padding: '12px 0px' }
}


export default withAuthenticator(App);
