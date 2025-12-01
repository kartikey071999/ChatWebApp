import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/Avatar';
import { API_BASE_URL, setApiHost } from '@/config/api';
import { ArrowLeft } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [apiHost, setApiHostInput] = useState(API_BASE_URL);

  const handleSaveApiHost = () => {
    setApiHost(apiHost);
  };

  const handleClearCache = () => {
    localStorage.clear();
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={user?.name || ''} size="lg" />
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
                <p className="text-xs text-muted-foreground">ID: {user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure the backend server URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-host">Backend Host</Label>
              <Input
                id="api-host"
                value={apiHost}
                onChange={(e) => setApiHostInput(e.target.value)}
                placeholder="http://localhost:8000/api/v1"
              />
              <p className="text-xs text-muted-foreground">
                Default: http://localhost:8000/api/v1
              </p>
            </div>
            <Button onClick={handleSaveApiHost}>Save & Reload</Button>
          </CardContent>
        </Card>

        {/* Advanced */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced</CardTitle>
            <CardDescription>Danger zone</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleClearCache}>
              Clear Cache & Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
