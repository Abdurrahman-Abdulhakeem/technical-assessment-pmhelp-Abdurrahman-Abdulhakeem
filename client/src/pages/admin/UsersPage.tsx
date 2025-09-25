import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Phone
} from 'lucide-react';
import { useUserMutations, useUsers } from '@/hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { formatDate, getInitials } from '@/utils/cn';
import { useDebounce } from '@/hooks/useDebounce';

const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: usersData, isLoading } = useUsers({
    search: debouncedSearch,
    role: roleFilter,
    page: 1,
    limit: 20
  });

  const { 
    updateUser, 
    deleteUser, 
    deactivateUser, 
    activateUser 
  } = useUserMutations();

  const users = usersData?.users || [];

  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'edit':
        // Open edit modal
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          deleteUser.mutate(userId);
        }
        break;
      case 'deactivate':
        if (window.confirm('Are you sure you want to deactivate this user?')) {
          deactivateUser.mutate(userId);
        }
        break;
      case 'activate':
        activateUser.mutate(userId);
        break;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'doctor': return 'success';
      case 'patient': return 'info';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        </div>
        <Loading size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage all platform users and their permissions</p>
        </div>

        <Button size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
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
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={<Users className="w-8 h-8 text-slate-400" />}
              title="No users found"
              description="Try adjusting your search criteria or filters"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900">
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
                          {user.isEmailVerified && (
                            <Badge variant="success" size="sm">
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </span>
                          )}
                          <span>
                            Joined {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      
                      {user.isActive ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction('deactivate', user._id)}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleUserAction('activate', user._id)}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleUserAction('delete', user._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {usersData?.pagination && usersData.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <span className="px-3 py-1 text-sm text-slate-600">
            Page 1 of {usersData.pagination.pages}
          </span>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export { AdminUsersPage };