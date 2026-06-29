import { ShieldAlert } from "lucide-react";
import { Title } from "react-head";

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Title>Account Banned - Maza3eat</Title>
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-xl text-center flex flex-col items-center">
        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          Account Suspended
        </h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Your account has been banned due to violations of our community guidelines. 
          If you believe this is a mistake, please contact support.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all shadow-lg"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
