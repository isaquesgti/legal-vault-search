
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileType2, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const documentTypes = [
  { value: "petition", label: "Petition" },
  { value: "contract", label: "Contract" },
  { value: "decision", label: "Court Decision" },
  { value: "correspondence", label: "Correspondence" },
  { value: "evidence", label: "Evidence" },
  { value: "other", label: "Other" },
];

interface DocumentUploaderProps {
  onUploadComplete?: (documentInfo: {
    id: string;
    name: string;
    type: string;
    size: number;
    dateAdded: Date;
    tags: string[];
    clientName: string;
  }) => void;
}

const DocumentUploader = ({ onUploadComplete }: DocumentUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [clientName, setClientName] = useState("");
  const [tags, setTags] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    // Check file type (PDF, DOC, DOCX, JPG, PNG, etc.)
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, JPG, or PNG file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    toast({
      title: "File selected",
      description: `${file.name} selected and ready for upload`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!documentType) {
      toast({
        title: "Document type required",
        description: "Please select a document type",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Simulate file upload with a delay
    setTimeout(() => {
      const newDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFile.name,
        type: documentType,
        size: selectedFile.size,
        dateAdded: new Date(),
        tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        clientName: clientName.trim(),
      };

      // In a real app, you would upload the file to a server or cloud storage here
      // and then store the document metadata in a database

      setIsUploading(false);
      setSelectedFile(null);
      setDocumentType("");
      setClientName("");
      setTags("");

      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been uploaded and indexed`,
      });

      if (onUploadComplete) {
        onUploadComplete(newDocument);
      }

      // Store in localStorage for demo purposes
      const existingDocs = JSON.parse(localStorage.getItem("documents") || "[]");
      localStorage.setItem("documents", JSON.stringify([...existingDocs, newDocument]));
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" /> Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`file-drop-area border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 ${
            isDragging ? "bg-muted/50 border-primary" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-2 mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FileType2 className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="font-medium">Clique para selecionar um arquivo</p>
              <p className="text-sm text-muted-foreground">
                ou arraste e solte aqui (PDF, DOC, DOCX, JPG, PNG)
              </p>
            </div>
          )}
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>

        {selectedFile && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="document-type">Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Selecione o tipo de documento" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="client-name">Nome do Cliente</Label>
              <Input
                id="client-name"
                placeholder="Digite o nome do cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                placeholder="ex: urgente, revisão, importante"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-legal-primary hover:bg-legal-secondary"
            >
              {isUploading ? "Enviando..." : "Enviar Documento"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
