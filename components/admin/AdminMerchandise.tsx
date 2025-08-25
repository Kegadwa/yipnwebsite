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
import { productService, categoryService, orderService, imageService } from '../../lib/firebase-services';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>('');

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

  const [editProductForm, setEditProductForm] = useState<Product>({
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
      
      // Fetch products from Firebase
      const firebaseProducts = await productService.readAll();
      console.log('Products loaded from Firebase:', firebaseProducts);
      
      // Transform Firebase data to match our interface
      const transformedProducts: Product[] = firebaseProducts.map((product: any) => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        stock: product.stock || 0,
        imageUrl: product.imageUrl || '',
        tags: product.tags || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        variants: product.variants || [],
        createdAt: product.createdAt ? new Date(product.createdAt.toDate()) : new Date(),
        updatedAt: product.updatedAt ? new Date(product.updatedAt.toDate()) : new Date()
      }));

      // Fetch categories from Firebase
      const firebaseCategories = await categoryService.readAll();
      console.log('Categories loaded from Firebase:', firebaseCategories);
      
      const transformedCategories: Category[] = firebaseCategories.map((category: any) => ({
        id: category.id,
        name: category.name || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        isActive: category.isActive !== undefined ? category.isActive : true
      }));

      // Fetch orders from Firebase
      const firebaseOrders = await orderService.readAll();
      console.log('Orders loaded from Firebase:', firebaseOrders);
      
      const transformedOrders: Order[] = firebaseOrders.map((order: any) => ({
        id: order.id,
        productId: order.productId || '',
        productName: order.productName || '',
        quantity: order.quantity || 0,
        totalAmount: order.totalAmount || 0,
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        status: order.status || 'pending',
        orderDate: order.orderDate ? new Date(order.orderDate.toDate()) : new Date()
      }));

      setProducts(transformedProducts);
      setCategories(transformedCategories);
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
      // Set empty arrays on error
      setProducts([]);
      setCategories([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      
      let imageUrl = productForm.imageUrl;
      
      // Upload image if selected
      if (selectedImageFile) {
        imageUrl = await handleImageUpload();
      }
      
      // Prepare product data for Firebase
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        category: productForm.category,
        stock: productForm.stock,
        imageUrl: imageUrl,
        tags: productForm.tags,
        isActive: productForm.isActive,
        variants: productForm.variants
      };

      // Save to Firebase
      const productId = await productService.create(productData);
      console.log('Product created with ID:', productId);

      // Reload data to show the new product
      await loadData();

      // Close modal and reset form
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
      resetImageUpload();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      
      let imageUrl = categoryForm.imageUrl;
      
      // Upload image if selected
      if (selectedImageFile) {
        imageUrl = await handleImageUpload();
      }
      
      // Prepare category data for Firebase
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description,
        imageUrl: imageUrl,
        isActive: categoryForm.isActive
      };

      // Save to Firebase
      const categoryId = await categoryService.create(categoryData);
      console.log('Category created with ID:', categoryId);

      // Reload data to show the new category
      await loadData();

      // Close modal and reset form
      setIsAddCategoryOpen(false);
      setCategoryForm({
        name: '',
        description: '',
        imageUrl: '',
        isActive: true
      });
      resetImageUpload();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await productService.delete(id);
        console.log('Product deleted successfully');
        
        // Reload data to reflect changes
        await loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setLoading(true);
        await categoryService.delete(id);
        console.log('Category deleted successfully');
        
        // Reload data to reflect changes
        await loadData();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      tags: product.tags || [],
      isActive: product.isActive,
      variants: product.variants || []
    });
    setIsEditProductOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct?.id) return;
    
    try {
      setLoading(true);
      
      let imageUrl = editProductForm.imageUrl;
      
      // Upload new image if selected
      if (selectedImageFile) {
        imageUrl = await handleImageUpload();
      }
      
      // Prepare updated product data for Firebase
      const updatedProductData = {
        name: editProductForm.name,
        description: editProductForm.description,
        price: editProductForm.price,
        category: editProductForm.category,
        stock: editProductForm.stock,
        imageUrl: imageUrl,
        tags: editProductForm.tags,
        isActive: editProductForm.isActive,
        variants: editProductForm.variants
      };

      // Update in Firebase
      await productService.update(selectedProduct.id, updatedProductData);
      console.log('Product updated successfully');

      // Reload data to show the updated product
      await loadData();

      // Close modal and reset form
      setIsEditProductOpen(false);
      setSelectedProduct(null);
      setEditProductForm({
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
      resetImageUpload();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
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

  const handleImageSelect = (file: File) => {
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (): Promise<string> => {
    if (!selectedImageFile) {
      throw new Error('No image selected');
    }

    setUploadingImage(true);
    try {
      const fileName = imageService.generateFileName(selectedImageFile.name, 'products/');
      const imageUrl = await imageService.uploadImage(selectedImageFile, fileName);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const resetImageUpload = () => {
    setSelectedImageFile(null);
    setSelectedImagePreview('');
  };

  const renderProductsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Products</h2>
        <div className="flex space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 transition-colors"
            title="Refresh products"
          >
            <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaPlus />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
        {loading ? (
          <div className="p-8 text-center">
            <FaSpinner className="animate-spin text-2xl text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <FaBox className="text-4xl text-muted mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">No products found</p>
            <p className="text-muted-foreground">Start by adding your first product</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mr-3">
                          <FaImage className="text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{product.description}</div>
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                                {tag}
                              </span>
                            ))}
                            {product.tags.length > 2 && (
                              <span className="inline-block px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
                                +{product.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className="inline-block px-2 py-1 rounded bg-muted text-foreground text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className="font-semibold text-wellness">
                      KSh {product.price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      product.stock > 10 ? 'bg-wellness/20 text-wellness-foreground' :
                      product.stock > 0 ? 'bg-secondary/20 text-secondary-foreground' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive ? 'bg-wellness/20 text-wellness-foreground' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-primary hover:text-primary/80 p-1 rounded hover:bg-primary/10 transition-colors" 
                        title="Edit product" 
                        aria-label="Edit product"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id!)}
                        className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10 transition-colors"
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
        )}
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        <div className="flex space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 transition-colors"
            title="Refresh categories"
          >
            <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="bg-wellness hover:bg-wellness/90 text-wellness-foreground px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaPlus />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-2xl text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <FaTags className="text-4xl text-muted mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No categories found</p>
          <p className="text-muted-foreground">Start by adding your first category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-card rounded-lg shadow-md p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                <div className="flex space-x-2">
                  <button className="text-primary hover:text-primary/80 p-1 rounded hover:bg-primary/10 transition-colors" title="Edit category" aria-label="Edit category">
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id!)}
                    className="text-destructive hover:text-destructive/80 p-1 rounded hover:bg-destructive/10 transition-colors"
                    title="Delete category"
                    aria-label="Delete category"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                category.isActive ? 'bg-wellness/20 text-wellness-foreground' : 'bg-destructive/20 text-destructive'
              }`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 transition-colors"
          title="Refresh analytics"
        >
          <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/20 text-primary">
              <FaBox className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-wellness/20 text-wellness">
              <FaShoppingCart className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary/20 text-secondary">
              <FaDollarSign className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                KSh {orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent/20 text-accent">
              <FaTags className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 text-sm text-foreground">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.productName}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-foreground">KSh {order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'confirmed' ? 'bg-wellness/20 text-wellness-foreground' :
                      order.status === 'pending' ? 'bg-secondary/20 text-secondary-foreground' :
                      'bg-muted text-muted-foreground'
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
          <h1 className="text-3xl font-bold text-foreground">Manage Merchandise</h1>
          <p className="text-muted-foreground mt-2">Manage products, categories, and view analytics</p>
          {loading && (
            <div className="flex items-center space-x-2 mt-2 text-sm text-primary">
              <FaSpinner className="animate-spin" />
              <span>Loading data...</span>
            </div>
          )}
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 transition-colors"
          title="Refresh all data"
        >
          <FaSpinner className={`${loading ? 'animate-spin' : ''}`} />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card rounded-lg shadow-md border border-border">
        <div className="border-b border-border">
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
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
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
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Add New Product</h2>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
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
                    <label htmlFor="product-name" className="block text-sm font-medium text-foreground mb-2">Name *</label>
                    <input
                      id="product-name"
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-foreground mb-2">Category *</label>
                    <select
                      id="product-category"
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
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
                  <label htmlFor="product-description" className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <textarea
                    id="product-description"
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-image" className="block text-sm font-medium text-foreground mb-2">Product Image</label>
                    <div className="space-y-3">
                      {selectedImagePreview ? (
                        <div className="relative">
                          <img 
                            src={selectedImagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={resetImageUpload}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageSelect(file);
                            }}
                            className="hidden"
                          />
                          <label htmlFor="product-image" className="cursor-pointer">
                                                    <FaImage className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload image
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="product-tags" className="block text-sm font-medium text-foreground mb-2">Tags</label>
                    <input
                      id="product-tags"
                      type="text"
                      value={productForm.tags.join(', ')}
                      onChange={(e) => setProductForm(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                      }))}
                      placeholder="yoga, fitness, wellness"
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-foreground mb-2">Price *</label>
                    <input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-stock" className="block text-sm font-medium text-foreground mb-2">Stock *</label>
                    <input
                      id="product-stock"
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-active" className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      id="product-active"
                      value={productForm.isActive ? 'true' : 'false'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Variants Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Product Variants</h3>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      <FaPlus className="mr-1" />
                      Add Variant
                    </button>
                  </div>
                  
                  {productForm.variants?.map((variant, index) => (
                    <div key={variant.id} className="border border-border rounded-lg p-4 mb-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">Variant {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          title="Remove variant"
                          aria-label="Remove variant"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                            placeholder="e.g., Color, Size"
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                          <select
                            value={variant.type}
                            onChange={(e) => updateVariant(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                            aria-label="Select variant type"
                          >
                            <option value="color">Color</option>
                            <option value="size">Size</option>
                            <option value="text">Text</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Price Modifier</label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.priceModifier || 0}
                            onChange={(e) => updateVariant(index, 'priceModifier', parseFloat(e.target.value))}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-foreground">Options</label>
                          <button
                            type="button"
                            onClick={() => addVariantOption(index)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 rounded text-sm transition-colors"
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
                                className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantOption(index, optionIndex)}
                                className="text-destructive hover:text-destructive/80 transition-colors"
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

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-6 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center space-x-2"
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
          <div className="bg-card rounded-lg max-w-2xl w-full border border-border">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Add New Category</h2>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Close modal"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }} className="space-y-6">
                <div>
                  <label htmlFor="category-name" className="block text-sm font-medium text-foreground mb-2">Name *</label>
                  <input
                    id="category-name"
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category-description" className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="category-image" className="block text-sm font-medium text-foreground mb-2">Category Image</label>
                  <div className="space-y-3">
                    {selectedImagePreview ? (
                      <div className="relative">
                        <img 
                          src={selectedImagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={resetImageUpload}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-destructive/80 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted transition-colors">
                        <input
                          id="category-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageSelect(file);
                          }}
                          className="hidden"
                        />
                        <label htmlFor="category-image" className="cursor-pointer">
                          <FaImage className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload image
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="category-active" className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    id="category-active"
                    value={categoryForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-wellness focus:border-transparent bg-input text-foreground"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="px-6 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-wellness text-wellness-foreground rounded-md hover:bg-wellness/90 disabled:opacity-50 transition-colors flex items-center space-x-2"
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

      {/* Edit Product Modal */}
      {isEditProductOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Edit Product: {selectedProduct.name}</h2>
              <button
                onClick={() => {
                  setIsEditProductOpen(false);
                  setSelectedProduct(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Close modal"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-product-name" className="block text-sm font-medium text-foreground mb-2">Name *</label>
                    <input
                      id="edit-product-name"
                      type="text"
                      value={editProductForm.name}
                      onChange={(e) => setEditProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-product-category" className="block text-sm font-medium text-foreground mb-2">Category *</label>
                    <select
                      id="edit-product-category"
                      value={editProductForm.category}
                      onChange={(e) => setEditProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
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
                  <label htmlFor="edit-product-description" className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <textarea
                    id="edit-product-description"
                    value={editProductForm.description}
                    onChange={(e) => setEditProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-product-image" className="block text-sm font-medium text-foreground mb-2">Product Image</label>
                  <div className="space-y-3">
                    {selectedImagePreview ? (
                      <div className="relative">
                        <img 
                          src={selectedImagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={resetImageUpload}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-destructive/80 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : editProductForm.imageUrl ? (
                      <div className="relative">
                        <img 
                          src={editProductForm.imageUrl} 
                          alt="Current" 
                          className="w-32 h-32 object-cover rounded-lg border border-border"
                        />
                        <div className="mt-2 text-sm text-muted-foreground">Current image</div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted transition-colors">
                        <input
                          id="edit-product-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageSelect(file);
                          }}
                          className="hidden"
                        />
                        <label htmlFor="edit-product-image" className="cursor-pointer">
                          <FaImage className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload new image
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-product-tags" className="block text-sm font-medium text-foreground mb-2">Tags</label>
                    <input
                      id="edit-product-tags"
                      type="text"
                      value={editProductForm.tags.join(', ')}
                      onChange={(e) => setEditProductForm(prev => ({ 
                        ...prev, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                      }))}
                      placeholder="yoga, fitness, wellness"
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-product-stock" className="block text-sm font-medium text-foreground mb-2">Stock *</label>
                    <input
                      id="edit-product-stock"
                      type="number"
                      value={editProductForm.stock}
                      onChange={(e) => setEditProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-product-price" className="block text-sm font-medium text-foreground mb-2">Price *</label>
                    <input
                      id="edit-product-price"
                      type="number"
                      step="0.01"
                      value={editProductForm.price}
                      onChange={(e) => setEditProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-product-active" className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      id="edit-product-active"
                      value={editProductForm.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditProductForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground text-foreground"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Variants Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Product Variants</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditProductForm(prev => ({
                          ...prev,
                          variants: [...(prev.variants || []), {
                            id: Date.now().toString(),
                            name: '',
                            type: 'color',
                            options: ['']
                          }]
                        }));
                      }}
                      className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded-md text-sm"
                    >
                      <FaPlus className="mr-1" />
                      Add Variant
                    </button>
                  </div>
                  
                  {editProductForm.variants?.map((variant, index) => (
                    <div key={variant.id} className="border border-border rounded-lg p-4 mb-4 bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">Variant {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            setEditProductForm(prev => ({
                              ...prev,
                              variants: prev.variants?.filter((_, i) => i !== index) || []
                            }));
                          }}
                          className="text-destructive hover:text-destructive/80"
                          title="Remove variant"
                          aria-label="Remove variant"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => {
                              setEditProductForm(prev => ({
                                ...prev,
                                variants: prev.variants?.map((v, i) => 
                                  i === index ? { ...v, name: e.target.value } : v
                                ) || []
                              }));
                            }}
                            placeholder="e.g., Color, Size"
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                          <select
                            value={variant.type}
                            onChange={(e) => {
                              setEditProductForm(prev => ({
                                ...prev,
                                variants: prev.variants?.map((v, i) => 
                                  i === index ? { ...v, type: e.target.value as any } : v
                                ) || []
                              }));
                            }}
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                            aria-label="Select variant type"
                          >
                            <option value="color">Color</option>
                            <option value="size">Size</option>
                            <option value="text">Text</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Price Modifier</label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.priceModifier || 0}
                            onChange={(e) => {
                              setEditProductForm(prev => ({
                                ...prev,
                                variants: prev.variants?.map((v, i) => 
                                  i === index ? { ...v, priceModifier: parseFloat(e.target.value) } : v
                                ) || []
                              }));
                            }}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-foreground">Options</label>
                          <button
                            type="button"
                            onClick={() => {
                              setEditProductForm(prev => ({
                                ...prev,
                                variants: prev.variants?.map((v, i) => 
                                  i === index ? { ...v, options: [...v.options, ''] } : v
                                ) || []
                              }));
                            }}
                            className="bg-primary hover:bg-primary/80 text-primary-foreground px-2 py-1 rounded text-sm"
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
                                onChange={(e) => {
                                  setEditProductForm(prev => ({
                                    ...prev,
                                    variants: prev.variants?.map((v, i) => 
                                      i === index ? { 
                                        ...v, 
                                        options: v.options.map((opt, j) => j === optionIndex ? e.target.value : opt)
                                      } : v
                                    ) || []
                                  }));
                                }}
                                placeholder="Option value"
                                className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEditProductForm(prev => ({
                                    ...prev,
                                    variants: prev.variants?.map((v, i) => 
                                      i === index ? { 
                                        ...v, 
                                        options: v.options.filter((_, j) => j !== optionIndex) 
                                      } : v
                                    ) || []
                                  }));
                                }}
                                className="text-destructive hover:text-destructive/80"
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

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditProductOpen(false);
                      setSelectedProduct(null);
                    }}
                    className="px-6 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    <span>Update Product</span>
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
