const DEFAULT_DELAY_IN_MILLISECONDS = 450;

function startDownload(href: string): void {
  const link = document.createElement('a');
  link.href = href;
  link.rel = 'noopener';
  link.download = '';
  document.body.append(link);
  link.click();
  link.remove();
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function downloadSequentially(
  hrefs: string[],
  delayInMilliseconds = DEFAULT_DELAY_IN_MILLISECONDS,
): Promise<void> {
  return hrefs.reduce(
    (previous, href) =>
      previous.then(() => {
        startDownload(href);
        return wait(delayInMilliseconds);
      }),
    Promise.resolve(),
  );
}
