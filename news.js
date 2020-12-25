const puppeteer = require('puppeteer');

const IMMORTAL_NEWS_URL = 'https://news.blizzard.com/en-us/diablo-immortal';

module.exports = {
  getNews: async function () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(IMMORTAL_NEWS_URL, { waitUntil: 'networkidle2' });

    let result = await page.evaluate(() => {
      const imgDiv = document.querySelector(
        'div[class="Card-imageWrapper"] > div'
      );
      const imgURL = imgDiv.style.backgroundImage
        .slice(7, -1)
        .replace(/"/g, '');
      const url = `http://${imgURL}`;

      const firstNewsItem = document.querySelector(
        'ol[class="Gallery-inner"] div[class="Card-content"]'
      );
      const title = firstNewsItem.querySelector('h2').innerText;
      const href = firstNewsItem.querySelector('a').href;

      return {
        href,
        title,
        url,
      };
    });

    await browser.close();

    return result;
  },
};
