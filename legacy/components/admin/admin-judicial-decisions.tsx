import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { JudicialDecision } from '../../../shared/schema';
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
  DialogTrigger,
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
  FileText,
  Edit,
  Trash2,
  AlertTriangle,
  Eye
} from 'lucide-react';

export function AdminJudicialDecisions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<JudicialDecision | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const pageSize = 10;
  
  const queryClient = useQueryClient();
  
  // Query to fetch judicial decisions
  const { data, isLoading } = useQuery({
    queryKey: ['/api/judicial-decisions', searchQuery, currentPage],
    queryFn: ({ queryKey }) => apiRequest<{ 
      decisions: JudicialDecision[],
      totalPages: number,
      currentPage: number
    }>(
      `${queryKey[0]}?page=${queryKey[2]}&limit=${pageSize}&searchQuery=${queryKey[1]}`
    )
  });
  
  // Mutation for creating a judicial decision
  const createMutation = useMutation({
    mutationFn: (newDecision: Partial<JudicialDecision>) => 
      apiRequest('/api/admin/judicial-decisions', { 
        method: 'POST', 
        data: newDecision 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/judicial-decisions'] });
      setIsCreateDialogOpen(false);
    }
  });
  
  // Mutation for updating a judicial decision
  const updateMutation = useMutation({
    mutationFn: (updatedDecision: JudicialDecision) => 
      apiRequest(`/api/admin/judicial-decisions/${updatedDecision.id}`, { 
        method: 'PUT', 
        data: updatedDecision 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/judicial-decisions'] });
      setIsEditDialogOpen(false);
      setSelectedDecision(null);
    }
  });
  
  // Mutation for deleting a judicial decision
  const deleteMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/admin/judicial-decisions/${id}`, { 
        method: 'DELETE' 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/judicial-decisions'] });
      setIsDeleteDialogOpen(false);
      setSelectedDecision(null);
    }
  });

  // Form state for create/edit
  const [formState, setFormState] = useState<Partial<JudicialDecision>>({
    title: '',
    caseNumber: '',
    jurisdiction: '',
    category: '',
    judge: '',
    parties: '',
    date: new Date().toISOString().substring(0, 10),
    summary: '',
    content: '',
    tags: []
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
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
    if (selectedDecision?.id) {
      updateMutation.mutate({ ...formState, id: selectedDecision.id } as JudicialDecision);
    }
  };

  // Handle deletion confirmation
  const handleDelete = () => {
    if (selectedDecision?.id) {
      deleteMutation.mutate(selectedDecision.id);
    }
  };

  // Prepare for editing
  const handleEdit = (decision: JudicialDecision) => {
    setSelectedDecision(decision);
    setFormState({
      title: decision.title,
      caseNumber: decision.caseNumber,
      jurisdiction: decision.jurisdiction,
      category: decision.category,
      judge: decision.judge,
      parties: decision.parties,
      date: new Date(decision.date).toISOString().substring(0, 10),
      summary: decision.summary,
      content: decision.content,
      tags: decision.tags || []
    });
    setIsEditDialogOpen(true);
  };

  // View a decision
  const handleView = (decision: JudicialDecision) => {
    setSelectedDecision(decision);
    setIsDetailDialogOpen(true);
  };

  // Prepare for deletion
  const handleDeleteClick = (decision: JudicialDecision) => {
    setSelectedDecision(decision);
    setIsDeleteDialogOpen(true);
  };

  // Reset form when opening create dialog
  const handleCreateClick = () => {
    setFormState({
      title: '',
      caseNumber: '',
      jurisdiction: '',
      category: '',
      judge: '',
      parties: '',
      date: new Date().toISOString().substring(0, 10),
      summary: '',
      content: '',
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
              <CardTitle>Judicial Decisions</CardTitle>
              <CardDescription>Manage all judicial decisions in the system</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search decisions..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateClick} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add Decision
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
                      <TableHead className="w-[100px]">Case #</TableHead>
                      <TableHead className="max-w-[300px]">Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Jurisdiction</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.decisions && data.decisions.length > 0 ? (
                      data.decisions.map((decision) => (
                        <TableRow key={decision.id}>
                          <TableCell className="font-medium">{decision.caseNumber}</TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {decision.title}
                          </TableCell>
                          <TableCell>
                            {new Date(decision.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{decision.jurisdiction}</TableCell>
                          <TableCell>{decision.category}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(decision)}
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(decision)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(decision)}
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
                            <FileText className="h-10 w-10 mb-2" />
                            <p>No judicial decisions found</p>
                            <p className="text-sm">
                              {searchQuery
                                ? "Try a different search term"
                                : "Create your first judicial decision"}
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
            <DialogTitle>Create Judicial Decision</DialogTitle>
            <DialogDescription>
              Add a new judicial decision to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
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
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input
                    id="caseNumber"
                    name="caseNumber"
                    value={formState.caseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formState.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('jurisdiction', value)}
                    defaultValue={formState.jurisdiction}
                  >
                    <SelectTrigger id="jurisdiction">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federal">Federal</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('category', value)}
                    defaultValue={formState.category}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                      <SelectItem value="constitutional">Constitutional</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="judge">Judge</Label>
                  <Input
                    id="judge"
                    name="judge"
                    value={formState.judge}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="parties">Parties</Label>
                  <Input
                    id="parties"
                    name="parties"
                    value={formState.parties}
                    onChange={handleInputChange}
                    placeholder="e.g. Smith v. Jones"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={formState.summary}
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
                  "Create Decision"
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
            <DialogTitle>Edit Judicial Decision</DialogTitle>
            <DialogDescription>
              Update the details of this judicial decision
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
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
                  <Label htmlFor="edit-caseNumber">Case Number</Label>
                  <Input
                    id="edit-caseNumber"
                    name="caseNumber"
                    value={formState.caseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="date"
                    value={formState.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-jurisdiction">Jurisdiction</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('jurisdiction', value)}
                    defaultValue={formState.jurisdiction}
                  >
                    <SelectTrigger id="edit-jurisdiction">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federal">Federal</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('category', value)}
                    defaultValue={formState.category}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                      <SelectItem value="constitutional">Constitutional</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-judge">Judge</Label>
                  <Input
                    id="edit-judge"
                    name="judge"
                    value={formState.judge}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-parties">Parties</Label>
                  <Input
                    id="edit-parties"
                    name="parties"
                    value={formState.parties}
                    onChange={handleInputChange}
                    placeholder="e.g. Smith v. Jones"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-summary">Summary</Label>
                  <Textarea
                    id="edit-summary"
                    name="summary"
                    value={formState.summary}
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
              Are you sure you want to delete this judicial decision? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 mt-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Warning</p>
            </div>
            <p className="text-sm text-red-600 dark:text-red-300 mt-2">
              Deleting this decision will remove it from all user collections, analytics, and AI insights.
            </p>
          </div>
          <div className="bg-muted rounded-md p-4 mt-4">
            <p className="font-semibold">{selectedDecision?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">Case #{selectedDecision?.caseNumber}</p>
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
                "Delete Decision"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Judicial Decision Details</DialogTitle>
            <DialogDescription>
              Viewing complete information about this judicial decision
            </DialogDescription>
          </DialogHeader>
          {selectedDecision && (
            <div className="grid gap-4 py-4">
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold">{selectedDecision.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                  <span>Case #{selectedDecision.caseNumber}</span>
                  <span>•</span>
                  <span>{new Date(selectedDecision.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{selectedDecision.jurisdiction}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div>
                  <h4 className="font-semibold text-sm">Category</h4>
                  <p>{selectedDecision.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Judge</h4>
                  <p>{selectedDecision.judge}</p>
                </div>
              </div>
              
              <div className="py-2">
                <h4 className="font-semibold text-sm">Parties</h4>
                <p>{selectedDecision.parties}</p>
              </div>
              
              <div className="py-2">
                <h4 className="font-semibold text-sm">Summary</h4>
                <p className="mt-1 whitespace-pre-line">{selectedDecision.summary}</p>
              </div>
              
              <div className="py-2">
                <h4 className="font-semibold text-sm">Full Content</h4>
                <div className="mt-2 p-4 border rounded-md bg-muted/50 max-h-[300px] overflow-y-auto">
                  <p className="whitespace-pre-line">{selectedDecision.content}</p>
                </div>
              </div>
              
              {selectedDecision.tags && selectedDecision.tags.length > 0 && (
                <div className="py-2">
                  <h4 className="font-semibold text-sm">Tags</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDecision.tags.map((tag, index) => (
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
            <Button onClick={() => {
              setIsDetailDialogOpen(false);
              if (selectedDecision) handleEdit(selectedDecision);
            }}>
              Edit Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}