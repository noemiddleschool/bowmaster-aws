import React from 'react'

import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { withAuthenticator, Button, Heading, FieldGroupIcon } from '@aws-amplify/ui-react';

function Home() {
    return (
        <div className='content'>
            <h3>Noe Middle School Archery</h3>
            <h4>Welcome, </h4>
            <h3>Current Equipment Listing</h3>
            <p>
                Sample data of equipment matching profile requirements
            </p>
            <h3>Current Active Sessions</h3>
            <p>
                Sample data from active session
            </p>
        </div>
    );
}

export default Home;