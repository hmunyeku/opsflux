import React, { useState } from 'react';
import {
  ThemeProvider,
  ShellBar,
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
  Label,
  Input,
  Form,
  FormItem,
  MessageStrip
} from '@ui5/webcomponents-react';
import {
  FlexBoxDirection,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  FlexBoxWrap,
  TitleLevel,
  ButtonDesign,
  ValueState,
  BarDesign,
  MessageStripDesign
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-icons/dist/AllIcons.js';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const APP_URL = process.env.REACT_APP_FRONTEND_URL || 'http://72.60.188.156:3001';

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    // Redirection vers l'application
    window.location.href = APP_URL;
  };

  if (showLogin) {
    return (
      <ThemeProvider>
        <FlexBox
          direction={FlexBoxDirection.Column}
          alignItems={FlexBoxAlignItems.Center}
          justifyContent={FlexBoxJustifyContent.Center}
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--sapBackgroundColor) 0%, var(--sapShell_Background) 100%)',
            padding: '2rem'
          }}
        >
          <Card
            header={
              <CardHeader
                titleText="Connexion à OpsFlux"
                avatar={<Icon name="workflow-tasks" style={{ fontSize: '2.5rem', color: 'var(--sapBrandColor)' }} />}
              />
            }
            style={{ width: '420px', maxWidth: '100%' }}
          >
            <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '2rem', gap: '1.5rem' }}>
              <Text style={{ textAlign: 'center', color: 'var(--sapNeutralTextColor)' }}>
                Gérez vos flux métiers en toute simplicité
              </Text>

              {error && (
                <MessageStrip design={MessageStripDesign.Negative} hideCloseButton>
                  {error}
                </MessageStrip>
              )}

              <Form onSubmit={handleLogin}>
                <FormItem label="Email">
                  <Input
                    type="email"
                    placeholder="votre.email@entreprise.fr"
                    value={email}
                    onInput={(e) => setEmail(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </FormItem>
                <FormItem label="Mot de passe">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onInput={(e) => setPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </FormItem>
              </Form>

              <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '1rem', marginTop: '1rem' }}>
                <Button
                  design={ButtonDesign.Emphasized}
                  icon="log"
                  onClick={handleLogin}
                  style={{ width: '100%' }}
                >
                  Se connecter
                </Button>
                <Button
                  design={ButtonDesign.Transparent}
                  onClick={() => setShowLogin(false)}
                  style={{ width: '100%' }}
                >
                  Retour à l'accueil
                </Button>
              </FlexBox>

              <Text style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--sapNeutralTextColor)' }}>
                Pas encore de compte ? Contactez votre administrateur système.
              </Text>
            </FlexBox>
          </Card>
        </FlexBox>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ShellBar
        primaryTitle="OpsFlux"
        secondaryTitle="Gestion Intelligente des Flux Métiers"
        showProductSwitch={false}
        showCoPilot={false}
      >
        <Button design={ButtonDesign.Emphasized} onClick={() => setShowLogin(true)}>
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
          🔄 Automatisez vos processus métiers
        </Badge>
        <Icon name="workflow-tasks" style={{ fontSize: '6rem', color: 'var(--sapBrandColor)', marginBottom: '2rem' }} />
        <Title level={TitleLevel.H1} style={{ marginBottom: '1rem', fontSize: '3.5rem', textAlign: 'center' }}>
          OpsFlux
        </Title>
        <Title level={TitleLevel.H3} style={{ marginBottom: '1rem', fontWeight: 'normal', color: 'var(--sapNeutralTextColor)', textAlign: 'center', maxWidth: '800px' }}>
          Plateforme de gestion et d'automatisation des flux métiers
        </Title>
        <Text style={{ marginBottom: '3rem', fontSize: '1.125rem', textAlign: 'center', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
          Centralisez, automatisez et optimisez tous vos flux opérationnels : données, documents, workflows et processus métiers
        </Text>
        <FlexBox justifyContent={FlexBoxJustifyContent.Center} alignItems={FlexBoxAlignItems.Center} style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <Button design={ButtonDesign.Emphasized} icon="log" onClick={() => setShowLogin(true)}>
            Accéder à la plateforme
          </Button>
          <Button design={ButtonDesign.Transparent} icon="play" onClick={() => document.getElementById('flows')?.scrollIntoView({ behavior: 'smooth' })}>
            Découvrir les flux
          </Button>
        </FlexBox>
      </FlexBox>

      {/* Flows Section */}
      <div id="flows" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '3rem' }}>
          <Badge colorScheme="6" style={{ marginBottom: '1rem' }}>Flux métiers</Badge>
          <Title level={TitleLevel.H2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Gérez tous vos flux en un seul endroit
          </Title>
          <Text style={{ textAlign: 'center', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
            De la capture à l'archivage, suivez et automatisez l'intégralité de vos processus métiers
          </Text>
        </FlexBox>

        <FlexBox wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center} style={{ gap: '2rem' }}>
          {[
            { icon: 'database', title: 'Flux de données', desc: 'Import, export, transformation et synchronisation de données multi-sources', badge: 'ETL', state: ValueState.Success },
            { icon: 'document', title: 'Flux documentaires', desc: 'Gestion électronique de documents, versioning et workflow de validation', badge: 'GED', state: ValueState.Information },
            { icon: 'process', title: 'Flux opérationnels', desc: 'Orchestration des processus métiers avec règles automatisées', badge: 'BPM', state: ValueState.Warning },
            { icon: 'message-information', title: 'Flux de communication', desc: 'Notifications, alertes et échanges inter-systèmes temps réel', badge: 'API', state: ValueState.Success },
            { icon: 'journey-arrive', title: 'Flux logistiques', desc: 'Traçabilité des mouvements, suivi des expéditions et réceptions', badge: 'SCM', state: ValueState.Information },
            { icon: 'money-bills', title: 'Flux financiers', desc: 'Validation des factures, paiements et rapprochements bancaires', badge: 'Finance', state: ValueState.Warning }
          ].map((flow, index) => (
            <Card
              key={index}
              header={
                <CardHeader
                  titleText={flow.title}
                  subtitleText={flow.desc}
                  avatar={<Icon name={flow.icon} style={{ fontSize: '2rem', color: 'var(--sapBrandColor)' }} />}
                  action={<ObjectStatus state={flow.state}>{flow.badge}</ObjectStatus>}
                />
              }
              style={{ width: '360px', minHeight: '180px' }}
            >
            </Card>
          ))}
        </FlexBox>
      </div>

      {/* Modules Section */}
      <div id="modules" style={{ padding: '6rem 2rem', backgroundColor: 'var(--sapBackgroundColor)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '3rem' }}>
            <Badge colorScheme="3" style={{ marginBottom: '1rem' }}>Architecture modulaire</Badge>
            <Title level={TitleLevel.H2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Modules métiers interconnectés
            </Title>
            <Text style={{ textAlign: 'center', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
              Chaque module gère ses propres flux tout en s'intégrant parfaitement avec l'écosystème
            </Text>
          </FlexBox>

          <FlexBox wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center} style={{ gap: '1.5rem' }}>
            {[
              { icon: 'customer-order-entry', title: 'Gestion Commerciale', desc: 'Devis, commandes, facturation et suivi client', status: 'Core' },
              { icon: 'receipt', title: 'Comptabilité', desc: 'Écritures, analytique, reporting et clôtures', status: 'Core' },
              { icon: 'product', title: 'Gestion de Stock', desc: 'Inventaire, mouvements, valorisation et traçabilité', status: 'Core' },
              { icon: 'business-card', title: 'Achats & Fournisseurs', desc: 'Demandes d\'achat, commandes et réceptions', status: 'Core' },
              { icon: 'factory', title: 'Production', desc: 'OF, nomenclatures, gammes et suivi atelier', status: 'Avancé' },
              { icon: 'customer', title: 'CRM', desc: 'Pipeline commercial, contacts et opportunités', status: 'Avancé' },
              { icon: 'Chart-Tree-Map', title: 'Business Intelligence', desc: 'Tableaux de bord, KPI et analyses décisionnelles', status: 'Premium' },
              { icon: 'bot', title: 'IA & Automatisation', desc: 'Workflows intelligents et prédictions métiers', status: 'Premium' }
            ].map((module, index) => (
              <Card
                key={index}
                header={
                  <CardHeader
                    titleText={module.title}
                    subtitleText={module.desc}
                    avatar={<Icon name={module.icon} style={{ fontSize: '2.5rem', color: 'var(--sapBrandColor)' }} />}
                    status={<ObjectStatus state={module.status === 'Core' ? ValueState.Success : module.status === 'Avancé' ? ValueState.Information : ValueState.Warning}>{module.status}</ObjectStatus>}
                  />
                }
                style={{ width: '320px', minHeight: '160px' }}
              >
              </Card>
            ))}
          </FlexBox>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <FlexBox direction={FlexBoxDirection.Column} alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: '3rem' }}>
          <Badge colorScheme="5" style={{ marginBottom: '1rem' }}>Fonctionnalités</Badge>
          <Title level={TitleLevel.H2} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Une plateforme technique moderne
          </Title>
          <Text style={{ textAlign: 'center', maxWidth: '700px', color: 'var(--sapNeutralTextColor)' }}>
            Technologies éprouvées et architecture scalable pour votre croissance
          </Text>
        </FlexBox>

        <FlexBox wrap={FlexBoxWrap.Wrap} justifyContent={FlexBoxJustifyContent.Center} style={{ gap: '2rem' }}>
          {[
            { icon: 'cloud', title: 'API REST complète', desc: 'Architecture 100% API pour intégrations tierces illimitées' },
            { icon: 'shield', title: 'Sécurité avancée', desc: 'Authentification multi-facteurs, audit trail et chiffrement' },
            { icon: 'synchronize', title: 'Temps réel', desc: 'WebSocket, notifications push et synchronisation instantanée' },
            { icon: 'workflow-tasks', title: 'Workflows flexibles', desc: 'Moteur de workflow visuel avec conditions et actions' },
            { icon: 'source-code', title: 'Extensible', desc: 'Hooks système, plugins et développement module custom' },
            { icon: 'history', title: 'Traçabilité', desc: 'Historique complet des modifications et audit trail' }
          ].map((feature, index) => (
            <Card
              key={index}
              header={
                <CardHeader
                  titleText={feature.title}
                  subtitleText={feature.desc}
                  avatar={<Icon name={feature.icon} style={{ fontSize: '2rem', color: 'var(--sapBrandColor)' }} />}
                />
              }
              style={{ width: '360px', minHeight: '160px' }}
            >
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
        <Icon name="connected" style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.9 }} />
        <Title level={TitleLevel.H2} style={{ marginBottom: '1rem', color: 'white' }}>
          Prêt à optimiser vos flux métiers ?
        </Title>
        <Text style={{ marginBottom: '2rem', fontSize: '1.125rem', maxWidth: '600px', opacity: 0.95 }}>
          Centralisez vos opérations et gagnez en efficacité avec OpsFlux
        </Text>
        <Button design={ButtonDesign.Emphasized} icon="log" onClick={() => setShowLogin(true)} style={{ backgroundColor: 'white', color: 'var(--sapBrandColor)' }}>
          Accéder à la plateforme
        </Button>
      </FlexBox>

      {/* Footer */}
      <Bar
        design={BarDesign.Footer}
        startContent={
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
            <Icon name="workflow-tasks" />
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
              Documentation
            </Button>
            <Button design={ButtonDesign.Transparent}>
              Support
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
