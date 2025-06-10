"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaPaperPlane } from "react-icons/fa";

const socialLinks = [
  { icon: FaFacebook, link: "https://www.facebook.com/tanjim.safat.2024", color: "#1877F2" },
  { icon: FaLinkedin, link: "https://www.linkedin.com/in/tanjim-alam-524526296", color: "#0077B5" },
  { icon: FaWhatsapp, link: "https://wa.me/8801910618300", color: "#25D366" },
];

const Contact = () => {
  const [emailBody, setEmailBody] = useState("Hello! I am ...");

  return (
    <div
      className="flex flex-col w-full items-center gap-14 py-24 px-6 md:px-16 md:py-8"
    >
      {/* Email Section */}
      <motion.div
        className="flex flex-col items-center w-full gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <p className="text-base md:text-lg font-medium text-base-content text-opacity-75">
          Feel free to contact us for any suggestions or assistance with our helpline services.
        </p>

        <div className="flex flex-col items-center gap-2 w-full justify-center">
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Primary"
            className="textarea textarea-primary rounded-2xl h-40 w-2/3 lg:w-1/4" />

          <motion.a
            href={`mailto:safatd310e@gmail.com?subject=Contacting%20From%20Tuition%20BD&body=${encodeURIComponent(emailBody)}`}
            className="btn btn-primary p-3 w-2/3 lg:w-1/4 text-white rounded-2xl shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <button className="flex gap-4 items-center justify-between">
              <p className=" text-lg font-semibold">Send</p>
              <FaPaperPlane className="text-xl" />
            </button>

          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;