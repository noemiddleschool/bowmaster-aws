/* src/App.js */
import logo from './logo.svg';
import './App.css';

import Main from './pages/main';
import Navbar from './pages/Navbar';

import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { withAuthenticator, Button, Heading, FieldGroupIcon } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const App = () => {
  return (
    <div className='App'>
      <Navbar />
      <Main />
    </div>
  );
}

export default withAuthenticator(App)
/*
const App = ({ signOut, user }) => {
  


  return (

    <div className='page'>
      

      <div className='content'>
        
        <br></br>
        <p>Bowmaster v1</p>
      </div>
    </div>
  );
}


export default withAuthenticator(App); 
*/