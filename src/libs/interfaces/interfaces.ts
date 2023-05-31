export type Product = {
    _id: string;
    name: string;
    age: number;
    title: string;
    description: string;
    categories: string[];
    images: string[];
    etat: string;
    prix: { fixe: boolean, negociation: boolean };
    conditions: { troc: Boolean, vendre: Boolean };
    valeurMarchande: Number;
    montantNegociation: Number;
    proprietaire: string;
    available: Boolean;
    offres: User[];
    gagnant: User;
    vues: User[];
    likes: User[];
    dislikes: User[];
    comments: User[];
}

export type User = {
    _id: string;
    name: string;
    phone: number;
    email: string;
    password: string;
    image: string;
    adresse: string;
    birthday: string;
    wantRemove: { will: Boolean, date: Date };
    socials: { facebook: object | null, google: object | null }[];
}