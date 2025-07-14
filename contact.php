<?php
// Configuration
$admin_email = "iragimargos@gmail.com";
$site_name = "SPOOA-PM AFRICA SAFE ANESTHESIA";

// Headers pour éviter les problèmes CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Vérifier si c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données du formulaire
$data = json_decode(file_get_contents('php://input'), true);

// Validation des données
$required_fields = ['nom', 'email', 'sujet', 'message'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $errors[] = "Le champ '$field' est requis";
    }
}

// Validation email
if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "L'adresse email n'est pas valide";
}

// S'il y a des erreurs
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Erreurs de validation', 'errors' => $errors]);
    exit;
}

// Préparer le contenu de l'email
$nom = htmlspecialchars($data['nom']);
$email = htmlspecialchars($data['email']);
$telephone = htmlspecialchars($data['telephone'] ?? '');
$pays = htmlspecialchars($data['pays'] ?? '');
$sujet = htmlspecialchars($data['sujet']);
$message = htmlspecialchars($data['message']);
$newsletter = isset($data['newsletter']) ? 'Oui' : 'Non';

// Sujet de l'email
$email_subject = "[$site_name] Nouveau message - $sujet";

// Contenu de l'email
$email_content = "
Nouveau message reçu via le formulaire de contact :

Nom : $nom
Email : $email
Téléphone : $telephone
Pays : $pays
Sujet : $sujet
Newsletter : $newsletter

Message :
$message

---
Ce message a été envoyé depuis le formulaire de contact de $site_name
";

// Headers de l'email
$headers = [
    'From' => $email,
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
];

// Envoyer l'email
$mail_sent = mail($admin_email, $email_subject, $email_content, $headers);

// Sauvegarder dans un fichier log (optionnel)
$log_entry = date('Y-m-d H:i:s') . " - $nom ($email) - $sujet\n";
file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);

// Réponse
if ($mail_sent) {
    echo json_encode([
        'success' => true, 
        'message' => 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les 24h.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    ]);
}
?> 