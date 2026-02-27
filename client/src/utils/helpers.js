export const getYouTubeVideoId = (url) => {
    if (!url) return null;

    let videoId = '';

    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1];
    } else {
        return null;
    }

    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
    }
    const questionMarkPosition = videoId.indexOf('?');
    if (questionMarkPosition !== -1) {
        videoId = videoId.substring(0, questionMarkPosition);
    }

    return videoId;
};

export const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return url;

    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1`;
};
