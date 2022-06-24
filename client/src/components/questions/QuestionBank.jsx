import { React, useState, useEffect } from 'react'
import axios from 'axios'
import './QuestionBank.css'
import QuestionList from './QuestionList'
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";
import { Dialog, TextField, DialogActions, DialogContentText, DialogContent, Button, DialogTitle } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import MenuItem from '@mui/material/MenuItem';
import { default as MyButton } from '../shared/Button/Button'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';




const QuestionBank = (props) => {

    const postQuestions = {
        method: 'POST',
        url: "https://afsaccess4.njit.edu/~jdt34/GetQuestionBank.php",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
        data: { teacherID: props.user.id }
    };


    const [isLoading, setIsLoading] = useState(false);
    const [questionData, setQuestionData] = useState([]);
    const [topics, setTopics] = useState([]);
    const [open, setOpen] = useState(false);
    const [difficulty, setDifficulty] = useState("easy");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectTopic, setSelectTopic] = useState("");
    const [functionName, setFunctionName] = useState("");
    const [testCases, setTestCases] = useState([{ "input": "", "output": "" }])
    const [questionText, setQuestionText] = useState("");
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [constraint, setConstraint] = useState("none");
    const [isDropdown, setIsDropDown] = useState(true);
    const [search, setSearch] = useState("");
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        //get questions
        axios.request(postQuestions).then((response) => {
            console.log(response);
            if (!!response.data.questions) {
                console.log(response.data.questions)
                setQuestionData(response.data.questions)
            }
        }).catch((err) => {
            console.log(err);
        });
        getTopics();
        setIsLoading(false);
    }, [])


    const override = css`
        opacity: 60%;
        margin-right: 40px;
    `;
    const handleClose = () => {
        setOpen(false);
        setDifficulty("easy")
        setFunctionName("")
        setQuestionText("")
        setTestCases([{ "input": "", "output": "" }])
        setSelectedTopic("")
    };
    const handleClick = () => {
        setOpen(true);
    }

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    }
    const handleTopicChange = (event) => {
        setSelectedTopic(event.target.value);
    }
    const handleQuestionTextChange = (event) => {
        setQuestionText(event.target.value);
    }
    const handleTestCaseChange = (event, i) => {
        let vals = testCases;
        vals[i][event.target.name] = event.target.value
        setTestCases(vals)
    }
    const handleFunctionChange = (event) => {
        setFunctionName(event.target.value);
    }
    const handleConstraintChange = (event) => {
        setConstraint(event.target.value)
    }

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


    const handleSubmit = () => {
        let tests = []
        for (let i = 0; i < testCases.length; i++) {
            const row = []
            row.push(testCases[i]["input"])
            row.push(testCases[i]["output"])
            tests.push(row)
        }
        const createQuestion = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/CreateQuestion.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: {
                teacherID: parseInt(props.user.id),
                question: questionText,
                functionName: functionName,
                testCases: tests,
                difficulty: difficulty,
                topic: selectedTopic,
                constraint: constraint
            }
        };

        axios.request(createQuestion).then((response) => {

            console.log(response);
            if (!!response.data.questionID) {
                let question = {
                    difficulty: difficulty,
                    functionName: functionName,
                    questionID: response.data.questionID,
                    questionText: questionText,
                    teacherID: props.user.id,
                    testCases: [["1, 2", "3"], ["2, 2", "4"]],
                    topic: selectedTopic,
                }
                const newData = [question, ...questionData]
                setQuestionData(newData);
                setShowSuccess(true)
            }
        }).catch((err) => {
            console.log(err);
        });
        getTopics();
        handleClose();
    }
    const handleAddTestCase = () => {
        setTestCases([...testCases, { "input": "", "output": "" }])
    }
    const toggleDropdown = () => {
        if (isDropdown)
            setIsDropDown(false)
        else
            setIsDropDown(true)
    }

    const handleDiffSelectChange = (event) => {
        setSelectedDifficulty(event.target.value)
    }
    const handleSelectTopicChange = (event) => {
        setSelectTopic(event.target.value)
    }
    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const submitFilters = () => {
        debugger;
        setIsLoading(true)
        const filterQuestions = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/GetQuestionBank.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: {
                teacherID: parseInt(props.user.id),
                difficulty: selectedDifficulty ? selectedDifficulty : null,
                topic: selectTopic ? selectTopic : null,
                keyword: search,
            }
        };
        axios.request(filterQuestions).then((response) => {
            console.log(response)
            if (!!response.data.questions)
                setQuestionData(response.data.questions)
        }).catch((err) => {
            console.log(err)
        })
        setIsLoading(false)
    }


    return (
        <div className="questions-wrapper">
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a New Quiz Question</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Complete the form below to submit a new question to the question bank.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Function Name"
                        value={functionName}
                        onChange={handleFunctionChange}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Question Text"
                        value={questionText}
                        onChange={handleQuestionTextChange}
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                    />
                    <div>
                        <FormLabel style={{ marginTop: '10px' }} id="demo-radio-buttons-group-label">Test Cases</FormLabel>
                        {testCases.map((element, index) => {
                            return (
                                <div style={{ display: 'flex', marginBottom: '10px', justifyContent: "space-around" }}>
                                    <TextField
                                        autoFocus
                                        margin="normal"
                                        name="input"
                                        // value={element.input || ""}
                                        label={"Input #" + parseInt(index + 1)}
                                        onChange={(e) => handleTestCaseChange(e, index)}
                                        type="text"
                                        variant="standard"
                                    /><TextField
                                        autoFocus
                                        margin="normal"
                                        name="output"
                                        // value={element.output || ""}
                                        label={"Output #" + parseInt(index + 1)}
                                        onChange={(e) => handleTestCaseChange(e, index)}
                                        type="text"
                                        variant="standard"
                                    />
                                </div>
                            )
                        })}
                        <Button fullWidth onClick={handleAddTestCase}>Add TestCase</Button>
                    </div>
                    <FormLabel id="demo-radio-buttons-group-label">Difficulty</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={difficulty}
                        onChange={handleDifficultyChange}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="easy" control={<Radio />} label="Easy" />
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="hard" control={<Radio />} label="Hard" />
                    </RadioGroup>
                    <FormLabel id="demo-radio-buttons-group-label">Contraints</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={constraint}
                        onChange={handleConstraintChange}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="none" control={<Radio />} label="None" />
                        <FormControlLabel value="for" control={<Radio />} label="For Loop" />
                        <FormControlLabel value="while" control={<Radio />} label="While Loop" />
                        <FormControlLabel value="recursion" control={<Radio />} label="Recursion" />
                    </RadioGroup>
                    {isDropdown ?
                        <TextField
                            id="outlined-select-currency-native"
                            margin='normal'
                            label="Question Topic"
                            select
                            value={selectedTopic}
                            onChange={handleTopicChange}
                            helperText="Select the topic this question falls under"
                            fullWidth
                        >
                            {topics.map((option, index) => (
                                <MenuItem key={topics[index]} value={topics[index]}>
                                    {topics[index]}
                                </MenuItem>
                            ))}
                        </TextField>
                        :
                        <TextField
                            autoFocus
                            margin="normal"
                            id="name"
                            label="Enter Topic"
                            value={selectedTopic}
                            onChange={handleTopicChange}
                            type="text"
                            variant="standard"
                            fullWidth
                        />
                    }
                    <Button onClick={toggleDropdown}>{isDropdown ? <p>Create new topic</p> : <p>View dropdown</p>}</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit Question</Button>
                </DialogActions>
            </Dialog>
            <h2>Question Bank</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', height: 'fit-content', width: '100%' }}>
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
                <MyButton text="Add New Question" clickFunc={handleClick} />
            </div>

            {isLoading ?
                <div className='questions-loader'>
                    <PacmanLoader css={override} color='#2e8bc0' size={50} />
                    <h3>Getting your questions...</h3>
                </div>
                : questionData.length ?
                    <QuestionList questions={questionData} />
                    : <div className='no-questions'>No Results. Hit the 'add new' button to start adding questions!</div>
            }
            <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
                <MuiAlert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }} className="Mui-success">
                    Question Added
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default QuestionBank