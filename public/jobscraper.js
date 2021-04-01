const Jobs = require('./../models/jobsModel');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const {
  LinkedinScraper,
  relevanceFilter,
  timeFilter,
  typeFilter,
  experienceLevelFilter,
  events,
} = require('linkedin-jobs-scraper');

//Database connection
const DB = `mongodb+srv://abu:50761254@cluster0.ez9pw.mongodb.net/treach?retryWrites=true&w=majority`;

mongoose.connect(DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const scrapping = async () => {
  // Each scraper instance is associated with one browser.
  // Concurrent queries will run on different pages within the same browser instance.
  const scraper = new LinkedinScraper({
    headless: true,
    slowMo: 100,
    args: ['--lang=en-GB'],
  });

  // Add listeners for scraper events
  scraper.on(events.scraper.data, async (data) => {
    try {
      await Jobs.create({
        location: data.location,
        title: data.title,
        company: data.company ? data.company : 'N/A',
        place: data.place,
        date: data.date,
        link: data.link,
        applyLink: data.applyLink ? data.applyLink : 'N/A',
        senorityLevel: data.senorityLevel,
        functions: data.jobFunction,
        employmentType: data.employmentType,
      });
    } catch (err) {
      console.log(err);
    }
  });

  scraper.on(events.scraper.error, (err) => {
    console.error(err);
  });

  scraper.on(events.scraper.end, () => {
    console.log('All done!');
  });

  // Add listeners for puppeteer browser events
  scraper.on(events.puppeteer.browser.targetcreated, () => {});
  scraper.on(events.puppeteer.browser.targetchanged, () => {});
  scraper.on(events.puppeteer.browser.targetdestroyed, () => {});
  scraper.on(events.puppeteer.browser.disconnected, () => {});

  // Custom function executed on browser side to extract job description
  const descriptionFn = () =>
    document
      .querySelector('.description__text')
      .innerText.replace(/[\s\n\r]+/g, ' ')
      .trim();

  // Run queries concurrently
  await Promise.all([
    // Run queries serially
    scraper.run(
      [
        {
          query: 'Teacher',
          options: {
            locations: ['Kenya', 'Nigeria', 'Africa', 'Tanzania'], // This will be merged with the global options => ["United States", "Europe"]
            filters: {
              type: [typeFilter.FULL_TIME, typeFilter.CONTRACT],
            },
          },
        },
        {
          query: 'Teacher',
          options: {
            limit: 10, // This will override global option limit (33)
          },
        },
      ],
      {
        // Global options for this run, will be merged individually with each query options (if any)
        locations: ['Africa'],
        optimize: true,
        limit: 33,
      }
    ),
  ]);

  // Close browser
  await scraper.close();
};

module.exports = scrapping;
