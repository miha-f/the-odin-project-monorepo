import { useState } from 'react'
import './App.css'
import Header from './Header'
import FormManager from './FormManager';
import ContactForm from './ContactForm';
import EducationForm from './EducationForm';

function App() {
    const [isEditMode, setIsEditMode] = useState(true);

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
    };


    return (
        <>
            <Header isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
            <main>
                <h2>Contact</h2>
                <ContactForm isEditMode={isEditMode} />
                <hr />

                <FormManager
                    FormComponent={EducationForm}
                    title="Education"
                    isEditMode={isEditMode}
                />
                <hr />

                <FormManager
                    FormComponent={EducationForm}
                    title="Past experience"
                    isEditMode={isEditMode}
                />
                <hr />
            </main>
        </>
    )
}

// app is my main layout
// 2 modes: edit, view
// contact form
// education form - extends to add more education
// job experience form - extends

export default App
