import { React, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamEditor.css'
import Question from '../questions/Question';
import AddButton from '../shared/AddButton/AddButton';
import { default as MyButton } from '../shared/Button/Button';
import { Dialog, TextField, DialogActions, DialogContentText, DialogContent, Button, DialogTitle, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ExamEditor = (props) => {

    const postQuestions = {
        method: 'POST',
        url: "https://afsaccess4.njit.edu/~jdt34/GetQuestionBank.php",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
        data: { teacherID: props.user.id }
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const [testID, setTestID] = useState(-1);
    const [questionData, setQuestionData] = useState([]);
    const [testData, setTestData] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const [selectTopic, setSelectedTopic] = useState("")
    const [search, setSearch] = useState("");
    const [topics, setTopics] = useState([])
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const test = searchParams.get("id");
        if (test)
            setTestID(parseInt(test));

        //Get all questions in question bank
        axios.request(postQuestions).then((response) => {
            if (!!response.data.questions) {
                console.log(response.data.questions)
                setQuestionData(response.data.questions)
            }
        }).catch((err) => {
            console.log(err);
        });

        const getExam = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/GetOneExam.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: test }
        };

        //Get the questions for this specific exam
        axios.request(getExam).then((response) => {
            if (!!response.data) {
                console.log(response.data)
                setTestData(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });

        getTopics();
    }, []);


    const getTopics = () => {
        const getTopics = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/GetTopics.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: {
                teacherID: parseInt(props.user.id),
            }
        };
        axios.request(getTopics).then((response) => {
            if (!!response.data) {
                console.log(response.data);
                setTopics(response.data.topics)
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const filterQuestions = () => {
        let newArr = questionData;
        let currIDs = [];
        if (!!testData.questions) {
            for (let i = 0; i < testData.questions.length; i++) {
                currIDs.push(testData.questions[i].questionID);
            }
            for (let i = 0; i < questionData.length; i++) {
                if (currIDs.includes(questionData[i].questionID)) {
                    const idx = newArr.indexOf(questionData[i])
                    newArr.splice(idx, 1)
                }
            }
            console.log(newArr);
            setQuestionData(newArr)
        }
    }

    const handleSelectTopicChange = (event) => {
        setSelectedTopic(event.target.value)
    }
    const handleDiffSelectChange = (event) => {
        setSelectedDifficulty(event.target.value)
    }
    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const swap = (question, type) => {
        console.log('swap triggered', question)
        let arr1 = questionData;
        let arr2 = testData.questions;
        let newTestData = testData;
        let idx;
        if (type === "exam") {
            arr1.push(question)
            idx = arr2.indexOf(question)
            arr2.splice(idx, 1);

        } else if (type === "question") {
            arr2.push(question)
            idx = arr1.indexOf(question)
            arr1.splice(idx, 1);
        }
        newTestData.questions = arr2;
        setTestData({ ...newTestData })
        setQuestionData([...arr1])
    }

    const updateExam = () => {
        let quests = []
        for (let i = 0; i < testData.questions.length; i++) {
            if (!testData.questions[i].questionValue) {
                setShowError(true)
                break;
            }
            quests.push({ 'id': parseInt(testData.questions[i].questionID), 'value': parseInt(testData.questions[i].questionValue) })
        }
        const update = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/EditExam.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: testID, questions: quests }
        };
        axios.request(update).then((response) => {
            if (!!response) {
                console.log(response);
            }
        }).catch((err) => {
            console.log(err);
        });
        setShowSuccess(true)
    }

    const handlePointsChange = (newPoints, question) => {
        let arr = testData.questions;
        let newData = testData;
        arr[testData.questions.indexOf(question)].questionValue = newPoints;
        newData.questions = arr;
        setTestData(newData);
    }

    const submitFilters = () => {
        const filterQuestionBank = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/GetQuestionBank.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: {
                teacherID: props.user.id,
                difficulty: selectedDifficulty ? selectedDifficulty : null,
                topic: selectTopic ? selectTopic : null,
                keyword: search,
            }
        };
        axios.request(filterQuestionBank).then((response) => {
            console.log(response)
            if (!!response.data.questions)
                setQuestionData(response.data.questions)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className='exam-editor-wrapper'>
            <div className='exam-editor-info'>
                Welcome to the exam editor. By clicking question that is currently in the exam, it is removed. By clicking a quick in the question bank, it is added to the exam. Happy testing!
            </div>
            <h3>{testData.testName}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', height: '50px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                    <div className='question-filters' style={{ width: '50%' }}>
                        <TextField
                            id="outlined-select-currency-native"
                            margin='normal'
                            label="Topic"
                            select
                            value={selectTopic}
                            onChange={handleSelectTopicChange}
                            style={{ width: '50%', marginRight: '2px' }}
                        >
                            <MenuItem key="None" value={null}>None</MenuItem>
                            {topics.map((option, index) => (
                                <MenuItem key={topics[index]} value={topics[index]}>
                                    {topics[index]}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-select-currency-native"
                            margin='normal'
                            label="Difficulty"
                            select
                            value={selectedDifficulty}
                            onChange={handleDiffSelectChange}
                            style={{ width: '50%', marginRight: '2px' }}
                        >
                            <MenuItem key="None" value={null}>None</MenuItem>
                            <MenuItem key="easy" value="easy">Easy</MenuItem>
                            <MenuItem key="medium" value="medium">Medium</MenuItem>
                            <MenuItem key="hard" value="hard">Hard</MenuItem>
                        </TextField>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                        <TextField
                            autoFocus
                            margin="normal"
                            id="name"
                            label="Keyword"
                            value={search}
                            onChange={handleSearchChange}
                            type="text"
                            variant="standard"
                            style={{ flex: '1 0', height: '100%', marginBottom: 'auto' }}
                        />
                        <Button onClick={submitFilters}>Apply Filters</Button>
                    </div>
                </div>
                <MyButton text="Update Exam" clickFunc={updateExam} />
            </div>



            <div className="splitscreen">
                <div className='exam-questions'>
                    <table className='exam-table'>
                        <caption><h3>Current Exam Questions:</h3></caption>
                        <tbody className='exam-table-body'>
                            {!!testData.questions ? testData.questions.map((each, index) => {
                                let odd;
                                if (index % 2 === 0)
                                    odd = false;
                                else
                                    odd = true;

                                return <Question hasPoints handleChange={handlePointsChange} clickFunc={swap} question={each} type="exam" odd={odd} questionId={each.questionID} text={each.questionText} difficulty={each.difficulty} topic={each.topic} />
                            }) : <tr><td>Currently no exam questions</td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className='exam-questions'>
                    <table className='exam-table'>
                        <caption><h3>Question Bank:</h3></caption>
                        <tbody className='exam-table-body'>
                            {!!questionData.length ? questionData.map((each, index) => {
                                let odd;
                                if (index % 2 === 0)
                                    odd = false;
                                else
                                    odd = true;

                                return <Question clickFunc={swap} question={each} type="question" odd={odd} questionId={each.questionID} text={each.questionText} difficulty={each.difficulty} topic={each.topic} />
                            })
                                : <tr><th><span>No Results!</span></th></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
                <MuiAlert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }} className="Mui-success">
                    Exam Successfully Updated.
                </MuiAlert>
            </Snackbar>
            <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)}>
                <MuiAlert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }} className="Mui-error">
                    Error Updating Exam: All questions must have a point value
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default ExamEditor