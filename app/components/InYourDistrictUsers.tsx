"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import { FaRegCopy } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { FaCircleUser } from "react-icons/fa6";
import { useUserStore } from "@/store/store";


interface UserInfo {
    id: string;
    firebaseId: string;
    location: string;
    district: string;
    mobileNumber: string;
    institution: string;
    userClass: number;
    institutionName: string;
    department: string;
    year: number;
    experience: number;
    dateOfBirth: string; // ISO date string
    gender: string;
    description: string;
    isLookingFor: boolean;
    interestedSubjects: string[];
    profileImg: string;
    upazila: string;
}

interface UserData {
    id: string;
    firebaseId: string;
    name: string;
    email: string;
    role: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    userInfo: UserInfo; // Include the nested userInfo property
}


export const InYourDistrictUsers = () => {

    const [page, setPage] = useState(1);
    const [copied, setCopied] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user, userInfo } = useUserStore();


    const fetchUsers = async (page: number) => {
        try {
            setIsLoading(true);

            const baseUrl = "/api/users-by-district";
            const params = new URLSearchParams();

            if (user?.role) params.append('role', user.role);
            if (userInfo?.district) params.append('district', userInfo.district);

            params.append('page', page.toString());
            params.append('limit', '3');

            const queryString = `${baseUrl}?${params.toString()}`;
            const res = await fetch(queryString, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            // setUsers((prevUsers) => {
            //     const newUsers = data.data.filter(
            //         (incomingUser: UserData) => !prevUsers.some((existingUser) => existingUser.firebaseId === incomingUser.firebaseId)
            //     );
            //     return [...prevUsers, ...newUsers];
            // });

            setUsers((prev) => ([...prev, ...data.data]))
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching users:', error);
            setIsLoading(false);
        }
    };


    const handleImageClick = (imageSrc: string) => {
        setCurrentImage(imageSrc); // Set the clicked image's source
        setIsModalOpen(true); // Open the modal
    };

    const handleCopy = (id: string, text: string): void => {
        navigator.clipboard.writeText(text) // Copy text to clipboard
            .then(() => {
                setCopied(id); // Set the ID of the copied mobile number
                setTimeout(() => setCopied(null), 1000); // Clear the copied state after 2 seconds
            })
            .catch((error) => {
                console.error("Failed to copy text: ", error);
            });
    };

    const handleInfiniteScroll = async () => {

        try {
            if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                setPage((previous) => previous + 1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!isLoading) {
            fetchUsers(page);
        }


    }, [page]);

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);
        return () => window.removeEventListener("scroll", handleInfiniteScroll)
    }, [])

    return (
        <div className="px-4 py-4 lg:px-0">
            {users && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((userData) => (
                        <div key={userData.firebaseId}
                            className="rounded-2xl p-2 border border-slate-500 shadow-sm bg-stone-900 flex flex-col sm:flex-row gap-2"
                        >
                            <div

                                className="rounded-2xl w-full h-full p-2 border border-slate-500 shadow-sm bg-stone-900 flex flex-col sm:flex-row gap-2"
                            >
                                {userData.userInfo.profileImg && (
                                    <div className="bg-stone-800 h-64 sm:h-auto rounded-2xl w-full sm:w-1/3 flex items-center justify-center">
                                        <Image
                                            src={userData.userInfo.profileImg}
                                            height={300}
                                            width={400}
                                            alt="profileImage"
                                            className="rounded-lg object-cover object-top md:object-center h-full w-full"
                                            onClick={() => handleImageClick(userData.userInfo.profileImg)}
                                        />
                                    </div>
                                )}

                                {!userData.userInfo.profileImg && (
                                    <div className="bg-stone-800 h-64 sm:h-auto rounded-2xl w-full sm:w-1/3 flex items-center justify-center">
                                        <div className="h-full w-full flex justify-center items-center">
                                            <FaCircleUser className="text-gray-400 h-32 w-32 md:w-24 md:h-24" />

                                        </div>
                                    </div>
                                )}

                                <div className="w-full sm:w-2/3">
                                    <div className="bg-stone-800 text-white flex flex-col justify-center rounded-2xl p-4 h-full">
                                        <h2 className="text-xl font-semibold text-center sm:text-left">{userData.name}</h2>
                                        <p className="text-sm text-slate-400 text-center sm:text-left mb-2">{userData.role}</p>
                                        <p className="text-sm">Subjects: {userData.userInfo.interestedSubjects}</p>
                                        {userData.userInfo.experience > 0 && (
                                            <p className="text-sm">Experience: {userData.userInfo.experience}</p>
                                        )}
                                        <p className="text-sm">District: {userData.userInfo.district}</p>
                                        <p className="text-sm">Upazila: {userData.userInfo.upazila}</p>
                                        {userData.userInfo.location && (
                                            <p className="text-sm">Location: {userData.userInfo.location}</p>
                                        )}
                                        <div className="text-sm flex items-center gap-2">
                                            Number:
                                            <a
                                                href={`https://wa.me/${userData.userInfo.mobileNumber}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500"
                                            >
                                                {userData.userInfo.mobileNumber}
                                            </a>
                                            <FaRegCopy className=" cursor-pointer text-blue-400 h-4 w-4" onClick={() => handleCopy(userData.firebaseId as string, userData.userInfo.mobileNumber as string)}
                                            />
                                            {copied === userData.firebaseId && (
                                                <div className=" flex gap-1 items-center text-xs animate-bounce">
                                                    <GiCheckMark className="" />
                                                    <p>Copied!</p>

                                                </div>
                                            )}
                                        </div>

                                        {userData.userInfo.institutionName && (
                                            <p className="text-sm">Institution: {userData.userInfo.institutionName}</p>
                                        )}
                                    </div>

                                </div>
                                {isModalOpen && currentImage && (
                                    <div className="modal modal-open">
                                        <div className="modal-box relative bg-black p-0 max-w-full max-h-full">
                                            <button
                                                className="btn btn-sm md:btn-lg text-white font-semibold btn-circle absolute right-2 top-2"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                ✕
                                            </button>
                                            <div className="flex justify-center items-center h-screen">
                                                <Image
                                                    src={currentImage}
                                                    height={800}
                                                    width={800}
                                                    alt="profileImage"
                                                    className="rounded-lg object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="skeleton h-32 w-32"></div>
            )}

        </div>
    )
}
