import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialDatabase } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

class DatabaseManager {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      console.log('📦 Initializing fresh database with seed data...');
      this.write(initialDatabase);
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        let modified = false;
        if (!parsed.principal) {
          parsed.principal = initialDatabase.principal;
          modified = true;
        }
        if (!parsed.committees) {
          parsed.committees = initialDatabase.committees;
          modified = true;
        }
        if (modified) {
          this.write(parsed);
        }
      } catch (err) {
        console.error('⚠️ db.json was corrupted. Re-initializing with seed data...', err);
        this.write(initialDatabase);
      }
    }
  }

  read() {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading db.json, returning seed data', e);
      return initialDatabase;
    }
  }

  write(data) {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // Admin
  getAdmin() {
    return this.read().admin;
  }

  updateAdminPassword(passwordHash) {
    const db = this.read();
    db.admin.passwordHash = passwordHash;
    db.admin.updatedAt = new Date().toISOString();
    this.write(db);
    return true;
  }

  // College Info
  getCollegeInfo() {
    return this.read().collegeInfo;
  }

  updateCollegeInfo(info) {
    const db = this.read();
    const existingStats = db.collegeInfo?.stats || {};
    const mergedStats = info.stats ? { ...existingStats, ...info.stats } : existingStats;
    db.collegeInfo = { ...db.collegeInfo, ...info, stats: mergedStats };
    this.write(db);
    return db.collegeInfo;
  }

  // Principal & Statutory Committees
  getPrincipal() {
    return this.read().principal || initialDatabase.principal;
  }

  updatePrincipal(info) {
    const db = this.read();
    db.principal = { ...(db.principal || initialDatabase.principal), ...info };
    this.write(db);
    return db.principal;
  }

  getCommittees() {
    return this.read().committees || initialDatabase.committees;
  }

  updateCommittees(info) {
    const db = this.read();
    const current = db.committees || initialDatabase.committees;
    db.committees = {
      antiRagging: { ...current.antiRagging, ...(info.antiRagging || {}) },
      icc: { ...current.icc, ...(info.icc || {}) },
      rti: { ...current.rti, ...(info.rti || {}) }
    };
    this.write(db);
    return db.committees;
  }

  // Departments (ONLY 4: CSE, CE, ME, ECE)
  getDepartments() {
    return this.read().departments || [];
  }

  updateDepartment(id, updatedData) {
    const db = this.read();
    db.departments = (db.departments || []).map(d => 
      d.id === id ? { ...d, ...updatedData } : d
    );
    this.write(db);
    return db.departments.find(d => d.id === id);
  }

  // Subjects / Syllabus
  getSubjects(department, semester, scheme) {
    const db = this.read();
    let list = db.subjects || [];

    if (department && department !== 'ALL') {
      list = list.filter(s => s.department === department || s.department === 'ALL');
    }
    if (semester) {
      list = list.filter(s => Number(s.semester) === Number(semester));
    }
    if (scheme && scheme !== 'ALL') {
      list = list.filter(s => s.scheme === scheme);
    }
    return list;
  }

  addSubject(subject) {
    const db = this.read();
    const notesUrl = subject.notesUrl || subject.pdfUrl || '';
    const newSubject = {
      ...subject,
      id: `sub-${Date.now()}`,
      semester: Number(subject.semester || 1),
      credits: Number(subject.credits || 4),
      theoryHours: Number(subject.theoryHours || 3),
      practicalHours: Number(subject.practicalHours || 2),
      scheme: subject.scheme || 'C-25',
      notesUrl: notesUrl,
      pdfUrl: notesUrl,
      notesFileName: subject.notesFileName || (notesUrl ? path.basename(notesUrl) : ''),
      notesFileSize: subject.notesFileSize || '',
      notesTitle: subject.notesTitle || '',
      notesUploadedAt: subject.notesUploadedAt || (notesUrl ? new Date().toISOString() : ''),
      createdAt: new Date().toISOString()
    };
    db.subjects = [newSubject, ...(db.subjects || [])];
    this.write(db);
    return newSubject;
  }

  updateSubject(id, updatedData) {
    const db = this.read();
    db.subjects = (db.subjects || []).map(s => {
      if (s.id === id) {
        const notesUrl = updatedData.notesUrl !== undefined 
          ? updatedData.notesUrl 
          : (updatedData.pdfUrl !== undefined ? updatedData.pdfUrl : (s.notesUrl || s.pdfUrl || ''));
        return { 
          ...s, 
          ...updatedData,
          semester: Number(updatedData.semester ?? s.semester),
          credits: Number(updatedData.credits ?? s.credits),
          theoryHours: Number(updatedData.theoryHours ?? s.theoryHours),
          practicalHours: Number(updatedData.practicalHours ?? s.practicalHours),
          notesUrl: notesUrl,
          pdfUrl: notesUrl,
          notesFileName: updatedData.notesFileName !== undefined ? updatedData.notesFileName : (s.notesFileName || ''),
          notesFileSize: updatedData.notesFileSize !== undefined ? updatedData.notesFileSize : (s.notesFileSize || ''),
          notesTitle: updatedData.notesTitle !== undefined ? updatedData.notesTitle : (s.notesTitle || ''),
          notesUploadedAt: updatedData.notesUploadedAt !== undefined ? updatedData.notesUploadedAt : (s.notesUploadedAt || '')
        };
      }
      return s;
    });
    this.write(db);
    return db.subjects.find(s => s.id === id);
  }

  updateSubjectNotes(id, notesData) {
    const db = this.read();
    let updated = null;
    db.subjects = (db.subjects || []).map(s => {
      if (s.id === id) {
        const notesUrl = notesData.notesUrl || '';
        updated = {
          ...s,
          notesUrl: notesUrl,
          pdfUrl: notesUrl,
          notesFileName: notesData.notesFileName || (notesUrl ? path.basename(notesUrl) : ''),
          notesFileSize: notesData.notesFileSize || '',
          notesTitle: notesData.notesTitle || '',
          notesUploadedAt: notesData.notesUploadedAt || (notesUrl ? new Date().toISOString() : '')
        };
        return updated;
      }
      return s;
    });
    if (updated) {
      this.write(db);
    }
    return updated;
  }

  deleteSubject(id) {
    const db = this.read();
    const target = (db.subjects || []).find(s => s.id === id);
    db.subjects = (db.subjects || []).filter(s => s.id !== id);
    this.write(db);
    return target;
  }

  // Internal Marks PDFs
  getInternalMarks(department, semester) {
    const db = this.read();
    let list = db.internalMarks || [];

    if (department && department !== 'ALL') {
      list = list.filter(m => m.department === department);
    }
    if (semester && semester !== 'ALL') {
      list = list.filter(m => Number(m.semester) === Number(semester));
    }
    return list.sort((a, b) => new Date(b.createdAt || b.examDate) - new Date(a.createdAt || a.examDate));
  }

  addInternalMarks(data) {
    const db = this.read();
    const newEntry = {
      ...data,
      id: `marks-${Date.now()}`,
      semester: Number(data.semester || 1),
      published: data.published !== false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    db.internalMarks = [newEntry, ...(db.internalMarks || [])];
    this.write(db);
    return newEntry;
  }

  updateInternalMarks(id, updatedData) {
    const db = this.read();
    db.internalMarks = (db.internalMarks || []).map(m => 
      m.id === id ? { ...m, ...updatedData } : m
    );
    this.write(db);
    return db.internalMarks.find(m => m.id === id);
  }

  deleteInternalMarks(id) {
    const db = this.read();
    const target = (db.internalMarks || []).find(m => m.id === id);
    db.internalMarks = (db.internalMarks || []).filter(m => m.id !== id);
    this.write(db);
    return target;
  }

  // Notices
  getNotices() {
    const db = this.read();
    return db.notices || [];
  }

  addNotice(notice) {
    const db = this.read();
    const newNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: notice.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    db.notices = [newNotice, ...(db.notices || [])];
    this.write(db);
    return newNotice;
  }

  updateNotice(id, updatedData) {
    const db = this.read();
    db.notices = (db.notices || []).map(n => 
      n.id === id ? { ...n, ...updatedData } : n
    );
    this.write(db);
    return db.notices.find(n => n.id === id);
  }

  deleteNotice(id) {
    const db = this.read();
    db.notices = (db.notices || []).filter(n => n.id !== id);
    this.write(db);
    return true;
  }

  // Study Materials
  getStudyMaterials(department, semester, scheme) {
    const db = this.read();
    let list = db.studyMaterials || [];

    if (department && department !== 'ALL') {
      list = list.filter(m => m.department === department || m.department === 'ALL');
    }
    if (semester && semester !== 'ALL') {
      list = list.filter(m => Number(m.semester) === Number(semester));
    }
    if (scheme && scheme !== 'ALL') {
      list = list.filter(m => m.scheme === scheme);
    }
    return list;
  }

  addStudyMaterial(data) {
    const db = this.read();
    const newMat = {
      ...data,
      id: `mat-${Date.now()}`,
      semester: Number(data.semester || 1),
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    db.studyMaterials = [newMat, ...(db.studyMaterials || [])];
    this.write(db);
    return newMat;
  }

  deleteStudyMaterial(id) {
    const db = this.read();
    const target = (db.studyMaterials || []).find(m => m.id === id);
    db.studyMaterials = (db.studyMaterials || []).filter(m => m.id !== id);
    this.write(db);
    return target;
  }

  // External Useful Links
  getExternalLinks() {
    const db = this.read();
    return db.externalLinks || [];
  }

  addExternalLink(data) {
    const db = this.read();
    const newLink = {
      ...data,
      id: `link-${Date.now()}`,
      official: data.official !== false
    };
    db.externalLinks = [...(db.externalLinks || []), newLink];
    this.write(db);
    return newLink;
  }

  deleteExternalLink(id) {
    const db = this.read();
    db.externalLinks = (db.externalLinks || []).filter(l => l.id !== id);
    this.write(db);
    return true;
  }

  // Gallery (Real admin uploaded images)
  getGallery() {
    const db = this.read();
    return db.gallery || [];
  }

  addGalleryItem(item) {
    const db = this.read();
    const newItem = {
      ...item,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    db.gallery = [newItem, ...(db.gallery || [])];
    this.write(db);
    return newItem;
  }

  deleteGalleryItem(id) {
    const db = this.read();
    const target = (db.gallery || []).find(g => g.id === id);
    db.gallery = (db.gallery || []).filter(g => g.id !== id);
    this.write(db);
    return target;
  }

  // Faculty
  getFaculty(department) {
    const db = this.read();
    let list = db.faculty || [];
    if (department && department !== 'ALL') {
      list = list.filter(f => f.department === department);
    }
    return list;
  }

  addFaculty(faculty) {
    const db = this.read();
    const newFac = {
      ...faculty,
      id: `fac-${Date.now()}`
    };
    db.faculty = [...(db.faculty || []), newFac];
    this.write(db);
    return newFac;
  }

  updateFaculty(id, data) {
    const db = this.read();
    db.faculty = (db.faculty || []).map(f => f.id === id ? { ...f, ...data } : f);
    this.write(db);
    return db.faculty.find(f => f.id === id);
  }

  deleteFaculty(id) {
    const db = this.read();
    db.faculty = (db.faculty || []).filter(f => f.id !== id);
    this.write(db);
    return true;
  }

  // Academic Calendar
  getCalendar() {
    const db = this.read();
    return db.academicCalendar || [];
  }

  addCalendarEvent(event) {
    const db = this.read();
    const newEv = {
      ...event,
      id: `cal-${Date.now()}`
    };
    db.academicCalendar = [...(db.academicCalendar || []), newEv].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    this.write(db);
    return newEv;
  }

  deleteCalendarEvent(id) {
    const db = this.read();
    db.academicCalendar = (db.academicCalendar || []).filter(e => e.id !== id);
    this.write(db);
    return true;
  }

  // Timetables
  getTimetables() {
    const db = this.read();
    return db.timetables || {};
  }

  saveTimetable(key, scheduleArray) {
    const db = this.read();
    if (!db.timetables) db.timetables = {};
    db.timetables[key] = scheduleArray;
    this.write(db);
    return scheduleArray;
  }

  // Admission Inquiries
  getInquiries() {
    const db = this.read();
    return db.inquiries || [];
  }

  addInquiry(inquiry) {
    const db = this.read();
    const newInq = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    db.inquiries = [newInq, ...(db.inquiries || [])];
    this.write(db);
    return newInq;
  }

  updateInquiryStatus(id, status) {
    const db = this.read();
    db.inquiries = (db.inquiries || []).map(inq => inq.id === id ? { ...inq, status } : inq);
    this.write(db);
    return true;
  }

  // Overview stats for Admin Dashboard
  getStats() {
    const db = this.read();
    return {
      noticesCount: (db.notices || []).length,
      internalMarksCount: (db.internalMarks || []).length,
      studyMaterialsCount: (db.studyMaterials || []).length,
      subjectsCount: (db.subjects || []).length,
      inquiriesCount: (db.inquiries || []).length,
      galleryCount: (db.gallery || []).length,
      departmentsCount: (db.departments || []).length
    };
  }
}

export const dbManager = new DatabaseManager();
