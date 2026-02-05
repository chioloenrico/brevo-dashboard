export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-light tracking-tight text-foreground">
          Brevo Dashboard
        </h1>
        <p className="text-lg text-foreground/70 font-light">
          My First Project in Next.js
           - Today is: {new Date().toLocaleDateString('it-IT')}
        </p>
      </div>
    </div>
  )
}