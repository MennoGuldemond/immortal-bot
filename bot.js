const dotenv = require('dotenv');
const Discord = require('discord.js');
const News = require('./news');

dotenv.config();
const client = new Discord.Client();

let latestNewsUrl = '';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(() => {
    News.getNews()
      .catch((err) => {
        console.log(err);
      })
      .then((result) => {
        // If the URL is different, it must be new news!
        if (result.href != latestNewsUrl) {
          console.log('New news item found.');

          // Remember the latest news URL.
          latestNewsUrl = result.href;

          const embed = new Discord.MessageEmbed();
          embed.setTitle('New Diablo Immortal news has reached this realm!');
          embed.setURL(result.href);
          embed.setDescription(result.title);
          embed.setImage(result.url);
          embed.setTimestamp();
          embed.setFooter('News provided by news.blizzard.com');
          client.channels.cache.get(process.env.CHANNEL_ID).send(embed);
        }
      });
  }, process.env.TIMER_INTERVAL);
});

client.login(process.env.BOT_TOKEN);
