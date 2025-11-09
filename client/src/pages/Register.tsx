import RegisterForm from '../components/register-form.tsx';

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background to-slate-50 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us today and get started</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
