function handleCredentialResponse(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  const email = payload.email.toLowerCase();
        
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}&range=${RANGE}`;
  // Save to localStorage the moment we know they are allowed
try {
    const csv = await fetch(url).then(r => r.text());
    const allowedEmails = parseCsvToEmails(csv);

    if (allowedEmails.includes(email)) {
      localStorage.setItem('inventoryAppUser', JSON.stringify(payload));
      showApp();
    } else {
      showBlocked();
    }
  } catch (e) {
    alert('Cannot reach the authorization list. Check Sheet sharing settings.');
  }
}

// Run this immediately when the page loads
window.addEventListener('load', () => {
  const saved = localStorage.getItem('authorizedUser');
  if (saved) {
    const user = JSON.parse(saved);
    showLoggedInScreen(user);               // ← skip login completely
    return;
  }
  
  // otherwise show the normal Google button
  google.accounts.id.initialize({ ... });
  google.accounts.id.renderButton(...);
});

function showLoggedInScreen(user) {
  document.querySelector('.g_id_signin').style.display = 'none';
  document.getElementById('content').style.display = 'block';
  document.getElementById('name').textContent = user.name || user.email;
}
