import { React, useState, useEffect } from 'react'
import axios from 'axios'
import './QuestionBank.css'
import AddButton from '../shared/AddButton/AddButton'
import QuestionList from './QuestionList'
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";
import { Dialog, TextField, DialogActions, DialogContentText, DialogContent, Button, DialogTitle } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import MenuItem from '@mui/material/MenuItem';
import Select from 'react-select';




const QuestionBank = (props) => {

    const postQuestions = {
        method: 'POST',
        url: "https://afsaccess4.njit.edu/~jdt34/GetQuestionBank.php",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
        data: { teacherID: props.user.id }
    };


    const [isLoading, setIsLoading] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [topics, setTopics] = useState([]);
    const [open, setOpen] = useState(false);
    const [difficulty, setDifficulty] = useState("easy");
    const [functionName, setFunctionName] = useState("");
    const [testCases, setTestCases] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");

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

    const diffOptions = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
    ]
    const override = css`
        opacity: 60%;
        margin-right: 40px;
    `;
    const handleClose = () => {
        setOpen(false);
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
    const handleTestCaseChange = (event) => {
        setTestCases(event.target.value);
    }
    const handleFunctionChange = (event) => {
        setFunctionName(event.target.value);
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

        const createQuestion = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/CreateQuestion.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: {
                teacherID: parseInt(props.user.id),
                question: questionText,
                functionName: functionName,
                testCases: [["1, 2", "3"], ["2, 2", "4"]],
                difficulty: difficulty,
                topic: selectedTopic,
            }
        };

        axios.request(createQuestion).then((response) => {

            console.log(response);
            if (!!response.data.questionID) {
                console.log("Create new question of ID: ", response.data.questionID)
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
            }
        }).catch((err) => {
            console.log(err);
        });
        setDifficulty("easy")
        setFunctionName("")
        setQuestionText("")
        setTestCases("")
        setSelectedTopic("")
        handleClose();
    }



    // if (isLoading) {
    //     return (
    //         <div className='questions-loader'>
    //             <PacmanLoader css={override} color='#2e8bc0' size={50} />
    //             <h3>Getting your questions...</h3>
    //         </div>
    //     )
    // } else {
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
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Test Cases"
                        helperText="In the format [['1', '2', '3'], ['1']]"
                        onChange={handleTestCaseChange}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
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
                        {/* <MenuItem key="10" value="10">ten</MenuItem>
                        <MenuItem key="20" value="20">twenty</MenuItem> */}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit Question</Button>
                </DialogActions>
            </Dialog>


            <div className='questions-actions'>
                <div className='question-filters'>
                    <Select options={diffOptions} />
                    <Select options={topics} />
                </div>
                <AddButton clickFunc={handleClick} />
            </div>
            {isLoading ?
                <div className='questions-loader'>
                    <PacmanLoader css={override} color='#2e8bc0' size={50} />
                    <h3>Getting your questions...</h3>
                </div> : questionData ?
                    <QuestionList questions={questionData} /> :
                    <div className='no-questions'>It seems your question bank is currently empty. Hit the 'add new' button to start adding questions!</div>
            }
        </div>
    )
}

export default QuestionBank