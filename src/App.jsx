import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import html2canvas from "html2canvas";

const DB_KEY = "gigstart_db_v7";
const SESSION_KEY = "gigstart_current_user_v7";
const TODAY = "2026-05-04";

// --- Seed Data ---
const seedData = {
  users: [
    {
      id: "admin_001",
      name: "GigStart Admin",
      email: "admin@gigstart.local",
      password: "admin123",
      role: "ADMIN",
      avatarUrl: "",
      interest: [],
      targetRole: "Platform Admin",
      phone: "",
      location: "Local Demo",
      education: "",
      institution: "",
      headline: "GigStart Platform Administrator",
      bio: "Seeded admin account for local demo review.",
      preferredWorkTypes: [],
      preferredEmploymentTypes: [],
      preferredLocations: [],
      experienceLevel: "Intermediate",
      selfDeclaredSkills: [],
      portfolioLinks: { linkedin: "", github: "", portfolio: "", figma: "", kaggle: "", other: "" },
      privacy: { profileVisibility: "PRIVATE", showCertificates: false, showScores: false, showVerifiedSkills: false, showSelfDeclaredSkills: false },
      notifications: { jobUnlocked: true, certificateIssued: true, applicationUpdated: true, moduleReminder: false },
      activeCareerPathId: null,
      createdAt: TODAY,
      updatedAt: TODAY,
    },
    {
      id: "user_001",
      name: "Ikbar Faiz",
      email: "faiz@gigstart.local",
      password: "user123",
      role: "USER",
      avatarUrl: "",
      phone: "",
      interest: ["Data", "Analytics"],
      targetRole: "Data Analyst Intern",
      location: "Jakarta, Indonesia",
      education: "Computer Science Student",
      institution: "BINUS University",
      headline: "Aspiring Data Analyst Intern",
      bio: "Interested in data analytics, SQL, dashboards, and business reporting.",
      preferredWorkTypes: ["Remote", "Hybrid"],
      preferredEmploymentTypes: ["Internship"],
      preferredLocations: ["Jakarta", "Remote"],
      experienceLevel: "Beginner",
      selfDeclaredSkills: ["Excel", "Python", "Communication"],
      portfolioLinks: { linkedin: "https://linkedin.com/in/ikbarfaiz", github: "https://github.com/ikbarfaiz", portfolio: "", figma: "", kaggle: "", other: "" },
      privacy: { profileVisibility: "PUBLIC", showCertificates: true, showScores: true, showVerifiedSkills: true, showSelfDeclaredSkills: true },
      notifications: { jobUnlocked: true, certificateIssued: true, applicationUpdated: true, moduleReminder: false },
      activeCareerPathId: "path_da",
      createdAt: TODAY,
      updatedAt: TODAY,
    },
  ],
  careerPaths: [
    {
      id: "path_da",
      code: "DA",
      name: "Data Analyst Intern Readiness",
      level: "Beginner",
      description: "Prepare users for entry-level data analyst internship roles.",
      passingGrade: 75,
      moduleIds: ["mod_sql", "mod_cleaning", "mod_dashboard", "mod_final"],
      relatedJobIds: ["job_da_001", "job_bi_001", "job_report_001"],
      status: "ACTIVE",
    },
    {
      id: "path_fe",
      code: "FE",
      name: "Frontend Developer Intern Readiness",
      level: "Beginner",
      description: "Prepare users for HTML, CSS, JavaScript, Git, and responsive layout work.",
      passingGrade: 75,
      moduleIds: ["mod_fe_htmlcss", "mod_fe_javascript", "mod_fe_git", "mod_fe_final"],
      relatedJobIds: ["job_fe_001", "job_fe_002"],
      status: "ACTIVE",
    },
    {
      id: "path_ux",
      code: "UX",
      name: "UI/UX Designer Intern Readiness",
      level: "Beginner",
      description: "Prepare users for basic research, wireframing, user flow, and Figma tasks.",
      passingGrade: 70,
      moduleIds: ["mod_ux_persona", "mod_ux_wireframe", "mod_ux_design", "mod_ux_final"],
      relatedJobIds: ["job_ux_001", "job_ux_002"],
      status: "ACTIVE",
    },
  ],
  modules: [
    {
      id: "mod_sql",
      careerPathId: "path_da",
      title: "SQL Basic",
      description: "Learn basic SQL query structure for data analysis.",
      material: "SQL is used to retrieve and manage data from relational databases. A basic query can use SELECT, FROM, WHERE, and ORDER BY.",
      passingGrade: 75,
      order: 1,
      moduleType: "Quiz + SQL Task",
      assessmentId: "assess_sql",
      status: "ACTIVE",
    },
    {
      id: "mod_cleaning",
      careerPathId: "path_da",
      title: "Data Cleaning Basic",
      description: "Learn how to prepare messy datasets before analysis.",
      material: "Data cleaning checks duplicates, missing values, inconsistent formats, and values that are not ready for analysis.",
      passingGrade: 75,
      order: 2,
      moduleType: "Written Task",
      assessmentId: "assess_cleaning",
      status: "ACTIVE",
    },
    {
      id: "mod_dashboard",
      careerPathId: "path_da",
      title: "Dashboard Interpretation",
      description: "Learn to read dashboard signals and turn them into business insight.",
      material: "A dashboard should be interpreted by comparing metrics, identifying movement, and translating findings into actions.",
      passingGrade: 75,
      order: 3,
      moduleType: "Case Study",
      assessmentId: "assess_dashboard",
      status: "ACTIVE",
    },
    {
      id: "mod_final",
      careerPathId: "path_da",
      title: "Final Assessment",
      description: "Complete a mini case study that combines data needs, cleaning, SQL, dashboard insight, and recommendation.",
      material: "Final assessment validates whether a user can connect data preparation, SQL query, dashboard interpretation, and recommendation.",
      passingGrade: 75,
      order: 4,
      moduleType: "Mini Case Study",
      assessmentId: "assess_final",
      status: "ACTIVE",
    },
    {
      id: "mod_ux_persona",
      careerPathId: "path_ux",
      title: "UX Research & User Persona",
      description: "Learn user empathy, interviewing, empathy maps, and constructing user personas.",
      material: "UX research is about understanding user behaviors, needs, and motivations through observations, interviews, and feedback. User Personas represent archetypical users whose goals and characteristics represent the needs of a larger group.",
      passingGrade: 70,
      order: 1,
      moduleType: "Written Task",
      assessmentId: "assess_ux_persona",
      status: "ACTIVE",
    },
    {
      id: "mod_ux_wireframe",
      careerPathId: "path_ux",
      title: "User Flow & Wireframing",
      description: "Learn Information Architecture, User Flows, and wireframing for navigability.",
      material: "Information Architecture patterns establish how content is structured. User Flows define the paths user take to accomplish tasks, and wireframes are low-fidelity blueprints that outline layout structure.",
      passingGrade: 70,
      order: 2,
      moduleType: "Written Task",
      assessmentId: "assess_ux_wireframe",
      status: "ACTIVE",
    },
    {
      id: "mod_ux_design",
      careerPathId: "path_ux",
      title: "Visual Design & Figma Basics",
      description: "Master layout principles, accessibility guidelines, and component design in Figma.",
      material: "Visual Design centers on hierarchy, typography, grids, and colors. Figma features like Auto Layout enable responsive layouts. Accessibility standards like WCAG AA require a minimum 4.5:1 color contrast ratio.",
      passingGrade: 70,
      order: 3,
      moduleType: "Quiz + Figma Task",
      assessmentId: "assess_ux_design",
      status: "ACTIVE",
    },
    {
      id: "mod_ux_final",
      careerPathId: "path_ux",
      title: "UI/UX Final Capstone Assessment",
      description: "Combine research, wireframing, flow, and high-fidelity styling into a portfolio case study.",
      material: "The Capstone project assesses your end-to-end design process, from identifying a user problem to outlining flows, designing mockups, and presenting a cohesive design case study.",
      passingGrade: 70,
      order: 4,
      moduleType: "Mini Case Study",
      assessmentId: "assess_ux_final",
      status: "ACTIVE",
    },
    {
      id: "mod_fe_htmlcss",
      careerPathId: "path_fe",
      title: "HTML & CSS Basics",
      description: "Learn semantic markup, CSS box model, responsive layouts, and Flexbox/Grid systems.",
      material: "HTML provides page structure with semantic elements like <header>, <nav>, <main>, and <section>. CSS styles elements, applying the Box Model (margin, border, padding, content). Responsive designs use Media Queries and layout models like Flexbox and CSS Grid.",
      passingGrade: 75,
      order: 1,
      moduleType: "Quiz + Code Task",
      assessmentId: "assess_fe_htmlcss",
      status: "ACTIVE",
    },
    {
      id: "mod_fe_javascript",
      careerPathId: "path_fe",
      title: "JavaScript Core & DOM Manipulation",
      description: "Master variables, array methods, functions, event listeners, and dynamic UI updates.",
      material: "JavaScript adds interactivity to web pages. Developers use event listeners (like click events) to capture user input, manipulate the Document Object Model (DOM) to update content dynamically, and filter arrays of data.",
      passingGrade: 75,
      order: 2,
      moduleType: "Code/Written Task",
      assessmentId: "assess_fe_javascript",
      status: "ACTIVE",
    },
    {
      id: "mod_fe_git",
      careerPathId: "path_fe",
      title: "Git & Version Control",
      description: "Understand code management, branching strategy, staging, and pushing changes.",
      material: "Git manages codebase history. Key workflows include checking out a branch (git checkout -b <name>), staging files (git add .), committing changes with a message (git commit -m 'msg'), and pushing to a remote (git push origin <branch>).",
      passingGrade: 75,
      order: 3,
      moduleType: "Written Task",
      assessmentId: "assess_fe_git",
      status: "ACTIVE",
    },
    {
      id: "mod_fe_final",
      careerPathId: "path_fe",
      title: "Frontend Capstone Assessment",
      description: "Build a responsive, interactive catalog card component using HTML, CSS, and JS.",
      material: "The Capstone evaluates end-to-end frontend skills. You will detail how to build an interactive component by combining semantic markup, responsive media queries, and click action event listeners.",
      passingGrade: 75,
      order: 4,
      moduleType: "Mini Case Study",
      assessmentId: "assess_fe_final",
      status: "ACTIVE",
    },
  ],
  assessments: [
    {
      id: "assess_sql",
      moduleId: "mod_sql",
      title: "SQL Basic Assessment",
      components: [
        { label: "Multiple Choice Quiz", weight: 40, questionIds: ["q_sql_001", "q_sql_002"] },
        { label: "SQL Written Task", weight: 60, questionIds: ["q_sql_003"] },
      ],
    },
    {
      id: "assess_cleaning",
      moduleId: "mod_cleaning",
      title: "Data Cleaning Basic Assessment",
      components: [{ label: "Written Cleaning Plan", weight: 100, questionIds: ["q_clean_001"] }],
    },
    {
      id: "assess_dashboard",
      moduleId: "mod_dashboard",
      title: "Dashboard Interpretation Assessment",
      components: [{ label: "Dashboard Case Study", weight: 100, questionIds: ["q_dash_001"] }],
    },
    {
      id: "assess_final",
      moduleId: "mod_final",
      title: "Final Data Analyst Readiness Assessment",
      components: [{ label: "Mini Case Study", weight: 100, questionIds: ["q_final_001"] }],
    },
    {
      id: "assess_ux_persona",
      moduleId: "mod_ux_persona",
      title: "UX Research Assessment",
      components: [{ label: "Written Persona Draft", weight: 100, questionIds: ["q_ux_persona_001"] }],
    },
    {
      id: "assess_ux_wireframe",
      moduleId: "mod_ux_wireframe",
      title: "User Flow Assessment",
      components: [{ label: "User Flow Outline", weight: 100, questionIds: ["q_ux_wireframe_001"] }],
    },
    {
      id: "assess_ux_design",
      moduleId: "mod_ux_design",
      title: "Visual Design & Figma Assessment",
      components: [
        { label: "Multiple Choice Quiz", weight: 40, questionIds: ["q_ux_design_001", "q_ux_design_002"] },
        { label: "Visual Accessibility Task", weight: 60, questionIds: ["q_ux_design_003"] },
      ],
    },
    {
      id: "assess_ux_final",
      moduleId: "mod_ux_final",
      title: "UI/UX Capstone Assessment",
      components: [{ label: "Mini Case Study Portfolio", weight: 100, questionIds: ["q_ux_final_001"] }],
    },
    {
      id: "assess_fe_htmlcss",
      moduleId: "mod_fe_htmlcss",
      title: "HTML & CSS Assessment",
      components: [
        { label: "Multiple Choice Quiz", weight: 40, questionIds: ["q_fe_htmlcss_001", "q_fe_htmlcss_002"] },
        { label: "Responsive CSS Layout Task", weight: 60, questionIds: ["q_fe_htmlcss_003"] },
      ],
    },
    {
      id: "assess_fe_javascript",
      moduleId: "mod_fe_javascript",
      title: "JavaScript Core Assessment",
      components: [{ label: "JS Coding Task", weight: 100, questionIds: ["q_fe_javascript_001"] }],
    },
    {
      id: "assess_fe_git",
      moduleId: "mod_fe_git",
      title: "Git & Version Control Assessment",
      components: [{ label: "Git Sequence Task", weight: 100, questionIds: ["q_fe_git_001"] }],
    },
    {
      id: "assess_fe_final",
      moduleId: "mod_fe_final",
      title: "Frontend Capstone Assessment",
      components: [{ label: "Mini Case Study Portfolio", weight: 100, questionIds: ["q_fe_final_001"] }],
    },
  ],
  questions: [
    { id: "q_sql_001", assessmentId: "assess_sql", type: "MULTIPLE_CHOICE", question: "Which SQL clause is used to filter rows?", options: ["SELECT", "WHERE", "GROUP BY", "ORDER BY"], correctAnswer: "WHERE", maxScore: 20, order: 1 },
    { id: "q_sql_002", assessmentId: "assess_sql", type: "MULTIPLE_CHOICE", question: "Which SQL keyword is used to sort data?", options: ["WHERE", "JOIN", "ORDER BY", "LIMIT"], correctAnswer: "ORDER BY", maxScore: 20, order: 2 },
    { id: "q_sql_003", assessmentId: "assess_sql", type: "CODE_ANSWER", question: "Write an SQL query to select name and score from applicants where score is greater than or equal to 75.", maxScore: 90, rubricId: "rubric_sql_basic", order: 3 },
    { id: "q_clean_001", assessmentId: "assess_cleaning", type: "TEXT_AREA", question: "A dataset contains duplicate rows, missing values, and inconsistent date formats. Explain three cleaning steps you would do before analysis.", maxScore: 100, rubricId: "rubric_cleaning_basic", order: 1 },
    { id: "q_dash_001", assessmentId: "assess_dashboard", type: "TEXT_AREA", question: "A sales dashboard shows revenue increased by 20%, but customer complaints increased by 35%. Write a short insight and one business recommendation.", maxScore: 100, rubricId: "rubric_dashboard_interpretation", order: 1 },
    { id: "q_final_001", assessmentId: "assess_final", type: "TEXT_AREA", question: "A company wants to identify high-performing applicants from a dataset. Write what data you need, how you would clean it, one SQL query example, one dashboard insight, and one recommendation.", maxScore: 100, rubricId: "rubric_final_assessment", order: 1 },
    { id: "q_ux_persona_001", assessmentId: "assess_ux_persona", type: "TEXT_AREA", question: "You are designing a food delivery app for busy college students. Based on research showing that students often lack time between classes and have tight budgets, formulate 1 User Persona (Name, 2 pain points, and 2 core needs)!", maxScore: 100, rubricId: "rubric_ux_persona", order: 1 },
    { id: "q_ux_wireframe_001", assessmentId: "assess_ux_wireframe", type: "TEXT_AREA", question: "Write down the step-by-step user flow (from Home screen to successful checkout) for a user who wants to purchase a book on an e-commerce app. Include a decision point in case the book is out of stock!", maxScore: 100, rubricId: "rubric_ux_wireframe", order: 1 },
    { id: "q_ux_design_001", assessmentId: "assess_ux_design", type: "MULTIPLE_CHOICE", question: "Which Figma feature is used to create responsive components whose sizes automatically adjust to the content?", options: ["Constraints", "Auto Layout", "Frame Scaling", "Component Sets"], correctAnswer: "Auto Layout", maxScore: 20, order: 1 },
    { id: "q_ux_design_002", assessmentId: "assess_ux_design", type: "MULTIPLE_CHOICE", question: "What is the minimum contrast ratio recommended by WCAG 2.1 Level AA for normal text?", options: ["3:1", "4.5:1", "7:1", "10:1"], correctAnswer: "4.5:1", maxScore: 20, order: 2 },
    { id: "q_ux_design_003", assessmentId: "assess_ux_design", type: "TEXT_AREA", question: "Identify 3 visual accessibility problems commonly found in website design and explain how to address them!", maxScore: 60, rubricId: "rubric_ux_design", order: 3 },
    { id: "q_ux_final_001", assessmentId: "assess_ux_final", type: "TEXT_AREA", question: "An e-learning app wants to increase course completion rates among its users. Create a brief UI/UX solution proposal covering: (1) 1 key research finding, (2) User flow to start a course, and (3) a user-friendly visual style guide (colors & typography).", maxScore: 100, rubricId: "rubric_ux_final", order: 1 },
    { id: "q_fe_htmlcss_001", assessmentId: "assess_fe_htmlcss", type: "MULTIPLE_CHOICE", question: "Which CSS display value is best suited to create a flexible 1D layout container?", options: ["block", "inline", "flex", "grid"], correctAnswer: "flex", maxScore: 20, order: 1 },
    { id: "q_fe_htmlcss_002", assessmentId: "assess_fe_htmlcss", type: "MULTIPLE_CHOICE", question: "Which HTML5 semantic tag is most appropriate to contain the main navigation links?", options: ["section", "div", "nav", "header"], correctAnswer: "nav", maxScore: 20, order: 2 },
    { id: "q_fe_htmlcss_003", assessmentId: "assess_fe_htmlcss", type: "CODE_ANSWER", question: "Write a CSS rule to make a container class '.card-grid' use CSS grid with 3 equal columns, and stack vertically (1 column) when the screen width is 600px or less.", maxScore: 60, rubricId: "rubric_fe_htmlcss", order: 3 },
    { id: "q_fe_javascript_001", assessmentId: "assess_fe_javascript", type: "CODE_ANSWER", question: "Write a JavaScript function called 'filterActiveUsers' that takes an array of user objects (each containing 'name' and 'status' properties) and returns a new array with only users whose status is 'ACTIVE'.", maxScore: 100, rubricId: "rubric_fe_javascript", order: 1 },
    { id: "q_fe_git_001", assessmentId: "assess_fe_git", type: "TEXT_AREA", question: "Explain the sequence of Git commands required to create a new branch named 'feature-login', stage all changes, commit them with a message 'add login page', and push it to the remote repository.", maxScore: 100, rubricId: "rubric_fe_git", order: 1 },
    { id: "q_fe_final_001", assessmentId: "assess_fe_final", type: "TEXT_AREA", question: "You need to build a responsive, interactive product card component. Describe: (1) The HTML structure, (2) The CSS properties for responsiveness, and (3) The JavaScript event listener required to alert 'Item added to cart' when a button is clicked.", maxScore: 100, rubricId: "rubric_fe_final", order: 1 },
  ],
  rubrics: [
    {
      id: "rubric_sql_basic",
      name: "SQL Basic Query Rubric",
      criteria: [
        { id: "crit_select", label: "Uses SELECT", maxScore: 10, type: "KEYWORD", requiredKeywords: ["select"] },
        { id: "crit_name", label: "Selects name", maxScore: 10, type: "KEYWORD", requiredKeywords: ["name"] },
        { id: "crit_score", label: "Selects score", maxScore: 10, type: "KEYWORD", requiredKeywords: ["score"] },
        { id: "crit_from", label: "Uses FROM", maxScore: 10, type: "KEYWORD", requiredKeywords: ["from"] },
        { id: "crit_table", label: "Uses applicants table", maxScore: 10, type: "KEYWORD", requiredKeywords: ["applicants"] },
        { id: "crit_where", label: "Uses WHERE", maxScore: 10, type: "KEYWORD", requiredKeywords: ["where"] },
        { id: "crit_condition", label: "Correct score condition", maxScore: 20, type: "REGEX", pattern: "score\\s*(>=|>)\\s*(75|74)" },
        { id: "crit_readability", label: "Readability", maxScore: 10, type: "LENGTH", minLength: 20 },
      ],
    },
    {
      id: "rubric_cleaning_basic",
      name: "Data Cleaning Written Rubric",
      criteria: [
        { id: "clean_duplicates", label: "Mentions duplicate handling", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["duplicate", "duplicates", "duplikat"] },
        { id: "clean_missing", label: "Mentions missing values", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["missing", "null", "empty", "kosong", "hilang"] },
        { id: "clean_date", label: "Mentions date formatting", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["date", "tanggal", "format"] },
        { id: "clean_order", label: "Explains cleaning order", maxScore: 20, type: "SENTENCE_COUNT", minSentences: 3 },
        { id: "clean_clarity", label: "Clarity", maxScore: 20, type: "LENGTH", minLength: 60 },
      ],
    },
    {
      id: "rubric_dashboard_interpretation",
      name: "Dashboard Interpretation Rubric",
      criteria: [
        { id: "dash_revenue", label: "Mentions revenue increase", maxScore: 20, type: "KEYWORD", requiredKeywords: ["revenue", "20"] },
        { id: "dash_complaints", label: "Mentions complaints increase", maxScore: 20, type: "KEYWORD", requiredKeywords: ["complaint", "35"] },
        { id: "dash_insight", label: "Provides insight", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["insight", "means", "indicates", "shows", "menunjukkan"] },
        { id: "dash_recommendation", label: "Provides recommendation", maxScore: 25, type: "KEYWORD", match: "ANY", requiredKeywords: ["recommend", "should", "improve", "investigate", "action", "rekomendasi"] },
        { id: "dash_clarity", label: "Clarity", maxScore: 15, type: "LENGTH", minLength: 80 },
      ],
    },
    {
      id: "rubric_final_assessment",
      name: "Final Assessment Rubric",
      criteria: [
        { id: "final_data", label: "Identifies needed data", maxScore: 15, type: "KEYWORD", match: "ANY", requiredKeywords: ["score", "applicant", "experience", "skill", "data"] },
        { id: "final_clean", label: "Explains cleaning step", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["clean", "missing", "duplicate", "format"] },
        { id: "final_sql", label: "Provides SQL query", maxScore: 25, type: "KEYWORD", requiredKeywords: ["select", "from", "where"] },
        { id: "final_dashboard", label: "Provides dashboard insight", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["dashboard", "chart", "trend", "insight", "visual"] },
        { id: "final_recommendation", label: "Provides recommendation", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["recommend", "should", "decision", "action"] },
      ],
    },
    {
      id: "rubric_ux_persona",
      name: "UX Persona Rubric",
      criteria: [
        { id: "persona_name", label: "Defines Persona Name", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["name", "persona"] },
        { id: "persona_student", label: "Focuses on Students", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["student", "college", "university", "campus"] },
        { id: "persona_pain", label: "Identifies Pain Points", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["pain", "problem", "frustration", "struggle", "challenge"] },
        { id: "persona_need", label: "Identifies Needs", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["need", "needs", "goal", "solution", "want"] },
        { id: "persona_constraints", label: "Mentions Budget or Time", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["budget", "money", "price", "cost", "time", "busy", "schedule", "limit"] },
      ],
    },
    {
      id: "rubric_ux_wireframe",
      name: "User Flow & Wireframe Rubric",
      criteria: [
        { id: "flow_home", label: "Starts at Home screen", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["home", "dashboard", "landing"] },
        { id: "flow_search", label: "Includes Product Search", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["search", "find", "select", "book"] },
        { id: "flow_cart", label: "Mentions Cart / Basket", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["cart", "add", "basket"] },
        { id: "flow_checkout", label: "Mentions Checkout / Payment", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["checkout", "pay", "payment", "purchase"] },
        { id: "flow_decision", label: "Includes Stock Decision Point", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["stock", "empty", "alert", "decision", "if", "out of stock"] },
      ],
    },
    {
      id: "rubric_ux_design",
      name: "Visual Design Accessibility Rubric",
      criteria: [
        { id: "access_problems", label: "Lists Accessibility Problems", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["contrast", "size", "font", "color", "alt", "readability", "hierarchy", "spacing"] },
        { id: "access_solutions", label: "Suggests Practical Solutions", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["fix", "change", "increase", "standards", "wcag", "auto layout", "spacing", "adjust"] },
        { id: "access_explanation", label: "Clear and Detailed Explanation", maxScore: 20, type: "LENGTH", minLength: 60 },
      ],
    },
    {
      id: "rubric_ux_final",
      name: "UI/UX Capstone Rubric",
      criteria: [
        { id: "cap_research", label: "Presents Key Research Finding", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["research", "finding", "interview", "user", "student", "audience"] },
        { id: "cap_flow", label: "Outlines Course Start Flow", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["flow", "step", "start", "course", "module"] },
        { id: "cap_style", label: "Describes Style Guide", maxScore: 40, type: "KEYWORD", match: "ANY", requiredKeywords: ["style", "guide", "color", "colors", "typography", "font", "brand", "visual"] },
      ],
    },
    {
      id: "rubric_fe_htmlcss",
      name: "Responsive Grid Rubric",
      criteria: [
        { id: "grid_display", label: "Uses display: grid", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["display: grid", "display:grid", "grid"] },
        { id: "grid_columns", label: "Defines 3 Columns", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["grid-template-columns", "repeat(3", "1fr 1fr 1fr"] },
        { id: "grid_media", label: "Uses @media query", maxScore: 20, type: "KEYWORD", match: "ANY", requiredKeywords: ["@media", "media", "max-width", "600px"] }
      ]
    },
    {
      id: "rubric_fe_javascript",
      name: "JS Array Filtering Rubric",
      criteria: [
        { id: "js_func", label: "Declares function", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["function", "const filterActiveUsers", "filterActiveUsers ="] },
        { id: "js_filter", label: "Uses filter method", maxScore: 40, type: "KEYWORD", match: "ANY", requiredKeywords: ["filter", "for", "forEach"] },
        { id: "js_condition", label: "Checks ACTIVE status", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["active", "ACTIVE", "status"] }
      ]
    },
    {
      id: "rubric_fe_git",
      name: "Git Branch Commit Push Rubric",
      criteria: [
        { id: "git_checkout", label: "Branch creation command", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["git checkout -b", "git checkout", "git switch -c", "git branch"] },
        { id: "git_commit", label: "Staging and committing command", maxScore: 40, type: "KEYWORD", match: "ANY", requiredKeywords: ["git add", "git commit", "add login page"] },
        { id: "git_push", label: "Push command to remote", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["git push", "origin", "feature-login"] }
      ]
    },
    {
      id: "rubric_fe_final",
      name: "Frontend Capstone Rubric",
      criteria: [
        { id: "fe_markup", label: "Describes HTML elements", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["html", "div", "button", "semantic", "markup", "tag"] },
        { id: "fe_style", label: "Describes CSS responsive styling", maxScore: 30, type: "KEYWORD", match: "ANY", requiredKeywords: ["css", "media", "flex", "grid", "responsive", "style"] },
        { id: "fe_script", label: "Describes JS action event", maxScore: 40, type: "KEYWORD", match: "ANY", requiredKeywords: ["javascript", "click", "addEventListener", "alert", "event", "button"] }
      ]
    },
  ],
  progress: [],
  submissions: [],
  certificates: [],
  jobs: [
    { id: "job_da_001", title: "Data Analyst Intern", company: "PT Example Digital", location: "Jakarta", workType: "Hybrid", employmentType: "Internship", description: "Analyze data, create reports, and support dashboard development.", requiredModuleIds: ["mod_sql", "mod_cleaning"], minimumScore: 75, status: "OPEN" },
    { id: "job_bi_001", title: "BI Intern", company: "DataWorks", location: "Remote", workType: "Remote", employmentType: "Internship", description: "Assist BI team by interpreting dashboards and preparing business reports.", requiredModuleIds: ["mod_sql", "mod_dashboard"], minimumScore: 75, status: "OPEN" },
    { id: "job_report_001", title: "Reporting Intern", company: "Insight Labs", location: "Bandung", workType: "Onsite", employmentType: "Internship", description: "Create weekly reporting summaries from cleaned business datasets.", requiredModuleIds: ["mod_sql", "mod_cleaning", "mod_dashboard"], minimumScore: 75, status: "OPEN" },
    {
      id: "job_ux_001",
      title: "UI/UX Designer Intern",
      company: "PT Sinergi Kreatif",
      location: "Jakarta",
      workType: "Hybrid",
      employmentType: "Internship",
      description: "Conduct user research, design wireframes, build high-fidelity layouts, and test user experiences.",
      requiredModuleIds: [
        "mod_ux_persona",
        "mod_ux_wireframe"
      ],
      minimumScore: 70,
      status: "OPEN"
    },
    {
      id: "job_ux_002",
      title: "Product Design Intern",
      company: "PixelPerfect Labs",
      location: "Jakarta",
      workType: "Onsite",
      employmentType: "Internship",
      description: "Collaborate on responsive interface design, build Figma component systems, and present capstone design ideas.",
      requiredModuleIds: [
        "mod_ux_design",
        "mod_ux_final"
      ],
      minimumScore: 70,
      status: "OPEN"
    },
    {
      id: "job_fe_001",
      title: "Frontend Developer Intern",
      company: "PT Tech Nusantara",
      location: "Jakarta",
      workType: "Hybrid",
      employmentType: "Internship",
      description: "Build clean web markup, style responsive grids using Flexbox/CSS Grid, and write dynamic scripting in JavaScript.",
      requiredModuleIds: [
        "mod_fe_htmlcss",
        "mod_fe_javascript"
      ],
      minimumScore: 75,
      status: "OPEN"
    },
    {
      id: "job_fe_002",
      title: "React Developer Intern",
      company: "Innovate Web",
      location: "Remote",
      workType: "Remote",
      employmentType: "Internship",
      description: "Work with Git workflow pipelines, manage complex application layouts, and deliver high quality frontend widgets.",
      requiredModuleIds: [
        "mod_fe_git",
        "mod_fe_final"
      ],
      minimumScore: 75,
      status: "OPEN"
    }
  ],
  applications: [],
};

// --- Helper Utilities ---
function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

function normalize(val) {
  return String(val || "").trim().toLowerCase();
}

function scoreMultipleChoice(question, answer) {
  return normalize(answer) === normalize(question.correctAnswer) ? question.maxScore : 0;
}

function scoreShortAnswer(question, answer) {
  const normalized = normalize(answer);
  const keywords = question.requiredKeywords || [];
  if (!keywords.length) return normalized === normalize(question.correctAnswer) ? question.maxScore : 0;
  const matched = keywords.filter((keyword) => normalized.includes(normalize(keyword))).length;
  return matched === keywords.length ? question.maxScore : 0;
}

function criterionPassed(criterion, answer) {
  const normalized = normalize(answer);
  if (criterion.type === "KEYWORD") {
    const matches = criterion.requiredKeywords.filter((keyword) => normalized.includes(normalize(keyword))).length;
    return criterion.match === "ANY" ? matches > 0 : matches === criterion.requiredKeywords.length;
  }
  if (criterion.type === "REGEX") {
    return new RegExp(criterion.pattern, "i").test(answer);
  }
  if (criterion.type === "LENGTH") {
    return normalized.length >= criterion.minLength;
  }
  if (criterion.type === "SENTENCE_COUNT") {
    const roughSentences = answer.split(/[.!?\n]+/).map((part) => part.trim()).filter(Boolean);
    const numberedSteps = (answer.match(/\b(first|second|third|1\.|2\.|3\.)\b/gi) || []).length;
    return roughSentences.length >= criterion.minSentences || numberedSteps >= criterion.minSentences;
  }
  return false;
}

function scoreRubricAnswer(rubric, answer) {
  const criteria = rubric.criteria.map((criterion) => {
    const passed = criterionPassed(criterion, answer);
    return {
      criterionId: criterion.id,
      label: criterion.label,
      score: passed ? criterion.maxScore : 0,
      maxScore: criterion.maxScore,
      passed,
    };
  });

  return {
    score: criteria.reduce((total, item) => total + item.score, 0),
    maxScore: criteria.reduce((total, item) => total + item.maxScore, 0),
    criteria,
  };
}

function scoreQuestion(db, question, answer) {
  if (question.type === "MULTIPLE_CHOICE") {
    return {
      questionId: question.id,
      answer,
      score: scoreMultipleChoice(question, answer),
      maxScore: question.maxScore,
      criteria: [],
    };
  }

  if (question.type === "SHORT_ANSWER") {
    return {
      questionId: question.id,
      answer,
      score: scoreShortAnswer(question, answer),
      maxScore: question.maxScore,
      criteria: [],
    };
  }

  const rubric = db.rubrics.find((r) => r.id === question.rubricId);
  const rubricScore = scoreRubricAnswer(rubric, answer);
  return {
    questionId: question.id,
    answer,
    score: rubricScore.score,
    maxScore: rubricScore.maxScore,
    criteria: rubricScore.criteria,
  };
}

function calculateAssessmentResult(db, assessment, answers) {
  const questionResults = assessment.components.flatMap((component) =>
    component.questionIds.map((questionId) => {
      const question = db.questions.find((q) => q.id === questionId);
      return scoreQuestion(db, question, answers[questionId] || "");
    })
  );

  const componentBreakdown = assessment.components.map((component) => {
    const results = questionResults.filter((result) => component.questionIds.includes(result.questionId));
    const rawScore = results.reduce((total, item) => total + item.score, 0);
    const rawMax = results.reduce((total, item) => total + item.maxScore, 0);
    const weightedScore = rawMax === 0 ? 0 : (rawScore / rawMax) * component.weight;
    return {
      label: component.label,
      rawScore,
      rawMax,
      weight: component.weight,
      weightedScore: Math.round(weightedScore * 10) / 10,
    };
  });

  const finalScore = Math.round(componentBreakdown.reduce((total, item) => total + item.weightedScore, 0) * 10) / 10;
  return { finalScore, componentBreakdown, questionResults };
}

function submitAssessment(db, user, moduleId, answers) {
  const module = db.modules.find((m) => m.id === moduleId);
  const assessment = db.assessments.find((a) => a.id === module.assessmentId);
  const result = calculateAssessmentResult(db, assessment, answers);
  const status = result.finalScore >= module.passingGrade ? "PASSED" : "FAILED";
  const submission = {
    id: makeId("sub"),
    userId: user.id,
    moduleId: module.id,
    assessmentId: assessment.id,
    answers,
    finalScore: result.finalScore,
    status,
    componentBreakdown: result.componentBreakdown,
    questionResults: result.questionResults,
    feedback:
      status === "PASSED"
        ? "Assessment passed. Certificate generated automatically based on local rubric scoring."
        : "Assessment failed. Review the module and retake the assessment.",
    submittedAt: TODAY,
  };
  const updatedDb = clone(db);
  updatedDb.submissions.push(submission);
  
  const current = updatedDb.progress.find((p) => p.userId === user.id && p.moduleId === module.id);
  if (current) {
    current.score = result.finalScore;
    current.status = status;
    current.submissionId = submission.id;
    current.submittedAt = TODAY;
    current.completedAt = status === "PASSED" ? TODAY : null;
  } else {
    updatedDb.progress.push({
      id: makeId("progress"),
      userId: user.id,
      moduleId: module.id,
      score: result.finalScore,
      status,
      submissionId: submission.id,
      submittedAt: TODAY,
      completedAt: status === "PASSED" ? TODAY : null,
    });
  }

  if (status === "PASSED") {
    const existingCert = updatedDb.certificates.find((cert) => cert.userId === user.id && cert.moduleId === module.id && cert.type === "MODULE");
    if (!existingCert) {
      const sequence = String(updatedDb.certificates.length + 1).padStart(4, "0");
      const path = updatedDb.careerPaths.find((p) => p.id === module.careerPathId);
      const certificateId = `GIG-${path?.code || "GS"}-2026-${sequence}`;
      updatedDb.certificates.push({
        id: makeId("cert"),
        certificateId,
        issuedName: user.name,
        userId: user.id,
        moduleId: module.id,
        careerPathId: module.careerPathId,
        type: "MODULE",
        title: `${module.title} Certificate`,
        score: result.finalScore,
        status: "VALID",
        issuedAt: TODAY,
      });
    }

    const pathId = module.careerPathId;
    const pathModules = updatedDb.modules
      .filter((m) => m.careerPathId === pathId)
      .sort((a, b) => a.order - b.order);
    const allPassed = pathModules.every((m) => {
      const prog = updatedDb.progress.find((p) => p.userId === user.id && p.moduleId === m.id);
      return prog?.status === "PASSED";
    });
    if (allPassed && pathModules.length > 0) {
      const existingPathCert = updatedDb.certificates.find((cert) => cert.userId === user.id && cert.careerPathId === pathId && cert.type === "PATH");
      if (!existingPathCert) {
        const scores = pathModules.map((m) => {
          const prog = updatedDb.progress.find((p) => p.userId === user.id && p.moduleId === m.id);
          return prog?.score || 0;
        });
        const average = Math.round((scores.reduce((total, score) => total + score, 0) / scores.length) * 10) / 10;
        const path = updatedDb.careerPaths.find((p) => p.id === pathId);
        const sequence = String(updatedDb.certificates.length + 1).padStart(4, "0");
        const certificateId = `GIG-${path?.code || "GS"}-2026-${sequence}`;
        updatedDb.certificates.push({
          id: makeId("cert"),
          certificateId,
          issuedName: user.name,
          userId: user.id,
          moduleId: null,
          careerPathId: pathId,
          type: "PATH",
          title: `${path.name} Certificate of Eligibility`,
          score: average,
          status: "VALID",
          issuedAt: TODAY,
        });
      }
    }
  }

  return { updatedDb, submission };
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function initials(name) {
  const parts = String(name || "GigStart").trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : (parts[0] || "GS").slice(0, 2)).toUpperCase();
}

function defaultUserProfile(user) {
  const safeUser = user || {};
  return {
    avatarUrl: "",
    phone: "",
    location: safeUser.location || "",
    education: "",
    institution: "",
    headline: safeUser.role === "ADMIN" ? "GigStart Platform Administrator" : `Aspiring ${safeUser.targetRole || "Job Seeker"}`,
    bio: "",
    preferredWorkTypes: [],
    preferredEmploymentTypes: [],
    preferredLocations: [],
    experienceLevel: "Beginner",
    selfDeclaredSkills: [],
    portfolioLinks: { linkedin: "", github: "", portfolio: "", figma: "", kaggle: "", other: "" },
    privacy: {
      profileVisibility: safeUser.role === "ADMIN" ? "PRIVATE" : "PUBLIC",
      showCertificates: safeUser.role !== "ADMIN",
      showScores: safeUser.role !== "ADMIN",
      showVerifiedSkills: safeUser.role !== "ADMIN",
      showSelfDeclaredSkills: safeUser.role !== "ADMIN",
    },
    notifications: { jobUnlocked: true, certificateIssued: true, applicationUpdated: true, moduleReminder: false },
    updatedAt: safeUser.createdAt || TODAY,
  };
}

function normalizeUser(user) {
  const defaults = defaultUserProfile(user);
  return {
    ...defaults,
    ...user,
    interest: Array.isArray(user.interest) ? user.interest : String(user.interest || "").split(",").map(i => i.trim()).filter(Boolean),
    preferredWorkTypes: Array.isArray(user.preferredWorkTypes) ? user.preferredWorkTypes : defaults.preferredWorkTypes,
    preferredEmploymentTypes: Array.isArray(user.preferredEmploymentTypes) ? user.preferredEmploymentTypes : defaults.preferredEmploymentTypes,
    preferredLocations: Array.isArray(user.preferredLocations) ? user.preferredLocations : defaults.preferredLocations,
    selfDeclaredSkills: Array.isArray(user.selfDeclaredSkills) ? user.selfDeclaredSkills : defaults.selfDeclaredSkills,
    portfolioLinks: { ...defaults.portfolioLinks, ...(user.portfolioLinks || {}) },
    privacy: { ...defaults.privacy, ...(user.privacy || {}) },
    notifications: { ...defaults.notifications, ...(user.notifications || {}) },
  };
}

function normalizeDb(db, onSave) {
  if (!db || typeof db !== "object") db = {};
  const collections = [
    "users",
    "careerPaths",
    "modules",
    "assessments",
    "questions",
    "rubrics",
    "progress",
    "submissions",
    "certificates",
    "jobs",
    "applications"
  ];
  let changed = false;
  collections.forEach((key) => {
    if (!Array.isArray(db[key])) {
      db[key] = Array.isArray(seedData[key]) ? clone(seedData[key]) : [];
      changed = true;
    }
  });

  // Sync static collections from seedData if they changed or are missing
  const staticCollections = [
    "careerPaths",
    "modules",
    "assessments",
    "questions",
    "rubrics",
    "jobs"
  ];

  staticCollections.forEach((key) => {
    const seedItems = seedData[key];
    if (!Array.isArray(seedItems)) return;
    
    seedItems.forEach((seedItem) => {
      const dbItemIdx = db[key].findIndex((item) => item.id === seedItem.id);
      if (dbItemIdx === -1) {
        db[key].push(clone(seedItem));
        changed = true;
      } else {
        const dbItemStr = JSON.stringify(db[key][dbItemIdx]);
        const seedItemStr = JSON.stringify(seedItem);
        if (dbItemStr !== seedItemStr) {
          db[key][dbItemIdx] = clone(seedItem);
          changed = true;
        }
      }
    });
  });

  db.users = db.users.map((user) => {
    const normalized = normalizeUser(user);
    if (JSON.stringify(normalized) !== JSON.stringify(user)) changed = true;
    return normalized;
  });
  db.certificates = db.certificates.map((cert) => {
    if (cert.issuedName) return cert;
    const user = db.users.find((item) => item.id === cert.userId);
    changed = true;
    return { ...cert, issuedName: user?.name || "Unknown User" };
  });
  if (changed && onSave) onSave(db);
  return db;
}

// --- Scrollytelling Landing Page ---

function LandingPage({ db, go, triggerFlash, renderFlash }) {
  const [activeStep, setActiveStep] = useState(0);



  useEffect(() => {
    const handleScroll = () => {
      const steps = ["step-intro-trigger", "step-practice", "step-passport", "step-apps"];
      let closestStep = 0;
      let minDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      for (let i = 0; i < steps.length; i++) {
        const el = document.getElementById(steps[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(elementCenter - viewportCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestStep = i;
          }
        }
      }
      setActiveStep(closestStep);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToStep = (index) => {
    const steps = ["step-intro-trigger", "step-practice", "step-passport", "step-apps"];
    const el = document.getElementById(steps[index]);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const initials = (name) => {
    const parts = String(name || "GigStart").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : (parts[0] || "GS").slice(0, 2)).toUpperCase();
  };

  const renderAvatar = (targetUser, className = "avatar") => {
    const label = initials(targetUser?.name);
    if (targetUser?.avatarUrl) {
      return (
        <span className={className}>
          <img src={targetUser.avatarUrl} alt={`${targetUser.name} avatar`} />
        </span>
      );
    }
    return (
      <span className={className} aria-label={`${targetUser?.name || "user"} initials`}>
        {label}
      </span>
    );
  };

  const renderGuestLayout = (content) => {
    return (
      <>
        <main className="public-main">{content}</main>
        <footer className="site-footer">
          <div className="footer-grid">
            <section>
              <a className="brand" href="#/">
                <span className="brand-mark">GS</span>
                <span>GigStart</span>
                <span className="brand-partner-sep">|</span>
                <svg viewBox="0 0 16 16" style={{ height: "18px", width: "auto", color: "#76b900", display: "inline-block", verticalAlign: "middle" }}>
                  <path fill="currentColor" d="M1.635 7.146S3.08 5.012 5.97 4.791v-.774C2.77 4.273 0 6.983 0 6.983s1.57 4.536 5.97 4.952v-.824c-3.23-.406-4.335-3.965-4.335-3.965M5.97 9.475v.753c-2.44-.435-3.118-2.972-3.118-2.972S4.023 5.958 5.97 5.747v.828h-.004c-1.021-.123-1.82.83-1.82.83s.448 1.607 1.824 2.07M6 2l-.03 2.017A7 7 0 0 1 6.252 4c3.637-.123 6.007 2.983 6.007 2.983s-2.722 3.31-5.557 3.31q-.39-.002-.732-.065v.883q.292.039.61.04c2.638 0 4.546-1.348 6.394-2.943.307.246 1.561.842 1.819 1.104-1.757 1.47-5.852 2.657-8.173 2.657a7 7 0 0 1-.65-.034V14H16l.03-12zm-.03 3.747v-.956a6 6 0 0 1 .282-.015c2.616-.082 4.332 2.248 4.332 2.248S8.73 9.598 6.743 9.598c-.286 0-.542-.046-.773-.123v-2.9c1.018.123 1.223.572 1.835 1.593L9.167 7.02s-.994-1.304-2.67-1.304a5 5 0 0 0-.527.031" />
                </svg>
              </a>
              <p>Jobless? Look one.</p>
              <p className="muted">Job readiness platform to help users learn with direction, prove skills, and apply when eligible.</p>
            </section>
            <section>
              <h3>Quick Links</h3>
              <a href="#/">Home</a>
              <a href="#/career-paths">Career Paths</a>
              <a href="#/jobs">Jobs</a>
              <a href="#/register">Create Account</a>
            </section>
            <section>
              <h3>Contact</h3>
              <a href="mailto:hello@gigstart.local">hello@gigstart.local</a>
              <span>+62 21 5369 6969</span>
            </section>
            <section>
              <h3>Send Letter To</h3>
              <p>GigStart Team</p>
              <p>BINUS University Kemanggisan<br />Jl. K. H. Syahdan No. 9, Jakarta 11480</p>
            </section>
          </div>
          <div className="footer-bottom">
            <span>© 2026 GigStart</span>
            <span>Privacy · Terms · Accessibility</span>
          </div>
        </footer>
      </>
    );
  };

  return renderGuestLayout(
    <>
      <section className="landing-hero" id="step-intro">
        <video 
          className="hero-video" 
          src="/hero_bg.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
        <div className="hero-content container">
          <div className="hero-text">
            <p className="hero-label">Job readiness for early careers</p>
            <h1 className="hero-title">
              Kickstart your career<br />with <span className="highlight-color">proven skills</span>.
            </h1>
            <p className="hero-description">
              Choose a career path, complete practical modules, earn certificates, then apply for jobs that match your skills.
            </p>
            {renderFlash()}
            <div className="hero-actions">
              <a className="btn-primary" href="#/register">Create Account</a>
              <a className="btn-secondary" href="#/login">Login</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="book-mockup">
              <aside className="system-preview learner-rating-card rating-card-3d">
                <p className="eyebrow">Learner rating</p>
                <strong>4.8/5</strong>
                <span className="rating-desc">Based on early user feedback</span>
                <div className="stars" aria-label="4.8 out of 5 stars">★★★★★</div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section scrollytelling-section">
        <div className="scrolly-container">
          <div className="sticky-visual desktop-only-visual">
            <div className="iceberg-card">
              <svg viewBox="0 0 400 500" className="iceberg-svg">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Serpentine Path (Track) */}
                <path 
                  d="M 120 430 C 240 430, 280 370, 280 310 C 280 250, 120 250, 120 190 C 120 130, 280 130, 280 70" 
                  fill="none" 
                  stroke="#222222" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                />
                {/* Active Serpentine Path (Glowing Highlight) */}
                <path 
                  d="M 120 430 C 240 430, 280 370, 280 310 C 280 250, 120 250, 120 190 C 120 130, 280 130, 280 70" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  strokeDasharray="750"
                  strokeDashoffset={
                    activeStep === 0 ? 750 :
                    activeStep === 1 ? 500 :
                    activeStep === 2 ? 250 : 0
                  }
                  style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)', filter: 'url(#glow)', opacity: 0.8 }}
                />
                <path 
                  d="M 120 430 C 240 430, 280 370, 280 310 C 280 250, 120 250, 120 190 C 120 130, 280 130, 280 70" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  strokeDasharray="750"
                  strokeDashoffset={
                    activeStep === 0 ? 750 :
                    activeStep === 1 ? 500 :
                    activeStep === 2 ? 250 : 0
                  }
                  style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />

                {/* Node 0: Overview */}
                <g transform="translate(120, 430)">
                  <circle 
                    r="16" 
                    fill={activeStep >= 0 ? "#ffffff" : "#141414"} 
                    stroke={activeStep >= 0 ? "#ffffff" : "#333333"} 
                    strokeWidth="2"
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <circle 
                    r={activeStep === 0 ? "24" : "0"} 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1" 
                    opacity={activeStep === 0 ? "0.5" : "0"}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <text 
                    y="4" 
                    textAnchor="middle" 
                    fill={activeStep >= 0 ? "#000000" : "#888888"} 
                    fontSize="11" 
                    fontFamily="var(--mono)" 
                    fontWeight="700"
                  >
                    0
                  </text>
                  <text 
                    x="-28" 
                    y="4" 
                    textAnchor="end"
                    fill={activeStep === 0 ? "#ffffff" : "#888888"} 
                    fontSize="12" 
                    fontFamily="var(--mono)" 
                    fontWeight="600"
                    style={{ transition: 'fill 0.4s ease' }}
                  >
                    START
                  </text>
                </g>

                {/* Node 1: Practice */}
                <g transform="translate(280, 310)">
                  <circle 
                    r="16" 
                    fill={activeStep >= 1 ? "#ffffff" : "#141414"} 
                    stroke={activeStep >= 1 ? "#ffffff" : "#333333"} 
                    strokeWidth="2"
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <circle 
                    r={activeStep === 1 ? "24" : "0"} 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1" 
                    opacity={activeStep === 1 ? "0.5" : "0"}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <text 
                    y="4" 
                    textAnchor="middle" 
                    fill={activeStep >= 1 ? "#000000" : "#888888"} 
                    fontSize="11" 
                    fontFamily="var(--mono)" 
                    fontWeight="700"
                  >
                    1
                  </text>
                  <text 
                    x="-28" 
                    y="4" 
                    textAnchor="end"
                    fill={activeStep === 1 ? "#ffffff" : "#888888"} 
                    fontSize="12" 
                    fontFamily="var(--mono)" 
                    fontWeight="600"
                    style={{ transition: 'fill 0.4s ease' }}
                  >
                    LEARN
                  </text>
                </g>

                {/* Node 2: Passport */}
                <g transform="translate(120, 190)">
                  <circle 
                    r="16" 
                    fill={activeStep >= 2 ? "#ffffff" : "#141414"} 
                    stroke={activeStep >= 2 ? "#ffffff" : "#333333"} 
                    strokeWidth="2"
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <circle 
                    r={activeStep === 2 ? "24" : "0"} 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1" 
                    opacity={activeStep === 2 ? "0.5" : "0"}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <text 
                    y="4" 
                    textAnchor="middle" 
                    fill={activeStep >= 2 ? "#000000" : "#888888"} 
                    fontSize="11" 
                    fontFamily="var(--mono)" 
                    fontWeight="700"
                  >
                    2
                  </text>
                  <text 
                    x="28" 
                    y="4" 
                    fill={activeStep === 2 ? "#ffffff" : "#888888"} 
                    fontSize="12" 
                    fontFamily="var(--mono)" 
                    fontWeight="600"
                    style={{ transition: 'fill 0.4s ease' }}
                  >
                    VERIFY
                  </text>
                </g>

                {/* Node 3: Apply */}
                <g transform="translate(280, 70)">
                  <circle 
                    r="16" 
                    fill={activeStep >= 3 ? "#ffffff" : "#141414"} 
                    stroke={activeStep >= 3 ? "#ffffff" : "#333333"} 
                    strokeWidth="2"
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <circle 
                    r={activeStep === 3 ? "24" : "0"} 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1" 
                    opacity={activeStep === 3 ? "0.5" : "0"}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                  <text 
                    y="4" 
                    textAnchor="middle" 
                    fill={activeStep >= 3 ? "#000000" : "#888888"} 
                    fontSize="11" 
                    fontFamily="var(--mono)" 
                    fontWeight="700"
                  >
                    3
                  </text>
                  <text 
                    x="-28" 
                    y="4" 
                    textAnchor="end"
                    fill={activeStep === 3 ? "#ffffff" : "#888888"} 
                    fontSize="12" 
                    fontFamily="var(--mono)" 
                    fontWeight="600"
                    style={{ transition: 'fill 0.4s ease' }}
                  >
                    APPLY
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Mobile Sticky Timeline */}
          <div className="mobile-timeline-container">
            <div className="mobile-timeline-track">
              {/* The vertical line */}
              <div className="mobile-timeline-line"></div>
              {/* The active glowing indicator dot */}
              <div 
                className="mobile-timeline-active-dot" 
                style={{ 
                  transform: `translateY(${activeStep * 44}px)` 
                }}
              ></div>
              {/* The 4 static step nodes */}
              <div className="mobile-timeline-node node-0" onClick={() => scrollToStep(0)}></div>
              <div className="mobile-timeline-node node-1" onClick={() => scrollToStep(1)}></div>
              <div className="mobile-timeline-node node-2" onClick={() => scrollToStep(2)}></div>
              <div className="mobile-timeline-node node-3" onClick={() => scrollToStep(3)}></div>
            </div>
          </div>

          <div className="scroll-text">
            <div className="step-block" id="step-intro-trigger">
              <span className="step-num">Step 0</span>
              <h2>The Skill Roadmap</h2>
              <p>
                Navigating your early career doesn't have to be a guessing game. GigStart provides a step-by-step verified skill roadmap that takes you from training directly to hiring.
              </p>
              <p className="muted">
                Instead of sending hundreds of generic resumes into a black hole, we help you build a solid foundation that proves you can do the job before you even apply.
              </p>
            </div>

            <div className="step-block" id="step-practice">
              <span className="step-num">Step 1</span>
              <h2>Practice & Learn</h2>
              <p>
                The foundation of your journey. You learn through structured career paths and prove your skills in real-time practice sandboxes (like SQL query tasks, data cleaning plans, and dashboard interpretation).
              </p>
              <p className="muted">
                Each module is evaluated automatically, giving you immediate feedback to optimize your learning and master the core skills.
              </p>
            </div>

            <div className="step-block" id="step-passport">
              <span className="step-num">Step 2</span>
              <h2>Verified Skill Passport</h2>
              <p>
                Your evidence-based portfolio. Your progress, automated assessment scores, and module certificates are compiled into your digital Skill Passport.
              </p>
              <p className="muted">
                This passport acts as a trusted credential, proving to recruiters that your skills are not just words on a resume, but verified through standardized testing.
              </p>
            </div>

            <div className="step-block" id="step-apps">
              <span className="step-num">Step 3</span>
              <h2>Priority Applications</h2>
              <p>
                The destination of your roadmap. Once your Skill Passport meets the verified requirements for a job, you can apply directly to our partner employers.
              </p>
              <p className="muted">
                Because your skills are already proven and verified, your application goes straight to the priority hiring queue, bypassing the resume screening phase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section industry-section">
        <div className="section-heading futuristic-collab-heading">
          <h2>Why collaborating with small company?</h2>
        </div>

        <div className="container">
          <div className="collab-container">
            {/* Card 1: NVIDIA (Flagship) */}
            <div className="collab-card card-nvidia">
              <div className="collab-logo-wrap">
                <svg viewBox="0 0 16 16" style={{ height: '40px', width: 'auto', marginRight: '12px', color: '#76b900' }}>
                  <path fill="currentColor" d="M1.635 7.146S3.08 5.012 5.97 4.791v-.774C2.77 4.273 0 6.983 0 6.983s1.57 4.536 5.97 4.952v-.824c-3.23-.406-4.335-3.965-4.335-3.965M5.97 9.475v.753c-2.44-.435-3.118-2.972-3.118-2.972S4.023 5.958 5.97 5.747v.828h-.004c-1.021-.123-1.82.83-1.82.83s.448 1.607 1.824 2.07M6 2l-.03 2.017A7 7 0 0 1 6.252 4c3.637-.123 6.007 2.983 6.007 2.983s-2.722 3.31-5.557 3.31q-.39-.002-.732-.065v.883q.292.039.61.04c2.638 0 4.546-1.348 6.394-2.943.307.246 1.561.842 1.819 1.104-1.757 1.47-5.852 2.657-8.173 2.657a7 7 0 0 1-.65-.034V14H16l.03-12zm-.03 3.747v-.956a6 6 0 0 1 .282-.015c2.616-.082 4.332 2.248 4.332 2.248S8.73 9.598 6.743 9.598c-.286 0-.542-.046-.773-.123v-2.9c1.018.123 1.223.572 1.835 1.593L9.167 7.02s-.994-1.304-2.67-1.304a5 5 0 0 0-.527.031" />
                </svg>
                <span className="collab-brand-name" style={{ color: '#76b900' }}>NVIDIA Deep Learning</span>
              </div>
              
              <div className="collab-profile">
                <div className="collab-meta-grid">
                  <div className="collab-meta-item">
                    <span>Partner</span>
                    <strong>NVIDIA Corporation</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Focus Area</span>
                    <strong>Accelerated Computing</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Verification</span>
                    <strong>GPU Cloud Labs</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Integration</span>
                    <strong className="status-active" style={{ color: '#76b900' }}>Prioritized Sync</strong>
                  </div>
                </div>
                
                <ul className="collab-features-list">
                  <li>
                    <span className="dot" style={{ background: '#76b900' }}></span>
                    <span>Syllabus mapped for CUDA programming & GPU optimization</span>
                  </li>
                  <li>
                    <span className="dot" style={{ background: '#76b900' }}></span>
                    <span>Direct API workspace connection to NVIDIA Omniverse & AI Enterprise</span>
                  </li>
                  <li>
                    <span className="dot" style={{ background: '#76b900' }}></span>
                    <span>Priority application queue with NVIDIA Inception program partners</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Google Developers */}
            <div className="collab-card card-google">
              <div className="collab-logo-wrap">
                <img src="assets/logos/google-developers.svg" alt="Google Developers Logo" />
              </div>
              
              <div className="collab-profile">
                <div className="collab-meta-grid">
                  <div className="collab-meta-item">
                    <span>Partner</span>
                    <strong>Google Developers</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Focus Area</span>
                    <strong>Data Science & ML</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Verification</span>
                    <strong>Automated Labs</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Integration</span>
                    <strong className="status-active">Active Sync</strong>
                  </div>
                </div>
                
                <ul className="collab-features-list">
                  <li>
                    <span className="dot"></span>
                    <span>Syllabus mapped for Google BigQuery and analytics standards</span>
                  </li>
                  <li>
                    <span className="dot"></span>
                    <span>Real-world cloud pipeline modules verified by automated systems</span>
                  </li>
                  <li>
                    <span className="dot"></span>
                    <span>Direct credential tracking for early-career hiring pipelines</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Anthropic Claude */}
            <div className="collab-card card-claude">
              <div className="collab-logo-wrap">
                <svg viewBox="0 0 16 16" style={{ height: '40px', width: 'auto', marginRight: '12px' }}>
                  <path fill="currentColor" fillRule="evenodd" d="M9.218 2h2.402L16 12.987h-2.402zM4.379 2h2.512l4.38 10.987H8.82l-.895-2.308h-4.58l-.896 2.307H0L4.38 2.001zm2.755 6.64L5.635 4.777 4.137 8.64z"/>
                </svg>
                <span className="collab-brand-name">Anthropic Claude</span>
              </div>
              
              <div className="collab-profile">
                <div className="collab-meta-grid">
                  <div className="collab-meta-item">
                    <span>Partner</span>
                    <strong>Anthropic</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Focus Area</span>
                    <strong>Generative AI & LLMs</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Verification</span>
                    <strong>AI-Graded Tasks</strong>
                  </div>
                  <div className="collab-meta-item">
                    <span>Integration</span>
                    <strong className="status-active">Active Sync</strong>
                  </div>
                </div>
                
                <ul className="collab-features-list">
                  <li>
                    <span className="dot"></span>
                    <span>Practical tasks aligned with prompt engineering fundamentals</span>
                  </li>
                  <li>
                    <span className="dot"></span>
                    <span>Code assessment sandboxes powered by Claude API evaluation</span>
                  </li>
                  <li>
                    <span className="dot"></span>
                    <span>Industry readiness standards for modern AI application engineers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section marquee-section">
        <div className="section-heading futuristic-collab-heading">
          <h2>What they said?</h2>
        </div>

        <div className="container">
          <div className="collab-container">
            {/* Keynote Card 1: NVIDIA CEO (Flagship) */}
            <div className="collab-card keynote-card card-nvidia">
              <div className="keynote-image-wrap">
                <img src="assets/jensen_keynote.png" alt="NVIDIA CEO Presenting Keynote" className="keynote-img" />
              </div>
              <div className="keynote-content">
                <blockquote className="keynote-quote" style={{ borderLeftColor: "#76b900" }}>
                  "Computing is evolving at a breakneck speed. Our alliance with GigStart guarantees that rising developers possess direct, verified mastery of GPU computing and AI deployment."
                </blockquote>
                <div className="keynote-author">
                  <strong>Jensen Huang</strong>
                  <small>CEO, NVIDIA Corporation</small>
                </div>
              </div>
            </div>

            {/* Keynote Card 2: Google CEO */}
            <div className="collab-card keynote-card card-google">
              <div className="keynote-image-wrap">
                <img src="assets/sundar_keynote.png" alt="Google CEO Presenting Keynote" className="keynote-img" />
              </div>
              <div className="keynote-content">
                <blockquote className="keynote-quote">
                  "Our goal is to make developer paths accessible. Partnering with GigStart ensures that the next generation of builders is equipped with verified skills mapped to our core technologies."
                </blockquote>
                <div className="keynote-author">
                  <strong>Sundar Pichai</strong>
                  <small>CEO, Google & Alphabet</small>
                </div>
              </div>
            </div>

            {/* Keynote Card 3: Anthropic CEO */}
            <div className="collab-card keynote-card card-claude">
              <div className="keynote-image-wrap">
                <img src="assets/dario_keynote.png" alt="Anthropic CEO Presenting Keynote" className="keynote-img" />
              </div>
              <div className="keynote-content">
                <blockquote className="keynote-quote">
                  "AI engineering requires hands-on capability. With GigStart, candidates don't just study LLMs—they build, test, and get their skills graded through our integration."
                </blockquote>
                <div className="keynote-author">
                  <strong>Dario Amodei</strong>
                  <small>CEO, Anthropic</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
// --- React App Main Component ---
export default function App() {
  const [db, setDb] = useState(() => normalizeDb(clone(seedData)));
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState({ path: "/", query: "" });
  const [flash, setFlash] = useState(null);
  const [activeMenuOpen, setActiveMenuOpen] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");

  useEffect(() => {
    if (activeMenuOpen) {
      document.body.classList.add("offcanvas-is-active");
    } else {
      document.body.classList.remove("offcanvas-is-active");
    }
    return () => {
      document.body.classList.remove("offcanvas-is-active");
    };
  }, [activeMenuOpen]);

  useEffect(() => {
    setActiveMenuOpen(false);
    setAvatarPreviewUrl(null);
    setAvatarFileName("");
  }, [route]);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerFlash("error", "Avatar size exceeds 2MB.");
        e.target.value = "";
        return;
      }
      setAvatarFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreviewUrl(reader.result);
      };
      reader.onerror = () => {
        triggerFlash("error", "Failed to read avatar file.");
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFileName("");
      setAvatarPreviewUrl(null);
    }
  };

  // Sync state to localstorage & backend
  const saveDb = useCallback((newDb) => {
    setDb(clone(newDb));
    localStorage.setItem(DB_KEY, JSON.stringify(newDb));
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDb),
    }).catch((err) => console.error("Failed to sync backend:", err));
  }, []);

  const triggerFlash = useCallback((type, text) => {
    setFlash({ type, text });
    const timer = setTimeout(() => setFlash(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Sync DB on Boot
  useEffect(() => {
    fetch("/api/data")
      .then((res) => {
        if (!res.ok) throw new Error("Sync failed");
        return res.json();
      })
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          const normalized = normalizeDb(data, saveDb);
          setDb(normalized);
        } else {
          // Initialize local DB if empty
          const local = localStorage.getItem(DB_KEY);
          if (local) {
            try {
              setDb(normalizeDb(JSON.parse(local), saveDb));
            } catch (e) {
              console.error("Local DB parse error:", e);
              saveDb(clone(seedData));
            }
          } else {
            saveDb(clone(seedData));
          }
        }
      })
      .catch(() => {
        const local = localStorage.getItem(DB_KEY);
        if (local) {
          try {
            setDb(normalizeDb(JSON.parse(local), saveDb));
          } catch (e) {
            console.error("Local DB parse error in catch:", e);
          }
        }
      });

    // Check session
    const currentUserId = localStorage.getItem(SESSION_KEY);
    if (currentUserId) {
      setUser((prev) => {
        // Resolve user reference dynamically
        return null;
      });
    }
  }, [saveDb]);

  // Sync User session when DB loads
  useEffect(() => {
    const currentUserId = localStorage.getItem(SESSION_KEY);
    if (currentUserId && db.users) {
      const resolved = db.users.find((u) => u.id === currentUserId);
      if (resolved) setUser(resolved);
    }
  }, [db]);

  // Route parser
  const parseRoute = (hashString) => {
    const raw = hashString.slice(1) || "/";
    const [path, query = ""] = raw.split("?");
    return { path, query };
  };

  // Listen to hash changes
  useEffect(() => {
    const handleHash = () => {
      setRoute(parseRoute(window.location.hash));
    };
    window.addEventListener("hashchange", handleHash);
    // Parse initial route
    setRoute(parseRoute(window.location.hash));
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Apply dark theme only to landing page, other pages use light theme
  useEffect(() => {
    if (route.path === "/") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [route.path]);

  // Cinematic Navigational Transition (Black fading into White)
  const go = useCallback((targetPath) => {
    const overlay = document.querySelector("#transition-overlay");
    const cleanPath = targetPath.startsWith("#") ? targetPath.slice(1) : targetPath;
    if (!overlay) {
      window.location.hash = cleanPath;
      return;
    }

    overlay.className = "active-black";
    setTimeout(() => {
      window.location.hash = cleanPath;
      overlay.offsetHeight; // force repaint
      setTimeout(() => {
        overlay.className = "";
      }, 50);
    }, 300);
  }, []);

  // Intercept click on links
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const link = target.closest("a");
      if (link && link.hash && link.hash.startsWith("#/")) {
        e.preventDefault();
        go(link.hash.slice(1));
      }
    };
    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [go]);

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    triggerFlash("success", "Logged out successfully.");
    go("/");
  };

  const handleResetData = () => {
    const reset = clone(seedData);
    setDb(reset);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    localStorage.setItem(DB_KEY, JSON.stringify(reset));
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reset),
    })
      .then(() => {
        triggerFlash("success", "Database reset successfully.");
        go("/");
      })
      .catch(() => {
        triggerFlash("success", "Local database reset successfully (offline).");
        go("/");
      });
  };

  // Helper selectors
  const pathModules = useMemo(() => {
    if (!user || !user.activeCareerPathId) return [];
    return db.modules
      .filter((m) => m.careerPathId === user.activeCareerPathId)
      .sort((a, b) => a.order - b.order);
  }, [db.modules, user]);

  const passedModuleIds = useMemo(() => {
    if (!user) return [];
    return db.progress
      .filter((p) => p.userId === user.id && p.status === "PASSED")
      .map((p) => p.moduleId);
  }, [db.progress, user]);

  const checkEligibility = useCallback((job) => {
    const passed = new Set(passedModuleIds);
    const missing = job.requiredModuleIds.filter((id) => !passed.has(id));
    if (missing.length === 0) return { status: "ELIGIBLE", missing };
    if (missing.length <= 2) return { status: "ALMOST_ELIGIBLE", missing };
    return { status: "LOCKED", missing };
  }, [passedModuleIds]);

  const getModuleStatus = useCallback((module) => {
    if (!user) return "LOCKED";
    const progress = db.progress.find((p) => p.userId === user.id && p.moduleId === module.id);
    if (progress) return progress.status;

    const idx = pathModules.findIndex((m) => m.id === module.id);
    if (idx <= 0) return "AVAILABLE";
    const prev = pathModules[idx - 1];
    const prevProgress = db.progress.find((p) => p.userId === user.id && p.moduleId === prev.id);
    return prevProgress?.status === "PASSED" ? "AVAILABLE" : "LOCKED";
  }, [db.progress, pathModules, user]);

  // --- Sub-components (Rendering Handoffs) ---

  const renderFlash = () => {
    if (!flash) return null;
    return (
      <div className="toast-container" role="status" aria-live="polite">
        <div className={`toast ${flash.type || ""}`}>
          <span>{flash.text}</span>
          <button type="button" onClick={() => setFlash(null)} aria-label="Close notification">×</button>
        </div>
      </div>
    );
  };

  const renderAvatar = (targetUser, className = "avatar") => {
    const label = initials(targetUser?.name);
    if (targetUser?.avatarUrl) {
      return (
        <span className={className}>
          <img src={targetUser.avatarUrl} alt={`${targetUser.name} avatar`} />
        </span>
      );
    }
    return (
      <span className={className} aria-label={`${targetUser?.name || "user"} initials`}>
        {label}
      </span>
    );
  };

  const statusClass = (status) => {
    const val = String(status).toUpperCase();
    if (["PASSED", "VALID", "ELIGIBLE", "APPLIED", "REVIEWED", "ACCEPTED", "ACTIVE", "OPEN"].includes(val)) return "success";
    if (["ALMOST_ELIGIBLE", "IN_PROGRESS", "AVAILABLE", "PLANNED"].includes(val)) return "warning";
    if (["FAILED", "REJECTED", "BLOCKED"].includes(val)) return "error";
    return "muted";
  };

  const renderStatusBadge = (status, label = status) => {
    return <span className={`status-badge ${statusClass(status)}`}>{label}</span>;
  };

  // --- Views ---

  // 1. Guest Layout Wrapper
  const renderGuestLayout = (content) => {
    return (
      <>
        <main className="public-main">{content}</main>
        <footer className="site-footer">
          <div className="footer-grid">
            <section>
              <a className="brand" href="#/">
                <span className="brand-mark">GS</span>
                <span>GigStart</span>
                <span className="brand-partner-sep">|</span>
                <svg viewBox="0 0 16 16" style={{ height: "18px", width: "auto", color: "#76b900", display: "inline-block", verticalAlign: "middle" }}>
                  <path fill="currentColor" d="M1.635 7.146S3.08 5.012 5.97 4.791v-.774C2.77 4.273 0 6.983 0 6.983s1.57 4.536 5.97 4.952v-.824c-3.23-.406-4.335-3.965-4.335-3.965M5.97 9.475v.753c-2.44-.435-3.118-2.972-3.118-2.972S4.023 5.958 5.97 5.747v.828h-.004c-1.021-.123-1.82.83-1.82.83s.448 1.607 1.824 2.07M6 2l-.03 2.017A7 7 0 0 1 6.252 4c3.637-.123 6.007 2.983 6.007 2.983s-2.722 3.31-5.557 3.31q-.39-.002-.732-.065v.883q.292.039.61.04c2.638 0 4.546-1.348 6.394-2.943.307.246 1.561.842 1.819 1.104-1.757 1.47-5.852 2.657-8.173 2.657a7 7 0 0 1-.65-.034V14H16l.03-12zm-.03 3.747v-.956a6 6 0 0 1 .282-.015c2.616-.082 4.332 2.248 4.332 2.248S8.73 9.598 6.743 9.598c-.286 0-.542-.046-.773-.123v-2.9c1.018.123 1.223.572 1.835 1.593L9.167 7.02s-.994-1.304-2.67-1.304a5 5 0 0 0-.527.031" />
                </svg>
              </a>
              <p>Jobless? Look one.</p>
              <p className="muted">Job readiness platform to help users learn with direction, prove skills, and apply when eligible.</p>
            </section>
            <section>
              <h3>Quick Links</h3>
              <a href="#/">Home</a>
              <a href="#/career-paths">Career Paths</a>
              <a href="#/jobs">Jobs</a>
              <a href="#/register">Create Account</a>
            </section>
            <section>
              <h3>Contact</h3>
              <a href="mailto:hello@gigstart.local">hello@gigstart.local</a>
              <span>+62 21 5369 6969</span>
            </section>
            <section>
              <h3>Send Letter To</h3>
              <p>GigStart Team</p>
              <p>BINUS University Kemanggisan<br />Jl. K. H. Syahdan No. 9, Jakarta 11480</p>
            </section>
          </div>
          <div className="footer-bottom">
            <span>© 2026 GigStart</span>
            <span>Privacy · Terms · Accessibility</span>
          </div>
        </footer>
      </>
    );
  };

  // 2. User Layout Wrapper
  const renderUserLayout = (title, content) => {
    let modulesHref = "/modules/mod_sql";
    if (user && user.activeCareerPathId) {
      const pathModules = db.modules
        .filter((m) => m.careerPathId === user.activeCareerPathId)
        .sort((a, b) => a.order - b.order);
      
      if (pathModules.length > 0) {
        // Find the first module that isn't passed yet
        const nextModule = pathModules.find((m) => {
          const progress = db.progress.find((p) => p.userId === user.id && p.moduleId === m.id);
          return !progress || progress.status !== "PASSED";
        });
        
        // If all are passed, default to the first module of the path
        const targetModule = nextModule || pathModules[0];
        modulesHref = `/modules/${targetModule.id}`;
      }
    }

    const links = [
      ["/dashboard", "Dashboard"],
      ["/career-paths", "Career Paths"],
      [modulesHref, "Modules"],
      ["/jobs", "Jobs"],
      ["/certificates", "Certificates"],
      ["/applications", "Applications"],
      ["/profile", "Profile"],
    ];

    const isLinkActive = (href) => {
      const path = route.path;
      if (href === "/profile") return path === href;
      if (href.startsWith("/modules/")) return path.startsWith("/modules");
      if (href === "/career-paths") return path.startsWith("/career-paths");
      if (href === "/jobs") return path.startsWith("/jobs");
      return path === href;
    };

    return (
      <div className="app-shell">
        <div className="offcanvas-overlay" onClick={() => setActiveMenuOpen(false)}></div>
        <aside className={`sidebar ${activeMenuOpen ? "is-open" : ""}`}>
          <a className="brand" href="#/dashboard">
            <span className="brand-mark">GS</span>
            <span>GigStart</span>
            <span className="brand-partner-sep">|</span>
            <svg viewBox="0 0 16 16" style={{ height: "18px", width: "auto", color: "#76b900", display: "inline-block", verticalAlign: "middle" }}>
              <path fill="currentColor" d="M1.635 7.146S3.08 5.012 5.97 4.791v-.774C2.77 4.273 0 6.983 0 6.983s1.57 4.536 5.97 4.952v-.824c-3.23-.406-4.335-3.965-4.335-3.965M5.97 9.475v.753c-2.44-.435-3.118-2.972-3.118-2.972S4.023 5.958 5.97 5.747v.828h-.004c-1.021-.123-1.82.83-1.82.83s.448 1.607 1.824 2.07M6 2l-.03 2.017A7 7 0 0 1 6.252 4c3.637-.123 6.007 2.983 6.007 2.983s-2.722 3.31-5.557 3.31q-.39-.002-.732-.065v.883q.292.039.61.04c2.638 0 4.546-1.348 6.394-2.943.307.246 1.561.842 1.819 1.104-1.757 1.47-5.852 2.657-8.173 2.657a7 7 0 0 1-.65-.034V14H16l.03-12zm-.03 3.747v-.956a6 6 0 0 1 .282-.015c2.616-.082 4.332 2.248 4.332 2.248S8.73 9.598 6.743 9.598c-.286 0-.542-.046-.773-.123v-2.9c1.018.123 1.223.572 1.835 1.593L9.167 7.02s-.994-1.304-2.67-1.304a5 5 0 0 0-.527.031" />
            </svg>
          </a>
          <nav className="sidebar-nav" aria-label="User navigation">
            {links.map(([href, label]) => (
              <a key={href} className={`sidebar-link ${isLinkActive(href) ? "active" : ""}`} href={`#${href}`} onClick={() => setActiveMenuOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
          <a className={`sidebar-profile ${route.path === "/profile" ? "active" : ""}`} href="#/profile" aria-label="Open profile">
            {renderAvatar(user, "sidebar-avatar")}
            <span>
              <strong>{user?.name || "User"}</strong>
              <small>{user?.headline || user?.targetRole || "GigStart learner"}</small>
            </span>
          </a>
        </aside>
        <main className="app-main">
          <header className="app-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button className="app-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded={activeMenuOpen} onClick={() => setActiveMenuOpen(!activeMenuOpen)}>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
              </button>
              <div className="topbar-title">
                <strong>{title}</strong>
              </div>
            </div>
          </header>
          <section className="page">
            {renderFlash()}
            {content}
          </section>
        </main>
      </div>
    );
  };

  // 3. Admin Layout Wrapper
  const renderAdminLayout = (title, content) => {
    const links = [
      ["/admin", "Dashboard"],
      ["/admin/users", "Users"],
      ["/admin/career-paths", "Career Paths"],
      ["/admin/modules", "Modules"],
      ["/admin/assessments", "Assessments"],
      ["/admin/rubrics", "Rubrics"],
      ["/admin/jobs", "Jobs"],
      ["/admin/submissions", "Submissions"],
      ["/admin/applications", "Applications"],
      ["/admin/certificates", "Certificates"],
    ];

    return (
      <div className="app-shell">
        <div className="offcanvas-overlay" onClick={() => setActiveMenuOpen(false)}></div>
        <aside className={`sidebar ${activeMenuOpen ? "is-open" : ""}`}>
          <a className="brand" href="#/admin">
            <span className="brand-mark">GS</span>
            <span>GigStart Admin</span>
          </a>
          <nav className="sidebar-nav" aria-label="Admin navigation">
            {links.map(([href, label]) => (
              <a key={href} className={`sidebar-link ${route.path === href ? "active" : ""}`} href={`#${href}`} onClick={() => setActiveMenuOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="sidebar-profile">
            {renderAvatar({ name: "GigStart Admin" }, "sidebar-avatar")}
            <span>
              <strong>GigStart Admin</strong>
              <small>Administrator</small>
            </span>
          </div>
        </aside>
        <main className="app-main">
          <header className="app-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button className="app-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded={activeMenuOpen} onClick={() => setActiveMenuOpen(!activeMenuOpen)}>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
              </button>
              <div className="topbar-title">
                <strong>{title}</strong>
              </div>
            </div>
          </header>
          <section className="page">
            {renderFlash()}
            {content}
          </section>
        </main>
      </div>
    );
  };

  // --- Page Renderers ---

  // 1. Landing View
  const renderLandingPage = () => {
    return <LandingPage db={db} go={go} triggerFlash={triggerFlash} renderFlash={renderFlash} />;
  };

  // 2. Login View
  const renderLoginPage = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email") || "").toLowerCase().trim();
      const pass = fd.get("password");
      const matched = db.users.find((u) => u.email.toLowerCase().trim() === email && u.password === pass);

      if (!matched) {
        triggerFlash("error", "Invalid email or password.");
      } else {
        localStorage.setItem(SESSION_KEY, matched.id);
        setUser(matched);
        triggerFlash("success", "Welcome back!");
        go(matched.role === "ADMIN" ? "/admin" : "/dashboard");
      }
    };

    return renderGuestLayout(
      <section className="auth-page auth-marketing-page">
        <div className="auth-copy auth-marketing">
          <p className="eyebrow">GigStart</p>
          <h1>Kickstart your career with proven skills.</h1>
          <p className="marketing-text">
            GigStart empowers you to select structured career tracks, master practical real-world modules, earn verified credentials, and directly unlock internship opportunities that match your certified skills.
          </p>
          <p className="marketing-text muted">
            Specially engineered for students, fresh graduates, and early-career seekers who want to bypass the resume black hole. Learn with clear direction, prove your capabilities through automated sandboxes, and apply with absolute confidence to partner employers.
          </p>
          <div className="auth-quote desktop-only-quote">
            <blockquote>
              "Success is not final, failure is not fatal: it is the courage to continue that counts."
            </blockquote>
            <cite>— Winston S. Churchill</cite>
          </div>
        </div>
        <div className="auth-form-container">
          <form className="form-card form-grid" onSubmit={handleSubmit}>
            <h2>Welcome back</h2>
            {renderFlash()}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Your password" required />
            </div>
            <button className="button" type="submit">Login</button>
            <a className="button-ghost" href="#/register">Don't have an account? Create account</a>
          </form>
          <div className="auth-quote mobile-only-quote">
            <blockquote>
              "Success is not final, failure is not fatal: it is the courage to continue that counts."
            </blockquote>
            <cite>— Winston S. Churchill</cite>
          </div>
        </div>
      </section>
    );
  };

  // 3. Register View
  const renderRegisterPage = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = String(fd.get("name")).trim();
      const email = String(fd.get("email")).toLowerCase().trim();
      const password = fd.get("password");
      const confirmPassword = fd.get("confirmPassword");
      const interest = String(fd.get("interest")).split(",").map(i => i.trim()).filter(Boolean);
      const targetRole = fd.get("targetRole");
      const location = String(fd.get("location")).trim();

      if (password !== confirmPassword) {
        triggerFlash("error", "Confirm password does not match the password.");
        return;
      }

      if (db.users.some((u) => u.email === email)) {
        triggerFlash("error", "Email is already registered.");
        return;
      }

      const newUser = {
        id: makeId("user"),
        name,
        email,
        password,
        role: "USER",
        interest,
        targetRole,
        location,
        createdAt: TODAY,
        updatedAt: TODAY,
        activeCareerPathId: targetRole === "Data Analyst Intern" ? "path_da" : (targetRole === "UI/UX Designer Intern" ? "path_ux" : (targetRole === "Frontend Developer Intern" ? "path_fe" : null)),
      };

      const updatedUsers = [...db.users, newUser];
      const updatedDb = { ...db, users: updatedUsers };
      saveDb(updatedDb);

      localStorage.setItem(SESSION_KEY, newUser.id);
      setUser(newUser);
      triggerFlash("success", "Account created successfully.");
      go("/dashboard");
    };

    return renderGuestLayout(
      <section className="auth-page auth-marketing-page">
        <div className="auth-copy auth-marketing">
          <p className="eyebrow">Register</p>
          <h1>Create an account and start your first career path.</h1>
          <p className="marketing-text">
            Establish your professional profile, select your target career track, and immediately begin completing practical modules designed to bridge the gap between classroom theory and industry production environments.
          </p>
          <p className="marketing-text muted">
            Embark on a guided learning experience tailored for modern roles in tech. By proving your skills step-by-step, you build a verified portfolio that directly speaks to top hiring teams.
          </p>
          <div className="auth-quote desktop-only-quote">
            <blockquote>
              "The journey of a thousand miles begins with a single step."
            </blockquote>
            <cite>— Lao Tzu</cite>
          </div>
        </div>
        <div className="auth-form-container">
          <form className="form-card form-grid" onSubmit={handleSubmit}>
            <h2>Create your GigStart account</h2>
            {renderFlash()}
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" placeholder="Nama lengkap" required />
            </div>
            <div className="field">
              <label htmlFor="registerEmail">Email</label>
              <input id="registerEmail" name="email" type="email" placeholder="you@gigstart.local" required />
            </div>
            <div className="field">
              <label htmlFor="registerPassword">Password</label>
              <input id="registerPassword" name="password" type="password" required />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <div className="field">
              <label htmlFor="interest">Interest</label>
              <input id="interest" name="interest" placeholder="Data, Analytics" />
            </div>
            <div className="field">
              <label htmlFor="targetRole">Target Role</label>
              <select id="targetRole" name="targetRole">
                <option>Data Analyst Intern</option>
                <option>Frontend Developer Intern</option>
                <option>UI/UX Designer Intern</option>
                <option>Digital Marketing Intern</option>
                <option>Content Writer Intern</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" placeholder="Jakarta" />
            </div>
            <button className="button" type="submit">Create Account</button>
            <a className="button-ghost" href="#/login">Already have an account? Login</a>
          </form>
          <div className="auth-quote mobile-only-quote">
            <blockquote>
              "The journey of a thousand miles begins with a single step."
            </blockquote>
            <cite>— Lao Tzu</cite>
          </div>
        </div>
      </section>
    );
  };

  // 4. User Dashboard
  const renderUserDashboard = () => {
    const path = db.careerPaths.find((p) => p.id === user?.activeCareerPathId);

    if (!path) {
      return renderUserLayout(
        "Dashboard",
        <div className="empty-state">
          <h3>No active career path.</h3>
          <p>Select a career path first to calculate modules, certificates, and job eligibility.</p>
          <a className="button" href="#/career-paths">Open Career Paths</a>
        </div>
      );
    }

    const passed = pathModules.filter((m) => getModuleStatus(m) === "PASSED");
    const certs = db.certificates.filter((c) => c.userId === user?.id);
    const unlockedJobs = db.jobs.filter((j) => checkEligibility(j).status === "ELIGIBLE");
    const scores = passed.map((m) => db.progress.find((p) => p.userId === user?.id && p.moduleId === m.id)?.score || 0);
    const averageScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : "-";
    const nextModule = pathModules.find((m) => getModuleStatus(m) !== "PASSED");
    const progressPercent = pathModules.length ? Math.round((passed.length / pathModules.length) * 100) : 0;

    return renderUserLayout(
      "Dashboard",
      <>
        <div className="grid-2">
          <section className="panel important">
            <div className="panel-title">
              <div>
                <p className="eyebrow">Current career path</p>
                <h2>{path.name}</h2>
                <p className="muted">{path.description}</p>
              </div>
              {renderStatusBadge(path.status)}
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <strong>{passed.length}/{pathModules.length} modules completed</strong>
            <div className="metric-grid">
              <div className="metric"><span>Average Score</span><strong>{averageScore}</strong></div>
              <div className="metric"><span>Next Module</span><strong>{nextModule ? nextModule.title : "Done"}</strong></div>
              <div className="metric"><span>Unlocked Jobs</span><strong>{unlockedJobs.length}</strong></div>
              <div className="metric"><span>Certificates</span><strong>{certs.length}</strong></div>
            </div>
          </section>
          <section className="panel">
            <p className="eyebrow">Next action</p>
            {nextModule ? (
              <>
                <h3>{nextModule.title}</h3>
                <p className="muted">{nextModule.description}</p>
                <a className="button" href={`#/modules/${nextModule.id}`}>Open Module</a>
              </>
            ) : (
              <>
                <h3>Career path complete</h3>
                <p className="muted">All modules passed. Path certificate is available to download.</p>
                <a className="button" href="#/jobs">Open Eligible Jobs</a>
              </>
            )}
          </section>
        </div>
        <section className="panel" style={{ marginTop: "24px" }}>
          <p className="eyebrow">Module progress</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Passing Grade</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pathModules.map((module) => {
                  const progress = db.progress.find((p) => p.userId === user?.id && p.moduleId === module.id);
                  const runtimeStatus = progress?.status || getModuleStatus(module);
                  return (
                    <tr key={module.id}>
                      <td><strong>{module.title}</strong><br /><span className="muted">{module.moduleType}</span></td>
                      <td>{module.passingGrade}</td>
                      <td>{progress?.score ?? "-"}</td>
                      <td>{renderStatusBadge(runtimeStatus)}</td>
                      <td>
                        <a className="row-button" href={`#/modules/${module.id}`}>
                          {runtimeStatus === "LOCKED" ? "View" : "Open"}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  // --- Query Params & Forms Handlers ---
  const getQueryParam = (name) => {
    const params = new URLSearchParams(route.query);
    return params.get(name);
  };

  const handleDownloadCertificate = (cert) => {
    const certUser = db.users.find((u) => u.id === cert.userId);
    const path = db.careerPaths.find((p) => p.id === cert.careerPathId);
    const module = cert.moduleId ? db.modules.find((m) => m.id === cert.moduleId) : null;
    const verifyUrl = window.location.origin + window.location.pathname + "#/certificate/verify/" + cert.certificateId;
    const displayName = cert.issuedName || certUser?.name || user?.name || "Learner";

    // Create a temporary container for the certificate rendering
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "900px";
    container.style.height = "600px"; // standard aspect ratio 3:2
    container.style.zIndex = "-9999";
    
    // Add Google Font in the document head dynamically to make sure it's loaded in the parent document for html2canvas
    if (!document.getElementById("font-outfit-link")) {
      const link = document.createElement("link");
      link.id = "font-outfit-link";
      link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    
    container.innerHTML = `
      <div id="cert-capture-target" style="
        position: relative;
        width: 900px;
        height: 600px;
        background: #ffffff;
        color: #000000;
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 40px 50px;
        overflow: hidden;
        border: 2px solid #000000;
        border-radius: 20px;
        background-image: 
          linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px);
        background-size: 20px 20px;
      ">
        <!-- Tech Corners -->
        <div style="position: absolute; width: 16px; height: 16px; border: 2px solid #000000; top: 15px; left: 15px; border-right: none; border-bottom: none;"></div>
        <div style="position: absolute; width: 16px; height: 16px; border: 2px solid #000000; top: 15px; right: 15px; border-left: none; border-bottom: none;"></div>
        <div style="position: absolute; width: 16px; height: 16px; border: 2px solid #000000; bottom: 15px; left: 15px; border-right: none; border-top: none;"></div>
        <div style="position: absolute; width: 16px; height: 16px; border: 2px solid #000000; bottom: 15px; right: 15px; border-left: none; border-top: none;"></div>

        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 1;">
          <div style="text-align: left;">
            <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #000000;">GIGSTART</div>
            <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #000000; font-weight: 600; margin-top: 2px;">Verification Program</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: #000000; letter-spacing: 0.15em; font-weight: 700; margin-bottom: 4px;">Credential ID</div>
            <div style="font-size: 12px; font-family: monospace; color: #000000; font-weight: 600;">${cert.certificateId}</div>
          </div>
        </div>

        <!-- Body -->
        <div style="margin: 20px 0; z-index: 1; text-align: center;">
          <div style="font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px; color: #000000;">Certificate of Completion</div>
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #000000; margin-bottom: 24px;">This digital credential is proudly presented to</div>
          
          <div style="font-size: 38px; font-weight: 700; color: #000000; display: inline-block; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 18px;">${displayName}</div>
          
          <div style="font-size: 13px; color: #000000; line-height: 1.6; max-width: 580px; margin: 0 auto;">
            for demonstrating exceptional knowledge, dedication, and technical competence by successfully completing all standard coursework, hands-on modules, and assessments for:
            <div style="font-size: 20px; font-weight: 700; color: #000000; margin-top: 6px;">${module?.title || path?.name || "Career Path"}</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #000000; padding-top: 20px; z-index: 1;">
          <div style="text-align: left; display: flex; gap: 24px;">
            <div>
              <span style="display: block; font-size: 9px; text-transform: uppercase; color: #000000; letter-spacing: 0.1em; margin-bottom: 4px; font-weight: 600;">Completion Score</span>
              <strong style="display: block; font-size: 13px; color: #000000; font-weight: 600;">${cert.score}/100 PASSED</strong>
            </div>
            <div>
              <span style="display: block; font-size: 9px; text-transform: uppercase; color: #000000; letter-spacing: 0.1em; margin-bottom: 4px; font-weight: 600;">Date Issued</span>
              <strong style="display: block; font-size: 13px; color: #000000; font-weight: 600;">${cert.issuedAt}</strong>
            </div>
          </div>
          
          <div style="text-align: right;">
            <div style="font-size: 9px; text-transform: uppercase; color: #000000; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 8px;">Co-Certified by Platform Partners</div>
            <div style="display: flex; gap: 16px; align-items: center;">
              <!-- Nvidia -->
              <div style="display: flex; align-items: center; gap: 5px; background: #ffffff; border: 1px solid #000000; padding: 4px 8px; border-radius: 6px;">
                <svg viewBox="0 0 16 16" fill="#76b900" style="height: 12px; width: auto;"><path d="M1.635 7.146S3.08 5.012 5.97 4.791v-.774C2.77 4.273 0 6.983 0 6.983s1.57 4.536 5.97 4.952v-.824c-3.23-.406-4.335-3.965-4.335-3.965M5.97 9.475v.753c-2.44-.435-3.118-2.972-3.118-2.972S4.023 5.958 5.97 5.747v.828h-.004c-1.021-.123-1.82.83-1.82.83s.448 1.607 1.824 2.07M6 2l-.03 2.017A7 7 0 0 1 6.252 4c3.637-.123 6.007 2.983 6.007 2.983s-2.722 3.31-5.557 3.31q-.39-.002-.732-.065v.883q.292.039.61.04c2.638 0 4.546-1.348 6.394-2.943.307.246 1.561.842 1.819 1.104-1.757 1.47-5.852 2.657-8.173 2.657a7 7 0 0 1-.65-.034V14H16l.03-12zm-.03 3.747v-.956a6 6 0 0 1 .282-.015c2.616-.082 4.332 2.248 4.332 2.248S8.73 9.598 6.743 9.598c-.286 0-.542-.046-.773-.123v-2.9c1.018.123 1.223.572 1.835 1.593L9.167 7.02s-.994-1.304-2.67-1.304a5 5 0 0 0-.527.031"/></svg>
                <span style="font-size: 9px; font-weight: 600; color: #000000;">NVIDIA</span>
              </div>
              <!-- Google -->
              <div style="display: flex; align-items: center; gap: 5px; background: #ffffff; border: 1px solid #000000; padding: 4px 8px; border-radius: 6px;">
                <svg viewBox="0 0 24 24" style="height: 11px; width: auto;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.65-.35-1.35-.35-2.08z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                <span style="font-size: 9px; font-weight: 600; color: #000000;">GOOGLE DEVS</span>
              </div>
              <!-- Anthropic -->
              <div style="display: flex; align-items: center; gap: 5px; background: #ffffff; border: 1px solid #000000; padding: 4px 8px; border-radius: 6px;">
                <svg viewBox="0 0 30 30" fill="#E0B8A0" style="height: 12px; width: auto;"><path d="M15 4L5 24H9.5L12 19H18L20.5 24H25L15 4ZM13.5 15L15 10L16.5 15H13.5Z"/></svg>
                <span style="font-size: 9px; font-weight: 600; color: #000000;">ANTHROPIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    html2canvas(document.getElementById("cert-capture-target"), {
      useCORS: true,
      backgroundColor: null,
      scale: 2
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Certificate - ${displayName} - ${cert.certificateId}.png`;
      link.click();
      container.remove();
    }).catch((err) => {
      console.error("Failed to generate certificate PNG", err);
      container.remove();
    });
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").toLowerCase().trim();
    const bio = String(fd.get("bio") || "").trim();
    
    if (name.length < 3) {
      triggerFlash("error", "Full Name must be at least 3 characters.");
      return;
    }
    if (db.users.some((u) => u.id !== user.id && u.email.toLowerCase().trim() === email)) {
      triggerFlash("error", "Email is already taken by another user.");
      return;
    }

    const avatarFile = fd.get("avatar");
    const saveUser = (url) => {
      const updatedUsers = db.users.map((u) => {
        if (u.id === user.id) {
          const updated = {
            ...u,
            name,
            email,
            phone: String(fd.get("phone") || "").trim(),
            location: String(fd.get("location") || "").trim(),
            education: String(fd.get("education") || "").trim(),
            institution: String(fd.get("institution") || "").trim(),
            headline: String(fd.get("headline") || "").trim(),
            bio,
            updatedAt: TODAY,
          };
          if (url) updated.avatarUrl = url;
          setUser(updated);
          return updated;
        }
        return u;
      });
      saveDb({ ...db, users: updatedUsers });
      triggerFlash("success", "Personal information saved successfully.");
      setAvatarPreviewUrl(null);
      setAvatarFileName("");
    };

    if (avatarFile && avatarFile.name) {
      if (avatarFile.size > 2 * 1024 * 1024) {
        triggerFlash("error", "Avatar size exceeds 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => saveUser(reader.result);
      reader.onerror = () => triggerFlash("error", "Failed to read avatar file.");
      reader.readAsDataURL(avatarFile);
    } else {
      saveUser(null);
    }
  };

  const handleCareerSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const targetRole = fd.get("targetRole");
    const experienceLevel = fd.get("experienceLevel");
    const interest = String(fd.get("interest")).split(",").map(i => i.trim()).filter(Boolean);
    const preferredLocations = String(fd.get("preferredLocations")).split(",").map(i => i.trim()).filter(Boolean);

    const preferredWorkTypes = Array.from(fd.getAll("preferredWorkTypes"));
    const preferredEmploymentTypes = Array.from(fd.getAll("preferredEmploymentTypes"));

    const updatedUsers = db.users.map((u) => {
      if (u.id === user.id) {
        const updated = {
          ...u,
          targetRole,
          experienceLevel,
          interest,
          preferredLocations,
          preferredWorkTypes,
          preferredEmploymentTypes,
          updatedAt: TODAY,
        };
        setUser(updated);
        return updated;
      }
      return u;
    });
    saveDb({ ...db, users: updatedUsers });
    triggerFlash("success", "Career preferences saved successfully.");
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const currentPassword = fd.get("currentPassword");
    const newPassword = fd.get("newPassword");
    const confirmNewPassword = fd.get("confirmNewPassword");

    if (user.password !== currentPassword) {
      triggerFlash("error", "Current password does not match.");
      return;
    }
    if (newPassword.length < 6) {
      triggerFlash("error", "New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      triggerFlash("error", "New password confirmation does not match.");
      return;
    }

    const updatedUsers = db.users.map((u) => {
      if (u.id === user.id) {
        const updated = { ...u, password: newPassword, updatedAt: TODAY };
        setUser(updated);
        return updated;
      }
      return u;
    });
    saveDb({ ...db, users: updatedUsers });
    triggerFlash("success", "Password updated successfully.");
    e.target.reset();
  };

  const handleAddSelfSkill = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const skillName = String(fd.get("skillName") || "").trim();
    if (!skillName) return;

    if (user.selfDeclaredSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      triggerFlash("error", "Skill already exists.");
      return;
    }

    const updatedUsers = db.users.map((u) => {
      if (u.id === user.id) {
        const updated = {
          ...u,
          selfDeclaredSkills: [...u.selfDeclaredSkills, skillName],
          updatedAt: TODAY,
        };
        setUser(updated);
        return updated;
      }
      return u;
    });
    saveDb({ ...db, users: updatedUsers });
    triggerFlash("success", "Self-declared skill added successfully.");
    e.target.reset();
  };

  const handleRemoveSelfSkill = (skill) => {
    const updatedUsers = db.users.map((u) => {
      if (u.id === user.id) {
        const updated = {
          ...u,
          selfDeclaredSkills: u.selfDeclaredSkills.filter((s) => s !== skill),
          updatedAt: TODAY,
        };
        setUser(updated);
        return updated;
      }
      return u;
    });
    saveDb({ ...db, users: updatedUsers });
    triggerFlash("success", "Self-declared skill removed successfully.");
  };

  const handleCertificateSettingsSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const showCertificates = fd.get("showCertificates") === "on";
    const showScores = fd.get("showScores") === "on";

    const updatedUsers = db.users.map((u) => {
      if (u.id === user.id) {
        const updated = {
          ...u,
          privacy: { ...u.privacy, showCertificates, showScores },
          updatedAt: TODAY,
        };
          setUser(updated);
          return updated;
      }
      return u;
    });
    saveDb({ ...db, users: updatedUsers });
    triggerFlash("success", "Certificate settings saved successfully.");
  };

  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const profileVisibility = fd.get("profileVisibility");
    const showVerifiedSkills = fd.get("showVerifiedSkills") === "on";
    const showSelfDeclaredSkills = fd.get("showSelfDeclaredSkills") === "on";
    const showCertificates = fd.get("showCertificates") === "on";
    const showScores = fd.get("showScores") === "on";

    const updatedUsers = db.users.map((u) => {
      if (u.id === user.id) {
        const updated = {
          ...u,
          privacy: {
            profileVisibility,
            showVerifiedSkills,
            showSelfDeclaredSkills,
            showCertificates,
            showScores,
          },
          updatedAt: TODAY,
        };
        setUser(updated);
        return updated;
      }
      return u;
    });
    saveDb({ ...db, users: updatedUsers });
    triggerFlash("success", "Privacy settings saved successfully.");
  };

  const handlePortfolioSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const portfolioLinks = {};
    ["linkedin", "github", "portfolio", "figma", "kaggle", "other"].forEach((key) => {
      portfolioLinks[key] = String(fd.get(key) || "").trim();
    });

    const updatedUsers = db.users.map((u) => {
      if (u.id === user.id) {
        const updated = {
          ...u,
          portfolioLinks,
          updatedAt: TODAY,
        };
        setUser(updated);
        return updated;
      }
      return u;
    });
    saveDb({ ...db, users: updatedUsers });
    triggerFlash("success", "Portfolio links saved successfully.");
  };

  const handleResetProgress = () => {
    const confirmed = window.confirm("Reset progress, submissions, certificates, and applications for this account?");
    if (!confirmed) return;

    const updatedDb = {
      ...db,
      progress: db.progress.filter((p) => p.userId !== user.id),
      submissions: db.submissions.filter((s) => s.userId !== user.id),
      certificates: db.certificates.filter((c) => c.userId !== user.id),
      applications: db.applications.filter((a) => a.userId !== user.id),
    };

    const updatedUser = {
      ...user,
      activeCareerPathId: null,
      selfDeclaredSkills: [],
    };
    
    const updatedUsers = updatedDb.users.map((u) => {
      if (u.id === user.id) return updatedUser;
      return u;
    });
    
    const finalDb = { ...updatedDb, users: updatedUsers };
    saveDb(finalDb);
    setUser(updatedUser);

    triggerFlash("success", "Learning progress reset successfully.");
    go("/dashboard");
  };

  // --- React Page Renderers ---
  const renderCareerPathsPage = () => {
    return renderUserLayout(
      "Career Paths",
      <>
        <section className="panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Career Path</th>
                  <th>Level</th>
                  <th>Modules</th>
                  <th>Passing Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {db.careerPaths.map((path) => {
                  const pathModulesCount = db.modules.filter((m) => m.careerPathId === path.id).length;
                  return (
                    <tr key={path.id}>
                      <td>
                        <strong>{path.name}</strong>
                        <br />
                        <span className="muted">{path.description}</span>
                      </td>
                      <td>{path.level}</td>
                      <td>{pathModulesCount}</td>
                      <td>{path.passingGrade}</td>
                      <td>{renderStatusBadge(path.status)}</td>
                      <td>
                        <a className="row-button" href={`#/career-paths/${path.id}`}>
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel" style={{ marginTop: "18px" }}>
          <p className="eyebrow">Active path</p>
          <h3>
            {user?.activeCareerPathId
              ? db.careerPaths.find((p) => p.id === user.activeCareerPathId)?.name || "No active path"
              : "No active path"}
          </h3>
        </section>
      </>
    );
  };

  const renderCareerPathDetailPage = (pathId) => {
    const path = db.careerPaths.find((p) => p.id === pathId);
    if (!path) {
      return renderUserLayout("Not Found", <div className="empty-state"><h3>Career path not found.</h3></div>);
    }
    const modules = db.modules
      .filter((m) => m.careerPathId === path.id)
      .sort((a, b) => a.order - b.order);
    const relatedJobs = db.jobs.filter((job) => path.relatedJobIds.includes(job.id));

    const handleEnroll = () => {
      const updatedUsers = db.users.map((u) => {
        if (u.id === user.id) {
          const updatedUser = { ...u, activeCareerPathId: path.id, updatedAt: TODAY };
          setUser(updatedUser);
          return updatedUser;
        }
        return u;
      });
      const updatedDb = { ...db, users: updatedUsers };
      saveDb(updatedDb);
      triggerFlash("success", "Career path activated successfully.");
      go("/dashboard");
    };

    return renderUserLayout(
      path.name,
      <>
        <div className="grid-2">
          <section className="panel important">
            <p className="eyebrow">Path detail</p>
            <h2>{path.name}</h2>
            <p className="muted">{path.description}</p>
            <ul className="detail-list">
              <li>
                <span>Level</span>
                <strong>{path.level}</strong>
              </li>
              <li>
                <span>Passing Grade</span>
                <strong>{path.passingGrade}</strong>
              </li>
              <li>
                <span>Modules</span>
                <strong>{modules.length}</strong>
              </li>
              <li>
                <span>Status</span>
                <strong>{path.status}</strong>
              </li>
            </ul>
            <div className="toolbar" style={{ marginTop: "16px" }}>
              <button
                className="button"
                type="button"
                onClick={handleEnroll}
                disabled={user?.activeCareerPathId === path.id}
              >
                {user?.activeCareerPathId === path.id ? "Active Path" : "Enroll Path"}
              </button>
              <a className="button-outline" href="#/dashboard" style={{ marginLeft: "8px" }}>
                Back to Dashboard
              </a>
            </div>
          </section>
          <section className="panel">
            <p className="eyebrow">Related jobs</p>
            {relatedJobs.length ? (
              <ul className="detail-list">
                {relatedJobs.map((job) => {
                  const eligibility = checkEligibility(job);
                  return (
                    <li key={job.id}>
                      <span>{job.title}</span>
                      <strong>{renderStatusBadge(eligibility.status)}</strong>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="empty-state">Related jobs are not available yet.</div>
            )}
          </section>
        </div>
        <section className="panel" style={{ marginTop: "18px" }}>
          <p className="eyebrow">Required modules</p>
          {modules.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Passing Grade</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((m) => {
                    const progress = db.progress.find((p) => p.userId === user?.id && p.moduleId === m.id);
                    const runtimeStatus = progress?.status || getModuleStatus(m);
                    return (
                      <tr key={m.id}>
                        <td>
                          <strong>{m.title}</strong>
                          <br />
                          <span className="muted">{m.moduleType}</span>
                        </td>
                        <td>{m.passingGrade}</td>
                        <td>{progress?.score ?? "-"}</td>
                        <td>{renderStatusBadge(runtimeStatus)}</td>
                        <td>
                          <a className="row-button" href={`#/modules/${m.id}`}>
                            {runtimeStatus === "LOCKED" ? "View" : "Open"}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">Modules for this path are currently planned.</div>
          )}
        </section>
      </>
    );
  };

  const renderModuleDetailPage = (moduleId) => {
    const module = db.modules.find((m) => m.id === moduleId);
    if (!module) {
      return renderUserLayout("Not Found", <div className="empty-state"><h3>Module not found.</h3></div>);
    }
    const path = db.careerPaths.find((p) => p.id === module.careerPathId);
    const progress = db.progress.find((p) => p.userId === user?.id && p.moduleId === module.id);
    const runtimeStatus = progress?.status || getModuleStatus(module);
    const locked = runtimeStatus === "LOCKED";

    return renderUserLayout(
      module.title,
      <>
        <div className="grid-2">
          <section className="panel important">
            <p className="eyebrow">Module detail</p>
            <h2>{module.title}</h2>
            <p className="muted">{module.description}</p>
            <ul className="detail-list">
              <li>
                <span>Career Path</span>
                <strong>{path?.name || "-"}</strong>
              </li>
              <li>
                <span>Assessment Type</span>
                <strong>{module.moduleType}</strong>
              </li>
              <li>
                <span>Passing Grade</span>
                <strong>{module.passingGrade}</strong>
              </li>
              <li>
                <span>Status</span>
                <strong>{renderStatusBadge(runtimeStatus)}</strong>
              </li>
              <li>
                <span>Last Score</span>
                <strong>{progress?.score ?? "-"}</strong>
              </li>
            </ul>
            <div className="toolbar" style={{ marginTop: "16px" }}>
              <a
                className={`button ${locked ? "disabled" : ""}`}
                href={locked ? undefined : `#/modules/${module.id}/assessment`}
                style={{ pointerEvents: locked ? "none" : "auto", opacity: locked ? 0.5 : 1 }}
              >
                Start Assessment
              </a>
              {progress && (
                <a className="button-outline" href={`#/modules/${module.id}/result`} style={{ marginLeft: "8px" }}>
                  View Result
                </a>
              )}
            </div>
          </section>
          <section className="panel">
            <p className="eyebrow">Learning material</p>
            <p>{module.material}</p>
            {module.id === "mod_sql" && (
              <pre className="code-box">
{`SELECT name, score
FROM applicants
WHERE score >= 75;`}
              </pre>
            )}
          </section>
        </div>
        {locked && (
          <div className="message error" style={{ marginTop: "18px" }}>
            This module is locked. Complete the previous modules first.
          </div>
        )}
      </>
    );
  };

  const renderAssessmentPage = (moduleId) => {
    const module = db.modules.find((m) => m.id === moduleId);
    if (!module) {
      return renderUserLayout("Not Found", <div className="empty-state"><h3>Module not found.</h3></div>);
    }
    const runtimeStatus = getModuleStatus(module);
    if (runtimeStatus === "LOCKED") {
      triggerFlash("error", "Assessment is locked. Complete the previous modules first.");
      go(`/modules/${module.id}`);
      return null;
    }
    const assessment = db.assessments.find((a) => a.moduleId === module.id);
    const questions = assessment.components.flatMap((component) =>
      component.questionIds.map((id) => db.questions.find((q) => q.id === id))
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const answers = {};
      questions.forEach((q) => {
        answers[q.id] = String(fd.get(q.id) || "").trim();
      });
      
      const { updatedDb, submission } = submitAssessment(db, user, module.id, answers);
      saveDb(updatedDb);

      const updatedUser = updatedDb.users.find((u) => u.id === user.id);
      setUser(updatedUser);

      triggerFlash(
        submission.status === "PASSED" ? "success" : "error",
        `Assessment submitted. Final score: ${submission.finalScore}. Status: ${submission.status}.`
      );
      go(`/modules/${module.id}/result`);
    };

    return renderUserLayout(
      assessment.title,
      <form onSubmit={handleSubmit}>
        <section className="panel important">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Local scoring only</p>
              <h2>{module.title}</h2>
              <p className="muted">
                No mock scores or AI grading. Scores are calculated using answer keys, keyword matching, regex patterns, length, and rubric criteria.
              </p>
            </div>
            {renderStatusBadge("AVAILABLE", "ASSESSMENT")}
          </div>
          {questions.map((question) => (
            <article className="question-card" key={question.id}>
              <div>
                <p className="eyebrow">
                  {question.type.replace("_", " ")} - Max {question.maxScore}
                </p>
                <h3>{question.question}</h3>
              </div>
              {question.type === "MULTIPLE_CHOICE" ? (
                <ul className="option-list">
                  {question.options.map((option) => (
                    <li key={option}>
                      <label>
                        <input type="radio" name={question.id} value={option} required />
                        <span>{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : question.type === "CODE_ANSWER" ? (
                <div className="field">
                  <label htmlFor={question.id}>
                    {question.id.includes("sql") ? "Your SQL answer" : "Your code answer"}
                  </label>
                  <textarea
                    id={question.id}
                    name={question.id}
                    spellCheck="false"
                    placeholder={question.id.includes("sql") ? "Write your SQL query here..." : "Write your code here..."}
                    required
                    style={{ fontFamily: "monospace", minHeight: "120px" }}
                  ></textarea>
                </div>
              ) : (
                <div className="field">
                  <label htmlFor={question.id}>Your answer</label>
                  <textarea
                    id={question.id}
                    name={question.id}
                    placeholder="Write your answer here..."
                    required
                    style={{ minHeight: "120px" }}
                  ></textarea>
                </div>
              )}
            </article>
          ))}
          <button className="button" type="submit">
            Submit Assessment
          </button>
        </section>
      </form>
    );
  };

  const renderResultPage = (moduleId) => {
    const module = db.modules.find((m) => m.id === moduleId);
    if (!module) {
      return renderUserLayout("Not Found", <div className="empty-state"><h3>Module not found.</h3></div>);
    }
    const submissions = db.submissions
      .filter((s) => s.userId === user?.id && s.moduleId === module.id)
      .sort((a, b) => b.id.localeCompare(a.id));
    const submission = submissions[0];

    if (!submission) {
      triggerFlash("error", "No submission found for this module.");
      go(`/modules/${moduleId}`);
      return null;
    }
    const certificate = db.certificates.find((c) => c.userId === user?.id && c.moduleId === moduleId);

    return renderUserLayout(
      `${module.title} Result`,
      <>
        <div className="grid-2">
          <section className="result-panel">
            <p className="eyebrow">Final score</p>
            <div className="score-number" style={{ fontSize: "48px", fontWeight: "bold", margin: "12px 0" }}>
              {submission.finalScore}
            </div>
            <p>
              Passing Grade: <strong>{module.passingGrade}</strong>
            </p>
            <p style={{ margin: "12px 0" }}>Status: {renderStatusBadge(submission.status)}</p>
            <p className="muted">{submission.feedback}</p>
            <div className="toolbar" style={{ marginTop: "16px" }}>
              {certificate ? (
                <a className="button" href="#/certificates">
                  View Certificate
                </a>
              ) : (
                <a className="button-outline" href={`#/modules/${module.id}/assessment`}>
                  Retake Assessment
                </a>
              )}
              <a className="button-outline" href="#/jobs" style={{ marginLeft: "8px" }}>
                View Jobs
              </a>
            </div>
          </section>
          <section className="panel">
            <p className="eyebrow">Component breakdown</p>
            <div className="rubric-grid">
              {submission.componentBreakdown.map((item, idx) => (
                <div className="rubric-row" key={idx}>
                  <strong>{item.label}</strong>
                  <span>{item.rawScore}/{item.rawMax}</span>
                  <span>{item.weightedScore}/{item.weight}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="panel" style={{ marginTop: "18px" }}>
          <p className="eyebrow">Rubric matrix result</p>
          {submission.questionResults.map((result) => {
            const question = db.questions.find((q) => q.id === result.questionId);
            return (
              <article className="question-card" key={result.questionId}>
                <div className="panel-title">
                  <div>
                    <h3>{question?.question || "Question"}</h3>
                    <p className="muted">Answer: {result.answer || "-"}</p>
                  </div>
                  <strong>
                    {result.score}/{result.maxScore}
                  </strong>
                </div>
                {result.criteria && result.criteria.length > 0 && (
                  <div className="rubric-grid">
                    {result.criteria.map((criterion, cIdx) => (
                      <div className="rubric-row" key={cIdx}>
                        <span>{criterion.label}</span>
                        <span>{criterion.score}/{criterion.maxScore}</span>
                        <span>{criterion.passed ? "PASS" : "MISS"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </>
    );
  };

  const renderCertificatesPage = () => {
    const certificates = db.certificates.filter((cert) => cert.userId === user?.id);
    return renderUserLayout(
      "Certificates",
      <section className="panel">
        {certificates.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Certificate</th>
                  <th>Module/Path</th>
                  <th>Score</th>
                  <th>Issued Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => {
                  const module = cert.moduleId ? db.modules.find((m) => m.id === cert.moduleId) : null;
                  const path = db.careerPaths.find((p) => p.id === cert.careerPathId);
                  return (
                    <tr key={cert.id}>
                      <td>
                        <strong>{cert.title}</strong>
                        <br />
                        <span className="mono">{cert.certificateId}</span>
                      </td>
                      <td>{module?.title || path?.name || "-"}</td>
                      <td>{cert.score}</td>
                      <td>{cert.issuedAt}</td>
                      <td>{renderStatusBadge(cert.status)}</td>
                      <td>
                        <div className="inline-actions" style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="row-button"
                            type="button"
                            onClick={() => handleDownloadCertificate(cert)}
                          >
                            Download
                          </button>
                          <a className="row-button" href={`#/certificate/verify/${cert.certificateId}`}>
                            Verify
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No certificates available yet. Pass assessments to generate certificates automatically.</div>
        )}
      </section>
    );
  };

  const renderJobsPage = () => {
    const filter = getQueryParam("filter") || "RECOMMENDED";
    const filters = ["RECOMMENDED", "ALL", "ELIGIBLE", "ALMOST_ELIGIBLE", "LOCKED", "APPLIED"];

    const visibleJobs = db.jobs.filter((job) => {
      const appRecord = db.applications.find((item) => item.userId === user?.id && item.jobId === job.id);
      const eligibility = checkEligibility(job);
      if (filter === "RECOMMENDED") {
        const targetWords = normalize(user?.targetRole || "").split(" ").filter((word) => word.length > 3);
        const titleMatches = targetWords.some((word) => normalize(job.title).includes(word));
        const workMatches = !user?.preferredWorkTypes?.length || user.preferredWorkTypes.includes(job.workType);
        return titleMatches && workMatches;
      }
      if (filter === "ALL") return true;
      if (filter === "APPLIED") return Boolean(appRecord);
      return eligibility.status === filter;
    });

    return renderUserLayout(
      "Jobs",
      <section className="panel">
        <div className="toolbar" style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {filters.map((item) => (
            <a
              key={item}
              className={`row-button ${filter === item ? "active" : ""}`}
              href={`#/jobs?filter=${item}`}
              style={{
                background: filter === item ? "var(--primary)" : "transparent",
                color: filter === item ? "#ffffff" : "var(--primary)",
                border: "1px solid var(--primary)",
                padding: "4px 8px",
                borderRadius: "4px",
                textDecoration: "none"
              }}
            >
              {item.replace("_", " ")}
            </a>
          ))}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Required Modules</th>
                <th>Eligibility</th>
                <th>Application</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleJobs.length ? (
                visibleJobs.map((job) => {
                  const eligibility = checkEligibility(job);
                  const appRecord = db.applications.find((item) => item.userId === user?.id && item.jobId === job.id);
                  const required = job.requiredModuleIds
                    .map((id) => db.modules.find((m) => m.id === id)?.title || id)
                    .join(", ");
                  return (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.title}</strong>
                        <br />
                        <span className="muted">
                          {job.company} - {job.location} - {job.workType}
                        </span>
                      </td>
                      <td>{required}</td>
                      <td>{renderStatusBadge(eligibility.status)}</td>
                      <td>
                        {appRecord ? renderStatusBadge(appRecord.status) : renderStatusBadge("NOT_APPLIED", "NOT APPLIED")}
                      </td>
                      <td>
                        <a className="row-button" href={`#/jobs/${job.id}`}>
                          Detail
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "24px" }}>
                    No jobs found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  const renderJobDetailPage = (jobId) => {
    const job = db.jobs.find((j) => j.id === jobId);
    if (!job) {
      return renderUserLayout("Not Found", <div className="empty-state"><h3>Job not found.</h3></div>);
    }
    const eligibility = checkEligibility(job);
    const appRecord = db.applications.find((item) => item.userId === user?.id && item.jobId === job.id);

    const handleApply = () => {
      if (eligibility.status !== "ELIGIBLE") return;
      if (appRecord) return;

      const newApplication = {
        id: makeId("app"),
        userId: user.id,
        jobId: job.id,
        status: "APPLIED",
        appliedAt: TODAY,
      };

      const updatedApplications = [...db.applications, newApplication];
      const updatedDb = { ...db, applications: updatedApplications };
      saveDb(updatedDb);
      triggerFlash("success", "Application submitted successfully.");
    };

    return renderUserLayout(
      job.title,
      <>
        <div className="grid-2">
          <section className="panel important">
            <p className="eyebrow">Job detail</p>
            <h2>{job.title}</h2>
            <p className="muted">
              {job.company} - {job.location} - {job.workType} - {job.employmentType}
            </p>
            <p>{job.description}</p>
            <ul className="detail-list">
              <li>
                <span>Minimum Score</span>
                <strong>{job.minimumScore}</strong>
              </li>
              <li>
                <span>Eligibility</span>
                <strong>{eligibility.status.replace("_", " ")}</strong>
              </li>
              <li>
                <span>Missing Modules</span>
                <strong>{eligibility.missing.length}</strong>
              </li>
              <li>
                <span>Application</span>
                <strong>{appRecord?.status || "NOT APPLIED"}</strong>
              </li>
            </ul>
            <div className="toolbar" style={{ marginTop: "16px" }}>
              <button
                className="button"
                type="button"
                onClick={handleApply}
                disabled={eligibility.status !== "ELIGIBLE" || !!appRecord}
              >
                Apply Now
              </button>
              <a className="button-outline" href="#/jobs" style={{ marginLeft: "8px" }}>
                Back to Jobs
              </a>
            </div>
          </section>
          <section className="panel">
            <p className="eyebrow">Apply guard result</p>
            <h3>{eligibility.status === "ELIGIBLE" ? "Apply unlocked" : "Apply locked"}</h3>
            <p className="muted">
              Rules are checked when clicking the Apply button. If the candidate is not eligible or has already applied, the application cannot be created.
            </p>
          </section>
        </div>
        <section className="panel" style={{ marginTop: "18px" }}>
          <p className="eyebrow">Required modules</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {job.requiredModuleIds.map((moduleId) => {
                  const module = db.modules.find((m) => m.id === moduleId);
                  const progress = db.progress.find((p) => p.userId === user?.id && p.moduleId === moduleId);
                  return (
                    <tr key={moduleId}>
                      <td>{module?.title || moduleId}</td>
                      <td>{progress?.score ?? "-"}</td>
                      <td>
                        {renderStatusBadge(progress?.status || "NOT_STARTED", progress?.status || "NOT STARTED")}
                      </td>
                      <td>
                        <a className="row-button" href={`#/modules/${moduleId}`}>
                          {progress?.status === "PASSED" ? "View" : "Continue"}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  const renderApplicationsPage = () => {
    const userApps = db.applications.filter((a) => a.userId === user?.id);
    return renderUserLayout(
      "Applications",
      <section className="panel">
        {userApps.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userApps.map((app) => {
                  const job = db.jobs.find((j) => j.id === app.jobId);
                  return (
                    <tr key={app.id}>
                      <td>{job?.title || "Job Post"}</td>
                      <td>{job?.company || "-"}</td>
                      <td>{app.appliedAt}</td>
                      <td>{renderStatusBadge(app.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No applications submitted yet.</div>
        )}
      </section>
    );
  };

  const renderProfilePage = () => {
    const tab = getQueryParam("tab") || "overview";
    const tabs = [
      ["overview", "Overview"],
      ["personal", "Edit Profile"],
      ["career", "Career"],
      ["skills", "Skills"],
      ["certificates", "Certificates"],
      ["links", "Portfolio"],
      ["privacy", "Privacy"],
      ["security", "Security"],
    ];
    const activeTabs = tab === "overview" ? [["overview", "Overview"]] : tabs;

    const path = user?.activeCareerPathId ? db.careerPaths.find((p) => p.id === user.activeCareerPathId) : null;
    const skills = db.progress.filter((item) => item.userId === user?.id && item.status === "PASSED");
    const certificates = db.certificates.filter((cert) => cert.userId === user?.id);
    const applications = db.applications.filter((app) => app.userId === user?.id);

    const renderTabContent = () => {
      switch (tab) {
        case "overview":
          return (
            <div className="grid-2">
              <section className="panel">
                <p className="eyebrow">Overview</p>
                <ul className="detail-list">
                  <li>
                    <span>Email</span>
                    <strong>{user?.email}</strong>
                  </li>
                  <li>
                    <span>Target Role</span>
                    <strong>{user?.targetRole || "-"}</strong>
                  </li>
                  <li>
                    <span>Location</span>
                    <strong>{user?.location || "-"}</strong>
                  </li>
                  <li>
                    <span>Education</span>
                    <strong>{user?.education || "-"}</strong>
                  </li>
                  <li>
                    <span>Active Path</span>
                    <strong>{path?.name || "-"}</strong>
                  </li>
                </ul>
              </section>
              <section className="panel">
                <p className="eyebrow">Readiness summary</p>
                <div className="metric-grid profile-metrics">
                  <div className="metric">
                    <span>Verified Skills</span>
                    <strong>{skills.length}</strong>
                  </div>
                  <div className="metric">
                    <span>Certificates</span>
                    <strong>{certificates.length}</strong>
                  </div>
                  <div className="metric">
                    <span>Applications</span>
                    <strong>{applications.length}</strong>
                  </div>
                  <div className="metric">
                    <span>Self Skills</span>
                    <strong>{user?.selfDeclaredSkills?.length || 0}</strong>
                  </div>
                </div>
              </section>
              <section className="panel" style={{ gridColumn: "1 / -1", marginTop: "18px" }}>
                <p className="eyebrow">Skill passport</p>
                {skills.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Skill</th>
                          <th>Evidence</th>
                          <th>Score</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills.map((item) => {
                          const m = db.modules.find((mod) => mod.id === item.moduleId);
                          return (
                            <tr key={item.id}>
                              <td>{m?.title}</td>
                              <td>{m?.title} Module</td>
                              <td>{item.score}</td>
                              <td>{renderStatusBadge("VERIFIED")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">Skill passport is empty. Pass assessments to earn verified skills.</div>
                )}
              </section>
            </div>
          );

        case "personal":
          return (
            <form className="panel form-grid" onSubmit={handlePersonalSubmit}>
              <div>
                <p className="eyebrow">Personal information</p>
                <h2>User identity</h2>
                <p className="muted">This name will be printed on new certificates. Existing certificates retain the name recorded when issued.</p>
              </div>
              <div className="avatar-upload-container">
                <div className="avatar-preview-wrapper">
                  <span className="profile-avatar avatar-preview">
                    {avatarPreviewUrl ? (
                      <img src={avatarPreviewUrl} alt="Preview avatar" />
                    ) : user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={`${user.name} avatar`} />
                    ) : (
                      <span className="avatar-initials">{initials(user?.name)}</span>
                    )}
                  </span>
                  <label htmlFor="avatarInput" className="avatar-upload-trigger" title="Upload new photo">
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
                  </label>
                </div>
                <div className="avatar-upload-info">
                  <label htmlFor="avatarInput" className="avatar-button-styled">
                    <span className="material-symbols-outlined">cloud_upload</span>
                    <span>Choose Photo</span>
                  </label>
                  <input 
                    id="avatarInput" 
                    name="avatar" 
                    type="file" 
                    accept="image/png,image/jpeg,image/webp" 
                    className="avatar-input-hidden"
                    onChange={handleAvatarFileChange}
                  />
                  <span className="avatar-filename">{avatarFileName || "No file chosen"}</span>
                  <small className="muted">JPG, PNG, or WEBP. Max 2MB.</small>
                </div>
              </div>
              <div className="field">
                <label htmlFor="profileName">Full Name</label>
                <input id="profileName" name="name" defaultValue={user?.name} required minLength={3} />
              </div>
              <div className="field">
                <label htmlFor="profileEmail">Email</label>
                <input id="profileEmail" name="email" type="email" defaultValue={user?.email} required />
              </div>
              <div className="field">
                <label htmlFor="profilePhone">Phone Number</label>
                <input id="profilePhone" name="phone" defaultValue={user?.phone || ""} />
              </div>
              <div className="field">
                <label htmlFor="profileLocation">Location</label>
                <input id="profileLocation" name="location" defaultValue={user?.location || ""} />
              </div>
              <div className="field">
                <label htmlFor="profileEducation">Education</label>
                <input id="profileEducation" name="education" defaultValue={user?.education || ""} />
              </div>
              <div className="field">
                <label htmlFor="profileInstitution">University/Institution</label>
                <input id="profileInstitution" name="institution" defaultValue={user?.institution || ""} />
              </div>
              <div className="field">
                <label htmlFor="profileHeadline">Profile Headline</label>
                <input id="profileHeadline" name="headline" defaultValue={user?.headline || ""} />
              </div>
              <div className="field">
                <label htmlFor="profileBio">Short Bio</label>
                <textarea id="profileBio" name="bio" maxLength={300} defaultValue={user?.bio || ""}></textarea>
              </div>
              <button className="button" type="submit">
                Save Personal Information
              </button>
            </form>
          );

        case "career":
          const roles = ["Data Analyst Intern", "Frontend Developer Intern", "UI/UX Designer Intern", "Digital Marketing Intern", "Content Writer Intern"];
          const workTypes = ["Remote", "Hybrid", "Onsite"];
          const employmentTypes = ["Internship", "Part-time", "Full-time", "Freelance"];
          const levels = ["Beginner", "Intermediate", "Advanced"];
          return (
            <form className="panel form-grid" onSubmit={handleCareerSubmit}>
              <div>
                <p className="eyebrow">Career preferences</p>
                <h2>Target role and recommendations</h2>
                <p className="muted">Target role and preferred work types affect default recommendation results on the Jobs page.</p>
              </div>
              <div className="field">
                <label htmlFor="targetRole">Target Role</label>
                <select id="targetRole" name="targetRole" defaultValue={user?.targetRole || roles[0]} required>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="interest">Interested Fields</label>
                <input id="interest" name="interest" defaultValue={user?.interest?.join(", ") || ""} />
              </div>
              <div className="checkbox-grid">
                <strong>Work Type</strong>
                {workTypes.map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      name="preferredWorkTypes"
                      value={type}
                      defaultChecked={user?.preferredWorkTypes?.includes(type)}
                    />{" "}
                    {type}
                  </label>
                ))}
              </div>
              <div className="checkbox-grid">
                <strong>Employment Type</strong>
                {employmentTypes.map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      name="preferredEmploymentTypes"
                      value={type}
                      defaultChecked={user?.preferredEmploymentTypes?.includes(type)}
                    />{" "}
                    {type}
                  </label>
                ))}
              </div>
              <div className="field">
                <label htmlFor="preferredLocations">Preferred Locations</label>
                <input id="preferredLocations" name="preferredLocations" defaultValue={user?.preferredLocations?.join(", ") || ""} />
              </div>
              <div className="field">
                <label htmlFor="experienceLevel">Experience Level</label>
                <select id="experienceLevel" name="experienceLevel" defaultValue={user?.experienceLevel || levels[0]}>
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
              <button className="button" type="submit">
                Save Career Preferences
              </button>
            </form>
          );

        case "skills":
          return (
            <>
              <section className="panel">
                <p className="eyebrow">Skill passport</p>
                <h2>Verified Skills</h2>
                <p className="muted">Verified skills are earned from modules that have been passed. Score metrics cannot be modified manually.</p>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Evidence</th>
                        <th>Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skills.length ? (
                        skills.map((item) => {
                          const m = db.modules.find((mod) => mod.id === item.moduleId);
                          return (
                            <tr key={item.id}>
                              <td>{m?.title}</td>
                              <td>Verified by GigStart Assessment</td>
                              <td>{item.score}</td>
                              <td>{renderStatusBadge("VERIFIED")}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4}>No verified skills yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
              <form className="panel form-grid" onSubmit={handleAddSelfSkill} style={{ marginTop: "18px" }}>
                <p className="eyebrow">Self-declared skills</p>
                <div className="field">
                  <label htmlFor="skillName">Add Skill</label>
                  <input id="skillName" name="skillName" placeholder="Canva, Figma, Python..." required />
                </div>
                <button className="button" type="submit">
                  Add Self-Declared Skill
                </button>
                <div className="table-wrap" style={{ marginTop: "12px" }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user?.selfDeclaredSkills?.length ? (
                        user.selfDeclaredSkills.map((skill) => (
                          <tr key={skill}>
                            <td>{skill}</td>
                            <td>Added by User</td>
                            <td>Not Verified</td>
                            <td>
                              <button
                                className="row-button animate-button"
                                type="button"
                                onClick={() => handleRemoveSelfSkill(skill)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No self-declared skills.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </form>
            </>
          );

        case "certificates":
          return (
            <>
              <section className="panel">
                <p className="eyebrow">Certificates</p>
                <h2>Certificate records</h2>
                {certificates.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Certificate</th>
                          <th>Module/Path</th>
                          <th>Score</th>
                          <th>Issued Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.map((cert) => {
                          const module = cert.moduleId ? db.modules.find((m) => m.id === cert.moduleId) : null;
                          const path = db.careerPaths.find((p) => p.id === cert.careerPathId);
                          return (
                            <tr key={cert.id}>
                              <td>
                                <strong>{cert.title}</strong>
                                <br />
                                <span className="mono">{cert.certificateId}</span>
                              </td>
                              <td>{module?.title || path?.name || "-"}</td>
                              <td>{cert.score}</td>
                              <td>{cert.issuedAt}</td>
                              <td>{renderStatusBadge(cert.status)}</td>
                              <td>
                                <div className="inline-actions" style={{ display: "flex", gap: "8px" }}>
                                  <button
                                    className="row-button animate-button"
                                    type="button"
                                    onClick={() => handleDownloadCertificate(cert)}
                                  >
                                    Download
                                  </button>
                                  <a className="row-button" href={`#/certificate/verify/${cert.certificateId}`}>
                                    Verify
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">No certificates available yet. Pass assessments to generate certificates automatically.</div>
                )}
              </section>
              <form className="panel form-grid" onSubmit={handleCertificateSettingsSubmit} style={{ marginTop: "18px" }}>
                <div>
                  <p className="eyebrow">Certificate settings</p>
                  <h2>Certificate visibility</h2>
                  <p className="muted">Certificate names follow your full profile name. The verification page always shows the score for verification authenticity.</p>
                </div>
                <div className="field">
                  <label>Certificate Display Name</label>
                  <input value={user?.name || ""} disabled />
                </div>
                <label className="toggle-row">
                  <span>Show certificates on public profile</span>
                  <input type="checkbox" name="showCertificates" defaultChecked={user?.privacy?.showCertificates} />
                  <span className="toggle-slider" aria-hidden="true"></span>
                </label>
                <label className="toggle-row">
                  <span>Show scores on public profile</span>
                  <input type="checkbox" name="showScores" defaultChecked={user?.privacy?.showScores} />
                  <span className="toggle-slider" aria-hidden="true"></span>
                </label>
                <button className="button" type="submit">
                  Save Certificate Settings
                </button>
              </form>
            </>
          );

        case "links":
          const links = user?.portfolioLinks || {};
          return (
            <form className="panel form-grid" onSubmit={handlePortfolioSubmit}>
              <div>
                <p className="eyebrow">Portfolio links</p>
                <h2>Supplementary evidence for employers</h2>
                <p className="muted">URLs should begin with http:// or https://.</p>
              </div>
              {["linkedin", "github", "portfolio", "figma", "kaggle", "other"].map((key) => (
                <div className="field" key={key}>
                  <label htmlFor={key}>{key.toUpperCase()}</label>
                  <input id={key} name={key} defaultValue={links[key] || ""} placeholder="https://..." />
                </div>
              ))}
              <button className="button" type="submit">
                Save Portfolio Links
              </button>
            </form>
          );

        case "privacy":
          return (
            <form className="panel form-grid" onSubmit={handlePrivacySubmit}>
              <div>
                <p className="eyebrow">Privacy and visibility</p>
                <h2>Public profile controls</h2>
                <p className="muted">Application history, email address, phone number, and detailed answers are never shared publicly.</p>
              </div>
              <div className="field">
                <label htmlFor="profileVisibility">Profile Visibility</label>
                <select id="profileVisibility" name="profileVisibility" defaultValue={user?.privacy?.profileVisibility || "PUBLIC"}>
                  <option value="PUBLIC">Public</option>
                  <option value="EMPLOYERS_ONLY">Only Employers/Admin</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <label className="toggle-row">
                <span>Show verified skills publicly</span>
                <input type="checkbox" name="showVerifiedSkills" defaultChecked={user?.privacy?.showVerifiedSkills} />
                <span className="toggle-slider" aria-hidden="true"></span>
              </label>
              <label className="toggle-row">
                <span>Show self-declared skills publicly</span>
                <input type="checkbox" name="showSelfDeclaredSkills" defaultChecked={user?.privacy?.showSelfDeclaredSkills} />
                <span className="toggle-slider" aria-hidden="true"></span>
              </label>
              <label className="toggle-row">
                <span>Show certificates publicly</span>
                <input type="checkbox" name="showCertificates" defaultChecked={user?.privacy?.showCertificates} />
                <span className="toggle-slider" aria-hidden="true"></span>
              </label>
              <label className="toggle-row">
                <span>Show scores publicly</span>
                <input type="checkbox" name="showScores" defaultChecked={user?.privacy?.showScores} />
                <span className="toggle-slider" aria-hidden="true"></span>
              </label>
              <button className="button" type="submit">
                Save Privacy Settings
              </button>
            </form>
          );

        case "security":
          return (
            <>
              <form className="panel form-grid" onSubmit={handleSecuritySubmit}>
                <div>
                  <p className="eyebrow">Account security</p>
                  <h2>Change Password</h2>
                  <p className="muted">The local database validates your current password before updating.</p>
                </div>
                <div className="field">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input id="currentPassword" name="currentPassword" type="password" required />
                </div>
                <div className="field">
                  <label htmlFor="newPassword">New Password</label>
                  <input id="newPassword" name="newPassword" type="password" minLength={6} required />
                </div>
                <div className="field">
                  <label htmlFor="confirmNewPassword">Confirm New Password</label>
                  <input id="confirmNewPassword" name="confirmNewPassword" type="password" minLength={6} required />
                </div>
                <button className="button" type="submit">
                  Update Password
                </button>
              </form>
              <section className="panel important danger-zone-panel" style={{ marginTop: "18px" }}>
                <p className="eyebrow">Danger zone</p>
                <h2>Reset Learning Progress</h2>
                <p className="muted">This action permanently deletes all progress records, submission attempts, certificates, and applications for this account. Your profile remains intact.</p>
                <button className="button-danger" type="button" onClick={handleResetProgress}>
                  Reset Learning Progress
                </button>
              </section>
            </>
          );

        default:
          return null;
      }
    };

    return renderUserLayout(
      "Profile",
      <>
        <section className="profile-hero panel important">
          {renderAvatar(user, "profile-avatar")}
          <div>
            <p className="eyebrow">GigStart profile</p>
            <h2>{user?.name}</h2>
            <p>{user?.headline || user?.targetRole || "GigStart learner"}</p>
            <div className="toolbar" style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <a className="button" href="#/profile?tab=personal">
                Edit Profile
              </a>
              <button className="button-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </section>
        <div className="settings-layout profile-layout">
          <nav className="settings-tabs" aria-label="Profile tabs">
            {activeTabs.map(([key, label]) => (
              <a
                key={key}
                className={tab === key ? "active" : ""}
                href={`#/profile?tab=${key}`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="settings-content">{renderTabContent()}</div>
        </div>
      </>
    );
  };

  const renderPublicProfilePage = (userId) => {
    const targetUser = db.users.find((u) => u.id === userId && u.role === "USER");
    if (!targetUser) {
      return renderGuestLayout(
        <section className="auth-page">
          <div>
            <p className="eyebrow">Public profile</p>
            <h1>Profile not found.</h1>
            <p className="muted">This user does not exist on the platform.</p>
            <a className="button" href="#/">
              Back Home
            </a>
          </div>
        </section>
      );
    }

    const ownerOrAdmin = user?.id === targetUser.id || user?.role === "ADMIN";
    if (targetUser.privacy.profileVisibility === "PRIVATE" && !ownerOrAdmin) {
      return renderGuestLayout(
        <section className="auth-page">
          <div>
            <p className="eyebrow">Public profile</p>
            <h1>This profile is private.</h1>
            <p className="muted">The user has chosen to restrict visibility to private.</p>
            <a className="button" href="#/">
              Back Home
            </a>
          </div>
        </section>
      );
    }

    if (targetUser.privacy.profileVisibility === "EMPLOYERS_ONLY" && !ownerOrAdmin) {
      return renderGuestLayout(
        <section className="auth-page">
          <div>
            <p className="eyebrow">Public profile</p>
            <h1>Restricted Profile.</h1>
            <p className="muted">This profile is only visible to authorized employers and administrators.</p>
            <a className="button" href="#/">
              Back Home
            </a>
          </div>
        </section>
      );
    }

    const path = targetUser.activeCareerPathId ? db.careerPaths.find((p) => p.id === targetUser.activeCareerPathId) : null;
    const verifiedSkills = db.progress.filter((item) => item.userId === targetUser.id && item.status === "PASSED");
    const certificates = db.certificates.filter((cert) => cert.userId === targetUser.id && cert.status === "VALID");
    const portfolioLinks = Object.entries(targetUser.portfolioLinks || {}).filter(([, value]) => value);

    return renderGuestLayout(
      <>
        <section className="landing-hero" style={{ padding: "48px 0", borderBottom: "1px solid var(--line)" }}>
          <div className="landing-copy">
            <div className="public-profile-heading" style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "24px" }}>
              {renderAvatar(targetUser, "profile-avatar")}
              <div>
                <p className="eyebrow">Public profile</p>
                <h1>{targetUser.name}</h1>
                <p className="muted" style={{ fontSize: "18px" }}>
                  {targetUser.headline || targetUser.targetRole || "GigStart job seeker"}
                </p>
              </div>
            </div>
            <ul className="detail-list" style={{ marginTop: "16px" }}>
              <li>
                <span>Target Role</span>
                <strong>{targetUser.targetRole || "-"}</strong>
              </li>
              <li>
                <span>Career Path</span>
                <strong>{path?.name || "-"}</strong>
              </li>
              <li>
                <span>Location</span>
                <strong>{targetUser.location || "-"}</strong>
              </li>
            </ul>
          </div>
          <aside className="system-preview" style={{ padding: "24px", alignSelf: "start" }}>
            <p className="eyebrow">Bio</p>
            <p style={{ lineHeight: "1.6" }}>{targetUser.bio || "No public bio available."}</p>
          </aside>
        </section>
        <section className="landing-section" style={{ padding: "48px 0" }}>
          <div className="grid-2">
            <section className="panel">
              <p className="eyebrow">Verified skills</p>
              {targetUser.privacy.showVerifiedSkills ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Evidence</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifiedSkills.length ? (
                        verifiedSkills.map((item) => {
                          const m = db.modules.find((mod) => mod.id === item.moduleId);
                          return (
                            <tr key={item.id}>
                              <td>{m?.title}</td>
                              <td>GigStart Assessment</td>
                              <td>{targetUser.privacy.showScores ? item.score : "Hidden"}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3}>No verified skills yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">Verified skills hidden by user.</div>
              )}
            </section>
            <section className="panel">
              <p className="eyebrow">Self-declared skills</p>
              {targetUser.privacy.showSelfDeclaredSkills ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {targetUser.selfDeclaredSkills?.length ? (
                        targetUser.selfDeclaredSkills.map((skill) => (
                          <tr key={skill}>
                            <td>{skill}</td>
                            <td>Added by User</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2}>No self-declared skills.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">Self-declared skills hidden by user.</div>
              )}
            </section>
          </div>
          <div className="grid-2" style={{ marginTop: "18px" }}>
            <section className="panel">
              <p className="eyebrow">Certificates</p>
              {targetUser.privacy.showCertificates ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Certificate</th>
                        <th>Score</th>
                        <th>Verify</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.length ? (
                        certificates.map((cert) => (
                          <tr key={cert.id}>
                            <td>{cert.title}</td>
                            <td>{targetUser.privacy.showScores ? cert.score : "Hidden"}</td>
                            <td>
                              <a className="row-button" href={`#/certificate/verify/${cert.certificateId}`}>
                                Verify
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3}>No certificates yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">Certificates hidden by user.</div>
              )}
            </section>
            <section className="panel">
              <p className="eyebrow">Portfolio links</p>
              {portfolioLinks.length ? (
                <ul className="detail-list">
                  {portfolioLinks.map(([key, value]) => (
                    <li key={key}>
                      <span>{key.toUpperCase()}</span>
                      <strong>
                        <a href={value} target="_blank" rel="noopener noreferrer" style={{ wordBreak: "break-all" }}>
                          {value}
                        </a>
                      </strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">No public portfolio links.</div>
              )}
            </section>
          </div>
        </section>
      </>
    );
  };

  const renderVerifyPage = (certificateId) => {
    const cert = db.certificates.find((item) => item.certificateId === certificateId);
    if (!cert) {
      return renderGuestLayout(
        <section className="auth-page">
          <div>
            <p className="eyebrow">Certificate verification</p>
            <h1>Certificate not found.</h1>
            <p className="muted">This certificate ID does not exist in our verification database.</p>
            <a className="button" href="#/">
              Back Home
            </a>
          </div>
        </section>
      );
    }
    const certUser = db.users.find((item) => item.id === cert.userId);
    const module = cert.moduleId ? db.modules.find((m) => m.id === cert.moduleId) : null;
    const path = db.careerPaths.find((p) => p.id === cert.careerPathId);

    return renderGuestLayout(
      <section className="auth-page">
        <div>
          <p className="eyebrow">Certificate verification</p>
          <h1>Status: {cert.status}</h1>
          <p className="muted">This page is publicly accessible to verify credentials issued by the platform.</p>
        </div>
        <section className="certificate-paper" style={{ padding: "24px" }}>
          <p className="eyebrow">Certificate ID</p>
          <h2>{cert.certificateId}</h2>
          <dl className="detail-list" style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <dt>Issued To</dt>
              <dd><strong>{cert.issuedName || certUser?.name}</strong></dd>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <dt>Career Path</dt>
              <dd><strong>{path?.name || "-"}</strong></dd>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <dt>Module/Assessment</dt>
              <dd><strong>{module?.title || cert.title}</strong></dd>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <dt>Score</dt>
              <dd><strong>{cert.score}/100</strong></dd>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <dt>Issued Date</dt>
              <dd><strong>{cert.issuedAt}</strong></dd>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <dt>Status</dt>
              <dd><strong>{cert.status}</strong></dd>
            </div>
          </dl>
        </section>
      </section>
    );
  };

  // --- Router Dispatch ---
  const renderRoute = () => {
    // Admin routing
    if (route.path.startsWith("/admin")) {
      if (!user || user.role !== "ADMIN") {
        return renderLoginPage();
      }

      let adminTitle = "Admin Dashboard";
      let adminContent = null;

      if (route.path === "/admin" || route.path === "/admin/") {
        adminTitle = "Admin Dashboard";
        adminContent = (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="panel">
              <h2>Admin Controls</h2>
              <p className="muted">Welcome, {user.name}. Choose an option from the sidebar to manage system resources.</p>
              <button className="button-danger" onClick={handleLogout} style={{ marginTop: "16px" }}>Logout</button>
            </div>
            
            <div className="metric-grid">
              <div className="metric">
                <span>Total Users</span>
                <strong>{db.users.length}</strong>
              </div>
              <div className="metric">
                <span>Career Paths</span>
                <strong>{db.careerPaths.length}</strong>
              </div>
              <div className="metric">
                <span>Active Modules</span>
                <strong>{db.modules.length}</strong>
              </div>
              <div className="metric">
                <span>Submissions</span>
                <strong>{db.submissions.length}</strong>
              </div>
              <div className="metric">
                <span>Certificates</span>
                <strong>{db.certificates.length}</strong>
              </div>
              <div className="metric">
                <span>Jobs Posted</span>
                <strong>{db.jobs.length}</strong>
              </div>
            </div>
          </div>
        );
      } else if (route.path === "/admin/users") {
        adminTitle = "Manage Users";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Users</h2>
              <span className="status-badge muted">{db.users.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Headline</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {db.users.map((u) => (
                    <tr key={u.id}>
                      <td><code className="mono">{u.id}</code></td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`status-badge ${u.role === "ADMIN" ? "success" : "muted"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.headline || "-"}</td>
                      <td>{u.location || "-"}</td>
                      <td>
                        {u.id !== user.id ? (
                          <button 
                            className="button-danger" 
                            style={{ minHeight: "28px", padding: "0 8px", fontSize: "12px" }}
                            onClick={() => {
                              if (confirm(`Delete user ${u.name}?`)) {
                                const newUsers = db.users.filter(x => x.id !== u.id);
                                saveDb({ ...db, users: newUsers });
                                triggerFlash("success", `User ${u.name} deleted.`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="muted" style={{ fontSize: "12px" }}>Active Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/career-paths") {
        adminTitle = "Manage Career Paths";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Career Paths</h2>
              <span className="status-badge muted">{db.careerPaths.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Passing Grade</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {db.careerPaths.map((p) => (
                    <tr key={p.id}>
                      <td><code className="mono">{p.id}</code></td>
                      <td><code className="mono">{p.code}</code></td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.level}</td>
                      <td>{p.passingGrade}%</td>
                      <td>
                        <span className={`status-badge ${p.status === "ACTIVE" ? "success" : "warning"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="button-outline" 
                          style={{ minHeight: "28px", padding: "0 8px", fontSize: "12px" }}
                          onClick={() => {
                            const newPaths = db.careerPaths.map(x => x.id === p.id ? { ...x, status: x.status === "ACTIVE" ? "PLANNED" : "ACTIVE" } : x);
                            saveDb({ ...db, careerPaths: newPaths });
                            triggerFlash("success", `Status of ${p.name} updated.`);
                          }}
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/modules") {
        adminTitle = "Manage Modules";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Modules</h2>
              <span className="status-badge muted">{db.modules.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Path ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Passing Grade</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {db.modules.map((m) => (
                    <tr key={m.id}>
                      <td><code className="mono">{m.id}</code></td>
                      <td><code className="mono">{m.careerPathId}</code></td>
                      <td><strong>{m.title}</strong></td>
                      <td>{m.moduleType}</td>
                      <td>{m.passingGrade}%</td>
                      <td>{m.order}</td>
                      <td>
                        <span className={`status-badge ${m.status === "ACTIVE" ? "success" : "warning"}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="button-outline" 
                          style={{ minHeight: "28px", padding: "0 8px", fontSize: "12px" }}
                          onClick={() => {
                            const newMods = db.modules.map(x => x.id === m.id ? { ...x, status: x.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : x);
                            saveDb({ ...db, modules: newMods });
                            triggerFlash("success", `Status of ${m.title} updated.`);
                          }}
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/assessments") {
        adminTitle = "Manage Assessments";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Assessments</h2>
              <span className="status-badge muted">{db.assessments.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Module ID</th>
                    <th>Title</th>
                    <th>Components</th>
                  </tr>
                </thead>
                <tbody>
                  {db.assessments.map((a) => (
                    <tr key={a.id}>
                      <td><code className="mono">{a.id}</code></td>
                      <td><code className="mono">{a.moduleId}</code></td>
                      <td><strong>{a.title}</strong></td>
                      <td>
                        {a.components.map(c => `${c.label} (${c.weight}%)`).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/rubrics") {
        adminTitle = "Manage Rubrics";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Evaluation Rubrics</h2>
              <span className="status-badge muted">{db.rubrics.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Criteria Count</th>
                    <th>Criteria Labels</th>
                  </tr>
                </thead>
                <tbody>
                  {db.rubrics.map((r) => (
                    <tr key={r.id}>
                      <td><code className="mono">{r.id}</code></td>
                      <td><strong>{r.name}</strong></td>
                      <td><span className="status-badge muted">{r.criteria.length}</span></td>
                      <td>{r.criteria.map(c => c.label).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/jobs") {
        adminTitle = "Manage Jobs";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Jobs</h2>
              <span className="status-badge muted">{db.jobs.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Min Score</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {db.jobs.map((j) => (
                    <tr key={j.id}>
                      <td><code className="mono">{j.id}</code></td>
                      <td><strong>{j.title}</strong></td>
                      <td>{j.company}</td>
                      <td>{j.location} ({j.workType})</td>
                      <td>{j.employmentType}</td>
                      <td>{j.minimumScore}%</td>
                      <td>
                        <span className={`status-badge ${j.status === "OPEN" ? "success" : "error"}`}>
                          {j.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="button-outline" 
                          style={{ minHeight: "28px", padding: "0 8px", fontSize: "12px", marginRight: "8px" }}
                          onClick={() => {
                            const newJobs = db.jobs.map(x => x.id === j.id ? { ...x, status: x.status === "OPEN" ? "CLOSED" : "OPEN" } : x);
                            saveDb({ ...db, jobs: newJobs });
                            triggerFlash("success", `Status of ${j.title} updated.`);
                          }}
                        >
                          Toggle Status
                        </button>
                        <button 
                          className="button-danger" 
                          style={{ minHeight: "28px", padding: "0 8px", fontSize: "12px" }}
                          onClick={() => {
                            if (confirm(`Delete job ${j.title}?`)) {
                              const newJobs = db.jobs.filter(x => x.id !== j.id);
                              saveDb({ ...db, jobs: newJobs });
                              triggerFlash("success", `Job ${j.title} deleted.`);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/submissions") {
        adminTitle = "Manage Submissions";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>User Submissions</h2>
              <span className="status-badge muted">{db.submissions.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Module ID</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {db.submissions.map((s) => (
                    <tr key={s.id}>
                      <td><code className="mono">{s.id}</code></td>
                      <td><code className="mono">{s.userId}</code></td>
                      <td><code className="mono">{s.moduleId}</code></td>
                      <td><strong>{s.finalScore}%</strong></td>
                      <td>
                        <span className={`status-badge ${s.status === "PASSED" ? "success" : "error"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>{s.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/applications") {
        adminTitle = "Manage Applications";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Job Applications</h2>
              <span className="status-badge muted">{db.applications.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Job ID</th>
                    <th>User ID</th>
                    <th>Status</th>
                    <th>Applied At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {db.applications.map((app) => (
                    <tr key={app.id}>
                      <td><code className="mono">{app.id}</code></td>
                      <td><code className="mono">{app.jobId}</code></td>
                      <td><code className="mono">{app.userId}</code></td>
                      <td>
                        <span className={`status-badge ${
                          app.status === "HIRED" ? "success" : 
                          app.status === "REJECTED" ? "error" : 
                          app.status === "REVIEWING" ? "warning" : "muted"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>{app.appliedAt}</td>
                      <td>
                        <select 
                          value={app.status} 
                          style={{ minHeight: "28px", padding: "2px 8px", fontSize: "12px", borderRadius: "4px", border: "1px solid var(--line-strong)" }}
                          onChange={(e) => {
                            const newApps = db.applications.map(x => x.id === app.id ? { ...x, status: e.target.value } : x);
                            saveDb({ ...db, applications: newApps });
                            triggerFlash("success", `Application status updated to ${e.target.value}.`);
                          }}
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="HIRED">HIRED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (route.path === "/admin/certificates") {
        adminTitle = "Manage Certificates";
        adminContent = (
          <div className="panel">
            <div className="panel-title">
              <h2>Issued Certificates</h2>
              <span className="status-badge muted">{db.certificates.length} total</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Issued To</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Avg/Score</th>
                    <th>Status</th>
                    <th>Issued At</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {db.certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td><code className="mono">{cert.certificateId}</code></td>
                      <td><strong>{cert.issuedName}</strong></td>
                      <td><span className="status-badge muted">{cert.type}</span></td>
                      <td>{cert.title}</td>
                      <td><strong>{cert.score}%</strong></td>
                      <td>
                        <span className={`status-badge ${cert.status === "VALID" ? "success" : "error"}`}>
                          {cert.status}
                        </span>
                      </td>
                      <td>{cert.issuedAt}</td>
                      <td>
                        <a 
                          className="button-outline" 
                          style={{ minHeight: "26px", padding: "0 8px", fontSize: "11px", display: "inline-flex", alignItems: "center" }}
                          href={`#/certificate/verify/${cert.id}`}
                        >
                          Verify
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else {
        adminContent = (
          <div className="panel">
            <h2>Not Found</h2>
            <p className="muted">The requested admin resource could not be found.</p>
          </div>
        );
      }

      return renderAdminLayout(adminTitle, adminContent);
    }

    // Guest routing
    if (route.path === "/") return renderLandingPage();
    if (route.path === "/login") return renderLoginPage();
    if (route.path === "/register") return renderRegisterPage();

    // Verify / Public Profile (Public routes, no auth required!)
    if (route.path.startsWith("/certificate/verify/")) {
      const certId = route.path.split("/").pop();
      return renderVerifyPage(certId);
    }
    if (route.path.startsWith("/u/")) {
      const userId = route.path.split("/").pop();
      return renderPublicProfilePage(userId);
    }

    // User authenticated routing
    if (!user) return renderLoginPage();

    if (route.path === "/dashboard") return renderUserDashboard();
    if (route.path === "/career-paths") return renderCareerPathsPage();
    
    if (route.path.startsWith("/career-paths/")) {
      const pathId = route.path.split("/").pop();
      return renderCareerPathDetailPage(pathId);
    }

    if (route.path === "/jobs") return renderJobsPage();
    if (route.path.startsWith("/jobs/")) {
      const jobId = route.path.split("/").pop();
      return renderJobDetailPage(jobId);
    }

    if (route.path.startsWith("/modules/")) {
      const parts = route.path.split("/");
      const moduleId = parts[2];
      const subRoute = parts[3];
      if (subRoute === "assessment") {
        return renderAssessmentPage(moduleId);
      }
      if (subRoute === "result") {
        return renderResultPage(moduleId);
      }
      return renderModuleDetailPage(moduleId);
    }

    if (route.path === "/certificates") return renderCertificatesPage();
    if (route.path === "/applications") return renderApplicationsPage();
    if (route.path === "/profile") return renderProfilePage();

    // Catch all basic routing and display placeholder
    return renderUserLayout(
      route.path.replace("/", ""),
      <div className="panel">
        <h2>{route.path} Page</h2>
        <p className="muted">This page is currently under construction. Full features will be activated soon.</p>
        <button className="button-outline" onClick={handleLogout} style={{ marginTop: "16px" }}>Logout</button>
        <button className="button-danger" onClick={handleResetData} style={{ marginLeft: "12px", marginTop: "16px" }}>Reset System</button>
      </div>
    );
  };

  return (
    <>
      <div id="transition-overlay"></div>
      {renderRoute()}
    </>
  );
}
