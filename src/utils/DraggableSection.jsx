
import { useRef } from "react"
import { motion } from "framer-motion"
import { useDrag, useDrop } from "react-dnd"


const DraggableSection = ({ id, index, moveSection, children }) => {
    const ref = useRef(null)
    const [{ isDragging }, drag] = useDrag({
        type: "SECTION",
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const [, drop] = useDrop({
        accept: "SECTION",
        hover(item, monitor) {
            if (!ref.current) return
            const dragIndex = item.index
            const hoverIndex = index
            if (dragIndex === hoverIndex) return
            moveSection(dragIndex, hoverIndex)
            item.index = hoverIndex
        },
    })

    const dragDropRef = drag(drop(ref))

    return (
        <motion.div
            ref={dragDropRef}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            layout
            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        >
            {children}
        </motion.div>
    )
}

export default DraggableSection