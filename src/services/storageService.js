import { initialData } from '../data/initialData';

const STORAGE_KEY = 'gpt_harihara_v5_c25';

export const storageService = {
  // Load full DB
  getDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
      }
      const parsed = JSON.parse(stored);
      // Ensure all required fields exist
      if (!parsed.subjects || !parsed.gallery || !parsed.principal) {
        const merged = { ...initialData, ...parsed };
        this.saveDatabase(merged);
        return merged;
      }
      return parsed;
    } catch (e) {
      console.error('Storage parse error, resetting to initialData', e);
      return initialData;
    }
  },

  // Save full DB
  saveDatabase(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('college-data-updated'));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  },

  // College Info
  getCollegeInfo() {
    return this.getDatabase().collegeInfo;
  },

  updateCollegeInfo(info) {
    const db = this.getDatabase();
    const existingStats = db.collegeInfo?.stats || {};
    const mergedStats = info.stats ? { ...existingStats, ...info.stats } : existingStats;
    db.collegeInfo = { ...db.collegeInfo, ...info, stats: mergedStats };
    this.saveDatabase(db);
    return db.collegeInfo;
  },

  // Principal & Committees
  getPrincipal() {
    return this.getDatabase().principal || initialData.principal;
  },

  updatePrincipal(info) {
    const db = this.getDatabase();
    db.principal = { ...(db.principal || initialData.principal), ...info };
    this.saveDatabase(db);
    return db.principal;
  },

  getCommittees() {
    return this.getDatabase().committees || initialData.committees;
  },

  updateCommittees(info) {
    const db = this.getDatabase();
    const current = db.committees || initialData.committees;
    db.committees = {
      antiRagging: { ...current.antiRagging, ...(info.antiRagging || {}) },
      icc: { ...current.icc, ...(info.icc || {}) },
      rti: { ...current.rti, ...(info.rti || {}) }
    };
    this.saveDatabase(db);
    return db.committees;
  },

  // Gallery
  getGallery() {
    return this.getDatabase().gallery || initialData.gallery;
  },

  // Internal Marks
  getInternalMarks() {
    return this.getDatabase().internalMarks || initialData.internalMarks || [];
  },

  // External Links
  getExternalLinks() {
    return this.getDatabase().externalLinks || initialData.externalLinks || [];
  },

  // Scholarships (SSP, Labour Card, Vidyasiri)
  getScholarships() {
    return this.getDatabase().scholarships || initialData.scholarships;
  },

  // Departments
  getDepartments() {
    return this.getDatabase().departments || [];
  },

  updateDepartment(id, updatedData) {
    const db = this.getDatabase();
    db.departments = (db.departments || []).map(d =>
      d.id === id ? { ...d, ...updatedData } : d
    );
    this.saveDatabase(db);
    return db.departments.find(d => d.id === id);
  },

  // Notices
  getNotices() {
    return this.getDatabase().notices || [];
  },

  addNotice(notice) {
    const db = this.getDatabase();
    const newNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: notice.date || new Date().toISOString().split('T')[0]
    };
    db.notices = [newNotice, ...db.notices];
    this.saveDatabase(db);
    return newNotice;
  },

  updateNotice(updatedNotice) {
    const db = this.getDatabase();
    db.notices = db.notices.map(n => n.id === updatedNotice.id ? updatedNotice : n);
    this.saveDatabase(db);
    return updatedNotice;
  },

  deleteNotice(id) {
    const db = this.getDatabase();
    db.notices = db.notices.filter(n => n.id !== id);
    this.saveDatabase(db);
  },

  // Subjects / Syllabus (Supports C-25 & C-20)
  getSubjects(department = 'ALL', semester = null, scheme = null) {
    const db = this.getDatabase();
    let list = db.subjects || [];
    if (department && department !== 'ALL') {
      list = list.filter(s => s.department === department || s.department === 'ALL');
    }
    if (semester) {
      list = list.filter(s => Number(s.semester) === Number(semester));
    }
    if (scheme) {
      list = list.filter(s => s.scheme?.includes(scheme));
    }
    return list;
  },

  addSubject(subject) {
    const db = this.getDatabase();
    const notesUrl = subject.notesUrl || subject.pdfUrl || '';
    const newSubject = {
      ...subject,
      id: `sub-${Date.now()}`,
      scheme: subject.scheme || 'C-25 Scheme',
      credits: Number(subject.credits || 4),
      semester: Number(subject.semester || 1),
      theoryHours: Number(subject.theoryHours || 3),
      practicalHours: Number(subject.practicalHours || 2),
      notesUrl: notesUrl,
      pdfUrl: notesUrl,
      notesFileName: subject.notesFileName || '',
      notesFileSize: subject.notesFileSize || '',
      notesTitle: subject.notesTitle || '',
      notesUploadedAt: subject.notesUploadedAt || (notesUrl ? new Date().toISOString() : '')
    };
    db.subjects = [newSubject, ...(db.subjects || [])];
    this.saveDatabase(db);
    return newSubject;
  },

  updateSubject(updatedSubject) {
    const db = this.getDatabase();
    const notesUrl = updatedSubject.notesUrl !== undefined 
      ? updatedSubject.notesUrl 
      : (updatedSubject.pdfUrl !== undefined ? updatedSubject.pdfUrl : undefined);
    db.subjects = (db.subjects || []).map(s => s.id === updatedSubject.id ? {
      ...s,
      ...updatedSubject,
      credits: Number(updatedSubject.credits ?? s.credits),
      semester: Number(updatedSubject.semester ?? s.semester),
      theoryHours: Number(updatedSubject.theoryHours ?? s.theoryHours),
      practicalHours: Number(updatedSubject.practicalHours ?? s.practicalHours),
      notesUrl: notesUrl !== undefined ? notesUrl : (s.notesUrl || s.pdfUrl || ''),
      pdfUrl: notesUrl !== undefined ? notesUrl : (s.notesUrl || s.pdfUrl || ''),
      notesFileName: updatedSubject.notesFileName !== undefined ? updatedSubject.notesFileName : (s.notesFileName || ''),
      notesFileSize: updatedSubject.notesFileSize !== undefined ? updatedSubject.notesFileSize : (s.notesFileSize || ''),
      notesTitle: updatedSubject.notesTitle !== undefined ? updatedSubject.notesTitle : (s.notesTitle || ''),
      notesUploadedAt: updatedSubject.notesUploadedAt !== undefined ? updatedSubject.notesUploadedAt : (s.notesUploadedAt || '')
    } : s);
    this.saveDatabase(db);
    return updatedSubject;
  },

  updateSubjectNotes(id, notesData) {
    const db = this.getDatabase();
    let updated = null;
    db.subjects = (db.subjects || []).map(s => {
      if (s.id === id) {
        const notesUrl = notesData.notesUrl || '';
        updated = {
          ...s,
          notesUrl: notesUrl,
          pdfUrl: notesUrl,
          notesFileName: notesData.notesFileName || '',
          notesFileSize: notesData.notesFileSize || '',
          notesTitle: notesData.notesTitle || '',
          notesUploadedAt: notesData.notesUploadedAt || (notesUrl ? new Date().toISOString() : '')
        };
        return updated;
      }
      return s;
    });
    this.saveDatabase(db);
    return updated;
  },

  deleteSubject(id) {
    const db = this.getDatabase();
    db.subjects = (db.subjects || []).filter(s => s.id !== id);
    this.saveDatabase(db);
  },

  // Timetable
  getTimetable(key = 'CO-Sem-5') {
    const db = this.getDatabase();
    return db.timetables?.[key] || [];
  },

  saveTimetable(key, scheduleArray) {
    const db = this.getDatabase();
    if (!db.timetables) db.timetables = {};
    db.timetables[key] = scheduleArray;
    this.saveDatabase(db);
  },

  // Academic Calendar
  getCalendarEvents() {
    const db = this.getDatabase();
    return db.academicCalendar || [];
  },

  addCalendarEvent(event) {
    const db = this.getDatabase();
    const newEvent = {
      ...event,
      id: `cal-${Date.now()}`
    };
    db.academicCalendar = [...db.academicCalendar, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date));
    this.saveDatabase(db);
    return newEvent;
  },

  deleteCalendarEvent(id) {
    const db = this.getDatabase();
    db.academicCalendar = db.academicCalendar.filter(e => e.id !== id);
    this.saveDatabase(db);
  },

  // Study Materials
  getStudyMaterials() {
    const db = this.getDatabase();
    return db.studyMaterials || [];
  },

  addStudyMaterial(mat) {
    const db = this.getDatabase();
    const newMat = {
      ...mat,
      id: `mat-${Date.now()}`,
      downloads: 0,
      date: mat.date || new Date().toISOString().split('T')[0]
    };
    db.studyMaterials = [newMat, ...db.studyMaterials];
    this.saveDatabase(db);
    return newMat;
  },

  deleteStudyMaterial(id) {
    const db = this.getDatabase();
    db.studyMaterials = db.studyMaterials.filter(m => m.id !== id);
    this.saveDatabase(db);
  },

  // Faculty
  getFaculty(dept = 'ALL') {
    const db = this.getDatabase();
    let list = db.faculty || [];
    if (dept && dept !== 'ALL') {
      list = list.filter(f => f.department === dept);
    }
    return list;
  },

  addFaculty(faculty) {
    const db = this.getDatabase();
    const newFac = {
      ...faculty,
      id: `fac-${Date.now()}`
    };
    db.faculty = [...db.faculty, newFac];
    this.saveDatabase(db);
    return newFac;
  },

  updateFaculty(updatedFaculty) {
    const db = this.getDatabase();
    db.faculty = db.faculty.map(f => f.id === updatedFaculty.id ? updatedFaculty : f);
    this.saveDatabase(db);
    return updatedFaculty;
  },

  deleteFaculty(id) {
    const db = this.getDatabase();
    db.faculty = db.faculty.filter(f => f.id !== id);
    this.saveDatabase(db);
  },

  // Inquiries
  getInquiries() {
    const db = this.getDatabase();
    return db.inquiries || [];
  },

  addInquiry(inquiry) {
    const db = this.getDatabase();
    const newInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    db.inquiries = [newInquiry, ...(db.inquiries || [])];
    this.saveDatabase(db);
    return newInquiry;
  },

  updateInquiryStatus(id, status) {
    const db = this.getDatabase();
    db.inquiries = db.inquiries.map(inq => inq.id === id ? { ...inq, status } : inq);
    this.saveDatabase(db);
  },

  // Backup & Restore
  exportDataJSON() {
    const data = this.getDatabase();
    return JSON.stringify(data, null, 2);
  },

  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.collegeInfo || !parsed.subjects) {
        throw new Error('Invalid college data format');
      }
      this.saveDatabase(parsed);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  resetDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    window.dispatchEvent(new Event('college-data-updated'));
    return initialData;
  }
};
