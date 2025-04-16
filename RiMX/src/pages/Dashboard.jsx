import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building,
  Trash2,
  Loader2,
  Check,
  X,
  Edit,
  Plus,
  RefreshCw,
  ArrowLeft,
  Clock,
  Settings,
  User,
  Shield,
  Briefcase,
  LogOut,
  FolderPlus,
  Zap,
  AlertTriangle,
  Mail,
  ClipboardList,
  FileText,
  CheckCircle,
  AlertCircle,
  Send,
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { 
  fetchTasks, 
  submitReport, 
  clearApiStatus, 
  fetchReports,
  updateTaskStatus,
  deleteTask
} from '../features/dashboard/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { tasks, loading, apiStatus, reports } = useSelector((state) => state.dashboard);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    taskId: '',
    description: '',
    status: 'success'
  });
  const [expandedTask, setExpandedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'tasks' || activeTab === 'overview') {
      dispatch(fetchTasks(userId));
    } 
    if (activeTab === 'reports' || activeTab === 'overview') {
      dispatch(fetchReports());
    }
  }, [dispatch, userId, activeTab]);

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportData({
      ...reportData,
      [name]: value
    });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await dispatch(submitReport({ ...reportData, userId })).unwrap();
      setReportData({ title: '', taskId: '', description: '', status: 'success' });
      setShowReportForm(false);
      dispatch(clearApiStatus());
      dispatch(fetchReports());
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap();
      dispatch(fetchTasks(userId));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const confirmDeleteTask = async () => {
    try {
      await dispatch(deleteTask(taskToDelete)).unwrap();
      dispatch(fetchTasks(userId));
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const StatusMessage = ({ type, message }) => {
    if (!message) return null;

    const bgColors = {
      success: 'bg-green-500/10 border-green-500/20 text-green-400',
      error: 'bg-red-500/10 border-red-500/20 text-red-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 p-4 rounded-lg border ${bgColors[type]} flex items-center`}
      >
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 mr-3" />
        ) : (
          <AlertCircle className="h-5 w-5 mr-3" />
        )}
        <span>{message}</span>
      </motion.div>
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in progress':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressPercentage = (task) => {
    if (task.status === 'Completed') return 100;
    if (task.status === 'Failed') return 0;
    return task.progress || 0;
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.organization?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.organization?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800/50 border-r border-gray-700 backdrop-blur-sm z-20">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">RiMX</h1>
              <p className="text-xs text-gray-400">Task Management</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'tasks', icon: ClipboardList, label: 'Tasks' },
            { id: 'reports', icon: FileText, label: 'Reports' },
            { id: 'analytics', icon: BarChart2, label: 'Analytics' },
            { id: 'calendar', icon: Calendar, label: 'Calendar' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-3" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-10 bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <Mail className="h-5 w-5 text-gray-400" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-medium">
                  {userId?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Status Messages */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4">
          <StatusMessage type={apiStatus.type} message={apiStatus.message} />
        </div>

        {/* Main Content Area */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                          <h3 className="text-2xl font-bold mt-1 text-white">{tasks.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <ClipboardList className="h-6 w-6 text-blue-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">Completed</p>
                          <h3 className="text-2xl font-bold mt-1 text-white">{taskStatusCounts['Completed'] || 0}</h3>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">In Progress</p>
                          <h3 className="text-2xl font-bold mt-1 text-white">{taskStatusCounts['In Progress'] || 0}</h3>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          <Activity className="h-6 w-6 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">Reports</p>
                          <h3 className="text-2xl font-bold mt-1 text-white">{reports.length}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <FileText className="h-6 w-6 text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Tasks and Reports */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Tasks */}
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
                        <button 
                          onClick={() => setActiveTab('tasks')}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {tasks.slice(0, 5).map(task => (
                          <div key={task._id} className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-white">{task.title}</h4>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {task.organization?.name || 'No Organization'}
                              </span>
                              <div className="w-24 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getStatusColor(task.status)}`}
                                  style={{ width: `${getProgressPercentage(task)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
                        <button 
                          onClick={() => setActiveTab('reports')}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {reports.slice(0, 5).map(report => (
                          <div key={report._id} className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-white">{report.title}</h4>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{report.description}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                report.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {report.status}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {report.taskId?.title || 'No Task'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">Task Management</h2>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search tasks..."
                            className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => setShowReportForm(true)}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors whitespace-nowrap"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Report
                        </button>
                      </div>
                    </div>

                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-12">
                        <ClipboardList className="mx-auto h-12 w-12 text-gray-500" />
                        <h3 className="mt-4 text-lg font-medium text-white">No Tasks Found</h3>
                        <p className="mt-1 text-gray-400">You currently have no tasks assigned</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-700/50 rounded-lg text-sm font-medium text-gray-400">
                          <div className="col-span-5">Task</div>
                          <div className="col-span-2">Organization</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-2">Progress</div>
                          <div className="col-span-1">Actions</div>
                        </div>

                        {filteredTasks.map(task => (
                          <motion.div
                            key={task._id}
                            whileHover={{ scale: 1.005 }}
                            className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-all"
                          >
                            <div className="col-span-5">
                              <h3 className="font-medium text-white">{task.title}</h3>
                              <p className="text-sm text-gray-400 line-clamp-1">{task.description}</p>
                            </div>
                            <div className="col-span-2 text-sm text-gray-300">
                              {task.organization?.name || 'None'}
                            </div>
                            <div className="col-span-2">
                              <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getStatusColor(task.status)}`}
                                  style={{ width: `${getProgressPercentage(task)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400 mt-1 block">{getProgressPercentage(task)}%</span>
                            </div>
                            <div className="col-span-1 flex justify-end space-x-2">
                              <button
                                onClick={() => toggleTaskExpand(task._id)}
                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                                title="View Details"
                              >
                                {expandedTask === task._id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </div>

                            <AnimatePresence>
                              {expandedTask === task._id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="col-span-12 pt-4 mt-2 border-t border-gray-600"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-400 mb-2">Details</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                                          <span className="text-sm text-gray-300">{task.organization?.name || 'None'}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Shield className="h-4 w-4 text-gray-400 mr-2" />
                                          <span className="text-sm text-gray-300">{task.role || 'None'}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                                          <span className="text-sm text-gray-300">{task.department?.name || 'None'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-400 mb-2">Update Status</h4>
                                      <div className="space-y-3">
                                        <select
                                          value={selectedStatus}
                                          onChange={(e) => {
                                            setSelectedStatus(e.target.value);
                                            handleStatusUpdate(task._id, e.target.value);
                                          }}
                                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                                        >
                                          <option value="">Select Status</option>
                                          <option value="pending">Pending</option>
                                          <option value="in-progress">In Progress</option>
                                          <option value="completed">Completed</option>
                                          <option value="failed">Failed</option>
                                        </select>

                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() => {
                                              setReportData(prev => ({
                                                ...prev,
                                                taskId: task._id,
                                                title: `Report for ${task.title}`
                                              }));
                                              setShowReportForm(true);
                                            }}
                                            className="px-3 py-1.5 text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md hover:bg-blue-500/20 transition-colors"
                                          >
                                            Create Report
                                          </button>
                                          <button
                                            onClick={() => {
                                              setTaskToDelete(task._id);
                                              setShowDeleteConfirm(true);
                                            }}
                                            className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                                      <p className="text-sm text-gray-300">{task.description}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">Task Reports</h2>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search reports..."
                            className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => setShowReportForm(true)}
                          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors whitespace-nowrap"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Report
                        </button>
                      </div>
                    </div>

                    {filteredReports.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-500" />
                        <h3 className="mt-4 text-lg font-medium text-white">No Reports Found</h3>
                        <p className="mt-1 text-gray-400">Submit your first report for a task</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-700/50 rounded-lg text-sm font-medium text-gray-400">
                          <div className="col-span-4">Title</div>
                          <div className="col-span-3">Task</div>
                          <div className="col-span-2">Organization</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-1">Date</div>
                        </div>

                        {filteredReports.map(report => (
                          <motion.div
                            key={report._id}
                            whileHover={{ scale: 1.005 }}
                            className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-all"
                          >
                            <div className="col-span-4">
                              <h3 className="font-medium text-white">{report.title}</h3>
                              <p className="text-sm text-gray-400 line-clamp-1">{report.description}</p>
                            </div>
                            <div className="col-span-3 text-sm text-gray-300">
                              {report.taskId?.title || 'N/A'}
                            </div>
                            <div className="col-span-2 text-sm text-gray-300">
                              {report.organization?.name || 'N/A'}
                            </div>
                            <div className="col-span-2">
                              <span className={`px-3 py-1 text-xs rounded-full ${
                                report.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {report.status}
                              </span>
                            </div>
                            <div className="col-span-1 text-xs text-gray-400">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Task Analytics</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">Task Status Distribution</h3>
                      <div className="h-64">
                        {/* Placeholder for pie chart */}
                        <div className="flex items-center justify-center h-full bg-gray-700/50 rounded-lg">
                          <PieChart className="h-16 w-16 text-gray-400" />
                          <span className="ml-2 text-gray-400">Pie Chart Visualization</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Over Time */}
                    <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">Task Completion Trend</h3>
                      <div className="h-64">
                        {/* Placeholder for line chart */}
                        <div className="flex items-center justify-center h-full bg-gray-700/50 rounded-lg">
                          <Activity className="h-16 w-16 text-gray-400" />
                          <span className="ml-2 text-gray-400">Line Chart Visualization</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Report Statistics */}
                  <div className="mt-6 bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">Report Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                        <p className="text-sm font-medium text-gray-400">Total Reports</p>
                        <h4 className="text-2xl font-bold mt-1 text-white">{reports.length}</h4>
                      </div>
                      <div className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                        <p className="text-sm font-medium text-gray-400">Success Reports</p>
                        <h4 className="text-2xl font-bold mt-1 text-white">
                          {reports.filter(r => r.status === 'success').length}
                        </h4>
                      </div>
                      <div className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                        <p className="text-sm font-medium text-gray-400">Failure Reports</p>
                        <h4 className="text-2xl font-bold mt-1 text-white">
                          {reports.filter(r => r.status === 'failure').length}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Delete Task</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to permanently delete this task?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTask}
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Form Modal */}
      <AnimatePresence>
        {showReportForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  <FileText className="h-5 w-5 mr-2 inline" />
                  Submit Task Report
                </h3>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Report Title</label>
                    <input
                      type="text"
                      name="title"
                      value={reportData.title}
                      onChange={handleReportChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Related Task</label>
                    <select
                      name="taskId"
                      value={reportData.taskId}
                      onChange={handleReportChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                    >
                      <option value="">Select Task</option>
                      {tasks.map(task => (
                        <option key={task._id} value={task._id}>
                          {task.title} - {task.organization?.name || 'No Organization'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="success"
                        checked={reportData.status === 'success'}
                        onChange={handleReportChange}
                        className="text-green-500 border-gray-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-300">Success</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="failure"
                        checked={reportData.status === 'failure'}
                        onChange={handleReportChange}
                        className="text-red-500 border-gray-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-gray-300">Failure</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={reportData.description}
                    onChange={handleReportChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-6 py-3 text-gray-300 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;