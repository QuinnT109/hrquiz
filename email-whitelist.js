/*
 * Approved participant emails are stored as SHA-256 hashes of normalized
 * lowercase email addresses rather than as readable addresses in the site.
 * This file intentionally denies certificate access until the approved list
 * is populated.
 */
window.HRM_ALLOWED_EMAIL_HASHES=Object.freeze([]);
