import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { User } from '../../auth/interface/user'; 
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64-directive';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterLink, FormsModule, EncodeBase64Directive, CommonModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  id = input<number>(); 

  user = signal<User | null>(null);
  isMe = signal(false); 
  editMode = signal(false);
  passMode = signal(false);
  
  name = signal('');
  email = signal('');
  password = signal('');
  passwordConfirm = signal('');
  
  #profileService = inject(ProfileService);
  #title = inject(Title);

  ngOnInit() {
    this.#profileService.getProfile(this.id()).subscribe({
      next: (u) => {
        this.user.set(u);
        this.name.set(u.name);
        this.email.set(u.email);
        this.isMe.set(u.me || !this.id()); 
        this.#title.setTitle(`${u.name} - InmoSanvi`);
      },
      error: () => console.error('Error loading profile')
    });
  }

  saveProfile() {
    this.#profileService.saveProfile(this.name(), this.email()).subscribe((u) => {
      this.user.set(u);
      this.editMode.set(false);
    });
  }

  savePassword() {
    if (this.password() !== this.passwordConfirm()) {
      alert("Passwords don't match");
      return;
    }
    this.#profileService.savePassword(this.password()).subscribe(() => {
      this.passMode.set(false);
      this.password.set('');
      this.passwordConfirm.set('');
      alert('Password changed!');
    });
  }

  updateAvatar(base64: string) {
    this.#profileService.saveAvatar(base64).subscribe((u) => {
      this.user.update(current => current ? { ...current, avatar: u.avatar } : null);
    });
  }
}