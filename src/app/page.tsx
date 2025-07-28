import { cn } from "@/lib/utils"
import { FormBuilder } from "./components/form-builder"
import Link from "next/link"
import { FileText } from "lucide-react"

export default async function Home() {
  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col relative isolate">
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1
            className={cn(
              "inline-flex tracking-tight flex-col gap-1 transition text-center",
              "font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-none lg:text-[4rem]",
              "bg-gradient-to-r from-20% bg-clip-text text-transparent",
              "from-white to-gray-50"
            )}
          >
            <span>Form Builder</span>
          </h1>
          <p className="text-[#ececf399] text-lg/7 md:text-xl/8 text-pretty sm:text-wrap sm:text-center text-center mt-4">
            Create beautiful forms with drag-and-drop ease
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center mt-6">
            <Link href="/forms">
              <button className="flex items-center space-x-2 bg-zinc-800/50 border border-zinc-700 text-white font-medium py-2 px-4 rounded-lg hover:bg-zinc-700/50 hover:border-zinc-600 transition-all duration-200">
                <FileText className="w-4 h-4" />
                <span>View My Forms</span>
              </button>
            </Link>
          </div>
        </div>
        
        <FormBuilder />
      </div>
    </main>
  )
}
