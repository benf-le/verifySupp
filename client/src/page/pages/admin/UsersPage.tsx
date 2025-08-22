import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {User} from "../../../models/User.ts";
import {apiDelete, ApiError, apiGet} from "../../../utils/apiUtils.ts";
import AdminLayout from "../../../components/admin/AdminLayout.tsx";
import {formatDate, truncateText} from "../../../utils/formatUtils.ts";

function UsersPage() {
    const [cookies] = useCookies(['AuthToken']);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Loading and filter states
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUserType, setFilterUserType] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    const handleUserAdded = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    };

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
            await apiDelete(`/users/${userId}`, cookies.AuthToken);
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
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // User type filter
        if (filterUserType !== 'ALL') {
            filtered = filtered.filter(user => user.userType === filterUserType);
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
        const adminUsers = users.filter(u => u.userType === 'ADMIN').length;
        const activeUsers = users.filter(u => u.isActive).length;
        return { totalUsers, adminUsers, activeUsers };
    };

    const stats = getUserStats();

    return (
        <AdminLayout>
            <div className="px-6 py-6">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Quản Lý User</h1>
                        <div className="flex space-x-6 mt-2">
                            <p className="text-sm text-gray-600">
                                Tổng cộng: <span className="font-semibold text-blue-600">{stats.totalUsers}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Admin: <span className="font-semibold text-purple-600">{stats.adminUsers}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Active: <span className="font-semibold text-green-600">{stats.activeUsers}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="btn btn-outline btn-sm"
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

                        <button
                            className="btn btn-primary btn-md"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm User
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-medium">Tìm kiếm</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Email hoặc tên..."
                                className="input input-bordered input-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-medium">Loại user</span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                value={filterUserType}
                                onChange={(e) => setFilterUserType(e.target.value as 'ALL' | 'USER' | 'ADMIN')}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-medium">Trạng thái</span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-sm font-medium">Hiển thị</span>
                            </label>
                            <div className="text-sm text-gray-600 pt-2">
                                {filteredUsers.length} / {users.length} users
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loadingUsers ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="loading loading-spinner loading-md"></span>
                            <span className="ml-2">Đang tải users...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left font-semibold text-gray-700">#</th>
                                    <th className="text-left font-semibold text-gray-700">Avatar</th>
                                    <th className="text-left font-semibold text-gray-700">Thông tin</th>
                                    <th className="text-left font-semibold text-gray-700">Email</th>
                                    <th className="text-left font-semibold text-gray-700">Loại</th>
                                    <th className="text-left font-semibold text-gray-700">Trạng thái</th>
                                    <th className="text-left font-semibold text-gray-700">Ngày tạo</th>
                                    <th className="text-left font-semibold text-gray-700">Lần cuối đăng nhập</th>
                                    <th className="text-center font-semibold text-gray-700">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-8 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                {searchTerm || filterUserType !== 'ALL' || filterStatus !== 'ALL'
                                                    ? 'Không tìm thấy user nào phù hợp với bộ lọc'
                                                    : 'Chưa có user nào'
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50 border-b border-gray-100">
                                            <td className="font-medium text-gray-600">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.email}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-white font-semibold text-sm">
                                                                {user.email.charAt(0).toUpperCase()}
                                                            </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <div>
                                                    <div className="font-medium text-gray-800">
                                                        {user.firstName || user.lastName
                                                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                            : 'Chưa cập nhật'
                                                        }
                                                    </div>
                                                    {user.phoneNumber && (
                                                        <div className="text-sm text-gray-500">
                                                            {user.phoneNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                    <span className="text-gray-800">
                                                        {truncateText(user.email, 30)}
                                                    </span>
                                            </td>

                                            <td>
                                                    <span className={`badge badge-sm ${
                                                        user.userType === 'ADMIN'
                                                            ? 'badge-error text-white'
                                                            : 'badge-info'
                                                    }`}>
                                                        {user.userType}
                                                    </span>
                                            </td>

                                            <td>
                                                <div className={`badge badge-sm ${
                                                    user.isActive ? 'badge-success' : 'badge-error'
                                                }`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </div>
                                            </td>

                                            <td className="text-sm text-gray-600">
                                                {user.createdAt ? formatDate(user.createdAt) : '-'}
                                            </td>

                                            <td className="text-sm text-gray-600">
                                                {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}
                                            </td>

                                            <td>
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        onClick={() => handleEditUser(user)}
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        className={`btn btn-ghost btn-sm text-red-600 hover:text-red-800 hover:bg-red-50 ${loadingDelete === user.id ? 'loading' : ''}`}
                                                        onClick={() => handleDeleteUser(user.id, user.email)}
                                                        disabled={loadingDelete === user.id}
                                                        title="Xóa"
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

                {/*/!* Modals *!/*/}
                {/*<AddUserModal*/}
                {/*    isOpen={isAddModalOpen}*/}
                {/*    onClose={() => setIsAddModalOpen(false)}*/}
                {/*    onUserAdded={handleUserAdded}*/}
                {/*/>*/}

                {/*<EditUserModal*/}
                {/*    isOpen={isEditModalOpen}*/}
                {/*    onClose={handleCloseEditModal}*/}
                {/*    onUserUpdated={handleUserUpdated}*/}
                {/*    user={selectedUser}*/}
                {/*/>*/}
            </div>
        </AdminLayout>
    );
}

export default UsersPage;
