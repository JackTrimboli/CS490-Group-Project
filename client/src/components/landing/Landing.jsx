import { React } from 'react'
import StudentLanding from './StudentLanding'
import TeacherLanding from './TeacherLanding'

const Landing = (props) => {

    if (props.userObj.type === "teacher")
        return <TeacherLanding />
    return <StudentLanding />
}

export default Landing