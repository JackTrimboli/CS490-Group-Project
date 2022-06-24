import { React } from 'react'
import ExamEntry from './ExamEntry';
import './ExamList.css'

const ExamList = (props) => {

    const list = props.exams.map((each, index) => {
        let odd;
        if (index % 2 === 0)
            odd = false;
        else
            odd = true;
        return <ExamEntry className="entry" getExams={props.getExams} isStudent={props.isStudent} odd={odd} examID={each.testID} exam={each} questions={each.questions} name={each.testName} teacherID={each.teacherID} />
    })

    return (
        <table className='exam-table'>
            <tbody className='exam-table-body'>
                {list}
            </tbody>
        </table>
    )
}

export default ExamList