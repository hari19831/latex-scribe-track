
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, X, MessageSquare, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface Change {
  id: string;
  type: 'insert' | 'delete' | 'modify';
  content: string;
  originalContent?: string;
  position: { start: number; end: number };
  author: string;
  timestamp: Date;
  accepted?: boolean;
  rejected?: boolean;
  comment?: string;
}

interface TrackChangesPanelProps {
  changes: Change[];
  onAcceptChange: (changeId: string) => void;
  onRejectChange: (changeId: string) => void;
  onAddComment: (changeId: string, comment: string) => void;
}

export const TrackChangesPanel: React.FC<TrackChangesPanelProps> = ({
  changes,
  onAcceptChange,
  onRejectChange,
  onAddComment
}) => {
  const [commentingChange, setCommentingChange] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = (changeId: string) => {
    if (commentText.trim()) {
      onAddComment(changeId, commentText.trim());
      setCommentText('');
      setCommentingChange(null);
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'insert': return 'bg-green-100 text-green-800 border-green-200';
      case 'delete': return 'bg-red-100 text-red-800 border-red-200';
      case 'modify': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'insert': return '+';
      case 'delete': return '−';
      case 'modify': return '~';
      default: return '?';
    }
  };

  const pendingChanges = changes.filter(change => !change.accepted && !change.rejected);
  const resolvedChanges = changes.filter(change => change.accepted || change.rejected);

  return (
    <div className="h-full flex flex-col bg-muted/20">
      <div className="border-b border-border p-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium text-sm">Track Changes</span>
          <Badge variant="secondary" className="ml-auto">
            {pendingChanges.length} pending
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {pendingChanges.length === 0 && resolvedChanges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No changes to review</p>
            </div>
          )}
          
          {pendingChanges.map((change) => (
            <Card key={change.id} className="p-3 space-y-3">
              <div className="flex items-start gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-mono ${getChangeTypeColor(change.type)}`}
                >
                  {getChangeTypeIcon(change.type)}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <User className="w-3 h-3" />
                    <span>{change.author}</span>
                    <span>•</span>
                    <span>{format(change.timestamp, 'MMM d, h:mm a')}</span>
                  </div>
                  
                  {change.type === 'delete' && change.originalContent && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                      <div className="text-xs text-red-600 mb-1">Deleted:</div>
                      <div className="text-sm font-mono line-through text-red-800">
                        {change.originalContent.slice(0, 100)}
                        {change.originalContent.length > 100 && '...'}
                      </div>
                    </div>
                  )}
                  
                  {(change.type === 'insert' || change.type === 'modify') && (
                    <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
                      <div className="text-xs text-green-600 mb-1">
                        {change.type === 'insert' ? 'Added:' : 'Modified:'}
                      </div>
                      <div className="text-sm font-mono text-green-800">
                        {change.content.slice(0, 100)}
                        {change.content.length > 100 && '...'}
                      </div>
                    </div>
                  )}

                  {change.comment && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                      <div className="text-xs text-blue-600 mb-1">Comment:</div>
                      <div className="text-sm text-blue-800">{change.comment}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAcceptChange(change.id)}
                  className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRejectChange(change.id)}
                  className="h-7 px-2 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                >
                  <X className="w-3 h-3 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCommentingChange(change.id)}
                  className="h-7 px-2 text-xs"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Comment
                </Button>
              </div>
              
              {commentingChange === change.id && (
                <div className="space-y-2">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[60px] text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(change.id)}
                      disabled={!commentText.trim()}
                    >
                      Add Comment
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setCommentingChange(null);
                        setCommentText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
          
          {resolvedChanges.length > 0 && (
            <>
              <div className="text-xs font-medium text-muted-foreground mt-6 mb-2">
                Resolved Changes
              </div>
              {resolvedChanges.map((change) => (
                <Card key={change.id} className="p-3 opacity-60">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${getChangeTypeColor(change.type)}`}
                    >
                      {getChangeTypeIcon(change.type)}
                    </Badge>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">
                        {change.author} • {format(change.timestamp, 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <Badge 
                      variant={change.accepted ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {change.accepted ? 'Accepted' : 'Rejected'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
