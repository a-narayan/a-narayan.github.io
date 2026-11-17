/**
 * Academic Publication Scraper & Sync Tool for IDSL Lab
 * Pulls and synchronizes all publications for Dr. Apurva Narayan across:
 * - Google Scholar (User ID: e5OCZ1cAAAAJ)
 * - OpenAlex API (ORCID: 0000-0001-7203-8698)
 * - Semantic Scholar API (Author ID: 2112443048)
 * - DBLP Bibliography API (author: "Apurva_Narayan")
 *
 * Saves output to: public/data/publications.json
 * Run with: npm run sync:publications
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SCHOLAR_USER_ID = 'e5OCZ1cAAAAJ';
const ORCID = '0000-0001-7203-8698';
const SEMANTIC_SCHOLAR_ID = '2112443048';
const DBLP_QUERY = 'author:%22Apurva_Narayan%22';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'publications.json');

function httpsGet(url, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json, text/html, */*',
        ...customHeaders,
      },
    };

    const req = https.request(options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location, customHeaders).then(resolve).catch(reject);
      }

      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 100)}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.end();
  });
}

const IDSL_COAUTHORS = [
  'devulapalli',
  'agrawal',
  'khanal',
  'satsangi',
  'faid',
  'sharma',
  'zhang',
  'sarkar',
  'ranade',
  'kumar',
  'lahourpour',
  'fischmeister',
  'capretz',
  'azad',
  'senevirathne',
  'tissera',
  'gupta',
  'parmar',
  'munz',
  'telila',
  'kalra',
  'basu',
  'youssef',
  'asrani',
  'el-shawa',
  'anil',
  'vinod',
  'marksteiner',
  'hasan',
];

const VERIFIED_INSTITUTIONS = [
  'western',
  'uwo',
  'british columbia',
  'ubc',
  'waterloo',
  'dayalbagh',
  'dei',
  'idsl',
  'ontario',
];

const DISQUALIFIED_DOMAINS = [
  'concrete',
  'cement',
  'geotechnical',
  'soil mechanics',
  'asphalt',
  'civil engineering',
  'structural design',
  'dentist',
  'dental',
  'orthodont',
  'endodont',
  'periodont',
  'oral surgery',
  'prosthodont',
  'oncology',
  'dermatolog',
  'botany',
  'agronom',
  'crop yield',
  'fertilizer',
  'agriculture',
  'pathology',
  'fibrosis',
  'masld',
];

const CS_DOMAINS = [
  'machine learning',
  'artificial intelligence',
  'deep learning',
  'neural',
  'cyber-physical',
  'cps',
  'iot',
  'software',
  'transformer',
  'adversarial',
  'llm',
  'language model',
  'vision',
  'reinforcement',
  'formal methods',
  'runtime',
  'data science',
  'time series',
  'anomaly',
  'robot',
  'manufacturing',
  'embedded',
  'distributed',
  'byzantine',
  'sensor',
  'computer science',
  'aamas',
  'aaai',
  'wacv',
  'kdd',
  'iclr',
  'neurips',
  'icml',
  'ieee',
  'acm',
];

const EXCLUDED_PUBLICATIONS = [
  'synthia: a multi-agent gan-llm fusion for statistically guided synthetic data generation',
];

function isVerifiedIDSLPaper(pub) {
  if (!pub || !pub.title) return false;

  const normTitle = (pub.title || '').trim().toLowerCase();
  if (EXCLUDED_PUBLICATIONS.some((ex) => normTitle.includes(ex) || ex.includes(normTitle))) {
    return false;
  }

  if (!hasApurvaNarayanAsAuthor(pub.authors, pub.authorships || pub.authorsList)) {
    return false;
  }

  const titleVenue = `${pub.title} ${pub.venue || ''} ${pub.topic || ''}`.toLowerCase();
  const authorText = (pub.authors || '').toLowerCase();
  const affilText = (pub.affiliations || pub.institution || authorText).toLowerCase();

  const isDisqualified = DISQUALIFIED_DOMAINS.some((dq) => titleVenue.includes(dq));
  const hasIDSLCoAuthor = IDSL_COAUTHORS.some((co) => authorText.includes(co));

  if (isDisqualified && !hasIDSLCoAuthor) {
    return false;
  }

  if (hasIDSLCoAuthor) {
    return true;
  }

  if (VERIFIED_INSTITUTIONS.some((inst) => affilText.includes(inst))) {
    return true;
  }

  if (pub.source === 'orcid' || pub.source === 'dblp' || pub.source === 's2' || pub.source === 'snapshot') {
    if (!isDisqualified) {
      return true;
    }
  }

  return CS_DOMAINS.some((kw) => titleVenue.includes(kw));
}

function normalizeTitle(title = '') {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function isApurvaName(nameStr = '') {
  if (!nameStr || typeof nameStr !== 'string') return false;
  const clean = nameStr
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (
    clean === 'apurva narayan' ||
    clean === 'a narayan' ||
    clean === 'narayan apurva' ||
    clean === 'narayan a' ||
    clean === 'apurv narayan' ||
    clean === 'apurva k narayan' ||
    clean === 'narayan apurva k' ||
    clean === 'dr apurva narayan'
  ) {
    return true;
  }

  if (
    clean.startsWith('apurva narayan ') ||
    clean.endsWith(' apurva narayan') ||
    clean.includes(' apurva narayan ') ||
    clean.startsWith('a narayan ') ||
    clean.endsWith(' a narayan') ||
    clean.includes(' a narayan ') ||
    clean.startsWith('narayan apurva ') ||
    clean.endsWith(' narayan apurva')
  ) {
    return true;
  }

  return false;
}

function hasApurvaNarayanAsAuthor(authorsStr = '', authorsArray = []) {
  if (Array.isArray(authorsArray) && authorsArray.length > 0) {
    const hasMatch = authorsArray.some((a) => {
      const name =
        typeof a === 'string'
          ? a
          : a.author?.display_name || a.raw_author_name || a.name || a.text || '';
      return isApurvaName(name);
    });
    if (hasMatch) return true;
  }

  if (typeof authorsStr === 'string' && authorsStr.trim()) {
    if (authorsStr.includes(';') || /\band\b/i.test(authorsStr)) {
      const parts = authorsStr.split(/;|\band\b/i);
      if (parts.some((p) => isApurvaName(p.trim()))) return true;
    }

    const cleanFull = authorsStr.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ');
    if (
      cleanFull.includes('apurva narayan') ||
      cleanFull.includes('narayan apurva') ||
      cleanFull.includes('apurva k narayan')
    ) {
      return true;
    }

    const parts = authorsStr.split(',');
    if (parts.some((p) => isApurvaName(p.trim()))) return true;
  }

  return false;
}

function determineTopic(title = '', venue = '') {
  const text = `${title} ${venue}`.toLowerCase();
  if (
    text.includes('llm') ||
    text.includes('language model') ||
    text.includes('hermes') ||
    text.includes('rag') ||
    text.includes('multi-agent') ||
    text.includes('diffusion') ||
    text.includes('synthia') ||
    text.includes('specmas')
  ) {
    return 'Agentic AI & LLMs';
  }
  if (
    text.includes('adversarial') ||
    text.includes('robust') ||
    text.includes('safe') ||
    text.includes('security') ||
    text.includes('certification') ||
    text.includes('defence') ||
    text.includes('defense') ||
    text.includes('patch') ||
    text.includes('vulnerability') ||
    text.includes('threat') ||
    text.includes('zero-day') ||
    text.includes('secure')
  ) {
    return 'Trustworthy & Safe AI';
  }
  if (
    text.includes('cyber-physical') ||
    text.includes('cps') ||
    text.includes('trace') ||
    text.includes('timed regular') ||
    text.includes('boot') ||
    text.includes('specification') ||
    text.includes('embedded') ||
    text.includes('sensor') ||
    text.includes('log') ||
    text.includes('anomaly') ||
    text.includes('iot')
  ) {
    return 'Cyber-Physical Systems & IoT';
  }
  if (
    text.includes('manufacturing') ||
    text.includes('composite') ||
    text.includes('robot') ||
    text.includes('reachy') ||
    text.includes('industrial')
  ) {
    return 'Smart Manufacturing & Robotics';
  }
  return 'Machine Learning & Analytics';
}

function generateBibTeX(pub) {
  const authorTag = (pub.authors || 'Narayan')
    .split(',')[0]
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase();
  const yearTag = pub.year || '2026';
  return `@article{${authorTag}${yearTag},
  title={${pub.title}},
  author={${pub.authors}},
  journal={${pub.venue}},
  year={${yearTag}}
}`;
}

/**
 * 1. Scrape Google Scholar HTML profile
 */
async function scrapeGoogleScholar() {
  const papers = [];
  try {
    const url = `https://scholar.google.com/citations?user=${SCHOLAR_USER_ID}&hl=en&cstart=0&pagesize=100`;
    const html = await httpsGet(url);

    // Regex parse Google Scholar table rows: <tr class="gsc_a_tr">...</tr>
    const rowRegex = /<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g;
    let match;

    while ((match = rowRegex.exec(html)) !== null) {
      const rowContent = match[1];

      // Title & Link
      const titleMatch = rowContent.match(/<a[^>]*class="gsc_a_at"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
      // Authors & Venue
      const metaMatch = rowContent.match(/<div class="gs_gray">([\s\S]*?)<\/div>\s*<div class="gs_gray">([\s\S]*?)<\/div>/);
      // Citations
      const citeMatch = rowContent.match(/<a[^>]*class="gsc_a_ac[^"]*"[^>]*>(\d+)<\/a>/);
      // Year
      const yearMatch = rowContent.match(/<span class="gsc_a_h[^"]*">(\d{4})<\/span>/);

      if (titleMatch) {
        const rawTitle = titleMatch[2].replace(/<[^>]+>/g, '').trim();
        const relativeLink = titleMatch[1];
        const authors = metaMatch ? metaMatch[1].replace(/<[^>]+>/g, '').trim() : 'Apurva Narayan';
        const venue = metaMatch ? metaMatch[2].replace(/<[^>]+>/g, '').trim() : 'Academic Proceedings';
        const citations = citeMatch ? parseInt(citeMatch[1], 10) : 0;
        const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

        papers.push({
          id: `gs-${Math.random().toString(36).substring(7)}`,
          title: rawTitle,
          authors: authors,
          venue: venue,
          year: year,
          citations: citations,
          type: venue.toLowerCase().includes('journal') || venue.toLowerCase().includes('ieee trans') ? 'Journal' : 'Conference',
          topic: determineTopic(rawTitle, venue),
          scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(rawTitle)}`,
        });
      }
    }
    console.log(`[Google Scholar] Scraped ${papers.length} publications.`);
  } catch (err) {
    console.warn('[Google Scholar] Scrape note:', err.message);
  }
  return papers;
}

/**
 * 2. Fetch OpenAlex API
 */
async function fetchOpenAlex() {
  const papers = [];
  try {
    const url = `https://api.openalex.org/works?filter=author.orcid:${ORCID}&sort=publication_year:desc&per_page=100`;
    const dataStr = await httpsGet(url);
    const data = JSON.parse(dataStr);

    if (Array.isArray(data?.results)) {
      data.results.forEach((work) => {
        if (!work.title) return;
        const authors = (work.authorships || [])
          .map((a) => a.author?.display_name || a.raw_author_name)
          .filter(Boolean)
          .join(', ');

        const venue =
          work.primary_location?.source?.display_name ||
          work.host_venue?.display_name ||
          'Academic Proceedings';

        papers.push({
          id: `openalex-${work.id?.replace(/.*\//, '') || Math.random().toString(36).substring(7)}`,
          title: work.title.replace(/\.$/, '').trim(),
          authors: authors || 'Apurva Narayan',
          venue: venue,
          year: work.publication_year || new Date().getFullYear(),
          citations: work.cited_by_count || 0,
          type: work.type === 'journal-article' ? 'Journal' : 'Conference',
          topic: determineTopic(work.title, venue),
          scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(work.title)}`,
          pdfUrl: work.open_access?.oa_url || work.primary_location?.pdf_url || '',
          doi: work.doi || '',
        });
      });
      console.log(`[OpenAlex] Fetched ${data.results.length} publications.`);
    }
  } catch (err) {
    console.warn('[OpenAlex] Fetch note:', err.message);
  }
  return papers;
}

/**
 * 3. Fetch Semantic Scholar
 */
async function fetchSemanticScholar() {
  const papers = [];
  try {
    const url = `https://api.semanticscholar.org/graph/v1/author/${SEMANTIC_SCHOLAR_ID}/papers?fields=title,year,citationCount,venue,publicationTypes,authors,url,openAccessPdf,externalIds&limit=100`;
    const dataStr = await httpsGet(url);
    const data = JSON.parse(dataStr);

    if (Array.isArray(data?.data)) {
      data.data.forEach((paper) => {
        if (!paper.title) return;
        const authors = (paper.authors || []).map((a) => a.name).join(', ');
        const venue = paper.venue || 'Academic Venue';

        papers.push({
          id: `s2-${paper.paperId || Math.random().toString(36).substring(7)}`,
          title: paper.title.replace(/\.$/, '').trim(),
          authors: authors || 'Apurva Narayan',
          venue: venue,
          year: paper.year || new Date().getFullYear(),
          citations: paper.citationCount || 0,
          type: paper.publicationTypes?.includes('JournalArticle') ? 'Journal' : 'Conference',
          topic: determineTopic(paper.title, venue),
          scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`,
          pdfUrl: paper.openAccessPdf?.url || (paper.externalIds?.ArXiv ? `https://arxiv.org/abs/${paper.externalIds.ArXiv}` : ''),
          doi: paper.externalIds?.DOI ? `https://doi.org/${paper.externalIds.DOI}` : '',
        });
      });
      console.log(`[Semantic Scholar] Fetched ${data.data.length} publications.`);
    }
  } catch (err) {
    console.warn('[Semantic Scholar] Fetch note:', err.message);
  }
  return papers;
}

/**
 * 4. Fetch DBLP
 */
async function fetchDBLP() {
  const papers = [];
  try {
    const url = `https://dblp.org/search/publ/api?q=${DBLP_QUERY}&format=json&h=150`;
    const dataStr = await httpsGet(url);
    const json = JSON.parse(dataStr);
    const hits = json?.result?.hits?.hit;

    if (Array.isArray(hits)) {
      hits.forEach((hit) => {
        const info = hit.info;
        if (!info || !info.title) return;

        const rawTitle = info.title.replace(/\.$/, '').trim();
        let authorStr = 'Apurva Narayan';
        if (info.authors && info.authors.author) {
          const auths = Array.isArray(info.authors.author)
            ? info.authors.author.map((a) => (typeof a === 'string' ? a : a.text || ''))
            : [info.authors.author.text || ''];
          authorStr = auths.join(', ');
        }

        const yearVal = parseInt(info.year, 10) || new Date().getFullYear();
        const venue = info.venue || info.journal || info.booktitle || 'Computer Science Proceedings';

        papers.push({
          id: `dblp-${info.key || Math.random().toString(36).substring(7)}`,
          title: rawTitle,
          authors: authorStr,
          venue: venue,
          year: yearVal,
          citations: 0,
          type: info.type === 'Journal Articles' || info.journal ? 'Journal' : 'Conference',
          topic: determineTopic(rawTitle, venue),
          scholarUrl: `https://scholar.google.com/scholar?q=${encodeURIComponent(rawTitle)}`,
          doi: info.doi ? `https://doi.org/${info.doi}` : info.ee || '',
        });
      });
      console.log(`[DBLP] Fetched ${hits.length} publications.`);
    }
  } catch (err) {
    console.warn('[DBLP] Fetch note:', err.message);
  }
  return papers;
}

/**
 * Main Orchestrator
 */
async function main() {
  console.log('--- Starting IDSL Publications Sync ---');

  // Load existing file if present as baseline
  let existing = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (e) {}
  }

  const [gsPubs, oaPubs, s2Pubs, dblpPubs] = await Promise.all([
    scrapeGoogleScholar(),
    fetchOpenAlex(),
    fetchSemanticScholar(),
    fetchDBLP(),
  ]);

  const map = new Map();

  const merge = (pub) => {
    if (!pub || !pub.title) return;
    if (!isVerifiedIDSLPaper(pub)) return;
    const key = normalizeTitle(pub.title);
    if (!key) return;

    if (!map.has(key)) {
      map.set(key, {
        ...pub,
        bibtex: pub.bibtex || generateBibTeX(pub),
      });
    } else {
      const cur = map.get(key);
      const maxCites = Math.max(cur.citations || 0, pub.citations || 0);
      let bestAuthors = cur.authors;
      if (pub.authors && pub.authors.length > (cur.authors || '').length) {
        bestAuthors = pub.authors;
      }

      map.set(key, {
        ...cur,
        citations: maxCites,
        authors: bestAuthors,
        venue: cur.venue || pub.venue,
        year: Math.max(cur.year || 0, pub.year || 0) || cur.year,
        doi: cur.doi || pub.doi,
        pdfUrl: cur.pdfUrl || pub.pdfUrl,
        scholarUrl: cur.scholarUrl || pub.scholarUrl,
        type: cur.type || pub.type,
        topic: cur.topic || pub.topic || determineTopic(cur.title, cur.venue),
        bibtex: cur.bibtex || pub.bibtex || generateBibTeX(cur),
      });
    }
  };

  // Merge order: existing -> DBLP -> Semantic Scholar -> OpenAlex -> Google Scholar
  existing.forEach(merge);
  dblpPubs.forEach(merge);
  s2Pubs.forEach(merge);
  oaPubs.forEach(merge);
  gsPubs.forEach(merge);

  const merged = Array.from(map.values());
  merged.sort((a, b) => (b.year || 0) - (a.year || 0) || (b.citations || 0) - (a.citations || 0));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(merged, null, 2), 'utf8');

  console.log(`\n Successfully synchronized ${merged.length} publications!`);
  console.log(` Saved to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});

