import Input from './Input'
import './EducationForm.css'

const EducationForm = ({ id, isEditMode, index, removeForm }) => {
    const handleRemove = () => {
        removeForm(id);
    };

    return (
        <div class="education-form">
            <h3>Education Entry {index + 1}</h3>
            <Input isEditMode={isEditMode} label="Education name" />
            <Input isEditMode={isEditMode} label="Education title" />
            <Input isEditMode={isEditMode} label="Address" />
            <Input isEditMode={isEditMode} label="Start date" />
            <Input isEditMode={isEditMode} label="End date" />
            {isEditMode &&
                <button type="button" onClick={handleRemove}>Remove This Entry</button>
            }
        </div>
    );
}

export default EducationForm;
