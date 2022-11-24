import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import menuIcon from '../menu_icon.png'


const Navbar = () => {
    const [navbarOpen, setNavbarOpen] = useState(false)
    const handleToggle = () => {
        setNavbarOpen(!navbarOpen)
    }
    return (
        <div className="header row">
            <p className='titleHeader'>BowMaster</p>
            <nav className="navBar">
                <button onClick={handleToggle}><img alt="menu icon" src={menuIcon} className="navIcon"></img></button>
                <ul className={`menuNav ${navbarOpen ? " showMenu" : ""}`}>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/profile'>Profile</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;