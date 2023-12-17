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

function searchMonster(monsterName) {
  monsterResult.innerHTML = "Searching...";

  axios
    .get(`https://www.dnd5eapi.co/api/monsters`)
    .then((response) => {
      const monsters = response.data.results;
      const matchedMonster = monsters.find(
        (monster) => monster.name.toLowerCase() === monsterName
      );

      if (matchedMonster) {
        axios
          .get(matchedMonster.url)
          .then((monsterResponse) => {
            const monsterData = monsterResponse.data;
            monsterResult.innerHTML = `
              <h2>${monsterData.name}</h2>
              <p><strong>Index:</strong> ${monsterData.index}</p>
              <!-- You can display more monster details here -->
            `;
          })
          .catch((error) => {
            monsterResult.innerHTML = "Error fetching monster details.";
          });
      } else {
        monsterResult.innerHTML = "Monster not found.";
      }
    })
    .catch((error) => {
      monsterResult.innerHTML = "Error fetching monsters.";
    });
}