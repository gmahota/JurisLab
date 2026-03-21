import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { User } from '../../../shared/schema';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar';
import { 
  Search,
  Plus,
  User as UserIcon,
  Edit,
  Trash2,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldX,
  Mail,
  Lock
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';

export function AdminUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  
  const pageSize = 10;
  
  const queryClient = useQueryClient();
  
  // Query to fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['/api/admin/users', searchQuery, currentPage],
    queryFn: ({ queryKey }) => apiRequest<{ 
      users: User[],
      totalPages: number,
      currentPage: number
    }>(
      `${queryKey[0]}?page=${queryKey[2]}&limit=${pageSize}&searchQuery=${queryKey[1]}`
    )
  });
  
  // Mutation for creating a user
  const createMutation = useMutation({
    mutationFn: (newUser: Partial<User>) => 
      apiRequest('/api/admin/users', { 
        method: 'POST', 
        data: newUser 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsCreateDialogOpen(false);
    }
  });
  
  // Mutation for updating a user
  const updateMutation = useMutation({
    mutationFn: (updatedUser: User) => 
      apiRequest(`/api/admin/users/${updatedUser.id}`, { 
        method: 'PUT', 
        data: updatedUser 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  });
  
  // Mutation for deleting a user
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/users/${id}`, { 
        method: 'DELETE' 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  });
  
  // Mutation for resetting a user's password
  const resetPasswordMutation = useMutation({
    mutationFn: (data: { userId: number, newPassword: string }) => 
      apiRequest(`/api/admin/users/${data.userId}/reset-password`, { 
        method: 'POST', 
        data: { newPassword: data.newPassword } 
      }),
    onSuccess: () => {
      setIsResetPasswordDialogOpen(false);
      setSelectedUser(null);
    }
  });

  // Form state for create/edit
  const [formState, setFormState] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    isActive: true,
  });
  
  // Password form state (separate for security reasons)
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  // Handle form submission for creating
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    createMutation.mutate({
      ...formState,
      password: passwordForm.password
    });
  };

  // Handle form submission for updating
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser?.id) {
      updateMutation.mutate({ ...formState, id: selectedUser.id } as User);
    }
  };
  
  // Handle password reset
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    if (selectedUser?.id) {
      resetPasswordMutation.mutate({
        userId: selectedUser.id,
        newPassword: passwordForm.password
      });
    }
  };

  // Handle deletion confirmation
  const handleDelete = () => {
    if (selectedUser?.id) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  // Prepare for editing
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormState({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setIsEditDialogOpen(true);
  };
  
  // Prepare for resetting password
  const handleResetPasswordClick = (user: User) => {
    setSelectedUser(user);
    setPasswordForm({
      password: '',
      confirmPassword: '',
    });
    setIsResetPasswordDialogOpen(true);
  };

  // Prepare for deletion
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Reset form when opening create dialog
  const handleCreateClick = () => {
    setFormState({
      name: '',
      email: '',
      role: 'user',
      isActive: true,
    });
    setPasswordForm({
      password: '',
      confirmPassword: '',
    });
    setIsCreateDialogOpen(true);
  };
  
  // Helper to get role badge styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { 
          variant: 'destructive' as const, 
          icon: <Shield className="h-3 w-3 mr-1" /> 
        };
      case 'editor':
        return { 
          variant: 'secondary' as const, 
          icon: <ShieldCheck className="h-3 w-3 mr-1" /> 
        };
      default:
        return { 
          variant: 'outline' as const, 
          icon: <UserIcon className="h-3 w-3 mr-1" /> 
        };
    }
  };
  
  // Helper to get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts and access permissions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateClick} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.users && data.users.length > 0 ? (
                      data.users.map((user) => {
                        const roleBadge = getRoleBadge(user.role);
                        
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                                  <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: {user.id}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={roleBadge.variant} className="flex w-fit items-center">
                                {roleBadge.icon}
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.isActive ? "default" : "outline"} 
                                className={`${user.isActive ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400" : "text-muted-foreground"}`}
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleResetPasswordClick(user)}
                                  title="Reset Password"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(user)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(user)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <UserIcon className="h-10 w-10 mb-2" />
                            <p>No users found</p>
                            <p className="text-sm">
                              {searchQuery
                                ? "Try a different search term"
                                : "Create your first user account"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {data?.totalPages && data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first, last, and pages around current
                        if (
                          page === 1 ||
                          page === data.totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={page === currentPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        // Show ellipsis for gaps
                        if (
                          (page === 2 && currentPage > 3) ||
                          (page === data.totalPages - 1 && currentPage < data.totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(data.totalPages, p + 1))}
                          aria-disabled={currentPage === data.totalPages}
                          className={currentPage === data.totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Add a new user account to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('role', value)}
                  defaultValue={formState.role}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active Status</Label>
                  <Switch 
                    id="isActive" 
                    checked={formState.isActive} 
                    onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Inactive users cannot login to the system
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('role', value)}
                  defaultValue={formState.role}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-isActive">Active Status</Label>
                  <Switch 
                    id="edit-isActive" 
                    checked={formState.isActive} 
                    onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Inactive users cannot login to the system
                </p>
              </div>
              <div className="pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    if (selectedUser) handleResetPasswordClick(selectedUser);
                  }}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="password"
                  type="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsResetPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 mt-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Warning</p>
            </div>
            <p className="text-sm text-red-600 dark:text-red-300 mt-2">
              Deleting this user will remove all their data, including favorites, history, and custom settings.
            </p>
          </div>
          <div className="bg-muted rounded-md p-4 mt-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedUser?.avatarUrl || ''} alt={selectedUser?.name} />
                <AvatarFallback>{selectedUser ? getUserInitials(selectedUser.name) : ''}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}