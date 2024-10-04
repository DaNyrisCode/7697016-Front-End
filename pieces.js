import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherGraphiqueAvis } from "./avis.js";

//Récupération des pièces eventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem('pieces');

if (pieces === null){
    // Récupération des pièces depuis l'API
    const reponse = await fetch('http://localhost:8081/pieces/');
    pieces = await reponse.json();
    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
}else{
    pieces = JSON.parse(pieces);
}

ajoutListenerEnvoyerAvis()

function genererPieces(pieces){
// Pour parcourir vos données afin de générer autant d’éléments du DOM qu’il y a d’éléments dans vos listes, vous pouvez utiliser la boucle for.
for (let i = 0; i < pieces.length; i++) {

    const article = pieces[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches");
    // Création d’une balise dédiée à une pièce automobile
    const pieceElement = document.createElement("article");
    // Création des balises 
    const imageElement = document.createElement("img");
    imageElement.src = article.image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;

    // l’opérateur ternaire ? permet de tester une condition (si le prix est inférieur à 35€), et de fournir la valeur souhaitée en fonction du résultat de la condition.
    const prixElement = document.createElement("p");
    prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;

    //L’opérateur nullish ?? détectera la valeur undefined et fournira la valeur de substitution (substitution).
    const categorieElement = document.createElement("p");
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";

    // Si la valeur de la dispo est True = "En stock" sinon : "Rupture de Stock"
    const dispoElement = document.createElement("p");
    dispoElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";

    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.textContent = "Afficher les avis";
    
    // On rattache la balise article a la section Fiches
    sectionFiches.appendChild(pieceElement);

    // On rattache l’image à pieceElement (la balise article)
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);

    //Ajout des éléments au DOM pour l'exercice
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(dispoElement);

    pieceElement.appendChild(avisBouton);
};
ajoutListenersAvis();
};

genererPieces(pieces);

const boutonTrier = document.querySelector(".btn-trier");
    boutonTrier.addEventListener("click", () => {
    // Crée une copie de la liste piece. Pour ne pas toucher à l'ordre de base de la liste des pieces.
    const piecesOrdonnees = Array.from(pieces);
    // sort prend deux paramètres qu’il faudra comparer pour dire lequel doit être rangé avant l’autre dans la liste réordonnée finale. Traditionnellement, on nomme ces deux paramètres A et B.
    piecesOrdonnees.sort(function (a, b) {
        // si le nombre est positif, alors B sera rangé avant A ; 
        // si le nombre est négatif, alors A sera rangé avant B ;
        // si le nombre est zéro (0), alors l’ordre sera inchangé.
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");
    boutonFiltrer.addEventListener("click", () => {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonNoDescription = document.querySelector(".btn-nodesc");
    boutonNoDescription.addEventListener("click", () => {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
     });
     document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

// Fonction lambda
const noms = pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
   if(pieces[i].prix > 35){
       noms.splice(i,1)
   }
}
console.log(noms)

const pElement = document.createElement('p')
pElement.innerText = "Pièces abordables";
const abordablesElements = document.createElement('ul');
//Ajout de chaque nom à la liste
for(let i=0; i < noms.length ; i++){
   const nomElement = document.createElement('li');
   nomElement.innerText = noms[i];
   abordablesElements.appendChild(nomElement)
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.abordables')
    .appendChild(pElement)
    .appendChild(abordablesElements)


const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);
   
for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].disponibilite === false){
        nomsDisponibles.splice(i,1);
        prixDisponibles.splice(i,1);
    }
}
   
const disponiblesElement = document.createElement('ul');
   
for(let i=0 ; i < nomsDisponibles.length ; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponiblesElement.appendChild(nomElement);
}
   
const pElementDisponible = document.createElement('p')
pElementDisponible.innerText = "Pièces disponibles:";
document.querySelector('.disponibles').appendChild(pElementDisponible).appendChild(disponiblesElement)

const inputPrixMax = document.querySelector('#prix-max')
inputPrixMax.addEventListener('input', function(){
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);  
})

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
  window.localStorage.removeItem("pieces");
});

await afficherGraphiqueAvis();