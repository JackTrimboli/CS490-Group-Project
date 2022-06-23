import { React, useState } from 'react'
import { TextField } from '@mui/material';
import './Question.css';

const Question = (props) => {

    let diffColor = "";
    switch (props.difficulty) {
        case "easy":
            diffColor = "easy";
            break;
        case "medium":
            diffColor = "med";
            break;
        case "hard":
            diffColor = "hard";
            break;
    }
    return (
        <tr className={`question ${props.odd ? "odd" : "even"}`}>
            <td onClick={() => props.clickFunc(props.question, props.type)} className='question-id'><b>#{props.questionId}</b></td>
            <td onClick={() => props.clickFunc(props.question, props.type)} className='question-text'>{props.text}</td>
            <td onClick={() => props.clickFunc(props.question, props.type)} className={`question-difficulty ${diffColor}`}>{diffColor}</td>
            <td onClick={() => props.clickFunc(props.question, props.type)} className='question-topic'><b>{props.topic}</b></td>
            {props.hasPoints ? <td><TextField size="small" type="number" onChange={(e) => props.handleChange(e.target.value, props.question)} label="pts" defaultValue={props.question.questionValue} /></td> : null}
        </tr>
    )
}

export default Question