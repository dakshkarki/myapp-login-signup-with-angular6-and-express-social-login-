import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { JwtService } from '../../shared/services/jwt.service';

import {
  SocialAuthService,
  GoogleLoginProvider
} from 'ng-social';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  forgotForm: FormGroup;
  loginForm: FormGroup;
  isLoading = false;
  checked = false;
  loginFormSuccessful = false;
  laddaVal = true;
  forgotPass = true;
  forpassDone = false;
  fullName: any;
  name: string;
  display = false;
  firstName: string;
  lastName: string;
  userSocial_id: any;

  constructor(private fb: FormBuilder,
    private authService: AuthService, private router: Router,
    private dataService: DataService, private jwtService: JwtService,
    private socialAuthService: SocialAuthService,
  ) {
    this.loginForm = fb.group({
      'email': ['', [
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9.]+)@([a-zA-Z]+)\.([a-zA-Z]{2,5})$')
      ]],
      'password': ['', [
        Validators.required,
        Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}')
      ]]
    });
    this.forgotForm = fb.group({
      'email': ['', [
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9.]+)@([a-zA-Z]+)\.([a-zA-Z]{2,5})$')
      ]]
    });

  }


  ngOnInit() {


  }

  public socialLogin(platform: string) {
    let socialPlatformProvider;

    socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.socialAuthService.signIn(socialPlatformProvider).then((Data) => {
      console.log("aaaaaaaa"+Data)
      this.name = Data.name;
      this.fullName = this.name.split(' ');
      this.firstName = this.fullName[0];
      this.lastName = this.fullName[this.fullName.length - 1];
      
      console.log(platform + ' login in data : ', Data, Data.email, Data.id, this.firstName,this.lastName);
      this.userSocial_id = Data.id;
      const socialUser = {
        name : Data.name,
         firstname: this.firstName,
        lastname: this.lastName,
        email: Data.email,
        social_id: Data.id,
        provider: Data.provider,
        token :Data.token
      };
      
      this.authService.socialSignIn(socialUser).subscribe(res => {
        
        console.log(res);
        //this.router.navigate(['/users/home']);
        this.jwtService.saveToken(res.token);
          this.jwtService.saveUsername(res.data.firstname);
          this.jwtService.saveJobtitle(res.data.jobtitle);
          this.router.navigate(['/users/home']);

        
        
      }, err => {
        console.error(err);
      });

    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.laddaVal = true;
      this.isLoading = !this.isLoading;

      const user = {
        'email': this.loginForm.value.email,
        'password': this.loginForm.value.password
      };


      this.authService.logIn(user).subscribe(data => {

        console.log(data, "res from api");
        let test = data.data.isverified 
        console.log(test,"isverfied-------------------")
        if (!test) {
          this.loginFormSuccessful = true;
          this.loginForm.reset();
          this.laddaVal = false;
          console.log('user not verified');
        } else {
          this.jwtService.saveToken(data.token);
          this.jwtService.saveUsername(data.data.firstname);
          this.jwtService.saveJobtitle(data.data.jobtitle);
          this.router.navigate(['/users/home']);
         
        }
      },
        err => {
          this.laddaVal = false;
          console.error(err);
        }
      );
    }


  }
  forgotPassword() {
    this.forgotPass = false;
  }
  loginAgain() {
    this.forgotPass = true;
  }

  onSubmit2() {
    if (this.forgotForm.valid) {
      console.log(this.forgotForm.value);
      this.authService.forPass(this.forgotForm.value).subscribe((res) => {
        //console.log("aasss"+this.forgotForm.value);
        this.forpassDone = true;

      }, (err) => { console.log(err); });

    }
  }


}
