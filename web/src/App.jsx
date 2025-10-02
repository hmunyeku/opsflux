import React from 'react';
import { ThemeProvider, ShellBar, Card, CardHeader, Title, Text, Button, FlexBox, Icon } from '@ui5/webcomponents-react';

function App() {
  return (
    <ThemeProvider>
      <ShellBar
        primaryTitle="OpsFlux"
        logo={<Icon name="business-suite" />}
      >
        <Button design="Emphasized" onClick={() => window.location.href = 'http://72.60.188.156:3001'}>
          Se connecter
        </Button>
      </ShellBar>

      {/* Hero Section */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--sapBackgroundColor)' }}>
        <Icon name="business-suite" style={{ fontSize: '5rem', color: 'var(--sapBrandColor)', marginBottom: '1.5rem' }} />
        <Title level="H1" style={{ marginBottom: '1rem', fontSize: '3rem' }}>
          OpsFlux
        </Title>
        <Title level="H3" style={{ marginBottom: '2rem', fontWeight: 'normal', color: 'var(--sapNeutralTextColor)' }}>
          ERP Modulaire Intelligent pour votre entreprise
        </Title>
        <FlexBox justifyContent="Center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <Button design="Emphasized" onClick={() => window.location.href = 'http://72.60.188.156:3001'}>
            Démarrer gratuitement
          </Button>
          <Button design="Transparent">
            En savoir plus
          </Button>
        </FlexBox>
      </div>

      {/* Features Section */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level="H2" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Pourquoi choisir OpsFlux ?
        </Title>

        <FlexBox wrap="Wrap" justifyContent="Center" style={{ gap: '2rem' }}>
          {[
            { icon: 'bot', title: 'Intelligence Artificielle', desc: 'Assistant IA intégré pour automatiser vos tâches quotidiennes' },
            { icon: 'puzzle', title: 'Modulaire', desc: 'Activez uniquement les modules dont vous avez besoin' },
            { icon: 'shield', title: 'Sécurisé', desc: 'Vos données protégées avec les meilleurs standards de l\'industrie' },
            { icon: 'performance', title: 'Performant', desc: 'Architecture moderne et rapide pour une expérience optimale' }
          ].map((feature, index) => (
            <Card
              key={index}
              header={
                <CardHeader
                  titleText={feature.title}
                  avatar={<Icon name={feature.icon} />}
                />
              }
              style={{ width: '280px' }}
            >
              <div style={{ padding: '1rem' }}>
                <Text>{feature.desc}</Text>
              </div>
            </Card>
          ))}
        </FlexBox>
      </div>

      {/* Modules Section */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--sapBackgroundColor)', marginTop: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level="H2" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Modules disponibles
          </Title>

          <FlexBox wrap="Wrap" justifyContent="Center" style={{ gap: '1.5rem' }}>
            {[
              { icon: 'wallet', title: 'Comptabilité & Finance', desc: 'Gestion complète de la comptabilité et des finances' },
              { icon: 'employee', title: 'Ressources Humaines', desc: 'Gestion des employés, paie et recrutement' },
              { icon: 'product', title: 'Gestion des Stocks', desc: 'Inventaire et gestion des entrées/sorties' },
              { icon: 'sales-order', title: 'Ventes & CRM', desc: 'Gestion des clients et pipeline de vente' },
              { icon: 'factory', title: 'Production', desc: 'Planification et suivi de la production' },
              { icon: 'chart-table-view', title: 'Reporting', desc: 'Tableaux de bord et analyses avancées' }
            ].map((module, index) => (
              <Card key={index} style={{ width: '360px', textAlign: 'center' }}>
                <div style={{ padding: '2rem' }}>
                  <Icon name={module.icon} style={{ fontSize: '3rem', color: 'var(--sapBrandColor)', marginBottom: '1rem' }} />
                  <Title level="H4" style={{ marginBottom: '0.5rem' }}>{module.title}</Title>
                  <Text style={{ color: 'var(--sapNeutralTextColor)' }}>{module.desc}</Text>
                </div>
              </Card>
            ))}
          </FlexBox>
        </div>
      </div>

      {/* Pricing Section */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level="H2" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Tarifs simples et transparents
        </Title>

        <FlexBox wrap="Wrap" justifyContent="Center" style={{ gap: '2rem' }}>
          {[
            { name: 'Starter', price: 'Gratuit', features: ['Jusqu\'à 5 utilisateurs', 'Modules de base', '1 Go de stockage', 'Support communautaire'], highlight: false },
            { name: 'Business', price: '49€/mois', features: ['Utilisateurs illimités', 'Tous les modules', '100 Go de stockage', 'Support prioritaire', 'IA avancée'], highlight: true },
            { name: 'Enterprise', price: 'Sur mesure', features: ['Tout de Business', 'Stockage illimité', 'Déploiement on-premise', 'Support 24/7', 'SLA garanti'], highlight: false }
          ].map((plan, index) => (
            <Card
              key={index}
              style={{
                width: '320px',
                border: plan.highlight ? '2px solid var(--sapBrandColor)' : undefined
              }}
            >
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                {plan.highlight && (
                  <div style={{
                    backgroundColor: 'var(--sapBrandColor)',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '1rem',
                    display: 'inline-block',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    Populaire
                  </div>
                )}
                <Title level="H3" style={{ marginBottom: '0.5rem' }}>{plan.name}</Title>
                <Title level="H2" style={{ color: 'var(--sapBrandColor)', marginBottom: '2rem' }}>{plan.price}</Title>

                <FlexBox direction="Column" alignItems="Start" style={{ gap: '0.75rem', marginBottom: '2rem' }}>
                  {plan.features.map((feature, idx) => (
                    <FlexBox key={idx} alignItems="Center" style={{ gap: '0.5rem' }}>
                      <Icon name="accept" style={{ color: 'var(--sapPositiveColor)' }} />
                      <Text>{feature}</Text>
                    </FlexBox>
                  ))}
                </FlexBox>

                <Button
                  design={plan.highlight ? 'Emphasized' : 'Default'}
                  style={{ width: '100%' }}
                  onClick={() => window.location.href = 'http://72.60.188.156:3001'}
                >
                  {plan.name === 'Enterprise' ? 'Nous contacter' : 'Commencer'}
                </Button>
              </div>
            </Card>
          ))}
        </FlexBox>
      </div>

      {/* CTA Section */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--sapBackgroundColor)', textAlign: 'center', marginTop: '2rem' }}>
        <Title level="H2" style={{ marginBottom: '1rem' }}>
          Prêt à transformer votre entreprise ?
        </Title>
        <Text style={{ display: 'block', marginBottom: '2rem', fontSize: '1.125rem' }}>
          Rejoignez des centaines d'entreprises qui font confiance à OpsFlux
        </Text>
        <Button design="Emphasized" onClick={() => window.location.href = 'http://72.60.188.156:3001'}>
          Commencer maintenant
        </Button>
      </div>

      {/* Footer */}
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--sapGroup_ContentBorderColor)',
        marginTop: '2rem'
      }}>
        <Text style={{ color: 'var(--sapNeutralTextColor)', fontSize: '0.875rem' }}>
          © 2025 OpsFlux - ERP Modulaire Intelligent · 3MH-CCAI
        </Text>
      </div>
    </ThemeProvider>
  );
}

export default App;
