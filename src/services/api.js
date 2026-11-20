const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('adminToken'));
  },

  async verifyToken() {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeader()
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  // College Info
  async getCollegeInfo() {
    const res = await fetch(`${API_BASE}/college-info`);
    return res.json();
  },

  async updateCollegeInfo(info) {
    const res = await fetch(`${API_BASE}/college-info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(info)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update college profile');
    return data;
  },

  // Departments (ONLY 4: CSE, CE, ME, ECE)
  async getDepartments() {
    const res = await fetch(`${API_BASE}/departments`);
    return res.json();
  },

  async updateDepartment(id, data) {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update department');
    return result;
  },

  // Principal & Statutory Committees
  async getPrincipal() {
    const res = await fetch(`${API_BASE}/principal`);
    return res.json();
  },

  async updatePrincipal(info) {
    const res = await fetch(`${API_BASE}/principal`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(info)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update principal details');
    return data;
  },

  async uploadPrincipalPhoto(formData) {
    const res = await fetch(`${API_BASE}/principal/photo`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload principal photograph');
    return data;
  },

  async deletePrincipalPhoto() {
    const res = await fetch(`${API_BASE}/principal/photo`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove principal photograph');
    return data;
  },

  async getCommittees() {
    const res = await fetch(`${API_BASE}/committees`);
    return res.json();
  },

  async updateCommittees(info) {
    const res = await fetch(`${API_BASE}/committees`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(info)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update committee disclosures');
    return data;
  },

  // Subjects / Syllabus (C-25 vs C-20)
  async getSubjects(department = 'ALL', semester = null, scheme = null) {
    const params = new URLSearchParams();
    if (department && department !== 'ALL') params.append('department', department);
    if (semester && semester !== 'ALL') params.append('semester', semester);
    if (scheme && scheme !== 'ALL') params.append('scheme', scheme);

    const res = await fetch(`${API_BASE}/subjects?${params.toString()}`);
    return res.json();
  },

  async addSubject(subject) {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(subject)
    });
    return res.json();
  },

  async updateSubject(id, data) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteSubject(id) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  async uploadSubjectNotes(subjectId, formData) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/notes`, {
      method: 'POST',
      headers: getAuthHeader(), // Browser sets boundary for FormData
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload subject notes');
    return data;
  },

  async deleteSubjectNotes(subjectId) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/notes`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove subject notes');
    return data;
  },

  // Internal Marks PDFs
  async getInternalMarks(department = 'ALL', semester = 'ALL') {
    const params = new URLSearchParams();
    if (department && department !== 'ALL') params.append('department', department);
    if (semester && semester !== 'ALL') params.append('semester', semester);

    const res = await fetch(`${API_BASE}/internal-marks?${params.toString()}`);
    return res.json();
  },

  async getAdminInternalMarks(department = 'ALL', semester = 'ALL') {
    const params = new URLSearchParams();
    if (department && department !== 'ALL') params.append('department', department);
    if (semester && semester !== 'ALL') params.append('semester', semester);

    const res = await fetch(`${API_BASE}/admin/internal-marks?${params.toString()}`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async uploadInternalMarks(formData) {
    const res = await fetch(`${API_BASE}/internal-marks`, {
      method: 'POST',
      headers: getAuthHeader(), // Browser will auto-set multipart boundary
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload internal marks PDF');
    return data;
  },

  async updateInternalMarks(id, data) {
    const res = await fetch(`${API_BASE}/internal-marks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteInternalMarks(id) {
    const res = await fetch(`${API_BASE}/internal-marks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Notices
  async getNotices() {
    const res = await fetch(`${API_BASE}/notices`);
    return res.json();
  },

  async addNotice(notice) {
    const res = await fetch(`${API_BASE}/notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(notice)
    });
    return res.json();
  },

  async updateNotice(id, data) {
    const res = await fetch(`${API_BASE}/notices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteNotice(id) {
    const res = await fetch(`${API_BASE}/notices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Study Materials
  async getMaterials(department = 'ALL', semester = 'ALL', scheme = 'ALL') {
    const params = new URLSearchParams();
    if (department && department !== 'ALL') params.append('department', department);
    if (semester && semester !== 'ALL') params.append('semester', semester);
    if (scheme && scheme !== 'ALL') params.append('scheme', scheme);

    const res = await fetch(`${API_BASE}/materials?${params.toString()}`);
    return res.json();
  },

  async uploadMaterial(formData) {
    const res = await fetch(`${API_BASE}/materials`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload study material');
    return data;
  },

  async deleteMaterial(id) {
    const res = await fetch(`${API_BASE}/materials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // External Links
  async getExternalLinks() {
    const res = await fetch(`${API_BASE}/links`);
    return res.json();
  },

  async addExternalLink(link) {
    const res = await fetch(`${API_BASE}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(link)
    });
    return res.json();
  },

  async deleteExternalLink(id) {
    const res = await fetch(`${API_BASE}/links/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Gallery
  async getGallery() {
    const res = await fetch(`${API_BASE}/gallery`);
    return res.json();
  },

  async uploadGalleryPhoto(formData) {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload photograph');
    return data;
  },

  async deleteGalleryPhoto(id) {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Faculty
  async getFaculty(department = 'ALL') {
    const params = department && department !== 'ALL' ? `?department=${department}` : '';
    const res = await fetch(`${API_BASE}/faculty${params}`);
    return res.json();
  },

  async addFaculty(faculty) {
    const res = await fetch(`${API_BASE}/faculty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(faculty)
    });
    return res.json();
  },

  async updateFaculty(id, data) {
    const res = await fetch(`${API_BASE}/faculty/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteFaculty(id) {
    const res = await fetch(`${API_BASE}/faculty/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Academic Calendar
  async getCalendar() {
    const res = await fetch(`${API_BASE}/calendar`);
    return res.json();
  },

  async addCalendarEvent(event) {
    const res = await fetch(`${API_BASE}/calendar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(event)
    });
    return res.json();
  },

  async deleteCalendarEvent(id) {
    const res = await fetch(`${API_BASE}/calendar/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Timetables
  async getTimetables() {
    const res = await fetch(`${API_BASE}/timetables`);
    return res.json();
  },

  async saveTimetable(key, scheduleArray) {
    const res = await fetch(`${API_BASE}/timetables/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(scheduleArray)
    });
    return res.json();
  },

  // Admission Inquiries
  async submitInquiry(data) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getInquiries() {
    const res = await fetch(`${API_BASE}/inquiries`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async updateInquiryStatus(id, status) {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Admin Dashboard Stats
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Public Bundle
  async getPublicBundle() {
    const res = await fetch(`${API_BASE}/public-bundle`);
    if (!res.ok) throw new Error('Failed to load public data');
    return res.json();
  }
};
