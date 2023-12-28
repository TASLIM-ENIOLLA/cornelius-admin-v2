"use client";

import '../styles/globals.css'

import AlertProvider from "@/ui/alert";

// export const metadata = {
//   default: "Cornelius Store Admin Dashboard",
//   description: "A web application for Cornelius Store Admins."
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Cornelius Store Admin Dashboard</title>
      </head>
      <body>
        <AlertProvider>
          { children }
        </AlertProvider>
      </body>
    </html>
  )
}
