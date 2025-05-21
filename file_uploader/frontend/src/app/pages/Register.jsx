import RegisterForm from "../../features/auth/RegisterForm";

const Register = () => {
    return (
        <div className="flex flex-row">
            <div className="w-1/2 text-text p-4">
                <p>Thank you for considering our <strong>file uploader</strong> service!</p>
                <p>Already have an account? <a href="/login" className="underline">Login now</a></p>
            </div>
            <div className="w-1/2">
                <RegisterForm />
            </div>
        </div>
    );
};

export default Register;
