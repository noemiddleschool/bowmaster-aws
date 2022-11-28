/* src/App.js */
import logo from './logo.svg';
import menuIcon from './menu_icon.png'
import './App.css';
import React, { useEffect, useState } from 'react'
import { Amplify, API, Auth, graphqlOperation } from 'aws-amplify'
import { createUser } from './graphql/mutations';
import { listEquipment, listUsers, listSessions } from './graphql/queries'
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
import { queries } from '@testing-library/react';
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
    setFormState({ ...formState, [key]: value })
  }

  useEffect(() => {
    checkUser();
  }, [])

  async function checkUser() {
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log({ currentUser });
    setProfile(currentUser.attributes.email);
    const userRecord = await API.graphql(graphqlOperation(listUsers, { filter: { email: { eq: currentUser.attributes.email } } }));
    console.log({ userRecord });
    setFirstName(userRecord.data.listUsers.items[0].firstname)
    setLastName(userRecord.data.listUsers.items[0].lastname)
    setUserDraw(userRecord.data.listUsers.items[0].draw)
    setUserHandedness(userRecord.data.listUsers.items[0].handedness)
    getEquipment(userRecord.data.listUsers.items[0].draw, userRecord.data.listUsers.items[0].handedness)
    getSessionForDisplay(userRecord.data.listUsers.items[0].id)

  }

  async function getEquipment(draw, handedness) {
    try {
      if (handedness == 'UNKNOWN') {
        const equipmentData = await API.graphql(graphqlOperation(listEquipment, {filter: { draw: { eq: draw}}}))
        const equipments = equipmentData.data.listEquipment.items
        setEquipment(equipments)
      } 
      else {
        const equipmentData = await API.graphql(graphqlOperation(listEquipment, {filter: { draw: { eq: draw}, handedness: { eq: handedness}}}));
        const equipments = equipmentData.data.listEquipment.items;
        setEquipment(equipments);
      }
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
      await API.graphql(graphqlOperation(createUser, { input: user }))
    } catch (err) {
      console.log('error creating user:', err)
    }
  }

  async function getUserSessions(userId) {
    try {
      const userSessions = await API.graphql(graphqlOperation(listSessions, {filter: { userSessionsId: { eq: userId}}}))
      console.log("User sessions: ", userSessions)
      return userSessions
    } catch (err) {
      console.log("Error retrieving user sessions: ", err)
    }
  }

  async function getAllSessions() {
    try {
      const allSessions = await API.graphql(graphqlOperation(listSessions, {}))
      console.log('Returned sessions: ', allSessions)
    } catch (err) {
      console.log("error retrieving sessions: ", err)
    }
  }

  async function getSessionForDisplay(userId) {
    try {
    const userSessions = await getUserSessions(userId)
    console.log("user sessions", userSessions)
    const currentTime = new Date().toISOString.valueOf()
    var currentSession = null
    var upcomingSession = null
    userSessions.data.listSessions.items.forEach(session => {
      if (session.endtime == null) {
        if (session.starttime.valueOf() >= currentTime) {
          currentSession = session
          console.log("found current session!", currentSession)
        } else if (session.starttime.valueOf() < currentTime) {
          if (upcomingSession != null) {
            if (session.starttime.valueOf() > upcomingSession.starttime.valueOf()) {
              upcomingSession = session
              console.log("found upcoming session!", upcomingSession)
            }
          } else {
            upcomingSession = session
            console.log("found upcoming session!", upcomingSession)
          }
        }
      }
    });
    if(currentSession != null) {
      return currentSession
    } else if (upcomingSession != null) {
      return upcomingSession
    } else {
      console.log("couldnt find any sessions!!!")
      return null
    }
  } catch (err) {
    console.log("error in finding current and upcoming sessions!!!", err)
  }
  }

  const [navbarOpen, setNavbarOpen] = useState(false)
  const handleToggle = () => {
    setNavbarOpen(!navbarOpen)
  }


  return (
    <div className='container'>
      <div className='header row'>
        <p className='titleHeader'>BowMaster</p>
        <nav className='navBar'>
          <button onClick={handleToggle}><img alt="menu icon" src={menuIcon} className="navIcon"></img></button>
          <ul className={`menuNav ${navbarOpen ? " showMenu" : ""}`}>
            <li><button onClick={signOut}>Sign out</button></li>
          </ul>
        </nav>
      </div>
      <div align="right">
        <h2>Welcome, {user.username}</h2>
        Email: {profile}
      </div>
      <form>
        <h1>User Profile Form</h1>
        First Name:
        <input
          onChange={event => setInput('firstname', event.target.value)}
          value={formState.firstname}
          placeholder={firstName}
        />
        Last Name:
        <input
          onChange={event => setInput('lastname', event.target.value)}
          value={formState.lastname}
          placeholder={lastName}
        />
        Email: <input
          onChange={event => setInput('email', event.target.value)}
          value={formState.email}
          placeholder={profile}
        />
        Draw:
        <input
          onChange={event => setInput('draw', event.target.value)}
          value={formState.draw}
          placeholder={userDraw}
        />
        Handedness (LEFT/RIGHT/UNKNOWN):
        <input
          onChange={event => setInput('handedness', event.target.value)}
          value={formState.handedness}
          placeholder={userhandedness}
        />
        <button className='submitBtn' onClick={addUser}>Save Profile</button>
      </form>

      <div className='equipmentListing'>
        <h1>Current Equipment Listing</h1>
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
      </div>
      <div className='activeSession'>
        <h1>Current Active Session</h1>
        <p>
          Sample data from active session
        </p>
      </div>
      <p className='footer'>Bowmaster v1</p>
    </div>
  );
}

export default withAuthenticator(App);