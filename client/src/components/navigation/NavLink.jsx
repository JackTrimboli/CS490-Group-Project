import React from 'react'
import { Link } from 'react-router-dom';



const NavLink = (props) => {
    return (
        <Link to={props.route}>{props.text}</Link>
    )
}

export default NavLink