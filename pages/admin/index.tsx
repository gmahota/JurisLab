import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../client/src/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../client/src/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../client/src/lib/queryClient';
import { 
  PanelTop, 
  FileText, 
  Users, 
  Activity,
  BarChart4,
  Folder,
  Settings
} from 'lucide-react';
import { Button } from '../../client/src/components/ui/button';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: ({ queryKey }) => apiRequest(queryKey[0])
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage content, users, and system settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-7 lg:w-auto w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PanelTop className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
              <span className="md:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="judicial" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Judicial Decisions</span>
              <span className="md:hidden">Judicial</span>
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span className="hidden md:inline">Labor Contracts</span>
              <span className="md:hidden">Contracts</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Users</span>
              <span className="md:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Activity</span>
              <span className="md:hidden">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
              <span className="md:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
              <span className="md:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Total Documents
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats ? (
                      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    ) : (
                      stats?.totalDocuments || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All judicial decisions and labor contracts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats ? (
                      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    ) : (
                      stats?.activeUsers || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Users active in the last 30 days
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Pending Approvals
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingStats ? (
                      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    ) : (
                      stats?.pendingApprovals || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Documents waiting for review
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    System Health
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {isLoadingStats ? (
                      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                    ) : (
                      "Good"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system and user activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="space-y-2">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.user}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('judicial')}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Add Judicial Decision
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('contracts')}
                    className="justify-start"
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    Add Labor Contract
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('users')}
                    className="justify-start"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('analytics')}
                    className="justify-start"
                  >
                    <BarChart4 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Judicial Decisions Tab */}
          <TabsContent value="judicial">
            <Card>
              <CardHeader>
                <CardTitle>Manage Judicial Decisions</CardTitle>
                <CardDescription>
                  Create, edit and delete judicial decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Judicial decisions management component will be added here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Labor Contracts Tab */}
          <TabsContent value="contracts">
            <Card>
              <CardHeader>
                <CardTitle>Manage Labor Contracts</CardTitle>
                <CardDescription>
                  Create, edit and delete labor contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Labor contracts management component will be added here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>
                  Create, edit and delete user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">User management component will be added here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Log</CardTitle>
                <CardDescription>
                  Complete history of all system activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Content Analytics</CardTitle>
                <CardDescription>
                  Usage and performance metrics for your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide preferences and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}