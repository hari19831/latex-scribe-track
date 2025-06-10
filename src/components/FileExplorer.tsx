
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Plus, 
  Search,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

export const FileExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<FileNode[]>([
    {
      name: 'Research Paper',
      type: 'folder',
      isOpen: true,
      children: [
        { name: 'main.tex', type: 'file' },
        { name: 'introduction.tex', type: 'file' },
        { name: 'methodology.tex', type: 'file' },
        { name: 'results.tex', type: 'file' },
        { name: 'conclusion.tex', type: 'file' },
        {
          name: 'figures',
          type: 'folder',
          isOpen: false,
          children: [
            { name: 'figure1.png', type: 'file' },
            { name: 'figure2.svg', type: 'file' }
          ]
        },
        { name: 'bibliography.bib', type: 'file' }
      ]
    },
    {
      name: 'Templates',
      type: 'folder',
      isOpen: false,
      children: [
        { name: 'article.tex', type: 'file' },
        { name: 'report.tex', type: 'file' },
        { name: 'presentation.tex', type: 'file' }
      ]
    }
  ]);

  const toggleFolder = (path: number[]) => {
    setFiles(prev => {
      const newFiles = [...prev];
      let current: FileNode | FileNode[] = newFiles;
      
      path.forEach((index, i) => {
        if (i === path.length - 1) {
          if (Array.isArray(current)) {
            current[index].isOpen = !current[index].isOpen;
          }
        } else {
          if (Array.isArray(current)) {
            current = current[index].children || [];
          }
        }
      });
      
      return newFiles;
    });
  };

  const renderFileNode = (node: FileNode, depth = 0, path: number[] = []) => {
    const isFolder = node.type === 'folder';
    const paddingLeft = depth * 16;

    return (
      <div key={`${path.join('-')}-${node.name}`}>
        <div
          className="flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => isFolder && toggleFolder(path)}
        >
          {isFolder ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
              {node.isOpen ? (
                <FolderOpen className="w-4 h-4 text-blue-600" />
              ) : (
                <Folder className="w-4 h-4 text-blue-600" />
              )}
            </>
          ) : (
            <>
              <div className="w-3 h-3" />
              <FileText className="w-4 h-4 text-muted-foreground" />
            </>
          )}
          <span className="truncate flex-1">{node.name}</span>
        </div>
        
        {isFolder && node.isOpen && node.children && (
          <div>
            {node.children.map((child, index) =>
              renderFileNode(child, depth + 1, [...path, index])
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-border bg-muted/20 flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="w-4 h-4" />
          <span className="font-medium text-sm">Project Files</span>
        </div>
        
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.map((file, index) => renderFileNode(file, 0, [index]))}
        </div>
      </ScrollArea>
      
      <div className="border-t border-border p-2">
        <Button variant="ghost" size="sm" className="w-full justify-start h-7 text-xs">
          <Plus className="w-3 h-3 mr-2" />
          New File
        </Button>
      </div>
    </div>
  );
};
