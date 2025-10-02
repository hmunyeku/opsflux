<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <div class="container">
          <div class="nav-brand">
            <h1>OpsFlux</h1>
          </div>
          <ul class="nav-menu">
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/fonctionnalites">Fonctionnalités</router-link></li>
            <li><router-link to="/tarifs">Tarifs</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
            <li><a href="http://72.60.188.156:3001" class="btn-login">Se connecter</a></li>
          </ul>
        </div>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 OpsFlux - ERP Modulaire Intelligent | 3MH-CCAI</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
