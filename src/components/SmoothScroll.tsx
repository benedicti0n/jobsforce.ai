"use client"
import React, { ReactNode } from 'react'
import { ReactLenis } from "@studio-freight/react-lenis"

interface SmoothScrollingProps {
    children: ReactNode;
}

const SmoothScrolling: React.FC<SmoothScrollingProps> = ({ children }) => {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {children}
        </ReactLenis>
    )
}

export default SmoothScrolling