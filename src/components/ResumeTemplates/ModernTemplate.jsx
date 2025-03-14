import React from 'react';
import { ScrollArea } from "../../components/ui/scroll-area";

import { Separator } from '../../components/ui/separator';

const ModernTemplate = ({ sections, resumeRef, renderFormattedText }) => {
  // Get personal info section
  const personalInfo = sections.find(s => s.id === "personal-info") || { fields: [] };
  
  // Function to render a section if it exists
  const renderSection = (sectionId, renderer) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? renderer(section) : null;
  };

  // Separate sections into main content and sidebar
  const mainSections = [];
  const sidebarSections = [];
  
  // Categorize sections
  sections.forEach(section => {
    if (section.id === "personal-info" || section.id === "summary") {
      // These are handled separately
      return;
    }
    
    if (section.id === "experience" || section.id === "projects") {
      mainSections.push(section);
    } else {
      sidebarSections.push(section);
    }
  });
  
  return (
    <ScrollArea className="h-[70vh] p-8">
      <div ref={resumeRef} id="resume" className="px-4 mx-auto max-w-4xl bg-white">
        {/* Header - Modern style with accent color */}
        <div className="border-l-8 border-blue-600 pl-4 py-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {personalInfo.fields.find(f => f.id === "name")?.value || "Your Name"}
          </h1>
          <h2 className="text-xl text-blue-600 font-medium">
            {sections.find(s => s.id === "experience")?.entries?.[0]?.fields.find(f => f.id === "title")?.value || "Your Title"}
          </h2>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {personalInfo.fields
              .filter(field => field.id !== "name" && field.value)
              .map((field) => (
                <div key={field.id} className="flex items-center">
                  {field.id === "email" && <span className="mr-1">✉️</span>}
                  {field.id === "phone" && <span className="mr-1">📱</span>}
                  {field.id === "location" && <span className="mr-1">📍</span>}
                  {field.id === "portfolio" && <span className="mr-1">🔗</span>}
                  {field.id === "linkedin" && <span className="mr-1">💼</span>}
                  {field.id === "github" && <span className="mr-1">💻</span>}
                  {field.id === "portfolio" || field.id === "linkedin" || field.id === "github" ? (
                    <a 
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {field.value}
                    </a>
                  ) : (
                    <span className="text-gray-700">{field.value}</span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Summary */}
        {renderSection("summary", (section) => (
          <div className="mb-8 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
            <h2 className="text-lg font-bold text-blue-700 mb-2">
              {section.title}
            </h2>
            <div className="text-gray-800">
              {renderFormattedText(section.fields[0]?.value)}
            </div>
          </div>
        ))}

        {/* Two-column layout for the rest */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column (2/3 width) */}
          <div className="col-span-2 space-y-6">
            {/* Render main sections in the order they appear in the sections array */}
            {mainSections.map(section => {
              if (section.id === "experience") {
                return (
                  <div key={section.id}>
                    <h2 className="text-lg font-bold text-blue-700 uppercase mb-4">
                      {section.title}
                    </h2>
                    <div className="space-y-5">
                      {section.entries.map((entry, index) => (
                        <div key={index} className="relative pl-4 border-l-2 border-gray-300 pb-5">
                          <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-blue-600"></div>
                          <h3 className="font-bold text-gray-900">
                            {entry.fields.find(f => f.id === "title")?.value}
                          </h3>
                          <div className="flex items-center text-sm text-gray-700 mb-1">
                            <span className="font-semibold">
                              {entry.fields.find(f => f.id === "company")?.value}
                            </span>
                            {entry.fields.find(f => f.id === "location")?.value && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{entry.fields.find(f => f.id === "location")?.value}</span>
                              </>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {entry.fields.find(f => f.id === "duration")?.value}
                          </div>
                          
                          {/* Responsibilities */}
                          <div className="text-sm mt-2">
                            {entry.fields
                              .filter(f => f.id === "responsibilities")
                              .map((field) => (
                                <div key={field.id}>
                                  {renderFormattedText(field.value)}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              
              if (section.id === "projects") {
                return (
                  <div key={section.id}>
                    <h2 className="text-lg font-bold text-blue-700 uppercase mb-4">
                      {section.title}
                    </h2>
                    <div className="space-y-4">
                      {section.entries.map((entry, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <h3 className="font-bold text-gray-900">
                            {entry.fields.find(f => f.id === "name")?.value}
                          </h3>
                          <div className="text-sm text-gray-600 mb-2">
                            {entry.fields.find(f => f.id === "duration")?.value}
                          </div>
                          <div className="text-sm">
                            {renderFormattedText(entry.fields.find(f => f.id === "description")?.value)}
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-blue-700">Technologies:</span>{" "}
                            {entry.fields.find(f => f.id === "technologies")?.value}
                          </div>
                          {entry.fields.find(f => f.id === "link")?.value && (
                            <a 
                              href={entry.fields.find(f => f.id === "link")?.value}
                              className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              
              // Generic section for any other main section types
              return (
                <div key={section.id}>
                  <h2 className="text-lg font-bold text-blue-700 uppercase mb-4">
                    {section.title}
                  </h2>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    {section.isMulti ? (
                      <div className="space-y-4">
                        {section.entries.map((entry, index) => (
                          <div key={index} className="mb-4">
                            {entry.fields.map((field) => (
                              <div key={field.id} className="mb-2">
                                <div className="font-medium">{field.label}</div>
                                <div className="text-sm text-gray-700">
                                  {renderFormattedText(field.value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {section.fields.map((field) => (
                          <div key={field.id} className="mb-2">
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-700">
                              {renderFormattedText(field.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            {/* Render sidebar sections in the order they appear in the sections array */}
            {sidebarSections.map(section => {
              if (section.id === "education") {
                return (
                  <div key={section.id}>
                    <h2 className="text-lg font-bold text-blue-700 uppercase mb-4">
                      {section.title}
                    </h2>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-gray-900">
                        {section.fields.find(f => f.id === "university")?.value}
                      </h3>
                      <div className="text-sm font-medium text-gray-700">
                        {section.fields.find(f => f.id === "degree")?.value}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {section.fields.find(f => f.id === "Start-Month/Year-End-Month/Year")?.value}
                      </div>
                      {section.fields.find(f => f.id === "cgpa-or-percentage")?.value && (
                        <div className="text-sm">
                          <span className="font-medium">CGPA: </span>
                          {section.fields.find(f => f.id === "cgpa-or-percentage")?.value}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              
              if (section.id === "skills") {
                return (
                  <div key={section.id}>
                    <h2 className="text-lg font-bold text-blue-700 uppercase mb-4">
                      {section.title}
                    </h2>
                    {section.fields.map((field) => (
                      <div key={field.id} className="mb-4">
                        <div className="font-medium text-gray-800 mb-2">{field.label}</div>
                        <div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {field.value.split('\n').map((item, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-md">
                                {item.trim().replace(/^ /, '')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              
              // Generic section for any other sidebar section types
              return (
                <div key={section.id}>
                  <h2 className="text-lg font-bold text-blue-700 uppercase mb-4">
                    {section.title}
                  </h2>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    {section.isMulti ? (
                      <div className="space-y-4">
                        {section.entries.map((entry, index) => (
                          <div key={index} className="mb-4">
                            {entry.fields.map((field) => (
                              <div key={field.id} className="mb-2">
                                <div className="font-medium">{field.label}</div>
                                <div className="text-sm text-gray-700">
                                  {renderFormattedText(field.value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {section.fields.map((field) => (
                          <div key={field.id} className="mb-2">
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-700">
                              {renderFormattedText(field.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ModernTemplate;