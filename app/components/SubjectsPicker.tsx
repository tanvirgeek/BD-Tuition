"use client";
import { useUserStore } from "@/store/store";
import React, { useEffect, useState } from "react";

const SubjectsPicker: React.FC<{ onSelectSubjects: (subjects: string[]) => void, initialSubjects: string[] }> = ({ onSelectSubjects, initialSubjects }) => {
  // Declare the subjects array inside the component
  const allSubjects = [
    "Bangla", "English", "Mathematics", "General Science", "Bangladesh and Global Studies",
    "Religious Studies", "Arts and Crafts", "Physical Education", "Physics", "Chemistry",
    "Biology", "Higher Mathematics", "Accounting", "Business Studies", "Economics",
    "Finance and Banking", "History", "Geography", "Civics", "ICT (Information and Communication Technology)",
    "Business Organization and Management", "Finance, Banking, and Insurance", "Sociology",
    "Logic/Philosophy", "University Admission", "Medical Admission", "Engineering Addmission"
  ];

  const { userInfo } = useUserStore();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSubjects);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect (() => {
    setSelectedSubjects(initialSubjects)
  }, [userInfo])

  const handleSubjectClick = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      // Deselect subject
      setSelectedSubjects(prev => prev.filter(s => s !== subject));
    } else {
      // Select subject
      if (selectedSubjects.length < 6) {
        setSelectedSubjects(prev => [...prev, subject]);
      }
    }

    setSearchTerm("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter subjects based on the search term
  const filteredSubjects = searchTerm
    ? allSubjects.filter(subject =>
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  // Call onSelectSubjects when selection changes
  useEffect(() => {
    onSelectSubjects(selectedSubjects);
  }, [selectedSubjects]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Display selected subjects as rounded badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSubjects.map((subject, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-200 text-base-content rounded-full text-sm cursor-pointer"
            onClick={() => handleSubjectClick(subject)}
          >
            {subject} <span className="ml-1">&times;</span>
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search subjects..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Show suggestions only when search term is not empty */}
      {searchTerm && filteredSubjects.length > 0 && (
        <ul className="space-y-2">
          {filteredSubjects.map(subject => (
            <li
              key={subject}
              onClick={() => handleSubjectClick(subject)}
              className={`cursor-pointer p-2 rounded border ${selectedSubjects.includes(subject) ? 'bg-blue-200 text-slate-950' : 'bg-lime-100'}`}
            >
              {subject}
            </li>
          ))}
        </ul>
      )}

      {/* Show message when no suggestions match */}
      {searchTerm && filteredSubjects.length === 0 && (
        <p className="text-gray-500">No subjects found.</p>
      )}
    </div>
  );
};

export default SubjectsPicker;
