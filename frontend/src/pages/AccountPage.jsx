import { useLocation } from "react-router-dom";

const AccountPage = () => {
  const { state } = useLocation();

  const { id, username, email } = state || {};

  if (!id || !username || !email) {
    return (
      <div className="p-6 text-red-600 text-lg">
        Invalid user data. Please go back and log in again.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Account Details</h2>
      <div className="space-y-4 text-gray-800">
        <div>
          <strong>User ID:</strong> {id}
        </div>
        <div>
          <strong>Username:</strong> {username}
        </div>
        <div>
          <strong>Email:</strong> {email}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
