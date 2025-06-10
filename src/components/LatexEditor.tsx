
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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

interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

interface LatexEditorProps {
  content: string;
  onChange: (content: string, changeInfo?: { type: 'insert' | 'delete' | 'modify'; position: { start: number; end: number }; originalContent?: string }) => void;
  changes: Change[];
  showTrackChanges: boolean;
  isTracking: boolean;
  currentUser: User;
}

export const LatexEditor: React.FC<LatexEditorProps> = ({
  content,
  onChange,
  changes,
  showTrackChanges,
  isTracking,
  currentUser
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lastContent, setLastContent] = useState(content);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    if (isTracking && newContent !== lastContent) {
      // Simple change detection - in a real app, you'd use a more sophisticated diff algorithm
      const changeType: 'insert' | 'delete' | 'modify' = 
        newContent.length > lastContent.length ? 'insert' :
        newContent.length < lastContent.length ? 'delete' : 'modify';
      
      const changeInfo = {
        type: changeType,
        position: { start: 0, end: newContent.length },
        originalContent: lastContent
      };
      
      onChange(newContent, changeInfo);
    } else {
      onChange(newContent);
    }
    
    setLastContent(newContent);
  };

  const highlightSyntax = (text: string) => {
    // Basic LaTeX syntax highlighting
    return text
      .replace(/(\\documentclass|\\usepackage|\\begin|\\end|\\section|\\subsection|\\title|\\author|\\date|\\maketitle)/g, '<span class="text-blue-600 font-semibold">$1</span>')
      .replace(/(\{[^}]*\})/g, '<span class="text-green-600">$1</span>')
      .replace(/(\\[a-zA-Z]+)/g, '<span class="text-purple-600">$1</span>')
      .replace(/(%.*$)/gm, '<span class="text-gray-500 italic">$1</span>');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          className={cn(
            "w-full h-full p-4 font-mono text-sm border-none outline-none resize-none",
            "bg-transparent relative z-10",
            isTracking && "border-l-4 border-l-blue-500"
          )}
          placeholder="Enter your LaTeX content here..."
          spellCheck={false}
        />
        
        {showTrackChanges && (
          <div className="absolute top-0 right-0 p-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentUser.color }}
              />
              {isTracking ? 'Tracking changes' : 'Not tracking'}
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-border p-2 bg-muted/30 text-xs text-muted-foreground">
        Lines: {content.split('\n').length} | Characters: {content.length}
      </div>
    </div>
  );
};
