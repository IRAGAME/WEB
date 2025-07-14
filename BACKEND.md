# 🚀 Backend SPOOA-PM AFRICA SAFE ANESTHESIA

## 📋 Options Backend Disponibles

### 1. **Solution PHP Simple** (Recommandée pour débuter)

#### Installation :
```bash
# Aucune installation requise si vous avez PHP
# Vérifiez que PHP est installé
php --version
```

#### Configuration :
1. Modifiez `contact.php` avec votre email
2. Assurez-vous que `mail()` fonctionne sur votre serveur
3. Testez l'envoi d'email

#### Utilisation :
```bash
# Avec serveur PHP intégré
php -S localhost:8000

# Ou avec Apache/Nginx
# Placez les fichiers dans votre dossier web
```

### 2. **Solution Node.js/Express** (Moderne et scalable)

#### Installation :
```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start

# Mode développement (avec auto-reload)
npm run dev
```

#### Configuration Email :
1. Modifiez `server.js` avec vos credentials Gmail
2. Activez l'authentification à 2 facteurs sur Gmail
3. Générez un mot de passe d'application

#### Variables d'environnement :
```bash
# Copiez config.env vers .env
cp config.env .env

# Modifiez .env avec vos vraies valeurs
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

## 🔧 API Endpoints

### POST `/api/contact`
Envoie un message de contact

**Body :**
```json
{
  "nom": "John Doe",
  "email": "john@example.com",
  "telephone": "+243123456789",
  "pays": "rdc",
  "sujet": "formation",
  "message": "Bonjour, je souhaite...",
  "newsletter": true
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Message envoyé avec succès !"
}
```

### GET `/api/stats`
Récupère les statistiques

**Réponse :**
```json
{
  "members": 1000,
  "countries": 15,
  "modules": 12,
  "hospitals": 50
}
```

### GET `/api/modules`
Récupère les modules de formation

**Réponse :**
```json
[
  {
    "id": 1,
    "title": "Anesthésie Pédiatrique",
    "description": "Formation spécialisée...",
    "status": "completed",
    "duration": "4h",
    "icon": "fas fa-baby"
  }
]
```

## 🛠️ Fonctionnalités Backend

### ✅ Validation des données
- Validation email
- Champs obligatoires
- Protection contre les injections

### ✅ Envoi d'emails
- Template HTML professionnel
- Logs des messages
- Gestion des erreurs

### ✅ Sécurité
- CORS configuré
- Validation côté serveur
- Protection XSS

### ✅ Logs et Monitoring
- Logs des contacts
- Gestion des erreurs
- Statistiques d'usage

## 🌐 Déploiement

### Option 1 : Hébergement PHP
- **Netlify** : Upload des fichiers statiques + fonctions
- **Vercel** : Support PHP
- **Hébergeur classique** : cPanel, Plesk

### Option 2 : Hébergement Node.js
- **Heroku** : `git push heroku main`
- **Railway** : Déploiement automatique
- **DigitalOcean** : Droplet avec PM2
- **AWS** : EC2 ou Lambda

### Configuration Production :
```bash
# Variables d'environnement
NODE_ENV=production
PORT=3000
EMAIL_USER=contact@spooa-pm-africa.org
EMAIL_PASS=your-secure-password

# PM2 pour Node.js
npm install -g pm2
pm2 start server.js --name "spooa-pm-africa"
pm2 startup
pm2 save
```

## 📧 Configuration Email

### Gmail :
1. Activez l'authentification à 2 facteurs
2. Générez un mot de passe d'application
3. Utilisez ces credentials dans le code

### Autres services :
- **SendGrid** : API key
- **Mailgun** : API key
- **AWS SES** : Credentials AWS

## 🔒 Sécurité

### Recommandations :
- Utilisez HTTPS en production
- Validez toutes les entrées
- Limitez les tentatives de contact
- Utilisez des variables d'environnement
- Logs des tentatives d'attaque

### Protection contre le spam :
```javascript
// Ajoutez dans server.js
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives. Réessayez plus tard.'
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  // ... votre code
});
```

## 📊 Monitoring

### Logs :
```bash
# Logs des contacts
tail -f contact_log.txt

# Logs Node.js
pm2 logs spooa-pm-africa
```

### Métriques :
- Nombre de contacts par jour
- Taux de succès des emails
- Temps de réponse de l'API

## 🚀 Prochaines Étapes

### Fonctionnalités avancées :
1. **Base de données** : MySQL/PostgreSQL
2. **Authentification** : JWT + sessions
3. **Dashboard admin** : Gestion des contacts
4. **Notifications** : SMS + push
5. **Analytics** : Google Analytics
6. **CDN** : Cloudflare pour les assets

### Intégrations :
- **CRM** : HubSpot, Salesforce
- **Email marketing** : Mailchimp
- **Support** : Zendesk, Freshdesk
- **Analytics** : Google Analytics, Mixpanel

---

**💡 Conseil** : Commencez avec la solution PHP pour tester rapidement, puis migrez vers Node.js si vous avez besoin de plus de fonctionnalités. 