/* src/App.js */
import logo from './logo.svg';
import menuIcon from './menu_icon.png'
import './App.css';
import React, { useEffect, useState } from 'react'
import { Amplify, API, AWSPinpointProvider, graphqlOperation } from 'aws-amplify'
import { createUser } from './graphql/mutations';
import { listEquipment, getEquipment } from './graphql/queries'
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';
Amplify.configure(awsExports);

const initialUserForm = { firstname: '', lastname: '', email: '', draw: '', handedness: '' }


const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialUserForm)
  const [users, setUsers] = useState([])
  const [equipments, setEquipment] = useState([])

  useEffect(() => {
    getEquipment()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
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
      await API.graphql(graphqlOperation(createUser, { input: user }))
    } catch (err) {
      console.log('error creating user:', err)
    }
  }

  const [navbarOpen, setNavbarOpen] = useState(false)
  const handleToggle = () => {
    setNavbarOpen(!navbarOpen)
  }


  return (

    <div className='page'>
      <div className="header row">
        <p className='titleHeader'>BowMaster</p>
        <nav className="navBar">
          <button onClick={handleToggle}><img alt="menu icon" src={menuIcon} className="navIcon"></img></button>
          <ul className={`menuNav ${navbarOpen ? " showMenu" : ""}`}>
            <li><button onClick={App}>Home</button></li>
            <li><button onClick={signOut}>Sign out</button></li>
          </ul>
        </nav>
      </div>

      <div className='content'>
        <Heading level={3}>Noe Middle School Archery</Heading>
        <Heading level={4}>Welcome, {user.username}</Heading>

        <form>
          <Heading level={3}>User Profile Form</Heading>
          <input
            onChange={event => setInput('firstname', event.target.value)}
            value={formState.firstname}
            placeholder="First Name (required)"
          />
          <input
            onChange={event => setInput('lastname', event.target.value)}
            value={formState.lastname}
            placeholder="Last Name (required)"
          />
          <input
            onChange={event => setInput('email', event.target.value)}
            value={formState.email}
            placeholder="Email (required)"
          />
          <input
            onChange={event => setInput('draw', event.target.value)}
            value={formState.draw}
            placeholder="Draw (if known)"
          />
          <input
            onChange={event => setInput('handedness', event.target.value)}
            value={formState.handedness}
            placeholder="Handedness (if known)"
          />
          <button onClick={addUser}>Save Profile</button>
        </form>

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
        <p>Bowmaster v1</p>
      </div>
    </div>
  );
}


export default withAuthenticator(App);