// ─── Types ───
export interface ResourceItem {
  title: string;
  description: string;
  type: "free" | "premium";
}

export interface SubjectResources {
  notes: ResourceItem[];
  quizzes: ResourceItem[];
  pastPapers: ResourceItem[];
  videos: ResourceItem[];
}

export interface Subject {
  id: string;
  name: string;
  level: "igcse" | "as" | "a2";
  category: "economics" | "business" | "sciences" | "humanities" | "languages";
  icon: string;
  description: string;
  tags: string[];
  fee: number;
  instructor: string;
  resources: SubjectResources;
}

// ─── Label / Color Lookup ───
export const levelLabels: Record<string, string> = {
  igcse: "IGCSE / O Level",
  as: "AS Level",
  a2: "A2 Level",
};

export const levelColors: Record<string, string> = {
  igcse: "bg-teal-500",
  as: "bg-blue-500",
  a2: "bg-purple-500",
};

export const categoryColors: Record<string, string> = {
  economics: "from-emerald-400 to-teal-500",
  business: "from-blue-400 to-indigo-500",
  sciences: "from-orange-400 to-red-500",
  humanities: "from-purple-400 to-pink-500",
  languages: "from-yellow-400 to-amber-500",
};

// ─── Data ───
export const subjects: Subject[] = [
  {
    id: "igcse-economics",
    name: "Economics",
    level: "igcse",
    category: "economics",
    icon: "📊",
    description:
      "Comprehensive IGCSE Economics covering microeconomics, macroeconomics, and international trade fundamentals.",
    tags: ["Micro", "Macro", "Trade"],
    fee: 4999,
    instructor: "Sir Hamza",
    resources: {
      notes: [
        { title: "Chapter 1 – Basic Economic Problem", description: "Scarcity, choice, opportunity cost", type: "free" },
        { title: "Chapter 2 – Demand & Supply", description: "Market equilibrium, elasticity", type: "free" },
        { title: "Chapter 3 – Government Intervention", description: "Price controls, subsidies, taxation", type: "premium" },
        { title: "Chapter 4 – International Trade", description: "Comparative advantage, trade barriers", type: "premium" },
      ],
      quizzes: [
        { title: "Microeconomics Quiz", description: "20 MCQs on basic concepts", type: "free" },
        { title: "Macroeconomics Quiz", description: "25 MCQs on national economy", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "Multiple choice paper with answers", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Structured questions with marking scheme", type: "premium" },
      ],
      videos: [
        { title: "Intro to Economics", description: "60-min foundation video", type: "free" },
        { title: "Advanced Market Structures", description: "Full topic video series", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-business",
    name: "Business Studies",
    level: "igcse",
    category: "business",
    icon: "💼",
    description:
      "IGCSE Business Studies covering business activity, marketing, operations, finance, and human resources.",
    tags: ["Marketing", "Finance", "HR"],
    fee: 4999,
    instructor: "Sir Hamza",
    resources: {
      notes: [
        { title: "Unit 1 – Business Activity", description: "Purpose of business, stakeholders", type: "free" },
        { title: "Unit 2 – Marketing", description: "Market research, 4Ps, segmentation", type: "premium" },
      ],
      quizzes: [
        { title: "Business Basics Quiz", description: "15 MCQs", type: "free" },
        { title: "Finance Quiz", description: "20 MCQs on financial statements", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "Short answer paper", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Case study paper", type: "premium" },
      ],
      videos: [
        { title: "Marketing Mix Explained", description: "45-min deep dive", type: "free" },
        { title: "Financial Ratios", description: "Complete analysis series", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-maths",
    name: "Mathematics",
    level: "igcse",
    category: "sciences",
    icon: "📐",
    description:
      "IGCSE Mathematics covering algebra, geometry, trigonometry, statistics, and probability.",
    tags: ["Algebra", "Geometry", "Stats"],
    fee: 4999,
    instructor: "Sir Ahmed",
    resources: {
      notes: [
        { title: "Number & Algebra", description: "Comprehensive notes", type: "free" },
        { title: "Geometry & Trigonometry", description: "Shapes, angles, trig ratios", type: "premium" },
      ],
      quizzes: [
        { title: "Algebra Quiz", description: "25 practice questions", type: "free" },
        { title: "Full Paper Practice", description: "Timed mock exam", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 2", description: "Extended paper with solutions", type: "free" },
        { title: "Oct/Nov 2024 Paper 4", description: "Extended paper with mark scheme", type: "premium" },
      ],
      videos: [
        { title: "Algebra Basics", description: "Foundation concepts", type: "free" },
        { title: "Trigonometry Mastery", description: "Complete topic coverage", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-physics",
    name: "Physics",
    level: "igcse",
    category: "sciences",
    icon: "⚡",
    description:
      "IGCSE Physics covering mechanics, thermal physics, waves, electricity, and nuclear physics.",
    tags: ["Mechanics", "Waves", "Electricity"],
    fee: 5499,
    instructor: "Sir Ali",
    resources: {
      notes: [
        { title: "Mechanics Notes", description: "Forces, motion, energy", type: "free" },
        { title: "Electricity Notes", description: "Circuits, resistance, power", type: "premium" },
      ],
      quizzes: [
        { title: "Mechanics Quiz", description: "20 MCQs", type: "free" },
        { title: "Full Syllabus Quiz", description: "50 MCQs all topics", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 2", description: "Theory paper with answers", type: "free" },
        { title: "Oct/Nov 2024 Paper 4", description: "Alt-to-practical with solutions", type: "premium" },
      ],
      videos: [
        { title: "Forces & Motion", description: "Intro lecture", type: "free" },
        { title: "Electricity Deep Dive", description: "Full topic series", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-chemistry",
    name: "Chemistry",
    level: "igcse",
    category: "sciences",
    icon: "🧪",
    description:
      "IGCSE Chemistry covering atomic structure, bonding, organic chemistry, and analytical techniques.",
    tags: ["Organic", "Bonding", "Reactions"],
    fee: 5499,
    instructor: "Miss Sara",
    resources: {
      notes: [
        { title: "Atomic Structure", description: "Atoms, isotopes, electron configuration", type: "free" },
        { title: "Organic Chemistry", description: "Hydrocarbons, polymers, reactions", type: "premium" },
      ],
      quizzes: [
        { title: "Bonding Quiz", description: "15 MCQs", type: "free" },
        { title: "Full Syllabus Quiz", description: "40 MCQs all topics", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 2", description: "Theory with mark scheme", type: "free" },
        { title: "Oct/Nov 2024 Paper 4", description: "Alt-to-practical paper", type: "premium" },
      ],
      videos: [
        { title: "Chemical Bonding", description: "Comprehensive lecture", type: "free" },
        { title: "Organic Chemistry Series", description: "Full topic coverage", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-biology",
    name: "Biology",
    level: "igcse",
    category: "sciences",
    icon: "🧬",
    description:
      "IGCSE Biology covering cell biology, genetics, ecology, human physiology, and plant biology.",
    tags: ["Cells", "Genetics", "Ecology"],
    fee: 5499,
    instructor: "Miss Fatima",
    resources: {
      notes: [
        { title: "Cell Biology", description: "Cell structure, transport, division", type: "free" },
        { title: "Genetics & Inheritance", description: "DNA, variation, natural selection", type: "premium" },
      ],
      quizzes: [
        { title: "Cell Biology Quiz", description: "20 MCQs", type: "free" },
        { title: "Full Syllabus Quiz", description: "45 MCQs all topics", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 2", description: "Theory paper with answers", type: "free" },
        { title: "Oct/Nov 2024 Paper 4", description: "Practical paper with solutions", type: "premium" },
      ],
      videos: [
        { title: "Introduction to Cells", description: "Foundation video", type: "free" },
        { title: "Genetics Full Series", description: "Complete coverage", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-pak-studies",
    name: "Pakistan Studies",
    level: "igcse",
    category: "humanities",
    icon: "🏛️",
    description:
      "IGCSE Pakistan Studies covering history, geography, and culture of Pakistan.",
    tags: ["History", "Geography", "Culture"],
    fee: 3999,
    instructor: "Sir Usman",
    resources: {
      notes: [
        { title: "History Section 1", description: "Mughal Empire to Independence", type: "free" },
        { title: "Geography of Pakistan", description: "Physical & human geography", type: "premium" },
      ],
      quizzes: [
        { title: "History Quiz", description: "15 MCQs", type: "free" },
        { title: "Full Paper Practice", description: "Mock exam", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "History paper with answers", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Geography paper", type: "premium" },
      ],
      videos: [
        { title: "Pakistan Movement", description: "Key events overview", type: "free" },
        { title: "Geography Deep Dive", description: "Full series", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-islamiyat",
    name: "Islamiyat",
    level: "igcse",
    category: "humanities",
    icon: "🕌",
    description:
      "IGCSE Islamiyat covering major themes of the Quran, Hadith, and history of Islam.",
    tags: ["Quran", "Hadith", "History"],
    fee: 3999,
    instructor: "Sir Usman",
    resources: {
      notes: [
        { title: "Major Themes of the Quran", description: "Tawhid, prophethood, afterlife", type: "free" },
        { title: "History of Islam", description: "Caliphate period, key events", type: "premium" },
      ],
      quizzes: [
        { title: "Quran Themes Quiz", description: "15 MCQs", type: "free" },
        { title: "Full Syllabus Quiz", description: "30 MCQs", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "With mark scheme", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Full paper with answers", type: "premium" },
      ],
      videos: [
        { title: "Themes of Quran", description: "Introduction lecture", type: "free" },
        { title: "Islamic History", description: "Full series", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-english",
    name: "English Language",
    level: "igcse",
    category: "languages",
    icon: "📝",
    description:
      "IGCSE English Language focusing on reading comprehension, writing skills, and directed writing.",
    tags: ["Reading", "Writing", "Comprehension"],
    fee: 4499,
    instructor: "Miss Ayesha",
    resources: {
      notes: [
        { title: "Reading Techniques", description: "Skimming, scanning, inference", type: "free" },
        { title: "Creative Writing Guide", description: "Narrative & descriptive writing", type: "premium" },
      ],
      quizzes: [
        { title: "Comprehension Practice", description: "5 passages with questions", type: "free" },
        { title: "Writing Skills Quiz", description: "Timed practice", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "Reading paper with answers", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Writing paper with exemplars", type: "premium" },
      ],
      videos: [
        { title: "Reading Skills", description: "How to ace Paper 1", type: "free" },
        { title: "Writing Masterclass", description: "Full series", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-urdu",
    name: "Urdu",
    level: "igcse",
    category: "languages",
    icon: "📖",
    description:
      "IGCSE Urdu covering reading, writing, and literature in Urdu language.",
    tags: ["Literature", "Grammar", "Writing"],
    fee: 3999,
    instructor: "Sir Waqas",
    resources: {
      notes: [
        { title: "Essay Writing Guide", description: "Structure, vocabulary, expression", type: "free" },
        { title: "Literature Analysis", description: "Poetry & prose analysis techniques", type: "premium" },
      ],
      quizzes: [
        { title: "Grammar Quiz", description: "15 MCQs", type: "free" },
        { title: "Literature Quiz", description: "20 MCQs", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "With mark scheme", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Writing paper", type: "premium" },
      ],
      videos: [
        { title: "Urdu Grammar Basics", description: "Foundation video", type: "free" },
        { title: "Essay Writing Tips", description: "Complete guide", type: "premium" },
      ],
    },
  },
  {
    id: "as-economics",
    name: "Economics",
    level: "as",
    category: "economics",
    icon: "📈",
    description:
      "AS Level Economics covering advanced microeconomics, macroeconomics, and policy analysis.",
    tags: ["Micro", "Macro", "Policy"],
    fee: 6999,
    instructor: "Sir Hamza",
    resources: {
      notes: [
        { title: "AS Micro – Market Failure", description: "Externalities, public goods, merit goods", type: "free" },
        { title: "AS Macro – Monetary Policy", description: "Interest rates, quantitative easing", type: "premium" },
      ],
      quizzes: [
        { title: "Market Failure Quiz", description: "20 MCQs", type: "free" },
        { title: "Macro Policy Quiz", description: "25 MCQs", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "MCQ paper with answers", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Data response with solutions", type: "premium" },
      ],
      videos: [
        { title: "Market Failure Intro", description: "Key concepts explained", type: "free" },
        { title: "Macro Policy Deep Dive", description: "Full series", type: "premium" },
      ],
    },
  },
  {
    id: "as-business",
    name: "Business Studies",
    level: "as",
    category: "business",
    icon: "📊",
    description:
      "AS Level Business Studies covering strategic management, finance, and marketing strategy.",
    tags: ["Strategy", "Finance", "Marketing"],
    fee: 6999,
    instructor: "Sir Hamza",
    resources: {
      notes: [
        { title: "Business Objectives", description: "Mission, vision, stakeholders", type: "free" },
        { title: "Financial Analysis", description: "Ratio analysis, investment appraisal", type: "premium" },
      ],
      quizzes: [
        { title: "Objectives Quiz", description: "15 MCQs", type: "free" },
        { title: "Finance Quiz", description: "20 MCQs", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "Short answer paper", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Essay paper with mark scheme", type: "premium" },
      ],
      videos: [
        { title: "Strategic Management", description: "Intro lecture", type: "free" },
        { title: "Investment Appraisal", description: "Full topic series", type: "premium" },
      ],
    },
  },
  {
    id: "a2-economics",
    name: "Economics",
    level: "a2",
    category: "economics",
    icon: "🏦",
    description:
      "A2 Level Economics covering international economics, development economics, and economic policy.",
    tags: ["International", "Development", "Policy"],
    fee: 7999,
    instructor: "Sir Hamza",
    resources: {
      notes: [
        { title: "International Trade Theory", description: "Comparative advantage, WTO", type: "free" },
        { title: "Development Economics", description: "HDI, strategies, globalisation", type: "premium" },
      ],
      quizzes: [
        { title: "Trade Theory Quiz", description: "20 MCQs", type: "free" },
        { title: "Development Quiz", description: "25 MCQs", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 3", description: "MCQ paper with answers", type: "free" },
        { title: "Oct/Nov 2024 Paper 4", description: "Essay paper with mark scheme", type: "premium" },
      ],
      videos: [
        { title: "Trade Theory Basics", description: "Key concepts", type: "free" },
        { title: "Development Economics Series", description: "Full coverage", type: "premium" },
      ],
    },
  },
  {
    id: "a2-business",
    name: "Business Studies",
    level: "a2",
    category: "business",
    icon: "🏢",
    description:
      "A2 Level Business covering strategic analysis, global business, and change management.",
    tags: ["Strategy", "Global", "Change"],
    fee: 7999,
    instructor: "Sir Hamza",
    resources: {
      notes: [
        { title: "Strategic Analysis", description: "SWOT, PESTLE, Porter's Five Forces", type: "free" },
        { title: "Global Business Strategy", description: "Internationalisation, cultural factors", type: "premium" },
      ],
      quizzes: [
        { title: "Strategy Quiz", description: "20 MCQs", type: "free" },
        { title: "Global Business Quiz", description: "25 MCQs", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 3", description: "Case study paper", type: "free" },
        { title: "Oct/Nov 2024 Paper 4", description: "Essay paper with mark scheme", type: "premium" },
      ],
      videos: [
        { title: "SWOT & PESTLE Explained", description: "Framework overview", type: "free" },
        { title: "Change Management Series", description: "Full topic coverage", type: "premium" },
      ],
    },
  },
  {
    id: "igcse-history",
    name: "History",
    level: "igcse",
    category: "humanities",
    icon: "📜",
    description:
      "IGCSE History covering 20th century world history, international relations, and key events.",
    tags: ["World Wars", "Cold War", "Modern"],
    fee: 4499,
    instructor: "Sir Usman",
    resources: {
      notes: [
        { title: "World War I", description: "Causes, events, consequences", type: "free" },
        { title: "Cold War", description: "Origins, key events, end", type: "premium" },
      ],
      quizzes: [
        { title: "WWI Quiz", description: "15 MCQs", type: "free" },
        { title: "Cold War Quiz", description: "20 MCQs", type: "premium" },
      ],
      pastPapers: [
        { title: "May/June 2024 Paper 1", description: "Source-based paper", type: "free" },
        { title: "Oct/Nov 2024 Paper 2", description: "Essay paper", type: "premium" },
      ],
      videos: [
        { title: "WWI Overview", description: "Quick summary", type: "free" },
        { title: "Cold War Deep Dive", description: "Full series", type: "premium" },
      ],
    },
  },
];

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getSubjectsByLevel(level: string): Subject[] {
  if (level === "all") return subjects;
  return subjects.filter((s) => s.level === level);
}

export function getSubjectsByCategory(category: string): Subject[] {
  if (category === "all") return subjects;
  return subjects.filter((s) => s.category === category);
}
