import { UserData } from "./dashboard/page";
import { MdAppRegistration } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import FAQ from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { UserCardForNotLoggedin } from "./components/UserCardForNotLoggedin";
import { fetchStudents, fetchTeachers } from "@/lib/utils";
import Link from "next/link";


export default async function Home() {


  try {
    const teachers = await fetchTeachers();
    const students = await fetchStudents();

    return (
      <div>
        <div className="flex flex-col gap-6 max-w-screen-xl m-auto pt-6 px-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Find Private Tutors in Bangladesh
            </h1>
            <p className="text-lg md:text-xl text-start md:text-center text-gray-600 mt-4">
              Looking for a <span className=" font-semibold">home tutor</span>? Or want to <span className="font-semibold">become a tutor</span>?{" "}
              <strong>Private Tutor BD</strong> connects students with the best <span className="font-semibold">private tutors</span> in Bangladesh.
            </p>
          </div>

          {/* Call-to-Action (CTA) Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href={"/login"}>
              <button className="btn bg-lime-300 hover:bg-lime-400 px-6 text-lg">
                Find a Tutor
              </button>
            </Link>
            <Link href={"/register"}>
              <button className="btn btn-info px-6 text-lg">
                Become a Tutor
              </button>
            </Link>
          </div>

          {/* SEO-Optimized Section */}
          <section className="bg-gray-100 p-6 rounded-xl shadow-md text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Why Choose <span className="font-bold">&apos;Private Tutor BD&apos;</span>?
            </h2>
            <p className="text-gray-700 mt-3 text-start md:text-center">
              Whether you're a <span className=" font-semibold">student searching for a tutor</span> or a <span className="font-semibold">teacher looking for tuition</span>,{" "}
              <strong>PrivateTutorBD</strong> makes finding the perfect match <span className=" font-semibold">quick, safe, and hassle-free</span>.
            </p>{" "}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[auto_1px_auto] gap-6">
            {/* Teachers Section */}
            <div>
              <h2 className="text-2xl w-max lg:mx-auto font-semibold mb-4">Teachers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teachers.map((teacher: UserData) => (
                  <UserCardForNotLoggedin key={teacher.firebaseId} userData={teacher} />
                ))}
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] bg-gray-300"></div>

            {/* Students Section */}
            <div>
              <h2 className="text-2xl w-max lg:mx-auto font-semibold mb-4">Students</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {students.map((student: UserData) => (
                  <UserCardForNotLoggedin key={student.firebaseId} userData={student} />
                ))}
              </div>
            </div>
          </div>

          {/* How to find Teachers or Students? */}

          <div className="flex flex-col items-center mt-10">
            <div className="flex flex-col font-semibold self-start text-[1.4rem] md:text-4xl">
              <span>Find Teachers or Students</span>
              <span>on your location</span>
            </div>
            <div className=" flex flex-col items-center mt-16 md:mt-24">
              <span className=" text-3xl font-semibold">First register</span>
              <div className=" bg-lime-100 mt-8 rounded-full p-4">
                <MdAppRegistration className=" h-16 w-16" />

              </div>

              <span className="text-lg mt-4">Register for free for better result</span>
              <span className="flex text-center text-base mt-1 ">The only platform that provides free services</span>

            </div>

            <div className=" flex flex-col items-center mt-16 md:mt-24">
              <span className=" text-3xl font-semibold">Edit your profile</span>
              <div className=" bg-lime-100 mt-8 rounded-full p-6">
                <ImProfile className=" h-14 w-14" />
              </div>
              <span className="text-lg mt-4">This is very important part!</span>
              <span className="flex text-center text-base mt-1">Update your profile with correct information</span>


            </div>

            <div className=" flex flex-col items-center mt-16 md:mt-24">
              <span className=" text-3xl font-semibold">Go to dashboard</span>
              <div className=" bg-lime-100 mt-8 rounded-full p-4">
                <MdOutlineSpaceDashboard className=" h-16 w-16" />
              </div>
              <span className="text-lg mt-4">Find a teacher or student here</span>
              <span className="text-lg mt-1">that matches your needs</span>



            </div>

            <div className=" flex flex-col items-center mt-16 md:mt-24">
              <span className=" text-3xl font-semibold">You can search</span>
              <div className=" bg-lime-100 mt-8 rounded-full p-6">
                <FaSearch className=" h-14 w-14" />
              </div>

              <span className="flex text-center text-base mt-4">Need teacher from specific Institution?</span>
              <span className="flex text-center text-base mt-1">Search for everything you need!</span>


            </div>

            <div className=" flex flex-col items-center mt-16 md:mt-24">
              <span className=" text-3xl font-semibold">Contact directly</span>
              <div className=" bg-lime-100 mt-8 rounded-full p-6">
                <FaPhoneAlt className=" h-14 w-14" />
              </div>
              <span className="text-lg mt-4">Contact as per preference!!!</span>
              <span className="flex text-center text-base mt-2 ">Make sure the person you are contacting</span>
              <span className="flex text-center text-base">is the right person!</span>
            </div>

          </div>

          <div>
            <div className="font-semibold self-start mt-10 text-[1.4rem] md:text-4xl">
              Frequently Asked Questions
            </div>
            <FAQ />
          </div>

          <div>
            <div className="font-semibold self-start mt-10 text-[1.4rem] md:text-4xl">
              Contact us
            </div>
            <Contact />
          </div>

        </div>

        <Footer />

      </div>

    );
  } catch (error) {
    console.error(error);
    return <p className="text-red-500 text-center">Failed to load data.</p>;
  }
}




