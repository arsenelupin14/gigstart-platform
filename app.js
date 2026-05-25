const DB_KEY = "gigstart_db_v3";
const SESSION_KEY = "gigstart_current_user_v3";
const TODAY = "2026-05-04";

const app = document.querySelector("#app");
let flash = null;
let activeToastTimer = null;
let appDb = null;

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
      portfolioLinks: {
        linkedin: "",
        github: "",
        portfolio: "",
        figma: "",
        kaggle: "",
        other: "",
      },
      privacy: {
        profileVisibility: "PRIVATE",
        showCertificates: false,
        showScores: false,
        showVerifiedSkills: false,
        showSelfDeclaredSkills: false,
      },
      notifications: {
        jobUnlocked: true,
        certificateIssued: true,
        applicationUpdated: true,
        moduleReminder: false,
      },
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
      portfolioLinks: {
        linkedin: "https://linkedin.com/in/ikbarfaiz",
        github: "https://github.com/ikbarfaiz",
        portfolio: "",
        figma: "",
        kaggle: "",
        other: "",
      },
      privacy: {
        profileVisibility: "PUBLIC",
        showCertificates: true,
        showScores: true,
        showVerifiedSkills: true,
        showSelfDeclaredSkills: true,
      },
      notifications: {
        jobUnlocked: true,
        certificateIssued: true,
        applicationUpdated: true,
        moduleReminder: false,
      },
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
      moduleIds: [],
      relatedJobIds: [],
      status: "PLANNED",
    },
    {
      id: "path_ux",
      code: "UX",
      name: "UI/UX Designer Intern Readiness",
      level: "Beginner",
      description: "Prepare users for basic research, wireframing, user flow, and Figma tasks.",
      passingGrade: 70,
      moduleIds: [],
      relatedJobIds: [],
      status: "PLANNED",
    },
  ],
  modules: [
    {
      id: "mod_sql",
      careerPathId: "path_da",
      title: "SQL Basic",
      description: "Learn basic SQL query structure for data analysis.",
      material:
        "SQL is used to retrieve and manage data from relational databases. A basic query can use SELECT, FROM, WHERE, and ORDER BY.",
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
      material:
        "Data cleaning checks duplicates, missing values, inconsistent formats, and values that are not ready for analysis.",
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
      material:
        "A dashboard should be interpreted by comparing metrics, identifying movement, and translating findings into actions.",
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
      material:
        "Final assessment validates whether a user can connect data preparation, SQL query, dashboard interpretation, and recommendation.",
      passingGrade: 75,
      order: 4,
      moduleType: "Mini Case Study",
      assessmentId: "assess_final",
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
  ],
  questions: [
    {
      id: "q_sql_001",
      assessmentId: "assess_sql",
      type: "MULTIPLE_CHOICE",
      question: "Which SQL clause is used to filter rows?",
      options: ["SELECT", "WHERE", "GROUP BY", "ORDER BY"],
      correctAnswer: "WHERE",
      maxScore: 20,
      order: 1,
    },
    {
      id: "q_sql_002",
      assessmentId: "assess_sql",
      type: "MULTIPLE_CHOICE",
      question: "Which SQL keyword is used to sort data?",
      options: ["WHERE", "JOIN", "ORDER BY", "LIMIT"],
      correctAnswer: "ORDER BY",
      maxScore: 20,
      order: 2,
    },
    {
      id: "q_sql_003",
      assessmentId: "assess_sql",
      type: "CODE_ANSWER",
      question: "Write an SQL query to select name and score from applicants where score is greater than or equal to 75.",
      maxScore: 90,
      rubricId: "rubric_sql_basic",
      order: 3,
    },
    {
      id: "q_clean_001",
      assessmentId: "assess_cleaning",
      type: "TEXT_AREA",
      question:
        "A dataset contains duplicate rows, missing values, and inconsistent date formats. Explain three cleaning steps you would do before analysis.",
      maxScore: 100,
      rubricId: "rubric_cleaning_basic",
      order: 1,
    },
    {
      id: "q_dash_001",
      assessmentId: "assess_dashboard",
      type: "TEXT_AREA",
      question:
        "A sales dashboard shows revenue increased by 20%, but customer complaints increased by 35%. Write a short insight and one business recommendation.",
      maxScore: 100,
      rubricId: "rubric_dashboard_interpretation",
      order: 1,
    },
    {
      id: "q_final_001",
      assessmentId: "assess_final",
      type: "TEXT_AREA",
      question:
        "A company wants to identify high-performing applicants from a dataset. Write what data you need, how you would clean it, one SQL query example, one dashboard insight, and one recommendation.",
      maxScore: 100,
      rubricId: "rubric_final_assessment",
      order: 1,
    },
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
  ],
  progress: [],
  submissions: [],
  certificates: [],
  jobs: [
    {
      id: "job_da_001",
      title: "Data Analyst Intern",
      company: "PT Example Digital",
      location: "Jakarta",
      workType: "Hybrid",
      employmentType: "Internship",
      description: "Analyze data, create reports, and support dashboard development.",
      requiredModuleIds: ["mod_sql", "mod_cleaning"],
      minimumScore: 75,
      status: "OPEN",
    },
    {
      id: "job_bi_001",
      title: "BI Intern",
      company: "DataWorks",
      location: "Remote",
      workType: "Remote",
      employmentType: "Internship",
      description: "Assist BI team by interpreting dashboards and preparing business reports.",
      requiredModuleIds: ["mod_sql", "mod_dashboard"],
      minimumScore: 75,
      status: "OPEN",
    },
    {
      id: "job_report_001",
      title: "Reporting Intern",
      company: "Insight Labs",
      location: "Bandung",
      workType: "Onsite",
      employmentType: "Internship",
      description: "Create weekly reporting summaries from cleaned business datasets.",
      requiredModuleIds: ["mod_sql", "mod_cleaning", "mod_dashboard"],
      minimumScore: 75,
      status: "OPEN",
    },
  ],
  applications: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultUserProfile(user) {
  return {
    avatarUrl: "",
    phone: "",
    location: user.location || "",
    education: "",
    institution: "",
    headline: user.role === "ADMIN" ? "GigStart Platform Administrator" : `Aspiring ${user.targetRole || "Job Seeker"}`,
    bio: "",
    preferredWorkTypes: [],
    preferredEmploymentTypes: [],
    preferredLocations: [],
    experienceLevel: "Beginner",
    selfDeclaredSkills: [],
    portfolioLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      figma: "",
      kaggle: "",
      other: "",
    },
    privacy: {
      profileVisibility: user.role === "ADMIN" ? "PRIVATE" : "PUBLIC",
      showCertificates: user.role !== "ADMIN",
      showScores: user.role !== "ADMIN",
      showVerifiedSkills: user.role !== "ADMIN",
      showSelfDeclaredSkills: user.role !== "ADMIN",
    },
    notifications: {
      jobUnlocked: true,
      certificateIssued: true,
      applicationUpdated: true,
      moduleReminder: false,
    },
    updatedAt: user.createdAt || TODAY,
  };
}

function normalizeUser(user) {
  const defaults = defaultUserProfile(user);
  return {
    ...defaults,
    ...user,
    interest: Array.isArray(user.interest) ? user.interest : String(user.interest || "").split(",").map((item) => item.trim()).filter(Boolean),
    preferredWorkTypes: Array.isArray(user.preferredWorkTypes) ? user.preferredWorkTypes : defaults.preferredWorkTypes,
    preferredEmploymentTypes: Array.isArray(user.preferredEmploymentTypes) ? user.preferredEmploymentTypes : defaults.preferredEmploymentTypes,
    preferredLocations: Array.isArray(user.preferredLocations) ? user.preferredLocations : defaults.preferredLocations,
    selfDeclaredSkills: Array.isArray(user.selfDeclaredSkills) ? user.selfDeclaredSkills : defaults.selfDeclaredSkills,
    portfolioLinks: { ...defaults.portfolioLinks, ...(user.portfolioLinks || {}) },
    privacy: { ...defaults.privacy, ...(user.privacy || {}) },
    notifications: { ...defaults.notifications, ...(user.notifications || {}) },
  };
}

function normalizeDb(db) {
  let changed = false;
  db.users = db.users.map((user) => {
    const normalized = normalizeUser(user);
    if (JSON.stringify(normalized) !== JSON.stringify(user)) changed = true;
    return normalized;
  });
  db.certificates = db.certificates.map((certificate) => {
    if (certificate.issuedName) return certificate;
    const user = db.users.find((item) => item.id === certificate.userId);
    changed = true;
    return { ...certificate, issuedName: user?.name || "Unknown User" };
  });
  if (changed) saveDb(db);
  return db;
}

function loadDb() {
  if (!appDb) {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      appDb = JSON.parse(raw);
    } else {
      appDb = clone(seedData);
    }
  }
  return normalizeDb(clone(appDb));
}

function saveDb(db) {
  appDb = clone(db);
  // Optional local backup
  localStorage.setItem(DB_KEY, JSON.stringify(appDb));
  // Send asynchronously to backend
  fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appDb)
  }).catch(err => console.error("Failed to save to backend:", err));
}

function resetDb() {
  appDb = clone(seedData);
  localStorage.setItem(DB_KEY, JSON.stringify(appDb));
  fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appDb)
  }).then(() => {
    localStorage.removeItem(SESSION_KEY);
    flash = { type: "success", text: "Database berhasil di-reset ke data awal." };
    go("/");
  }).catch(err => {
    console.error("Failed to reset backend:", err);
    localStorage.removeItem(SESSION_KEY);
    flash = { type: "success", text: "Database local berhasil di-reset (backend offline)." };
    go("/");
  });
}

function getCurrentUser(db = loadDb()) {
  const userId = localStorage.getItem(SESSION_KEY);
  return db.users.find((user) => user.id === userId) || null;
}

function setCurrentUser(userId) {
  localStorage.setItem(SESSION_KEY, userId);
}

function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name) {
  const parts = String(name || "GigStart")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : (parts[0] || "GS").slice(0, 2);
  return letters.toUpperCase();
}

function renderAvatar(user, className = "avatar") {
  const label = escapeHtml(initials(user?.name));
  if (user?.avatarUrl) {
    return `<span class="${className}"><img src="${escapeHtml(user.avatarUrl)}" alt="${escapeHtml(user.name)} avatar" /></span>`;
  }
  return `<span class="${className}" aria-label="${escapeHtml(user?.name || "GigStart user")} initials">${label}</span>`;
}

function renderUserCell(user, subtitle = "") {
  return `
    <span class="user-cell">
      ${renderAvatar(user, "table-avatar")}
      <span>
        <strong>${escapeHtml(user.name)}</strong>
        <small>${escapeHtml(subtitle || user.headline || user.targetRole || user.email)}</small>
      </span>
    </span>
  `;
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function compactDate(value = new Date()) {
  return value.toISOString().slice(0, 10);
}

function routePath() {
  return location.hash.slice(1) || "/";
}

function currentRoute() {
  const [path, query = ""] = routePath().split("?");
  return { path, query };
}

function segments() {
  return currentRoute().path.replace(/^\/+/, "").split("/").filter(Boolean);
}

function go(path) {
  location.hash = path;
}

function statusClass(status) {
  const value = String(status).toUpperCase();
  if (["PASSED", "VALID", "ELIGIBLE", "APPLIED", "REVIEWED", "ACCEPTED", "ACTIVE", "OPEN"].includes(value)) return "success";
  if (["ALMOST_ELIGIBLE", "IN_PROGRESS", "AVAILABLE", "PLANNED"].includes(value)) return "warning";
  if (["FAILED", "REJECTED", "BLOCKED"].includes(value)) return "error";
  return "muted";
}

function badge(status, label = status) {
  return `<span class="status-badge ${statusClass(status)}">${escapeHtml(label)}</span>`;
}

function flashHtml() {
  if (!flash) return "";
  const html = `
    <div class="toast-container" role="status" aria-live="polite" data-created-at="${Date.now()}">
      <div class="toast ${flash.type || ""}">
        <span>${escapeHtml(flash.text)}</span>
        <button type="button" data-action="dismiss-flash" aria-label="Close notification">×</button>
      </div>
    </div>
  `;
  flash = null;
  return html;
}

function getPath(db, id) {
  return db.careerPaths.find((path) => path.id === id);
}

function getModule(db, id) {
  return db.modules.find((module) => module.id === id);
}

function getAssessment(db, id) {
  return db.assessments.find((assessment) => assessment.id === id);
}

function getQuestion(db, id) {
  return db.questions.find((question) => question.id === id);
}

function getRubric(db, id) {
  return db.rubrics.find((rubric) => rubric.id === id);
}

function getUserProgress(db, userId, moduleId) {
  return db.progress.find((item) => item.userId === userId && item.moduleId === moduleId);
}

function getPathModules(db, pathId) {
  return db.modules
    .filter((module) => module.careerPathId === pathId)
    .sort((a, b) => a.order - b.order);
}

function getPassedModuleIds(db, userId) {
  return db.progress
    .filter((item) => item.userId === userId && item.status === "PASSED")
    .map((item) => item.moduleId);
}

function moduleRuntimeStatus(db, user, module) {
  const progress = getUserProgress(db, user.id, module.id);
  if (progress) return progress.status;

  const pathModules = getPathModules(db, module.careerPathId);
  const index = pathModules.findIndex((item) => item.id === module.id);
  if (index <= 0) return "AVAILABLE";

  const previous = pathModules[index - 1];
  const previousProgress = getUserProgress(db, user.id, previous.id);
  return previousProgress?.status === "PASSED" ? "AVAILABLE" : "LOCKED";
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

  const rubric = getRubric(db, question.rubricId);
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
      const question = getQuestion(db, questionId);
      return scoreQuestion(db, question, answers[questionId] || "");
    }),
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

function upsertProgress(db, userId, moduleId, score, status, submissionId) {
  const current = getUserProgress(db, userId, moduleId);
  if (current) {
    current.score = score;
    current.status = status;
    current.submissionId = submissionId;
    current.submittedAt = TODAY;
    current.completedAt = status === "PASSED" ? TODAY : null;
    return current;
  }
  const progress = {
    id: makeId("progress"),
    userId,
    moduleId,
    score,
    status,
    submissionId,
    submittedAt: TODAY,
    completedAt: status === "PASSED" ? TODAY : null,
  };
  db.progress.push(progress);
  return progress;
}

function nextCertificateId(db, pathId) {
  const path = getPath(db, pathId);
  const sequence = String(db.certificates.length + 1).padStart(4, "0");
  return `GIG-${path?.code || "GS"}-2026-${sequence}`;
}

function createCertificateIfPassed(db, user, module, score) {
  if (score < module.passingGrade) return null;
  const existing = db.certificates.find((cert) => cert.userId === user.id && cert.moduleId === module.id && cert.type === "MODULE");
  if (existing) return existing;
  const certificate = {
    id: makeId("cert"),
    certificateId: nextCertificateId(db, module.careerPathId),
    issuedName: user.name,
    userId: user.id,
    moduleId: module.id,
    careerPathId: module.careerPathId,
    type: "MODULE",
    title: `${module.title} Certificate`,
    score,
    status: "VALID",
    issuedAt: TODAY,
  };
  db.certificates.push(certificate);
  createPathCertificateIfComplete(db, user, module.careerPathId);
  return certificate;
}

function createPathCertificateIfComplete(db, user, pathId) {
  const pathModules = getPathModules(db, pathId);
  if (!pathModules.length) return null;
  const allPassed = pathModules.every((module) => getUserProgress(db, user.id, module.id)?.status === "PASSED");
  if (!allPassed) return null;
  const existing = db.certificates.find((cert) => cert.userId === user.id && cert.careerPathId === pathId && cert.type === "PATH");
  if (existing) return existing;
  const scores = pathModules.map((module) => getUserProgress(db, user.id, module.id)?.score || 0);
  const average = Math.round((scores.reduce((total, score) => total + score, 0) / scores.length) * 10) / 10;
  const path = getPath(db, pathId);
  const certificate = {
    id: makeId("cert"),
    certificateId: nextCertificateId(db, pathId),
    issuedName: user.name,
    userId: user.id,
    moduleId: null,
    careerPathId: pathId,
    type: "PATH",
    title: `${path.name} Certificate of Eligibility`,
    score: average,
    status: "VALID",
    issuedAt: TODAY,
  };
  db.certificates.push(certificate);
  return certificate;
}

function submitAssessment(db, user, moduleId, answers) {
  const module = getModule(db, moduleId);
  const assessment = getAssessment(db, module.assessmentId);
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
  db.submissions.push(submission);
  upsertProgress(db, user.id, module.id, result.finalScore, status, submission.id);
  if (status === "PASSED") createCertificateIfPassed(db, user, module, result.finalScore);
  saveDb(db);
  return submission;
}

function checkEligibility(db, userId, job) {
  const passed = new Set(getPassedModuleIds(db, userId));
  const missing = job.requiredModuleIds.filter((moduleId) => !passed.has(moduleId));
  if (missing.length === 0) return { status: "ELIGIBLE", missing };
  if (missing.length <= 2) return { status: "ALMOST_ELIGIBLE", missing };
  return { status: "LOCKED", missing };
}

function applyJob(db, user, jobId) {
  const job = db.jobs.find((item) => item.id === jobId);
  const existing = db.applications.find((item) => item.userId === user.id && item.jobId === jobId);
  if (existing) return { ok: false, message: "User sudah apply ke job ini." };
  const eligibility = checkEligibility(db, user.id, job);
  if (eligibility.status !== "ELIGIBLE") {
    return { ok: false, message: "User belum eligible untuk apply job ini." };
  }
  db.applications.push({
    id: makeId("app"),
    userId: user.id,
    jobId,
    status: "APPLIED",
    appliedAt: TODAY,
  });
  saveDb(db);
  return { ok: true, message: "Application berhasil dibuat." };
}

const testimonialItems = [
  {
    name: "Alya Pramesti",
    role: "Data Analyst Intern",
    image: "assets/people/alya.jpg",
    quote: "GigStart membantu saya tahu skill apa yang perlu diselesaikan sebelum apply. Proses belajar jadi lebih terarah.",
  },
  {
    name: "Raka Mahendra",
    role: "Frontend Developer Intern",
    image: "assets/people/raka.jpg",
    quote: "Setelah menyelesaikan modul, saya punya bukti skill yang bisa saya tampilkan saat melamar.",
  },
  {
    name: "Nadia Putri",
    role: "UI/UX Designer Intern",
    image: "assets/people/nadia.jpg",
    quote: "Career path-nya sederhana, tapi jelas. Saya tahu harus mulai dari modul mana.",
  },
  {
    name: "Dimas Aditya",
    role: "Business Intelligence Intern",
    image: "assets/people/dimas.jpg",
    quote: "Dashboard saya jadi lebih jelas karena progress modul langsung nyambung ke job yang bisa dibuka.",
  },
  {
    name: "Sinta Maharani",
    role: "Digital Marketing Intern",
    image: "assets/people/sinta.jpg",
    quote: "Saya suka karena target role dan modulnya ringkas. Tidak terasa seperti course panjang yang muter-muter.",
  },
  {
    name: "Kevin Wijaya",
    role: "Frontend Developer Intern",
    image: "assets/people/kevin.jpg",
    quote: "Sebelum apply, saya bisa lihat skill mana yang kurang. Itu bikin proses belajar lebih realistis.",
  },
  {
    name: "Maya Lestari",
    role: "Content Writer Intern",
    image: "assets/people/maya.jpg",
    quote: "Skill passport membantu saya menjelaskan evidence kemampuan tanpa harus cuma mengandalkan CV.",
  },
  {
    name: "Bima Prakoso",
    role: "Reporting Intern",
    image: "assets/people/bima.jpg",
    quote: "Saya jadi tahu kapan sudah siap apply karena job eligibility-nya terlihat langsung.",
  },
];

const industryReferences = [
  ["Tokopedia", "assets/logos/tokopedia.svg"],
  ["Shopee Indonesia", "assets/logos/shopee.svg"],
  ["Gojek", "assets/logos/gojek.svg"],
  ["Grab", "assets/logos/grab.svg"],
  ["Google", "assets/logos/google-developers.svg"],
];

function testimonialCard(item) {
  return `
    <article class="testimonial-card">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)} avatar" />
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <small>${escapeHtml(item.role)}</small>
        <p>${escapeHtml(item.quote)}</p>
      </div>
    </article>
  `;
}

function renderTestimonialMarquee() {
  const topCards = testimonialItems.filter((_, index) => index % 2 === 0).map(testimonialCard).join("");
  const bottomCards = testimonialItems.filter((_, index) => index % 2 === 1).map(testimonialCard).join("");
  return `
    <section class="landing-section marquee-section">
      <div class="section-heading">
        <p class="eyebrow">Learner stories</p>
        <h2>Pengalaman user yang mulai lebih terarah sebelum apply.</h2>
      </div>
      <div class="testimonial-marquee" aria-label="Learner testimonials">
        <div class="marquee-track marquee-fast">
          ${topCards}
          ${topCards}
        </div>
        <div class="marquee-track marquee-slow">
          ${bottomCards}
          ${bottomCards}
        </div>
      </div>
    </section>
  `;
}

function renderIndustryReferences() {
  return `
    <section class="landing-section industry-section">
      <div class="section-heading">
        <p class="eyebrow">Career paths aligned with modern industry roles</p>
        <h2>Role references inspired by real skill expectations.</h2>
      </div>
      <div class="logo-strip">
        ${industryReferences
          .map(([label, src]) => `
            <div class="logo-chip">
              <img src="${escapeHtml(src)}" alt="${escapeHtml(label)} logo" />
              <span>${escapeHtml(label)}</span>
            </div>
          `)
          .join("")}
        <div class="logo-chip reference-count"><strong>+33</strong><span>references</span></div>
      </div>
    </section>
  `;
}

function renderFooter(extraClass = "") {
  return `
    <footer class="site-footer ${extraClass}">
      <div class="footer-grid">
        <section>
          <a class="brand" href="#/">
            <span class="brand-mark">GS</span>
            <span>Gigstart</span>
          </a>
          <p>Jobless? Look one.</p>
          <p class="muted">Platform job readiness untuk bantu user belajar lebih terarah, membuktikan skill, dan apply saat sudah eligible.</p>
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
          <a href="mailto:support@gigstart.local">support@gigstart.local</a>
          <span>+62 21 5369 6969</span>
          <span>Mon-Fri, 09.00-17.00 WIB</span>
        </section>
        <section>
          <h3>Send Letter To</h3>
          <p>GigStart Team</p>
          <p>BINUS University Kemanggisan<br />Jl. K. H. Syahdan No. 9, Kemanggisan, Palmerah, Jakarta Barat 11480</p>
        </section>
      </div>
      <div class="footer-bottom">
        <span>© 2026 GigStart</span>
        <span>Privacy · Terms · Accessibility · LinkedIn · Instagram</span>
      </div>
    </footer>
  `;
}

function scheduleToastDismiss() {
  const toast = document.querySelector(".toast-container");
  if (!toast || typeof toast.getAttribute !== "function") return;
  if (typeof window.setTimeout !== "function") return;
  if (activeToastTimer) window.clearTimeout(activeToastTimer);
  activeToastTimer = window.setTimeout(() => dismissToast(), 5000);
}

function dismissToast() {
  const toast = document.querySelector(".toast-container");
  if (!toast) return;
  toast.classList.add("is-leaving");
  window.setTimeout(() => toast.remove(), 260);
}

function togglePublicMenu(button) {
  const nav = document.querySelector(".public-nav");
  if (!nav) return;
  const isOpen = nav.classList.toggle("is-open");
  if (button) button.setAttribute("aria-expanded", String(isOpen));
}

function toggleAppMenu(button) {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle("is-open");
  document.body.classList.toggle("offcanvas-is-active", isOpen);
  if (button) button.setAttribute("aria-expanded", String(isOpen));
}

function closeAppMenu() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  sidebar.classList.remove("is-open");
  document.body.classList.remove("offcanvas-is-active");
  const btn = document.querySelector(".app-menu-toggle");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function closePublicMenu() {
  const nav = document.querySelector(".public-nav");
  const button = document.querySelector(".public-menu-toggle");
  if (!nav) return;
  nav.classList.remove("is-open");
  if (button) button.setAttribute("aria-expanded", "false");
}

function renderPublic(content) {
  app.innerHTML = `
    <header class="public-header">
      <a class="brand" href="#/">
        <span class="brand-mark">GS</span>
        <span>GigStart</span>
      </a>
      <button class="public-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" onclick="togglePublicMenu(this)">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
      </button>
      <nav class="public-nav" aria-label="Public navigation">
        <a href="#/" onclick="closePublicMenu()">Home</a>
        <a href="#/login" onclick="closePublicMenu()">Login</a>
        <a href="#/register" onclick="closePublicMenu()">Register</a>
      </nav>
    </header>
    <main class="public-main">${content}</main>
    ${renderFooter()}
  `;
  scheduleToastDismiss();
}

function renderLanding() {
  renderPublic(`
    <section class="landing-hero">
      <div class="landing-copy">
        <p class="eyebrow">Job readiness for early careers</p>
        <h1>Mulai kariermu dengan skill yang terbukti.</h1>
        <p>
          Pilih career path, selesaikan modul praktis, dapatkan sertifikat, lalu lamar pekerjaan
          yang sesuai dengan kemampuanmu.
        </p>
        ${flashHtml()}
        <div class="hero-actions">
          <a class="button" href="#/register">Create Account</a>
          <a class="button-outline" href="#/login">Login</a>
        </div>
      </div>

      <aside class="system-preview learner-rating-card">
        <p class="eyebrow">Learner rating</p>
        <strong>4.8/5</strong>
        <span>Based on early user feedback</span>
        <div class="stars" aria-label="4.8 out of 5 stars">★★★★★</div>
      </aside>
    </section>

    <section class="landing-section">
      <p class="eyebrow">How it helps</p>
      <h2>GigStart menghadirkan alur persiapan karier yang lebih terarah.</h2>
      <div class="landing-narrative">
        <p>
          Platform ini membantu pengguna memilih career path yang sesuai dengan minat dan target role,
          lalu membangun kemampuan melalui modul praktis, assessment terstruktur, dan sertifikat yang
          terhubung langsung dengan kesiapan melamar pekerjaan. Dengan pendekatan ini, proses belajar
          tidak berhenti di materi saja, tetapi berlanjut menjadi progres yang dapat dilihat,
          diverifikasi, dan digunakan untuk membuka akses ke peluang kerja yang relevan.
        </p>
        <p>
          GigStart dirancang untuk membuat perjalanan dari belajar hingga apply terasa lebih jelas,
          lebih fokus, dan lebih siap menghadapi kebutuhan industri modern.
        </p>
      </div>
    </section>
    ${renderTestimonialMarquee()}
    ${renderIndustryReferences()}
  `);
}

function renderLogin() {
  renderPublic(`
    <section class="auth-page auth-marketing-page">
      <div class="auth-copy auth-marketing">
        <p class="eyebrow">GigStart</p>
        <h1>Mulai kariermu dengan skill yang terbukti.</h1>
        <p>
          GigStart membantu kamu memilih career path, menyelesaikan modul praktis,
          mendapatkan sertifikat, dan membuka akses ke pekerjaan yang sesuai dengan kemampuanmu.
        </p>
        <p class="muted">Dirancang untuk mahasiswa, fresh graduate, dan pencari internship yang ingin belajar lebih terarah sebelum melamar kerja.</p>

        <div class="rating-strip">
          <span class="stars" aria-label="4.8 out of 5 stars">★★★★★</span>
          <strong>4.8/5 learner rating</strong>
          <small>Based on early user feedback</small>
        </div>

      </div>
      <form class="form-card form-grid" id="loginForm">
        <h2>Welcome back</h2>
        ${flashHtml()}
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Your password" required />
        </div>
        <button class="button" type="submit">Login</button>
        <a class="button-ghost" href="#/register">Don't have an account? Create account</a>
      </form>
    </section>
  `);
}

function renderRegister() {
  renderPublic(`
    <section class="auth-page auth-marketing-page">
      <div class="auth-copy">
        <p class="eyebrow">Register</p>
        <h1>Buat akun dan mulai career path pertamamu.</h1>
        <p>Isi profil singkatmu, pilih target role, lalu mulai modul yang sesuai dengan pekerjaan yang kamu incar.</p>
      </div>
      <form class="form-card form-grid" id="registerForm">
        <h2>Create your GigStart account</h2>
        ${flashHtml()}
        <div class="field">
          <label for="name">Full Name</label>
          <input id="name" name="name" placeholder="Nama lengkap" required />
        </div>
        <div class="field">
          <label for="registerEmail">Email</label>
          <input id="registerEmail" name="email" type="email" placeholder="you@gigstart.local" required />
        </div>
        <div class="field">
          <label for="registerPassword">Password</label>
          <input id="registerPassword" name="password" type="password" required />
        </div>
        <div class="field">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required />
        </div>
        <div class="field">
          <label for="interest">Interest</label>
          <input id="interest" name="interest" placeholder="Data, Analytics" />
        </div>
        <div class="field">
          <label for="targetRole">Target Role</label>
          <select id="targetRole" name="targetRole">
            <option>Data Analyst Intern</option>
            <option>Frontend Developer Intern</option>
            <option>UI/UX Designer Intern</option>
            <option>Digital Marketing Intern</option>
            <option>Content Writer Intern</option>
          </select>
        </div>
        <div class="field">
          <label for="location">Location</label>
          <input id="location" name="location" placeholder="Jakarta" />
        </div>
        <button class="button" type="submit">Create Account</button>
        <a class="button-ghost" href="#/login">Already have an account? Login</a>
      </form>
    </section>
  `);
}

function userNav(activePath) {
  const links = [
    ["/dashboard", "Dashboard"],
    ["/career-paths", "Career Paths"],
    ["/modules/mod_sql", "Modules"],
    ["/jobs", "Jobs"],
    ["/certificates", "Certificates"],
    ["/applications", "Applications"],
    ["/profile", "Profile"],
  ];
  return links
    .map(([href, label]) => `<a class="sidebar-link ${isUserNavActive(activePath, href) ? "active" : ""}" href="#${href}">${label}</a>`)
    .join("");
}

function isUserNavActive(activePath, href) {
  const path = activePath.split("?")[0];
  if (href === "/profile") return path === href;
  if (href === "/modules/mod_sql") return path.startsWith("/modules");
  if (href === "/career-paths") return path.startsWith("/career-paths");
  if (href === "/jobs") return path.startsWith("/jobs");
  return path === href;
}

function renderUserLayout(title, subtitle, content) {
  const db = loadDb();
  const user = getCurrentUser(db);
  const activePath = routePath();
  app.innerHTML = `
    <div class="app-shell">
      <div class="offcanvas-overlay" id="offcanvas-overlay" onclick="closeAppMenu()"></div>
      <aside class="sidebar">
        <a class="brand" href="#/dashboard">
          <span class="brand-mark">GS</span>
          <span>GigStart</span>
        </a>
        <nav class="sidebar-nav" aria-label="User navigation">${userNav(activePath)}</nav>
        <a class="sidebar-profile ${activePath.split("?")[0] === "/profile" ? "active" : ""}" href="#/profile" aria-label="Open profile">
          ${renderAvatar(user, "sidebar-avatar")}
          <span>
            <strong>${escapeHtml(user.name)}</strong>
            <small>${escapeHtml(user.headline || user.targetRole || "GigStart learner")}</small>
          </span>
        </a>
      </aside>
      <main class="app-main">
        <header class="app-topbar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="app-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" onclick="toggleAppMenu(this)">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
            </button>
            <div class="topbar-title">
              <strong>${escapeHtml(title)}</strong>
              <span>${escapeHtml(subtitle)}</span>
            </div>
          </div>
          <div class="topbar-actions">
            <button class="button-outline" type="button" data-action="reset-data">Reset Data</button>
            <button class="button-danger" type="button" data-action="logout">Logout</button>
          </div>
        </header>
        <section class="page">
          ${flashHtml()}
          ${content}
        </section>
        ${renderFooter("app-footer")}
      </main>
    </div>
  `;
  scheduleToastDismiss();
}

function adminNav(activePath) {
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
  return links
    .map(([href, label]) => `<a class="sidebar-link ${activePath === href ? "active" : ""}" href="#${href}">${label}</a>`)
    .join("");
}

function renderAdminLayout(title, subtitle, content) {
  const activePath = routePath();
  app.innerHTML = `
    <div class="app-shell">
      <div class="offcanvas-overlay" id="offcanvas-overlay" onclick="closeAppMenu()"></div>
      <aside class="sidebar">
        <a class="brand" href="#/admin">
          <span class="brand-mark">GS</span>
          <span>GigStart Admin</span>
        </a>
        <nav class="sidebar-nav" aria-label="Admin navigation">${adminNav(activePath)}</nav>
        <div class="sidebar-profile">
          ${renderAvatar({ name: "GigStart Admin", avatarUrl: "" }, "sidebar-avatar")}
          <span>
            <strong>GigStart Admin</strong>
            <small>Administrator</small>
          </span>
        </div>
      </aside>
      <main class="app-main">
        <header class="app-topbar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="app-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" onclick="toggleAppMenu(this)">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
            </button>
            <div class="topbar-title">
              <strong>${escapeHtml(title)}</strong>
              <span>${escapeHtml(subtitle)}</span>
            </div>
          </div>
          <div class="topbar-actions">
            <button class="button-outline" type="button" data-action="reset-data">Reset Data</button>
            <button class="button-danger" type="button" data-action="logout">Logout</button>
          </div>
        </header>
        <section class="page">
          ${flashHtml()}
          ${content}
        </section>
        ${renderFooter("app-footer")}
      </main>
    </div>
  `;
  scheduleToastDismiss();
}

function renderDashboard() {
  const db = loadDb();
  const user = getCurrentUser(db);
  const path = getPath(db, user.activeCareerPathId);
  if (!path) {
    renderUserLayout(
      "Dashboard",
      "Choose a career path first",
      `<div class="empty-state">
        <h3>Belum ada active career path.</h3>
        <p>Pilih career path dulu agar modul, certificate, dan job eligibility bisa dihitung.</p>
        <a class="button" href="#/career-paths">Open Career Paths</a>
      </div>`,
    );
    return;
  }

  const modules = getPathModules(db, path.id);
  const passed = modules.filter((module) => getUserProgress(db, user.id, module.id)?.status === "PASSED");
  const certificates = db.certificates.filter((cert) => cert.userId === user.id);
  const applications = db.applications.filter((application) => application.userId === user.id);
  const unlockedJobs = db.jobs.filter((job) => checkEligibility(db, user.id, job).status === "ELIGIBLE");
  const scores = passed.map((module) => getUserProgress(db, user.id, module.id).score);
  const averageScore = scores.length ? Math.round((scores.reduce((total, score) => total + score, 0) / scores.length) * 10) / 10 : "-";
  const nextModule = modules.find((module) => moduleRuntimeStatus(db, user, module) !== "PASSED");
  const progressPercent = Math.round((passed.length / modules.length) * 100);

  renderUserLayout(
    "Dashboard",
    "Current path, next module, certificate, and job readiness",
    `
      <div class="grid-2">
        <section class="panel important">
          <div class="panel-title">
            <div>
              <p class="eyebrow">Current career path</p>
              <h2>${escapeHtml(path.name)}</h2>
              <p class="muted">${escapeHtml(path.description)}</p>
            </div>
            ${badge(path.status)}
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${progressPercent}%"></div></div>
          <strong>${passed.length}/${modules.length} modules completed</strong>
          <div class="metric-grid">
            <div class="metric"><span>Average Score</span><strong>${averageScore}</strong></div>
            <div class="metric"><span>Next Module</span><strong>${nextModule ? escapeHtml(nextModule.title) : "Done"}</strong></div>
            <div class="metric"><span>Unlocked Jobs</span><strong>${unlockedJobs.length}</strong></div>
            <div class="metric"><span>Certificates</span><strong>${certificates.length}</strong></div>
          </div>
        </section>
        <section class="panel">
          <p class="eyebrow">Next action</p>
          ${
            nextModule
              ? `<h3>${escapeHtml(nextModule.title)}</h3>
                 <p class="muted">${escapeHtml(nextModule.description)}</p>
                 <a class="button" href="#/modules/${nextModule.id}">Open Module</a>`
              : `<h3>Career path complete</h3>
                 <p class="muted">Semua modul sudah passed. Path certificate tersedia jika belum didownload.</p>
                 <a class="button" href="#/jobs">Open Eligible Jobs</a>`
          }
        </section>
      </div>
      <section class="panel" style="margin-top:18px;">
        <p class="eyebrow">Module progress</p>
        ${renderModuleTable(db, user, modules)}
      </section>
      <section class="panel" style="margin-top:18px;">
        <p class="eyebrow">Recent applications</p>
        ${renderApplicationTable(db, applications)}
      </section>
    `,
  );
}

function renderModuleTable(db, user, modules) {
  const rows = modules
    .map((module) => {
      const progress = getUserProgress(db, user.id, module.id);
      const runtimeStatus = progress?.status || moduleRuntimeStatus(db, user, module);
      return `
        <tr>
          <td><strong>${escapeHtml(module.title)}</strong><br /><span class="muted">${escapeHtml(module.moduleType)}</span></td>
          <td>${module.passingGrade}</td>
          <td>${progress?.score ?? "-"}</td>
          <td>${badge(runtimeStatus)}</td>
          <td><a class="row-button" href="#/modules/${module.id}">${runtimeStatus === "LOCKED" ? "View" : "Open"}</a></td>
        </tr>
      `;
    })
    .join("");
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Module</th><th>Passing Grade</th><th>Score</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderCareerPaths() {
  const db = loadDb();
  const user = getCurrentUser(db);
  const rows = db.careerPaths
    .map((path) => `
      <tr>
        <td><strong>${escapeHtml(path.name)}</strong><br /><span class="muted">${escapeHtml(path.description)}</span></td>
        <td>${escapeHtml(path.level)}</td>
        <td>${path.moduleIds.length}</td>
        <td>${path.passingGrade}</td>
        <td>${badge(path.status)}</td>
        <td><a class="row-button" href="#/career-paths/${path.id}">View</a></td>
      </tr>
    `)
    .join("");

  renderUserLayout(
    "Career Paths",
    "Choose a structured path before taking modules",
    `
      <section class="panel">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Career Path</th><th>Level</th><th>Modules</th><th>Passing Grade</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
      <section class="panel" style="margin-top:18px;">
        <p class="eyebrow">Active path</p>
        <h3>${user.activeCareerPathId ? escapeHtml(getPath(db, user.activeCareerPathId).name) : "No active path"}</h3>
      </section>
    `,
  );
}

function renderCareerPathDetail(pathId) {
  const db = loadDb();
  const user = getCurrentUser(db);
  const path = getPath(db, pathId);
  if (!path) return renderNotFound("Career path tidak ditemukan.");
  const modules = getPathModules(db, path.id);
  const relatedJobs = db.jobs.filter((job) => path.relatedJobIds.includes(job.id));

  renderUserLayout(
    path.name,
    "Career path detail and enrollment",
    `
      <div class="grid-2">
        <section class="panel important">
          <p class="eyebrow">Path detail</p>
          <h2>${escapeHtml(path.name)}</h2>
          <p class="muted">${escapeHtml(path.description)}</p>
          <ul class="detail-list">
            <li><span>Level</span><strong>${escapeHtml(path.level)}</strong></li>
            <li><span>Passing Grade</span><strong>${path.passingGrade}</strong></li>
            <li><span>Modules</span><strong>${modules.length}</strong></li>
            <li><span>Status</span><strong>${path.status}</strong></li>
          </ul>
          <div class="toolbar" style="margin-top:16px;">
            <button class="button" type="button" data-action="enroll-path" data-path-id="${path.id}">${user.activeCareerPathId === path.id ? "Active Path" : "Enroll Path"}</button>
            <a class="button-outline" href="#/dashboard">Back to Dashboard</a>
          </div>
        </section>
        <section class="panel">
          <p class="eyebrow">Related jobs</p>
          ${relatedJobs.length ? renderJobMiniList(db, user, relatedJobs) : `<div class="empty-state">Related jobs belum tersedia.</div>`}
        </section>
      </div>
      <section class="panel" style="margin-top:18px;">
        <p class="eyebrow">Required modules</p>
        ${modules.length ? renderModuleTable(db, user, modules) : `<div class="empty-state">Module untuk path ini masih planned.</div>`}
      </section>
    `,
  );
}

function renderModuleDetail(moduleId) {
  const db = loadDb();
  const user = getCurrentUser(db);
  const module = getModule(db, moduleId);
  if (!module) return renderNotFound("Module tidak ditemukan.");
  const path = getPath(db, module.careerPathId);
  const progress = getUserProgress(db, user.id, module.id);
  const runtimeStatus = progress?.status || moduleRuntimeStatus(db, user, module);
  const locked = runtimeStatus === "LOCKED";

  renderUserLayout(
    module.title,
    "Module detail, material, and assessment entry",
    `
      <div class="grid-2">
        <section class="panel important">
          <p class="eyebrow">Module detail</p>
          <h2>${escapeHtml(module.title)}</h2>
          <p class="muted">${escapeHtml(module.description)}</p>
          <ul class="detail-list">
            <li><span>Career Path</span><strong>${escapeHtml(path.name)}</strong></li>
            <li><span>Assessment Type</span><strong>${escapeHtml(module.moduleType)}</strong></li>
            <li><span>Passing Grade</span><strong>${module.passingGrade}</strong></li>
            <li><span>Status</span><strong>${badge(runtimeStatus)}</strong></li>
            <li><span>Last Score</span><strong>${progress?.score ?? "-"}</strong></li>
          </ul>
          <div class="toolbar" style="margin-top:16px;">
            <a class="button ${locked ? "disabled" : ""}" ${locked ? 'aria-disabled="true"' : `href="#/modules/${module.id}/assessment"`}>Start Assessment</a>
            ${progress ? `<a class="button-outline" href="#/modules/${module.id}/result">View Result</a>` : ""}
          </div>
        </section>
        <section class="panel">
          <p class="eyebrow">Learning material</p>
          <p>${escapeHtml(module.material)}</p>
          ${
            module.id === "mod_sql"
              ? `<pre class="code-box">SELECT name, score
FROM applicants
WHERE score >= 75;</pre>`
              : ""
          }
        </section>
      </div>
      ${locked ? `<div class="message" style="margin-top:18px;">Module ini masih locked. Selesaikan module sebelumnya terlebih dahulu.</div>` : ""}
    `,
  );
}

function renderAssessment(moduleId) {
  const db = loadDb();
  const user = getCurrentUser(db);
  const module = getModule(db, moduleId);
  if (!module) return renderNotFound("Module tidak ditemukan.");
  const runtimeStatus = moduleRuntimeStatus(db, user, module);
  if (runtimeStatus === "LOCKED") {
    flash = { type: "error", text: "Assessment masih locked. Selesaikan module sebelumnya dulu." };
    go(`/modules/${module.id}`);
    return;
  }
  const assessment = getAssessment(db, module.assessmentId);
  const questions = assessment.components.flatMap((component) => component.questionIds.map((id) => getQuestion(db, id)));

  const questionHtml = questions
    .map((question) => `
      <article class="question-card">
        <div>
          <p class="eyebrow">${escapeHtml(question.type)} - Max ${question.maxScore}</p>
          <h3>${escapeHtml(question.question)}</h3>
        </div>
        ${renderAnswerInput(question)}
      </article>
    `)
    .join("");

  renderUserLayout(
    assessment.title,
    "Submit real answer and let local rubric scoring calculate the result",
    `
      <form id="assessmentForm" data-module-id="${module.id}">
        <section class="panel important">
          <div class="panel-title">
            <div>
              <p class="eyebrow">Local scoring only</p>
              <h2>${escapeHtml(module.title)}</h2>
              <p class="muted">Tidak pakai dummy score dan tidak pakai AI scoring. Nilai dihitung dari answer key, keyword, regex, length, dan rubric criteria.</p>
            </div>
            ${badge("AVAILABLE", "ASSESSMENT")}
          </div>
          ${questionHtml}
          <button class="button" type="submit">Submit Assessment</button>
        </section>
      </form>
    `,
  );
}

function renderAnswerInput(question) {
  if (question.type === "MULTIPLE_CHOICE") {
    return `
      <ul class="option-list">
        ${question.options
          .map((option) => `
            <li>
              <label>
                <input type="radio" name="${question.id}" value="${escapeHtml(option)}" required />
                <span>${escapeHtml(option)}</span>
              </label>
            </li>
          `)
          .join("")}
      </ul>
    `;
  }
  if (question.type === "CODE_ANSWER") {
    return `
      <div class="field">
        <label for="${question.id}">Your SQL answer</label>
        <textarea id="${question.id}" name="${question.id}" spellcheck="false" placeholder="Write your SQL query here..." required></textarea>
      </div>
    `;
  }
  return `
    <div class="field">
      <label for="${question.id}">Your answer</label>
      <textarea id="${question.id}" name="${question.id}" placeholder="Write your answer here..." required></textarea>
    </div>
  `;
}

function latestSubmission(db, userId, moduleId) {
  return db.submissions
    .filter((submission) => submission.userId === userId && submission.moduleId === moduleId)
    .sort((a, b) => b.id.localeCompare(a.id))[0];
}

function renderResult(moduleId) {
  const db = loadDb();
  const user = getCurrentUser(db);
  const module = getModule(db, moduleId);
  const submission = latestSubmission(db, user.id, moduleId);
  if (!submission) {
    flash = { type: "error", text: "Belum ada submission untuk module ini." };
    go(`/modules/${moduleId}`);
    return;
  }
  const certificate = db.certificates.find((cert) => cert.userId === user.id && cert.moduleId === moduleId);

  renderUserLayout(
    `${module.title} Result`,
    "Score breakdown from local rubric matrix",
    `
      <div class="grid-2">
        <section class="result-panel">
          <p class="eyebrow">Final score</p>
          <div class="score-number">${submission.finalScore}</div>
          <p>Passing Grade: <strong>${module.passingGrade}</strong></p>
          <p>Status: ${badge(submission.status)}</p>
          <p class="muted">${escapeHtml(submission.feedback)}</p>
          <div class="toolbar">
            ${certificate ? `<a class="button" href="#/certificates">View Certificate</a>` : `<a class="button-outline" href="#/modules/${module.id}/assessment">Retake Assessment</a>`}
            <a class="button-outline" href="#/jobs">View Jobs</a>
          </div>
        </section>
        <section class="panel">
          <p class="eyebrow">Component breakdown</p>
          <div class="rubric-grid">
            ${submission.componentBreakdown
              .map((item) => `
                <div class="rubric-row">
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${item.rawScore}/${item.rawMax}</span>
                  <span>${item.weightedScore}/${item.weight}</span>
                </div>
              `)
              .join("")}
          </div>
        </section>
      </div>
      <section class="panel" style="margin-top:18px;">
        <p class="eyebrow">Rubric matrix result</p>
        ${renderQuestionBreakdown(db, submission)}
      </section>
    `,
  );
}

function renderQuestionBreakdown(db, submission) {
  return submission.questionResults
    .map((result) => {
      const question = getQuestion(db, result.questionId);
      return `
        <article class="question-card">
          <div class="panel-title">
            <div>
              <h3>${escapeHtml(question.question)}</h3>
              <p class="muted">Answer: ${escapeHtml(result.answer || "-")}</p>
            </div>
            <strong>${result.score}/${result.maxScore}</strong>
          </div>
          ${
            result.criteria.length
              ? `<div class="rubric-grid">
                  ${result.criteria
                    .map((criterion) => `
                      <div class="rubric-row">
                        <span>${escapeHtml(criterion.label)}</span>
                        <span>${criterion.score}/${criterion.maxScore}</span>
                        <span>${criterion.passed ? "PASS" : "MISS"}</span>
                      </div>
                    `)
                    .join("")}
                </div>`
              : ""
          }
        </article>
      `;
    })
    .join("");
}

function renderCertificates() {
  const db = loadDb();
  const user = getCurrentUser(db);
  const certificates = db.certificates.filter((cert) => cert.userId === user.id);
  const rows = certificates
    .map((cert) => {
      const module = cert.moduleId ? getModule(db, cert.moduleId) : null;
      const path = getPath(db, cert.careerPathId);
      return `
        <tr>
          <td><strong>${escapeHtml(cert.title)}</strong><br /><span class="mono">${escapeHtml(cert.certificateId)}</span></td>
          <td>${escapeHtml(module?.title || path?.name || "-")}</td>
          <td>${cert.score}</td>
          <td>${cert.issuedAt}</td>
          <td>${badge(cert.status)}</td>
          <td>
            <div class="inline-actions">
              <button class="row-button" type="button" data-action="download-certificate" data-cert-id="${cert.id}">Download</button>
              <a class="row-button" href="#/certificate/verify/${cert.certificateId}">Verify</a>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  renderUserLayout(
    "Certificates",
    "Certificates are generated only after passed assessments",
    `
      <section class="panel">
        ${
          certificates.length
            ? `<div class="table-wrap">
                <table>
                  <thead><tr><th>Certificate</th><th>Module/Path</th><th>Score</th><th>Issued Date</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>`
            : `<div class="empty-state">Belum ada certificate. Lulus assessment dulu untuk membuat certificate otomatis.</div>`
        }
      </section>
    `,
  );
}

function renderJobs(filter = "RECOMMENDED") {
  const db = loadDb();
  const user = getCurrentUser(db);
  const filters = ["RECOMMENDED", "ALL", "ELIGIBLE", "ALMOST_ELIGIBLE", "LOCKED", "APPLIED"];
  const visibleJobs = db.jobs.filter((job) => {
    const appRecord = db.applications.find((item) => item.userId === user.id && item.jobId === job.id);
    const eligibility = checkEligibility(db, user.id, job);
    if (filter === "RECOMMENDED") {
      const targetWords = normalize(user.targetRole).split(" ").filter((word) => word.length > 3);
      const titleMatches = targetWords.some((word) => normalize(job.title).includes(word));
      const workMatches = !user.preferredWorkTypes.length || user.preferredWorkTypes.includes(job.workType);
      return titleMatches && workMatches;
    }
    if (filter === "ALL") return true;
    if (filter === "APPLIED") return Boolean(appRecord);
    return eligibility.status === filter;
  });
  const rows = visibleJobs.map((job) => jobRow(db, user, job)).join("");

  renderUserLayout(
    "Jobs",
    "Apply button is guarded by eligibility logic. Default view follows profile career preferences.",
    `
      <section class="panel">
        <div class="toolbar" style="margin-bottom:16px;">
          ${filters.map((item) => `<a class="row-button" href="#/jobs?filter=${item}">${item.replace("_", " ")}</a>`).join("")}
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Job</th><th>Required Modules</th><th>Eligibility</th><th>Application</th><th>Action</th></tr></thead>
            <tbody>${rows || `<tr><td colspan="5">Tidak ada job untuk filter ini.</td></tr>`}</tbody>
          </table>
        </div>
      </section>
    `,
  );
}

function jobRow(db, user, job) {
  const eligibility = checkEligibility(db, user.id, job);
  const appRecord = db.applications.find((item) => item.userId === user.id && item.jobId === job.id);
  const required = job.requiredModuleIds.map((id) => getModule(db, id).title).join(", ");
  return `
    <tr>
      <td><strong>${escapeHtml(job.title)}</strong><br /><span class="muted">${escapeHtml(job.company)} - ${escapeHtml(job.location)} - ${escapeHtml(job.workType)}</span></td>
      <td>${escapeHtml(required)}</td>
      <td>${badge(eligibility.status, eligibility.status.replace("_", " "))}</td>
      <td>${appRecord ? badge(appRecord.status) : badge("NOT_APPLIED", "NOT APPLIED")}</td>
      <td><a class="row-button" href="#/jobs/${job.id}">Detail</a></td>
    </tr>
  `;
}

function renderJobMiniList(db, user, jobs) {
  return `
    <ul class="detail-list">
      ${jobs
        .map((job) => {
          const eligibility = checkEligibility(db, user.id, job);
          return `<li><span>${escapeHtml(job.title)}</span><strong>${eligibility.status.replace("_", " ")}</strong></li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderJobDetail(jobId) {
  const db = loadDb();
  const user = getCurrentUser(db);
  const job = db.jobs.find((item) => item.id === jobId);
  if (!job) return renderNotFound("Job tidak ditemukan.");
  const eligibility = checkEligibility(db, user.id, job);
  const appRecord = db.applications.find((item) => item.userId === user.id && item.jobId === job.id);
  const requirementRows = job.requiredModuleIds
    .map((moduleId) => {
      const module = getModule(db, moduleId);
      const progress = getUserProgress(db, user.id, moduleId);
      return `
        <tr>
          <td>${escapeHtml(module.title)}</td>
          <td>${progress?.score ?? "-"}</td>
          <td>${badge(progress?.status || "NOT_STARTED", progress?.status || "NOT STARTED")}</td>
          <td><a class="row-button" href="#/modules/${module.id}">${progress?.status === "PASSED" ? "View" : "Continue"}</a></td>
        </tr>
      `;
    })
    .join("");

  renderUserLayout(
    job.title,
    "Job detail and requirement-based apply guard",
    `
      <div class="grid-2">
        <section class="panel important">
          <p class="eyebrow">Job detail</p>
          <h2>${escapeHtml(job.title)}</h2>
          <p class="muted">${escapeHtml(job.company)} - ${escapeHtml(job.location)} - ${escapeHtml(job.workType)} - ${escapeHtml(job.employmentType)}</p>
          <p>${escapeHtml(job.description)}</p>
          <ul class="detail-list">
            <li><span>Minimum Score</span><strong>${job.minimumScore}</strong></li>
            <li><span>Eligibility</span><strong>${eligibility.status.replace("_", " ")}</strong></li>
            <li><span>Missing Modules</span><strong>${eligibility.missing.length}</strong></li>
            <li><span>Application</span><strong>${appRecord?.status || "NOT APPLIED"}</strong></li>
          </ul>
          <div class="toolbar" style="margin-top:16px;">
            <button class="button" type="button" data-action="apply-job" data-job-id="${job.id}" ${eligibility.status !== "ELIGIBLE" || appRecord ? "disabled" : ""}>Apply Now</button>
            <a class="button-outline" href="#/jobs">Back to Jobs</a>
          </div>
        </section>
        <section class="panel">
          <p class="eyebrow">Apply guard result</p>
          <h3>${eligibility.status === "ELIGIBLE" ? "Apply terbuka" : "Apply terkunci"}</h3>
          <p class="muted">
            Logic tetap dicek saat tombol Apply diklik. Jika user belum eligible atau sudah apply, application tidak dibuat.
          </p>
        </section>
      </div>
      <section class="panel" style="margin-top:18px;">
        <p class="eyebrow">Required modules</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Module</th><th>Score</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>${requirementRows}</tbody>
          </table>
        </div>
      </section>
    `,
  );
}

function renderApplicationTable(db, applications) {
  if (!applications.length) return `<div class="empty-state">Belum ada application.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Job</th><th>Company</th><th>Applied Date</th><th>Status</th></tr></thead>
        <tbody>
          ${applications
            .map((application) => {
              const job = db.jobs.find((item) => item.id === application.jobId);
              return `<tr><td>${escapeHtml(job.title)}</td><td>${escapeHtml(job.company)}</td><td>${application.appliedAt}</td><td>${badge(application.status)}</td></tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderApplications() {
  const db = loadDb();
  const user = getCurrentUser(db);
  const applications = db.applications.filter((application) => application.userId === user.id);
  renderUserLayout("Applications", "Track submitted job applications", `<section class="panel">${renderApplicationTable(db, applications)}</section>`);
}

function renderProfile(tab = "overview") {
  const db = loadDb();
  const user = getCurrentUser(db);
  const contentByTab = {
    overview: renderProfileOverview(db, user),
    personal: renderPersonalSettings(user),
    career: renderCareerSettings(user),
    skills: renderSkillSettings(db, user),
    certificates: renderProfileCertificates(db, user),
    links: renderPortfolioSettings(user),
    privacy: renderPrivacySettings(user),
    security: `${renderSecuritySettings()}<div style="margin-top:18px;">${renderDangerSettings()}</div>`,
  };

  renderUserLayout(
    "Profile",
    "Manage identity, career preferences, skills, certificates, privacy, and security",
    `
      <section class="profile-hero panel important">
        ${renderAvatar(user, "profile-avatar")}
        <div>
          <p class="eyebrow">GigStart profile</p>
          <h2>${escapeHtml(user.name)}</h2>
          <p>${escapeHtml(user.headline || user.targetRole || "GigStart learner")}</p>
          <div class="toolbar">
            <a class="button" href="#/profile?tab=personal">Edit Profile</a>
            <a class="button-outline" href="#/u/${user.id}">Preview Public Profile</a>
          </div>
        </div>
      </section>
      <div class="settings-layout profile-layout">
        ${profileTabs(tab)}
        <div class="settings-content">
          ${contentByTab[tab] || contentByTab.overview}
        </div>
      </div>
    `,
  );
}

function renderProfileOverview(db, user) {
  const path = user.activeCareerPathId ? getPath(db, user.activeCareerPathId) : null;
  const skills = db.progress.filter((item) => item.userId === user.id && item.status === "PASSED");
  const certificates = db.certificates.filter((cert) => cert.userId === user.id);
  const applications = db.applications.filter((application) => application.userId === user.id);
  const rows = skills
    .map((item) => {
      const module = getModule(db, item.moduleId);
      return `<tr><td>${escapeHtml(module.title)}</td><td>${escapeHtml(module.title)} Module</td><td>${item.score}</td><td>${badge("VERIFIED")}</td></tr>`;
    })
    .join("");

  return `
    <div class="grid-2">
      <section class="panel">
        <p class="eyebrow">Overview</p>
        <ul class="detail-list">
          <li><span>Email</span><strong>${escapeHtml(user.email)}</strong></li>
          <li><span>Target Role</span><strong>${escapeHtml(user.targetRole || "-")}</strong></li>
          <li><span>Location</span><strong>${escapeHtml(user.location || "-")}</strong></li>
          <li><span>Education</span><strong>${escapeHtml(user.education || "-")}</strong></li>
          <li><span>Active Path</span><strong>${escapeHtml(path?.name || "-")}</strong></li>
        </ul>
      </section>
      <section class="panel">
        <p class="eyebrow">Readiness summary</p>
        <div class="metric-grid profile-metrics">
          <div class="metric"><span>Verified Skills</span><strong>${skills.length}</strong></div>
          <div class="metric"><span>Certificates</span><strong>${certificates.length}</strong></div>
          <div class="metric"><span>Applications</span><strong>${applications.length}</strong></div>
          <div class="metric"><span>Self Skills</span><strong>${user.selfDeclaredSkills.length}</strong></div>
        </div>
      </section>
    </div>
    <section class="panel" style="margin-top:18px;">
      <p class="eyebrow">Skill passport</p>
      ${
        rows
          ? `<div class="table-wrap"><table><thead><tr><th>Skill</th><th>Evidence</th><th>Score</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`
          : `<div class="empty-state">Skill passport kosong. Lulus assessment untuk menambah verified skill.</div>`
      }
    </section>
  `;
}

function profileTabs(activeTab) {
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
  return `
    <nav class="settings-tabs" aria-label="Profile tabs">
      ${tabs.map(([key, label]) => `<a class="${activeTab === key ? "active" : ""}" href="#/profile?tab=${key}">${label}</a>`).join("")}
    </nav>
  `;
}

function checkedAttr(values, value) {
  return values.includes(value) ? "checked" : "";
}

function selectedAttr(current, value) {
  return current === value ? "selected" : "";
}

function toggleControl(name, checked, label) {
  return `
    <label class="toggle-row">
      <span>${escapeHtml(label)}</span>
      <input type="checkbox" name="${escapeHtml(name)}" ${checked ? "checked" : ""} />
      <span class="toggle-slider" aria-hidden="true"></span>
    </label>
  `;
}

function renderProfileSettings(tab = "personal") {
  return renderProfile(tab);
}

function renderPersonalSettings(user) {
  return `
    <form class="panel form-grid" id="personalSettingsForm">
      <div>
        <p class="eyebrow">Personal information</p>
        <h2>Identitas user</h2>
        <p class="muted">Nama ini akan digunakan pada sertifikat baru. Sertifikat lama menyimpan issued name saat sertifikat dibuat.</p>
      </div>
      <div class="avatar-upload">
        ${renderAvatar(user, "profile-avatar avatar-preview")}
        <div class="field">
          <label for="avatarInput">Avatar / Profile Photo</label>
          <input id="avatarInput" name="avatar" type="file" accept="image/png,image/jpeg,image/webp" />
          <small class="muted">JPG, PNG, atau WEBP. Maksimal 2MB. Preview muncul sebelum disimpan.</small>
        </div>
      </div>
      <div class="field"><label for="profileName">Full Name</label><input id="profileName" name="name" value="${escapeHtml(user.name)}" required minlength="3" /></div>
      <div class="field"><label for="profileEmail">Email</label><input id="profileEmail" name="email" type="email" value="${escapeHtml(user.email)}" required /></div>
      <div class="field"><label for="profilePhone">Phone Number</label><input id="profilePhone" name="phone" value="${escapeHtml(user.phone || "")}" /></div>
      <div class="field"><label for="profileLocation">Location</label><input id="profileLocation" name="location" value="${escapeHtml(user.location || "")}" /></div>
      <div class="field"><label for="profileEducation">Education</label><input id="profileEducation" name="education" value="${escapeHtml(user.education || "")}" /></div>
      <div class="field"><label for="profileInstitution">University/Institution</label><input id="profileInstitution" name="institution" value="${escapeHtml(user.institution || "")}" /></div>
      <div class="field"><label for="profileHeadline">Profile Headline</label><input id="profileHeadline" name="headline" value="${escapeHtml(user.headline || "")}" /></div>
      <div class="field"><label for="profileBio">Short Bio</label><textarea id="profileBio" name="bio" maxlength="300">${escapeHtml(user.bio || "")}</textarea></div>
      <button class="button" type="submit">Save Personal Information</button>
    </form>
  `;
}

function renderCareerSettings(user) {
  const roles = ["Data Analyst Intern", "Frontend Developer Intern", "UI/UX Designer Intern", "Digital Marketing Intern", "Content Writer Intern"];
  const workTypes = ["Remote", "Hybrid", "Onsite"];
  const employmentTypes = ["Internship", "Part-time", "Full-time", "Freelance"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  return `
    <form class="panel form-grid" id="careerSettingsForm">
      <div>
        <p class="eyebrow">Career preferences</p>
        <h2>Target kerja dan rekomendasi</h2>
        <p class="muted">Target role dan preferred work type mempengaruhi default recommendation di halaman Jobs.</p>
      </div>
      <div class="field">
        <label for="targetRole">Target Role</label>
        <select id="targetRole" name="targetRole" required>${roles.map((role) => `<option ${selectedAttr(user.targetRole, role)}>${role}</option>`).join("")}</select>
      </div>
      <div class="field"><label for="interest">Interested Fields</label><input id="interest" name="interest" value="${escapeHtml(user.interest.join(", "))}" /></div>
      <div class="checkbox-grid">
        <strong>Work Type</strong>
        ${workTypes.map((type) => `<label><input type="checkbox" name="preferredWorkTypes" value="${type}" ${checkedAttr(user.preferredWorkTypes, type)} /> ${type}</label>`).join("")}
      </div>
      <div class="checkbox-grid">
        <strong>Employment Type</strong>
        ${employmentTypes.map((type) => `<label><input type="checkbox" name="preferredEmploymentTypes" value="${type}" ${checkedAttr(user.preferredEmploymentTypes, type)} /> ${type}</label>`).join("")}
      </div>
      <div class="field"><label for="preferredLocations">Preferred Location</label><input id="preferredLocations" name="preferredLocations" value="${escapeHtml(user.preferredLocations.join(", "))}" /></div>
      <div class="field">
        <label for="experienceLevel">Experience Level</label>
        <select id="experienceLevel" name="experienceLevel">${levels.map((level) => `<option ${selectedAttr(user.experienceLevel, level)}>${level}</option>`).join("")}</select>
      </div>
      <button class="button" type="submit">Save Career Preferences</button>
    </form>
  `;
}

function renderSecuritySettings() {
  return `
    <form class="panel form-grid" id="passwordSettingsForm">
      <div>
        <p class="eyebrow">Account security</p>
        <h2>Change Password</h2>
        <p class="muted">Demo lokal tetap memvalidasi current password sebelum password baru disimpan.</p>
      </div>
      <div class="field"><label for="currentPassword">Current Password</label><input id="currentPassword" name="currentPassword" type="password" required /></div>
      <div class="field"><label for="newPassword">New Password</label><input id="newPassword" name="newPassword" type="password" minlength="6" required /></div>
      <div class="field"><label for="confirmNewPassword">Confirm New Password</label><input id="confirmNewPassword" name="confirmNewPassword" type="password" minlength="6" required /></div>
      <button class="button" type="submit">Update Password</button>
    </form>
  `;
}

function renderSkillSettings(db, user) {
  const verifiedRows = db.progress
    .filter((item) => item.userId === user.id && item.status === "PASSED")
    .map((item) => {
      const module = getModule(db, item.moduleId);
      return `<tr><td>${escapeHtml(module.title)}</td><td>Verified by GigStart Assessment</td><td>${item.score}</td><td>${badge("VERIFIED")}</td></tr>`;
    })
    .join("");
  const selfRows = user.selfDeclaredSkills
    .map((skill) => `<tr><td>${escapeHtml(skill)}</td><td>Added by User</td><td>Not Verified</td><td><button class="row-button" type="button" data-action="remove-skill" data-skill="${escapeHtml(skill)}">Remove</button></td></tr>`)
    .join("");
  return `
    <section class="panel">
      <p class="eyebrow">Skill passport</p>
      <h2>Verified Skills</h2>
      <p class="muted">Verified skill berasal dari modul yang sudah PASSED. User tidak bisa mengedit score verified.</p>
      <div class="table-wrap"><table><thead><tr><th>Skill</th><th>Evidence</th><th>Score</th><th>Status</th></tr></thead><tbody>${verifiedRows || `<tr><td colspan="4">Belum ada verified skill.</td></tr>`}</tbody></table></div>
    </section>
    <form class="panel form-grid" id="selfSkillForm" style="margin-top:18px;">
      <p class="eyebrow">Self-declared skills</p>
      <div class="field"><label for="skillName">Add Skill</label><input id="skillName" name="skillName" placeholder="Canva, Figma, Python..." required /></div>
      <button class="button" type="submit">Add Self-Declared Skill</button>
      <div class="table-wrap"><table><thead><tr><th>Skill</th><th>Type</th><th>Status</th><th>Action</th></tr></thead><tbody>${selfRows || `<tr><td colspan="4">Belum ada self-declared skill.</td></tr>`}</tbody></table></div>
    </form>
  `;
}

function renderProfileCertificates(db, user) {
  const certificates = db.certificates.filter((cert) => cert.userId === user.id);
  const rows = certificates
    .map((cert) => {
      const module = cert.moduleId ? getModule(db, cert.moduleId) : null;
      const path = getPath(db, cert.careerPathId);
      return `
        <tr>
          <td><strong>${escapeHtml(cert.title)}</strong><br /><span class="mono">${escapeHtml(cert.certificateId)}</span></td>
          <td>${escapeHtml(module?.title || path?.name || "-")}</td>
          <td>${cert.score}</td>
          <td>${cert.issuedAt}</td>
          <td>${badge(cert.status)}</td>
          <td>
            <div class="inline-actions">
              <button class="row-button" type="button" data-action="download-certificate" data-cert-id="${cert.id}">Download</button>
              <a class="row-button" href="#/certificate/verify/${cert.certificateId}">Verify</a>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <section class="panel">
      <p class="eyebrow">Certificates</p>
      <h2>Certificate records</h2>
      ${
        certificates.length
          ? `<div class="table-wrap"><table><thead><tr><th>Certificate</th><th>Module/Path</th><th>Score</th><th>Issued Date</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`
          : `<div class="empty-state">Belum ada certificate. Lulus assessment dulu untuk membuat certificate otomatis.</div>`
      }
    </section>
    <div style="margin-top:18px;">${renderCertificateSettings(user)}</div>
  `;
}

function renderCertificateSettings(user) {
  return `
    <form class="panel form-grid" id="certificateSettingsForm">
      <div>
        <p class="eyebrow">Certificate settings</p>
        <h2>Certificate visibility</h2>
        <p class="muted">Certificate display name mengikuti Full Name. Verification page tetap menampilkan score sebagai bagian validasi.</p>
      </div>
      <div class="field"><label>Certificate Display Name</label><input value="${escapeHtml(user.name)}" disabled /></div>
      ${toggleControl("showCertificates", user.privacy.showCertificates, "Show certificates on public profile")}
      ${toggleControl("showScores", user.privacy.showScores, "Show scores on public profile")}
      <button class="button" type="submit">Save Certificate Settings</button>
    </form>
  `;
}

function renderPrivacySettings(user) {
  return `
    <form class="panel form-grid" id="privacySettingsForm">
      <div>
        <p class="eyebrow">Privacy and visibility</p>
        <h2>Public profile control</h2>
        <p class="muted">Application history, email, phone, failed attempts, dan detailed answer submissions tidak pernah ditampilkan di public profile.</p>
      </div>
      <div class="field">
        <label for="profileVisibility">Profile Visibility</label>
        <select id="profileVisibility" name="profileVisibility">
          <option value="PUBLIC" ${selectedAttr(user.privacy.profileVisibility, "PUBLIC")}>Public</option>
          <option value="EMPLOYERS_ONLY" ${selectedAttr(user.privacy.profileVisibility, "EMPLOYERS_ONLY")}>Only Employers/Admin</option>
          <option value="PRIVATE" ${selectedAttr(user.privacy.profileVisibility, "PRIVATE")}>Private</option>
        </select>
      </div>
      ${toggleControl("showVerifiedSkills", user.privacy.showVerifiedSkills, "Show verified skills publicly")}
      ${toggleControl("showSelfDeclaredSkills", user.privacy.showSelfDeclaredSkills, "Show self-declared skills publicly")}
      ${toggleControl("showCertificates", user.privacy.showCertificates, "Show certificates publicly")}
      ${toggleControl("showScores", user.privacy.showScores, "Show scores publicly")}
      <button class="button" type="submit">Save Privacy</button>
    </form>
  `;
}

function renderPortfolioSettings(user) {
  const links = user.portfolioLinks;
  return `
    <form class="panel form-grid" id="portfolioSettingsForm">
      <div>
        <p class="eyebrow">Portfolio links</p>
        <h2>Evidence tambahan untuk employer/admin</h2>
        <p class="muted">URL harus diawali http:// atau https://.</p>
      </div>
      ${["linkedin", "github", "portfolio", "figma", "kaggle", "other"].map((key) => `<div class="field"><label for="${key}">${key}</label><input id="${key}" name="${key}" value="${escapeHtml(links[key] || "")}" placeholder="https://..." /></div>`).join("")}
      <button class="button" type="submit">Save Portfolio Links</button>
    </form>
  `;
}

function renderDangerSettings() {
  return `
    <section class="panel important">
      <p class="eyebrow">Danger zone</p>
      <h2>Reset Learning Progress</h2>
      <p class="muted">Aksi ini menghapus progress, submissions, certificates, dan applications milik user aktif. Profil dan akun tetap ada.</p>
      <button class="button-danger" type="button" data-action="reset-user-progress">Reset Learning Progress</button>
    </section>
  `;
}

function renderVerify(certificateId) {
  const db = loadDb();
  const cert = db.certificates.find((item) => item.certificateId === certificateId);
  if (!cert) {
    renderPublic(`
      <section class="auth-page">
        <div>
          <p class="eyebrow">Certificate verification</p>
          <h1>Certificate tidak ditemukan.</h1>
          <p class="muted">Certificate ID belum ada di local demo data.</p>
          <a class="button" href="#/">Back Home</a>
        </div>
      </section>
    `);
    return;
  }
  const user = db.users.find((item) => item.id === cert.userId);
  const module = cert.moduleId ? getModule(db, cert.moduleId) : null;
  const path = getPath(db, cert.careerPathId);
  renderPublic(`
    <section class="auth-page">
      <div>
        <p class="eyebrow">Certificate verification</p>
        <h1>Status: ${cert.status}</h1>
        <p class="muted">Halaman ini bisa diakses tanpa login untuk memverifikasi certificate ID.</p>
      </div>
      <section class="certificate-paper">
        <p class="eyebrow">Certificate ID</p>
        <h2>${escapeHtml(cert.certificateId)}</h2>
        <dl>
          <div><dt>Issued To</dt><dd>${escapeHtml(cert.issuedName || user.name)}</dd></div>
          <div><dt>Career Path</dt><dd>${escapeHtml(path.name)}</dd></div>
          <div><dt>Module/Assessment</dt><dd>${escapeHtml(module?.title || cert.title)}</dd></div>
          <div><dt>Score</dt><dd>${cert.score}/100</dd></div>
          <div><dt>Issued Date</dt><dd>${cert.issuedAt}</dd></div>
          <div><dt>Status</dt><dd>${cert.status}</dd></div>
        </dl>
      </section>
    </section>
  `);
}

function visiblePortfolioLinks(user) {
  return Object.entries(user.portfolioLinks || {}).filter(([, value]) => value);
}

function renderPublicProfile(userId) {
  const db = loadDb();
  const viewer = getCurrentUser(db);
  const user = db.users.find((item) => item.id === userId && item.role === "USER");
  if (!user) return renderNotFound("Public profile tidak ditemukan.");

  const ownerOrAdmin = viewer?.id === user.id || viewer?.role === "ADMIN";
  if (user.privacy.profileVisibility === "PRIVATE" && !ownerOrAdmin) {
    renderPublic(`
      <section class="auth-page">
        <div>
          <p class="eyebrow">Public profile</p>
          <h1>Profile private.</h1>
          <p class="muted">User memilih visibility PRIVATE.</p>
          <a class="button" href="#/">Back Home</a>
        </div>
      </section>
    `);
    return;
  }

  if (user.privacy.profileVisibility === "EMPLOYERS_ONLY" && !ownerOrAdmin) {
    renderPublic(`
      <section class="auth-page">
        <div>
          <p class="eyebrow">Public profile</p>
          <h1>Only employers/admin.</h1>
          <p class="muted">Profil ini tidak dibuka untuk publik umum.</p>
          <a class="button" href="#/">Back Home</a>
        </div>
      </section>
    `);
    return;
  }

  const path = user.activeCareerPathId ? getPath(db, user.activeCareerPathId) : null;
  const verifiedSkills = db.progress.filter((item) => item.userId === user.id && item.status === "PASSED");
  const certificates = db.certificates.filter((cert) => cert.userId === user.id && cert.status === "VALID");
  const portfolioLinks = visiblePortfolioLinks(user);

  renderPublic(`
    <section class="landing-hero">
      <div class="landing-copy">
        <div class="public-profile-heading">
          ${renderAvatar(user, "profile-avatar")}
          <div>
            <p class="eyebrow">Public profile</p>
            <h1>${escapeHtml(user.name)}</h1>
            <p>${escapeHtml(user.headline || user.targetRole || "GigStart job seeker")}</p>
          </div>
        </div>
        <ul class="detail-list">
          <li><span>Target Role</span><strong>${escapeHtml(user.targetRole || "-")}</strong></li>
          <li><span>Career Path</span><strong>${escapeHtml(path?.name || "-")}</strong></li>
          <li><span>Location</span><strong>${escapeHtml(user.location || "-")}</strong></li>
        </ul>
      </div>
      <aside class="system-preview">
        <p class="eyebrow">Bio</p>
        <p>${escapeHtml(user.bio || "No public bio yet.")}</p>
      </aside>
    </section>
    <section class="landing-section">
      <div class="grid-2">
        <section class="panel">
          <p class="eyebrow">Verified skills</p>
          ${
            user.privacy.showVerifiedSkills
              ? `<div class="table-wrap"><table><thead><tr><th>Skill</th><th>Evidence</th><th>Score</th></tr></thead><tbody>${verifiedSkills.map((item) => {
                  const module = getModule(db, item.moduleId);
                  return `<tr><td>${escapeHtml(module.title)}</td><td>GigStart Assessment</td><td>${user.privacy.showScores ? item.score : "Hidden"}</td></tr>`;
                }).join("") || `<tr><td colspan="3">No verified skill yet.</td></tr>`}</tbody></table></div>`
              : `<div class="empty-state">Verified skills hidden by user.</div>`
          }
        </section>
        <section class="panel">
          <p class="eyebrow">Self-declared skills</p>
          ${
            user.privacy.showSelfDeclaredSkills
              ? `<div class="table-wrap"><table><thead><tr><th>Skill</th><th>Status</th></tr></thead><tbody>${user.selfDeclaredSkills.map((skill) => `<tr><td>${escapeHtml(skill)}</td><td>Added by User</td></tr>`).join("") || `<tr><td colspan="2">No self-declared skill.</td></tr>`}</tbody></table></div>`
              : `<div class="empty-state">Self-declared skills hidden by user.</div>`
          }
        </section>
      </div>
      <div class="grid-2" style="margin-top:18px;">
        <section class="panel">
          <p class="eyebrow">Certificates</p>
          ${
            user.privacy.showCertificates
              ? `<div class="table-wrap"><table><thead><tr><th>Certificate</th><th>Score</th><th>Verify</th></tr></thead><tbody>${certificates.map((cert) => `<tr><td>${escapeHtml(cert.title)}</td><td>${user.privacy.showScores ? cert.score : "Hidden"}</td><td><a class="row-button" href="#/certificate/verify/${cert.certificateId}">Verify</a></td></tr>`).join("") || `<tr><td colspan="3">No certificate yet.</td></tr>`}</tbody></table></div>`
              : `<div class="empty-state">Certificates hidden by user.</div>`
          }
        </section>
        <section class="panel">
          <p class="eyebrow">Portfolio links</p>
          ${
            portfolioLinks.length
              ? `<ul class="detail-list">${portfolioLinks.map(([key, value]) => `<li><span>${escapeHtml(key)}</span><strong><a href="${escapeHtml(value)}">${escapeHtml(value)}</a></strong></li>`).join("")}</ul>`
              : `<div class="empty-state">No public portfolio links.</div>`
          }
        </section>
      </div>
    </section>
  `);
}

function renderAdminDashboard() {
  const db = loadDb();
  const cards = [
    ["Users", db.users.length],
    ["Career Paths", db.careerPaths.length],
    ["Modules", db.modules.length],
    ["Jobs", db.jobs.length],
    ["Submissions", db.submissions.length],
    ["Certificates", db.certificates.length],
    ["Applications", db.applications.length],
  ];
  renderAdminLayout(
    "Admin Dashboard",
    "Manage local demo data and review system activity",
    `
      <section class="panel important">
        <p class="eyebrow">System overview</p>
        <div class="metric-grid">
          ${cards.map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join("")}
        </div>
      </section>
      <section class="panel" style="margin-top:18px;">
        <p class="eyebrow">Recent applications</p>
        ${renderAdminApplicationsTable(db)}
      </section>
    `,
  );
}

function simpleAdminTable(title, subtitle, headers, rows) {
  renderAdminLayout(
    title,
    subtitle,
    `
      <section class="panel">
        <div class="table-wrap">
          <table>
            <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
            <tbody>${rows || `<tr><td colspan="${headers.length}">Data masih kosong.</td></tr>`}</tbody>
          </table>
        </div>
      </section>
    `,
  );
}

function renderAdminUsers() {
  const db = loadDb();
  const rows = db.users
    .map((user) => {
      const certCount = db.certificates.filter((cert) => cert.userId === user.id).length;
      const appCount = db.applications.filter((appItem) => appItem.userId === user.id).length;
      return `<tr><td>${renderUserCell(user, user.email)}</td><td>${badge(user.role)}</td><td>${escapeHtml(user.targetRole || "-")}</td><td>${escapeHtml(getPath(db, user.activeCareerPathId)?.name || "-")}</td><td>${certCount}</td><td>${appCount}</td></tr>`;
    })
    .join("");
  simpleAdminTable("Users", "Admin can inspect registered users", ["User", "Role", "Target Role", "Active Path", "Certificates", "Applications"], rows);
}

function renderAdminCareerPaths() {
  const db = loadDb();
  const rows = db.careerPaths
    .map((path) => `<tr><td>${escapeHtml(path.name)}</td><td>${escapeHtml(path.level)}</td><td>${path.passingGrade}</td><td>${path.moduleIds.length}</td><td>${badge(path.status)}</td></tr>`)
    .join("");
  simpleAdminTable("Career Paths", "Admin can review career path data", ["Path Name", "Level", "Passing Grade", "Modules", "Status"], rows);
}

function renderAdminModules() {
  const db = loadDb();
  const rows = db.modules
    .map((module) => `<tr><td>${escapeHtml(module.title)}</td><td>${escapeHtml(getPath(db, module.careerPathId).name)}</td><td>${escapeHtml(module.moduleType)}</td><td>${module.passingGrade}</td><td>${badge(module.status)}</td></tr>`)
    .join("");
  simpleAdminTable("Modules", "Admin can review module configuration", ["Module", "Career Path", "Type", "Passing Grade", "Status"], rows);
}

function renderAdminAssessments() {
  const db = loadDb();
  const rows = db.assessments
    .map((assessment) => {
      const module = getModule(db, assessment.moduleId);
      const questionCount = assessment.components.reduce((total, component) => total + component.questionIds.length, 0);
      return `<tr><td>${escapeHtml(assessment.title)}</td><td>${escapeHtml(module.title)}</td><td>${questionCount}</td><td>${assessment.components.map((component) => `${component.label} ${component.weight}%`).join(", ")}</td></tr>`;
    })
    .join("");
  simpleAdminTable("Assessments", "Admin can inspect question sets and component weights", ["Assessment", "Module", "Questions", "Components"], rows);
}

function renderAdminRubrics() {
  const db = loadDb();
  const rows = db.rubrics
    .flatMap((rubric) =>
      rubric.criteria.map((criterion) => `<tr><td>${escapeHtml(rubric.name)}</td><td>${escapeHtml(criterion.label)}</td><td>${criterion.maxScore}</td><td>${escapeHtml(criterion.type)}</td><td>${escapeHtml(criterion.pattern || (criterion.requiredKeywords || []).join(", ") || `min ${criterion.minLength || criterion.minSentences}`)}</td></tr>`),
    )
    .join("");
  simpleAdminTable("Rubrics", "Local scoring matrix used by the assessment engine", ["Rubric", "Criterion", "Max Score", "Rule Type", "Rule"], rows);
}

function renderAdminJobs() {
  const db = loadDb();
  const rows = db.jobs
    .map((job) => `<tr><td>${escapeHtml(job.title)}</td><td>${escapeHtml(job.company)}</td><td>${escapeHtml(job.location)}</td><td>${job.requiredModuleIds.map((id) => getModule(db, id).title).join(", ")}</td><td>${job.minimumScore}</td><td>${badge(job.status)}</td></tr>`)
    .join("");
  simpleAdminTable("Jobs", "Admin manages jobs and module requirements", ["Job", "Company", "Location", "Required Modules", "Minimum Score", "Status"], rows);
}

function renderAdminSubmissions() {
  const db = loadDb();
  const rows = db.submissions
    .map((submission) => {
      const user = db.users.find((item) => item.id === submission.userId);
      const module = getModule(db, submission.moduleId);
      return `<tr><td>${renderUserCell(user)}</td><td>${escapeHtml(module.title)}</td><td>${submission.finalScore}</td><td>${badge(submission.status)}</td><td>${submission.submittedAt}</td><td>${escapeHtml(submission.id)}</td></tr>`;
    })
    .join("");
  simpleAdminTable("Submissions", "Admin can inspect assessment submissions", ["User", "Module", "Score", "Status", "Submitted At", "Submission ID"], rows);
}

function renderAdminApplicationsTable(db) {
  if (!db.applications.length) return `<div class="empty-state">Belum ada application.</div>`;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>User</th><th>Job</th><th>Company</th><th>Eligibility</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${db.applications
            .map((application) => {
              const user = db.users.find((item) => item.id === application.userId);
              const job = db.jobs.find((item) => item.id === application.jobId);
              const eligibility = checkEligibility(db, user.id, job);
              return `<tr>
                <td>${renderUserCell(user, user.targetRole)}</td>
                <td>${escapeHtml(job.title)}</td>
                <td>${escapeHtml(job.company)}</td>
                <td>${badge(eligibility.status, eligibility.status.replace("_", " "))}</td>
                <td>${badge(application.status)}</td>
                <td>
                  <div class="inline-actions">
                    <button class="row-button" type="button" data-action="update-application" data-application-id="${application.id}" data-status="REVIEWED">Review</button>
                    <button class="row-button" type="button" data-action="update-application" data-application-id="${application.id}" data-status="ACCEPTED">Accept</button>
                    <button class="row-button" type="button" data-action="update-application" data-application-id="${application.id}" data-status="REJECTED">Reject</button>
                  </div>
                </td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdminApplications() {
  const db = loadDb();
  renderAdminLayout("Applications", "Admin reviews job applications", `<section class="panel">${renderAdminApplicationsTable(db)}</section>`);
}

function renderAdminCertificates() {
  const db = loadDb();
  const rows = db.certificates
    .map((cert) => {
      const user = db.users.find((item) => item.id === cert.userId);
      return `<tr><td>${escapeHtml(cert.certificateId)}</td><td>${escapeHtml(cert.issuedName || user.name)}</td><td>${escapeHtml(cert.title)}</td><td>${cert.score}</td><td>${badge(cert.status)}</td></tr>`;
    })
    .join("");
  simpleAdminTable("Certificates", "Admin can inspect generated certificates", ["Certificate ID", "Issued Name", "Module/Path", "Score", "Status"], rows);
}

function renderNotFound(message = "Page tidak ditemukan.") {
  const db = loadDb();
  const user = getCurrentUser(db);
  const content = `<div class="empty-state"><h2>404</h2><p>${escapeHtml(message)}</p><a class="button" href="#/">Back Home</a></div>`;
  if (user?.role === "ADMIN") renderAdminLayout("Not Found", "Invalid admin route", content);
  else if (user) renderUserLayout("Not Found", "Invalid user route", content);
  else renderPublic(`<section class="auth-page">${content}</section>`);
}

function splitCsv(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function checkboxValues(form, name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((item) => item.value);
}

function checkboxChecked(form, name) {
  return Boolean(form.querySelector(`input[name="${name}"]`)?.checked);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function isValidOptionalUrl(value) {
  if (!value) return true;
  return /^https?:\/\/.+/i.test(value);
}

function validateAvatarFile(file) {
  if (!file || !file.name) return { ok: true };
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) return { ok: false, message: "Only JPG, PNG, and WEBP files are allowed." };
  if (file.size > 2 * 1024 * 1024) return { ok: false, message: "Image size is too large. Maximum file size is 2MB." };
  return { ok: true };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("Failed to read image file.")));
    reader.readAsDataURL(file);
  });
}

function updateCurrentUser(updater) {
  const db = loadDb();
  const current = getCurrentUser(db);
  const user = db.users.find((item) => item.id === current.id);
  updater(user, db);
  user.updatedAt = TODAY;
  saveDb(db);
}

function resetUserProgress(userId) {
  const db = loadDb();
  db.progress = db.progress.filter((item) => item.userId !== userId);
  db.submissions = db.submissions.filter((item) => item.userId !== userId);
  db.certificates = db.certificates.filter((item) => item.userId !== userId);
  db.applications = db.applications.filter((item) => item.userId !== userId);
  saveDb(db);
}

function requireUser(user) {
  if (!user) {
    flash = { type: "error", text: "Login dulu untuk membuka halaman ini." };
    go("/login");
    return false;
  }
  return true;
}

function requireAdmin(user) {
  if (!requireUser(user)) return false;
  if (user.role !== "ADMIN") {
    flash = { type: "error", text: "Route admin hanya untuk role ADMIN." };
    go("/dashboard");
    return false;
  }
  return true;
}

function render() {
  document.body.classList.remove("offcanvas-is-active");
  const db = loadDb();
  const user = getCurrentUser(db);
  const route = currentRoute();
  const path = route.path;
  const parts = segments();
  const first = parts[0] || "";

  if (path === "/") return renderLanding();
  if (path === "/login") {
    if (user) return go(user.role === "ADMIN" ? "/admin" : "/dashboard");
    return renderLogin();
  }
  if (path === "/register") {
    if (user) return go(user.role === "ADMIN" ? "/admin" : "/dashboard");
    return renderRegister();
  }
  if (parts[0] === "certificate" && parts[1] === "verify" && parts[2]) return renderVerify(parts[2]);
  if (parts[0] === "u" && parts[1]) return renderPublicProfile(parts[1]);

  if (first === "admin") {
    if (!requireAdmin(user)) return;
    if (path === "/admin") return renderAdminDashboard();
    if (path === "/admin/users") return renderAdminUsers();
    if (path === "/admin/career-paths") return renderAdminCareerPaths();
    if (path === "/admin/modules") return renderAdminModules();
    if (path === "/admin/assessments") return renderAdminAssessments();
    if (path === "/admin/rubrics") return renderAdminRubrics();
    if (path === "/admin/jobs") return renderAdminJobs();
    if (path === "/admin/submissions") return renderAdminSubmissions();
    if (path === "/admin/applications") return renderAdminApplications();
    if (path === "/admin/certificates") return renderAdminCertificates();
    return renderNotFound();
  }

  if (!requireUser(user)) return;
  if (user.role === "ADMIN") return go("/admin");

  if (path === "/dashboard") return renderDashboard();
  if (path === "/career-paths") return renderCareerPaths();
  if (parts[0] === "career-paths" && parts[1]) return renderCareerPathDetail(parts[1]);
  if (parts[0] === "modules" && parts[1] && !parts[2]) return renderModuleDetail(parts[1]);
  if (parts[0] === "modules" && parts[1] && parts[2] === "assessment") return renderAssessment(parts[1]);
  if (parts[0] === "modules" && parts[1] && parts[2] === "result") return renderResult(parts[1]);
  if (path === "/certificates") return renderCertificates();
  if (path === "/jobs") return renderJobs(new URLSearchParams(route.query).get("filter") || "RECOMMENDED");
  if (parts[0] === "jobs" && parts[1]) return renderJobDetail(parts[1]);
  if (path === "/applications") return renderApplications();
  if (path === "/profile/settings") {
    const tab = new URLSearchParams(route.query).get("tab") || "personal";
    return go(`/profile?tab=${tab === "danger" ? "security" : tab}`);
  }
  if (path === "/profile") return renderProfile(new URLSearchParams(route.query).get("tab") || "overview");

  return renderNotFound();
}

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.id === "loginForm") {
    event.preventDefault();
    const db = loadDb();
    const data = new FormData(form);
    const email = normalize(data.get("email"));
    const password = String(data.get("password") || "");
    const user = db.users.find((item) => normalize(item.email) === email && item.password === password);
    if (!user) {
      flash = { type: "error", text: "Email atau password tidak sesuai." };
      renderLogin();
      return;
    }
    setCurrentUser(user.id);
    go(user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  if (form.id === "registerForm") {
    event.preventDefault();
    const db = loadDb();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = normalize(data.get("email"));
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    if (name.length < 3) {
      flash = { type: "error", text: "Full Name wajib minimal 3 karakter." };
      renderRegister();
      return;
    }
    if (!isValidEmail(email)) {
      flash = { type: "error", text: "Format email tidak valid." };
      renderRegister();
      return;
    }
    if (password.length < 6) {
      flash = { type: "error", text: "Password minimal 6 karakter." };
      renderRegister();
      return;
    }
    if (password !== confirmPassword) {
      flash = { type: "error", text: "Password dan confirm password tidak sama." };
      renderRegister();
      return;
    }
    if (db.users.some((user) => normalize(user.email) === email)) {
      flash = { type: "error", text: "Email sudah terdaftar." };
      renderRegister();
      return;
    }
    const user = {
      id: makeId("user"),
      name,
      email,
      password,
      role: "USER",
      interest: splitCsv(data.get("interest")),
      targetRole: String(data.get("targetRole") || "").trim(),
      location: String(data.get("location") || "").trim(),
      activeCareerPathId: null,
      createdAt: TODAY,
      updatedAt: TODAY,
    };
    db.users.push(normalizeUser(user));
    saveDb(db);
    setCurrentUser(user.id);
    go("/dashboard");
  }

  if (form.id === "assessmentForm") {
    event.preventDefault();
    const db = loadDb();
    const user = getCurrentUser(db);
    const moduleId = form.dataset.moduleId;
    const data = new FormData(form);
    const answers = {};
    for (const [key, value] of data.entries()) answers[key] = String(value);
    const submission = submitAssessment(db, user, moduleId, answers);
    flash = {
      type: submission.status === "PASSED" ? "success" : "error",
      text: `Assessment submitted. Final score: ${submission.finalScore}. Status: ${submission.status}.`,
    };
    go(`/modules/${moduleId}/result`);
  }

  if (form.id === "personalSettingsForm") {
    event.preventDefault();
    const db = loadDb();
    const current = getCurrentUser(db);
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = normalize(data.get("email"));
    const bio = String(data.get("bio") || "").trim();
    const avatarFile = data.get("avatar");
    const avatarValidation = validateAvatarFile(avatarFile);
    if (name.length < 3) {
      flash = { type: "error", text: "Full Name wajib minimal 3 karakter." };
      renderProfile("personal");
      return;
    }
    if (!isValidEmail(email)) {
      flash = { type: "error", text: "Format email tidak valid." };
      renderProfile("personal");
      return;
    }
    if (bio.length > 300) {
      flash = { type: "error", text: "Bio maksimal 300 karakter." };
      renderProfile("personal");
      return;
    }
    if (!avatarValidation.ok) {
      flash = { type: "error", text: avatarValidation.message };
      renderProfile("personal");
      return;
    }
    if (db.users.some((user) => user.id !== current.id && normalize(user.email) === email)) {
      flash = { type: "error", text: "Email sudah dipakai user lain." };
      renderProfile("personal");
      return;
    }
    let avatarUrl = null;
    if (avatarFile?.name) {
      try {
        avatarUrl = await fileToDataUrl(avatarFile);
      } catch (error) {
        flash = { type: "error", text: error.message };
        renderProfile("personal");
        return;
      }
    }
    updateCurrentUser((user) => {
      user.name = name;
      user.email = email;
      user.phone = String(data.get("phone") || "").trim();
      user.location = String(data.get("location") || "").trim();
      user.education = String(data.get("education") || "").trim();
      user.institution = String(data.get("institution") || "").trim();
      user.headline = String(data.get("headline") || "").trim();
      user.bio = bio;
      if (avatarUrl) user.avatarUrl = avatarUrl;
    });
    flash = { type: "success", text: "Personal information berhasil disimpan." };
    renderProfile("personal");
  }

  if (form.id === "careerSettingsForm") {
    event.preventDefault();
    const data = new FormData(form);
    const targetRole = String(data.get("targetRole") || "").trim();
    const experienceLevel = String(data.get("experienceLevel") || "Beginner");
    if (!targetRole) {
      flash = { type: "error", text: "Target role wajib diisi." };
      renderProfile("career");
      return;
    }
    if (!["Beginner", "Intermediate", "Advanced"].includes(experienceLevel)) {
      flash = { type: "error", text: "Experience level tidak valid." };
      renderProfile("career");
      return;
    }
    updateCurrentUser((user) => {
      user.targetRole = targetRole;
      user.interest = splitCsv(data.get("interest"));
      user.preferredWorkTypes = checkboxValues(form, "preferredWorkTypes");
      user.preferredEmploymentTypes = checkboxValues(form, "preferredEmploymentTypes");
      user.preferredLocations = splitCsv(data.get("preferredLocations"));
      user.experienceLevel = experienceLevel;
    });
    flash = { type: "success", text: "Career preferences berhasil disimpan. Halaman Jobs akan memakai preferensi ini." };
    renderProfile("career");
  }

  if (form.id === "passwordSettingsForm") {
    event.preventDefault();
    const db = loadDb();
    const current = getCurrentUser(db);
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") || "");
    const newPassword = String(data.get("newPassword") || "");
    const confirmNewPassword = String(data.get("confirmNewPassword") || "");
    if (current.password !== currentPassword) {
      flash = { type: "error", text: "Current password salah." };
      renderProfile("security");
      return;
    }
    if (newPassword.length < 6) {
      flash = { type: "error", text: "New password minimal 6 karakter." };
      renderProfile("security");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      flash = { type: "error", text: "Confirm password tidak sama dengan new password." };
      renderProfile("security");
      return;
    }
    updateCurrentUser((user) => {
      user.password = newPassword;
    });
    flash = { type: "success", text: "Password berhasil diperbarui." };
    renderProfile("security");
  }

  if (form.id === "selfSkillForm") {
    event.preventDefault();
    const data = new FormData(form);
    const skillName = String(data.get("skillName") || "").trim();
    if (!skillName) {
      flash = { type: "error", text: "Nama skill wajib diisi." };
      renderProfile("skills");
      return;
    }
    updateCurrentUser((user) => {
      const exists = user.selfDeclaredSkills.some((skill) => normalize(skill) === normalize(skillName));
      if (!exists) user.selfDeclaredSkills.push(skillName);
    });
    flash = { type: "success", text: "Self-declared skill berhasil ditambahkan." };
    renderProfile("skills");
  }

  if (form.id === "certificateSettingsForm") {
    event.preventDefault();
    updateCurrentUser((user) => {
      user.privacy.showCertificates = checkboxChecked(form, "showCertificates");
      user.privacy.showScores = checkboxChecked(form, "showScores");
    });
    flash = { type: "success", text: "Certificate settings berhasil disimpan." };
    renderProfile("certificates");
  }

  if (form.id === "privacySettingsForm") {
    event.preventDefault();
    const data = new FormData(form);
    const visibility = String(data.get("profileVisibility") || "PUBLIC");
    if (!["PUBLIC", "EMPLOYERS_ONLY", "PRIVATE"].includes(visibility)) {
      flash = { type: "error", text: "Visibility tidak valid." };
      renderProfile("privacy");
      return;
    }
    updateCurrentUser((user) => {
      user.privacy.profileVisibility = visibility;
      user.privacy.showVerifiedSkills = checkboxChecked(form, "showVerifiedSkills");
      user.privacy.showSelfDeclaredSkills = checkboxChecked(form, "showSelfDeclaredSkills");
      user.privacy.showCertificates = checkboxChecked(form, "showCertificates");
      user.privacy.showScores = checkboxChecked(form, "showScores");
    });
    flash = { type: "success", text: "Privacy settings berhasil disimpan." };
    renderProfile("privacy");
  }

  if (form.id === "portfolioSettingsForm") {
    event.preventDefault();
    const data = new FormData(form);
    const links = {
      linkedin: String(data.get("linkedin") || "").trim(),
      github: String(data.get("github") || "").trim(),
      portfolio: String(data.get("portfolio") || "").trim(),
      figma: String(data.get("figma") || "").trim(),
      kaggle: String(data.get("kaggle") || "").trim(),
      other: String(data.get("other") || "").trim(),
    };
    if (!Object.values(links).every(isValidOptionalUrl)) {
      flash = { type: "error", text: "Portfolio URL harus diawali http:// atau https://." };
      renderProfile("links");
      return;
    }
    updateCurrentUser((user) => {
      user.portfolioLinks = links;
    });
    flash = { type: "success", text: "Portfolio links berhasil disimpan." };
    renderProfile("links");
  }
});

document.addEventListener("change", async (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.id !== "avatarInput") return;
  const file = input.files?.[0];
  if (!file) return;
  const validation = validateAvatarFile(file);
  if (!validation.ok) {
    flash = { type: "error", text: validation.message };
    renderProfile("personal");
    return;
  }
  const preview = document.querySelector(".avatar-preview");
  if (!preview) return;
  try {
    preview.innerHTML = `<img src="${escapeHtml(await fileToDataUrl(file))}" alt="Avatar preview" />`;
  } catch (error) {
    flash = { type: "error", text: error.message };
    renderProfile("personal");
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const actionEl = target.closest("[data-action]");
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  if (action === "dismiss-flash") {
    dismissToast();
    return;
  }
  if (action === "logout") {
    clearCurrentUser();
    flash = { type: "success", text: "Logout berhasil." };
    go("/");
  }
  if (action === "reset-data") resetDb();
  if (action === "enroll-path") {
    const db = loadDb();
    const user = getCurrentUser(db);
    const mutableUser = db.users.find((item) => item.id === user.id);
    mutableUser.activeCareerPathId = actionEl.dataset.pathId;
    saveDb(db);
    flash = { type: "success", text: "Career path berhasil dijadikan active path." };
    go("/dashboard");
  }
  if (action === "apply-job") {
    const db = loadDb();
    const user = getCurrentUser(db);
    const result = applyJob(db, user, actionEl.dataset.jobId);
    flash = { type: result.ok ? "success" : "error", text: result.message };
    render();
  }
  if (action === "update-application") {
    const db = loadDb();
    const application = db.applications.find((item) => item.id === actionEl.dataset.applicationId);
    if (application) {
      application.status = actionEl.dataset.status;
      saveDb(db);
      flash = { type: "success", text: "Application status berhasil di-update." };
      render();
    }
  }
  if (action === "download-certificate") {
    const db = loadDb();
    const cert = db.certificates.find((item) => item.id === actionEl.dataset.certId);
    if (cert) downloadCertificate(db, cert);
  }
  if (action === "remove-skill") {
    const skill = actionEl.dataset.skill;
    updateCurrentUser((user) => {
      user.selfDeclaredSkills = user.selfDeclaredSkills.filter((item) => item !== skill);
    });
    flash = { type: "success", text: "Self-declared skill berhasil dihapus." };
    renderProfile("skills");
  }
  if (action === "reset-user-progress") {
    const db = loadDb();
    const user = getCurrentUser(db);
    const confirmed = typeof window.confirm === "function"
      ? window.confirm("Reset progress, submissions, certificates, dan applications akun ini?")
      : true;
    if (!confirmed) return;
    resetUserProgress(user.id);
    flash = { type: "success", text: "Learning progress user aktif berhasil di-reset. Profile tetap tersimpan." };
    renderProfile("security");
  }
});

function downloadCertificate(db, cert) {
  const user = db.users.find((item) => item.id === cert.userId);
  const path = getPath(db, cert.careerPathId);
  const module = cert.moduleId ? getModule(db, cert.moduleId) : null;
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>${cert.certificateId}</title></head>
<body style="font-family:Arial,sans-serif;padding:48px;">
  <h1>Certificate of Completion</h1>
  <p>This verifies that <strong>${escapeHtml(cert.issuedName || user.name)}</strong> has passed <strong>${escapeHtml(module?.title || path.name)}</strong>.</p>
  <p>Career Path: ${escapeHtml(path.name)}</p>
  <p>Score: ${cert.score}/100</p>
  <p>Issued Date: ${cert.issuedAt}</p>
  <p>Certificate ID: ${cert.certificateId}</p>
  <p>Status: ${cert.status}</p>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cert.certificateId}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

window.addEventListener("hashchange", render);

// Initial boot sequence: fetch data from the backend
fetch('/api/data')
  .then(res => {
    if (!res.ok) throw new Error("Backend not ok");
    return res.json();
  })
  .then(data => {
    if (Object.keys(data).length > 0) {
      appDb = data;
    }
    render();
  })
  .catch(err => {
    console.warn("Backend not found or failed. Using local state.", err);
    render();
  });
