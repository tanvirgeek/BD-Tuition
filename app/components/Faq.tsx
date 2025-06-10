"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  { question: "Why use this website?", answer: "Our website provides free services. The Guardian or the student can directly contact with the teacher and discuss about the tuition. We do not act as a third party like other websites!" },
  { question: "Even after getting the service, the phone calls repeatedly?", answer: "Go to your profile and then click Edit Profile. Close the (Looking for Opportunities). You will no longer available now!" },
  { question: "How to fix salary?", answer: "Salary, time, how many days to teach etc. should be discussed directly with the teacher by guardian or student. Our website acts as a medium to find proper teachers and students in specific locations!" },
  { question: "How should the behavior be?", answer: "Be sure to use good manners when communicating. " },
  { question: "How to verify if the information is correct or not?", answer: "Make sure the person you are contacting is the right person! Take photos of documents(National ID Card / Student ID Card)! Check whether it is the right person by being added on Facebook if necessary!" },
  { question: "Are you thinking of stopping the tuition services?", answer: "Go to your profile and then click Edit Profile. Close the (Looking for Opportunities). You will no longer available now!" },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto my-10 p-5 sm:px-6">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            layout
            className="border border-gray-300 rounded-xl overflow-hidden bg-base-200"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Question Button */}
            <button
              className="w-full flex justify-between items-center p-4 bg-base-200 hover:bg-base-300 rounded-xl transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-base text-start md:text-lg font-medium">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <FaChevronDown className="text-xl" />
              </motion.div>
            </button>

            {/* Answer Section with Proper Exit Animation */}
            <AnimatePresence mode="wait">
              {openIndex === index && (
                <motion.div
                  key={`faq-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-base md:text-lg p-4 text-gray-700 bg-base-100 w-full break-words"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
