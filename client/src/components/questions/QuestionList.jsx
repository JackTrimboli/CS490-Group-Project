import { React } from 'react'
import Question from './Question';
import './QuestionList.css';

const QuestionList = (props) => {
    const buffer = () => {
        return null;
    }
    const list = props.questions.map((each, index) => {
        let odd;
        if (index % 2 === 0)
            odd = false;
        else
            odd = true;
        return <Question className="question-list-question" clickFunc={buffer} odd={odd} questionId={each.questionID} text={each.questionText} difficulty={each.difficulty} topic={each.topic} />
    })

    return (
        <table className='question-list-wrapper'>
            <tbody>
                {list}
            </tbody>
        </table>
    )
}

export default QuestionList