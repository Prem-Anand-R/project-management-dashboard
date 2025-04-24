
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import KanbanBoard from '@/components/KanbanBoard/KanbanBoard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, FolderKanban, CheckCircle, BarChart2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { employees, projects, tasks } = state;
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(task => task.projectId === selectedProject);
  
  // Calculate statistics
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-dashboard-blue to-dashboard-purple bg-clip-text text-transparent">Dashboard Overview</h1>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-dashboard-blue"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Employees</CardTitle>
              <div className="bg-blue-100 p-2 rounded-full text-dashboard-blue">
                <Users size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{employees.length}</p>
            <p className="text-sm text-gray-500 mt-1">Team members</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-dashboard-purple"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Projects</CardTitle>
              <div className="bg-purple-100 p-2 rounded-full text-dashboard-purple">
                <FolderKanban size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active projects</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-dashboard-green"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Completion Rate</CardTitle>
              <div className="bg-green-100 p-2 rounded-full text-dashboard-green">
                <CheckCircle size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionPercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-dashboard-green h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-orange-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-dashboard-orange"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Tasks</CardTitle>
              <div className="bg-orange-100 p-2 rounded-full text-dashboard-orange">
                <BarChart2 size={18} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tasks.length}</p>
            <p className="text-sm text-gray-500 mt-1">{completedTasks} completed</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Project Filter */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
        <span className="text-gray-700 font-medium">Filter by Project:</span>
        <Select
          value={selectedProject}
          onValueChange={(value) => setSelectedProject(value)}
        >
          <SelectTrigger className="w-[240px] border-0 bg-gray-50">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Kanban Board */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4">Task Board</h2>
        <ScrollArea className=" ">
          <div className="pr-4">
            <KanbanBoard tasks={filteredTasks} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Dashboard;
