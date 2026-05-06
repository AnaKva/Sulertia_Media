const images = [
  "/daily-images/01.png",
  "/daily-images/02.png",
  "/daily-images/03.png",
  "/daily-images/04.png",
  "/daily-images/05.png",
  "/daily-images/06.png",
  "/daily-images/07.png",
  "/daily-images/08.png",
  "/daily-images/09.png",
  "/daily-images/10.png",
  "/daily-images/11.png",
  "/daily-images/12.png",
  "/daily-images/13.png",
  "/daily-images/14.png",
  "/daily-images/15.png",
  "/daily-images/16.png",
  "/daily-images/17.png",
  "/daily-images/18.png",
  "/daily-images/19.png",
  "/daily-images/20.png",
  "/daily-images/21.png",
  "/daily-images/22.png",
  "/daily-images/23.png",
  "/daily-images/24.png",
  "/daily-images/25.png",
  "/daily-images/26.png",
  "/daily-images/27.png",
  "/daily-images/28.png",
  "/daily-images/29.png",
  "/daily-images/30.png",
  "/daily-images/31.png",
];

export function getDailyImageForDate(dateInput?: string | Date | null) {
  const date = dateInput ? new Date(dateInput) : new Date();

  const startDate = new Date("2026-05-06T00:00:00+04:00");

  const diffMs = date.getTime() - startDate.getTime();
  const 
  diffDays = Math.floor(diffMs / 86400000);

  const index = ((diffDays % images.length) + images.length) % images.length;

  return images[index];
}

export function getDailyImage() {
  return getDailyImageForDate(new Date());
}