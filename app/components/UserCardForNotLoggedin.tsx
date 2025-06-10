"use client"

import Link from "next/link";

import { FaArrowRight } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

import Image from "next/image";
import { UserData } from "../dashboard/page";
import { motion } from "framer-motion";



export function UserCardForNotLoggedin({ userData }: { userData: UserData }) {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        transition: { duration: 1, delay: 0.5 }
      }}
      viewport={{
        once: true
      }}

      className="bg-base-200 h-[33rem] text-base-content rounded-2xl shadow-lg p-4 flex flex-col gap-4">
      {/* Profile Image */}
      {userData.userInfo.profileImg ? (

        <Image
          src={userData.userInfo.profileImg}
          height={300}
          width={400}
          alt="Profile Image"
          className="rounded-lg object-cover object-top md:object-center h-64 w-full transition-transform duration-200 ease-out hover:scale-105"
        />


      ) : (
        <div className="h-64 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <FaCircleUser className="text-gray-400 h-32 w-32" />
        </div>
      )}

      {/* User Info */}
      <div className="p-4">
        <h2 className="text-xl md:text-xl font-semibold">{userData.name}</h2>
        <p className="text-sm text-base-content">{userData.role}</p>
        <p className="text-sm">Subjects: {userData.userInfo.interestedSubjects?.join(", ")}</p>
        <p className="text-sm">Institution: {userData.userInfo.institutionName}</p>
        {userData.role == "TEACHER" && (
          <p className="text-sm">
            Experience: {userData.userInfo?.experience && Number(userData.userInfo.experience) > 1
              ? `${userData.userInfo.experience} years`
              : `${userData.userInfo?.experience || 0} year`}
          </p>
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
            <div className=" flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary">Please Register for free!!!</h3>
              <label htmlFor="my_modal_6" className="btn">
                <RxCross1 className=" text-base" />
              </label>
            </div>
            <p className="py-4">To see details and use advanced features register for free to find teachers and students!</p>

            <div className=" flex justify-center">
              <Link href={"/register"}>
                <div className="flex gap-2 items-center">
                  <p className=" text-sm underline text-secondary">Don't have an account?</p>
                  <p className="btn btn-sm btn-secondary">register</p>

                </div>

              </Link>

            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}