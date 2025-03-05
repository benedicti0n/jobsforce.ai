import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan to-yellow"></div>
                            <span className="text-xl font-bold">Jobsforce.ai</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Transform your data into actionable insights with our powerful analytics platform.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-500 hover:text-cyan">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-cyan">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-gray-500 hover:text-cyan">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Guides
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-cyan">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} DataViz. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

