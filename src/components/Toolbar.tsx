
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Upload, 
  FileText, 
  GitBranch, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface ToolbarProps {
  isTracking: boolean;
  onToggleTracking: (tracking: boolean) => void;
  showTrackChanges: boolean;
  onToggleTrackChanges: (show: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isTracking,
  onToggleTracking,
  showTrackChanges,
  onToggleTrackChanges
}) => {
  return (
    <div className="border-b border-border bg-background p-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            New Document
          </Button>
          <Button variant="ghost" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Open
          </Button>
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1">
          <Button
            variant={isTracking ? "default" : "ghost"}
            size="sm"
            onClick={() => onToggleTracking(!isTracking)}
          >
            {isTracking ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
          
          <Button
            variant={showTrackChanges ? "default" : "ghost"}
            size="sm"
            onClick={() => onToggleTrackChanges(!showTrackChanges)}
          >
            {showTrackChanges ? (
              <Eye className="w-4 h-4 mr-2" />
            ) : (
              <EyeOff className="w-4 h-4 mr-2" />
            )}
            {showTrackChanges ? 'Hide Changes' : 'Show Changes'}
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <GitBranch className="w-4 h-4 mr-2" />
            Version History
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            LaTeX Editor v2.0
          </Badge>
          
          <Badge 
            variant={isTracking ? "default" : "secondary"} 
            className="text-xs"
          >
            {isTracking ? 'Tracking Active' : 'Tracking Paused'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
