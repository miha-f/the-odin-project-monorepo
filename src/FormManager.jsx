import { useState } from "react";
import './FormManager.css';

function FormManager({ FormComponent, title, isEditMode, initialData = [{}] }) {
    const [formEntries, setFormEntries] = useState(initialData);

    const addForm = () => {
        setFormEntries((prev) => [...prev, {}]);
    };

    const removeForm = (index) => {
        setFormEntries((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div class="form-manager">
            <h2>{title}</h2>
            {formEntries.map((entry, index) => (
                <div key={index} class="form-container">
                    <FormComponent isEditMode={isEditMode} index={index} removeForm={removeForm} />
                </div>
            ))}
            <button onClick={addForm}>Add {title} Entry</button>
        </div>
    );
}

export default FormManager;
