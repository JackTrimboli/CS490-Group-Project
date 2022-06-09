import React from 'react';
import NavLinkGroup from './NavLinkGroup';
import { Link } from 'react-router-dom';
import './Navigation.css';
import Button from '../shared/Button/Button';


const Navigation = (props) => {

    return (
        <div className='navbar'>
            <div className='navbar-content'>
                <div className='navbar-group-one'>
                    <Link className='navbar-logo-link' to="/">
                        <h1 className='navbar-logo'>CritiCode</h1>
                    </Link>
                    {!props.noTabs ?
                        <NavLinkGroup isTeacher={props.user.type} /> : null
                    }
                </div>
                {!props.noTabs ? <Button text="Logout" /> : null}
            </div>
        </div>
    )
}

export default Navigation