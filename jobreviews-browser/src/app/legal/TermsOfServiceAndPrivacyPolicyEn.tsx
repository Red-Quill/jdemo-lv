import React from "react";



const TermsOfServiceAndPrivacyPolicyEn = () => (
	<div>
		<h1>Terms & conditions</h1>
		<p>
			By using this service the user agrees these terms and conditions and accepts the privacy policy. The user must observe both local and international legislation and is responsible for content published by him/her. Service provider has right to remove or edit any content without noticing the publisher. The service provider has right to close an account that violates these rules or good conduct without noticing the user.
		</p>
		<h1>Disputes</h1>
		<p>
			Any disputes that cannot be resolved between service provider and any third party are subject to be resolved in Finnish Court according to Finnish and EU legislation.
		</p>

		<h1>Data protection & privacy</h1>
		<h2>What data is collected</h2>
		Private
		<ul>
			<li>session id</li>
			<li>user id</li>
			<li>google id</li>
			<li>user name</li>
			<li>user email address</li>
			<li>user password</li>
		</ul>
		Public
		<ul>
			<li>reviews</li>
			<li>workplaces</li>
		</ul>
		<h2>How data is stored</h2>
		<p>All public and private user data is stored in MongoDB Atlas database, USA</p>
		<h2>Data transfer</h2>
		<p>Data is transferred between customer and service via end-to-end encrypted connections.</p>
		<h2>Data processing</h2>
		<p>
			Private user data is handled only by the service provider. User can ask for correction or removal of his/her account and personal data.
		</p>
		<p>
			Public data is available to all users and visitors of the service. User has right to correct or remove reviews he has published.
		</p>
	</div>
);



export default TermsOfServiceAndPrivacyPolicyEn;



/*
Ehdot
Sitoudun käyttämään tätä palvelua vain mikäli hyväksyn palvelun ehdot ja tiesotuojakäytännöt.
- joku, "en käytä palvelua, mikäli en ole jonkin seuraavan lainsäädännön piirissä: GDPR, US data protection whatever tai vähintään niitä vastaavan lainsäädännön piirissä"
Seuraavien maiden kansalaiset ja näissä maissa oleskelevat voivat käyttää palvelua:
- EU, Schengen, UK, USA, Mexico, Canada

Tietosuoja- ja rekisteriseloste

Mitä tietoja tallennetaan
- sessiotunniste
- käyttäjänumero
- käyttäjänimi
- sähköpostiosoite
- Google Id numero

- Käyttäjän kirjoittamat arvostelut
- Käyttäjän lisäämät työpaikat

Missä tietoja säilytetään
 - US, MongoDB Atlas

Miten tietoja siirretään
 - Asiakkaalta AWS:lle USA:han käyttäen end-to-end salausta under EU data privacy framework
 - AWS to MongoDB atlas via encrypted channels

Kuinka kauan tietoja säilytetään
- tilin, postauksen, ym poistamisen jälkeen
- muuten??? esim., kun tili on epäaktiivinen

Mihin tietoja käytetään

Miten tiedot suojataan
 - siirretään aina salattujen yhteyksien kautta asiakkaan koneelta tietokantaan

ULKOPUOLISET toimijat adSense, google analytics ... esim. linkki

Asiakkaan oikeudet - standardisetti

Erimielisyyksien ratkaiseminen EU/Suomi oikeuden alla

/// ----
AWS Participates in EU data privacy framework
MongoDB atlas is gdpr compliant

*/