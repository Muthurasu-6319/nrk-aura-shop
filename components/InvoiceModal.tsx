
import React from 'react';
import { Order, SiteSettings } from '../types';

interface InvoiceModalProps {
  order: Order;
  settings: SiteSettings;
  onClose: () => void;
  type?: 'invoice' | 'slip';
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose, type = 'invoice' }) => {
  
  const handlePrint = () => {
    const printContent = document.getElementById('invoice-print-area');
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=900,height=900');
    if (printWindow) {
        printWindow.document.write('<html><head><title>Print Document</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet">');
        printWindow.document.write(`
            <style>
                body { font-family: "Raleway", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
                .font-serif { font-family: "Playfair Display", serif; }
                @media print {
                    @page { 
                        size: ${type === 'invoice' ? 'A4' : 'A5 landscape'}; 
                        margin: 0; 
                    }
                    body { margin: ${type === 'invoice' ? '0' : '0'}; }
                    .print-container { 
                        width: 100%; 
                        min-height: ${type === 'invoice' ? '100vh' : 'auto'};
                        box-shadow: none;
                        margin: 0;
                        border: none;
                    }
                }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 1000);
    }
  };

  // Calculate IDs
  const orderIdNum = order.id.replace(settings.orderPrefix, '');
  const invoiceId = `${settings.invoicePrefix}${orderIdNum}`;

  // Tax Calculation
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.03);

  // Is this a packing slip?
  const isSlip = type === 'slip';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Toolbar */}
        <div className="bg-brand-50 p-4 flex justify-between items-center border-b border-brand-200">
            <h3 className="font-bold text-brand-900 uppercase tracking-wider text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {isSlip ? 'Packing Slip Preview' : 'Invoice Preview'}
            </h3>
            <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-bold text-xs uppercase">Close</button>
                <button onClick={handlePrint} className="px-6 py-2 rounded-lg bg-brand-900 text-white hover:bg-brand-800 font-bold text-xs uppercase flex items-center gap-2 shadow-md">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print
                </button>
            </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
            <div id="invoice-print-area" className={`print-container bg-white mx-auto p-12 shadow-lg relative text-gray-800 ${isSlip ? 'max-w-3xl min-h-[600px]' : 'max-w-3xl min-h-[1000px]'}`}>
                
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-brand-900 pb-8 mb-8">
                    <div className="w-1/2">
                        {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" className="h-20 object-contain mb-4" />
                        ) : (
                            <h1 className="font-serif text-4xl text-brand-900 font-bold mb-2">{settings.brandName}</h1>
                        )}
                        <p className="text-xs uppercase tracking-[0.3em] text-brand-600 font-bold">{settings.brandSubtitle}</p>
                    </div>
                    <div className="text-right w-1/2">
                        <h2 className="text-4xl font-serif text-gray-200 font-bold uppercase tracking-widest mb-2">
                            {isSlip ? 'Packing Slip' : 'Invoice'}
                        </h2>
                        <p className="font-bold text-brand-900">#{isSlip ? order.id : invoiceId}</p>
                        <p className="text-sm text-gray-500">Date: {order.date}</p>
                    </div>
                </div>

                {/* Addresses */}
                <div className="flex justify-between mb-12 gap-8">
                    <div className="flex-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">From</h3>
                        <div className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                            <span className="font-bold text-brand-900 block mb-1">{settings.brandName}</span>
                            {settings.invoiceAddress}
                            <br />
                            {settings.contactEmail}
                        </div>
                    </div>
                    <div className="flex-1 text-right">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{isSlip ? 'Ship To' : 'Bill To'}</h3>
                        <div className="text-sm leading-relaxed text-gray-600">
                            <span className="font-bold text-brand-900 block mb-1">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</span>
                            {order.shippingDetails.address}<br/>
                            {order.shippingDetails.city}, {order.shippingDetails.state}<br/>
                            {order.shippingDetails.zip}<br/>
                            {order.shippingDetails.phone}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mb-8">
                    <table className="w-full mb-8">
                        <thead>
                            <tr className="bg-brand-50 text-brand-900">
                                <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-widest border-b border-brand-100">Item Description</th>
                                {isSlip && <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-widest border-b border-brand-100">SKU</th>}
                                {isSlip && <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-widest border-b border-brand-100">Weight</th>}
                                <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-widest border-b border-brand-100">Qty</th>
                                {!isSlip && <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-widest border-b border-brand-100">Price</th>}
                                {!isSlip && <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-widest border-b border-brand-100">Total</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-4 px-4">
                                        <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                        {!isSlip && <p className="text-xs text-gray-500">Ref: {item.id}</p>}
                                    </td>
                                    {isSlip && <td className="py-4 px-4 text-sm text-gray-600">{item.id}</td>}
                                    {isSlip && <td className="py-4 px-4 text-sm text-gray-600">100g</td>}
                                    <td className="py-4 px-4 text-center text-sm font-bold">{item.quantity}</td>
                                    {!isSlip && <td className="py-4 px-4 text-right text-sm">₹{item.price.toLocaleString('en-IN')}</td>}
                                    {!isSlip && <td className="py-4 px-4 text-right text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals (Only for Invoice) */}
                {!isSlip && (
                    <div className="flex justify-end mb-12">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="text-gray-800 font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Tax (3%)</span>
                                <span className="text-gray-800 font-bold">₹{tax.toLocaleString('en-IN')}</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Shipping</span>
                                <span className="text-gray-800 font-bold">Free</span>
                            </div>
                            <div className="flex justify-between text-lg border-t-2 border-brand-900 pt-3 mt-2">
                                <span className="font-serif font-bold text-brand-900">Total</span>
                                <span className="font-serif font-bold text-brand-900">₹{order.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Packing Slip Footer Area */}
                {isSlip && (
                     <div className="border-t-2 border-gray-200 pt-4 mt-12">
                         <div className="flex justify-between items-end">
                             <div className="w-1/2 border-b border-gray-300 h-12"></div>
                             <div className="w-1/3 border-b border-gray-300 h-12"></div>
                         </div>
                         <div className="flex justify-between text-xs uppercase font-bold text-gray-400 mt-2">
                             <span>Packer Signature</span>
                             <span>Date</span>
                         </div>
                     </div>
                )}

                {/* Footer */}
                <div className={`absolute bottom-12 left-12 right-12 text-center border-t border-gray-100 pt-8 ${isSlip ? 'mt-12 relative bottom-auto left-auto right-auto' : ''}`}>
                    <p className="text-brand-900 font-serif italic text-lg mb-2">Thank you for choosing {settings.brandName}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">For questions concerning this {isSlip ? 'shipment' : 'invoice'}, please contact {settings.contactEmail}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
