import React from 'react';
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from '../../components/ui/separator';

const MinimalistTemplate = ({ sections, resumeRef, renderFormattedText }) => {
  // Get personal info section
  const personalInfo = sections.find(s => s.id === "personal-info") || { fields: [] };
  
  return (
    <ScrollArea className="h-[70vh] p-8">
      <div ref={resumeRef} id="resume" className="px-6 mx-auto max-w-3xl bg-white font-sans">
        {/* Header - Clean, minimal style */}
        <div className="py-6 mb-6 border-b border-gray-200">
          <h1 className="text-3xl font-light text-gray-900 mb-1">
            {personalInfo.fields.find(f => f.id === "name")?.value || "Your Name"}
          </h1>
          <h2 className="text-lg text-gray-600 font-light mb-3">
            {sections.find(s => s.id === "experience")?.entries?.[0]?.fields.find(f => f.id === "title")?.value || "Your Title"}
          </h2>
          
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            {personalInfo.fields
              .filter(field => field.id !== "name" && field.value)
              .map((field) => (
                <div key={field.id}>
                  {field.id === "portfolio" || field.id === "linkedin" || field.id === "github" ? (
                    <a 
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      {field.value}
                    </a>
                  ) : (
                    field.value
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Summary */}
        {sections.find(s => s.id === "summary") && (
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              {sections.find(s => s.id === "summary").fields[0]?.value}
            </p>
          </div>
        )}

        {/* Main content - Render sections in the order they appear in the sections array */}
        <div className="space-y-8">
          {sections.map(section => {
            // Skip personal-info and summary as they're already rendered
            if (section.id === "personal-info" || section.id === "summary") {
              return null;
            }
            
            // Experience Section
            if (section.id === "experience") {
              return (
                <section key={section.id}>
                  <h2 className="text-xl font-normal text-gray-800 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.entries.map((entry, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-medium text-gray-900">
                            {entry.fields.find(f => f.id === "title")?.value}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {entry.fields.find(f => f.id === "duration")?.value}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {entry.fields.find(f => f.id === "company")?.value}
                          {entry.fields.find(f => f.id === "location")?.value && (
                            <span> • {entry.fields.find(f => f.id === "location")?.value}</span>
                          )}
                        </div>
                        
                        {/* Responsibilities */}
                        <div className="text-sm mt-2">
                          {renderFormattedText(entry.fields.find(f => f.id === "responsibilities")?.value)}
                        </div>
                        
                        {/* Technologies */}
                        <div className="mt-2 text-xs text-gray-500">
                          {entry.fields.find(f => f.id === "technologies")?.value}
                        </div>
                        
                        {index < section.entries.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // Education Section
            if (section.id === "education") {
              return (
                <section key={section.id}>
                  <h2 className="text-xl font-normal text-gray-800 mb-4">
                    {section.title}
                  </h2>
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-medium text-gray-900">
                        {section.fields.find(f => f.id === "university")?.value}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {section.fields.find(f => f.id === "Start-Month/Year-End-Month/Year")?.value}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {section.fields.find(f => f.id === "degree")?.value}
                      {section.fields.find(f => f.id === "cgpa-or-percentage")?.value && (
                        <span> • GPA: {section.fields.find(f => f.id === "cgpa-or-percentage")?.value}</span>
                      )}
                    </div>
                  </div>
                </section>
              );
            }
            
            // Skills Section
            if (section.id === "skills") {
              return (
                <section key={section.id}>
                  <h2 className="text-xl font-normal text-gray-800 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </h3>
                        <div className="text-sm text-gray-600">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {field.value.split('\n').map((item, i) => (
                              <span key={i} className="px-2 py-0.5 text-xs text-gray-600 border border-gray-200 rounded">
                                {item.trim().replace(/^ /, '')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            
            // Projects Section
            if (section.id === "projects") {
              return (
                <section key={section.id}>
                  <h2 className="text-xl font-normal text-gray-800 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.entries.map((entry, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-medium text-gray-900">
                            {entry.fields.find(f => f.id === "name")?.value}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {entry.fields.find(f => f.id === "duration")?.value}
                          </span>
                        </div>
                        <div className="text-sm">
                          {renderFormattedText(entry.fields.find(f => f.id === "description")?.value)}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {entry.fields.find(f => f.id === "technologies")?.value}
                        </div>
                        
                        {entry.fields.find(f => f.id === "link")?.value && (
                          <a 
                            href={entry.fields.find(f => f.id === "link")?.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Project →
                          </a>
                        )}
                        
                        {index < section.entries.length - 1 && (
                          <Separator className="mt-4 mb-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
            
            // Generic section for any other section types
            return (
              <section key={section.id}>
                <h2 className="text-xl font-normal text-gray-800 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.fields && section.fields.map((field) => (
                    <div key={field.id}>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {renderFormattedText(field.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default MinimalistTemplate;