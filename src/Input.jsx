import { useState } from "react";

const Input = ({ type = "text" }) => {

    const [value, setValue] = useState("");

    return (
        <>
            <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </>
    );
};

export default Input;
