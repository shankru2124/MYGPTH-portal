import bcrypt from 'bcryptjs';

// Generate default admin password hash (Admin@gpt111)
const defaultAdminPasswordHash = bcrypt.hashSync('Admin@gpt111', 10);

export const initialDatabase = {
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: defaultAdminPasswordHash,
    role: 'SUPER_ADMIN',
    updatedAt: new Date().toISOString()
  },

  collegeInfo: {
    name: "Government Polytechnic, Harihara",
    kannadaName: "ಸರ್ಕಾರಿ ಪಾಲಿಟೆಕ್ನಿಕ್, ಹರಿಹರ",
    shortName: "GPT Harihara",
    code: "Govt. Inst. Code: 111 | DTE Karnataka | AICTE Approved",
    tagline: "Department of Technical Education, Government of Karnataka | Approved by AICTE, New Delhi",
    established: "1984",
    accreditation: "Government Institution | DTE Karnataka Affiliated | AICTE Approved",
    address: "Shimoga Road, Near KSRTC Depot, Harihara, Davanagere District, Karnataka - 577601",
    phone: "+91 (08192) 242250 / +91 94480 12345",
    email: "principal.gptharihara@gmail.com",
    admissionEmail: "admissions.gptharihara@karnataka.gov.in",
    website: "https://gpt.karnataka.gov.in/gptharihara",
    workingHours: "Monday – Saturday: 10:00 AM – 5:30 PM (2nd & 4th Saturday Closed)",
    examCenterCode: "111",
    stats: {
      students: "1,200+",
      faculty: "50+",
      labs: "20 Specialized Labs",
      passRate: "94.6%"
    }
  },

  // Principal & Institutional Leadership
  principal: {
    name: "Dr. K. G. Mallikarjuna",
    designation: "Principal & Professor",
    qualification: "Ph.D. (Mechanical Engg), M.Tech, FIE",
    experience: "26 Years of Academic & Administrative Service",
    photo: "",
    message: "Welcome to Government Polytechnic, Harihara. Established in 1984, our mission is to provide high quality, industry-relevant technical diploma education to students from rural and semi-urban Karnataka. We take special pride in implementing the new C-25 Outcome-Based Curriculum alongside 100% scholarship implementation through SSP, Labour Card, and Vidyasiri schemes, ensuring no deserving student is held back due to financial constraints.",
    vision: "To be a premier technical education institution fostering skilled, ethically responsible diploma engineers capable of driving regional and national technological progress.",
    mission: "Provide quality hands-on laboratory training, promote 100% scholarship reach (SSP, Labour Card, Vidyasiri), and instill professionalism and entrepreneurial mindset."
  },

  // Mandatory Statutory Committees
  committees: {
    antiRagging: {
      head: "Dr. K. G. Mallikarjuna (Principal & Chairman)",
      tollFree: "1800-180-5522",
      phone: "+91 (08192) 242250",
      members: "HODs of CSE, CE, ME, ECE, Police Sub-Inspector Harihara, Local Media Representative"
    },
    icc: {
      presidingOfficer: "Prof. Anitha K. S. (Selection Grade Lecturer, CSE)",
      members: "Smt. Sunitha R., Smt. Geetha N., NGO Representative",
      email: "icc.gptharihara@gmail.com",
      phone: "+91 94481 23452"
    },
    rti: {
      pio: "Prof. Shivakumar G. M. (HOD Civil)",
      faa: "Dr. K. G. Mallikarjuna (Principal)",
      office: "Administrative Block, Room No. 102, GPT Harihara",
      phone: "+91 (08192) 242250"
    }
  },

  // ONLY 4 DEPARTMENTS: CSE, CE, ME, ECE
  departments: [
    {
      id: "CSE",
      name: "Computer Science and Engineering",
      code: "CSE",
      intake: 60,
      hod: "Prof. Manjunath B. R. (M.Tech, CSE)",
      description: "Dedicated to training technical diploma engineers in modern computer science, including Python programming, database management, full stack web development, and cloud computing under the DTE Karnataka C-25 and C-20 curricula.",
      labs: [
        "Software Development & Programming Lab",
        "Database Management & Cloud Computing Lab",
        "Computer Networks & Cyber Security Lab",
        "Microprocessor & Hardware Lab"
      ],
      icon: "Laptop"
    },
    {
      id: "CE",
      name: "Civil Engineering",
      code: "CE",
      intake: 60,
      hod: "Prof. Shivakumar G. M. (M.Tech, Structural Engg)",
      description: "Provides practical field training in land surveying using electronic Total Stations, concrete materials testing, environmental engineering, structural drafting, and sustainable building technologies.",
      labs: [
        "Advanced Surveying & Total Station Field Lab",
        "Concrete Technology & Highway Materials Lab",
        "Geotechnical & Soil Testing Lab",
        "Computer Aided Drafting (CAD) Civil Lab"
      ],
      icon: "Building"
    },
    {
      id: "ME",
      name: "Mechanical Engineering",
      code: "ME",
      intake: 60,
      hod: "Prof. Basavarajappa K. H. (M.Tech, Thermal Engg)",
      description: "Equipped with heavy machine shops, lathe centers, CNC simulation tools, thermal engineering setups, and automobile workshops to prepare diploma engineers for manufacturing and industrial sectors.",
      labs: [
        "Machine Shop & Lathe Workshop",
        "CNC Simulation & Robotics Lab",
        "Thermal Engineering & Heat Power Lab",
        "Material Testing & Metallurgy Lab"
      ],
      icon: "Wrench"
    },
    {
      id: "ECE",
      name: "Electronics and Communication Engineering",
      code: "ECE",
      intake: 60,
      hod: "Prof. Renuka Prasad S. (M.Tech, VLSI & Embedded)",
      description: "Focuses on analog and digital electronics, microcontrollers (8051, ARM, ESP32), Internet of Things (IoT), communication systems, optical fiber transmission, and VLSI circuit simulation.",
      labs: [
        "Analog & Digital Electronics Lab",
        "Microcontroller & Embedded Systems Lab",
        "Communication & Microwave Lab",
        "VLSI Design & Circuit Simulation Lab"
      ],
      icon: "Cpu"
    }
  ],

  // Official verified external links
  externalLinks: [
    {
      id: "link-1",
      title: "Karnataka Khajane-II (K2) Online Challan Portal",
      description: "Official Government of Karnataka online portal to generate and pay Diploma Semester Examination Fee challans under DTE Head of Account.",
      url: "https://k2.karnataka.gov.in/",
      category: "Examination Fee",
      official: true
    },
    {
      id: "link-2",
      title: "DTE Karnataka Official Examination Portal",
      description: "Department of Technical Education (DTE) & Board of Technical Examinations (BTE), Bengaluru official portal for exam notifications, timetables, and circulars.",
      url: "https://dtek.karnataka.gov.in/",
      category: "Academic Board",
      official: true
    },
    {
      id: "link-3",
      title: "State Scholarship Portal (SSP Karnataka)",
      description: "Official Post-Matric scholarship portal for SC, ST, OBC, and Minority students to apply for tuition fee and maintenance assistance.",
      url: "https://ssp.postmatric.karnataka.gov.in/",
      category: "Scholarship",
      official: true
    },
    {
      id: "link-4",
      title: "Karnataka Labour Welfare Board (KBOCWWB)",
      description: "Official portal for children of registered building and construction workers to apply for the Labour Card Scholarship (up to ₹12,000/year).",
      url: "https://kbocwwb.karnataka.gov.in/",
      category: "Scholarship",
      official: true
    },
    {
      id: "link-5",
      title: "Vidyasiri Scheme (BCWD Karepass Karnataka)",
      description: "Food and accommodation assistance scheme (FAAS) for rural backward classes students pursuing diploma in Harihara.",
      url: "https://karepass.cgg.gov.in/",
      category: "Scholarship",
      official: true
    },
    {
      id: "link-6",
      title: "National Digital Library of India (NDLI)",
      description: "MHRD initiative providing access to over 7 crore technical e-books, lecture videos, and learning materials for engineering students.",
      url: "https://ndl.iitkgp.ac.in/",
      category: "E-Learning",
      official: true
    }
  ],

  // Semester-Wise Internal Marks (CIE) PDFs uploaded by Admin
  internalMarks: [
    {
      id: "marks-1",
      department: "CSE",
      semester: 5,
      subjectName: "AI & Machine Learning (25CS51T)",
      examName: "Internal Assessment 1 (CIE-1)",
      examDate: "2026-09-15",
      description: "Official CIE-1 marks statement for 5th Semester Computer Science students. Max Marks: 25.",
      fileName: "CSE_Sem5_CIE1_Marks_2026.pdf",
      fileUrl: "/sample-docs/CSE_Sem5_CIE1_Marks_2026.pdf",
      fileSize: "245 KB",
      published: true,
      createdAt: "2026-09-18"
    },
    {
      id: "marks-2",
      department: "ME",
      semester: 5,
      subjectName: "CNC Machining & Automation (25ME51T)",
      examName: "Internal Assessment 1 (CIE-1)",
      examDate: "2026-09-16",
      description: "Official CIE-1 marks list for 5th Semester Mechanical Engineering students. Max Marks: 25.",
      fileName: "ME_Sem5_CIE1_Marks_2026.pdf",
      fileUrl: "/sample-docs/ME_Sem5_CIE1_Marks_2026.pdf",
      fileSize: "210 KB",
      published: true,
      createdAt: "2026-09-19"
    },
    {
      id: "marks-3",
      department: "CE",
      semester: 3,
      subjectName: "Advanced Surveying & Total Station (25CV32T)",
      examName: "Internal Assessment 1 (CIE-1)",
      examDate: "2026-09-17",
      description: "CIE-1 evaluation statement for 3rd Semester Civil Engineering students. Max Marks: 25.",
      fileName: "CE_Sem3_CIE1_Marks_2026.pdf",
      fileUrl: "/sample-docs/CE_Sem3_CIE1_Marks_2026.pdf",
      fileSize: "195 KB",
      published: true,
      createdAt: "2026-09-20"
    },
    {
      id: "marks-4",
      department: "ECE",
      semester: 5,
      subjectName: "Embedded Systems & IoT (25EC51T)",
      examName: "Internal Assessment 1 (CIE-1)",
      examDate: "2026-09-18",
      description: "CIE-1 marks list for 5th Semester Electronics & Communication students. Max Marks: 25.",
      fileName: "ECE_Sem5_CIE1_Marks_2026.pdf",
      fileUrl: "/sample-docs/ECE_Sem5_CIE1_Marks_2026.pdf",
      fileSize: "220 KB",
      published: true,
      createdAt: "2026-09-21"
    }
  ],

  // Distinct separated syllabus: C-25 vs C-20 (ONLY 4 BRANCHES: CSE, CE, ME, ECE, plus ALL)
  subjects: [
    // -------------------------------------------------------------
    // C-25 SCHEME (Course codes start with 25)
    // -------------------------------------------------------------
    {
      id: "c25-sub-1",
      code: "25SC01T",
      name: "Applied Mathematics & Computational Thinking",
      department: "ALL",
      semester: 1,
      scheme: "C-25",
      theoryHours: 4,
      practicalHours: 0,
      credits: 4,
      faculty: "Prof. K. M. Siddesh",
      syllabusSummary: "Linear algebra, computational matrices, trigonometry, differential calculus, vector algebra, and algorithm modeling.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-2",
      code: "25SC02P",
      name: "Applied Sciences & Material Technology",
      department: "ALL",
      semester: 1,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Dr. H. M. Chandrashekar",
      syllabusSummary: "Applied physics, lasers, optical fiber, smart engineering materials, electrochemistry, and water treatment.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-3",
      code: "25EG01T",
      name: "Professional Communication & Digital Literacy",
      department: "ALL",
      semester: 1,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Prof. Geetha N.",
      syllabusSummary: "Corporate communication, technical report writing, digital documentation, and professional presentations.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-4",
      code: "25CS31T",
      name: "Data Structures & Modern Algorithms",
      department: "CSE",
      semester: 3,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Manjunath B. R.",
      syllabusSummary: "Stacks, Queues, Linked Lists, Binary Search Trees, Graph algorithms, and asymptotic complexity.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-5",
      code: "25CS32T",
      name: "Database Management & Cloud SQL",
      department: "CSE",
      semester: 3,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Prof. Anitha K. S.",
      syllabusSummary: "Relational modeling, normalization (1NF-BCNF), complex SQL queries, transactions, and PostgreSQL/MySQL.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-6",
      code: "25CS51T",
      name: "Artificial Intelligence & Machine Learning",
      department: "CSE",
      semester: 5,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Manjunath B. R.",
      syllabusSummary: "Supervised & unsupervised learning, classification, neural networks, OpenCV computer vision, and Python ML pipelines.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-7",
      code: "25CS52T",
      name: "Cyber Security & Ethical Hacking",
      department: "CSE",
      semester: 5,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Prof. Raghavendra P.",
      syllabusSummary: "Penetration testing, cryptography (AES, RSA), network packet inspection, firewalls, and Indian IT Act 2000.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-8",
      code: "25CV31T",
      name: "Mechanics of Materials & Structures",
      department: "CE",
      semester: 3,
      scheme: "C-25",
      theoryHours: 4,
      practicalHours: 2,
      credits: 5,
      faculty: "Prof. Shivakumar G. M.",
      syllabusSummary: "Simple stress and strain, shear force & bending moment diagrams, torsion in shafts, and deflection of beams.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-9",
      code: "25CV32T",
      name: "Drone & Electronic Total Station Surveying",
      department: "CE",
      semester: 3,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Shivakumar G. M.",
      syllabusSummary: "Total station coordinates, contour mapping, drone photogrammetry principles, and digital topographic surveying.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-10",
      code: "25ME31T",
      name: "Manufacturing Technology & Machine Tools",
      department: "ME",
      semester: 3,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Basavarajappa K. H.",
      syllabusSummary: "Lathe operations, milling, shaping, grinding, modern cutting tools, and workshop measurements.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-11",
      code: "25ME51T",
      name: "CNC Machining & Robotics Automation",
      department: "ME",
      semester: 5,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Basavarajappa K. H.",
      syllabusSummary: "G & M code programming, CNC turning/milling simulation, industrial robots, kinematics, and automation.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-12",
      code: "25EC31T",
      name: "Analog Circuits & Linear Integrated Circuits",
      department: "ECE",
      semester: 3,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Prof. Renuka Prasad S.",
      syllabusSummary: "Op-Amp characteristics, active filters, timers (IC 555), voltage regulators, and waveform generators.",
      pdfUrl: ""
    },
    {
      id: "c25-sub-13",
      code: "25EC51T",
      name: "Embedded Systems & IoT Innovation",
      department: "ECE",
      semester: 5,
      scheme: "C-25",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Renuka Prasad S.",
      syllabusSummary: "ARM Cortex architecture, ESP32 Wi-Fi/BLE programming, MQTT protocols, cloud sensor dashboards, and IoT edge devices.",
      pdfUrl: ""
    },

    // -------------------------------------------------------------
    // C-20 SCHEME (Course codes start with 20)
    // -------------------------------------------------------------
    {
      id: "c20-sub-1",
      code: "20SC01T",
      name: "Engineering Mathematics",
      department: "ALL",
      semester: 1,
      scheme: "C-20",
      theoryHours: 4,
      practicalHours: 0,
      credits: 4,
      faculty: "Prof. K. M. Siddesh",
      syllabusSummary: "Matrices, determinants, trigonometry, coordinate geometry, differential calculus, and basic engineering maths.",
      pdfUrl: ""
    },
    {
      id: "c20-sub-2",
      code: "20SC02P",
      name: "Engineering Science",
      department: "ALL",
      semester: 1,
      scheme: "C-20",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Dr. H. M. Chandrashekar",
      syllabusSummary: "Units, mechanics, heat, optics, electrochemistry, and basic chemistry applications.",
      pdfUrl: ""
    },
    {
      id: "c20-sub-3",
      code: "20CS31T",
      name: "Data Structures using C",
      department: "CSE",
      semester: 3,
      scheme: "C-20",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Manjunath B. R.",
      syllabusSummary: "Arrays, stacks, queues, linked lists, trees, graphs, and sorting techniques in C.",
      pdfUrl: ""
    },
    {
      id: "c20-sub-4",
      code: "20CS51T",
      name: "Python Programming & Data Analytics",
      department: "CSE",
      semester: 5,
      scheme: "C-20",
      theoryHours: 3,
      practicalHours: 4,
      credits: 5,
      faculty: "Prof. Manjunath B. R.",
      syllabusSummary: "Python syntax, NumPy, Pandas, Matplotlib, data visualization, and basic machine learning concepts.",
      pdfUrl: ""
    },
    {
      id: "c20-sub-5",
      code: "20CV31T",
      name: "Mechanics of Materials",
      department: "CE",
      semester: 3,
      scheme: "C-20",
      theoryHours: 4,
      practicalHours: 2,
      credits: 5,
      faculty: "Prof. Shivakumar G. M.",
      syllabusSummary: "Stress, strain, SFD, BMD, elastic constants, and mechanical behavior of structural materials.",
      pdfUrl: ""
    },
    {
      id: "c20-sub-6",
      code: "20ME51T",
      name: "Thermal Power Engineering",
      department: "ME",
      semester: 5,
      scheme: "C-20",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Prof. Basavarajappa K. H.",
      syllabusSummary: "Steam boilers, nozzles, turbines, heat exchangers, refrigeration cycles, and psychrometric principles.",
      pdfUrl: ""
    },
    {
      id: "c20-sub-7",
      code: "20EC31T",
      name: "Digital Electronics",
      department: "ECE",
      semester: 3,
      scheme: "C-20",
      theoryHours: 3,
      practicalHours: 2,
      credits: 4,
      faculty: "Prof. Renuka Prasad S.",
      syllabusSummary: "Number systems, logic gates, combinational and sequential logic circuits, flip-flops, counters, and registers.",
      pdfUrl: ""
    }
  ],

  // Academic notices
  notices: [
    {
      id: "not-1",
      title: "DTE Karnataka Odd Semester Diploma Examination Timetable Released",
      category: "Examination",
      date: "2026-11-06",
      urgent: true,
      description: "Board of Technical Examinations (BTE), Bengaluru has issued the official timetable for the upcoming Odd Semester (1st, 3rd, 5th Sem) C-25 & C-20 examinations. Theory examinations begin on Dec 02, 2026.",
      attachmentUrl: "",
      author: "Principal Office, GPT Harihara"
    },
    {
      id: "not-2",
      title: "SSP Karnataka Post-Matric Scholarship 2026-27 e-Attestation Verification Schedule",
      category: "Scholarship",
      date: "2026-11-04",
      urgent: true,
      description: "Eligible SC, ST, OBC (Cat-1, 2A, 2B, 3A, 3B), and Minority students must complete their online application on ssp.postmatric.karnataka.gov.in and submit acknowledgment copy with RD numbers at Office Room 3 for e-attestation.",
      attachmentUrl: "https://ssp.postmatric.karnataka.gov.in/",
      author: "Prof. Anitha K. S. (Scholarship Nodal Officer)"
    },
    {
      id: "not-3",
      title: "Karnataka Labour Card Scholarship (KBOCWWB) 2026-27 Application Notice",
      category: "Scholarship",
      date: "2026-11-02",
      urgent: false,
      description: "Students whose parents are registered with the Karnataka Building & Other Construction Workers Welfare Board can apply for up to ₹12,000 scholarship assistance. Collect study certificate from the administrative counter.",
      attachmentUrl: "https://kbocwwb.karnataka.gov.in/",
      author: "Student Welfare Section"
    },
    {
      id: "not-4",
      title: "C-25 Outcome-Based Teaching Scheme Orientation for First & Third Semester Students",
      category: "Academic",
      date: "2026-10-28",
      urgent: false,
      description: "Department orientation sessions on the newly introduced C-25 curriculum, continuous internal evaluation (CIE), and skill components will be held across all four departments (CSE, CE, ME, ECE).",
      attachmentUrl: "",
      author: "Academic Committee"
    }
  ],

  // Useful Study Materials & Question Banks
  studyMaterials: [
    {
      id: "mat-1",
      title: "Applied Mathematics (25SC01T) Question Bank & Solved Problems",
      department: "ALL",
      semester: 1,
      scheme: "C-25",
      subject: "Applied Mathematics",
      type: "Question Bank",
      fileName: "25SC01T_Question_Bank.pdf",
      fileUrl: "/sample-docs/25SC01T_Question_Bank.pdf",
      fileSize: "1.8 MB",
      uploadedAt: "2026-10-10"
    },
    {
      id: "mat-2",
      title: "Data Structures & Algorithms (25CS31T) Unit-Wise Lecture Handouts",
      department: "CSE",
      semester: 3,
      scheme: "C-25",
      subject: "Data Structures",
      type: "Lecture Notes",
      fileName: "25CS31T_Lecture_Notes.pdf",
      fileUrl: "/sample-docs/25CS31T_Lecture_Notes.pdf",
      fileSize: "2.4 MB",
      uploadedAt: "2026-10-14"
    },
    {
      id: "mat-3",
      title: "Advanced Surveying (25CV32T) Field Practical Manual",
      department: "CE",
      semester: 3,
      scheme: "C-25",
      subject: "Advanced Surveying",
      type: "Lab Manual",
      fileName: "25CV32T_Survey_Manual.pdf",
      fileUrl: "/sample-docs/25CV32T_Survey_Manual.pdf",
      fileSize: "3.1 MB",
      uploadedAt: "2026-10-18"
    },
    {
      id: "mat-4",
      title: "CNC Machining & G-Codes (25ME51T) Quick Reference Guide",
      department: "ME",
      semester: 5,
      scheme: "C-25",
      subject: "CNC Machining",
      type: "Reference Guide",
      fileName: "25ME51T_CNC_Guide.pdf",
      fileUrl: "/sample-docs/25ME51T_CNC_Guide.pdf",
      fileSize: "1.5 MB",
      uploadedAt: "2026-10-20"
    }
  ],

  // Academic Calendar Events
  academicCalendar: [
    { id: "cal-1", date: "2026-07-15", title: "Commencement of Academic Classes (Odd Semesters - 1, 3, 5)", type: "Academic" },
    { id: "cal-2", date: "2026-08-15", title: "Independence Day Flag Hoisting Ceremony", type: "Holiday" },
    { id: "cal-3", date: "2026-09-15", title: "Continuous Internal Evaluation 1 (CIE-1)", type: "Exam" },
    { id: "cal-4", date: "2026-10-16", title: "Continuous Internal Evaluation 2 (CIE-2)", type: "Exam" },
    { id: "cal-5", date: "2026-11-01", title: "Karnataka Rajyotsava Celebrations", type: "Holiday" },
    { id: "cal-6", date: "2026-11-16", title: "DTE Board Practical & Skill Examinations", type: "Exam" },
    { id: "cal-7", date: "2026-12-02", title: "DTE Board Theory Examinations (Odd Semesters)", type: "Exam" },
    { id: "cal-8", date: "2026-12-28", title: "Commencement of Even Semesters (2, 4, 6)", type: "Academic" }
  ],

  // Timetables for the 4 departments
  timetables: {
    "CSE-Sem-5": [
      { day: "Monday", slots: [
        { time: "10:00 - 11:00", subject: "AI & Machine Learning (25CS51T)", room: "Room 101", teacher: "Prof. Manjunath B. R." },
        { time: "11:00 - 12:00", subject: "Cyber Security & Ethical Hacking (25CS52T)", room: "Room 101", teacher: "Prof. Raghavendra P." },
        { time: "12:00 - 01:00", subject: "Cloud Computing (25CS53T)", room: "Room 101", teacher: "Prof. Anitha K. S." },
        { time: "01:00 - 01:45", subject: "LUNCH BREAK", room: "Cafeteria", teacher: "-" },
        { time: "01:45 - 04:45", subject: "AI & ML Python Practical Lab", room: "Lab 1", teacher: "Prof. Manjunath / Staff" }
      ]},
      { day: "Tuesday", slots: [
        { time: "10:00 - 11:00", subject: "Cyber Security (25CS52T)", room: "Room 101", teacher: "Prof. Raghavendra P." },
        { time: "11:00 - 12:00", subject: "AI & Machine Learning (25CS51T)", room: "Room 101", teacher: "Prof. Manjunath B. R." },
        { time: "12:00 - 01:00", subject: "Cloud Computing (25CS53T)", room: "Room 101", teacher: "Prof. Anitha K. S." },
        { time: "01:00 - 01:45", subject: "LUNCH BREAK", room: "Cafeteria", teacher: "-" },
        { time: "01:45 - 04:45", subject: "Cyber Security & Network Config Lab", room: "Lab 2", teacher: "Prof. Raghavendra P." }
      ]}
    ]
  },

  // Faculty Directory (Only 4 departments)
  faculty: [
    {
      id: "fac-1",
      name: "Dr. K. G. Mallikarjuna",
      designation: "Principal & Professor",
      department: "ME",
      qualification: "Ph.D. (Mechanical Engg), M.Tech",
      experience: "26 Years",
      email: "principal.gptharihara@gmail.com",
      phone: "+91 (08192) 242250",
      specialization: "Thermal Power Engineering, CAD/CAM, Technical Administration"
    },
    {
      id: "fac-2",
      name: "Prof. Manjunath B. R.",
      designation: "Head of Department (HOD) - CSE",
      department: "CSE",
      qualification: "M.Tech (Computer Science & Engg)",
      experience: "18 Years",
      email: "hod.cs.gptharihara@gmail.com",
      phone: "+91 94481 23451",
      specialization: "Artificial Intelligence, Python, Data Structures & Algorithms"
    },
    {
      id: "fac-3",
      name: "Prof. Anitha K. S.",
      designation: "Selection Grade Lecturer - CSE & SSP Nodal Officer",
      department: "CSE",
      qualification: "M.Tech (Computer Science)",
      experience: "14 Years",
      email: "anitha.cs@gptharihara.edu.in",
      phone: "+91 94481 23452",
      specialization: "Database Management Systems, Web Technologies, Scholarship Desk"
    },
    {
      id: "fac-4",
      name: "Prof. Shivakumar G. M.",
      designation: "Head of Department (HOD) - Civil",
      department: "CE",
      qualification: "M.Tech (Structural Engineering)",
      experience: "16 Years",
      email: "hod.civil.gptharihara@gmail.com",
      phone: "+91 94481 23453",
      specialization: "Electronic Total Station Surveying, Concrete Technology, Structural Design"
    },
    {
      id: "fac-5",
      name: "Prof. Basavarajappa K. H.",
      designation: "Head of Department (HOD) - Mechanical",
      department: "ME",
      qualification: "M.Tech (Thermal Power Engg)",
      experience: "20 Years",
      email: "hod.mech.gptharihara@gmail.com",
      phone: "+91 94481 23454",
      specialization: "CNC Machining, Industrial Robotics, Thermodynamics"
    },
    {
      id: "fac-6",
      name: "Prof. Renuka Prasad S.",
      designation: "Head of Department (HOD) - ECE",
      department: "ECE",
      qualification: "M.Tech (VLSI & Embedded Systems)",
      experience: "17 Years",
      email: "hod.ece.gptharihara@gmail.com",
      phone: "+91 94481 23455",
      specialization: "Embedded Microcontrollers, IoT Systems, Digital Communication"
    }
  ],

  // Real gallery entries with admin-updatable capability (no fake stock photos)
  gallery: [],

  // Inquiries
  inquiries: []
};
