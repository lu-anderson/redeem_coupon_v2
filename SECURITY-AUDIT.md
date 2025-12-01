# Relatório de Auditoria de Segurança - Cupons do Amor

**Data:** 2025-12-01  
**Projeto:** cupons-do-amor---redeem  
**Versão:** 0.0.0  

---

## 📋 Resumo Executivo

Esta auditoria de segurança analisa o projeto React (web) "Cupons do Amor - Resgate" e identifica vulnerabilidades, falhas de segurança, más práticas e pontos de risco. O relatório inclui recomendações claras para correção.

---

## 🔴 Vulnerabilidades Encontradas

### 1. XSS (Cross-Site Scripting) - Prioridade: ALTA

**Localização:** `pages/RedeemPage.tsx` (linhas 127, 134-135), `components/CouponCard.tsx` (linhas 97-100, 103-108)

**Descrição:** O projeto renderiza dados vindos do Firestore diretamente no JSX sem sanitização. Campos como `coupon.name`, `coupon.message`, `coupon.observations` são renderizados diretamente.

**Impacto:** Se um atacante conseguir inserir conteúdo malicioso no banco de dados (por exemplo, através de outra interface ou diretamente no Firestore), scripts maliciosos podem ser executados no navegador dos usuários.

**Trecho suspeito:**
```tsx
// RedeemPage.tsx - linha 127
<p>Oba! O cupom <strong>{coupon.name}</strong> foi validado com sucesso.</p>

// CouponCard.tsx - linha 97-100
{coupon.message && (
  <p className="text-gray-500 italic text-sm mt-4">
    "{coupon.message}"
  </p>
)}
```

**Correção aplicada:** Criação de utilitário de sanitização (`utils/sanitize.ts`) e uso em todos os pontos de renderização de dados externos.

---

### 2. Validação Insuficiente de Entrada - Prioridade: ALTA

**Localização:** `pages/RedeemPage.tsx` (linha 185), `services/couponService.ts` (linha 43)

**Descrição:** O campo `userName` não possui validação adequada além de verificar se está vazio. O campo `id` da URL também é passado diretamente para consultas no Firestore.

**Impacto:** Usuários podem inserir caracteres especiais, scripts, ou valores malformados que podem causar problemas na aplicação ou serem usados em ataques de injeção.

**Trecho suspeito:**
```tsx
// RedeemPage.tsx
const handleRedeem = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!id || !userName.trim()) return;  // Validação insuficiente
  await redeemCoupon(id, userName);      // userName não sanitizado
};
```

**Correção aplicada:** Implementação de validação e sanitização robusta para todos os inputs.

---

### 3. Console.log com Dados Sensíveis - Prioridade: MÉDIA

**Localização:** `pages/RedeemPage.tsx` (linhas 11, 23, 27), `services/couponService.ts` (linhas 27, 98)

**Descrição:** O código contém múltiplos `console.log` que expõem dados em produção, incluindo dados do cupom.

**Impacto:** Atacantes podem usar o console do navegador para ver dados internos, facilitando ataques.

**Trecho suspeito:**
```tsx
console.log('Rendering RedeemPage');
console.log('Fetching coupon data for ID:', id);
console.log(data);  // Expõe todo o objeto do cupom
```

**Correção aplicada:** Remoção de todos os console.log em ambiente de produção ou substituição por logger controlado.

---

### 4. Falta de Segurança nas Regras do Firestore (Risco Documentado) - Prioridade: ALTA

**Localização:** `services/couponService.ts` (comentário nas linhas 32-41)

**Descrição:** O código contém um TODO indicando que as regras de segurança do Firestore precisam ser configuradas. Sem regras adequadas, qualquer pessoa pode ler/escrever no banco de dados.

**Impacto:** Acesso não autorizado a dados, manipulação de cupons, fraude.

**Correção:** Documentação das regras recomendadas de Firestore Security Rules.

---

### 5. Race Condition Potencial no useEffect - Prioridade: MÉDIA

**Localização:** `pages/RedeemPage.tsx` (linhas 21-40)

**Descrição:** O useEffect não possui cleanup para cancelar a requisição assíncrona se o componente desmontar antes da resposta.

**Impacto:** Memory leaks e possíveis estados inconsistentes se o usuário navegar antes da resposta.

**Trecho suspeito:**
```tsx
useEffect(() => {
  const fetch = async () => {
    const data = await getCoupon(id);  // Sem cancelamento
    setCoupon(data);  // Pode tentar atualizar componente desmontado
  };
  fetch();
}, [id]);
```

**Correção aplicada:** Implementação de flag de cancelamento no useEffect.

---

### 6. Exposição de Variáveis de Ambiente no Build - Prioridade: MÉDIA

**Localização:** `vite.config.ts` (linhas 13-15)

**Descrição:** O código expõe `GEMINI_API_KEY` diretamente no bundle de produção através de `process.env`.

**Impacto:** Chaves de API podem ser extraídas do código JavaScript minificado.

**Trecho suspeito:**
```ts
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

**Correção aplicada:** Remoção da exposição desnecessária de chaves de API.

---

### 7. Erro Genérico sem Tratamento Adequado - Prioridade: BAIXA

**Localização:** `pages/RedeemPage.tsx` (linhas 56-57)

**Descrição:** Erros são exibidos diretamente ao usuário via `alert()`, podendo expor detalhes internos.

**Trecho suspeito:**
```tsx
} catch (err: any) {
  alert(err.message || 'Erro ao resgatar.');  // Pode expor detalhes internos
}
```

**Correção aplicada:** Tratamento de erro mais seguro que não expõe detalhes técnicos.

---

### 8. URL Externa Não Validada - Prioridade: BAIXA

**Localização:** `pages/RedeemPage.tsx` (linha 145)

**Descrição:** A URL da Play Store está hardcoded, mas o padrão de usar `window.open` com URLs dinâmicas pode ser perigoso.

**Trecho atual:**
```tsx
window.open('https://play.google.com/store/apps/details?id=com.cuponsdoamor', '_blank')
```

**Correção:** URL está hardcoded e segura, mas adicionada validação para URLs dinâmicas.

---

### 9. Falta de Limitação de Comprimento de Input - Prioridade: BAIXA

**Localização:** `pages/RedeemPage.tsx` (linha 180-187)

**Descrição:** O campo de nome não possui `maxLength`, permitindo inputs extremamente longos.

**Correção aplicada:** Adição de `maxLength` ao input.

---

## ✅ Aspectos Positivos

1. **Uso de React.StrictMode** - Ajuda a identificar problemas potenciais
2. **TypeScript** - Fornece tipagem estática e reduz erros
3. **Variáveis de ambiente via import.meta.env** - Padrão correto do Vite para Firebase config
4. **.gitignore adequado** - Arquivos .env estão ignorados
5. **Uso de Transações Firestore** - Previne race conditions no banco
6. **Roteamento com Navigate** - Redirecionamento seguro para rotas desconhecidas

---

## 📝 Correções Implementadas

### Arquivo: `utils/sanitize.ts` (NOVO)
Utilitário de sanitização para prevenir XSS.

### Arquivo: `pages/RedeemPage.tsx`
- Removidos console.log
- Adicionada sanitização de inputs
- Implementado cleanup no useEffect para prevenir memory leaks
- Adicionado maxLength ao input
- Melhorado tratamento de erros

### Arquivo: `components/CouponCard.tsx`
- Adicionada sanitização para dados exibidos

### Arquivo: `services/couponService.ts`
- Removidos console.log
- Adicionada validação de parâmetros
- Documentação de regras de segurança recomendadas

### Arquivo: `vite.config.ts`
- Removida exposição desnecessária de API keys

---

## 🔒 Regras de Segurança Recomendadas para Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Coupons collection
    match /coupons/{couponId} {
      // Allow read for anyone with the link
      allow read: if true;
      
      // Allow update only for quantity decrement
      allow update: if 
        request.resource.data.quantity == resource.data.quantity - 1 &&
        resource.data.quantity > 0 &&
        resource.data.isActive == true &&
        // Prevent modification of other fields
        request.resource.data.name == resource.data.name &&
        request.resource.data.originalQuantity == resource.data.originalQuantity &&
        request.resource.data.userId == resource.data.userId;
      
      // Deny create and delete from this app
      allow create, delete: if false;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Allow create for coupon redemption
      allow create: if 
        request.resource.data.type == 'coupon_used' &&
        request.resource.data.isRead == false;
      
      // Deny read, update, delete from this app
      allow read, update, delete: if false;
    }
  }
}
```

---

## 📊 Checklist de Prioridade

### 🔴 Alta Prioridade (Resolver Imediatamente)
- [x] Implementar sanitização para prevenir XSS
- [x] Validar inputs de usuário
- [x] Remover console.log com dados sensíveis
- [ ] Configurar Firestore Security Rules (backend)

### 🟡 Média Prioridade (Resolver em breve)
- [x] Corrigir race condition no useEffect
- [x] Remover exposição de API keys no vite.config.ts
- [ ] Implementar rate limiting (backend)

### 🟢 Baixa Prioridade (Melhorias)
- [x] Adicionar maxLength aos inputs
- [x] Melhorar tratamento de erros
- [ ] Considerar implementar CSP headers
- [ ] Adicionar testes de segurança automatizados

---

## 📚 Recomendações para Prevenção Contínua

1. **Code Review com foco em segurança** - Revisar PRs com checklist de segurança
2. **Dependências atualizadas** - Usar `yarn audit` regularmente
3. **ESLint com plugins de segurança** - Adicionar eslint-plugin-security
4. **Testes de segurança** - Implementar testes automatizados para sanitização
5. **Monitoramento** - Implementar logging seguro e monitoramento de erros
6. **Firestore Security Rules** - Testar regras com Firebase Emulator

---

## 🛡️ Dependências Analisadas

| Pacote | Versão | Status |
|--------|--------|--------|
| react | ^19.2.0 | ✅ Atualizado |
| react-dom | ^19.2.0 | ✅ Atualizado |
| react-router-dom | ^7.9.6 | ✅ Atualizado |
| firebase | ^12.6.0 | ✅ Atualizado |
| lucide-react | ^0.554.0 | ✅ Atualizado |
| canvas-confetti | ^1.9.4 | ✅ Atualizado |
| vite | ^6.2.0 | ✅ Atualizado |
| typescript | ~5.8.2 | ✅ Atualizado |

---

**Nota:** Este relatório identifica vulnerabilidades no código frontend. A segurança completa do sistema depende também de:
- Configuração adequada do Firestore Security Rules
- Backend com validações adicionais
- Cloud Functions para operações críticas
- Monitoramento e alertas de segurança
