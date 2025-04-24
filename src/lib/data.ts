// Mock data store for the Project Management Dashboard

// Types
export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  profileImage: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  logo: string;
  startDate: string;
  endDate: string;
  assignedEmployees: string[]; // Array of employee IDs
}

export type TaskStatus = 'needToDo' | 'inProgress' | 'needForTest' | 'completed' | 'reOpen';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedEmployeeId: string;
  eta: string;
  status: TaskStatus;
  referenceImages?: string[];
}

// Initial Data
export const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Frontend Developer',
    email: 'john.doe@company.com',
    profileImage: 'https://picsum.photos/id/1/200'
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'UX Designer',
    email: 'jane.smith@company.com',
    profileImage: 'https://picsum.photos/id/2/200'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    position: 'Backend Developer',
    email: 'robert.johnson@company.com',
    profileImage: 'https://picsum.photos/id/3/200'
  }
];

export const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesigning the company website with a modern UI/UX',
    logo: 'https://picsum.photos/id/4/200',
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    assignedEmployees: ['1', '2']
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Building a new mobile app for customer engagement',
    logo: 'https://picsum.photos/id/5/200',
    startDate: '2025-05-15',
    endDate: '2025-08-15',
    assignedEmployees: ['1', '3']
  }
];

export const initialTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Design Homepage Mockup',
    description: 'Create wireframes and mockups for the new homepage',
    assignedEmployeeId: '2',
    eta: '2025-05-15',
    referenceImages: ['https://picsum.photos/id/21/200'],
    status: 'inProgress'
  },
  {
    id: '2',
    projectId: '1',
    title: 'Implement Header Component',
    description: 'Develop the responsive header component based on design',
    assignedEmployeeId: '1',
    eta: '2025-05-20',
    referenceImages: ['https://picsum.photos/id/22/200'],
    status: 'needToDo'
  },
  {
    id: '3',
    projectId: '2',
    title: 'Setup Backend API',
    description: 'Create API endpoints for the mobile app',
    assignedEmployeeId: '3',
    eta: '2025-06-01',
    referenceImages: ['https://picsum.photos/id/23/200'],
    status: 'needToDo'
  },
  {
    id: '4',
    projectId: '2',
    title: 'Design User Profile Screen',
    description: 'Create mockup for the user profile screen',
    assignedEmployeeId: '1',
    eta: '2025-05-25',
    referenceImages: ['https://picsum.photos/id/24/200'],
    status: 'completed'
  }
];


