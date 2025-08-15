'use client'

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NavBar from '../NavBar';
import ProtectedRoute from '../ProtectedRoute';

// ===== TYPES =====
interface Notifications {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface SocialLinks {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  website: string;
}

interface EditData {
  phone: string;
  location: string;
  status: string;
  socialLinks: SocialLinks;
}

// ===== HELPER COMPONENTS =====
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  isTag = false, 
  isEditing = false, 
  fieldName = '', 
  onEditChange = () => {} 
}: {
  icon: string;
  label: string;
  value?: string;
  isTag?: boolean;
  isEditing?: boolean;
  fieldName?: string;
  onEditChange?: (value: string) => void;
}) => (
  <div className="box has-radius has-shadow is-size-7">
    <div className="is-flex is-align-items-center mb-2 is-size-7">
      <span className="icon has-text-primary mr-2 is-size-7">
        <i className="material-icons is-size-7">{icon}</i>
      </span>
      <label className="has-text-weight-semibold is-uppercase is-size-7">{label}</label>
    </div>
    {isTag && !isEditing ? (
      <span className={`tag is-small ${value === 'Yes' ? 'is-info' : 'is-success'} is-size-7`}>
        {value || 'Not provided'}
      </span>
    ) : isEditing && fieldName ? (
      <input 
        className="input is-size-7" 
        type="text" 
        value={value || ''} 
        onChange={(e) => onEditChange(e.target.value)} 
        placeholder={`Enter ${label.toLowerCase()}`} 
      />
    ) : (
      <p className="has-text-weight-medium mb-0 is-size-7">{value || 'Not provided'}</p>
    )}
  </div>
);

const StatsItem = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="box has-radius has-shadow is-size-7">
    <div className="mb-3">
      <label className="has-text-weight-semibold is-size-7 is-uppercase">{label}</label>
    </div>
    <p className="has-text-weight-semibold is-size-7">{value || '0'}</p>
  </div>
);

const NotificationItem = ({ notifications }: { notifications?: Notifications }) => (
  <div className="box has-radius has-shadow is-size-7">
    <div className="mb-3">
      <label className="has-text-weight-semibold is-uppercase is-size-7">Notifications</label>
    </div>
    <div className="tags is-fullwidth">
      <span className={`tag is-small ${notifications?.email ? 'is-success' : 'is-light'} is-size-7`}>
        Email: {notifications?.email ? 'On' : 'Off'}
      </span>
      <span className={`tag is-small ${notifications?.push ? 'is-success' : 'is-light'} is-size-7`}>
        Push: {notifications?.push ? 'On' : 'Off'}
      </span>
      <span className={`tag is-small ${notifications?.sms ? 'is-success' : 'is-light'} is-size-7`}>
        SMS: {notifications?.sms ? 'On' : 'Off'}
      </span>
    </div>
  </div>
);

// ===== SECTION COMPONENTS =====
const ProfileSection = ({ 
  title, 
  children, 
  className = "", 
  delay = 0.2 
}: { 
  title?: string; 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => (
  <motion.div 
    className={className}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.01 }}
  >
    <div className="box has-shadow p-5 is-size-7" style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      height: '100%',
      minHeight: '400px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
        borderRadius: '20px 20px 0 0'
      }}></div>
      {title && (
        <h2 className="is-size-7 has-text-centered mb-4 has-text-weight-bold">
          {title}
        </h2>
      )}
      {children}
    </div>
  </motion.div>
);

// ===== MAIN COMPONENT =====
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    phone: user?.phone || '',
    location: user?.location || '',
    status: user?.status || '',
    socialLinks: {
      linkedin: user?.socialLinks?.linkedin || '',
      twitter: user?.socialLinks?.twitter || '',
      facebook: user?.socialLinks?.facebook || '',
      instagram: user?.socialLinks?.instagram || '',
      website: user?.socialLinks?.website || ''
    }
  });

  // ===== EVENT HANDLERS =====
  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      updateUser(editData);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [isEditing, editData, updateUser]);

  const handleEditChange = useCallback((field: string, value: string) => {
    setEditData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'socialLinks') {
          return {
            ...prev,
            socialLinks: {
              ...prev.socialLinks,
              [child]: value
            }
          };
        }
      }
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  // ===== DATA CONFIGURATIONS =====
  const personalInfoItems = [
    { icon: 'phone', label: 'Phone', field: 'phone' as keyof EditData },
    { icon: 'location_on', label: 'Location', field: 'location' as keyof EditData },
    { icon: 'work', label: 'Status', field: 'status' as keyof EditData },
    { icon: 'schedule', label: 'Timezone', field: 'timezone' as keyof any, static: true },
    { icon: 'notifications', label: 'Notifications', field: 'notifications' as keyof any, isTag: true }
  ];

  const statsItems = [
    { label: 'Total Orders', field: 'totalOrders' as keyof any },
    { label: 'Completed Orders', field: 'completedOrders' as keyof any },
    { label: 'Language', field: 'language' as keyof any },
    { label: 'Member Since', field: 'createdAt' as keyof any }
  ];

  const socialItems = [
    { icon: 'work', label: 'LinkedIn', field: 'linkedin' as keyof SocialLinks },
    { icon: 'flutter_dash', label: 'Twitter', field: 'twitter' as keyof SocialLinks },
    { icon: 'facebook', label: 'Facebook', field: 'facebook' as keyof SocialLinks },
    { icon: 'camera_alt', label: 'Instagram', field: 'instagram' as keyof SocialLinks },
    { icon: 'language', label: 'Website', field: 'website' as keyof SocialLinks }
  ];

  // ===== RENDER FUNCTIONS =====
  const renderItems = useCallback((items: any[], type: 'info' | 'stats' | 'social') => (
    <div className="columns is-multiline is-size-7">
      {items.map((item, index) => (
        <div key={index} className="column is-6-tablet is-12-mobile">
          {type === 'info' && (
            <InfoItem
              icon={item.icon}
              label={item.label}
              value={
                item.static 
                  ? (user as any)?.[item.field] 
                  : item.field === 'notifications'
                    ? (user?.notifications ? 'Yes' : 'No')
                    : (isEditing ? (editData as any)[item.field] : (user as any)?.[item.field])
              }
              isTag={item.isTag}
              isEditing={isEditing && !item.static}
              fieldName={item.field}
              onEditChange={(value) => handleEditChange(item.field, value)}
            />
          )}
          {type === 'stats' && (
            <StatsItem
              label={item.label}
              value={(user as any)?.[item.field] || (item.field === 'language' ? 'English' : '0')}
            />
          )}
          {type === 'social' && (
            <InfoItem
              icon={item.icon}
              label={item.label}
              value={isEditing ? (editData.socialLinks as any)[item.field] : (user?.socialLinks as any)?.[item.field]}
              isEditing={isEditing}
              fieldName={`socialLinks.${item.field}`}
              onEditChange={(value) => handleEditChange(`socialLinks.${item.field}`, value)}
            />
          )}
        </div>
      ))}
    </div>
  ), [isEditing, editData, user, handleEditChange]);

  // ===== RENDER =====
  return (
    <ProtectedRoute>
      <div className="p-5 is-size-7" style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <NavBar />
        <div className="container mt-6">
          {/* Header */}
          <motion.div 
            className="has-text-centered mb-5 box has-shadow"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="is-size-7 has-text-weight-bold" style={{ letterSpacing: '0.1em' }}>User Profile</h1>
          </motion.div>
          
          {/* Main Content with Bulma Columns */}
          <div className="columns is-multiline">
            {/* Avatar Section */}
            <ProfileSection className="column is-12-mobile is-12-tablet is-4-desktop" delay={0.2}>
              <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center is-fullheight" 
                  style={{ 
                    minHeight: '300px',
                    padding: '2rem 0'
                  }}>
                <Image 
                  src={user?.avatar || '/images/husble.png'} 
                  alt="User Avatar"
                  width={72} 
                  height={72} 
                  className="has-shadow"
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    border: '3px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    objectFit: 'cover'
                  }}
                />
                <div className="mt-3 has-text-centered">
                  <h3 className="is-size-7 has-text-weight-bold">{user?.name}</h3>
                  <p className="is-size-7">{user?.email}</p>
                  <p className="is-size-7">Role: {user?.role}</p>
                </div>
              </div>
            </ProfileSection>

            {/* Personal Information Section */}
            <ProfileSection className="column is-12-mobile is-12-tablet is-8-desktop" delay={0.2}>
              <div className="has-text-centered mb-4">
                <button
                  className={`button is-small ${isEditing ? 'is-danger' : 'is-primary'} is-size-7`}
                  onClick={handleEditToggle}
                >
                  <span className="icon is-small is-size-7">
                    <i className="material-icons is-size-7">{isEditing ? 'close' : 'edit'}</i>
                  </span>
                  <span className="is-size-7">{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
              {renderItems(personalInfoItems, 'info')}
            </ProfileSection>

            {/* Statistics Section */}
            <ProfileSection className="column is-12-mobile is-12-tablet is-6-desktop" title="Statistics" delay={0.4}>
              {renderItems(statsItems, 'stats')}
              <div className="column is-12">
                <NotificationItem notifications={user?.notifications} />
              </div>
            </ProfileSection>
            
            {/* Social Links Section */}
            <ProfileSection className="column is-12-mobile is-12-tablet is-6-desktop" title="Social Links" delay={0.4}>
              {renderItems(socialItems, 'social')}
            </ProfileSection>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;