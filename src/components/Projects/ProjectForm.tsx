
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Project } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const schema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Description is required'),
  logo: z.string().url('Must be a valid URL').min(1, 'Logo URL is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  assignedEmployees: z.array(z.string()).min(1, 'At least one employee must be assigned'),
});

type FormData = z.infer<typeof schema>;

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, mode }) => {
  const { state, dispatch } = useAppContext();
  const { employees } = state;

  const defaultValues: Partial<FormData> = project ? {
    title: project.title,
    description: project.description,
    logo: project.logo,
    startDate: project.startDate,
    endDate: project.endDate,
    assignedEmployees: project.assignedEmployees,
  } : {
    title: '',
    description: '',
    logo: '',
    startDate: '',
    endDate: '',
    assignedEmployees: [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');
  const watchedAssignedEmployees = watch('assignedEmployees') || [];

  const toggleEmployeeSelection = (employeeId: string) => {
    const isSelected = watchedAssignedEmployees.includes(employeeId);
    const updatedEmployees = isSelected
      ? watchedAssignedEmployees.filter(id => id !== employeeId)
      : [...watchedAssignedEmployees, employeeId];
    
    setValue('assignedEmployees', updatedEmployees, { 
      shouldValidate: true,
      shouldDirty: true 
    });
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Validate dates
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      if (endDate < startDate) {
        toast.error('End date cannot be earlier than start date');
        return;
      }

      if (mode === 'add') {
        const newProject: Project = {
          id: Date.now().toString(),
          title: data.title,
          description: data.description,
          logo: data.logo,
          startDate: data.startDate,
          endDate: data.endDate,
          assignedEmployees: data.assignedEmployees,
        };
        dispatch({ type: 'ADD_PROJECT', payload: newProject });
        toast.success('Project added successfully');
      } else if (project) {
        const updatedProject: Project = {
          ...project,
          title: data.title,
          description: data.description,
          logo: data.logo,
          startDate: data.startDate,
          endDate: data.endDate,
          assignedEmployees: data.assignedEmployees,
        };
        dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
        toast.success('Project updated successfully');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred while saving the project');
      console.error('Project form error:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Project' : 'Edit Project'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Website Redesign"
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Project description..."
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              placeholder="https://example.com/logo.png"
              {...register('logo')}
              className={errors.logo ? 'border-red-500' : ''}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className={errors.endDate ? 'border-red-500' : ''}
                min={watchedStartDate}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Assign Employees</Label>
            <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
              {employees.map(employee => (
                <div key={employee.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`employee-${employee.id}`}
                    checked={watchedAssignedEmployees.includes(employee.id)}
                    onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                  />
                  <Label 
                    htmlFor={`employee-${employee.id}`} 
                    className="cursor-pointer flex items-center"
                  >
                    <img 
                      src={employee.profileImage} 
                      alt={employee.name} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    {employee.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.assignedEmployees && (
              <p className="text-red-500 text-sm">{errors.assignedEmployees.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-dashboard-purple"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Project' : 'Update Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;

