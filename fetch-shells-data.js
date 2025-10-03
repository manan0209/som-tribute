const fs = require('fs');

const COOKIE = 'ahoy_visitor=cbaabe5a-1fb2-4627-8dc5-6144851308c2; cfz_zaraz-analytics=%7B%22_cfa_clientId%22%3A%7B%22v%22%3A%2246963263354772696%22%2C%22e%22%3A1789615795918%7D%2C%22_cfa_sId%22%3A%7B%22v%22%3A%226269949660485608%22%2C%22e%22%3A1759506589830%7D%7D; cf_clearance=E_EP7DfN4jElmeBigmpWmoxRJG.8hLqkEwMbYFFPsPg-1759505755-1.2.1.1-ZA9UhZ_aYme9KTEuLhX9yqTlETbD.HUmgk0wa7NJGpFW0XcmLT6SVlKVhB402Q.E4PobbpVmeQZLEGW7edaA36lnbmu.87fHVfJrDcVn4EzA0TXzAil5iV2Zn5neOUUHRim5UAcET6lvjusWBqDhMckbj0gB3Jg1DTzGkfLn4yRhA7xXZMlGjQSNKvyg.UUIvjF35GUb8N2wm6RaZM0dH4vGRBqIUWNvHVfhDqL6EqoGWKYKYy_QZY.j2k.MHl0kFU9HuEWLljCXs3gKzwXzNkzq4QLDkfMwLAXgaDqNTc4pQHpjIqfSGd99MzLwhtfOFhiLzOFqEiXZ5jkTCN7lYFdhMp6A; _som_session=OA0QD8a0gvPwl33m4C2bxTlGzFyNWu8hRV0A8cDsA0L0lNT0Y47d1DqxzaKUjx0y7H7CZLDXaIH1U4Ah9XPlp2zrpHDQ4kXEMVjLXoX5j8rSMlNEvYCuO%2B7OTFTzEhh8%2FYbRuLHnSEhIRgxxYqL%2BCRgOPf8JHSPRVLxjLPi0KpKN2KGrphMYLqcIW4IzlMwEBU7UU%2FMK5s1uyb6X9tW5yvpKBPKxz9PtVCOZ%2BQMdO9Hm7jJrj51zBjv05MxnfR6qA%2Fo8UXtHPnMQYwKTOCTzC7L2kY0OmN%2BrRTMqxZsNlVwmBU5cWYuYQg2Yo4e8yzLTPBF3CKpPdRp4W7s%2BMuoGD7a2xtD8b1n4ksOXeogPX3y8yLJUQIRhPM7l9oD%2FRh9WMjxozgCJFwi%2FJ7b%2BTaVTzRo%2Fz4mMYH9MPi85UBCzdgkbOC1fwszuGC3X6AW2gMwc7s1P8XP8dSCvwUH4IcMDYj%2Fz8MOQCr4IbwlU6A%3D%3D--5AeYAx4q4eS99rC7--G4OlySuNQLMrD5XeZn2TLw%3D%3D';

async function fetchShellsData() {
  
  try {
    console.log('Fetching shells/leaderboard data...');
    const response = await fetch('https://explorpheus.hackclub.com/leaderboard', {
      headers: {
        'Cookie': COOKIE,
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✓ Fetched ${data.length} users with shell data`);
    
    // Calculate total shells earned (only positive transactions) for each user
    const processedData = data.map(user => {
      const totalShellsEarned = user.payouts
        .filter(payout => parseFloat(payout.amount) > 0)
        .reduce((sum, payout) => sum + parseFloat(payout.amount), 0);
      
      return {
        slack_id: user.slack_id,
        current_shells: user.shells, // Current balance
        total_shells_earned: totalShellsEarned, // Total earned over time
        payouts: user.payouts
      };
    });

    // Sort by total shells earned
    processedData.sort((a, b) => b.total_shells_earned - a.total_shells_earned);

    // Save to file
    fs.writeFileSync(
      './data/som-shells.json',
      JSON.stringify(processedData, null, 2)
    );
    
    console.log('✓ Saved to data/som-shells.json');
    console.log(`Top earner: ${processedData[0].slack_id} with ${processedData[0].total_shells_earned} shells earned`);
    
  } catch (error) {
    console.error('Error fetching shells data:', error);
  }
}

fetchShellsData();
