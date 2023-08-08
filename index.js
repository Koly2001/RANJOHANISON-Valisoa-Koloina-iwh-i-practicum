const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-f73f79ce-5d7d-4517-94cd-23d5b9222ed4';
const CUSTOM_OBJECT = 'pets?properties=name,type,age';

// Route GET pour la page d'accueil
app.get('/', async (req, res) => {
  try {
    // Faites une requête GET à l'API HubSpot pour récupérer la liste des Custom Objects
    const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`, {
      headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`
      }
    });
    const customObjects = response.data.results;
    console.log(customObjects[0]);

    res.render('homepage', { customObjects });
  } catch (error) {
    console.error('Erreur lors de la récupération des Custom Objects depuis HubSpot :', error);
    res.render('homepage', { customObjects: [] });
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj/:name?', async (req, res) => {
  const objname = req.params.name;
  let objData = {};

  if (objname) {
    try {
      const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`);

      // Récupérez les Custom Objects à partir de la réponse de l'API
      objData = response.data.results[0];
    } catch (error) {
      console.error('Erreur lors de la récupération de Pets depuis HubSpot :', error);
      // Gérez l'erreur appropriée ici (affichage d'un message d'erreur, etc.)
    }
  }

  res.render('updates', {
    pageTitle: 'Mettre à jour le formulaire de Pets | Integrating With HubSpot I Practicum',
    objData,
  });
});

// ... (les autres parties de votre code restent inchangées)

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
  const formData = { // Assurez-vous que cette propriété est incluse si nécessaire
    Name: req.body.name,
    Type: req.body.type,
    Age: req.body.age,
  };

  try {
    if (formData.name) {
      await axios.patch(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`, formData, {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      await axios.post(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`, formData, {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
        }
      });
    }

    res.redirect('/');
  } catch (error) {
    console.error('Erreur lors de la mise à jour/création de l\'objet personnalisé :', error);
    // Gérez l'erreur appropriée ici (affichage d'un message d'erreur, etc.)
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
