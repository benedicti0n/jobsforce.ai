import type { Metadata } from "next";
import { ReactLenis } from "@/lib/lenis";
import "./globals.css";
import { ThemeProvider } from "@/components/Homepage/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navbar1 } from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Ensure environment variable exists
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in .env.local");
  }

  return (
    <html lang="en">
      <ReactLenis root>
        <body>
          <GoogleOAuthProvider clientId={clientId}>
            <ThemeProvider>
              <Navbar1 />
              {children}
            </ThemeProvider>
          </GoogleOAuthProvider>
        </body>
      </ReactLenis>
    </html>
  );
}
