import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-auth',
  imports: [RouterModule,CommonModule],
  templateUrl: './email-auth.component.html',
  styleUrl: './email-auth.component.css'
})
export class EmailAuthComponent implements OnInit {
  adminid:string = '';
  APIURL = environment.APIURL;
  
constructor(private route: ActivatedRoute,  private http:HttpClient,) {}

  ngOnInit(): void {
    this.adminid = this.route.snapshot.paramMap.get('adminid') || '';
    if(this.adminid){
      this.ConfirmEmailAuthetication(this.adminid);
    }
    
  }



async ConfirmEmailAuthetication(adminid: string) {
    const formData = new FormData();
    formData.append("adminid", adminid);

    this.http.post(this.APIURL + 'email_auth_admin_click_email_confirmation', formData).subscribe({
      next: (response: any) => {
        if (response.message === "Email is authenticated") {
          // alert("Email is authenticated");
        }  
      },
      error: (error) => {
        console.error('Email confirmation failed:', error);
        alert("Server error. Please try again.");
      }
    });
  }
}
