import { RenderMode, ServerRoute } from '@angular/ssr';
import { adminIds, memberIds, productIds, staffUserIds } from '../shared/mocks/route-params';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'home/update-product/:productid/:userid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {

      const productUserCombos = [
        { productid: 'prod1', userid: 'user1' },
        { productid: 'prod2', userid: 'user2' },
      ];
      return productUserCombos;
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];