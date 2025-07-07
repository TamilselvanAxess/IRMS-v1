import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Plus, Calendar, MapPin, Award, Clock, Edit2, Trash2, Filter, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Card, Table } from '../../components/common';
import {
  fetchParticipants,
  selectParticipants,
  selectParticipantsLoading,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  selectAddParticipantLoading,
  selectAddParticipantError,
  selectAddParticipantSuccess,
  selectUpdateParticipantLoading,
  selectUpdateParticipantError,
  selectUpdateParticipantSuccess,
  selectDeleteParticipantLoading,
  selectDeleteParticipantError,
  selectDeleteParticipantSuccess,
  clearAddParticipantState,
  clearUpdateParticipantState,
  clearDeleteParticipantState,
} from '../../store/slices/participantsSlice';

const Participants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const dispatch = useAppDispatch();
  const participants = useAppSelector(selectParticipants);
  const loading = useAppSelector(selectParticipantsLoading);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', empId: '', status: 'active' });
  const [editMode, setEditMode] = useState(false);
  const [editParticipantId, setEditParticipantId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteParticipantId, setDeleteParticipantId] = useState(null);
  const [deleteParticipantName, setDeleteParticipantName] = useState('');
  const addParticipantLoading = useAppSelector(selectAddParticipantLoading);
  const addParticipantError = useAppSelector(selectAddParticipantError);
  const addParticipantSuccess = useAppSelector(selectAddParticipantSuccess);
  const updateParticipantLoading = useAppSelector(selectUpdateParticipantLoading);
  const updateParticipantError = useAppSelector(selectUpdateParticipantError);
  const updateParticipantSuccess = useAppSelector(selectUpdateParticipantSuccess);
  const deleteParticipantLoading = useAppSelector(selectDeleteParticipantLoading);
  const deleteParticipantError = useAppSelector(selectDeleteParticipantError);
  const deleteParticipantSuccess = useAppSelector(selectDeleteParticipantSuccess);
  const [empIdNumber, setEmpIdNumber] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchParticipants({ search: searchTerm, status: selectedStatus }));
  }, [dispatch, searchTerm, selectedStatus]);

  const filteredParticipants = participants; // Already filtered by backend

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleColor = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'trainer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'proxy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'referrer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'agent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Stats
  const activeCount = participants.filter(p => p.status === 'active').length;
  const inactiveCount = participants.filter(p => p.status === 'inactive').length;
  const agentCount = participants.filter(p => (p.role || '').toLowerCase() === 'agent').length;

  // Table columns definition
  const tableColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: '200px',
      render: (value) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {(value || '').split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {value}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      width: '140px',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(value)} max-w-full truncate`} title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'empId',
      label: 'Emp ID',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="font-mono text-sm text-blue-600 dark:text-blue-400">{value}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      width: '100px',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" 
            title="Edit" 
            onClick={() => handleEditParticipant(row)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" 
            title="Delete" 
            onClick={() => handleOpenDeleteModal(row)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmpIdNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    setEmpIdNumber(value);
    setForm((prev) => ({ ...prev, empId: getEmpIdPrefix(form.role) + value }));
  };

  const getEmpIdPrefix = (role) => {
    switch (role) {
      case 'trainer': return 'TR';
      case 'proxy': return 'PX';
      case 'referrer': return 'RF';
      case 'agent': return 'AG';
      default: return '';
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (editMode && editParticipantId) {
      dispatch(updateParticipant({ participantId: editParticipantId, participantData: form }));
    } else {
      dispatch(addParticipant(form));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditParticipantId(null);
    dispatch(clearAddParticipantState());
    dispatch(clearUpdateParticipantState());
    setForm({ name: '', role: '', empId: '', status: 'active' });
  };

  useEffect(() => {
    if (addParticipantSuccess || updateParticipantSuccess) {
      handleCloseModal();
      dispatch(fetchParticipants({ search: searchTerm, status: selectedStatus }));
    }
  }, [addParticipantSuccess, updateParticipantSuccess, dispatch]);

  const handleOpenModal = () => {
    setShowModal(true);
    setEditMode(false);
    setEditParticipantId(null);
    dispatch(clearAddParticipantState());
    dispatch(clearUpdateParticipantState());
    setForm({ name: '', role: '', empId: '', status: 'active' });
  };

  const handleEditParticipant = (participant) => {
    setShowModal(true);
    setEditMode(true);
    setEditParticipantId(participant._id);
    dispatch(clearAddParticipantState());
    dispatch(clearUpdateParticipantState());
    setForm({
      name: participant.name || '',
      role: participant.role || '',
      empId: participant.empId || '',
      status: participant.status || 'active',
    });
  };

  const handleOpenDeleteModal = (participant) => {
    setShowDeleteModal(true);
    setDeleteParticipantId(participant._id);
    setDeleteParticipantName(participant.name || '');
    dispatch(clearDeleteParticipantState());
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteParticipantId(null);
    setDeleteParticipantName('');
    dispatch(clearDeleteParticipantState());
  };

  const handleConfirmDelete = () => {
    if (deleteParticipantId) {
      dispatch(deleteParticipant(deleteParticipantId));
    }
  };

  useEffect(() => {
    if (deleteParticipantSuccess) {
      handleCloseDeleteModal();
      dispatch(fetchParticipants({ search: searchTerm, status: selectedStatus }));
    }
  }, [deleteParticipantSuccess, dispatch]);

  useEffect(() => {
    // Reset empIdNumber if role changes
    setEmpIdNumber('');
    setForm((prev) => ({ ...prev, empId: '' }));
  }, [form.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <span className="text-lg text-gray-600 dark:text-gray-400">Loading participants...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Participants
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Manage system participants and their roles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm" 
              onClick={handleOpenModal}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Participant
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Participants',
              value: participants.length.toLocaleString(),
              icon: '👥',
              color: 'blue'
            },
            {
              title: 'Active',
              value: activeCount.toLocaleString(),
              icon: '✅',
              color: 'green'
            },
            {
              title: 'Inactive',
              value: inactiveCount.toLocaleString(),
              icon: '⏸️',
              color: 'gray'
            },
            {
              title: 'Agents',
              value: agentCount.toLocaleString(),
              icon: '🕐',
              color: 'yellow'
            }
          ].map((card, index) => {
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900',
              green: 'bg-green-100 dark:bg-green-900',
              gray: 'bg-gray-100 dark:bg-gray-700',
              yellow: 'bg-yellow-100 dark:bg-yellow-900'
            };
            const textColorClasses = {
              blue: 'text-blue-600 dark:text-blue-400',
              green: 'text-green-600 dark:text-green-400',
              gray: 'text-gray-600 dark:text-gray-300',
              yellow: 'text-yellow-600 dark:text-yellow-400'
            };
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col items-center p-6">
                <div className={`mb-2 flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses[card.color]}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{card.title}</div>
                <div className={`text-2xl font-bold ${textColorClasses[card.color]}`}>{card.value}</div>
                <div className="text-xs text-gray-400 mt-1">All registered</div>
              </div>
            );
          })}
        </div>

        {/* Participants Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden w-full">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Participants</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">System participants and their information</div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="px-4 sm:px-6 pb-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="min-h-[400px] sm:min-h-[500px] pb-4 sm:pb-6 w-full">
            <Table
              data={currentParticipants}
              columns={tableColumns}
              variant="default"
              sortable={true}
              pagination={false}
              loading={loading}
              emptyMessage="No participants found."
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Participant Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-0 relative flex flex-col max-h-[90vh] overflow-y-auto">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" onClick={handleCloseModal} aria-label="Close">
                <span className="text-xl">×</span>
              </button>
              <div className="flex items-center gap-2 px-8 pt-8 pb-2">
                <UserCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editMode ? 'Edit Participant' : 'Add New Participant'}</h2>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 mx-8 mb-2" />
              <form onSubmit={handleModalSubmit} className="flex-1 flex flex-col justify-between px-8 pb-8 pt-2 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="participant-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input id="participant-name" type="text" name="name" value={form.name} onChange={handleInputChange} required className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none" placeholder="Enter name" autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor="participant-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select id="participant-role" name="role" value={form.role} onChange={handleInputChange} required className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none">
                      <option value="">Select role</option>
                      <option value="trainer">Trainer</option>
                      <option value="proxy">Proxy</option>
                      <option value="referrer">Referrer</option>
                      <option value="agent">Agent</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="participant-empId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emp ID</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={getEmpIdPrefix(form.role)}
                        readOnly
                        className="w-14 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm px-3 py-2 outline-none text-center font-semibold"
                        tabIndex={-1}
                      />
                      <input
                        id="participant-empId"
                        type="text"
                        name="empIdNumber"
                        value={empIdNumber}
                        onChange={handleEmpIdNumberChange}
                        required={!!form.role}
                        minLength={4}
                        maxLength={4}
                        pattern="\\d{4}"
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none"
                        placeholder="Enter 4 digit number"
                        autoComplete="off"
                        disabled={!form.role}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Employee ID must be unique. Suggested format: {form.role ? getEmpIdPrefix(form.role) + '1234' : 'Select role first'}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="participant-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select id="participant-status" name="status" value={form.status} onChange={handleInputChange} required className="mt-0 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 px-3 py-2 outline-none">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div style={{ minHeight: '24px' }} className="mb-1">
                  {(addParticipantError || updateParticipantError) && <div className="text-red-500 text-sm mt-1">{addParticipantError || updateParticipantError}</div>}
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60 mt-2" disabled={addParticipantLoading || updateParticipantLoading}>
                  {editMode ? (updateParticipantLoading ? 'Saving...' : 'Save Changes') : (addParticipantLoading ? 'Adding...' : 'Add Participant')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Participant Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-0 relative flex flex-col max-h-[90vh] overflow-y-auto">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors" onClick={handleCloseDeleteModal} aria-label="Close">
                <span className="text-xl">×</span>
              </button>
              <div className="flex items-center gap-2 px-8 pt-8 pb-2">
                <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Participant</h2>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 mx-8 mb-2" />
              <div className="px-8 pb-8 pt-2">
                <p className="text-gray-700 dark:text-gray-300 mb-4">Are you sure you want to delete <span className="font-semibold">{deleteParticipantName}</span>?</p>
                {deleteParticipantError && <div className="text-red-500 text-sm mb-2">{deleteParticipantError}</div>}
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" onClick={handleCloseDeleteModal} disabled={deleteParticipantLoading}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors" onClick={handleConfirmDelete} disabled={deleteParticipantLoading}>{deleteParticipantLoading ? 'Deleting...' : 'Delete'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants; 