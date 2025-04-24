
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus } from 'lucide-react';
import EmployeeForm from './EmployeeForm';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Employee } from '@/lib/data';

const EmployeeList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { employees } = state;
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const handleAddClick = () => {
    setCurrentEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
    toast.success('Employee deleted successfully');
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEmployee(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-dashboard-blue to-dashboard-purple bg-clip-text text-transparent">Employees</h1>
        <Button onClick={handleAddClick} className="bg-dashboard-blue hover:bg-blue-700 shadow-md">
          <Plus className="mr-2" size={16} />
          Add Employee
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {employees.map(employee => (
              <Card key={employee.id} className="animate-fade-in hover:shadow-lg transition-shadow bg-white border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-dashboard-blue/20 mr-3">
                        <img 
                          src={employee.profileImage} 
                          alt={employee.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                        <p className="text-sm text-gray-500">{employee.position}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {employee.email}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-2 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-dashboard-blue border-dashboard-blue hover:bg-dashboard-blue hover:text-white"
                    onClick={() => handleEditClick(employee)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-dashboard-red border-dashboard-red hover:bg-dashboard-red hover:text-white"
                    onClick={() => handleDeleteClick(employee.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <EmployeeForm 
          onClose={closeAddModal} 
          mode="add"
        />
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && currentEmployee && (
        <EmployeeForm 
          employee={currentEmployee}
          onClose={closeEditModal} 
          mode="edit"
        />
      )}
    </div>
  );
};

export default EmployeeList;
