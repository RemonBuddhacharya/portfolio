const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateResumePDF() {
    console.log('Generating resume PDF...');
    
    const htmlContent = fs.readFileSync(path.join(__dirname, 'resume.html'), 'utf8');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: false,
        margin: {
            top: '1in',
            right: '1in',
            bottom: '1in',
            left: '1in'
        }
    });
    
    fs.writeFileSync(path.join(__dirname, 'resume.pdf'), pdfBuffer);
    
    await browser.close();
    console.log('Resume PDF generated successfully!');
}

generateResumePDF().catch(console.error);