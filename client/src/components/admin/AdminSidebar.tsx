import  { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

interface UserInfo {
    id: string;
    email: string;
    userType: string;
    // Add other user fields as needed
}

function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies(['AuthToken']);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Get user info from token
    const getUserInfo = (): UserInfo | null => {
        try {
            if (cookies.AuthToken) {
                const decoded = jwt_decode(cookies.AuthToken) as any;
                return {
                    id: decoded.sub || decoded.id,
                    email: decoded.email,
                    userType: decoded.userType
                };
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
        return null;
    };

    const userInfo = getUserInfo();

    const menuItems = [
        {
            title: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
            path: '/admin',
            active: location.pathname === '/admin'
        },
        {
            title: 'Products',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            path: '/admin/products',
            active: location.pathname === '/admin/products'
        },
        {
            title: 'Collections',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            path: '/admin/collections',
            active: location.pathname === '/admin/collections'
        },
        {
            title: 'Users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            path: '/admin/users',
            active: location.pathname === '/admin/users'
        },
        {
            title: 'Analytics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            path: '/admin/analytics',
            active: location.pathname === '/admin/analytics'
        },
        {
            title: 'Settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            path: '/admin/settings',
            active: location.pathname === '/admin/settings'
        }
    ];

    const handleLogout = () => {
        removeCookie('AuthToken');
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/admin/profile');
        setShowProfileMenu(false);
    };

    return (
        <div className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <svg
                            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 rounded-lg transition-colors ${
                                    item.active
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                                title={isCollapsed ? item.title : ''}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium">{item.title}</span>
                                )}
                                {item.active && !isCollapsed && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-700">
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                            showProfileMenu ? 'bg-gray-700' : ''
                        }`}
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {userInfo?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
                        </div>

                        {!isCollapsed && (
                            <>
                                <div className="ml-3 flex-1 text-left">
                                    <p className="text-sm font-medium text-white truncate">
                                        {userInfo?.email || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {userInfo?.userType || 'Administrator'}
                                    </p>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform ${
                                        showProfileMenu ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileMenu && !isCollapsed && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-2">
                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                View Profile
                            </button>

                            <hr className="my-2 border-gray-600" />

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Collapsed Profile Menu */}
                    {showProfileMenu && isCollapsed && (
                        <div className="absolute bottom-full left-full ml-2 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-2 w-48">
                            <div className="px-4 py-2 border-b border-gray-600">
                                <p className="text-sm font-medium text-white">
                                    {userInfo?.email || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {userInfo?.userType || 'Administrator'}
                                </p>
                            </div>

                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                View Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminSidebar;
