import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Settings, Copy, Printer } from "lucide-react";
import DocumentSummary from "./DocumentSummary";

interface Document {
  id: string;
  title?: string;
  originalFileName: string;
  summary: string;
  fullText: string;
  metadata: {
    tags: string[];
    keyInsights: string[];
    entities: Array<{ name: string; type: string }>;
  };
  highlights: {
    text: string;
    importance: "high" | "medium" | "low";
  }[];
  processedDate: string;
}

interface ResultsDashboardProps {
  documents?: Document[];
  onExport?: (documentId: string, format: "pdf" | "docx" | "txt") => void;
  onUpdatePrompt?: (promptType: string, promptText: string) => void;
  onUploadMore?: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  documents = [
    {
      id: "1",
      title: "Sample Document",
      originalFileName: "Sample Document.pdf",
      summary:
        "This is a sample document summary that highlights the key points from the document. It provides a concise overview of the main topics covered.",
      fullText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.",
      metadata: {
        tags: ["Contract", "Legal", "Agreement"],
        keyInsights: [
          "Payment terms defined in section 3.2",
          "Termination clause on page 5",
          "Non-compete for 24 months",
        ],
        entities: [
          { name: "Acme Corp", type: "Organization" },
          { name: "John Doe", type: "Person" },
          { name: "Jane Smith", type: "Person" },
        ],
      },
      highlights: [
        {
          text: "Payment must be made within 30 days of invoice receipt",
          importance: "high",
        },
        {
          text: "Either party may terminate with 60 days written notice",
          importance: "medium",
        },
        {
          text: "All disputes shall be resolved through arbitration",
          importance: "low",
        },
      ],
      processedDate: "2023-06-15T14:30:00Z",
    },
    {
      id: "2",
      title: "Business Proposal",
      originalFileName: "Business Proposal.docx",
      summary:
        "A business proposal for expanding operations into the European market, with financial projections and implementation timeline.",
      fullText:
        "Detailed business proposal text would appear here with multiple paragraphs of content...",
      metadata: {
        tags: ["Business", "Proposal", "Expansion"],
        keyInsights: [
          "€2.5M initial investment",
          "18-month timeline",
          "Focus on Germany and France",
        ],
        entities: [
          { name: "Global Enterprises", type: "Organization" },
          { name: "European Union", type: "Organization" },
          { name: "Frankfurt Office", type: "Location" },
        ],
      },
      highlights: [
        {
          text: "Projected ROI of 22% within first 24 months",
          importance: "high",
        },
        {
          text: "Hiring of 15 local staff required in Q1",
          importance: "medium",
        },
        { text: "Regulatory approval expected by Q3", importance: "medium" },
      ],
      processedDate: "2023-06-10T09:15:00Z",
    },
  ],
  onExport = () => {},
  onUpdatePrompt = () => {},
  onUploadMore = () => {},
}) => {
  const [activeDocument, setActiveDocument] = useState<string>(
    documents[0]?.id || "",
  );
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [promptType, setPromptType] = useState("summarization");
  const [promptText, setPromptText] = useState("");

  const promptTemplates = {
    summarization:
      "Summarize the key points of this document in 3-5 sentences.",
    legal:
      "Extract legal obligations, rights, and potential liabilities from this document.",
    compliance:
      "Identify compliance requirements and regulatory considerations in this document.",
  };

  const handlePromptSelect = (type: string) => {
    setPromptType(type);
    setPromptText(promptTemplates[type as keyof typeof promptTemplates] || "");
  };

  const handlePromptSave = () => {
    onUpdatePrompt(promptType, promptText);
    setPromptDialogOpen(false);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const currentDocument = documents.find((doc) => doc.id === activeDocument);

  if (documents.length === 0) {
    return (
      <Card className="w-full bg-white">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <FileText size={48} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">
            No Documents Processed
          </h3>
          <p className="text-gray-500 text-center mt-2">
            Upload documents to see processing results here.
          </p>
          <Button onClick={onUploadMore} className="mt-6">
            Upload Documents
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Analysis Results</h2>
        <div className="flex gap-2">
          <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Settings size={16} />
                <span>Customize Prompts</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Customize AI Processing Prompts</DialogTitle>
                <DialogDescription>
                  Adjust the prompts used for document processing to better suit
                  your needs.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prompt-type" className="text-right">
                    Prompt Type
                  </Label>
                  <select
                    id="prompt-type"
                    className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                    value={promptType}
                    onChange={(e) => handlePromptSelect(e.target.value)}
                  >
                    <option value="summarization">Summarization</option>
                    <option value="legal">Legal Analysis</option>
                    <option value="compliance">Compliance Check</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prompt-text" className="text-right">
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt-text"
                    className="col-span-3"
                    rows={5}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setPromptDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handlePromptSave}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex">
        {/* Document tabs navigation */}
        <div className="w-1/4 border-r p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500 mb-3">DOCUMENTS</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveDocument(doc.id)}
                className={`p-3 rounded-md cursor-pointer flex items-center ${doc.id === activeDocument ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-100"}`}
              >
                <FileText
                  size={18}
                  className={`mr-2 ${doc.id === activeDocument ? "text-blue-500" : "text-gray-400"}`}
                />
                <div className="overflow-hidden">
                  <p
                    className={`text-sm font-medium truncate ${doc.id === activeDocument ? "text-blue-700" : "text-gray-700"}`}
                  >
                    {doc.originalFileName || doc.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document content area */}
        <div className="w-3/4 p-6">
          {currentDocument && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentDocument.title || currentDocument.originalFileName}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyText(currentDocument.summary)}
                    className="flex items-center gap-1"
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="flex items-center gap-1"
                  >
                    <Printer size={14} />
                    <span>Print</span>
                  </Button>
                  <div className="relative">
                    <Button className="flex items-center gap-1">
                      <Download size={14} />
                      <span>Export</span>
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                      <div className="py-1">
                        <button
                          onClick={() => onExport(currentDocument.id, "pdf")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export as PDF
                        </button>
                        <button
                          onClick={() => onExport(currentDocument.id, "docx")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export as DOCX
                        </button>
                        <button
                          onClick={() => onExport(currentDocument.id, "txt")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export as TXT
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="full-text">Full Text</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <DocumentSummary document={currentDocument} view="summary" />
                </TabsContent>

                <TabsContent value="full-text" className="space-y-4">
                  <DocumentSummary document={currentDocument} view="fullText" />
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <DocumentSummary document={currentDocument} view="metadata" />
                </TabsContent>

                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={onUploadMore}
                    className="mr-2"
                  >
                    Upload More Documents
                  </Button>
                </div>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
