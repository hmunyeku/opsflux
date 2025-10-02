<template>
  <div class="pricing-page">
    <section class="page-header">
      <div class="container">
        <h1>Tarifs</h1>
        <p>Choisissez le plan qui correspond à vos besoins</p>
      </div>
    </section>

    <section class="pricing">
      <div class="container">
        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>Starter</h3>
            <div class="price">Gratuit</div>
            <ul class="features">
              <li>✓ Jusqu'à 5 utilisateurs</li>
              <li>✓ Modules de base</li>
              <li>✓ 1 Go de stockage</li>
              <li>✓ Support communautaire</li>
            </ul>
            <a href="http://72.60.188.156:3001" class="btn btn-outline">Commencer</a>
          </div>

          <div class="pricing-card featured">
            <div class="badge">Populaire</div>
            <h3>Business</h3>
            <div class="price">49€<span>/mois</span></div>
            <ul class="features">
              <li>✓ Utilisateurs illimités</li>
              <li>✓ Tous les modules</li>
              <li>✓ 100 Go de stockage</li>
              <li>✓ Support prioritaire</li>
              <li>✓ IA avancée</li>
            </ul>
            <a href="http://72.60.188.156:3001" class="btn btn-primary">Essayer gratuitement</a>
          </div>

          <div class="pricing-card">
            <h3>Enterprise</h3>
            <div class="price">Sur mesure</div>
            <ul class="features">
              <li>✓ Tout de Business</li>
              <li>✓ Stockage illimité</li>
              <li>✓ Déploiement on-premise</li>
              <li>✓ Support 24/7</li>
              <li>✓ SLA garanti</li>
            </ul>
            <router-link to="/contact" class="btn btn-outline">Nous contacter</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Pricing'
}
</script>
