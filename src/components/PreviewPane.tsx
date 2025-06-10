
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, FileText } from 'lucide-react';

interface PreviewPaneProps {
  content: string;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ content }) => {
  const processedContent = useMemo(() => {
    // Simple LaTeX to HTML conversion for demo purposes
    // In a real app, you'd use a proper LaTeX renderer like MathJax or KaTeX
    let html = content
      // Document structure
      .replace(/\\documentclass\{[^}]*\}/g, '')
      .replace(/\\usepackage\[[^\]]*\]\{[^}]*\}/g, '')
      .replace(/\\usepackage\{[^}]*\}/g, '')
      
      // Title, author, date
      .replace(/\\title\{([^}]*)\}/g, '<h1 class="text-3xl font-bold text-center mb-4">$1</h1>')
      .replace(/\\author\{([^}]*)\}/g, '<p class="text-center text-lg mb-2">$1</p>')
      .replace(/\\date\{([^}]*)\}/g, '<p class="text-center text-sm text-muted-foreground mb-8">$1</p>')
      .replace(/\\maketitle/g, '')
      
      // Sections
      .replace(/\\section\{([^}]*)\}/g, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/\\subsection\{([^}]*)\}/g, '<h3 class="text-xl font-medium mt-6 mb-3">$1</h3>')
      .replace(/\\subsubsection\{([^}]*)\}/g, '<h4 class="text-lg font-medium mt-4 mb-2">$1</h4>')
      
      // Document environment
      .replace(/\\begin\{document\}/g, '')
      .replace(/\\end\{document\}/g, '')
      
      // Math environments (simple)
      .replace(/\$\$([^$]*)\$\$/g, '<div class="text-center my-4 font-mono text-lg">$1</div>')
      .replace(/\$([^$]*)\$/g, '<span class="font-mono">$1</span>')
      
      // Remove remaining LaTeX commands
      .replace(/\\[a-zA-Z]+(\[[^\]]*\])?(\{[^}]*\})?/g, '')
      
      // Convert line breaks to paragraphs
      .split('\n\n')
      .filter(para => para.trim())
      .map(para => para.trim() ? `<p class="mb-4 leading-relaxed">${para.trim()}</p>` : '')
      .join('');

    return html;
  }, [content]);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-border p-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span className="font-medium text-sm">Preview</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-6">
        <Card className="max-w-none p-8 bg-white shadow-sm border-0">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </Card>
      </ScrollArea>
    </div>
  );
};
