import { React, useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../shared/Button/Button';
import './Grading.css'

const Grading = (props) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [testID, setTestID] = useState(-1);
    const [students, setStudents] = useState([])

    useEffect(() => {
        const test = searchParams.get("id");
        if (test)
            setTestID(parseInt(test));

        const students = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/GetStudents.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: parseInt(test) }
        };

        axios.request(students).then((response) => {
            if (!!response.data.users) {
                console.log(response.data.users)
                setStudents(response.data.users)
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [])

    return (
        <div className='grading-wrapper'>
            <div className='header'>
                <h2>Submissions for Exam #{testID}</h2>
                <p>The following represent all current submissions for this exam. To modfiy the submission of specific student, hit 'edit grades'</p>
            </div>
            <div className='submission-list'>
                <table className='submission-table'>
                    <tbody >
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Edit</th>
                        </tr>
                        {students.map((res) => {
                            return (
                                <tr>
                                    <td>{res.userID}</td>
                                    <td>{res.userName}</td>
                                    <td><Link to={"/GradeStudent/?id=" + testID + "&userID=" + res.userID}><Button text="Edit Grade" /></Link></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Grading