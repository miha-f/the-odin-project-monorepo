import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiClient";
import { tryCatch } from "@/utils/tryCatch";

export default function Login() {
    const { refetch, saveToken } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errs: { username?: string; password?: string } = {};
        if (!form.username.trim()) {
            errs.username = "Username is required";
        }
        if (!form.password) {
            errs.password = "Password is required";
        }
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Example POST with fetch:
            const { data, error } = await tryCatch<{ msg: { token: string } }>(
                api.post("/auth/login", form)
            );

            if (error || !data.msg || !data.msg.token) {
                // TODO(miha): Don't trow errors, make them visible to user - alert or something
                throw new Error("Login failed");
            }

            saveToken(data.msg.token);
            refetch();
        } catch (err) {
            // TODO(miha): Handle err
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={form.username}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Sign In
                    </button>
                </form>
                <p className="flex flex-col text-sm text-center text-gray-600 mt-4">
                    <span>
                        Don't have an account?{" "}
                        <a href="/register" className="text-indigo-600 hover:underline">Register</a>
                    </span>
                    <span>
                        Return{" "}
                        <a
                            href="/"
                            className="text-indigo-600 hover:underline transition"
                        >
                            Home
                        </a>
                    </span>
                </p>
            </div>
        </main>
    );
}

