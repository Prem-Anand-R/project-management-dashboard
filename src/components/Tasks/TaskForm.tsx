import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskStatus } from '@/lib/data';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Description is required'),
  projectId: z.string().min(1, 'Project is required'),
  assignedEmployeeId: z.string().min(1, 'Assigned employee is required'),
  eta: z.string().min(1, 'ETA is required'),
  status: z.enum(['needToDo', 'inProgress', 'needForTest', 'completed', 'reOpen']),
  referenceImages: z.array(z.string().url('Must be a valid URL')).optional().default([]),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, mode }) => {
  const { state, dispatch } = useAppContext();
  const { employees, projects } = state;

  const [selectedProject, setSelectedProject] = useState<string>(task?.projectId || '');
  const [availableEmployees, setAvailableEmployees] = useState<typeof employees>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    task?.referenceImages || ['']
  );

  const defaultValues: Partial<FormData> = {
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.projectId || '',
    assignedEmployeeId: task?.assignedEmployeeId || '',
    eta: task?.eta || '',
    status: task?.status || 'needToDo',
    referenceImages: task?.referenceImages || [],
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const watchedProjectId = watch('projectId');

  useEffect(() => {
    if (watchedProjectId) {
      const project = projects.find(p => p.id === watchedProjectId);
      if (project) {
        const projectEmployees = employees.filter(emp => 
          project.assignedEmployees.includes(emp.id)
        );
        setAvailableEmployees(projectEmployees);
        
        // Reset assigned employee if not in project
        const currentEmployeeId = watch('assignedEmployeeId');
        if (currentEmployeeId && !project.assignedEmployees.includes(currentEmployeeId)) {
          setValue('assignedEmployeeId', '');
        }
      }
    } else {
      setAvailableEmployees([]);
    }
  }, [watchedProjectId, projects, employees, setValue, watch]);

  useEffect(() => {
    if (task?.projectId) {
      setSelectedProject(task.projectId);
    }
  }, [task]);

  const handleAddImageField = () => {
    setImageUrls(prev => [...prev, '']);
  };

  const handleRemoveImageField = (index: number) => {
    setImageUrls(prev => {
      const newUrls = [...prev];
      newUrls.splice(index, 1);
      return newUrls;
    });
    
    // Update form values
    const currentImages = watch('referenceImages') || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    setValue('referenceImages', newImages);
  };

  const handleImageChange = (index: number, value: string) => {
    setImageUrls(prev => {
      const newUrls = [...prev];
      newUrls[index] = value;
      return newUrls;
    });

    // Update form values with valid URLs only
    const validUrls = imageUrls
      .map((url, i) => i === index ? value : url)
      .filter(url => url.trim() !== '');
    setValue('referenceImages', validUrls);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const validImages = imageUrls.filter(url => {
        try {
          new URL(url);
          return url.trim() !== '';
        } catch {
          return false;
        }
      });

      if (mode === 'add') {
        const newTask: Task = {
          id: Date.now().toString(),
          ...data,
          referenceImages: validImages,
        };
        dispatch({ type: 'ADD_TASK', payload: newTask });
        toast.success('Task added successfully');
      } else if (task) {
        const updatedTask: Task = {
          ...task,
          ...data,
          referenceImages: validImages,
        };
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
        toast.success('Task updated successfully');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to save task');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Task' : 'Edit Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Implement login functionality"
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
              placeholder="Task description..."
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="projectId">Project</Label>
            <select
              id="projectId"
              {...register('projectId')}
              className={`border rounded-md px-3 py-2 ${errors.projectId ? 'border-red-500' : ''}`}
              onChange={(e) => {
                setValue('projectId', e.target.value);
                setSelectedProject(e.target.value);
              }}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-red-500 text-sm">{errors.projectId.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignedEmployeeId">Assigned Employee</Label>
            <select
              id="assignedEmployeeId"
              {...register('assignedEmployeeId')}
              className={`border rounded-md px-3 py-2 ${errors.assignedEmployeeId ? 'border-red-500' : ''}`}
              disabled={availableEmployees.length === 0}
            >
              <option value="">Select Employee</option>
              {availableEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            {errors.assignedEmployeeId && (
              <p className="text-red-500 text-sm">{errors.assignedEmployeeId.message}</p>
            )}
            {availableEmployees.length === 0 && watchedProjectId && (
              <p className="text-amber-500 text-sm">
                No employees assigned to this project. Please assign employees to the project first.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="eta">ETA</Label>
            <Input
              id="eta"
              type="date"
              {...register('eta')}
              className={errors.eta ? 'border-red-500' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.eta && (
              <p className="text-red-500 text-sm">{errors.eta.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register('status')}
              className={`border rounded-md px-3 py-2 ${errors.status ? 'border-red-500' : ''}`}
            >
              <option value="needToDo">Need To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="needForTest">Need For Test</option>
              <option value="completed">Completed</option>
              <option value="reOpen">Re-opened</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Reference Images</Label>
            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveImageField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddImageField}
                className="w-full"
              >
                Add Image URL
              </Button>
            </div>
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
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Task' : 'Update Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;

