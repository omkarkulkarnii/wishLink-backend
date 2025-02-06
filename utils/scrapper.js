import puppeteer from "puppeteer";

const fetchProductDetails = async (url) => {
    let browser;
    try {
        // Updated browser launch configuration for Render
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null
        });

        const page = await browser.newPage();
        
        // Set timeout and user agent
        await page.setDefaultNavigationTimeout(30000); // 30 seconds timeout
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Add error logging
        page.on('error', err => {
            console.error('Page error:', err);
        });

        page.on('console', msg => {
            console.log('Page console:', msg.text());
        });

        await page.goto(url, { 
            waitUntil: "domcontentloaded",
            timeout: 30000
        });

        let name, description, imageUrl, price;

        console.log('Scraping URL:', url); // Debug log

        if (url.includes("flipkart.com")) {
            try {
                name = await page.$eval("span.VU-ZEz", (el) => el.innerText.trim());
                console.log('Found name:', name); // Debug log
            } catch (error) {
                console.error('Error fetching name:', error);
                name = "Name not found";
            }

            try {
                description = await page.$eval("div._4gvKMe", (el) => el.innerText.trim());
            } catch (error) {
                console.error('Error fetching description:', error);
                description = "Description not available";
            }

            try {
                price = await page.$eval("div.Nx9bqj.CxhGGd", (el) => 
                    el.innerText.trim().replace('₹', '').replace(',', ''));
            } catch (error) {
                console.error('Error fetching price:', error);
                price = "Price not available";
            }

            try {
                imageUrl = await page.$eval('img[src*="rukminim"]', (el) => 
                    el.getAttribute("src"));
            } catch (error) {
                console.error('Error fetching image:', error);
                imageUrl = "Image not available";
            }

        } else if (url.includes("amazon.")) {
            // ... existing Amazon code ...
        } else if (url.includes("myntra.com")) {
            // ... existing Myntra code ...
        } else {
            return { error: "Unsupported website" };
        }

        console.log('Scraped data:', { name, description, price, imageUrl }); // Debug log
        return { name, description, price, imageUrl };

    } catch (error) {
        console.error("Error in fetchProductDetails:", error);
        return { error: "Failed to fetch product details: " + error.message };
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (error) {
                console.error("Error closing browser:", error);
            }
        }
    }
};

export { fetchProductDetails };
