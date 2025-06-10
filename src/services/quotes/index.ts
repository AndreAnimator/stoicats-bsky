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
  var text = '';
  var stoicData;
  do {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Forsooth, a scourge upon our fetch quest: ' + response.statusText);
    }
    stoicData = await response.json();
    text = stoicData.data.author + ' - ' + '"' + stoicData.data.quote + '"';
  } while (text.length > 300);
  return stoicData;
}

export { getQuotes, altText, postText };
