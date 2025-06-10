'use client'

import React, { useEffect, useRef, useState } from 'react'
import UserCard from '../components/UserCard';
import { useInfiniteScrolllBodyDataState, useSearchedUserStore, useSearchingState, useSearchModal } from '@/store/store';
import { SearchModalBodyData } from '../components/SearchModal';

import { motion } from 'framer-motion';

const SearchPage = () => {

  const { searchedusers, setSearchedUsers } = useSearchedUserStore()

  const { infiniteScrollFormData, setInfiniteScrollFormData } = useInfiniteScrolllBodyDataState();

  const { isSearchModalOpen } = useSearchModal();

  const { isSearching, setIsSearching } = useSearchingState();

  const isFirstRender = useRef(true)

  const fetchSearchedUsers = async (searchedFormData: SearchModalBodyData) => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchedFormData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      console.log("searchedUsers", searchedusers)

      const data = await response.json();

      console.log("data: ", data)

      setSearchedUsers(searchedusers.concat(data.data));

    } catch (error) {
      console.log("Failed to fetch paginated data:", error);
      throw error;
    }
  };

  const handleInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        const { infiniteScrollFormData, setInfiniteScrollFormData } = useInfiniteScrolllBodyDataState.getState();

        console.log("before set", infiniteScrollFormData)

        // Update the `page` field in Zustand
        setInfiniteScrollFormData({
          ...infiniteScrollFormData,
          page: infiniteScrollFormData.page + 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(searchedusers, "zustand inside useEffect")

    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll)
  }, [])


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    console.log("before condition");
    if (infiniteScrollFormData.role && !isSearchModalOpen) {
      console.log("before", infiniteScrollFormData);

      fetchSearchedUsers({
        ...infiniteScrollFormData,
        role: infiniteScrollFormData.role.toUpperCase(),
      });
    }

    console.log("after", infiniteScrollFormData);
  }, [infiniteScrollFormData]);

  useEffect(() => {
    console.log('Searched Users State:', searchedusers);
  }, [searchedusers]);

  return (<>
    {searchedusers.length < 1 && !isSearching && (
      <div className=' flex justify-center mt-20 text-lg font-semibold'>
        No User Found for this search!
      </div>
    )}
    {isSearching && (
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
    <div className="max-w-screen-xl m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {searchedusers.map((searchedUser, index) => (
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
            once: true
          }}
        >
          <UserCard userData={searchedUser} />
        </motion.div>
      ))}
    </div>
  </>

  );
}

export default SearchPage;