import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '../widget/side-menu/side-menu.component';
import { FooterComponent } from '../widget/footer/footer.component';

@Component({
  selector: 'app-main-dashboard',
  imports: [RouterModule,SideMenuComponent,FooterComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent {

}
