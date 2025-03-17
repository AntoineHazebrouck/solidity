# Run UI

```shell
chrome.exe --remote-debugging-port=9222
```

# Processus

1. L'administrateur du vote inscrit une liste blanche d'électeurs identifiés par leur adresse Ethereum.

	- les utilisateurs n'ont pas acces a rien
		```html
			<h2 style="text-align: center;">Voting System</h2>
<p>&nbsp;</p>
<p style="text-align: center;">The administrator is currently defining authorized voters.</p>
<p>&nbsp;</p>
		```
	- l'admin ajoute des electeurs avec leur adresse ethereum
		- il submit

2. L'administrateur du vote démarre la session d'enregistrement des propositions.
Les électeurs inscrits peuvent soumettre leurs propositions pendant que la session d'enregistrement est active.

	- les utilisateurs n'ont pas acces a rien
	- l'administrateur appuie sur "ouvrir la session de proposition"
	- les utilisateurs peuvent se proposer avec un bouton
		- si ils sont deja proposés il peuvent pu

3. L'administrateur du vote clôture la session d'enregistrement des propositions.

	- l'administrateur appuie sur un bouton pour cloturer les propositions

4. L'administrateur du vote lance la session de vote.
5. Les électeurs inscrits votent pour leur proposition favorite.
	- l'administrateur peut terminer le vote
	- les electeur peuvent voter, le dernier proposé cliqué est pris en compte
6. L'administrateur du vote clôture la session de vote.
	- les utilisateurs n'ont pas acces a rien
7. L'administrateur du vote comptabilise les votes.
8. Tout le monde peut vérifier les derniers détails de la proposition gagnante.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
