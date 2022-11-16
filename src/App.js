/* src/App.js */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createUser } from './graphql/mutations';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialUserForm = { firstname: '', lastname: '', email: '', draw: '', handedness: '' }

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialUserForm)
  const [users, setUsers] = useState([])

  function setInput(key, value) { 
    setFormState({...formState, [key]: value})
  }

  async function addUser() {
    try {
      if (!formState.firstname || !formState.lastname || !formState.email) return
      const user = { ...formState }
      setUsers([...users, user])
      setFormState(initialUserForm)
      await API.graphql(graphqlOperation(createUser, {input: user}))
    } catch (err) {
      console.log('error creating user:', err)
    }
  }


  return (
    <div style={styles.container}>
      <Heading level={4}>Welcome, {user.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
      <Heading level={1}>Welcome to BowMaster v1</Heading>
      <br></br>
      <Heading level={3}>User Profile Form</Heading>
      <input
        onChange={event => setInput('firstname', event.target.value)}
        style={styles.input}
        value={formState.firstname}
        placeholder="First Name"
      />
      <input
        onChange={event => setInput('lastname', event.target.value)}
        style={styles.input}
        value={formState.lastname}
        placeholder="Last Name"
      />
      <input
        onChange={event => setInput('email', event.target.value)}
        style={styles.input}
        value={formState.email}
        placeholder="Email"
      />
      <input
        onChange={event => setInput('draw', event.target.value)}
        style={styles.input}
        value={formState.draw}
        placeholder="Draw"
      />
      <input
        onChange={event => setInput('handedness', event.target.value)}
        style={styles.input}
        value={formState.handedness}
        placeholder="Handedness"
      />
      <button style={styles.button} onClick={addUser}>Save Profile</button>
      <br></br>
    
      <Heading level={3}>Current Equipment Listing</Heading>
      <p>
       Sample data of equipment matching profile requirements
      </p>
      <Heading level={3}>Current Active Sessions</Heading>
      <p>
        Sample data from active session
      </p>
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
