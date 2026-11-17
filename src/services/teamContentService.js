import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase-setup/firebase';
import { DEFAULT_HOME_CONTENT, getHomeContent } from './homeContentService';
import { hashPassword } from '../utils/encryptionUtils';

export const DEFAULT_FACULTY_CONTENT = {
  eyebrow: 'Faculty & Leadership',
  sectionTitle: 'Principal Investigator & Lab Director',
  directorName: DEFAULT_HOME_CONTENT.about.directorName || 'Dr. Apurva Narayan',
  directorTitle: DEFAULT_HOME_CONTENT.about.directorTitle || 'Principal Investigator & Lab Director',
  directorImage:
    DEFAULT_HOME_CONTENT.about.directorImage ||
    'https://github.com/a-narayan/a-narayan-old.github.io/blob/master/assets/profile/apurva.jpg?raw=true',
  directorBio:
    DEFAULT_HOME_CONTENT.about.directorBio ||
    'Dr. Apurva Narayan leads the IDSL research group. He is an Associate Professor in the Department of Computer Science & Electrical and Computer Engineering at Western University, Affiliate Associate Professor in Computer Science and School of Engineering at the University of British Columbia (UBC), and Adjunct Associate Professor in Systems Design Engineering at the University of Waterloo.',
  email: DEFAULT_HOME_CONTENT.about.email || 'apurva.narayan@uwo.ca',
  linkedin: DEFAULT_HOME_CONTENT.about.linkedin || 'https://www.linkedin.com/in/apurva-narayan-44308b17/',
  googleScholar: DEFAULT_HOME_CONTENT.about.googleScholar || 'https://scholar.google.com/citations?user=e5OCZ1cAAAAJ&hl=en',
  facultyDirectory: DEFAULT_HOME_CONTENT.about.facultyDirectory || 'https://www.csd.uwo.ca/people/faculty/faculty_members/narayan.html',
  affiliations: DEFAULT_HOME_CONTENT.about.affiliations || [
    { label: 'Western University', sub: 'CS & ECE' },
    { label: 'University of British Columbia', sub: 'CS & Engineering' },
    { label: 'University of Waterloo', sub: 'Systems Design' },
  ],
};

const CACHE_KEY = 'idsl_faculty_content_cache';

export const getFacultyContent = async () => {
  // 1. Try local cache first for instant render
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      // Background revalidation
      revalidateFacultyContent();
      const parsed = JSON.parse(cached);
      if (parsed?.directorBio) {
        parsed.directorBio = parsed.directorBio.replace(/Assis?stant\s+Professor/gi, 'Associate Professor');
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read faculty cache from localStorage:', err);
  }

  // 2. Query Firestore
  return await fetchFacultyFromFirestore();
};

const fetchFacultyFromFirestore = async () => {
  try {
    const docRef = doc(db, 'teamContent', 'teamContent');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().facultyLeader) {
      const merged = { ...DEFAULT_FACULTY_CONTENT, ...docSnap.data().facultyLeader };
      if (merged.directorBio) {
        merged.directorBio = merged.directorBio.replace(/Assis?stant\s+Professor/gi, 'Associate Professor');
      }
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (e) {}
      return merged;
    }

    // Fallback: check home content about section
    const homeContent = await getHomeContent();
    if (homeContent?.about) {
      const merged = {
        ...DEFAULT_FACULTY_CONTENT,
        directorName: homeContent.about.directorName || DEFAULT_FACULTY_CONTENT.directorName,
        directorTitle: homeContent.about.directorTitle || DEFAULT_FACULTY_CONTENT.directorTitle,
        directorImage: homeContent.about.directorImage || DEFAULT_FACULTY_CONTENT.directorImage,
        directorBio: homeContent.about.directorBio || DEFAULT_FACULTY_CONTENT.directorBio,
        email: homeContent.about.email || DEFAULT_FACULTY_CONTENT.email,
        linkedin: homeContent.about.linkedin || DEFAULT_FACULTY_CONTENT.linkedin,
        googleScholar: homeContent.about.googleScholar || DEFAULT_FACULTY_CONTENT.googleScholar,
        facultyDirectory: homeContent.about.facultyDirectory || DEFAULT_FACULTY_CONTENT.facultyDirectory,
        affiliations: homeContent.about.affiliations || DEFAULT_FACULTY_CONTENT.affiliations,
      };
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (e) {}
      return merged;
    }

    return DEFAULT_FACULTY_CONTENT;
  } catch (err) {
    console.error('Error reading faculty content from Firestore:', err);
    return DEFAULT_FACULTY_CONTENT;
  }
};

const revalidateFacultyContent = async () => {
  try {
    const fresh = await fetchFacultyFromFirestore();
    localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
  } catch (err) {
    // Ignore background revalidation failure
  }
};

export const saveFacultyContent = async (facultyData) => {
  const merged = { ...DEFAULT_FACULTY_CONTENT, ...facultyData };

  // 1. Save in teamContent/teamContent
  const docRef = doc(db, 'teamContent', 'teamContent');
  await setDoc(docRef, { facultyLeader: merged }, { merge: true });

  // 2. Also keep homeContent in sync for seamless consistency
  try {
    const homeDocRef = doc(db, 'homeContent', 'homeSections');
    await setDoc(
      homeDocRef,
      {
        about: {
          directorName: merged.directorName,
          directorTitle: merged.directorTitle,
          directorImage: merged.directorImage,
          directorBio: merged.directorBio,
          email: merged.email,
          linkedin: merged.linkedin,
          googleScholar: merged.googleScholar,
          facultyDirectory: merged.facultyDirectory,
          affiliations: merged.affiliations,
        },
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Could not sync faculty data to homeContent:', e);
  }

  // 3. Update local caches
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
    // also update home cache if present
    const homeCache = localStorage.getItem('idsl_home_content_cache');
    if (homeCache) {
      const parsedHome = JSON.parse(homeCache);
      parsedHome.about = { ...parsedHome.about, ...merged };
      localStorage.setItem('idsl_home_content_cache', JSON.stringify(parsedHome));
    }
  } catch (e) {}

  return merged;
};

/**
 * Updates or sets the login password for a faculty / PI account in the Firestore 'team' collection.
 * Ensures the password is cryptographically hashed with bcrypt and synced for admin console login.
 */
export const updateFacultyPassword = async ({ newPassword, email, name, currentAdminId }) => {
  const pwd = String(newPassword || '').trim();
  if (!pwd) {
    throw new Error('Password cannot be empty.');
  }
  if (pwd.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const hashedPassword = await hashPassword(pwd);
  let updatedDocCount = 0;
  const facultyEmail = String(email || 'apurva.narayan@uwo.ca').toLowerCase().trim();
  const facultyName = String(name || 'Dr. Apurva Narayan').trim();

  // 1. Try updating by current logged in admin user ID if available
  if (currentAdminId) {
    try {
      const adminDocRef = doc(db, 'team', currentAdminId);
      const adminSnap = await getDoc(adminDocRef);
      if (adminSnap.exists()) {
        await updateDoc(adminDocRef, {
          password: hashedPassword,
          emailId: facultyEmail,
        });
        updatedDocCount++;
      }
    } catch (e) {
      console.warn('Could not update admin doc by ID:', e);
    }
  }

  // 2. Query team collection for matching emailId
  try {
    const qEmail = query(collection(db, 'team'), where('emailId', '==', facultyEmail));
    const snapEmail = await getDocs(qEmail);
    for (const d of snapEmail.docs) {
      if (d.id !== currentAdminId) {
        await updateDoc(doc(db, 'team', d.id), { password: hashedPassword });
        updatedDocCount++;
      }
    }
  } catch (e) {
    console.warn('Could not query team by email:', e);
  }

  // 3. If no doc was found by ID or email, check for any doc with userType == 'admin'
  if (updatedDocCount === 0) {
    try {
      const qAdmin = query(collection(db, 'team'), where('userType', '==', 'admin'));
      const snapAdmin = await getDocs(qAdmin);
      for (const d of snapAdmin.docs) {
        await updateDoc(doc(db, 'team', d.id), {
          password: hashedPassword,
          emailId: facultyEmail,
        });
        updatedDocCount++;
      }
    } catch (e) {
      console.warn('Could not query team by userType admin:', e);
    }
  }

  // 4. If still not found in 'team', create the admin record in 'team' so login succeeds
  if (updatedDocCount === 0) {
    try {
      await addDoc(collection(db, 'team'), {
        name: facultyName,
        emailId: facultyEmail,
        password: hashedPassword,
        userType: 'admin',
        degree: 'Faculty',
        isAlumni: false,
      });
      updatedDocCount++;
    } catch (e) {
      console.error('Could not create admin doc in team:', e);
    }
  }

  // 5. Also record lastPasswordChange timestamp in teamContent/teamContent
  try {
    const contentRef = doc(db, 'teamContent', 'teamContent');
    await setDoc(
      contentRef,
      {
        facultyLeader: {
          lastPasswordChange: new Date().toISOString(),
        },
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Could not update teamContent password timestamp:', e);
  }

  return { success: true, count: updatedDocCount };
};


