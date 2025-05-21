import { Form } from 'radix-ui';
import { login as apiLogin } from '../../api/auth';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = Object.fromEntries(new FormData(e.currentTarget));

        const { data, error } = await apiLogin({
            username: form.username,
            password: form.password,
        });

        // TODO(miha): Show this error to user
        // TODO(miha): Set serverside errors
        // TODO(miha): Need to map this errors
        if (error && error.validationErrors) {
            return
        }

        // TODO(miha): Unknown error, say something went wrong at the top of form
        // or somehing
        if (error) {
            return
        }

        const [loginData, loginError] = await login({
            username: form.username,
            password: form.password,
        });

        // TODO(miha): write to context

        navigate("/");
    };

    // TODO(miha): there is much more we can do with form (server side validation errors),
    // check: https://www.radix-ui.com/primitives/docs/components/form

    return (
        <Form.Root
            onSubmit={handleSubmit}
            className="mb-2"
        >
            <Form.Field name="username" className="mb-2">
                <div className="flex flex-col items-baseline justify-between">
                    <Form.Label className="text-text text-semibold text-2xl">Username</Form.Label>
                    <Form.Message match="valueMissing" className="text-error">Plesase enter your username</Form.Message>
                </div>
                <Form.Control asChild>
                    <input type="text" required className="border rounded-md px-2 py-1 text-sm mb-2" />
                </Form.Control>
            </Form.Field>

            <Form.Field name="password" className="mb-2">
                <div className="flex flex-col items-baseline justify-between">
                    <Form.Label className="text-text text-semibold text-2xl">Password</Form.Label>
                    <Form.Message match="valueMissing" className="text-error">Plesase enter your password</Form.Message>
                </div>
                <Form.Control asChild>
                    <input type="password" required className="border rounded-md px-2 py-1 text-sm mb-2" />
                </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
                <button className="border rounded-xl px-4 py-2 bg-primary text-background">
                    Login
                </button>
            </Form.Submit>
        </Form.Root>
    );
};

export default LoginForm;
