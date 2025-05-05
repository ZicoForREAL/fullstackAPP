import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-gradient-to-r from-red-500 to-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-white">
                FitCoach
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <span className="text-white mr-4">
                  Welcome, {user?.name}
                </span>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'coach' && (
                  <Link
                    to="/coach"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'client' && (
                  <Link
                    to="/client"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-white text-red-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 bg-white text-red-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
