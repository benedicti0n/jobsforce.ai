"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/Button'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FileText } from 'lucide-react'

const CircularProgress = ({ score }) => {
    const validScore = typeof score === 'number';
    const progress = validScore ? 283 - (283 * score) / 100 : 283;

    return (
        <div className="relative w-24 h-24">
            <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 120 120"
            >
                <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-current text-gray-200"
                    strokeWidth="12"
                    fill="transparent"
                />
                <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-current text-sky-500"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="314"
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-sky-600">
                    {validScore ? `${Math.round(score)}%` : '?'}
                </span>
            </div>
        </div>
    );
};

export default function MatchResume() {
    const [jobDescription, setJobDescription] = useState('')
    const [loadingResumes, setLoadingResumes] = useState(false)
    const [resumes, setResumes] = useState([])
    const [scores, setScores] = useState({})
    const [highestScoreId, setHighestScoreId] = useState(null)
    const [isCalculating, setIsCalculating] = useState(false)
    const scoresCalculatedRef = useRef(false)

    // Reuse the same fetchResumes function from SingleJobPage
    const fetchResumes = async () => {
        try {
            setLoadingResumes(true)
            const token = Cookies.get('token')
            const response = await axios.get(
                'https://api.jobsforce.ai/api/list-resume',
                { headers: { authorization: token } }
            )
            setResumes(response.data.resumes)
        } catch (error) {
            console.error('Error fetching resumes:', error)
        } finally {
            setLoadingResumes(false)
        }
    }

    const handleCalculateScores = async () => {
        if (!jobDescription.trim()) return

        setIsCalculating(true)
        scoresCalculatedRef.current = false
        await fetchResumes() // Fetch resumes when calculation is triggered
    }

    useEffect(() => {
        if (resumes.length > 0 && jobDescription.trim() && !scoresCalculatedRef.current) {
            const calculateAllScores = async () => {
                const token = Cookies.get('token')
                const newScores = {}

                for (const resume of resumes) {
                    try {
                        const response = await axios.post(
                            'https://api.jobsforce.ai/api/getmatchscorewithjobid',
                            {
                                resume_text: resume.parsedText,
                                job_description: jobDescription,
                            },
                            { headers: { 'Content-Type': 'application/json', Authorization: token } }
                        )

                        newScores[resume._id] = response.data.jobMatchScore?.match_score || 'Error'
                    } catch (error) {
                        console.error(`Error calculating score for resume ${resume._id}:`, error)
                        newScores[resume._id] = 'Error'
                    }
                }

                setScores(newScores)

                // Determine highest score
                const validScores = Object.entries(newScores).filter(([_, score]) => score !== 'Error')
                if (validScores.length > 0) {
                    const highestScore = Math.max(...validScores.map(([_, score]) => score))
                    const highestId = validScores.find(([_, score]) => score === highestScore)?.[0]
                    setHighestScoreId(highestId)
                }

                scoresCalculatedRef.current = true
                setIsCalculating(false)
            }

            calculateAllScores()
        }
    }, [resumes, jobDescription])

    const handleGenerateAIResume = () => {
        // Encode the job description and open resume edit page in new tab
        const encodedDescription = encodeURIComponent(jobDescription);
        window.open(`/resume-edit?type=bookmarked&description=${encodedDescription}`, "_blank");
    };

    return (
        <div className="container mx-auto p-6 md:pt-24 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl tracking-tighter text-center font-bold mb-4">Match Resume with Job Description</h2>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full h-48 p-4 border rounded-lg mb-4"
                    placeholder="Paste job description here..."
                />
                <div className='w-full justify-center items-center flex'>
                    <Button onClick={handleCalculateScores} disabled={isCalculating}>
                        Calculate Match Scores
                    </Button>
                </div>
            </div>

            {loadingResumes && (
                <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            )}

            {isCalculating && (
                <div className="flex justify-center p-4 items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    <span>Calculating scores...</span>
                </div>
            )}

            <div className="space-y-6 pt-8">
                {!isCalculating && Object.keys(scores).length > 0 && (
                    <div className='flex justify-center items-center gap-4 mb-4'>
                        <h2 className="text-3xl tracking-tighter font-bold text-center">
                            Scores Generated
                        </h2>
                        <Button
                            className='bg-sky-500 text-white hover:bg-sky-400'
                            onClick={handleGenerateAIResume}
                        >
                            Generate AI optimised resume
                        </Button>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resumes.map((resume) => (
                        <div
                            key={resume._id}
                            className={`h-64 p-6 border rounded-md flex flex-col justify-between ${highestScoreId === resume._id
                                ? 'bg-sky-100 border-sky-300 shadow-md'
                                : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-yellow-500" />
                                    <div>
                                        <h3 className="font-medium text-gray-800">{resume.originalName}</h3>
                                        {resume.isPrimary && (
                                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <a
                                    href={resume.s3Url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 text-sm"
                                >
                                    Preview
                                </a>
                            </div>

                            <div className="flex flex-col items-center justify-center flex-1">
                                {scores[resume._id] && (
                                    <>
                                        {scores[resume._id] === 'Error' ? (
                                            <div className="text-red-500 text-sm">Calculation Error</div>
                                        ) : (
                                            <>
                                                <CircularProgress score={scores[resume._id]} />
                                                <span className="text-sm text-gray-600 mt-2">Match Score</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            {highestScoreId === resume._id && (
                                <div className="text-center text-sm font-bold flex items-center justify-center gap-2">
                                    Best Match
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
