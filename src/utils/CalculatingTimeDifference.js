exports.calculatingRelativeTimeDifference = (createdAt) => {
  const currentTime = new Date();
  const createAtTime = new Date(createdAt);

  const timeDeference = currentTime - createAtTime;

  const seconds = Math.floor(timeDeference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "همین الان";
  } else if (minutes < 60) {
    return `${minutes} دقیقه پیش`;
  } else if (hours < 24) {
    return `${hours} ساعت پیش`;
  } else if (days < 7) {
    return `${days} روز پیش`;
  } else if (days < 30) {
    return `${weeks} هفته پیش`;
  } else if (days < 60) {
    return `1 ماه پیش`;
  } else if (months < 12) {
    return `${months} ماه پیش`;
  } else {
    return `${years} سال پیش`;
  }
};
