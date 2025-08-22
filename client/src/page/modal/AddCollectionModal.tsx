import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

import { useModalHandlers } from '../../utils/modalUtils';
import { apiPost, ApiError } from '../../utils/apiUtils';
import {Collection} from "../../types/common.ts";

interface AddCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCollectionAdded: (collection: Collection) => void;
}

function AddCollectionModal({ isOpen, onClose, onCollectionAdded }: AddCollectionModalProps) {
    const [cookies] = useCookies(['AuthToken']);
    const { modalRef, handleBackdropClick } = useModalHandlers(isOpen, onClose);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên collection');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const newCollection = await apiPost<Collection>('/collections', formData, cookies.AuthToken);

            setSuccess(true);
            onCollectionAdded(newCollection);
            setFormData({ name: '', description: '' });

            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Error creating collection:', error);
            const errorMessage = error instanceof ApiError ? error.message : 'Có lỗi xảy ra khi tạo collection';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccess(false);
        setFormData({ name: '', description: '' });
        onClose();
    };

    if (!isOpen) return null;

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
                    <h2 className="text-xl font-bold">Thêm Collection Mới</h2>
                    <button onClick={handleClose} className="btn btn-sm btn-ghost" disabled={isLoading}>
                        ✕
                    </button>
                </div>

                {success && (
                    <div className="alert alert-success mb-4">
                        <span>✅ Tạo collection thành công!</span>
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

                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={handleClose} className="btn btn-outline" disabled={isLoading}>
                            Hủy
                        </button>
                        <button type="submit" className={`btn btn-primary ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Đang tạo...' : 'Tạo Collection'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCollectionModal;
