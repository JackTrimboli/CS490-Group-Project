import { React, useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import { TextField } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './GradeExam.css'
import Button from '../shared/Button/Button';
import { Divider } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const GradeExam = (props) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [testID, setTestID] = useState(-1);
    const [scores, setScores] = useState([])
    const [newScores, setNewScores] = useState([])
    const [userID, setUserID] = useState("")
    const [pointsEarned, setPointsEarned] = useState([]);
    const [expanded, setExpanded] = useState('panel_0');
    const [testObj, setTestObj] = useState({});
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    const [showFunctionErrorMessage, setShowFunctionErrorMessage] = useState(false);
    const [showConstraintErrorMessage, setShowConstraintErrorMessage] = useState(false);
    const [showScoreErrorMessage, setShowScoreErrorMessage] = useState(false);
    const [containsFunctionError, setContainsFunctionError] = useState(false);
    const [containsConstraintError, setContainsConstraintError] = useState(false);
    const [containsScoreError, setContainsScoreError] = useState(false);
    const [max, setMax] = useState(0)
    const [totalEarned, setTotalEarned] = useState(0);

    let scoredata

    useEffect(() => {
        getScores();

    }, [])

    const getScores = () => {
        const test = searchParams.get("id");
        const user = searchParams.get("userID")
        if (test)
            setTestID(parseInt(test));
        if (user)
            setUserID(parseInt(user))

        scoredata = {
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
    }

    const calculateScores = (scoreList) => {
        let arr = []
        let testSum = 0;
        let testMax = 0;
        let sum = 0
        for (let i = 0; i < scoreList.length; i++) {
            sum += parseFloat(scoreList[i].functionActualScore)
            sum += parseFloat(scoreList[i].constraintActualScore)
            testMax += parseFloat(scoreList[i].questionValue)
            for (let j = 0; j < scoreList[i].scores.length; j++) {
                sum += parseFloat(scoreList[i].scores[j].actualScore)
            }
            arr.push(Math.round(100 * sum) / 100);
            testSum += (100 * sum / 100)

            sum = 0;
        }
        setTotalEarned(testSum)
        setMax(testMax)
        setPointsEarned(arr);
    }
    const updateScores = () => {

        let containsError = false;
        if (containsFunctionError) {
            containsError = true;
            setShowFunctionErrorMessage(true)
        }
        if (containsConstraintError) {
            containsError = true;
            setShowConstraintErrorMessage(true)
        }
        if (containsScoreError) {
            containsError = true;
            setShowScoreErrorMessage(true)
        }
        if (containsError)
            return;

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
        getScores()
        setShowUpdateSuccess(true);
    }

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleFunctionScoreChange = (index, event) => {
        let newTestObj = testObj;
        newTestObj.questions[index].functionActualScore = parseFloat(event.target.value);

        // let containsError = false;
        // for (let i = 0; i < newTestObj.questions.length; i++) {
        //     if (newTestObj.questions[i].functionScore < newTestObj.questions[i].functionActualScore || newTestObj.questions[i].functionActualScore < 0) {
        //         containsError = true;
        //         break;
        //     }
        // }
        // if (containsError)
        //     setContainsFunctionError(true);
        // else
        //     setContainsFunctionError(false);

        setTestObj(newTestObj);
    }

    const handleScoreChange = (index, subIndex, event) => {
        let newTestObj = testObj;
        newTestObj.questions[index].scores[subIndex].actualScore = parseFloat(event.target.value);

        // let containsError = false;
        // for (let i = 0; i < newTestObj.questions.length; i++) {
        //     for (let j = 0; j < newTestObj.questions[i].scores.length; j++) {
        //         if (newTestObj.questions[i].scores[j].autoScore < newTestObj.questions[i].scores[j].actualScore || newTestObj.questions[i].scores[j].actualScore < 0) {
        //             containsError = true;
        //             break;
        //         }
        //     }
        // }
        // if (containsError)
        //     setContainsScoreError(true)
        // else
        //     setContainsScoreError(false)
        setTestObj(newTestObj);
    }

    const handleConstraintScoreChange = (index, event) => {
        let newTestObj = testObj;
        newTestObj.questions[index].constraintActualScore = parseFloat(event.target.value);

        // let containsError = false;
        // for (let i = 0; i < newTestObj.questions.length; i++) {
        //     if (newTestObj.questions[i].constraintScore < newTestObj.questions[i].constraintActualScore || newTestObj.questions[i].constraintActualScore < 0) {
        //         containsError = true;
        //         break;
        //     }
        // }

        // if (containsError)
        //     setContainsConstraintError(true)
        // else
        //     setContainsConstraintError(false)

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
                    <div><h3>Total Score:</h3></div>
                    <div style={{ height: '100%', margin: 'auto 0' }}><Button clickFunc={updateScores} text="Update Question Info" /></div>
                </div>
                :
                <div style={{ width: '90%', display: 'flex', justifyContent: "space-between" }}>
                    <div><h2>{props.user.name}'s Grades for Test #{testID}</h2></div>
                    <div><h2>Total Score: {Math.round(totalEarned * 100) / 100}/{max} ({Math.round((totalEarned / max * 100) * 100) / 100}%)</h2></div>
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
                                            <th>Max Points</th>
                                            <th>Points Earned</th>
                                        </tr>
                                        <tr>
                                            <th>Function Name</th>
                                            <td>{res.functionName}</td>
                                            <td>{res.functionName}</td>
                                            <td>{res.testFunctionName}</td>
                                            <td>{res.funcConstraint !== "none" ?
                                                Math.round(res.questionValue / (res.scores.length + 2) * 1000) / 1000
                                                : Math.round(res.questionValue / (res.scores.length + 1) * 1000) / 1000}</td>
                                            <td>
                                                {!props.isStudent ?
                                                    <TextField
                                                        onChange={(e) => handleFunctionScoreChange(index, e)}
                                                        type="number"
                                                        defaultValue={parseFloat(res.functionActualScore)} />
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
                                                <td>{res.funcConstraint}</td>
                                                <td>{res.constraintActualScore > 0 ? "Correct" : "Incorrect"}</td>
                                                <td>{res.funcConstraint !== "none" ?
                                                    Math.round(res.questionValue / (res.scores.length + 2) * 1000) / 1000
                                                    : Math.round(res.questionValue / (res.scores.length + 1) * 1000) / 1000}</td>
                                                <td>
                                                    {!props.isStudent ?
                                                        <TextField
                                                            min="0"
                                                            onChange={(e) => handleConstraintScoreChange(index, e)}
                                                            defaultValue={parseFloat(res.constraintActualScore)}

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
                                                    <td>{res.funcConstraint !== "none" ?
                                                        Math.round(res.questionValue / (res.scores.length + 2) * 1000) / 1000
                                                        : Math.round(res.questionValue / (res.scores.length + 1) * 1000) / 1000}</td>
                                                    <td>
                                                        {!props.isStudent ?
                                                            <TextField
                                                                type="number"
                                                                min="0"
                                                                onChange={(e) => handleScoreChange(index, idx, e)}
                                                                defaultValue={parseFloat(element.actualScore)}
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
            <Snackbar open={showUpdateSuccess} autoHideDuration={6000} onClose={() => setShowUpdateSuccess(false)}>
                <MuiAlert onClose={(() => setShowUpdateSuccess(false))} severity="success" sx={{ width: '100%' }} className="Mui-success">
                    Test Successfully Updated!
                </MuiAlert>
            </Snackbar>
            <Snackbar open={showFunctionErrorMessage} autoHideDuration={6000} onClose={() => setShowFunctionErrorMessage(false)}>
                <MuiAlert onClose={(() => setShowFunctionErrorMessage(false))} severity="error" sx={{ width: '100%' }} className="Mui-error">
                    Failed to update: Points entered incorrectly for function name. Make sure all point values are between 0 and the max score.
                </MuiAlert>
            </Snackbar>
            <Snackbar open={showConstraintErrorMessage} autoHideDuration={6000} onClose={() => setShowConstraintErrorMessage(false)}>
                <MuiAlert onClose={(() => setShowConstraintErrorMessage(false))} severity="error" sx={{ width: '100%' }} className="Mui-error">
                    Failed to update: Points entered incorrectly for at least one constraint. Make sure all point values are between 0 and the max score.
                </MuiAlert>
            </Snackbar>
            <Snackbar open={showScoreErrorMessage} autoHideDuration={6000} onClose={() => setShowScoreErrorMessage(false)}>
                <MuiAlert onClose={(() => setShowScoreErrorMessage(false))} severity="error" sx={{ width: '100%' }} className="Mui-error">
                    Failed to update: Points entered incorrectly for at least one testcase. Make sure all point values are between 0 and the max score.
                </MuiAlert>
            </Snackbar>
        </div >
    )
}

export default GradeExam