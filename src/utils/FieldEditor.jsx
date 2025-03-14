import { useState } from "react"
import ReactMarkdown from "react-markdown"
import {

    FileText,
    Edit2,
    List,
    Type,
    AlignLeft,
    Link,
    Mail,
    Phone,
} from "lucide-react"


const FieldEditor = ({ field, onChange, onLabelChange, onTypeChange }) => {
    const [isEditingLabel, setIsEditingLabel] = useState(false)

    const fieldTypes = [
        { type: "text", icon: Type, label: "Text" },
        { type: "textarea", icon: AlignLeft, label: "Long Text" },
        { type: "markdown", icon: FileText, label: "Markdown" },
        { type: "bullets", icon: List, label: "Bullet Points" },
        { type: "url", icon: Link, label: "URL" },
        { type: "email", icon: Mail, label: "Email" },
        { type: "tel", icon: Phone, label: "Phone" },
    ]

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                {isEditingLabel ? (
                    <input
                        type="text"
                        value={field.label}
                        onChange={(e) => onLabelChange(e.target.value)}
                        onBlur={() => setIsEditingLabel(false)}
                        className="border-b border-gray-300 focus:border-slate-500 outline-none px-1"
                        autoFocus
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{field.label}</span>
                        <button onClick={() => setIsEditingLabel(true)} className="text-gray-400 hover:text-gray-600">
                            <Edit2 size={14} />
                        </button>
                    </div>
                )}
                <select
                    value={field.type}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                    {fieldTypes.map(({ type, label }) => (
                        <option key={type} value={type}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {field.type === "bullets" ? (
                <textarea
                    value={field.value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter bullet points (one per line)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    rows={4}
                />
            ) : field.type === "markdown" ? (
                <div className="space-y-2">
                    <textarea
                        value={field.value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Enter markdown content"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                        rows={4}
                    />
                    <div className="p-2 border rounded-md bg-gray-50">
                        <ReactMarkdown>{field.value}</ReactMarkdown>
                    </div>
                </div>
            ) : (
                <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
            )}
        </div>
    )
}

export default FieldEditor