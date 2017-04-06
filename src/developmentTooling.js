// The logger should only be enabled if we’re not in production.
if (ENV !== 'production') {
  // Enable livereload
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>'
  );
}
