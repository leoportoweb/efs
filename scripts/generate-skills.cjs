const skills = [
  { id: 1,  en: "Double Touch",               ptPT: "Toque Duplo",                ptBR: "Pedalada simples" },
  { id: 2,  en: "Sombrero",                   ptPT: "Chapéu",                     ptBR: "Chapéu" },
  { id: 3,  en: "Cut Behind Turn",            ptPT: "Corte Atrás",                ptBR: "Corte com virada" },
  { id: 4,  en: "Heel Trick",                 ptPT: "Passe de Letra",             ptBR: "Finta de letra" },
  { id: 5,  en: "Heading",                    ptPT: "Cabeceio",                   ptBR: "Cabeçada" },
  { id: 6,  en: "Chip Shot Control",          ptPT: "Controlo de Chapéu",         ptBR: "Controle da cavadinha" },
  { id: 7,  en: "Long Range Shooting",        ptPT: "Remate de Longa Distância",  ptBR: "Chute com o peito do pé" },
  { id: 8,  en: "Knuckle Shot",               ptPT: "Folha Seca",                 ptBR: "Folha seca" },
  { id: 9,  en: "Rising Shots",               ptPT: "Remates Ascendentes",        ptBR: "Chute ascendente" },
  { id: 10, en: "Acrobatic Finishing",        ptPT: "Finalização Acrobática",     ptBR: "Finalização acrobática" },
  { id: 11, en: "First Time Shot",            ptPT: "Remate de Primeira",         ptBR: "Chute de primeira" },
  { id: 12, en: "One Touch Pass",             ptPT: "Passe de Primeira",          ptBR: "Passe de primeira" },
  { id: 13, en: "Through Passing",            ptPT: "Passe em Profundidade",      ptBR: "Passe em profundidade" },
  { id: 14, en: "Weighted Pass",              ptPT: "Passe Ponderado",            ptBR: "Passe na medida" },
  { id: 15, en: "Pinpoint Crossing",          ptPT: "Cruzamento Preciso",         ptBR: "Cruzamento preciso" },
  { id: 16, en: "Outside Curler",             ptPT: "Trivela",                    ptBR: "De letra" },
  { id: 17, en: "No Look Pass",               ptPT: "Passe sem Olhar",            ptBR: "Passe sem olhar" },
  { id: 18, en: "Low Lofted Pass",            ptPT: "Passe Alto Baixo",           ptBR: "Passe aéreo baixo" },
  { id: 19, en: "GK Low Punt",                ptPT: "GR Punt Baixo",              ptBR: "Reposição baixa do GO" },
  { id: 20, en: "GK High Punt",               ptPT: "GR Punt Alto",               ptBR: "Reposição alta do GO" },
  { id: 21, en: "Long Throw",                 ptPT: "Lançamento Longo",           ptBR: "Arremesso lateral longo" },
  { id: 22, en: "GK Long Throw",              ptPT: "GR Lançamento Longo",        ptBR: "Arremesso longo do GO" },
  { id: 23, en: "Penalty Specialist",         ptPT: "Especialista em Penáltis",   ptBR: "Especialista em pênalti" },
  { id: 24, en: "GK Penalty Saver",           ptPT: "GR Defesa de Penáltis",      ptBR: "Pegador de pênaltis" },
  { id: 25, en: "Gamesmanship",               ptPT: "Jogos de Cintura",           ptBR: "Malícia" },
  { id: 26, en: "Man Marking",                ptPT: "Marcação Individual",        ptBR: "Marcação individual" },
  { id: 27, en: "Track Back",                 ptPT: "Recuperação Defensiva",      ptBR: "Volta para marcar" },
  { id: 28, en: "Interception",               ptPT: "Interceção",                 ptBR: "Interceptação" },
  { id: 29, en: "Acrobatic Clear",            ptPT: "Desvio Acrobático",          ptBR: "Afastamento acrobático" },
  { id: 30, en: "Captaincy",                  ptPT: "Capitania",                  ptBR: "Liderança" },
  { id: 31, en: "Super Sub",                  ptPT: "Super Suplente",             ptBR: "Super substituto" },
  { id: 32, en: "Fighting Spirit",            ptPT: "Espírito de Luta",           ptBR: "Espírito guerreiro" },
  { id: 33, en: "Blocker",                    ptPT: "Bloqueador",                 ptBR: "Bloqueador" },
  { id: 34, en: "Aerial Superiority",         ptPT: "Superioridade Aérea",        ptBR: "Superioridade aérea" },
  { id: 35, en: "Sliding Tackle",             ptPT: "Carrinho",                   ptBR: "Carrinho" },
  { id: 36, en: "Toque de Calcanhar",         ptPT: "Toque de Calcanhar",         ptBR: "Toque de calcanhar" }
];

const output = {
  version: "2.0.0",
  updated: new Date().toISOString(),
  skills: skills.map(s => ({
    id: s.id,
    names: { en: s.en, ptPT: s.ptPT, ptBR: s.ptBR },
    count: 0
  }))
};

const { writeFileSync } = require('fs');
writeFileSync('public/skills.json', JSON.stringify(output, null, 2));
console.log('skills.json generated with', skills.length, 'skills');