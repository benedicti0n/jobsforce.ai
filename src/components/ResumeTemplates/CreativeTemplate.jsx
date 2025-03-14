import React from 'react';
import { ScrollArea } from "../../components/ui/scroll-area";

import { Separator } from '../../components/ui/separator';

const CreativeTemplate = ({ sections, resumeRef, renderFormattedText }) => {
  // Get personal info section
  const personalInfo = sections.find(s => s.id === "personal-info") || { fields: [] };
  
  // Function to render a section if it exists
  const renderSection = (sectionId, renderer) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? renderer(section) : null;
  };

  return (
    <ScrollArea className="h-[70vh] p-8">
      <div ref={resumeRef} id="resume" className="px-4 mx-auto max-w-4xl bg-gradient-to-br from-white to-gray-50">
        {/* Header - Creative style with accent color */}
        <div className="relative py-8 mb-8">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-teal-500 rounded-full opacity-10 translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text mb-2">
              {personalInfo.fields.find(f => f.id === "name")?.value || "Your Name"}
            </h1>
            <h2 className="text-xl text-gray-700 font-medium ml-1 mb-4">
              {sections.find(s => s.id === "experience")?.entries?.[0]?.fields.find(f => f.id === "title")?.value || "Your Title"}
            </h2>
            
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              {personalInfo.fields
                .filter(field => field.id !== "name" && field.value)
                .map((field) => (
                  <div key={field.id} className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
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
                        className="hover:text-purple-600 transition-colors"
                      >
                        {field.value}
                      </a>
                    ) : (
                      <span>{field.value}</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        {renderSection("summary", (section) => (
          <div className="mb-10 relative px-6 py-5 rounded-lg border-none bg-gradient-to-r from-purple-50 to-teal-50">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-teal-500"></div>
            <h2 className="text-lg font-bold text-purple-700 mb-2">
              Professional Summary
            </h2>
            <div className="text-gray-700 italic">
              {renderFormattedText(section.fields[0]?.value)}
            </div>
          </div>
        ))}

        {/* Main content grid - Render sections in the order they appear in the sections array */}
        <div className="grid grid-cols-1 gap-8">
          {/* Map through all sections and render them based on their type */}
          {sections.map((section) => {
            // Skip personal-info and summary as they're already rendered
            if (section.id === "personal-info" || section.id === "summary") {
              return null;
            }
            
            // Experience Section
            if (section.id === "experience") {
              return (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block">
                    <span className="relative z-10">{section.title}</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-3 bg-teal-200 opacity-50 z-0"></span>
                  </h2>
                  
                  <div className="space-y-6">
                    {section.entries.map((entry, index) => (
                      <div key={index} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-purple-300 before:to-teal-300">
                        <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-purple-500 -translate-x-1/2"></div>
                        
                        <div className="mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {entry.fields.find(f => f.id === "title")?.value}
                          </h3>
                          <div className="flex items-center text-gray-700 mb-1">
                            <span className="font-medium">
                              {entry.fields.find(f => f.id === "company")?.value}
                            </span>
                            {entry.fields.find(f => f.id === "location")?.value && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{entry.fields.find(f => f.id === "location")?.value}</span>
                              </>
                            )}
                          </div>
                          <div className="text-sm text-purple-600">
                            {entry.fields.find(f => f.id === "duration")?.value}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          {renderFormattedText(entry.fields.find(f => f.id === "responsibilities")?.value)}
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          {entry.fields.find(f => f.id === "technologies")?.value?.split(", ").map((tech, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-full bg-teal-50 text-teal-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            
            // Education Section
            if (section.id === "education") {
              return (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block">
                    <span className="relative z-10">{section.title}</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-3 bg-purple-200 opacity-50 z-0"></span>
                  </h2>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {section.fields.find(f => f.id === "university")?.value}
                    </h3>
                    <div className="text-purple-600 font-medium">
                      {section.fields.find(f => f.id === "degree")?.value}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {section.fields.find(f => f.id === "Start-Month/Year-End-Month/Year")?.value}
                    </div>
                    {section.fields.find(f => f.id === "cgpa-or-percentage")?.value && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">CGPA: </span>
                        {section.fields.find(f => f.id === "cgpa-or-percentage")?.value}
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            
            // Skills Section
            if (section.id === "skills") {
              return (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block">
                    <span className="relative z-10">{section.title}</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-3 bg-teal-200 opacity-50 z-0"></span>
                  </h2>
                  
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-5 py-4">
                          <h3 className="font-medium text-purple-700 mb-2">{field.label}</h3>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {field.value.split('\n').map((item, i) => (
                              <span key={i} className="px-2.5 py-0.5 text-xs rounded-full bg-gray-50 border border-gray-100 text-gray-700">
                                {item.trim().replace(/^ /, '')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            
            // Projects Section
            if (section.id === "projects") {
              return (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block">
                    <span className="relative z-10">{section.title}</span>
                    <span className="absolute -bottom-1 left-0 right-0 h-3 bg-purple-200 opacity-50 z-0"></span>
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {section.entries.map((entry, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                        <div className="px-5 py-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {entry.fields.find(f => f.id === "name")?.value}
                          </h3>
                          <div className="text-sm text-gray-600 mb-3">
                            {entry.fields.find(f => f.id === "duration")?.value}
                          </div>
                          <div className="text-sm text-gray-700 mb-3">
                            {renderFormattedText(entry.fields.find(f => f.id === "description")?.value)}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {entry.fields.find(f => f.id === "technologies")?.value?.split(", ").map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                {tech}
                              </span>
                            ))}
                          </div>
                          
                          {entry.fields.find(f => f.id === "link")?.value && (
                            <a 
                              href={entry.fields.find(f => f.id === "link")?.value}
                              className="mt-2 inline-block text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            
            // Generic section for any other section types
            return (
              <div key={section.id}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 relative inline-block">
                  <span className="relative z-10">{section.title}</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-purple-200 opacity-50 z-0"></span>
                </h2>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
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
    </ScrollArea>
  );
};

export default CreativeTemplate;