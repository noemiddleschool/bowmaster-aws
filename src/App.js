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

const initialUserForm = { firstname: '', lastname: '', email: '', draw: '', handedness: '' } // setup fields for user form

const App = ({ signOut, user }) => {

  // constant defined constructor objects used to store various data fields in variables
  const [formState, setFormState] = useState(initialUserForm) // init state of form
  const [users, setUsers] = useState([]) // init constructor for user object
  const [equipments, setEquipment] = useState([]) // init constructor for equipment object
  const [profile, setProfile] = useState([]) // init constructor used to store profile email address
  const [firstName, setFirstName] = useState([]) // init constructor used to store first name of user
  const [lastName, setLastName] = useState([]) // init constructor used to store last name of user
  const [userDraw, setUserDraw] = useState([]) // init constructor used to store draw of user
  const [userhandedness, setUserHandedness] = useState([]) // init constructor used to store handedness of user

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  useEffect(() => {
    checkUser(); // run checkUser() after rendering
  }, [])

  // checkUser()
  // Purpose: to obtain additional information from cognito regarding checked in user
  //          then using this obtained email address, search the user table and retrieve
  //          user specific profile fields
  async function checkUser() {
    const currentUser = await Auth.currentAuthenticatedUser(); // obtain full user token from cognito of auth'ed user
    setProfile(currentUser.attributes.email); // save email address of user into profile variable

    // using the email address obtained, query the user table to retrieve the user record
    const userRecord = await API.graphql(graphqlOperation(listUsers, { filter: { email: { eq: currentUser.attributes.email } } }));
    
    // save specific user fields from user record into variables
    setFirstName(userRecord.data.listUsers.items[0].firstname)
    setLastName(userRecord.data.listUsers.items[0].lastname)
    setUserDraw(userRecord.data.listUsers.items[0].draw)
    setUserHandedness(userRecord.data.listUsers.items[0].handedness)

    // call getEquipment() and pass the current user draw and handedness
    getEquipment(userRecord.data.listUsers.items[0].draw, userRecord.data.listUsers.items[0].handedness)
    setSession(await getSessionForDisplay(userRecord.data.listUsers.items[0].id))

  }


  // getEquipment()
  // Purpose: to filter available equipment out of equipment table based on draw and handedness passed
  //          by calling function using GraphQl API
  async function getEquipment(draw, handedness) {
    try {
      if (handedness == 'UNKNOWN') { // user handedness unknown, so filter based on draw only
        const equipmentData = await API.graphql(graphqlOperation(listEquipment, {filter: { draw: { eq: draw}}}))
        const equipments = equipmentData.data.listEquipment.items // save results of query
        setEquipment(equipments) // store results in structure for iteration
      } 
      else { // handedness and draw known, filter available equipment from equipment table
        const equipmentData = await API.graphql(graphqlOperation(listEquipment, {filter: { draw: { eq: draw}, handedness: { eq: handedness}}}));
        const equipments = equipmentData.data.listEquipment.items; // save results of query
        setEquipment(equipments); // store results in structure for iteration
      }
    } catch (err) {
      console.log('error retrieving equipment list:', err)
    }
  }

  
  // addUser()
  // Purpose: To create user record using GraphQl API with data obtained by form on website
  async function addUser() {
    try {
      // ensure firstname, lastname, and email have data
      if (!formState.firstname || !formState.lastname || !formState.email) return
      
      // create user object using data from form
      const user = { ...formState } 
      setUsers([...users, user])
      setFormState(initialUserForm)

      // transmit user object via GraphQl API to createUser() to generate user record in table
      await API.graphql(graphqlOperation(createUser, { input: user })) 

    } catch (err) {
      console.log('error creating user:', err)
    }
  }

  // getUserSessions()
  // Purpose: to retrieve session records tied to the currently logged in user based on their userId
  async function getUserSessions(userId) {
    try {
      //query database for sessions related to the given userId
      const userSessions = await API.graphql(graphqlOperation(listSessions, { filter: { userSessionsId: { eq: userId } } }))
    
      return userSessions
    
    } catch (err) {
      console.log("Error retrieving user sessions: ", err)
    }
  }

  // getAllSessions()
  // Purpose: function used for debugging and verifying session record 
  //          changes/retrievals from database
  async function getAllSessions() {
    try {
      //query database for all records in session table
      const allSessions = await API.graphql(graphqlOperation(listSessions, {}))

    } catch (err) {
      console.log("error retrieving sessions: ", err)
    }
  }

  // getSessionForDisplay()
  // Purpose: retrieve current or upcoming session for display on webpage. 
  async function getSessionForDisplay(userId) {
    try {
      //collect all sessions for the current user and mark the current time
      const userSessions = await getUserSessions(userId)
      const currentTime = new Date().toISOString.valueOf()

      //placeholders for determining active/upcoming session
      var currentSession = null
      var upcomingSession = null

      //determine whether there is a currently active session, or one upcoming
      userSessions.data.listSessions.items.forEach(session => {
        //if session is incomplete and has already started, then it is a current session
        if (session.endtime == null) {
          if (session.starttime.valueOf() >= currentTime) {
            currentSession = session

            //if the session is incomplete and hasn't started, then it is upcoming
          } else if (session.starttime.valueOf() < currentTime) {
            //if we already have found an upcoming session, see if replace needed
            if (upcomingSession != null) {

              //if this upcoming session is sooner, replace variable value
              if (session.starttime.valueOf() > upcomingSession.starttime.valueOf()) {
                upcomingSession = session
              }
              
            } else {
              upcomingSession = session
            }
          }
        }
      });

      //return either the current session (if exists), or the upcoming one (if found)
      if (currentSession != null) {
        return currentSession
      } else if (upcomingSession != null) {
        return upcomingSession
      } else {
        console.log("couldn't find any current or upcoming sessions!!!")
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

        {/* display authenticated username and email */}
        <h2>Welcome, {user.username}</h2>
        Email: {profile}
      </div>

      {/* begin user form to create user record in table */}
      <form>
        <h1>User Profile Form</h1>

        {/* Save first name of user into form */}
        First Name:
        <input
          onChange={event => setInput('firstname', event.target.value)}
          value={formState.firstname}
          placeholder={firstName}
        />

        {/* Save last name of user into form */}
        Last Name:
        <input
          onChange={event => setInput('lastname', event.target.value)}
          value={formState.lastname}
          placeholder={lastName}
        />

        {/* Save email address of user into form */}
        Email: <input
          onChange={event => setInput('email', event.target.value)}
          value={formState.email}
          placeholder={profile}
        />

        {/* Save user draw */}
        Draw:
        <input
          onChange={event => setInput('draw', event.target.value)}
          value={formState.draw}
          placeholder={userDraw}
        />

        {/* Save user draw into form */}
        Handedness (LEFT/RIGHT/UNKNOWN):
        <input
          onChange={event => setInput('handedness', event.target.value)}
          value={formState.handedness}
          placeholder={userhandedness}
        />

        {/* form submit */}
        <button className='submitBtn' onClick={addUser}>Save Profile</button>
      </form>

      {/* begin equipment table */}
      <div className='equipmentListing'>
        <h1>Current Equipment Listing</h1>

        {/* display criteria used for currently displayed filtered view */}
        <div align="right">Criteria based on currrent profile: </div>
        <div align="right">Draw: {userDraw} Handedness: {userhandedness}</div>

        {/* table row headers */}
        <table>
          <thead>
            <tr>
              <th>Bownumber</th>
              <th>Bow Serial Number</th>
              <th>Draw</th>
              <th>Handedness</th>
            </tr>
          </thead>
          {/* iterate through generated equipment object and print each item as row item */}
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
          {session.starttime >= new Date().toISOString.valueOf()
            ? <>
              <div className='currentSession'>Practice started at: {session.starttime}</div>
            </>
            : <div className='upcomingSession'>There is no current practice. The next practice will begin at {session.starttime}</div>
          }
        </p>
      </div>
      <p className='footer'>Bowmaster v1</p>
    </div>
  );
}

export default withAuthenticator(App);