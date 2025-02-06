import puppeteer from "puppeteer";

const fetchProductDetails = async (url) => {
    let browser;
    try {
      browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0");
      await page.goto(url, { waitUntil: "domcontentloaded" });
  
      let name, description, imageUrl, price;
  
      if (url.includes("flipkart.com")) {
        // Flipkart - Name
        try {
          name = await page.$eval("span.VU-ZEz", (el) => el.innerText.trim());
        } catch (error) {
          name = "Name not found";
        }
  
        // Flipkart - Description
        try {
          description = await page.$eval("div._4gvKMe", (el) => el.innerText.trim());
        } catch (error) {
          description = "Description not available";
        }
  
        // Flipkart - Price
        try {
          price = await page.$eval("div.Nx9bqj.CxhGGd", (el) => el.innerText.trim().replace('₹', '').replace(',', ''));
        } catch (error) {
          price = "Price not available";
        }
  
        // Flipkart - Image URL
        try {
          imageUrl = await page.$eval('img[src*="rukminim"]', (el) => el.getAttribute("src"));
        } catch (error) {
          imageUrl = "Image not available";
        }
  
      } else if (url.includes("amazon.")) {
        name = await page.$eval("#productTitle", (el) => el.innerText.trim());

        description = await page.$eval("#feature-bullets span.a-list-item", (el) => el.innerText.trim())
          .catch(() => "No description found");

        price = await page.$eval("span.a-price-whole", (el) => el.innerText.trim().replace('₹', '').replace(',', '').replace(/\n./g, ''))
          .catch(() => "Price not available");

        imageUrl = await page.$eval("#landingImage", (el) => el.getAttribute("src"));

      } else if (url.includes("myntra.com")) {
        name = await page.$eval("h1.pdp-title", (el) => el.innerText.trim());

        description = await page.$eval("p.pdp-product-description-content", (el) => el.innerText.trim());

        price = await page.$eval("span.pdp-price strong", (el) => el.innerText.trim().replace('₹', '').replace(',', ''))
        .catch(() => "Price not available");


        imageUrl = await page.$eval("div.image-grid-image", (el) => {
          const style = el.getAttribute("style");
          const urlMatch = style.match(/url\("([^"]+)"\)/);
          return urlMatch ? urlMatch[1] : null;
        });
      } else {
        return { error: "Unsupported website" };
      }
  
      return { name, description, price, imageUrl };
    } catch (error) {
      console.error("Error fetching product details:", error);
      return { error: "Failed to fetch product details" };
    } finally {
      if (browser) await browser.close();
    }
  };
  
export  {fetchProductDetails};
