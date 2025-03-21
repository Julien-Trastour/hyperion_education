// 📚 Types de base pour la hiérarchie éducative

export type Cycle = {
  id: string;
  cycleName: string;
};

export type Class = {
  id: string;
  className: string;
  cycleId?: string;
};

export type Subject = {
  id: string;
  subjectName: string;
  classId?: string;
};

export type Category = {
  id: string;
  categoryName: string;
  subjectId?: string;
};

export type Theme = {
  id: string;
  themeName: string;
  categoryId?: string; // idem
};
