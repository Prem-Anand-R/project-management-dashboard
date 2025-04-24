
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { initialEmployees, initialProjects, initialTasks } from '@/lib/data';
import type { Employee, Project, Task, TaskStatus } from '@/lib/data';
import { toast } from 'sonner';

// Types
type AppState = {
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
};

type Action =
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: TaskStatus } };

// Load initial state from localStorage if available
const loadInitialState = (): AppState => {
  try {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return {
    employees: initialEmployees,
    projects: initialProjects,
    tasks: initialTasks,
  };
};

// Save state to localStorage
const saveState = (state: AppState): void => {
  try {
    localStorage.setItem('appState', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

const appReducer = (state: AppState, action: Action): AppState => {
  let newState: AppState;
  
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      newState = {
        ...state,
        employees: [...state.employees, action.payload],
      };
      break;
    case 'UPDATE_EMPLOYEE':
      newState = {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === action.payload.id ? action.payload : employee
        ),
      };
      break;
    case 'DELETE_EMPLOYEE': {
      const employeeId = action.payload;
      // Check if employee is assigned to any project
      const assignedToProject = state.projects.some((project) =>
        project.assignedEmployees.includes(employeeId)
      );
      // Check if employee is assigned to any task
      const assignedToTask = state.tasks.some(
        (task) => task.assignedEmployeeId === employeeId
      );

      if (assignedToProject || assignedToTask) {
        toast.error('Cannot delete employee assigned to projects or tasks');
        return state;
      }
      
      newState = {
        ...state,
        employees: state.employees.filter((employee) => employee.id !== employeeId),
      };
      break;
    }
    case 'ADD_PROJECT':
      newState = {
        ...state,
        projects: [...state.projects, action.payload],
      };
      break;
    case 'UPDATE_PROJECT':
      newState = {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
      break;
    case 'DELETE_PROJECT': {
      const projectId = action.payload;
      // Check if there are tasks associated with this project
      const hasTasks = state.tasks.some((task) => task.projectId === projectId);

      if (hasTasks) {
        toast.error('Cannot delete project with associated tasks');
        return state;
      }

      newState = {
        ...state,
        projects: state.projects.filter((project) => project.id !== projectId),
      };
      break;
    }
    case 'ADD_TASK':
      newState = {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
      break;
    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
      break;
    case 'DELETE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
      break;
    case 'UPDATE_TASK_STATUS':
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
      break;
    default:
      return state;
  }
  
  // Save state to localStorage after each update
  saveState(newState);
  
  return newState;
};

// Context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
