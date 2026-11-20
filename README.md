# 📚 Smart Study Planner

A responsive **frontend-only** web application that helps students organize study schedules, manage academic tasks, and track learning progress.

This project was developed as a **final-year engineering mini project** using HTML, CSS, JavaScript, and Bootstrap. All data is stored in the browser using **Local Storage**, so no backend or database is required.

---

## 🚀 Live Demo

https://royyalapriyanka.github.io/SmartStudyPlanner/

---

## 📸 Features

- ✅ Add, edit, delete, and complete study tasks
- 🔍 Search tasks by title, subject, or description
- 🎯 Filter tasks by subject, category, priority, and status
- 📅 Monthly calendar view with highlighted task dates
- 📊 Study progress tracking using Bootstrap progress bars
- 💡 Random motivational study quotes
- 💾 Automatic data storage using Browser Local Storage
- 📱 Fully responsive design for mobile, tablet, and desktop

---

## 🛠️ Technology Stack

- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Bootstrap Icons
- Browser Local Storage

> **Note:** This project does not use React, Angular, Vue, Node.js, Firebase, or any backend technology.

---

## 📂 Project Structure

```
SmartStudyPlanner
│
├── index.html
├── dashboard.html
├── tasks.html
├── about.html
├── contact.html
│
├── css
│   ├── style.css
│   └── dashboard.css
│
├── js
│   ├── script.js
│   ├── storage.js
│   └── task.js
│
├── images
│   └── favicon.svg
│
├── README.md
├── package.json
└── .gitignore
```

---

## 📄 Pages

| Page | Description |
|------|-------------|
| Home | Landing page with hero section and project overview |
| Dashboard | Displays today's tasks, upcoming tasks, completed tasks, calendar, and progress |
| Tasks | Create, update, delete, search, filter, and sort study tasks |
| About | Project overview, technology stack, and key features |
| Contact | Contact form and project contact information |

---

## ▶️ Running the Project

### Option 1 (Recommended)

Simply open **index.html** in any modern web browser.

### Option 2 (Using Vite)

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

---

## 💾 Data Storage

This application uses **Browser Local Storage**.

Example:

```javascript
localStorage.setItem(key, JSON.stringify(tasks));
JSON.parse(localStorage.getItem(key));
```

**Note:** Clearing browser data will remove all saved tasks.

---

## 🎯 Project Objectives

- Improve study planning and time management
- Practice JavaScript DOM manipulation
- Build a responsive user interface using Bootstrap
- Learn browser-based data storage using Local Storage

---

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

## 👩‍💻 Developer

**Royyala Priyanka**

- GitHub: https://github.com/royyalapriyanka

---

## 📄 License

This project is created for educational and learning purposes.