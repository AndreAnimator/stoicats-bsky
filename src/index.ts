import { postImage } from './clients/at';
require('dotenv').config({ debug: true });

interface StoicData {
  data: { author: string; quote: string };
}

function postText(stoicText: string): string {
  return stoicText;
}

function altText(stoicQuote: string): string {
  return 'Stoic quote: ' + stoicQuote + '. With a cute looking cat.';
}

async function getQuotes(url: string): Promise<StoicData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Forsooth, a scourge upon our fetch quest: ' + response.statusText);
  }
  const stoicData = await response.json();
  return stoicData;
}

async function main() {
  var stoicInfo = await getQuotes('https://stoic.tekloon.net/stoic-quote');
  var text: string = stoicInfo.data.author + ' - ' + '"' + stoicInfo.data.quote + '"';
  while (text.length > 300) {
    stoicInfo = await getQuotes('https://stoic.tekloon.net/stoic-quote');
    text = stoicInfo.data.author + ' - ' + '"' + stoicInfo.data.quote + '"';
  }

  await postImage({
    text: postText(text),
    altText: altText(stoicInfo.data.author + ' - ' + '"' + stoicInfo.data.quote + '"'),
  });
}

main();
