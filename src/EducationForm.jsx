import Input from './Input'
import './EducationForm.css'

const EducationForm = ({ isEditMode }) => {

    return (
        <>
            <div class="contact-form">
                <Input isEditMode={isEditMode} label="Education name" />
                <Input isEditMode={isEditMode} label="Education title" />
                <Input isEditMode={isEditMode} label="Address" />
                <Input isEditMode={isEditMode} label="Start date" />
                <Input isEditMode={isEditMode} label="End date" />
            </div>
        </>

    );
}

export default EducationForm;
