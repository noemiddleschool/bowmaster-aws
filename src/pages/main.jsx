import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Profile from './profile';

import { Amplify } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "../aws-exports";
Amplify.configure(awsExports);

const Main = ({ user }) => {
    return (
        <Routes>
            <Route path='/' element={Home(user)} exact></Route>
            <Route path='profile' element={Profile(user)} exact></Route>
        </Routes>
    );
}

export default withAuthenticator(Main)