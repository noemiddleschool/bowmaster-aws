import logo from '../logo.svg';

import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Profile from './profile';

import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createUser } from '../graphql/mutations';
import { withAuthenticator, Button, Heading, FieldGroupIcon } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "../aws-exports";
Amplify.configure(awsExports);

const initialUserForm = { firstname: '', lastname: '', email: '', draw: '', handedness: '' }

const Main = ({ signOut, user }) => {
    return (
        <Routes>
            <Route path='/' element={Home(user)} exact></Route>
            <Route path='profile' element={Profile(user)} exact></Route>
        </Routes>
    );
}

export default Main;