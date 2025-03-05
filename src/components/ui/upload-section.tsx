"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, File, X, CheckCircle } from "lucide-react"
import { Button } from "./Button"

export default function UploadSection() {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [isUploaded, setIsUploaded] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0]
            setFile(droppedFile)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = () => {
        // Simulate upload
        setTimeout(() => {
            setIsUploaded(true)
        }, 1500)
    }

    const handleReset = () => {
        setFile(null)
        setIsUploaded(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
        >
            {!file ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${isDragging ? "border-cyan bg-cyan/10" : "border-gray-200"
                        }`}
                >
                    <Upload className="mb-4 h-10 w-10 text-cyan" />
                    <h3 className="mb-2 text-lg font-medium">Upload your file</h3>
                    <p className="mb-4 text-center text-sm text-gray-500">Drag and drop your file here, or click to browse</p>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".csv,.xlsx,.json"
                    />
                    <label htmlFor="file-upload">
                        <Button variant="outline" className="border-cyan/30 text-cyan/80 hover:bg-cyan/10" type="button">
                            Browse Files
                        </Button>
                    </label>
                    <p className="mt-4 text-xs text-gray-400">Supported formats: CSV, Excel, JSON</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Selected File</h3>
                        {!isUploaded && (
                            <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center rounded-lg border border-gray-200 p-3">
                        <div className="mr-3 rounded-full bg-gray-100 p-2">
                            <File className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1 truncate">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        {isUploaded && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>

                    {!isUploaded ? (
                        <Button className="w-full bg-cyan text-black hover:bg-cyan/90" onClick={handleUpload}>
                            Upload File
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <p className="text-sm font-medium">Upload successful!</p>
                            </div>
                            <Button className="w-full bg-yellow text-black hover:bg-yellow/90">View Analysis</Button>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}

