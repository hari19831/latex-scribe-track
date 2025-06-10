
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

interface UserSelectorProps {
  users: User[];
  currentUser: User;
  onUserChange: (user: User) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  currentUser,
  onUserChange
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
          <AvatarFallback 
            className="text-xs font-medium"
            style={{ backgroundColor: currentUser.color, color: 'white' }}
          >
            {currentUser.avatar}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Editing as:</span>
      </div>
      
      <Select 
        value={currentUser.id} 
        onValueChange={(userId) => {
          const user = users.find(u => u.id === userId);
          if (user) onUserChange(user);
        }}
      >
        <SelectTrigger className="w-48 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback 
                    className="text-xs"
                    style={{ backgroundColor: user.color, color: 'white' }}
                  >
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex-1" />
      
      <Badge variant="outline" className="text-xs">
        {users.length} collaborator{users.length !== 1 ? 's' : ''}
      </Badge>
    </div>
  );
};
