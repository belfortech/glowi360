// pages/Orders.tsx - SIMPLIFIED LIST WITH EXPANDABLE DETAILS - COMPLETE
import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Eye,
  Download,
  Truck,
  MapPin,
  Phone,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  User,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders, useCancelOrder } from '../hooks/orderServiceApi';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import { Order } from '../types/api';

const canCancelOrder = (order: Order) => {
  return order.status === 'pending' || order.status === 'processing';
};

const Orders: React.FC = () => {
  const { data: orders = [], isLoading, refetch, error } = useOrders();
  const cancelOrderMutation = useCancelOrder();
  const navigate = useNavigate();

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });

  React.useEffect(() => {
    let filtered = orders;

    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
          item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        order.delivery_full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'KSh ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'PENDING CONFIRMATION' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'WAITING TO BE SHIPPED' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'DELIVERED' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'CANCELLED' }
    };
    
    const badge = badges[status as keyof typeof badges] || badges.pending;
    
    return (
      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderMutation.mutateAsync(orderId);
      setToast({
        show: true,
        message: 'Order cancelled successfully',
        type: 'success'
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to cancel order',
        type: 'error'
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setToast({
        show: true,
        message: 'Orders refreshed successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to refresh orders',
        type: 'error'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-grey">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-secondary mb-4">Failed to Load Orders</h1>
          <p className="text-grey mb-6">There was an error loading your orders. Please try again.</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
              <p className="text-gray-600 mt-1">Track and manage your medication orders</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{orderStats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{orderStats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-xl font-bold text-blue-600">{orderStats.processing}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl font-bold text-green-600">{orderStats.delivered}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-xl font-bold text-red-600">{orderStats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, product name, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white min-w-[180px]"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Simplified Orders List */}
        <div className="space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.order_id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Simplified Order Row */}
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrderExpansion(order.order_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.order_id}</h3>
                        <p className="text-sm text-gray-500">Placed on {formatDateOnly(order.created_at)}</p>
                        <div className="mt-1">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatPrice(order.total_amount)}</p>
                        <p className="text-sm text-gray-500">{order.total_items} item{order.total_items > 1 ? 's' : ''}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order);
                          }}
                          className="bg-[#D4AF37] hover:bg-[#d14925] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Track Order
                        </button>
                        
                        {expandedOrders.has(order.order_id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrders.has(order.order_id) && (
                  <div className="border-t bg-gray-50">
                    <div className="p-6">
                      {/* Items in Order */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-4">ITEMS IN YOUR ORDER</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.order_item_id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 text-sm">{item.product_name}</h5>
                                  <p className="text-sm text-gray-500">QTY: {item.quantity}</p>
                                  <p className="text-sm font-medium text-gray-900">{formatPrice(item.product_price)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatPrice(item.subtotal)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment and Delivery Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Payment Information */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">PAYMENT INFORMATION</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Payment Method</span>
                              <span className="text-gray-900">Pay on delivery</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items total:</span>
                                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fees:</span>
                                <span className="text-gray-900">{formatPrice(order.delivery_fee)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-base pt-1 border-t">
                                <span className="text-gray-900">Total:</span>
                                <span className="text-gray-900">{formatPrice(order.total_amount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Delivery Information */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">DELIVERY INFORMATION</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Delivery Method</span>
                              <span className="text-gray-900">{order.delivery_option.name}</span>
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-600 mb-1">Delivery Address</p>
                              <div className="text-gray-900">
                                <p className="font-medium">{order.delivery_full_name}</p>
                                <p>{order.delivery_address_line_1}</p>
                                <p>{order.delivery_city}, {order.delivery_county}</p>
                                <p>{order.delivery_phone_number}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3">
                        {canCancelOrder(order) && (
                          <button
                            onClick={() => handleCancelOrder(order.order_id)}
                            disabled={cancelOrderMutation.isPending}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : "You haven't placed any orders yet"
                }
              </p>
              {searchQuery || statusFilter !== 'all' ? (
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={() => navigate('/products')} className="bg-[#D4AF37] hover:bg-[#d14925]">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/products')} className="bg-[#D4AF37] hover:bg-[#d14925]">
                  Start Shopping
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Track Order Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title="Track Your Order"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedOrder.order_id}</h3>
                  <p className="text-gray-600">Placed on {formatDateOnly(selectedOrder.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{formatPrice(selectedOrder.total_amount)}</p>
                <p className="text-gray-600">{selectedOrder.total_items} items</p>
              </div>
            </div>

            {/* Enhanced Order Timeline */}
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Order Progress</h4>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {/* Order Placed */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold inline-block">
                        ORDER PLACED
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                  </div>

                  {/* Pending Confirmation */}
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                      selectedOrder.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className={`px-3 py-1 rounded text-sm font-semibold inline-block ${
                        selectedOrder.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        PENDING CONFIRMATION
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedOrder.confirmed_at ? formatDate(selectedOrder.confirmed_at) : 'Awaiting confirmation'}
                      </p>
                    </div>
                  </div>

                  {/* Processing */}
                  {(selectedOrder.status === 'processing' || selectedOrder.status === 'delivered') && (
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                        selectedOrder.status === 'processing' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {selectedOrder.status === 'processing' ? (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div className={`px-3 py-1 rounded text-sm font-semibold inline-block ${
                          selectedOrder.status === 'processing' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          WAITING TO BE SHIPPED
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Your order has been confirmed and is now in the process of being prepared for 
                          shipment. Once your order is shipped, we will notify you promptly.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Delivered */}
                  {selectedOrder.delivered_at && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold inline-block">
                          DELIVERED
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(selectedOrder.delivered_at)}</p>
                      </div>
                    </div>
                  )}

                  {/* Cancelled */}
                  {selectedOrder.status === 'cancelled' && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center relative z-10">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold inline-block">
                          CANCELLED
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Order was cancelled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Order Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <span className="ml-2 font-medium">{selectedOrder.order_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="ml-2 font-medium">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="ml-2 font-medium capitalize">{selectedOrder.payment_status}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Delivery Method:</span>
                    <span className="ml-2 font-medium">{selectedOrder.delivery_option.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Items Ordered ({selectedOrder.items.length})</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedOrder.items.map((item) => (
                  <div key={item.order_item_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.product_price)} x {item.quantity}
                        </p>
                        {item.product_original_price && item.product_original_price !== item.product_price && (
                          <p className="text-sm text-gray-500 line-through">
                            Original: {formatPrice(item.product_original_price)}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Delivery Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Delivery Address</h5>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.delivery_full_name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.delivery_phone_number}</p>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.delivery_address_line_1}
                      {selectedOrder.delivery_address_line_2 && `, ${selectedOrder.delivery_address_line_2}`}
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.delivery_city}, {selectedOrder.delivery_county}
                      {selectedOrder.delivery_postal_code && ` ${selectedOrder.delivery_postal_code}`}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Delivery Method</h5>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{selectedOrder.delivery_option.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.delivery_option.description}</p>
                    <p className="text-sm text-gray-600">Fee: {formatPrice(selectedOrder.delivery_fee)}</p>
                    <p className="text-sm text-gray-600">Estimated: {selectedOrder.estimated_delivery_time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {selectedOrder.special_instructions && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Special Instructions</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{selectedOrder.special_instructions}</p>
                </div>
              </div>
            )}

            {/* Prescription Info */}
            {selectedOrder.prescription_required && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Prescription Information</h4>
                <div className={`p-4 rounded-lg ${
                  selectedOrder.prescription_uploaded ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedOrder.prescription_uploaded ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    <p className={`text-sm font-medium ${
                      selectedOrder.prescription_uploaded ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {selectedOrder.prescription_uploaded 
                        ? 'Prescription has been uploaded and verified'
                        : 'Prescription required - Please upload your prescription'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Totals */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium">{formatPrice(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-[#D4AF37]">{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              {canCancelOrder(selectedOrder) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCancelOrder(selectedOrder.order_id);
                    setShowOrderModal(false);
                  }}
                  disabled={cancelOrderMutation.isPending}
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowOrderModal(false)}
                className="ml-auto"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Orders;