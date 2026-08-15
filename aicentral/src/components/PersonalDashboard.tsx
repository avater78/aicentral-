import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Settings as SettingsIcon,
  LogOut,
  CheckCircle2,
  Bell,
  Sun,
  Moon,
  Save,
  Edit3,
  Award,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Sparkles,
  Camera,
  RotateCcw,
  Grid,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { AITool } from '../types';

interface PersonalDashboardProps {
  onClose: () => void;
  userXP?: number;
  setUserXP?: React.Dispatch<React.SetStateAction<number>>;
  userLevel?: number;
  savedToolIds: string[];
  allTools: AITool[];
  onSelectTool: (tool: AITool) => void;
  onRemoveSaved: (toolId: string) => void;
  currentUser?: { name: string; email: string; avatar: string } | null;
  onLogout?: () => void;
  onUpdateUser?: (updated: { name: string; email: string; avatar: string }) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  initialTab?: 'profile' | 'settings';
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  onClose,
  savedToolIds,
  currentUser,
  onLogout,
  onUpdateUser,
  darkMode = true,
  setDarkMode,
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(
    initialTab === 'profile' || initialTab === 'settings' ? initialTab : 'profile'
  );

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || 'Alex Mercer');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'alex.mercer@aipioneer.org');
  const [profileAvatar, setProfileAvatar] = useState(
    currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128'
  );
  const [profileBio, setProfileBio] = useState('AI Explorer & Automation Enthusiast');
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);
  const [isGalleryUpload, setIsGalleryUpload] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<'all' | 'portraits' | '3d' | 'cyber'>('all');

  // Change Password State
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please try again.');
      return;
    }

    // Success simulation
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setPasswordSuccess(false);
    }, 4000);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expanded Avatar Gallery
  const avatarGallery = [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256', category: 'portraits', label: 'Pro Female' },
    { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256', category: 'portraits', label: 'Pro Male' },
    { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256', category: 'portraits', label: 'Tech Lead' },
    { url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=256', category: 'portraits', label: 'Developer' },
    { url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=256', category: '3d', label: '3D Persona 1' },
    { url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=256', category: '3d', label: '3D Persona 2' },
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256', category: 'cyber', label: 'Cyber Sphere' },
    { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=256', category: 'cyber', label: 'AI Cyber Avatar' },
    { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=256', category: 'portraits', label: 'AI Researcher' },
    { url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=256', category: 'portraits', label: 'Product Designer' },
    { url: 'https://images.unsplash.com/photo-1614680376593-902f749f7b2c?w=256', category: 'cyber', label: 'Futuristic Glow' },
    { url: 'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=256', category: '3d', label: '3D Cyber' },
  ];

  const handleFileUploadFromGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please select a smaller photo from your gallery.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfileAvatar(reader.result as string);
          setIsGalleryUpload(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Settings State
  const [emailDigest, setEmailDigest] = useState(true);
  const [toolAlerts, setToolAlerts] = useState(true);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=128'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        name: profileName,
        email: profileEmail,
        avatar: profileAvatar
      });
    }
    setProfileSavedSuccess(true);
    setTimeout(() => setProfileSavedSuccess(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col text-slate-100 ring-1 ring-white/10">
        
        {/* Sleek Profile Banner Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800/80 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={currentUser?.avatar || profileAvatar}
                alt="User Avatar"
                className="w-13 h-13 rounded-full object-cover ring-2 ring-cyan-500/50 shadow-md shadow-cyan-500/10 group-hover:ring-cyan-400 transition-all"
              />
              <button
                onClick={() => setActiveTab('profile')}
                className="absolute bottom-0 right-0 p-1 rounded-full bg-cyan-500 text-slate-950 shadow hover:scale-110 transition-transform cursor-pointer"
                title="Change Avatar"
              >
                <Edit3 className="w-2.5 h-2.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {currentUser?.name || profileName}
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3 text-cyan-400" />
                  Pro Explorer
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">{currentUser?.email || profileEmail}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Navigation Tabs */}
        <div className="px-6 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'profile', label: 'Profile Details', icon: User },
              { id: 'settings', label: 'Account Preferences', icon: SettingsIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            className="p-2 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-600/20 hover:from-red-500/30 hover:to-rose-600/30 text-rose-400 hover:text-rose-200 border border-red-500/40 hover:border-red-400 shadow-md shadow-red-500/10 transition-all hover:scale-105 cursor-pointer ml-auto"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {profileSavedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Avatar Selector */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>Profile Photo & Avatar</span>
                  </label>
                  {isGalleryUpload && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Uploaded from Gallery
                    </span>
                  )}
                </div>

                {/* Hidden File Input for Device Gallery Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUploadFromGallery}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={profileAvatar}
                      alt="Current Avatar"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md hover:scale-110 transition-transform cursor-pointer"
                      title="Upload photo from Gallery"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-2.5 w-full">
                    {/* Action Buttons for Gallery */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Choose from Gallery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowGalleryModal(!showGalleryModal)}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Grid className="w-3.5 h-3.5 text-purple-400" />
                        <span>{showGalleryModal ? 'Hide Avatar Gallery' : 'Browse Avatar Gallery'}</span>
                      </button>
                    </div>

                    {/* Quick Presets Row */}
                    <div className="flex items-center gap-2 pt-0.5 overflow-x-auto">
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">Presets:</span>
                      {avatarGallery.slice(0, 5).map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setProfileAvatar(item.url);
                            setIsGalleryUpload(false);
                          }}
                          className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            profileAvatar === item.url ? 'border-cyan-400 scale-105 ring-2 ring-cyan-500/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                          title={item.label}
                        >
                          <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Avatar Gallery Modal Grid */}
                {showGalleryModal && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>Avatar Presets Gallery</span>
                      </span>
                      {/* Filter Pills */}
                      <div className="flex items-center gap-1">
                        {(['all', 'portraits', '3d', 'cyber'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedGalleryCategory(cat)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                              selectedGalleryCategory === cat
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                      {avatarGallery
                        .filter(item => selectedGalleryCategory === 'all' || item.category === selectedGalleryCategory)
                        .map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setProfileAvatar(item.url);
                              setIsGalleryUpload(false);
                            }}
                            className={`group relative rounded-xl overflow-hidden border-2 aspect-square transition-all cursor-pointer ${
                              profileAvatar === item.url ? 'border-cyan-400 ring-2 ring-cyan-500/40 scale-95' : 'border-slate-800 opacity-80 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0.5">
                              <span className="text-[9px] font-bold text-white text-center line-clamp-1">{item.label}</span>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Direct Custom Image URL Fallback */}
                <div className="pt-1">
                  <input
                    type="url"
                    value={profileAvatar.startsWith('data:') ? '[Uploaded Gallery Image]' : profileAvatar}
                    onChange={(e) => {
                      if (!e.target.value.startsWith('[')) {
                        setProfileAvatar(e.target.value);
                        setIsGalleryUpload(false);
                      }
                    }}
                    placeholder="Or paste custom image web URL..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/60 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Bio & Interests</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60 resize-none"
                />
              </div>

              {/* Change Password Card Section */}
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800/90 overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>Change Password</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                          Security
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Update your account login password safely
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {isPasswordSectionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isPasswordSectionOpen && (
                  <div className="p-4 pt-0 space-y-3.5 border-t border-slate-800/60 animate-in fade-in duration-200">
                    {passwordSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Your password has been changed successfully!</span>
                      </div>
                    )}

                    {passwordError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{passwordError}</span>
                      </div>
                    )}

                    {/* Current Password */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                        <span>Current Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60 placeholder-slate-500"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                        >
                          {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* New & Confirm Password Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60 placeholder-slate-500"
                          />
                          <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                          >
                            {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-300">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/60 placeholder-slate-500"
                          />
                          <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                          >
                            {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Update Password</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onLogout) onLogout();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: ACCOUNT PREFERENCES */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">

              {settingsSavedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Preferences saved successfully!</span>
                </div>
              )}

              {/* Appearance Mode */}
              {setDarkMode && (
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Theme Mode</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Toggle light/dark appearance</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-cyan-300 cursor-pointer"
                  >
                    {darkMode ? 'Dark' : 'Light'}
                  </button>
                </div>
              )}

              {/* Notifications */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Notification Subscriptions</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Weekly AI Tools Digest</span>
                    <input
                      type="checkbox"
                      checked={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Trending Tool Alerts</span>
                    <input
                      type="checkbox"
                      checked={toolAlerts}
                      onChange={(e) => setToolAlerts(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Preferences</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

