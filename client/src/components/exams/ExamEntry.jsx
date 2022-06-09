import React from 'react'
import './ExamEntry.css'
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Button from '../shared/Button/Button'

const ExamEntry = (props) => {

    let redirect;
    if (props.isStudent)
        redirect = '/take-exam/?id=' + props.examID;
    else
        redirect = '/edit-exam/?id=' + props.examID;

    return (
        <tr className={`exam-entry ${props.odd ? "odd" : "even"}`}>
            <th className='exam-id'>#{props.examID}</th>
            <th>{props.name}</th>
            <td className='edit-cell'>{!props.isStudent ? <Link className='edit-link' to={redirect} ><EditIcon className='edit-icon'>Edit</EditIcon></Link> : <Link className='edit-link' to={redirect}><Button text="TAKE EXAM" /></Link>}</td>
        </tr>

    )
}

export default ExamEntry