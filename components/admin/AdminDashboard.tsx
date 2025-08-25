import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaNewspaper, 
  FaShoppingCart, 
  FaCalendarAlt, 
  FaChartLine, 
  FaBox,
  FaUserTie,
  FaBlog,
  FaDollarSign,
  FaSpinner,
  FaTags
} from 'react-icons/fa';
import { productService, categoryService, orderService, corsBypassService } from '../../lib/firebase-services';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    totalBlogPosts: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalEvents: 0,
    totalTickets: 0,
    ticketRevenue: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [corsStatus, setCorsStatus] = useState<string>('checking');

  useEffect(() => {
    // Load dashboard statistics
    loadDashboardStats();
    checkCORSStatus();
  }, []);

  const checkCORSStatus = async () => {
    try {
      const status = await corsBypassService.getCORSStatus();
      setCorsStatus(status);
    } catch (error) {
      console.error('Error checking CORS status:', error);
      setCorsStatus('error');
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data from Firebase
      const [products, categories, orders] = await Promise.all([
        productService.readAll(),
        categoryService.readAll(),
        orderService.readAll()
      ]);

      // Calculate statistics
      const totalProducts = products.length;
      const totalCategories = categories.length;
      const totalOrders = orders.length;
      
      // Calculate revenue from orders
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.totalAmount || 0);
      }, 0);

      // Get recent activity from the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentOrders = orders.filter(order => {
        const orderDate = order.orderDate?.toDate ? order.orderDate.toDate() : new Date(order.orderDate);
        return orderDate >= oneWeekAgo;
      });

      const recentActivityData = recentOrders.map(order => ({
        id: order.id,
        type: 'order',
        action: 'New order received',
        time: getTimeAgo(order.orderDate),
        details: `Order #${order.id.slice(-6)} - KSh ${order.totalAmount?.toLocaleString()}`
      }));

      // Add some sample activities for now (in production, you'd track all activities)
      const sampleActivities = [
        { id: '1', type: 'product', action: 'Products updated', time: '2 hours ago', details: `${totalProducts} products in catalog` },
        { id: '2', type: 'category', action: 'Categories managed', time: '4 hours ago', details: `${totalCategories} categories available` }
      ];

      setRecentActivity([...recentActivityData, ...sampleActivities]);

      setStats({
        totalInstructors: 0, // TODO: Implement instructor service
        totalBlogPosts: 0,   // TODO: Implement blog service
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        totalEvents: 0,      // TODO: Implement event service
        totalTickets: 0,     // TODO: Implement ticket service
        ticketRevenue: 0     // TODO: Implement ticket service
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: any) => {
    if (!date) return 'Unknown time';
    
    const now = new Date();
    const orderDate = date.toDate ? date.toDate() : new Date(date);
    const diffInHours = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return orderDate.toLocaleDateString();
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change !== undefined && (
            <p className={`text-sm ${change > 0 ? 'text-wellness' : 'text-destructive'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }: any) => (
    <div 
      className="bg-card rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-border"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your website.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FaBox}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={FaShoppingCart}
          color="bg-orange-500"
        />
        <StatCard
          title="Total Revenue"
          value={`KSh ${stats.totalRevenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="bg-yellow-500"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories || 0}
          icon={FaTags}
          color="bg-green-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Add Product"
            description="Create new merchandise item"
            icon={FaBox}
            color="bg-purple-500"
            onClick={() => window.location.href = '/admin?tab=merchandise'}
          />
          <QuickActionCard
            title="View Analytics"
            description="Check performance metrics"
            icon={FaChartLine}
            color="bg-yellow-500"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Manage Orders"
            description="View and process orders"
            icon={FaShoppingCart}
            color="bg-orange-500"
            onClick={() => window.location.href = '/admin?tab=merchandise'}
          />
          <QuickActionCard
            title="Refresh Data"
            description="Reload all dashboard data"
            icon={FaSpinner}
            color="bg-blue-500"
            onClick={loadDashboardStats}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg shadow-md border border-border">
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-muted rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'instructor' ? 'bg-blue-500' :
                      activity.type === 'blog' ? 'bg-green-500' :
                      activity.type === 'product' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Firebase Connection</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                corsStatus === 'working' ? 'bg-wellness' : 
                corsStatus === 'blocked' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                corsStatus === 'working' ? 'text-wellness' : 
                corsStatus === 'blocked' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {corsStatus === 'working' ? 'Connected' : 
                 corsStatus === 'blocked' ? 'Limited Access' : 'Connection Error'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {corsStatus === 'working' ? 'All services are running normally' :
               corsStatus === 'blocked' ? 'Using fallback methods for file uploads' :
               'Unable to connect to Firebase services'}
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Products</span>
                <span className="font-medium">{stats.totalProducts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Orders</span>
                <span className="font-medium">{stats.totalOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Revenue</span>
                <span className="font-medium">KSh {stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <button
                  onClick={loadDashboardStats}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
