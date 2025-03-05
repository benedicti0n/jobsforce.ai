"use client"
import React, { useRef } from 'react'
import { ArrowRight, Zap, BarChart, FileText } from "lucide-react"
import { Button } from '../ui/Button'
import UploadSection from '../ui/upload-section'
import * as motion from "motion/react-client"
import Footer from '../Footer/footer'
import StepDemo from '../Demo/step-demo'

const Landingpage = () => {
    const targetRef = useRef<HTMLDivElement>(null)
    const opacity = 1;

    return (
        <div className='h-screen w-full'>
            {/* <BoxReveal>
                <p>
                    We will cook up the
                </p>
            </BoxReveal> */}
            <div className="flex min-h-screen flex-col bg-white mt-32">
                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden py-20 md:py-32">
                        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-cyan/5 to-yellow/10"></div>
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan/20 blur-3xl"></div>
                        <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-yellow/20 blur-3xl"></div>
                        <div className="container relative z-10 mx-auto px-4 md:px-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                                <div className="flex flex-col justify-center space-y-4">
                                    <div className="space-y-2">
                                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                            <span className="bg-gradient-to-r from-[#00d5ff] via-[#00d5ff] to-[#ffc900] bg-clip-text text-transparent">
                                                Transform
                                            </span>{" "}
                                            your data into{" "}
                                            <span className="bg-gradient-to-r from-[#ffc900] via-[#ffc900] to-[#00d5ff] bg-clip-text text-transparent">
                                                insights
                                            </span>
                                        </h1>
                                        <p className="max-w-[600px] text-gray-500 md:text-xl">
                                            Our platform helps you analyze and visualize your data in seconds. Upload your file and get
                                            started.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                        <Button>
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        <Button>Learn More</Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <UploadSection />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <div ref={targetRef} className="relative py-20 md:py-32">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-cyan/5 to-white"></div>
                        <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-yellow/10 blur-3xl"></div>
                        <div className="absolute bottom-1/3 left-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl"></div>

                        <motion.div style={{ opacity }} className="container relative z-10 mx-auto px-4 md:px-6 text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                How It <span className="text-cyan">Works</span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-[700px] text-gray-500">
                                Our platform simplifies data analysis in just three easy steps
                            </p>
                        </motion.div>

                        <div className="container relative z-10 mx-auto px-4 md:px-6 space-y-40 md:space-y-60">
                            <StepDemo
                                step={1}
                                title="Upload Your Data"
                                description="Simply drag and drop your file or use our secure uploader. We support CSV, Excel, JSON and more."
                                icon={<FileText className="h-12 w-12 text-cyan" />}
                                color="cyan"
                            />

                            <StepDemo
                                step={2}
                                title="Automated Analysis"
                                description="Our AI-powered engine processes your data instantly, identifying patterns and insights."
                                icon={<BarChart className="h-12 w-12 text-yellow" />}
                                color="yellow"
                            />

                            <StepDemo
                                step={3}
                                title="Get Actionable Insights"
                                description="Receive beautiful visualizations and reports that help you make data-driven decisions."
                                icon={<Zap className="h-12 w-12 text-cyan" />}
                                color="cyan"
                            />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    )
}

export default Landingpage