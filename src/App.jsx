import { useState } from 'react'
import './App.css'
import Header from './Header'
import Input from './Input'

function App() {
    const [isEditMode, setIsEditMode] = useState(true);

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
    };


    return (
        <>
            <Header isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
            <Input label="Name" />
            <p>Hello</p>
        </>
    )
}

// app is my main layout
// 2 modes: edit, view
// contact form
// education form - extends to add more education
// job experience form - extends

export default App
