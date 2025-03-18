import { useEffect } from "react";
import { useAtom } from "jotai";
import { 
  cyclesAtom, selectedCycleAtom, fetchCyclesAtom, 
  classesAtom, selectedClassAtom, fetchClassesAtom, 
  subjectsAtom, selectedSubjectAtom, fetchSubjectsAtom, 
  categoriesAtom, selectedCategoryAtom, fetchCategoriesAtom,
  themesAtom, selectedThemeAtom, fetchThemesAtom,
  isAddingSubjectAtom, newSubjectNameAtom, addSubjectAtom, editSubjectAtom, deleteSubjectAtom,
  isAddingCategoryAtom, newCategoryNameAtom, addCategoryAtom, editCategoryAtom, deleteCategoryAtom,
  isAddingThemeAtom, newThemeNameAtom, addThemeAtom, editThemeAtom, deleteThemeAtom
} from "../../store/coursesStore";

import CycleSelector from "../../components/admin/CycleSelector";
import ClassSelector from "../../components/admin/ClassSelector";
import SubjectSelector from "../../components/admin/SubjectSelector";
import CategorySelector from "../../components/admin/CategorySelector";
import ThemeSelector from "../../components/admin/ThemeSelector";

export default function ManageCoursesPage() {
  const [, fetchCycles] = useAtom(fetchCyclesAtom);
  const [, fetchClasses] = useAtom(fetchClassesAtom);
  const [, fetchSubjects] = useAtom(fetchSubjectsAtom);
  const [, fetchCategories] = useAtom(fetchCategoriesAtom);
  const [, fetchThemes] = useAtom(fetchThemesAtom);

  const [cycles] = useAtom(cyclesAtom);
  const [selectedCycle, setSelectedCycle] = useAtom(selectedCycleAtom);
  const [classes] = useAtom(classesAtom);
  const [selectedClass, setSelectedClass] = useAtom(selectedClassAtom);
  const [subjects] = useAtom(subjectsAtom);
  const [selectedSubject, setSelectedSubject] = useAtom(selectedSubjectAtom);
  const [categories] = useAtom(categoriesAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [themes] = useAtom(themesAtom);
  const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom);

  const [isAddingSubject, setIsAddingSubject] = useAtom(isAddingSubjectAtom);
  const [newSubjectName, setNewSubjectName] = useAtom(newSubjectNameAtom);
  const [, addSubject] = useAtom(addSubjectAtom);
  const [, editSubject] = useAtom(editSubjectAtom);
  const [, deleteSubject] = useAtom(deleteSubjectAtom);

  const [isAddingCategory, setIsAddingCategory] = useAtom(isAddingCategoryAtom);
  const [newCategoryName, setNewCategoryName] = useAtom(newCategoryNameAtom);
  const [, addCategory] = useAtom(addCategoryAtom);
  const [, editCategory] = useAtom(editCategoryAtom);
  const [, deleteCategory] = useAtom(deleteCategoryAtom);

  const [isAddingTheme, setIsAddingTheme] = useAtom(isAddingThemeAtom);
  const [newThemeName, setNewThemeName] = useAtom(newThemeNameAtom);
  const [, addTheme] = useAtom(addThemeAtom);
  const [, editTheme] = useAtom(editThemeAtom);
  const [, deleteTheme] = useAtom(deleteThemeAtom);

  // ✅ Charger les cycles au démarrage
  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  // ✅ Charger les classes quand un cycle est sélectionné
  useEffect(() => {
    fetchClasses();
  }, [selectedCycle, fetchClasses]);

  // ✅ Charger les matières quand une classe est sélectionnée
  useEffect(() => {
    fetchSubjects();
  }, [selectedClass, fetchSubjects]);

  // ✅ Charger les catégories quand une matière est sélectionnée
  useEffect(() => {
    fetchCategories();
  }, [selectedSubject, fetchCategories]);

  // ✅ Charger les thèmes quand une catégorie est sélectionnée
  useEffect(() => {
    fetchThemes();
  }, [selectedCategory, fetchThemes]);

  return (
    <div className="p-8 w-full mx-auto bg-white shadow-md rounded-lg flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Courses</h1>

      <CycleSelector cycles={cycles} selectedCycle={selectedCycle} setSelectedCycle={setSelectedCycle} />

      {selectedCycle && (
        <ClassSelector 
            classes={classes} 
            selectedClass={selectedClass} 
            setSelectedClass={setSelectedClass}
        />
      )}

      {selectedClass && (
        <SubjectSelector 
          subjects={subjects} 
          selectedSubject={selectedSubject} 
          setSelectedSubject={setSelectedSubject} 
          isAddingSubject={isAddingSubject} 
          setIsAddingSubject={setIsAddingSubject} 
          newSubjectName={newSubjectName} 
          setNewSubjectName={setNewSubjectName} 
          addSubject={addSubject} 
          editSubject={editSubject} 
          deleteSubject={deleteSubject}
        />
      )}

      {selectedSubject && (
        <CategorySelector 
            categories={categories[selectedSubject] || []} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            isAddingCategory={isAddingCategory[selectedSubject] || false}
            setIsAddingCategory={(value) => setIsAddingCategory((prev) => ({ ...prev, [selectedSubject]: value }))} 
            newCategoryName={newCategoryName[selectedSubject] || ""}
            setNewCategoryName={(name) => setNewCategoryName((prev) => ({ ...prev, [selectedSubject]: name }))} 
            addCategory={() => addCategory(selectedSubject)}
            editCategory={editCategory}
            deleteCategory={deleteCategory}
        />
      )}

      {selectedCategory && (
        <ThemeSelector 
          themes={themes[selectedCategory] || []} 
          selectedTheme={selectedTheme} 
          setSelectedTheme={setSelectedTheme} 
          isAddingTheme={isAddingTheme[selectedCategory] || false} 
          setIsAddingTheme={(value) => setIsAddingTheme((prev) => ({ ...prev, [selectedCategory]: value }))} 
          newThemeName={newThemeName[selectedCategory] || ""} 
          setNewThemeName={(name) => setNewThemeName((prev) => ({ ...prev, [selectedCategory]: name }))} 
          addTheme={() => addTheme(selectedCategory)}
          editTheme={editTheme}
          deleteTheme={deleteTheme}
        />
      )}
    </div>
  );
}
