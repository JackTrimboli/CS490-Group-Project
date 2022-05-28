import React from 'react'
import './LoginPage.css'

const LoginPage = () => {
    return (
        <div className='login-wrapper'>
            <h1 className='login-heading'>CritiCode</h1>
            <form className='login-form'>
                <label className='login-form-field'>
                    Username:
                    <input className='login-form-input' placeholder='Enter Username' />
                </label>
                <label className='login-form-field'>
                    Password:
                    <input className='login-form-input' type="password" placeholder='Enter password' />
                </label>
                <button className='login-form-btn' type='submit'>Login</button>
            </form>
            <p>New here? <a href="#">Create a new account.</a></p>
        </div>
    )
}

export default LoginPage