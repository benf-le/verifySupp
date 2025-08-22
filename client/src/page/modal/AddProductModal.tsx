import React, {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie'; // Import useCookies
import { Products } from '../../models/Products.ts';
import {BASE_URL} from "../../constant/appInfo.ts";

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: (product: Products) => void;
}

interface ProductForm {
    name: string;
    imageUrl: string;
    type: string;
    price: number;
    forSale: boolean;
    countInStock: number;
    description: string;
    ingredient: string;
    collectionId: string; // Thêm collectionId
}

interface Collection {
    id: string;
    name: string;
    // Thêm các field khác nếu cần
}
function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
    const [cookies] = useCookies(['AuthToken']); // Get cookies

    const [formData, setFormData] = useState<ProductForm>({
        name: '',
        imageUrl: '',
        type: '',
        price: 0,
        forSale: true,
        countInStock: 0,
        description: '',
        ingredient: '',
        collectionId: ''
    });

    const [collections, setCollections] = useState<Collection[]>([]); // State cho collections
    const [loadingCollections, setLoadingCollections] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const productTypeOptions = [
        { value: 'box', label: 'Box (Hộp)' },
        { value: 'package', label: 'Package (Gói)' },
        { value: 'carton', label: 'Carton (Thùng)' }
    ];

    // Fetch collections khi modal mở
    useEffect(() => {
        if (isOpen) {
            fetchCollections();
        }
    }, [isOpen]);

    const fetchCollections = async () => {
        setLoadingCollections(true);
        try {
            const response = await fetch(BASE_URL+'/collections', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.AuthToken}`,
                }
            });

            if (response.ok) {
                const collectionsData = await response.json();
                setCollections(collectionsData);
            } else {
                console.error('Failed to fetch collections');
                setCollections([]); // Set empty array nếu fail
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
            setCollections([]);
        } finally {
            setLoadingCollections(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : type === 'number'
                    ? parseFloat(value) || 0
                    : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Get access token from cookies
            const accessToken = cookies.AuthToken;

            if (!accessToken) {
                throw new Error('Không tìm thấy access token. Vui lòng đăng nhập lại.');
            }

            console.log('Sending request with token:', accessToken); // Debug log

            const response = await fetch(BASE_URL+'/products/create-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Send Bearer token
                },
                body: JSON.stringify(formData)
            });

            // Handle specific error status codes
            if (response.status === 401) {
                throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
            }

            if (response.status === 403) {
                throw new Error('Tài khoản không có quyền Admin để thêm sản phẩm.');
            }

            if (!response.ok) {
                // Try to get error message from response
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            const newProduct = await response.json();
            console.log('Product created successfully:', newProduct); // Debug log

            setSuccess(true);
            onProductAdded(newProduct);

            // Reset form
            setFormData({
                name: '',
                imageUrl: '',
                type: '',
                price: 0,
                forSale: true,
                countInStock: 0,
                description: '',
                ingredient: '',
                collectionId: ''
            });

            // Close modal after 1.5 seconds
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Error creating product:', error);
            setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    // @ts-ignore
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Thêm Sản Phẩm Mới</h2>
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-ghost"
                        disabled={isLoading}
                    >
                        ✕
                    </button>
                </div>

                {/*/!* Debug info - có thể xóa sau khi test xong *!/*/}
                {/*{process.env.NODE_ENV === 'development' && (*/}
                {/*    <div className="mb-4 p-2 bg-gray-100 rounded text-xs">*/}
                {/*        <strong>Debug:</strong> Token available: {cookies.AuthToken ? '✅' : '❌'}*/}
                {/*    </div>*/}
                {/*)}*/}


                {success && (
                    <div className="alert alert-success mb-4">
                        <span>Tạo sản phẩm thành công!</span>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>❌ {error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Tên sản phẩm *</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            required
                            disabled={isLoading}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Link hình ảnh</span>
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            disabled={isLoading}
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded border"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Loại sản phẩm *</span>
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="select select-bordered w-full"
                            required
                            disabled={isLoading}
                        >
                            <option value="" disabled>
                                Chọn loại sản phẩm
                            </option>
                            {productTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Giá (VNĐ) *</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="0"
                            // step="1000"
                            required
                            disabled={isLoading}
                            placeholder="50000"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                name="forSale"
                                checked={formData.forSale}
                                onChange={handleInputChange}
                                className="checkbox checkbox-primary"
                                disabled={isLoading}
                            />
                            <span className="label-text">Đang bán</span>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Số lượng trong kho *</span>
                        </label>
                        <input
                            type="number"
                            name="countInStock"
                            value={formData.countInStock}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            min="0"
                            required
                            disabled={isLoading}
                            placeholder="100"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Collection *</span>
                        </label>
                        <select
                            name="collectionId"
                            value={formData.collectionId}
                            onChange={handleInputChange}
                            className="select select-bordered w-full"
                            required
                            disabled={isLoading || loadingCollections}
                        >
                            <option value="" disabled>
                                {loadingCollections ? 'Đang tải collections...' : 'Chọn collection'}
                            </option>
                            {collections.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                        {collections.length === 0 && !loadingCollections && (
                            <div className="label">
                <span className="label-text-alt text-warning">
                  ⚠️ Không có collection nào. Vui lòng tạo collection trước.
                </span>
                            </div>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Mô tả sản phẩm</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered w-full"
                            rows={3}
                            disabled={isLoading}
                            placeholder="Mô tả chi tiết về sản phẩm..."
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Thành phần</span>
                        </label>
                        <textarea
                            name="ingredient"
                            value={formData.ingredient}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered w-full"
                            rows={3}
                            disabled={isLoading}
                            placeholder="Liệt kê các thành phần của sản phẩm..."
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-outline"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading || !cookies.AuthToken} // Sử dụng AuthToken thay vì accessToken
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu'}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;
