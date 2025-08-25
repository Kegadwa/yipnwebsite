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
import { useAuth } from "../contexts/AuthContext";
import { testFirebaseConnection } from "../lib/firebase-services";

// Import subpage components
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminInstructors from "../components/admin/AdminInstructors";
import AdminBlog from "../components/admin/AdminBlog";
import AdminMerchandise from "../components/admin/AdminMerchandise";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<string>("Initializing...");
  const [loading, setLoading] = useState(true);
  
  const { currentUser, loading: authLoading, signOut, hasPermission } = useAuth();

  // Load data on component mount
  useEffect(() => {
    if (currentUser) {
      initializeFirebase();
    }
  }, [currentUser]);

  const initializeFirebase = async () => {
    try {
      setFirebaseStatus("Connecting to Firebase...");
      const connected = await testFirebaseConnection();
      if (!connected) {
        throw new Error("Failed to connect to Firebase");
      }
      setFirebaseStatus("Connected to Firebase");
      setLoading(false);
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setFirebaseStatus(
        `Firebase Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'instructors':
        return hasPermission('canManageInstructors') ? <AdminInstructors /> : <AccessDenied />;
      case 'blog':
        return hasPermission('canManageBlog') ? <AdminBlog /> : <AccessDenied />;
      case 'merchandise':
        return hasPermission('canManageMerchandise') ? <AdminMerchandise /> : <AccessDenied />;
      default:
        return <AdminDashboard />;
    }
  };

  // Show auth modal if not authenticated
  if (!currentUser && !authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <AdminAuthModal 
            isOpen={true} 
            onClose={() => {}} 
          />
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">{firebaseStatus}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUserCog className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-500">{currentUser?.displayName}</p>
                <p className="text-xs text-blue-600 capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, permission: null },
              { id: 'instructors', label: 'Instructors', icon: FaUserTie, permission: 'canManageInstructors' },
              { id: 'blog', label: 'Blog', icon: FaBlog, permission: 'canManageBlog' },
              { id: 'merchandise', label: 'Merchandise', icon: FaShoppingCart, permission: 'canManageMerchandise' },
            ].map((tab) => {
              const Icon = tab.icon;
              const hasAccess = !tab.permission || hasPermission(tab.permission as any);
              
              if (!hasAccess) return null;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
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
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <FaLock className="text-4xl text-red-600" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
    <p className="text-gray-600 max-w-md mx-auto">
      You don't have permission to access this section. Please contact your administrator if you need access.
    </p>
  </div>
);

export default Admin;