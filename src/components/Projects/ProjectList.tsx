
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, Calendar, Users } from 'lucide-react';
import ProjectForm from './ProjectForm';
import { toast } from 'sonner';

const ProjectList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { projects, employees } = state;
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<{
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    logo: string;
    assignedEmployees: string[];
  } | null>(null);

  const handleAddClick = () => {
    setCurrentProject(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (project: { id: string; title: string; description: string; startDate: string; endDate: string; logo: string; assignedEmployees: string[] }) => {
    setCurrentProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
    toast.success('Project deleted successfully');
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getAssignedEmployees = (employeeIds: string[]) => {
    return employees.filter(emp => employeeIds.includes(emp.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={handleAddClick} className="bg-dashboard-blue hover:bg-blue-700">
          <Plus className="mr-2" size={16} />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={project.logo} 
                    alt={project.title} 
                    className="w-12 h-12 rounded object-cover"
                  />
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm line-clamp-2">{project.description}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
              </div>
              
              <div className="flex items-center mt-2">
                <Users size={14} className="mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">Team:</span>
                <div className="flex -space-x-2 ml-2">
                  {getAssignedEmployees(project.assignedEmployees).map(emp => (
                    <img 
                      key={emp.id}
                      src={emp.profileImage}
                      alt={emp.name}
                      title={emp.name}
                      className="w-6 h-6 rounded-full border border-white"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-dashboard-blue border-dashboard-blue"
                onClick={() => handleEditClick(project)}
              >
                <Edit size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-dashboard-red border-dashboard-red"
                onClick={() => handleDeleteClick(project.id)}
              >
                <Trash2 size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <ProjectForm 
          onClose={closeAddModal} 
          mode="add"
        />
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && currentProject && (
        <ProjectForm 
          project={currentProject}
          onClose={closeEditModal} 
          mode="edit"
        />
      )}
    </div>
  );
};

export default ProjectList;
 