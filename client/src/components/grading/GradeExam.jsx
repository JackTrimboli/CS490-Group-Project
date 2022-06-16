import { React, useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import { FormLabel, TextField } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './GradeExam.css'
import Button from '../shared/Button/Button';
import { Divider } from '@mui/material';


const GradeExam = (props) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [testID, setTestID] = useState(-1);
    const [scores, setScores] = useState([])
    const [newScores, setNewScores] = useState([])
    const [userID, setUserID] = useState("")
    const [pointsEarned, setPointsEarned] = useState([]);
    const [expanded, setExpanded] = useState('panel_0');
    const [testObj, setTestObj] = useState({});


    useEffect(() => {

        const test = searchParams.get("id");
        const user = searchParams.get("userID")
        if (test)
            setTestID(parseInt(test));
        if (user)
            setUserID(parseInt(user))

        const scoredata = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/GetScores.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: parseInt(test), userID: parseInt(user) }
        };
        if (props.isStudent)
            scoredata.data = { testID: parseInt(test), userID: parseInt(props.user.id) }

        axios.request(scoredata).then((response) => {
            if (!!response.data.questions) {
                console.log(response.data)
                setTestObj(response.data)
                setScores(response.data.questions)
                calculateScores(response.data.questions)
            }
        }).catch((err) => {
            console.log(err);
        });

    }, [])

    const calculateScores = (scoreList) => {
        let arr = []
        let sum = 0
        for (let i = 0; i < scoreList.length; i++) {
            sum += parseFloat(scoreList[i].functionActualScore)
            for (let j = 0; j < scoreList[i].scores.length; j++) {
                sum += parseFloat(scoreList[i].scores[j].actualScore)
            }
            arr.push(Math.round(100 * sum) / 100);

            sum = 0;
        }
        setPointsEarned(arr);
    }
    const updateScores = () => {

        const scoreData = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/UpdateScores.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: testObj
        };
        axios.request(scoreData).then((response) => {
            if (!!response.data) {
                console.log(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleFunctionScoreChange = (index, event) => {
        let newTestObj = testObj;
        newTestObj.questions[index].functionActualScore = parseFloat(event.target.value);
        setTestObj(newTestObj);
    }
    const handleScoreChange = (index, subIndex, event) => {
        let newTestObj = testObj;
        newTestObj.questions[index].scores[subIndex].actualScore = parseFloat(event.target.value);
        setTestObj(newTestObj);
    }
    const handleConstraintScoreChange = (index, event) => {
        let newTestObj = testObj;
        newTestObj.questions[index].constraintActualScore = parseFloat(event.target.value);
        setTestObj(newTestObj);
    }
    const handleCommentChange = (index, event) => {
        let newTestObj = testObj;
        newTestObj.questions[index].comment = (event.target.value);
        setTestObj(newTestObj);
    }

    return (
        <div className='grade-exam-wrapper'>
            {!props.isStudent ?
                <div style={{ width: '90%', display: 'flex', justifyContent: "space-between" }}>
                    <div><h2>Grades for Student #{userID} | Test #{testID}</h2></div>
                    <div style={{ height: '100%', margin: 'auto 0' }}><Button clickFunc={updateScores} text="Update Question Info" /></div>
                </div>
                :
                <div style={{ width: '90%', display: 'flex', justifyContent: "space-between" }}>
                    <div><h2>{props.user.name}'s Grades for Test #{testID}</h2></div>
                </div>
            }
            <div className='sub-list'>
                {scores.map((res, index) => {
                    return (
                        <Accordion style={{ width: '100%', margin: '0' }} key={res.questionID} onChange={handleChange(`panel_${index}`)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{ alignContent: 'center', backgroundColor: '#dcecf7' }} expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ width: '10%', flexShrink: 0 }} variant='h5'> #{index + 1}</Typography>
                                <Typography sx={{ width: '15%', flexShrink: 0 }} ><b>{res.functionName}</b></Typography>
                                <Typography noWrap sx={{ width: '33%', flexShrink: 0 }} >{res.questionText}</Typography>
                                <Typography>{pointsEarned[index]}/{res.questionValue}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant='h6' gutterBottom>Point Breakdown</Typography>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            <th>TestCase Input </th>
                                            <th>Expected Output</th>
                                            <th>Your Output</th>
                                            <th>Points Earned</th>
                                        </tr>
                                        <tr>
                                            <th>Function Name</th>
                                            <td>{res.functionName}</td>
                                            <td>{res.functionName}</td>
                                            <td>{res.testFunctionName}</td>
                                            <td>
                                                {!props.isStudent ?
                                                    <TextField
                                                        onChange={(e) => handleFunctionScoreChange(index, e)}
                                                        type="number"
                                                        defaultValue={res.functionActualScore} />
                                                    :
                                                    <p>{res.functionActualScore}</p>
                                                }
                                            </td>
                                        </tr>
                                        {res.funcConstraint === "none" ?
                                            <tr>
                                                <th>Constraint</th>
                                                <td>N/A</td>
                                                <td>N/A</td>
                                                <td>N/A</td>
                                                <td>
                                                    {!props.isStudent ?
                                                        <TextField disabled placeholder='N/A' />
                                                        : <p>N/A</p>
                                                    }
                                                </td>
                                            </tr>
                                            :
                                            <tr>
                                                <th>Contraint</th>
                                                <td>{res.funcConstraint}</td>
                                                <td>N/A</td>
                                                <td>N/A</td>
                                                <td>
                                                    {!props.isStudent ?
                                                        <TextField
                                                            onChange={(e) => handleConstraintScoreChange(index, e)}
                                                            defaultValue={res.constraintActualScore}
                                                            type="number"
                                                        /> :
                                                        <p>{res.constraintActualScore}</p>
                                                    }
                                                </td>
                                            </tr>

                                        }
                                        {res.scores.map((element, idx) => {
                                            return (
                                                <tr>
                                                    <th>Testcase #{idx + 1}</th>
                                                    <td>{res.functionName}({element.input})</td>
                                                    <td>{element.expectedOutput}</td>
                                                    <td>{element.actualOutput}</td>
                                                    <td>
                                                        {!props.isStudent ?
                                                            <TextField
                                                                type="number"
                                                                onChange={(e) => handleScoreChange(index, idx, e)}
                                                                defaultValue={element.actualScore}
                                                            /> : <p>{element.actualScore}</p>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <Divider />
                                <Typography variant='h6' gutterBottom>Answer</Typography>
                                <Typography variant="paragraph" gutterBottom style={{ whiteSpace: "pre-line" }}>{res.answer}</Typography>
                                <Divider />
                                <Typography variant='h6'  >Comments</Typography>
                                {!props.isStudent ?
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        margin="normal"
                                        defaultValue={res.comment}
                                        onChange={(e) => handleCommentChange(index, e)}
                                        placeholder="Add a comment here"
                                    /> :
                                    <p>{res.comment}</p>
                                }
                            </AccordionDetails>
                        </Accordion>)
                })}
            </div >
        </div >
    )
}

export default GradeExam