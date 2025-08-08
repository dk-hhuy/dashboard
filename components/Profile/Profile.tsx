'use client'

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import NavBar from '../NavBar';
import ProtectedRoute from '../ProtectedRoute';
import styles from './Profile.module.css';

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

// ===== CONSTANTS =====
const ICON_COLOR = '#3273dc';
const TITLE_COLOR = '#000';
const SUBTITLE_COLOR = '#666';

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
  <div className={styles.infoItem}>
    <div className={styles.infoHeader}>
      <span className="icon" style={{ color: ICON_COLOR }}>
        <i className="material-icons" style={{ color: ICON_COLOR }}>{icon}</i>
      </span>
      <label className={styles.infoLabel}>{label}</label>
    </div>
    {isTag && !isEditing ? (
      <span className={`tag is-small ${styles.tagSmall} ${value === 'Yes' ? 'is-info' : 'is-success'}`}>
        {value || 'Not provided'}
      </span>
    ) : isEditing && fieldName ? (
      <input 
        className={styles.input} 
        type="text" 
        value={value || ''} 
        onChange={(e) => onEditChange(e.target.value)} 
        placeholder={`Enter ${label.toLowerCase()}`} 
      />
    ) : (
      <p className={styles.infoValue}>{value || 'Not provided'}</p>
    )}
  </div>
);

const StatsItem = ({ label, value }: { label: string; value?: string | number }) => (
  <div className={styles.statsItem}>
    <label className={styles.statsLabel}>{label}</label>
    <p className={styles.statsValue}>{value || '0'}</p>
  </div>
);

const NotificationItem = ({ notifications }: { notifications?: Notifications }) => (
  <div className={styles.statsItem}>
    <label className={styles.statsLabel}>Notifications</label>
    <div className={styles.notificationTags}>
      <span className={`tag ${notifications?.email ? 'is-success' : 'is-light'}`}>
        Email: {notifications?.email ? 'On' : 'Off'}
      </span>
      <span className={`tag ${notifications?.push ? 'is-success' : 'is-light'}`}>
        Push: {notifications?.push ? 'On' : 'Off'}
      </span>
      <span className={`tag ${notifications?.sms ? 'is-success' : 'is-light'}`}>
        SMS: {notifications?.sms ? 'On' : 'Off'}
      </span>
    </div>
  </div>
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

  // ===== RENDER FUNCTIONS =====
  const renderPersonalInfo = useCallback(() => (
    <div className={`${styles.infoGrid} ${styles.mobileInfoGrid}`}>
      <InfoItem
        icon="phone"
        label="Phone"
        value={isEditing ? editData.phone : user?.phone}
        isEditing={isEditing}
        fieldName="phone"
        onEditChange={(value) => handleEditChange('phone', value)}
      />
      <InfoItem
        icon="location_on"
        label="Location"
        value={isEditing ? editData.location : user?.location}
        isEditing={isEditing}
        fieldName="location"
        onEditChange={(value) => handleEditChange('location', value)}
      />
      <InfoItem
        icon="work"
        label="Status"
        value={isEditing ? editData.status : user?.status}
        isEditing={isEditing}
        fieldName="status"
        onEditChange={(value) => handleEditChange('status', value)}
      />
      <InfoItem
        icon="schedule"
        label="Timezone"
        value={user?.timezone || 'UTC'}
      />
      <InfoItem
        icon="notifications"
        label="Notifications"
        value={user?.notifications ? 'Yes' : 'No'}
        isTag={true}
      />
    </div>
  ), [isEditing, editData, user, handleEditChange]);

  const renderSocialLinks = useCallback(() => (
    <div className={styles.socialLinksGrid}>
      <InfoItem 
        icon="work" 
        label="LinkedIn" 
        value={isEditing ? editData.socialLinks.linkedin : user?.socialLinks?.linkedin} 
        isEditing={isEditing} 
        fieldName="socialLinks.linkedin" 
        onEditChange={(value) => handleEditChange('socialLinks.linkedin', value)} 
      />
      <InfoItem 
        icon="flutter_dash"
        label="Twitter" 
        value={isEditing ? editData.socialLinks.twitter : user?.socialLinks?.twitter} 
        isEditing={isEditing} 
        fieldName="socialLinks.twitter" 
        onEditChange={(value) => handleEditChange('socialLinks.twitter', value)} 
      />
      <InfoItem 
        icon="facebook"
        label="Facebook" 
        value={isEditing ? editData.socialLinks.facebook : user?.socialLinks?.facebook} 
        isEditing={isEditing} 
        fieldName="socialLinks.facebook" 
        onEditChange={(value) => handleEditChange('socialLinks.facebook', value)} 
      />
      <InfoItem 
        icon="camera_alt"
        label="Instagram" 
        value={isEditing ? editData.socialLinks.instagram : user?.socialLinks?.instagram} 
        isEditing={isEditing} 
        fieldName="socialLinks.instagram" 
        onEditChange={(value) => handleEditChange('socialLinks.instagram', value)} 
      />
      <InfoItem
        icon="language"
        label="Website"
        value={isEditing ? editData.socialLinks.website : user?.socialLinks?.website}
        isEditing={isEditing}
        fieldName="socialLinks.website"
        onEditChange={(value) => handleEditChange('socialLinks.website', value)}
      />
    </div>
  ), [isEditing, editData.socialLinks, user?.socialLinks, handleEditChange]);

  // ===== RENDER =====
  return (
    <ProtectedRoute>
      <div>
        <NavBar />
        <div className={styles.profileMainContainer}>
          {/* Header */}
          <motion.div 
            className={styles.profileHeader}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="title is-3" style={{ color: TITLE_COLOR }}>User Profile</h1>
          </motion.div>
          
          <div className={styles.profileContent}>
            {/* Top Row - Avatar & Personal Info */}
            <motion.div 
              className={styles.profileTopRow}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {/* Avatar Section */}
              <motion.div 
                className={styles.avatarSection}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.avatarWrapper}>
                  <Image 
                    src={user?.avatar || '/images/husble.png'} 
                    alt="User Avatar"
                    width={120} 
                    height={120} 
                    className={styles.avatarImage}
                  />
                  <div className={styles.avatarInfo}>
                    <h3 className="title is-4" style={{ color: TITLE_COLOR }}>{user?.name}</h3>
                    <p className="subtitle is-6" style={{ color: SUBTITLE_COLOR }}>{user?.email}</p>
                    <p className="subtitle is-6" style={{ color: SUBTITLE_COLOR }}>Role: {user?.role}</p>
                  </div>
                </div>
              </motion.div>

              {/* Personal Information Section */}
              <motion.div 
                className={styles.infoSection}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.infoHeaderSection}>
                  <h2 className="title is-4" style={{ color: TITLE_COLOR }}>Personal Information</h2>
                  <button
                    className={`button is-small ${isEditing ? 'is-danger' : 'is-primary'}`}
                    onClick={handleEditToggle}
                  >
                    <span className="icon is-small">
                      <i className="material-icons">{isEditing ? 'close' : 'edit'}</i>
                    </span>
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>
                {renderPersonalInfo()}
              </motion.div>
            </motion.div>

            {/* Bottom Row - Statistics & Social Links */}
            <motion.div 
              className={styles.profileBottomRow}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              {/* Statistics Section */}
              <motion.div 
                className={styles.infoSection}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="title is-4" style={{ color: TITLE_COLOR }}>Statistics</h2>
                <div className={styles.statsGrid}>
                  <StatsItem label="Total Orders" value={user?.totalOrders || 0} />
                  <StatsItem label="Completed Orders" value={user?.completedOrders || 0} />
                  <StatsItem label="Language" value={user?.language || 'English'} />
                  <StatsItem label="Member Since" value={user?.createdAt || 'N/A'} />
                  <NotificationItem notifications={user?.notifications} />
                </div>
              </motion.div>
              
              {/* Social Links Section */}
              <motion.div 
                className={styles.infoSection}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="title is-4" style={{ color: TITLE_COLOR }}>Social Links</h2>
                {renderSocialLinks()}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;