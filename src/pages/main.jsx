import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Profile from './profile';

const Main = ({ user }) => {
    return (
        <Routes>
            <Route path='/' element={Home(user)} exact></Route>
            <Route path='profile' element={Profile(user)} exact></Route>
        </Routes>
    );
}

export default Main;