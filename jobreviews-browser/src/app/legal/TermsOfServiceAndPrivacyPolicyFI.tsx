import React from "react";



const TermsOfServiceAndPrivacyPolicyFi = () => (
	<div>
		<h1>Palvelun käyttöehdot</h1>
		<p>
			Käyttämällä tätä palvelua, käyttäjä on hyväksyy palvelun käyttöehdot sekä tietosuojaselosteen. Käyttäjä vastaa siitä, että noudattaa sekä paikallista että kansainvälistä lainsäädäntöä ja on itse vastuussa julkaisemastaan sisällöstä. Palveluntarjoajalla on oikeus milloin tahansa poistaa palvelun sääntöjen tai lakien vastainen sisältö ilmoittamatta siitä julkaisijalle.
		</p>
		<h1>Erimielisyyksien ratkaiseminen</h1>
		<p>
			Mahdolliset erimielisyydet, joita ei saada selvitettyä kahdenvälisesti, ratkaistaan Suomen oikeusasteissa Suomen ja EU:n lakien ja säädösten mukaisesti.
		</p>

		<h1>Tietosuoja</h1>
		<h2>Mitä tietoja tallennetaan</h2>
		Yksityisiä tietoja ovat
		<ul>
			<li>sessiotunniste</li>
			<li>käyttäjätunniste</li>
			<li>google id</li>
			<li>käyttäjänimi</li>
			<li>sähköpostiosoite</li>
			<li>Käyttäjän salasana salattuna</li>
		</ul>
		Julkisia tietoja ovat
		<ul>
			<li>käyttäjän kirjoittamat arvostelut</li>
			<li>käyttäjän lisäämät työpaikat</li>
		</ul>
		<h2>Tietojen säilytys</h2>
		<ul>
			<li>MongoDB Atlas, USA</li>
		</ul>
		<h2>Tietojen siirtäminen asiakkaan ja palveluntarjoajan välillä</h2>
		<p>Kaikki tiedot siirretään end-to-end salattuja kanavia pitkin.</p>
		<h2>Tietojen käsittely</h2>
		<p>
			Yksityisiä tietoja käsittelee vain palveluntarjoaja eikä niitä luovuteta eteen päin kolmansille osapuolille. Palveluntarjoaja voi milloin tahansa sulkea tilin, jos sen epäillään rikkovan tämän palvelun sääntöjä, lakeja tai hyviä tapoja. Käyttäjä voi milloin tahansa pyytää tietojensa poistamista tai oikaisemista.
		</p>
		<p>
			Julkiset tiedot ovat kaikkien palvelun käyttäjien nähtävillä. Käyttäjällä on oikeus poistaa tai oikaista julkaisemiaan arvosteluja. Palveluntarjoajalla on oikeus poistaa tai muokata kaikkea palvelussa julkaistua sisältöä ilman ennakkovaroitusta.
		</p>
	</div>
);



export default TermsOfServiceAndPrivacyPolicyFi;

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