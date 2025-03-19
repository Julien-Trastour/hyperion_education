import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { editPathwayAtom } from "../../store/pathwaysStore";
import { Theme } from "../../types/courses";

export default function EditPathwayForm({ pathwayId, pathwayData, setIsEditing }: { 
    pathwayId: string; 
    pathwayData: any;
    setIsEditing: (val: string | null) => void; 
}) {
  
  const [, editPathway] = useAtom(editPathwayAtom);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    themeId: "",
  });

  const [loading, setLoading] = useState(false);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);

  // 🔹 Charger les données existantes
  useEffect(() => {
    if (pathwayData) {
      setFormData({
        title: pathwayData.title || "",
        description: pathwayData.description || "",
        themeId: pathwayData.themeId || "",
      });

      // 🔹 Charger les thèmes liés à la catégorie
      if (pathwayData.theme?.category?.themes && Array.isArray(pathwayData.theme.category.themes)) {
        setAvailableThemes(pathwayData.theme.category.themes);
      }
    }
  }, [pathwayData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editPathway({
        id: pathwayId,
        ...formData,
      });

      alert("✅ Parcours mis à jour avec succès !");
      setIsEditing(null);
    } catch (error) {
      alert("❌ Impossible de modifier le parcours.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">✏️ Modifier le parcours</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 🔹 Nom du parcours */}
        <label>
          <span className="text-gray-700 font-medium">Nom du parcours</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* 🔹 Description du parcours */}
        <label>
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* 🔹 Sélection du thème */}
        <label>
          <span className="text-gray-700 font-medium">Thème</span>
          <select
            name="themeId"
            value={formData.themeId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner un thème</option>
            {availableThemes.length > 0 ? (
              availableThemes.map((theme: Theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.themeName}
                </option>
              ))
            ) : (
              <option disabled>Aucun thème disponible</option>
            )}
          </select>
        </label>

        {/* 🔹 Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => setIsEditing(null)} 
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Annuler
          </button>

          <button 
            type="submit" 
            disabled={loading} 
            className={`px-4 py-2 rounded-lg transition text-white font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Modification en cours..." : "Modifier"}
          </button>
        </div>
      </form>
    </div>
  );
}
