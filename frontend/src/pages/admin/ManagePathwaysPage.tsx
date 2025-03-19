import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { pathwaysAtom, pathwaysWithRelationsAtom, fetchPathwaysAtom, deletePathwayAtom } from "../../store/pathwaysStore";
import { Pencil, Trash2, PlusCircle, ExternalLink } from "lucide-react";
import AddPathwayForm from "../../components/admin/AddPathwayForm";
import EditPathwayForm from "../../components/admin/EditPathwayForm";
import { Link } from "react-router";

export default function ManagePathwaysPage() {
  const [isAddingPathway, setIsAddingPathway] = useState(false);
  const [editingPathwayId, setEditingPathwayId] = useState<string | null>(null);

  const [pathways] = useAtom(pathwaysAtom);
  const [pathwaysWithRelations] = useAtom(pathwaysWithRelationsAtom);
  const [, fetchPathways] = useAtom(fetchPathwaysAtom);
  const [, deletePathway] = useAtom(deletePathwayAtom);

  // 🔹 Charger les parcours au montage du composant
  useEffect(() => {
    fetchPathways();
  }, [fetchPathways]);

  // 🔹 Fonction pour supprimer un parcours
  const handleDelete = async (id: string) => {
    if (!window.confirm("❗ Voulez-vous vraiment supprimer ce parcours ?")) return;
    try {
      await deletePathway(id);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du parcours :", error);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📚 Gestion des parcours</h1>

      {/* ✅ Affichage du formulaire d'ajout */}
      {isAddingPathway ? (
        <AddPathwayForm setIsAddingPathway={setIsAddingPathway} />
      ) : editingPathwayId ? (
        // ✅ Affichage du formulaire de modification avec les données du parcours sélectionné
        <EditPathwayForm 
          pathwayId={editingPathwayId} 
          pathwayData={pathwaysWithRelations[editingPathwayId]} 
          setIsEditing={setEditingPathwayId} 
        />
      ) : (
        <>
          {/* 🔹 Bouton Ajouter */}
          <div className="mb-4 flex justify-end">
            <button
              className="px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-fit"
              onClick={() => setIsAddingPathway(true)}
            >
              <PlusCircle size={20} />
              <span>Ajouter un parcours</span>
            </button>
          </div>

          {/* 🔹 Tableau des parcours */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-3 text-left">Nom du parcours</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Cycle</th>
                  <th className="px-4 py-3 text-left">Classe</th>
                  <th className="px-4 py-3 text-left">Matière</th>
                  <th className="px-4 py-3 text-left">Catégorie</th>
                  <th className="px-4 py-3 text-left">Thème</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pathways.length > 0 ? (
                  pathways.map((pathway) => {
                    const pathwayData = pathwaysWithRelations[pathway.id];

                    return (
                      <tr key={pathway.id} className="border-t">
                        <td className="px-4 py-3 font-bold">{pathway.title}</td>
                        <td className="px-4 py-3">{pathway.description || "—"}</td>
                        <td className="px-4 py-3">{pathwayData?.theme?.category?.subject?.class?.cycle?.cycleName || "—"}</td>
                        <td className="px-4 py-3">{pathwayData?.theme?.category?.subject?.class?.className || "—"}</td>
                        <td className="px-4 py-3">{pathwayData?.theme?.category?.subject?.subjectName || "—"}</td>
                        <td className="px-4 py-3">{pathwayData?.theme?.category?.categoryName || "—"}</td>
                        <td className="px-4 py-3">{pathwayData?.theme?.themeName || "—"}</td>
                        <td className="px-4 py-3 flex justify-center gap-4">
                          {/* 🔹 Modifier */}
                          <button
                            onClick={() => setEditingPathwayId(pathway.id)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <Pencil size={20} />
                          </button>

                          {/* 🔹 Voir les détails du parcours */}
                          <Link 
                            to={`/admin/manage-pathways/${pathway.id}`} 
                            className="text-gray-600 hover:text-gray-800 transition"
                          >
                            <ExternalLink size={20} />
                          </Link>

                          {/* 🔹 Supprimer */}
                          <button 
                            onClick={() => handleDelete(pathway.id)} 
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-6">
                      Aucun parcours disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
