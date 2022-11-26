/* src/App.js */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify'
import { createUser } from './graphql/mutations';
import { listEquipment } from './graphql/queries'
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialUserForm = { firstname: '', lastname: '', email: '', draw: '', handedness: '' }

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialUserForm)
  const [users, setUsers] = useState([])
  const [equipments, setEquipment] = useState([])
  const [profile, setProfile] = useState([])

  function setInput(key, value) { 
    setFormState({...formState, [key]: value})
  }

  useEffect(() => {
    checkUser();
    getEquipment()
  }, [])

  async function checkUser() {
    const currentUser = await Auth.currentAuthenticatedUser();
    setProfile(currentUser.attributes.email)
  }

  async function getEquipment() {
    try {
      const equipmentData = await API.graphql(graphqlOperation(listEquipment))
      const equipments = equipmentData.data.listEquipment.items
      setEquipment(equipments)
    } catch (err) { console.log('error retrieving equipment list') }
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
      <Heading level={1}>BowMaster</Heading>
      <Heading level={3}>Noe Middle School Archery</Heading>
      <br></br>
      <Heading level={3}>User Profile Form</Heading>
      <input
        onChange={event => setInput('firstname', event.target.value)}
        style={styles.input}
        value={formState.firstname}
        placeholder="First Name (required)"
      />
      <input
        onChange={event => setInput('lastname', event.target.value)}
        style={styles.input}
        value={formState.lastname}
        placeholder="Last Name (required)"
      />
      <input
        onChange={event => setInput('email', event.target.value)}
        style={styles.input}
        value={formState.email}
        placeholder="Email (required)"
      />
      <input
        onChange={event => setInput('draw', event.target.value)}
        style={styles.input}
        value={formState.draw}
        placeholder="Draw (if known)"
      />
      <input
        onChange={event => setInput('handedness', event.target.value)}
        style={styles.input}
        value={formState.handedness}
        placeholder="Handedness (if known)"
      />
      <button style={styles.button} onClick={addUser}>Save Profile</button>
      <br></br>
    
      <Heading level={3}>Current Equipment Listing</Heading>
      <table>
          <thead>
            <tr>
              <th>Bownumber</th>
              <th>Bow Serial Number</th>
              <th>Draw</th>
              <th>Handedness</th>
            </tr>
          </thead>
        {
          equipments.map((equipment, index) => (
            <tbody key={equipment.id ? equipment.id : index}>
              <tr>
              <td>{equipment.bownumber}</td>
              <td>{equipment.bowserialnumber}</td>
              <td>{equipment.draw}</td>
              <td>{equipment.handedness}</td>
              </tr>
            </tbody>
          ))
        }
        </table>
        <br></br>
      <Heading level={3}>Current Active Sessions</Heading>
      <p>
        Sample data from active session
      </p>
      <br></br>
      <p style={styles.footer}>Bowmaster v1</p>
    </div>
  );
}

const styles = {
  container: { width: 800, margin: '0 auto', display: 'flex',
flexDirection: 'column', justifyContent: 'center', padding: 20 },
  button: { backgroundColor: 'red', color: 'white', outline: 'none',
fontSize: 18, padding: '12px 0px' },
  footer: { justifyContent: 'center', color: 'grey', fontStyle: 'italic' }
}


export default withAuthenticator(App);