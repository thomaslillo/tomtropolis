const monsterInput = document.getElementById("monsterInput");
const searchButton = document.getElementById("searchButton");
const monsterResult = document.getElementById("monsterResult");

searchButton.addEventListener("click", () => {
  const monsterName = monsterInput.value.toLowerCase();
  if (monsterName) {
    searchMonster(monsterName);
  } else {
    monsterResult.innerHTML = "Please enter a monster name.";
  }
});

async function searchMonster(monsterName) {
  // loading message
  monsterResult.innerHTML = "Searching...";
  // search for the monster
  const monsterNameFormatted = monsterName.toLowerCase().replace(" ", "-");

  try {
    const response = await fetch(
      `https://www.dnd5eapi.co/api/monsters/${monsterNameFormatted}`
    );
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    // display the moster
    // TODO make this more dynamic and a seperate function
    monsterResult.innerHTML = `
    <div class="m-2 font-mono">
      <h1>${data.name}</h1>
      <p><strong>Type:</strong> ${data.type}</p>
      ${data.subtype ? `<p><strong>Subtype:</strong> ${data.subtype}</p>` : ''}
      <p><strong>Size:</strong> ${data.size}</p>
      <p><strong>Alignment:</strong> ${data.alignment}</p>
      <p><strong>Health:</strong> ${data.hit_points}</p>
      <p><strong>Languages:</strong> ${data.languages}</p>
      <p><strong>Challenge Rating:</strong> ${data.challenge_rating}</p>
      ${ data.image ? `<img src="https://www.dnd5eapi.co${data.image}">` : '' }      
    </div>
    `;    
  } catch (error) { 
    console.log(error);
    monsterResult.innerHTML = `Monster not found, please try again with a 
    different monster or different name for the same moster.`;
  }
}