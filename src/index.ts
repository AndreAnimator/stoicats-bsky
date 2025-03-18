import { postImage } from './clients/at';
import { getNextImage } from './images';
import * as dotenv from 'dotenv';
dotenv.config();

interface StoicData {
  quote: string;
  author: string;
}

// EDIT THIS!
function postTextFromImageName(imageName: string): string {
  // Remove the file extension and parse the date
  const dateParts = imageName.replace('.jpg', '').split('-');
  const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2] || 1));

  // Create a formatter
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the date
  return formatter.format(date);
}

// EDIT THIS!
function altTextFromImageName(imageName: string): string {
  return 'Image from ' + postTextFromImageName(imageName);
}

async function getQuotes(url: string): Promise<StoicData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Forsooth, a scourge upon our fetch quest: ' + response.statusText);
  }
  const stoicData: StoicData = await response.json();
  return stoicData;
}

// Shouldn't have to edit this.
async function main() {
  const stoicInfo = await getQuotes('https://api.themotivate365.com/stoic-quote');
  const { LAST_IMAGE_NAME: lastImageName } = process.env;
  const nextImage = await getNextImage({ lastImageName });

  console.log(nextImage.imageName);

  await postImage({
    path: nextImage.absolutePath,
    text: postTextFromImageName(stoicInfo.author + ' - ' + '"' + stoicInfo.quote + '"'),
    altText: altTextFromImageName(nextImage.imageName),
  });
}

main();
