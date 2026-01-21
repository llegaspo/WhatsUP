import { useState } from "react";
import { Prompt } from "next/font/google";
import { signIn } from "next-auth/react";
import { trpc } from "@/server/client";

const prompt = Prompt({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function RegisterModal({
  open,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [error, setError] = useState("");

  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const createUserMutation = trpc.user.create.useMutation({
    onSuccess: async () => {
      // const result = await signIn("credentials", {
      //   redirect: false,
      //   email,
      //   password,
      // });
      //
      // if (result?.error) {
      //   setError("Account created, but failed to auto-login.");
      // } else {
      //   onClose();
      // }
      setSuccess(true);
      setError("");

      setTimeout(() => {
        setSuccess(false);
        onSwitchToLogin();
      }, 2000);
    },
    onError: (e) => {
      setError(e.message);
    },
  });

  const onRegister = async () => {
    setError("");

    if (!fname || !lname || !username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    createUserMutation.mutate({
      fname,
      mname,
      lname,
      username,
      email,
      password,
      confirmPassword,
    });
  };

  if (!open) return null;

  const isLoading = createUserMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl outline-none ${prompt.className}`}
      >
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Account Created!
            </h2>
            <p className="text-gray-500">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={mname}
                    onChange={(e) => setMname(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222]"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#B22222] focus:outline-none focus:ring-1 focus:ring-[#B22222]"
                  />
                </div>
              </div>

              <button
                onClick={onRegister}
                disabled={isLoading}
                className="mt-2 w-full rounded-md bg-[#B22222] py-3 text-lg font-bold text-white transition-colors hover:bg-[#8B0000] focus:outline-none focus:ring-2 focus:ring-[#B22222] focus:ring-offset-2 disabled:bg-gray-400"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="font-bold text-[#B22222] hover:text-[#8B0000] hover:underline focus:outline-none"
                >
                  Sign In
                </button>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 flex-shrink-0 text-sm text-gray-500">
                  or continue with
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                onClick={() => signIn("google")}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
