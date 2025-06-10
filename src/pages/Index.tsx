
import React, { useState, useEffect } from 'react';
import { LatexEditor } from '../components/LatexEditor';
import { PreviewPane } from '../components/PreviewPane';
import { TrackChangesPanel } from '../components/TrackChangesPanel';
import { Toolbar } from '../components/Toolbar';
import { UserSelector } from '../components/UserSelector';
import { FileExplorer } from '../components/FileExplorer';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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

const Index = () => {
  const [latexContent, setLatexContent] = useState(`\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}

\\title{Research Paper Draft}
\\author{Academic Collaboration}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

This is a sample LaTeX document demonstrating the track changes feature. You can edit this content and see changes highlighted in real-time.

\\section{Methodology}

Here we describe our research methodology. The track changes system will highlight any modifications made to this section.

\\subsection{Data Collection}

We collected data from multiple sources to ensure comprehensive coverage of our research domain.

\\section{Results}

Our findings indicate significant improvements in the proposed approach.

\\section{Conclusion}

The results demonstrate the effectiveness of our methodology and provide a foundation for future research.

\\end{document}`);
  
  const [changes, setChanges] = useState<Change[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Dr. Sarah Chen',
    color: 'rgb(59, 130, 246)',
    avatar: 'SC'
  });
  
  const [users] = useState<User[]>([
    { id: '1', name: 'Dr. Sarah Chen', color: 'rgb(59, 130, 246)', avatar: 'SC' },
    { id: '2', name: 'Prof. Michael Rodriguez', color: 'rgb(16, 185, 129)', avatar: 'MR' },
    { id: '3', name: 'Dr. Emma Thompson', color: 'rgb(245, 101, 101)', avatar: 'ET' }
  ]);

  const [showTrackChanges, setShowTrackChanges] = useState(true);
  const [isTracking, setIsTracking] = useState(true);

  const handleContentChange = (newContent: string, changeInfo?: { type: 'insert' | 'delete' | 'modify'; position: { start: number; end: number }; originalContent?: string }) => {
    setLatexContent(newContent);
    
    if (isTracking && changeInfo) {
      const newChange: Change = {
        id: Date.now().toString(),
        type: changeInfo.type,
        content: newContent.slice(changeInfo.position.start, changeInfo.position.end),
        originalContent: changeInfo.originalContent,
        position: changeInfo.position,
        author: currentUser.name,
        timestamp: new Date()
      };
      
      setChanges(prev => [...prev, newChange]);
    }
  };

  const acceptChange = (changeId: string) => {
    setChanges(prev => prev.map(change => 
      change.id === changeId ? { ...change, accepted: true } : change
    ));
  };

  const rejectChange = (changeId: string) => {
    setChanges(prev => prev.map(change => 
      change.id === changeId ? { ...change, rejected: true } : change
    ));
  };

  const addComment = (changeId: string, comment: string) => {
    setChanges(prev => prev.map(change => 
      change.id === changeId ? { ...change, comment } : change
    ));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toolbar 
        isTracking={isTracking}
        onToggleTracking={setIsTracking}
        showTrackChanges={showTrackChanges}
        onToggleTrackChanges={setShowTrackChanges}
      />
      
      <div className="flex-1 flex">
        <FileExplorer />
        
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="min-h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="border-b border-border p-2 bg-muted/30">
                  <UserSelector 
                    users={users}
                    currentUser={currentUser}
                    onUserChange={setCurrentUser}
                  />
                </div>
                <LatexEditor
                  content={latexContent}
                  onChange={handleContentChange}
                  changes={changes}
                  showTrackChanges={showTrackChanges}
                  isTracking={isTracking}
                  currentUser={currentUser}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50} minSize={30}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={70} minSize={40}>
                  <PreviewPane content={latexContent} />
                </ResizablePanel>
                
                {showTrackChanges && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={30} minSize={20}>
                      <TrackChangesPanel
                        changes={changes}
                        onAcceptChange={acceptChange}
                        onRejectChange={rejectChange}
                        onAddComment={addComment}
                      />
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Index;
