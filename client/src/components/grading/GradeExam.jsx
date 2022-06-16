import { React, useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import { TextField } from '@mui/material';

import './GradeExam.css'
import Button from '../shared/Button/Button';


const GradeExam = (props) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [testID, setTestID] = useState(-1);
    const [scores, setScores] = useState([])
    const [newScores, setNewScores] = useState([])
    const [userID, setUserID] = useState("")
    useEffect(() => {

        const test = searchParams.get("id");
        const user = searchParams.get("userID")
        if (test)
            setTestID(parseInt(test));
        if (user)
            setUserID(parseInt(user))

        const scores = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/GetScores.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: parseInt(test), userID: parseInt(user) }
        };

        axios.request(scores).then((response) => {
            if (!!response.data.questions) {
                console.log(response.data)
                setScores(response.data.questions)

                let arr = [];
                for (let i = 0; i < response.data.questions.length; i++) {
                    arr.push(response.data.questions[i].functionActualScore)
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [])

    const updateScores = () => {
        const scores = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/UpdateScores.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { scores: newScores }
        };
    }

    return (
        <div>
            <div><h2>Grades for User #{userID}, Test #{testID}</h2></div>
            <div className='sub-list'>
                <table>
                    <tbody>
                        <tr>
                            <th>QuestionID</th>
                            <th>Function Name</th>
                            {/* <th>{res.score}</th> */}
                            <th>Question Value</th>
                            <th> Question Score </th>
                        </tr>
                        {scores.map((res) => {
                            return (
                                <tr>
                                    <td>{res.questionID}</td>
                                    <td>{res.functionName}</td>
                                    {/* <td>{res.score}</td> */}
                                    <td>{parseInt(res.functionScore)}</td>
                                    <td> <TextField defaultValue={res.functionActualScore} /></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Button clickFunc={updateScores} text="Update Scores" />
            </div>
        </div>
    )
}

export default GradeExam