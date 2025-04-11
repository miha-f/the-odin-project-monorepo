import { useState } from "react";

const Input = ({ label, type = "text" }) => {

    const [value, setValue] = useState("");

    return (
        <>
            <label for={label}>{label}</label>
            <input
                id={label}
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </>
    );
};

export default Input;
