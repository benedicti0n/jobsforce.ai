import ReactMarkdown from "react-markdown"
import {
    LinkIcon
} from "lucide-react"


const PreviewField = ({ field }) => {
    if (!field.value) return null

    if (field.type === "bullets") {
        const bullets = field.value.split("\n").filter(Boolean)
        return (
            <ul className="list-disc list-inside space-y-1">
                {bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                ))}
            </ul>
        )
    }

    if (field.type === "markdown") {
        return <ReactMarkdown>{field.value}</ReactMarkdown>
    }

    if (field.type === "url") {
        return (
            <a
                href={field.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
            >
                <LinkIcon size={14} />
                {field.value}
            </a>
        )
    }

    return <span className="text-gray-700">{field.value}</span>
}

export default PreviewField