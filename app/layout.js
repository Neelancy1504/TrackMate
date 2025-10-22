import { Inter } from "next/font/google";
import Header from "../components/Header"
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One stop finace platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className}`}>
      {/* {header} */}
      <Header ></Header>

      <main className="min-h-screen">
      {children}
      </main>
      
     <Toaster richColors/>

      {/* {footer} */}
      <footer className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p> Made with ❤️ by Neelancy Shivani Salma</p>
        </div>
      </footer>

      {/* Floating Chatbot Icon */}
      <a
        href="https://chat-bot-welth.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 transition-transform hover:scale-110"
        aria-label="Open chat bot"
      >
        <img
          src="https://www.shutterstock.com/image-vector/chat-bot-icon-virtual-smart-600nw-2478937553.jpg"
          alt="Chat Bot"
          className="h-16 w-16 rounded-full shadow-lg"
        />
      </a>
      </body>
    </html>
    </ClerkProvider>
  );
}

// py - padding vertical
// bg-blue-{intensity of color}
// mx- auto -> even margin on both sides