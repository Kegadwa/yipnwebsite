import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaUserTie, 
  FaSave, 
  FaTimes,
  FaEye,
  FaSpinner,
  FaDownload,
  FaUpload,
  FaExclamationTriangle,
  FaCheck
} from 'react-icons/fa';
import { 
  instructorService, 
  imageService, 
  dataService,
  realtimeService 
} from '../../lib/firebase-services';
import { useAuth } from '../../contexts/AuthContext';

interface Instructor {
  id?: string;
  name: string;
  fullName: string;
  nickname?: string;
  style: string;
  location: string;
  bio: string;
  specialties?: string[];
  level?: string;
  description?: string;
  qualifications?: string;
  mantra?: string;
  mantraSource?: string;
  career?: string[];
  social?: {
    instagram?: string;
    followers?: string;
    content?: string;
  };
  highlights?: string[];
  quote?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const { hasPermission } = useAuth();

  useEffect(() => {
    // Set up real-time listener for instructors
    const unsubscribe = realtimeService.onCollectionChange<Instructor>(
      'instructors',
      (data) => {
        setInstructors(data);
      },
      { isActive: true },
      'createdAt'
    );

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      fullName: '',
      nickname: '',
      style: '',
      location: '',
      bio: '',
      specialties: [],
      level: '',
      description: '',
      qualifications: '',
      mantra: '',
      mantraSource: '',
      career: [],
      social: {},
      highlights: [],
      quote: '',
      imageUrl: '',
      isActive: true
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setFormData(instructor);
    setIsEditModalOpen(true);
  };

  const openViewModal = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedInstructor(null);
  };

  const [formData, setFormData] = useState<Instructor>({
    name: '',
    fullName: '',
    nickname: '',
    style: '',
    location: '',
    bio: '',
    specialties: [],
    level: '',
    description: '',
    qualifications: '',
    mantra: '',
    mantraSource: '',
    career: [],
    social: {},
    highlights: [],
    quote: '',
    imageUrl: '',
    isActive: true
  });

  const handleInputChange = (field: keyof Instructor, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'specialties' | 'career' | 'highlights', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => 
        i === index ? value : item
      ) || []
    }));
  };

  const addArrayItem = (field: 'specialties' | 'career' | 'highlights') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (field: 'specialties' | 'career' | 'highlights', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadProgress(0);
      
      // Generate unique filename
      const fileName = imageService.generateFileName(file.name, 'instructors/');
      
      // Upload to Firebase Storage
      const imageUrl = await imageService.uploadImage(file, fileName);
      
      // Update form data
      handleInputChange('imageUrl', imageUrl);
      
      setUploadProgress(100);
      
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (isEditModalOpen && selectedInstructor?.id) {
        // Update existing instructor
        await instructorService.update(selectedInstructor.id, formData);
      } else {
        // Create new instructor
        await instructorService.create(formData);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving instructor:', error);
      alert('Failed to save instructor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this instructor? This action cannot be undone.')) {
      try {
        setLoading(true);
        
        // Get instructor to check if they have an image to delete
        const instructor = instructors.find(i => i.id === id);
        if (instructor?.imageUrl) {
          try {
            await imageService.deleteImage(instructor.imageUrl);
          } catch (error) {
            console.warn('Failed to delete image:', error);
          }
        }
        
        // Delete from Firestore
        await instructorService.delete(id);
        
      } catch (error) {
        console.error('Error deleting instructor:', error);
        alert('Failed to delete instructor. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Data Export/Import functionality
  const handleExportData = async () => {
    try {
      setLoading(true);
      const data = await dataService.exportData('instructors');
      dataService.downloadAsJSON(data, `instructors_${new Date().toISOString().split('T')[0]}.json`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    if (!importFile) return;
    
    try {
      setLoading(true);
      
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          
          if (Array.isArray(jsonData)) {
            await dataService.importData('instructors', jsonData);
            alert(`Successfully imported ${jsonData.length} instructors`);
            setShowImportModal(false);
            setImportFile(null);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          console.error('Error parsing import file:', error);
          alert('Invalid import file format. Please check your JSON file.');
        }
      };
      
      fileReader.readAsText(importFile);
      
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const InstructorModal = ({ isOpen, onClose, title, children }: any) => (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              title="Close modal"
              aria-label="Close modal"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Instructors</h1>
          <p className="text-muted-foreground mt-2">Add, edit, and manage instructor profiles</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('canExportData') && (
            <button
              onClick={handleExportData}
              disabled={loading}
              className="bg-wellness hover:bg-wellness/80 text-wellness-foreground px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              title="Export data"
            >
              <FaDownload />
              <span>Export</span>
            </button>
          )}
          
          {hasPermission('canExportData') && (
            <button
              onClick={() => setShowImportModal(true)}
              disabled={loading}
              className="bg-accent hover:bg-accent/80 text-accent-foreground px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              title="Import data"
            >
              <FaUpload />
              <span>Import</span>
            </button>
          )}
          
          {hasPermission('canManageInstructors') && (
            <button
              onClick={openAddModal}
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FaPlus />
              <span>Add Instructor</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search instructors by name, style, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredInstructors.length} of {instructors.length} instructors
          </div>
        </div>
      </div>

      {/* Instructors List */}
      <div className="bg-card rounded-lg shadow-md border border-border">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Style
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                          {instructor.imageUrl ? (
                            <img 
                              src={instructor.imageUrl} 
                              alt={instructor.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <FaUserTie className="text-muted-foreground text-xl" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{instructor.name}</div>
                          <div className="text-sm text-muted-foreground">{instructor.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{instructor.style}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{instructor.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        instructor.isActive 
                          ? 'bg-wellness/20 text-wellness' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {instructor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openViewModal(instructor)}
                          className="text-primary hover:text-primary/80"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        
                        {hasPermission('canManageInstructors') && (
                          <button
                            onClick={() => openEditModal(instructor)}
                            className="text-secondary hover:text-secondary/80"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        )}
                        
                        {hasPermission('canDeleteContent') && (
                          <button
                            onClick={() => handleDelete(instructor.id!)}
                            className="text-destructive hover:text-destructive/80"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <InstructorModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={closeModal}
        title={isAddModalOpen ? 'Add New Instructor' : 'Edit Instructor'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <div>
                <label htmlFor="instructor-name" className="block text-sm font-medium text-foreground mb-2">
                  Display Name *
                </label>
                <input
                  id="instructor-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="instructor-fullname" className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  id="instructor-fullname"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="instructor-nickname" className="block text-sm font-medium text-foreground mb-2">
                  Nickname
                </label>
                <input
                  id="instructor-nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                />
              </div>

              <div>
                <label htmlFor="instructor-style" className="block text-sm font-medium text-foreground mb-2">
                  Style/Specialties *
                </label>
                <input
                  id="instructor-style"
                  type="text"
                  value={formData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="instructor-location" className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <input
                  id="instructor-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>
            </div>

            {/* Bio and Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Bio & Details</h3>
              
              <div>
                <label htmlFor="instructor-bio" className="block text-sm font-medium text-foreground mb-2">
                  Bio *
                </label>
                <textarea
                  id="instructor-bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                  required
                />
              </div>

              <div>
                <label htmlFor="instructor-image" className="block text-sm font-medium text-foreground mb-2">
                  Profile Image
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-muted hover:bg-muted/80 px-4 py-2 rounded-md flex items-center space-x-2 transition-colors text-foreground"
                    >
                      <FaImage />
                      <span>Upload Image</span>
                    </label>
                    {formData.imageUrl && (
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {uploadProgress === 100 && (
                    <div className="text-wellness text-sm flex items-center space-x-2">
                      <FaCheck />
                      <span>Image uploaded successfully!</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="instructor-status" className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  id="instructor-status"
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
            
            {/* Qualifications */}
            <div>
              <label htmlFor="instructor-qualifications" className="block text-sm font-medium text-foreground mb-2">
                Qualifications
              </label>
              <textarea
                id="instructor-qualifications"
                value={formData.qualifications}
                onChange={(e) => handleInputChange('qualifications', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
              />
            </div>

            {/* Mantra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instructor-mantra" className="block text-sm font-medium text-foreground mb-2">
                  Personal Mantra
                </label>
                <input
                  id="instructor-mantra"
                  type="text"
                  value={formData.mantra}
                  onChange={(e) => handleInputChange('mantra', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                />
              </div>
              <div>
                <label htmlFor="instructor-mantra-source" className="block text-sm font-medium text-foreground mb-2">
                  Mantra Source
                </label>
                <input
                  id="instructor-mantra-source"
                  type="text"
                  value={formData.mantraSource}
                  onChange={(e) => handleInputChange('mantraSource', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instructor-instagram" className="block text-sm font-medium text-foreground mb-2">
                  Instagram Handle
                </label>
                <input
                  id="instructor-instagram"
                  type="text"
                  value={formData.social?.instagram || ''}
                  onChange={(e) => handleInputChange('social', { ...formData.social, instagram: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                />
              </div>
                              <div>
                  <label htmlFor="instructor-followers" className="block text-sm font-medium text-foreground mb-2">
                    Followers
                  </label>
                  <input
                    id="instructor-followers"
                    type="text"
                    value={formData.social?.followers || ''}
                    onChange={(e) => handleInputChange('social', { ...formData.social, followers: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                  />
                </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={closeModal}
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
              <span>{isAddModalOpen ? 'Add Instructor' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </InstructorModal>

      {/* View Modal */}
      <InstructorModal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title={`Instructor Profile: ${selectedInstructor?.name}`}
      >
        {selectedInstructor && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                {selectedInstructor.imageUrl ? (
                  <img 
                    src={selectedInstructor.imageUrl} 
                    alt={selectedInstructor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <FaUserTie className="text-muted-foreground text-4xl" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{selectedInstructor.name}</h3>
                {selectedInstructor.nickname && (
                  <p className="text-lg text-primary">"{selectedInstructor.nickname}"</p>
                )}
                <p className="text-muted-foreground">{selectedInstructor.fullName}</p>
                <p className="text-muted-foreground">{selectedInstructor.location}</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Bio</h4>
              <p className="text-muted-foreground">{selectedInstructor.bio}</p>
            </div>

            {/* Style */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Style & Specialties</h4>
              <p className="text-muted-foreground">{selectedInstructor.style}</p>
            </div>

            {/* Qualifications */}
            {selectedInstructor.qualifications && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Qualifications</h4>
                <p className="text-muted-foreground">{selectedInstructor.qualifications}</p>
              </div>
            )}

            {/* Mantra */}
            {selectedInstructor.mantra && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Personal Mantra</h4>
                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                  <blockquote className="italic text-foreground font-medium">
                    "{selectedInstructor.mantra}"
                  </blockquote>
                  {selectedInstructor.mantraSource && (
                    <p className="text-muted-foreground text-sm mt-2">{selectedInstructor.mantraSource}</p>
                  )}
                </div>
              </div>
            )}

            {/* Career Highlights */}
            {selectedInstructor.career && selectedInstructor.career.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Career & Leadership</h4>
                <ul className="space-y-2">
                  {selectedInstructor.career.map((item, index) => (
                    <li key={index} className="text-muted-foreground flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Media */}
            {selectedInstructor.social && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Social Presence</h4>
                <div className="space-y-2">
                  {selectedInstructor.social.instagram && (
                    <p className="text-muted-foreground">
                      <strong>Instagram:</strong> {selectedInstructor.social.instagram}
                    </p>
                  )}
                  {selectedInstructor.social.followers && (
                    <p className="text-muted-foreground">
                      <strong>Followers:</strong> {selectedInstructor.social.followers}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Event Highlights */}
            {selectedInstructor.highlights && selectedInstructor.highlights.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Event Highlights</h4>
                <ul className="space-y-2">
                  {selectedInstructor.highlights.map((highlight, index) => (
                    <li key={index} className="text-muted-foreground flex items-start">
                      <span className="text-wellness mr-2">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quote */}
            {selectedInstructor.quote && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Featured Quote</h4>
                <div className="bg-wellness/10 p-4 rounded-lg border-l-4 border-wellness">
                  <blockquote className="italic text-foreground font-medium">
                    "{selectedInstructor.quote}"
                  </blockquote>
                </div>
              </div>
            )}

            {/* Actions */}
            {hasPermission('canManageInstructors') && (
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
                <button
                  onClick={() => {
                    closeModal();
                    openEditModal(selectedInstructor);
                  }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        )}
      </InstructorModal>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-md w-full p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Import Instructors</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-muted-foreground hover:text-foreground"
                title="Close import modal"
                aria-label="Close import modal"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="import-file" className="block text-sm font-medium text-foreground mb-2">
                  Select JSON File
                </label>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-input text-foreground"
                />
              </div>
              
              <div className="bg-secondary/10 border border-secondary/20 rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <FaExclamationTriangle className="text-secondary" />
                  <p className="text-sm text-secondary">
                    Warning: Importing will overwrite existing data with the same IDs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportData}
                  disabled={!importFile || loading}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                  <span>Import</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstructors;
