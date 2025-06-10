"use client"

import React, { useEffect, useState } from 'react'
import SubjectsPicker from './SubjectsPicker';
import DistrictPicker, { districts } from './DistrictPicker';
import UpazilaPicker from './UpazilaPicker';

import { RxCross2 } from "react-icons/rx";
import {  useInfiniteScrolllBodyDataState, useSearchedModalBodyDataState, useSearchedUserStore, useSearchingState } from '@/store/store';
import { useRouter } from 'next/navigation';
import ItemPicker, { publicUniversities } from './ItemPicker';


export interface SearchModalBodyData {
    name: string;
    district: string;
    institutionName: string;
    gender: string;
    interestedSubjects: string[];
    upazila: string;
    role: string;
    page: number;
    limit: number;
}

interface SearchModalProps {
    searchModalToggle: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ searchModalToggle }) => {

    const { isSearching, setIsSearching } = useSearchingState();

    const { searchedFormData, setSearchedFormData } = useSearchedModalBodyDataState();

    const { setInfiniteScrollFormData } = useInfiniteScrolllBodyDataState();

    const [filteredUpazilas, setFilteredUpazilas] = useState<string[]>([]);

    const { setSearchedUsers, clearedSearchedUsers } = useSearchedUserStore()

    const router = useRouter()

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSearchedUsers({ ...searchedFormData, role: searchedFormData.role.toUpperCase(), page: 1 });
        setInfiniteScrollFormData({ ...searchedFormData, page: 1 })
        clearedSearchedUsers();
        router.push("/search") 
        searchModalToggle();
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        // Access Zustand state and update directly
        const { searchedFormData, setSearchedFormData } = useSearchedModalBodyDataState.getState();

        setSearchedFormData({
            ...searchedFormData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const setSelectedSubjects = (subjects: string[]) => {
        // Access the current state
        const { searchedFormData, setSearchedFormData } = useSearchedModalBodyDataState.getState();

        // Update the state
        setSearchedFormData({
            ...searchedFormData,
            interestedSubjects: [...subjects],
        });
    };

    const setDistrict = (district: string) => {
        const { searchedFormData, setSearchedFormData } = useSearchedModalBodyDataState.getState();

        setSearchedFormData({
            ...searchedFormData,
            district,
        });
    };

    const setUpazila = (upazila: string) => {
        const { searchedFormData, setSearchedFormData } = useSearchedModalBodyDataState.getState();

        setSearchedFormData({
            ...searchedFormData,
            upazila,
        });
    };

    const handleSelectInstitution = (institutionName: string) => {
        const { searchedFormData, setSearchedFormData } = useSearchedModalBodyDataState.getState();

        setSearchedFormData({
            ...searchedFormData,
            institutionName,
        })
    }


    const fetchSearchedUsers = async (searchedFormData: SearchModalBodyData) => {
        setIsSearching(true);
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

            const data = await response.json();

            setSearchedUsers(data.data);

        } catch (error) {
            console.error("Failed to fetch paginated data:", error);
            throw error;
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <div className=' flex justify-between items-center'>
                    <span className=' text-lg font-semibold'>Search by any field:</span>
                    <RxCross2 onClick={() => searchModalToggle()} className='h-10 w-10 px-2 hover:bg-stone-800 hover:text-white cursor-pointer rounded-full' />
                </div>
                <form className="space-y-4 flex flex-col" onSubmit={handleFormSubmit}>

                    <label className=" form-control w-full">

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Looking for</span>

                            </div>
                            <select
                                className="select select-bordered"
                                name="role"
                                value={searchedFormData.role}
                                onChange={handleInputChange}>

                                <option value="" disabled>Looking for</option>
                                <option>Teacher</option>
                                <option>Student</option>

                            </select>

                        </label>
                    </label>

                    <label className=" form-control w-full">
                        <div className=" label">
                            <span className=" label-text">Interested Subjects (optional)</span>
                        </div>

                        <div>
                            <SubjectsPicker
                                onSelectSubjects={setSelectedSubjects}
                                initialSubjects={searchedFormData.interestedSubjects || []}
                            />
                        </div>
                    </label>

                    <label className=" form-control w-full">
                        <div className=" label">
                            <span className=" label-text">Institution Name</span>
                        </div>

                        <ItemPicker handleSelect={handleSelectInstitution} items={publicUniversities} initialItem={searchedFormData.institutionName || ""} />
                    </label>


                    <label className=" form-control w-full">
                        <div className=" label">
                            <span className=" label-text">District (optional)</span>
                        </div>

                        <DistrictPicker districts={districts} setFilteredUpazilas={setFilteredUpazilas} setDistrict={setDistrict} initialDistrict={searchedFormData.district || ""} />

                    </label>

                    {searchedFormData.district && (
                        <label className=" form-control w-full">
                            <div className=" label">
                                <span className=" label-text">Upazila (optional)</span>
                            </div>

                            <UpazilaPicker setItem={setUpazila} items={filteredUpazilas} initialItem={searchedFormData.upazila || ""} />

                        </label>
                    )}


                    <label className=" form-control w-full">
                        <div className=" label">
                            <span className=" label-text">Name (optional)</span>
                        </div>
                        <label className="input input-bordered flex items-center gap-2">
                            <input type="text"
                                name="name"
                                value={searchedFormData.name}
                                onChange={handleInputChange}
                                className="grow"
                                placeholder="Add name" />
                        </label>
                    </label>




                    <label className=" form-control w-full">

                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Gender (optional)</span>

                            </div>
                            <select
                                className="select select-bordered"
                                name="gender"
                                value={searchedFormData.gender}
                                onChange={handleInputChange}>

                                <option value="" disabled>Select gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>

                            </select>

                        </label>
                    </label>

                    <button className='btn btn-info disabled'>
                        {isSearching ? "Searching..." : "Search"}
                    </button>


                </form>
            </div>
        </div>
    )
}

export default SearchModal