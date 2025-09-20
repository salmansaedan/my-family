import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the test page
    await page.goto('https://3000-isvb57g3ae2i9g8x3xn7i-6532622b.e2b.dev/test-family-crud.html');
    
    // Wait for the page to load
    await page.waitForSelector('#test-results', { timeout: 15000 });
    
    // Wait for the app to initialize
    await page.waitForTimeout(3000);
    
    console.log('=== Initial Test Results ===');
    const initialResults = await page.textContent('#test-results');
    console.log(initialResults);
    
    // Test Add Member
    console.log('\n=== Testing Add Member ===');
    await page.click('button:has-text("اختبار إضافة عضو")');
    await page.waitForTimeout(1500);
    
    let results = await page.textContent('#test-results');
    console.log(results);
    
    // Test Edit Member
    console.log('\n=== Testing Edit Member ===');
    await page.click('button:has-text("اختبار تعديل عضو")');
    await page.waitForTimeout(1500);
    
    results = await page.textContent('#test-results');
    console.log(results);
    
    // Test Delete Member
    console.log('\n=== Testing Delete Member ===');
    await page.click('button:has-text("اختبار حذف عضو")');
    await page.waitForTimeout(1500);
    
    results = await page.textContent('#test-results');
    console.log(results);
    
    // Display current members
    console.log('\n=== Current Members List ===');
    const members = await page.textContent('#current-members');
    console.log(members);
    
    console.log('\n=== Test completed successfully ===');
  } catch (error) {
    console.error('Test failed:', error);
  }
  
  await browser.close();
})();
