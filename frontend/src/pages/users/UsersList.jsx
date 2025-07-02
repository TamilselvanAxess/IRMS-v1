import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, Mail, Phone, X, Eye, EyeOff } from 'lucide-react';
import apiService from '../../services/api/apiService';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUsers, selectUsers, selectUsersLoading, addUser, selectAddUserLoading, selectAddUserError, selectAddUserSuccess, clearAddUserState, updateUser, selectUpdateUserLoading, selectUpdateUserError, selectUpdateUserSuccess, clearUpdateUserState, deleteUser, selectDeleteUserLoading, selectDeleteUserError, selectDeleteUserSuccess, clearDeleteUserState } from '../../store/slices/usersSlice';

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'enroll',
    isActive: true,
    isVerified: false
  });
  const addUserLoading = useAppSelector(selectAddUserLoading);
  const addUserError = useAppSelector(selectAddUserError);
  const addUserSuccess = useAppSelector(selectAddUserSuccess);
  const updateUserLoading = useAppSelector(selectUpdateUserLoading);
  const updateUserError = useAppSelector(selectUpdateUserError);
  const updateUserSuccess = useAppSelector(selectUpdateUserSuccess);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const deleteUserLoading = useAppSelector(selectDeleteUserLoading);
  const deleteUserError = useAppSelector(selectDeleteUserError);
  const deleteUserSuccess = useAppSelector(selectDeleteUserSuccess);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState('');

  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
      case 'Admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'finance':
      case 'Finance':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'enroll':
      case 'Enroll':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'details':
      case 'Details':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'superadmin':
      case 'Super Admin':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Count calculations for summary cards
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const adminCount = users.filter(u => (u.role || '').toLowerCase() === 'admin').length;
  const financeCount = users.filter(u => (u.role || '').toLowerCase() === 'finance').length;
  const otherCount = users.filter(u => {
    const role = (u.role || '').toLowerCase();
    return role !== 'admin' && role !== 'finance' && role !== 'superadmin';
  }).length;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (editMode && editUserId) {
      dispatch(updateUser({ userId: editUserId, userData: form }));
    } else {
      dispatch(addUser(form));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditUserId(null);
    dispatch(clearAddUserState());
    dispatch(clearUpdateUserState());
    setForm({ fullName: '', email: '', password: '', role: 'enroll', isActive: true, isVerified: false });
  };

  useEffect(() => {
    if (addUserSuccess || updateUserSuccess) {
      handleCloseModal();
      dispatch(fetchUsers());
    }
  }, [addUserSuccess, updateUserSuccess, dispatch]);

  const handleOpenModal = () => {
    setShowModal(true);
    setEditMode(false);
    setEditUserId(null);
    dispatch(clearAddUserState());
    dispatch(clearUpdateUserState());
    setForm({ fullName: '', email: '', password: '', role: 'enroll', isActive: true, isVerified: false });
  };

  const handleEditUser = (user) => {
    setShowModal(true);
    setEditMode(true);
    setEditUserId(user._id || user.id);
    dispatch(clearAddUserState());
    dispatch(clearUpdateUserState());
    setForm({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '', // Don't prefill password
      role: user.role || 'enroll',
      isActive: user.isActive ?? true,
      isVerified: user.isVerified ?? false,
    });
  };

  const handleOpenDeleteModal = (user) => {
    setShowDeleteModal(true);
    setDeleteUserId(user._id || user.id);
    setDeleteUserName(user.fullName || user.name || '');
    dispatch(clearDeleteUserState());
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteUserId(null);
    setDeleteUserName('');
    dispatch(clearDeleteUserState());
  };

  const handleConfirmDelete = () => {
    if (deleteUserId) {
      dispatch(deleteUser(deleteUserId));
    }
  };

  useEffect(() => {
    if (deleteUserSuccess) {
      handleCloseDeleteModal();
      dispatch(fetchUsers());
    }
  }, [deleteUserSuccess, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Users List
                  </h1>
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={handleOpenModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </header>
        {/* Add User Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="flex min-h-screen w-full items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-0 relative flex flex-col max-h-[90vh] overflow-y-auto">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" onClick={handleCloseModal} aria-label="Close">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2 px-8 pt-8 pb-2">
                  <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h2>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 mx-8 mb-2" />
                <form onSubmit={handleModalSubmit} className="flex-1 flex flex-col justify-between px-8 pb-8 pt-2 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="adduser-fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input id="adduser-fullName" type="text" name="fullName" value={form.fullName} onChange={handleInputChange} required className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none" placeholder="Enter full name" autoComplete="off" />
                    </div>
                    <div>
                      <label htmlFor="adduser-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input id="adduser-email" type="email" name="email" value={form.email} onChange={handleInputChange} required className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none" placeholder="Enter email address" autoComplete="off" />
                    </div>
                    <div className="relative">
                      <label htmlFor="adduser-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                      <input
                        id="adduser-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none pr-10"
                        placeholder="Enter password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 bottom-2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{ padding: 0 }}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div>
                      <label htmlFor="adduser-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select id="adduser-role" name="role" value={form.role} onChange={handleInputChange} required className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none">
                        <option value="admin">Admin</option>
                        <option value="finance">Finance</option>
                        <option value="detail">Detail</option>
                        <option value="enroll">Enroll</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-6 mt-2">
                      <label htmlFor="adduser-active" className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input id="adduser-active" type="checkbox" name="isActive" checked={form.isActive} onChange={handleInputChange} className="mr-2 accent-blue-600 dark:accent-blue-400" />
                        Active
                      </label>
                      <label htmlFor="adduser-verified" className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input id="adduser-verified" type="checkbox" name="isVerified" checked={form.isVerified} onChange={handleInputChange} className="mr-2 accent-blue-600 dark:accent-blue-400" />
                        Verified
                      </label>
                    </div>
                  </div>
                  <div style={{ minHeight: '24px' }} className="mb-1">
                    {(addUserError || updateUserError) && <div className="text-red-500 text-sm mt-1">{addUserError || updateUserError}</div>}
                  </div>
                  <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 mt-2" disabled={addUserLoading || updateUserLoading}>
                    {editMode ? (updateUserLoading ? 'Saving...' : 'Save Changes') : (addUserLoading ? 'Adding...' : 'Add User')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Summary Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col items-center p-6">
              <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Active Users</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeUsers}</div>
              <div className="text-xs text-gray-400 mt-1">Currently active</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col items-center p-6">
              <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl">🧑‍💼</span>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Admins</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{adminCount}</div>
              <div className="text-xs text-gray-400 mt-1">Admin team</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col items-center p-6">
              <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900">
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Finance Users</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{financeCount}</div>
              <div className="text-xs text-gray-400 mt-1">Finance team</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col items-center p-6">
              <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Other Users</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{otherCount}</div>
              <div className="text-xs text-gray-400 mt-1">Detail & Enroll teams</div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="finance">Finance</option>
                <option value="enroll">Enroll</option>
                <option value="details">Details</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">Loading users...</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No users found.</td>
                      </tr>
                    ) : filteredUsers.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {(user.fullName || user.name || '').split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.fullName || user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" onClick={() => handleEditUser(user)} type="button">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" onClick={() => handleOpenDeleteModal(user)} type="button">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-0 relative flex flex-col max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" onClick={handleCloseDeleteModal} aria-label="Close">
              <X className="w-6 h-6" />
            </button>
            <div className="px-8 pt-8 pb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete User</h2>
              <div className="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to delete <span className="font-semibold">{deleteUserName}</span>? This action cannot be undone.</div>
              {deleteUserError && <div className="text-red-500 text-sm mb-2">{deleteUserError}</div>}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={handleCloseDeleteModal} disabled={deleteUserLoading}>Cancel</button>
                <button type="button" className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60" onClick={handleConfirmDelete} disabled={deleteUserLoading}>
                  {deleteUserLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList; 