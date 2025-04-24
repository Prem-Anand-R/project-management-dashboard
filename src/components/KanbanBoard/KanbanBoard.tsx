
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useAppContext } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { TaskStatus, type Task } from '@/lib/data';
import { Calendar, User, PanelRight } from 'lucide-react';
import { toast } from 'sonner';

interface KanbanBoardProps {
  tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const { state, dispatch } = useAppContext();
  const { employees } = state;

  const columns: {
    id: TaskStatus;
    title: string;
    color: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'needToDo', title: 'Need To Do', color: 'bg-gray-200', icon: <PanelRight size={16} className="text-gray-700" /> },
    { id: 'inProgress', title: 'In Progress', color: 'bg-dashboard-blue', icon: <PanelRight size={16} className="text-white" /> },
    { id: 'needForTest', title: 'Need For Test', color: 'bg-dashboard-purple', icon: <PanelRight size={16} className="text-white" /> },
    { id: 'completed', title: 'Completed', color: 'bg-dashboard-green', icon: <PanelRight size={16} className="text-white" /> },
    { id: 'reOpen', title: 'Re-open', color: 'bg-dashboard-red', icon: <PanelRight size={16} className="text-white" /> },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unassigned';
  };
  
  const getEmployeeImage = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.profileImage : null;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Drop outside valid area or no movement
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const status = destination.droppableId as TaskStatus;
    
    dispatch({ 
      type: 'UPDATE_TASK_STATUS', 
      payload: { 
        id: draggableId, 
        status 
      } 
    });
    
    toast.success(`Task moved to ${columns.find(col => col.id === status)?.title}`);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <div key={column.id} className="w-full lg:w-1/5 flex-shrink-0">
            <div className={`rounded-t-lg p-3 ${column.color} flex items-center justify-between`}>
              <div className="flex items-center">
                {column.icon}
                <span className="ml-2 text-white font-medium">{column.title}</span>
              </div>
              <span className="bg-white text-gray-700 rounded-full px-2 py-0.5 text-sm">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 p-2 rounded-b-lg min-h-[400px]"
                >
                  {getTasksByStatus(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        >
                          <Card className={`${snapshot.isDragging ? 'border-2 border-dashboard-blue' : ''}`}>
                            <CardHeader className="p-3 pb-1">
                              <CardTitle className="text-base line-clamp-1">{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-1 pb-1">
                              <p className="text-sm line-clamp-2 text-gray-600">{task.description}</p>
                              <div className="flex items-center mt-2 gap-2">
                                {task.referenceImages && task.referenceImages.length > 0 && (
                                  <img 
                                    src={task.referenceImages[0]} 
                                    alt="Reference" 
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between p-3 pt-1 text-xs text-gray-500 border-t bg-gray-50">
                              <div className="flex items-center gap-1">
                                {getEmployeeImage(task.assignedEmployeeId) ? (
                                  <img 
                                    src={getEmployeeImage(task.assignedEmployeeId) as string} 
                                    alt={getEmployeeName(task.assignedEmployeeId)}
                                    className="w-5 h-5 rounded-full mr-1"
                                  />
                                ) : (
                                  <User size={12} className="mr-1" />
                                )}
                                <span className="truncate max-w-[80px]">{getEmployeeName(task.assignedEmployeeId)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{formatDate(task.eta)}</span>
                              </div>
                            </CardFooter>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
