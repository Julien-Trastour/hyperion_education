import React from "react";
import { Category } from "../../types/courses";

interface Props {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string) => void;
  isAddingCategory: boolean;
  setIsAddingCategory: (value: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  addCategory: () => void;
  editCategory: (categoryId: string, newName: string) => void;
  deleteCategory: (categoryId: string) => void;
}

const CategorySelector: React.FC<Props> = ({ 
  categories, selectedCategory, setSelectedCategory, 
  isAddingCategory, setIsAddingCategory, newCategoryName, setNewCategoryName, addCategory,
  editCategory, deleteCategory 
}) => {
  return (
    <div className="mb-6 bg-gray-50 border border-gray-300 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3">Catégories</h2>

        {isAddingCategory ? (
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-lg shadow-md transition w-1/2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border rounded-lg px-3 py-1 flex-1"
              placeholder="Nom de la catégorie"
            />
            <button onClick={addCategory} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">✅</button>
            <button onClick={() => setIsAddingCategory(false)} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">❌</button>
          </div>
        ) : (
          <button onClick={() => setIsAddingCategory(true)} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Ajouter</button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow">
            <button
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium ${
                selectedCategory === category.id ? "bg-indigo-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.categoryName}
            </button>
            <button 
              onClick={() => {
                const newName = prompt("Nouveau nom de la catégorie :", category.categoryName);
                if (newName) editCategory(category.id, newName);
              }} 
              className="text-yellow-600 hover:text-yellow-800 transition text-lg"
            >
              ✏️
            </button>
            <button 
              onClick={() => {
                if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
                  deleteCategory(category.id);
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

export default CategorySelector;
