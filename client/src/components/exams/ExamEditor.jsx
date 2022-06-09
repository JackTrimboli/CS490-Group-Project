import { React, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamEditor.css'
import Question from '../questions/Question';
import AddButton from '../shared/AddButton/AddButton';
import Button from '../shared/Button/Button';

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
    }, []);

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
        navigate('/Exams')
    }

    const handlePointsChange = (newPoints, question) => {
        let arr = testData.questions;
        let newData = testData;
        arr[testData.questions.indexOf(question)].questionValue = newPoints;
        newData.questions = arr;
        setTestData(newData);
    }

    return (
        <div className='exam-editor-wrapper'>
            <div className='exam-editor-info'>
                Welcome to the exam editor. By clicking question that is currently in the exam, it is removed. By clicking a quick in the question bank, it is added to the exam. Happy testing!
            </div>
            <h3>{testData.testName}</h3>
            <Button text="Update Exam" clickFunc={updateExam} />
            <div className="splitscreen">
                <div className='exam-questions'>
                    <table className='exam-table'>
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
                <div className='remaining-questions'>
                    <table className='exam-table'>
                        <tbody className='exam-table-body'>
                            {!!questionData ? questionData.map((each, index) => {
                                let odd;
                                if (index % 2 === 0)
                                    odd = false;
                                else
                                    odd = true;

                                return <Question clickFunc={swap} question={each} type="question" odd={odd} questionId={each.questionID} text={each.questionText} difficulty={each.difficulty} topic={each.topic} />
                            })
                                : <tr><td>Currently no questions in your question bank</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ExamEditor