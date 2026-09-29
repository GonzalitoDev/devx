export interface AssistantMessage {
  role: "user" | "bot";
  text: string;
}

const JOKES = [
  "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 == DEC 25. 🎃🎄",
  "Hay 10 tipos de personas: las que entienden binario y las que no. 😏",
  "Mi código funciona. No tengo idea de por qué. No lo toques.",
  "¿Qué le dice un bit a otro? Nos vemos en el bus. 🚌",
  "Un programador caminaba por la playa y le gritó al mar: '¡Hey, suéltala!'… la marea nunca devuelve el push. 🌊",
  "¿Por qué el programador fue a terapia? Porque tenía demasiados issues abiertos. 🛋️",
  "Hay dos cosas difíciles en informática: invalidar cachés, nombrar cosas y el off-by-one.",
  "El código que escribís a las 3am es un regalo que te encontrás a las 9am y no querés abrir. 🎁",
  "Programador: alguien que convierte café en código. ☕➡️💻",
  "¿Sabías que 'sudo' es 'su perro? Ordena' en los labios de un admin? (No, no es verdad. Corré el sudo igual.)",
];

const EXCUSES = [
  "Mi perro compiló mi código y borró el repo. 🐶",
  "Se me cayó el servidor y rodó por la escalera.",
  "Estaba probando el entorno de producción… en producción.",
  "El teclado se me adelantó y escribió 'git push --force'. Fue un reflejo.",
  "Tenía merge conflicts conmigo mismo.",
  "El código funcionaba en mi máquina… hasta que la máquina se enteró.",
  "Me distraje debuggeando un bug que resultó ser una feature.",
  "La Wi-Fi me dijo 'es tu problema ahora'. Y me abandonó.",
];

const COMMITS = [
  "fix: arreglé un bug que no existía (recomiendo no preguntar)",
  "refactor: renombré variables para que tengan sentido (nadie las va a leer)",
  "wip: trabajo en progreso, no me preguntes en qué",
  "fix: ahora sí, juro que era un tema de caché",
  "feat: agregué una feature que nadie pidió pero todos necesitábamos",
  "fix: corregido el typo que rompía TODO",
  "docs: actualicé el README (mentira, no leí el README)",
  "chore: moví una función y ahora no sé dónde quedó",
];

const HOROSCOPES = [
  "🔮 Tu horóscopo dev: hoy el refactor que venís postergando te va a morder. Hacelo, pero no hoy.",
  "🔮 Mercurio retrógrado afecta tus deploys. Todo se compila, pero en la nube llueve.",
  "🔮 Hoy tu intuición dice 'solo un cambio más'. Tu experiencia dice 'no'. Escuchá a tu experiencia.",
  "🔮 Las estrellas alinean con tu stack: van a haber más bugs, pero también más memes.",
  "🔮 Tu signo lunar indica que el bug es de producción y el martes no existe.",
  "🔮 Cuidado con el café de las 4pm: predice una noche en vela con 'stack overflow'. ☕",
];

const ROASTS = [
  "Tu código no tiene bugs. Tiene características no documentadas que nadie pidió.",
  "Nivel de tu variable 'data2': avanzado. La 'data3' es para juniors.",
  "Usás tabs y espacios a la vez, ¿verdad? Se nota que amás el caos.",
  "Tu último PR tiene más comentarios 'TODO' que código funcionando.",
  "Lo de espaciar con 2 espacios es lindo… si te gusta la aventura.",
  "Tu función tiene 3 responsabilidades. Es un triunvirato sin democracia.",
];

const MOTIVATION = [
  "El bug de hoy es la historia de éxito de mañana. O al menos un buen post de Stack Overflow.",
  "Nadie nace sabiendo. Esa persona que admiras también googlea 'como hacer un for'.",
  "Dale, que el deploy verde se siente mejor que un café. Casi.",
  "Cada error te enseña algo. Excepto el de la fecha, ese te enseña nada.",
  "Sos un 10. Tu teclado es un 9 (le falta la tecla de pánico).",
  "El código legacy se conquista de a un archivo por vez. ¡Vos podés!",
];

const FALLBACKS = [
  "Eso suena a una pregunta de Stack Overflow con 0 votos. Igual te respondo: 42.",
  "Mi cerebro de bot dice 'sí', pero mi CPU dice 'no sé'. 🤖",
  "Interesante. Voy a necesitar otro café antes de opinar. ☕",
  "Eso me recuerda a un commit que hice a las 3am. No lo cuento.",
  "¿Lo googleaste? Porque mi respuesta sería 'depende'.",
  "Puedo responderte, pero prefiero tirarte un chiste: ¿por qué el desenvolupador se bañó? Para que el código no le huele a break… (ok, ese venía en catalán).",
  "Sabés que soy un bot, ¿no? Mis respuestas valen lo que un feature sin tests.",
  "Mmm, eso amerita un `console.log('🤔')`.",
];

const CAFE = [
  "El café: el único framework que nunca te falla y siempre te devuelve algo. ☕",
  "¿Café? Te recomiendo uno que compile en menos de 2 minutos y no tire warnings.",
  "Decime cuánto café tomás y te digo cuántos bugs te dejás sin resolver.",
];

const BUG = [
  "Un bug es solo una feature que no le contaste a nadie todavía. 🐛",
  "El bug no existe. Es 'comportamiento imprevisto' (lo aprendí en una reunión).",
  "¿Un bug? Ah, esa función que escribiste con fe y esperanza.",
];

const MEMES = [
  "Memes de dev: el 90% son sobre 'funciona en mi máquina'. Y yo, orgullosamente, soy el 10% que no lo sube. 😎",
  "Si el código da miedo, ponele un meme de perrito en el PR y listo.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const ASSISTANT_NAME = "Buggy";

export function welcome(userName: string): string {
  return `¡Hola ${userName || "dev"}! 👋 Soy ${ASSISTANT_NAME}, tu asistente social con humor de programador.\n\nPodés pedirme: un *chiste*, una *excusa* para no hacer una tarea, un *commit* random, tu *horóscopo dev*, que te *roaste* o que te *motive*. ¡Probalo! 🐛`;
}

export function replyTo(input: string, userName: string): string {
  const q = input.toLowerCase();

  if (/(hola|buenas|buenas|hey|que tal|qué tal|como estas|como andas)/.test(q) && q.length < 40) {
    return pick([
      `¡Hola ${userName || "dev"}! ¿Ya tomaste café o estamos en modo debug? ☕`,
      "¡Hey! ¿Listo para programar o listo para procrastinar? Acá no juzgamos, acá commitamos.",
      `¡Hola! 🐛 Espero que tu código compile a la primera (spoiler: casi nunca pasa).`,
    ]);
  }

  if (/gracias/.test(q)) {
    return pick([
      "De nada. Si fuera un humano te cobraría, pero soy un bot. El café sí acepto. ☕",
      "¡A la orden! Ponelo en el README como contribución moral.",
    ]);
  }

  if (/adios|chau|nos vemos|hasta luego/.test(q)) {
    return pick([
      "¡Chau! Que tus deploy sean verdes y tus warnings sean pocos. 👋",
      "Nos vemos. Cuidate del `rm -rf` y de los lunes.",
    ]);
  }

  if (/chiste|joke|algo gracioso|reime/.test(q)) return pick(JOKES);
  if (/excusa/.test(q)) return pick(EXCUSES);
  if (/commit|mensaje de commit/.test(q)) return pick(COMMITS);
  if (/horoscopo|horóscopo|estrella|suerte/.test(q)) return pick(HOROSCOPES);
  if (/roast|insultame|ofendeme|criticame/.test(q)) return pick(ROASTS);
  if (/motiv|triste|tengo miedo|no puedo|ansiedad|estresado|estresad/.test(q)) return pick(MOTIVATION);
  if (/cafe|café|coffee/.test(q)) return pick(CAFE);
  if (/bug|error|falla|excepcion|exception/.test(q)) return pick(BUG);
  if (/meme/.test(q)) return pick(MEMES);
  if (/quien sos|qué sos|que sos|quien eres/.test(q)) {
    return `Soy ${ASSISTANT_NAME} 🐛, el asistente social de DevX. Mi humor es de dev, mi café es infinito y mis respuestas no tienen tests.`;
  }
  if (/como publico|publicar|como hago un post|subir/.test(q)) {
    return "Para publicar tocá el botón 'Publicar' de la barra lateral (o el botón flotante en el celular). Escribí algo, si querés pegale un `código`, y dale. ¡Que tu primer post sea épico! 🚀";
  }

  return pick(FALLBACKS);
}