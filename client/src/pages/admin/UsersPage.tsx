// src/pages/admin/UsersPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Shield,
  Mail,
  Phone,
  Save,
  X,
  RefreshCw
} from 'lucide-react';
import { useUserMutations, useUsers } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { formatDate, getInitials } from '@/utils/cn';
import type { User } from '@/types';

/* Validation Schemas */
const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  role: z.enum(['patient', 'doctor', 'admin']),
});
type EditUserFormData = z.infer<typeof editUserSchema>;

const addUserSchema = editUserSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type AddUserFormData = z.infer<typeof addUserSchema>;

/* Main Component */
const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Query params sent to backend
  const queryParams = {
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: 20,
    sort: '-createdAt',
  };

  const { data: usersData, isLoading, refetch } = useUsers(queryParams);

  const { updateUser, deleteUser, deactivateUser, activateUser, createUser } =
    useUserMutations();

  // Forms
  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
  });

  const users = Array.isArray(usersData) ? usersData : usersData?.users || [];
  const pagination = !Array.isArray(usersData) ? usersData?.pagination : null;

  /* Actions */
  const handleUserAction = async (action: string, userId: string) => {
    const user = users.find((u) => u._id === userId);

    try {
      switch (action) {
        case 'edit':
          if (user) {
            setSelectedUser(user);
            resetEdit({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone || '',
              dateOfBirth: user.dateOfBirth || '',
              role: user.role as 'patient' | 'doctor' | 'admin',
            });
            setShowEditModal(true);
          }
          break;

        case 'delete':
          if (window.confirm('Delete this user permanently?')) {
            await deleteUser.mutateAsync(userId);
            refetch();
          }
          break;

        case 'deactivate':
          if (window.confirm('Deactivate this user?')) {
            await deactivateUser.mutateAsync(userId);
            refetch();
          }
          break;

        case 'activate':
          await activateUser.mutateAsync(userId);
          refetch();
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const handleEditUser = async (data: EditUserFormData) => {
    if (!selectedUser) return;
    try {
      await updateUser.mutateAsync({ id: selectedUser._id, data: { ...data, role: data.role as User['role'] } });
      setShowEditModal(false);
      resetEdit();
      refetch();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleAddUser = async (data: AddUserFormData) => {
    try {
      await createUser.mutateAsync({ ...data, role: data.role as User['role'] });
      setShowAddModal(false);
      resetAdd();
      refetch();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  /* Helpers */
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'doctor':
        return 'success';
      case 'patient':
        return 'info';
      default:
        return 'default';
    }
  };

  /* UI */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Loading size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-slate-600 mt-1">
            Manage all platform users and their permissions
          </p>
        </div>

        <Button size="lg" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search + Filters */}
<Card>
  <CardContent className="p-4 space-y-4">
    {/* Top Filters */}
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="flex gap-2">
        <select
          className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="admin">Admins</option>
        </select>

        <select
          className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMoreFilters((prev) => !prev)}
        >
          <Filter className="w-4 h-4 mr-2" /> More Filters
        </Button>
      </div>
    </div>

    {/* Extra Filters */}
    {showMoreFilters && (
      <div className="flex gap-4">
        <select
          className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
          onChange={(e) => {
            queryParams.sort = e.target.value;
            refetch();
          }}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="firstName">First Name A-Z</option>
        </select>
      </div>
    )}

    {/* Stats + Refresh */}
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
      <div className="flex items-center gap-6 text-sm text-slate-600">
        <span>
          Total Users: <strong>{users.length}</strong>
        </span>
        <span>
          Active: <strong>{users.filter((u) => u.isActive).length}</strong>
        </span>
        <span>
          Inactive: <strong>{users.filter((u) => !u.isActive).length}</strong>
        </span>
      </div>

      <Button variant="outline" size="sm" onClick={() => refetch()}>
        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
      </Button>
    </div>
  </CardContent>
</Card>


      {/* User List */}
      {users.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-slate-400" />}
          title="No users found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid gap-4">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`${
                  !user.isActive ? 'bg-slate-50 border-slate-300' : ''
                }`}
              >
                <CardContent className="p-6 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
                        user.isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gradient-to-r from-slate-400 to-slate-500'
                      }`}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          user.isActive ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role.toUpperCase()}
                      </Badge>
                      {!user.isActive && (
                        <Badge variant="danger" size="sm">
                          Inactive
                        </Badge>
                      )}
                      <div className="text-sm text-slate-500">
                        <Mail className="w-4 h-4 inline mr-1" />
                        {user.email}
                        {user.phone && (
                          <>
                            {' | '}
                            <Phone className="w-4 h-4 inline mr-1" />
                            {user.phone}
                          </>
                        )}
                        {' | '}Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserAction('edit', user._id)}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    {user.isActive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction('deactivate', user._id)}
                        loading={deactivateUser.isPending}
                      >
                        <UserX className="w-4 h-4 mr-1" /> Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleUserAction('activate', user._id)}
                        loading={activateUser.isPending}
                      >
                        <UserCheck className="w-4 h-4 mr-1" /> Activate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleUserAction('delete', user._id)}
                      loading={deleteUser.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
          resetEdit();
        }}
        title={`Edit User: ${selectedUser?.firstName} ${selectedUser?.lastName}`}
      >
        <form onSubmit={handleEditSubmit(handleEditUser)} className="space-y-4">
          <Input label="First Name" {...editRegister('firstName')} error={editErrors.firstName?.message} />
          <Input label="Last Name" {...editRegister('lastName')} error={editErrors.lastName?.message} />
          <Input label="Email" {...editRegister('email')} error={editErrors.email?.message} />
          <Input label="Phone" {...editRegister('phone')} error={editErrors.phone?.message} />
          <Input type="date" label="Date of Birth" {...editRegister('dateOfBirth')} error={editErrors.dateOfBirth?.message} />
          <select {...editRegister('role')} className="w-full border px-4 py-2 rounded-xl">
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={updateUser.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetAdd();
        }}
        title="Add New User"
      >
        <form onSubmit={handleAddSubmit(handleAddUser)} className="space-y-4">
          <Input label="First Name" {...addRegister('firstName')} error={addErrors.firstName?.message} />
          <Input label="Last Name" {...addRegister('lastName')} error={addErrors.lastName?.message} />
          <Input label="Email" {...addRegister('email')} error={addErrors.email?.message} />
          <Input label="Password" type="password" {...addRegister('password')} error={addErrors.password?.message} />
          <Input label="Phone" {...addRegister('phone')} error={addErrors.phone?.message} />
          <Input type="date" label="Date of Birth" {...addRegister('dateOfBirth')} error={addErrors.dateOfBirth?.message} />
          <select {...addRegister('role')} className="w-full border px-4 py-2 rounded-xl">
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createUser.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export { AdminUsersPage };
