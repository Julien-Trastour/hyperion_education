import { Theme } from "./courses";

export type Lesson = {
  id: string;
  title: string;
  content: string;
  order: number;
  pathwayId: string;
};

export type PathwayExercise = {
  id: string;
  pathwayId: string;
  exerciseId: string;
  order: number;
  exercise: {
    title: string;
    content: string;
  };
};

export type PathwayWithRelations = {
    id: string;
    title: string;
    order: number;
    themeId: string;
    theme?: Theme;
    lessons: Lesson[];
    pathwayExercises: PathwayExercise[];
};  

export type Pathway = {
    id: string;
    title: string;
    description?: string;
    themeId: string;
    theme?: Theme & {
      category?: {
        subjectId: string;
      };
    };
  };
