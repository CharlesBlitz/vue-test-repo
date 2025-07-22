import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/surveys',
    name: 'Surveys',
    component: () => import('../views/SurveyIndexView.vue'),
    meta: { title: 'Surveys' }
  },
  {
    path: '/surveys/create',
    name: 'CreateSurvey',
    component: () => import('../views/CreateSurveyView.vue'),
    meta: { title: 'Create Survey', requiresManager: true }
  },
  {
    path: '/surveys/:id',
    name: 'TakeSurvey',
    component: () => import('../views/TakeSurveyView.vue'),
    meta: { title: 'Take Survey' }
  },
  {
    path: '/surveys/:id/edit',
    name: 'EditSurvey',
    component: () => import('../views/EditSurveyView.vue'),
    meta: { title: 'Edit Survey', requiresManager: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/AnalyticsView.vue'),
    meta: { title: 'Analytics', requiresManager: true }
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('../views/KnowledgeView.vue'),
    meta: { title: 'Company KB' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _, next) => {
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - ExitKnowledge` : 'ExitKnowledge';
  
  // TODO: Add auth guards and role checks
  next();
});

export default router;