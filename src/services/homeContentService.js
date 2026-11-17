import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-setup/firebase';

export const DEFAULT_HOME_CONTENT = {
  about: {
    eyebrow: 'Leadership & Vision',
    title: 'About IDSL',
    description:
      'We develop novel algorithmic foundations and machine learning models to solve high-impact, mission-critical problems in cyber-physical safety, formal specification mining, and resilient autonomous systems.',
    directorName: 'Dr. Apurva Narayan',
    directorTitle: 'Principal Investigator & Lab Director',
    directorImage:
      'https://github.com/a-narayan/a-narayan-old.github.io/blob/master/assets/profile/apurva.jpg?raw=true',
    directorBio:
      'Dr. Apurva Narayan leads the IDSL research group. He is an Associate Professor in the Department of Computer Science & Electrical and Computer Engineering at Western University, Affiliate Associate Professor in Computer Science and School of Engineering at the University of British Columbia (UBC), and Adjunct Associate Professor in Systems Design Engineering at the University of Waterloo.',
    email: 'apurva.narayan@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/apurva-narayan-44308b17/',
    googleScholar: 'https://scholar.google.com/citations?user=e5OCZ1cAAAAJ&hl=en',
    facultyDirectory: 'https://www.csd.uwo.ca/people/faculty/faculty_members/narayan.html',
    affiliations: [
      { label: 'Western University', sub: 'CS & ECE' },
      { label: 'University of British Columbia', sub: 'CS & Engineering' },
      { label: 'University of Waterloo', sub: 'Systems Design' },
    ],
  },
  research: {
    eyebrow: 'Research Focus',
    title: 'IDSL Research',
    description:
      'Pioneering algorithmic foundations and resilient architectures across automated reasoning, formal verification, machine learning, and safe cyber-physical systems.',
    areas: [
      {
        id: 'cps-mining',
        tag: 'DATA ANALYTICS & CPS',
        title: 'Data Analytics & Complex CPS Mining',
        imageUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
        description:
          'Extracting behavioral models and anomaly patterns from complex time-series telemetry and distributed industrial IoT sensors to isolate faults and monitor system health.',
      },
      {
        id: 'formal-verification',
        tag: 'FORMAL METHODS & SAFETY',
        title: 'Software Engineering & Formal Verification',
        imageUrl:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80',
        description:
          'Synthesizing formal temporal logic specifications from real-world execution traces to mathematically certify software reliability and prevent safety-critical failures.',
      },
      {
        id: 'predictive-ml',
        tag: 'MACHINE LEARNING & AI',
        title: 'Machine Learning & Predictive Analytics',
        imageUrl:
          'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=700&q=80',
        description:
          'Designing scalable machine learning architectures, automated reasoning pipelines, and reinforcement learning for robust decision-making under domain shift and uncertainty.',
      },
      {
        id: 'trustworthy-ai',
        tag: 'CERTIFIED & SECURE AI',
        title: 'Trustworthy & Safe Cyber-Physical AI',
        imageUrl:
          'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=700&q=80',
        description:
          'Pioneering perturbation bounds, certified adversarial defenses, and provable safety bounds for deep learning models operating in autonomous and critical environments.',
      },
    ],
  },
  collaborators: {
    title: 'Key Academic & Industry Collaborators',
    items: [
      {
        id: 'western',
        name: 'Western University',
        category: 'Academic Partner',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Western_ontario_univ_textlogo.svg',
        fallbackUrl: '/assets/logos/western.svg',
        maxHeight: 28,
      },
      {
        id: 'ubc',
        name: 'University of British Columbia',
        category: 'Academic Partner',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/British_columbia_ca_univ_logo.svg',
        fallbackUrl: '/assets/logos/ubc.svg',
        maxHeight: 30,
      },
      {
        id: 'waterloo',
        name: 'University of Waterloo',
        category: 'Academic Partner',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/University_of_Waterloo_wordmark.svg',
        fallbackUrl: '/assets/logos/waterloo.svg',
        maxHeight: 26,
      },
      {
        id: 'microsoft',
        name: 'Microsoft',
        category: 'Cloud & AI',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
        fallbackUrl: '/assets/logos/microsoft.svg',
        maxHeight: 26,
      },
      {
        id: 'gm',
        name: 'General Motors',
        category: 'Automotive CPS',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/General_Motors_%282021%29.svg',
        fallbackUrl: '/assets/logos/gm.svg',
        maxHeight: 30,
      },
      {
        id: 'scotiabank',
        name: 'Scotiabank',
        category: 'Financial Telemetry',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Scotiabank_logo.svg',
        fallbackUrl: '/assets/logos/scotiabank.svg',
        maxHeight: 28,
      },
      {
        id: 'loblaw',
        name: 'Loblaw',
        category: 'Retail Analytics',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Loblaw-Companies-Logo.svg',
        fallbackUrl: '/assets/logos/loblaw.svg',
        maxHeight: 28,
      },
      {
        id: 'trojai',
        name: 'TrojAI Inc.',
        category: 'AI Safety & Security',
        logoUrl: 'https://logosandtypes.com/wp-content/uploads/2024/11/trojai.svg',
        fallbackUrl: '/assets/logos/trojai.svg',
        maxHeight: 28,
      },
      {
        id: 'palitronica',
        name: 'Palitronica',
        category: 'Hardware Security',
        logoUrl: '/assets/logos/palitronica.svg',
        fallbackUrl: '/assets/logos/palitronica.svg',
        maxHeight: 28,
      },
    ],
  },
};

const CACHE_KEY = 'idsl_home_content_cache';

/**
 * Retrieves the home page content from Firestore, falling back to cached or default content.
 */
export async function getHomeContent() {
  try {
    const docRef = doc(db, 'homeContent', 'homeSections');
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const merged = {
        about: { ...DEFAULT_HOME_CONTENT.about, ...(data.about || {}) },
        research: {
          ...DEFAULT_HOME_CONTENT.research,
          ...(data.research || {}),
          areas: Array.isArray(data.research?.areas) && data.research.areas.length > 0
            ? data.research.areas
            : DEFAULT_HOME_CONTENT.research.areas,
        },
        collaborators: {
          ...DEFAULT_HOME_CONTENT.collaborators,
          ...(data.collaborators || {}),
          items: Array.isArray(data.collaborators?.items) && data.collaborators.items.length > 0
            ? data.collaborators.items
            : DEFAULT_HOME_CONTENT.collaborators.items,
        },
      };

      if (merged.about?.directorBio) {
        merged.about.directorBio = merged.about.directorBio.replace(/Assis?stant\s+Professor/gi, 'Associate Professor');
      }

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (e) {
        // storage quota ignored
      }
      return merged;
    }
  } catch (err) {
    console.warn('Could not fetch homeContent from Firestore, using cache/defaults:', err.message);
  }

  // Fallback to cache if available
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.about?.directorBio) {
        parsed.about.directorBio = parsed.about.directorBio.replace(/Assis?stant\s+Professor/gi, 'Associate Professor');
      }
      return parsed;
    }
  } catch (e) {
    // ignore
  }

  return DEFAULT_HOME_CONTENT;
}

/**
 * Saves updated home content to Firestore.
 */
export async function saveHomeContent(newContent) {
  const docRef = doc(db, 'homeContent', 'homeSections');
  await setDoc(docRef, newContent, { merge: true });

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(newContent));
  } catch (e) {
    // ignore
  }

  return newContent;
}

