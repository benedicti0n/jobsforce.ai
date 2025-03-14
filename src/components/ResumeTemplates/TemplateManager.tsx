import React, { useState, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '../ui/Button';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Import your template components
import ClassicTemplate from './ClassicTemplate'; // Your existing template
import ModernTemplate from './ModernTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import CreativeTemplate from './CreativeTemplate';

// Utility function for formatting text (presumably this exists in your app)
const renderFormattedText = (text) => {
  if (!text) return null;

  if (text.includes('\n')) {
    return (
      <ul className="list-disc pl-4">
        {text.split('\n').map((item, index) => (
          <li key={index}>{item.trim().replace(/^ /, '')}</li>
        ))}
      </ul>
    );
  }

  return <p>{text}</p>
};

const transformResumeResponse = (resumeData) => {
  if (!resumeData) return [];

  return [
    // Personal Information Section
    {
      id: "personal-info", // Make sure this ID is consistent
      title: "Personal Information",
      fields: [
        { id: "name", label: "Full Name", value: resumeData?.name || "" },
        { id: "email", label: "Email", value: resumeData?.email || "" },
        { id: "phone", label: "Phone", value: resumeData?.phone || "" },
        { id: "linkedin", label: "LinkedIn", value: resumeData?.linkedIn || "" },
        { id: "github", label: "GitHub", value: resumeData?.github || "" },
        { id: "portfolio", label: "Portfolio", value: resumeData?.portfolio || "" }
      ].filter(field => field.value), // Remove empty fields
    },
    // ... other sections ...
  ];
};

// Update the styles for PDF
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 30,
    fontSize: 12, // Base font size
    fontFamily: 'Helvetica',
    color: '#333',
  },
  section: {
    marginBottom: 15,
    breakInside: 'avoid', // Try to avoid breaking sections across pages
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  normalText: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  contactInfo: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  // Add more specific styles as needed
});

// Updated PDF template with proper page breaks
const ClassicPDF = ({ sections }) => {
  const personalInfo = sections.find(s => s.id === "personal-info");
  const otherSections = sections.filter(s => s.id !== "personal-info");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section - Always on first page */}
        <View style={styles.header} fixed>
          <Text style={styles.name}>
            {personalInfo?.fields.find(f => f.id === "name")?.value}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {personalInfo?.fields
              .filter(f => f.id !== "name")
              .map(field => (
                <Text key={field.id} style={styles.contactInfo}>
                  {field.value}
                </Text>
              ))}
          </View>
        </View>

        {/* Other Sections with smart page breaks */}
        {otherSections.map((section, index) => (
          <View key={section.id} style={styles.section} break={index > 0}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.isMulti ? (
              // Handle multi-entry sections (like experience)
              section.entries.map((entry, entryIndex) => (
                <View key={entryIndex} style={[styles.entry, { marginBottom: 12 }]} break={entryIndex > 0}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                    {entry.fields.find(f => f.id === "title")?.value}
                  </Text>
                  <Text style={{ fontSize: 12, marginBottom: 4 }}>
                    {entry.fields.find(f => f.id === "company")?.value}
                    {entry.fields.find(f => f.id === "location")?.value &&
                      ` • ${entry.fields.find(f => f.id === "location")?.value}`}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>
                    {entry.fields.find(f => f.id === "duration")?.value}
                  </Text>

                  {/* Handle bullet points */}
                  {entry.fields.find(f => f.id === "responsibilities")?.value
                    .split('\n')
                    .map((bullet, i) => (
                      <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                        <Text style={{ marginRight: 5 }}>•</Text>
                        <Text style={styles.normalText}>{bullet.trim()}</Text>
                      </View>
                    ))}
                </View>
              ))
            ) : (
              // Handle regular sections
              <View style={{ marginBottom: 8 }}>
                {section.fields.map((field, fieldIndex) => (
                  <View key={fieldIndex} style={{ marginBottom: 4 }} break={fieldIndex > 0}>
                    <Text style={styles.normalText}>
                      {field.label}: {field.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

const ModernPDF = ({ sections }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ... ModernPDF implementation ... */}
    </Page>
  </Document>
);

const MinimalistPDF = ({ sections }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ... MinimalistPDF implementation ... */}
    </Page>
  </Document>
);

const CreativePDF = ({ sections }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ... CreativePDF implementation ... */}
    </Page>
  </Document>
);

const TemplateManager = ({ resumeData, sections, isLoading = false }) => {
  const [currentTemplate, setCurrentTemplate] = useState('classic');
  const resumeRef = useRef(null);
  const [currentSections, setCurrentSections] = useState(sections || []);

  // Update currentSections whenever sections prop changes
  useEffect(() => {
    setCurrentSections(sections || []);
  }, [sections]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
        <p className="mt-4">Crafting the best resume for you...</p>
      </div>
    );
  }

  // If no data is available, show a message or return null
  if (!resumeData && !sections?.length) {
    return (
      <div className="p-8 text-center">
        <p>No resume data available</p>
      </div>
    );
  }

  // Ensure sections have consistent IDs
  const formattedSections = currentSections.map(section => {
    if (section.id === "personal") {
      return { ...section, id: "personal-info" };
    }
    return section;
  });

  // Map template IDs to components
  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      component: ClassicTemplate,
      pdfComponent: ClassicPDF
    },
    {
      id: 'modern',
      name: 'Modern',
      component: ModernTemplate,
      pdfComponent: ModernPDF
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      component: MinimalistTemplate,
      pdfComponent: MinimalistPDF
    },
    {
      id: 'creative',
      name: 'Creative',
      component: CreativeTemplate,
      pdfComponent: CreativePDF
    }
  ];

  const CurrentTemplateComponent = templates.find(t => t.id === currentTemplate)?.component || ClassicTemplate;

  // Handle template change
  const handleTemplateChange = (templateId) => {
    setCurrentTemplate(templateId);
  };

  const handleDownload = () => {
    if (!resumeRef.current) return;

    // Find the resume content
    const resumeContent = document.querySelector('.resume-for-print');
    if (!resumeContent) return;

    // Create a new window/document for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the resume');
      return;
    }

    // Get all style elements from current document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.cloneNode(true).outerHTML)
      .join('');

    // Get computed styles for the resume element to ensure all styling is captured
    const computedStyles = `
      <style>
        body { 
          margin: 0; 
          padding: 0; 
        }
        .print-container { 
          overflow: visible !important; 
          height: auto !important;
          max-height: none !important;
          position: relative !important;
        }
        /* Ensure all elements inside are visible */
        .print-container * {
          overflow: visible !important;
          height: auto !important;
        }
        /* Remove header and footer */
        @page {
          size: auto;
          margin: 0mm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html {
            height: 100%;
            overflow: hidden;
          }
          
          /* Page break controls based on your resume structure */
          
          /* Keep section titles with their content */
          [id^="personal-info"],
          [id^="summary"],
          [id^="experience"],
          [id^="education"],
          [id^="skills"],
          [id^="projects"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Keep individual experience entries together */
          [id^="experience"] > div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Keep project entries together */
          [id^="projects"] > div {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Keep section headings with their first entry */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          
          /* Keep bullet points together with their headers */
          ul, ol {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Keep list items together */
          li {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Ensure job titles, company names, and dates stay together */
          [id="title"],
          [id="company"],
          [id="duration"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Allow breaks between major sections when necessary */
          .resume-for-print > div {
            page-break-before: auto !important;
            break-before: auto !important;
          }
          
          /* If experience section is too large, allow breaks between entries */
          [id^="experience"] {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          
          /* Keep each bullet point description together */
          [id="responsibilities"],
          [id="achievements"],
          [id="technical"],
          [id="soft"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      </style>
    `;

    // Set the content of the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          ${styles}
          ${computedStyles}
        </head>
        <body>
          <div class="print-container">
            ${resumeContent.outerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for resources to load before printing
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* UI Controls - will be hidden during print */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold mb-1">Resume Builder</h1>
          <p className="text-gray-600">Choose a template and download your resume</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Select value={currentTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex flex-col">
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleDownload}
            variant="secondary"
            className="bg-yellow-400 text-white hover:bg-yellow-300"
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Resume Preview - will be visible during print */}
      <div className="bg-white border rounded-lg shadow-sm no-print">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-medium">
            Preview: <span className="text-blue-600">{templates.find(t => t.id === currentTemplate)?.name}</span>
          </h2>
        </div>
      </div>

      {/* Actual resume content - this will be printed */}
      <div className="bg-white rounded-lg">
        <div className="scroll-area resume-for-print">
          <CurrentTemplateComponent
            sections={formattedSections}
            resumeData={resumeData}
            resumeRef={resumeRef}
            renderFormattedText={renderFormattedText}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;