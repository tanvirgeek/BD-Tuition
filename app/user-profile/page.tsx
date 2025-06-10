"use client"

import { useAnotherUserStore } from "@/store/store"
import Image from "next/image"
import { FaCircleUser } from "react-icons/fa6"
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { convertDateToReadableDate } from "@/lib/utils";
import { useState } from "react";
import { Role } from "@prisma/client";

const userProfilePage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  const { anotherUser, anotherUserInfo } = useAnotherUserStore()

  const handleImageClick = (imageSrc: string | null) => {
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

  return (
    <div className="container mx-auto max-w-screen-xl m-auto px-4 py-4 lg:px-0">
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body flex flex-col md:flex-row items-center gap-8 justify-center">

          {/* Image Section */}
          <div className={`${anotherUserInfo?.profileImg ? "avatar" : ""} w-full md:w-32 h-40 md:h-32 relative group/avatar flex items-center justify-center`}>
            <div className="w-28 md:w-full h-full md:h-auto rounded-lg md:rounded-full absolute overflow-hidden">
              {anotherUserInfo?.profileImg && anotherUser?.name && (
                <Image
                  onClick={() => handleImageClick(anotherUserInfo.profileImg)}
                  src={anotherUserInfo.profileImg}
                  fill
                  className="object-cover"
                  alt={anotherUser.name}
                />
              )}

              {!anotherUserInfo?.profileImg && (
                <FaCircleUser className="w-full h-full text-slate-400" />
              )}
            </div>
          </div>

          {/* Text Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <h2 className="card-title text-xl">{anotherUser?.name}</h2>
              <span className="text-sm text-slate-400">{anotherUser?.role}</span>
            </div>
          </div>

        </div>
      </div>


      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Want to {anotherUser?.role == "TEACHER" ? "teach" : "learn"}</h2>
            <div>{anotherUserInfo?.isLookingFor ? <div className="flex lg:w-32 items-center">
              <p>Availabe</p>
              <FaCheck className="text-green-500 w-5 h-5" />
            </div> : <div className="flex lg:w-32 items-center">
              <p>Not Available</p>
              <ImCross className="w-4 h-4 text-red-500" />
            </div>}</div>
            <p>Subjects: {anotherUserInfo?.interestedSubjects?.join(", ")}</p>

            {anotherUser?.role == Role.TEACHER && (
              <p>Experience: {anotherUserInfo?.experience} {(anotherUserInfo?.experience || 0) < 2 ? "year" : "years"}</p>

            )}

          </div>

        </div>


        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Educational information</h2>
            <p>A student of {anotherUserInfo?.institutionName}</p>
            <p>Institution name: {anotherUserInfo?.institutionName}</p>
            <div>{anotherUserInfo?.institution == "University" ? <div> <p>Department: {anotherUserInfo?.department}</p>
              <p className="mt-2">Year: {anotherUserInfo?.year}</p></div> : <div>
              <p>Class: {anotherUserInfo?.userClass}</p>
            </div>}</div>


          </div>
        </div>


        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Contact</h2>
            <p>Location: {anotherUserInfo?.location}</p>
            <p>District: {anotherUserInfo?.district}</p>
            <p>Upazila: {anotherUserInfo?.upazila}</p>
            {anotherUserInfo?.isLookingFor && (
              <p>Mobile number: {anotherUserInfo?.mobileNumber}</p>

            )}
          </div>

        </div>
        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Personal information</h2>
            <p>Gender: {anotherUserInfo?.gender}</p>
            {anotherUserInfo?.dateOfBirth && (
              <p>Date of birth: {convertDateToReadableDate(anotherUserInfo.dateOfBirth)}</p>

            )}
            <p className="text-sm text-slate-400">Description: {anotherUserInfo?.description}</p>

          </div>

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
                height={0}
                width={800}
                alt="profileImage"
                className="rounded-lg object-cover h-2/3"
              />
            </div>
          </div>
        </div>
      )}
    </div>


  )
}


export default userProfilePage