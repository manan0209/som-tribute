const fs = require('fs');

// Your cookie
const COOKIE = 'ahoy_visitor=cbaabe5a-1fb2-4627-8dc5-6144851308c2; cfz_zaraz-analytics=%7B%22_cfa_clientId%22%3A%7B%22v%22%3A%2246963263354772696%22%2C%22e%22%3A1789615795918%7D%2C%22_cfa_sId%22%3A%7B%22v%22%3A%226269949660485608%22%2C%22e%22%3A1759506589830%7D%7D; cf_clearance=E_EP7DfN4jElmeBigmpWmoxRJG.8hLqkEwMbYFFPsPg-1759505755-1.2.1.1-ZA9UhZ_aYme9KTEuLhX9yqTlETbD.HUmgk0wa7NJGpFW0XcmLT6SVlKVhB402Q.E4PobbpVmeQZLEGW7edaA36lnbmu.87fHVfJrDcVn4EzA0TXzAil5iV2Zn5neOUUHRim5UAcET6lvjusWBqDhMckbj0gB3Jg1DTzGkfLn4ypfks5haWpfZzC_.sBWbRPm24NN3FoWtI37Kht4fB6yJlVoU6MfQNEWw2eGeqPT0zg; fs_lua=1.1759505766848; fs_uid=#ARN0J#058fb1bb-e406-4b04-b65a-fda54bd305db:285970dc-24eb-4c5b-a55c-2fd1e92cd48f:1759504788953::3#/1783999249; _journey_session=vui8zjx6CkOV5gE%2FUfWfjfZAxV%2FTCOmNyIfGIUGkFxx1JmBUuuCaoqycoe3wxRGy26PDu4RdmX7HQjnFdw%2FKph5%2FAfypdTGrDykSRnf9yxe5imXa8TfiVnceGl92GIRnA3SVg85eTL%2FWRfHhz2VU2Gd3TR4QMmynNUWtJ1RLIgXNymZg1i34O3daNZc1L%2FkV1tMwlVwAfP9D1OovZXBm40fQ0hho%2Bl%2BtrLVLCQ4n3Fg9FSvT8o7i%2Bx7jIL1%2F%2Bby110fKPTRAXRXSz1i46kVqtUFIQPtYG9cP1u7iWoqKlCO3hGR9k0ADSOY0mH1UYANX02FdKhcEUsAepAKBoc4wXAQgTOfUwUV9UJMpXOkR59qZloAWHWJKrUoZhf7ZZhyzJ1eZflppKRackEF6ssU%2FB60f%2FWqwZ%2Ft1jDJW1vSVYziSmVsS5LW4433OHGOSO2KOeW1%2BoF9WsFNLUIm2cbcU%2BSz7ExB%2FZCfwCmU9CATC6%2BbONzRvqObx%2B4ZVko1FNWTej667sgZAeJ7QfvBIR85fuzuADJyVgmcKmtxINbFC%2BVTl%2Bg13Qkoxrh6uKsrsskLuuDH8O3R0%2FumKfmR0PPrDfohNkcdV6iZQ66eQ%2F8Ww%2F5C%2BCKZKSaI1eRGX0icrZE1VceRJ00V3Zj9JeXFjY6qafm6SOMYIRVF1dUH1qefs232wjiaVt3VDDxwfvWZsFzHNCnflgvu%2BlMZnyRw7QgvV%2BN0IvYyt6JSjblQ0ggkDUaPOwGNUuYyAz7dh0i%2FLbkDgnN94QUVtUfX2K1VIR66Py134GgNJAK%2FDMG1TEAg2%2B7NztCxOXyn%2FtYWqnwnxN9%2FYgswCg8j5Ht%2FJk%2Fw9TaoWqnhgwVGA1tsQSwwFJ6dcNu5Xoi0qMpLtgEAEyzKF3RRZPGs5dtHugVm8ZnpIt%2F5I3EKE3CMqvidsYxOQgdQZwcHPKmGxoT7A9%2FS2YEryVMJvZsFO%2Fm054KKHx6r1cIpZc4MHZ0OlH0%2FdVSRg%2Bmd84cwuFTmmKJTEEqqfOQf4fCO8mACk9l4bwSUk1ARgJtJwVpbtXvTNohvyl2m%2Ft1Zfq7akWc3sNSL2Rx5BgTycgteui1PfooN51k%2BuidX82HEgqnNCgwOcc0f7wAiSsMSelAJwxY2zYe2FIIitDH%2FY0DXkSdqRqH3eEbjX2X%2FI80qLnSg03ajvJGEGc9nUjVVIh70B65xaP4m0%2FzntpqH6HSIfC0%2BtJignydSduzYQ%2F1ejKZcG40tte38VFQ7lIUpKtEscs2e6qeE7Az2qEtA26Nx8r7PfgPjx7UEXB1ExOWAk2iLYDhUBvt%2BW%2BfwAGbRUAAN%2BYKd4BT9Vak%2Flnn6U5Ds8fUU9WJx15taIFvSP9MJd5LL2F%2F%2BEzuY1Nq7sEeh4JVAbAcF31ljHSJPXoSJmqv5JQT7q5K03HuYsen1ranMQcrkDeENxn2ng9A8AWiIhLAxVfErAaA5gS9lpCFUs4Z6slrv01toqibyfA6bm9m8s3o%2BweUEEbMO68yodBFhnJjDgjGVdiDKD2KFzK7SYRmwDyB8y3yRQ2w8BAOqzVh9Wv0vfbhz1eEmsIc59b0N5uHbnJ8pyCxZjHYCiQKuf9LzGh%2F3xCvgKmgR6gl%2Fzq2tby95Yil61Up%2FHCbw9q7bximYIh3bet2LN6ADPKexjbCrVmglmj8EKBgqCQAKYgzIkAfY0HzUHfyUGWMlpQDYm3jtW%2FRCv3wR3bKc%2BxtbZioRNJK3MOww2nNkqbV%2FUiHKfnhsUIlzGUr%2FRpK6%2Fx9VK%2Fi8S38hRMnxFqS95KWtetuhIbJYnO35ZAgr7AGtOPGvZb9g%2FXgDQd7qjhA1zzTHZEO7KiBMpob9m5muGGVwuyJkRJwPFkGLwsfm2vG%2Fr8fXWk39cm%2BZ%2FFgDG2w6%2FFuEmS%2B18WQn8vQUA9Vgbj7mFxfSYLuuPtYwlxluW1Vh1ZOUF0F0EsjqOiUX44BSMTIozel1zBNXYOYOwsMReWZbTRn4U%2F6cfGU%2BOu5OeUkqEnD13ld%2BDTVWBsrnH73YnqmuQO2pUrXHsH3xU5X4IvSNRcHOFPH%2BjZ%2FNRoqQ2HvfYBQyvfXvYNIy5dJQcsupeHKPXoSpj5OxgyA5PUE0CQvAhn9qI5GglT4WSBhqXkFI5Ueq0cBJfhbP%2BRiVTPh5jN8m7RmZUBrTTt77L%2FYPuiioQjXZj4IV5Nyp2HZdZmRla%2BmZrfw03h%2Boo9NfPcc4rtj77cTsc1FByzh77ordzD2cLlFlhDiVsd7uXYQc0%2FS6V52pwTuFU6Po%2B8VeTK%2BSYoLnEyQB%2FMuhMBmW1rcOAiTF0ehVtL9AD6vGRV4TxjdgdAalOrsOcwAYXRcdPRZoIHk1b7k8wfR3gFF2oNS11oC023YAnRSUCNDKHEkVuWbM9hgktdaQxdy%2Bw%2FkLCe%2F2GzdXxWE%2BYQTSuGecLoAKkMNhbadUzgG9oUOpJe3b0BfEUIBpoJYmZxaV%2Fgg5qBJpy7Tkh%2Fu1onPdpoP916mT21boUJdxdnfQ0zV0cFRm1NHq7pyarQw2RlhWKSrByqWj1jitlvsJVPlnrW6ogBkGAIR1ujMhgfjWmLc1MmId4v%2BciPoIffUkCB6E9xk6v2MOpi4FHnOqL03EQjNm%2F%2F8u5lOQtNTEOqvvBb7VBUDfWQ8kEz20VsrV4MmednEVmqJIbfi7cfk2nP7OSRpcCLEaJjg2tAP8cKB%2F%2B4srmTMRIqxXHr8%2FpzDILDE8K1xDtIH62mEM1HjR13LSmqosFcgbtjP8fB18rIW2fdOTBuwRe%2FprTBrVRu9tptSsgIWB%2FPEi7zdrOdhkLPWC%2B3Smyv%2B8%2F7TMwWifgdDbjZ88aDLOrzyYWUM%2BlpimVNp8FXmb6nwl1cZ2nCD%2FhgQOVMdg5yUj3YC5KKqhRG%2B9rHafODajJTR1yr2mC9pkMqyLq2qIyz2nyZMYWkPg47mOlak%2F42kMTlCzhNCDFUzcNfvkcw%2BuN0H4jCkXxVhutfSTL5Jny37K3PLFPElchUA%2BkymF71KMIT6iKKSQcCvtLCcIhiOeHJU97yZuqG0RAJhpZjjV9Z%2BekYDl1YhvCIQoWaKgtOsn9aL4dKFJ8DpmqjF8YvyMR2akGSmKzmyae%2BwPzcCpC%2BvigIZex8rAMeRVorSCioKEiEWy8i1NqsMhrRdKy6Qxc1Ew0ASblmx3HtoErDF9Wl5dxxpHbiKK0QwdlUukb1cXhwrx0bmCuSCXd6APwlquCsYznscm2%2BVp7DqD21OI7NZ0TWJRsocJILcUKIAahsCJmyx0El4r%2FQMqGtrQjvCZ7q9tKvvUuEP7iuHgxpqv7G2AOO%2FvfUVUMpNbZHzvmiaOcfOWVKcmT64r2fyUBG0imI%2BYmNSUPBt3J75KTRSnxyPX8ock%2FyQKpsNOaN%2BvPm%2FBsezHOLMiRYqT%2FTXk%2Bxe%2BjxVdYXv1Se78w%2Fys%2BEdHrSefGhN72qILZ8mSxeXcghr2PU4aq%2FAMDuYnW1rzCghpJGKsjIiMVNm2zswiwl0ZTeJX7vXHy%2BS4jhbGxJb8zA1xDpKQPK3XQYlnGIVXvZJyzeiNaFG8%3D--8nhJchFJXUJ0vVja--pqAxN3lJZSn3%2FFIR7eoSug%3D%3D';

const BASE_URL = 'https://summer.hackclub.com/api/v1';

const headers = {
  'Cookie': COOKIE,
  'Accept': 'application/json',
  'Referer': 'https://summer.hackclub.com/explore',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
};

// Test endpoint function
async function testEndpoint(url, name) {
  console.log(`\nTesting ${name}...`);
  console.log(`URL: ${url}`);
  
  try {
    const response = await fetch(url, { headers });
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const text = await response.text();
      console.log(`Error response: ${text.substring(0, 200)}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Success! Got data:`, JSON.stringify(data, null, 2).substring(0, 500));
    return data;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

// Test leaderboard
async function testLeaderboard() {
  console.log(`\nTesting Leaderboard...`);
  const url = 'https://explorpheus.hackclub.com/leaderboard';
  
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.log(`Error: Non-OK response`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Success! Got ${data.length} leaderboard entries`);
    console.log(`Sample entry:`, JSON.stringify(data[0], null, 2));
    return data;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('=== Testing SOM API Endpoints ===\n');
  
  // Test projects endpoint
  await testEndpoint(`${BASE_URL}/projects?page=1`, 'Projects (Page 1)');
  await new Promise(r => setTimeout(r, 1000));
  
  // Test specific project
  await testEndpoint(`${BASE_URL}/projects/86`, 'Specific Project (ID 86)');
  await new Promise(r => setTimeout(r, 1000));
  
  // Test devlogs endpoint
  await testEndpoint(`${BASE_URL}/devlogs?page=1`, 'Devlogs (Page 1)');
  await new Promise(r => setTimeout(r, 1000));
  
  // Test comments endpoint
  await testEndpoint(`${BASE_URL}/comments?page=1`, 'Comments (Page 1)');
  await new Promise(r => setTimeout(r, 1000));
  
  // Test leaderboard
  await testLeaderboard();
  
  console.log('\n=== Tests Complete ===');
}

runTests();
