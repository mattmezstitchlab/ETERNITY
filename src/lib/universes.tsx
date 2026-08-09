import {
  Baby,
  Cake,
  Gem,
  GraduationCap,
  Hammer,
  Heart,
  type LucideIcon,
  Sailboat,
  Users,
} from 'lucide-react';
import type { UniverseId } from './types';

export interface Universe {
  id: UniverseId;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  href: string;
  live: boolean;
  image: string; // visuel cinématique de la carte
  accent: string; // gradient css pour la carte
  scenario: {
    title: string;
    steps: string[];
  };
}

export const UNIVERSES: Universe[] = [
  {
    id: 'mariage',
    name: 'Mariage',
    tagline: 'Un jour, 89 regards.',
    description:
      'Chaque invité devient caméraman. Le QR sur les tables, dix secondes chacun, et l’IA monte le film que personne n’aurait pu commander.',
    icon: Gem,
    href: '/mariage',
    image: '/images/universes/mariage.jpg',
    live: true,
    accent: 'from-[#C9A96E]/30 via-[#C9A96E]/5 to-transparent',
    scenario: {
      title: 'Sophie & Lucas — 15 juin 2027',
      steps: [
        'Sophie crée le dossier mariage : rôles, budget, agenda J-365.',
        'Elle partage le QR AIME-742-PLM aux 89 invités.',
        'Le jour J, chacun filme 10 secondes.',
        'La capsule est scellée, le film vit pour toujours.',
      ],
    },
  },
  {
    id: 'naissance',
    name: 'Naissance',
    tagline: 'La première année, jour après jour.',
    description:
      'Un clip par semaine de la grossesse au premier anniversaire. La capsule s’ouvre le jour de ses 18 ans.',
    icon: Baby,
    href: '/naissance',
    image: '/images/universes/naissance.jpg',
    live: false,
    accent: 'from-[#7FB3D5]/25 via-[#7FB3D5]/5 to-transparent',
    scenario: {
      title: 'Léon — né en mars 2027',
      steps: [
        'Camille & Théo ouvrent la capsule « Bienvenue Léon ».',
        'Famille et grands-parents contribuent à distance.',
        '52 clips, un par semaine, horodatés.',
        'Scellement au premier anniversaire. Ouverture en 2045.',
      ],
    },
  },
  {
    id: 'anniversaire',
    name: 'Anniversaire',
    tagline: 'Le rituel qui revient chaque année.',
    description:
      'Une capsule récurrente : chaque année, le même rituel, les mêmes visages qui changent. Le temps devient visible.',
    icon: Cake,
    href: '/anniversaire',
    image: '/images/universes/anniversaire.jpg',
    live: false,
    accent: 'from-[#E8A0BF]/25 via-[#E8A0BF]/5 to-transparent',
    scenario: {
      title: 'Les 40 ans de Jules',
      steps: [
        'Une table, douze amis, un QR posé au centre.',
        'Chacun raconte un souvenir avec Jules en 10 secondes.',
        'La capsule rejoint celles des 30, 35 et 39 ans.',
        'À 80 ans, le film de toute une vie d’amitié existe déjà.',
      ],
    },
  },
  {
    id: 'diplome',
    name: 'Diplôme',
    tagline: 'Une promo, une promesse.',
    description:
      'La promo entière scelle ses ambitions le jour de la remise des diplômes. Ouverture programmée dix ans plus tard.',
    icon: GraduationCap,
    href: '/diplome',
    image: '/images/universes/diplome.jpg',
    live: false,
    accent: 'from-[#8AC926]/20 via-[#8AC926]/5 to-transparent',
    scenario: {
      title: 'Promo 2026 — grande école',
      steps: [
        '214 diplômés scannent le QR dans l’amphithéâtre.',
        'Chacun déclare où il sera dans 10 ans.',
        'La capsule est scellée, horodatée, inviolable.',
        '2036 : notification à tous. La vérité éclate.',
      ],
    },
  },
  {
    id: 'amitie',
    name: 'Amitié',
    tagline: 'Le groupe qui dure.',
    description:
      'Des années de vacances, de soirées et de mariages rassemblées dans une capsule commune. L’album du groupe, en mouvement.',
    icon: Users,
    href: '/amitie',
    image: '/images/universes/amitie.jpg',
    live: false,
    accent: 'from-[#38B6FF]/25 via-[#38B6FF]/5 to-transparent',
    scenario: {
      title: 'Les copines de la rue des Rosiers',
      steps: [
        'Sept amies, 30 ans de souvenirs dispersés sur 9 téléphones.',
        'Chaque événement alimente la même capsule.',
        'Les clips s’alignent chronologiquement, sans effort.',
        'Ouverture collective prévue pour leurs 60 ans.',
      ],
    },
  },
  {
    id: 'in-memoriam',
    name: 'In Memoriam',
    tagline: 'Les histoires restent.',
    description:
      'Ceux qui partent laissent des récits. Famille et amis racontent, la capsule garde les voix et les visages pour les générations suivantes.',
    icon: Heart,
    href: '/in-memoriam',
    image: '/images/universes/in-memoriam.jpg',
    live: false,
    accent: 'from-[#B5179E]/20 via-[#B5179E]/5 to-transparent',
    scenario: {
      title: 'En mémoire de Jean Aubert',
      steps: [
        'La famille ouvre une capsule lors de la cérémonie.',
        '47 proches racontent « leur » Jean en 10 secondes.',
        'Les petits-enfants découvriront sa voix, son rire.',
        'Le film veille, disponible à jamais sur le mini-site.',
      ],
    },
  },
  {
    id: 'chantier',
    name: 'Chantier',
    tagline: 'L’œuvre en train de naître.',
    description:
      'Du premier coup de pioche à la remise des clés : la capsule d’un projet immobilier, d’une rénovation ou d’une création d’entreprise.',
    icon: Hammer,
    href: '/chantier',
    image: '/images/universes/chantier.jpg',
    live: false,
    accent: 'from-[#FF924C]/25 via-[#FF924C]/5 to-transparent',
    scenario: {
      title: 'La grange de 1832 — réhabilitation',
      steps: [
        'L’architecte ouvre la capsule au dépôt du permis.',
        'Artisans et clients filment l’avancement chaque semaine.',
        '18 mois condensés en un film de 4 minutes.',
        'La capsule remise avec les clés, scellée au procès-verbal.',
      ],
    },
  },
  {
    id: 'odyssee',
    name: 'Odyssée',
    tagline: 'Le grand départ.',
    description:
      'Tour du monde, expatriation, tour de France à vélo : la capsule du voyage, alimentée à chaque escale, même hors connexion.',
    icon: Sailboat,
    href: '/odyssee',
    image: '/images/universes/odyssee.jpg',
    live: false,
    accent: 'from-[#41EAD4]/20 via-[#41EAD4]/5 to-transparent',
    scenario: {
      title: 'Sara — 14 mois à la voile',
      steps: [
        'Un QR dans le carré du bateau, un par escale.',
        '23 escales, 23 clips de 10 secondes.',
        'Hors-ligne en mer, synchronisation au port suivant.',
        'Au retour, le film de l’odyssée est déjà monté.',
      ],
    },
  },
];

export function getUniverse(id: UniverseId): Universe {
  return UNIVERSES.find((u) => u.id === id) ?? UNIVERSES[0];
}
