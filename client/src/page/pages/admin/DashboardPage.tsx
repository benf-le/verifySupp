import AdminLayout from "../../../components/admin/AdminLayout.tsx";

function DashboardPage() {
    return (
        <AdminLayout>
            <div className="px-6 py-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stats Cards */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                        <p className="text-3xl font-bold text-blue-600">150</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                        <p className="text-3xl font-bold text-green-600">1,234</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">Collections</h3>
                        <p className="text-3xl font-bold text-purple-600">25</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
                        <p className="text-3xl font-bold text-yellow-600">$45,678</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default DashboardPage;
