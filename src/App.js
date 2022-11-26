/* src/App.js */
import './App.css';

import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import menuIcon from './menu_icon.png'
import Main from './pages/main';

import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

export default function App() {

  const [navbarOpen, setNavbarOpen] = useState(false)
  const handleToggle = () => {
      setNavbarOpen(!navbarOpen)
  }
  return (
    <Authenticator>
      {({ signOut }) => (
        <>
          <div className='App'>
            <div className="header row">
              <p className='titleHeader'>BowMaster</p>
              <nav className="navBar">
                <button onClick={handleToggle}><img alt="menu icon" src={menuIcon} className="navIcon"></img></button>
                <ul className={`menuNav ${navbarOpen ? " showMenu" : ""}`}>
                  <li><Link to='/'>Home</Link></li>
                  <li><Link to='/profile'>Profile</Link></li>
                  <li><Link onClick={signOut}>Sign out</Link></li>
                </ul>
              </nav>
            </div>
            <Main />
          </div>
        </>
      )}
    </Authenticator>

  );
}