import React, { useState } from 'react';
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createUser } from '../graphql/mutations';

const initialUserForm = { firstname: '', lastname: '', email: '', draw: '', handedness: '' }

function Profile() {
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
    return (
        <div className='content'>
            <form>
                <h3>User Profile Form</h3>
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
        </div>
    );
}

export default Profile;