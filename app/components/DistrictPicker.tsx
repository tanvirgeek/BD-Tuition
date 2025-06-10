"use client"

import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

interface DistrictPickerProps {
    setDistrict: (district: string) => void;
    initialDistrict: string;
    setFilteredUpazilas: (upazilas: string[]) => void;
    districts: { name: string; value: string; upazilas: string[] }[];
}

const DistrictPicker: React.FC<DistrictPickerProps> = ({ setDistrict, initialDistrict, setFilteredUpazilas, districts }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
    const [filteredDistricts, setFilteredDistricts] = useState(districts);
    
    useEffect(() => {
        setFilteredDistricts(districts);
    }, [districts]);
    
    const handleDropDown = () => {
        setIsMenuOpen(prev => !prev);
    };

    const selectHandler = (event: React.MouseEvent<HTMLParagraphElement>) => {
        const selectedValue = event.currentTarget.innerText;
        setSelectedDistrict(selectedValue);
        setDistrict(selectedValue);
        setIsMenuOpen(false);
        
        const filteredUpazilas = districts.find(district => district.name === selectedValue)?.upazilas || [];
        setFilteredUpazilas(filteredUpazilas);
    };

    return (
        <div className='h-full w-full'>
            <div className='input input-bordered flex justify-between items-center cursor-pointer' onClick={handleDropDown}>
                <p>{selectedDistrict || "Select District"}</p>
                <IoMdArrowDropdown />
            </div>

            {isMenuOpen && (
                <div className='mt-2'>
                    <label className="input input-bordered flex items-center gap-2">
                        <input 
                            type="text" 
                            className="grow" 
                            placeholder="Search District" 
                            onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                const results = districts.filter(district => district.name.toLowerCase().includes(searchTerm));
                                setFilteredDistricts(searchTerm ? results : districts);
                            }}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    
                    <div className='input input-bordered flex flex-col gap-1 z-10 w-full h-48 overflow-scroll mt-2'>
                        {filteredDistricts.map((district) => (
                            <p 
                                key={district.value} 
                                className="cursor-pointer border-b border-slate-500 p-1 bg-lime-100" 
                                onClick={selectHandler}
                            >
                                {district.name}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DistrictPicker;


export const districts = [
    {
        name: "Bagerhat",
        value: "Bagerhat",
        upazilas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"]
    },
    {
        name: "Bandarban",
        value: "Bandarban",
        upazilas: ["Bandarban Sadar", "Lama", "Ruma", "Rowangchhari", "Thanchi", "Alikadam", "Naikhongchhari"]
    },
    {
        name: "Barguna",
        value: "Barguna",
        upazilas: ["Barguna Sadar", "Amtali", "Betagi", "Bamna", "Patharghata", "Taltali"]
    },
    {
        name: "Barishal",
        value: "Barishal",
        upazilas: ["Barishal Sadar", "Bakerganj", "Babuganj", "Banaripara", "Gouranadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"]
    },
    {
        name: "Bhola",
        value: "Bhola",
        upazilas: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"]
    },
    {
        name: "Bogura",
        value: "Bogura",
        upazilas: ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Sonatala"]
    },
    {
        name: "Brahmanbaria",
        value: "Brahmanbaria",
        upazilas: ["Brahmanbaria Sadar", "Ashuganj", "Bancharampur", "Bijoynagar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"]
    },
    {
        name: "Chandpur",
        value: "Chandpur",
        upazilas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab North", "Matlab South", "Shahrasti"]
    },
    {
        name: "Chattogram",
        value: "Chattogram",
        upazilas: ["Chattogram Sadar", "Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"]
    },
    {
        name: "Chuadanga",
        value: "Chuadanga",
        upazilas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"]
    },
    {
        name: "Cox's Bazar",
        value: "Cox's Bazar",
        upazilas: ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"]
    },
    {
        name: "Cumilla",
        value: "Cumilla",
        upazilas: ["Cumilla Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Daudkandi", "Debidwar", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Titas"]
    },
    {
        name: "Dhaka",
        value: "Dhaka",
        upazilas: ["Dhaka Sadar", "Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar"]
    },
    {
        name: "Dinajpur",
        value: "Dinajpur",
        upazilas: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"]
    },
    {
        name: "Faridpur",
        value: "Faridpur",
        upazilas: ["Faridpur Sadar", "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"]
    },
    {
        name: "Feni",
        value: "Feni",
        upazilas: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Fulgazi", "Sonagazi"]
    },
    {
        name: "Gaibandha",
        value: "Gaibandha",
        upazilas: ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Shaghata", "Sundarganj"]
    },
    {
        name: "Gazipur",
        value: "Gazipur",
        upazilas: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"]
    },
    {
        name: "Gopalganj",
        value: "Gopalganj",
        upazilas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"]
    },
    {
        name: "Habiganj",
        value: "Habiganj",
        upazilas: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj"]
    },
    {
        name: "Jamalpur",
        value: "Jamalpur",
        upazilas: ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"]
    },
    {
        name: "Jashore",
        value: "Jashore",
        upazilas: ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"]
    },
    {
        name: "Jhalokati",
        value: "Jhalokati",
        upazilas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"]
    },
    {
        name: "Jhenaidah",
        value: "Jhenaidah",
        upazilas: ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"]
    },
    {
        name: "Joypurhat",
        value: "Joypurhat",
        upazilas: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"]
    },
    {
        name: "Khagrachari",
        value: "Khagrachari",
        upazilas: ["Khagrachari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"]
    },
    {
        name: "Khulna",
        value: "Khulna",
        upazilas: ["Khulna Sadar", "Batiaghata", "Dacope", "Dumuria", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada"]
    },
    {
        name: "Kishoreganj",
        value: "Kishoreganj",
        upazilas: ["Kishoreganj Sadar", "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamoin", "Nikli", "Pakundia", "Tarail"]
    },
    {
        name: "Kurigram",
        value: "Kurigram",
        upazilas: ["Kurigram Sadar", "Bhurungamari", "Chilmari", "Nageshwari", "Phulbari", "Rajarhat", "Raomari", "Ulipur"]
    },
    {
        name: "Kushtia",
        value: "Kushtia",
        upazilas: ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Mirpur"]
    },
    {
        name: "Lakshmipur",
        value: "Lakshmipur",
        upazilas: ["Lakshmipur Sadar", "Ramganj", "Ramgati", "Kamalnagar", "Raipur"]
    },
    {
        name: "Lalmonirhat",
        value: "Lalmonirhat",
        upazilas: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"]
    },
    {
        name: "Madaripur",
        value: "Madaripur",
        upazilas: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"]
    },
    {
        name: "Magura",
        value: "Magura",
        upazilas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"]
    },
    {
        name: "Manikganj",
        value: "Manikganj",
        upazilas: ["Manikganj Sadar", "Daulatpur", "Ghior", "Harirampur", "Saturia", "Shivalaya", "Singair"]
    },
    {
        name: "Meherpur",
        value: "Meherpur",
        upazilas: ["Meherpur Sadar", "Gangni", "Mujibnagar"]
    },
    {
        name: "Moulvibazar",
        value: "Moulvibazar",
        upazilas: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"]
    },
    {
        name: "Munshiganj",
        value: "Munshiganj",
        upazilas: ["Munshiganj Sadar", "Gazaria", "Lohajang", "Sreenagar", "Tongibari"]
    },
    {
        name: "Mymensingh",
        value: "Mymensingh",
        upazilas: ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal"]
    },
    {
        name: "Naogaon",
        value: "Naogaon",
        upazilas: ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"]
    },
    {
        name: "Narail",
        value: "Narail",
        upazilas: ["Narail Sadar", "Kalia", "Lohagara"]
    },
    {
        name: "Narayanganj",
        value: "Narayanganj",
        upazilas: ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj", "Sonargaon"]
    },
    {
        name: "Narsingdi",
        value: "Narsingdi",
        upazilas: ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"]
    },
    {
        name: "Natore",
        value: "Natore",
        upazilas: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra"]
    },
    {
        name: "Netrokona",
        value: "Netrokona",
        upazilas: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala"]
    },
    {
        name: "Nilphamari",
        value: "Nilphamari",
        upazilas: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"]
    },
    {
        name: "Noakhali",
        value: "Noakhali",
        upazilas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Subarnachar"]
    },
    {
        name: "Pabna",
        value: "Pabna",
        upazilas: ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"]
    },
    {
        name: "Panchagarh",
        value: "Panchagarh",
        upazilas: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"]
    },
    {
        name: "Patuakhali",
        value: "Patuakhali",
        upazilas: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali"]
    },
    {
        name: "Pirojpur",
        value: "Pirojpur",
        upazilas: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Zianagar"]
    },
    {
        name: "Rajbari",
        value: "Rajbari",
        upazilas: ["Rajbari Sadar", "Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha"]
    },
    {
        name: "Rajshahi",
        value: "Rajshahi",
        upazilas: ["Rajshahi Sadar", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"]
    },
    {
        name: "Rangamati",
        value: "Rangamati",
        upazilas: ["Rangamati Sadar", "Baghaichhari", "Barkal", "Juraichhari", "Kaptai", "Langadu", "Naniarchar", "Rajasthali"]
    },
    {
        name: "Rangpur",
        value: "Rangpur",
        upazilas: ["Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha"]
    },
    {
        name: "Sylhet",
        value: "Sylhet",
        upazilas: ["Jaintapur", "Beanibazar", "Gowainghat"]
    }
];
