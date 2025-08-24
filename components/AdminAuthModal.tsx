import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (password: string) => void;
  isLoading?: boolean;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  isLoading = false,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!password.trim()) {
      setError("Please enter the admin password");
      return;
    }

    onAuthenticate(password);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-card p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <FaLock className="text-secondary-foreground text-lg" />
            </div>
            <h3 className="text-xl font-bold text-primary">Admin Authentication</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Please enter the admin password to access the dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium text-foreground">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter admin password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition shadow-button hover:shadow-button-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Access Dashboard"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Contact the system administrator if you need access to the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthModal;
