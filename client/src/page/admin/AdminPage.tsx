import {useEffect, useState} from 'react';
import {useCookies} from "react-cookie";
import {Products} from "../../models/Products.ts";
import AddProductModal from "./AddProductModal.tsx";
import EditProductModal from "./EditProductModal.tsx";
import {BASE_URL} from "../../constant/appInfo.ts"; // Import EditProductModal
import AdminLayout from '../../components/admin/AdminLayout.tsx';

function AdminPage() {
    const [cookies] = useCookies(['AuthToken']);
    const [productsAdmin, setProductsAdmin] = useState<Products[]>([]);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);

    const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
    const [collections, setCollections] = useState<{[key: string]: string}>({});

    const handleProductAdded = (newProduct: Products) => {
        setProductsAdmin(prev => [...prev, newProduct]);
    };

    const handleProductUpdated = (updatedProduct: Products) => {
        setProductsAdmin(prev =>
            prev.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    const handleEditProduct = (product: Products) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = async (productId: string, productName: string) => {
        const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`);

        if (!confirmDelete) return;

        setLoadingDelete(productId);

        try {
            const response = await fetch(BASE_URL+`/products/delete-product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${cookies.AuthToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setProductsAdmin(prev => prev.filter(product => product.id !== productId));
                alert('Xóa sản phẩm thành công!');
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Không thể xóa sản phẩm');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa sản phẩm');
        } finally {
            setLoadingDelete(null);
        }
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };


    const fetchCollections = async () => {
        try {
            const response = await fetch(BASE_URL+'/collections', {
                headers: {
                    'Authorization': `Bearer ${cookies.AuthToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const collectionsData = await response.json();
                // Tạo map từ id -> name để lookup nhanh
                const collectionsMap = collectionsData.reduce((acc: {[key: string]: string}, collection: any) => {
                    acc[collection.id] = collection.name;
                    return acc;
                }, {});
                setCollections(collectionsMap);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    useEffect(() => {
        const getProductsDetail = async () => {
            try {
                const response = await fetch(BASE_URL+`/products`);
                if (response.ok) {
                    const data = await response.json();
                    setProductsAdmin(data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        getProductsDetail();
        fetchCollections();
    }, []);


    return (
        <AdminLayout>
        <div>
            <main className="flex flex-row min-h-screen bg-gray-50">
                <div className="basis-full px-6 py-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
                            <p className="text-gray-600 mt-1">Tổng cộng: {productsAdmin.length} sản phẩm</p>
                        </div>

                        <button
                            className="btn btn-primary btn-md"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm Sản Phẩm
                        </button>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left font-semibold text-gray-700">#</th>
                                    <th className="text-left font-semibold text-gray-700">Hình ảnh</th>
                                    <th className="text-left font-semibold text-gray-700">Tên sản phẩm</th>
                                    <th className="text-left font-semibold text-gray-700">Loại</th>
                                    <th className="text-left font-semibold text-gray-700">Giá</th>
                                    <th className="text-left font-semibold text-gray-700">Trạng thái</th>
                                    <th className="text-left font-semibold text-gray-700">Kho</th>
                                    <th className="text-left font-semibold text-gray-700">Mô tả</th>
                                    <th className="text-center font-semibold text-gray-700">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {productsAdmin.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-8 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h3a2 2 0 012 2v1M9 7h6" />
                                                </svg>
                                                Chưa có sản phẩm nào
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    productsAdmin.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-gray-50 border-b border-gray-100">
                                            <td className="font-medium text-gray-600">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/api/placeholder/64/64';
                                                            }}
                                                        />
                                                    ) : (
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="font-medium text-gray-800">
                                                    {truncateText(item.name, 30)}
                                                </div>
                                                {item.ingredient && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {truncateText(item.ingredient, 40)}
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                    <span className="badge badge-outline badge-sm capitalize">
                                                        {item.type}
                                                    </span>
                                            </td>

                                            <td className="font-semibold text-gray-800">
                                                {formatPrice(item.price)}
                                            </td>

                                            <td>
                                                {item.collectionId ? (
                                                    <span className="badge badge-primary badge-sm">
                                                            {collections[item.collectionId] || 'Unknown'}
                                                        </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Chưa gán</span>
                                                )}
                                            </td>

                                            <td>
                                                <div className={`badge badge-sm ${item.forSale ? 'badge-success' : 'badge-error'}`}>
                                                    {item.forSale ? 'Đang bán' : 'Ngừng bán'}
                                                </div>
                                            </td>

                                            <td>
                                                    <span className={`font-medium ${item.countInStock > 10 ? 'text-green-600' : item.countInStock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                                        {item.countInStock}
                                                    </span>
                                            </td>

                                            <td>
                                                <div className="max-w-xs">
                                                    {item.description ? (
                                                        <div className="tooltip tooltip-left" data-tip={item.description}>
                                                                <span className="text-sm text-gray-600 cursor-help">
                                                                    {truncateText(item.description, 30)}
                                                                </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Chưa có mô tả</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="flex items-center justify-center space-x-2">
                                                    {/* Edit Button */}
                                                    <button
                                                        className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        onClick={() => handleEditProduct(item)} // Pass entire product object
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        className={`btn btn-ghost btn-sm text-red-600 hover:text-red-800 hover:bg-red-50 ${loadingDelete === item.id ? 'loading' : ''}`}
                                                        onClick={() => handleDeleteProduct(item.id, item.name)}
                                                        disabled={loadingDelete === item.id}
                                                        title="Xóa"
                                                    >
                                                        {loadingDelete === item.id ? (
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
                    </div>
                </div>
            </main>

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={handleProductAdded}
            />

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onProductUpdated={handleProductUpdated}
                product={selectedProduct}
            />
        </div>
            </AdminLayout>
    );
}

export default AdminPage;
