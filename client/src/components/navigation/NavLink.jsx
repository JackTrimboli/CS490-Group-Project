import React from 'react'
import { Link } from 'react-router-dom';
import './NavLink.css';


const NavLink = (props) => {
    return (
        <Link className='Navlink-link' to={props.route}>
            <h3 className='Navlink-text'>
                {props.text}
            </h3>
        </Link>
    )
}

export default NavLink