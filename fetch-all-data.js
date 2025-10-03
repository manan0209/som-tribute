const fs = require('fs');

const COOKIE = 'ahoy_visitor=cbaabe5a-1fb2-4627-8dc5-6144851308c2; cfz_zaraz-analytics=%7B%22_cfa_clientId%22%3A%7B%22v%22%3A%2246963263354772696%22%2C%22e%22%3A1789615795918%7D%2C%22_cfa_sId%22%3A%7B%22v%22%3A%226269949660485608%22%2C%22e%22%3A1759506589830%7D%7D; cf_clearance=E_EP7DfN4jElmeBigmpWmoxRJG.8hLqkEwMbYFFPsPg-1759505755-1.2.1.1-ZA9UhZ_aYme9KTEuLhX9yqTlETbD.HUmgk0wa7NJGpFW0XcmLT6SVlKVhB402Q.E4PobbpVmeQZLEGW7edaA36lnbmu.87fHVfJrDcVn4EzA0TXzAil5iV2Zn5neOUUHRim5UAcET6lvjusWBqDhMckbj0gB3Jg1DTzGkfLn4ypfks5haWpfZzC_.sBWbRPm24NN3FoWtI37Kht4fB6yJlVoU6MfQNEWw2eGeqPT0zg; fs_lua=1.1759505766848; fs_uid=#ARN0J#058fb1bb-e406-4b04-b65a-fda54bd305db:285970dc-24eb-4c5b-a55c-2fd1e92cd48f:1759504788953::3#/1783999249; _journey_session=vui8zjx6CkOV5gE%2FUfWfjfZAxV%2FTCOmNyIfGIUGkFxx1JmBUuuCaoqycoe3wxRGy26PDu4RdmX7HQjnFdw%2FKph5%2FAfypdTGrDykSRnf9yxe5imXa8TfiVnceGl92GIRnA3SVg85eTL%2FWRfHhz2VU2Gd3TR4QMmynNUWtJ1RLIgXNymZg1i34O3daNZc1L%2FkV1tMwlVwAfP9D1OovZXBm40fQ0hho%2Bl%2BtrLVLCQ4n3Fg9FSvT8o7i%2Bx7jIL1%2F%2Bby110fKPTRAXRXSz1i46kVqtUFIQPtYG9cP1u7iWoqKlCO3hGR9k0ADSOY0mH1UYANX02FdKhcEUsAepAKBoc4wXAQgTOfUwUV9UJMpXOkR59qZloAWHWJKrUoZhf7ZZhyzJ1eZflppKRackEF6ssU%2FB60f%2FWqwZ%2Ft1jDJW1vSVYziSmVsS5LW4433OHGOSO2KOeW1%2BoF9WsFNLUIm2cbcU%2BSz7ExB%2FZCfwCmU9CATC6%2BbONzRvqObx%2B4ZVko1FNWTej667sgZAeJ7QfvBIR85fuzuADJyVgmcKmtxINbFC%2BVTl%2Bg13Qkoxrh6uKsrsskLuuDH8O3R0%2FumKfmR0PPrDfohNkcdV6iZQ66eQ%2F8Ww%2F5C%2BCKZKSaI1eRGX0icrZE1VceRJ00V3Zj9JeXFjY6qafm6SOMYIRVF1dUH1qefs232wjiaVt3VDDxwfvWZsFzHNCnflgvu%2BlMZnyRw7QgvV%2BN0IvYyt6JSjblQ0ggkDUaPOwGNUuYyAz7dh0i%2FLbkDgnN94QUVtUfX2K1VIR66Py134GgNJAK%2FDMG1TEAg2%2B7NztCxOXyn%2FtYWqnwnxN9%2FYgswCg8j5Ht%2FJk%2Fw9TaoWqnhgwVGA1tsQSwwFJ6dcNu5Xoi0qMpLtgEAEyzKF3RRZPGs5dtHugVm8ZnpIt%2F5I3EKE3CMqvidsYxOQgdQZwcHPKmGxoT7A9%2FS2YEryVMJvZsFO%2Fm054KKHx6r1cIpZc4MHZ0OlH0%2FdVSRg%2Bmd84cwuFTmmKJTEEqqfOQf4fCO8mACk9l4bwSUk1ARgJtJwVpbtXvTNohvyl2m%2Ft1Zfq7akWc3sNSL2Rx5BgTycgteui1PfooN51k%2BuidX82HEgqnNCgwOcc0f7wAiSsMSelAJwxY2zYe2FIIitDH%2FY0DXkSdqRqH3eEbjX2X%2FI80qLnSg03ajvJGEGc9nUjVVIh70B65xaP4m0%2FzntpqH6HSIfC0%2BtJignydSduzYQ%2F1ejKZcG40tte38VFQ7lIUpKtEscs2e6qeE7Az2qEtA26Nx8r7PfgPjx7UEXB1ExOWAk2iLYDhUBvt%2BW%2BfwAGbRUAAN%2BYKd4BT9Vak%2Flnn6U5Ds8fUU9WJx15taIFvSP9MJd5LL2F%2F%2BEzuY1Nq7sEeh4JVAbAcF31ljHSJPXoSJmqv5JQT7q5K03HuYsen1ranMQcrkDeENxn2ng9A8AWiIhLAxVfErAaA5gS9lpCFUs4Z6slrv01toqibyfA6bm9m8s3o%2BweUEEbMO68yodBFhnJjDgjGVdiDKD2KFzK7SYRmwDyB8y3yRQ2w8BAOqzVh9Wv0vfbhz1eEmsIc59b0N5uHbnJ8pyCxZjHYCiQKuf9LzGh%2F3xCvgKmgR6gl%2Fzq2tby95Yil61Up%2FHCbw9q7bximYIh3bet2LN6ADPKexjbCrVmglmj8EKBgqCQAKYgzIkAfY0HzUHfyUGWMlpQDYm3jtW%2FRCv3wR3bKc%2BxtbZioRNJK3MOww2nNkqbV%2FUiHKfnhsUIlzGUr%2FRpK6%2Fx9VK%2Fi8S38hRMnxFqS95KWtetuhIbJYnO35ZAgr7AGtOPGvZb9g%2FXgDQd7qjhA1zzTHZEO7KiBMpob9m5muGGVwuyJkRJwPFkGLwsfm2vG%2Fr8fXWk39cm%2BZ%2FFgDG2w6%2FFuEmS%2B18WQn8vQUA9Vgbj7mFxfSYLuuPtYwlxluW1Vh1ZOUF0F0EsjqOiUX44BSMTIozel1zBNXYOYOwsMReWZbTRn4U%2F6cfGU%2BOu5OeUkqEnD13ld%2BDTVWBsrnH73YnqmuQO2pUrXHsH3xU5X4IvSNRcHOFPH%2BjZ%2FNRoqQ2HvfYBQyvfXvYNIy5dJQcsupeHKPXoSpj5OxgyA5PUE0CQvAhn9qI5GglT4WSBhqXkFI5Ueq0cBJfhbP%2BRiVTPh5jN8m7RmZUBrTTt77L%2FYPuiioQjXZj4IV5Nyp2HZdZmRla%2BmZrfw03h%2Boo9NfPcc4rtj77cTsc1FByzh77ordzD2cLlFlhDiVsd7uXYQc0%2FS6V52pwTuFU6Po%2B8VeTK%2BSYoLnEyQB%2FMuhMBmW1rcOAiTF0ehVtL9AD6vGRV4TxjdgdAalOrsOcwAYXRcdPRZoIHk1b7k8wfR3gFF2oNS11oC023YAnRSUCNDKHEkVuWbM9hgktdaQxdy%2Bw%2FkLCe%2F2GzdXxWE%2BYQTSuGecLoAKkMNhbadUzgG9oUOpJe3b0BfEUIBpoJYmZxaV%2Fgg5qBJpy7Tkh%2Fu1onPdpoP916mT21boUJdxdnfQ0zV0cFRm1NHq7pyarQw2RlhWKSrByqWj1jitlvsJVPlnrW6ogBkGAIR1ujMhgfjWmLc1MmId4v%2BciPoIffUkCB6E9xk6v2MOpi4FHnOqL03EQjNm%2F%2F8u5lOQtNTEOqvvBb7VBUDfWQ8kEz20VsrV4MmednEVmqJIbfi7cfk2nP7OSRpcCLEaJjg2tAP8cKB%2F%2B4srmTMRIqxXHr8%2FpzDILDE8K1xDtIH62mEM1HjR13LSmqosFcgbtjP8fB18rIW2fdOTBuwRe%2FprTBrVRu9tptSsgIWB%2FPEi7zdrOdhkLPWC%2B3Smyv%2B8%2F7TMwWifgdDbjZ88aDLOrzyYWUM%2BlpimVNp8FXmb6nwl1cZ2nCD%2FhgQOVMdg5yUj3YC5KKqhRG%2B9rHafODajJTR1yr2mC9pkMqyLq2qIyz2nyZMYWkPg47mOlak%2F42kMTlCzhNCDFUzcNfvkcw%2BuN0H4jCkXxVhutfSTL5Jny37K3PLFPElchUA%2BkymF71KMIT6iKKSQcCvtLCcIhiOeHJU97yZuqG0RAJhpZjjV9Z%2BekYDl1YhvCIQoWaKgtOsn9aL4dKFJ8DpmqjF8YvyMR2akGSmKzmyae%2BwPzcCpC%2BvigIZex8rAMeRVorSCioKEiEWy8i1NqsMhrRdKy6Qxc1Ew0ASblmx3HtoErDF9Wl5dxxpHbiKK0QwdlUukb1cXhwrx0bmCuSCXd6APwlquCsYznscm2%2BVp7DqD21OI7NZ0TWJRsocJILcUKIAahsCJmyx0El4r%2FQMqGtrQjvCZ7q9tKvvUuEP7iuHgxpqv7G2AOO%2FvfUVUMpNbZHzvmiaOcfOWVKcmT64r2fyUBG0imI%2BYmNSUPBt3J75KTRSnxyPX8ock%2FyQKpsNOaN%2BvPm%2FBsezHOLMiRYqT%2FTXk%2Bxe%2BjxVdYXv1Se78w%2Fys%2BEdHrSefGhN72qILZ8mSxeXcghr2PU4aq%2FAMDuYnW1rzCghpJGKsjIiMVNm2zswiwl0ZTeJX7vXHy%2BS4jhbGxJb8zA1xDpKQPK3XQYlnGIVXvZJyzeiNaFG8%3D--8nhJchFJXUJ0vVja--pqAxN3lJZSn3%2FFIR7eoSug%3D%3D';

const BASE_URL = 'https://summer.hackclub.com/api/v1';
const headers = {
  'Cookie': COOKIE,
  'Accept': 'application/json',
  'Referer': 'https://summer.hackclub.com/explore',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
};

async function fetchPaginated(endpoint, delay = 500) {
  const results = [];
  let page = 1;
  let hasMore = true;

  console.log(`\nFetching ${endpoint}...`);

  while (hasMore) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}?page=${page}`, { headers });

      if (!response.ok) {
        console.log(`  Stopped at page ${page} (status ${response.status})`);
        break;
      }

      const data = await response.json();
      const items = data.projects || data.devlogs || data.comments || [];
      
      if (items.length === 0) {
        hasMore = false;
      } else {
        results.push(...items);
        console.log(`  Page ${page}: ${items.length} items (total: ${results.length})`);
        page++;
        await new Promise(r => setTimeout(r, delay));
      }
    } catch (error) {
      console.error(`  Error on page ${page}:`, error.message);
      break;
    }
  }

  console.log(`  Complete: ${results.length} ${endpoint} fetched`);
  return results;
}

async function fetchLeaderboard() {
  console.log(`\nFetching leaderboard...`);
  
  try {
    const response = await fetch('https://explorpheus.hackclub.com/leaderboard');
    if (!response.ok) {
      console.log(`  Error: status ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    console.log(`  Complete: ${data.length} leaderboard entries fetched`);
    return data;
  } catch (error) {
    console.error(`  Error:`, error.message);
    return [];
  }
}

async function fetchAll() {
  console.log('=================================');
  console.log('Fetching ALL Summer of Making Data');
  console.log('=================================');
  
  const startTime = Date.now();
  
  // Fetch all data
  const [projects, devlogs, comments, leaderboard] = await Promise.all([
    fetchPaginated('projects', 300),
    fetchPaginated('devlogs', 300),
    fetchPaginated('comments', 300),
    fetchLeaderboard()
  ]);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n=================================');
  console.log('Summary:');
  console.log(`  Projects: ${projects.length}`);
  console.log(`  Devlogs: ${devlogs.length}`);
  console.log(`  Comments: ${comments.length}`);
  console.log(`  Leaderboard: ${leaderboard.length}`);
  console.log(`  Time taken: ${duration}s`);
  console.log('=================================');
  
  // Save to files
  console.log('\nSaving to data directory...');
  
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(`${dataDir}/som-projects.json`, JSON.stringify(projects, null, 2));
  fs.writeFileSync(`${dataDir}/som-devlogs.json`, JSON.stringify(devlogs, null, 2));
  fs.writeFileSync(`${dataDir}/som-comments.json`, JSON.stringify(comments, null, 2));
  fs.writeFileSync(`${dataDir}/som-leaderboard.json`, JSON.stringify(leaderboard, null, 2));
  
  console.log('  som-projects.json saved');
  console.log('  som-devlogs.json saved');
  console.log('  som-comments.json saved');
  console.log('  som-leaderboard.json saved');
  
  console.log('\nDone! Real SOM data ready to use.');
}

fetchAll().catch(console.error);
