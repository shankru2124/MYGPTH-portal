import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import Hero from './components/Hero';
import InternalMarks from './components/InternalMarks';
import ExamFeePayment from './components/ExamFeePayment';
import ScholarshipCalculator from './components/ScholarshipCalculator';
import AcademicHub from './components/AcademicHub';
import TimetableViewer from './components/TimetableViewer';
import NoticeBoard from './components/NoticeBoard';
import StudyMaterials from './components/StudyMaterials';
import Departments from './components/Departments';
import UsefulLinks from './components/UsefulLinks';
import CampusGallery from './components/CampusGallery';
import PrincipalDesk from './components/PrincipalDesk';
import FacultyDirectory from './components/FacultyDirectory';
import AdmissionSection from './components/AdmissionSection';
import AdminCMS from './components/AdminCMS';
import NoticeModal from './components/NoticeModal';
import SubjectModal from './components/SubjectModal';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import InstallAppBanner from './components/InstallAppBanner';
import { storageService } from './services/storageService';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Database State initialized from storage / seed
  const [db, setDb] = useState(() => storageService.getDatabase());
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Synchronize with persistent backend API
  const syncWithBackend = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoadingBackend(true);
      const bundle = await api.getPublicBundle();
      if (bundle && bundle.collegeInfo) {
        setDb(prev => ({
          ...prev,
          ...bundle
        }));
        storageService.saveDatabase({
          ...storageService.getDatabase(),
          ...bundle
        });
      }
    } catch (err) {
      if (!silent) {
        console.warn('Backend bundle unavailable, using cached/local storage:', err.message);
        setDb(storageService.getDatabase());
      }
    } finally {
      if (!silent) setIsLoadingBackend(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount
    syncWithBackend();

    // Listen for local admin updates
    const handleUpdate = () => syncWithBackend(true);
    window.addEventListener('college-data-updated', handleUpdate);

    // Auto-sync when student returns to tab or unlocks phone
    const handleVisibility = () => {
      if (!document.hidden) syncWithBackend(true);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // Periodic live auto-poll every 25 seconds across all student devices
    const interval = setInterval(() => {
      if (!document.hidden) {
        syncWithBackend(true);
      }
    }, 25000);

    return () => {
      window.removeEventListener('college-data-updated', handleUpdate);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      clearInterval(interval);
    };
  }, [syncWithBackend]);

  const handleSelectDepartment = (deptId) => {
    setActiveTab('academics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Top Header */}
      <Header
        collegeInfo={db.collegeInfo || {}}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Urgent Announcements & News Ticker */}
      <NewsTicker
        notices={db.notices || []}
        onSelectNotice={(notice) => setSelectedNotice(notice)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero
              collegeInfo={db.collegeInfo || {}}
              setActiveTab={setActiveTab}
            />

            {/* Semester-Wise Internal Marks (CIE) Section */}
            <section id="cie-marks" className="border-b border-slate-200 bg-white">
              <InternalMarks />
            </section>

            {/* Academic Curriculum Section (C-25 vs C-20 Separation) */}
            <section className="border-b border-slate-200">
              <AcademicHub
                departments={db.departments || []}
                subjects={db.subjects || []}
                academicCalendar={db.academicCalendar || []}
                onSelectSubject={(sub) => setSelectedSubject(sub)}
                onOpenAdmin={() => setIsAdminOpen(true)}
              />
            </section>

            {/* Diploma Semester Examination Fee Payment (Khajane-2) */}
            <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/50 to-white">
              <ExamFeePayment />
            </section>

            {/* Scholarship Fee Calculator (SSP, Labour Card, Vidyasiri) */}
            <section className="border-b border-slate-200">
              <ScholarshipCalculator />
            </section>

            {/* 4 Diploma Engineering Departments */}
            <section className="border-b border-slate-200 bg-white">
              <Departments
                departments={db.departments || []}
                collegeInfo={db.collegeInfo || {}}
                onSelectDepartment={handleSelectDepartment}
              />
            </section>

            {/* Official Useful External Links (K2, DTE, SSP, NDLI) */}
            <section className="border-b border-slate-200">
              <UsefulLinks links={db.externalLinks || []} />
            </section>

            {/* Campus Facilities Photo Gallery */}
            <section className="border-b border-slate-200 bg-white">
              <CampusGallery
                gallery={db.gallery || []}
              />
            </section>

            {/* Principal's Desk & Governance */}
            <section className="border-b border-slate-200">
              <PrincipalDesk
                principal={db.principal || {}}
                committees={db.committees || {}}
                collegeInfo={db.collegeInfo || {}}
              />
            </section>

            {/* Academic Notices & Circulars */}
            <section className="border-b border-slate-200 bg-white">
              <NoticeBoard
                notices={db.notices || []}
                onSelectNotice={(notice) => setSelectedNotice(notice)}
              />
            </section>

            {/* Admissions 2026-27 & Enquiry Form */}
            <section>
              <AdmissionSection
                collegeInfo={db.collegeInfo || {}}
                departments={db.departments || []}
              />
            </section>
          </div>
        )}

        {/* Dedicated Tab Views */}
        {activeTab === 'internalmarks' && (
          <InternalMarks />
        )}

        {activeTab === 'academics' && (
          <AcademicHub
            departments={db.departments || []}
            subjects={db.subjects || []}
            academicCalendar={db.academicCalendar || []}
            onSelectSubject={(sub) => setSelectedSubject(sub)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

        {activeTab === 'examfee' && (
          <ExamFeePayment />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipCalculator />
        )}

        {activeTab === 'timetable' && (
          <TimetableViewer
            timetables={db.timetables || {}}
          />
        )}

        {activeTab === 'notices' && (
          <NoticeBoard
            notices={db.notices || []}
            onSelectNotice={(notice) => setSelectedNotice(notice)}
          />
        )}

        {activeTab === 'materials' && (
          <StudyMaterials
            materials={db.studyMaterials || []}
          />
        )}

        {activeTab === 'departments' && (
          <Departments
            departments={db.departments || []}
            collegeInfo={db.collegeInfo || {}}
            onSelectDepartment={handleSelectDepartment}
          />
        )}

        {activeTab === 'usefullinks' && (
          <UsefulLinks links={db.externalLinks || []} />
        )}

        {activeTab === 'gallery' && (
          <CampusGallery
            gallery={db.gallery || []}
          />
        )}

        {activeTab === 'principal' && (
          <PrincipalDesk
            principal={db.principal || {}}
            committees={db.committees || {}}
            collegeInfo={db.collegeInfo || {}}
          />
        )}

        {activeTab === 'faculty' && (
          <FacultyDirectory
            faculty={db.faculty || []}
            departments={db.departments || []}
          />
        )}

        {activeTab === 'admissions' && (
          <AdmissionSection
            collegeInfo={db.collegeInfo || {}}
            departments={db.departments || []}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        collegeInfo={db.collegeInfo || {}}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Floating App Bottom Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Android Install App Banner */}
      <InstallAppBanner />

      {/* Admin CMS Modal */}
      <AdminCMS
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={syncWithBackend}
      />

      {/* Notice Detail Modal */}
      <NoticeModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      {/* Subject Syllabus Modal */}
      <SubjectModal
        subject={selectedSubject}
        onClose={() => setSelectedSubject(null)}
      />
    </div>
  );
}
