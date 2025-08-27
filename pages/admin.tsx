import React, { useState, useEffect } from "react";
import { 
  FaChartBar, 
  FaBox, 
  FaUsers, 
  FaNewspaper, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTimes, 
  FaSpinner, 
  FaLock, 
  FaImage, 
  FaCheck, 
  FaEye, 
  FaEyeSlash,
  FaTachometerAlt,
  FaUserTie,
  FaBlog,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCog,
  FaDownload,
  FaUpload
} from "react-icons/fa";
import Navbar from "../components/Navigation";
import Footer from "../components/Footer";
import AdminAuthModal from "../components/AdminAuthModal";

// Import subpage components
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminInstructors from "../components/admin/AdminInstructors";
import AdminBlog from "../components/admin/AdminBlog";
import AdminMerchandise from "../components/admin/AdminMerchandise";
import AdminGalleryConfig from "../components/admin/AdminGalleryConfig";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

    const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'instructors':
        return <AdminInstructors />;
      case 'blog':
        return <AdminBlog />;
      case 'merchandise':
        return <AdminMerchandise />;
      case 'gallery':
        return <AdminGalleryConfig />;
      default:
        return <AdminDashboard />;
    }
  };

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-muted">
          <AdminAuthModal
            isOpen={true} 
            onClose={() => {}} 
            onSuccess={handleAuthSuccess}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex bg-muted pt-16">
        {/* Sidebar */}
        <div className="w-64 bg-card shadow-lg min-h-screen">
                    <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FaUserCog className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
                <p className="text-sm text-muted-foreground">Administrator</p>
                <p className="text-xs text-primary capitalize">Admin</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
              { id: 'instructors', label: 'Instructors', icon: FaUserTie },
              { id: 'blog', label: 'Blog', icon: FaBlog },
              { id: 'merchandise', label: 'Merchandise', icon: FaShoppingCart },
              { id: 'gallery', label: 'Gallery', icon: FaImage },
            ].map((tab) => {
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

                    <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-muted">
          <div className="p-8 mt-4 min-h-screen">
            {renderActiveTab()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Access Denied Component
const AccessDenied = () => (
  <div className="text-center py-12">
    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <FaLock className="text-4xl text-destructive" />
    </div>
    <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
    <p className="text-muted-foreground max-w-md mx-auto">
      You don't have permission to access this section. Please contact your administrator if you need access.
    </p>
  </div>
);

export default Admin;