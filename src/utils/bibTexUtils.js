import bibtexParse from 'bibtex-parse-js';

const parseBibTeX = (bibtexEntry) => {
    const parsedEntries = bibtexParse.toJSON(bibtexEntry);
    if (parsedEntries.length > 0) {
        const entry = parsedEntries[0].entryTags;
        return entry;
    }
    return null;
};

export {
    parseBibTeX
};