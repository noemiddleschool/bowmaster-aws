/* src/App.js */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify'
import { createUser } from './graphql/mutations';
import { listEquipment, listUsers } from './graphql/queries'
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
  const [firstName, setFirstName] = useState([])
  const [lastName, setLastName] = useState([])
  const [userDraw, setUserDraw] = useState([])
  const [userhandedness, setUserHandedness] = useState([])

  function setInput(key, value) { 
    setFormState({...formState, [key]: value})
  }

  useEffect(() => {
    checkUser();
  }, [])

  async function checkUser() {
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log({currentUser});
    setProfile(currentUser.attributes.email);
    const userRecord = await API.graphql(graphqlOperation(listUsers, {filter: { email: { eq: currentUser.attributes.email} } }));
    console.log({userRecord});
    setFirstName(userRecord.data.listUsers.items[0].firstname)
    setLastName(userRecord.data.listUsers.items[0].lastname)
    setUserDraw(userRecord.data.listUsers.items[0].draw)
    setUserHandedness(userRecord.data.listUsers.items[0].handedness)
    getEquipment(userRecord.data.listUsers.items[0].draw, userRecord.data.listUsers.items[0].handedness)
 
  }

  async function getEquipment(draw, handedness) {
    try {
      const equipmentData = await API.graphql(graphqlOperation(listEquipment, {filter: { draw: { eq: draw}, handedness: { eq: handedness}}}))
      const equipments = equipmentData.data.listEquipment.items
      setEquipment(equipments)
    } catch (err) { 
      console.log('error retrieving equipment list:', err) 
    }
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
      Email: {profile}
      <Button onClick={signOut}>Sign out</Button>
      <Heading level={1}>BowMaster</Heading>
      <Heading level={3}>Noe Middle School Archery</Heading>
      <br></br>
      <Heading level={3}>User Profile Form</Heading>
      First Name:
      <input
        onChange={event => setInput('firstname', event.target.value)}
        style={styles.input}
        value={formState.firstname}
        placeholder={firstName}
      />
      Last Name:
      <input
        onChange={event => setInput('lastname', event.target.value)}
        style={styles.input}
        value={formState.lastname}
        placeholder={lastName}
      />
      Email: <input
        onChange={event => setInput('email', event.target.value)}
        style={styles.input}
        value={formState.email}
        placeholder={profile}
      />
      Draw (if known):
      <input
        onChange={event => setInput('draw', event.target.value)}
        style={styles.input}
        value={formState.draw}
        placeholder={userDraw}
      />
      Handedness (if known):
      <input
        onChange={event => setInput('handedness', event.target.value)}
        style={styles.input}
        value={formState.handedness}
        placeholder={userhandedness}
      />
      <button style={styles.button} onClick={addUser}>Save Profile</button>
      <br></br>
    
      <Heading level={3}>Current Equipment Listing</Heading>
      <div align="right">Criteria based on currrent profile: </div>
      <div align="right">Draw: {userDraw} Handedness: {userhandedness}</div>
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
      <Heading level={3}>Current Active Session</Heading>
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