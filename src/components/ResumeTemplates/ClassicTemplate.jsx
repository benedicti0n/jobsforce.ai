import React from 'react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

// This is a refactored version of your existing template code
const ClassicTemplate = ({ sections, resumeRef, renderFormattedText }) => {
  // Add null checks and default values
  const personalInfo = sections[0]?.fields || [];
  const name = personalInfo.find((f) => f.id === "name")?.value || "Your Name";
  
  return (
    <ScrollArea className="h-[70vh] p-8 scroll-area">
      <div ref={resumeRef} id="resume" className="px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            {name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600">
            {personalInfo
              .filter(field => field.id !== "name" && field.value)
              .map((field) => (
                <div key={field.id} className="flex items-center">
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
                  <span className="mx-2"></span>
                </div>
              ))}
          </div>
        </div>

        {/* Content */}
        {sections.slice(1).map((section) => {
          if (!section) return null;
          
          return (
            <div key={section.id} className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide pb-1 mb-3">
                {section.title}
                {/* Updated separator to match the photo */}
                <Separator className={`mt-1 ${section.id === "education" ? "border-black border-t-2" : ""}`} />
              </h2>
              
              {/* Education Section (special layout) */}
              {section.id === "education" ? (
                <div className="space-y-3">
                  {/* Education has no entries array, just use fields directly */}
                  <div className="mb-2">
                    {/* Row 1: University (Left) | Location (Right) */}
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-800">
                        {section.fields.find((f) => f.id === "university")?.value}
                      </h3>
                      <div className="text-sm font-medium text-gray-700">
                        {section.fields.find((f) => f.id === "location")?.value}
                      </div>
                    </div>

                    {/* Row 2: Degree (Left) | Start-End Date (Right) */}
                    <div className="flex justify-between items-baseline mt-1">
                      <div className="text-sm font-medium text-gray-700">
                        {section.fields.find((f) => f.id === "degree")?.value}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {section.fields.find((f) => f.id === "Start-Month/Year-End-Month/Year")?.value}
                      </div>
                    </div>

                    {/* Row 3: Graduation Status (Left) | CGPA/Percentage (Right) */}
                    <div className="flex justify-between items-baseline mt-1">
                      <div className="text-sm text-gray-600">
                        {section.fields.find((f) => f.id === "graduation")?.value}
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        {section.fields.find((f) => f.id === "cgpa-or-percentage")?.value && 
                         `${section.fields.find((f) => f.id === "cgpa-or-percentage")?.value}`}
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    {section.fields.find((f) => f.id === "achievements")?.value && (
                      <div className="mt-2 text-sm">
                        <div className="font-medium text-sm mb-1">Achievements:</div>
                        <div className="pl-4">
                          {renderFormattedText(section.fields.find((f) => f.id === "achievements")?.value)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Non-Education Sections */
                section.isMulti ? (
                  <div className="space-y-3">
                    {section.entries.map((entry, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between items-baseline mb-1">
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {entry.fields.find((f) => f.id === "title" || f.id === "name")?.value}
                            </h3>
                            <div className="text-sm text-gray-700">
                              {entry.fields.find((f) => f.id === "company")?.value}
                              {entry.fields.find((f) => f.id === "location")?.value && (
                                <span>
                                  {" "}
                                  •{" "}
                                  {entry.fields.find((f) => f.id === "location")?.value}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 whitespace-nowrap">
                            {entry.fields.find((f) => f.id === "duration")?.value}
                          </div>
                        </div>

                        <div className="text-sm">
                          {entry.fields
                            .filter(
                              (f) =>
                                !(
                                  f.id === "title" ||
                                  f.id === "name" ||
                                  f.id === "company" ||
                                  f.id === "location" ||
                                  f.id === "duration"
                                )
                            )
                            .map((field) => (
                              <div key={field.id} className="mt-1">
                                {field.value && (
                                  <>
                                    {field.label && (
                                      <div className="font-medium text-sm">{field.label}:</div>
                                    )}
                                    {/* Apply text formatting */}
                                    <div className="text-sm">
                                      {renderFormattedText(field.value)}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                        </div>

                        {entry.fields.find(f => f.id === "link")?.value && (
                          <a 
                            href={entry.fields.find(f => f.id === "link")?.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.fields.map((field) => (
                      <div key={field.id} className="mb-3">
                        {field.value && (
                          <>
                            {field.label && (
                              <div className="font-medium text-sm mb-1.5">{field.label}:</div>
                            )}
                            {/* Apply text formatting with flex layout for skills */}
                            <div className="text-sm">
                              {field.id.includes("technical") || field.id.includes("soft") || field.id.includes("tools") ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {field.value.split('\n').map((item, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded">
                                      {item.trim().replace(/^ /, '')}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                renderFormattedText(field.value)
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ClassicTemplate;