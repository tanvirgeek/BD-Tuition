import React, { useEffect, useState } from 'react'
import { IoMdArrowDropdown } from 'react-icons/io';

interface ItemPickerProps {
  items: string[];
  initialItem: string;
  handleSelect: (selectedItem: string) => void;
}



const ItemPicker: React.FC<ItemPickerProps> = ({ items, initialItem, handleSelect }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [initialValue, setInitialValue] = useState(initialItem);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const handleDropDown = () => {
    setIsMenuOpen((prev) => !prev)
  }

   const selectHandler = (event: React.MouseEvent<HTMLParagraphElement>) => {
         setInitialValue(event.currentTarget.innerHTML);
         handleSelect(event.currentTarget.innerHTML);
         setIsMenuOpen(false);
      }
  

  useEffect(() => {
    setFilteredItems(items);
  }, [])

  return (
    <div className='h-full w-full'>
      <div className=' input input-bordered flex justify-between items-center' onClick={handleDropDown}>
        <p>{initialValue}</p>
        <IoMdArrowDropdown />

      </div>

      {isMenuOpen && (
        <div className=' mt-2'>
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search Institution" onChange={(e) => {
              const searchedTerm = e.target.value

              const results = items.filter((item) => item.toLowerCase().includes(searchedTerm.toLocaleLowerCase()))

              if (searchedTerm) {
                setFilteredItems(results)

              } else {
                setFilteredItems(items)
              }


            }} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd" />
            </svg>
          </label>

          <div className=' input input-bordered flex flex-col gap-1 z-10 w-full h-48 overflow-scroll mt-2'>
            {filteredItems.map((item, index) => (
              <p className=" cursor-pointer border-b border-slate-500 p-1 bg-lime-100" key={index} onClick={selectHandler}>{item}</p>
            ))}
          </div>

        </div>



      )}
    </div>
  )
}

export default ItemPicker;


export const publicUniversities = [
  "University of Dhaka, DU",
  "University of Rajshahi, RU",
  "Bangladesh Agricultural University, BAU",
  "Bangladesh University of Engineering & Technology, BUET",
  "University of Chittagong, CU",
  "Jahangirnagar University, JU",
  "Islamic University, Bangladesh, IU",
  "Shahjalal University of Science and Technology, SUST",
  "Khulna University, KU",
  "Bangladesh Open University, BOU",
  "National University Bangladesh, NU",
  "Bangabandhu Sheikh Mujibur Rahman Agricultural University, BSMRAU",
  "Bangabandhu Sheikh Mujib Medical University, BSMMU",
  "Hajee Mohammad Danesh Science & Technology University, HSTU",
  "Mawlana Bhashani Science and Technology University, MBSTU",
  "Patuakhali Science and Technology University, PSTU",
  "Noakhali Science and Technology University, NSTU",
  "Jagannath University, JnU",
  "Comilla University, CoU",
  "Jatiya Kabi Kazi Nazrul Islam University, JKKNIU",
  "Chittagong University of Engineering & Technology, CUET",
  "Rajshahi University of Engineering & Technology, RUET",
  "Dhaka University of Engineering & Technology, DUET",
  "Khulna University of Engineering & Technology, KUET",
  "Pabna University of Science and Technology, PUST",
  "Bangladesh University of Professionals, BUP",
  "Bangabandhu Sheikh Mujibur Rahman Science and Technology University, BSMRSTU",
  "Begum Rokeya University, BRUR",
  "University of Barisal, BU",
  "Bangladesh University of Textiles, BUTEX",
  "Bangabandhu Sheikh Mujibur Rahman Maritime University, BSMRMU",
  "Chittagong Veterinary and Animal Sciences University, CVASU",
  "Sylhet Agricultural University, SylAU",
  "Sher-e-Bangla Agricultural University, SAU",
  "Jessore University of Science & Technology, JUST",
  "Islamic Arabic University, IAU",
  "Chittagong Medical University, CMU",
  "Rajshahi Medical University, RMU",
  "Sylhet Medical University, SMU",
  "Khulna Agricultural University, KAU",
  "Habiganj Agricultural University, HAU",
  "Sheikh Hasina University, SHU",
  "Bangabandhu Sheikh Mujibur Rahman Aviation and Aerospace University, BSMRAAU",
  "Bangabandhu Sheikh Mujibur Rahman Digital University, BDU",
  "Bangamata Sheikh Fojilatunnesa Mujib Science & Technology University, BSFMSTU",
  "Chandpur Science and Technology University, CSTU",
  "Sunamganj Science and Technology University, SSTU",
  "Bogura Science and Technology University, BSTU",
  "Lakshmipur Science and Technology University, LSTU",
  "Bangabandhu Sheikh Mujibur Rahman Science and Technology University, Pirojpur, BSMRSUP",
  "Thakurgaon University, TU",
  "Kurigram Agricultural University, KuriAU",
  "Bangabandhu Sheikh Mujibur Rahman University, Naogaon, BSMRU",
  "North South University, NSU",
  "University of Science and Technology Chittagong, USTC",
  "Independent University, Bangladesh, IUB",
  "Central Women's University, CWU",
  "American International University-Bangladesh, AIUB",
  "Ahsanullah University of Science and Technology, AUST",
  "East West University, EWU",
  "International Islamic University Chittagong, IIUC",
  "University of Asia Pacific, UAP",
  "Gono Bishwabidyalay, GB",
  "BRAC University, BRACU",
  "Manarat International University, MIU",
  "Bangladesh University, BU",
  "Leading University, LU",
  "Daffodil International University, DIU",
  "Premier University, PU",
  "Bangladesh University of Business and Technology, BUBT",
  "Stamford University Bangladesh, SUB",
  "State University of Bangladesh, SUB",
  "Southeast University, SEU",
  "Prime University, PU",
  "Northern University Bangladesh, NUB",
  "United International University, UIU",
  "University of Development Alternative, UODA",
  "University of Information Technology and Sciences, UITS",
  "The People's University of Bangladesh, PUB",
  "ASA University Bangladesh, ASAUB",
  "Victoria University of Bangladesh, VUB",
  "Bangladesh University of Health Sciences, BUHS",
  "University of South Asia, UNISA",
  "Green University of Bangladesh, GUB",
  "World University of Bangladesh, WUB",
  "Shanto-Mariam University of Creative Technology, SMUCT",
  "Eastern University, EU",
  "Dhaka International University, DIU",
  "Presidency University, PU",
  "Primeasia University, PAU",
  "Royal University of Dhaka, RUD",
  "University of Liberal Arts Bangladesh, ULAB",
  "Southern University Bangladesh, SUB",
  "IBAIS University, IBAISU",
  "International University of Business Agriculture and Technology, IUBAT",
  "Millennium University, MU",
  "University of Creative Technology Chittagong, UCTC",
  "University of Global Village, UGV",
  "University of Skill Enrichment and Technology, USET",
  "Z.H. Sikder University of Science and Technology, ZHSUST",
  "Canadian University of Bangladesh, CUB",
  "Notre Dame University Bangladesh, NDUB",
  "North Western University, NWU",
  "Port City International University, PCIU",
  "Prime University of Science and Technology, PUST",
  "Rajshahi Science and Technology University, RSTU",
  "Sonargaon University, SU",
  "Southern University of Bangladesh, SUB",
  "Sylhet International University, SIU",
  "Times University Bangladesh, TUB",
  "University of Brahmanbaria, UB",
  "University of Creative Technology Chittagong, UCTC",
  "University of Global Village, UGV",
  "University of Skill Enrichment and Technology, USET",
  "Varendra University, VU",
  "Z.H. Sikder University of Science and Technology, ZHSUST",
  "Dhaka Medical College, DMC",
  "Sir Salimullah Medical College, SSMC",
  "Shaheed Suhrawardy Medical College, ShSMC",
  "Mymensingh Medical College, MMC",
  "Chattogram Medical College, CMC",
  "Rajshahi Medical College, RMC",
  "Sylhet MAG Osmani Medical College, SOMC",
  "Sher-e-Bangla Medical College, SBMC",
  "Rangpur Medical College, RpMC",
  "Cumilla Medical College, CuMC",
  "Khulna Medical College, KMC",
  "Shaheed Ziaur Rahman Medical College, SZMC",
  "Faridpur Medical College, FMC",
  "Dinajpur Medical College, DjMC",
  "Pabna Medical College, PMC",
  "Noakhali Medical College, NMC",
  "Cox’s Bazar Medical College, CBMC",
  "Jashore Medical College, JMC",
  "Satkhira Medical College, SMC",
  "Shaheed Syed Nazrul Islam Medical College, SSNIMC",
  "Kushtia Medical College, KuMC",
  "Sheikh Sayera Khatun Medical College, SSKMC",
  "Shaheed Taj Uddin Ahmed Medical College, STAMC",
  "Tangail Medical College, TMC",
  "Jamalpur Medical College, JmMC",
  "Manikganj Medical College, MkMC",
  "Shaheed M Monsur Ali Medical College, SMMAMC",
  "Patuakhali Medical College, PtMC",
  "Rangamati Medical College, RmMC",
  "Sheikh Hasina Medical College, SHMC",
  "Netrokona Medical College, NtMC",
  "Nilphamari Medical College, NlMC",
  "Naogaon Medical College, NgMC",
  "Magura Medical College, MgMC",
  "Bangladesh Medical College, BMC",
  "Jahurul Islam Medical College, JIMC",
  "Dhaka National Medical College, DNMC",
  "Holy Family Red Crescent Medical College, HFRCMC",
  "Ibrahim Medical College, IMC",
  "Community Based Medical College, CBMC",
  "Enam Medical College, EMC",
  "Z.H. Sikder Women's Medical College, ZHSWMC",
  "Green Life Medical College, GLMC",
  "Anwer Khan Modern Medical College, AKMMC",
  "East West Medical College, EWMC",
  "Northern International Medical College, NIMC",
  "Southern Medical College, SMC",
  "International Medical College, IMC",
  "Ad-din Women's Medical College, AWMC",
  "Medical College for Women and Hospital, MCW&H",
  "Khwaja Yunus Ali Medical College, KYAMC",
  "Uttara Adhunik Medical College, UAMC",
  "Marks Medical College, MMC",
  "Monno Medical College, MMC",
  "Tairunnessa Memorial Medical College, TMMC",
  "Prime Medical College, PMC",
  "Rangpur Community Medical College, RCMC",
  "Ibn Sina Medical College, ISMC",
  "Popular Medical College, PMC",
  "Gazi Medical College, GMC",
  "Barind Medical College, BMC",
  "Eastern Medical College, EMC",
  "Central Medical College, CeMC",
  "Islami Bank Medical College, IBMC",
  "North Bengal Medical College, NBMC",
  "TMSS Medical College, TMC",
  "Universal Medical College, UMC",
  "Mainamoti Medical College, MMC",
  "Dr. Sirajul Islam Medical College, DSIMC",
  "Ashiyan Medical College, AMC",
  "Bikrampur Bhuiyan Medical College, BBMC",
  "City Medical College, CMC",
  "US-Bangla Medical College, UBMC",
  "Prime Islami Medical College, PIMC",
  "Shahabuddin Medical College, SMC",
  "Kumudini Women's Medical College, KWMC",
  "Nightingale Medical College, NMC",
  "Care Medical College, CMC",
  "Bashundhara Ad-din Medical College, BAMC",
  "President Abdul Hamid Medical College, PAHMC",
  "Ahsania Mission Medical College, AMMC",
  "TMSS Medical College, TMC",
  "Sylhet Women's Medical College, SWMC",
  "Parkview Medical College, PvMC",
  "Jalalabad Ragib-Rabeya Medical College, JRRMC",
  "North East Medical College, NEMC",
  "Community Medical College, CMC",
  "Brahmanbaria Medical College, BrMC",
  "Ad-din Sakina Medical College, ASMC",
  "Universal Medical College, UMC",
  "International Medical College, IMC",
  "Green Life Medical College, GLMC",
  "Anwer Khan Modern Medical College, AKMMC",
  "Delta Medical College, DMC",
  "East West Medical College, EWMC",
  "Holy Family Red Crescent Medical College, HFRCMC",
  "Ibrahim Medical College, IMC",
  "Jahurul Islam Medical College, JIMC",
  "Dhaka National Medical College, DNMC",
  "Bangladesh Medical College, BMC"
];

