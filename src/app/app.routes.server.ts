import { RenderMode, ServerRoute } from '@angular/ssr';
import { adminIds, memberIds, productIds, staffUserIds } from '../shared/mocks/route-params';

export const serverRoutes: ServerRoute[] = [
  // {
  //   path: 'auth/email-auth/:adminid',
  //   renderMode: RenderMode.Prerender,
  //   async getPrerenderParams() {
  //     return adminIds.map(adminid => ({ adminid }));
  //   }
  // },
  // {
  //   path: 'home/create-members/:memberid',
  //   renderMode: RenderMode.Prerender,
  //   async getPrerenderParams() {
  //     return memberIds.map(memberid => ({ memberid }));
  //   }
  // },
  // {
  //   path: 'home/update-staff-user/:uid/:adminid',
  //   renderMode: RenderMode.Prerender,
  //   async getPrerenderParams() {
  //     return staffUserIds.map(({ uid, adminid }) => ({ uid, adminid }));
  //   }
  // },
  // {
  //   path: 'home/update-shop-item/:productid',
  //   renderMode: RenderMode.Prerender,
  //   async getPrerenderParams() {
  //     return productIds.map(productid => ({ productid }));
  //   }
  // },
  // {
  //   path: 'home/selling-center/:productid',
  //   renderMode: RenderMode.Prerender,
  //   async getPrerenderParams() {
  //     return productIds.map(productid => ({ productid }));
  //   }
  // },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
