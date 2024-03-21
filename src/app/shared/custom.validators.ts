import { AbstractControl } from "@angular/forms";

export class CustomValidators {
  static emailDomain(domain: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email = control.value;
      const emailDomain = email.substring(email.lastIndexOf("@") + 1);
      if (email === "" || emailDomain.toLowerCase() === domain.toLowerCase())
        return null;
      else return { emailDomain: true };
    };
  }
}
