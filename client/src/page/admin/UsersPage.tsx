import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {User} from "../../models/User.ts";
import {apiDelete, ApiError, apiGet} from "../../utils/apiUtils.ts";
import AdminLayout from "../../components/admin/AdminLayout.tsx";
import {formatDate, truncateText} from "../../utils/formatUtils.ts";
import EditUserModal from "../modal/EditUserModal.tsx";

function UsersPage() {
    const [cookies] = useCookies(['AuthToken']);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Loading and filter states
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUserType, setFilterUserType] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    const handleUserUpdated = (updatedUser: User) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn xóa user "${userEmail}"?\n\nHành động này không thể hoàn tác!`
        );

        if (!confirmDelete) return;

        setLoadingDelete(userId);

        try {
            await apiDelete(`/users/delete/${userId}`, cookies.AuthToken);
            setUsers(prev => prev.filter(user => user.id !== userId));
            alert('Xóa user thành công!');
        } catch (error) {
            console.error('Error deleting user:', error);
            const errorMessage = error instanceof ApiError
                ? error.message
                : 'Có lỗi xảy ra khi xóa user';
            alert(errorMessage);
        } finally {
            setLoadingDelete(null);
        }
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await apiGet<User[]>('/users', cookies.AuthToken);
            console.log('Raw API response:', data); // Debug log
            console.log('First user:', data[0]); // Check structure
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };


    // Filter users based on search and filters
    useEffect(() => {
        let filtered = users;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // User type filter
        if (filterUserType !== 'ALL') {
            filtered = filtered.filter(user => user.user_type === filterUserType);
        }

        // Status filter
        if (filterStatus !== 'ALL') {
            filtered = filtered.filter(user =>
                filterStatus === 'ACTIVE' ? user.isActive : !user.isActive
            );
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, filterUserType, filterStatus]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const getUserStats = () => {
        const totalUsers = users.length;
        const adminUsers = users.filter(u => u.user_type === 'ADMIN').length;
        const regularUsers = users.filter(u => u.user_type === 'USER').length;
        const activeUsers = users.filter(u => u.isActive).length;
        const inactiveUsers = users.filter(u => !u.isActive).length;
        return { totalUsers, adminUsers, regularUsers, activeUsers, inactiveUsers };
    };

    // Hàm hiển thị user type với icon và màu sắc
    const renderUserType = (userType: 'ADMIN' | 'USER') => {
        if (userType === 'ADMIN') {
            return (
                <div className="flex items-center space-x-2">
                    <div className="badge badge-error badge-sm gap-1 text-white font-semibold">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Administrator
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex items-center space-x-2">
                    <div className="badge badge-primary badge-sm gap-1 font-semibold">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        User
                    </div>
                </div>
            );
        }
    };

    // Hàm hiển thị status với màu sắc
    const renderStatus = (isActive: boolean) => {
        return (
            <div className={`badge badge-sm font-semibold ${
                isActive
                    ? 'badge-success gap-1'
                    : 'badge-error gap-1'
            }`}>
                <div className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-white' : 'bg-white'
                }`}></div>
                {isActive ? 'Hoạt động' : 'Tạm khóa'}
            </div>
        );
    };

    const stats = getUserStats();

    return (
        <AdminLayout>
            <div className="px-6 py-6">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Người Dùng</h1>
                        <p className="text-gray-600 mt-1">Quản lý tài khoản và phân quyền hệ thống</p>

                        {/* Enhanced Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-blue-600 font-medium">TỔNG SỐ</p>
                                <p className="text-xl font-bold text-blue-700">{stats.totalUsers}</p>
                                <p className="text-xs text-blue-500">người dùng</p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-xs text-red-600 font-medium">ADMIN</p>
                                <p className="text-xl font-bold text-red-700">{stats.adminUsers}</p>
                                <p className="text-xs text-red-500">quản trị viên</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="text-xs text-purple-600 font-medium">USER</p>
                                <p className="text-xl font-bold text-purple-700">{stats.regularUsers}</p>
                                <p className="text-xs text-purple-500">người dùng thường</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-xs text-green-600 font-medium">HOẠT ĐỘNG</p>
                                <p className="text-xl font-bold text-green-700">{stats.activeUsers}</p>
                                <p className="text-xs text-green-500">đang hoạt động</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-600 font-medium">TẠM KHÓA</p>
                                <p className="text-xl font-bold text-gray-700">{stats.inactiveUsers}</p>
                                <p className="text-xs text-gray-500">bị khóa</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="btn btn-outline btn-sm gap-2"
                            onClick={fetchUsers}
                            disabled={loadingUsers}
                        >
                            {loadingUsers ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            Làm mới
                        </button>
                    </div>
                </div>

                {/* Enhanced Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Tìm kiếm
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập email, tên hoặc số điện thoại..."
                                className="input input-bordered input-sm focus:input-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Phân quyền
                                </span>
                            </label>
                            <select
                                className="select select-bordered select-sm focus:select-primary"
                                value={filterUserType}
                                onChange={(e) => setFilterUserType(e.target.value as 'ALL' | 'USER' | 'ADMIN')}
                            >
                                <option value="ALL">Tất cả phân quyền</option>
                                <option value="ADMIN">Quản trị viên (Admin)</option>
                                <option value="USER">Người dùng thường (User)</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Trạng thái
                                </span>
                            </label>
                            <select
                                className="select select-bordered select-sm focus:select-primary"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="ACTIVE">Đang hoạt động</option>
                                <option value="INACTIVE">Tạm khóa</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-semibold text-gray-700">Kết quả</span>
                            </label>
                            <div className="bg-gray-50 p-2 rounded text-center">
                                <span className="text-lg font-bold text-primary">{filteredUsers.length}</span>
                                <span className="text-sm text-gray-600"> / {users.length}</span>
                                <div className="text-xs text-gray-500">người dùng</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loadingUsers ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="loading loading-spinner loading-md"></span>
                            <span className="ml-2 text-gray-600">Đang tải danh sách người dùng...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left font-semibold text-gray-700 py-4">#</th>
                                    <th className="text-left font-semibold text-gray-700">Avatar</th>
                                    <th className="text-left font-semibold text-gray-700">Thông tin cá nhân</th>
                                    <th className="text-left font-semibold text-gray-700">Email đăng nhập</th>
                                    <th className="text-left font-semibold text-gray-700">Phân quyền</th>
                                    <th className="text-left font-semibold text-gray-700">Trạng thái</th>
                                    <th className="text-left font-semibold text-gray-700">Ngày tạo</th>
                                    <th className="text-left font-semibold text-gray-700">Lần cuối đăng nhập</th>
                                    <th className="text-center font-semibold text-gray-700">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-400">
                                                    {searchTerm || filterUserType !== 'ALL' || filterStatus !== 'ALL'
                                                        ? 'Không tìm thấy người dùng nào phù hợp'
                                                        : 'Chưa có người dùng nào trong hệ thống'
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {searchTerm || filterUserType !== 'ALL' || filterStatus !== 'ALL'
                                                        ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                                        : 'Người dùng sẽ xuất hiện ở đây khi được tạo'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50 border-b border-gray-100 transition-colors">
                                            <td className="font-medium text-gray-600 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="py-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.email}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-bold text-lg">
                                                            {user.email.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-4">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900">
                                                        {user.firstName || user.lastName
                                                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                            : <span className="text-gray-400 italic">Chưa cập nhật tên</span>
                                                        }
                                                    </div>
                                                    {user.phoneNumber && (
                                                        <div className="text-sm text-gray-600 flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            {user.phoneNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-4">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                    <span className="text-gray-800 font-medium">
                                                        {truncateText(user.email, 30)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4">
                                                {renderUserType(user.user_type)}
                                            </td>

                                            <td className="py-4">
                                                {renderStatus(user.isActive)}
                                            </td>

                                            <td className="text-sm text-gray-600 py-4">
                                                {user.createdAt ? (
                                                    <div>
                                                        <div className="font-medium">{formatDate(user.createdAt).split(' ')[0]}</div>
                                                        <div className="text-xs text-gray-400">{formatDate(user.createdAt).split(' ').slice(1).join(' ')}</div>
                                                    </div>
                                                ) : '-'}
                                            </td>

                                            <td className="text-sm text-gray-600 py-4">
                                                {user.lastLogin ? (
                                                    <div>
                                                        <div className="font-medium">{formatDate(user.lastLogin).split(' ')[0]}</div>
                                                        <div className="text-xs text-gray-400">{formatDate(user.lastLogin).split(' ').slice(1).join(' ')}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">Chưa đăng nhập</span>
                                                )}
                                            </td>

                                            <td className="py-4">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <button
                                                        className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 tooltip tooltip-top"
                                                        data-tip="Chỉnh sửa thông tin"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        className={`btn btn-ghost btn-sm text-red-600 hover:text-red-800 hover:bg-red-50 tooltip tooltip-top ${loadingDelete === user.id ? 'loading' : ''}`}
                                                        data-tip="Xóa người dùng"
                                                        onClick={() => handleDeleteUser(user.id, user.email)}
                                                        disabled={loadingDelete === user.id}
                                                    >
                                                        {loadingDelete === user.id ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Edit User Modal */}
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onUserUpdated={handleUserUpdated}
                    user={selectedUser}
                />
            </div>
        </AdminLayout>
    );
}

export default UsersPage;
