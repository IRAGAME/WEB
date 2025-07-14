const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir les fichiers statiques

// Configuration email
const transporter = nodemailer.createTransporter({
    service: 'gmail', // ou autre service
    auth: {
        user: 'your-email@gmail.com', // À configurer
        pass: 'your-app-password' // À configurer
    }
});

// Routes API
app.post('/api/contact', async (req, res) => {
    try {
        const { nom, email, telephone, pays, sujet, message, newsletter } = req.body;

        // Validation
        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Adresse email invalide'
            });
        }

        // Configuration email
        const mailOptions = {
            from: email,
            to: 'contact@spooa-pm-africa.org',
            subject: `[SPOOA-PM AFRICA] ${sujet}`,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom:</strong> ${nom}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Téléphone:</strong> ${telephone || 'Non fourni'}</p>
                <p><strong>Pays:</strong> ${pays || 'Non fourni'}</p>
                <p><strong>Sujet:</strong> ${sujet}</p>
                <p><strong>Newsletter:</strong> ${newsletter ? 'Oui' : 'Non'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Envoyer l'email
        await transporter.sendMail(mailOptions);

        // Log
        console.log(`Nouveau message de ${nom} (${email}) - ${sujet}`);

        res.json({
            success: true,
            message: 'Message envoyé avec succès ! Nous vous répondrons dans les 24h.'
        });

    } catch (error) {
        console.error('Erreur email:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi du message'
        });
    }
});

// Route pour les statistiques (exemple)
app.get('/api/stats', (req, res) => {
    res.json({
        members: 1000,
        countries: 15,
        modules: 12,
        hospitals: 50
    });
});

// Route pour les modules de formation
app.get('/api/modules', (req, res) => {
    res.json([
        {
            id: 1,
            title: 'Anesthésie Pédiatrique',
            description: 'Formation spécialisée pour la prise en charge anesthésique des enfants',
            status: 'completed',
            duration: '4h',
            icon: 'fas fa-baby'
        },
        {
            id: 2,
            title: 'Anesthésie Obstétricale',
            description: 'Formation pour améliorer la sécurité des accouchements',
            status: 'completed',
            duration: '3h',
            icon: 'fas fa-female'
        },
        {
            id: 3,
            title: 'Gestion de la Douleur',
            description: 'Techniques modernes de gestion de la douleur',
            status: 'completed',
            duration: '2h',
            icon: 'fas fa-pills'
        },
        {
            id: 4,
            title: 'Équipements Médicaux',
            description: 'Formation sur l\'utilisation des équipements d\'anesthésie',
            status: 'in-progress',
            progress: 75,
            duration: '5h',
            icon: 'fas fa-tools'
        }
    ]);
});

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur SPOOA-PM AFRICA démarré sur le port ${PORT}`);
    console.log(`📧 Backend API disponible sur http://localhost:${PORT}/api`);
    console.log(`🌐 Site web disponible sur http://localhost:${PORT}`);
});

module.exports = app; 