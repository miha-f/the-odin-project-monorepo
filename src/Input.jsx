import { useState } from "react";

const Input = ({ isEditMode, label, type = "text" }) => {

    const [value, setValue] = useState("");

    return (
        <div class="input-container">
            <label for={label}>{label}</label>
            {isEditMode ? (
                <input
                    id={label}
                    type={type}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            ) : (
                <p>{value}</p>
            )}
        </div>
    );
};

export default Input;
