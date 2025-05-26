// Placeholder StudentContext
import { createContext, useContext, useState, useEffect } from 'react';
const StudentContext = createContext();
export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  return <StudentContext.Provider value={{ students }}>{children}</StudentContext.Provider>;
}
export const useStudents = () => useContext(StudentContext);