// Curated data for Campus-Prep Landing Page
// Accurately reflects Mumbai University engineering branches and real study materials

export const SUPPORTED_BRANCHES = [
  {
    id: 'COMPS',
    code: 'COMPS',
    name: 'Computer Engineering',
    description: 'Data structures, algorithms, cloud computing, security, and systems engineering.',
  },
  {
    id: 'AIML',
    code: 'AI/ML',
    name: 'Artificial Intelligence & Machine Learning',
    description: 'Neural networks, machine learning, computer vision, and cognitive systems.',
  },
  {
    id: 'IT',
    code: 'IT',
    name: 'Information Technology',
    description: 'Enterprise networking, software engineering, databases, and DevOps.',
  },
  {
    id: 'ELEX',
    code: 'Electronics',
    name: 'Electronics Engineering',
    description: 'VLSI design, embedded systems, microprocessors, and signals.',
  },
  {
    id: 'MECH',
    code: 'Mechanical',
    name: 'Mechanical Engineering',
    description: 'Thermodynamics, fluid mechanics, machine design, and manufacturing.',
  },
  {
    id: 'AUTO',
    code: 'Automobile',
    name: 'Automobile Engineering',
    description: 'Vehicle dynamics, powertrain systems, EV technologies, and aerodynamics.',
  },
];

export const CORE_FEATURES = [
  {
    id: 'organized-materials',
    title: 'Organized Study Materials',
    description:
      'Curriculum-aligned lecture notes, unit summaries, and concept cheat sheets indexed directly by semester and course module.',
    icon: 'folder',
  },
  {
    id: 'pyqs',
    title: 'Previous Year Question Papers',
    description:
      'Mumbai University past semester question papers categorized by exam year, revision scheme, and subject code.',
    icon: 'file-text',
  },
  {
    id: 'notes-books',
    title: 'Notes & Reference Books',
    description:
      'Standard reference textbooks, recommended syllabus readings, and professor-endorsed subject materials.',
    icon: 'book',
  },
  {
    id: 'subject-resources',
    title: 'Subject-Wise Taxonomy',
    description:
      'Filter seamlessly across engineering branches and semesters (Sem 1 to Sem 8) to find exact syllabus materials with zero noise.',
    icon: 'layers',
  },
  {
    id: 'peer-contributions',
    title: 'Peer Contributions with Moderation',
    description:
      'Students share verified handwritten notes and study guides, reviewed by administrators before being published.',
    icon: 'users',
  },
  {
    id: 'ai-assistant',
    title: 'AI Study Assistant',
    description:
      'Intelligent revision summaries and instant question search mapped across engineering syllabi.',
    badge: 'Coming Soon',
    icon: 'sparkles',
  },
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Select Engineering Branch',
    description:
      'Choose from Computer Engineering, AI/ML, Information Technology, Electronics, Mechanical, or Automobile.',
  },
  {
    step: '02',
    title: 'Find Semester & Subject',
    description:
      'Navigate directly to your current semester (Sem 1 to 8) and locate your specific curriculum course code.',
  },
  {
    step: '03',
    title: 'Access Study Materials',
    description:
      'Instantly view and download verified PDF lecture notes, textbooks, and university solved question papers.',
  },
  {
    step: '04',
    title: 'Contribute Resources',
    description:
      'Upload your own handwritten notes and solved question banks to support peers across engineering colleges.',
  },
];

// Sample live preview items for the landing page demonstration
export const SAMPLE_VAULT_ITEMS = [
  {
    id: 'sample-1',
    branch: 'COMPS',
    semester: 'Semester 7',
    subjectCode: 'CSC701',
    subject: 'Distributed Computing',
    title: 'Distributed Systems, Consensus Protocols & RPC Architecture Notes',
    type: 'notes',
    scheme: 'Rev-2019 C-Scheme',
  },
  {
    id: 'sample-2',
    branch: 'COMPS',
    semester: 'Semester 7',
    subjectCode: 'CSC702',
    subject: 'Cryptography & System Security',
    title: 'University Solved Question Papers & Derivations Bank',
    type: 'qp',
    scheme: 'Rev-2019 C-Scheme',
  },
  {
    id: 'sample-3',
    branch: 'AIML',
    semester: 'Semester 6',
    subjectCode: 'AIML601',
    subject: 'Deep Learning & Neural Networks',
    title: 'Backpropagation, CNNs & Transformer Foundations Guide',
    type: 'notes',
    scheme: 'Rev-2019 C-Scheme',
  },
  {
    id: 'sample-4',
    branch: 'IT',
    semester: 'Semester 5',
    subjectCode: 'ITC501',
    subject: 'Internet Programming',
    title: 'RESTful API Design, Node.js Backend & Full Stack Syllabus Notes',
    type: 'notes',
    scheme: 'Rev-2019 C-Scheme',
  },
];
