"use client";

import { auth } from "@/firebase/firebase";
import { useRegisterNavigation } from "@/store/store";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

import Image from "next/image";

interface FormData {
    name: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { setIsFromRegister } = useRegisterNavigation();

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState<string>("");
    const [areAllValid, setAreAllValid] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState(formData.role);
    const [isTeacherChecked, setIsTeacherChecked] = useState(selectedRole === 'TEACHER');
    const [isStudentChecked, setIsStudentChecked] = useState(selectedRole === 'STUDENT');

    const provider = new GoogleAuthProvider();

    const submitHandler = async (event: FormEvent) => {
        event.preventDefault();
        validedForm();
        if (!areAllValid) return;

        try {
            setIsFromRegister(true);
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseId: userCredential.user.uid,
                    name: formData.name,
                    role: formData.role,
                    email: formData.email,
                    isGoogleLogin: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            window.location.reload();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        }
    };

    const handleGoogleLogin = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const result = await signInWithPopup(auth, provider);
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseId: result.user.uid,
                    name: result.user.displayName,
                    role: formData.role,
                    email: result.user.email,
                    isGoogleLogin: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            setIsFromRegister(true);

            router.replace("/dashboard");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const validedForm = () => {
        setErrorMessage("");
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim()
        ) {
            setErrorMessage("Please Provide valid data !!!");
        }
    };

    const handleTeacherCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsTeacherChecked(checked);
        if (checked) {
            setIsStudentChecked(false);
            handleRoleChange('TEACHER');
        } else if (selectedRole === 'TEACHER') {
            handleRoleChange('');
        }
    };

    const handleStudentCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsStudentChecked(checked);
        if (checked) {
            setIsTeacherChecked(false);
            handleRoleChange('STUDENT');
        } else if (selectedRole === 'STUDENT') {
            handleRoleChange('');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === "name") {
            validateName(value);
        } else if (name === "email") {
            validateEmail(value);
        } else if (name === "password") {
            validatePassword(value);
        } else if (name === "confirmPassword") {
            validateConfirmPassword(value);
        }
    };
    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        const fakeChangeEvent = {
            target: {
                name: 'role',
                value: role,
            } as HTMLSelectElement,
            currentTarget: {
                name: 'role',
                value: role,
            } as HTMLSelectElement,
        } as ChangeEvent<HTMLSelectElement>;

        handleChange(fakeChangeEvent);

        setIsTeacherChecked(role === 'TEACHER');
        setIsStudentChecked(role === 'STUDENT');
    };

    const validateName = (value: string) => {
        if (value.trim().length > 2) {
            setNameErrorMessage("");
        } else {
            setNameErrorMessage("Name must be at least 3 characters");
        }
    };

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
            setEmailErrorMessage("");
        } else {
            setEmailErrorMessage("Please enter a valid email address.");
        }
    };

    const validatePassword = (value: string) => {
        if (value.length > 5) {
            setPasswordErrorMessage("");
        } else {
            setPasswordErrorMessage("Password must be at least 6 characters!");
        }
    };

    const validateConfirmPassword = (value: string) => {
        if (value === formData.password) {
            setConfirmPasswordErrorMessage("");
        } else {
            setConfirmPasswordErrorMessage("Password does not match!");
        }
    };

    useEffect(() => {
        if (nameErrorMessage) {
            setAreAllValid(false);
        } else if (
            formData.name &&
            formData.role &&
            formData.email &&
            formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword
        ) {
            setAreAllValid(true);
        } else {
            setAreAllValid(false);
        }
    }, [
        formData,
        nameErrorMessage,
        emailErrorMessage,
        passwordErrorMessage,
        confirmPasswordErrorMessage,
    ]);

    useEffect(() => {
        console.log("formdata changed: ", formData)
    }, [formData])

    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-screen-xl m-auto w-full justify-center items-center gap-4 px-4 py-4 lg:px-0">
            <div className=" text-4xl font-semibold ">Register !</div>

            <div className="flex flex-col gap-4 items-center w-4/5 md:w-2/6">
                <form className=" flex flex-col gap-2 w-full" onSubmit={submitHandler}>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <p>Want to be a Tutor???</p>
                            <input
                                type="checkbox"
                                checked={isTeacherChecked}
                                className="checkbox"
                                onChange={handleTeacherCheckboxChange}
                            />
                            <button
                                type="button"
                                className={`p-4 rounded-full ${selectedRole === 'TEACHER' ? 'bg-blue-200' : 'bg-gray-200'} hover:bg-blue-300`}
                                onClick={() => handleRoleChange('TEACHER')}
                            >
                                <Image src="/images/teacher.png" height={40} width={40} alt="teacher" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <p>Want to be a Student?</p>
                            <input
                                type="checkbox"
                                checked={isStudentChecked}
                                className="checkbox"
                                onChange={handleStudentCheckboxChange}
                            />
                            <button
                                type="button"
                                className={`p-4 rounded-full ${selectedRole === 'STUDENT' ? 'bg-blue-200' : 'bg-gray-200'} hover:bg-blue-300`}
                                onClick={() => handleRoleChange('STUDENT')}
                            >
                                <Image src="/images/reading.png" height={40} width={40} alt="student" />
                            </button>
                        </div>
                    </div>

                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            required
                            className="grow"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                        />
                    </label>
                    <p className="text-sm text-red-500 font-semibold">{nameErrorMessage}</p>

                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="email"
                            required
                            className="grow"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                    </label>
                    <p className="text-sm text-red-500 font-semibold">{emailErrorMessage}</p>

                    <label className="input input-bordered mt-2 flex items-center gap-2">
                        <input
                            type="password"
                            required
                            className="grow"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                    </label>
                    <p className="text-sm text-red-500 font-semibold">{passwordErrorMessage}</p>

                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="password"
                            required
                            className="grow"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                        />
                    </label>
                    <p className="text-sm text-red-500 font-semibold">{confirmPasswordErrorMessage}</p>

                    {errorMessage && <div className="text-sm text-red-500 font-semibold">{errorMessage}</div>}

                    <button className="btn w-full" disabled={!areAllValid}>
                        Signup
                    </button>
                </form>

                <dialog id="my_modal_3" className="modal">
                    <div className="modal-box p-5 py-28">
                        <form method="dialog">
                            <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <div className="flex flex-col gap-12">
                            <div className="flex items-center justify-between gap-2">
                                <p>Want to be a Tutor???</p>
                                <input
                                    type="checkbox"
                                    checked={isTeacherChecked}
                                    className="checkbox"
                                    onChange={handleTeacherCheckboxChange}
                                />
                                <button
                                    type="button"
                                    className={`p-4 rounded-full ${selectedRole === 'TEACHER' ? 'bg-blue-200' : 'bg-gray-200'} hover:bg-blue-300`}
                                    onClick={() => handleRoleChange('TEACHER')}
                                >
                                    <Image src="/images/teacher.png" height={40} width={40} alt="teacher" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <p>Want to be a Student?</p>
                                <input
                                    type="checkbox"
                                    checked={isStudentChecked}
                                    className="checkbox"
                                    onChange={handleStudentCheckboxChange}
                                />
                                <button
                                    type="button"
                                    className={`p-4 rounded-full ${selectedRole === 'STUDENT' ? 'bg-blue-200' : 'bg-gray-200'} hover:bg-blue-300`}
                                    onClick={() => handleRoleChange('STUDENT')}
                                >
                                    <Image src="/images/reading.png" height={40} width={40} alt="student" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center mt-16"> {/* Center the button */}
                            <button className="btn bg-lime-300 hover:bg-lime-400 h-12 w-32" onClick={handleGoogleLogin} disabled={!formData.role}>
                                Submit
                            </button>
                        </div>
                    </div>
                </dialog>

                <div
                    className="flex items-center gap-2 mt-2 cursor-pointer"
                    onClick={() => {
                        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
                        if (modal) {
                            modal.showModal();
                        }
                    }}
                >
                    <FcGoogle className="h-6 w-6" />
                    <p className="text-lg font-semibold">Sign up with Google</p>
                </div>

                <Link href={'/login'} className="flex flex-col self-start w-full">
                    <p className=" underline">Already have an account?</p>
                    <button className=" btn w-full mt-1">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;