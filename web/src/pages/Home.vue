<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">OpsFlux - ERP Modulaire Intelligent</h1>
          <p class="hero-subtitle">
            Gérez votre entreprise avec intelligence artificielle et modularité
          </p>
          <div class="hero-buttons">
            <a href="http://72.60.188.156:3001" class="btn btn-primary">Démarrer gratuitement</a>
            <router-link to="/fonctionnalites" class="btn btn-secondary">En savoir plus</router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="features-preview">
      <div class="container">
        <h2>Pourquoi choisir OpsFlux ?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Intelligence Artificielle</h3>
            <p>Assistant IA intégré pour automatiser vos tâches</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🧩</div>
            <h3>Modulaire</h3>
            <p>Activez uniquement les modules dont vous avez besoin</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Sécurisé</h3>
            <p>Vos données protégées avec les meilleurs standards</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Performant</h3>
            <p>Architecture moderne et rapide</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Prêt à transformer votre entreprise ?</h2>
        <a href="http://72.60.188.156:3001" class="btn btn-primary btn-large">Commencer maintenant</a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
