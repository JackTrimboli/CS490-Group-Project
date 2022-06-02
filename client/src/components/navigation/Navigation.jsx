import React from 'react';
import NavLink from './NavLink';
import { Link } from 'react-router-dom';
import './Navigation.css';
import Button from '../shared/Button/Button';


const Navigation = (props) => {

    const handleLogout = (event) => {
        return;
    }

    return (
        <div className='navbar'>
            <div className='navbar-content'>
                <Link className='navbar-logo-link' to="/">
                    <h1 className='navbar-logo'>CritiCode</h1>
                </Link>
                <Button text="Logout" />
            </div>
        </div>
    )
}

export default Navigation