import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-setup/firebase';

export const DEFAULT_OPPORTUNITIES_CONTENT = {
  header: {
    eyebrow: 'Careers & Prospective Students',
    title: 'Join the IDSL Research Group',
    description:
      'We are actively seeking exceptionally driven graduate students and postdoctoral scholars interested in AI safety, data science, and cyber-physical systems.',
  },
  financialSupport: {
    title: 'Full Financial Support & Competitive Stipend',
    description:
      'All admitted PhD and research Master\'s students receive comprehensive tuition coverage and competitive living stipends through research grants and teaching assistantships.',
  },
  openPositions: {
    title: 'Open Positions',
    subtitle: 'Review current roles and upcoming opportunities across our university campuses.',
    positions: [
      {
        id: 'pos-1',
        role: 'PhD Positions (Funded)',
        terms: 'Full-time · Competitive Stipend Provided',
        focus: 'Cyber-physical systems safety, formal methods, specification mining, robust machine learning.',
        tag: 'OPEN',
      },
      {
        id: 'pos-2',
        role: 'Postdoctoral Fellowships',
        terms: '1-2 Years · Full-time',
        focus: 'Theoretical foundations of neural verification, industrial automation telemetry, and fault diagnosis.',
        tag: 'OPEN',
      },
      {
        id: 'pos-3',
        role: "Master's (MASc / MSc / MEng)",
        terms: 'Full-time Research',
        focus: 'Applied machine learning, anomaly detection, predictive maintenance in automotive & smart plants.',
        tag: 'OPEN',
      },
      {
        id: 'pos-4',
        role: 'Undergraduate Researchers (USRA / Internships)',
        terms: 'Summer / Term-time',
        focus: 'Software tool building, benchmarking datasets, dashboard engineering, and experimental reproduction.',
        tag: 'OPEN',
      },
    ],
  },
  applicationInstructions: {
    title: 'Application Instructions',
    description: 'To express your interest in joining IDSL, please prepare an email to Dr. Apurva Narayan including:',
    checklist: [
      'Curriculum Vitae (CV) / Resume highlighting relevant coursework and projects',
      'Unofficial Academic Transcripts (undergraduate and/or graduate)',
      'Brief Statement of Research Intent (1-2 pages explaining alignment with IDSL)',
      'Sample Code, Published Papers, or GitHub repository links (if applicable)',
      'Names and contact info for 2-3 academic or professional references',
    ],
    contactEmail: 'apurva.narayan@uwo.ca',
    emailSubject: 'IDSL Prospective Student Application - [Your Name]',
    buttonText: 'Submit Application by Email',
  },
};

const CACHE_KEY = 'idsl_opportunities_content_cache';
const OPPORTUNITIES_DOC_PATH = ['opportunitiesContent', 'opportunitiesSections'];

/**
 * Retrieves the opportunities page content from Firestore, falling back to cache or defaults.
 */
export const getOpportunitiesContent = async () => {
  // 1. Try local cache first for instant render
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      revalidateOpportunitiesContent();
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn('Could not read opportunities cache from localStorage:', err);
  }

  // 2. Query Firestore
  return await fetchOpportunitiesFromFirestore();
};

const fetchOpportunitiesFromFirestore = async () => {
  try {
    const docRef = doc(db, OPPORTUNITIES_DOC_PATH[0], OPPORTUNITIES_DOC_PATH[1]);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const merged = {
        header: { ...DEFAULT_OPPORTUNITIES_CONTENT.header, ...(data.header || {}) },
        financialSupport: { ...DEFAULT_OPPORTUNITIES_CONTENT.financialSupport, ...(data.financialSupport || {}) },
        openPositions: {
          ...DEFAULT_OPPORTUNITIES_CONTENT.openPositions,
          ...(data.openPositions || {}),
          positions: data.openPositions?.positions || DEFAULT_OPPORTUNITIES_CONTENT.openPositions.positions,
        },
        applicationInstructions: {
          ...DEFAULT_OPPORTUNITIES_CONTENT.applicationInstructions,
          ...(data.applicationInstructions || {}),
          checklist: data.applicationInstructions?.checklist || DEFAULT_OPPORTUNITIES_CONTENT.applicationInstructions.checklist,
        },
      };

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (e) {}
      return merged;
    }

    return DEFAULT_OPPORTUNITIES_CONTENT;
  } catch (err) {
    console.error('Error reading opportunities content from Firestore:', err);
    return DEFAULT_OPPORTUNITIES_CONTENT;
  }
};

const revalidateOpportunitiesContent = async () => {
  try {
    const fresh = await fetchOpportunitiesFromFirestore();
    localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
  } catch (err) {
    // Ignore background revalidation failure
  }
};

/**
 * Saves updated opportunities page content into Firestore.
 */
export const saveOpportunitiesContent = async (newContent) => {
  const docRef = doc(db, OPPORTUNITIES_DOC_PATH[0], OPPORTUNITIES_DOC_PATH[1]);
  await setDoc(docRef, newContent, { merge: true });

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(newContent));
  } catch (err) {
    console.warn('Could not write opportunities cache to localStorage:', err);
  }

  return newContent;
};

