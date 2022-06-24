import { React, useEffect, useState } from 'react'
import axios from 'axios'
import AddButton from '../shared/AddButton/AddButton'
import ExamList from '../exams/ExamList'
import './ExamBank.css'
import { Dialog, TextField, DialogActions, DialogContentText, DialogContent, Button, DialogTitle } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ExamBank = (props) => {

    const [examData, setExamData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [examName, setExamName] = useState("");
    const [open, setOpen] = useState(false);

    let data;
    if (!props.isStudent)
        data = { teacherID: props.user.id, questions: true }
    else
        data = null;

    const postExams = {
        method: 'POST',
        url: "https://afsaccess4.njit.edu/~jdt34/GetTest.php",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
        data: data
    };
    useEffect(() => {
        setIsLoading(true);
        //Get Exam data
        getExams();
        setIsLoading(false);
    }, []);

    const getExams = () => {
        axios.request(postExams).then((response) => {
            console.log(response);
            if (!!response.data.tests) {
                console.log(response.data.tests)
                setExamData(response.data.tests)
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    const handleCreateExam = () => {
        const createExam = {
            method: 'POST',
            url: "https://afsaccess4.njit.edu/~jdt34/CreateTest.php",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
            data: { teacherID: props.user.id, questions: [], name: examName }
        };

        axios.request(createExam).then((response) => {
            console.log(response);
            if (!!response.data.testID) {
                console.log(response.data.testID)
                getExams();
            }
        }).catch((err) => {
            console.log(err);
        });
        setExamName("");
        handleClose();
    }

    const handleExamNameChange = (event) => {
        setExamName(event.target.value);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const openDialog = () => {
        setOpen(true);
    }

    return (
        <div className='exams-wrapper'>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a New Exam</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your exam.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Exam Name"
                        value={examName}
                        onChange={handleExamNameChange}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateExam}>Create Exam</Button>
                </DialogActions>
            </Dialog>
            {!props.isStudent ?
                <div className='exam-actions'>
                    <div className='exam-filters'>
                        <h2 style={{ marginLeft: '10px' }}>Exam Bank</h2>
                    </div>
                    <AddButton clickFunc={openDialog} />
                </div> :
                <div className='exam-actions'>
                    <h2>Exam Bank</h2>
                </div>}

            <div className='exam-list-wrapper'>
                <ExamList className="exam-list" exams={examData} getExams={getExams} isStudent={props.isStudent} />
            </div>
        </div>

    )
}

export default ExamBank