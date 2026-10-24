import React, { useState } from 'react';
import { MerchantOrder, ScanReport } from '../../types';
import { formatINR, validateOrderForm } from '../../lib/rules';
import { Button } from '../ui/Button';
import {
  Search,
  Plus,
  X,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface OrdersViewProps {
  orders: MerchantOrder[];
  scans: ScanReport[];
  onCreateOrder: (order: {
    orderNumber: string;
    expectedAmount: number;
    expectedRecipient: string;
    customerName?: string;
    notes?: string;
  }) => void;
  onScanForOrder: (order: MerchantOrder) => void;
  onViewScan: (scan: ScanReport) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  scans,
  onCreateOrder,
  onScanForOrder,
  onViewScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'evidence_submitted' | 'matched' | 'flagged'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formOrderNumber, setFormOrderNumber] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formRecipient, setFormRecipient] = useState('cleanstore@icici');
  const [formCustomer, setFormCustomer] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.expectedRecipient.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);
    const validation = validateOrderForm(formOrderNumber, isNaN(amountVal) ? null : amountVal, formRecipient);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onCreateOrder({
      orderNumber: formOrderNumber.trim(),
      expectedAmount: amountVal,
      expectedRecipient: formRecipient.trim(),
      customerName: formCustomer.trim() || undefined,
      notes: formNotes.trim() || undefined,
    });

    setSuccessToast(`Order ${formOrderNumber.toUpperCase()} created successfully for this session.`);
    setTimeout(() => setSuccessToast(null), 4000);

    // Reset and close
    setFormOrderNumber('');
    setFormAmount('');
    setFormCustomer('');
    setFormNotes('');
    setErrors({});
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: MerchantOrder['status']) => {
    switch (status) {
      case 'matched':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Evidence Matched
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> Flagged Discrepancy
          </span>
        );
      case 'evidence_submitted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-orange-600" /> Submitted (Reviewing)
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
            Awaiting Screenshot
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders & Evidence</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cross-reference incoming payment screenshots against expected purchase amounts.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create Order
        </Button>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order number, customer name, or handle..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium cursor-pointer"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending">Awaiting Screenshot</option>
            <option value="evidence_submitted">Evidence Submitted</option>
            <option value="matched">Matched</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Expected Amount</th>
                  <th className="py-3 px-4">Expected Recipient</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Evidence Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((order) => {
                  const associatedScan = scans.find((s) => s.id === order.scanId);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                        <span className="block font-normal text-[10px] text-slate-400 mt-0.5">
                          {order.createdAt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {order.customerName || 'Anonymous Customer'}
                        {order.notes && (
                          <span className="block text-[11px] text-slate-400 truncate max-w-xs">
                            {order.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">
                        {formatINR(order.expectedAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {order.expectedRecipient}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {associatedScan ? (
                          <button
                            onClick={() => onViewScan(associatedScan)}
                            className="text-xs font-semibold text-orange-600 hover:text-orange-800 cursor-pointer inline-flex items-center gap-1"
                          >
                            View Evidence <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onScanForOrder(order)}
                            className="text-xs font-semibold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          >
                            Upload Screenshot
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No matching orders found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or filter settings, or create a new order to begin matching receipts.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              Create Demo Order
            </Button>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Create Merchant Order</h3>
                <p className="text-xs text-slate-500">Log an expected purchase for payment evidence comparison</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Order Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formOrderNumber}
                  onChange={(e) => setFormOrderNumber(e.target.value)}
                  placeholder="e.g. ORD-9821"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm text-slate-900 ${
                    errors.orderNumber
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-orange-500'
                  }`}
                />
                {errors.orderNumber && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.orderNumber}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Expected Amount (INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="2450.00"
                    className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm text-slate-900 ${
                      errors.amount
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-orange-500'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Store Recipient Handle <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formRecipient}
                  onChange={(e) => setFormRecipient(e.target.value)}
                  placeholder="cleanstore@icici"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-xs text-slate-900 ${
                    errors.recipient
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-orange-500'
                  }`}
                />
                {errors.recipient && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.recipient}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Order Items / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Cotton Kurti Set #4"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
