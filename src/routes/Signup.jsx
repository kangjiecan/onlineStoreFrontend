import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [backendError, setBackendError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 

    const onSubmit = async (data) => {
        try {
            const host = import.meta.env.VITE_APP_HOST;
            const response = await fetch(`${host}/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setBackendError('');
                setSuccessMessage('Signup successful! You can now log in.'); 
                setTimeout(() => {
                    navigate('/login'); 
                }, 3000);
            } else {
                const errorData = await response.json();
                setBackendError(errorData.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            setBackendError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Signup</h1>
                    {successMessage ? (
                        <div className="alert alert-success text-center">
                            {successMessage}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Email Field */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>

                            {/* Password Field */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', {
                                        required: 'Password is required',
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/,
                                            message: 'Password must be at least 8 characters long, include uppercase, lowercase, one digit, and no spaces.',
                                        },
                                    })}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                <div className="form-text">
                                    Password must be at least 8 characters long, include uppercase, lowercase, one digit, and no spaces.
                                </div>
                            </div>

                            {/* First Name Field */}
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name:</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    {...register('firstName', { required: 'First name is required' })}
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                            </div>

                            {/* Last Name Field */}
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    {...register('lastName', { required: 'Last name is required' })}
                                />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                            </div>

                            <button type="submit" className="btn btn-primary w-100">Signup</button>
                        </form>
                    )}

                    {backendError && <div className="alert alert-danger mt-3">{backendError}</div>}
                </div>
            </div>
        </div>
    );
};

export default Signup;