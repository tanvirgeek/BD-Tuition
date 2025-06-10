"use client"

import { auth } from "@/firebase/firebase";
import { useAnotherUserStore, useAuthStore, useSearchedModalBodyDataState, useSearchModal, useUserStore } from "@/store/store";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import SearchModal from "./SearchModal";


const Navbar = () => {
    const router = useRouter();

    const pathname = usePathname();

    const { isAuthenticated } = useAuthStore()

    const { user, userInfo } = useUserStore();

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const { isSearchModalOpen, setIsSearchmodalOpen } = useSearchModal();

    const { clearedSearchedFormData } = useSearchedModalBodyDataState()

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev)
    }

    const getActiveClass = (path: string) => {
        return pathname === path ? 'bg-primary rounded-full text-white px-4 py-2' : 'hover:bg-lime-200 px-4 py-2 rounded-full'; // Add your active class styles here
    };
    const handleSearchToggle = () => {
        clearedSearchedFormData();
        setIsSearchmodalOpen(!isSearchModalOpen)
    }

    const { clearUser, clearUserInfo } = useAnotherUserStore();

    const handleLogout = async () => {


        try {
            await signOut(auth); // Signs the user out of Firebase
            //   await fetch("/api/logout"); // Call the logout API route to delete the cookie
            clearUser();
            clearUserInfo();
            localStorage.removeItem("another-user-store"); // Clear persisted state
            router.replace("/login"); // Redirect to login page after logout
        } catch (error) {
            if (error instanceof Error) {
                console.error("Logout error:", error.message);
            } else {
                console.error("Unknown error");
            }
        }
    };

    return (
        <>
            <div className="hidden md:navbar bg-lime-100 fixed z-50 top-0 left-0 h-20 w-full rounded-b-2xl shadow-md">
                <div className="flex-1 md:pl-6 xl:pl-44 2xl:pl-52">
                    <p className="btn btn-ghost text-xl hover:bg-lime-200">
                        <Link href={isAuthenticated ? "/dashboard" : "/"}>Tuition BD</Link>
                    </p>
                </div>
                <div className="flex-none md:pr-6 xl:pr-44 2xl:pr-52">
                    <ul className="menu-horizontal gap-6 items-center text-lg px-1">
                        {isAuthenticated ? (
                            <>
                                <li className={getActiveClass('/dashboard')}>
                                    <Link href={"/dashboard"}>Dashboard</Link>
                                </li>
                                <li className={getActiveClass('/contact')}>
                                    <Link href={"/contact"}>Contact Us</Link>
                                </li>
                                <li>
                                    <button className="btn btn-ghost btn-circle hover:bg-lime-200">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className={getActiveClass('/login')}>
                                    <Link href={"/login"}>Login</Link>
                                </li>
                                <li className={getActiveClass('/register')}>
                                    <Link href={"/register"}>Register</Link>
                                </li>
                                <li>
                                    <button className="btn btn-ghost btn-circle hover:bg-lime-200" onClick={() => (handleSearchToggle())}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </li>
                            </>
                        )}

                        {isAuthenticated && (
                            <div className="relative ml-2">
                                <div className="dropdown">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                        {userInfo?.profileImg ? (
                                            <div className="avatar relative placeholder cursor-pointer" onClick={toggleMenu}>
                                                <div className="bg-neutral absolute text-neutral-content w-12 -top-6 -left-6 rounded-full">
                                                    <Image
                                                        src={userInfo?.profileImg || ""}
                                                        fill
                                                        className=""
                                                        alt={"profileImage"}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="avatar placeholder cursor-pointer" onClick={toggleMenu}>
                                                    <div className="bg-lime-400 text-neutral-content w-12 rounded-full">
                                                        <span className="text-lg text-slate-950 font-semibold">
                                                            {user?.name.toUpperCase().charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <ul
                                        tabIndex={0}
                                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow absolute -left-44 top-14">
                                        <li><Link href={"/profile"}>Profile</Link></li>
                                        <li><button onClick={handleLogout}>Logout</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </ul>
                </div>
            </div>

            {/* small screen */}

            <div className="navbar md:hidden bg-lime-100 fixed z-50 top-0 left-0 h-20 w-full rounded-b-2xl">
                <div className="navbar-start">

                    <div className="dropdown ">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle hover:bg-lime-200" >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {isAuthenticated ?
                                <>
                                    <li><Link href={"/dashboard"}>Dashboard</Link></li>
                                    <li><Link href={"/contact"}>Contact Us</Link></li>
                                </> :
                                <>
                                    <li><Link href={"/login"}>Login</Link></li>
                                    <li><Link href={"/register"}>Register</Link></li>
                                </>
                            }


                        </ul>

                    </div>

                </div>
                <div className="navbar-center">
                    <p className="btn btn-ghost hover:bg-lime-200 text-xl"><Link href={isAuthenticated ? "/dashboard" : "/"}>Tuition BD</Link></p>
                </div>
                <div className="navbar-end">

                    <button className="btn btn-ghost hover:bg-lime-200 btn-circle" onClick={() => (
                        handleSearchToggle()
                    )}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {isAuthenticated && (
                        <div className="relative ml-2">

                            <div className="dropdown">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                    {userInfo?.profileImg ?
                                        <div className="avatar relative placeholder cursor-pointer" onClick={toggleMenu}>
                                            <div className="bg-neutral absolute text-neutral-content w-12 -top-6 -left-6 rounded-full">
                                                <Image src={userInfo?.profileImg || ""} fill className="" alt={"profileImage"} />
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="avatar placeholder cursor-pointer" onClick={toggleMenu}>
                                                <div className="bg-lime-400  text-neutral-content w-12 rounded-full">
                                                    <span className=" text-lg text-slate-950 font-semibold">{user?.name.toUpperCase().charAt(0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>

                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow absolute -left-44 top-14">
                                    <li><Link href={"/profile"}>Profile</Link></li>
                                    <li><button onClick={handleLogout}>Logout</button></li>
                                </ul>


                            </div>
                        </div>
                    )}
                </div>

            </div>

            {isSearchModalOpen && (
                <SearchModal searchModalToggle={handleSearchToggle} />
            )}

        </>

    )
}

export default Navbar;