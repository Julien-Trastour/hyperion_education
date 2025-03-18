export interface Cycle {
    id: string;
    cycleName: string;
  }
  
  export interface Class {
    id: string;
    className: string;
    cycleId: string;
  }
  
  export interface Subject {
    id: string;
    subjectName: string;
    classId: string;
  }
  
  export interface Category {
    id: string;
    categoryName: string;
    subjectId: string;
  }
  
  export interface Theme {
    id: string;
    themeName: string;
    categoryId: string;
  }
  