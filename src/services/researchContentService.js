import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-setup/firebase';

export const DEFAULT_RESEARCH_CONTENT = {
  header: {
    eyebrow: 'Research & Innovation',
    title: 'Autonomous, Safe, and Resilient Systems',
    description:
      'The IDSL Lab conducts research at the intersection of software engineering, data analytics, machine learning, and formal safety/security of modern cyber-physical infrastructure.',
  },
  focusAreas: {
    title: 'Key Research Focus Areas',
    subtitle:
      'We formulate rigorous theoretical frameworks and engineer robust open-source tools to tackle industrial automation challenges.',
    topics: [
      {
        id: 'topic-1',
        title: 'Robustness Certification of AI Models',
        desc: 'Formal verification, perturbation bounds, and mathematical certification of deep learning in safety-critical automated environments.',
        iconType: 'verified',
      },
      {
        id: 'topic-2',
        title: 'Data Mining for Complex CPS',
        desc: 'Mining temporal logic specifications and behavioral models from multimodal time-series and sensor telemetry in industrial plants.',
        iconType: 'memory',
      },
      {
        id: 'topic-3',
        title: 'Automated Fault Detection & Diagnosis',
        desc: 'Real-time root-cause isolation and predictive health monitoring for mission-critical automation systems.',
        iconType: 'manufacturing',
      },
      {
        id: 'topic-4',
        title: 'Predictive Analytics & Decision Making',
        desc: 'Reinforcement learning and probabilistic decision pipelines under severe domain uncertainty and distribution shift.',
        iconType: 'insights',
      },
    ],
  },
  applicationDomains: {
    title: 'Application Domains',
    subtitle:
      'A significant subset of our projects carry immediate industrial utility. We partner directly with domain practitioners.',
    domains: [
      'Industrial Smart Plants & Automation',
      'Automotive & Connected Cyber-Physical Systems',
      'Safety-Critical Autonomous Software',
      'AI-Enabled Digital Healthcare',
      'Financial Telemetry & Fraud Intelligence',
      'Supply Chain & Smart Logistics',
    ],
  },
};

const CACHE_KEY = 'idsl_research_content_cache';

/**
 * Retrieves the research page content from Firestore, falling back to cache or defaults.
 */
export async function getResearchContent() {
  try {
    const docRef = doc(db, 'researchContent', 'researchSections');
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const merged = {
        header: { ...DEFAULT_RESEARCH_CONTENT.header, ...(data.header || {}) },
        focusAreas: {
          ...DEFAULT_RESEARCH_CONTENT.focusAreas,
          ...(data.focusAreas || {}),
          topics:
            Array.isArray(data.focusAreas?.topics) && data.focusAreas.topics.length > 0
              ? data.focusAreas.topics
              : DEFAULT_RESEARCH_CONTENT.focusAreas.topics,
        },
        applicationDomains: {
          ...DEFAULT_RESEARCH_CONTENT.applicationDomains,
          ...(data.applicationDomains || {}),
          domains:
            Array.isArray(data.applicationDomains?.domains) && data.applicationDomains.domains.length > 0
              ? data.applicationDomains.domains
              : DEFAULT_RESEARCH_CONTENT.applicationDomains.domains,
        },
      };

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (e) {
        // storage quota ignored
      }
      return merged;
    }
  } catch (err) {
    console.warn('Could not fetch researchContent from Firestore, using cache/defaults:', err.message);
  }

  // Fallback to cache if available
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // ignore
  }

  return DEFAULT_RESEARCH_CONTENT;
}

/**
 * Saves updated research content to Firestore.
 */
export async function saveResearchContent(newContent) {
  const docRef = doc(db, 'researchContent', 'researchSections');
  await setDoc(docRef, newContent, { merge: true });

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(newContent));
  } catch (e) {
    // ignore
  }

  return newContent;
}

