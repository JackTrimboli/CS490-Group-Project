import { React, useState } from 'react'
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
    if (props.isStudent)
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
        axios.request(grade).then((response) => {
            if (!!response.data) {
                console.log(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });
        props.getExams()
    }

    const releaseTest = () => {
        const test = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/ReleaseTest.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: parseInt(props.examID) }
        }
        axios.request(test).then((response) => {
            if (!!response.data) {
                console.log(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });
        props.getExams()
    }

    const releaseGrades = () => {
        const grading = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/ReleaseGrade.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: parseInt(props.examID) }
        }
        axios.request(grading).then((response) => {
            if (!!response.data) {
                console.log(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });
        props.getExams()
    }

    return (
        <div>
            <tr className={`exam-entry ${props.odd ? "odd" : "even"}`}>
                <th className='exam-id'>#{props.examID}</th>
                <th>{props.name}</th>
                <td className='edit-cell'>
                    {!props.isStudent ? //Teacher Exam Entry
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', height: 'fit-content' }}>
                            <Link className='edit-link' to={redirect} >
                                <EditIcon className='edit-icon'>Edit</EditIcon>
                            </Link>
                            <Link to={gradeLink}>
                                <Button text="Grade" />
                            </Link>
                            {parseInt(props.exam.autoGrading) === 1 ? <Button disabled text="Auto" clickFunc={autoGrade} /> : <Button text="Auto" clickFunc={autoGrade} />}
                            {parseInt(props.exam.testReleased) === 1 ? <Button disabled text="Release Test" clickFunc={releaseTest} /> : <Button text="Release Test" clickFunc={releaseTest} />}
                            {parseInt(props.exam.gradesReleased) === 1 ? <Button disabled text="Release Grades" clickFunc={releaseGrades} /> : <Button text="Release Grades" clickFunc={releaseGrades} />}
                        </div> : //Student Exam Entry
                        <div style={{ width: '100%', display: 'flex', justifyContent: "flex-end", height: 'fit-content' }}>
                            {parseInt(props.exam.autoGrading) === 1 && parseInt(props.exam.gradesReleased) === 1 ?
                                <Link className='edit-link' to={gradeLink} style={{ marginRight: "5px", padding: 0 }}>
                                    <Button text="SEE GRADES" />
                                </Link> :
                                <span style={{ marginRight: "5px" }}>
                                    <Button disabled text="SEE GRADES" style={{ marginRight: "5px", padding: 0 }} /></span>
                            }
                            {parseInt(props.exam.testReleased) === 1 && parseInt(props.exam.autoGrading) === 0 ?
                                <Link className='edit-link' to={redirect}>
                                    <Button text="TAKE EXAM" />
                                </Link> :
                                <Button text="TAKE EXAM" disabled />
                            }
                        </div>}
                </td>
            </tr>
        </div>
    )
}

export default ExamEntry