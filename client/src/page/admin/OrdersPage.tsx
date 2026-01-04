import { useEffect, useState, useMemo } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import HandleOrders from "../../api/HandleOrders";
import { Order } from "../../models/Order";
import { formatDate } from "../../utils/formatUtils";
import AdminLayout from "../../components/admin/AdminLayout";
export default function OrdersPage() {
  const [cookies] = useCookies(["AuthToken"]);
  const token = cookies.AuthToken;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid" | "delivered" | "processing">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await HandleOrders.getAllOrders(token);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Không tải được danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "paid") return o.isPaid;
      if (statusFilter === "unpaid") return !o.isPaid;
      if (statusFilter === "delivered") return o.isDelivered;
      if (statusFilter === "processing") return !o.isDelivered;
      return true;
    });
  }, [orders, statusFilter]);

  if (loading) return <AdminLayout><div className="p-6">Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-6 text-red-600">{error}</div></AdminLayout>;

  return (
    <AdminLayout>
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold">Quản lý đơn hàng</h1>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Tất cả</option>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
          <option value="delivered">Đã giao</option>
          <option value="processing">Đang xử lý</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách</th>
              <th>Ngày đặt</th>
              <th>Thanh toán</th>
              <th>Giao hàng</th>
              <th>Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td className="font-mono text-sm">{o.id.toUpperCase()}</td>
                <td>{o.user?.email || o.userId}</td>
                <td>{formatDate(o.createdAt)}</td>
                <td>
                  {o.isPaid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Unpaid</span>}
                </td>
                <td>
                  {o.isDelivered ? (
                    <span className="badge badge-success">Delivered</span>
                  ) : (
                    <span className="badge badge-ghost">Processing</span>
                  )}
                </td>
                <td className="font-semibold">${o.totalPrice }</td>
                <td>
                  <Link to={`/admin/orders/${o.id}`} className="btn btn-sm btn-primary">
                    Xem
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Không có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );    
}