import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // title: "ChatBOK - AI Chatbot",
  // applicationName: "SQL Agent Chatbot",
  // description: "A customize SQL Agent Chatbot that can help you to query your database with natural language",
  // authors: [{name:"Khanh Nguyen"}],
  title: "Virbrix - AI Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
