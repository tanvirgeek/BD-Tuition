"use client"

import { useAnotherUserStore, useUserStore } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { FaCircleUser } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { stringToEnum } from "@/lib/utils";
import { Role } from "@prisma/client";

import { motion } from "framer-motion";
import { fetchUser } from "@/lib/api-calls";
import Link from "next/link";

export interface UserInfo {
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

export interface UserData {
  id: string;
  firebaseId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userInfo: UserInfo; // Include the nested userInfo property
}

const DashboardPage = () => {

  const [feedType, setFeedType] = useState("recommended")

  const { user, userInfo } = useUserStore();

  const { setAnotherUser, setAnotherUserInfo } = useAnotherUserStore()

  const [page, setPage] = useState(1);

  const [isFetching, setIsFetching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  const [users, setUsers] = useState<UserData[]>([]);

  const [usersCache, setUsersCache] = useState<Record<string, UserData[]>>({});

  const router = useRouter();

  const fetchUsers = async (page: number, feedType: string) => {
    try {
      setIsFetching(true);

      let baseUrl = "";
      const params = new URLSearchParams();

      switch (feedType) {
        case "recommended":
          baseUrl = "/api/users";
          if (user?.role) params.append('role', user.role);
          if (userInfo?.district) params.append('district', userInfo.district);
          if (userInfo?.upazila) params.append('upazila', userInfo.upazila);
          if (userInfo?.interestedSubjects?.length) {
            userInfo.interestedSubjects.forEach(subject => params.append('interestedSubjects', subject));
          }
          break;

        case "for you":
          baseUrl = "/api/users-by-subjects-and-district";
          if (user?.role) params.append('role', user.role);
          if (userInfo?.district) params.append('district', userInfo.district);
          if (userInfo?.interestedSubjects?.length) {
            userInfo.interestedSubjects.forEach(subject => params.append('interestedSubjects', subject));
          }
          break;

        case "district":
          baseUrl = "/api/users-by-district";
          if (user?.role) params.append('role', user.role);
          if (userInfo?.district) params.append('district', userInfo.district);
          break;

        default:
          throw new Error("Invalid feed type");
      }



      params.append('page', page.toString());
      params.append('limit', '8');

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

      setUsersCache((prev) => ({
        ...prev,
        [feedType]: [...(prev[feedType] || []), ...data.data],
      }));

      setUsers((prev) => ([...prev, ...data.data]))
      setIsFetching(false);

    } catch (error) {
      console.log('Error fetching users:', error);
      setIsFetching(false);
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

  const handleFeedTypeChange = (newFeedType: string) => {
    if (newFeedType != feedType) {
      setFeedType(newFeedType);
      setPage(1);

      if (usersCache[newFeedType]) {
        setUsers(usersCache[newFeedType]);
      } else {
        setUsers([]); // Clear users if no cache is available
      }
    }
  }


  useEffect(() => {
    const getUser = async () => {
      if (!user?.firebaseId || userInfo) return;
      await fetchUser(user.firebaseId);

      if (!userInfo) {
        router.push("/profile");
      }
    };

    getUser();
  }, [user?.firebaseId]);


  //Infinite Scroll


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
    if (!isFetching) {
      if (!usersCache[feedType]) {
        // No cache exists for the current feedType; fetch users for the first time
        fetchUsers(page, feedType);
      } else if (page > Math.ceil(usersCache[feedType].length / 2)) {
        // Fetch more users if the page exceeds the cached data
        fetchUsers(page, feedType);
      }
    }
  }, [page, feedType]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll)
  }, []);

  useEffect(() => {
    if (!feedType) {
      setFeedType("recommended"); // Default to "recommended"
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, feedType); // Fetch first page on mount
  }, []);




  return (
    <div className="felx flex-col max-w-screen-xl m-auto">

      <h1 className=" text-2xl font-semibold text-center underline mt-4">Find Your {user?.role === Role.STUDENT ? "Teachers" : "Students"}</h1>


      <div className="flex justify-between p-4 border-b border-slate-500">

        <div className=" text-base sm:text-lg font-semibold cursor-pointer" onClick={() => handleFeedTypeChange("recommended")}>
          Recommended
          {feedType === "recommended" && (
            <div className='w-full h-1 rounded-full bg-primary'></div>
          )}
        </div>

        <div className="text-base md:text-lg font-semibold cursor-pointer" onClick={() => handleFeedTypeChange("for you")}>
          For you
          {feedType === "for you" && (
            <div className='w-full h-1 rounded-full bg-primary'></div>
          )}

        </div>

        <div className=" text-base md:text-lg font-semibold cursor-pointer" onClick={() => handleFeedTypeChange("district")}>
          In your District
          {feedType === "district" && (
            <div className='w-full h-1 rounded-full bg-primary'></div>
          )}
        </div>
      </div>

      <div className="px-4 py-4 lg:px-0">
        {users.length == 0 && !isFetching && (
          <div className=" flex flex-col gap-4 md:items-center">
            <p className=" text-lg md:text-2xl font-semibold">No {feedType} {user?.role === Role.STUDENT ? "Teachers" : "Students"} found</p>
            <p className=" text-sm md:text-lg">If you did not complete your profile <Link href={"/profile"} className="text-blue-500 underline">go to your profile</Link></p>
            <p className="text-sm md:text-lg">Then click on the Edit profile button & complete the form</p>
            <p className="text-sm md:text-lg">This will help you to suggest {feedType} {user?.role === Role.STUDENT ? "Teachers" : "Students"}</p>
          </div>
        )}
        {users && !isFetching && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {users.map((userData, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  scale: .85
                }}

                whileInView={{
                  opacity: 1,
                  scale: 1
                }}

                transition={{
                  duration: 1,
                  delay: index * 0.15
                }}
                viewport={{
                  once:true
                }}
                className="bg-base-200 text-base-content rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Profile Image */}
                {userData.userInfo.profileImg ? (
                  <motion.div
                    className="h-64 sm:h-auto rounded-2xl cursor-pointer w-full sm:w-1/3 flex items-center justify-center"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: .2 }}>
                    <Image
                      src={userData.userInfo.profileImg}
                      height={300}
                      width={400}
                      alt="profileImage"
                      className="rounded-lg object-cover object-top md:object-center h-full w-full"
                      onClick={() => handleImageClick(userData.userInfo.profileImg)}
                    />
                  </motion.div>
                ) : (
                  <div className="h-64 sm:h-auto rounded-2xl w-full sm:w-1/3 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <FaCircleUser className="text-gray-400 h-32 w-32 md:w-24 md:h-24" />
                  </div>
                )}

                {/* User Info */}
                <div className="w-full sm:w-2/3">
                  <div className="flex flex-col justify-center rounded-2xl p-4 h-full">
                    {/* Name & Details Button */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg lg:text-xl font-semibold">{userData.name}</h2>
                      <button
                        className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 transition"
                        onClick={() => {
                          const convertedUser = {
                            ...userData,
                            role: stringToEnum(Role, userData.role) as Role,
                            createdAt: new Date(userData.createdAt),
                            updatedAt: new Date(userData.updatedAt),
                          };

                          const convertedUserInfo = {
                            ...userData.userInfo,
                            dateOfBirth: new Date(userData.userInfo.dateOfBirth),
                          };
                          setAnotherUser(convertedUser);
                          setAnotherUserInfo(convertedUserInfo);
                          router.push("/user-profile");
                        }}
                      >
                        <p>See details</p>
                        <FaArrowRight />
                      </button>
                    </div>

                    {/* Role & Subjects */}
                    <p className="text-sm text-base-content">{userData.role}</p>
                    <p className="text-sm">Subjects: {userData.userInfo.interestedSubjects?.join(", ")}</p>
                    {userData.role == "TEACHER" && (
                      <p className="text-sm">
                        Experience: {userData.userInfo?.experience && Number(userData.userInfo.experience) > 1
                          ? `${userData.userInfo.experience} years`
                          : `${userData.userInfo?.experience || 0} year`}
                      </p>
                    )}

                    {/* Location */}
                    <p className="text-sm">District: {userData.userInfo.district}</p>
                    <p className="text-sm">Upazila: {userData.userInfo.upazila}</p>
                    {userData.userInfo.location && (
                      <p className="text-sm">Location: {userData.userInfo.location}</p>
                    )}

                    {/* Contact Information */}
                    <div className="text-sm flex items-center gap-2">
                      <span>Number:</span>
                      <a
                        href={`https://wa.me/${userData.userInfo.mobileNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {userData.userInfo.mobileNumber}
                      </a>
                      <FaRegCopy
                        className="cursor-pointer text-blue-400 hover:text-blue-600 transition h-4 w-4"
                        onClick={() => handleCopy(userData.firebaseId as string, userData.userInfo.mobileNumber as string)}
                      />
                      {copied === userData.firebaseId && (
                        <div className="flex gap-1 items-center text-xs text-green-500 animate-bounce">
                          <GiCheckMark />
                          <p>Copied!</p>
                        </div>
                      )}
                    </div>

                    {/* Institution */}
                    {userData.userInfo.institutionName && (
                      <p className="text-sm">Institution: {userData.userInfo.institutionName}</p>
                    )}
                  </div>
                </div>

                {/* Modal for Full Image View */}
                {isModalOpen && currentImage && (
                  <div className="modal modal-open">
                    <div className="modal-box relative bg-black p-0 max-w-full max-h-full">
                      <button
                        className="btn btn-sm md:btn-lg font-semibold btn-circle absolute right-2 top-2"
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
              </motion.div>
            ))}
          </div>

        )}

        {isFetching && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-base-200 rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-4">
                {/* Skeleton Profile Image */}
                <div className="h-64 sm:h-auto rounded-2xl w-full sm:w-1/3 skeleton"></div>

                {/* Skeleton User Info */}
                <div className="w-full sm:w-2/3">
                  <div className="flex flex-col justify-center rounded-2xl p-4 h-full">
                    {/* Name & Button */}
                    <div className="flex justify-between items-center">
                      <div className="skeleton h-5 w-32 rounded"></div>
                      <div className="skeleton h-4 w-20 rounded"></div>
                    </div>

                    {/* Role & Subjects */}
                    <div className="skeleton h-4 w-24 rounded mt-2"></div>
                    <div className="skeleton h-4 w-36 rounded mt-2"></div>

                    {/* Experience (if applicable) */}
                    <div className="skeleton h-4 w-32 rounded mt-2"></div>

                    {/* Location */}
                    <div className="skeleton h-4 w-40 rounded mt-2"></div>
                    <div className="skeleton h-4 w-28 rounded mt-2"></div>
                    <div className="skeleton h-4 w-48 rounded mt-2"></div>

                    {/* Contact */}
                    <div className="skeleton h-4 w-40 rounded mt-2"></div>

                    {/* Institution */}
                    <div className="skeleton h-4 w-56 rounded mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>





    </div>
  )
};

export default DashboardPage;
