export const addNewSection = () => {
    const newSection = {
        id: `section-${Date.now()}`,
        title: "New Section",
        icon: "📝",
        fields: [
            {
                id: `field-${Date.now()}`,
                label: "New Field",
                value: "",
                type: "text",
            },
        ],
    }
    setSections([...sections, newSection])
}

export const addField = (sectionId, entryIndex = null) => {
    const newField = {
        id: `field-${Date.now()}`,
        label: "New Field",
        value: "",
        type: "text",
        isCustomLabel: true,
    }

    setSections((prevSections) => {
        const newSections = [...prevSections]
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId)

        if (sectionIndex !== -1) {
            if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                newSections[sectionIndex].entries[entryIndex].fields.push(newField)
            } else {
                newSections[sectionIndex].fields.push(newField)
            }
        }

        return newSections
    })
}

const updateSectionTitle = (sectionId, newTitle) => {
    setSections((prevSections) =>
        prevSections.map((section) => (section.id === sectionId ? { ...section, title: newTitle } : section)),
    )
}

const addNewEntry = (sectionId) => {
    setSections((prevSections) => {
        const newSections = [...prevSections]
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId)

        if (sectionIndex !== -1 && newSections[sectionIndex].isMulti) {
            const newEntry = {
                fields: newSections[sectionIndex].entries[0].fields.map((field) => ({
                    ...field,
                    id: `field-${Date.now()}-${field.id}`,
                    value: "",
                })),
            }
            newSections[sectionIndex].entries.push(newEntry)
        }

        return newSections
    })
}

export const deleteSection = (sectionId) => {
    setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId))
}

export const deleteEntry = (sectionId, entryIndex) => {
    setSections((prevSections) => {
        const newSections = [...prevSections]
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId)

        if (sectionIndex !== -1 && newSections[sectionIndex].entries.length > 1) {
            newSections[sectionIndex].entries.splice(entryIndex, 1)
        }

        return newSections
    })
}

export const updateFieldValue = (sectionId, fieldId, value, entryIndex = null) => {
    setSections((prevSections) => {
        const newSections = [...prevSections]
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId)

        if (sectionIndex !== -1) {
            if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                const fieldIndex = newSections[sectionIndex].entries[entryIndex].fields.findIndex((f) => f.id === fieldId)
                if (fieldIndex !== -1) {
                    newSections[sectionIndex].entries[entryIndex].fields[fieldIndex].value = value
                }
            } else {
                const fieldIndex = newSections[sectionIndex].fields.findIndex((f) => f.id === fieldId)
                if (fieldIndex !== -1) {
                    newSections[sectionIndex].fields[fieldIndex].value = value
                }
            }
        }

        return newSections
    })
}

const updateFieldLabel = (sectionId, fieldId, newLabel, entryIndex = null) => {
    setSections((prevSections) => {
        const newSections = [...prevSections]
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId)

        if (sectionIndex !== -1) {
            if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                const fieldIndex = newSections[sectionIndex].entries[entryIndex].fields.findIndex((f) => f.id === fieldId)
                if (fieldIndex !== -1) {
                    newSections[sectionIndex].entries[entryIndex].fields[fieldIndex].label = newLabel
                }
            } else {
                const fieldIndex = newSections[sectionIndex].fields.findIndex((f) => f.id === fieldId)
                if (fieldIndex !== -1) {
                    newSections[sectionIndex].fields[fieldIndex].label = newLabel
                }
            }
        }

        return newSections
    })
}

export const updateFieldType = (sectionId, fieldId, newType, entryIndex = null) => {
    setSections((prevSections) => {
        const newSections = [...prevSections]
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId)

        if (sectionIndex !== -1) {
            if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                const fieldIndex = newSections[sectionIndex].entries[entryIndex].fields.findIndex((f) => f.id === fieldId)
                if (fieldIndex !== -1) {
                    newSections[sectionIndex].entries[entryIndex].fields[fieldIndex].type = newType
                }
            } else {
                const fieldIndex = newSections[sectionIndex].fields.findIndex((f) => f.id === fieldId)
                if (fieldIndex !== -1) {
                    newSections[sectionIndex].fields[fieldIndex].type = newType
                }
            }
        }

        return newSections
    })
}

export const moveSection = (dragIndex, hoverIndex) => {
    setSections((prevSections) => {
        const newSections = [...prevSections]
        const [draggedSection] = newSections.splice(dragIndex, 1)
        newSections.splice(hoverIndex, 0, draggedSection)
        return newSections
    })
}

export const downloadPDF = async () => {
    try {
        const { toPDF } = await import("react-to-pdf")
        await toPDF(resumeRef, {
            filename: "resume.pdf",
            page: {
                margin: 20,
                format: "letter",
            },
        })
    } catch (error) {
        console.error("Error generating PDF:", error)
    }
}