import React from "react";
import { Class } from "../../types/courses";

interface Props {
  classes: Class[];
  selectedClass: string | null;
  setSelectedClass: (classId: string) => void;
}

const ClassSelector: React.FC<Props> = ({ classes, selectedClass, setSelectedClass }) => {
  return (
    <div className="mb-6 bg-gray-50 border border-gray-300 rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700 border-l-4 border-green-500 pl-3">Classes</h2>

      <div className="flex flex-wrap gap-3">
        {classes.map((cls) => (
          <button
            key={cls.id}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium ${
              selectedClass === cls.id ? "bg-green-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedClass(cls.id)}
          >
            {cls.className}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassSelector;
