import { React } from 'react'
import StudentExams from './StudentExams'
import ExamBank from './ExamBank'

const Landing = (props) => {

    if (props.userObj.type === "teacher")
        return <ExamBank user={props.userObj} />
    return <ExamBank user={props.userObj} isStudent={true} />
}

export default Landing