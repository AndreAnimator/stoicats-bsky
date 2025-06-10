import { postImage } from './clients/at';
import { getQuotes, altText, postText } from './services/quotes/index';
require('dotenv').config({ debug: true });

async function main() {
  var stoicInfo = await getQuotes('https://stoic.tekloon.net/stoic-quote');
  var text: string = stoicInfo.data.author + ' - ' + '"' + stoicInfo.data.quote + '"';

  await postImage({
    text: postText(text),
    altText: altText(stoicInfo.data.author + ' - ' + '"' + stoicInfo.data.quote + '"'),
  });
}

main();
