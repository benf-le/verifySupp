import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useModalHandlers } from '../../utils/modalUtils';
import {ApiError, apiPatch} from '../../utils/apiUtils';
import {Collection} from "../../types/common.ts";

interface EditCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCollectionUpdated: (collection: Collection) => void;
    collection: Collection | null;
}

function EditCollectionModal({ isOpen, onClose, onCollectionUpdated, collection }: EditCollectionModalProps) {
    const [cookies] = useCookies(['AuthToken']);
    const { modalRef, handleBackdropClick } = useModalHandlers(isOpen, onClose);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (collection && isOpen) {
            setFormData({
                name: collection.name || '',
                description: collection.description || ''
            });
            setError(null);
            setSuccess(false);
        }
    }, [collection, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!collection?.id) {
            setError('Không tìm thấy ID collection');
            return;
        }

        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên collection');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const updatedCollection = await apiPatch<Collection>(
                `/collections/${collection.id}`,
                formData,
                cookies.AuthToken
            );

            setSuccess(true);
            onCollectionUpdated(updatedCollection);

            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Error updating collection:', error);
            const errorMessage = error instanceof ApiError ? error.message : 'Có lỗi xảy ra khi cập nhật collection';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccess(false);
        onClose();
    };

    if (!isOpen || !collection) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-6 w-full max-w-md m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Chỉnh Sửa Collection</h2>
                    <button onClick={handleClose} className="btn btn-sm btn-ghost" disabled={isLoading}>
                        ✕
                    </button>
                </div>

                {success && (
                    <div className="alert alert-success mb-4">
                        <span>✅ Cập nhật collection thành công!</span>
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
                            <span className="label-text font-medium">Tên collection *</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            required
                            disabled={isLoading}
                            placeholder="Nhập tên collection"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Mô tả</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered w-full"
                            rows={3}
                            disabled={isLoading}
                            placeholder="Mô tả về collection này..."
                        />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Lưu ý:</strong> Thay đổi tên collection có thể ảnh hưởng đến việc hiển thị của các sản phẩm.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={handleClose} className="btn btn-outline" disabled={isLoading}>
                            Hủy
                        </button>
                        <button type="submit" className={`btn btn-primary ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCollectionModal;
