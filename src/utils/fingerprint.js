export const getLocalFingerprint = () => {
  // Cek apakah sudah pernah dibuat
  let fingerprint = localStorage.getItem("guest_fingerprint");
  if (!fingerprint) {
    const userAgent = navigator.userAgent;
    const time = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 10);

    fingerprint = btoa(`${userAgent}-${time}-${random}`);
    localStorage.setItem("guest_fingerprint", fingerprint);
  }

  return fingerprint;
};
