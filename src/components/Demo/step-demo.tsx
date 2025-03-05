"use client"

import { type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface StepDemoProps {
    step: number
    title: string
    description: string
    icon: ReactNode
    color: "cyan" | "yellow"
}

export default function StepDemo({ step, title, description, icon, color }: StepDemoProps) {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end center"],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
    const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

    const isEven = step % 2 === 0
    const colorClass = color === "cyan" ? "bg-[#00d5ff]" : "bg-[#ffc900]"
    const textColorClass = color === "cyan" ? "text-[#00d5ff]" : "text-[#ffc900]"

    return (
        <motion.div ref={ref} style={{ opacity, y, scale }} className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className={`flex flex-col justify-center ${isEven ? "md:order-2" : ""}`}>
                <div className="mb-4 flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colorClass} text-white`}>{step}</div>
                    <div className={`h-px flex-1 ${color === "cyan" ? "bg-cyan/30" : "bg-yellow/30"}`}></div>
                </div>
                <h3 className={`mb-2 text-2xl font-bold ${textColorClass}`}>{title}</h3>
                <p className="text-gray-500">{description}</p>
            </div>

            <div className={`flex items-center justify-center ${isEven ? "md:order-1" : ""}`}>
                <div className={`rounded-xl ${color === "cyan" ? "bg-cyan/10" : "bg-yellow/10"} p-8`}>
                    <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-md">{icon}</div>
                </div>
            </div>
        </motion.div>
    )
}

