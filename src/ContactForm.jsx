import Input from './Input'
import './ContactForm.css'

const ContactForm = ({ isEditMode }) => {

    return (
        <>
            <div class="form">
                <Input isEditMode={isEditMode} label="Name" />
                <Input isEditMode={isEditMode} label="Email" type="email" />
                <Input isEditMode={isEditMode} label="Telephone" type="tel" />
                <Input isEditMode={isEditMode} label="Address" />
            </div>
        </>

    );
}

export default ContactForm;
