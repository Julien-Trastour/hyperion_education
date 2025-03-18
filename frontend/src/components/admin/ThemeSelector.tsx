import React from "react";
import { Theme } from "../../types/courses";

interface Props {
  themes: Theme[];
  selectedTheme: string | null;
  setSelectedTheme: (themeId: string) => void;
  isAddingTheme: boolean;
  setIsAddingTheme: (value: boolean) => void;
  newThemeName: string;
  setNewThemeName: (name: string) => void;
  addTheme: () => void;
  editTheme: (themeId: string, newName: string) => void;
  deleteTheme: (themeId: string) => void;
}

const ThemeSelector: React.FC<Props> = ({ 
  themes, selectedTheme, setSelectedTheme, 
  isAddingTheme, setIsAddingTheme, newThemeName, setNewThemeName, addTheme,
  editTheme, deleteTheme 
}) => {
  return (
    <div className="mb-6 bg-gray-50 border border-gray-300 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700 border-l-4 border-red-500 pl-3">Thèmes</h2>

        {isAddingTheme ? (
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-lg shadow-md transition w-1/2">
            <input
              type="text"
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              className="border rounded-lg px-3 py-1 flex-1"
              placeholder="Nom du thème"
            />
            <button onClick={addTheme} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">✅</button>
            <button onClick={() => setIsAddingTheme(false)} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">❌</button>
          </div>
        ) : (
          <button onClick={() => setIsAddingTheme(true)} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Ajouter</button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {themes.map((theme) => (
          <div key={theme.id} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow">
            <button
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium ${
                selectedTheme === theme.id ? "bg-red-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              {theme.themeName}
            </button>
            <button 
              onClick={() => {
                const newName = prompt("Nouveau nom du thème :", theme.themeName);
                if (newName) editTheme(theme.id, newName);
              }} 
              className="text-yellow-600 hover:text-yellow-800 transition text-lg"
            >
              ✏️
            </button>
            <button 
              onClick={() => {
                if (confirm("Voulez-vous vraiment supprimer ce thème ?")) {
                  deleteTheme(theme.id);
                }
              }} 
              className="text-red-600 hover:text-red-800 transition text-lg"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
