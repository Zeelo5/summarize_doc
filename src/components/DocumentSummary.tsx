import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Copy, FileText, Tag, FileSearch } from "lucide-react";

interface DocumentSummaryProps {
  document?: {
    id: string;
    title: string;
    originalFileName: string;
    summary: string;
    fullText: string;
    highlights: Array<{ text: string; importance: "high" | "medium" | "low" }>;
    metadata: {
      tags: string[];
      entities: Array<{ name: string; type: string }>;
      keyInsights: string[];
    };
    processedDate: string;
  };
  onExport?: (format: "pdf" | "docx" | "txt") => void;
  onCopy?: (content: string) => void;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  document = {
    id: "1",
    title: "Sample Document",
    originalFileName: "sample-document.pdf",
    summary:
      "This is a sample document summary that provides an overview of the document content. It highlights the main points and key information contained within the document.",
    fullText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nisl eu nisl.\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
    highlights: [
      {
        text: "This is a high importance highlight from the document.",
        importance: "high",
      },
      {
        text: "This is a medium importance highlight from the document.",
        importance: "medium",
      },
      {
        text: "This is a low importance highlight from the document.",
        importance: "low",
      },
    ],
    metadata: {
      tags: ["Sample", "Document", "Test"],
      entities: [
        { name: "John Doe", type: "Person" },
        { name: "Acme Corp", type: "Organization" },
        { name: "New York", type: "Location" },
      ],
      keyInsights: [
        "First key insight from the document",
        "Second key insight from the document",
        "Third key insight from the document",
      ],
    },
    processedDate: "2023-06-15T14:30:00Z",
  },
  onExport = () => {},
  onCopy = () => {},
}) => {
  const formattedDate = document.processedDate
    ? new Date(document.processedDate).toLocaleDateString()
    : "";

  const getHighlightColor = (importance: "high" | "medium" | "low") => {
    switch (importance) {
      case "high":
        return "bg-red-100 border-l-4 border-red-500";
      case "medium":
        return "bg-yellow-100 border-l-4 border-yellow-500";
      case "low":
        return "bg-blue-100 border-l-4 border-blue-500";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-white w-full max-w-5xl mx-auto rounded-lg shadow-lg">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {document.title}
              </CardTitle>
              <CardDescription className="mt-1">
                Original file: {document.originalFileName} • Processed on{" "}
                {formattedDate}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopy(document.summary)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("pdf")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="summary">
                <FileText className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="fulltext">
                <FileSearch className="h-4 w-4 mr-2" />
                Full Text
              </TabsTrigger>
              <TabsTrigger value="metadata">
                <Tag className="h-4 w-4 mr-2" />
                Metadata
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Document Summary</h3>
                  <p className="text-gray-700">{document.summary}</p>
                </div>

                <h3 className="text-lg font-medium mb-2">Key Highlights</h3>
                <div className="space-y-3">
                  {document.highlights?.map((highlight, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md ${getHighlightColor(highlight.importance)}`}
                    >
                      <p className="text-gray-800">{highlight.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="fulltext" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="whitespace-pre-wrap">{document.fullText}</div>
                </ScrollArea>
              </motion.div>
            </TabsContent>

            <TabsContent value="metadata" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {document.metadata.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-lg font-medium mt-6">Entities</h3>
                    <div className="space-y-2">
                      {document.metadata.entities?.map((entity, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-gray-700">{entity.name}</span>
                          <Badge className="ml-2" variant="outline">
                            {entity.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Key Insights</h3>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      {document.metadata.keyInsights?.map((insight, index) => (
                        <li key={index} className="text-gray-700">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-gray-500">
            Document ID: {document.id}
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => onExport("pdf")}>
              PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport("docx")}
            >
              DOCX
            </Button>
            <Button size="sm" variant="outline" onClick={() => onExport("txt")}>
              TXT
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentSummary;
