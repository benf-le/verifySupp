import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import { Collection } from "../../models/Collections.ts";
import {apiDelete, ApiError, apiGet} from "../../utils/apiUtils.ts";
import AdminLayout from "../../components/admin/AdminLayout.tsx";
import AddCollectionModal from "../modal/AddCollectionModal.tsx";
import EditCollectionModal from "../modal/EditCollectionModal.tsx";
import {formatDate, truncateText} from "../../utils/formatUtils.ts";


function CollectionsPage() {
    const [cookies] = useCookies(['AuthToken']);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

    // Loading and filter states
    const [loadingCollections, setLoadingCollections] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCollectionAdded = (newCollection: Collection) => {
        setCollections(prev => [...prev, newCollection]);
    };

    const handleCollectionUpdated = (updatedCollection: Collection) => {
        setCollections(prev =>
            prev.map(collection =>
                collection.id === updatedCollection.id ? updatedCollection : collection
            )
        );
    };

    const handleEditCollection = (collection: Collection) => {
        setSelectedCollection(collection);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCollection(null);
    };

    const handleDeleteCollection = async (collectionId: string, collectionName: string) => {
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn xóa collection "${collectionName}"?\n\nTất cả sản phẩm trong collection này sẽ không còn thuộc về collection nào!`
        );

        if (!confirmDelete) return;

        setLoadingDelete(collectionId);

        try {
            await apiDelete(`/collections/delete/${collectionId}`, cookies.AuthToken);
            setCollections(prev => prev.filter(collection => collection.id !== collectionId));
            alert('Xóa collection thành công!');
        } catch (error) {
            console.error('Error deleting collection:', error);
            const errorMessage = error instanceof ApiError
                ? error.message
                : 'Có lỗi xảy ra khi xóa collection';
            alert(errorMessage);
        } finally {
            setLoadingDelete(null);
        }
    };

    const fetchCollections = async () => {
        setLoadingCollections(true);
        try {
            const data = await apiGet<Collection[]>('/collections', cookies.AuthToken);
            setCollections(data);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoadingCollections(false);
        }
    };

    // Filter collections based on search
    useEffect(() => {
        let filtered = collections;

        if (searchTerm) {
            filtered = filtered.filter(collection =>
                collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredCollections(filtered);
    }, [collections, searchTerm]);

    useEffect(() => {
        fetchCollections();
    }, []);

    const getCollectionStats = () => {
        const totalCollections = collections.length;
        const totalProducts = collections.reduce((sum, col) => sum + (col.productsCount || 0), 0);
        return { totalCollections, totalProducts };
    };

    const stats = getCollectionStats();

    return (
        <AdminLayout>
            <div className="px-6 py-6">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Collections</h1>
                        <p className="text-gray-600 mt-1">Tổ chức sản phẩm thành các nhóm collection</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-blue-600 font-medium">TỔNG COLLECTIONS</p>
                                <p className="text-xl font-bold text-blue-700">{stats.totalCollections}</p>
                                <p className="text-xs text-blue-500">danh mục</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-xs text-green-600 font-medium">TỔNG SẢN PHẨM</p>
                                <p className="text-xl font-bold text-green-700">{stats.totalProducts}</p>
                                <p className="text-xs text-green-500">sản phẩm</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="text-xs text-purple-600 font-medium">HIỂN THỊ</p>
                                <p className="text-xl font-bold text-purple-700">{filteredCollections.length}</p>
                                <p className="text-xs text-purple-500">kết quả</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="btn btn-outline btn-sm gap-2"
                            onClick={fetchCollections}
                            disabled={loadingCollections}
                        >
                            {loadingCollections ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            Làm mới
                        </button>

                        <button
                            className="btn btn-primary btn-md gap-2"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm Collection
                        </button>
                    </div>
                </div>

                {/* Search Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label className="label">
                                <span className="label-text text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Tìm kiếm collection
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên hoặc mô tả collection..."
                                className="input input-bordered w-full focus:input-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-600 pt-6">
                            {filteredCollections.length} / {collections.length} collections
                        </div>
                    </div>
                </div>

                {/* Collections Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loadingCollections ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="loading loading-spinner loading-md"></span>
                            <span className="ml-2 text-gray-600">Đang tải collections...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left font-semibold text-gray-700 py-4">#</th>
                                    <th className="text-left font-semibold text-gray-700">Tên Collection</th>
                                    <th className="text-left font-semibold text-gray-700">Mô tả</th>
                                    <th className="text-left font-semibold text-gray-700">Số sản phẩm</th>
                                    <th className="text-left font-semibold text-gray-700">Ngày tạo</th>
                                    <th className="text-center font-semibold text-gray-700">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCollections.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-400">
                                                    {searchTerm
                                                        ? 'Không tìm thấy collection nào phù hợp'
                                                        : 'Chưa có collection nào'
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {searchTerm
                                                        ? 'Thử thay đổi từ khóa tìm kiếm'
                                                        : 'Nhấn "Thêm Collection" để tạo collection đầu tiên'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCollections.map((collection, index) => (
                                        <tr key={collection.id} className="hover:bg-gray-50 border-b border-gray-100 transition-colors">
                                            <td className="font-medium text-gray-600 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="py-4">
                                                <div className="font-semibold text-gray-900">
                                                    {collection.name}
                                                </div>
                                            </td>

                                            <td className="py-4">
                                                    <span className="text-gray-600">
                                                        {collection.description
                                                            ? truncateText(collection.description, 50)
                                                            : <span className="text-gray-400 italic">Chưa có mô tả</span>
                                                        }
                                                    </span>
                                            </td>

                                            <td className="py-4">
                                                <div className="flex items-center space-x-2">
                                                        <span className={`badge ${
                                                            (collection.productsCount || 0) > 0
                                                                ? 'badge-primary'
                                                                : 'badge-outline'
                                                        }`}>
                                                            {collection.productsCount || 0} sản phẩm
                                                        </span>
                                                </div>
                                            </td>

                                            <td className="text-sm text-gray-600 py-4">
                                                {collection.createdAt ? formatDate(collection.createdAt) : '-'}
                                            </td>

                                            <td className="py-4">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <button
                                                        className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 tooltip tooltip-top"
                                                        data-tip="Chỉnh sửa collection"
                                                        onClick={() => handleEditCollection(collection)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        className={`btn btn-ghost btn-sm text-red-600 hover:text-red-800 hover:bg-red-50 tooltip tooltip-top ${loadingDelete === collection.id ? 'loading' : ''}`}
                                                        data-tip="Xóa collection"
                                                        onClick={() => handleDeleteCollection(collection.id, collection.name)}
                                                        disabled={loadingDelete === collection.id}
                                                    >
                                                        {loadingDelete === collection.id ? (
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

                {/* Modals */}
                <AddCollectionModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onCollectionAdded={handleCollectionAdded}
                />

                <EditCollectionModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onCollectionUpdated={handleCollectionUpdated}
                    collection={selectedCollection}
                />
            </div>
        </AdminLayout>
    );
}

export default CollectionsPage;
