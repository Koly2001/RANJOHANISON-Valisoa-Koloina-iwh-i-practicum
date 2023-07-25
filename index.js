const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-f73f79ce-5d7d-4517-94cd-23d5b9222ed4';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder

// Route GET pour la page d'accueil
app.get('/', async (req, res) => {
  try {
    // Faites une requête GET à l'API HubSpot pour récupérer la liste des Custom Objects
    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
      headers: {
        Authorization: `Bearer ${'pat-eu1-f73f79ce-5d7d-4517-94cd-23d5b9222ed4'}`
      }
    });

    // Récupérez les Custom Objects à partir de la réponse de l'API
    const customObjects = response.data.results;

    res.render('homepage', { customObjects });
  } catch (error) {
    console.error('Erreur lors de la récupération des Custom Objects depuis HubSpot :', error);
    // Gérez l'erreur appropriée ici (affichage d'un message d'erreur, etc.)
    res.render('homepage', { customObjects: [] }); // En cas d'erreur, envoyez une liste vide
  }
});
  

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj/:name?', async (req, res) => {
    const objName = req.params.name;
    let objData = {};
  
    if (objName) {

      const response = await fetch(`http://localhost:3000/api/custom-objects/${objName}`);
      objData = await response.json();
    }
  
    res.render('updates', {
      pageTitle: 'Mettre à jour le formulaire d\'objet personnalisé | Integrating With HubSpot I Practicum',
      objData,
    });
  });
  

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// Route POST pour la mise à jour/création de l'objet personnalisé
app.post('/update-cobj', async (req, res) => {
    const formData = {
      id: req.body.id,
      Name: req.body.Name,
      Type: req.body.Type,
      Age: req.body.Age,
      // Ajoutez plus de champs si nécessaire
    };
  
    // Votre code pour gérer les données et les requêtes HTTP avec Axios
    try {
      if (formData.id) {
        await axios.patch(`https://api.hubapi.com/crm/v3/objects/contacts/${formData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${'pat-eu1-f73f79ce-5d7d-4517-94cd-23d5b9222ed4'}`,
            'Content-Type': 'application/json'
          }
        });
      } else {

        await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', formData, {
          headers: {
            Authorization: `Bearer ${'pat-eu1-f73f79ce-5d7d-4517-94cd-23d5b9222ed4'}`,
            'Content-Type': 'application/json'
          }
        });
      }
  
      res.redirect('/');
    } catch (error) {
      console.error('Erreur lors de la mise à jour/création de l\'objet personnalisé :', error);
    }
  });
  ;

/** 
* * This is sample code to give you a reference for how you should structure your calls. 



* * App.post sample

*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));