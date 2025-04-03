import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Image as ImageIcon, 
  Type, 
  AlignLeft, 
  Download, 
  Plus, 
  Trash2, 
  MoveHorizontal,
  Save,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'

const MainFeature = () => {
  // State for invoice data
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '001',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [
      { id: 1, description: '', quantity: 1, price: 0, amount: 0 }
    ],
    notes: '',
    subtotal: 0,
    tax: 0,
    total: 0
  })

  // State for draggable elements
  const [elements, setElements] = useState([
    { id: 'header', type: 'header', content: 'INVOICE', position: { x: 20, y: 20 }, isDragging: false },
    { id: 'logo', type: 'image', src: 'https://source.unsplash.com/random/100x100?logo', position: { x: 400, y: 20 }, isDragging: false },
    { id: 'footer', type: 'footer', content: 'Thank you for your business', position: { x: 20, y: 500 }, isDragging: false }
  ])

  // Refs for drag functionality
  const dragRef = useRef(null)
  const [activeElement, setActiveElement] = useState(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  // Handle item changes
  const handleItemChange = (id, field, value) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        
        // Recalculate amount if quantity or price changes
        if (field === 'quantity' || field === 'price') {
          updatedItem.amount = updatedItem.quantity * updatedItem.price
        }
        
        return updatedItem
      }
      return item
    })
    
    // Calculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const tax = subtotal * (invoiceData.tax / 100)
    const total = subtotal + tax
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      subtotal,
      total
    })
  }

  // Add new item
  const addItem = () => {
    const newId = Math.max(0, ...invoiceData.items.map(item => item.id)) + 1
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { id: newId, description: '', quantity: 1, price: 0, amount: 0 }
      ]
    })
  }

  // Remove item
  const removeItem = (id) => {
    const updatedItems = invoiceData.items.filter(item => item.id !== id)
    
    // Recalculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const tax = subtotal * (invoiceData.tax / 100)
    const total = subtotal + tax
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      subtotal,
      total
    })
  }

  // Handle drag start
  const handleDragStart = (e, id) => {
    const element = elements.find(el => el.id === id)
    if (!element) return
    
    setActiveElement(id)
    
    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()
    
    setStartPos({
      x: e.clientX - canvasRect.left - element.position.x,
      y: e.clientY - canvasRect.top - element.position.y
    })
    
    // Update element state to show it's being dragged
    setElements(elements.map(el => 
      el.id === id ? { ...el, isDragging: true } : el
    ))
  }

  // Handle drag
  const handleDrag = (e) => {
    if (!activeElement) return
    
    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()
    
    const x = Math.max(0, Math.min(e.clientX - canvasRect.left - startPos.x, canvasRect.width - 100))
    const y = Math.max(0, Math.min(e.clientY - canvasRect.top - startPos.y, canvasRect.height - 50))
    
    setElements(elements.map(el => 
      el.id === activeElement ? { ...el, position: { x, y } } : el
    ))
  }

  // Handle drag end
  const handleDragEnd = () => {
    setActiveElement(null)
    
    // Update element state to show it's no longer being dragged
    setElements(elements.map(el => 
      el.id === activeElement ? { ...el, isDragging: false } : el
    ))
  }

  // Add new element
  const addElement = (type) => {
    const newId = `${type}-${Date.now()}`
    let newElement = {
      id: newId,
      type,
      position: { x: 50, y: 50 },
      isDragging: false
    }
    
    switch (type) {
      case 'header':
        newElement.content = 'New Header'
        break
      case 'footer':
        newElement.content = 'New Footer'
        break
      case 'image':
        newElement.src = 'https://source.unsplash.com/random/100x100?business'
        break
      default:
        break
    }
    
    setElements([...elements, newElement])
  }

  // Remove element
  const removeElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
  }

  // Update element content
  const updateElementContent = (id, content) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, content } : el
    ))
  }

  // Reset canvas
  const resetCanvas = () => {
    setElements([
      { id: 'header', type: 'header', content: 'INVOICE', position: { x: 20, y: 20 }, isDragging: false },
      { id: 'logo', type: 'image', src: 'https://source.unsplash.com/random/100x100?logo', position: { x: 400, y: 20 }, isDragging: false },
      { id: 'footer', type: 'footer', content: 'Thank you for your business', position: { x: 20, y: 500 }, isDragging: false }
    ])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar - Elements Panel */}
      <div className="lg:col-span-1">
        <div className="card p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Elements
          </h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => addElement('header')}
              className="w-full btn btn-outline flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Type size={18} />
                <span>Add Header</span>
              </div>
              <Plus size={18} />
            </button>
            
            <button 
              onClick={() => addElement('footer')}
              className="w-full btn btn-outline flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlignLeft size={18} />
                <span>Add Footer</span>
              </div>
              <Plus size={18} />
            </button>
            
            <button 
              onClick={() => addElement('image')}
              className="w-full btn btn-outline flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={18} />
                <span>Add Image</span>
              </div>
              <Plus size={18} />
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
            <button 
              onClick={resetCanvas}
              className="w-full btn btn-outline flex items-center justify-center gap-2 text-surface-600 dark:text-surface-300"
            >
              <RefreshCw size={18} />
              <span>Reset Canvas</span>
            </button>
          </div>
        </div>
        
        <div className="card p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Invoice Details
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Invoice #</label>
                <input 
                  type="text" 
                  className="input"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date" 
                  className="input"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input 
                type="date" 
                className="input"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Name</label>
              <input 
                type="text" 
                className="input"
                value={invoiceData.clientName}
                onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
                placeholder="Client name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Email</label>
              <input 
                type="email" 
                className="input"
                value={invoiceData.clientEmail}
                onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
                placeholder="client@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Address</label>
              <textarea 
                className="input min-h-[80px]"
                value={invoiceData.clientAddress}
                onChange={(e) => setInvoiceData({...invoiceData, clientAddress: e.target.value})}
                placeholder="Full address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
              <input 
                type="number" 
                className="input"
                value={invoiceData.tax}
                onChange={(e) => setInvoiceData({
                  ...invoiceData, 
                  tax: parseFloat(e.target.value) || 0,
                  total: invoiceData.subtotal + (invoiceData.subtotal * (parseFloat(e.target.value) || 0) / 100)
                })}
                min="0"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea 
                className="input min-h-[80px]"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                placeholder="Additional notes"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Center - Canvas */}
      <div className="lg:col-span-2">
        <div className="card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Invoice Preview
            </h2>
            
            <div className="flex gap-2">
              <button className="btn btn-outline flex items-center gap-2">
                <Save size={18} />
                <span>Save</span>
              </button>
              
              <button className="btn btn-primary flex items-center gap-2">
                <Download size={18} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
          
          <div 
            ref={canvasRef}
            className="bg-white border border-surface-200 rounded-lg h-[600px] relative overflow-hidden"
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {/* Draggable elements */}
            {elements.map((element) => (
              <motion.div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: element.position.x,
                  top: element.position.y,
                  zIndex: element.isDragging ? 10 : 1
                }}
                className={`draggable-element ${element.isDragging ? 'ring-2 ring-primary' : ''}`}
                animate={{ 
                  x: element.position.x,
                  y: element.position.y,
                  scale: element.isDragging ? 1.05 : 1
                }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <div 
                  className="drag-handle absolute -top-6 left-0 right-0 flex justify-center opacity-0 hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => handleDragStart(e, element.id)}
                >
                  <MoveHorizontal size={16} className="text-primary bg-white rounded-full p-1 shadow-sm" />
                </div>
                
                {element.type === 'header' && (
                  <div className="p-2 min-w-[100px] min-h-[40px]">
                    <input 
                      type="text" 
                      value={element.content}
                      onChange={(e) => updateElementContent(element.id, e.target.value)}
                      className="font-bold text-xl border-none focus:outline-none w-full bg-transparent"
                    />
                  </div>
                )}
                
                {element.type === 'footer' && (
                  <div className="p-2 min-w-[200px] min-h-[40px]">
                    <textarea 
                      value={element.content}
                      onChange={(e) => updateElementContent(element.id, e.target.value)}
                      className="text-sm border-none focus:outline-none w-full bg-transparent resize-none"
                      rows={2}
                    />
                  </div>
                )}
                
                {element.type === 'image' && (
                  <div className="p-2">
                    <img 
                      src={element.src} 
                      alt="Draggable image" 
                      className="w-[100px] h-[100px] object-cover rounded-md"
                    />
                  </div>
                )}
                
                <button 
                  className="absolute -top-6 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => removeElement(element.id)}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
            
            {/* Static invoice content */}
            <div className="absolute top-[100px] left-0 right-0 px-8">
              <div className="flex justify-between mb-8">
                <div>
                  <div className="text-sm text-surface-500">Bill To:</div>
                  <div className="font-semibold">{invoiceData.clientName || 'Client Name'}</div>
                  <div>{invoiceData.clientEmail || 'client@example.com'}</div>
                  <div className="whitespace-pre-line">{invoiceData.clientAddress || 'Client Address'}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-surface-500">Invoice Details:</div>
                  <div><span className="font-semibold">Invoice #:</span> {invoiceData.invoiceNumber}</div>
                  <div><span className="font-semibold">Date:</span> {invoiceData.date}</div>
                  <div><span className="font-semibold">Due Date:</span> {invoiceData.dueDate}</div>
                </div>
              </div>
              
              <table className="w-full border-collapse mb-8">
                <thead>
                  <tr className="border-b border-surface-300">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2 w-20">Qty</th>
                    <th className="text-right py-2 w-32">Price</th>
                    <th className="text-right py-2 w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={item.id} className="border-b border-surface-200">
                      <td className="py-2">
                        <input 
                          type="text" 
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full border-none focus:outline-none bg-transparent"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="py-2">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full border-none focus:outline-none bg-transparent text-right"
                          min="1"
                        />
                      </td>
                      <td className="py-2">
                        <input 
                          type="number" 
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full border-none focus:outline-none bg-transparent text-right"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 text-right">
                        {(item.quantity * item.price).toFixed(2)}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-red-500 opacity-50 hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button 
                onClick={addItem}
                className="mb-8 btn btn-outline py-1 px-3 text-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add Item
              </button>
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>${invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-surface-200">
                    <span>Tax ({invoiceData.tax}%):</span>
                    <span>${(invoiceData.subtotal * (invoiceData.tax / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total:</span>
                    <span>${invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-sm text-surface-500">
                {invoiceData.notes}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature