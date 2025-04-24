
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, Calendar } from 'lucide-react';
import TaskForm from './TaskForm';
import { toast } from 'sonner';

const TaskList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { tasks, employees, projects } = state;
   
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const handleAddClick = () => {
    setCurrentTask(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (task: any) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    toast.success('Task deleted successfully');
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

  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unassigned';
  };

  const getProjectName = (id: string) => {
    const project = projects.find(proj => proj.id === id);
    return project ? project.title : 'Unknown Project';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'needToDo': return { label: 'Need To Do', class: 'bg-gray-200 text-gray-800' };
      case 'inProgress': return { label: 'In Progress', class: 'bg-dashboard-blue text-white' };
      case 'needForTest': return { label: 'Need For Test', class: 'bg-dashboard-purple text-white' };
      case 'completed': return { label: 'Completed', class: 'bg-dashboard-green text-white' };
      case 'reOpen': return { label: 'Re-opened', class: 'bg-dashboard-red text-white' };
      default: return { label: status, class: 'bg-gray-200 text-gray-800' };
    }
  };

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(task => task.projectId === selectedProject);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={handleAddClick} className="bg-dashboard-blue hover:bg-blue-700">
          <Plus className="mr-2" size={16} />
          Add Task
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <span className="text-gray-700 font-medium">Filter by Project:</span>
        <select
          className="border rounded-md px-3 py-2"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => {
          const status = getStatusLabel(task.status);
          
          return (
            <Card key={task.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${status.class}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {getProjectName(task.projectId)}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 py-2">
                <p className="text-sm line-clamp-2">{task.description}</p>
                
                <div className="flex items-center text-sm space-x-1 text-gray-600">
                  <span className="font-medium">Assigned to:</span>
                  <span>{getEmployeeName(task.assignedEmployeeId)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  <span>ETA: {formatDate(task.eta)}</span>
                </div>
                
                {task.referenceImages && task.referenceImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {task.referenceImages.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img}
                        alt="Reference"
                        className="w-16 h-16 rounded object-cover"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-2 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-dashboard-blue border-dashboard-blue"
                  onClick={() => handleEditClick(task)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-dashboard-red border-dashboard-red"
                  onClick={() => handleDeleteClick(task.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No tasks found. {selectedProject !== 'all' ? 'Try selecting a different project or ' : ''} 
            Add a new task with the button above.
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <TaskForm 
          onClose={closeAddModal} 
          mode="add"
        />
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && currentTask && (
        <TaskForm 
          task={currentTask}
          onClose={closeEditModal} 
          mode="edit"
        />
      )}
    </div>
  );
};

export default TaskList;
