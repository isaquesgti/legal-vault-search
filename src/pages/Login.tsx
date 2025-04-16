
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-legal-primary">Legal Vault</h1>
          <p className="mt-2 text-gray-600">Your secure document repository</p>
          <p className="mt-1 text-sm text-gray-500">
            Admin login: username <strong>admin</strong> | password <strong>admin</strong>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
