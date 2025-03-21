import React from "react";

interface Props {
  cycles: { id: string; cycleName: string }[];
  selectedCycle: string | null;
  setSelectedCycle: (cycleId: string) => void;
}

const CycleSelector: React.FC<Props> = ({ cycles, selectedCycle, setSelectedCycle }) => {
  return (
    <div className="mb-6 bg-gray-50 border border-gray-300 rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-3 border-l-4 border-blue-500 pl-3">Cycles</h2>
      <div className="flex flex-wrap gap-3">
        {cycles.map((cycle) => (
          <button
            key={cycle.id}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium ${
              selectedCycle === cycle.id ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCycle(cycle.id)}
          >
            {cycle.cycleName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CycleSelector;
