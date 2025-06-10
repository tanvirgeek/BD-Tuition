"use client";

import { useEffect, useState } from "react";
import DistrictPicker, { districts } from "../components/DistrictPicker";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useUserStore } from "@/store/store";
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { title } from "process";
import Image from "next/image";
import { FaCircleUser } from "react-icons/fa6";

import SubjectsPicker from "../components/SubjectsPicker";
import UpazilaPicker from "../components/UpazilaPicker";
import { Role } from "@prisma/client";
import ItemPicker, { publicUniversities } from "../components/ItemPicker";
import { convertDateToReadableDate } from "@/lib/utils";
import { fetchUser } from "@/lib/api-calls";


const UserProfile = () => {

    const { user, userInfo, setUserInfo } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [imageUrl, setImageUrl] = useState("")
    const [publicId, setPublicId] = useState("")

    const [filteredUpazilas, setFilteredUpazilas] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        firebaseId: user?.firebaseId || "",
        name: user?.name || "",
        location: userInfo?.location || "",
        district: userInfo?.district || "",
        mobileNumber: userInfo?.mobileNumber || "",
        institution: userInfo?.institution || "",
        userClass: userInfo?.userClass || 0,
        institutionName: userInfo?.institutionName || "",
        department: userInfo?.department || "",
        year: userInfo?.year || 0,
        experience: userInfo?.experience || 0,
        dateOfBirth: userInfo?.dateOfBirth
            ? new Date(userInfo.dateOfBirth).toISOString().split('T')[0] // Ensure it's YYYY-MM-DD
            : (() => {
                const currentDate = new Date();
                currentDate.setFullYear(currentDate.getFullYear() - 15);
                return currentDate.toISOString().split('T')[0]; // Default to 15 years back
            })(),
        gender: userInfo?.gender || "",
        description: userInfo?.description || "",
        isLookingFor: userInfo?.isLookingFor ?? true, // Use nullish coalescing
        interestedSubjects: [...userInfo?.interestedSubjects ?? []],
        profileImg: userInfo?.profileImg || "",
        upazila: userInfo?.upazila || "",
    });

    const setDistrict = (district: string) => {
        setFormData((prev) => ({ ...prev, district }));
    };

    const setSelectedSUbjects = (subjects: string[]) => {
        setFormData((prev) => ({ ...prev, interestedSubjects: [...subjects] }));
    };

    const handleImageUpload = async (result: CloudinaryUploadWidgetResults) => {
        console.log("result: ", result);

        const info = result.info as object;

        if ("public_id" in info && "secure_url" in info) {
            const url = info.secure_url as string;
            const public_id = info.public_id as string;

            setImageUrl(url);
            setPublicId(public_id)

            setFormData((prev) => ({
                ...prev,
                ["profileImg"]: url,

            }));

        }
    }

    useEffect(() => {
        if (!formData.district || !formData.upazila || !formData.gender || !Array.isArray(formData.interestedSubjects) || formData.interestedSubjects.length < 1 || !formData.mobileNumber) {
            setErrorMessage("District, Upazila, Mobile number, Gender & Interest Subjects are required")
        } else {
            setErrorMessage("")
        }
    }, [formData])

    useEffect(() => {

         const getUser = async () => {
              if (!user?.firebaseId || userInfo) return;
              await fetchUser(user.firebaseId);
        
              if (!userInfo) {
                setIsEditing(true);
            }
            };    
            getUser();

        setFormData({
            firebaseId: user?.firebaseId || "",
            name: user?.name || "",
            location: userInfo?.location || "",
            district: userInfo?.district || "",
            mobileNumber: userInfo?.mobileNumber || "",
            institution: userInfo?.institution || "",
            userClass: userInfo?.userClass || 0,
            institutionName: userInfo?.institutionName || "",
            department: userInfo?.department || "",
            year: userInfo?.year || 0,
            experience: userInfo?.experience || 0,
            dateOfBirth: userInfo?.dateOfBirth
                ? new Date(userInfo.dateOfBirth).toISOString().split('T')[0] // Ensure it's YYYY-MM-DD
                : (() => {
                    const currentDate = new Date();
                    currentDate.setFullYear(currentDate.getFullYear() - 15);
                    return currentDate.toISOString().split('T')[0]; // Default to 15 years back
                })(),
            gender: userInfo?.gender || "",
            description: userInfo?.description || "",
            isLookingFor: userInfo?.isLookingFor ?? true, // Use nullish coalescing
            interestedSubjects: [...userInfo?.interestedSubjects ?? []],
            profileImg: userInfo?.profileImg || "",
            upazila: userInfo?.upazila || ""
        })
    }, [userInfo])

    useEffect(() => {
        const updateProfilePicture = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/user-info", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                setIsLoading(false);

                if (!res.ok) {
                    throw new Error("Failed to update Profile Picture");
                }

                const responseData = await res.json();

                setFormData((prev) => ({ ...prev, profileImg: imageUrl }));

                setUserInfo(responseData);


                setIsEditing(false);
            } catch (error) {
                setIsLoading(false);
                console.error("Error updating user info:", error);
            }
        };

        if (imageUrl) {

            console.log("imageUrl called")
            updateProfilePicture();
        } else {
            setImageUrl(userInfo?.profileImg || "")
        }
    }, [imageUrl]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
    
        let modifiedValue: any = value;
    
        if (name === "year" || name === "experience" || name === "userClass") {
            modifiedValue = value === "" ? "" : Number(value); // Allow empty input when deleting
        }
    
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : modifiedValue,
        }));
    };
    

    const handleEditProfileButton = () => {
        setIsEditing(true);
        setSelectedSUbjects(userInfo?.interestedSubjects ?? []);
        setDistrict(userInfo?.district ?? "");
    }

    const removeImage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('api/removeImage', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicId })
            })

            if (res.ok) {
                setImageUrl("");
                setPublicId("");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSelectInstitution = (selectedInstitution: string) => {
        setFormData((prev) => ({ ...prev, institutionName: selectedInstitution }))
    }

    //Upazila

    const setUpazila = (upazila: string) => {
        setFormData((prev) => ({ ...prev, upazila }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!formData.district || !formData.upazila || !formData.gender || !Array.isArray(formData.interestedSubjects) ||
            formData.interestedSubjects.length < 1 || !formData.mobileNumber) {
            setErrorMessage("District, Upazila, Mobile number, Gender and Interest Subjects are required")

            e.preventDefault()
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/user-info", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            setIsLoading(false);

            if (!res.ok) {
                throw new Error("Failed to update user info");
            }


            const data = await res.json();

            const { id, ...dataWithoutId } = data

            setFormData(dataWithoutId)
            console.log("User info updated successfully:", data);

            setIsEditing(false);

            window.location.reload();

        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };

    return (
        <div className="container mx-auto max-w-screen-xl m-auto px-4 py-4 lg:px-0">
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body flex flex-col md:flex-row items-center gap-8 justify-center">
                    {/* Image Section */}
                    <div className={`${imageUrl ? "avatar" : ""} w-full md:w-32 h-40 md:h-32 relative group/avatar flex items-center justify-center z-10`}>
                        <div className="w-28 md:w-full h-full md:h-auto rounded-lg md:rounded-full absolute overflow-hidden">
                            {imageUrl ? (
                                <Image src={imageUrl} fill className="object-cover" alt={title} />
                            ) : (
                                <FaCircleUser className="w-full h-full text-slate-400" />
                            )}
                        </div>
                        <CldUploadButton
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            className="absolute z-50 left-1/2 transform -translate-x-1/2 top-2"
                            onSuccess={handleImageUpload}
                            options={{
                                resourceType: "image",
                                clientAllowedFormats: ["png", "jpg", "jpeg", "gif"],
                                cropping: true,
                                multiple: false,
                            }}
                        >
                            {imageUrl ? (
                                <RiDeleteBinLine
                                    onClick={removeImage}
                                    className="absolute w-6 h-6 top-2 left-5 p-1 bg-lime-50 border-lime-200 text-lime-500 rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer"
                                />
                            ) : (
                                <MdEdit
                                    className="absolute w-7 h-7 top-3 left-5 p-1 bg-lime-50 border-lime-200 border-2 rounded-full cursor-pointer text-lime-500"
                                />
                            )}
                        </CldUploadButton>
                    </div>

                    {/* Text Section */}
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="card-title text-base text-nowrap md:text-xl">{user?.name}</h2>
                            <span className="text-sm text-slate-400">{user?.role}</span>
                        </div>

                        <button className="btn bg-lime-400 hover:bg-lime-500" onClick={handleEditProfileButton}>
                            Edit Profile
                        </button>
                    </div>

                </div>
            </div>


            {!isEditing && (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="card bg-base-100 w-full shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Educational information</h2>
                            {userInfo?.institution == "Admission" ? (
                                <>
                                    <p>A student of {userInfo?.institution} Candidate</p>

                                    <p>College name: {userInfo?.institutionName}</p>

                                </>
                            ) : (

                                <>
                                    <p>A student of {userInfo?.institutionName}</p>

                                    <p>Institution name: {userInfo?.institutionName}</p>

                                </>
                            )}
                            <div>
                                {userInfo?.institution === "University" ? (
                                    <div>
                                        <p>Department: {userInfo?.department}</p>
                                        <p className="mt-2">Year: {userInfo?.year}</p>
                                    </div>
                                ) : (
                                    <div>
                                        {userInfo?.institution !== "Admission" &&
                                            userInfo?.institution !== "Graduated" &&
                                            userInfo?.institution !== "Masters" && (
                                                <p>Class: {userInfo?.userClass}</p>
                                            )}
                                    </div>
                                )}
                            </div>

                        </div>



                    </div>

                    <div className="card bg-base-100 w-full shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Want to {user?.role == "TEACHER" ? "teach" : "learn"}</h2>
                            <div>{userInfo?.isLookingFor ? <div className="flex lg:w-32 items-center">
                                <p>Availabe</p>
                                <FaCheck className="text-green-500 w-5 h-5" />
                            </div> : <div className="flex lg:w-32 items-center">
                                <p>Not Available</p>
                                <ImCross className="w-4 h-4 text-red-500" />
                            </div>}</div>
                            <p>Subjects: {userInfo?.interestedSubjects?.join(", ")}</p>
                            {user?.role == Role.TEACHER && (
                                <p>Experience: {userInfo?.experience} {(userInfo?.experience || 0) < 2 ? "year" : "years"}</p>

                            )}

                        </div>

                    </div>

                    <div className="card bg-base-100 w-full shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Contact</h2>
                            <p>Location: {userInfo?.location}</p>
                            <p>District: {userInfo?.district}</p>
                            <p>Upazila: {userInfo?.upazila}</p>
                            {userInfo?.isLookingFor && (
                                <p>Mobile number: {userInfo?.mobileNumber}</p>

                            )}
                        </div>

                    </div>
                    <div className="card bg-base-100 w-full shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title underline underline-offset-4 decoration-stone-500 decoration-2 text-stone-400">Personal information</h2>
                            <p>Gender: {userInfo?.gender}</p>
                            {userInfo?.dateOfBirth && (
                                <p>Date of birth: {convertDateToReadableDate(formData?.dateOfBirth)}</p>

                            )}
                            <p className="text-sm text-slate-400">Description: {userInfo?.description}</p>

                        </div>

                    </div>


                </div>



            )}

            {isEditing && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-primary underline underline-offset-4">Edit Profile</h3>
                        {!userInfo && (
                            <div className=" flex flex-col gap-2 my-2">
                                <span className=" text-base text-lime-800">Complete your profile once!!!</span>
                                <span className=" text-balance text-base text-lime-800">Then you will get your required {user?.role === Role.STUDENT ? "Teachers" : "Students"} automatically in the dashboard.</span>
                            </div>
                        )}
                        <form className="space-y-4 flex flex-col" onSubmit={handleFormSubmit}>
                            <label className=" form-control w-full">
                                <div className=" label">
                                    <span className="text-primary font-semibold text-base">Name</span>
                                </div>
                                <label className="input input-bordered flex items-center gap-2">
                                    <input type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="grow"
                                        placeholder="Add name" />
                                </label>
                            </label>

                            <label className=" form-control w-full">

                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <span className="text-primary font-semibold text-base">Looking for Opportunities</span>
                                            {formData.isLookingFor && (
                                                <FaCheck className=" text-green-500 h-6 w-6" />
                                            )}

                                            {!formData.isLookingFor && (
                                                <ImCross className=" text-red-500 h-5 w-5" />
                                            )}


                                        </div>
                                        <input
                                            type="checkbox"
                                            name="isLookingFor"
                                            checked={formData.isLookingFor}
                                            onChange={handleInputChange}
                                            className="toggle toggle-primary"
                                        />
                                    </label>
                                </div>
                            </label>

                            <label className=" form-control w-full">
                                <div className=" label">
                                    <span className=" text-primary font-semibold text-base">Interested Subjects</span>
                                </div>

                                <div>
                                    <SubjectsPicker
                                        onSelectSubjects={setSelectedSUbjects}
                                        initialSubjects={userInfo?.interestedSubjects ?? []}
                                    />
                                </div>
                            </label>

                            <label className=" form-control w-full">
                                <div className=" label">
                                    <span className=" text-primary font-semibold text-base">Location</span>
                                </div>
                                <label className="input input-bordered flex items-center gap-2">

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="grow"
                                        placeholder="Add location"
                                    />
                                </label>

                            </label>

                            <label className=" form-control w-full">
                                <div className=" label">
                                    <span className=" text-primary font-semibold text-base">District</span>
                                </div>

                                <DistrictPicker districts={districts} setFilteredUpazilas={setFilteredUpazilas} setDistrict={setDistrict} initialDistrict={formData?.district ?? ""} />

                            </label>

                            <label className=" form-control w-full">
                                <div className=" label">
                                    <span className=" text-primary font-semibold text-base">Upazila</span>
                                </div>

                                <UpazilaPicker setItem={setUpazila} items={filteredUpazilas} initialItem={formData?.upazila ?? ""} />

                            </label>


                            <label className="form-control w-full">
                                <div className="label">
                                    <span className=" text-primary font-semibold text-base">Mobile Number</span>
                                </div>
                                <label className="input input-bordered flex items-center gap-2">
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        required
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                        onBlur={(e) => {
                                            const isValid = /^(?:\+88|88)?01[3-9]\d{8}$/.test(e.target.value);
                                            if (!isValid) {
                                                alert("Please enter a valid Bangladeshi mobile number.");
                                            }
                                        }}
                                        className="grow"
                                        placeholder="Add mobile number"
                                    />
                                </label>
                            </label>


                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="text-primary font-semibold text-base">Are you a student of:</span>
                                </div>
                                <div className="flex gap-4">
                                    {user?.role === Role.TEACHER ? (
                                        ["University", "Masters", "Graduated"].map((option) => (
                                            <label key={option} className="flex flex-col md:flex-row items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="studentOf"
                                                    value={option}
                                                    checked={formData.institution === option}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, institution: e.target.value }))
                                                    }
                                                    className="radio radio-primary"
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))
                                    ) : (
                                        ["School", "College", "Admission"].map((option) => (
                                            <label key={option} className="flex flex-col md:flex-row items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="studentOf"
                                                    value={option}
                                                    checked={formData.institution === option}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, institution: e.target.value }))
                                                    }
                                                    className="radio radio-primary"
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))
                                    )}

                                </div>
                            </label>

                            {user?.role === Role.TEACHER && (formData?.institution == "University" || formData?.institution == "Masters" || formData.institution == "Graduated") ? (

                                <label className=" form-control w-full">
                                    <div className=" label">
                                        <span className=" text-primary font-semibold text-base">Institution Name</span>
                                    </div>

                                    <ItemPicker handleSelect={handleSelectInstitution} items={publicUniversities} initialItem={userInfo?.institutionName ?? ""} />
                                </label>


                            ) : (
                                <label className=" form-control w-full">
                                    <div className=" label">
                                        <span className=" text-primary font-semibold text-base">Institution Name</span>
                                    </div>

                                    <label className="input input-bordered flex items-center gap-2">

                                        <input
                                            type="text"
                                            name="institutionName"
                                            value={formData.institutionName}
                                            onChange={handleInputChange}
                                            className="grow"
                                            placeholder="Add Institution Name"
                                        />
                                    </label>

                                </label>

                            )}


                            {formData.institution == "University" && (
                                <label className=" form-control w-full">
                                    <div className=" label">
                                        <span className=" text-primary font-semibold text-base">Department</span>
                                    </div>

                                    <label className="input input-bordered flex items-center gap-2">

                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="grow"
                                            placeholder="Add Department"
                                        />
                                    </label>

                                </label>


                            )}

                            {formData.institution == "University" && (

                                <label className=" form-control w-full">
                                    <div className=" label">
                                        <span className=" text-primary font-semibold text-base">Year</span>
                                    </div>

                                    <label className="input input-bordered flex items-center gap-2">

                                        <input
                                            type="number"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleInputChange}
                                            className="grow"
                                            placeholder="Add class"
                                            min={1}
                                            max={4}
                                        />
                                    </label>
                                </label>

                            )}



                            {formData.institution == "School" && (

                                <label className=" form-control w-full">
                                    <div className=" label">
                                        <span className=" text-primary font-semibold text-base">Class</span>
                                    </div>

                                    <label className="input input-bordered flex items-center gap-2">

                                        <input
                                            type="number"
                                            name="userClass"
                                            value={formData.userClass}
                                            onChange={handleInputChange}
                                            className="grow"
                                            placeholder="Add class"
                                            min={1}
                                            max={10}
                                        />
                                    </label>
                                </label>
                            )}

                            {formData.institution == "College" && (

                                <label className=" form-control w-full">
                                    <div className=" label">
                                        <span className=" text-primary font-semibold text-base">Class</span>
                                    </div>

                                    <label className="input input-bordered flex items-center gap-2">

                                        <input
                                            type="number"
                                            name="userClass"
                                            value={formData.userClass}
                                            onChange={handleInputChange}
                                            className="grow"
                                            placeholder="Add class"
                                            min={11}
                                            max={12}
                                        />
                                    </label>
                                </label>
                            )}

                            {user?.role === "TEACHER" && (
                                <label className=" form-control w-full">
                                    <div className=" label">
                                        <span className=" text-primary font-semibold text-base">Experience</span>
                                    </div>

                                    <label className="input input-bordered flex items-center gap-2">

                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            className="grow"
                                            placeholder="Experience"
                                            min={0}
                                            max={10}
                                        />
                                    </label>
                                </label>
                            )}



                            <label className=" form-control w-full">
                                <div className=" label">
                                    <span className=" text-primary font-semibold text-base">Date of birth</span>
                                </div>


                                <label className="input input-bordered flex items-center gap-2">

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="grow"
                                    />

                                </label>
                            </label>

                            <label className=" form-control w-full">

                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="text-primary font-semibold text-base">Gender</span>

                                    </div>
                                    <select
                                        className="select select-bordered"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}>

                                        <option value="" disabled>Select your gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>

                                    </select>

                                </label>
                            </label>

                            <label className=" form-control w-full">
                                <div className=" label">
                                    <span className=" text-primary font-semibold text-base">Description</span>
                                </div>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered"
                                    placeholder="Add Description"
                                />
                            </label>



                            {errorMessage && (
                                <p className=" text-red-500 text-sm">{errorMessage}</p>

                            )}
                            <div className="modal-action">
                                <button type="button" className="btn btn-error" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="btn bg-lime-400 hover:bg-lime-500">
                                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
