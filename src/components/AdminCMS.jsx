import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  Save, 
  Download, 
  Upload, 
  RotateCcw,
  Bell, 
  BookOpen, 
  Calendar, 
  Users, 
  Inbox, 
  Settings,
  FileText,
  Search,
  ExternalLink,
  Image,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
  Building2,
  Building,
  Landmark,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  User,
  UserCheck,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminCMS({ isOpen, onClose, onDataChanged }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('internalMarks');

  // Admin Data state
  const [stats, setStats] = useState({});
  const [notices, setNotices] = useState([]);
  const [internalMarks, setInternalMarks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [links, setLinks] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [timetables, setTimetables] = useState({});

  // Notification toast message
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Form states
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Examination',
    urgent: false,
    description: '',
    attachmentUrl: ''
  });

  const [newMarks, setNewMarks] = useState({
    department: 'CSE',
    semester: 5,
    subjectName: '',
    examName: 'Internal Assessment 1 (CIE-1)',
    examDate: new Date().toISOString().split('T')[0],
    description: '',
    published: true
  });
  const [marksPdfFile, setMarksPdfFile] = useState(null);

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    department: 'CSE',
    semester: 5,
    scheme: 'C-25',
    subject: '',
    type: 'Lecture Notes'
  });
  const [materialPdfFile, setMaterialPdfFile] = useState(null);

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    category: 'Academic Portal',
    description: '',
    official: true
  });

  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Campus',
    caption: ''
  });
  const [photoImageFile, setPhotoImageFile] = useState(null);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // SUBJECTS STATE & FORMS
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    department: 'CSE',
    semester: 5,
    scheme: 'C-25',
    theoryHours: 3,
    practicalHours: 2,
    credits: 4,
    faculty: '',
    syllabusSummary: '',
    pdfUrl: ''
  });
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectNotesModal, setSubjectNotesModal] = useState(null);
  const [subjectFilterDept, setSubjectFilterDept] = useState('ALL');
  const [subjectFilterScheme, setSubjectFilterScheme] = useState('ALL');
  const [subjectFilterSem, setSubjectFilterSem] = useState('ALL');
  const [subjectSearch, setSubjectSearch] = useState('');

  // FACULTY STATE & FORMS
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    designation: 'Lecturer',
    department: 'CSE',
    qualification: '',
    experience: '',
    email: '',
    phone: '',
    specialization: ''
  });
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyFilterDept, setFacultyFilterDept] = useState('ALL');
  const [facultySearch, setFacultySearch] = useState('');

  // TIMETABLE STATE & FORMS
  const [selectedTtDept, setSelectedTtDept] = useState('CSE');
  const [selectedTtSem, setSelectedTtSem] = useState('5');
  const [selectedTtDay, setSelectedTtDay] = useState('Monday');
  const [newSlot, setNewSlot] = useState({
    time: '10:00 - 11:00',
    subject: '',
    room: 'Room 101',
    teacher: ''
  });

  // COLLEGE PROFILE & DEPARTMENT EDIT STATE
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [collegeProfileForm, setCollegeProfileForm] = useState({
    name: '',
    kannadaName: '',
    shortName: '',
    code: '',
    tagline: '',
    established: '',
    accreditation: '',
    examCenterCode: '',
    address: '',
    phone: '',
    email: '',
    admissionEmail: '',
    website: '',
    workingHours: '',
    stats: {
      students: '',
      faculty: '',
      labs: '',
      passRate: ''
    }
  });

  // PRINCIPAL & STATUTORY COMMITTEES STATE
  const [principalForm, setPrincipalForm] = useState({
    name: '',
    designation: '',
    qualification: '',
    experience: '',
    photo: '',
    message: '',
    vision: '',
    mission: ''
  });
  const [principalPhotoFile, setPrincipalPhotoFile] = useState(null);
  const [committeesForm, setCommitteesForm] = useState({
    antiRagging: { head: '', tollFree: '', phone: '', members: '' },
    icc: { presidingOfficer: '', members: '', email: '', phone: '' },
    rti: { pio: '', faa: '', office: '', phone: '' }
  });

  // Verify auth token on component open
  useEffect(() => {
    if (isOpen) {
      if (api.isAuthenticated()) {
        api.verifyToken().then(isValid => {
          if (isValid) {
            setIsAuthenticated(true);
            loadDashboardData();
          } else {
            api.logout();
            setIsAuthenticated(false);
          }
        });
      }
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    try {
      const [
        statsData, marksData, noticesData, materialsData, deptData, 
        linksData, galleryData, inqData, infoData, 
        subjectsData, facultyData, ttData,
        principalData, committeesData
      ] = await Promise.all([
        api.getAdminStats().catch(() => ({})),
        api.getAdminInternalMarks().catch(() => []),
        api.getNotices().catch(() => []),
        api.getMaterials().catch(() => []),
        api.getDepartments().catch(() => []),
        api.getExternalLinks().catch(() => []),
        api.getGallery().catch(() => []),
        api.getInquiries().catch(() => []),
        api.getCollegeInfo().catch(() => ({})),
        api.getSubjects('ALL', null, 'ALL').catch(() => []),
        api.getFaculty('ALL').catch(() => []),
        api.getTimetables().catch(() => ({})),
        api.getPrincipal().catch(() => ({})),
        api.getCommittees().catch(() => ({}))
      ]);

      setStats(statsData);
      setInternalMarks(Array.isArray(marksData) ? marksData : []);
      setNotices(Array.isArray(noticesData) ? noticesData : []);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
      setDepartments(Array.isArray(deptData) ? deptData : []);
      setLinks(Array.isArray(linksData) ? linksData : []);
      setGallery(Array.isArray(galleryData) ? galleryData : []);
      setInquiries(Array.isArray(inqData) ? inqData : []);
      setCollegeInfo(infoData || {});
      if (infoData && typeof infoData === 'object') {
        setCollegeProfileForm({
          name: infoData.name || '',
          kannadaName: infoData.kannadaName || '',
          shortName: infoData.shortName || '',
          code: infoData.code || '',
          tagline: infoData.tagline || '',
          established: infoData.established || '',
          accreditation: infoData.accreditation || '',
          examCenterCode: infoData.examCenterCode || '',
          address: infoData.address || '',
          phone: infoData.phone || '',
          email: infoData.email || '',
          admissionEmail: infoData.admissionEmail || '',
          website: infoData.website || '',
          workingHours: infoData.workingHours || '',
          stats: {
            students: infoData.stats?.students || '',
            faculty: infoData.stats?.faculty || '',
            labs: infoData.stats?.labs || '',
            passRate: infoData.stats?.passRate || ''
          }
        });
      }
      if (principalData && typeof principalData === 'object') {
        setPrincipalForm({
          name: principalData.name || '',
          designation: principalData.designation || 'Principal & Professor',
          qualification: principalData.qualification || '',
          experience: principalData.experience || '',
          photo: principalData.photo || '',
          message: principalData.message || '',
          vision: principalData.vision || '',
          mission: principalData.mission || ''
        });
      }
      if (committeesData && typeof committeesData === 'object') {
        setCommitteesForm({
          antiRagging: {
            head: committeesData.antiRagging?.head || '',
            tollFree: committeesData.antiRagging?.tollFree || '',
            phone: committeesData.antiRagging?.phone || '',
            members: committeesData.antiRagging?.members || ''
          },
          icc: {
            presidingOfficer: committeesData.icc?.presidingOfficer || '',
            members: committeesData.icc?.members || '',
            email: committeesData.icc?.email || '',
            phone: committeesData.icc?.phone || ''
          },
          rti: {
            pio: committeesData.rti?.pio || '',
            faa: committeesData.rti?.faa || '',
            office: committeesData.rti?.office || '',
            phone: committeesData.rti?.phone || ''
          }
        });
      }
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setFacultyList(Array.isArray(facultyData) ? facultyData : []);
      setTimetables(typeof ttData === 'object' && ttData !== null ? ttData : {});
    } catch (err) {
      console.error('Error loading admin dashboard data', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);

    try {
      await api.login(usernameInput, passwordInput);
      setIsAuthenticated(true);
      setUsernameInput('');
      setPasswordInput('');
      showToast('Logged in successfully as Administrator.');
      loadDashboardData();
    } catch (err) {
      setAuthError(err.message || 'Invalid administrator username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    onClose();
  };

  // Upload Internal Marks PDF
  const handleUploadInternalMarks = async (e) => {
    e.preventDefault();
    if (!marksPdfFile) {
      alert('Please select an Internal Marks PDF file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('department', newMarks.department);
      formData.append('semester', newMarks.semester);
      formData.append('subjectName', newMarks.subjectName);
      formData.append('examName', newMarks.examName);
      formData.append('examDate', newMarks.examDate);
      formData.append('description', newMarks.description);
      formData.append('published', newMarks.published);
      formData.append('pdf', marksPdfFile);

      await api.uploadInternalMarks(formData);
      showToast('Internal Marks PDF uploaded and published successfully!');
      setMarksPdfFile(null);
      setNewMarks({
        department: 'CSE',
        semester: 5,
        subjectName: '',
        examName: 'Internal Assessment 1 (CIE-1)',
        examDate: new Date().toISOString().split('T')[0],
        description: '',
        published: true
      });
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to upload PDF');
    }
  };

  const handleDeleteMarks = async (id) => {
    if (window.confirm('Are you sure you want to delete this internal marks PDF?')) {
      try {
        await api.deleteInternalMarks(id);
        showToast('Internal marks PDF deleted.');
        loadDashboardData();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleTogglePublishMarks = async (item) => {
    try {
      await api.updateInternalMarks(item.id, { published: !item.published });
      showToast(`Marks status changed to ${!item.published ? 'Published' : 'Unpublished'}`);
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  // Upload Study Material PDF
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!materialPdfFile) {
      alert('Please choose a PDF document.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newMaterial.title);
      formData.append('department', newMaterial.department);
      formData.append('semester', newMaterial.semester);
      formData.append('scheme', newMaterial.scheme);
      formData.append('subject', newMaterial.subject);
      formData.append('type', newMaterial.type);
      formData.append('pdf', materialPdfFile);

      await api.uploadMaterial(formData);
      showToast('Study material document uploaded.');
      setMaterialPdfFile(null);
      setNewMaterial({
        title: '',
        department: 'CSE',
        semester: 5,
        scheme: 'C-25',
        subject: '',
        type: 'Lecture Notes'
      });
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm('Delete this study material?')) {
      await api.deleteMaterial(id);
      showToast('Document deleted.');
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    }
  };

  // Notices
  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title) return;
    try {
      await api.addNotice(newNotice);
      showToast('Notice published live!');
      setNewNotice({
        title: '',
        category: 'Examination',
        urgent: false,
        description: '',
        attachmentUrl: ''
      });
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      await api.deleteNotice(id);
      showToast('Notice removed.');
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    }
  };

  // External Links
  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    try {
      await api.addExternalLink(newLink);
      showToast('External portal link added!');
      setNewLink({
        title: '',
        url: '',
        category: 'Academic Portal',
        description: '',
        official: true
      });
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteLink = async (id) => {
    if (window.confirm('Delete this external portal link?')) {
      await api.deleteExternalLink(id);
      showToast('Link deleted.');
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    }
  };

  // College Photos (Gallery)
  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoImageFile) {
      alert('Please select an image file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newPhoto.title);
      formData.append('category', newPhoto.category);
      formData.append('caption', newPhoto.caption);
      formData.append('image', photoImageFile);

      await api.uploadGalleryPhoto(formData);
      showToast('Genuine college photograph uploaded successfully!');
      setPhotoImageFile(null);
      setNewPhoto({
        title: '',
        category: 'Campus',
        caption: ''
      });
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm('Delete this college photo?')) {
      await api.deleteGalleryPhoto(id);
      showToast('Photo removed.');
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    try {
      await api.changePassword(passwords.currentPassword, passwords.newPassword);
      showToast('Administrator password updated successfully!');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // -------------------------------------------------------------
  // SUBJECTS HANDLERS (C-25 & C-20 CURRICULUM MANAGEMENT)
  // -------------------------------------------------------------
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.code.trim() || !newSubject.name.trim()) {
      alert('Course code and name are required.');
      return;
    }

    try {
      await api.addSubject(newSubject);
      showToast(`Course ${newSubject.code} added to ${newSubject.scheme} syllabus!`);
      setNewSubject({
        code: '',
        name: '',
        department: 'CSE',
        semester: 5,
        scheme: 'C-25',
        theoryHours: 3,
        practicalHours: 2,
        credits: 4,
        faculty: '',
        syllabusSummary: '',
        pdfUrl: ''
      });
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to add subject');
    }
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    if (!editingSubject) return;

    try {
      await api.updateSubject(editingSubject.id, editingSubject);
      showToast(`Subject ${editingSubject.code} updated successfully!`);
      setEditingSubject(null);
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to update subject');
    }
  };

  const handleDeleteSubject = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete course ${code || ''} from the syllabus?`)) {
      try {
        await api.deleteSubject(id);
        showToast('Subject deleted from curriculum.');
        loadDashboardData();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleUploadSubjectNotes = async (e) => {
    e.preventDefault();
    if (!subjectNotesModal || !subjectNotesModal.subject) return;

    if (!subjectNotesModal.notesFile && !subjectNotesModal.notesUrl?.trim()) {
      alert('Please select a PDF document or provide a notes URL.');
      return;
    }

    setSubjectNotesModal(prev => ({ ...prev, isUploading: true }));

    try {
      const formData = new FormData();
      if (subjectNotesModal.notesFile) {
        formData.append('pdf', subjectNotesModal.notesFile);
      } else if (subjectNotesModal.notesUrl) {
        formData.append('notesUrl', subjectNotesModal.notesUrl.trim());
      }
      formData.append('notesTitle', subjectNotesModal.notesTitle || `${subjectNotesModal.subject.name} Lecture Notes`);

      let updated;
      try {
        updated = await api.uploadSubjectNotes(subjectNotesModal.subject.id, formData);
      } catch (apiErr) {
        console.warn('API upload fallback to storageService:', apiErr.message);
        const fileName = subjectNotesModal.notesFile ? subjectNotesModal.notesFile.name : (subjectNotesModal.notesUrl ? subjectNotesModal.notesUrl.split('/').pop() : 'Notes.pdf');
        const fileUrl = subjectNotesModal.notesUrl || (subjectNotesModal.notesFile ? `/sample-docs/25CS31T_Lecture_Notes.pdf` : '');
        const fileSize = subjectNotesModal.notesFile 
          ? (subjectNotesModal.notesFile.size > 1024 * 1024 
              ? `${(subjectNotesModal.notesFile.size / (1024 * 1024)).toFixed(1)} MB` 
              : `${Math.round(subjectNotesModal.notesFile.size / 1024)} KB`)
          : 'PDF';
        
        updated = storageService.updateSubjectNotes(subjectNotesModal.subject.id, {
          notesUrl: fileUrl,
          notesFileName: fileName,
          notesFileSize: fileSize,
          notesTitle: subjectNotesModal.notesTitle || `${subjectNotesModal.subject.name} Lecture Notes`,
          notesUploadedAt: new Date().toISOString()
        });
      }

      showToast(`Notes for ${subjectNotesModal.subject.code} published live!`);
      setSubjectNotesModal(null);
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to upload notes');
      setSubjectNotesModal(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleDeleteSubjectNotes = async (sub) => {
    if (!sub) return;
    if (window.confirm(`Are you sure you want to remove uploaded notes for ${sub.code} (${sub.name})?`)) {
      try {
        try {
          await api.deleteSubjectNotes(sub.id);
        } catch (apiErr) {
          storageService.updateSubjectNotes(sub.id, {
            notesUrl: '',
            notesFileName: '',
            notesFileSize: '',
            notesTitle: '',
            notesUploadedAt: ''
          });
        }
        showToast(`Notes removed for ${sub.code}`);
        if (subjectNotesModal && subjectNotesModal.subject.id === sub.id) {
          setSubjectNotesModal(null);
        }
        loadDashboardData();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert(err.message || 'Failed to remove subject notes');
      }
    }
  };

  // -------------------------------------------------------------
  // FACULTY DIRECTORY HANDLERS
  // -------------------------------------------------------------
  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!newFaculty.name.trim()) {
      alert('Faculty name is required.');
      return;
    }

    try {
      await api.addFaculty(newFaculty);
      showToast(`Faculty member ${newFaculty.name} added to ${newFaculty.department}!`);
      setNewFaculty({
        name: '',
        designation: 'Lecturer',
        department: 'CSE',
        qualification: '',
        experience: '',
        email: '',
        phone: '',
        specialization: ''
      });
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to add faculty member');
    }
  };

  const handleUpdateFaculty = async (e) => {
    e.preventDefault();
    if (!editingFaculty) return;

    try {
      await api.updateFaculty(editingFaculty.id, editingFaculty);
      showToast(`Faculty details updated for ${editingFaculty.name}!`);
      setEditingFaculty(null);
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to update faculty member');
    }
  };

  const handleDeleteFaculty = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name || 'this faculty member'} from the directory?`)) {
      try {
        await api.deleteFaculty(id);
        showToast('Faculty member removed.');
        loadDashboardData();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // -------------------------------------------------------------
  // TIMETABLE CREATION & MANAGEMENT HANDLERS
  // -------------------------------------------------------------
  const currentTtKey = `${selectedTtDept}-Sem-${selectedTtSem}`;
  const currentTtSchedule = Array.isArray(timetables[currentTtKey]) ? timetables[currentTtKey] : [];
  const currentDayObj = currentTtSchedule.find(d => d.day === selectedTtDay);
  const currentDaySlots = currentDayObj ? (currentDayObj.slots || []) : [];

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlot.subject.trim()) {
      alert('Please enter a subject name or lecture title.');
      return;
    }

    const updatedTtSchedule = [...currentTtSchedule];
    const dayIdx = updatedTtSchedule.findIndex(d => d.day === selectedTtDay);

    if (dayIdx >= 0) {
      updatedTtSchedule[dayIdx] = {
        ...updatedTtSchedule[dayIdx],
        slots: [...(updatedTtSchedule[dayIdx].slots || []), { ...newSlot }]
      };
    } else {
      updatedTtSchedule.push({
        day: selectedTtDay,
        slots: [{ ...newSlot }]
      });
    }

    setTimetables(prev => ({
      ...prev,
      [currentTtKey]: updatedTtSchedule
    }));

    setNewSlot({
      time: '10:00 - 11:00',
      subject: '',
      room: selectedTtDept === 'CSE' ? 'Room 101' : 'Room 201',
      teacher: ''
    });
    showToast(`Period added to ${selectedTtDay}. Click 'Save Timetable' to persist!`);
  };

  const handleDeleteSlot = (slotIdx) => {
    const updatedTtSchedule = [...currentTtSchedule];
    const dayIdx = updatedTtSchedule.findIndex(d => d.day === selectedTtDay);
    if (dayIdx >= 0) {
      const updatedSlots = [...updatedTtSchedule[dayIdx].slots];
      updatedSlots.splice(slotIdx, 1);
      updatedTtSchedule[dayIdx] = {
        ...updatedTtSchedule[dayIdx],
        slots: updatedSlots
      };
      setTimetables(prev => ({
        ...prev,
        [currentTtKey]: updatedTtSchedule
      }));
      showToast('Period removed. Remember to click Save Timetable!');
    }
  };

  const handleAddLunchBreak = () => {
    const updatedTtSchedule = [...currentTtSchedule];
    const dayIdx = updatedTtSchedule.findIndex(d => d.day === selectedTtDay);
    const breakSlot = {
      time: '01:00 - 01:45',
      subject: 'LUNCH BREAK',
      room: 'Cafeteria / Campus',
      teacher: '-'
    };

    if (dayIdx >= 0) {
      updatedTtSchedule[dayIdx] = {
        ...updatedTtSchedule[dayIdx],
        slots: [...(updatedTtSchedule[dayIdx].slots || []), breakSlot]
      };
    } else {
      updatedTtSchedule.push({
        day: selectedTtDay,
        slots: [breakSlot]
      });
    }

    setTimetables(prev => ({
      ...prev,
      [currentTtKey]: updatedTtSchedule
    }));
    showToast('Lunch break slot added! Remember to click Save Timetable.');
  };

  const handleSaveTimetable = async () => {
    try {
      const scheduleToSave = timetables[currentTtKey] || [];
      await api.saveTimetable(currentTtKey, scheduleToSave);
      showToast(`Timetable for ${selectedTtDept} Semester ${selectedTtSem} saved successfully!`);
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to save timetable');
    }
  };

  // -------------------------------------------------------------
  // COLLEGE PROFILE & DEPARTMENT EDIT HANDLERS
  // -------------------------------------------------------------
  const handleUpdateCollegeProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateCollegeInfo(collegeProfileForm);
      showToast('College Profile and Institutional Details updated successfully!');
      setCollegeInfo(updated);
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to update college profile');
    }
  };

  const handleResetCollegeProfile = () => {
    if (collegeInfo && typeof collegeInfo === 'object') {
      setCollegeProfileForm({
        name: collegeInfo.name || '',
        kannadaName: collegeInfo.kannadaName || '',
        shortName: collegeInfo.shortName || '',
        code: collegeInfo.code || '',
        tagline: collegeInfo.tagline || '',
        established: collegeInfo.established || '',
        accreditation: collegeInfo.accreditation || '',
        examCenterCode: collegeInfo.examCenterCode || '',
        address: collegeInfo.address || '',
        phone: collegeInfo.phone || '',
        email: collegeInfo.email || '',
        admissionEmail: collegeInfo.admissionEmail || '',
        website: collegeInfo.website || '',
        workingHours: collegeInfo.workingHours || '',
        stats: {
          students: collegeInfo.stats?.students || '',
          faculty: collegeInfo.stats?.faculty || '',
          labs: collegeInfo.stats?.labs || '',
          passRate: collegeInfo.stats?.passRate || ''
        }
      });
      showToast('College profile form reset to saved values.');
    }
  };

  const handleOpenEditDepartment = (dept) => {
    setEditingDepartment({
      ...dept,
      labsText: Array.isArray(dept.labs) ? dept.labs.join('\n') : (dept.labs || '')
    });
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!editingDepartment) return;

    try {
      const labsList = typeof editingDepartment.labsText === 'string'
        ? editingDepartment.labsText.split('\n').map(l => l.trim()).filter(Boolean)
        : (Array.isArray(editingDepartment.labs) ? editingDepartment.labs : []);

      const payload = {
        name: editingDepartment.name,
        code: editingDepartment.code,
        intake: Number(editingDepartment.intake) || 60,
        hod: editingDepartment.hod,
        description: editingDepartment.description,
        labs: labsList
      };

      await api.updateDepartment(editingDepartment.id, payload);
      showToast(`Department ${editingDepartment.code} updated successfully!`);
      setEditingDepartment(null);
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to update department');
    }
  };

  // -------------------------------------------------------------
  // PRINCIPAL PROFILE, PHOTO & STATUTORY COMMITTEES HANDLERS
  // -------------------------------------------------------------
  const handleUpdatePrincipal = async (e) => {
    e.preventDefault();
    try {
      await api.updatePrincipal(principalForm);
      showToast('Principal profile & welcome message updated!');
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to update principal details');
    }
  };

  const handleUploadPrincipalPhoto = async (e) => {
    e.preventDefault();
    if (!principalPhotoFile) {
      alert('Please select a photograph image file (JPG/PNG/WebP).');
      return;
    }

    const formData = new FormData();
    formData.append('photo', principalPhotoFile);

    try {
      await api.uploadPrincipalPhoto(formData);
      showToast('Principal photograph uploaded and published!');
      setPrincipalPhotoFile(null);
      e.target.reset();
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to upload principal photograph');
    }
  };

  const handleRemovePrincipalPhoto = async () => {
    if (window.confirm('Remove current Principal photograph and revert to default institutional emblem?')) {
      try {
        await api.deletePrincipalPhoto();
        showToast('Principal photograph removed.');
        loadDashboardData();
        if (onDataChanged) onDataChanged();
      } catch (err) {
        alert(err.message || 'Failed to remove principal photograph');
      }
    }
  };

  const handleUpdateCommittees = async (e) => {
    e.preventDefault();
    try {
      await api.updateCommittees(committeesForm);
      showToast('Statutory Committees (Anti-Ragging, ICC, RTI) updated successfully!');
      loadDashboardData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message || 'Failed to update committee details');
    }
  };

  // Filtered Subjects for table
  const filteredSubjects = subjects.filter((s) => {
    const matchDept = subjectFilterDept === 'ALL' || s.department === 'ALL' || s.department === subjectFilterDept;
    const matchScheme = subjectFilterScheme === 'ALL' || s.scheme === subjectFilterScheme;
    const matchSem = subjectFilterSem === 'ALL' || Number(s.semester) === Number(subjectFilterSem);
    const matchSearch = !subjectSearch.trim() || 
      s.code?.toLowerCase().includes(subjectSearch.toLowerCase()) || 
      s.name?.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      s.faculty?.toLowerCase().includes(subjectSearch.toLowerCase());
    return matchDept && matchScheme && matchSem && matchSearch;
  });

  // Filtered Faculty for table
  const filteredFaculty = facultyList.filter((f) => {
    const matchDept = facultyFilterDept === 'ALL' || f.department === facultyFilterDept;
    const matchSearch = !facultySearch.trim() ||
      f.name?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.designation?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.specialization?.toLowerCase().includes(facultySearch.toLowerCase());
    return matchDept && matchSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-auto flex items-center justify-center p-1 bg-white/10 rounded-xl">
              <img src="/logo.png" alt="MYGPTH Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center space-x-2">
                <span>GPT Harihara • Administrative Content Management System (CMS)</span>
                {isAuthenticated && (
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Secure Session
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Authorized staff portal to manage timetables, subjects, faculty, marks, and announcements.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center space-x-2 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Area */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-24 h-auto flex items-center justify-center mx-auto">
              <img src="/logo.png" alt="MYGPTH Logo" className="h-16 w-auto object-contain drop-shadow-sm" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Administrator Login</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your authorized administrator credentials to manage college content.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administrator Username
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loginLoading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Authenticate as Administrator</span>
                  </>
                )}
              </button>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 space-y-1">
                <strong>🔒 Production Security Notice:</strong>
                <p>
                  Public registration is disabled. Only authorized college nodal officers may log in. Rate limiting is active to protect against brute force attempts.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1.5 shrink-0 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Academic Management
              </div>

              {/* Internal Marks Tab */}
              <button
                onClick={() => setActiveAdminTab('internalMarks')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'internalMarks'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Internal Marks (CIE)</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{internalMarks.length}</span>
              </button>

              {/* NEW: Timetable Creation Tab */}
              <button
                onClick={() => setActiveAdminTab('timetables')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'timetables'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Class Timetables</span>
                </div>
                <span className="text-[10px] bg-teal-500/20 text-teal-700 px-2 py-0.5 rounded-full font-bold">Edit</span>
              </button>

              {/* NEW: Subjects (C-25 & C-20) Tab */}
              <button
                onClick={() => setActiveAdminTab('subjects')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'subjects'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Subjects & Syllabus</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{subjects.length}</span>
              </button>

              {/* NEW: Faculty Directory Tab */}
              <button
                onClick={() => setActiveAdminTab('faculty')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'faculty'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Faculty & Staff</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{facultyList.length}</span>
              </button>

              {/* Announcements Tab */}
              <button
                onClick={() => setActiveAdminTab('notices')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'notices'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4" />
                  <span>Announcements</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{notices.length}</span>
              </button>

              {/* Study Materials Tab */}
              <button
                onClick={() => setActiveAdminTab('materials')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'materials'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Notes & Materials</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{materials.length}</span>
              </button>

              <div className="pt-3 border-t border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Institution Setup
              </div>

              {/* College Profile Tab */}
              <button
                onClick={() => setActiveAdminTab('collegeProfile')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'collegeProfile'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Landmark className="w-4 h-4 text-amber-500" />
                  <span>College Profile</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeAdminTab === 'collegeProfile'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-500/20 text-amber-800'
                }`}>Edit</span>
              </button>

              {/* Principal & Committees Tab */}
              <button
                onClick={() => setActiveAdminTab('principal')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'principal'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                  <span>Principal & Desk</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeAdminTab === 'principal'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-500/20 text-indigo-800'
                }`}>Edit</span>
              </button>

              {/* Departments Tab (4 Branches) */}
              <button
                onClick={() => setActiveAdminTab('departments')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'departments'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>4 Departments</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeAdminTab === 'departments'
                    ? 'bg-white/20 text-white'
                    : 'bg-black/15 text-slate-700'
                }`}>{departments.length} Edit</span>
              </button>

              {/* External Links Tab */}
              <button
                onClick={() => setActiveAdminTab('links')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'links'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ExternalLink className="w-4 h-4" />
                  <span>External Portals</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{links.length}</span>
              </button>

              {/* Gallery Photos Tab */}
              <button
                onClick={() => setActiveAdminTab('gallery')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'gallery'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Image className="w-4 h-4" />
                  <span>College Photographs</span>
                </div>
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full">{gallery.length}</span>
              </button>

              {/* Admission Leads Tab */}
              <button
                onClick={() => setActiveAdminTab('inquiries')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeAdminTab === 'inquiries'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Admission Leads</span>
                </div>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  {inquiries.length}
                </span>
              </button>

              <div className="pt-3 border-t border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Security & Session
              </div>

              {/* Change Password Tab */}
              <button
                onClick={() => setActiveAdminTab('security')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 transition cursor-pointer ${
                  activeAdminTab === 'security'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Change Password</span>
              </button>

              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full text-xs text-red-600 hover:bg-red-50 font-bold py-2 px-3 rounded-xl border border-red-200 transition text-center flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign Out (Logout)</span>
                </button>
              </div>
            </div>

            {/* Main Admin Tab Panel */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">

              {/* TAB 1: INTERNAL MARKS PDF UPLOAD */}
              {activeAdminTab === 'internalMarks' && (
                <div className="space-y-6">
                  {/* Upload Form */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Upload Semester-Wise Internal Marks PDF</span>
                    </div>

                    <form onSubmit={handleUploadInternalMarks} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* ONLY 4 BRANCHES: CSE, CE, ME, ECE */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Department *
                          </label>
                          <select
                            value={newMarks.department}
                            onChange={(e) => setNewMarks({ ...newMarks, department: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="CSE">Computer Science (CSE)</option>
                            <option value="CE">Civil Engineering (CE)</option>
                            <option value="ME">Mechanical Engineering (ME)</option>
                            <option value="ECE">Electronics & Comm (ECE)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Semester *
                          </label>
                          <select
                            value={newMarks.semester}
                            onChange={(e) => setNewMarks({ ...newMarks, semester: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="1">Semester 1</option>
                            <option value="2">Semester 2</option>
                            <option value="3">Semester 3</option>
                            <option value="4">Semester 4</option>
                            <option value="5">Semester 5</option>
                            <option value="6">Semester 6</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Exam Date
                          </label>
                          <input
                            type="date"
                            value={newMarks.examDate}
                            onChange={(e) => setNewMarks({ ...newMarks, examDate: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Exam Name (e.g. CIE-1, CIE-2, Model Lab Test) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Continuous Internal Evaluation 1 (CIE-1)"
                            value={newMarks.examName}
                            onChange={(e) => setNewMarks({ ...newMarks, examName: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Subject / Course Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. AI & Machine Learning (25CS51T)"
                            value={newMarks.subjectName}
                            onChange={(e) => setNewMarks({ ...newMarks, subjectName: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Assessment Description / Instructions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Official CIE-1 statement. Maximum marks: 25. Re-evaluation queries open till Friday."
                          value={newMarks.description}
                          onChange={(e) => setNewMarks({ ...newMarks, description: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Attach Internal Marks PDF File *
                          </label>
                          <input
                            type="file"
                            accept="application/pdf"
                            required
                            onChange={(e) => setMarksPdfFile(e.target.files[0])}
                            className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-900 hover:file:bg-blue-200 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-4">
                          <input
                            type="checkbox"
                            id="publishMarksToggle"
                            checked={newMarks.published}
                            onChange={(e) => setNewMarks({ ...newMarks, published: e.target.checked })}
                            className="w-4 h-4 text-blue-800 rounded"
                          />
                          <label htmlFor="publishMarksToggle" className="text-xs font-bold text-slate-700">
                            Publish immediately to student desk
                          </label>
                        </div>
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs flex items-center space-x-2 inline-flex cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload & Publish Marks PDF</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of Uploaded Marks PDFs */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                      <span>Uploaded Internal Marks Statements ({internalMarks.length})</span>
                      <span className="text-xs text-slate-400 font-normal">Department & Semester Wise</span>
                    </h4>

                    {internalMarks.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl bg-white">
                        No internal assessment PDF documents uploaded yet. Use the form above to publish your first CIE statement.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {internalMarks.map((m) => (
                          <div
                            key={m.id}
                            className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[10px]">
                                  {m.department} • Sem {m.semester}
                                </span>
                                <h5 className="font-bold text-slate-900 text-sm">{m.examName}</h5>
                                {m.published ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Published
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-600 font-medium">
                                Subject: {m.subjectName} | Conducted: {m.examDate}
                              </div>
                              <div className="text-slate-400 text-[11px] flex items-center space-x-2">
                                <span>File: <code>{m.fileName}</code> ({m.fileSize})</span>
                                <span>•</span>
                                <span>Uploaded: {m.createdAt}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => handleTogglePublishMarks(m)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  m.published ? 'bg-amber-50 text-amber-800 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                }`}
                              >
                                {m.published ? 'Unpublish' : 'Publish'}
                              </button>

                              <a
                                href={m.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </a>

                              <button
                                onClick={() => handleDeleteMarks(m.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: TIMETABLE CREATION & SCHEDULING (NEW) */}
              {activeAdminTab === 'timetables' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-teal-600" />
                          <span>Class Timetable Creation & Period Scheduling</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Create and update weekly class period slots, practical lab sessions, and classroom allocations.
                        </p>
                      </div>

                      <button
                        onClick={handleSaveTimetable}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition cursor-pointer self-start sm:self-auto"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Timetable ({selectedTtDept}-Sem-{selectedTtSem})</span>
                      </button>
                    </div>

                    {/* Department, Semester, and Day Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Department (4 Branches Only)
                        </label>
                        <select
                          value={selectedTtDept}
                          onChange={(e) => setSelectedTtDept(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                        >
                          <option value="CSE">Computer Science & Engg (CSE)</option>
                          <option value="CE">Civil Engineering (CE)</option>
                          <option value="ME">Mechanical Engineering (ME)</option>
                          <option value="ECE">Electronics & Communication (ECE)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Semester
                        </label>
                        <select
                          value={selectedTtSem}
                          onChange={(e) => setSelectedTtSem(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                        >
                          <option value="1">Semester 1 (First Year)</option>
                          <option value="2">Semester 2 (First Year)</option>
                          <option value="3">Semester 3 (Second Year)</option>
                          <option value="4">Semester 4 (Second Year)</option>
                          <option value="5">Semester 5 (Third Year)</option>
                          <option value="6">Semester 6 (Third Year)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Select Day to Schedule
                        </label>
                        <select
                          value={selectedTtDay}
                          onChange={(e) => setSelectedTtDay(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-blue-900 focus:outline-none"
                        >
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Add Period Slot Form */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Add Period Slot to {selectedTtDay} ({selectedTtDept} Sem {selectedTtSem})
                        </span>
                        <button
                          type="button"
                          onClick={handleAddLunchBreak}
                          className="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-xl transition cursor-pointer"
                        >
                          + Quick Add Lunch Break (01:00 - 01:45)
                        </button>
                      </div>

                      <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Time Slot *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 10:00 - 11:00"
                            value={newSlot.time}
                            onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Subject / Course *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AI & ML (25CS51T)"
                            value={newSlot.subject}
                            onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Classroom / Lab
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Room 101 / Lab 2"
                            value={newSlot.room}
                            onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Faculty in charge
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Prof. Manjunath"
                              value={newSlot.teacher}
                              onChange={(e) => setNewSlot({ ...newSlot, teacher: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition shrink-0 cursor-pointer"
                          >
                            Add Slot
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Current Day Schedule List */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Periods Scheduled for {selectedTtDay}: ({currentDaySlots.length} periods)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Target Key: <code className="text-blue-900 font-bold">{currentTtKey}</code>
                        </span>
                      </div>

                      {currentDaySlots.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-xl bg-white">
                          No periods added for {selectedTtDay} yet. Use the form above to add lecture hours, practicals, or lunch breaks.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {currentDaySlots.map((slot, idx) => {
                            const isBreak = slot.subject.includes('LUNCH') || slot.subject.includes('BREAK');
                            return (
                              <div
                                key={idx}
                                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
                                  isBreak ? 'bg-amber-50/70 border-amber-200' : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded">
                                    {slot.time}
                                  </span>
                                  <div>
                                    <span className="font-bold text-slate-900 text-sm block">
                                      {slot.subject}
                                    </span>
                                    <span className="text-slate-500 text-[11px]">
                                      Room: <strong>{slot.room}</strong> {slot.teacher && slot.teacher !== '-' ? `| Faculty: ${slot.teacher}` : ''}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(idx)}
                                  className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                                  title="Remove period"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 text-right">
                      <button
                        onClick={handleSaveTimetable}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition cursor-pointer inline-flex"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Changes to Timetable</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SUBJECTS & SYLLABUS MANAGEMENT (NEW - C-25 & C-20) */}
              {activeAdminTab === 'subjects' && (
                <div className="space-y-6">
                  {/* Add Subject Form */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-blue-600" />
                        <span>Add Course / Subject to Syllabus (C-25 & C-20)</span>
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded-full">
                        DTE Teaching Scheme
                      </span>
                    </div>

                    <form onSubmit={handleAddSubject} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Course Code *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 25CS51T or 20CS51T"
                            value={newSubject.code}
                            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Subject / Course Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Artificial Intelligence & Machine Learning"
                            value={newSubject.name}
                            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Curriculum Scheme *
                          </label>
                          <select
                            value={newSubject.scheme}
                            onChange={(e) => setNewSubject({ ...newSubject, scheme: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="C-25">C-25 Scheme (Latest 2025-26)</option>
                            <option value="C-20">C-20 Scheme (Previous)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Department
                          </label>
                          <select
                            value={newSubject.department}
                            onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="CSE">CSE</option>
                            <option value="CE">CE</option>
                            <option value="ME">ME</option>
                            <option value="ECE">ECE</option>
                            <option value="ALL">ALL (Common First Year)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Semester
                          </label>
                          <select
                            value={newSubject.semester}
                            onChange={(e) => setNewSubject({ ...newSubject, semester: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            {[1, 2, 3, 4, 5, 6].map(sem => (
                              <option key={sem} value={sem}>Sem {sem}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Theory Hrs/wk
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={newSubject.theoryHours}
                            onChange={(e) => setNewSubject({ ...newSubject, theoryHours: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Practical Hrs/wk
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={newSubject.practicalHours}
                            onChange={(e) => setNewSubject({ ...newSubject, practicalHours: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Credits
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={newSubject.credits}
                            onChange={(e) => setNewSubject({ ...newSubject, credits: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Faculty / Teacher in Charge
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Prof. Manjunath B. R."
                            value={newSubject.faculty}
                            onChange={(e) => setNewSubject({ ...newSubject, faculty: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Syllabus PDF / Handout URL (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. /sample-docs/25CS51T_Syllabus.pdf"
                            value={newSubject.pdfUrl}
                            onChange={(e) => setNewSubject({ ...newSubject, pdfUrl: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Syllabus Summary / Key Modules
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Brief overview of course modules, practical exercises, and learning outcomes..."
                          value={newSubject.syllabusSummary}
                          onChange={(e) => setNewSubject({ ...newSubject, syllabusSummary: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                        ></textarea>
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Subject to Syllabus</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Filter & Search Bar for Subjects */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department</label>
                      <select
                        value={subjectFilterDept}
                        onChange={(e) => setSubjectFilterDept(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold"
                      >
                        <option value="ALL">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="CE">CE</option>
                        <option value="ME">ME</option>
                        <option value="ECE">ECE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Scheme</label>
                      <select
                        value={subjectFilterScheme}
                        onChange={(e) => setSubjectFilterScheme(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold"
                      >
                        <option value="ALL">All Schemes</option>
                        <option value="C-25">C-25 Scheme</option>
                        <option value="C-20">C-20 Scheme</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Semester</label>
                      <select
                        value={subjectFilterSem}
                        onChange={(e) => setSubjectFilterSem(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold"
                      >
                        <option value="ALL">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6].map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Search Courses</label>
                      <input
                        type="text"
                        placeholder="Search by code, title, teacher..."
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  {/* List of Subjects */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                      <span>Curriculum Subjects ({filteredSubjects.length} of {subjects.length})</span>
                      <span className="text-xs text-slate-400 font-normal">Click Edit to modify hours or faculty</span>
                    </h5>

                    <div className="space-y-2">
                      {filteredSubjects.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                {sub.code}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                sub.scheme === 'C-25' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {sub.scheme}
                              </span>
                              <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                                {sub.department} • Sem {sub.semester}
                              </span>
                              <h6 className="font-bold text-slate-900 text-sm">{sub.name}</h6>
                            </div>

                            <div className="text-slate-500 text-[11px] flex items-center space-x-3">
                              <span>Credits: <strong>{sub.credits}</strong></span>
                              <span>•</span>
                              <span>Hours: <strong>{sub.theoryHours} Th + {sub.practicalHours} Pr</strong></span>
                              <span>•</span>
                              <span>Faculty: <strong>{sub.faculty || 'Unassigned'}</strong></span>
                            </div>

                            {sub.syllabusSummary && (
                              <p className="text-slate-600 text-[11px] line-clamp-1 italic">
                                "{sub.syllabusSummary}"
                              </p>
                            )}

                            {/* Notes Indicator */}
                            <div className="pt-1 flex items-center space-x-2">
                              {(sub.notesUrl || sub.pdfUrl) ? (
                                <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-[11px] font-bold">
                                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Notes: {sub.notesFileName || 'Attached'}</span>
                                  {sub.notesFileSize && <span className="text-emerald-600 font-normal">({sub.notesFileSize})</span>}
                                  <a
                                    href={sub.notesUrl || sub.pdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ml-1 text-emerald-700 hover:text-emerald-900 underline font-medium"
                                    title="View uploaded PDF"
                                  >
                                    View
                                  </a>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                                  No Notes Uploaded
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSubjectNotesModal({
                                subject: sub,
                                notesTitle: sub.notesTitle || `${sub.name} Lecture Notes`,
                                notesFile: null,
                                notesUrl: sub.notesUrl || sub.pdfUrl || '',
                                isUploading: false
                              })}
                              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition cursor-pointer text-xs ${
                                (sub.notesUrl || sub.pdfUrl)
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                              title="Upload or manage notes for this course"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{(sub.notesUrl || sub.pdfUrl) ? 'Manage Notes' : 'Upload Notes'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingSubject({ ...sub })}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteSubject(sub.id, sub.code)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete subject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FACULTY & STAFF DIRECTORY MANAGEMENT (NEW) */}
              {activeAdminTab === 'faculty' && (
                <div className="space-y-6">
                  {/* Add Faculty Form */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        <span>Add New Faculty Member to Directory</span>
                      </h4>
                      <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                        Staff Records
                      </span>
                    </div>

                    <form onSubmit={handleAddFaculty} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Full Name & Salutation *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Prof. Manjunath B. R."
                            value={newFaculty.name}
                            onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Designation *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Head of Department (HOD) / Lecturer"
                            value={newFaculty.designation}
                            onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Department *
                          </label>
                          <select
                            value={newFaculty.department}
                            onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="CSE">Computer Science & Engg (CSE)</option>
                            <option value="CE">Civil Engineering (CE)</option>
                            <option value="ME">Mechanical Engineering (ME)</option>
                            <option value="ECE">Electronics & Communication (ECE)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Academic Qualifications
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. M.Tech (CSE), B.E."
                            value={newFaculty.qualification}
                            onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Teaching Experience
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 18 Years"
                            value={newFaculty.experience}
                            onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Official Email
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. hod.cs@gptharihara.edu.in"
                            value={newFaculty.email}
                            onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Phone / Contact Number
                          </label>
                          <input
                            type="text"
                            placeholder="+91 94481 23451"
                            value={newFaculty.phone}
                            onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                            Specialization / Domain Expertise
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Artificial Intelligence, Python, Cloud SQL"
                            value={newFaculty.specialization}
                            onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Faculty to Directory</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Filter & Search Bar for Faculty */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department</label>
                      <select
                        value={facultyFilterDept}
                        onChange={(e) => setFacultyFilterDept(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold"
                      >
                        <option value="ALL">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="CE">CE</option>
                        <option value="ME">ME</option>
                        <option value="ECE">ECE</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Search Staff Directory</label>
                      <input
                        type="text"
                        placeholder="Search by name, designation, specialization..."
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  {/* List of Faculty */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                      <span>Faculty Directory ({filteredFaculty.length} Members)</span>
                      <span className="text-xs text-slate-400 font-normal">Click Edit to modify details</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredFaculty.map((fac) => (
                        <div
                          key={fac.id}
                          className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 text-xs"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                                {fac.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <h6 className="font-bold text-slate-900 text-sm">{fac.name}</h6>
                                <p className="text-blue-700 font-semibold text-[11px]">{fac.designation}</p>
                              </div>
                            </div>

                            <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                              {fac.department}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                            <div><strong>Qualification:</strong> {fac.qualification}</div>
                            <div><strong>Experience:</strong> {fac.experience}</div>
                            {fac.email && <div><strong>Email:</strong> {fac.email}</div>}
                            {fac.specialization && <div><strong>Expertise:</strong> {fac.specialization}</div>}
                          </div>

                          <div className="flex items-center justify-end space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingFaculty({ ...fac })}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteFaculty(fac.id, fac.name)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Delete faculty"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ANNOUNCEMENTS */}
              {activeAdminTab === 'notices' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Publish New Announcement / Circular</span>
                    </h4>

                    <form onSubmit={handleAddNotice} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Notice Headline / Circular Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. DTE Karnataka Odd Semester Exam Schedule Released"
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Category</label>
                          <select
                            value={newNotice.category}
                            onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          >
                            <option value="Examination">Examination</option>
                            <option value="Academic">Academic</option>
                            <option value="Scholarship">Scholarship</option>
                            <option value="Event">Campus Event</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Circular / Attachment Link (Optional)</label>
                          <input
                            type="text"
                            placeholder="https://... or PDF URL"
                            value={newNotice.attachmentUrl}
                            onChange={(e) => setNewNotice({ ...newNotice, attachmentUrl: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Announcement Details / Circular Text</label>
                        <textarea
                          rows={3}
                          placeholder="Provide detailed instructions for students..."
                          value={newNotice.description}
                          onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                        ></textarea>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="urgentNoticeToggle"
                          checked={newNotice.urgent}
                          onChange={(e) => setNewNotice({ ...newNotice, urgent: e.target.checked })}
                          className="w-4 h-4 text-red-600 rounded"
                        />
                        <label htmlFor="urgentNoticeToggle" className="text-xs font-bold text-red-700">
                          Mark as Urgent (Flashing Ticker Announcement)
                        </label>
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Publish Announcement</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm">Active Announcements ({notices.length})</h5>
                    {notices.map((n) => (
                      <div key={n.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {n.urgent && (
                              <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                URGENT
                              </span>
                            )}
                            <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">{n.category} • {n.date}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteNotice(n.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: STUDY MATERIALS */}
              {activeAdminTab === 'materials' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Upload Study Notes & Question Banks (PDF)</span>
                    </h4>

                    <form onSubmit={handleUploadMaterial} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Applied Math Unit 1 Handout"
                            value={newMaterial.title}
                            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Department</label>
                          <select
                            value={newMaterial.department}
                            onChange={(e) => setNewMaterial({ ...newMaterial, department: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="CSE">CSE</option>
                            <option value="CE">CE</option>
                            <option value="ME">ME</option>
                            <option value="ECE">ECE</option>
                            <option value="ALL">All Departments (First Year)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Semester</label>
                          <select
                            value={newMaterial.semester}
                            onChange={(e) => setNewMaterial({ ...newMaterial, semester: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            {[1, 2, 3, 4, 5, 6].map(sem => (
                              <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Curriculum Scheme</label>
                          <select
                            value={newMaterial.scheme}
                            onChange={(e) => setNewMaterial({ ...newMaterial, scheme: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="C-25">C-25 Scheme</option>
                            <option value="C-20">C-20 Scheme</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Subject Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Data Structures"
                            value={newMaterial.subject}
                            onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Material Type</label>
                          <select
                            value={newMaterial.type}
                            onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          >
                            <option value="Lecture Notes">Lecture Notes</option>
                            <option value="Question Bank">Question Bank</option>
                            <option value="Lab Manual">Lab Manual</option>
                            <option value="Formula Sheet">Formula Sheet</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Select PDF Document *</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          required
                          onChange={(e) => setMaterialPdfFile(e.target.files[0])}
                          className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-900 cursor-pointer"
                        />
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Study Material</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm">Uploaded Notes ({materials.length})</h5>
                    {materials.map((m) => (
                      <div key={m.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                              {m.department} Sem {m.semester} ({m.scheme})
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{m.title}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">{m.type} • {m.fileName} ({m.fileSize})</p>
                        </div>

                        <button
                          onClick={() => handleDeleteMaterial(m.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6B: COLLEGE PROFILE SETTINGS */}
              {activeAdminTab === 'collegeProfile' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                        <Landmark className="w-5 h-5 text-amber-600" />
                        <span>Edit College Profile & Institutional Information</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Update official institution name, Kannada title, DTE affiliation codes, contact info, and hero statistics. Changes appear immediately across the website.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetCollegeProfile}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Form</span>
                    </button>
                  </div>

                  <form onSubmit={handleUpdateCollegeProfile} className="space-y-5">
                    {/* Card 1: Institutional Identity */}
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2.5">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span>1. Institutional Identity & Affiliation</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            College Name (English) *
                          </label>
                          <input
                            type="text"
                            required
                            value={collegeProfileForm.name}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, name: e.target.value })}
                            placeholder="Government Polytechnic, Harihara"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            College Name (Kannada)
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.kannadaName}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, kannadaName: e.target.value })}
                            placeholder="ಸರ್ಕಾರಿ ಪಾಲಿಟೆಕ್ನಿಕ್, ಹರಿಹರ"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Short Name / Acronym
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.shortName}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, shortName: e.target.value })}
                            placeholder="GPT Harihara"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Established Year
                            </label>
                            <input
                              type="text"
                              value={collegeProfileForm.established}
                              onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, established: e.target.value })}
                              placeholder="1984"
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Exam Center Code
                            </label>
                            <input
                              type="text"
                              value={collegeProfileForm.examCenterCode}
                              onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, examCenterCode: e.target.value })}
                              placeholder="111"
                              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            DTE / AICTE Institution Code Banner
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.code}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, code: e.target.value })}
                            placeholder="Govt. Inst. Code: 111 | DTE Karnataka | AICTE Approved"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Tagline / Governing Department
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.tagline}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, tagline: e.target.value })}
                            placeholder="Department of Technical Education, Government of Karnataka | Approved by AICTE, New Delhi"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Accreditation Details
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.accreditation}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, accreditation: e.target.value })}
                            placeholder="Government Institution | DTE Karnataka Affiliated | AICTE Approved"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Contact Details & Working Hours */}
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2.5">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>2. Contact Information & Office Timings</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Campus Postal Address
                          </label>
                          <textarea
                            rows={2}
                            value={collegeProfileForm.address}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, address: e.target.value })}
                            placeholder="Shimoga Road, Near KSRTC Depot, Harihara, Davanagere District, Karnataka - 577601"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Office Phone / Helpline Numbers
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.phone}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, phone: e.target.value })}
                            placeholder="+91 (08192) 242250 / +91 94480 12345"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Working Hours
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.workingHours}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, workingHours: e.target.value })}
                            placeholder="Monday – Saturday: 10:00 AM – 5:30 PM"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Principal / Official Email
                          </label>
                          <input
                            type="email"
                            value={collegeProfileForm.email}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, email: e.target.value })}
                            placeholder="principal.gptharihara@gmail.com"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Admission Helpline Email
                          </label>
                          <input
                            type="email"
                            value={collegeProfileForm.admissionEmail}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, admissionEmail: e.target.value })}
                            placeholder="admissions.gptharihara@karnataka.gov.in"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Official Govt Portal Website URL
                          </label>
                          <input
                            type="url"
                            value={collegeProfileForm.website}
                            onChange={(e) => setCollegeProfileForm({ ...collegeProfileForm, website: e.target.value })}
                            placeholder="https://gpt.karnataka.gov.in/gptharihara"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-blue-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Campus Key Statistics */}
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
                      <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>3. Campus Statistics (Displayed on Homepage Banner)</span>
                      </h5>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Enrolled Students
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.stats.students}
                            onChange={(e) =>
                              setCollegeProfileForm({
                                ...collegeProfileForm,
                                stats: { ...collegeProfileForm.stats, students: e.target.value }
                              })
                            }
                            placeholder="1,200+"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-blue-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Board Pass Rate
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.stats.passRate}
                            onChange={(e) =>
                              setCollegeProfileForm({
                                ...collegeProfileForm,
                                stats: { ...collegeProfileForm.stats, passRate: e.target.value }
                              })
                            }
                            placeholder="94.6%"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Specialized Labs
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.stats.labs}
                            onChange={(e) =>
                              setCollegeProfileForm({
                                ...collegeProfileForm,
                                stats: { ...collegeProfileForm.stats, labs: e.target.value }
                              })
                            }
                            placeholder="20 Specialized Labs"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-amber-700"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Faculty Strength
                          </label>
                          <input
                            type="text"
                            value={collegeProfileForm.stats.faculty}
                            onChange={(e) =>
                              setCollegeProfileForm({
                                ...collegeProfileForm,
                                stats: { ...collegeProfileForm.stats, faculty: e.target.value }
                              })
                            }
                            placeholder="50+"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-purple-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-7 py-3 rounded-xl text-xs transition shadow-md cursor-pointer inline-flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save College Profile Updates</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6C: PRINCIPAL DESK, PHOTO & STATUTORY COMMITTEES */}
              {activeAdminTab === 'principal' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                      <UserCheck className="w-5 h-5 text-indigo-700" />
                      <span>Edit Principal's Profile, Photo & Statutory Committees</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      All fields on the public Principal's Desk & Mandatory Disclosures page are stored in the persistent database and update immediately.
                    </p>
                  </div>

                  {/* Card 1: Principal Photograph Upload */}
                  <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2.5">
                      <Image className="w-4 h-4 text-indigo-600" />
                      <span>1. Official Principal Photograph</span>
                    </h5>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-indigo-200 bg-gradient-to-tr from-blue-900 to-indigo-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                        {principalForm.photo && !principalForm.photo.includes('unsplash') ? (
                          <img
                            src={principalForm.photo}
                            alt={principalForm.name || 'Principal'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <User className="w-10 h-10 text-blue-200 mx-auto" />
                            <span className="text-[9px] text-amber-300 font-bold block mt-1">Default Emblem</span>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleUploadPrincipalPhoto} className="flex-1 w-full space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Upload Genuine Photo (JPG, PNG, WebP - Max 5MB)
                          </label>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => setPrincipalPhotoFile(e.target.files[0])}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                          </button>
                          {principalForm.photo && (
                            <button
                              type="button"
                              onClick={handleRemovePrincipalPhoto}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer inline-flex items-center space-x-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Current Photo</span>
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Card 2: Principal Details & Message */}
                  <form onSubmit={handleUpdatePrincipal} className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2.5">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>2. Principal Profile, Message, Vision & Mission</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Principal Name & Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={principalForm.name}
                          onChange={(e) => setPrincipalForm({ ...principalForm, name: e.target.value })}
                          placeholder="Dr. K. G. Mallikarjuna"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Official Designation *
                        </label>
                        <input
                          type="text"
                          required
                          value={principalForm.designation}
                          onChange={(e) => setPrincipalForm({ ...principalForm, designation: e.target.value })}
                          placeholder="Principal & Professor"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Academic Qualifications
                        </label>
                        <input
                          type="text"
                          value={principalForm.qualification}
                          onChange={(e) => setPrincipalForm({ ...principalForm, qualification: e.target.value })}
                          placeholder="Ph.D. (Mechanical Engg), M.Tech, FIE"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Service / Experience
                        </label>
                        <input
                          type="text"
                          value={principalForm.experience}
                          onChange={(e) => setPrincipalForm({ ...principalForm, experience: e.target.value })}
                          placeholder="26 Years of Academic & Administrative Service"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Message to Students & Parents *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={principalForm.message}
                          onChange={(e) => setPrincipalForm({ ...principalForm, message: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Institution Vision
                        </label>
                        <textarea
                          rows={3}
                          value={principalForm.vision}
                          onChange={(e) => setPrincipalForm({ ...principalForm, vision: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Institution Mission
                        </label>
                        <textarea
                          rows={3}
                          value={principalForm.mission}
                          onChange={(e) => setPrincipalForm({ ...principalForm, mission: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer inline-flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Principal Profile</span>
                      </button>
                    </div>
                  </form>

                  {/* Card 3: Statutory Committees */}
                  <form onSubmit={handleUpdateCommittees} className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-5">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2 border-b border-slate-200 pb-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>3. Mandatory Statutory Committees (Anti-Ragging, ICC, RTI)</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Anti-Ragging */}
                      <div className="bg-white p-4 rounded-2xl border border-red-200 space-y-2.5">
                        <div className="text-xs font-bold text-red-700 flex items-center space-x-1.5">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Anti-Ragging Squad</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Squad Head</label>
                          <input
                            type="text"
                            value={committeesForm.antiRagging.head}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              antiRagging: { ...committeesForm.antiRagging, head: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Toll-Free Helpline</label>
                          <input
                            type="text"
                            value={committeesForm.antiRagging.tollFree}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              antiRagging: { ...committeesForm.antiRagging, tollFree: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Campus Squad Phone</label>
                          <input
                            type="text"
                            value={committeesForm.antiRagging.phone}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              antiRagging: { ...committeesForm.antiRagging, phone: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                          />
                        </div>
                      </div>

                      {/* ICC */}
                      <div className="bg-white p-4 rounded-2xl border border-purple-200 space-y-2.5">
                        <div className="text-xs font-bold text-purple-700 flex items-center space-x-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Internal Complaints (ICC)</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Presiding Officer</label>
                          <input
                            type="text"
                            value={committeesForm.icc.presidingOfficer}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              icc: { ...committeesForm.icc, presidingOfficer: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Members</label>
                          <input
                            type="text"
                            value={committeesForm.icc.members}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              icc: { ...committeesForm.icc, members: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">ICC Email</label>
                          <input
                            type="email"
                            value={committeesForm.icc.email}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              icc: { ...committeesForm.icc, email: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      </div>

                      {/* RTI */}
                      <div className="bg-white p-4 rounded-2xl border border-blue-200 space-y-2.5">
                        <div className="text-xs font-bold text-blue-700 flex items-center space-x-1.5">
                          <FileText className="w-4 h-4" />
                          <span>Right to Information (RTI)</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Public Information Officer (PIO)</label>
                          <input
                            type="text"
                            value={committeesForm.rti.pio}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              rti: { ...committeesForm.rti, pio: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">First Appellate Authority (FAA)</label>
                          <input
                            type="text"
                            value={committeesForm.rti.faa}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              rti: { ...committeesForm.rti, faa: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Office Location</label>
                          <input
                            type="text"
                            value={committeesForm.rti.office}
                            onChange={(e) => setCommitteesForm({
                              ...committeesForm,
                              rti: { ...committeesForm.rti, office: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer inline-flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Committee Disclosures</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 7: 4 DEPARTMENTS INFO */}
              {activeAdminTab === 'departments' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-blue-700" />
                        <span>Manage 4 College Departments (CSE, CE, ME, ECE)</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Edit Head of Department (HOD) names, student intake capacity, department descriptions, and specialized laboratory lists.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full self-start sm:self-center">
                      Strictly 4 Approved Branches
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {departments.map((dept) => (
                      <div key={dept.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 hover:border-blue-400 transition shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-black bg-blue-100 text-blue-900 px-3 py-1 rounded-lg border border-blue-200">
                              Branch: {dept.code}
                            </span>
                            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                              Intake: {dept.intake} Seats
                            </span>
                          </div>

                          <h5 className="font-extrabold text-slate-900 text-base">{dept.name}</h5>

                          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                              Head of Department (HOD)
                            </span>
                            <span className="text-xs font-bold text-blue-950">{dept.hod}</span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Laboratories ({dept.labs?.length || 0})
                            </span>
                            <ul className="space-y-1">
                              {dept.labs?.map((lab, idx) => (
                                <li key={idx} className="text-xs text-slate-600 flex items-start space-x-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                                  <span>{lab}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleOpenEditDepartment(dept)}
                            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-blue-50 hover:bg-blue-800 text-blue-800 hover:text-white border border-blue-200 hover:border-blue-800 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit {dept.code} Department</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: EXTERNAL USEFUL LINKS */}
              {activeAdminTab === 'links' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Add Useful Official Portal Link</span>
                    </h4>

                    <form onSubmit={handleAddLink} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Karnataka K2 Challan Portal"
                            value={newLink.title}
                            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">URL *</label>
                          <input
                            type="url"
                            required
                            placeholder="https://k2.karnataka.gov.in/"
                            value={newLink.url}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Category</label>
                          <input
                            type="text"
                            placeholder="e.g. Examination Fee / Scholarship"
                            value={newLink.category}
                            onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Description</label>
                          <input
                            type="text"
                            placeholder="Brief description of the portal..."
                            value={newLink.description}
                            onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add External Link</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-2">
                    {links.map((link) => (
                      <div key={link.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-blue-900">{link.title}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{link.category}</span>
                          </div>
                          <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-mono text-[11px]">
                            {link.url}
                          </a>
                        </div>

                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: COLLEGE PHOTOGRAPHS */}
              {activeAdminTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-teal-600" />
                      <span>Upload Genuine College Photograph</span>
                    </h4>

                    <form onSubmit={handleUploadPhoto} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Photo Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Computer Science Lab 1 / Workshop Bay"
                            value={newPhoto.title}
                            onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Category</label>
                          <select
                            value={newPhoto.category}
                            onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                          >
                            <option value="Laboratories">Laboratories</option>
                            <option value="Workshops">Workshops</option>
                            <option value="Campus">Campus Infrastructure</option>
                            <option value="Events">College Events</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Caption / Description</label>
                        <input
                          type="text"
                          placeholder="e.g. 30 high-speed networked core-i7 workstations with licensed CAD and compiler tools."
                          value={newPhoto.caption}
                          onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Select Image File (JPG/PNG/WebP, max 5MB) *</label>
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => setPhotoImageFile(e.target.files[0])}
                          className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-100 file:text-teal-900 cursor-pointer"
                        />
                      </div>

                      <div className="pt-2 text-right">
                        <button
                          type="submit"
                          className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Genuine Photograph</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 text-sm">Gallery Photos ({gallery.length})</h5>
                    {gallery.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl bg-white">
                        No genuine photos uploaded yet. Upload college photos above to replace placeholders.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {gallery.map((g) => (
                          <div key={g.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                            <img src={g.imageUrl} alt={g.title} className="h-32 w-full object-cover" />
                            <div className="p-3 flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs truncate max-w-[120px]">{g.title}</span>
                              <button
                                onClick={() => handleDeletePhoto(g.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 10: ADMISSION LEADS */}
              {activeAdminTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Online Admission Enquiries</h4>
                      <p className="text-xs text-slate-500">Candidate leads submitted via the public portal.</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-full">
                      Total: {inquiries.length} Enquiries
                    </span>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl bg-white">
                      No student inquiries received yet.
                    </div>
                  ) : (
                    inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
                            <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                              Branch: {inq.branchInterest}
                            </span>
                            {inq.scholarshipCategory && (
                              <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                                {inq.scholarshipCategory}
                              </span>
                            )}
                            <span className="text-slate-400">• {inq.createdAt || inq.date}</span>
                          </div>
                          <div className="text-slate-600">
                            📞 Phone: <strong className="text-slate-900">{inq.phone}</strong> | SSLC: <strong>{inq.sscPercentage || 'N/A'}</strong>
                          </div>
                          {inq.notes && (
                            <p className="text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                              "{inq.notes}"
                            </p>
                          )}
                        </div>

                        <select
                          value={inq.status || 'Pending'}
                          onChange={async (e) => {
                            await api.updateInquiryStatus(inq.id, e.target.value);
                            showToast(`Status updated to ${e.target.value}`);
                            loadDashboardData();
                          }}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                            inq.status === 'Enrolled'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : inq.status === 'Contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Enrolled">Enrolled</option>
                        </select>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 11: CHANGE PASSWORD & SECURITY */}
              {activeAdminTab === 'security' && (
                <div className="max-w-md bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Change Administrator Password</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Secure password update using bcrypt hashing.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        New Password (Min. 8 characters) *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 text-right">
                      <button
                        type="submit"
                        className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* EDIT SUBJECT MODAL */}
      {editingSubject && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Edit Course: {editingSubject.code}</span>
              </h4>
              <button
                onClick={() => setEditingSubject(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubject} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.code}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Scheme</label>
                  <select
                    value={editingSubject.scheme}
                    onChange={(e) => setEditingSubject({ ...editingSubject, scheme: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="C-25">C-25 Scheme</option>
                    <option value="C-20">C-20 Scheme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Dept</label>
                  <select
                    value={editingSubject.department}
                    onChange={(e) => setEditingSubject({ ...editingSubject, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold"
                  >
                    <option value="CSE">CSE</option>
                    <option value="CE">CE</option>
                    <option value="ME">ME</option>
                    <option value="ECE">ECE</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sem</label>
                  <select
                    value={editingSubject.semester}
                    onChange={(e) => setEditingSubject({ ...editingSubject, semester: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Th Hrs</label>
                  <input
                    type="number"
                    value={editingSubject.theoryHours}
                    onChange={(e) => setEditingSubject({ ...editingSubject, theoryHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Credits</label>
                  <input
                    type="number"
                    value={editingSubject.credits}
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Faculty In Charge</label>
                <input
                  type="text"
                  value={editingSubject.faculty || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, faculty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Syllabus Overview</label>
                <textarea
                  rows={2}
                  value={editingSubject.syllabusSummary || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, syllabusSummary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Notes PDF / Handout URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /sample-docs/25CS31T_Lecture_Notes.pdf or /uploads/materials/..."
                  value={editingSubject.notesUrl || editingSubject.pdfUrl || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, notesUrl: e.target.value, pdfUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Subject Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBJECT NOTES & MATERIALS UPLOAD MODAL */}
      {subjectNotesModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="font-mono text-[10px] font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                  {subjectNotesModal.subject.code}
                </span>
                <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2 mt-1">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Upload & Manage Notes</span>
                </h4>
                <p className="text-xs text-slate-500">
                  {subjectNotesModal.subject.name} (Sem {subjectNotesModal.subject.semester} • {subjectNotesModal.subject.department})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubjectNotesModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Notes Display (If exists) */}
            {(subjectNotesModal.subject.notesUrl || subjectNotesModal.subject.pdfUrl) && (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Currently Uploaded Notes</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubjectNotes(subjectNotesModal.subject)}
                    className="text-red-600 hover:text-red-800 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                    title="Delete uploaded notes"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Notes</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-800">
                    {subjectNotesModal.subject.notesTitle || `${subjectNotesModal.subject.name} Notes`}
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 font-mono text-[10px]">
                    <span>File: {subjectNotesModal.subject.notesFileName || 'Attached PDF'}</span>
                    {subjectNotesModal.subject.notesFileSize && <span>• {subjectNotesModal.subject.notesFileSize}</span>}
                  </div>
                  <div className="pt-1.5">
                    <a
                      href={subjectNotesModal.subject.notesUrl || subjectNotesModal.subject.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline font-bold inline-flex items-center space-x-1 text-[11px]"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download / Preview Current File</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleUploadSubjectNotes} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Notes Title / Topic Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unit 1 to 5 Complete Lecture Notes & Question Bank"
                  value={subjectNotesModal.notesTitle}
                  onChange={(e) => setSubjectNotesModal({ ...subjectNotesModal, notesTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* PDF Document File Upload */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Choose PDF Notes File *
                </label>
                <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 text-center hover:bg-emerald-50/70 transition">
                  <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSubjectNotesModal({ 
                          ...subjectNotesModal, 
                          notesFile: file,
                          notesTitle: subjectNotesModal.notesTitle || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
                        });
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />
                  {subjectNotesModal.notesFile && (
                    <p className="mt-2 text-xs font-bold text-emerald-800">
                      Selected: {subjectNotesModal.notesFile.name} ({(subjectNotesModal.notesFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">Official PDF notes, lecture handouts, or question banks up to 15MB</p>
                </div>
              </div>

              {/* Or external / sample URL */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Or specify existing Document / PDF Path (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /sample-docs/25CS31T_Lecture_Notes.pdf"
                  value={subjectNotesModal.notesUrl}
                  onChange={(e) => setSubjectNotesModal({ ...subjectNotesModal, notesUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubjectNotesModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={subjectNotesModal.isUploading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{subjectNotesModal.isUploading ? 'Uploading...' : 'Publish Notes for Students'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FACULTY MODAL */}
      {editingFaculty && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <span>Edit Faculty: {editingFaculty.name}</span>
              </h4>
              <button
                onClick={() => setEditingFaculty(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFaculty} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingFaculty.name}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={editingFaculty.designation}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Department</label>
                  <select
                    value={editingFaculty.department}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="CSE">CSE</option>
                    <option value="CE">CE</option>
                    <option value="ME">ME</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qualification</label>
                  <input
                    type="text"
                    value={editingFaculty.qualification || ''}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, qualification: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Experience</label>
                  <input
                    type="text"
                    value={editingFaculty.experience || ''}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, experience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={editingFaculty.email || ''}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingFaculty.phone || ''}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Specialization</label>
                <input
                  type="text"
                  value={editingFaculty.specialization || ''}
                  onChange={(e) => setEditingFaculty({ ...editingFaculty, specialization: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFaculty(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Faculty Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DEPARTMENT MODAL */}
      {editingDepartment && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>Edit Department: {editingDepartment.code}</span>
              </h4>
              <button
                onClick={() => setEditingDepartment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDepartment} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDepartment.name}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Intake Seats *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={300}
                    value={editingDepartment.intake}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, intake: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={editingDepartment.code}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Head of Department (HOD) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDepartment.hod}
                    onChange={(e) => setEditingDepartment({ ...editingDepartment, hod: e.target.value })}
                    placeholder="Prof. Name (M.Tech)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Department Overview & Curriculum Focus *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingDepartment.description || ''}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Specialized Laboratories (One lab per line)
                </label>
                <textarea
                  rows={4}
                  value={editingDepartment.labsText || ''}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, labsText: e.target.value })}
                  placeholder="Software Development & Programming Lab&#10;Database Management & Cloud Computing Lab"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                ></textarea>
                <p className="text-[10px] text-slate-400 mt-1">
                  Enter each laboratory name on a separate line.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDepartment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Department Updates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
