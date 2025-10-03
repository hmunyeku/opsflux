import React from 'react';
import {
  ThemeProvider,
  ShellBar,
  ShellBarItem,
  Card,
  CardHeader,
  Title,
  Text,
  Button,
  FlexBox,
  Icon,
  Badge,
  ObjectStatus,
  Bar,
  Label
} from '@ui5/webcomponents-react';
import {
  FlexBoxDirection,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  FlexBoxWrap,
  TitleLevel,
  ButtonDesign,
  ValueState,
  BarDesign
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';

function App() {
  const APP_URL = process.env.REACT_APP_FRONTEND_URL || 'http://72.60.188.156:3001';

  return (
    <ThemeProvider>
      <ShellBar
        primaryTitle="OpsFlux"
        secondaryTitle="ERP Modulaire Intelligent"
        logo={<Icon name="business-suite" />}
        showProductSwitch={false}
        showCoPilot={false}
      >
        <ShellBarItem icon="home" text="Accueil" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <ShellBarItem icon="list" text="Fonctionnalités" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} />
        <ShellBarItem icon="puzzle" text="Modules" onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })} />
        <ShellBarItem icon="cart" text="Tarifs" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} />
        <Button design={ButtonDesign.Emphasized} onClick={() => window.location.href = APP_URL}>
          Se connecter
        </Button>
      </ShellBar>

      {/* Hero Section */}
      <FlexBox
        direction={FlexBoxDirection.Column}
        alignItems={FlexBoxAlignItems.Center}
        justifyContent={FlexBoxJustifyContent.Center}
        style={{
          padding: '6rem 2rem',
          minHeight: '70vh',
          background: 'linear-gradient(135deg, var(--sapBackgroundColor) 0%, var(--sapShell_Background) 100%)',
          position: 'relative'
        }}
      >
        <Badge colorScheme="8" style={{ marginBottom: '1rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          🚀 Nouveau: Module IA disponible
        </Badge>
        <Icon name="business-suite" style={{ fontSize: '6rem', color: 'var(--sapBrandColor)', marginBottom: '2rem' }} />
        <Title level={TitleLevel.H1} style={{ marginBottom: '1rem', fontSize: '3.5rem', textAlign: 'center' }}>
          OpsFlux
        </Title>
        <Title level={TitleLevel.H3} style={{ marginBottom: '1rem', fontWeight: 'normal', color: 'var(--sapNeutralTextColor)', textAlign: 'center', maxWidth: '800px' }}>
          Plateforme ERP Modulaire Intelligente propulsée par l'IA
        </Title>
        <Text style={{ marginBottom: '3rem', fontSize: '1.125rem', textAlign: 'center', maxWidth: '600px', color: 'var(--sapNeutralTextColor)' }}>
          Transformez votre entreprise avec une solution complète et moderne qui s'adapte à vos besoins
        </Text>
        <FlexBox justifyContent={FlexBoxJustifyContent.Center} alignItems={FlexBoxAlignItems.Center} style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <Button design={ButtonDesign.Emphasized} icon="log" onClick={() => window.location.href = APP_URL}>
            Démarrer gratuitement
          </Button>
          <Button design={ButtonDesign.Transparent} icon="play" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            Découvrir les fonctionnalités
          </Button>
        </FlexBox>

        {/* Stats */}
        <FlexBox justifyContent={FlexBoxJustifyContent.Center} wrap={FlexBoxWrap.Wrap} style={{ gap: '3rem', marginTop: '4rem' }}>
          <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center}>
            <ObjectStatus state={ValueState.Success} style={{ fontSize: '2rem', fontWeight: 'bold' }}>500+</ObjectStatus>
            <Label>Entreprises actives</Label>
          </FlexBox>
          <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center}>
            <ObjectStatus state={ValueState.Information} style={{ fontSize: '2rem', fontWeight: 'bold' }}>15+</ObjectStatus>
            <Label>Modules disponibles</Label>
          </FlexBox>
          <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center}>
            <ObjectStatus state={ValueState.Warning} style={{ fontSize: '2rem', fontWeight: 'bold' }}>99.9%</ObjectStatus>
            <Label>Disponibilité</Label>
          </FlexBox>
        </FlexBox>
      </FlexBox>

      {/* Features Section */}
      <div id="features" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '3rem' }}>
          <Badge colorScheme="6" style={{ marginBottom: '1rem' }}>Fonctionnalités</Badge>
          <Title level={TitleLevel.H2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Pourquoi choisir OpsFlux ?
          </Title>
          <Text style={{ textAlign: 'center', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
            Une plateforme complète conçue pour répondre à tous les besoins de votre entreprise avec des technologies de pointe
          </Text>
        </FlexBox>

        <FlexBox wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center} style={{ gap: '2rem' }}>
          {[
            { icon: 'bot', title: 'Intelligence Artificielle', desc: 'Assistant IA intégré pour automatiser vos tâches quotidiennes et améliorer la productivité', badge: 'IA', state: ValueState.Success },
            { icon: 'puzzle', title: 'Modulaire', desc: 'Activez uniquement les modules dont vous avez besoin pour une solution sur mesure', badge: 'Flexible', state: ValueState.Information },
            { icon: 'shield', title: 'Sécurisé', desc: 'Vos données protégées avec les meilleurs standards de sécurité (ISO 27001, RGPD)', badge: 'Certifié', state: ValueState.Success },
            { icon: 'performance', title: 'Performant', desc: 'Architecture cloud moderne et rapide pour une expérience utilisateur optimale', badge: 'Rapide', state: ValueState.Warning }
          ].map((feature, index) => (
            <Card
              key={index}
              header={
                <CardHeader
                  titleText={feature.title}
                  subtitleText={feature.desc}
                  avatar={<Icon name={feature.icon} style={{ fontSize: '2rem', color: 'var(--sapBrandColor)' }} />}
                  action={<ObjectStatus state={feature.state}>{feature.badge}</ObjectStatus>}
                />
              }
              style={{ width: '320px', minHeight: '180px' }}
            >
            </Card>
          ))}
        </FlexBox>
      </div>

      {/* Modules Section */}
      <div id="modules" style={{ padding: '6rem 2rem', backgroundColor: 'var(--sapBackgroundColor)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '3rem' }}>
            <Badge colorScheme="3" style={{ marginBottom: '1rem' }}>Modules</Badge>
            <Title level={TitleLevel.H2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
              15+ Modules métiers disponibles
            </Title>
            <Text style={{ textAlign: 'center', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
              Choisissez parmi notre catalogue de modules professionnels pour construire votre ERP sur mesure
            </Text>
          </FlexBox>

          <FlexBox wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center} style={{ gap: '1.5rem' }}>
            {[
              { icon: 'wallet', title: 'Comptabilité & Finance', desc: 'Gestion complète de la comptabilité, budgets et trésorerie', status: 'Disponible' },
              { icon: 'employee', title: 'Ressources Humaines', desc: 'Gestion des employés, paie, congés et recrutement', status: 'Disponible' },
              { icon: 'product', title: 'Gestion des Stocks', desc: 'Inventaire, warehouse management et traçabilité', status: 'Disponible' },
              { icon: 'sales-order', title: 'Ventes & CRM', desc: 'Pipeline de vente, gestion clients et opportunités', status: 'Disponible' },
              { icon: 'factory', title: 'Production & MRP', desc: 'Planification, ordonnancement et suivi production', status: 'Disponible' },
              { icon: 'chart-table-view', title: 'Business Intelligence', desc: 'Tableaux de bord, reporting et analyses avancées', status: 'Disponible' }
            ].map((module, index) => (
              <Card
                key={index}
                header={
                  <CardHeader
                    titleText={module.title}
                    subtitleText={module.desc}
                    avatar={<Icon name={module.icon} style={{ fontSize: '2.5rem', color: 'var(--sapBrandColor)' }} />}
                    status={<ObjectStatus state={ValueState.Success}>{module.status}</ObjectStatus>}
                  />
                }
                style={{ width: '380px', minHeight: '160px' }}
              >
              </Card>
            ))}
          </FlexBox>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '3rem' }}>
          <Badge colorScheme="5" style={{ marginBottom: '1rem' }}>Tarifs</Badge>
          <Title level={TitleLevel.H2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Tarifs simples et transparents
          </Title>
          <Text style={{ textAlign: 'center', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
            Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
          </Text>
        </FlexBox>

        <FlexBox wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center} style={{ gap: '2rem' }}>
          {[
            { name: 'Starter', price: 'Gratuit', period: 'Pour toujours', features: ['Jusqu\'à 5 utilisateurs', 'Modules de base', '1 Go de stockage', 'Support communautaire'], highlight: false, badge: null },
            { name: 'Business', price: '49€', period: 'par mois', features: ['Utilisateurs illimités', 'Tous les modules', '100 Go de stockage', 'Support prioritaire', 'IA avancée'], highlight: true, badge: 'Populaire' },
            { name: 'Enterprise', price: 'Sur mesure', period: 'Contactez-nous', features: ['Tout de Business', 'Stockage illimité', 'Déploiement on-premise', 'Support 24/7', 'SLA garanti'], highlight: false, badge: 'Premium' }
          ].map((plan, index) => (
            <Card
              key={index}
              style={{
                width: '340px',
                border: plan.highlight ? '2px solid var(--sapBrandColor)' : '1px solid var(--sapGroup_ContentBorderColor)',
                boxShadow: plan.highlight ? '0 8px 24px rgba(0,0,0,0.15)' : undefined
              }}
            >
              <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} style={{ padding: '2rem', textAlign: 'center' }}>
                {plan.badge && (
                  <Badge colorScheme={plan.highlight ? "8" : "6"} style={{ marginBottom: '1rem' }}>
                    {plan.badge}
                  </Badge>
                )}
                <Title level={TitleLevel.H3} style={{ marginBottom: '0.5rem' }}>{plan.name}</Title>
                <Title level={TitleLevel.H2} style={{ color: 'var(--sapBrandColor)', marginBottom: '0.25rem', fontSize: '2.5rem' }}>{plan.price}</Title>
                <Text style={{ marginBottom: '2rem', color: 'var(--sapNeutralTextColor)' }}>{plan.period}</Text>

                <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Start} style={{ gap: '0.75rem', marginBottom: '2rem', width: '100%' }}>
                  {plan.features.map((feature, idx) => (
                    <FlexBox key={idx} alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                      <ObjectStatus state={ValueState.Success} icon="accept"></ObjectStatus>
                      <Text>{feature}</Text>
                    </FlexBox>
                  ))}
                </FlexBox>

                <Button
                  design={plan.highlight ? ButtonDesign.Emphasized : ButtonDesign.Default}
                  style={{ width: '100%' }}
                  icon={plan.name === 'Enterprise' ? 'email' : 'log'}
                  onClick={() => window.location.href = APP_URL}
                >
                  {plan.name === 'Enterprise' ? 'Nous contacter' : 'Commencer'}
                </Button>
              </FlexBox>
            </Card>
          ))}
        </FlexBox>
      </div>

      {/* CTA Section */}
      <FlexBox
        direction={FlexBoxDirection.Column}
        alignItems={FlexBoxAlignItems.Center}
        justifyContent={FlexBoxJustifyContent.Center}
        style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, var(--sapBrandColor) 0%, var(--sapHighlightColor) 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Icon name="rocket" style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.9 }} />
        <Title level={TitleLevel.H2} style={{ marginBottom: '1rem', color: 'white' }}>
          Prêt à transformer votre entreprise ?
        </Title>
        <Text style={{ marginBottom: '2rem', fontSize: '1.125rem', maxWidth: '600px', opacity: 0.95 }}>
          Rejoignez plus de 500 entreprises qui font confiance à OpsFlux pour gérer leurs opérations
        </Text>
        <FlexBox justifyContent={FlexBoxJustifyContent.Center} alignItems={FlexBoxAlignItems.Center} style={{ gap: '1rem' }}>
          <Button design={ButtonDesign.Emphasized} icon="log" onClick={() => window.location.href = APP_URL} style={{ backgroundColor: 'white', color: 'var(--sapBrandColor)' }}>
            Commencer gratuitement
          </Button>
          <Button design={ButtonDesign.Transparent} icon="email" style={{ color: 'white', borderColor: 'white' }}>
            Demander une démo
          </Button>
        </FlexBox>
      </FlexBox>

      {/* Footer */}
      <Bar
        design={BarDesign.Footer}
        startContent={
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
            <Icon name="business-suite" />
            <Label style={{ fontWeight: 'bold' }}>OpsFlux</Label>
            <Label style={{ color: 'var(--sapNeutralTextColor)' }}>v1.0.0</Label>
          </FlexBox>
        }
        middleContent={
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '1.5rem' }}>
            <Button design={ButtonDesign.Transparent} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Accueil
            </Button>
            <Button design={ButtonDesign.Transparent}>
              Mentions légales
            </Button>
            <Button design={ButtonDesign.Transparent}>
              Confidentialité
            </Button>
            <Button design={ButtonDesign.Transparent}>
              Contact
            </Button>
          </FlexBox>
        }
        endContent={
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
            <Label style={{ color: 'var(--sapNeutralTextColor)', fontSize: '0.875rem' }}>
              © 2025 OpsFlux · 3MH-CCAI
            </Label>
          </FlexBox>
        }
        style={{ marginTop: 'auto' }}
      />
    </ThemeProvider>
  );
}

export default App;
