import React from 'react'
import './ExamEntry.css'
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../shared/Button/Button'

const ExamEntry = (props) => {

    let redirect;
    if (props.isStudent)
        redirect = '/take-exam/?id=' + props.examID;
    else
        redirect = '/edit-exam/?id=' + props.examID;

    let gradeLink;
    if (props.student)
        gradeLink = '/Grades/?id=' + props.examID;
    else
        gradeLink = '/Grading/?id=' + props.examID;


    const autoGrade = () => {
        const grade = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/AutoGrade.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: parseInt(props.examID) }
        }
        console.log('fired')
        axios.request(grade).then((response) => {
            if (!!response.data) {
                console.log(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <tr className={`exam-entry ${props.odd ? "odd" : "even"}`}>
            <th className='exam-id'>#{props.examID}</th>
            <th>{props.name}</th>
            <td className='edit-cell'>{!props.isStudent ? <div> <Link className='edit-link' to={redirect} ><EditIcon className='edit-icon'>Edit</EditIcon></Link> <Link to={gradeLink}><Button text="Grade" /></Link> <Button text="Auto" clickFunc={autoGrade} /> </div> : <Link className='edit-link' to={redirect}><Button text="TAKE EXAM" /></Link>}</td>
        </tr>

    )
}

export default ExamEntry