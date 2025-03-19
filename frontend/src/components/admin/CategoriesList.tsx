import React, { useEffect, useState } from "react";
import { Category } from "../../types/courses";
import { fetchCategoriesBySubject, createCategory } from "../../api/courses";

interface Props {
  subjectId: string;
}

const CategoriesList: React.FC<Props> = ({ subjectId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Charger les catégories lorsqu'un sujet est affiché
  useEffect(() => {
    fetchCategoriesBySubject(subjectId)
      .then(setCategories)
      .catch(console.error);
  }, [subjectId]);

  // Fonction pour ajouter une nouvelle catégorie
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = await createCategory(subjectId, newCategoryName);
      setCategories([...categories, newCategory]); // Mise à jour immédiate de l'affichage
      setNewCategoryName(""); // Réinitialisation de l'input
      setIsAddingCategory(false); // Fermeture du champ
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la catégorie :", error);
    }
  };

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-300 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3">Categories</h3>

        {/* Input d'ajout de catégorie sur la même ligne */}
        {isAddingCategory ? (
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-lg shadow-md transition w-1/2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border rounded-lg px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Nom de la catégorie"
            />
            <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md text-sm" onClick={handleAddCategory}>
              ✅
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md text-sm" onClick={() => setIsAddingCategory(false)}>
              ❌
            </button>
          </div>
        ) : (
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md text-sm" onClick={() => setIsAddingCategory(true)}>
            + Add
          </button>
        )}
      </div>

      {/* Liste des catégories */}
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition-all">
            <span className="text-gray-800 font-medium">{category.categoryName}</span>
            <div className="flex gap-2">
              <button className="text-yellow-600 hover:text-yellow-800 transition text-lg">✏️</button>
              <button className="text-red-600 hover:text-red-800 transition text-lg">❌</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic text-center">Aucune catégorie.</p>
      )}
    </div>
  );
};

export default CategoriesList;
