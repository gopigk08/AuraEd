import md5 from 'crypto-js/md5';

export const getGravatarUrl = (email) => {
    const defaultImage = '404'; // Return 404 if no image found, so we can fallback to initials
    if (!email) return `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=${defaultImage}`;

    const address = String(email).trim().toLowerCase();
    const hash = md5(address);
    return `https://www.gravatar.com/avatar/${hash}?d=${defaultImage}`;
};
