async function scrapePages() {
    const axios = require("axios");
    const cheerio = require("cheerio");

    const headers = {
        "authority": "scoutsvictoria.com.au",
        "method": "POST",
        "path": "/umbraco/surface/ProgramListingSurface/UpdateProgramListing",
        "scheme": "https",
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-AU,en;q=0.9",
        "origin": "https://scoutsvictoria.com.au",
        "priority": "u=1, i",
        "referer": "https://scoutsvictoria.com.au/program-navigator/?",
        "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
    };
    

    const baseUrl = "https://scoutsvictoria.com.au/program-navigator/";
    const regex = /<a\s+href="\/program-navigator\/(.*?)".*?title="(.*?)"/g;

    let page = 1;
    const links = [];

    while (true) {
        console.log(`Processing page ${page}`);
        try {
            // Fetch the page
            const response = await axios.post(`${baseUrl}?page=${page}`, {}, { headers });
            const $ = cheerio.load(response.data);

            // Extract links from the page
            const matches = response.data.matchAll(regex);
            let newLinksFound = false;
            for (const match of matches) {
                const link = `/program-navigator/${match[1]}`;
                const title = match[2];

                // Check if the link is already added to avoid duplicates
                if (!links.some(item => item.link === link)) {
                    links.push({ link, title });
                    newLinksFound = true;
                }
            }

            // Break if no new links are found
            if (!newLinksFound) {
                console.log("No more pages to scrape.");
                break;
            }

            page++; // Increment to scrape the next page
        } catch (error) {
            console.error("Error fetching page:", error.message);
            break;
        }
    }

    return links;
}

module.exports = scrapePages;