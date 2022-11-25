/* src/App.js */
import './App.css';

import Main from './pages/main';
import Navbar from './pages/Navbar';

import { Amplify } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react';
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