import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext.tsx';

function Layout() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/signin');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="shadow-md px-4 py-2">
        <div className="max-w-5xl flex flex-row justify-between items-center mx-auto">
          {/* Logo */}
          <nav className="flex flex-row font-bold text-2xl gap-1">
            <h1 className="text-black">Think</h1>
            <h1 className="text-[#8D0000]">LAB</h1>
          </nav>
          {/* Search */}
          <nav className="flex-1 max-w-md mx-4">
            <input
              type="search"
              placeholder="Find the product here"
              className="w-full px-4 py-1 bg-[#FAE5E5] placeholder:text-sm rounded"
            />
          </nav>
          {/* Auth Buttons */}
          <nav>
            <ul className="flex flex-row gap-4 items-center">
              <li className="cursor-pointer">About us</li>
              {user === null ? (
                <>
                  <li className="bg-[#8D0000] text-white px-3 py-1 rounded cursor-pointer">
                    <Link to="/signin">Sign in</Link>
                  </li>
                  <li className="bg-black text-white px-3 py-1 rounded cursor-pointer">
                    <Link to="/signup">Sign up</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="bg-black text-white px-3 py-1 rounded">Welcome, {user.name}</li>
                  <li
                    className="bg-[#8D0000] text-white px-3 py-1 rounded cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Category Menu */}
      <ul className="flex flex-row justify-center gap-16 font-semibold m-4">
        <li className="cursor-pointer">Electronics</li>
        <li className="cursor-pointer">Fashion</li>
        <li className="cursor-pointer">Sports</li>
        <li className="cursor-pointer">Vehicles</li>
      </ul>

      <Outlet />
    </div>
  );
}

export default Layout;
