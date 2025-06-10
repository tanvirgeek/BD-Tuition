import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="p-10 w-full  bg-lime-100 text-gray-800">
            <footer className="footer grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* About Section */}
                <nav className="max-w-sm">
                    <h6 className="footer-title">About us</h6>
                    <p className="text-sm">
                        Private Tutor BD is a leading platform for finding the best Home Tutors or Students in Bangladesh!
                    </p>
                    <p>Easily connect with qualified tutors or students based on subjects, districts, classes, and institutes. Start your journey today! </p>
                </nav>

                {/* Quick Links */}
                <nav>
                    <h6 className="footer-title">Quick Links</h6>
                    <Link href="/login" className="link link-hover">Login</Link>
                    <Link href="/register" className="link link-hover">Register</Link>
                </nav>

                {/* Social Media Links */}
                <nav>
                    <h6 className="footer-title">Follow us</h6>
                    <div className="flex flex-col space-y-2">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 link link-hover">
                            <FaFacebook size={20} className="text-blue-600" />
                            Facebook
                        </a>
                        
                    </div>
                </nav>
            </footer>

            <div className="flex justify-center items-center text-nowrap mt-6 text-sm text-slate-500">
                ©️ Tuition BD. All Rights Reserved.
            </div>
        </div>
    );
};

export default Footer;
