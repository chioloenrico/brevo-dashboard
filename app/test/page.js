import Counter from './conter';

export default function TestPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-foreground">
            Pagina di Test
          </h1>
          <p className="text-foreground/70">
            Questa pagina esiste su /test
          </p>
          <p className="text-sm text-foreground/50">
            Creata automaticamente grazie al file-based routing
          </p>
          <Counter />
        </div>
      </div>
    )
  }