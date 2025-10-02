<template>
  <div class="contact-page">
    <section class="page-header">
      <div class="container">
        <h1>Contactez-nous</h1>
        <p>Notre équipe est là pour vous accompagner</p>
      </div>
    </section>

    <section class="contact">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <h3>Informations de contact</h3>
            <div class="info-item">
              <strong>📧 Email</strong>
              <p>contact@opsflux.io</p>
            </div>
            <div class="info-item">
              <strong>📱 Téléphone</strong>
              <p>+33 1 23 45 67 89</p>
            </div>
            <div class="info-item">
              <strong>📍 Adresse</strong>
              <p>Paris, France</p>
            </div>
          </div>

          <div class="contact-form">
            <h3>Envoyez-nous un message</h3>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="name">Nom</label>
                <input type="text" id="name" v-model="form.name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="form.email" required>
              </div>
              <div class="form-group">
                <label for="subject">Sujet</label>
                <input type="text" id="subject" v-model="form.subject" required>
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" v-model="form.message" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm() {
      alert('Fonctionnalité à venir - Formulaire de contact')
      console.log('Form submitted:', this.form)
    }
  }
}
</script>
