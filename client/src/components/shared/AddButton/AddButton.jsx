import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import './AddButton.css'
const AddButton = (props) => {
    return (
        <button className='add-btn-wrapper' onClick={props.clickFunc}>  Add New <AddIcon /></button>
    )
}

export default AddButton