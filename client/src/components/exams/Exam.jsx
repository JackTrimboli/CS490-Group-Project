import { React, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, TextField, DialogActions, DialogContentText, DialogContent, Button, DialogTitle } from '@mui/material';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import './Exam.css'
import { default as MyButton } from '../shared/Button/Button';

const Exam = (props) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [testID, setTestID] = useState(-1);
    const [testData, setTestData] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({})
    const [code, setCode] = useState("");
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const test = searchParams.get("id");
        if (test)
            setTestID(parseInt(test));

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
                setQuestions(response.data.questions)
                setCurrentQuestion(response.data.questions[0])
                let arr = [];
                for (let i = 0; i < response.data.questions.length; i++) {
                    arr.push("")
                }
                setAnswers(arr)
            }
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const nextQuestion = () => {
        let idx = questions.indexOf(currentQuestion)
        let answer = code
        let arr = answers;
        arr[idx] = code
        setAnswers(arr)
        setCode(answers[idx + 1])
        setCurrentQuestion(questions[idx + 1]);
    }
    const prevQuestion = () => {
        let idx = questions.indexOf(currentQuestion)
        let answer = code;
        let arr = answers;
        arr[idx] = code;
        setAnswers(arr)
        setCode(answers[idx - 1])
        setCurrentQuestion(questions[idx - 1]);
    }
    const handleSubmit = () => {
        let arr = answers;
        arr[arr.length - 1] = code;
        setAnswers(arr);
        let quests = []
        for (let i = 0; i < questions.length; i++) {
            quests[i] = { 'ID': parseInt(questions[i].questionID), 'answer': answers[i] }
        }

        const submitExam = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/ExamSubmit.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { testID: testID, userID: parseInt(props.user.id), questions: quests }
        };
        axios.request(submitExam).then((response) => {
            if (!!response.data) {
                console.log(response.data)
            }
        }).catch((err) => {
            console.log(err);
        });
        navigate('/Exams')
    }

    return (
        <div className='exam-wrapper'>
            <h2>{testData.testName}</h2>
            <div className='minimap'>
                {questions.map((each, index) => {
                    return (
                        <button onClick={() => setCurrentQuestion(questions[index])}>Question #{index + 1}</button>
                    )
                })}
            </div>
            <h4>Question {questions.indexOf(currentQuestion) + 1} out of {questions.length}</h4>
            <p>{currentQuestion.questionText} ({currentQuestion.questionValue} pts.)</p>
            <Editor

                className='exam-code'
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, languages.python)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 16,
                }}
            />
            <div className='exam-buttons'>
                <Button disabled={questions.indexOf(currentQuestion) === 0} onClick={prevQuestion}>Prev</Button>
                <Button disabled={questions.indexOf(currentQuestion) === questions.length - 1} onClick={nextQuestion}>Next</Button>
                {(questions.indexOf(currentQuestion) === questions.length - 1) ? <Button onClick={handleSubmit}>Submit</Button> : null}
            </div>
        </div >
    )
}

export default Exam