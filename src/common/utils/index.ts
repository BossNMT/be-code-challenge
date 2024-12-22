export const callTimeExecute = (startTime: any) => {
  const endTime = process.hrtime(startTime);
  return Math.round(endTime[0] * 1e3 + endTime[1] / 1e6);
};

export const isVietnamesePhoneNumber = (number) => {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

export const generateRandomNumber = () => {
  return Math.floor(Math.random() * 900000) + 100000;
}

export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;  // Bán kính trung bình của Trái Đất trong kilômét

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

