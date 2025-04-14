import { useState } from "react";
import './FormManager.css';

function FormManager({ FormComponent, title, isEditMode }) {
    const [formEntries, setFormEntries] = useState([{ id: crypto.randomUUID() }]);

    const addForm = () => {
        setFormEntries((prev) => [...prev, { id: crypto.randomUUID() }]);
    };

    const removeForm = (idToRemove) => {
        setFormEntries(formEntries.filter(({ id }) => id !== idToRemove));
    };

    return (
        <div class="form-manager">
            <h2>{title}</h2>
            {formEntries.map(({ id }, index) => (
                <div key={id} class="form-container">
                    <FormComponent id={id} isEditMode={isEditMode} index={index} removeForm={removeForm} />
                </div>
            ))}
            {isEditMode &&
                <button onClick={addForm}>Add {title} Entry</button>
            }
        </div>
    );
}

export default FormManager;
