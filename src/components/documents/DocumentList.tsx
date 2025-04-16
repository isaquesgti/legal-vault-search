
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  dateAdded: Date | string;
  tags: string[];
  clientName: string;
}

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  searchTerm?: string;
  onDocumentDelete?: (id: string) => void;
}

const DocumentList = ({
  documents,
  isLoading = false,
  searchTerm = "",
  onDocumentDelete,
}: DocumentListProps) => {
  const { toast } = useToast();
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredDocuments(documents);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.clientName.toLowerCase().includes(term) ||
        doc.type.toLowerCase().includes(term) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(term))
    );
    setFilteredDocuments(filtered);
  }, [documents, searchTerm]);

  const handleViewDocument = (document: Document) => {
    toast({
      title: "Document Viewer",
      description: `Opening ${document.name}`,
    });
    // In a real app, this would open the document viewer
  };

  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document.name}`,
    });
    // In a real app, this would trigger a file download
  };

  const handleDeleteDocument = (id: string) => {
    if (onDocumentDelete) {
      onDocumentDelete(id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "petition":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-green-100 text-green-800";
      case "decision":
        return "bg-purple-100 text-purple-800";
      case "correspondence":
        return "bg-yellow-100 text-yellow-800";
      case "evidence":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="document-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardContent className="pt-6">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-lg font-medium">No documents found</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Upload your first document to get started"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredDocuments.map((document) => (
        <Card key={document.id} className="document-card overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="bg-legal-light p-2 rounded">
                    <FileText className="h-6 w-6 text-legal-primary" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-medium truncate" title={document.name}>
                      {document.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(
                          document.type
                        )}`}
                      >
                        {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(document.size)}</span>
                      <span>•</span>
                      <span>Added {formatDate(document.dateAdded)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                    onClick={() => handleViewDocument(document)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                    onClick={() => handleDownloadDocument(document)}
                  >
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none text-destructive hover:text-destructive"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                {document.clientName && (
                  <div className="text-sm">
                    <span className="font-medium">Client:</span> {document.clientName}
                  </div>
                )}
                
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
