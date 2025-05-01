import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { LaborContract } from '../../../shared/schema';
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
import { Textarea } from '../ui/textarea';
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
  Search,
  Plus,
  Folder,
  Edit,
  Trash2,
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react';

export function AdminLaborContracts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState<LaborContract | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const pageSize = 10;
  
  const queryClient = useQueryClient();
  
  // Query to fetch labor contracts
  const { data, isLoading } = useQuery({
    queryKey: ['/api/labor-contracts', searchQuery, currentPage],
    queryFn: ({ queryKey }) => apiRequest<{ 
      contracts: LaborContract[],
      totalPages: number,
      currentPage: number
    }>(
      `${queryKey[0]}?page=${queryKey[2]}&limit=${pageSize}&searchQuery=${queryKey[1]}`
    )
  });
  
  // Mutation for creating a labor contract
  const createMutation = useMutation({
    mutationFn: (newContract: Partial<LaborContract>) => 
      apiRequest('/api/admin/labor-contracts', { 
        method: 'POST', 
        data: newContract 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/labor-contracts'] });
      setIsCreateDialogOpen(false);
    }
  });
  
  // Mutation for updating a labor contract
  const updateMutation = useMutation({
    mutationFn: (updatedContract: LaborContract) => 
      apiRequest(`/api/admin/labor-contracts/${updatedContract.id}`, { 
        method: 'PUT', 
        data: updatedContract 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/labor-contracts'] });
      setIsEditDialogOpen(false);
      setSelectedContract(null);
    }
  });
  
  // Mutation for deleting a labor contract
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/labor-contracts/${id}`, { 
        method: 'DELETE' 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/labor-contracts'] });
      setIsDeleteDialogOpen(false);
      setSelectedContract(null);
    }
  });

  // Form state for create/edit
  const [formState, setFormState] = useState<Partial<LaborContract>>({
    title: '',
    contractType: '',
    industry: '',
    description: '',
    content: '',
    pages: 1,
    tags: []
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === 'pages') {
      setFormState(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formState);
  };

  // Handle form submission for updating
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContract?.id) {
      updateMutation.mutate({ ...formState, id: selectedContract.id } as LaborContract);
    }
  };

  // Handle deletion confirmation
  const handleDelete = () => {
    if (selectedContract?.id) {
      deleteMutation.mutate(selectedContract.id);
    }
  };

  // Prepare for editing
  const handleEdit = (contract: LaborContract) => {
    setSelectedContract(contract);
    setFormState({
      title: contract.title,
      contractType: contract.contractType,
      industry: contract.industry,
      description: contract.description || '',
      content: contract.content,
      pages: contract.pages,
      tags: contract.tags || []
    });
    setIsEditDialogOpen(true);
  };

  // View a contract
  const handleView = (contract: LaborContract) => {
    setSelectedContract(contract);
    setIsDetailDialogOpen(true);
  };

  // Prepare for deletion
  const handleDeleteClick = (contract: LaborContract) => {
    setSelectedContract(contract);
    setIsDeleteDialogOpen(true);
  };

  // Reset form when opening create dialog
  const handleCreateClick = () => {
    setFormState({
      title: '',
      contractType: '',
      industry: '',
      description: '',
      content: '',
      pages: 1,
      tags: []
    });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Labor Contracts</CardTitle>
              <CardDescription>Manage all labor contracts in the system</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contracts..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateClick} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add Contract
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
                      <TableHead className="max-w-[300px]">Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.contracts && data.contracts.length > 0 ? (
                      data.contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium max-w-[300px] truncate">
                            {contract.title}
                          </TableCell>
                          <TableCell>{contract.contractType}</TableCell>
                          <TableCell>{contract.industry}</TableCell>
                          <TableCell>{contract.pages}</TableCell>
                          <TableCell>{contract.downloads || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(contract)}
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(contract)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(contract)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Folder className="h-10 w-10 mb-2" />
                            <p>No labor contracts found</p>
                            <p className="text-sm">
                              {searchQuery
                                ? "Try a different search term"
                                : "Create your first labor contract"}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Labor Contract</DialogTitle>
            <DialogDescription>
              Add a new labor contract to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formState.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('contractType', value)}
                    defaultValue={formState.contractType}
                  >
                    <SelectTrigger id="contractType">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment Agreement</SelectItem>
                      <SelectItem value="collective">Collective Bargaining</SelectItem>
                      <SelectItem value="consultant">Consultant Agreement</SelectItem>
                      <SelectItem value="termination">Termination Agreement</SelectItem>
                      <SelectItem value="confidentiality">Confidentiality Agreement</SelectItem>
                      <SelectItem value="severance">Severance Agreement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('industry', value)}
                    defaultValue={formState.industry}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Number of Pages</Label>
                  <Input
                    id="pages"
                    name="pages"
                    type="number"
                    value={formState.pages}
                    onChange={handleInputChange}
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="content">Full Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formState.content}
                    onChange={handleInputChange}
                    className="min-h-[200px]"
                    required
                  />
                </div>
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
                  "Create Contract"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Labor Contract</DialogTitle>
            <DialogDescription>
              Update the details of this labor contract
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formState.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contractType">Contract Type</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('contractType', value)}
                    defaultValue={formState.contractType}
                  >
                    <SelectTrigger id="edit-contractType">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment Agreement</SelectItem>
                      <SelectItem value="collective">Collective Bargaining</SelectItem>
                      <SelectItem value="consultant">Consultant Agreement</SelectItem>
                      <SelectItem value="termination">Termination Agreement</SelectItem>
                      <SelectItem value="confidentiality">Confidentiality Agreement</SelectItem>
                      <SelectItem value="severance">Severance Agreement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-industry">Industry</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('industry', value)}
                    defaultValue={formState.industry}
                  >
                    <SelectTrigger id="edit-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="hospitality">Hospitality</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pages">Number of Pages</Label>
                  <Input
                    id="edit-pages"
                    name="pages"
                    type="number"
                    value={formState.pages}
                    onChange={handleInputChange}
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-content">Full Content</Label>
                  <Textarea
                    id="edit-content"
                    name="content"
                    value={formState.content}
                    onChange={handleInputChange}
                    className="min-h-[200px]"
                    required
                  />
                </div>
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
                    Updating...
                  </>
                ) : (
                  "Save Changes"
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
              Are you sure you want to delete this labor contract? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 mt-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Warning</p>
            </div>
            <p className="text-sm text-red-600 dark:text-red-300 mt-2">
              Deleting this contract will remove it from all user collections, analytics, and AI insights.
            </p>
          </div>
          <div className="bg-muted rounded-md p-4 mt-4">
            <p className="font-semibold">{selectedContract?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{selectedContract?.contractType} • {selectedContract?.industry}</p>
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
                "Delete Contract"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Labor Contract Details</DialogTitle>
            <DialogDescription>
              Viewing complete information about this labor contract
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="grid gap-4 py-4">
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold">{selectedContract.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                  <span>{selectedContract.contractType}</span>
                  <span>•</span>
                  <span>{selectedContract.industry}</span>
                  <span>•</span>
                  <span>{selectedContract.pages} pages</span>
                  <span>•</span>
                  <span>{selectedContract.downloads || 0} downloads</span>
                </div>
              </div>
              
              <div className="py-2">
                <h4 className="font-semibold text-sm">Description</h4>
                <p className="mt-1 whitespace-pre-line">{selectedContract.description}</p>
              </div>
              
              <div className="py-2">
                <h4 className="font-semibold text-sm">Full Content</h4>
                <div className="mt-2 p-4 border rounded-md bg-muted/50 max-h-[300px] overflow-y-auto">
                  <p className="whitespace-pre-line">{selectedContract.content}</p>
                </div>
              </div>
              
              {selectedContract.tags && selectedContract.tags.length > 0 && (
                <div className="py-2">
                  <h4 className="font-semibold text-sm">Tags</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedContract.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => {
              // In a real app, this would trigger a download
              alert('Download functionality would be implemented here');
            }}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={() => {
              setIsDetailDialogOpen(false);
              if (selectedContract) handleEdit(selectedContract);
            }}>
              Edit Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}