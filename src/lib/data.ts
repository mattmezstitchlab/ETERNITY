import type {
  AgendaEvent,
  BudgetItem,
  Capsule,
  Clip,
  Contact,
  Folder,
  Message,
  PublicProfile,
  Task,
  User,
} from './types';

/**
 * Données de démonstration — scénario MVP « Mariage de Sophie & Lucas »
 * 15 juin 2027 · 89 invités · QR AIME-742-PLM
 * (remplacé par Supabase en production — schéma identique)
 */

export const SEED_USER: User = {
  id: 'usr_sophie',
  email: 'sophie.marchand@aime.fr',
  name: 'Sophie Marchand',
  avatar: '/images/avatars/sophie.jpg',
  qr_code: 'AIME-742-PLM',
  bio: 'Future mariée · J-309. Je collectionne les instants avant qu’ils ne deviennent des souvenirs.',
  universes: ['mariage'],
  created_at: '2026-06-14T10:24:00+02:00',
};

export const SEED_FOLDER: Folder = {
  id: 'fld_mariage',
  user_id: 'usr_sophie',
  type: 'mariage',
  name: 'Mariage de Sophie & Lucas',
  metadata: {
    date: '2027-06-15T15:00:00+02:00',
    lieu: 'Château des Bruyères · Vallée de Chevreuse',
    guests: 89,
    currency: 'EUR',
  },
  created_at: '2026-06-14T10:26:00+02:00',
};

export const SEED_CAPSULE: Capsule = {
  id: 'cap_jourj',
  folder_id: 'fld_mariage',
  name: 'Notre Jour J',
  code: 'AIME-742-PLM',
  status: 'collecting',
  sealed_at: null,
  created_at: '2026-06-20T18:02:00+02:00',
};

const A = (name: string) => `/images/avatars/${name}.jpg`;

export const SEED_CONTACTS: Contact[] = [
  { id: 'ct_lucas', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'marie', name: 'Lucas Berger', detail: 'Le marié', avatar: A('lucas') },
  { id: 'ct_marie', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'temoin', name: 'Marie Lambert', detail: 'Témoin de Sophie', avatar: A('marie') },
  { id: 'ct_hugo', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'temoin', name: 'Hugo Petit', detail: 'Témoin de Lucas', avatar: A('hugo') },
  { id: 'ct_ines', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'prestataire', name: 'Inès Rodier', detail: 'Photographe — Studio Brume', avatar: A('ines') },
  { id: 'ct_alex', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'prestataire', name: 'Alex Vasseur', detail: 'DJ — Waves Events', avatar: A('alex') },
  { id: 'ct_traiteur', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'prestataire', name: 'Maison Lefèvre', detail: 'Traiteur — menu dégustation', avatar: null },
  { id: 'ct_fleurs', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'prestataire', name: 'Atelier Pivoine', detail: 'Fleuriste — arche & tables', avatar: null },
  { id: 'ct_mamie', user_id: 'usr_sophie', folder_id: 'fld_mariage', role: 'famille', name: 'Colette Marchand', detail: 'Grand-mère de Sophie', avatar: null },
];

export const SEED_BUDGET: BudgetItem[] = [
  { id: 'bg_lieu', folder_id: 'fld_mariage', category: 'Lieu de réception', vendor: 'Château des Bruyères', amount: 6900, paid: 6900 },
  { id: 'bg_traiteur', folder_id: 'fld_mariage', category: 'Traiteur', vendor: 'Maison Lefèvre', amount: 8450, paid: 3000 },
  { id: 'bg_photo', folder_id: 'fld_mariage', category: 'Photo & capsule', vendor: 'Studio Brume', amount: 2400, paid: 800 },
  { id: 'bg_dj', folder_id: 'fld_mariage', category: 'DJ & sono', vendor: 'Waves Events', amount: 1250, paid: 1250 },
  { id: 'bg_robe', folder_id: 'fld_mariage', category: 'Robe & costume', amount: 2600, paid: 900 },
  { id: 'bg_fleurs', folder_id: 'fld_mariage', category: 'Fleurs & déco', vendor: 'Atelier Pivoine', amount: 1650, paid: 0 },
  { id: 'bg_alliances', folder_id: 'fld_mariage', category: 'Alliances', amount: 1180, paid: 590 },
  { id: 'bg_fairepart', folder_id: 'fld_mariage', category: 'Faire-part & papeterie', amount: 420, paid: 420 },
];

export const SEED_AGENDA: AgendaEvent[] = [
  { id: 'ag_1', folder_id: 'fld_mariage', title: 'Réserver le château', date: '2026-06-15T10:00:00+02:00', type: 'jalon', done: true },
  { id: 'ag_2', folder_id: 'fld_mariage', title: 'Valider le traiteur', date: '2026-09-20T11:00:00+02:00', type: 'jalon', done: true },
  { id: 'ag_3', folder_id: 'fld_mariage', title: 'Envoyer les faire-part', date: '2026-12-01T09:00:00+01:00', type: 'jalon', done: false },
  { id: 'ag_4', folder_id: 'fld_mariage', title: 'Dégustation du menu', date: '2027-01-18T12:30:00+01:00', type: 'rdv', done: false },
  { id: 'ag_5', folder_id: 'fld_mariage', title: 'Second essayage robe', date: '2027-03-07T15:00:00+01:00', type: 'rdv', done: false },
  { id: 'ag_6', folder_id: 'fld_mariage', title: 'Confirmer les invités (RSVP)', date: '2027-05-15T18:00:00+02:00', type: 'jalon', done: false },
  { id: 'ag_7', folder_id: 'fld_mariage', title: 'Répétition générale', date: '2027-06-14T17:00:00+02:00', type: 'rdv', done: false },
  { id: 'ag_8', folder_id: 'fld_mariage', title: 'Jour J — 15 juin 2027', date: '2027-06-15T15:00:00+02:00', type: 'jour-j', done: false },
];

export const SEED_TASKS: Task[] = [
  { id: 'tk_1', folder_id: 'fld_mariage', title: 'Choisir l’option végétarienne du menu', done: false, assigned_to: 'Sophie' },
  { id: 'tk_2', folder_id: 'fld_mariage', title: 'Envoyer la playlist « dîner » à Alex', done: true, assigned_to: 'Lucas' },
  { id: 'tk_3', folder_id: 'fld_mariage', title: 'Réserver la navette gare ↔ château', done: false, assigned_to: 'Lucas' },
  { id: 'tk_4', folder_id: 'fld_mariage', title: 'Rédiger le discours des témoins', done: false, assigned_to: 'Marie' },
  { id: 'tk_5', folder_id: 'fld_mariage', title: 'Commander les faire-part (89 ex.)', done: true, assigned_to: 'Sophie' },
  { id: 'tk_6', folder_id: 'fld_mariage', title: 'Partager le QR AIME-742-PLM aux invités', done: false, assigned_to: 'Sophie' },
  { id: 'tk_7', folder_id: 'fld_mariage', title: 'Prévoir le plan B cérémonie (pluie)', done: false, assigned_to: 'Marie' },
];

export const SEED_MESSAGES: Message[] = [
  { id: 'ms_1', sender_id: 'ct_marie', receiver_id: 'usr_sophie', content: 'Sophie !! J’ai trouvé l’endroit parfait pour ton EVJF 🌿', created_at: '2026-08-08T18:42:00+02:00' },
  { id: 'ms_2', sender_id: 'usr_sophie', receiver_id: 'ct_marie', content: 'Raconte tout 👀', created_at: '2026-08-08T18:44:00+02:00' },
  { id: 'ms_3', sender_id: 'ct_marie', receiver_id: 'usr_sophie', content: 'Une maison avec piscine à 40 min. Je t’envoie le lien ce soir.', created_at: '2026-08-08T18:46:00+02:00' },
  { id: 'ms_4', sender_id: 'ct_ines', receiver_id: 'usr_sophie', content: 'Bonjour Sophie ! J’ai repéré le château hier, la lumière à 19h est incroyable. Je vous propose une séance couple à l’heure dorée.', created_at: '2026-08-07T11:12:00+02:00' },
  { id: 'ms_5', sender_id: 'usr_sophie', receiver_id: 'ct_ines', content: 'On adore l’idée ! On bloque 20 min avant le dîner alors.', created_at: '2026-08-07T12:03:00+02:00' },
  { id: 'ms_6', sender_id: 'ct_alex', receiver_id: 'usr_sophie', content: 'Playlist dîner bien reçue 🎧 Je vous prépare une entrée sur mesure pour l’ouverture de bal.', created_at: '2026-08-05T20:31:00+02:00' },
];

export const SEED_CLIPS: Clip[] = [
  {
    id: 'cl_1', capsule_id: 'cap_jourj', user_id: 'ct_hugo', author_name: 'Hugo',
    author_avatar: A('hugo'), video_url: null, poster: '/images/clips/clip-sparkler.jpg',
    caption: 'Test des cierges magiques pour la sortie ✨', duration: 9, likes: 24,
    created_at: '2026-07-30T21:14:00+02:00',
  },
  {
    id: 'cl_2', capsule_id: 'cap_jourj', user_id: 'ct_marie', author_name: 'Marie',
    author_avatar: A('marie'), video_url: null, poster: '/images/clips/clip-dance.jpg',
    caption: 'Répétition de l’ouverture de bal (ils sont pas prêts 😄)', duration: 10, likes: 41,
    created_at: '2026-07-22T16:03:00+02:00',
  },
  {
    id: 'cl_3', capsule_id: 'cap_jourj', user_id: 'usr_sophie', author_name: 'Sophie',
    author_avatar: A('sophie'), video_url: null, poster: '/images/clips/clip-table.jpg',
    caption: 'Premier essai de table au château. On valide ?', duration: 8, likes: 33,
    created_at: '2026-07-11T13:37:00+02:00',
  },
  {
    id: 'cl_4', capsule_id: 'cap_jourj', user_id: 'ct_lucas', author_name: 'Lucas',
    author_avatar: A('lucas'), video_url: null, poster: '/images/clips/clip-sparkler.jpg',
    caption: 'Visite du domaine avec les témoins. J-324.', duration: 10, likes: 18,
    created_at: '2026-07-26T11:20:00+02:00',
  },
  {
    id: 'cl_5', capsule_id: 'cap_jourj', user_id: 'ct_ines', author_name: 'Inès · Studio Brume',
    author_avatar: A('ines'), video_url: null, poster: '/images/clips/clip-dance.jpg',
    caption: 'Repérage lumière dorée — c’est ici pour la séance couple 📸', duration: 7, likes: 52,
    created_at: '2026-08-02T19:52:00+02:00',
  },
  {
    id: 'cl_6', capsule_id: 'cap_jourj', user_id: 'ct_alex', author_name: 'Alex · DJ',
    author_avatar: A('alex'), video_url: null, poster: '/images/clips/clip-table.jpg',
    caption: 'La sono est calibrée pour la cour d’honneur 🔊', duration: 6, likes: 12,
    created_at: '2026-08-04T15:26:00+02:00',
  },
];

export const SEED_REGISTRE: PublicProfile[] = [
  { id: 'pp_1', name: 'Sophie Marchand', role: 'Mariée · Organisatrice', bio: 'Je scelle notre 15 juin 2027, un clip à la fois.', avatar: A('sophie'), qr_code: 'AIME-742-PLM', universes: ['mariage'], capsules_count: 2, city: 'Paris 11e', joined: 'Juin 2026' },
  { id: 'pp_2', name: 'Lucas Berger', role: 'Marié', bio: 'Témoin de l’aventure. Gardien de la playlist.', avatar: A('lucas'), qr_code: 'AIME-305-KQZ', universes: ['mariage', 'odyssee'], capsules_count: 1, city: 'Paris 11e', joined: 'Juin 2026' },
  { id: 'pp_3', name: 'Marie Lambert', role: 'Témoin', bio: 'Celle qui pleure avant tout le monde.', avatar: A('marie'), qr_code: 'AIME-918-TDC', universes: ['mariage', 'amitie'], capsules_count: 3, city: 'Lyon', joined: 'Juillet 2026' },
  { id: 'pp_4', name: 'Hugo Petit', role: 'Témoin', bio: 'Discours en préparation depuis 2024.', avatar: A('hugo'), qr_code: 'AIME-674-BVN', universes: ['mariage'], capsules_count: 1, city: 'Versailles', joined: 'Juillet 2026' },
  { id: 'pp_5', name: 'Inès Rodier', role: 'Photographe — Studio Brume', bio: 'Je chasse la lumière dorée, ETERNITY la garde.', avatar: A('ines'), qr_code: 'AIME-221-XRP', universes: ['mariage', 'chantier'], capsules_count: 7, city: 'Rambouillet', joined: 'Mars 2026' },
  { id: 'pp_6', name: 'Alex Vasseur', role: 'DJ — Waves Events', bio: 'Chaque soirée mérite sa bande-son éternelle.', avatar: A('alex'), qr_code: 'AIME-556-DJK', universes: ['mariage', 'anniversaire'], capsules_count: 5, city: 'Paris 18e', joined: 'Janvier 2026' },
  { id: 'pp_7', name: 'Camille & Théo', role: 'Jeunes parents', bio: 'La première année de Léon, scellée jour après jour.', avatar: null, qr_code: 'AIME-830-BBN', universes: ['naissance'], capsules_count: 4, city: 'Bordeaux', joined: 'Février 2026' },
  { id: 'pp_8', name: 'Nadia Cherif', role: 'Promo 2026 — HEC', bio: 'Capsule de promo : ouverture en 2036.', avatar: null, qr_code: 'AIME-147-HEC', universes: ['diplome'], capsules_count: 1, city: 'Jouy-en-Josas', joined: 'Mai 2026' },
  { id: 'pp_9', name: 'Famille Aubert', role: 'En mémoire de Jean', bio: 'Ses histoires, racontées par ceux qui l’aiment.', avatar: null, qr_code: 'AIME-062-MRT', universes: ['in-memoriam'], capsules_count: 2, city: 'Nantes', joined: 'Avril 2026' },
  { id: 'pp_10', name: 'Atelier Morn', role: 'Architecte — Réhabilitation', bio: 'La grange de 1832, du premier coup de pioche à la remise des clés.', avatar: null, qr_code: 'AIME-413-GRG', universes: ['chantier'], capsules_count: 6, city: 'Annecy', joined: 'Janvier 2026' },
  { id: 'pp_11', name: 'Sara El Idrissi', role: 'Tour du monde à voile', bio: '14 mois, 23 escales, une capsule par océan.', avatar: null, qr_code: 'AIME-790-SLS', universes: ['odyssee'], capsules_count: 9, city: 'En mer', joined: 'Décembre 2025' },
  { id: 'pp_12', name: 'Les copines de la rue des Rosiers', role: '30 ans d’amitié', bio: 'On ouvre la capsule de nos 60 ans. Patiente encore 12 ans.', avatar: null, qr_code: 'AIME-265-BFF', universes: ['amitie', 'anniversaire'], capsules_count: 3, city: 'Paris 4e', joined: 'Juin 2026' },
];

/** Invités ayant déjà scanné le QR (compteur Jour J) */
export const GUESTS_SCANNED = 61;
export const GUESTS_TOTAL = 89;

export const ROLE_LABEL: Record<string, string> = {
  marie: 'Marié·e',
  temoin: 'Témoin',
  invite: 'Invité',
  prestataire: 'Prestataire',
  famille: 'Famille',
};
