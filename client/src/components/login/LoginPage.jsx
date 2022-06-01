import { React, useState } from 'react'
import axios from 'axios'
import './LoginPage.css'

const LoginPage = (props) => {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    const handleLogin = () => {
        const options = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~am2729/Login.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { name: user, pass: pass }
        };
        axios.request(options).then((response) => {
            //pass up the response object using a callback function 
            console.log(response);
            if (!!response.data) {
                props.login(response.data)
            }
        }).catch((err) => {
            console.log("Login Failure: ", err);
        });
    }
    const handleUserChange = (event) => {
        setUser(event.target.value);
    }
    const handlePassChange = (event) => {
        setPass(event.target.value);
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <div className='login-wrapper'>
            <div className='login-main'>
                <h1 className='login-heading'>CritiCode</h1>
                <div className='login-form' onKeyDown={handleKeyDown}>
                    <label className='login-form-field'>
                        Username:
                        <input className='login-form-input' placeholder='Enter Username' value={user} onChange={handleUserChange} />
                    </label>
                    <label className='login-form-field'>
                        Password:
                        <input className='login-form-input' placeholder='Enter password' type="password" value={pass} onChange={handlePassChange} />
                    </label>
                    <button className='login-form-btn' onClick={handleLogin}>Login</button>
                </div>
                <p>New here? <a href="#">Create a new account.</a></p>
            </div>
        </div>
    )
}

export default LoginPage