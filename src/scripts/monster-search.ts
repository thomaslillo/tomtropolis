interface MonsterReference {
  index: string;
  name: string;
  url: string;
}

interface Monster {
  name: string;
  type: string;
  subtype?: string;
  size: string;
  alignment: string;
  hit_points: number;
  languages: string;
  challenge_rating: number | string;
  image?: string;
}

interface MonsterListResponse {
  results: MonsterReference[];
}

const API_BASE = "https://www.dnd5eapi.co/api";
const CACHE_KEY = "monsterNames";
const CACHE_TIME_KEY = "monsterNamesCachedAt";
const CACHE_TTL = 24 * 60 * 60 * 1000;

const form = document.getElementById("monsterSearchForm") as HTMLFormElement | null;
const monsterInput = document.getElementById("monsterInput") as HTMLInputElement | null;
const monsterResult = document.getElementById("monsterResult") as HTMLDivElement | null;
const suggestionsDropdown = document.getElementById("suggestionsDropdown") as HTMLDivElement | null;

if (form && monsterInput && monsterResult && suggestionsDropdown) {
  void loadMonsterNames();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const monsterName = monsterInput.value.trim();
    if (!monsterName) {
      showMessage("Please enter a monster name, like 'goblin'.");
      return;
    }
    void searchMonster(monsterName);
  });

  monsterInput.addEventListener("input", () => {
    const suggestions = searchMonsterSuggestions(monsterInput.value.trim().toLowerCase());
    renderSuggestions(suggestions);
  });

  document.addEventListener("click", (event) => {
    if (event.target !== monsterInput && !suggestionsDropdown.contains(event.target as Node)) {
      hideSuggestions();
    }
  });
}

async function loadMonsterNames(): Promise<MonsterReference[]> {
  const cached = getCachedMonsterNames();
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/monsters`);
    if (!response.ok) throw new Error(`Monster list request failed: ${response.status}`);
    const data = (await response.json()) as MonsterListResponse;
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.results));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getCachedMonsterNames(): MonsterReference[] {
  try {
    const cachedAt = Number(localStorage.getItem(CACHE_TIME_KEY));
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as MonsterReference[] | null;
    if (Array.isArray(cached) && cachedAt && Date.now() - cachedAt < CACHE_TTL) return cached;
  } catch (error) {
    console.warn("Unable to read monster cache.", error);
  }
  return [];
}

function searchMonsterSuggestions(partialName: string): string[] {
  if (!partialName) return [];
  const monsterNames = getCachedMonsterNames().map((monster) => monster.index.replaceAll("-", " "));
  const startsWithMatches = monsterNames.filter((monster) => monster.startsWith(partialName));
  const firstCharacter = partialName.charAt(0);
  const containsMatches = monsterNames.filter(
    (monster) => !monster.startsWith(partialName) && monster.includes(firstCharacter) && matchCharactersInOrder(monster, partialName),
  );
  return [...startsWithMatches, ...containsMatches].slice(0, 5);
}

function matchCharactersInOrder(monsterName: string, partialName: string): boolean {
  let partialIndex = 0;
  for (const character of monsterName) {
    if (character === partialName[partialIndex]) partialIndex++;
  }
  return partialIndex === partialName.length;
}

function renderSuggestions(suggestions: string[]): void {
  if (!suggestionsDropdown || !monsterInput) return;
  suggestionsDropdown.replaceChildren();
  suggestions.forEach((suggestion) => {
    const item = document.createElement("button");
    item.type = "button";
    item.textContent = suggestion;
    item.className = "block w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100";
    item.setAttribute("role", "option");
    item.addEventListener("click", () => {
      monsterInput.value = suggestion;
      hideSuggestions();
      void searchMonster(suggestion);
    });
    suggestionsDropdown.appendChild(item);
  });
  suggestionsDropdown.classList.toggle("hidden", suggestions.length === 0);
  monsterInput.setAttribute("aria-expanded", String(suggestions.length > 0));
}

function hideSuggestions(): void {
  suggestionsDropdown?.classList.add("hidden");
  monsterInput?.setAttribute("aria-expanded", "false");
}

async function searchMonster(monsterName: string): Promise<void> {
  if (!monsterResult) return;
  hideSuggestions();
  showMessage("Searching...");
  const slug = monsterName.trim().toLowerCase().replace(/\s+/g, "-");

  try {
    const response = await fetch(`${API_BASE}/monsters/${encodeURIComponent(slug)}`);
    if (!response.ok) throw new Error(`Monster request failed: ${response.status}`);
    const data = (await response.json()) as Monster;
    renderMonster(data);
  } catch (error) {
    console.error(error);
    showMessage("Monster not found. Try another name or choose a suggestion.");
  }
}

function showMessage(message: string): void {
  monsterResult?.replaceChildren(document.createTextNode(message));
}

function renderMonster(monster: Monster): void {
  if (!monsterResult) return;
  const container = document.createElement("div");
  container.className = "m-2 font-mono";
  const heading = document.createElement("h2");
  heading.textContent = monster.name;
  container.appendChild(heading);

  const details: Array<[string, string | number | undefined]> = [
    ["Type", monster.type],
    ["Subtype", monster.subtype],
    ["Size", monster.size],
    ["Alignment", monster.alignment],
    ["Health", monster.hit_points],
    ["Languages", monster.languages],
    ["Challenge Rating", monster.challenge_rating],
  ];
  details.forEach(([label, value]) => {
    if (value === undefined || value === "") return;
    const paragraph = document.createElement("p");
    const labelElement = document.createElement("strong");
    labelElement.textContent = label;
    paragraph.append(labelElement, `: ${value}`);
    container.appendChild(paragraph);
  });

  if (monster.image) {
    const image = document.createElement("img");
    image.src = `https://www.dnd5eapi.co${monster.image}`;
    image.alt = `${monster.name} illustration`;
    image.loading = "lazy";
    image.className = "mt-4 max-w-full";
    container.appendChild(image);
  }
  monsterResult.replaceChildren(container);
}
