import { Form } from 'radix-ui';
import { useState } from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password, passwordRepeat });
    };

    // TODO(miha): there is much more we can do with form (server side validation errors),
    // check: https://www.radix-ui.com/primitives/docs/components/form

    return (
        <Form.Root
            onSubmit={handleSubmit}
            className="mb-2 bg-background"
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

            <Form.Field name="passwordRepeat" className="mb-2">
                <div className="flex flex-col items-baseline justify-between">
                    <Form.Label className="text-text text-semibold text-2xl">Confirm Password</Form.Label>
                    <Form.Message match="valueMissing" className="text-error">Plesase enter your confirm password</Form.Message>
                </div>
                <Form.Control asChild>
                    <input type="password" required className="border rounded-md px-2 py-1 text-sm mb-2" />
                </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
                <button className="border rounded-xl px-4 py-2 bg-primary text-background">
                    Register
                </button>
            </Form.Submit>
        </Form.Root>
    );
};

export default LoginForm;
