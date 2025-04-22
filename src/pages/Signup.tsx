
import SignupForm from "@/components/auth/SignupForm";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 
            className="text-3xl font-bold text-legal-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            JuriFinder
          </h1>
          <p className="mt-2 text-gray-600">Crie sua conta</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
