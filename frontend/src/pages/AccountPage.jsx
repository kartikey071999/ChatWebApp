import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 border rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Account Settings</h2>
        <div className="text-center">
          <p>This page is blank for now.</p>
          <button
            onClick={() => navigate("/chat")}
            className="w-full bg-blue-600 text-white p-2 mt-4 rounded"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
