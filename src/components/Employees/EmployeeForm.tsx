
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Employee } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define schema with zod
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  email: z.string().email('Must be a valid email').min(1, 'Email is required'),
  profileImage: z.string().url('Must be a valid URL').min(1, 'Profile image URL is required'),
});

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose, mode }) => {
  const { state, dispatch } = useAppContext();
  const { employees } = state;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: employee ? {
      name: employee.name,
      position: employee.position,
      email: employee.email,
      profileImage: employee.profileImage,
    } : {},
  });

  const onSubmit = (data: any) => {
    // Check if email is unique (except for the current employee in edit mode)
    const isEmailTaken = employees.some(
      emp => emp.email === data.email && (!employee || emp.id !== employee.id)
    );

    if (isEmailTaken) {
      toast.error('Email is already taken');
      return;
    }

    if (mode === 'add') {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...data,
      };
      dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
      toast.success('Employee added successfully');
    } else {
      const updatedEmployee: Employee = {
        ...employee!,
        ...data,
      };
      dispatch({ type: 'UPDATE_EMPLOYEE', payload: updatedEmployee });
      toast.success('Employee updated successfully');
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message as string}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              placeholder="Frontend Developer"
              {...register('position')}
              className={errors.position ? 'border-red-500' : ''}
            />
            {errors.position && (
              <p className="text-red-500 text-sm">{errors.position.message as string}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@company.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message as string}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input
              id="profileImage"
              placeholder="https://example.com/image.jpg"
              {...register('profileImage')}
              className={errors.profileImage ? 'border-red-500' : ''}
            />
            {errors.profileImage && (
              <p className="text-red-500 text-sm">{errors.profileImage.message as string}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-dashboard-purple">
              {mode === 'add' ? 'Add Employee' : 'Update Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
