import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { User, UserForm } from '../../models/User.ts';
import { useModalHandlers } from '../../utils/modalUtils.ts';
import { apiPatch, ApiError } from '../../utils/apiUtils.ts';
import { ModalState } from '../../types/common.ts';
import {MODAL_CLOSE_DELAY} from "../../constant/productConstants.ts";


interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: (user: User) => void;
    user: User | null;
}

function EditUserModal({ isOpen, onClose, onUserUpdated, user }: EditUserModalProps) {
    const [cookies] = useCookies(['AuthToken']);
    const { modalRef, handleBackdropClick } = useModalHandlers(isOpen, onClose);

    const [formData, setFormData] = useState<Omit<UserForm, 'password'>>({
        email: '',
        firstName: '',
        lastName: '',
        userType: 'USER',
        isActive: true,
        phoneNumber: ''
    });

    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        isLoading: false,
        error: null,
        success: false
    });

    // Load user data when modal opens
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                userType: user.user_type || 'USER',
                isActive: user.isActive ?? true,
                phoneNumber: user.phoneNumber || ''
            });
            setModalState({
                isOpen: true,
                isLoading: false,
                error: null,
                success: false
            });
        }
    }, [user, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value
        }));
    };

    const validateForm = (): string | null => {
        if (!formData.email.trim()) {
            return 'Vui lòng nhập email';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return 'Email không hợp lệ';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            setModalState(prev => ({ ...prev, error: 'Không tìm thấy ID user' }));
            return;
        }

        const validationError = validateForm();
        if (validationError) {
            setModalState(prev => ({ ...prev, error: validationError }));
            return;
        }

        setModalState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const updatedUser = await apiPatch<User>(
                `/users/update/${user.id}`,
                formData,
                cookies.AuthToken
            );

            setModalState(prev => ({ ...prev, success: true, isLoading: false }));
            onUserUpdated(updatedUser);

            setTimeout(() => {
                setModalState(prev => ({ ...prev, success: false }));
                onClose();
            }, MODAL_CLOSE_DELAY);

        } catch (error) {
            console.error('Error updating user:', error);

            let errorMessage = 'Có lỗi xảy ra khi cập nhật user';
            if (error instanceof ApiError) {
                errorMessage = error.message;
            }

            setModalState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false
            }));
        }
    };

    const handleClose = () => {
        if (modalState.isLoading) return;
        setModalState({
            isOpen: false,
            isLoading: false,
            error: null,
            success: false
        });
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Chỉnh Sửa User</h2>
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-ghost hover:bg-gray-100"
                        disabled={modalState.isLoading}
                        title="Đóng (Esc)"
                    >
                        ✕
                    </button>
                </div>

                {modalState.success && (
                    <div className="alert alert-success mb-4">
                        <span>✅ Cập nhật user thành công!</span>
                    </div>
                )}

                {modalState.error && (
                    <div className="alert alert-error mb-4">
                        <span>❌ {modalState.error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email *</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            required
                            disabled={modalState.isLoading}
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Họ</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                disabled={modalState.isLoading}
                                placeholder="Nguyễn"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Tên</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                disabled={modalState.isLoading}
                                placeholder="Văn A"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Số điện thoại</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            disabled={modalState.isLoading}
                            placeholder="0123456789"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Loại user *</span>
                        </label>
                        <select
                            name="user_type"
                            value={formData.userType}
                            onChange={handleInputChange}
                            className="select select-bordered w-full"
                            required
                            disabled={modalState.isLoading}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="checkbox checkbox-primary"
                                disabled={modalState.isLoading}
                            />
                            <span className="label-text">Tài khoản active</span>
                        </label>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Lưu ý:</strong> Thay đổi email có thể ảnh hưởng đến việc đăng nhập của user.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-outline"
                            disabled={modalState.isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${modalState.isLoading ? 'loading' : ''}`}
                            disabled={modalState.isLoading || !cookies.AuthToken}
                        >
                            {modalState.isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUserModal;
