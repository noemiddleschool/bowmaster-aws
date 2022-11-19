/* src/App.js */
import logo from './logo.svg';
import menuIcon from './menu_icon.png'
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
    setFormState({ ...formState, [key]: value })
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
        <p>
          Sample data of equipment matching profile requirements
        </p>
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