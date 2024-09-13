import {ModeToggle} from "@/components/ui/mode-toggle";

export default function Home() {
    return <div>
        <h1 className="text-4xl font-bold text-center">Hello, world!</h1>
        <p className="text-lg text-center">This is a Next.js app with TypeScript, Tailwind CSS, and ESLint.</p>
        <ModeToggle />
    </div>
}