// Picante (18+) premium texts, copied from the app seed (codespaces-blank
// src/utils/couponTemplates.ts). A sent coupon stores the masked template name;
// the redeem page maps it to the unmasked premium name and description.

export interface PremiumText {
  name: string;
  description: string;
}

export const PREMIUM_TEXTS: Record<string, PremiumText> = {
  "Pedido ******** Específico": { name: "Fantasia à sua escolha", description: "Hoje você pode pedir uma fantasia ou atitude especial, dentro do que a gente combinou." },
  "Toque ******** Diferenciado": { name: "Toque no seu ritmo", description: "Você escolhe o tipo de toque e o ritmo. Sem pressa." },
  "Roteiro ******** Personalizado": { name: "Roteiro quente", description: "A gente cria juntos um roteiro para seguir hoje." },
  "Surpresa ******** no Quarto": { name: "Quarto preparado", description: "Eu preparo tudo: ambiente, clima e proposta." },
  "Cena ******** com Venda": { name: "Cena com venda", description: "Você relaxa, eu conduzo com cuidado." },
  "Pulso ******** (dou ou recebo)": { name: "Quem conduz", description: "Hoje você escolhe quem conduz e quem segue." },
  "O Jogo dos 5 Minutos ********": { name: "Jogo dos 5 minutos", description: "Durante 5 minutos, você manda no jogo." },
  "Explorar ******** em Silêncio": { name: "Em silêncio", description: "Silêncio total. Só as sensações." },
  "Escolha ******** Surpresa": { name: "Surpresa picante", description: "Eu escolho algo picante que você já tenha aprovado, e realizo." },
  "Sessão ******** Guiada": { name: "Sessão guiada", description: "Você relaxa enquanto eu conduzo, com cuidado e consenso." },
};
