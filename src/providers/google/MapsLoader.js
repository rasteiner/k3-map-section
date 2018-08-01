
let mapsLoading = false
let mapsLoaded = false

const deferreds = []

export default function apiLoader(key) {

  const deferred = {};

  if (mapsLoaded) {
    return new Promise((resolve) => resolve())
  }

  if (!mapsLoading) {
    mapsLoading = true;
    const script = document.createElement('script')
    const callback = 'rasteinermapssectionloader'
    const options = {
      key,
      callback,
    };
    const url = 'https://maps.googleapis.com/maps/api/js?' +
      Object.keys(options)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
        .join('&')
    script.setAttribute('src', url)
    script.setAttribute('async', '')
    script.setAttribute('defer', '')
    document.head.appendChild(script);

    window[callback] = () => {
      mapsLoaded = true
      for (let d of deferreds) {
        d.resolve();
      }
    }
    script.addEventListener('error', (e) => {
      for (let d of deferreds) {
        d.reject(e);
      }
    })
  }

  deferreds.push(deferred)

  return new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })

}
