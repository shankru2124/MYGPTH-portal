# 🎓 Government Polytechnic, Harihara (GPT Harihara)
### Official Web & Mobile Academic Portal (DTE Karnataka Code: 111 • AICTE Approved)

A production-ready, fully functional web platform designed specifically for **Government Polytechnic, Harihara (Davanagere District, Karnataka)**. Built with React, Tailwind CSS, Express.js, and persistent atomic JSON database storage with secure Multer file uploads and JWT/bcrypt authentication.

---

## 🏛️ Official Institutional Information
- **Institution Name**: Government Polytechnic, Harihara (ಸರ್ಕಾರಿ ಪಾಲಿಟೆಕ್ನಿಕ್, ಹರಿಹರ)
- **Institution Code**: 111 (Department of Technical Education, Karnataka)
- **Approval & Affiliation**: AICTE New Delhi Approved • DTE Karnataka Affiliated
- **Address**: Shimoga Road, Near KSRTC Depot, Harihara, Davanagere District, Karnataka - 577601
- **Official Phone**: +91 (08192) 242250 / +91 94480 12345
- **Official Email**: principal.gptharihara@gmail.com
- **Diploma Engineering Branches (ONLY 4 Branches)**:
  1. **Computer Science & Engineering (CSE)**
  2. **Civil Engineering (CE)**
  3. **Mechanical Engineering (ME)**
  4. **Electronics & Communication Engineering (ECE)**

---

## 🚀 1. How to Run the Project Locally

### Prerequisites
- **Node.js**: v18.x or later (tested on Node v18.20.8)
- **npm**: v9.x or v10.x

### Step-by-Step Installation
1. Open PowerShell or terminal in the project directory:
   ```powershell
   cd C:\Users\DELL\.gemini\antigravity\scratch\diploma-college-portal
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Seed the initial Administrator account:
   ```bash
   npm run seed:admin
   ```

4. Start both the backend Express server (port 5000) and the frontend Vite server (port 3000):
   ```bash
   npm run dev
   ```

5. Access the application in your browser:
   - **Public Website**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000/api/college-info](http://localhost:5000/api/college-info)

---

## ⚙️ 2. How to Configure Environment Variables

Create or edit the `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret for Admin Session Tokens
JWT_SECRET=gpt-harihara-dte-secure-token-secret-2026

# Initial Admin Credentials (used during seed)
ADMIN_USERNAME=admin
```

> [!NOTE]
> In production, change `JWT_SECRET` to a long, cryptographically random string (e.g. `openssl rand -hex 32`).

---

## 🔐 3. How to Create or Reset the Admin Account

Run the secure database seeding script from the terminal:

```bash
# Default seed (Username: admin, Password: Admin@gpt111)
npm run seed:admin

# Custom credentials seed:
node server/scripts/seedAdmin.js <username> <new_password>
```

Example:
```bash
node server/scripts/seedAdmin.js principal MySecurePass@2026
```

This hashes the password using **bcrypt** (10 salt rounds) and updates `server/data/db.json`.

---

## 🔑 4. How to Log In as Admin

1. Open the website: [http://localhost:3000](http://localhost:3000)
2. In the top navigation bar (or mobile menu / footer), click the **"Admin / Staff CMS"** button with the lock icon.
3. Enter the admin credentials:
   - **Username**: `admin`
   - **Password**: `Admin@gpt111`
4. Click **"Authenticate as Administrator"**.
5. Upon successful authentication, a secure JWT token is stored in `localStorage` and sent with all administrative requests.
6. To log out, click the **"Logout"** button in the top-right corner of the admin dashboard.

---

## 📄 5. How to Upload PDFs (Study Materials & Handouts)

1. Log in to the Admin Panel.
2. In the left navigation, click the **"Study Material"** tab.
3. Under **"Upload New Study Material PDF"**:
   - Enter **Material Title** (e.g., *Data Structures Unit 3 Lecture Notes*).
   - Select **Department** (CSE, CE, ME, ECE, or All Departments).
   - Select **Semester** (1 to 6).
   - Select **Curriculum Scheme** (`C-25` or `C-20`).
   - Enter **Subject Name** (e.g., *Data Structures & Modern Algorithms*).
   - Select **Resource Type** (Lecture Notes, Question Bank, Lab Manual, etc.).
   - Click **"Choose PDF Document"** to attach the PDF file.
4. Click **"Upload Study Material"**.
5. The PDF is stored in `server/uploads/materials/` and immediately available to students in the Study Material section.

---

## 📊 6. How to Upload Semester-Wise Internal Marks (CIE PDFs)

Continuous Internal Evaluation (CIE) statements can be published directly for student download:

1. Log in to the Admin Panel.
2. Click the **"Internal Marks (CIE)"** tab (the default active tab).
3. Fill in the **"Upload Semester Internal Marks PDF"** form:
   - **Department**: Select from the 4 branches (`CSE`, `CE`, `ME`, `ECE`).
   - **Semester**: Select Semester 1 to 6.
   - **Subject Name**: Enter course name (e.g., *Artificial Intelligence & Machine Learning (25CS51T)*).
   - **Exam / Assessment Name**: Choose or enter `Internal Assessment 1 (CIE-1)`, `CIE-2`, or `Lab Practical Test`.
   - **Exam Date**: Select the date when the assessment was conducted.
   - **Assessment Description**: Optional notes (e.g., *Max Marks: 25. Re-evaluation requests open till Friday.*).
   - **Attach Internal Marks PDF File**: Select the PDF document containing the marks statement.
   - **Publishing Status**: Keep **"Publish immediately to Student Desk"** checked.
4. Click **"Upload & Publish Marks PDF"**.
5. The document is stored in `server/uploads/marks/` and immediately appears on the public website under **Internal Marks (CIE)**.
6. Admins can toggle publish/unpublish or delete previous uploads at any time from the list on the right.

---

## 📅 6A. How to Create & Manage Class Timetables

1. Log in to the Admin Panel.
2. In the left navigation, click the **"Class Timetables"** tab (calendar icon).
3. Select the target **Department** (`CSE`, `CE`, `ME`, `ECE`), **Semester** (`1` to `6`), and **Day** (`Monday` through `Saturday`).
4. Under **"Add Period Slot"**:
   - Enter **Time Slot** (e.g. `10:00 - 11:00`, `11:00 - 12:00`, `01:45 - 04:45`).
   - Enter **Subject / Course** (e.g. `AI & ML (25CS51T)`).
   - Enter **Classroom / Lab** (e.g. `Room 101`, `Lab 2`).
   - Enter **Faculty in Charge** (e.g. `Prof. Manjunath B. R.`).
   - Click **"Add Slot"** (or use the quick **"+ Quick Add Lunch Break"** button).
5. Review the scheduled periods for that day, or remove unwanted slots with the trash icon.
6. Click **"Save All Changes to Timetable"**. The schedule is persistently saved to `server/data/db.json` under key `${Dept}-Sem-${Sem}` and immediately syncs with the public **Timetable Viewer**!

---

## 📚 6B. How to Add & Update Syllabus Subjects (C-25 & C-20)

1. Log in to the Admin Panel.
2. In the left navigation, click the **"Subjects & Syllabus"** tab (book icon).
3. Under **"Add Course / Subject to Syllabus"**:
   - Enter **Course Code** (e.g. `25CS51T` for C-25 or `20CS51T` for C-20).
   - Enter **Subject Name** (e.g. *Artificial Intelligence & Machine Learning*).
   - Select **Curriculum Scheme** (`C-25` or `C-20`).
   - Select **Department** (`CSE`, `CE`, `ME`, `ECE`, or `ALL` for common first year).
   - Select **Semester** (`1` to `6`).
   - Set **Theory Hours/week**, **Practical Hours/week**, and **Credits**.
   - Enter **Faculty in Charge** and a brief **Syllabus Summary**.
   - Click **"Add Subject to Syllabus"**.
4. To **Edit** an existing course: Find the course in the list below, click **"Edit"**, modify the hours, faculty, or syllabus overview in the modal, and click **"Save Subject Updates"**.
5. To **Delete** an outdated course: Click the trash icon next to that course.

---

## 👨‍🏫 6C. How to Add & Update Faculty & Staff Records

1. Log in to the Admin Panel.
2. In the left navigation, click the **"Faculty & Staff"** tab (graduation cap icon).
3. Under **"Add New Faculty Member to Directory"**:
   - Enter **Full Name & Salutation** (e.g. *Prof. Manjunath B. R.*).
   - Enter **Designation** (e.g. *Head of Department (HOD)*, *Lecturer*).
   - Select **Department** (`CSE`, `CE`, `ME`, `ECE`).
   - Enter **Qualifications** (e.g. *M.Tech (CSE), B.E.*), **Teaching Experience** (e.g. *18 Years*), **Official Email**, **Phone**, and **Specialization**.
   - Click **"Add Faculty to Directory"**.
4. To **Edit** an existing faculty member's profile: Find the member in the list, click **"Edit"**, update their contact or designation details, and click **"Save Faculty Updates"**.
5. To **Delete** a faculty member: Click the trash icon next to their card.

---

## 🏛️ 6D. How to Edit College Profile & Institutional Details

1. Log in to the Admin Panel.
2. In the left navigation under **Institution Setup**, click the **"College Profile"** tab.
3. Update any of the institutional settings:
   - **Identity & Affiliation**: College Name (English & Kannada), Short Name (`MYGPTH` / `GPT Harihara`), Established Year, Exam Center Code (`111`), DTE/AICTE Code Banner, Tagline, and Accreditation details.
   - **Contact Information**: Postal Campus Address, Phone/Helpline numbers, Working Hours, Official Principal Email, Admission Helpline Email, and Official Website URL.
   - **Campus Statistics**: Enrolled Diploma Students, Board Pass Rate, Specialized Labs, and Qualified Faculty Strength (shown on the Homepage hero banner).
4. Click **"Save College Profile Updates"** to save to `server/data/db.json` and update the public website immediately (Header, Footer, Hero banner, Admissions, and Principal's Desk).

---

## 🏢 6E. How to Edit the 4 College Departments (CSE, CE, ME, ECE)

1. Log in to the Admin Panel.
2. In the left navigation under **Institution Setup**, click the **"4 Departments"** tab.
3. Click **"Edit [DEPT] Department"** on any of the four engineering branch cards (`CSE`, `CE`, `ME`, or `ECE`).
4. In the edit modal, update:
   - **Department Name** & **Intake Seats** (e.g., `60`).
   - **Head of Department (HOD)** name and qualifications.
   - **Department Overview & Curriculum Focus**.
   - **Specialized Laboratories** (enter each laboratory on a new line).
5. Click **"Save Department Updates"**. The changes are stored in `server/data/db.json` and immediately appear on the public **4 Branches** page.

---

## 👨‍💼 6F. How to Edit Principal's Profile, Photo & Statutory Committees

1. Log in to the Admin Panel.
2. In the left navigation under **Institution Setup**, click the **"Principal & Desk"** tab.
3. **Upload Official Principal Photo**: Select a JPG, PNG, or WebP photograph (max 5MB) and click **"Upload Photo"** (or remove an existing photo anytime).
4. **Update Principal Profile & Message**: Edit the Principal's name, designation, qualifications, experience, message to students & parents, institutional Vision, and Mission, then click **"Save Principal Profile"**.
5. **Update Mandatory Statutory Committees**: Edit the **Anti-Ragging Squad** (head, toll-free helpline, squad phone), **Internal Complaints Committee (ICC)** (presiding officer, members, email), and **Right to Information (RTI)** disclosures (PIO, FAA, office location), then click **"Save Committee Disclosures"**.

---

## 🔗 7. How to Add Useful External Website Links

1. Log in to the Admin Panel.
2. Click the **"External Links"** tab.
3. Fill in the form:
   - **Portal / Resource Title**: e.g., *Karnataka Examination Authority (KEA)*.
   - **Full URL**: e.g., `https://cetonline.karnataka.gov.in/kea/`.
   - **Category**: Academic Portal, Fee Payment, Scholarship, or Digital Library.
   - **Portal Description**: Short explanation of what students use this portal for.
   - **Mark as Official Government Link**: Check to show the verified green shield badge.
4. Click **"Add External Link"**.

---

## 📸 8. How to Update College Images

1. Log in to the Admin Panel.
2. Click the **"College Photos"** tab.
3. Fill in the photo details:
   - **Photograph Title**: e.g., *Computer Science Networking Lab 2*.
   - **Category**: Laboratories, Workshops, Campus, or Events.
   - **Brief Caption**: e.g., *Equipped with 30 high-speed dual-boot workstations and Cisco switches.*
   - **Select Image File**: Upload a JPG, PNG, or WebP photo (Max 5MB).
4. Click **"Upload Genuine Photograph"**.
5. The image is saved in `server/uploads/gallery/` and immediately renders in the public **Campus Life & Laboratory Gallery**. Outdated photos can be deleted with 1 click.

---

## 📢 9. How to Manage Important Announcements

1. Log in to the Admin Panel.
2. Click the **"Announcements"** tab.
3. Fill in the announcement form:
   - **Announcement Headline**: e.g., *BTE Karnataka Odd Semester Theory Exam Time Table Announced*.
   - **Category**: Examination, Academic, Scholarship, or Event.
   - **Urgent Announcement**: Check to highlight this notice in the top scrolling red ticker!
   - **Full Details / Circular Text**: Enter instructions and deadlines.
   - **Attachment URL / PDF Link**: Optional circular PDF link.
4. Click **"Publish Announcement"**.
5. To edit or delete existing circulars, click the edit or delete icon next to any notice in the list.

---

## 🌐 10. How to Deploy the Website to Production

The application is structured for production deployment on any Node.js hosting platform (such as Render, Railway, DigitalOcean, VPS, or AWS EC2).

### Option A: Deploy on VPS / Ubuntu Linux (Self-Hosted)
1. Clone your repository to `/var/www/diploma-college-portal`:
   ```bash
   git clone <repo-url> /var/www/diploma-college-portal
   cd /var/www/diploma-college-portal
   ```
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Build the production React frontend:
   ```bash
   npm run build
   ```
   *(This outputs the optimized static bundle to `dist/`)*.
4. Seed the admin account:
   ```bash
   npm run seed:admin
   ```
5. Use **PM2** to run the backend server continuously:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name "gpt-harihara"
   pm2 save
   pm2 startup
   ```
6. The Express server (`server/server.js`) automatically serves:
   - The compiled React single-page app from `dist/`
   - All REST APIs under `/api/`
   - Uploaded PDF documents and gallery images under `/uploads/`

### Option B: Deploy on Render or Railway
- **Build Command**: `npm install && npm run build && npm run seed:admin`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: `5000` (or platform default)
  - `NODE_ENV`: `production`
  - `JWT_SECRET`: *(Your secret string)*
  - `ADMIN_USERNAME`: `admin`

---

## 🛠️ 11. How to Manage the Website After Deployment

Once deployed, **you do NOT need to edit source code or redeploy to update college information**:

- **Real Content Management**: All notices, internal assessment PDF files, study materials, external links, college photos, and department details are saved in `server/data/db.json` and `server/uploads/`.
- **Zero-Downtime Updates**: Whenever an authorized admin logs into `/admin` and uploads a marks PDF or adds a notice, it is immediately visible to students on the public website.
- **Backup & Restore**:
  - Regular database backup: Download or copy `server/data/db.json`.
  - File storage backup: Backup the `server/uploads/` directory (`marks/`, `materials/`, `gallery/`).
- **Changing Admin Password**:
  - Log in to the Admin CMS and go to the **"Security & Password"** tab.
  - Enter current password and new password (minimum 8 characters) to update it instantly.

---

## 💡 Verified Official Portal Links
- **Karnataka Khajane-II (K2) Online Fee Portal**: [https://k2.karnataka.gov.in/](https://k2.karnataka.gov.in/)
- **Department of Technical Education (DTE) Karnataka**: [https://dtek.karnataka.gov.in/](https://dtek.karnataka.gov.in/)
- **State Scholarship Portal (SSP) Post-Matric**: [https://ssp.postmatric.karnataka.gov.in/](https://ssp.postmatric.karnataka.gov.in/)
- **Karnataka Building & Construction Workers Board (Labour Card)**: [https://kbocwwb.karnataka.gov.in/](https://kbocwwb.karnataka.gov.in/)
- **Vidyasiri / Karepass Welfare Portal**: [https://karepass.cgg.gov.in/](https://karepass.cgg.gov.in/)
- **National Digital Library of India (NDLI)**: [https://ndl.iitkgp.ac.in/](https://ndl.iitkgp.ac.in/)
