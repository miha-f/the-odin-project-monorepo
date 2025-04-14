import Input from './Input'
import './Form.css'

const JobForm = ({ id, isEditMode, index, removeForm }) => {
    const handleRemove = () => {
        removeForm(id);
    };

    return (
        <div class="form">
            <h3>Job Entry {index + 1}</h3>
            <Input isEditMode={isEditMode} label="Job name" />
            <Input isEditMode={isEditMode} label="Job title" />
            <Input isEditMode={isEditMode} label="Address" />
            <Input isEditMode={isEditMode} label="Start date" />
            <Input isEditMode={isEditMode} label="End date" />
            {isEditMode &&
                <button type="button" onClick={handleRemove}>Remove This Entry</button>
            }
        </div>
    );
}

export default JobForm;
