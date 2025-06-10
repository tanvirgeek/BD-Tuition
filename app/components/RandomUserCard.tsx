"use client"

import Image from "next/image";
import { FaArrowRight, FaCircleUser } from "react-icons/fa6";
import { UserData } from "../dashboard/page";
import Link from "next/link";
import React, { useEffect, useState } from 'react'
import { useAuthStore } from "@/store/store";

const RandomUserCard = () => {

    const [teachers, setTeachers] = useState([])
    const [students, setStudents] = useState([])

    const {isAuthenticated} = useAuthStore();

    useEffect(() => {
        fetchTeachers();
        fetchStudents();
    }, [])

    const fetchTeachers = async () => {
        try {
            const res = await fetch("/api/teachers", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) throw new Error("Failed to fetch teachers");
            const teachersData = await res.json();

            setTeachers(teachersData.data)
        } catch (error) {
            console.log("error in fetchTeachers")
        }
    }

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/students", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!res.ok) throw new Error("Failed to fetch students");
            const studentsData = await res.json();

            setStudents(studentsData.data)
        } catch (error) {
            console.log("error in fetchStudents")
        }
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1px_auto] gap-6">
            {/* Teachers Section */}
            <div>
                <h2 className="text-2xl w-max lg:mx-auto font-semibold mb-4">Teachers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teachers.map((teacher: UserData) => (
                        <UserCardForNotLoggedin key={teacher.firebaseId} userData={teacher} />
                    ))}
                </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] bg-gray-300"></div>

            {/* Students Section */}
            <div>
                <h2 className="text-2xl w-max lg:mx-auto font-semibold mb-4">Students</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {students.map((student: UserData) => (
                        <UserCardForNotLoggedin key={student.firebaseId} userData={student} />
                    ))}
                </div>
            </div>
        </div>)
}

export default RandomUserCard;


export function UserCardForNotLoggedin({ userData }: { userData: UserData }) {

    return (
        <div className="bg-base-200 text-base-content rounded-2xl shadow-lg p-4 flex flex-col gap-4">
            {/* Profile Image */}
            {userData.userInfo.profileImg ? (
                <Image
                    src={userData.userInfo.profileImg}
                    height={300}
                    width={400}
                    alt="Profile Image"
                    className="rounded-lg object-cover object-top md:object-center h-64 w-full"
                />
            ) : (
                <div className="h-64 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <FaCircleUser className="text-gray-400 h-32 w-32" />
                </div>
            )}

            {/* User Info */}
            <div className="p-4">
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-sm text-base-content">{userData.role}</p>
                <p className="text-sm">Subjects: {userData.userInfo.interestedSubjects}</p>
                <p className="text-sm">Institution: {userData.userInfo.institutionName}</p>

                {userData.userInfo.experience > 0 && (
                    <p className="text-sm">Experience: {userData.userInfo.experience} years</p>
                )}
                <p className="text-sm">District: {userData.userInfo.district}</p>
                <p className="text-sm">Upazila: {userData.userInfo.upazila}</p>

                <label htmlFor="my_modal_6" className="btn btn-ghost btn-sm px-1 mt-2 flex self-center">
                    See details
                    <FaArrowRight />
                </label>

                <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                <div className="modal" role="dialog">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">Please Register for free!!!</h3>
                        <p className="py-4">To see details and use advanced features register for free to find teachers and students!</p>

                        <div>
                            <Link href={"/register"}>
                                <div className="flex gap-2 items-center">
                                    <p className=" text-sm">Don't have an account?</p>
                                    <p className="btn btn-sm">register</p>

                                </div>

                            </Link>

                        </div>
                        <div className="modal-action">
                            <label htmlFor="my_modal_6" className="btn">Close!</label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}