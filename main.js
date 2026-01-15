const btn = document.getElementById("btnMenu");
const menu = document.getElementById("mainMenu");

btn.addEventListener("click", () => {
  btn.classList.toggle("active");
  menu.classList.toggle("mobile-open");
  menu.classList.toggle("d-none");
});


const words = [
  "Bienvenido",
  "Welcome",
  "ようこそ",
  "Bienvenue",
  "Willkommen",
  "Benvenuto",
  "Bem-vindo",
  "欢迎",
  "Welkom",
  "Velkommen",
  "مرحبا بك",
  "Välkommen",
  "ברוך הבא",
  "Tervetuloa",
  "Üdvözlünk",
  "Dobrodošli",
  "Привет",
  "Witamy",
  "Bine ai venit",
  "Καλώς ήρθες",
  "Hoş geldin",
  "Chào mừng",
  "Selamat datang",
  "Karibu",
  "환영합니다"
];

const root = document.getElementById("swapText");
let current = "Bienvenido";

// direcciones posibles
const dirs = [
  { fromX: 0,   fromY: "-120%", toX: 0,   toY: "120%"  }, // entra arriba, sale abajo
  { fromX: 0,   fromY: "120%",  toX: 0,   toY: "-120%" }, // entra abajo, sale arriba
  { fromX: "-120%", fromY: 0,   toX: "120%",  toY: 0   }, // entra izq, sale der
  { fromX: "120%",  fromY: 0,   toX: "-120%", toY: 0   }  // entra der, sale izq
];

function ensureSlots(n){
  while(root.children.length < n){
    const slot = document.createElement("span");
    slot.className = "sw-slot";

    const cur = document.createElement("span");
    cur.className = "sw-char is-current";
    cur.textContent = "\u00A0"; // espacio visible

    slot.appendChild(cur);
    root.appendChild(slot);
  }
}


const chAt = (str,i) => (i < str.length ? str[i] : " ");

const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function setWord(nextWord, {
  stepDelay = 80,   // delay entre letras
  inTime = 420,     // debe coincidir con CSS swIn
  outTime = 220     // debe coincidir con CSS swOut
} = {}){
  const L = Math.max(current.length, nextWord.length);
  ensureSlots(L);

  for(let i=0;i<L;i++){
    const slot = root.children[i];
    const curEl = slot.querySelector(".sw-char.is-current");

    const fromChar = chAt(current, i);
    const toChar   = chAt(nextWord, i);

    // Si querés que SIEMPRE anime aunque sea igual, dejalo así.
    // Si NO querés animar cuando es igual, descomentá:
    if (fromChar === toChar) { await wait(stepDelay); continue; }

    // dirección aleatoria por letra (podés cambiarlo a fijo)
    const d = dirs[Math.floor(Math.random() * dirs.length)];

    // Crear el nuevo elemento (entra)
    const nextEl = document.createElement("span");
    nextEl.className = "sw-char in";
    nextEl.textContent = toChar;

    // Variables para entrada
    nextEl.style.setProperty("--from-x", d.fromX);
    nextEl.style.setProperty("--from-y", d.fromY);

    // Variables para salida de la actual
    curEl.style.setProperty("--to-x", d.toX);
    curEl.style.setProperty("--to-y", d.toY);

    // Seteo texto actual (por si venía vacío)
    curEl.textContent = fromChar;

    // Montar la nueva arriba
    slot.appendChild(nextEl);

    // Disparar salida de la actual
    curEl.classList.add("out");

    // Esperar a que termine la salida y la entrada (sincronizamos con la entrada)
    await wait(Math.max(inTime, outTime));

    // Limpieza: borrar vieja y dejar nueva como current
    curEl.remove();
    nextEl.classList.remove("in");
    nextEl.classList.add("is-current");

    await wait(stepDelay);
  }

  current = nextWord;
}

function setWordInstant(word){
  const L = word.length;
  ensureSlots(L);

  for(let i=0;i<L;i++){
    const slot = root.children[i];
    let cur = slot.querySelector(".sw-char.is-current");
    cur.textContent = word[i];
  }

  current = word;
}

let idx = 0;
let animando = false;

async function cambiar() {
  if (animando) return;           // evita superposición
  animando = true;

  idx = (idx + 1) % words.length;
  await setWord(words[idx], { stepDelay: 50 }); // esperar a que termine

  animando = false;

  setTimeout(cambiar, 1000);
}

setWordInstant(words[0]);

setTimeout(cambiar, 1150);


