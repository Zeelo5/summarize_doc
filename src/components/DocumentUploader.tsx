import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  progress: number;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
}

interface DocumentUploaderProps {
  onUploadComplete?: (files: FileWithPreview[]) => void;
  onSummarize?: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  isProcessing?: boolean;
}

const DocumentUploader = ({
  onUploadComplete = () => {},
  onSummarize = () => {},
  maxFiles = 10,
  maxSizeMB = 10,
  allowedFileTypes = [".pdf", ".docx", ".doc"],
  isProcessing = false,
}: DocumentUploaderProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }

    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedFileTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type not supported. Allowed types: ${allowedFileTypes.join(", ")}`,
      };
    }

    // Check max files
    if (files.length >= maxFiles) {
      return { valid: false, error: `Maximum ${maxFiles} files allowed` };
    }

    return { valid: true };
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    setError(null);
    const newFiles: FileWithPreview[] = [];

    // Convert FileList to array and process
    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file);

      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      // Create a new file with additional properties
      const newFile: FileWithPreview = Object.assign(file, {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        progress: 0,
        status: "uploading" as const,
      });

      newFiles.push(newFile);

      // Simulate upload progress
      simulateUpload(newFile);
    });

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      processFiles(e.dataTransfer.files);
    },
    [files.length],
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset the input value so the same file can be uploaded again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateUpload = (file: FileWithPreview) => {
    // Simulate file upload with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Update file status to success
        setFiles((prev) => {
          const updatedFiles = prev.map((f) =>
            f.id === file.id ? { ...f, progress, status: "success" } : f,
          );

          // Check if all files are uploaded
          const allUploaded = updatedFiles.every((f) => f.status === "success");
          if (allUploaded) {
            // Use setTimeout to ensure state is updated before callback
            setTimeout(() => onUploadComplete(updatedFiles), 0);
          }

          return updatedFiles;
        });
      } else {
        // Update progress
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress } : f)),
        );
      }
    }, 200);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background">
      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div
            className={`flex flex-col items-center justify-center p-8 rounded-lg transition-colors ${isDragging ? "bg-primary/10" : "bg-background"}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedFileTypes.join(",")}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <Upload className="h-12 w-12 text-muted-foreground mb-4" />

            <h3 className="text-lg font-medium mb-2">
              Drag and drop your documents
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: {allowedFileTypes.join(", ")} (Max {maxSizeMB}
              MB per file)
            </p>

            <Button onClick={handleButtonClick} className="mb-2">
              Select Files
            </Button>

            <p className="text-xs text-muted-foreground">
              Upload up to {maxFiles} files
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  Uploaded Documents ({files.length}/{maxFiles})
                </h4>
                <Button
                  onClick={() => {
                    // Only pass files that have been successfully uploaded
                    const successfulFiles = files.filter(
                      (file) => file.status === "success",
                    );
                    if (successfulFiles.length > 0) {
                      onSummarize(successfulFiles);
                    }
                  }}
                  disabled={
                    isProcessing ||
                    files.some((file) => file.status === "uploading") ||
                    files.filter((file) => file.status === "success").length ===
                      0
                  }
                  className="flex items-center gap-2"
                >
                  {isProcessing ? "Processing..." : "Summarize Documents"}
                  {isProcessing && <Progress className="w-10 h-1" value={80} />}
                </Button>
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center p-3 border rounded-md bg-background"
                  >
                    <FileText className="h-5 w-5 mr-3 flex-shrink-0 text-primary" />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <div className="mt-1">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.status === "uploading"
                          ? `Uploading... ${Math.round(file.progress)}%`
                          : file.status === "success"
                            ? "Upload complete"
                            : "Upload failed"}
                      </p>
                    </div>

                    {file.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    )}

                    {file.status === "error" && (
                      <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploader;
