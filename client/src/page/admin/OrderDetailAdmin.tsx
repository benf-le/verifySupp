import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import HandleOrders from "../../api/HandleOrders";
import { Order } from "../../models/Order";
import { formatDate } from "../../utils/formatUtils";
import AdminLayout from "../../components/admin/AdminLayout";
export default function OrderDetailAdminPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [cookies] = useCookies(["AuthToken"]);
  const token = cookies.AuthToken;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"pay" | "deliver" | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      if (!orderId) throw new Error("Không tìm thấy orderId");
      const data = await HandleOrders.getOrderById(orderId, token);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Không tải được đơn hàng");
    } finally {
      setLoading(false);
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (token && orderId) load();
  }, [token, orderId]);

  const doMarkPaid = async () => {
    try {
      setActionLoading("pay");
      if (!orderId) return;
      await HandleOrders.markPaid(orderId, token);
      await load();
    } catch (err: any) {
      setError(err.message || "Không cập nhật được thanh toán");
    }
  };

  const doMarkDelivered = async () => {
    try {
      setActionLoading("deliver");
      if (!orderId) return;
      await HandleOrders.markDelivered(orderId, token);
      await load();
    } catch (err: any) {
      setError(err.message || "Không cập nhật được giao hàng");
    }
  };

  if (loading) return <AdminLayout><div className="p-6">Loading...</div></AdminLayout>;
  if (error || !order) return (
    <AdminLayout>
      <div className="p-6">
        <p className="text-red-600 mb-3">{error || "Không tìm thấy đơn hàng"}</p>
        <Link to="/admin/orders" className="btn btn-outline btn-sm">Quay lại</Link>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Đơn hàng #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-600">Ngày đặt: {formatDate(order.createdAt)}</p>
        </div>
        <Link to="/admin/orders" className="btn btn-outline btn-sm">
          Quay lại
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card bg-base-100 border">
            <div className="card-body">
              <h2 className="card-title">Sản phẩm</h2>
              <div className="divider"></div>
              <div className="space-y-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <img
                      src={item.image || item.product?.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <Link to={`/products/${item.productId}`} className="font-semibold hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600">Số lượng: {item.amount}</p>
                      <p className="text-sm text-gray-600">
                        Đơn giá: ${(item.price / 100).toFixed(2)} | Thành tiền: ${((item.price / 100) * item.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border">
            <div className="card-body">
              <h2 className="card-title">Địa chỉ giao hàng</h2>
              <div className="divider"></div>
              <p className="whitespace-pre-line">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card bg-base-100 border">
            <div className="card-body space-y-2">
              <h2 className="card-title">Tóm tắt</h2>
              <div className="flex justify-between">
                <span>Tiền hàng</span>
                <span className="font-semibold">${(order.itemsPrice / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí ship</span>
                <span className="font-semibold">
                  {order.shippingPrice === 0 ? "Free" : `$${(order.shippingPrice / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng</span>
                <span>${(order.totalPrice / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border">
            <div className="card-body space-y-3">
              <h2 className="card-title">Trạng thái</h2>
              <div>
                <p className="text-sm text-gray-600">Thanh toán</p>
                {order.isPaid ? (
                  <span className="badge badge-success">Đã thanh toán</span>
                ) : (
                  <span className="badge badge-warning">Chưa thanh toán</span>
                )}
                {order.paidAt && <p className="text-xs text-gray-500">Lúc: {formatDate(order.paidAt)}</p>}
              </div>
              <div>
                <p className="text-sm text-gray-600">Giao hàng</p>
                {order.isDelivered ? (
                  <span className="badge badge-success">Đã giao</span>
                ) : (
                  <span className="badge badge-ghost">Đang xử lý</span>
                )}
                {order.deliveredAt && <p className="text-xs text-gray-500">Lúc: {formatDate(order.deliveredAt)}</p>}
              </div>

              <div className="divider"></div>
              <div className="space-y-2">
                {!order.isPaid && (
                  <button
                    className={`btn btn-primary btn-sm w-full ${actionLoading === "pay" ? "loading" : ""}`}
                    onClick={doMarkPaid}
                    disabled={actionLoading !== null}
                  >
                    Đánh dấu đã thanh toán
                  </button>
                )}
                {!order.isDelivered && (
                  <button
                    className={`btn btn-accent btn-sm w-full ${actionLoading === "deliver" ? "loading" : ""}`}
                    onClick={doMarkDelivered}
                    disabled={actionLoading !== null}
                  >
                    Đánh dấu đã giao
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}