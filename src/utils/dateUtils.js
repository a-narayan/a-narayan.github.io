const formatTimestamp = (timestamp) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return timestamp.toDate().toLocaleDateString("en-US", options);
}

export {
    formatTimestamp
}