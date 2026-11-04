import { extractYoutubeVideoId } from './youtube-video-id.rule';

const VIDEO_ID = 'dQw4w9WgXcQ';

describe('extractYoutubeVideoId', () => {
  it.each([
    ['a watch link', `https://www.youtube.com/watch?v=${VIDEO_ID}`],
    [
      'a watch link with other parameters',
      `https://youtube.com/watch?feature=share&v=${VIDEO_ID}&t=10`,
    ],
    ['a mobile link', `https://m.youtube.com/watch?v=${VIDEO_ID}`],
    ['a short link', `https://youtu.be/${VIDEO_ID}?si=abc`],
    ['a live link', `https://www.youtube.com/live/${VIDEO_ID}?feature=share`],
    ['an embed link', `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`],
    ['a link with spaces around it', `  https://youtu.be/${VIDEO_ID}  `],
    ['the bare video id', VIDEO_ID],
  ])('finds the video in %s', (_name, link) => {
    expect(extractYoutubeVideoId(link)).toBe(VIDEO_ID);
  });

  it.each([
    ['another site', `https://vimeo.com/watch?v=${VIDEO_ID}`],
    ['a site that only looks like YouTube', `https://youtube.com.evil.example/watch?v=${VIDEO_ID}`],
    ['a channel page', 'https://www.youtube.com/@jocevs'],
    ['a watch link without video', 'https://www.youtube.com/watch'],
    ['a video id with the wrong size', 'https://youtu.be/curto'],
    ['a link that is not a web page', `ftp://youtu.be/${VIDEO_ID}`],
    ['plain text', 'transmissão da final'],
    ['an empty text', '   '],
  ])('refuses %s', (_name, link) => {
    expect(extractYoutubeVideoId(link)).toBeNull();
  });
});
