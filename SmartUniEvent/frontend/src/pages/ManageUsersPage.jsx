import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

function ManageUsersPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ role: 'all', isVerified: 'all' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.role !== 'all') params.role = filter.role;
      if (filter.isVerified !== 'all') params.isVerified = filter.isVerified;

      const response = await adminAPI.getUsers(params);
      setUsers(response.data.users || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      fetchUsers();
      alert('User role updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleVerificationUpdate = async (userId, isVerified) => {
    try {
      await adminAPI.updateUser(userId, { isVerified });
      fetchUsers();
      alert('User verification status updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update verification status');
    }
  };

  const getFilteredUsers = () => {
    if (!searchTerm) return users;
    return users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 mb-2 text-warning">Manage Users</h1>
          <p className="text-light">View and manage registered users</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card mb-4 border-0" style={{backgroundColor: 'var(--surface-color)'}}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label text-light">Role</label>
              <select
                className="form-select"
                value={filter.role}
                onChange={(e) => setFilter({ ...filter, role: e.target.value })}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label text-light">Verification Status</label>
              <select
                className="form-select"
                value={filter.isVerified}
                onChange={(e) => setFilter({ ...filter, isVerified: e.target.value })}
              >
                <option value="all">All Users</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label text-light">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body">
              <h3 className="mb-0 text-warning">{users.length}</h3>
              <small className="text-light">Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body">
              <h3 className="mb-0 text-warning">{users.filter(u => u.isVerified).length}</h3>
              <small className="text-light">Verified</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body">
              <h3 className="mb-0 text-warning">{users.filter(u => u.role === 'admin').length}</h3>
              <small className="text-light">Admins</small>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
        <div className="card-header text-warning" style={{backgroundColor: '#2a2a2a', borderBottom: '2px solid var(--accent-color)'}}>
          <h5 className="mb-0">
            <i className="bi bi-people me-2"></i>
            Users List ({filteredUsers.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x display-1 text-muted"></i>
              <p className="mt-3 text-muted">No users found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="text-light">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="text-light">{user.email}</td>
                      <td className="text-light">{user.studentId || 'N/A'}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {user.isVerified ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>Verified
                          </span>
                        ) : (
                          <span className="badge bg-warning">
                            <i className="bi bi-exclamation-circle me-1"></i>Unverified
                          </span>
                        )}
                      </td>
                      <td className="text-light">
                        <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                      </td>
                      <td>
                        {!user.isVerified && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleVerificationUpdate(user.id, true)}
                            title="Verify User"
                          >
                            <i className="bi bi-check-circle"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsersPage;
