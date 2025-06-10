"use client"

import { useState } from "react";

import { IoMdArrowDropdown } from "react-icons/io";


interface MenuPickerProps {
    items: string[];
    setItem: (upazila: string) => void;
    initialItem: string;
}


const UpazilaPicker: React.FC<MenuPickerProps> = ({ items, setItem, initialItem }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedUpazila, setSelectedUpazila] = useState(initialItem);

    const selectHandler = (event: React.MouseEvent<HTMLParagraphElement>) => {
        setSelectedUpazila(event.currentTarget.innerText);
        setItem(event.currentTarget.innerText)
    }

    const handleModal = () => {
        setIsModalOpen((prev) => !prev)
    }

    const handleUpazilaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUpazila(event.target.value);
    };



    return (
        <div onClick={handleModal}>

            <div className=" relative">
                <div

                    onChange={handleUpazilaChange}
                    className="input input-bordered flex items-center gap-2">
                    {selectedUpazila ? `${selectedUpazila}` : "Select Upazila"}

                </div>

                <IoMdArrowDropdown className=" absolute bottom-4 right-3"/>

            </div>




            {isModalOpen && (
                <div className="m-2 flex flex-col gap-1">
                    {items.map(item => (
                        <p key={item} onClick={selectHandler}>{item}</p>
                    ))}
                </div>
            )}



        </div>
    )
}

export default UpazilaPicker;