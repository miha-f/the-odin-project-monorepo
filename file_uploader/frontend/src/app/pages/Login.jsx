import LoginForm from "../../features/auth/LoginForm";

const Login = () => {
    return (
        <div className="flex flex-row">
            <div className="w-1/2 text-text p-4">
                <p>Welcome to the <strong>file uploader</strong>!</p>
                <p>Don't have an account? <a href="/register" className="underline"> Register now</a></p>
            </div>
            <div className="w-1/2">
                <LoginForm />
                <a href="#" className="text-text underline">Upload as guest</a>
            </div>
        </div>
    );
};

export default Login;
