import React from 'react'
import NavLink from './NavLink'
import './NavLink.css'

const NavLinkGroup = (props) => {

    if (props.isTeacher === "teacher") {
        return (
            <div className='Navlink-group'>
                <NavLink route='/Exams' text="Exams" />
                <NavLink route='/Questions' text="Questions" />
                <NavLink route='/Grades' text="Grading" />
            </div>)
    }
    return (
        <div className='Navlink-group'>
            <NavLink route='/Exams' text="Exams" />
            <NavLink route='/Grades' text="Grades" />
        </div>);
}

export default NavLinkGroup