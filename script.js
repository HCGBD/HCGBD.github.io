var map; // carte 
var markerLayer ; // Couche de marqueurs


if (!map) {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

}
else{
    map.setView([0, 0], 2);
  
}



function rechercherImages() {
    const apiKey = 'a32778dd3880d798d48e2eefe590f50a'; 
    const termesRecherche = document.getElementById('searchInput').value;

    if(termesRecherche ==''){
      alert("Le champ de recherche ne dois pas être vide !! ");
    }

    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${termesRecherche}&format=json&nojsoncallback=1&extras=geo,url_o`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayImages(data.photos.photo);

        })
        .catch(error => console.error('Erreur lors de la requête API Flickr:', error));

     const selectedImageContainer2 = document.getElementById('selected-image-container');
     selectedImageContainer2.innerHTML = '';
}

function displayImages(photos) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';

        // Supprimer tous les marqueurs existants
        if (markerLayer) {
            map.removeLayer(markerLayer);
        }
    
        // Créer une nouvelle couche de marqueurs
        markerLayer = L.layerGroup().addTo(map);

    photos.forEach(photo => {
        const imageUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
        const imageItem = document.createElement('img');
        imageItem.src = imageUrl;
        imageItem.alt = photo.title;
        imageItem.style.width = '90px';
        imageItem.style.height = '60px';
        const latitude = photo.latitude || 'Non disponible';
        const longitude = photo.longitude || 'Non disponible';

        imageItem.addEventListener('click', () => {
            displaySelectedImage(imageUrl, photo.title,latitude,longitude);
           carte(longitude,latitude, imageUrl,photo.title);
        });

         imageContainer.appendChild(imageItem);

         marqueur(longitude,latitude, imageUrl, photo.title);
        
    });
}


function displaySelectedImage(src, title,latitude,longitude) {
    const selectedImageContainer = document.getElementById('selected-image-container');
    const selectedImageItem = document.createElement('div');
    selectedImageItem.innerHTML = `
        <img src="${src}" alt="${title}">
        <p><strong>Titre:</strong> ${title}</p>
        <p><strong>Latitude:</strong> ${latitude}</p>
        <p><strong>Longitude:</strong> ${longitude}</p>
    `;
    
    selectedImageContainer.innerHTML = '';
    selectedImageContainer.appendChild(selectedImageItem);

}



function carte(longitude, latitude, imageUrl,Titre) {
    if (latitude == "Non disponible" || longitude == "Non disponible") {
     
        

        if (!map) {
            map = L.map('map').setView([0,0], 1);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([0, 0], 1);
        }
        
    }
    else{

        // Initialiser la nouvelle carte
        if (!map) {
            map = L.map('map').setView([latitude, longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([latitude, longitude], 13);
        }

        // Ajouter un nouveau marqueur à la position spécifiée
        var marker2 = L.marker([latitude, longitude]).addTo(map);
        markerLayer.addLayer(marker2);
    // Ajouter une popup au marqueur avec le contenu HTML de l'image
       marker2.bindPopup(`<br>${Titre}<br><img style="width:150px; heigth:30px" src="${imageUrl}" alt="${Titre}">`).openPopup();
    }
   


}

function marqueur (longitude,latitude,imageUrl,Titre){
    if (latitude == "Non disponible" || longitude == "Non disponible") {

    }
    else{

        var marker = L.marker([latitude, longitude]).addTo(map);
        
        marker.bindPopup(`<br>${Titre}<br><img style="width:100px; heigth:30px" src="${imageUrl}" alt="${Titre}">`).openPopup();
        marker.closePopup();

        markerLayer.addLayer(marker);
    }

}

       