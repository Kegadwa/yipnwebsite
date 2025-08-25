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
  FaDollarSign
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    totalBlogPosts: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalEvents: 0,
    totalTickets: 0,
    ticketRevenue: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'instructor', action: 'Added new instructor', time: '2 hours ago', details: 'Zep Ouma profile updated' },
    { id: 2, type: 'blog', action: 'Published new blog post', time: '4 hours ago', details: 'Yoga for Beginners Guide' },
    { id: 3, type: 'product', action: 'Added new product', time: '1 day ago', details: 'Yoga Mat - Premium Edition' },
    { id: 4, type: 'order', action: 'New order received', time: '1 day ago', details: 'Order #1234 - $89.99' }
  ]);

  useEffect(() => {
    // Load dashboard statistics
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // TODO: Implement actual data fetching from Firebase
      // For now, using mock data
      setStats({
        totalInstructors: 2,
        totalBlogPosts: 15,
        totalProducts: 25,
        totalOrders: 156,
        totalRevenue: 12450.99,
        totalEvents: 8,
        totalTickets: 342,
        ticketRevenue: 8560.00
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
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
          title="Total Instructors"
          value={stats.totalInstructors}
          icon={FaUserTie}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Blog Posts"
          value={stats.totalBlogPosts}
          icon={FaBlog}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={FaBox}
          color="bg-purple-500"
          change={-3}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={FaDollarSign}
          color="bg-yellow-500"
          change={15}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Events"
          value={stats.totalEvents}
          icon={FaCalendarAlt}
          color="bg-indigo-500"
        />
        <StatCard
          title="Tickets Sold"
          value={stats.totalTickets}
          icon={FaChartLine}
          color="bg-pink-500"
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon={FaShoppingCart}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Add Instructor"
            description="Create new instructor profile"
            icon={FaUserTie}
            color="bg-blue-500"
            onClick={() => window.location.href = '/admin?tab=instructors'}
          />
          <QuickActionCard
            title="Write Blog Post"
            description="Create new blog content"
            icon={FaBlog}
            color="bg-green-500"
            onClick={() => window.location.href = '/admin?tab=blog'}
          />
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
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg shadow-md border border-border">
          <div className="p-6">
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
              <div className="w-3 h-3 bg-wellness rounded-full"></div>
              <span className="text-wellness font-medium">Connected</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">All services are running normally</p>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Storage Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Images & Files</span>
                <span>2.4 GB / 5 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '48%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">48% of storage used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
