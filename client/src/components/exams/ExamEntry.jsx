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
        console.log('autograde fired')
        axios.request(grade).then((response) => {
            if (!!response.data) {
                console.log(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });
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


    }

    return (
        <tr className={`exam-entry ${props.odd ? "odd" : "even"}`}>
            <th className='exam-id'>#{props.examID}</th>
            <th>{props.name}</th>
            <td className='edit-cell'>
                {!props.isStudent ? //Teacher Exam Entry
                    <div>
                        <Link className='edit-link' to={redirect} >
                            <EditIcon className='edit-icon'>Edit</EditIcon>
                        </Link>
                        <Link to={gradeLink}>
                            <Button text="Grade" />
                        </Link>
                        {props.exam.autoGrading === "1" && props.exam.gradesReleased === "0" ? <Button disabled text="Auto" clickFunc={autoGrade} /> : <Button text="Auto" clickFunc={autoGrade} />}
                        {props.exam.testReleased === "1" && props.exam.autoGrade === "0" && props.exam.gradesReleased === "0" ? <Button disabled text="Release Test" clickFunc={releaseTest} /> : <Button text="Release Test" clickFunc={releaseTest} />}
                        {props.exam.gradesReleased === "1" ? <Button disabled text="Release Grades" clickFunc={releaseGrades} /> : <Button text="Release Grades" clickFunc={releaseGrades} />}
                    </div> : //Student Exam Entry
                    <div>
                        {props.exam.autoGrading === "1" && props.exam.gradesReleased === "1" ?
                            <Link className='edit-link' to={gradeLink}>
                                <Button text="SEE GRADES" />
                            </Link> :
                            <Button disabled text="SEE GRADES" />
                        }
                        {props.exam.testReleased === "1" && props.exam.autoGrading === "0" ?
                            <Link className='edit-link' to={redirect}>
                                <Button text="TAKE EXAM" />
                            </Link> :
                            <Button text="TAKE EXAM" disabled />
                        }
                    </div>}
            </td>
        </tr>

    )
}

export default ExamEntry