// ---- Dog list: edit this to add or change dogs ----
// "breed" is used to fetch a real photo from the free Dog CEO API.
const dogs = [
  { name: "Bruno",   breed: "labrador",        label: "Labrador",        size: "Large",  age: "2 months", gender: "Male",   price: 18000 },
  { name: "Luna",    breed: "husky",           label: "Siberian Husky",  size: "Large",  age: "3 months", gender: "Female", price: 35000 },
  { name: "Coco",    breed: "beagle",          label: "Beagle",          size: "Medium", age: "2 months", gender: "Female", price: 15000 },
  { name: "Mochi",   breed: "pug",             label: "Pug",             size: "Small",  age: "2 months", gender: "Male",   price: 14000 },
  { name: "Teddy",   breed: "pomeranian",      label: "Pomeranian",      size: "Small",  age: "3 months", gender: "Male",   price: 20000 },
  { name: "Rocky",   breed: "germanshepherd",  label: "German Shepherd", size: "Large",  age: "2 months", gender: "Male",   price: 22000 },
  { name: "Daisy",   breed: "retriever/golden",label: "Golden Retriever",size: "Large",  age: "2 months", gender: "Female", price: 25000 },
  { name: "Max",     breed: "bulldog/french",  label: "French Bulldog",  size: "Small",  age: "3 months", gender: "Male",   price: 45000 },
  { name: "Bella",   breed: "shihtzu",         label: "Shih Tzu",        size: "Small",  age: "2 months", gender: "Female", price: 16000 },
  { name: "Ginger",  breed: "corgi/cardigan",  label: "Corgi",           size: "Medium", age: "3 months", gender: "Female", price: 40000 },
  { name: "Thor",    breed: "rottweiler",      label: "Rottweiler",      size: "Large",  age: "2 months", gender: "Male",   price: 24000, sold: true },
  { name: "Zara",    breed: "doberman",        label: "Doberman",        size: "Large",  age: "3 months", gender: "Female", price: 23000 }
];

const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#e3eef0'/>" +
  "<text x='50%' y='55%' font-size='80' text-anchor='middle'>🐶</text></svg>"
);

const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const heroPhotos = document.getElementById("heroPhotos");
const dialog = document.getElementById("dialog");
const dialogTitle = document.getElementById("dialogTitle");
const toast = document.getElementById("toast");
let currentDog = null;

const rupees = n => "₹" + n.toLocaleString("en-IN");

async function getPhoto(breedPath) {
  try {
    const res = await fetch(`https://dog.ceo/api/breed/${breedPath}/images/random`);
    const data = await res.json();
    return data.status === "success" ? data.message : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

function makeCard(dog) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <img alt="${dog.label} puppy named ${dog.name}" src="${FALLBACK}" loading="lazy">
    <div class="card-body">
      <span class="tag ${dog.sold ? "sold" : ""}">${dog.sold ? "Sold" : "Available"}</span>
      <h3>${dog.name}</h3>
      <p class="meta">${dog.label} · ${dog.gender} · ${dog.age}</p>
      <p class="price">${rupees(dog.price)}</p>
      <button class="btn" ${dog.sold ? "disabled" : ""}>${dog.sold ? "Sold out" : "Ask about " + dog.name}</button>
    </div>`;
  const img = card.querySelector("img");
  getPhoto(dog.breed).then(url => { img.src = url; });
  img.addEventListener("error", () => { img.src = FALLBACK; }, { once: true });
  if (!dog.sold) card.querySelector("button").addEventListener("click", () => openDialog(dog));
  return card;
}

function render(size = "All") {
  grid.innerHTML = "";
  dogs.filter(d => size === "All" || d.size === size)
      .forEach(d => grid.appendChild(makeCard(d)));
}

function buildFilters() {
  ["All", "Small", "Medium", "Large"].forEach((size, i) => {
    const b = document.createElement("button");
    b.textContent = size === "All" ? "All dogs" : size + " dogs";
    b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", () => {
      filters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      render(size);
    });
    filters.appendChild(b);
  });
}

function openDialog(dog) {
  currentDog = dog;
  dialogTitle.textContent = `Ask about ${dog.name} (${dog.label})`;
  dialog.showModal();
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

document.getElementById("cancelBtn").addEventListener("click", () => dialog.close());
document.getElementById("inquiryForm").addEventListener("submit", () => {
  // No server here: connect this to your email, WhatsApp or form service.
  showToast(`Thanks! We'll call you about ${currentDog.name} soon.`);
  document.getElementById("inquiryForm").reset();
});

// Hero photos
["labrador", "beagle", "retriever/golden"].forEach(async breed => {
  const img = document.createElement("img");
  img.alt = "";
  img.src = FALLBACK;
  heroPhotos.appendChild(img);
  img.src = await getPhoto(breed);
});

document.getElementById("year").textContent = new Date().getFullYear();
buildFilters();
render();
