import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { dbManager } from './data/dbManager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'gpt-harihara-dte-secure-token-secret-2026';

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, 'uploads');
['marks', 'materials', 'gallery'].forEach(sub => {
  const p = path.join(uploadsDir, sub);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});
app.use('/uploads', express.static(uploadsDir));

// Rate limiter for admin login to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts per window per IP
  message: { 
    error: 'Too many login attempts. For security reasons, please try again in 15 minutes.' 
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Multer storage configuration for PDF files
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = req.baseUrl.includes('internal-marks') ? 'marks' : 'materials';
    const dest = path.join(uploadsDir, subfolder);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

// Multer storage configuration for Images (Gallery)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(uploadsDir, 'gallery');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-]/g, '_');
    cb(null, `${Date.now()}-${cleanName}${ext}`);
  }
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only official PDF documents are allowed!'), false);
    }
  }
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WebP images are allowed!'), false);
    }
  }
});

// Admin Authentication Middleware
export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Administrator authentication token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid authentication token. Please log in again.' });
  }
};

// ---------------------------------------------------------------------
// 1. AUTHENTICATION ROUTES
// ---------------------------------------------------------------------

// Admin Login
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const admin = dbManager.getAdmin();

  if (username.trim() !== admin.username) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  // Issue secure JWT token valid for 8 hours
  const token = jwt.sign(
    { username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    message: 'Authentication successful.',
    token,
    user: {
      username: admin.username,
      role: admin.role
    }
  });
});

// Verify current token
app.get('/api/auth/verify', requireAdminAuth, (req, res) => {
  res.json({
    valid: true,
    user: req.admin
  });
});

// Change Admin Password
app.post('/api/auth/change-password', requireAdminAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const admin = dbManager.getAdmin();
  const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Current password does not match.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  dbManager.updateAdminPassword(newHash);

  res.json({ message: 'Administrator password updated successfully.' });
});

// ---------------------------------------------------------------------
// 2. COLLEGE INFO & DEPARTMENTS (ONLY 4: CSE, CE, ME, ECE)
// ---------------------------------------------------------------------

app.get('/api/college-info', (req, res) => {
  res.json(dbManager.getCollegeInfo());
});

app.put('/api/college-info', requireAdminAuth, (req, res) => {
  const updated = dbManager.updateCollegeInfo(req.body);
  res.json(updated);
});

app.get('/api/departments', (req, res) => {
  res.json(dbManager.getDepartments());
});

app.put('/api/departments/:id', requireAdminAuth, (req, res) => {
  const updated = dbManager.updateDepartment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Department not found.' });
  res.json(updated);
});

// 2B. PRINCIPAL PROFILE, PHOTO & STATUTORY COMMITTEES
app.get('/api/principal', (req, res) => {
  res.json(dbManager.getPrincipal());
});

app.put('/api/principal', requireAdminAuth, (req, res) => {
  const updated = dbManager.updatePrincipal(req.body);
  res.json(updated);
});

app.post('/api/principal/photo', requireAdminAuth, uploadImage.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a valid JPG, PNG, or WebP photograph file.' });
    }

    const currentPrincipal = dbManager.getPrincipal();
    if (currentPrincipal?.photo && currentPrincipal.photo.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, currentPrincipal.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const photoUrl = `/uploads/gallery/${req.file.filename}`;
    const updated = dbManager.updatePrincipal({ photo: photoUrl });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to upload principal photograph' });
  }
});

app.delete('/api/principal/photo', requireAdminAuth, (req, res) => {
  try {
    const currentPrincipal = dbManager.getPrincipal();
    if (currentPrincipal?.photo && currentPrincipal.photo.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, currentPrincipal.photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const updated = dbManager.updatePrincipal({ photo: '' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove principal photograph' });
  }
});

app.get('/api/committees', (req, res) => {
  res.json(dbManager.getCommittees());
});

app.put('/api/committees', requireAdminAuth, (req, res) => {
  const updated = dbManager.updateCommittees(req.body);
  res.json(updated);
});

// ---------------------------------------------------------------------
// 3. SUBJECTS / SYLLABUS (C-25 & C-20 STRICT SEPARATION)
// ---------------------------------------------------------------------

app.get('/api/subjects', (req, res) => {
  const { department, semester, scheme } = req.query;
  const subjects = dbManager.getSubjects(department, semester, scheme);
  res.json(subjects);
});

app.post('/api/subjects', requireAdminAuth, (req, res) => {
  const { code, name, department, semester, scheme } = req.body;
  if (!code || !name) {
    return res.status(400).json({ error: 'Course code and name are required.' });
  }
  const created = dbManager.addSubject(req.body);
  res.status(201).json(created);
});

app.put('/api/subjects/:id', requireAdminAuth, (req, res) => {
  const updated = dbManager.updateSubject(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Subject not found.' });
  res.json(updated);
});

// Admin upload/update Subject Notes PDF
app.post('/api/subjects/:id/notes', requireAdminAuth, uploadPdf.single('pdf'), (req, res) => {
  try {
    const { id } = req.params;
    const { notesTitle, notesUrl: bodyNotesUrl } = req.body;

    const subjects = dbManager.getSubjects();
    const existing = subjects.find(s => s.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '';

    if (req.file) {
      fileUrl = `/uploads/materials/${req.file.filename}`;
      fileName = req.file.originalname;
      const bytes = req.file.size;
      fileSize = bytes > 1024 * 1024 
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(bytes / 1024)} KB`;
    } else if (bodyNotesUrl) {
      fileUrl = bodyNotesUrl;
      fileName = req.body.fileName || path.basename(bodyNotesUrl);
      fileSize = req.body.fileSize || 'PDF Document';
    } else {
      return res.status(400).json({ error: 'Please select a PDF notes document to upload or provide a notes URL.' });
    }

    // Clean up old uploaded file if replaced
    if (existing.notesUrl && existing.notesUrl.startsWith('/uploads/') && existing.notesUrl !== fileUrl) {
      const oldPath = path.join(__dirname, existing.notesUrl);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { console.error('Failed to unlink old notes:', e); }
      }
    }

    const updated = dbManager.updateSubjectNotes(id, {
      notesUrl: fileUrl,
      notesFileName: fileName,
      notesFileSize: fileSize,
      notesTitle: notesTitle || `${existing.name} Lecture Notes`,
      notesUploadedAt: new Date().toISOString()
    });

    res.json(updated);
  } catch (err) {
    console.error('Error uploading subject notes:', err);
    res.status(500).json({ error: err.message || 'Failed to upload subject notes' });
  }
});

// Admin delete Subject Notes
app.delete('/api/subjects/:id/notes', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const subjects = dbManager.getSubjects();
    const existing = subjects.find(s => s.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Subject not found.' });
    }

    if (existing.notesUrl && existing.notesUrl.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, existing.notesUrl);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (e) { console.error('Failed to unlink notes:', e); }
      }
    }

    const updated = dbManager.updateSubjectNotes(id, {
      notesUrl: '',
      notesFileName: '',
      notesFileSize: '',
      notesTitle: '',
      notesUploadedAt: ''
    });

    res.json({ message: 'Subject notes removed successfully.', subject: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to remove subject notes' });
  }
});

app.delete('/api/subjects/:id', requireAdminAuth, (req, res) => {
  const deleted = dbManager.deleteSubject(req.params.id);
  if (deleted && deleted.notesUrl && deleted.notesUrl.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, deleted.notesUrl);
    if (fs.existsSync(fullPath)) {
      try { fs.unlinkSync(fullPath); } catch (e) { console.error(e); }
    }
  }
  res.json({ message: 'Subject deleted successfully.' });
});

// ---------------------------------------------------------------------
// 4. SEMESTER-WISE INTERNAL MARKS (CIE) PDF UPLOADS
// ---------------------------------------------------------------------

// Student / Public endpoint: returns published internal marks
app.get('/api/internal-marks', (req, res) => {
  const { department, semester } = req.query;
  let marks = dbManager.getInternalMarks(department, semester);
  // Filter out unpublished for public students
  marks = marks.filter(m => m.published !== false);
  res.json(marks);
});

// Admin endpoint: returns all marks (published & unpublished)
app.get('/api/admin/internal-marks', requireAdminAuth, (req, res) => {
  const { department, semester } = req.query;
  const marks = dbManager.getInternalMarks(department, semester);
  res.json(marks);
});

// Admin upload new Internal Marks PDF
app.post('/api/internal-marks', requireAdminAuth, uploadPdf.single('pdf'), (req, res) => {
  try {
    const { department, semester, subjectName, examName, examDate, description, published } = req.body;

    if (!department || !semester || !examName) {
      return res.status(400).json({ error: 'Department, semester, and exam name are required.' });
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '';

    if (req.file) {
      fileUrl = `/uploads/marks/${req.file.filename}`;
      fileName = req.file.originalname;
      const bytes = req.file.size;
      fileSize = bytes > 1024 * 1024 
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(bytes / 1024)} KB`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || 'Internal_Marks.pdf';
      fileSize = req.body.fileSize || 'PDF';
    } else {
      return res.status(400).json({ error: 'Please select a PDF file to upload.' });
    }

    const newMarks = dbManager.addInternalMarks({
      department,
      semester: Number(semester),
      subjectName: subjectName || 'All Subjects / Continuous Evaluation',
      examName,
      examDate: examDate || new Date().toISOString().split('T')[0],
      description: description || '',
      fileUrl,
      fileName,
      fileSize,
      published: published !== 'false' && published !== false
    });

    res.status(201).json(newMarks);
  } catch (err) {
    console.error('Upload internal marks error:', err);
    res.status(500).json({ error: err.message || 'Failed to process file upload.' });
  }
});

app.put('/api/internal-marks/:id', requireAdminAuth, (req, res) => {
  const updated = dbManager.updateInternalMarks(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Marks entry not found.' });
  res.json(updated);
});

app.delete('/api/internal-marks/:id', requireAdminAuth, (req, res) => {
  const deleted = dbManager.deleteInternalMarks(req.params.id);
  if (deleted && deleted.fileUrl && deleted.fileUrl.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, deleted.fileUrl);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  res.json({ message: 'Internal marks entry and file deleted.' });
});

// ---------------------------------------------------------------------
// 5. NOTICES & CIRCULARS
// ---------------------------------------------------------------------

app.get('/api/notices', (req, res) => {
  res.json(dbManager.getNotices());
});

app.post('/api/notices', requireAdminAuth, (req, res) => {
  const { title, category, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Notice title is required.' });
  const created = dbManager.addNotice(req.body);
  res.status(201).json(created);
});

app.put('/api/notices/:id', requireAdminAuth, (req, res) => {
  const updated = dbManager.updateNotice(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Notice not found.' });
  res.json(updated);
});

app.delete('/api/notices/:id', requireAdminAuth, (req, res) => {
  dbManager.deleteNotice(req.params.id);
  res.json({ message: 'Notice deleted successfully.' });
});

// ---------------------------------------------------------------------
// 6. STUDY MATERIALS & QUESTION BANKS
// ---------------------------------------------------------------------

app.get('/api/materials', (req, res) => {
  const { department, semester, scheme } = req.query;
  res.json(dbManager.getStudyMaterials(department, semester, scheme));
});

app.post('/api/materials', requireAdminAuth, uploadPdf.single('pdf'), (req, res) => {
  try {
    const { title, department, semester, scheme, subject, type } = req.body;
    if (!title || !department) {
      return res.status(400).json({ error: 'Title and department are required.' });
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '';

    if (req.file) {
      fileUrl = `/uploads/materials/${req.file.filename}`;
      fileName = req.file.originalname;
      const bytes = req.file.size;
      fileSize = bytes > 1024 * 1024 
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(bytes / 1024)} KB`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || 'Document.pdf';
      fileSize = req.body.fileSize || 'PDF';
    } else {
      return res.status(400).json({ error: 'Please upload a PDF document.' });
    }

    const created = dbManager.addStudyMaterial({
      title,
      department,
      semester: Number(semester || 1),
      scheme: scheme || 'C-25',
      subject: subject || 'Technical Subject',
      type: type || 'Lecture Notes',
      fileUrl,
      fileName,
      fileSize
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/materials/:id', requireAdminAuth, (req, res) => {
  const deleted = dbManager.deleteStudyMaterial(req.params.id);
  if (deleted && deleted.fileUrl && deleted.fileUrl.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, deleted.fileUrl);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  res.json({ message: 'Study material deleted.' });
});

// ---------------------------------------------------------------------
// 7. EXTERNAL USEFUL LINKS
// ---------------------------------------------------------------------

app.get('/api/links', (req, res) => {
  res.json(dbManager.getExternalLinks());
});

app.post('/api/links', requireAdminAuth, (req, res) => {
  const { title, url, category, description } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Title and URL are required.' });
  const created = dbManager.addExternalLink(req.body);
  res.status(201).json(created);
});

app.delete('/api/links/:id', requireAdminAuth, (req, res) => {
  dbManager.deleteExternalLink(req.params.id);
  res.json({ message: 'External link deleted.' });
});

// ---------------------------------------------------------------------
// 8. COLLEGE PHOTO GALLERY (Admin Updatable)
// ---------------------------------------------------------------------

app.get('/api/gallery', (req, res) => {
  res.json(dbManager.getGallery());
});

app.post('/api/gallery', requireAdminAuth, uploadImage.single('image'), (req, res) => {
  try {
    const { title, category, caption } = req.body;
    if (!title) return res.status(400).json({ error: 'Photo title is required.' });

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/gallery/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ error: 'Please select an image file to upload.' });
    }

    const created = dbManager.addGalleryItem({
      title,
      category: category || 'Campus',
      caption: caption || '',
      imageUrl
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', requireAdminAuth, (req, res) => {
  const deleted = dbManager.deleteGalleryItem(req.params.id);
  if (deleted && deleted.imageUrl && deleted.imageUrl.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, deleted.imageUrl);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  res.json({ message: 'Gallery item deleted.' });
});

// ---------------------------------------------------------------------
// 9. FACULTY, CALENDAR & TIMETABLES
// ---------------------------------------------------------------------

app.get('/api/faculty', (req, res) => {
  res.json(dbManager.getFaculty(req.query.department));
});

app.post('/api/faculty', requireAdminAuth, (req, res) => {
  const created = dbManager.addFaculty(req.body);
  res.status(201).json(created);
});

app.put('/api/faculty/:id', requireAdminAuth, (req, res) => {
  const updated = dbManager.updateFaculty(req.params.id, req.body);
  res.json(updated);
});

app.delete('/api/faculty/:id', requireAdminAuth, (req, res) => {
  dbManager.deleteFaculty(req.params.id);
  res.json({ message: 'Faculty member removed.' });
});

app.get('/api/calendar', (req, res) => {
  res.json(dbManager.getCalendar());
});

app.post('/api/calendar', requireAdminAuth, (req, res) => {
  const created = dbManager.addCalendarEvent(req.body);
  res.status(201).json(created);
});

app.delete('/api/calendar/:id', requireAdminAuth, (req, res) => {
  dbManager.deleteCalendarEvent(req.params.id);
  res.json({ message: 'Calendar event removed.' });
});

app.get('/api/timetables', (req, res) => {
  res.json(dbManager.getTimetables());
});

app.put('/api/timetables/:key', requireAdminAuth, (req, res) => {
  const saved = dbManager.saveTimetable(req.params.key, req.body);
  res.json(saved);
});

// ---------------------------------------------------------------------
// 10. ADMISSION INQUIRIES
// ---------------------------------------------------------------------

app.post('/api/inquiries', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required.' });
  const created = dbManager.addInquiry(req.body);
  res.status(201).json({ message: 'Inquiry submitted successfully.', inquiry: created });
});

app.get('/api/inquiries', requireAdminAuth, (req, res) => {
  res.json(dbManager.getInquiries());
});

app.put('/api/inquiries/:id', requireAdminAuth, (req, res) => {
  dbManager.updateInquiryStatus(req.params.id, req.body.status);
  res.json({ message: 'Status updated.' });
});

// ---------------------------------------------------------------------
// 11. ADMIN DASHBOARD STATS
// ---------------------------------------------------------------------

app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  res.json(dbManager.getStats());
});

// ---------------------------------------------------------------------
// 12. PUBLIC BUNDLE (Single-request sync for fast frontend hydration)
// ---------------------------------------------------------------------
app.get('/api/public-bundle', (req, res) => {
  try {
    const db = dbManager.read();
    // Exclude admin credentials and sensitive inquiries
    const { admin, inquiries, ...publicData } = db;
    if (Array.isArray(publicData.internalMarks)) {
      publicData.internalMarks = publicData.internalMarks.filter(m => m.published !== false);
    }
    res.json(publicData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve public data bundle' });
  }
});

// ---------------------------------------------------------------------
// PRODUCTION SERVING: Serve built React frontend if in production
// ---------------------------------------------------------------------
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    // If not an API route or uploads, serve index.html for React SPA router
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GPT Harihara Portal Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔐 Admin login username: ${dbManager.getAdmin().username}`);
});
