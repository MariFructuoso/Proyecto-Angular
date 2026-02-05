import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, minLength, required, validate } from "@angular/forms/signals";
import { EncodeBase64Directive } from '../../shared/directives/encode-base64-directive'; // ¡Asegúrate de tener esto!
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service'; // <--- CORRECCIÓN 1
import { UserRegister } from '../../auth/interface/user'; // <--- CORRECCIÓN 1 (Ajusta la ruta si es necesario)

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [FormField, EncodeBase64Directive],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grow flex items-center justify-center'
  },
})
export class RegisterPage {
  #router = inject(Router); 
  #destroyRef = inject(DestroyRef);
  #authService = inject(AuthService);

  newRegister = signal({
    name:'',
    email:'',
    emailConfirm:'',
    password:'',
    passwordConfirm:'',
    avatar:''
  });

  newRegisterForm=form(this.newRegister, (schema) =>{
    required(schema.name,{message: 'You must enter a name'})
    required(schema.email,{message: 'You must enter a email'})
    required(schema.emailConfirm,{message: 'You must enter a email'})
    required(schema.password,{message: 'You must enter a password'})
    required(schema.passwordConfirm,{message: 'You must repeat the password'})
    required(schema.avatar,{message: 'You must enter an imagen'})
    email(schema.email,{message: 'Format invalid'})
    email(schema.emailConfirm,{message: 'Format invalid'})
    minLength(schema.password, 4, {message: 'Password must be greater than 4'})
    minLength(schema.passwordConfirm, 4, {message: 'Password must be greater than 4'})
    //validar contraseñas coinciden
    validate(schema.passwordConfirm, ({value, valueOf}) => {
      const password = valueOf(schema.password);// Creamos dependencia con este valor
      if(value() !== password) {
        return {
          kind: 'samePassword',
          message: 'Passwords are not equal'
        }
      }
      return null;
    })
    //Validar emails coinciden
    validate(schema.emailConfirm, ({value, valueOf}) => {
      const email = valueOf(schema.email);
      if(value() !== email) {
        return {
          kind: 'sameEmail',
          message: 'Email are not equal'
        }
      }
      return null;
    })
  });

  //Validad que sea una imagen
    avatarControl = form(signal(''), field => {
    required(field, { message: 'You must choose an image file' });
  });
  
  register(event: Event) {
  event.preventDefault(); 
  if (this.newRegisterForm().valid()) {
    const formValues = this.newRegister();
    const userToSend: UserRegister = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        avatar: formValues.avatar
      };
    this.#authService.register(userToSend)
      .pipe(takeUntilDestroyed(this.#destroyRef)) 
      .subscribe({
        next: () => {
          console.log('Usuario registrado correctamente');
          this.#router.navigate(['/auth/login']); 
        },
        error: (err) => {
          console.error('Error en el registro', err);
        }
      });
  }
}
}


