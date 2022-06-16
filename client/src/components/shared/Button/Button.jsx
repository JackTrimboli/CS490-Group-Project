import React from 'react'
import './Button.css'
const Button = (props) => {
    return (
        <button className={`btn ${props.disabled ? "disabled" : null}`} onClick={props.disabled ? null : props.clickFunc}>{props.text}</button>
    )
}

export default Button