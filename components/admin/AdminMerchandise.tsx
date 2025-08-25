import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaBox, 
  FaSave, 
  FaTimes,
  FaEye,
  FaSpinner,
  FaChartBar,
  FaShoppingCart,
  FaDollarSign,
  FaTags,
  FaLayerGroup
} from 'react-icons/fa';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  tags: string[];
  isActive: boolean;
  variants?: ProductVariant[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'text' | 'custom';
  options: string[];
  priceModifier?: number;
}

interface Category {
  id?: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
}

interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
}

const AdminMerchandise = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [productForm, setProductForm] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: '',
    tags: [],
    isActive: true,
    variants: []
  });

  const [categoryForm, setCategoryForm] = useState<Category>({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual Firebase fetch
      // Mock data for now
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Yoga Mat',
          description: 'High-quality yoga mat for all levels',
          price: 89.99,
          category: 'Equipment',
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          tags: ['yoga', 'mat', 'premium'],
          isActive: true,
          variants: [
            {
              id: '1',
              name: 'Color',
              type: 'color',
              options: ['Blue', 'Purple', 'Green']
            },
            {
              id: '2',
              name: 'Size',
              type: 'size',
              options: ['Standard', 'Extra Long']
            }
          ]
        }
      ];

      const mockCategories: Category[] = [
        { id: '1', name: 'Equipment', description: 'Yoga and fitness equipment', isActive: true },
        { id: '2', name: 'Clothing', description: 'Yoga and fitness apparel', isActive: true },
        { id: '3', name: 'Accessories', description: 'Yoga and fitness accessories', isActive: true }
      ];

      const mockOrders: Order[] = [
        {
          id: '1',
          productId: '1',
          productName: 'Premium Yoga Mat',
          quantity: 2,
          totalAmount: 179.98,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          status: 'confirmed',
          orderDate: new Date('2024-08-20')
        }
      ];

      setProducts(mockProducts);
      setCategories(mockCategories);
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const newProduct = { ...productForm, id: Date.now().toString() };
      setProducts(prev => [...prev, newProduct]);
      setIsAddProductOpen(false);
      setProductForm({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        imageUrl: '',
        tags: [],
        isActive: true,
        variants: []
      });
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const newCategory = { ...categoryForm, id: Date.now().toString() };
      setCategories(prev => [...prev, newCategory]);
      setIsAddCategoryOpen(false);
      setCategoryForm({
        name: '',
        description: '',
        imageUrl: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== id));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(category => category.id !== id));
    }
  };

  const addVariant = () => {
    setProductForm(prev => ({
      ...prev,
      variants: [...(prev.variants || []), {
        id: Date.now().toString(),
        name: '',
        type: 'color',
        options: ['']
      }]
    }));
  };

  const removeVariant = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index) || []
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants?.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      ) || []
    }));
  };

  const addVariantOption = (variantIndex: number) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants?.map((variant, i) => 
        i === variantIndex ? { ...variant, options: [...variant.options, ''] } : variant
      ) || []
    }));
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants?.map((variant, i) => 
        i === variantIndex ? { 
          ...variant, 
          options: variant.options.filter((_, j) => j !== optionIndex) 
        } : variant
      ) || []
    }));
  };

  const updateVariantOption = (variantIndex: number, optionIndex: number, value: string) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants?.map((variant, i) => 
        i === variantIndex ? { 
          ...variant, 
          options: variant.options.map((option, j) => j === optionIndex ? value : option)
        } : variant
      ) || []
    }));
  };

  const renderProductsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => setIsAddProductOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={product.imageUrl || '/placeholder.png'} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900" title="Edit product" aria-label="Edit product">
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id!)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete product"
                      aria-label="Delete product"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <button
          onClick={() => setIsAddCategoryOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900" title="Edit category" aria-label="Edit category">
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category.id!)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete category"
                  aria-label="Delete category"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBox className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaShoppingCart className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaDollarSign className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaTags className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.productName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Merchandise</h1>
          <p className="text-gray-600 mt-2">Manage products, categories, and view analytics</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'products', label: 'Products', icon: FaBox },
              { id: 'categories', label: 'Categories', icon: FaTags },
              { id: 'analytics', label: 'Analytics', icon: FaChartBar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'categories' && renderCategoriesTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      id="product-name"
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      id="product-category"
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      aria-label="Select product category"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    id="product-description"
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                    <input
                      id="product-stock"
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-tags" className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      id="product-tags"
                      type="text"
                      value={productForm.tags.join(', ')}
                      onChange={(e) => setProductForm(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                      }))}
                      placeholder="yoga, fitness, wellness"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Variants Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <FaPlus className="mr-1" />
                      Add Variant
                    </button>
                  </div>
                  
                  {productForm.variants?.map((variant, index) => (
                    <div key={variant.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove variant"
                          aria-label="Remove variant"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                            placeholder="e.g., Color, Size"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={variant.type}
                            onChange={(e) => updateVariant(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Select variant type"
                          >
                            <option value="color">Color</option>
                            <option value="size">Size</option>
                            <option value="text">Text</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price Modifier</label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.priceModifier || 0}
                            onChange={(e) => updateVariant(index, 'priceModifier', parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Options</label>
                          <button
                            type="button"
                            onClick={() => addVariantOption(index)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                          >
                            <FaPlus className="mr-1" />
                            Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {variant.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateVariantOption(index, optionIndex, e.target.value)}
                                placeholder="Option value"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantOption(index, optionIndex)}
                                className="text-red-600 hover:text-red-800"
                                title="Remove option"
                                aria-label="Remove option"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    <span>Add Product</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                title="Close modal"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }} className="space-y-6">
                <div>
                  <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    id="category-name"
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    <span>Add Category</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMerchandise;
