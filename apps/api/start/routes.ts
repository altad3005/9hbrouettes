import router from '@adonisjs/core/services/router'

const TeamsController = () => import('#controllers/teams_controller')
const InscriptionsController = () => import('#controllers/inscriptions_controller')
const ConfigsController = () => import('#controllers/configs_controller')

router.group(() => {
  // Teams
  router.get('/teams', [TeamsController, 'index'])
  router.post('/teams', [TeamsController, 'store'])
  router.put('/teams/:id', [TeamsController, 'update'])
  router.delete('/teams/:id', [TeamsController, 'destroy'])
  router.post('/teams/:id/increment', [TeamsController, 'increment'])
  router.post('/teams/:id/decrement', [TeamsController, 'decrement'])

  // Inscriptions
  router.get('/inscriptions', [InscriptionsController, 'index'])
  router.post('/inscriptions', [InscriptionsController, 'store'])
  router.get('/inscriptions/export', [InscriptionsController, 'export'])

  // Config
  router.get('/config', [ConfigsController, 'index'])
  router.put('/config', [ConfigsController, 'update'])
}).prefix('/api')
